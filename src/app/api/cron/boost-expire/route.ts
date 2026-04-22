import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cron/boost-expire — transitions active boosts past endDate → ended
// Secured via X-Cron-Secret header. Call hourly via cron/systemd timer.
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const got = request.headers.get("x-cron-secret");
  if (!expected || got !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const result = await prisma.boost.updateMany({
    where: { status: "active", endDate: { lt: now } },
    data: { status: "ended" },
  });

  return NextResponse.json({ ok: true, ended: result.count });
}
