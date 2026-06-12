import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RepetitorlarBarchaClient } from "./repetitorlar-barcha-client";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "Barcha repetitorlar — O'zbekistondagi shaxsiy o'qituvchilar",
  description: "O'zbekiston bo'ylab shaxsiy repetitorlarni fan, format va hudud bo'yicha filtrlab toping. Matematika, ingliz tili, fizika va boshqa fanlardan 1-on-1 darslar.",
  alternates: { canonical: `${SITE_URL}/repetitorlar/barcha` },
  // Demo ma'lumotlar — haqiqiy repetitor ma'lumotlari ulanmaguncha indekslanmaydi
  robots: { index: false, follow: true },
};

export default function BarchaRepetitorlarPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Asosiy", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Repetitorlar", "item": `${SITE_URL}/repetitorlar` },
      { "@type": "ListItem", "position": 3, "name": "Barcha repetitorlar", "item": `${SITE_URL}/repetitorlar/barcha` },
    ],
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-5 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-[#7c8490] mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#16181a]">Asosiy</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/repetitorlar" className="hover:text-[#16181a]">Repetitorlar</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#16181a] font-medium">Barcha repetitorlar</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-[26px] md:text-[34px] font-bold text-[#16181a] tracking-[-0.03em]">Barcha repetitorlar</h1>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-1.5">Fan, format va hudud bo&apos;yicha filtrlab, sizga mos shaxsiy o&apos;qituvchini toping</p>
        </div>

        <RepetitorlarBarchaClient />
      </div>
    </div>
  );
}
