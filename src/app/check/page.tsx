"use client";

import { useState } from "react";
import { Menu, X, Home, BookOpen, Wifi, WifiOff, PenLine } from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

const links = [
  { href: "/", label: "Asosiy", icon: Home },
  { href: "/kurslar", label: "Kurslar", icon: BookOpen },
  { href: "/kurslar?format=online", label: "Onlayn", icon: Wifi },
  { href: "/kurslar?format=offline", label: "Oflayn", icon: WifiOff },
  { href: "/blog", label: "Blog", icon: PenLine },
];

const variants = [
  { name: "1 — Slide", style: "transition-all duration-400 ease-out", openClass: "translate-y-0", closeClass: "-translate-y-full" },
  { name: "2 — Bounce", style: "transition-all duration-600", easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", openClass: "translate-y-0", closeClass: "-translate-y-full" },
  { name: "3 — Smooth in-out", style: "transition-all duration-500 ease-in-out", openClass: "translate-y-0", closeClass: "-translate-y-full" },
  { name: "4 — Quick + soft end", style: "transition-all duration-450", easing: "cubic-bezier(0.16, 1, 0.3, 1)", openClass: "translate-y-0", closeClass: "-translate-y-full" },
  { name: "5 — Scale + slide", style: "transition-all duration-500 ease-out", openClass: "translate-y-0 scale-100 opacity-100", closeClass: "-translate-y-full scale-95 opacity-0" },
];

export default function CheckPage() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const v = variants[active];

  return (
    <div className="bg-[#f0f2f3] min-h-screen relative overflow-hidden">
      {/* Variantlar tanlash */}
      <div className="sticky top-0 z-[200] bg-white/80 backdrop-blur-md border-b border-[#e4e7ea] py-3">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {variants.map((vr, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setOpen(false); }}
              className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-medium transition-all ${active === i ? "bg-[#16181a] text-white" : "bg-white border border-[#e4e7ea] text-[#7c8490] hover:text-[#16181a]"}`}
            >
              {vr.name}
            </button>
          ))}
        </div>
      </div>

      {/* Demo navbar */}
      <header className="sticky top-[58px] z-[100]">
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
        <div className="relative z-10 px-4 flex items-center justify-between h-[62px]">
          <div className="flex items-center gap-2">
            <DarslinkerLogo size={28} />
            <span className="text-[20px] font-extrabold tracking-tight text-[#16181a]">
              Dars<span className="text-[#7ea2d4]">Linker</span>
            </span>
          </div>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-[10px] hover:bg-[#f2f4f5] transition-colors relative z-[110]">
            <div className="relative w-5 h-5">
              <Menu className={`h-5 w-5 text-[#16181a] absolute inset-0 transition-all duration-300 ${open ? "opacity-0 scale-50" : "opacity-100 scale-100"}`} />
              <X className={`h-5 w-5 text-[#16181a] absolute inset-0 transition-all duration-300 ${open ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Dropdown menu */}
      <div
        className={`fixed top-[58px] left-0 right-0 h-[65vh] z-[90] origin-top ${v.style} ${open ? v.openClass : v.closeClass}`}
        style={{
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "saturate(200%) blur(40px)",
          WebkitBackdropFilter: "saturate(200%) blur(40px)",
          transitionTimingFunction: v.easing,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <nav className="flex flex-col items-center justify-center gap-1.5 px-4 pt-[62px] h-full">
          <div className="w-full flex flex-col gap-1.5 items-center">
            {links.map((link) => (
              <button
                key={link.href}
                className="w-full flex items-center py-4 text-[20px] font-semibold text-[#16181a]/70 hover:text-[#16181a] hover:bg-white/50 rounded-xl border border-[#16181a]/10 transition-colors"
              >
                <link.icon className="w-5 h-5 shrink-0 ml-auto mr-3" />
                <span className="mr-auto">{link.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Demo content */}
      <div className="px-5 py-8">
        <p className="text-[14px] text-[#7c8490]">Variantlarni tanlang va menu tugmasini bosing</p>
        <div className="mt-6 space-y-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-20 rounded-[14px] bg-white border border-[#e4e7ea]" />
          ))}
        </div>
      </div>
    </div>
  );
}
