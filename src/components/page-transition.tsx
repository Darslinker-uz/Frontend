"use client";

import { usePathname } from "next/navigation";

// Fade 0 dan emas, 0.01 dan boshlanadi: ko'zga farqi yo'q, lekin Chrome opacity 0 bo'lgan elementni LCP deb
// hisoblamaydi — 0 dan boshlansa mobil LCP animatsiya tugaguncha (va sekin telefonda yanada ko'p) kechikadi.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-page-fade">
      {children}
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0.01; }
          to { opacity: 1; }
        }
        .animate-page-fade {
          animation: pageFadeIn 250ms ease-out;
        }
      `}</style>
    </div>
  );
}
