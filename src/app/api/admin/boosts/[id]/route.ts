import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyBoostApproved, notifyBoostRejected } from "@/lib/bot-handler";

interface Ctx {
  params: Promise<{ id: string }>;
}

// PATCH /api/admin/boosts/:id — admin actions
// body: { action: "approve" | "reject" | "stop" | "resume", reason?: string }
export async function PATCH(request: Request, { params }: Ctx) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const bid = Number(id);
  if (!bid) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const action = body.action;

  const boost = await prisma.boost.findUnique({
    where: { id: bid },
    include: {
      listing: { include: { user: { select: { id: true, name: true, telegramChatId: true } } } },
    },
  });
  if (!boost) return NextResponse.json({ error: "Boost topilmadi" }, { status: 404 });

  if (action === "approve") {
    if (boost.status !== "pending") {
      return NextResponse.json({ error: "Faqat kutilayotgan boost'ni tasdiqlash mumkin" }, { status: 400 });
    }
    const now = new Date();
    const startDate = boost.startDate < now ? now : boost.startDate;
    const endDate = new Date(startDate.getTime() + boost.daysTotal * 24 * 60 * 60 * 1000);
    const updated = await prisma.boost.update({
      where: { id: bid },
      data: { status: "active", startDate, endDate, reviewedAt: now },
    });
    const chatId = boost.listing.user.telegramChatId;
    if (chatId) {
      notifyBoostApproved({
        teacherChatId: chatId,
        listingTitle: boost.listing.title,
        type: boost.type,
        daysTotal: boost.daysTotal,
      }).catch(e => console.error("[boost-approved] notify failed", e));
    }
    return NextResponse.json({ boost: updated });
  }

  if (action === "reject") {
    if (boost.status !== "pending") {
      return NextResponse.json({ error: "Faqat kutilayotgan boost'ni rad etish mumkin" }, { status: 400 });
    }
    const reason = String(body.reason ?? "").trim() || "Sabab ko'rsatilmagan";
    const refund = boost.totalPaid;
    const userId = boost.listing.user.id;

    await prisma.$transaction(async (tx) => {
      await tx.boost.update({
        where: { id: bid },
        data: { status: "rejected", rejectReason: reason, reviewedAt: new Date() },
      });
      await tx.user.update({ where: { id: userId }, data: { balance: { increment: refund } } });
      await tx.balanceLog.create({
        data: {
          userId,
          type: "credit",
          amount: refund,
          referenceId: String(bid),
          note: `Boost rad etildi — qaytarildi`,
        },
      });
    });

    const chatId = boost.listing.user.telegramChatId;
    if (chatId) {
      notifyBoostRejected({
        teacherChatId: chatId,
        listingTitle: boost.listing.title,
        type: boost.type,
        refundAmount: refund,
        reason,
      }).catch(e => console.error("[boost-rejected] notify failed", e));
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "stop") {
    const b = await prisma.boost.update({ where: { id: bid }, data: { status: "stopped" } });
    return NextResponse.json({ boost: b });
  }

  if (action === "resume") {
    const b = await prisma.boost.update({ where: { id: bid }, data: { status: "active" } });
    return NextResponse.json({ boost: b });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
