import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/kurslar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/manba`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/hamkorlik`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/check`, changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const [groups, categories, listings, articles, regions] = await Promise.all([
      prisma.categoryGroup.findMany({ where: { active: true }, select: { slug: true } }),
      prisma.category.findMany({
        where: { active: true, pendingApproval: false },
        select: { slug: true, group: { select: { slug: true } } },
      }),
      prisma.listing.findMany({
        where: {
          status: "active",
          category: { active: true, pendingApproval: false },
        },
        select: {
          slug: true,
          updatedAt: true,
          region: true, // legacy fallback
          branches: { select: { region: true } },
          category: { select: { slug: true } },
        },
      }),
      prisma.article.findMany({
        where: { status: "published" },
        select: { slug: true, updatedAt: true, type: true },
      }),
      // Region admin'da boshqariladi — disable qilingan viloyatlar sitemap'ga kirmaydi
      prisma.region.findMany({
        where: { active: true },
        select: { name: true, slug: true },
      }),
    ]);

    // Listing.region (text) → DB Region.name match qilamiz
    const regionByName = new Map(regions.map(r => [r.name, r]));

    // Tier-2: Guruh sahifalari
    const groupRoutes: MetadataRoute.Sitemap = groups.map(g => ({
      url: `${SITE_URL}/kurslar/g/${g.slug}`,
      changeFrequency: "daily",
      priority: 0.85,
    }));

    // Tier-2: Yo'nalish sahifalari
    const categoryRoutes: MetadataRoute.Sitemap = categories.map(c => ({
      url: `${SITE_URL}/kurslar/${c.slug}`,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    // E'lonning barcha unikal regionlari (yangi filiallar + eski region fallback)
    const listingRegions = (l: typeof listings[number]): string[] => {
      const set = new Set<string>();
      if (l.region) set.add(l.region);
      for (const b of l.branches ?? []) {
        if (b.region) set.add(b.region);
      }
      return Array.from(set);
    };

    // Tier-3: Yo'nalish + viloyat (faqat e'lon bor bo'lgan kombinatsiyalar)
    const categoryRegionPairs = new Set<string>();
    for (const l of listings) {
      for (const regionName of listingRegions(l)) {
        const r = regionByName.get(regionName);
        if (r) categoryRegionPairs.add(`${l.category.slug}|${r.slug}`);
      }
    }
    const categoryRegionRoutes: MetadataRoute.Sitemap = Array.from(categoryRegionPairs).map(pair => {
      const [catSlug, regSlug] = pair.split("|");
      return {
        url: `${SITE_URL}/kurslar/${catSlug}/joy/${regSlug}`,
        changeFrequency: "weekly",
        priority: 0.75,
      };
    });

    // Tier-3: Guruh + viloyat
    const groupRegionPairs = new Set<string>();
    for (const l of listings) {
      const cat = categories.find(c => c.slug === l.category.slug);
      if (!cat) continue;
      for (const regionName of listingRegions(l)) {
        const r = regionByName.get(regionName);
        if (r) groupRegionPairs.add(`${cat.group.slug}|${r.slug}`);
      }
    }
    const groupRegionRoutes: MetadataRoute.Sitemap = Array.from(groupRegionPairs).map(pair => {
      const [grpSlug, regSlug] = pair.split("|");
      return {
        url: `${SITE_URL}/kurslar/g/${grpSlug}/${regSlug}`,
        changeFrequency: "weekly",
        priority: 0.75,
      };
    });

    // E'lon detail
    const listingRoutes: MetadataRoute.Sitemap = listings.map(l => ({
      url: `${SITE_URL}/kurslar/${l.category.slug}/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // Manba (bilim hubi) maqolalari va blog postlari — turi bo'yicha alohida URL prefiksiga ajratamiz
    const manbaRoutes: MetadataRoute.Sitemap = articles
      .filter(a => a.type === "lugat" || a.type === "qollanma" || a.type === "sharh" || a.type === "savol")
      .map(a => ({
        url: `${SITE_URL}/manba/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly",
        priority: 0.65,
      }));

    const blogRoutes: MetadataRoute.Sitemap = articles
      .filter(a => a.type === "blog")
      .map(a => ({
        url: `${SITE_URL}/blog/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      }));

    return [...staticRoutes, ...groupRoutes, ...categoryRoutes, ...categoryRegionRoutes, ...groupRegionRoutes, ...listingRoutes, ...manbaRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
