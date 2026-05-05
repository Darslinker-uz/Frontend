import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type PeriodId =
  | "1d"
  | "7d"
  | "30d"
  | "90d"
  | "apr"
  | "mar"
  | "feb"
  | "yan"
  | "dek"
  | "noy";

const MONTH_LABELS_UZ = [
  "Yan",
  "Fev",
  "Mar",
  "Apr",
  "May",
  "Iyun",
  "Iyul",
  "Avg",
  "Sen",
  "Okt",
  "Noy",
  "Dek",
];

function resolveRange(period: PeriodId): { start: Date; end: Date } {
  const now = new Date();
  switch (period) {
    case "1d":
      return { start: new Date(now.getTime() - 24 * 60 * 60 * 1000), end: now };
    case "7d":
      return { start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
    case "30d":
      return { start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
    case "90d":
      return { start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), end: now };
    case "apr":
      return { start: new Date(Date.UTC(2026, 3, 1)), end: new Date(Date.UTC(2026, 4, 1)) };
    case "mar":
      return { start: new Date(Date.UTC(2026, 2, 1)), end: new Date(Date.UTC(2026, 3, 1)) };
    case "feb":
      return { start: new Date(Date.UTC(2026, 1, 1)), end: new Date(Date.UTC(2026, 2, 1)) };
    case "yan":
      return { start: new Date(Date.UTC(2026, 0, 1)), end: new Date(Date.UTC(2026, 1, 1)) };
    case "dek":
      return { start: new Date(Date.UTC(2025, 11, 1)), end: new Date(Date.UTC(2026, 0, 1)) };
    case "noy":
      return { start: new Date(Date.UTC(2025, 10, 1)), end: new Date(Date.UTC(2025, 11, 1)) };
    default:
      return { start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
  }
}

function pctDelta(now: number, prev: number): number {
  if (prev === 0) return 0;
  return Math.round(((now - prev) / prev) * 100);
}

function toMillions(amount: number): number {
  return Math.round((amount / 1_000_000) * 10) / 10;
}

async function kpiBlock(start: Date, end: Date) {
  const [revenueAgg, leads, users, listings, views, uniqueRows] = await Promise.all([
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "success",
        type: { not: "refund" },
        createdAt: { gte: start, lt: end },
      },
    }),
    prisma.lead.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.user.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.listing.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.viewEvent.count({ where: { createdAt: { gte: start, lt: end } } }),
    // Distinct sessionIds within range — fallback to ipHash for sessions without sessionId
    prisma.viewEvent.findMany({
      where: { createdAt: { gte: start, lt: end } },
      select: { sessionId: true, ipHash: true },
      take: 100_000,
    }),
  ]);

  const revenue = revenueAgg._sum.amount ?? 0;
  const uniqueSet = new Set<string>();
  for (const r of uniqueRows) {
    const key = r.sessionId ?? (r.ipHash ? `ip:${r.ipHash}` : null);
    if (key) uniqueSet.add(key);
  }
  const uniqueVisitors = uniqueSet.size;

  return { revenue, views, uniqueVisitors, leads, users, listings };
}

// GET /api/admin/analytics?period=1d|7d|30d|90d|apr|mar|feb|yan|dek|noy
export async function GET(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") || "30d") as PeriodId;

  const { start, end } = resolveRange(period);
  const rangeMs = end.getTime() - start.getTime();
  const prevStart = new Date(start.getTime() - rangeMs);
  const prevEnd = start;

  const [cur, prev] = await Promise.all([
    kpiBlock(start, end),
    kpiBlock(prevStart, prevEnd),
  ]);

  const kpi = {
    revenue: cur.revenue,
    views: cur.views,
    uniqueVisitors: cur.uniqueVisitors,
    leads: cur.leads,
    users: cur.users,
    listings: cur.listings,
    revenueDelta: pctDelta(cur.revenue, prev.revenue),
    viewsDelta: pctDelta(cur.views, prev.views),
    leadsDelta: pctDelta(cur.leads, prev.leads),
    usersDelta: pctDelta(cur.users, prev.users),
    listingsDelta: pctDelta(cur.listings, prev.listings),
  };

  // ============ revenueByMonth — last 8 months ============
  const today = new Date();
  const monthBuckets: { label: string; start: Date; end: Date }[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - i, 1));
    const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
    monthBuckets.push({ label: MONTH_LABELS_UZ[d.getUTCMonth()], start: d, end: next });
  }

  const revenueByMonth = await Promise.all(
    monthBuckets.map(async (m) => {
      const [balAgg, boostAgg, leadsAgg] = await Promise.all([
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: "success",
            type: "topup",
            createdAt: { gte: m.start, lt: m.end },
          },
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: "success",
            type: "boost",
            createdAt: { gte: m.start, lt: m.end },
          },
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: "success",
            type: "lead",
            createdAt: { gte: m.start, lt: m.end },
          },
        }),
      ]);
      return {
        label: m.label,
        balance: toMillions(balAgg._sum.amount ?? 0),
        boost: toMillions(boostAgg._sum.amount ?? 0),
        leads: toMillions(leadsAgg._sum.amount ?? 0),
      };
    }),
  );

  // ============ topCategories ============
  // For each category: listings count, leads count, revenue (boost payments from owners in that category).
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, color: true },
  });

  const topCategoriesRaw = await Promise.all(
    categories.map(async (c) => {
      const [listingsCount, leadsCount, ownerIds] = await Promise.all([
        prisma.listing.count({ where: { categoryId: c.id } }),
        prisma.lead.count({ where: { listing: { categoryId: c.id } } }),
        prisma.listing.findMany({
          where: { categoryId: c.id },
          select: { userId: true },
          distinct: ["userId"],
        }),
      ]);
      const userIds = ownerIds.map((o) => o.userId);
      const revenueAgg = userIds.length
        ? await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
              userId: { in: userIds },
              status: "success",
              type: "boost",
            },
          })
        : { _sum: { amount: 0 } as { amount: number | null } };

      return {
        name: c.name,
        color: c.color ?? "#3b82f6",
        listings: listingsCount,
        leads: leadsCount,
        revenue: toMillions(revenueAgg._sum.amount ?? 0),
      };
    }),
  );

  const topCategories = topCategoriesRaw
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 6);

  // ============ topCenters ============
  // Top 5 providers by total successful non-refund revenue.
  const providerRevenueAgg = await prisma.payment.groupBy({
    by: ["userId"],
    _sum: { amount: true },
    where: { status: "success", type: { not: "refund" } },
    orderBy: { _sum: { amount: "desc" } },
    take: 20,
  });

  const topCentersRaw = await Promise.all(
    providerRevenueAgg.map(async (row) => {
      const user = await prisma.user.findUnique({
        where: { id: row.userId },
        select: { id: true, name: true, role: true },
      });
      if (!user || user.role !== "provider") return null;
      const [listingsCount, leadsCount, boostsCount] = await Promise.all([
        prisma.listing.count({ where: { userId: user.id } }),
        prisma.lead.count({ where: { listing: { userId: user.id } } }),
        prisma.boost.count({ where: { listing: { userId: user.id } } }),
      ]);
      return {
        name: user.name,
        listings: listingsCount,
        leads: leadsCount,
        boosts: boostsCount,
        revenue: toMillions(row._sum.amount ?? 0),
      };
    }),
  );

  const topCenters = topCentersRaw
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .slice(0, 5);

  // ============ trafficSources — static ============
  const trafficSources = [
    { label: "Organik", value: 42, color: "#22c55e" },
    { label: "Reklama", value: 28, color: "#3b82f6" },
    { label: "Ijtimoiy tarmoq", value: 18, color: "#ec4899" },
    { label: "To'g'ridan-to'g'ri", value: 12, color: "#f59e0b" },
  ];

  // ============ userGrowth — last 8 months ============
  const userGrowth = await Promise.all(
    monthBuckets.map(async (m) => {
      const [teachers, students] = await Promise.all([
        prisma.user.count({
          where: {
            role: "provider",
            createdAt: { gte: m.start, lt: m.end },
          },
        }),
        prisma.user.count({
          where: {
            role: "student",
            createdAt: { gte: m.start, lt: m.end },
          },
        }),
      ]);
      return { label: m.label, teachers, students };
    }),
  );

  // ============ conversionFunnel — period-filtered ============
  const [totalViews, totalLeads, converted, providerBought] = await Promise.all([
    prisma.viewEvent.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.lead.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.lead.count({ where: { createdAt: { gte: start, lt: end }, status: "converted" } }),
    prisma.lead.count({ where: { createdAt: { gte: start, lt: end }, status: { in: ["contacted", "converted"] } } }),
  ]);

  const safePct = (n: number) =>
    totalViews > 0 ? Math.round((n / totalViews) * 10000) / 100 : 0;

  const conversionFunnel = [
    { label: "E'longa kirish", count: totalViews, pct: totalViews > 0 ? 100 : 0 },
    { label: "Telefon qoldirish", count: totalLeads, pct: safePct(totalLeads) },
    { label: "Teacher sotib oldi", count: providerBought, pct: safePct(providerBought) },
    { label: "Student sotib oldi", count: converted, pct: safePct(converted) },
  ];

  return NextResponse.json({
    kpi,
    revenueByMonth,
    userGrowth,
    topCategories,
    topCenters,
    trafficSources,
    conversionFunnel,
  });
}
