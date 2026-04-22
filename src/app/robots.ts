import type { MetadataRoute } from "next";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/dashboard", "/dashboard/*", "/api/*", "/auth"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
