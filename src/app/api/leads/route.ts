import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewLead, notifyAdminGroup } from "@/lib/bot-handler";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeStartTiming, sanitizePreferredTimes, sanitizeBudget } from "@/lib/lead-qualify";
import { validateLeadContact } from "@/lib/lead-validation";

// POST /api/leads — body: { listingId, name, phone, message?, startTiming?, preferredTimes?, budget? }
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Juda ko'p so'rov. Biroz kuting." }, { status: 429 });
  }

  let body: {
    listingId?: unknown; name?: unknown; phone?: unknown; message?: unknown;
    startTiming?: unknown; preferredTimes?: unknown; budget?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const listingId = Number(body.listingId);
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const message = body.message ? String(body.message).trim() : null;

  // Kvalifikatsiya javoblari ixtiyoriy. Noto'g'ri/noma'lum kod kelsa jimgina
  // tashlab yuboriladi — ariza baribir saqlanadi (ism + telefon yetarli).
  const startTiming = sanitizeStartTiming(body.startTiming);
  const preferredTimes = sanitizePreferredTimes(body.preferredTimes);
  const budget = sanitizeBudget(body.budget);

  if (!listingId) {
    return NextResponse.json({ error: "listingId majburiy" }, { status: 400 });
  }
  // Formadagi tekshiruv bilan bir xil qoida (src/lib/lead-validation.ts)
  const contactError = validateLeadContact(name, phone);
  if (contactError) {
    return NextResponse.json({ error: contactError }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      title: true,
      status: true,
      listingType: true,
      // groupChatId mavjud bo'lsa lid faqat guruhga yuboriladi (shaxsiy chatga emas).
      user: { select: { name: true, centerName: true, telegramChatId: true, groupChatId: true } },
    },
  });
  if (!listing || listing.status !== "active") {
    return NextResponse.json({ error: "E'lon topilmadi yoki faol emas" }, { status: 404 });
  }

  // Duplicate check: same phone + listing → 409
  const existing = await prisma.lead.findUnique({
    where: { phone_listingId: { phone, listingId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Siz bu kursga avval ariza yuborgansiz" }, { status: 409 });
  }

  // Lead yaratamiz, keyin provider Telegramiga xabar. Xabar yuborilmasa ham lead
  // saqlanadi (o'quvchi uchun 201); admin guruhga xabar alohida yuboriladi.
  // Routing qoidasi (strict isolation):
  //   - user.groupChatId bo'lsa → faqat guruhga (shaxsiy chat tashlanadi)
  //   - aks holda → user.telegramChatId (shaxsiy chat)
  // Har bir user faqat O'Z lid'larini ko'radi — bu lib chaqiruvi user'ning o'z chat'iga jo'natadi.
  const lead = await prisma.lead.create({
    data: { listingId, name, phone, message, status: "new_lead", startTiming, preferredTimes, budget },
  });

  let telegramNotifyFailed = false;
  const targetChatId = listing.user.groupChatId ?? listing.user.telegramChatId;
  if (targetChatId) {
    const providerOk = await notifyNewLead({
      leadId: lead.id,
      teacherChatId: targetChatId,
      studentName: name,
      studentPhone: phone,
      course: listing.title,
      message,
      createdAt: lead.createdAt,
      startTiming, preferredTimes, budget,
    }).catch(e => {
      console.error("[lead] provider notify failed", e);
      return false;
    });
    if (!providerOk) {
      telegramNotifyFailed = true;
      console.error("[lead] Telegram xabar yuborilmadi (chat_id noto'g'ri yoki bot ulanmagan) — lead saqlanadi", {
        leadId: lead.id,
        listingId,
        viaGroup: !!listing.user.groupChatId,
      });
    }
  }

  // Admin guruhi notify — fire-and-forget (yetib bormasa ham foydalanuvchiga ta'sir qilmaydi)
  notifyAdminGroup({
    centerName: listing.user.centerName ?? listing.user.name,
    course: listing.title,
    studentName: name,
    studentPhone: phone,
    message,
    createdAt: lead.createdAt,
    listingType: listing.listingType,
    startTiming, preferredTimes, budget,
  }).catch(e => console.error("[lead] admin group notify failed", e));

  return NextResponse.json(
    { lead, ...(telegramNotifyFailed ? { telegramNotifyFailed: true as const } : {}) },
    { status: 201 }
  );
}
