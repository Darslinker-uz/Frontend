import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Star, HelpCircle, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";

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
type FilterType = ArticleType | "all";

interface Props {
  searchParams: Promise<{ type?: string }>;
}

function isArticleType(t: string | undefined): t is ArticleType {
  return t === "lugat" || t === "qollanma" || t === "sharh" || t === "savol";
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const t = sp.type;
  if (isArticleType(t)) {
    const label = TYPE_LABELS[t];
    const title = `${label} — Manba bilim hubi`;
    const description = `Darslinker.uz Manba bo'limida ${label.toLowerCase()}lar to'plami. Ta'lim, kasblar va kurslar bo'yicha foydali maqolalar.`;
    return {
      title,
      description,
      alternates: { canonical: `${SITE_URL}/manba?type=${t}` },
      openGraph: { type: "website", locale: "uz_UZ", url: `${SITE_URL}/manba?type=${t}`, siteName: "Darslinker.uz", title, description },
    };
  }
  const title = "Manba — bilim va qo'llanmalar";
  const description = "Darslinker Manba — ta'lim sohasi bo'yicha lug'at, qo'llanmalar, sharhlar va savol-javoblar to'plami.";
  return {
    title,
    description,
    keywords: ["manba", "bilim hubi", "qo'llanma", "lug'at", "sharh", "savol-javob", "ta'lim", "kurslar"],
    alternates: { canonical: `${SITE_URL}/manba` },
    openGraph: { type: "website", locale: "uz_UZ", url: `${SITE_URL}/manba`, siteName: "Darslinker.uz", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ManbaPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filter: FilterType = isArticleType(sp.type) ? sp.type : "all";

  // Manba listidan blog tipini chetlatamiz (ular /blog da ko'rinadi).
  const MANBA_TYPES: ArticleType[] = ["lugat", "qollanma", "sharh", "savol"];
  const where: { status: "published"; type?: ArticleType | { in: ArticleType[] } } = {
    status: "published",
    type: { in: MANBA_TYPES },
  };
  if (filter !== "all") where.type = filter;

  const articles = await prisma.article.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true, slug: true, title: true, excerpt: true, type: true,
      coverImage: true, views: true, publishedAt: true, createdAt: true,
    },
  });

  const tabs: { value: FilterType; label: string }[] = [
    { value: "all", label: "Hammasi" },
    { value: "lugat", label: "Lug'at" },
    { value: "qollanma", label: "Qo'llanmalar" },
    { value: "sharh", label: "Sharhlar" },
    { value: "savol", label: "Savollar" },
  ];

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": filter === "all" ? "Manba — bilim hubi" : `${TYPE_LABELS[filter]} — Manba`,
    "numberOfItems": articles.length,
    "itemListElement": articles.slice(0, 30).map((a, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${SITE_URL}/manba/${a.slug}`,
      "name": a.title,
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Manba", "item": `${SITE_URL}/manba` },
    ],
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-6 md:py-10">
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7ea2d4]/15 text-[#4a7ab5] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> Bilim hubi
          </div>
          <h1 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.02em]">
            Manba — bilim va qo&apos;llanmalar
          </h1>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2 max-w-[720px]">
            Ta&apos;lim sohasi bo&apos;yicha lug&apos;at, qadam-baqadam qo&apos;llanmalar, sharhlar va savol-javoblar to&apos;plami.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => {
            const active = filter === t.value;
            const href = t.value === "all" ? "/manba" : `/manba?type=${t.value}`;
            return (
              <Link
                key={t.value}
                href={href}
                className={`h-[34px] px-3.5 rounded-full text-[13px] font-medium flex items-center transition-all ${
                  active
                    ? "bg-[#16181a] text-white"
                    : "bg-white border border-[#e4e7ea] text-[#16181a]/70 hover:border-[#16181a]/30"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        {articles.length === 0 ? (
          <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-12 text-center">
            <BookOpen className="w-10 h-10 mx-auto text-[#7c8490] mb-3" />
            <p className="text-[15px] text-[#16181a] font-medium">Hozircha maqolalar yo&apos;q</p>
            <p className="text-[13px] text-[#7c8490] mt-1">
              Tez orada bu yerda yangi qo&apos;llanmalar va lug&apos;at maqolalari paydo bo&apos;ladi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {articles.map((a) => {
              const Icon = TYPE_ICONS[a.type as ArticleType];
              const gradient = TYPE_GRADIENTS[a.type as ArticleType];
              const label = TYPE_LABELS[a.type as ArticleType];
              return (
                <Link key={a.id} href={`/manba/${a.slug}`} className="group block">
                  <article className="rounded-[18px] bg-white border border-[#e4e7ea] hover:border-[#16181a]/20 hover:shadow-sm transition-all h-full flex flex-col overflow-hidden">
                    {/* Cover or gradient placeholder */}
                    {a.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.coverImage} alt={a.title} className="w-full h-[160px] object-cover" />
                    ) : (
                      <div className={`w-full h-[120px] bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <Icon className="w-9 h-9 text-white/90" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f0f2f3] text-[#16181a]/70 text-[10px] font-bold uppercase tracking-wider">
                          <Icon className="w-2.5 h-2.5" /> {label}
                        </span>
                      </div>
                      <h2 className="text-[16px] md:text-[17px] font-bold text-[#16181a] leading-tight line-clamp-2 group-hover:text-[#4a7ab5] transition-colors">
                        {a.title}
                      </h2>
                      {a.excerpt && (
                        <p className="text-[13px] text-[#7c8490] mt-2 leading-relaxed line-clamp-2 flex-1">
                          {a.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e4e7ea]">
                        <span className="text-[11px] text-[#7c8490]">
                          {formatDate(a.publishedAt ?? a.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#16181a]/70 group-hover:text-[#4a7ab5] transition-colors">
                          Ko&apos;proq <ArrowRight className="w-3.5 h-3.5" />
                        </span>
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
