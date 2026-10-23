import type { Metadata } from "next";

// Layout'dagi umumiy ulashish (OG/Twitter) maydonlari. Sahifa o'z openGraph/twitter'ini bersa,
// Next layout'dagisini birlashtirmay to'liq almashtiradi — rasm, tur va sayt nomi yo'qolmasligi
// uchun sahifalar shuni yoyib (spread) ishlatadi.
const IMAGE = { url: "/og-image.png?v=4", width: 1200, height: 1200, alt: "Darslinker.uz", type: "image/png" };

export const SHARE_OG = {
  type: "website",
  locale: "uz_UZ",
  siteName: "Darslinker.uz",
  images: [IMAGE],
} satisfies NonNullable<Metadata["openGraph"]>;

export const SHARE_TWITTER = {
  card: "summary_large_image",
  images: [IMAGE.url],
} satisfies NonNullable<Metadata["twitter"]>;
