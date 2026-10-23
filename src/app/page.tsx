import type { Metadata } from "next";
import { HomeSections } from "@/components/crm/home-sections";
import { CRM_DESCRIPTION, CRM_FEATURES, CRM_KEYWORDS, FAQS, PLANS, TAGLINE } from "@/lib/crm-content";
import { SHARE_OG, SHARE_TWITTER } from "@/lib/share-meta";

// Bosh sahifa — CRM/LMS tanishtiruvi (2026-10-23 dan). Avvalgi katalog bosh sahifasi — /marketplace.
// Sayt darajasidagi schema'lar (WebSite, Organization) shu yerda; Organization @id orqali
// /haqimizda (AboutPage) va SoftwareApplication bilan bog'langan.

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const ORG_ID = `${SITE_URL}/#organization`;

export const metadata: Metadata = {
  title: { absolute: TAGLINE },
  description: CRM_DESCRIPTION,
  keywords: CRM_KEYWORDS,
  alternates: { canonical: "/" },
  // openGraph/twitter layout'dagisini to'liq almashtiradi (birlashtirmaydi) — rasm va turini qayta beramiz.
  openGraph: { ...SHARE_OG, title: TAGLINE, description: CRM_DESCRIPTION, url: "/" },
  twitter: { ...SHARE_TWITTER, title: TAGLINE, description: CRM_DESCRIPTION },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  "name": "Darslinker.uz",
  "alternateName": "Darslinker",
  "url": SITE_URL,
  "inLanguage": "uz",
  "description": TAGLINE,
  "publisher": { "@id": ORG_ID },
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/kurslar?search={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  "name": "Darslinker",
  "alternateName": ["Darslinker.uz", "DarsLinker"],
  "url": SITE_URL,
  "logo": `${SITE_URL}/icon-512.png`,
  "description": TAGLINE,
  "foundingDate": "2025-09",
  "areaServed": { "@type": "Country", "name": "O'zbekiston" },
  "subjectOf": { "@type": "AboutPage", "url": `${SITE_URL}/haqimizda` },
  "sameAs": [
    "https://t.me/darslinker",
    "https://www.instagram.com/darslinker",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": "https://t.me/Darslinker_Support",
    "availableLanguage": ["Uzbek", "uz"],
  },
};

// Reyting/sharh yo'q — to'qib qo'shilmaydi (Google bu turga yulduzcha bermaydi, lekin AI va
// qidiruv uchun narx, imkoniyatlar va hudud aniq bo'ladi).
const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Darslinker",
  "description": CRM_DESCRIPTION,
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "CRM va LMS (o'quv markazlari uchun)",
  "operatingSystem": "Web",
  "inLanguage": "uz",
  "countriesSupported": "UZ",
  "url": SITE_URL,
  "publisher": { "@id": ORG_ID },
  "featureList": CRM_FEATURES,
  "offers": PLANS.map((p) => {
    const price = Number(p.price.replace(/\s/g, ""));
    return {
      "@type": "Offer",
      "name": p.name,
      "description": p.audience,
      "price": price,
      "priceCurrency": "UZS",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": price,
        "priceCurrency": "UZS",
        "unitCode": "MON",
        "unitText": "oy",
      },
    };
  }),
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
};

export default function HomePage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen text-[#16181a]">
      {[websiteLd, organizationLd, softwareLd, faqLd].map((ld) => (
        <script key={ld["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <HomeSections />
    </div>
  );
}
