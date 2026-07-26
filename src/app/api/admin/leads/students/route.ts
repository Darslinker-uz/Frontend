import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";

/**
 * Har bir markaz uchun qaytariladigan eng ko'p lead soni.
 *
 * Ilgari limit HAR E'LONGA 20 ta edi, `totalLeads` esa markazning to'liq soni —
 * shu sababli 5 ta e'loni bor markazda 100 tagacha lead ko'rinib, sarlavhada
 * boshqa raqam turardi. Endi limit markaz darajasida va UI'ga `shownLeads`
 * bilan birga qaytariladi, ya'ni ro'yxat kesilganini panel aniq ko'rsatadi.
 */
const LEADS_PER_CENTER = 100;

// GET /api/admin/leads/students
// Returns: centers grouped with their leads
export async function GET() {
  const deny = await requirePermission("lead.view");
  if (deny) return deny;

  const centers = await prisma.user.findMany({
    where: {
      role: { in: ["provider", "admin"] },
      listings: { some: {} },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      listings: {
        select: { category: { select: { name: true } } },
        take: 1,
      },
    },
  });

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const groups = await Promise.all(
    centers.map(async c => {
      // Leadlar markaz bo'yicha bitta so'rovda olinadi — e'lonlar bo'ylab
      // tarqalib ketmaydi, shuning uchun tartib va limit haqiqiy bo'ladi.
      const [leads, totalLeads, thisWeek] = await Promise.all([
        prisma.lead.findMany({
          where: { listing: { userId: c.id } },
          orderBy: { createdAt: "desc" },
          take: LEADS_PER_CENTER,
          select: {
            id: true,
            name: true,
            phone: true,
            status: true,
            note: true,
            createdAt: true,
            startTiming: true,
            preferredTimes: true,
            budget: true,
            listing: { select: { title: true } },
          },
        }),
        prisma.lead.count({ where: { listing: { userId: c.id } } }),
        prisma.lead.count({
          where: { listing: { userId: c.id }, createdAt: { gte: weekAgo } },
        }),
      ]);

      return {
        id: c.id,
        name: c.name,
        city: "Toshkent", // placeholder — markaz jadvalida "city" yo'q, kelajakda qo'shiladi
        category: c.listings[0]?.category.name ?? "—",
        totalLeads,
        shownLeads: leads.length,
        boughtThisWeek: thisWeek,
        leads: leads.map(l => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          course: l.listing.title,
          status: l.status,
          time: l.createdAt,
          startTiming: l.startTiming,
          preferredTimes: l.preferredTimes,
          budget: l.budget,
        })),
      };
    }),
  );

  // Faqat e'loni bor markazlarni qaytaramiz
  return NextResponse.json({ centers: groups.filter(g => g.totalLeads > 0) });
}
