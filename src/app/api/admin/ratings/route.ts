import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

// GET /api/admin/ratings — providers ranked by total rating count.
// Returns one row per provider with: name, centerName, listingsCount, ratingsCount, avgStars.
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  // Pull every rating with the owning provider info.
  // For modest scale this is fine; aggregate by hand to avoid raw SQL.
  const ratings = await prisma.rating.findMany({
    select: {
      stars: true,
      listing: {
        select: {
          userId: true,
          user: { select: { id: true, name: true, centerName: true, phone: true } },
        },
      },
    },
  });

  type Bucket = { id: number; name: string; centerName: string | null; phone: string; count: number; sum: number };
  const map = new Map<number, Bucket>();
  for (const r of ratings) {
    const u = r.listing?.user;
    if (!u) continue;
    const cur = map.get(u.id) ?? { id: u.id, name: u.name, centerName: u.centerName, phone: u.phone, count: 0, sum: 0 };
    cur.count += 1;
    cur.sum += r.stars;
    map.set(u.id, cur);
  }

  // Listings count per provider (independent count — providers can have 0 ratings too if we want to expose)
  const providers = await prisma.user.findMany({
    where: { role: "provider" },
    select: {
      id: true,
      name: true,
      centerName: true,
      phone: true,
      _count: { select: { listings: { where: { status: "active" } } } },
    },
  });

  const rows = providers.map((p) => {
    const b = map.get(p.id);
    return {
      id: p.id,
      name: p.name,
      centerName: p.centerName,
      phone: p.phone,
      listingsCount: p._count.listings,
      ratingsCount: b?.count ?? 0,
      avgStars: b && b.count > 0 ? Number((b.sum / b.count).toFixed(2)) : 0,
    };
  }).sort((a, b) => b.ratingsCount - a.ratingsCount);

  return NextResponse.json({ providers: rows });
}
