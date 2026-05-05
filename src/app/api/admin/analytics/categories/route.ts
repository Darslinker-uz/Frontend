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

  const categories = await prisma.category.findMany({
    where: { active: true, pendingApproval: false },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      group: { select: { name: true, slug: true } },
      _count: { select: { listings: true } },
    },
    orderBy: { name: "asc" },
  });

  const ids = categories.map(c => c.id);
  const [viewsByCategory, leadsByCategory] = await Promise.all([
    prisma.listing.groupBy({
      by: ["categoryId"],
      where: { categoryId: { in: ids } },
      _sum: { views: true },
    }),
    prisma.lead.groupBy({
      by: ["listingId"],
      where: { createdAt: { gte: start, lt: end }, listing: { categoryId: { in: ids } } },
      _count: { id: true },
    }),
  ]);

  // Map listingId → categoryId for leads aggregation
  const listings = await prisma.listing.findMany({
    where: { categoryId: { in: ids } },
    select: { id: true, categoryId: true },
  });
  const listingToCategory = new Map<number, number>(listings.map(l => [l.id, l.categoryId]));
  const leadsPerCategory = new Map<number, number>();
  for (const row of leadsByCategory) {
    const cid = listingToCategory.get(row.listingId);
    if (cid != null) leadsPerCategory.set(cid, (leadsPerCategory.get(cid) ?? 0) + row._count.id);
  }
  const viewsPerCategory = new Map<number, number>(viewsByCategory.map(v => [v.categoryId, v._sum.views ?? 0]));

  const rows = categories.map(c => {
    const views = viewsPerCategory.get(c.id) ?? 0;
    const leads = leadsPerCategory.get(c.id) ?? 0;
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      color: c.color ?? "#7ea2d4",
      groupName: c.group?.name ?? null,
      listings: c._count.listings,
      views,
      leads,
      ctr: views > 0 ? Number(((leads / views) * 100).toFixed(2)) : 0,
    };
  });

  return NextResponse.json({ categories: rows });
}
