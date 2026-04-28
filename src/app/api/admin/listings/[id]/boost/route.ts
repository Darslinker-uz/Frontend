import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { notifyBoostApproved } from "@/lib/bot-handler";

interface Ctx { params: Promise<{ id: string }> }

// POST /api/admin/listings/:id/boost
// Admin tomonidan e'lonni bepul boost qilish — pending statusini tashlab,
// to'g'ridan-to'g'ri active. Hech kimning balansidan yechilmaydi.
// body: { type: "a_class" | "b_class", daysTotal: number, startAt?: ISOString, note?: string }
export async function POST(request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;

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

  const now = new Date();
  const startDate = body.startAt ? new Date(body.startAt) : now;
  const endDate = new Date(startDate.getTime() + daysTotal * 24 * 60 * 60 * 1000);

  const boost = await prisma.boost.create({
    data: {
      listingId,
      type,
      pricePerDay: 0,
      daysTotal,
      totalPaid: 0,
      startDate,
      endDate,
      status: "active",
      reviewedAt: now,
    },
  });

  // Provider'ga xabar berish (huddi tasdiqlanganday)
  if (listing.user.telegramChatId) {
    notifyBoostApproved({
      teacherChatId: listing.user.telegramChatId,
      listingTitle: listing.title,
      type,
      daysTotal,
    }).catch((e) => console.error("[admin/boost-grant] notify failed", e));
  }

  return NextResponse.json({ boost }, { status: 201 });
}
