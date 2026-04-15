"use client";

import { useState } from "react";

export default function CheckPage() {
  const [active, setActive] = useState(0);

  const variants = [
    { name: "1 — 1060px (hozirgi)", maxW: "max-w-[1060px]", px: "px-5" },
    { name: "2 — 960px", maxW: "max-w-[960px]", px: "px-5" },
    { name: "3 — 1200px", maxW: "max-w-[1200px]", px: "px-5" },
    { name: "4 — 1320px", maxW: "max-w-[1320px]", px: "px-6" },
    { name: "5 — 1440px", maxW: "max-w-[1440px]", px: "px-8" },
    { name: "6 — 860px", maxW: "max-w-[860px]", px: "px-5" },
    { name: "7 — 1140px", maxW: "max-w-[1140px]", px: "px-5" },
    { name: "8 — Full (px-10)", maxW: "max-w-full", px: "px-10 md:px-16" },
    { name: "9 — Full (px-20)", maxW: "max-w-full", px: "px-5 md:px-20" },
    { name: "10 — 1060px (px-8)", maxW: "max-w-[1060px]", px: "px-8" },
  ];

  const v = variants[active];

  return (
    <div className="min-h-screen bg-[#f0f2f3]">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e4e7ea] py-3">
        <div className="max-w-[1440px] mx-auto px-5 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {variants.map((item, i) => (
            <button key={i} onClick={() => setActive(i)} className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-medium transition-all ${active === i ? "bg-[#16181a] text-white" : "bg-white border border-[#e4e7ea] text-[#7c8490] hover:text-[#16181a]"}`}>
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Kenglik ko'rsatkichi */}
      <div className="text-center py-3 text-[12px] text-[#7c8490]">
        Kontent kengligi: <span className="font-semibold text-[#16181a]">{v.maxW.replace("max-w-", "").replace("[", "").replace("]", "")}</span> | Yon padding: <span className="font-semibold text-[#16181a]">{v.px}</span>
      </div>

      <div className={`${v.maxW} mx-auto ${v.px} py-10 md:py-14 space-y-10 md:space-y-14`}>
        {/* Search */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#080e18] h-[120px] md:h-[140px] flex items-center justify-center">
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#7ea2d4]/40 blur-[120px] -top-40 -left-28 aurora-blob-1" />
          <span className="relative text-white/30 text-[14px]">Search section</span>
        </div>

        {/* Slider */}
        <div className="bg-gradient-to-br from-[#4a7ab5] via-[#7ea2d4] to-[#a3c4e8] rounded-[20px] h-[200px] md:h-[300px] flex items-center justify-center">
          <span className="text-white/30 text-[14px]">A Class Slider</span>
        </div>

        {/* Categories */}
        <div className="bg-[#e8eaed] rounded-[20px] p-5 md:p-8">
          <h2 className="text-[24px] font-bold text-[#16181a] mb-5">Yo&apos;nalishlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1,2,3,4,5,6].map((i) => (<div key={i} className="bg-[#1e2024] rounded-[18px] h-[85px] md:h-[130px]" />))}
          </div>
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-[24px] font-bold text-[#16181a] mb-5">Mashhur kurslar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["from-[#4a7ab5] to-[#a3c4e8]","from-[#6b5b95] to-[#b0a3d4]","from-[#a35b2d] to-[#d4a07e]","from-[#2d6a5a] to-[#7ec4b8]","from-[#7a6520] to-[#c4a84e]","from-[#1a1a2e] to-[#0f3460]"].map((g, i) => (
              <div key={i} className={`bg-gradient-to-br ${g} rounded-[18px] h-[200px]`} />
            ))}
          </div>
          <div className="mt-5 h-[48px] rounded-[14px] bg-gradient-to-r from-[#4a7ab5] to-[#7ea2d4]" />
        </div>

        {/* Ariza */}
        <div className="bg-gradient-to-br from-[#1e2530] via-[#253550] to-[#1e2530] rounded-[20px] h-[350px] flex items-center justify-center">
          <span className="text-white/30 text-[14px]">Ariza section</span>
        </div>

        {/* CTA */}
        <div className="bg-[#16181a] rounded-[20px] h-[100px] flex items-center justify-center">
          <span className="text-white/30 text-[14px]">CTA section</span>
        </div>
      </div>
    </div>
  );
}
