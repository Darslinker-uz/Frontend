import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/dashboard/stats — teacher's overview
export async function GET() {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [user, listingsTotal, activeListings, leadsAll, leadsThisMonth, leadsConverted] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { balance: true, name: true } }),
    prisma.listing.count({ where: { userId } }),
    prisma.listing.count({ where: { userId, status: "active" } }),
    prisma.lead.count({ where: { listing: { userId } } }),
    prisma.lead.count({ where: { listing: { userId }, createdAt: { gte: monthStart } } }),
    prisma.lead.count({ where: { listing: { userId }, status: "converted" } }),
  ]);

  const conversion = leadsAll > 0 ? Math.round((leadsConverted / leadsAll) * 100) : 0;

  return NextResponse.json({
    user: { name: user?.name ?? "", balance: user?.balance ?? 0 },
    listings: { total: listingsTotal, active: activeListings },
    leads: { total: leadsAll, thisMonth: leadsThisMonth, converted: leadsConverted },
    conversion,
  });
}
