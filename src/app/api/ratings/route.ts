import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { normalizePhone } from "@/lib/telegram";

// POST /api/ratings — public rating submit
// Body: { listingId, phone, code, stars, comment? }
// Verifies the Telegram-issued auth code, then upserts rating (one per phone+listing).
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const ipLimit = rateLimit(`rating:ip:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!ipLimit.ok) {
    return NextResponse.json({ error: "Juda ko'p so'rov. Biroz kuting." }, { status: 429 });
  }

  let body: { listingId?: unknown; phone?: unknown; code?: unknown; stars?: unknown; comment?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const listingId = Number(body.listingId);
  const phoneRaw = String(body.phone ?? "").trim();
  const code = String(body.code ?? "").trim();
  const stars = Number(body.stars);
  const comment = body.comment ? String(body.comment).trim().slice(0, 500) : null;

  if (!listingId) {
    return NextResponse.json({ error: "listingId majburiy" }, { status: 400 });
  }
  if (!phoneRaw || phoneRaw.length < 9) {
    return NextResponse.json({ error: "Telefon raqamni to'liq kiriting" }, { status: 400 });
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "6 xonali kod kiriting" }, { status: 400 });
  }
  if (!Number.isFinite(stars) || stars < 1 || stars > 5) {
    return NextResponse.json({ error: "Reyting 1 dan 5 gacha bo'lishi kerak" }, { status: 400 });
  }

  const phone = normalizePhone(phoneRaw);

  const phoneLimit = rateLimit(`rating:phone:${phone}`, { limit: 10, windowMs: 60 * 60_000 });
  if (!phoneLimit.ok) {
    return NextResponse.json({ error: "Bu telefon bilan juda ko'p urinish bo'ldi. Bir soatdan keyin qayta urining." }, { status: 429 });
  }

  // Verify Telegram-issued one-time code
  const authCode = await prisma.authCode.findFirst({
    where: { phone, code, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!authCode) {
    return NextResponse.json({ error: "Kod noto'g'ri yoki muddati tugagan. Yangi kod oling." }, { status: 400 });
  }

  // Listing must exist and be active
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, status: true },
  });
  if (!listing || listing.status !== "active") {
    return NextResponse.json({ error: "E'lon topilmadi yoki faol emas" }, { status: 404 });
  }

  // Mark code as used
  await prisma.authCode.update({
    where: { id: authCode.id },
    data: { usedAt: new Date() },
  });

  // Upsert rating — same phone re-rating overwrites the old value
  const rating = await prisma.rating.upsert({
    where: { listingId_phone: { listingId, phone } },
    create: { listingId, phone, chatId: authCode.chatId, stars: Math.round(stars), comment },
    update: { stars: Math.round(stars), comment, chatId: authCode.chatId },
  });

  return NextResponse.json({ ok: true, rating: { id: rating.id, stars: rating.stars } }, { status: 201 });
}
