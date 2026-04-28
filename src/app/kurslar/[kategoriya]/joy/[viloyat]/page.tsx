import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveListings, getActiveCategories } from "@/lib/listings";
import { findRegionBySlugDb, getActiveRegions } from "@/lib/regions";
import { KategoriyaClient } from "../../kategoriya-client";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

interface Props {
  params: Promise<{ kategoriya: string; viloyat: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategoriya, viloyat } = await params;
  const categories = await getActiveCategories();
  const cat = categories.find(c => c.slug === kategoriya);
  const region = await findRegionBySlugDb(viloyat);
  if (!cat || !region) return { title: "Sahifa topilmadi" };

  const url = `${SITE_URL}/kurslar/${kategoriya}/joy/${viloyat}`;
  const title = `${region.name}da ${cat.name.toLowerCase()} kursi — narxlar 2026`;
  const description = `${region.name}dagi ${cat.name.toLowerCase()} kurslari va o'quv markazlari. Narxlar, sharhlar, o'qituvchilar haqida ma'lumot. Ariza qoldiring.`;

  return {
    title,
    description,
    keywords: [
      `${region.name} ${cat.name.toLowerCase()}`,
      `${cat.name.toLowerCase()} ${region.name}`,
      `${cat.name.toLowerCase()} kursi ${region.name}`,
      cat.name, region.name, cat.groupName,
    ].filter(Boolean) as string[],
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "uz_UZ", url, siteName: "Darslinker.uz", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function KategoriyaViloyatPage({ params }: Props) {
  const { kategoriya, viloyat } = await params;
  const categories = await getActiveCategories();
  const cat = categories.find(c => c.slug === kategoriya);
  const region = await findRegionBySlugDb(viloyat);
  if (!cat || !region) notFound();

  // SEO landing — faqat shu viloyatdagi offline kurslar (online'larni global aralashtirmaymiz)
  const courses = await getActiveListings({ categorySlug: cat.slug, region: region.name, includeRemote: false });
  const url = `${SITE_URL}/kurslar/${kategoriya}/joy/${viloyat}`;

  // Tumanlar bo'yicha hisoblash
  const districtCounts = courses.reduce<Record<string, number>>((acc, c) => {
    if (c.district) acc[c.district] = (acc[c.district] ?? 0) + 1;
    return acc;
  }, {});
  const popularDistricts = region.districts
    .map(d => ({ name: d, count: districtCounts[d] ?? 0 }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count);

  // Boshqa viloyatlardagi shu kategoriya
  const allByCategory = await getActiveListings({ categorySlug: cat.slug });
  const otherRegionsCounts = allByCategory.reduce<Record<string, number>>((acc, c) => {
    if (c.region && c.region !== region.name) acc[c.region] = (acc[c.region] ?? 0) + 1;
    return acc;
  }, {});
  const allRegions = await getActiveRegions();
  const otherRegions = allRegions
    .filter(r => r.slug !== region.slug)
    .map(r => ({ ...r, count: otherRegionsCounts[r.name] ?? 0 }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${region.name}da ${cat.name} kurslari`,
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
      { "@type": "ListItem", "position": 3, "name": cat.name, "item": `${SITE_URL}/kurslar/${kategoriya}` },
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
          {cat.groupSlug && (
            <>
              <span className="text-[#16181a]/20">/</span>
              <Link href={`/kurslar/g/${cat.groupSlug}`} className="text-[#7ea2d4] hover:text-[#5b87c0]">{cat.groupName}</Link>
            </>
          )}
          <span className="text-[#16181a]/20">/</span>
          <Link href={`/kurslar/${kategoriya}`} className="text-[#7ea2d4] hover:text-[#5b87c0]">{cat.name}</Link>
          <span className="text-[#16181a]/20">/</span>
          <span className="text-[#7c8490]">{region.name}</span>
        </div>

        <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-7 mb-5">
          <h1 className="text-[24px] md:text-[32px] font-bold text-[#16181a] tracking-[-0.02em]">
            {region.name}da {cat.name.toLowerCase()} kurslari
          </h1>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2">
            <strong>{courses.length}</strong> ta aktiv kurs · {region.name} bo&apos;ylab
            {cat.desc ? ` · ${cat.desc}` : ""}
          </p>
        </div>

        {popularDistricts.length > 0 && (
          <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-6 mb-5">
            <h2 className="text-[16px] md:text-[18px] font-bold text-[#16181a] mb-3">
              {region.name === "Toshkent shahri" ? "Tumanlar bo'yicha" : "Shaharlar bo'yicha"}
            </h2>
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

        <h2 className="sr-only">{region.name} bo&apos;yicha kurslar ro&apos;yxati</h2>
        <KategoriyaClient kategoriya={kategoriya} allCourses={courses} />

        {otherRegions.length > 0 && (
          <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-6 mt-6">
            <h2 className="text-[16px] md:text-[18px] font-bold text-[#16181a] mb-3">
              Boshqa viloyatlarda {cat.name.toLowerCase()}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherRegions.map((r) => (
                <Link
                  key={r.slug}
                  href={`/kurslar/${kategoriya}/joy/${r.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f2f3] hover:bg-[#e4e7ea] text-[12px] text-[#16181a] transition-colors"
                >
                  {r.name}
                  <span className="text-[#7c8490]">({r.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
