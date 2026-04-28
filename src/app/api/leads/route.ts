import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewLead, notifyAdminGroup } from "@/lib/bot-handler";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// POST /api/leads — body: { listingId, name, phone, message? }
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Juda ko'p so'rov. Biroz kuting." }, { status: 429 });
  }

  let body: { listingId?: unknown; name?: unknown; phone?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const listingId = Number(body.listingId);
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const message = body.message ? String(body.message).trim() : null;

  if (!listingId || !name || !phone) {
    return NextResponse.json({ error: "listingId, name, phone majburiy" }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ error: "Ism juda qisqa" }, { status: 400 });
  }
  // Minimal phone validation (UZ): 9-13 raqamdan iborat
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) {
    return NextResponse.json({ error: "Telefon formati noto'g'ri" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      title: true,
      status: true,
      user: { select: { name: true, centerName: true, telegramChatId: true } },
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

  // Lead yaratamiz, keyin bot xabarini yuboramiz. Agar provider'ga xabar
  // yetib bormasa — leadni o'chirib, foydalanuvchidan qayta urinishni so'raymiz.
  // (telegramChatId yo'q bo'lsa — provider bot bilan ulanmagan, leadni saqlaymiz
  // lekin admin guruhga xabar yuboriladi)
  const lead = await prisma.lead.create({
    data: { listingId, name, phone, message, status: "new_lead" },
  });

  let providerOk = true;
  if (listing.user.telegramChatId) {
    providerOk = await notifyNewLead({
      leadId: lead.id,
      teacherChatId: listing.user.telegramChatId,
      studentName: name,
      studentPhone: phone,
      course: listing.title,
      message,
      createdAt: lead.createdAt,
    }).catch(e => {
      console.error("[lead] provider notify failed", e);
      return false;
    });
  }

  // Provider'ga xabar yetib bormagan (lekin telegramChatId mavjud edi) →
  // lead'ni o'chirib, foydalanuvchidan qayta urinishni so'raymiz.
  if (listing.user.telegramChatId && !providerOk) {
    await prisma.lead.delete({ where: { id: lead.id } }).catch(() => {});
    return NextResponse.json(
      { error: "Bot xabari yuborilmadi. Iltimos, qayta urining." },
      { status: 503 }
    );
  }

  // Admin guruhi notify — fire-and-forget (yetib bormasa ham foydalanuvchiga ta'sir qilmaydi)
  notifyAdminGroup({
    centerName: listing.user.centerName ?? listing.user.name,
    course: listing.title,
    studentName: name,
    studentPhone: phone,
    message,
    createdAt: lead.createdAt,
  }).catch(e => console.error("[lead] admin group notify failed", e));

  return NextResponse.json({ lead }, { status: 201 });
}
