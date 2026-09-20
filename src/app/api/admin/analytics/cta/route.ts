import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import type { PeriodId } from "@/lib/analytics-period";
import { getCtaStats } from "@/lib/cta-stats";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "30d") as PeriodId;
  return NextResponse.json(await getCtaStats(period));
}
