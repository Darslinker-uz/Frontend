import type { Metadata } from "next";
import { AiKursMiniPageClient } from "@/components/ai/aikursmini-page-client";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "AI kurs qidiruv — to'liq ekran",
  description:
    "Kurslar to'liq ekranda, AI maslahatchi pastda — mos kurslarni bir joyda toping.",
  alternates: { canonical: `${SITE_URL}/aikursmini` },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: `${SITE_URL}/aikursmini`,
    siteName: "Darslinker.uz",
    title: "AI kurs qidiruv — to'liq ekran",
    description: "To'liq ekran kurslar va mini AI chat — eng mos variantlar birinchi.",
  },
};

export default function AiKursMiniPage() {
  return <AiKursMiniPageClient />;
}
