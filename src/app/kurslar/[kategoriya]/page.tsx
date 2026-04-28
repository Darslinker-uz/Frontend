import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { getActiveListings, getActiveCategories, getActiveCategoryGroups } from "@/lib/listings";
import { getActiveRegions } from "@/lib/regions";
import { KategoriyaClient } from "./kategoriya-client";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

type Props = {
  params: Promise<{ kategoriya: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategoriya } = await params;
  const categories = await getActiveCategories();
  const cat = categories.find(c => c.slug === kategoriya);
  if (!cat) {
    return { title: "Kategoriya topilmadi" };
  }
  const url = `${SITE_URL}/kurslar/${kategoriya}`;
  const title = `${cat.name} kurslari — O'zbekiston bo'yicha eng yaxshi markazlar`;
  const description = cat.desc
    ? `${cat.desc}. ${cat.count} ta aktiv kurs. Darslinker.uz orqali ${cat.name.toLowerCase()} bo'yicha o'quv markazlarini toping, solishtiring va ariza qoldiring.`
    : `${cat.name} bo'yicha O'zbekistondagi ${cat.count} ta kurs va o'quv markazlarini bir joyda ko'ring, solishtiring va ariza qoldiring.`;

  return {
    title,
    description,
    keywords: [cat.name, `${cat.name} kursi`, `${cat.name} kurslari`, `${cat.name} o'quv markaz`, cat.groupName, "o'zbekiston", "toshkent"].filter(Boolean) as string[],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "uz_UZ",
      url,
      siteName: "Darslinker.uz",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function KategoriyaPage({ params }: Props) {
  const { kategoriya } = await params;
  const [allCourses, categories, groupsAll, regionsAll] = await Promise.all([
    getActiveListings(),
    getActiveCategories(),
    getActiveCategoryGroups(),
    getActiveRegions(),
  ]);
  const cat = categories.find(c => c.slug === kategoriya);
  if (!cat) notFound();

  // Filter komponenti uchun (Guruh → Yo'nalish, kursi bor bo'lganlari)
  const filterGroups = groupsAll.map(g => ({
    name: g.name,
    slug: g.slug,
    categories: g.categories.filter(c => c.count > 0).map(c => ({ name: c.name, slug: c.slug, count: c.count })),
  })).filter(g => g.categories.length > 0);
  const filterRegions = regionsAll.map(r => ({ name: r.name, slug: r.slug }));

  const scoped = allCourses.filter(c => c.categorySlug === kategoriya);
  const url = `${SITE_URL}/kurslar/${kategoriya}`;

  // Viloyat bo'yicha hisoblash — har viloyat uchun e'lon soni
  const regionsCount = scoped.reduce<Record<string, number>>((acc, c) => {
    if (c.region) acc[c.region] = (acc[c.region] ?? 0) + 1;
    return acc;
  }, {});
  const popularRegions = regionsAll
    .map(r => ({ ...r, count: regionsCount[r.name] ?? 0 }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${cat.name} kurslari`,
    "description": cat.desc || `${cat.name} bo'yicha O'zbekistondagi kurslar`,
    "numberOfItems": scoped.length,
    "itemListElement": scoped.slice(0, 30).map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${SITE_URL}/kurslar/${c.categorySlug}/${c.slug}`,
      "name": c.title,
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Kurslar", "item": `${SITE_URL}/kurslar` },
      { "@type": "ListItem", "position": 3, "name": cat.name, "item": url },
    ],
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-5">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#16181a] mb-4 md:hidden">{cat.name}</h1>
        <h1 className="sr-only">{cat.name} kurslari — {scoped.length} ta aktiv kurs</h1>

        {cat.desc && (
          <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-6 mb-5">
            <p className="text-[14px] md:text-[15px] text-[#16181a]/75 leading-relaxed">{cat.desc}</p>
          </div>
        )}

        {popularRegions.length > 0 && (
          <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-6 mb-5">
            <h2 className="text-[16px] md:text-[18px] font-bold text-[#16181a] mb-3">Viloyat bo&apos;yicha</h2>
            <div className="flex flex-wrap gap-2">
              {popularRegions.map((r) => (
                <Link
                  key={r.slug}
                  href={`/kurslar/${kategoriya}/joy/${r.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f2f3] hover:bg-[#e4e7ea] text-[12px] text-[#16181a] transition-colors"
                >
                  <MapPin className="w-3 h-3 text-[#7ea2d4]" />
                  {r.name}
                  <span className="text-[#7c8490]">({r.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <KategoriyaClient
          kategoriya={kategoriya}
          allCourses={allCourses}
          groups={filterGroups}
          regions={filterRegions}
        />
      </div>
    </div>
  );
}
