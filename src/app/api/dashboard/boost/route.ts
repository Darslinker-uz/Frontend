import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyBoostPending } from "@/lib/bot-handler";
import { randomUUID } from "crypto";

const PRICING: Record<"a_class" | "b_class", number> = {
  a_class: 100000,
  b_class: 50000,
};
const CAPS: Record<"a_class" | "b_class", number> = {
  a_class: 10,
  b_class: 12,
};

// Sana bilan ishlash uchun yordamchi — kun boshini olish
function dayStart(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function dayKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

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
// body: { listingId, type, startAt (YYYY-MM-DD), daysTotal }
// Calendar mantiqi: tanlangan kunlar orasidan band kunlarni o'tkazib yuboradi
// (qolgan bo'sh kunlar uchun pul yechiladi). Band kun aralash bo'lsa,
// bir necha Boost yozuvi yaratilishi mumkin (bir bundleId bilan).
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
  if (!body.startAt) return NextResponse.json({ error: "Boshlanish kunini tanlang" }, { status: 400 });

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

  // Boshlanish kuni — ertangidan oldin bo'lmasligi kerak
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

  // Balansda yetarli pul borligini avval tekshiramiz (eng yomon holatda barcha kunlar bo'sh)
  const pricePerDay = PRICING[type];
  const teacher = await prisma.user.findUnique({ where: { id: userId }, select: { balance: true, name: true, centerName: true } });
  if (!teacher) return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });

  // Transaction ichida: kapasitet tekshirish + ko'p Boost yozuvi yaratish + balansdan yechish
  type TxResult =
    | { ok: true; boosts: { id: number; startDate: Date; endDate: Date }[]; bookedDays: string[]; skippedDays: string[]; totalCharged: number; bundleId: string }
    | { ok: false; error: string; status: number };

  const result: TxResult = await prisma.$transaction(async (tx) => {
    // Diapazon ichidagi mavjud boost'larni olamiz (race-safe uchun transaction ichida)
    const existing = await tx.boost.findMany({
      where: {
        type,
        status: { in: ["active", "pending"] },
        startDate: { lt: rangeEnd },
        endDate: { gte: requestedStart },
      },
      select: { startDate: true, endDate: true },
    });

    // Har kun uchun band/bo'shligini hisoblaymiz
    const bookedDays: Date[] = [];
    const skippedDays: Date[] = [];
    for (const day of requestedDays) {
      const dayEnd = addDays(day, 1);
      const count = existing.filter(b => b.startDate < dayEnd && b.endDate > day).length;
      if (count < cap) bookedDays.push(day);
      else skippedDays.push(day);
    }

    if (bookedDays.length === 0) {
      return { ok: false, error: "Tanlangan kunlarning hammasi band. Boshqa muddat tanlang.", status: 409 };
    }

    const totalCharged = bookedDays.length * pricePerDay;
    if (teacher.balance < totalCharged) {
      return { ok: false, error: `Balans yetmaydi. ${bookedDays.length} kun uchun ${totalCharged.toLocaleString("uz-UZ").replace(/\s/g, ",")} so'm kerak.`, status: 400 };
    }

    // Kontiguy diapazonlarni topib, har biriga alohida Boost yozuvi yaratamiz
    const bundleId = randomUUID();
    const segments: Array<[Date, Date]> = []; // [startDay, lastDay]
    for (const day of bookedDays) {
      const last = segments[segments.length - 1];
      if (last && last[1].getTime() + 86_400_000 === day.getTime()) {
        last[1] = day;
      } else {
        segments.push([day, day]);
      }
    }

    const created: { id: number; startDate: Date; endDate: Date }[] = [];
    for (const [start, last] of segments) {
      const segDays = Math.round((last.getTime() - start.getTime()) / 86_400_000) + 1;
      const endDate = addDays(last, 1); // endDate exclusive — last day + 1
      const segPaid = segDays * pricePerDay;
      const b = await tx.boost.create({
        data: {
          listingId,
          type,
          pricePerDay,
          daysTotal: segDays,
          totalPaid: segPaid,
          startDate: start,
          endDate,
          status: "pending",
          bundleId,
        },
      });
      created.push({ id: b.id, startDate: b.startDate, endDate: b.endDate });
    }

    await tx.user.update({ where: { id: userId }, data: { balance: { decrement: totalCharged } } });
    await tx.balanceLog.create({
      data: {
        userId,
        type: "debit",
        amount: totalCharged,
        referenceId: bundleId,
        note: `Boost ${type === "a_class" ? "A-class" : "B-class"} · ${bookedDays.length} kun (bron)`,
      },
    });

    return {
      ok: true,
      boosts: created,
      bookedDays: bookedDays.map(dayKey),
      skippedDays: skippedDays.map(dayKey),
      totalCharged,
      bundleId,
    };
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // Telegram xabar (admin'ga)
  notifyBoostPending({
    boostId: result.boosts[0].id,
    listingTitle: listing.title,
    centerName: teacher.centerName ?? teacher.name ?? "—",
    type,
    daysTotal: result.bookedDays.length,
    totalPaid: result.totalCharged,
    createdAt: new Date(),
  }).catch(e => console.error("[boost-pending] telegram notify failed", e));

  return NextResponse.json({
    bundleId: result.bundleId,
    bookedDays: result.bookedDays,
    skippedDays: result.skippedDays,
    totalCharged: result.totalCharged,
    boosts: result.boosts,
  }, { status: 201 });
}
