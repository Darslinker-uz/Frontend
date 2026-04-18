"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-page-fade">
      {children}
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-page-fade {
          animation: pageFadeIn 250ms ease-out;
        }
      `}</style>
    </div>
  );
}
