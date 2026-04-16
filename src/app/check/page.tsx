"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Star, ArrowRight, X, ChevronRight } from "lucide-react";

const cats = ["IT & Dasturlash", "Dizayn", "Marketing", "Xorijiy tillar"];
const activeTags = ["Dasturlash", "Oflayn"];

const card = { title: "JavaScript & React", cat: "Dasturlash", format: "Offline", provider: "Najot Ta'lim", price: "650 000", rating: "4.9", duration: "6 oy", gradient: "from-[#4a7ab5] via-[#7ea2d4] to-[#a3c4e8]" };
const card2 = { title: "UI/UX dizayn Figma", cat: "Dizayn", format: "Online", provider: "Sarvar Nazarov", price: "Bepul", rating: "4.7", duration: "3 oy", gradient: "from-[#6b5b95] via-[#8b7bb5] to-[#b0a3d4]" };
const demoCards = [card, card2, card, card2];

interface Theme {
  name: string;
  pageBg: string;
  sidebarBg: string;
  sidebarBorder: string;
  inputBg: string;
  inputBorder: string;
  divider: string;
  tagBg: string;
  tagText: string;
  btnBg: string;
  btnText: string;
  btnBorder: string;
  catActive: string;
  catText: string;
}

const themes: Theme[] = [
  {
    name: "1 — Hozirgi",
    pageBg: "bg-[#f0f2f3]", sidebarBg: "bg-white", sidebarBorder: "border-[#e4e7ea]",
    inputBg: "bg-white", inputBorder: "border-[#e4e7ea]", divider: "border-[#e4e7ea]",
    tagBg: "bg-[#7ea2d4]", tagText: "text-white",
    btnBg: "bg-white", btnText: "text-[#16181a]", btnBorder: "border-[#16181a]",
    catActive: "bg-[#7ea2d4]/10 text-[#4a7ab5] border-l-2 border-[#7ea2d4]", catText: "text-[#7c8490]",
  },
  {
    name: "2 — Iliq kulrang",
    pageBg: "bg-[#f5f3f0]", sidebarBg: "bg-[#edeae6]", sidebarBorder: "border-[#ddd8d0]",
    inputBg: "bg-white", inputBorder: "border-[#ddd8d0]", divider: "border-[#ddd8d0]",
    tagBg: "bg-[#8a7a65]", tagText: "text-white",
    btnBg: "bg-[#3a3530]", btnText: "text-white", btnBorder: "border-[#3a3530]",
    catActive: "bg-[#8a7a65]/10 text-[#6a5a45] border-l-2 border-[#8a7a65]", catText: "text-[#8a7a65]",
  },
  {
    name: "3 — Sovuq ko'k",
    pageBg: "bg-[#edf1f5]", sidebarBg: "bg-[#e3e8ef]", sidebarBorder: "border-[#cdd5e0]",
    inputBg: "bg-white", inputBorder: "border-[#cdd5e0]", divider: "border-[#cdd5e0]",
    tagBg: "bg-[#2d5a8a]", tagText: "text-white",
    btnBg: "bg-[#2d5a8a]", btnText: "text-white", btnBorder: "border-[#2d5a8a]",
    catActive: "bg-[#2d5a8a]/10 text-[#2d5a8a] border-l-2 border-[#2d5a8a]", catText: "text-[#5a7a95]",
  },
  {
    name: "4 — Mint",
    pageBg: "bg-[#eff5f3]", sidebarBg: "bg-[#e5efeb]", sidebarBorder: "border-[#c8ddd5]",
    inputBg: "bg-white", inputBorder: "border-[#c8ddd5]", divider: "border-[#c8ddd5]",
    tagBg: "bg-[#2d6a5a]", tagText: "text-white",
    btnBg: "bg-[#2d6a5a]", btnText: "text-white", btnBorder: "border-[#2d6a5a]",
    catActive: "bg-[#2d6a5a]/10 text-[#2d6a5a] border-l-2 border-[#2d6a5a]", catText: "text-[#5a8a7a]",
  },
  {
    name: "5 — Oq toza",
    pageBg: "bg-white", sidebarBg: "bg-[#fafafa]", sidebarBorder: "border-[#eaeaea]",
    inputBg: "bg-[#f5f5f5]", inputBorder: "border-[#eaeaea]", divider: "border-[#eaeaea]",
    tagBg: "bg-[#16181a]", tagText: "text-white",
    btnBg: "bg-[#16181a]", btnText: "text-white", btnBorder: "border-[#16181a]",
    catActive: "bg-[#16181a]/5 text-[#16181a] border-l-2 border-[#16181a]", catText: "text-[#999]",
  },
];

function DemoCard({ c }: { c: typeof card }) {
  return (
    <div className={`relative overflow-hidden rounded-[18px] bg-gradient-to-br ${c.gradient} flex flex-col h-full`}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
      <div className="relative z-[2] p-5 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">{c.cat}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-[11px]">{c.format}</span>
        </div>
        <h3 className="text-[17px] font-bold text-white leading-tight">{c.title}</h3>
        <p className="text-[12px] text-white/35 mt-1">{c.provider}</p>
        <div className="flex items-center gap-2 mt-2 text-[11px] text-white/30">
          <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-white/50 text-white/50" />{c.rating}</span>
          <span>{c.duration}</span>
        </div>
      </div>
      <div className="relative z-[2] mx-3 mb-3 rounded-[12px] bg-white/[0.1] border border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
        <span className="text-[14px] font-bold text-white">{c.price === "Bepul" ? "Bepul" : `${c.price} so'm`}</span>
        <ArrowRight className="w-4 h-4 text-white/30" />
      </div>
    </div>
  );
}

export default function CheckPage() {
  const [active, setActive] = useState(0);
  const t = themes[active];

  return (
    <div className={`${t.pageBg} min-h-screen`}>
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e4e7ea] py-3">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {themes.map((th, i) => (
            <button key={i} onClick={() => setActive(i)} className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-medium transition-all ${active === i ? "bg-[#16181a] text-white" : "bg-white border border-[#e4e7ea] text-[#7c8490] hover:text-[#16181a]"}`}>
              {th.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-5">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="hidden md:block w-[260px] shrink-0 pr-6">
            <div className="sticky top-[70px] flex flex-col gap-3">
              <button className={`w-full h-[40px] rounded-[10px] border-2 text-[13px] font-medium transition-all ${t.btnBorder} ${t.btnBg} ${t.btnText}`}>
                Qo&apos;llash
              </button>
              <div className={`flex-1 overflow-y-auto rounded-[16px] ${t.sidebarBg} border ${t.sidebarBorder} p-4 space-y-5`}>
                <div>
                  <p className="text-[12px] font-semibold text-[#16181a] uppercase tracking-wider mb-3">Kategoriya</p>
                  <div className="space-y-0.5">
                    {cats.map((c, i) => (
                      <button key={c} className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[14px] font-medium flex items-center justify-between transition-all ${i === 0 ? t.catActive : `${t.catText} hover:bg-black/[0.03]`}`}>
                        <span className="flex items-center gap-2">
                          <ChevronRight className={`w-4 h-4 transition-transform ${i === 0 ? "rotate-90" : "opacity-30"}`} />
                          {c}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#16181a] uppercase tracking-wider mb-3">Format</p>
                  <div className="flex flex-wrap gap-2">
                    {["Onlayn", "Oflayn", "Gibrid"].map((f, i) => (
                      <button key={f} className={`h-[36px] px-4 rounded-full text-[13px] font-medium transition-all ${i === 1 ? `${t.tagBg} ${t.tagText}` : `${t.inputBg} border ${t.inputBorder} ${t.catText}`}`}>{f}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 md:border-l ${t.divider} md:pl-6`}>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
              <input placeholder="Kurs izlash..." className={`w-full h-[44px] pl-10 pr-4 rounded-[12px] ${t.inputBg} border ${t.inputBorder} text-[14px] placeholder:text-[#7c8490]/50 focus:outline-none`} />
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-[12px] text-[#7c8490]">Filtrlar:</span>
              {activeTags.map((tag) => (
                <button key={tag} className={`h-[28px] px-3 rounded-full ${t.tagBg} ${t.tagText} text-[11px] font-medium flex items-center gap-1.5`}>{tag} <X className="w-3 h-3" /></button>
              ))}
              <button className="text-[12px] text-[#7c8490] font-medium">Tozalash</button>
            </div>
            <p className="text-[13px] text-[#7c8490] mb-5">24 ta kurs topildi</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demoCards.map((c, i) => <DemoCard key={i} c={c} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
