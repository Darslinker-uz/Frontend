import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/kurslar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/hamkorlik`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/check`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
  ];

  try {
    const [categories, listings] = await Promise.all([
      prisma.category.findMany({ where: { active: true }, select: { slug: true } }),
      prisma.listing.findMany({
        where: { status: "active" },
        select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
      }),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map(c => ({
      url: `${SITE_URL}/kurslar/${c.slug}`,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const listingRoutes: MetadataRoute.Sitemap = listings.map(l => ({
      url: `${SITE_URL}/kurslar/${l.category.slug}/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...listingRoutes];
  } catch {
    return staticRoutes;
  }
}
