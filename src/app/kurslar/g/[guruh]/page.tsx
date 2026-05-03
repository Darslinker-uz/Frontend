import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { getActiveListings, getActiveCategoryGroups } from "@/lib/listings";
import { getActiveRegions } from "@/lib/regions";
import { KurslarClient } from "../../kurslar-client";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

interface Props {
  params: Promise<{ guruh: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guruh } = await params;
  const groups = await getActiveCategoryGroups();
  const g = groups.find(x => x.slug === guruh);
  if (!g) return { title: "Guruh topilmadi" };

  const url = `${SITE_URL}/kurslar/g/${guruh}`;
  const title = `${g.name} kurslari — ${g.listingsCount}+ ta kurs O'zbekistonda`;
  const description = `${g.name} bo'yicha O'zbekistondagi barcha kurslar va o'quv markazlari. ${g.categories.slice(0, 5).map(c => c.name).join(", ")} va boshqalar. Narxlar, sharhlar, manzil bo'yicha qidiring.`;

  return {
    title,
    description,
    keywords: [g.name, ...g.categories.slice(0, 10).map(c => c.name), "kurslar", "o'zbekiston", "o'quv markaz"],
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

export default async function GuruhPage({ params }: Props) {
  const { guruh } = await params;
  const groups = await getActiveCategoryGroups();
  const g = groups.find(x => x.slug === guruh);
  if (!g) notFound();

  const courses = await getActiveListings({ groupSlug: g.slug });
  const url = `${SITE_URL}/kurslar/g/${guruh}`;

  // Viloyatlar bo'yicha hisoblash — ko'p filialli e'lon har bir filial viloyatida hisobga olinadi
  const regionsCount = courses.reduce<Record<string, number>>((acc, c) => {
    const regs = new Set<string>();
    if (c.region) regs.add(c.region);
    for (const b of c.branches ?? []) {
      if (b.region) regs.add(b.region);
    }
    for (const r of regs) acc[r] = (acc[r] ?? 0) + 1;
    return acc;
  }, {});
  const allRegions = await getActiveRegions();
  const popularRegions = allRegions
    .map(r => ({ ...r, count: regionsCount[r.name] ?? 0 }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // JSON-LD: ItemList + Breadcrumb + CollectionPage
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${g.name} kurslari`,
    "description": g.desc,
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
      { "@type": "ListItem", "position": 3, "name": g.name, "item": url },
    ],
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-5 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] mb-4">
          <Link href="/" className="text-[#7ea2d4] hover:text-[#5b87c0] transition-colors">Bosh</Link>
          <span className="text-[#16181a]/20">/</span>
          <Link href="/kurslar" className="text-[#7ea2d4] hover:text-[#5b87c0] transition-colors">Kurslar</Link>
          <span className="text-[#16181a]/20">/</span>
          <span className="text-[#7c8490]">{g.name}</span>
        </div>

        {/* Hero */}
        <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-7 mb-5">
          <h1 className="text-[24px] md:text-[32px] font-bold text-[#16181a] tracking-[-0.02em]">{g.name} kurslari</h1>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2">
            {g.desc} · <strong>{courses.length}</strong> ta aktiv kurs · <strong>{g.categoriesCount}</strong> ta yo&apos;nalish
          </p>
        </div>

        {/* Yo'nalishlar (kategoriyalar) */}
        {g.categories.length > 0 && (
          <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-6 mb-5">
            <h2 className="text-[16px] md:text-[18px] font-bold text-[#16181a] mb-3">Yo&apos;nalishlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {g.categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/kurslar/${c.slug}`}
                  className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-[10px] bg-[#f0f2f3] hover:bg-[#e4e7ea] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#16181a] truncate">{c.name}</p>
                    {c.count > 0 && <p className="text-[11px] text-[#7c8490]">{c.count} ta kurs</p>}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7c8490] shrink-0 group-hover:text-[#16181a] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Viloyat bo'yicha (popular regions) */}
        {popularRegions.length > 0 && (
          <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-5 md:p-6 mb-5">
            <h2 className="text-[16px] md:text-[18px] font-bold text-[#16181a] mb-3">Viloyat bo&apos;yicha</h2>
            <div className="flex flex-wrap gap-2">
              {popularRegions.map((r) => (
                <Link
                  key={r.slug}
                  href={`/kurslar/g/${g.slug}/${r.slug}`}
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

        {/* Kurslar */}
        <h2 className="sr-only">{g.name} kurslari ro&apos;yxati</h2>
        <KurslarClient initialCourses={courses} />
      </div>
    </div>
  );
}
