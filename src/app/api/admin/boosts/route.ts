import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

// GET /api/admin/boosts?status=active|ended|stopped&classType=A|B
export async function GET(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const classType = searchParams.get("classType");
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (classType === "A") where.type = "a_class";
  if (classType === "B") where.type = "b_class";

  const boosts = await prisma.boost.findMany({
    where,
    orderBy: { startDate: "desc" },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          category: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
        },
      },
    },
  });

  // Compute daysLeft dynamically (server time)
  const now = Date.now();
  const withDaysLeft = boosts.map((b) => {
    const end = new Date(b.endDate).getTime();
    const daysLeft = Math.max(0, Math.ceil((end - now) / (24 * 60 * 60 * 1000)));
    return { ...b, daysLeft };
  });

  return NextResponse.json({ boosts: withDaysLeft });
}
