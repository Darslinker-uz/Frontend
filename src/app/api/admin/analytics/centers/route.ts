import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { resolveRange, type PeriodId } from "@/lib/analytics-period";

export async function GET(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "30d") as PeriodId;
  const { start, end } = resolveRange(period);

  const centers = await prisma.user.findMany({
    where: { role: "provider" },
    select: {
      id: true,
      name: true,
      centerName: true,
      balance: true,
      banned: true,
      createdAt: true,
      _count: { select: { listings: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const ids = centers.map(c => c.id);

  // Aggregate per-center metrics in batch
  const [leadsByCenter, viewsByCenter, paymentsByCenter, ratings] = await Promise.all([
    prisma.lead.groupBy({
      by: ["listingId"],
      where: { createdAt: { gte: start, lt: end }, listing: { userId: { in: ids } } },
      _count: { _all: true },
    }),
    prisma.listing.groupBy({
      by: ["userId"],
      where: { userId: { in: ids } },
      _sum: { views: true },
    }),
    prisma.payment.groupBy({
      by: ["userId"],
      where: { userId: { in: ids }, status: "success", type: { not: "refund" }, createdAt: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
    prisma.rating.findMany({
      where: { listing: { userId: { in: ids } } },
      select: { stars: true, listing: { select: { userId: true } } },
    }),
  ]);

  const listings = await prisma.listing.findMany({
    where: { userId: { in: ids } },
    select: { id: true, userId: true },
  });
  const listingToUser = new Map<number, number>(listings.map(l => [l.id, l.userId]));
  const leadsPerCenter = new Map<number, number>();
  for (const row of leadsByCenter) {
    const uid = listingToUser.get(row.listingId);
    if (uid != null) leadsPerCenter.set(uid, (leadsPerCenter.get(uid) ?? 0) + row._count._all);
  }
  const viewsPerCenter = new Map<number, number>(viewsByCenter.map(v => [v.userId, v._sum.views ?? 0]));
  const revenuePerCenter = new Map<number, number>(paymentsByCenter.map(p => [p.userId, p._sum.amount ?? 0]));
  const ratingPerCenter = new Map<number, { sum: number; count: number }>();
  for (const r of ratings) {
    const uid = r.listing.userId;
    const prev = ratingPerCenter.get(uid) ?? { sum: 0, count: 0 };
    prev.sum += r.stars;
    prev.count += 1;
    ratingPerCenter.set(uid, prev);
  }

  const rows = centers.map(c => {
    const views = viewsPerCenter.get(c.id) ?? 0;
    const leads = leadsPerCenter.get(c.id) ?? 0;
    const rating = ratingPerCenter.get(c.id);
    return {
      id: c.id,
      name: c.centerName ?? c.name,
      banned: c.banned,
      listings: c._count.listings,
      views,
      leads,
      ctr: views > 0 ? Number(((leads / views) * 100).toFixed(2)) : 0,
      revenue: revenuePerCenter.get(c.id) ?? 0,
      balance: c.balance,
      ratingAvg: rating && rating.count > 0 ? rating.sum / rating.count : 0,
      ratingCount: rating?.count ?? 0,
      createdAt: c.createdAt.toISOString(),
    };
  });

  return NextResponse.json({ centers: rows });
}
