import type { Metadata } from "next";
import { HomeSections } from "@/components/crm/home-sections";

// CRM/LMS marketing bosh sahifasining yopiq demo'si. Qidiruvda ko'rinmaydi (noindex), sitemap'da yo'q,
// strukturali ma'lumot (JSON-LD) yo'q — tayyor bo'lgach "/" ga ko'chiriladi (src/lib/crm-pages.ts).
// Layout'dagi canonical (bosh sahifa) bu yerda bekor qilinadi.

const TAGLINE = "Darslinker • o'quv markazlari uchun interaktiv CRM va LMS platformasi";

export const metadata: Metadata = {
  title: { absolute: TAGLINE },
  description:
    "O'quvchilar, guruhlar, davomat, to'lov va qarzdorlik bitta tizimda. Jonli quiz va ota-onaga Telegram xabarlari o'quvchini markazda ushlab qoladi.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
};

export default function DemoCrmPage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen text-[#16181a]">
      <HomeSections />
    </div>
  );
}
