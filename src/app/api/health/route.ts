import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/health — used by monitoring / nginx upstream health check
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, ts: Date.now() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "db_error" },
      { status: 503 },
    );
  }
}
