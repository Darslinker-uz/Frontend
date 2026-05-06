import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export type TrafficPeriod = "7d" | "30d" | "90d" | "180d" | "365d";

interface RangeInfo {
  start: Date;
  end: Date;
  bucket: "day" | "week" | "month";
  buckets: number; // nechta bucket bo'lishi kerak
}

function resolveRange(period: TrafficPeriod): RangeInfo {
  const end = new Date();
  switch (period) {
    case "7d":   return { start: new Date(end.getTime() - 7 * 86400000),   end, bucket: "day",   buckets: 7 };
    case "30d":  return { start: new Date(end.getTime() - 30 * 86400000),  end, bucket: "day",   buckets: 30 };
    case "90d":  return { start: new Date(end.getTime() - 90 * 86400000),  end, bucket: "week",  buckets: 13 };
    case "180d": return { start: new Date(end.getTime() - 180 * 86400000), end, bucket: "week",  buckets: 26 };
    case "365d": return { start: new Date(end.getTime() - 365 * 86400000), end, bucket: "month", buckets: 12 };
  }
}

function bucketKey(date: Date, bucket: RangeInfo["bucket"]): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  if (bucket === "day") return `${y}-${m}-${d}`;
  if (bucket === "month") return `${y}-${m}`;
  // week — ISO week thursday'ga aylantirib hafta boshini aniqlaymiz
  const dt = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() - dayNum + 1);
  const wy = dt.getUTCFullYear();
  const wm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const wd = String(dt.getUTCDate()).padStart(2, "0");
  return `${wy}-${wm}-${wd}`;
}

function categoryLabel(cat: string | null): string {
  if (cat === "ai") return "AI Search";
  if (cat === "search") return "Search Engines";
  if (cat === "social") return "Social";
  if (cat === "other") return "Other Bots";
  return "Real foydalanuvchilar";
}

export async function GET(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "30d") as TrafficPeriod;
  const range = resolveRange(period);

  const whereRange = { createdAt: { gte: range.start, lt: range.end } };

  const [
    totalCount,
    realCount,
    aiCount,
    uniqueSessionsRaw,
    botBreakdown,
    categoryBreakdown,
    topPaths,
    timeSeries,
  ] = await Promise.all([
    prisma.pageView.count({ where: whereRange }),
    prisma.pageView.count({ where: { ...whereRange, botName: null } }),
    prisma.pageView.count({ where: { ...whereRange, botCategory: "ai" } }),
    prisma.pageView.findMany({
      where: { ...whereRange, sessionId: { not: null } },
      select: { sessionId: true },
      distinct: ["sessionId"],
    }),
    prisma.pageView.groupBy({
      by: ["botName"],
      where: { ...whereRange, botName: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    }),
    prisma.pageView.groupBy({
      by: ["botCategory"],
      where: whereRange,
      _count: { id: true },
    }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: whereRange,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.pageView.findMany({
      where: whereRange,
      select: { createdAt: true, botCategory: true },
    }),
  ]);

  // Time series qurish — har bucket uchun real vs bot ajratish
  const seriesMap = new Map<string, { real: number; bots: number }>();
  for (const v of timeSeries) {
    const key = bucketKey(v.createdAt, range.bucket);
    const cur = seriesMap.get(key) ?? { real: 0, bots: 0 };
    if (v.botCategory === null) cur.real++;
    else cur.bots++;
    seriesMap.set(key, cur);
  }
  // Bo'sh bucketlarni ham to'ldirib chiqaramiz, tartibda
  const series: { date: string; real: number; bots: number }[] = [];
  const stepMs = range.bucket === "day" ? 86400000 : range.bucket === "week" ? 7 * 86400000 : 30 * 86400000;
  for (let i = range.buckets - 1; i >= 0; i--) {
    const d = new Date(range.end.getTime() - i * stepMs);
    const key = bucketKey(d, range.bucket);
    const cur = seriesMap.get(key) ?? { real: 0, bots: 0 };
    series.push({ date: key, real: cur.real, bots: cur.bots });
  }

  return NextResponse.json({
    period,
    bucket: range.bucket,
    kpi: {
      total: totalCount,
      unique: uniqueSessionsRaw.length,
      real: realCount,
      ai: aiCount,
    },
    series,
    bots: botBreakdown.map(b => ({ name: b.botName ?? "Unknown", count: b._count.id })),
    categories: categoryBreakdown.map(c => ({
      key: c.botCategory ?? "real",
      label: categoryLabel(c.botCategory),
      count: c._count.id,
    })),
    topPaths: topPaths.map(p => ({ path: p.path, count: p._count.id })),
  });
}
