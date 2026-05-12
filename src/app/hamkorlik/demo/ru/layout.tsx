import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Демо для учебных центров — Darslinker",
  description: "Закрытая демо-страница для учебных центров.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function DemoRuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
