import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOnly } from "@/lib/require-permission";

export const dynamic = "force-dynamic";

// GET /api/admin/pending-counts — super admin sidebar uchun kutuvdagi ishlar soni
// Faqat admin uchun (assistant'lar bunday badge ko'rmaydi)
export async function GET() {
  const deny = await requireAdminOnly();
  if (deny) return deny;

  const [listingsPending, categoriesPending, boostsPending, partnerApps] = await Promise.all([
    prisma.listing.count({ where: { status: "pending" } }),
    prisma.category.count({ where: { pendingApproval: true } }),
    prisma.boost.count({ where: { status: "pending" } }),
    prisma.partnerApplication.count({ where: { status: "new_app" } }).catch(() => 0),
  ]);

  return NextResponse.json({
    listings: listingsPending,
    categories: categoriesPending,
    boosts: boostsPending,
    partners: partnerApps,
  });
}
