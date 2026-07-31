import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { estimateReadTime } from "@/lib/markdown";
import { STATIC_BLOG_POSTS, formatUzDate } from "@/data/static-blog-posts";

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

type BlogCard = {
  slug: string;
  /** ISO sana (YYYY-MM-DD) — saralash uchun */
  date: string;
  title: string;
  excerpt: string;
  category: string;
  readTime?: string;
};

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

  // Kod ichidagi static postlar va DB maqolalari bitta ro'yxatga birlashtiriladi,
  // so'ng nashr sanasi bo'yicha yangidan eskiga saralanadi — eng yangi post doim tepada.
  const posts: BlogCard[] = [
    ...STATIC_BLOG_POSTS,
    ...articles.map((a) => ({
      slug: a.slug,
      date: (a.publishedAt ?? a.createdAt).toISOString().slice(0, 10),
      title: a.title,
      excerpt: a.excerpt ?? "",
      category: a.category?.name ?? a.group?.name ?? "Maqola",
      readTime: a.readTime ?? estimateReadTime(a.content),
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  // ItemList JSON-LD (post listing for rich results)
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": posts.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${SITE_URL}/blog/${p.slug}`,
      "name": p.title,
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
    "blogPost": posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      "headline": p.title,
      "url": `${SITE_URL}/blog/${p.slug}`,
      "datePublished": p.date,
      "author": { "@type": "Organization", "name": "Darslinker.uz" },
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

        {/* Static va DB postlari bitta ro'yxatda — nashr sanasi bo'yicha yangidan eskiga */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="rounded-[20px] border-2 border-[#e4e7ea] p-6 hover:border-[#16181a] transition-all duration-300 h-full flex flex-col bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c8490]">{post.category}</span>
                <h2 className="text-[19px] font-bold text-[#16181a] leading-tight mt-3">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-[14px] text-[#7c8490] mt-3 line-clamp-2 flex-1">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#e4e7ea]">
                  <div className="flex items-center gap-3 text-[12px] text-[#7c8490]">
                    <time dateTime={post.date} className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatUzDate(post.date)}
                    </time>
                    {post.readTime && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[#e4e7ea] group-hover:border-[#16181a] flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4 text-[#7c8490] group-hover:text-[#16181a] transition-colors" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
