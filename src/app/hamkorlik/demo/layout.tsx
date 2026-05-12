import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markazlar uchun demo — Darslinker",
  description: "O'quv markazlar uchun yopiq demo sahifa.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
