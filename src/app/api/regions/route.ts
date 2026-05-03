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

  // Yangi: 'branches' jadvalidan + eski 'listings.region' fallback'dan,
  // har bir e'lon har bir viloyatida bir martagina hisoblanishi uchun dedupe qilamiz.
  const regionNames = regions.map((r) => r.name);
  const [legacyListings, branchRows] = await Promise.all([
    prisma.listing.findMany({
      where: {
        status: "active",
        region: { in: regionNames },
        category: { active: true, pendingApproval: false },
      },
      select: { id: true, region: true },
    }),
    prisma.listingLocation.findMany({
      where: {
        region: { in: regionNames },
        listing: { status: "active", category: { active: true, pendingApproval: false } },
      },
      select: { listingId: true, region: true },
    }),
  ]);

  const perRegion = new Map<string, Set<number>>(regionNames.map((n) => [n, new Set<number>()]));
  for (const l of legacyListings) {
    if (l.region) perRegion.get(l.region)?.add(l.id);
  }
  for (const b of branchRows) {
    if (b.region) perRegion.get(b.region)?.add(b.listingId);
  }
  const countMap = new Map(Array.from(perRegion.entries()).map(([k, v]) => [k, v.size]));

  const enriched = regions.map((r) => ({
    ...r,
    listingCount: countMap.get(r.name) ?? 0,
  }));

  return NextResponse.json({ regions: enriched });
}
