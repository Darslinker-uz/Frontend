import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { SHARE_OG, SHARE_TWITTER } from "@/lib/share-meta";

// /contact — aloqa sahifasi (navbar "Aloqa"). Egasi qarori (2026-10-25): ortiqcha matn yo'q, sahifa bitta ekranga
// sig'adi, ariza formasi sahifaning o'zida (modalsiz) va mobilda ochilganda darhol ko'rinadi.
// Faqat tasdiqlangan kanallar: Telegram support (@Darslinker_Support, 7 kun 10:00–20:00), Telegram kanal, Instagram.
// Telefon, email va manzil hali tasdiqlanmagan — qo'shilmaydi. Marketplace'ga joylashish arizasi — /hamkorlik.

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const PATH = "/contact";
const SUPPORT_URL = "https://t.me/Darslinker_Support";
const CHANNEL_URL = "https://t.me/darslinker";
const INSTAGRAM_URL = "https://www.instagram.com/darslinker";

const TITLE = "Darslinker bilan bog'lanish: support va ariza — Darslinker";
const DESCRIPTION =
  "Darslinker bilan bog'lanish: Telegram orqali support haftaning 7 kuni, 10:00–20:00. CRM va LMS'ni sinab ko'rish uchun ariza qoldiring, o'zimiz bog'lanamiz.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["Darslinker bilan bog'lanish", "Darslinker support", "Darslinker aloqa", "Darslinker Telegram", "CRM uchun ariza"],
  alternates: { canonical: PATH },
  openGraph: { ...SHARE_OG, title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { ...SHARE_TWITTER, title: TITLE, description: DESCRIPTION },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "name": TITLE,
      "description": DESCRIPTION,
      "url": `${SITE_URL}${PATH}`,
      "inLanguage": "uz",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": { "@id": `${SITE_URL}/#organization` },
      "mainEntity": {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "Darslinker",
        "url": SITE_URL,
        "sameAs": [CHANNEL_URL, INSTAGRAM_URL],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "url": SUPPORT_URL,
          "availableLanguage": ["Uzbek"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "10:00",
            "closes": "20:00",
          },
        },
      },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": `${SITE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Aloqa", "item": `${SITE_URL}${PATH}` },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <div className="bg-[#f0f2f3] text-[#16181a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* "Ikki yo'l": ariza formasi va Telegram — contact-form.tsx */}
      <ContactForm />
    </div>
  );
}
