import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CAPS = { a_class: 10, b_class: 12 } as const;
const DAYS = 30;

// GET /api/boost/calendar?type=a_class
// Keyingi 30 kunning availability holatini qaytaradi.
// Bugun kiritilmaydi (ertangidan boshlab).
// Pending va active boost'lar slot egallaydi (rejected va ended hisoblanmaydi).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "a_class" | "b_class" | null;
  if (type !== "a_class" && type !== "b_class") {
    return NextResponse.json({ error: "type a_class yoki b_class bo'lishi kerak" }, { status: 400 });
  }
  const cap = CAPS[type];

  // Toshkent vaqti — ertangi 00:00 dan keyingi 30 kunning 00:00 gacha
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const endOfRange = new Date(tomorrow);
  endOfRange.setDate(endOfRange.getDate() + DAYS);

  // Range bilan kesishadigan barcha aktiv+pending boost'larni olamiz
  const boosts = await prisma.boost.findMany({
    where: {
      type,
      status: { in: ["active", "pending"] },
      startDate: { lt: endOfRange },
      endDate: { gte: tomorrow },
    },
    select: { startDate: true, endDate: true },
  });

  const days: { date: string; available: boolean }[] = [];
  for (let i = 0; i < DAYS; i++) {
    const day = new Date(tomorrow);
    day.setDate(day.getDate() + i);
    const dayEnd = new Date(day);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const count = boosts.filter(b => b.startDate < dayEnd && b.endDate > day).length;
    days.push({
      date: day.toISOString().split("T")[0],
      available: count < cap,
    });
  }

  return NextResponse.json({ type, cap, days });
}
