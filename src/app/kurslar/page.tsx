import type { Metadata } from "next";
import { getActiveListings, getActiveCategoryGroups } from "@/lib/listings";
import { getActiveRegions } from "@/lib/regions";
import { KurslarClient } from "./kurslar-client";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

interface Props {
  searchParams: Promise<{ guruh?: string; region?: string; district?: string; search?: string; format?: string }>;
}

// Lokatsiya filter qo'llanganda agar tuman/viloyat'da kurslar 5 dan kam bo'lsa,
// avtomatik kengaytiradigan minimum.
const MIN_RESULTS_BEFORE_FALLBACK = 5;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const guruh = sp.guruh?.toString();
  if (guruh) {
    const groups = await getActiveCategoryGroups();
    const g = groups.find(x => x.slug === guruh);
    if (g) {
      const title = `${g.name} bo'yicha kurslar — ${g.listingsCount} ta kurs`;
      const description = `${g.name} guruhidagi yo'nalishlar va kurslar O'zbekiston bo'ylab. ${g.desc}`;
      return {
        title,
        description,
        keywords: [g.name, ...g.categories.map(c => c.name), "o'zbekiston", "kurs"],
        alternates: { canonical: `${SITE_URL}/kurslar?guruh=${g.slug}` },
        openGraph: {
          type: "website",
          locale: "uz_UZ",
          url: `${SITE_URL}/kurslar?guruh=${g.slug}`,
          siteName: "Darslinker.uz",
          title,
          description,
        },
      };
    }
  }
  return {
    title: "Barcha kurslar — O'zbekistondagi online va offline kurslar",
    description: "O'zbekistondagi barcha o'quv markazlari va kurslar bitta joyda. Dasturlash, dizayn, IELTS, ingliz tili, marketing va boshqa yo'nalishlar bo'yicha kurslarni toping, solishtiring va ariza qoldiring.",
    keywords: ["kurslar", "o'zbekiston kurslari", "toshkent kurslar", "online kurslar", "offline kurslar", "o'quv markaz", "dasturlash kursi", "IELTS", "ingliz tili kursi", "dizayn kursi", "marketing kursi"],
    alternates: { canonical: `${SITE_URL}/kurslar` },
    openGraph: {
      type: "website",
      locale: "uz_UZ",
      url: `${SITE_URL}/kurslar`,
      siteName: "Darslinker.uz",
      title: "Barcha kurslar — Darslinker.uz",
      description: "O'zbekistondagi eng yaxshi kurslarni toping va solishtiring.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Barcha kurslar — Darslinker.uz",
      description: "O'zbekistondagi eng yaxshi kurslarni toping va solishtiring.",
    },
  };
}

export default async function KurslarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const guruhSlug = sp.guruh?.toString();
  const regionFilter = sp.region?.toString();
  const districtFilter = sp.district?.toString();

  const [allCourses, groups, regionsAll] = await Promise.all([
    getActiveListings(),
    getActiveCategoryGroups(),
    getActiveRegions(),
  ]);

  // Filter komponenti uchun (Guruh → Yo'nalish, kursi bor yo'nalishlar bilan + count)
  const filterGroups = groups.map(g => ({
    name: g.name,
    slug: g.slug,
    categories: g.categories
      .filter(c => c.count > 0)
      .map(c => ({ name: c.name, slug: c.slug, count: c.count })),
  })).filter(g => g.categories.length > 0);

  // Filter uchun viloyatlar (faqat aktiv)
  const filterRegions = regionsAll.map(r => ({ name: r.name, slug: r.slug }));

  // Guruh filtri
  const selectedGroup = guruhSlug ? groups.find(g => g.slug === guruhSlug) : null;
  const baseCourses = selectedGroup
    ? allCourses.filter(c => c.groupSlug === selectedGroup.slug)
    : allCourses;

  // Lokatsiya filter — online/video doim qoldiriladi (har joydan kirish mumkin).
  // Agar district berilgan va shu tumanda 5 dan kam offline kurs bo'lsa,
  // avtomatik viloyat darajasiga kengaytiriladi.
  let courses = baseCourses;
  let fallbackInfo: { from: "district" | "region"; to: "region" | "all"; nearby: number; expanded: number } | null = null;

  if (districtFilter && regionFilter) {
    const districtMatch = baseCourses.filter(c =>
      (c.district === districtFilter && c.region === regionFilter) ||
      c.format === "Online" || c.format === "Video"
    );
    const districtOffline = districtMatch.filter(c => c.format !== "Online" && c.format !== "Video");

    if (districtOffline.length < MIN_RESULTS_BEFORE_FALLBACK) {
      // Tumanda kam → viloyatga kengaytirish
      const regionMatch = baseCourses.filter(c =>
        c.region === regionFilter || c.format === "Online" || c.format === "Video"
      );
      courses = regionMatch;
      fallbackInfo = {
        from: "district",
        to: "region",
        nearby: districtOffline.length,
        expanded: regionMatch.filter(c => c.format !== "Online" && c.format !== "Video").length,
      };
    } else {
      courses = districtMatch;
    }
  } else if (regionFilter) {
    courses = baseCourses.filter(c =>
      c.region === regionFilter || c.format === "Online" || c.format === "Video"
    );
  }

  const url = selectedGroup ? `${SITE_URL}/kurslar?guruh=${selectedGroup.slug}` : `${SITE_URL}/kurslar`;
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": selectedGroup ? `${selectedGroup.name} kurslari` : "Barcha kurslar — Darslinker.uz",
    "description": selectedGroup ? selectedGroup.desc : "O'zbekistondagi barcha o'quv markazlari va kurslar",
    "numberOfItems": courses.length,
    "itemListElement": courses.slice(0, 30).map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${SITE_URL}/kurslar/${c.categorySlug}/${c.slug}`,
      "name": c.title,
    })),
  };
  const breadcrumbItems = [
    { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": SITE_URL },
    { "@type": "ListItem", "position": 2, "name": "Kurslar", "item": `${SITE_URL}/kurslar` },
  ];
  if (selectedGroup) {
    breadcrumbItems.push({ "@type": "ListItem", "position": 3, "name": selectedGroup.name, "item": url });
  }
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems,
  };

  const headingMobile = regionFilter
    ? `${regionFilter}da kurslar`
    : selectedGroup ? selectedGroup.name : "Kurslar";
  const headingSeo = regionFilter
    ? `${regionFilter}da ${selectedGroup ? selectedGroup.name.toLowerCase() : ""} kurslari — ${courses.length} ta`
    : selectedGroup
    ? `${selectedGroup.name} bo'yicha kurslar — ${courses.length} ta kurs`
    : `O'zbekistondagi kurslar — ${courses.length} ta kurs`;

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-5">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#16181a] mb-4 md:hidden">{headingMobile}</h1>
        <h1 className="sr-only">{headingSeo}</h1>
        {(selectedGroup || regionFilter) && (
          <div className="hidden md:block mb-4">
            <h2 className="text-[20px] font-bold text-[#16181a]">
              {regionFilter ? `${regionFilter}` : selectedGroup?.name}
              {regionFilter && selectedGroup ? ` · ${selectedGroup.name}` : ""}
            </h2>
            <p className="text-[13px] text-[#7c8490] mt-0.5">{courses.length} ta kurs</p>
          </div>
        )}
        <KurslarClient
          initialCourses={courses}
          groups={filterGroups}
          regions={filterRegions}
          locationFilter={{
            region: regionFilter ?? null,
            district: districtFilter ?? null,
            fallback: fallbackInfo,
          }}
        />
      </div>
    </div>
  );
}
