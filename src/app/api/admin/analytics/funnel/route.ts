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

  // Funnel stages — period-filtered using ViewEvent table
  const [views, leadsTotal, leadsContacted, leadsSuccess, leadsCancelled] = await Promise.all([
    prisma.viewEvent.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.lead.count({ where: { createdAt: { gte: start, lt: end } } }),
    prisma.lead.count({ where: { createdAt: { gte: start, lt: end }, status: { in: ["contacted", "callback", "converted", "disputed"] } } }),
    prisma.lead.count({ where: { createdAt: { gte: start, lt: end }, status: "converted" } }),
    prisma.lead.count({ where: { createdAt: { gte: start, lt: end }, status: "not_interested" } }),
  ]);

  const stages = [
    { key: "views", label: "E'lon ko'rishlari", count: views },
    { key: "leads", label: "Ariza yuborildi", count: leadsTotal },
    { key: "contacted", label: "Markaz bog'landi", count: leadsContacted },
    { key: "success", label: "Muvaffaqiyatli (success)", count: leadsSuccess },
  ];

  // Compute pct relative to first stage
  const first = stages[0].count || 1;
  const stagesWithPct = stages.map((s, i) => ({
    ...s,
    pct: Number(((s.count / first) * 100).toFixed(2)),
    dropPct: i > 0 ? Number((((stages[i - 1].count - s.count) / (stages[i - 1].count || 1)) * 100).toFixed(2)) : 0,
  }));

  return NextResponse.json({
    stages: stagesWithPct,
    summary: {
      viewToLead: views > 0 ? Number(((leadsTotal / views) * 100).toFixed(3)) : 0,
      leadToContact: leadsTotal > 0 ? Number(((leadsContacted / leadsTotal) * 100).toFixed(2)) : 0,
      leadToSuccess: leadsTotal > 0 ? Number(((leadsSuccess / leadsTotal) * 100).toFixed(2)) : 0,
      cancelled: leadsCancelled,
    },
  });
}
