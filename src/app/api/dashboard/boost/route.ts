import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyBoostPending } from "@/lib/bot-handler";

const PRICING: Record<"a_class" | "b_class", number> = {
  a_class: 100000,
  b_class: 50000,
};

// GET /api/dashboard/boost — teacher's boost history
export async function GET() {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const boosts = await prisma.boost.findMany({
    where: { listing: { userId } },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, slug: true, category: { select: { name: true, slug: true } } } },
    },
  });
  return NextResponse.json({ boosts });
}

// POST /api/dashboard/boost — purchase new boost (pending admin review)
export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  const userId = Number(user?.id);
  if (!userId || (user?.role !== "provider" && user?.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { listingId?: number; type?: string; daysTotal?: number; startAt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const listingId = Number(body.listingId);
  const type = body.type === "a_class" || body.type === "b_class" ? body.type : null;
  const daysTotal = Number(body.daysTotal);

  if (!listingId) return NextResponse.json({ error: "listingId majburiy" }, { status: 400 });
  if (!type) return NextResponse.json({ error: "Boost turi noto'g'ri" }, { status: 400 });
  if (!daysTotal || daysTotal < 1 || daysTotal > 30) {
    return NextResponse.json({ error: "Kun 1-30 oraliqda bo'lishi kerak" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, userId: true, status: true, title: true },
  });
  if (!listing || listing.userId !== userId) {
    return NextResponse.json({ error: "E'lon topilmadi" }, { status: 404 });
  }
  if (listing.status !== "active") {
    return NextResponse.json({ error: "Faqat aktiv e'lonlarni boost qilish mumkin" }, { status: 400 });
  }

  const teacher = await prisma.user.findUnique({ where: { id: userId }, select: { balance: true, name: true, telegramChatId: true } });
  if (!teacher) return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });

  const pricePerDay = PRICING[type];
  const totalPaid = pricePerDay * daysTotal;

  if (teacher.balance < totalPaid) {
    return NextResponse.json({ error: "Balans yetarli emas. Avval to'ldiring." }, { status: 400 });
  }

  const now = new Date();
  const startDate = body.startAt ? new Date(body.startAt) : now;
  const endDate = new Date(startDate.getTime() + daysTotal * 24 * 60 * 60 * 1000);

  const boost = await prisma.$transaction(async (tx) => {
    const created = await tx.boost.create({
      data: {
        listingId,
        type,
        pricePerDay,
        daysTotal,
        totalPaid,
        startDate,
        endDate,
        status: "pending",
      },
    });
    await tx.user.update({ where: { id: userId }, data: { balance: { decrement: totalPaid } } });
    await tx.balanceLog.create({
      data: {
        userId,
        type: "debit",
        amount: totalPaid,
        referenceId: String(created.id),
        note: `Boost ${type === "a_class" ? "A-class" : "B-class"} · ${daysTotal} kun`,
      },
    });
    return created;
  });

  notifyBoostPending({
    boostId: boost.id,
    listingTitle: listing.title,
    centerName: teacher.name ?? "—",
    type,
    daysTotal,
    totalPaid,
    createdAt: boost.createdAt,
  }).catch(e => console.error("[boost-pending] telegram notify failed", e));

  return NextResponse.json({ boost }, { status: 201 });
}
