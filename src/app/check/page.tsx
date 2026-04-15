"use client";

import { useState } from "react";

export default function CheckPage() {
  const [active, setActive] = useState(0);

  const fonts = [
    { name: "1 — Kalam (tanlangan)", family: "'Kalam', cursive", url: "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap" },
    { name: "2 — Nanum Pen Script", family: "'Nanum Pen Script', cursive", url: "https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap" },
    { name: "3 — Reenie Beanie", family: "'Reenie Beanie', cursive", url: "https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap" },
    { name: "4 — Coming Soon", family: "'Coming Soon', cursive", url: "https://fonts.googleapis.com/css2?family=Coming+Soon&display=swap" },
    { name: "5 — Pangolin", family: "'Pangolin', cursive", url: "https://fonts.googleapis.com/css2?family=Pangolin&display=swap" },
    { name: "6 — Sriracha", family: "'Sriracha', cursive", url: "https://fonts.googleapis.com/css2?family=Sriracha&display=swap" },
    { name: "7 — Neucha", family: "'Neucha', cursive", url: "https://fonts.googleapis.com/css2?family=Neucha&display=swap" },
    { name: "8 — Bad Script", family: "'Bad Script', cursive", url: "https://fonts.googleapis.com/css2?family=Bad+Script&display=swap" },
    { name: "9 — Marck Script", family: "'Marck Script', cursive", url: "https://fonts.googleapis.com/css2?family=Marck+Script&display=swap" },
    { name: "10 — Comforter Brush", family: "'Comforter Brush', cursive", url: "https://fonts.googleapis.com/css2?family=Comforter+Brush&display=swap" },
  ];

  const text = "O'zingizga qiziq sohani kashf qiling";

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      {fonts.map((f) => <link key={f.name} rel="stylesheet" href={f.url} />)}

      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e4e7ea] py-3">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {fonts.map((f, i) => (
            <button key={i} onClick={() => setActive(i)} className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-medium transition-all ${active === i ? "bg-[#16181a] text-white" : "bg-white border border-[#e4e7ea] text-[#7c8490] hover:text-[#16181a]"}`}>
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-10 space-y-6">

        <div className="bg-[#1e2024] rounded-[18px] h-[100px] flex items-center justify-center">
          <span className="text-white/20 text-[13px]">Slider</span>
        </div>
        <p className="text-center text-[24px] md:text-[34px] text-[#16181a] py-3" style={{ fontFamily: fonts[active].family }}>{text}</p>
        <div className="bg-[#e8eaed] rounded-[18px] h-[150px] flex items-center justify-center">
          <span className="text-[#7c8490] text-[13px]">Yo&apos;nalishlar</span>
        </div>
        <p className="text-center text-[24px] md:text-[34px] text-[#16181a] py-3" style={{ fontFamily: fonts[active].family }}>Eng yaxshi kurslar shu yerda</p>
        <div className="grid grid-cols-3 gap-3">
          {["from-[#4a7ab5] to-[#a3c4e8]","from-[#6b5b95] to-[#b0a3d4]","from-[#a35b2d] to-[#d4a07e]"].map((g, i) => (
            <div key={i} className={`bg-gradient-to-br ${g} rounded-[18px] h-[120px]`} />
          ))}
        </div>
        <p className="text-center text-[24px] md:text-[34px] text-[#16181a] py-3" style={{ fontFamily: fonts[active].family }}>Kurs topa olmadingizmi? Biz yordam beramiz</p>
        <div className="bg-gradient-to-br from-[#1e2530] via-[#253550] to-[#1e2530] rounded-[18px] h-[150px] flex items-center justify-center">
          <span className="text-white/20 text-[13px]">Ariza</span>
        </div>

        {/* Solishtirish */}
        <div className="mt-12 pt-8 border-t border-[#e4e7ea]">
          <p className="text-[12px] text-[#7c8490] mb-6">Barcha fontlar solishtirish:</p>
          <div className="space-y-5">
            {fonts.map((f, i) => (
              <div key={i} className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${active === i ? "bg-[#7ea2d4]/10 -mx-4 px-4 py-3 rounded-[14px]" : ""}`}>
                <span className="text-[11px] text-[#7c8490] md:w-[200px] shrink-0">{f.name}</span>
                <p className="text-[24px] md:text-[30px] text-[#16181a]" style={{ fontFamily: f.family }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
