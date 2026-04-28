import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

interface Ctx { params: Promise<{ providerId: string }> }

export const dynamic = "force-dynamic";

// GET /api/admin/ratings/:providerId — drill into a provider:
// per-listing aggregates + every rating row (phone, stars, comment, dates).
export async function GET(_request: Request, { params }: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { providerId } = await params;
  const userId = Number(providerId);
  if (!userId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const provider = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, centerName: true, phone: true, role: true },
  });
  if (!provider || provider.role !== "provider") {
    return NextResponse.json({ error: "Provider topilmadi" }, { status: 404 });
  }

  const listings = await prisma.listing.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      ratings: {
        select: { id: true, phone: true, stars: true, comment: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = listings.map((l) => {
    const count = l.ratings.length;
    const sum = l.ratings.reduce((a, r) => a + r.stars, 0);
    return {
      id: l.id,
      title: l.title,
      slug: l.slug,
      status: l.status,
      ratingsCount: count,
      avgStars: count > 0 ? Number((sum / count).toFixed(2)) : 0,
      ratings: l.ratings,
    };
  }).sort((a, b) => b.ratingsCount - a.ratingsCount);

  return NextResponse.json({ provider, listings: rows });
}
