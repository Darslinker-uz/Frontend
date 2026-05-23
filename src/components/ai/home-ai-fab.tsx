"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

/** Bosh sahifa — pastki o'ng burchak, /aikurs ga */
export function HomeAiFab() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <Link
      href="/aikurs"
      aria-label="AI kurs maslahachi — /aikurs"
      className="home-ai-fab fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2d5a8a] to-[#4a7ab8] text-white shadow-lg shadow-[#2d5a8a]/35 ring-2 ring-white transition hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ea2d4]"
    >
      <Sparkles className="size-6" strokeWidth={2} />
    </Link>
  );
}
