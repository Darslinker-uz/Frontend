import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// /llms-full.txt — AI agentlar (ChatGPT, Claude, Perplexity) uchun
// to'liq sayt mazmuni bitta markdown faylda. AEO uchun yangi standart.
// llms.txt minimalist, llms-full.txt esa to'liq mazmun.
export async function GET() {
  const [groups, categories, articles, listings] = await Promise.all([
    prisma.categoryGroup.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { name: true, slug: true, description: true },
    }),
    prisma.category.findMany({
      where: { active: true, pendingApproval: false },
      orderBy: { order: "asc" },
      select: {
        name: true,
        slug: true,
        description: true,
        group: { select: { name: true, slug: true } },
        _count: { select: { listings: { where: { status: "active" } } } },
      },
    }),
    prisma.article.findMany({
      where: { status: "published" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        slug: true,
        title: true,
        type: true,
        excerpt: true,
        content: true,
        author: true,
        publishedAt: true,
      },
    }),
    prisma.listing.findMany({
      where: {
        status: "active",
        category: { active: true, pendingApproval: false },
      },
      orderBy: { views: "desc" },
      take: 200,
      select: {
        slug: true,
        title: true,
        description: true,
        format: true,
        region: true,
        location: true,
        price: true,
        category: { select: { name: true, slug: true } },
        user: { select: { centerName: true, name: true } },
      },
    }),
  ]);

  const lines: string[] = [];

  // Header
  lines.push("# Darslinker.uz — Full Site Content");
  lines.push("");
  lines.push("> O'zbekistondagi online va offline o'quv kurslarini bir joydan topish, solishtirish va to'g'ri tanlash uchun yagona aggregator platformasi. Quyida saytning to'liq mazmuni AI agentlar uchun strukturalashtirilgan markdown formatda.");
  lines.push("");
  lines.push(`**Sayt URL:** ${SITE_URL}`);
  lines.push(`**Til:** O'zbek (uz_UZ)`);
  lines.push(`**Geografiya:** O'zbekiston, 14 viloyat`);
  lines.push(`**Yangilangan:** ${new Date().toISOString().split("T")[0]}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // Groups
  lines.push("## Kurs guruhlari");
  lines.push("");
  for (const g of groups) {
    lines.push(`### ${g.name}`);
    lines.push("");
    lines.push(`**URL:** ${SITE_URL}/kurslar/g/${g.slug}`);
    if (g.description) {
      lines.push("");
      lines.push(g.description);
    }
    lines.push("");
  }
  lines.push("---");
  lines.push("");

  // Categories
  lines.push("## Yo'nalishlar (kategoriyalar)");
  lines.push("");
  for (const c of categories) {
    lines.push(`### ${c.name}`);
    lines.push(`- **Guruh:** ${c.group?.name ?? "—"}`);
    lines.push(`- **URL:** ${SITE_URL}/kurslar/${c.slug}`);
    lines.push(`- **Aktiv kurslar:** ${c._count.listings}`);
    if (c.description) {
      lines.push("");
      lines.push(c.description);
    }
    lines.push("");
  }
  lines.push("---");
  lines.push("");

  // Articles (Manba + Blog)
  if (articles.length > 0) {
    lines.push("## Maqolalar (Manba va Blog)");
    lines.push("");
    for (const a of articles) {
      const prefix = a.type === "blog" ? "/blog" : "/manba";
      const typeLabel: Record<string, string> = {
        lugat: "Lug'at",
        qollanma: "Qo'llanma",
        sharh: "Sharh",
        savol: "Savol",
        blog: "Blog",
      };
      lines.push(`### ${a.title}`);
      lines.push(`- **Turi:** ${typeLabel[a.type] ?? a.type}`);
      lines.push(`- **URL:** ${SITE_URL}${prefix}/${a.slug}`);
      if (a.author) lines.push(`- **Muallif:** ${a.author}`);
      if (a.publishedAt) lines.push(`- **Sana:** ${a.publishedAt.toISOString().split("T")[0]}`);
      lines.push("");
      if (a.excerpt) {
        lines.push(`> ${a.excerpt}`);
        lines.push("");
      }
      lines.push(a.content);
      lines.push("");
      lines.push("---");
      lines.push("");
    }
  }

  // Active listings (top 200)
  if (listings.length > 0) {
    lines.push("## Faol kurslar (top 200, ko'rishlar bo'yicha)");
    lines.push("");
    for (const l of listings) {
      const formatLabel: Record<string, string> = { offline: "Offline", online: "Online", video: "Video" };
      const provider = l.user?.centerName ?? l.user?.name ?? "—";
      const price = l.price === 0 ? "Bepul" : `${new Intl.NumberFormat("uz-UZ").format(l.price)} so'm`;
      lines.push(`### ${l.title}`);
      lines.push(`- **O'quv markaz:** ${provider}`);
      lines.push(`- **Yo'nalish:** ${l.category?.name ?? "—"}`);
      lines.push(`- **Format:** ${formatLabel[l.format] ?? l.format}`);
      lines.push(`- **Narx:** ${price}`);
      if (l.region) lines.push(`- **Viloyat:** ${l.region}`);
      if (l.location) lines.push(`- **Manzil:** ${l.location}`);
      lines.push(`- **URL:** ${SITE_URL}/kurslar/${l.category?.slug}/${l.slug}`);
      if (l.description && l.description.trim().length > 0) {
        lines.push("");
        lines.push(l.description);
      }
      lines.push("");
    }
  }

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
