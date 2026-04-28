import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { estimateReadTime } from "@/lib/markdown";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "Blog — Darslinker.uz",
  description: "Kurslar, ta'lim, kasb va karera haqida foydali maqolalar. Darslinker.uz tahrir guruhi tomonidan tayyorlangan tahliliy postlar.",
  keywords: ["blog", "ta'lim blogi", "kurslar haqida", "kasb tanlash", "karera", "darslinker blog"],
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: `${SITE_URL}/blog`,
    siteName: "Darslinker.uz",
    title: "Blog — Darslinker.uz",
    description: "Kurslar, ta'lim, kasb va karera haqida foydali maqolalar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Darslinker.uz",
    description: "Kurslar, ta'lim, kasb va karera haqida foydali maqolalar.",
  },
};

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { status: "published", type: "blog" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      author: true,
      readTime: true,
      content: true,
      views: true,
      publishedAt: true,
      createdAt: true,
      category: { select: { id: true, name: true, slug: true } },
      group: { select: { id: true, name: true, slug: true } },
    },
  });

  // ItemList JSON-LD (post listing for rich results)
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": articles.map((a, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${SITE_URL}/blog/${a.slug}`,
      "name": a.title,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
    ],
  };

  // Blog (CollectionPage) JSON-LD with publisher
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Darslinker.uz Blog",
    "url": `${SITE_URL}/blog`,
    "description": "Kurslar, ta'lim va karera mavzusidagi maqolalar to'plami.",
    "publisher": {
      "@type": "Organization",
      "name": "Darslinker.uz",
      "url": SITE_URL,
    },
    "blogPost": articles.slice(0, 10).map((a) => ({
      "@type": "BlogPosting",
      "headline": a.title,
      "url": `${SITE_URL}/blog/${a.slug}`,
      "datePublished": (a.publishedAt ?? a.createdAt).toISOString(),
      "author": { "@type": "Person", "name": a.author ?? "Darslinker.uz" },
    })),
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] tracking-[-0.03em]">
            Blog
          </h1>
          <p className="text-[15px] md:text-[18px] text-[#7c8490] mt-2 font-light">
            Kurslar, ta&apos;lim va karera mavzusidagi tahliliy maqolalar
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-[20px] border-2 border-dashed border-[#e4e7ea] p-10 text-center">
            <p className="text-[15px] text-[#7c8490]">Hozircha maqolalar yo&apos;q. Tez orada chiqamiz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {articles.map((article) => {
              const readTime = article.readTime ?? estimateReadTime(article.content);
              const categoryLabel = article.category?.name ?? article.group?.name ?? "Maqola";
              return (
                <Link key={article.id} href={`/blog/${article.slug}`} className="group block">
                  <article className="rounded-[20px] border-2 border-[#e4e7ea] p-6 hover:border-[#16181a] transition-all duration-300 h-full flex flex-col bg-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c8490]">{categoryLabel}</span>
                    <h2 className="text-[19px] font-bold text-[#16181a] leading-tight mt-3">{article.title}</h2>
                    {article.excerpt && (
                      <p className="text-[14px] text-[#7c8490] mt-3 line-clamp-2 flex-1">{article.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#e4e7ea]">
                      <div className="flex items-center gap-3 text-[12px] text-[#7c8490]">
                        {article.publishedAt && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(article.publishedAt)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {readTime}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-[#e4e7ea] group-hover:border-[#16181a] flex items-center justify-center transition-all">
                        <ArrowRight className="w-4 h-4 text-[#7c8490] group-hover:text-[#16181a] transition-colors" />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
