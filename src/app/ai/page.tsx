import type { Metadata } from "next";
import { AiPageClient } from "@/components/ai/ai-page-client";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "Darslinker AI — shaxsiy kurs maslahatchi",
  description:
    "Darslinker AI sizga mos kurs topishda yordam beradi — savollar, suhbat va O'zbekistondagi haqiqiy kurslar katalogi.",
  alternates: { canonical: `${SITE_URL}/ai` },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: `${SITE_URL}/ai`,
    siteName: "Darslinker.uz",
    title: "Darslinker AI — shaxsiy kurs maslahatchi",
    description:
      "Mos kursni topish uchun AI yordamchi — quiz, suhbat va bazadan kurslar.",
  },
};

export default function AiPage() {
  return <AiPageClient />;
}
