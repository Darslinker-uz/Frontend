import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCurrentUserPermissions } from "@/lib/require-permission";
import { hasPermission } from "@/lib/permissions";
import { notifyBoostApproved } from "@/lib/bot-handler";
import { randomUUID } from "crypto";

interface Ctx { params: Promise<{ id: string }> }

const CAPS = { a_class: 10, b_class: 12 } as const;
function dayStart(d: Date): Date { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function addDays(d: Date, n: number): Date { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function dayKey(d: Date): string { return d.toISOString().split("T")[0]; }

// POST /api/admin/listings/:id/boost
// Admin: e'lonni bepul boost qilish — darhol active, balansdan yechilmaydi
// Assistant: boost so'rovi yuborish — status=pending, admin keyinchalik tasdiqlaydi
// body: { type: "a_class" | "b_class", daysTotal: number, startAt?: ISOString }
export async function POST(request: Request, { params }: Ctx) {
  // Auth + permission tekshiruvi
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ctx = await getCurrentUserPermissions();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Admin → bepul grant; Assistant → boost.request bo'lsa pending; aks holda 403
  let isAssistantRequest = false;
  if (ctx.role === "admin") {
    // OK — bepul grant
  } else if (ctx.role === "assistant" && hasPermission(ctx.permissions, "boost.request")) {
    isAssistantRequest = true;
  } else {
    return NextResponse.json({ error: "Bu amalga ruxsat yo'q" }, { status: 403 });
  }

  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) return NextResponse.json({ error: "Invalid listing id" }, { status: 400 });

  let body: { type?: string; daysTotal?: number; startAt?: string; note?: string };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = body.type === "a_class" || body.type === "b_class" ? body.type : null;
  const daysTotal = Number(body.daysTotal);
  if (!type) return NextResponse.json({ error: "Boost turi noto'g'ri" }, { status: 400 });
  if (!daysTotal || daysTotal < 1 || daysTotal > 30) {
    return NextResponse.json({ error: "Kun 1-30 oraliqda bo'lishi kerak" }, { status: 400 });
  }
  if (!body.startAt) return NextResponse.json({ error: "Boshlanish kunini tanlang" }, { status: 400 });

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true, status: true, title: true,
      user: { select: { id: true, telegramChatId: true } },
    },
  });
  if (!listing) return NextResponse.json({ error: "E'lon topilmadi" }, { status: 404 });
  if (listing.status !== "active") {
    return NextResponse.json({ error: "Faqat aktiv e'lonni boost qilish mumkin" }, { status: 400 });
  }

  // Boshlanish kuni — ertangidan oldin bo'lmasligi kerak (markaz flow bilan bir xil)
  const tomorrow = addDays(dayStart(new Date()), 1);
  const requestedStart = dayStart(new Date(body.startAt));
  if (requestedStart < tomorrow) {
    return NextResponse.json({ error: "Bugun yoki o'tgan kun bron qilib bo'lmaydi. Eng kami ertaga." }, { status: 400 });
  }
  if (requestedStart >= addDays(tomorrow, 30)) {
    return NextResponse.json({ error: "Eng ko'pi 30 kun ichida bron qilish mumkin" }, { status: 400 });
  }

  // Tanlangan kunlar diapazoni
  const requestedDays: Date[] = [];
  for (let i = 0; i < daysTotal; i++) {
    requestedDays.push(addDays(requestedStart, i));
  }
  const lastDay = requestedDays[requestedDays.length - 1];
  const rangeEnd = addDays(lastDay, 1);
  const cap = CAPS[type];

  // Transaction: cap tekshirish + multiple Boost yaratish (band kunlar o'tkazib yuboriladi)
  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.boost.findMany({
      where: {
        type,
        status: { in: ["active", "pending"] },
        startDate: { lt: rangeEnd },
        endDate: { gte: requestedStart },
      },
      select: { startDate: true, endDate: true },
    });

    const bookedDays: Date[] = [];
    const skippedDays: Date[] = [];
    for (const day of requestedDays) {
      const dayEnd = addDays(day, 1);
      const count = existing.filter(b => b.startDate < dayEnd && b.endDate > day).length;
      if (count < cap) bookedDays.push(day);
      else skippedDays.push(day);
    }

    if (bookedDays.length === 0) {
      return { ok: false as const, error: "Tanlangan kunlarning hammasi band. Boshqa muddat tanlang.", status: 409 };
    }

    // Kontiguy diapazonlar
    const bundleId = randomUUID();
    const segments: Array<[Date, Date]> = [];
    for (const day of bookedDays) {
      const last = segments[segments.length - 1];
      if (last && last[1].getTime() + 86_400_000 === day.getTime()) last[1] = day;
      else segments.push([day, day]);
    }

    const created: { id: number; startDate: Date; endDate: Date }[] = [];
    const reviewedAt = isAssistantRequest ? null : new Date();
    const status = isAssistantRequest ? "pending" : "active";
    for (const [start, last] of segments) {
      const segDays = Math.round((last.getTime() - start.getTime()) / 86_400_000) + 1;
      const endDate = addDays(last, 1);
      const b = await tx.boost.create({
        data: {
          listingId,
          type,
          pricePerDay: 0,
          daysTotal: segDays,
          totalPaid: 0,
          startDate: start,
          endDate,
          status,
          reviewedAt,
          bundleId,
        },
      });
      created.push({ id: b.id, startDate: b.startDate, endDate: b.endDate });
    }

    return {
      ok: true as const,
      boosts: created,
      bookedDays: bookedDays.map(dayKey),
      skippedDays: skippedDays.map(dayKey),
      bundleId,
    };
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // Admin grant — provider'ga "tasdiqlandi" xabar (assistant request — pending, xabar yo'q)
  if (!isAssistantRequest && listing.user.telegramChatId) {
    notifyBoostApproved({
      teacherChatId: listing.user.telegramChatId,
      listingTitle: listing.title,
      type,
      daysTotal: result.bookedDays.length,
    }).catch((e) => console.error("[admin/boost-grant] notify failed", e));
  }

  return NextResponse.json({
    bundleId: result.bundleId,
    bookedDays: result.bookedDays,
    skippedDays: result.skippedDays,
    pending: isAssistantRequest,
    boosts: result.boosts,
  }, { status: 201 });
}
