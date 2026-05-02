import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { requirePermission } from "@/lib/require-permission";

// GET /api/admin/users?role=admin|teacher|student
export async function GET(request: Request) {
  const deny = await requirePermission("user.view");
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") as "admin" | "provider" | "student" | null;

  const users = await prisma.user.findMany({
    where: role ? { role } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          listings: true,
        },
      },
    },
  });

  // Statistika maydonlarini qo'shamiz (revenue, leads)
  const withStats = await Promise.all(
    users.map(async (u) => {
      if (u.role === "provider") {
        const revenue = await prisma.payment.aggregate({
          where: { userId: u.id, type: "topup", status: "success" },
          _sum: { amount: true },
        });
        return {
          ...u,
          listingsCount: u._count.listings,
          revenue: revenue._sum.amount ?? 0,
        };
      }
      if (u.role === "student") {
        const leads = await prisma.lead.count({
          where: { phone: u.phone },
        });
        return { ...u, listingsCount: 0, leadsCount: leads };
      }
      return { ...u, listingsCount: 0 };
    }),
  );

  return NextResponse.json({ users: withStats });
}
