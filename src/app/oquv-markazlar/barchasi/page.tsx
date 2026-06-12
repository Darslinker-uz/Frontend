import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { OquvMarkazlarBarchasiClient } from "./barchasi-client";
import { getActiveCategoryGroups } from "@/lib/listings";
import { getActiveRegions } from "@/lib/regions";
import { FAKE_CENTERS } from "@/data/fake-centers";
import { getActiveCenters } from "@/lib/centers";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "Barcha o'quv markazlar — O'zbekiston bo'ylab tekshirilgan markazlar katalogi",
  description: "O'zbekistondagi barcha tekshirilgan o'quv markazlari ro'yxati. Joylashuv, yo'nalish va sertifikat bo'yicha filtrlang. IT, ingliz tili, dizayn, marketing va boshqa yo'nalishlarda markaz tanlang.",
  keywords: [
    "barcha o'quv markazlar",
    "o'zbekiston o'quv markazlari ro'yxati",
    "o'quv markaz katalogi",
    "tekshirilgan o'quv markazlar",
    "toshkent o'quv markazlari",
    "samarqand o'quv markaz",
    "buxoro o'quv markaz",
    "andijon o'quv markaz",
    "farg'ona o'quv markazlari",
    "namangan o'quv markazlari",
    "IT markazlari ro'yxati",
    "ingliz tili markazlari",
  ],
  alternates: { canonical: `${SITE_URL}/oquv-markazlar/barchasi` },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: `${SITE_URL}/oquv-markazlar/barchasi`,
    siteName: "Darslinker.uz",
    title: "Barcha o'quv markazlar — Darslinker katalogi",
    description: "O'zbekiston bo'ylab tekshirilgan barcha o'quv markazlar — bitta ro'yxatda.",
  },
};

export default async function BarchaMarkazlarPage() {
  const [groups, regions, realCenters] = await Promise.all([
    getActiveCategoryGroups(),
    getActiveRegions(),
    getActiveCenters(),
  ]);

  // Production'da FAQAT real markazlar; fake demo'lar faqat development'da.
  const realProviders = new Set(realCenters.map(c => c.provider));
  const fakeCentersToShow =
    process.env.NODE_ENV === "production"
      ? []
      : FAKE_CENTERS.filter(f => !realProviders.has(f.provider));
  const combinedCenters = [
    ...realCenters.map(c => ({
      slug: c.slug,
      provider: c.provider,
      description: c.description ?? "",
      categories: c.categories,
      regions: c.regions,
      avgRating: c.avgRating,
      ratingCount: c.ratingCount,
      courseCount: c.courseCount,
      imageUrl: c.imageUrl,
      gradient: c.gradient,
      firstSlug: c.firstSlug,
      firstCategorySlug: c.firstCategorySlug,
      certificate: c.certificate,
    })),
    ...fakeCentersToShow,
  ];

  // Filter uchun barcha unikal viloyatlar (real + fake + DB regions)
  const allRegionNames = new Set<string>();
  for (const r of regions) allRegionNames.add(r.name);
  for (const c of combinedCenters) for (const r of c.regions) allRegionNames.add(r);
  const filterRegions = Array.from(allRegionNames).sort();

  // Filter uchun barcha unikal yo'nalishlar
  const allCategoryNames = new Set<string>();
  for (const g of groups) for (const c of g.categories) allCategoryNames.add(c.name);
  for (const c of combinedCenters) for (const cat of c.categories) allCategoryNames.add(cat);
  const filterCategories = Array.from(allCategoryNames).sort();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Asosiy", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "O'quv markazlar", "item": `${SITE_URL}/oquv-markazlar` },
      { "@type": "ListItem", "position": 3, "name": "Barchasi", "item": `${SITE_URL}/oquv-markazlar/barchasi` },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Barcha o'quv markazlar — Darslinker.uz",
    "url": `${SITE_URL}/oquv-markazlar/barchasi`,
    "inLanguage": "uz",
    "description": "O'zbekistondagi barcha tekshirilgan o'quv markazlar katalogi — filtr va joylashuv bo'yicha izlash.",
    "isPartOf": { "@type": "WebSite", "name": "Darslinker.uz", "url": SITE_URL },
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      {/* Breadcrumb + Page header */}
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 pt-6 md:pt-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px] text-[#7c8490] mb-5">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-[#16181a] transition-colors">
            <Home className="w-3.5 h-3.5" />
            Asosiy
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/oquv-markazlar" className="hover:text-[#16181a] transition-colors">O&apos;quv markazlar</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#16181a] font-medium">Barchasi</span>
        </nav>

        {/* Page title */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] tracking-[-0.03em] leading-tight">
            Barcha o&apos;quv markazlar
          </h1>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2 max-w-[680px]">
            O&apos;zbekiston bo&apos;ylab tekshirilgan barcha markazlar bitta joyda. Joylashuv, yo&apos;nalish yoki sertifikat bo&apos;yicha tanlab izlang.
          </p>
        </div>
      </div>

      {/* Client filter + grid + pagination */}
      <OquvMarkazlarBarchasiClient
        centers={combinedCenters}
        regions={filterRegions}
        categories={filterCategories}
      />
    </div>
  );
}
