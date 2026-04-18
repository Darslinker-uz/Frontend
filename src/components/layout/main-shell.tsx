"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { PageTransition } from "@/components/page-transition";

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname === "/auth";

  // Dashboard da body background qora bo'lsin
  useEffect(() => {
    if (isDashboard) {
      document.body.style.backgroundColor = "#0e1015";
      document.documentElement.style.backgroundColor = "#0e1015";
    } else {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    }
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, [isDashboard]);

  // Dashboard va auth sahifalarida navbar/footer ko'rsatilmaydi
  if (isDashboard || isAuth) {
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
