"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { PageTransition } from "@/components/page-transition";

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
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
      <Footer />
    </>
  );
}
