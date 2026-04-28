import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft, Calendar, Eye, ChevronRight, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { renderMarkdown, stripMd, estimateReadTime } from "@/lib/markdown";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, type: "blog", status: "published" },
    select: { title: true, excerpt: true, content: true, coverImage: true, author: true, publishedAt: true, updatedAt: true },
  });
  if (!article) return { title: "Topilmadi" };

  const description = (article.excerpt && article.excerpt.trim().length > 0)
    ? article.excerpt
    : stripMd(article.content).slice(0, 155);

  const url = `${SITE_URL}/blog/${slug}`;
  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "uz_UZ",
      url,
      siteName: "Darslinker.uz",
      title: article.title,
      description,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, type: "blog", status: "published" },
    include: {
      category: { select: { id: true, name: true, slug: true, group: { select: { name: true, slug: true } } } },
      group: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!article) notFound();

  // Fire-and-forget view increment
  prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } })
    .catch((e) => console.error("[blog/page] view increment failed", e));

  // Related blog posts
  const related = await prisma.article.findMany({
    where: { status: "published", type: "blog", NOT: { id: article.id } },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 4,
    select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, author: true, readTime: true, content: true, publishedAt: true, createdAt: true },
  });

  const url = `${SITE_URL}/blog/${article.slug}`;
  const description = (article.excerpt && article.excerpt.trim().length > 0)
    ? article.excerpt
    : stripMd(article.content).slice(0, 200);
  const readTime = article.readTime ?? estimateReadTime(article.content);
  const author = article.author ?? "Darslinker.uz";
  const categoryLabel = article.category?.name ?? article.group?.name ?? "Blog";

  // Schema markup — BlogPosting (richer than Article for blog content)
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": url },
    ],
  };

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": description,
    "image": article.coverImage ? [article.coverImage] : undefined,
    "datePublished": (article.publishedAt ?? article.createdAt).toISOString(),
    "dateModified": article.updatedAt.toISOString(),
    "author": { "@type": "Person", "name": author },
    "publisher": {
      "@type": "Organization",
      "name": "Darslinker.uz",
      "url": SITE_URL,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/favicon-96x96.png` },
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "articleSection": categoryLabel,
    "wordCount": stripMd(article.content).split(/\s+/).length,
    "inLanguage": "uz-UZ",
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }} />

      <div className="max-w-[820px] mx-auto px-5 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-[12px] text-[#7c8490] mb-5 flex-wrap">
          <Link href="/" className="hover:text-[#16181a] transition-colors">Bosh</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-[#16181a] transition-colors">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#16181a]/70 line-clamp-1">{article.title}</span>
        </nav>

        <Link href="/blog" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6 hover:text-[#4a7ab5] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Blog
        </Link>

        <article className="rounded-[18px] bg-white border border-[#e4e7ea] overflow-hidden">
          {/* Cover */}
          {article.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.coverImage} alt={article.title} className="w-full h-[200px] md:h-[320px] object-cover" />
          )}

          <div className="px-6 md:px-10 py-7 md:py-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7ea2d4]">{categoryLabel}</span>
            <h1 className="text-[26px] md:text-[38px] font-bold text-[#16181a] leading-[1.2] tracking-[-0.02em] mt-3">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 text-[12px] md:text-[13px] text-[#7c8490]">
              <span className="font-medium text-[#16181a]/70">{author}</span>
              {article.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(article.publishedAt)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {readTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> {article.views} ko&apos;rishlar
              </span>
            </div>

            {article.excerpt && (
              <p className="text-[15px] md:text-[17px] text-[#16181a]/70 leading-relaxed mt-5 pb-5 border-b border-[#e4e7ea]">
                {article.excerpt}
              </p>
            )}

            <div
              className="mt-6"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
            />

            {/* Cross-link to taxonomy */}
            {(article.category || article.group) && (
              <div className="mt-8 pt-6 border-t border-[#e4e7ea]">
                <p className="text-[12px] font-bold text-[#7c8490] uppercase tracking-wider mb-2">
                  Tegishli yo&apos;nalish
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.category && (
                    <Link
                      href={`/kurslar/${article.category.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7ea2d4]/10 text-[#4a7ab5] text-[13px] font-medium hover:bg-[#7ea2d4]/20 transition-colors"
                    >
                      {article.category.name} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  {article.group && (
                    <Link
                      href={`/kurslar/g/${article.group.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f2f3] text-[#16181a]/70 text-[13px] font-medium hover:bg-[#e4e7ea] transition-colors"
                    >
                      {article.group.name} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] tracking-[-0.01em] mb-4">
              Boshqa maqolalar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((a) => {
                const relRead = a.readTime ?? estimateReadTime(a.content);
                return (
                  <Link key={a.id} href={`/blog/${a.slug}`} className="group block">
                    <article className="rounded-[14px] bg-white border border-[#e4e7ea] p-5 hover:border-[#16181a]/20 transition-all h-full">
                      <h3 className="text-[15px] font-bold text-[#16181a] leading-tight line-clamp-2 group-hover:text-[#4a7ab5] transition-colors">
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="text-[12px] text-[#7c8490] mt-2 line-clamp-2 leading-relaxed">
                          {a.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-3 text-[11px] text-[#7c8490]">
                        {a.publishedAt && <span>{formatDate(a.publishedAt)}</span>}
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {relRead}</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
