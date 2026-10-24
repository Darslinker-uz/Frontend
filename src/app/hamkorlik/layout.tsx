import type { Metadata } from "next";

// /hamkorlik — client sahifa, metadata shu yerda. Marketplace'ga joylashish arizasi (CRM arizasi emas).
const TITLE = "Kurslaringizni Darslinker marketplace'ga joylashtiring";
const DESCRIPTION =
  "O'quv markazi yoki repetitor sifatida kurslaringizni Darslinker marketplace'ga joylashtiring va yangi o'quvchilardan ariza oling. Ariza 24 soat ichida ko'rib chiqiladi.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Darslinker` },
  description: DESCRIPTION,
  alternates: { canonical: "/hamkorlik" },
  openGraph: { type: "website", locale: "uz_UZ", siteName: "Darslinker.uz", title: TITLE, description: DESCRIPTION, url: "/hamkorlik", images: ["/og-image.png?v=4"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png?v=4"] },
};

export default function HamkorlikLayout({ children }: { children: React.ReactNode }) {
  return children;
}
