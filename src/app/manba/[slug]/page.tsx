import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Star, HelpCircle, Eye, Calendar, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { renderMarkdown, stripMd } from "@/lib/markdown";
import { ScrollToTop } from "@/components/scroll-to-top";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

const TYPE_LABELS = {
  lugat: "Lug'at",
  qollanma: "Qo'llanma",
  sharh: "Sharh",
  savol: "Savol",
} as const;

const TYPE_ICONS = {
  lugat: BookOpen,
  qollanma: GraduationCap,
  sharh: Star,
  savol: HelpCircle,
} as const;

const TYPE_GRADIENTS = {
  lugat: "from-[#7ea2d4] to-[#4a7ab5]",
  qollanma: "from-[#22c55e] to-[#16a34a]",
  sharh: "from-[#f59e0b] to-[#d97706]",
  savol: "from-[#a855f7] to-[#7c3aed]",
} as const;

type ArticleType = keyof typeof TYPE_LABELS;

interface Props {
  params: Promise<{ slug: string }>;
}

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, status: "published" },
    select: { title: true, excerpt: true, content: true, coverImage: true, type: true, publishedAt: true, updatedAt: true },
  });
  if (!article) return { title: "Topilmadi" };

  const description = (article.excerpt && article.excerpt.trim().length > 0)
    ? article.excerpt
    : stripMd(article.content).slice(0, 155);

  const url = `${SITE_URL}/manba/${slug}`;
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
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ManbaArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, status: "published" },
    include: {
      category: { select: { id: true, name: true, slug: true, group: { select: { name: true, slug: true } } } },
      group: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!article) notFound();

  // Fire-and-forget view increment
  prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } })
    .catch((e) => console.error("[manba/page] view increment failed", e));

  // Related articles (same type)
  const related = await prisma.article.findMany({
    where: { status: "published", type: article.type, NOT: { id: article.id } },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 6,
    select: { id: true, slug: true, title: true, excerpt: true, type: true, coverImage: true, publishedAt: true, createdAt: true },
  });

  const t = article.type as ArticleType;
  const Icon = TYPE_ICONS[t];
  const label = TYPE_LABELS[t];
  const gradient = TYPE_GRADIENTS[t];
  const url = `${SITE_URL}/manba/${article.slug}`;
  const description = (article.excerpt && article.excerpt.trim().length > 0)
    ? article.excerpt
    : stripMd(article.content).slice(0, 200);

  // Schema markup
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Manba", "item": `${SITE_URL}/manba` },
      { "@type": "ListItem", "position": 3, "name": label, "item": `${SITE_URL}/manba?type=${t}` },
      { "@type": "ListItem", "position": 4, "name": article.title, "item": url },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": description,
    "image": article.coverImage ? [article.coverImage] : undefined,
    "datePublished": article.publishedAt?.toISOString(),
    "dateModified": article.updatedAt.toISOString(),
    "author": { "@type": "Organization", "name": "Darslinker.uz" },
    "publisher": { "@type": "Organization", "name": "Darslinker.uz", "url": SITE_URL },
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
  };

  let typeSpecificLd: Record<string, unknown> | null = null;
  if (t === "lugat") {
    typeSpecificLd = {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": article.title,
      "description": description,
      "url": url,
    };
  } else if (t === "qollanma") {
    // G — boyitilgan HowTo: H2 sarlavhalar step sifatida ekstraktsiya qilinadi
    const stepHeadings = Array.from(article.content.matchAll(/^##\s+(.+)$/gm)).map((m) => m[1].trim());
    typeSpecificLd = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": article.title,
      "description": description,
      "url": url,
      ...(article.coverImage && { "image": article.coverImage }),
      "totalTime": "PT15M",
      ...(stepHeadings.length > 0 && {
        "step": stepHeadings.map((h, i) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "name": h,
          "url": `${url}#step-${i + 1}`,
        })),
      }),
    };
  } else if (t === "savol") {
    typeSpecificLd = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      "mainEntity": {
        "@type": "Question",
        "name": article.title,
        "text": description,
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": stripMd(article.content).slice(0, 500),
          "url": url,
        },
      },
      // H — Speakable: voice search uchun
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2"],
      },
    };
  }

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <ScrollToTop />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {typeSpecificLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(typeSpecificLd) }} />
      )}

      <div className="max-w-[820px] mx-auto px-5 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-[12px] text-[#7c8490] mb-5 flex-wrap">
          <Link href="/" className="hover:text-[#16181a] transition-colors">Bosh</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/manba" className="hover:text-[#16181a] transition-colors">Manba</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/manba?type=${t}`} className="hover:text-[#16181a] transition-colors">{label}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#16181a]/70 line-clamp-1">{article.title}</span>
        </nav>

        <article className="rounded-[18px] bg-white border border-[#e4e7ea] overflow-hidden">
          {/* Cover */}
          {article.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.coverImage} alt={article.title} className="w-full h-[200px] md:h-[320px] object-cover" />
          ) : (
            <div className={`w-full h-[140px] md:h-[180px] bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <Icon className="w-12 h-12 text-white/90" />
            </div>
          )}

          <div className="px-6 md:px-10 py-7 md:py-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f0f2f3] text-[#16181a]/70 text-[11px] font-bold uppercase tracking-wider">
                <Icon className="w-3 h-3" /> {label}
              </span>
            </div>

            <h1 className="text-[26px] md:text-[36px] font-bold text-[#16181a] leading-[1.2] tracking-[-0.02em]">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-[12px] md:text-[13px] text-[#7c8490]">
              {article.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(article.publishedAt)}
                </span>
              )}
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

            {/* Cross-link */}
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
              Boshqa {label.toLowerCase()}lar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((a) => {
                const RelIcon = TYPE_ICONS[a.type as ArticleType];
                const relLabel = TYPE_LABELS[a.type as ArticleType];
                return (
                  <Link key={a.id} href={`/manba/${a.slug}`} className="group block">
                    <div className="rounded-[14px] bg-white border border-[#e4e7ea] p-4 hover:border-[#16181a]/20 transition-all h-full">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f0f2f3] text-[#16181a]/70 text-[10px] font-bold uppercase tracking-wider mb-2">
                        <RelIcon className="w-2.5 h-2.5" /> {relLabel}
                      </span>
                      <h3 className="text-[15px] font-bold text-[#16181a] leading-tight line-clamp-2 group-hover:text-[#4a7ab5] transition-colors">
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="text-[12px] text-[#7c8490] mt-2 line-clamp-2 leading-relaxed">
                          {a.excerpt}
                        </p>
                      )}
                    </div>
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
