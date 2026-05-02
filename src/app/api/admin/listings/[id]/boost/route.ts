import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCurrentUserPermissions } from "@/lib/require-permission";
import { hasPermission } from "@/lib/permissions";
import { notifyBoostApproved } from "@/lib/bot-handler";

interface Ctx { params: Promise<{ id: string }> }

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
      status: isAssistantRequest ? "pending" : "active",
      reviewedAt: isAssistantRequest ? null : now,
    },
  });

  // Admin grant — provider'ga darhol "tasdiqlandi" xabar.
  // Assistant request — provider'ga xabar yubormaymiz (pending, admin tasdiqlamagan).
  if (!isAssistantRequest && listing.user.telegramChatId) {
    notifyBoostApproved({
      teacherChatId: listing.user.telegramChatId,
      listingTitle: listing.title,
      type,
      daysTotal,
    }).catch((e) => console.error("[admin/boost-grant] notify failed", e));
  }

  return NextResponse.json({ boost, pending: isAssistantRequest }, { status: 201 });
}
