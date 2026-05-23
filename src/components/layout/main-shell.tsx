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
  const isChromelessPage =
    pathname === "/ai" || pathname.startsWith("/aikurs");
  // Provider app shell lives under /center/* (home, listings, …) — its own sidebar layout.
  // The bare /center route is the public login page and keeps the standard navbar/footer.
  const isDashboard = pathname.startsWith("/center/");
  const isAdmin = pathname.startsWith("/admode");
  const isAuth = pathname === "/auth";
  // Yopiq demo / pitch sahifalari — o'z layout'ida ishlaydi, navbar/footer kerakmas.
  const isLanding = pathname.startsWith("/hamkorlik/demo");
  const hideChrome = isDashboard || isAdmin || isAuth || isLanding || isChromelessPage;

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
    if (isChromelessPage) {
      const light = !window.matchMedia("(prefers-color-scheme: dark)").matches;
      const bg = light ? "#f0f2f3" : "#0a0c10";
      document.body.style.backgroundColor = bg;
      document.documentElement.style.backgroundColor = bg;
      return () => {
        document.body.style.backgroundColor = "";
        document.documentElement.style.backgroundColor = "";
      };
    }
    if (!isAdmin) {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    }
  }, [isDashboard, isAdmin, isChromelessPage]);

  // Dashboard, admin, auth, yopiq landing va /ai sahifalarida navbar/footer yo'q
  if (hideChrome) {
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
