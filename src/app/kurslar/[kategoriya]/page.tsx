import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveListings, getActiveCategories } from "@/lib/listings";
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
    keywords: [cat.name, `${cat.name} kursi`, `${cat.name} kurslari`, `${cat.name} o'quv markaz`, ...cat.subcategories, "o'zbekiston", "toshkent"],
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
  const [allCourses, categories] = await Promise.all([
    getActiveListings(),
    getActiveCategories(),
  ]);
  const cat = categories.find(c => c.slug === kategoriya);
  if (!cat) notFound();

  const scoped = allCourses.filter(c => c.categorySlug === kategoriya);
  const url = `${SITE_URL}/kurslar/${kategoriya}`;

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
        <KategoriyaClient kategoriya={kategoriya} allCourses={allCourses} />
      </div>
    </div>
  );
}
