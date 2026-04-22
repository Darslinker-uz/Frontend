import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

// GET /api/admin/leads/students
// Returns: centers grouped with their leads
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const centers = await prisma.user.findMany({
    where: {
      role: { in: ["provider", "admin"] },
      listings: { some: {} },
    },
    orderBy: { name: "asc" },
    include: {
      listings: {
        select: {
          id: true,
          title: true,
          category: { select: { id: true, name: true } },
          leads: {
            orderBy: { createdAt: "desc" },
            take: 20,
            select: {
              id: true,
              name: true,
              phone: true,
              status: true,
              note: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const groups = await Promise.all(
    centers.map(async c => {
      const listings = c.listings;
      const allLeads = listings.flatMap(l =>
        l.leads.map(ld => ({ ...ld, course: l.title })),
      );
      const totalLeads = await prisma.lead.count({
        where: { listing: { userId: c.id } },
      });
      const thisWeek = await prisma.lead.count({
        where: { listing: { userId: c.id }, createdAt: { gte: weekAgo } },
      });
      const firstCategory = listings[0]?.category.name ?? "—";
      return {
        id: c.id,
        name: c.name,
        city: "Toshkent", // placeholder — markaz jadvalida "city" yo'q, kelajakda qo'shiladi
        category: firstCategory,
        totalLeads,
        boughtThisWeek: thisWeek,
        leads: allLeads.map(l => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          course: l.course,
          status: l.status,
          time: l.createdAt,
        })),
      };
    }),
  );

  // Faqat e'loni bor markazlarni qaytaramiz
  return NextResponse.json({ centers: groups.filter(g => g.leads.length > 0 || g.totalLeads > 0) });
}
