import type { Metadata } from "next";
import { Outfit, Kalam, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MainShell } from "@/components/layout/main-shell";
import { Providers } from "@/components/providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Darslinker.uz — Kurslarni toping va solishtiring",
    template: "%s | Darslinker.uz",
  },
  description:
    "O'zbekistondagi eng yaxshi online va offline kurslarni toping, solishtiring va to'g'ri tanlov qiling.",
  keywords: ["darslinker", "kurslar", "online kurslar", "o'zbekiston kurslari", "dasturlash", "dizayn", "ingliz tili", "IELTS", "marketing", "o'quv markaz"],
  authors: [{ name: "Darslinker" }],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: SITE_URL,
    siteName: "Darslinker.uz",
    title: "Darslinker.uz — Kurslarni toping va solishtiring",
    description: "O'zbekistondagi eng yaxshi online va offline kurslarni toping, solishtiring va to'g'ri tanlov qiling.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Darslinker.uz — Kurslarni toping va solishtiring",
    description: "O'zbekistondagi eng yaxshi kurslar",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${outfit.variable} ${kalam.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-outfit)]">
        <Providers>
          <MainShell>{children}</MainShell>
        </Providers>
      </body>
    </html>
  );
}
