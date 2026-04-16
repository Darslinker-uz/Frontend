"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Home, BookOpen, Wifi, WifiOff, PenLine } from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 80) setHidden(true);
      else setHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[60] transition-transform duration-300 ease-in-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "saturate(200%) blur(120px)",
        WebkitBackdropFilter: "saturate(200%) blur(120px)",
      }}
    >
      <div className="px-4 md:max-w-[1600px] md:mx-auto md:px-20 flex items-center justify-between h-[62px] relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <DarslinkerLogo size={28} />
          <span className="text-[20px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight text-[#16181a]">
            Dars<span className="text-[#7ea2d4]">Linker</span>
          </span>
        </Link>

        {/* Desktop Actions — center */}
        <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <Link href="/">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Asosiy
            </Button>
          </Link>
          <Link href="/kurslar">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Kurslar
            </Button>
          </Link>
          <Link href="/kurslar?format=online">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Onlayn
            </Button>
          </Link>
          <Link href="/kurslar?format=offline">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Oflayn
            </Button>
          </Link>
          <Link href="/blog">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Blog
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden">
            <div className="p-2 rounded-[10px] hover:bg-[#f2f4f5] transition-colors relative z-[60]">
              <div className="relative w-5 h-5">
                <Menu className={`h-5 w-5 text-[#16181a] absolute inset-0 transition-all duration-300 ${open ? "opacity-0 scale-50" : "opacity-100 scale-100"}`} />
                <X className={`h-5 w-5 text-[#16181a] absolute inset-0 transition-all duration-300 ${open ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
              </div>
            </div>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="p-0 !h-[65vh] border-b-0"
            showCloseButton={false}
            style={{
              background: "rgba(255, 255, 255, 0.35)",
              backdropFilter: "saturate(200%) blur(40px)",
              WebkitBackdropFilter: "saturate(200%) blur(40px)",
            }}
          >
            <div className="flex flex-col h-full pt-[62px]">
              <nav className="flex-1 flex flex-col items-center justify-center gap-1.5 px-4">
                <div className="w-full flex flex-col gap-1.5 items-center">
                {[
                  { href: "/", label: "Asosiy", icon: Home },
                  { href: "/kurslar", label: "Kurslar", icon: BookOpen },
                  { href: "/kurslar?format=online", label: "Onlayn", icon: Wifi },
                  { href: "/kurslar?format=offline", label: "Oflayn", icon: WifiOff },
                  { href: "/blog", label: "Blog", icon: PenLine },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center py-4 text-[20px] font-semibold text-[#16181a]/70 hover:text-[#16181a] hover:bg-white/50 rounded-xl border border-[#16181a]/10 transition-colors"
                  >
                    <link.icon className="w-5 h-5 shrink-0 ml-auto mr-3" />
                    <span className="mr-auto">{link.label}</span>
                  </Link>
                ))}
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
