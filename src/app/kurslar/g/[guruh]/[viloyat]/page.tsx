import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getActiveListings, getActiveCategoryGroups } from "@/lib/listings";
import { findRegionBySlugDb } from "@/lib/regions";
import { KurslarClient } from "../../../kurslar-client";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

interface Props {
  params: Promise<{ guruh: string; viloyat: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guruh, viloyat } = await params;
  const groups = await getActiveCategoryGroups();
  const g = groups.find(x => x.slug === guruh);
  const region = await findRegionBySlugDb(viloyat);
  if (!g || !region) return { title: "Sahifa topilmadi" };

  const url = `${SITE_URL}/kurslar/g/${guruh}/${viloyat}`;
  const title = `${region.name}da ${g.name.toLowerCase()} kurslari — narxlar, sharhlar`;
  const description = `${region.name}dagi ${g.name.toLowerCase()} bo'yicha eng yaxshi kurslar va o'quv markazlari. ${g.categories.slice(0, 3).map(c => c.name).join(", ")} va boshqalar.`;

  return {
    title,
    description,
    keywords: [
      `${region.name} ${g.name.toLowerCase()}`,
      ...g.categories.slice(0, 8).map(c => `${region.name} ${c.name.toLowerCase()}`),
      "kurslar", region.name,
    ],
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "uz_UZ", url, siteName: "Darslinker.uz", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function GuruhViloyatPage({ params }: Props) {
  const { guruh, viloyat } = await params;
  const groups = await getActiveCategoryGroups();
  const g = groups.find(x => x.slug === guruh);
  const region = await findRegionBySlugDb(viloyat);
  if (!g || !region) notFound();

  // SEO landing — faqat shu viloyatdagi offline kurslar (online'larni global aralashtirmaymiz)
  const courses = await getActiveListings({ groupSlug: g.slug, region: region.name, includeRemote: false });
  const url = `${SITE_URL}/kurslar/g/${guruh}/${viloyat}`;

  // Yo'nalishlar bo'yicha hisoblash
  const categoryCounts = courses.reduce<Record<string, number>>((acc, c) => {
    if (c.categorySlug) acc[c.categorySlug] = (acc[c.categorySlug] ?? 0) + 1;
    return acc;
  }, {});
  const popularCategories = g.categories
    .map(c => ({ ...c, count: categoryCounts[c.slug] ?? 0 }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);

  // Tumanlar bo'yicha — ko'p filialli e'lon har bir filial tumanida hisobga olinadi
  const districtCounts = courses.reduce<Record<string, number>>((acc, c) => {
    const dists = new Set<string>();
    if (c.district) dists.add(c.district);
    for (const b of c.branches ?? []) {
      if (b.district) dists.add(b.district);
    }
    for (const d of dists) acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});
  const popularDistricts = region.districts
    .map(d => ({ name: d, count: districtCounts[d] ?? 0 }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${region.name}dagi ${g.name} kurslari`,
    "numberOfItems": courses.length,
    "itemListElement": courses.slice(0, 30).map((c, i) => ({
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
      { "@type": "ListItem", "position": 3, "name": g.name, "item": `${SITE_URL}/kurslar/g/${guruh}` },
      { "@type": "ListItem", "position": 4, "name": region.name, "item": url },
    ],
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-5 md:py-8">
        <div className="flex items-center gap-2 text-[12px] mb-4 flex-wrap">
          <Link href="/" className="text-[#7ea2d4] hover:text-[#5b87c0]">Bosh</Link>
          <span className="text-[#16181a]/20">/</span>
          <Link href="/kurslar" className="text-[#7ea2d4] hover:text-[#5b87c0]">Kurslar</Link>
          <span className="text-[#16181a]/20">/</span>
          <Link href={`/kurslar/g/${guruh}`} className="text-[#7ea2d4] hover:text-[#5b87c0]">{g.name}</Link>
          <span className="text-[#16181a]/20">/</span>
          <span className="text-[#7c8490]">{region.name}</span>
        </div>

        <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-7 mb-5">
          <h1 className="text-[24px] md:text-[32px] font-bold text-[#16181a] tracking-[-0.02em]">
            {region.name}da {g.name.toLowerCase()} kurslari
          </h1>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2">
            <strong>{courses.length}</strong> ta aktiv kurs · {region.name} bo&apos;ylab
          </p>
        </div>

        {popularCategories.length > 0 && (
          <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-6 mb-5">
            <h2 className="text-[16px] md:text-[18px] font-bold text-[#16181a] mb-3">Yo&apos;nalishlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {popularCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/kurslar/${c.slug}/joy/${region.slug}`}
                  className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-[10px] bg-[#f0f2f3] hover:bg-[#e4e7ea] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#16181a] truncate">{c.name}</p>
                    <p className="text-[11px] text-[#7c8490]">{c.count} ta kurs</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7c8490] shrink-0 group-hover:text-[#16181a]" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {popularDistricts.length > 0 && (
          <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-6 mb-5">
            <h2 className="text-[16px] md:text-[18px] font-bold text-[#16181a] mb-3">{region.name === "Toshkent shahri" ? "Tumanlar" : "Shaharlar"}</h2>
            <div className="flex flex-wrap gap-2 text-[12px] text-[#16181a]">
              {popularDistricts.map((d) => (
                <span key={d.name} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#f0f2f3]">
                  {d.name}
                  <span className="text-[#7c8490]">({d.count})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <h2 className="sr-only">{region.name} bo&apos;yicha kurslar</h2>
        <KurslarClient initialCourses={courses} />
      </div>
    </div>
  );
}
