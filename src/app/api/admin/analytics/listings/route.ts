import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { resolveRange, type PeriodId } from "@/lib/analytics-period";

export async function GET(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "30d") as PeriodId;
  const categoryId = searchParams.get("categoryId");
  const centerId = searchParams.get("centerId");
  const status = searchParams.get("status");
  const { start, end } = resolveRange(period);

  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (centerId) where.userId = Number(centerId);
  if (status) where.status = status;

  const listings = await prisma.listing.findMany({
    where,
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      views: true,
      createdAt: true,
      category: { select: { name: true, slug: true } },
      user: { select: { id: true, name: true, centerName: true } },
      leads: { where: { createdAt: { gte: start, lt: end } }, select: { id: true } },
      ratings: { select: { stars: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const rows = listings.map(l => {
    const leads = l.leads.length;
    const views = l.views ?? 0;
    const ctr = views > 0 ? (leads / views) * 100 : 0;
    const ratingCount = l.ratings.length;
    const ratingAvg = ratingCount > 0 ? l.ratings.reduce((s, r) => s + r.stars, 0) / ratingCount : 0;
    return {
      id: l.id,
      title: l.title,
      slug: l.slug,
      status: l.status,
      centerName: l.user?.centerName ?? l.user?.name ?? "—",
      centerId: l.user?.id ?? null,
      categoryName: l.category?.name ?? "—",
      categorySlug: l.category?.slug ?? null,
      views,
      leads,
      ctr: Number(ctr.toFixed(2)),
      ratingAvg,
      ratingCount,
      createdAt: l.createdAt.toISOString(),
    };
  });

  return NextResponse.json({ listings: rows });
}
