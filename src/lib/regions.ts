// DB-driven region helpers. Static regions.ts hali listing form'lar va
// district'lar uchun ishlatiladi (DB'da district yo'q). SEO route'lar va
// sitemap esa DB'dan o'qiydi — admin yangi viloyat qo'shsa avtomatik SEO ushlaydi.

import { prisma } from "@/lib/prisma";
import { REGIONS } from "@/data/regions";

export interface DbRegion {
  id: number;
  name: string;
  slug: string;
  active: boolean;
  featured: boolean;
  order: number;
  // Static regions.ts'dan join qilingan (DB'da yo'q hozircha)
  districts: string[];
}

function attachDistricts<T extends { name: string }>(r: T): T & { districts: string[] } {
  const staticMatch = REGIONS.find((s) => s.name === r.name);
  return { ...r, districts: staticMatch?.districts ?? [] };
}

// Aktiv viloyatlar ro'yxati (sitemap, region landing pages uchun).
export async function getActiveRegions(): Promise<DbRegion[]> {
  const rows = await prisma.region.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      active: true,
      featured: true,
      order: true,
    },
  });
  return rows.map(attachDistricts);
}

// Slug bo'yicha viloyatni topish (SEO route validation).
// Faqat aktiv viloyatlar qaytariladi — disable qilingan viloyat URL'lari 404 chiqaradi.
export async function findRegionBySlugDb(slug: string): Promise<DbRegion | null> {
  if (!slug) return null;
  const region = await prisma.region.findFirst({
    where: { slug, active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      active: true,
      featured: true,
      order: true,
    },
  });
  return region ? attachDistricts(region) : null;
}
