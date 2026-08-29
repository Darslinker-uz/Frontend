import type { Metadata } from "next";
import { PlayPrototype } from "./play-prototype";

export const metadata: Metadata = {
  title: "Go Darslinker! — interaktiv til o'rganish (UI sinov)",
  description: "Go Darslinker — o'yinlashtirilgan til o'rganish platformasining dizayn sinovi.",
  robots: { index: false, follow: false },
};

export default function TestPlayPage() {
  return <PlayPrototype />;
}
