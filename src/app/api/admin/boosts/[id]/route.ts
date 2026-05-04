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

  // Bundle bilan ishlash — agar bundleId bo'lsa, butun bron birga ishlanadi
  // Aks holda — faqat bu boost
  const bundleWhere = boost.bundleId
    ? { bundleId: boost.bundleId, status: "pending" as const }
    : { id: bid, status: "pending" as const };

  if (action === "approve") {
    if (boost.status !== "pending") {
      return NextResponse.json({ error: "Faqat kutilayotgan boost'ni tasdiqlash mumkin" }, { status: 400 });
    }
    const now = new Date();
    // Bundle ichidagi barcha boost'larni tasdiqlaymiz — startDate/endDate o'zgarmaydi
    // (ular allaqachon kalendar bo'yicha to'g'ri belgilangan)
    await prisma.boost.updateMany({
      where: bundleWhere,
      data: { status: "active", reviewedAt: now },
    });
    // Foydalanuvchiga qaytariladigan ma'lumot uchun bundle yig'indisi
    const allInBundle = boost.bundleId
      ? await prisma.boost.findMany({ where: { bundleId: boost.bundleId } })
      : [boost];
    const totalDays = allInBundle.reduce((s, b) => s + b.daysTotal, 0);
    const chatId = boost.listing.user.telegramChatId;
    if (chatId) {
      notifyBoostApproved({
        teacherChatId: chatId,
        listingTitle: boost.listing.title,
        type: boost.type,
        daysTotal: totalDays,
      }).catch(e => console.error("[boost-approved] notify failed", e));
    }
    return NextResponse.json({ ok: true, bundleId: boost.bundleId, count: allInBundle.length });
  }

  if (action === "reject") {
    if (boost.status !== "pending") {
      return NextResponse.json({ error: "Faqat kutilayotgan boost'ni rad etish mumkin" }, { status: 400 });
    }
    const reason = String(body.reason ?? "").trim() || "Sabab ko'rsatilmagan";
    const userId = boost.listing.user.id;

    await prisma.$transaction(async (tx) => {
      // Bundle ichidagi barcha pending boost'larni rad etamiz va to'liq pulni qaytaramiz
      const allInBundle = boost.bundleId
        ? await tx.boost.findMany({ where: { bundleId: boost.bundleId, status: "pending" } })
        : [boost];
      const refund = allInBundle.reduce((s, b) => s + b.totalPaid, 0);

      await tx.boost.updateMany({
        where: bundleWhere,
        data: { status: "rejected", rejectReason: reason, reviewedAt: new Date() },
      });
      await tx.user.update({ where: { id: userId }, data: { balance: { increment: refund } } });
      await tx.balanceLog.create({
        data: {
          userId,
          type: "credit",
          amount: refund,
          referenceId: boost.bundleId ?? String(bid),
          note: `Boost rad etildi — qaytarildi (${allInBundle.length} ta yozuv)`,
        },
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
    });
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
