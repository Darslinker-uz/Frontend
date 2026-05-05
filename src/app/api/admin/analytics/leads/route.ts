import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { resolveRange, type PeriodId } from "@/lib/analytics-period";

export async function GET(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "30d") as PeriodId;
  const { start, end } = resolveRange(period);

  const dayAgo = new Date(Date.now() - 24 * 3600 * 1000);

  const [byStatus, total, deadLeads, perCenterRaw] = await Promise.all([
    prisma.lead.groupBy({
      by: ["status"],
      where: { createdAt: { gte: start, lt: end } },
      _count: { id: true },
    }),
    prisma.lead.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.lead.count({ where: { status: "new_lead", createdAt: { lt: dayAgo, gte: start } } }),
    prisma.lead.groupBy({
      by: ["listingId", "status"],
      where: { createdAt: { gte: start, lt: end } },
      _count: { id: true },
    }),
  ]);

  const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    new_lead: { label: "Yangi (javobsiz)", color: "#94a3b8" },
    contacted: { label: "Bog'lanildi", color: "#3b82f6" },
    callback: { label: "Qaytib aloqa", color: "#06b6d4" },
    converted: { label: "Muvaffaqiyatli", color: "#22c55e" },
    not_interested: { label: "Qiziqmadi", color: "#ef4444" },
    disputed: { label: "Bahsli", color: "#f59e0b" },
  };

  const statusBreakdown = byStatus.map(s => ({
    status: s.status,
    label: STATUS_CONFIG[s.status]?.label ?? s.status,
    color: STATUS_CONFIG[s.status]?.color ?? "#94a3b8",
    count: s._count.id,
    pct: total > 0 ? Number(((s._count.id / total) * 100).toFixed(2)) : 0,
  }));

  // Per-center performance: aggregate from listingId
  const listings = await prisma.listing.findMany({
    select: { id: true, userId: true, user: { select: { name: true, centerName: true } } },
  });
  const listingToCenter = new Map(listings.map(l => [l.id, { userId: l.userId, name: l.user?.centerName ?? l.user?.name ?? "—" }]));

  const centerStats = new Map<number, { name: string; total: number; converted: number; cancelled: number; pending: number }>();
  for (const row of perCenterRaw) {
    const c = listingToCenter.get(row.listingId);
    if (!c) continue;
    const prev = centerStats.get(c.userId) ?? { name: c.name, total: 0, converted: 0, cancelled: 0, pending: 0 };
    prev.total += row._count.id;
    if (row.status === "converted") prev.converted += row._count.id;
    else if (row.status === "not_interested") prev.cancelled += row._count.id;
    else if (row.status === "new_lead") prev.pending += row._count.id;
    centerStats.set(c.userId, prev);
  }

  const centers = Array.from(centerStats.entries())
    .map(([id, s]) => ({
      id,
      name: s.name,
      total: s.total,
      converted: s.converted,
      cancelled: s.cancelled,
      pending: s.pending,
      winRate: s.total > 0 ? Number(((s.converted / s.total) * 100).toFixed(1)) : 0,
      responseRate: s.total > 0 ? Number((((s.total - s.pending) / s.total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 50);

  return NextResponse.json({
    total,
    deadLeads,
    statusBreakdown,
    centers,
  });
}
