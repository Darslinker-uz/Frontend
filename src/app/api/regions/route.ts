import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/regions
//   Default: faqat active regions
//   Query: ?featured=1 — faqat featured (navbar uchun)
//          ?withCount=1 — har region uchun aktiv listing soni
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get("featured") === "1";
  const withCount = searchParams.get("withCount") === "1";

  const regions = await prisma.region.findMany({
    where: {
      active: true,
      ...(featuredOnly && { featured: true }),
    },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      featured: true,
      order: true,
    },
  });

  if (!withCount) {
    return NextResponse.json({ regions });
  }

  // Listing.region (text) bilan match qilamiz — Region.name bilan teng
  const counts = await prisma.listing.groupBy({
    by: ["region"],
    where: {
      status: "active",
      region: { in: regions.map((r) => r.name) },
      category: { active: true, pendingApproval: false },
    },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.region, c._count._all]));

  const enriched = regions.map((r) => ({
    ...r,
    listingCount: countMap.get(r.name) ?? 0,
  }));

  return NextResponse.json({ regions: enriched });
}
