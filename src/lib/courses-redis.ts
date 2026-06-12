/**
 * Barcha aktiv kurslar Redis cache — AI qidiruv uchun DB o'rniga.
 * DB → Redis sync: DB_TO_REDIS_PERIOD (default 300s).
 */

// server-only guard — bypass for CLI scripts (bot-poll, sync-courses)
if (process.env.NEXT_RUNTIME && !process.env.SKIP_SERVER_ONLY) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("server-only");
}

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
  location: string | null;
  region: string | null;
  district: string | null;
  categoryName: string;
  categorySlug: string;
  groupName: string;
  groupSlug: string;
  centerName: string;
  /** listing_locations — viloyat filtrlari uchun */
  branchRegions: string[];
  branchDistricts: string[];
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
      location: true,
      region: true,
      district: true,
      category: {
        select: { name: true, slug: true, group: { select: { name: true, slug: true } } },
      },
      user: { select: { centerName: true, name: true } },
      branches: { select: { region: true, district: true } },
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
    location: r.location,
    region: r.region,
    district: r.district,
    categoryName: r.category.name,
    categorySlug: r.category.slug,
    groupName: r.category.group.name,
    groupSlug: r.category.group.slug,
    centerName: r.user.centerName ?? r.user.name,
    branchRegions: [
      ...new Set(
        [r.region, ...r.branches.map(b => b.region)].filter((x): x is string => Boolean(x))
      ),
    ],
    branchDistricts: [
      ...new Set(
        [r.district, ...r.branches.map(b => b.district)].filter((x): x is string => Boolean(x))
      ),
    ],
  }));
}

async function writeCoursesToRedis(courses: CachedCourse[]): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return false;

  const meta: CoursesCacheMeta = {
    syncedAt: new Date().toISOString(),
    count: courses.length,
  };

  await redis.set(REDIS_COURSES_KEY, JSON.stringify(courses));
  await redis.set(REDIS_COURSES_META_KEY, JSON.stringify(meta));
  return true;
}

async function readCoursesFromRedis(): Promise<CachedCourse[] | null> {
  const redis = await getRedis();
  if (!redis) return null;

  const raw = await redis.get(REDIS_COURSES_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CachedCourse>[];
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter((c): c is Partial<CachedCourse> & { id: number } => typeof c?.id === "number")
      .map(normalizeCachedCourse);
  } catch {
    return null;
  }
}

/** Eski Redis yozuvlari (maydonlar kengaytirilguncha) */
function normalizeCachedCourse(c: Partial<CachedCourse> & { id: number }): CachedCourse {
  return {
    id: c.id,
    title: c.title ?? "",
    slug: c.slug ?? "",
    description: c.description ?? null,
    price: c.price ?? 0,
    format: c.format ?? "offline",
    duration: c.duration ?? null,
    certificate: c.certificate ?? false,
    demoLesson: c.demoLesson ?? false,
    level: c.level ?? null,
    levels: c.levels ?? [],
    views: c.views ?? 0,
    location: c.location ?? null,
    region: c.region ?? null,
    district: c.district ?? null,
    categoryName: c.categoryName ?? "",
    categorySlug: c.categorySlug ?? "",
    groupName: c.groupName ?? "",
    groupSlug: c.groupSlug ?? "",
    centerName: c.centerName ?? "",
    branchRegions: c.branchRegions ?? (c.region ? [c.region] : []),
    branchDistricts: c.branchDistricts ?? (c.district ? [c.district] : []),
  };
}

/** DB dan o'qib Redis ga yozadi. */
export async function syncCoursesFromDbToRedis(): Promise<{ count: number; source: "db" }> {
  if (syncInFlight) return syncInFlight;

  syncInFlight = (async () => {
    const courses = await loadActiveCoursesFromDb();
    if (isRedisConfigured()) {
      const written = await writeCoursesToRedis(courses);
      if (written) {
        console.info(`[courses-redis] ${courses.length} ta kurs Redis ga yozildi`);
      }
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

/** Server ishga tushganda + har DB_TO_REDIS_PERIOD da sync (Redis bo'lsa). */
export async function startCoursesSyncScheduler(): Promise<void> {
  if (schedulerStarted) return;
  if (!isRedisConfigured()) {
    console.warn("[courses-redis] Scheduler o'chiq — REDIS_URL yo'q");
    return;
  }

  const redis = await getRedis();
  if (!redis) {
    console.warn("[courses-redis] Scheduler o'chiq — Redis ulanmadi (DB fallback)");
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
    slug: c.slug,
    description: c.description,
    price: c.price,
    format: c.format,
    duration: c.duration,
    level: c.level,
    levels: c.levels,
    views: c.views,
    location: c.location,
    region: c.region,
    district: c.district,
    categoryName: c.categoryName,
    categorySlug: c.categorySlug,
    groupName: c.groupName,
    groupSlug: c.groupSlug,
    centerName: c.centerName,
  };
}
