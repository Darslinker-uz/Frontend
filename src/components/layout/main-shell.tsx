"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "./navbar";
import { PageTransition } from "@/components/page-transition";

export function MainShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  // Provider app shell lives under /center/* (home, listings, …) — its own sidebar layout.
  // The bare /center route is the public login page and keeps the standard navbar/footer.
  const isDashboard = pathname.startsWith("/center/");
  const isAdmin = pathname.startsWith("/admode");
  const isAuth = pathname === "/auth";

  // Dashboard da body qora bo'lishi kerak. Admin'da AdminThemeProvider o'zi body'ni
  // tanlangan tema rangiga sinxronlaydi, shuning uchun bu yerda tegmaymiz.
  useEffect(() => {
    if (isDashboard) {
      document.body.style.backgroundColor = "#0e1015";
      document.documentElement.style.backgroundColor = "#0e1015";
      return () => {
        document.body.style.backgroundColor = "";
        document.documentElement.style.backgroundColor = "";
      };
    }
    if (!isAdmin) {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    }
  }, [isDashboard, isAdmin]);

  // Dashboard, admin va auth sahifalarida navbar/footer ko'rsatilmaydi
  if (isDashboard || isAdmin || isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1"><PageTransition>{children}</PageTransition></main>
      {footer}
    </>
  );
}
