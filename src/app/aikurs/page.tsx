import type { Metadata } from "next";
import { AiKursPageClient } from "@/components/ai/aikurs-page-client";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "AI kurs maslahatchi — kurslar bilan",
  description:
    "Darslinker AI bilan suhbatlashib, yon panelda O'zbekistondagi kurslarni ko'ring va tanlang.",
  alternates: { canonical: `${SITE_URL}/aikurs` },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: `${SITE_URL}/aikurs`,
    siteName: "Darslinker.uz",
    title: "AI kurs maslahatchi — kurslar bilan",
    description:
      "AI chat va kurslar katalogi bir joyda — mos kursni topish osonroq.",
  },
};

export default function AiKursPage() {
  return <AiKursPageClient />;
}
