import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website va SEO xizmatlari — Darslinker",
  description: "Bizneslar uchun yopiq taqdimot sahifasi: website, SEO, AEO va GEO xizmatlari.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
