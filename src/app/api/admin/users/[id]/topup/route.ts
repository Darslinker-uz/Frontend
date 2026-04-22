import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyBalanceTopup } from "@/lib/bot-handler";

interface Ctx { params: Promise<{ id: string }> }

// POST /api/admin/users/:id/topup — { amount: number, note?: string }
// amount: +N to credit, -N to debit
export async function POST(request: Request, { params }: Ctx) {
  const session = await auth();
  const actor = session?.user as { role?: string } | undefined;
  if (actor?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = Number(id);
  if (!userId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  let body: { amount?: number; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amount = Math.trunc(Number(body.amount));
  if (!amount || Number.isNaN(amount)) {
    return NextResponse.json({ error: "Summa noto'g'ri" }, { status: 400 });
  }
  const note = body.note?.trim() || undefined;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, balance: true, telegramChatId: true },
  });
  if (!user) return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });

  // Debit (negative amount) cannot exceed balance
  if (amount < 0 && user.balance + amount < 0) {
    return NextResponse.json({ error: "Balans yetarli emas" }, { status: 400 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
      select: { id: true, balance: true, name: true, phone: true, telegramChatId: true },
    });
    await tx.balanceLog.create({
      data: {
        userId,
        type: amount > 0 ? "credit" : "debit",
        amount: Math.abs(amount),
        note: note ?? (amount > 0 ? "Admin to'ldirdi" : "Admin kamaytirdi"),
      },
    });
    return u;
  });

  // Notify teacher via Telegram (only on top-up, not debit)
  if (amount > 0 && user.telegramChatId) {
    notifyBalanceTopup({
      teacherChatId: user.telegramChatId,
      amount,
      newBalance: updated.balance,
      note,
    }).catch(e => console.error("[topup] notify failed", e));
  }

  return NextResponse.json({ user: updated });
}
