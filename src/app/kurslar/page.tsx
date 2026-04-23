import type { Metadata } from "next";
import { getActiveListings } from "@/lib/listings";
import { KurslarClient } from "./kurslar-client";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
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

export default async function KurslarPage() {
  const courses = await getActiveListings();

  const url = `${SITE_URL}/kurslar`;
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Barcha kurslar — Darslinker.uz",
    "description": "O'zbekistondagi barcha o'quv markazlari va kurslar",
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
      { "@type": "ListItem", "position": 2, "name": "Kurslar", "item": url },
    ],
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-5">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#16181a] mb-4 md:hidden">Kurslar</h1>
        <h1 className="sr-only">O&apos;zbekistondagi kurslar — {courses.length} ta kurs</h1>
        <KurslarClient initialCourses={courses} />
      </div>
    </div>
  );
}
