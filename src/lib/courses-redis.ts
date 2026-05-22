/**
 * Barcha aktiv kurslar Redis cache — AI qidiruv uchun DB o'rniga.
 * DB → Redis sync: DB_TO_REDIS_PERIOD (default 300s).
 */

import { prisma } from "@/lib/prisma";
import { getRedis, isRedisConfigured } from "@/lib/redis";

export const REDIS_COURSES_KEY = "darslinker:courses:all";
export const REDIS_COURSES_META_KEY = "darslinker:courses:meta";

export type CachedCourse = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  format: string;
  duration: string | null;
  certificate: boolean;
  demoLesson: boolean;
  level: string | null;
  levels: string[];
  views: number;
  categoryName: string;
  categorySlug: string;
  groupSlug: string;
  centerName: string;
};

export type CoursesCacheMeta = {
  syncedAt: string;
  count: number;
};

let syncInFlight: Promise<{ count: number; source: "db" }> | null = null;
let schedulerStarted = false;

function getSyncPeriodMs(): number {
  const sec = parseInt(process.env.DB_TO_REDIS_PERIOD || "300", 10);
  return (Number.isFinite(sec) && sec > 0 ? sec : 300) * 1000;
}

async function loadActiveCoursesFromDb(): Promise<CachedCourse[]> {
  const rows = await prisma.listing.findMany({
    where: { status: "active", category: { active: true, pendingApproval: false } },
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      price: true,
      format: true,
      duration: true,
      certificate: true,
      demoLesson: true,
      level: true,
      levels: true,
      views: true,
      category: { select: { name: true, slug: true, group: { select: { slug: true } } } },
      user: { select: { centerName: true, name: true } },
    },
  });

  return rows.map(r => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    price: r.price,
    format: r.format,
    duration: r.duration,
    certificate: r.certificate,
    demoLesson: r.demoLesson,
    level: r.level,
    levels: r.levels,
    views: r.views,
    categoryName: r.category.name,
    categorySlug: r.category.slug,
    groupSlug: r.category.group.slug,
    centerName: r.user.centerName ?? r.user.name,
  }));
}

async function writeCoursesToRedis(courses: CachedCourse[]): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;

  const meta: CoursesCacheMeta = {
    syncedAt: new Date().toISOString(),
    count: courses.length,
  };

  await redis.set(REDIS_COURSES_KEY, JSON.stringify(courses));
  await redis.set(REDIS_COURSES_META_KEY, JSON.stringify(meta));
}

async function readCoursesFromRedis(): Promise<CachedCourse[] | null> {
  const redis = await getRedis();
  if (!redis) return null;

  const raw = await redis.get(REDIS_COURSES_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CachedCourse[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** DB dan o'qib Redis ga yozadi. */
export async function syncCoursesFromDbToRedis(): Promise<{ count: number; source: "db" }> {
  if (syncInFlight) return syncInFlight;

  syncInFlight = (async () => {
    const courses = await loadActiveCoursesFromDb();
    if (isRedisConfigured()) {
      await writeCoursesToRedis(courses);
      console.info(`[courses-redis] ${courses.length} ta kurs Redis ga yozildi`);
    } else {
      console.warn("[courses-redis] REDIS_URL yo'q — faqat DB dan yuklandi");
    }
    return { count: courses.length, source: "db" as const };
  })();

  try {
    return await syncInFlight;
  } finally {
    syncInFlight = null;
  }
}

/** AI va bot uchun — avval Redis, bo'sh bo'lsa sync. */
export async function getAllCachedCourses(): Promise<CachedCourse[]> {
  const fromRedis = await readCoursesFromRedis();
  if (fromRedis?.length) return fromRedis;

  const { count } = await syncCoursesFromDbToRedis();
  if (count === 0) return [];

  const afterSync = await readCoursesFromRedis();
  if (afterSync?.length) return afterSync;

  return loadActiveCoursesFromDb();
}

export async function getCachedCoursesByIds(ids: number[]): Promise<CachedCourse[]> {
  if (!ids.length) return [];
  const all = await getAllCachedCourses();
  const map = new Map(all.map(c => [c.id, c]));
  return ids.map(id => map.get(id)).filter((c): c is CachedCourse => Boolean(c));
}

export async function getCachedCourseById(id: number): Promise<CachedCourse | null> {
  const rows = await getCachedCoursesByIds([id]);
  return rows[0] ?? null;
}

export async function getCoursesCacheMeta(): Promise<CoursesCacheMeta | null> {
  const redis = await getRedis();
  if (!redis) return null;
  const raw = await redis.get(REDIS_COURSES_META_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CoursesCacheMeta;
  } catch {
    return null;
  }
}

/** Server ishga tushganda + har DB_TO_REDIS_PERIOD da sync. */
export function startCoursesSyncScheduler(): void {
  if (schedulerStarted) return;
  if (!isRedisConfigured()) {
    console.warn("[courses-redis] Scheduler o'chiq — REDIS_URL yo'q");
    return;
  }

  schedulerStarted = true;
  const periodMs = getSyncPeriodMs();

  void syncCoursesFromDbToRedis().catch(err => {
    console.error("[courses-redis] boshlang'ich sync xato:", err);
  });

  setInterval(() => {
    void syncCoursesFromDbToRedis().catch(err => {
      console.error("[courses-redis] reja sync xato:", err);
    });
  }, periodMs).unref?.();

  console.info(`[courses-redis] Scheduler ishga tushdi (${periodMs / 1000}s interval)`);
}

/** ai-shared scoring uchun qator */
export function cachedToAiRow(c: CachedCourse) {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    price: c.price,
    format: c.format,
    level: c.level,
    levels: c.levels,
    views: c.views,
    categoryName: c.categoryName,
    groupSlug: c.groupSlug,
    centerName: c.centerName,
  };
}
