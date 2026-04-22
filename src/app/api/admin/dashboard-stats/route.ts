import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

// GET /api/admin/dashboard-stats — aggregated stats for admin home page
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // ========== STATS CARDS ==========
  const [
    usersNow, usersPrev,
    listingsActive, listingsActivePrev,
    revenueThisMonth, revenueLastMonth,
    leadsNow, leadsConvertedNow, leadsPrev, leadsConvertedPrev,
  ] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.listing.count({ where: { status: "active" } }),
    prisma.listing.count({ where: { status: "active", createdAt: { lt: thirtyDaysAgo } } }),
    prisma.payment.aggregate({
      where: { status: "success", type: { not: "refund" }, createdAt: { gte: thisMonthStart } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "success", type: { not: "refund" }, createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
      _sum: { amount: true },
    }),
    prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo }, status: "converted" } }),
    prisma.lead.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.lead.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }, status: "converted" } }),
  ]);

  const totalUsers = await prisma.user.count();
  const conversionNow = leadsNow > 0 ? (leadsConvertedNow / leadsNow) * 100 : 0;
  const conversionPrev = leadsPrev > 0 ? (leadsConvertedPrev / leadsPrev) * 100 : 0;

  const delta = (now: number, prev: number) => {
    if (prev === 0) return now > 0 ? 100 : 0;
    return Math.round(((now - prev) / prev) * 100);
  };

  const revThis = revenueThisMonth._sum.amount ?? 0;
  const revLast = revenueLastMonth._sum.amount ?? 0;

  // ========== URGENT TASKS ==========
  const [pendingListings, newStudentLeads, newPartnerApps, newHelpReqs] = await Promise.all([
    prisma.listing.count({ where: { status: "pending" } }),
    prisma.lead.count({ where: { status: "new_lead" } }),
    prisma.partnerApplication.count({ where: { status: "new_app" } }),
    prisma.helpLead.count({ where: { status: "new_req" } }),
  ]);

  // ========== BOOSTS + TODAY ==========
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [aClassActive, bClassActive, boostRevenue, todayLeads, todayUsers, todayViews] = await Promise.all([
    prisma.boost.count({ where: { status: "active", type: "a_class" } }),
    prisma.boost.count({ where: { status: "active", type: "b_class" } }),
    prisma.payment.aggregate({
      where: { status: "success", type: "boost", createdAt: { gte: thisMonthStart } },
      _sum: { amount: true },
    }),
    prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.listing.aggregate({ _sum: { views: true } }),
  ]);

  // ========== RECENT ACTIVITY ==========
  // Mix recent events: new listings, payments, leads (top 8)
  const [recentListings, recentPayments, recentLeads, recentPartners] = await Promise.all([
    prisma.listing.findMany({
      orderBy: { createdAt: "desc" }, take: 5,
      select: { id: true, title: true, createdAt: true, user: { select: { name: true } } },
    }),
    prisma.payment.findMany({
      where: { status: "success" },
      orderBy: { createdAt: "desc" }, take: 5,
      select: { id: true, amount: true, type: true, createdAt: true, user: { select: { name: true } } },
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" }, take: 5,
      select: { id: true, name: true, createdAt: true, listing: { select: { title: true, user: { select: { name: true } } } } },
    }),
    prisma.partnerApplication.findMany({
      orderBy: { createdAt: "desc" }, take: 3,
      select: { id: true, centerName: true, createdAt: true },
    }),
  ]);

  type Activity = { type: string; time: string; user: string; action: string; detail?: string };
  const activity: Activity[] = [];
  const PAYMENT_LABEL: Record<string, string> = {
    topup: "Balans to'ldirdi",
    boost: "Boost to'lovi",
    lead: "Lead to'lovi",
    refund: "Refund",
  };
  for (const l of recentListings) {
    activity.push({
      type: "listing",
      time: l.createdAt.toISOString(),
      user: l.user?.name ?? "—",
      action: "Yangi e'lon qo'shdi",
      detail: l.title,
    });
  }
  for (const p of recentPayments) {
    activity.push({
      type: "payment",
      time: p.createdAt.toISOString(),
      user: p.user?.name ?? "—",
      action: PAYMENT_LABEL[p.type] ?? p.type,
      detail: `${new Intl.NumberFormat("uz-UZ").format(p.amount)} so'm`,
    });
  }
  for (const l of recentLeads) {
    activity.push({
      type: "lead",
      time: l.createdAt.toISOString(),
      user: l.name,
      action: `${l.listing.user?.name ?? "Markaz"}'ga lead qoldirdi`,
      detail: l.listing.title,
    });
  }
  for (const p of recentPartners) {
    activity.push({
      type: "partner",
      time: p.createdAt.toISOString(),
      user: p.centerName,
      action: "Hamkorlik so'radi",
    });
  }
  activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  const recentActivity = activity.slice(0, 8);

  return NextResponse.json({
    stats: {
      users: { total: totalUsers, delta: delta(usersNow, usersPrev) },
      listings: { active: listingsActive, delta: delta(listingsActive, listingsActivePrev) },
      revenue: { thisMonth: revThis, delta: delta(revThis, revLast) },
      conversion: { rate: Math.round(conversionNow * 10) / 10, delta: Math.round(conversionNow - conversionPrev) },
    },
    urgent: {
      pendingListings,
      newStudentLeads,
      newPartnerApps,
      newHelpReqs,
    },
    boosts: {
      aClass: aClassActive,
      bClass: bClassActive,
      monthlyRevenue: boostRevenue._sum.amount ?? 0,
    },
    today: {
      leads: todayLeads,
      users: todayUsers,
      totalViews: todayViews._sum.views ?? 0,
    },
    recentActivity,
  });
}
