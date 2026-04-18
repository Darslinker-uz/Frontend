"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, BookOpen, Wifi, WifiOff, PenLine, MessageCircle } from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

const mobileLinks = [
  { href: "/", label: "Asosiy", icon: Home },
  { href: "/kurslar", label: "Kurslar", icon: BookOpen },
  { href: "/kurslar?format=online", label: "Onlayn", icon: Wifi },
  { href: "/kurslar?format=offline", label: "Oflayn", icon: WifiOff },
  { href: "/blog", label: "Blog", icon: PenLine },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[60]">
      {/* Glass fon — menu yopiq holatda. Menu ochilganda dropdown
          to'g'ridan-to'g'ri navbar ostidan ham ko'rinadi */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-200"
        aria-hidden
        style={{
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: open ? "none" : "saturate(200%) blur(40px)",
          WebkitBackdropFilter: open ? "none" : "saturate(200%) blur(40px)",
          opacity: open ? 0 : 1,
        }}
      />
      <div className="relative z-[70] px-4 md:max-w-[1600px] md:mx-auto md:px-20 flex items-center justify-between h-[62px]">
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

        {/* Mobile Menu Trigger */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-[10px] hover:bg-[#f2f4f5] transition-colors relative z-[60]">
          <div className="relative w-5 h-5">
            <Menu className={`h-5 w-5 text-[#16181a] absolute inset-0 transition-all duration-300 ${open ? "opacity-0 scale-50" : "opacity-100 scale-100"}`} />
            <X className={`h-5 w-5 text-[#16181a] absolute inset-0 transition-all duration-300 ${open ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown Menu — bounce animation */}
      <div
        className={`md:hidden fixed left-0 right-0 z-[55] origin-top transition-transform duration-600 ${open ? "translate-y-0" : "-translate-y-full"}`}
        style={{
          top: "-80px",
          height: "calc(80vh + 80px)",
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "saturate(200%) blur(40px)",
          WebkitBackdropFilter: "saturate(200%) blur(40px)",
          transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        <div className="flex flex-col h-full pt-[142px] pb-6 px-4">
          <nav className="flex-1 flex flex-col items-center justify-center gap-1.5">
            <div className="w-full flex flex-col gap-1.5 items-center">
              {mobileLinks.map((link) => (
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
          {/* Yordam tugma */}
          <a
            href="https://t.me/DarslinkerSupport"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-4 text-[16px] font-semibold text-[#16181a] bg-white hover:bg-white/80 rounded-xl border border-[#16181a]/10 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Yordam
          </a>
        </div>
      </div>

      {/* Backdrop overlay — menu ortida */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-[45] bg-black/15 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
