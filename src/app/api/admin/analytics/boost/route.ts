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

  const [byType, topBoosts, totalRevenue, activeCount] = await Promise.all([
    prisma.boost.groupBy({
      by: ["type"],
      where: { status: { in: ["active", "ended"] }, startDate: { lt: end }, endDate: { gte: start } },
      _count: { _all: true },
      _sum: { totalPaid: true, views: true, leadsCount: true },
    }),
    prisma.boost.findMany({
      where: { status: { in: ["active", "ended"] }, startDate: { lt: end }, endDate: { gte: start } },
      include: {
        listing: { select: { id: true, title: true, user: { select: { name: true, centerName: true } } } },
      },
      orderBy: { leadsCount: "desc" },
      take: 30,
    }),
    prisma.boost.aggregate({
      _sum: { totalPaid: true },
      where: { status: { in: ["active", "ended"] }, createdAt: { gte: start, lt: end } },
    }),
    prisma.boost.count({ where: { status: "active" } }),
  ]);

  const summary = byType.map(t => {
    const spent = t._sum?.totalPaid ?? 0;
    const views = t._sum?.views ?? 0;
    const leads = t._sum?.leadsCount ?? 0;
    return {
      type: t.type,
      count: t._count?._all ?? 0,
      spent,
      views,
      leads,
      cpl: leads > 0 ? Math.round(spent / leads) : 0,
      ctr: views > 0 ? Number(((leads / views) * 100).toFixed(2)) : 0,
    };
  });

  const top = topBoosts.map(b => ({
    id: b.id,
    listingId: b.listing.id,
    title: b.listing.title,
    centerName: b.listing.user?.centerName ?? b.listing.user?.name ?? "—",
    type: b.type,
    spent: b.totalPaid,
    views: b.views,
    leads: b.leadsCount,
    cpl: b.leadsCount > 0 ? Math.round(b.totalPaid / b.leadsCount) : 0,
    ctr: b.views > 0 ? Number(((b.leadsCount / b.views) * 100).toFixed(2)) : 0,
    daysTotal: b.daysTotal,
    status: b.status,
  }));

  return NextResponse.json({
    summary,
    top,
    totalRevenue: totalRevenue._sum?.totalPaid ?? 0,
    activeCount,
  });
}
