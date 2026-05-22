import { NextResponse } from "next/server";
import { getCoursesCacheMeta, syncCoursesFromDbToRedis } from "@/lib/courses-redis";

// GET /api/cron/sync-courses — DB → Redis kurslar sync
// curl -H "X-Cron-Secret: $CRON_SECRET" http://localhost:3000/api/cron/sync-courses
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const got = request.headers.get("x-cron-secret");
  if (!expected || got !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncCoursesFromDbToRedis();
  const meta = await getCoursesCacheMeta();

  return NextResponse.json({
    ok: true,
    count: result.count,
    syncedAt: meta?.syncedAt ?? null,
  });
}
