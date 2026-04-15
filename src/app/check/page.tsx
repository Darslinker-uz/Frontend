"use client";

import { useState } from "react";
import { ArrowRight, Star } from "lucide-react";

const courses = [
  { title: "JavaScript & React", category: "Dasturlash", format: "Offline", provider: "Najot Ta'lim", price: "650 000", rating: "4.9", duration: "6 oy", gradient: "from-[#4a7ab5] via-[#7ea2d4] to-[#a3c4e8]", iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { title: "UI/UX dizayn Figma", category: "Dizayn", format: "Online", provider: "Sarvar Nazarov", price: "Bepul", rating: "4.7", duration: "3 oy", gradient: "from-[#6b5b95] via-[#8b7bb5] to-[#b0a3d4]", iconPath: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586" },
  { title: "Digital Marketing", category: "Marketing", format: "Offline", provider: "Marketing Pro", price: "400 000", rating: "4.6", duration: "4 oy", gradient: "from-[#a35b2d] via-[#c47e4a] to-[#d4a07e]", iconPath: "M22 12h-4l-3 9L9 3l-3 9H2" },
];

export default function CheckPage() {
  const [active, setActive] = useState(0);

  const variants = [
    { name: "1 — Ko'k→och ko'k", bg: "bg-gradient-to-r from-[#1e2d42] to-[#2a3d55]", text: "text-white/80" },
    { name: "2 — Qora→ko'k", bg: "bg-gradient-to-r from-[#16181a] to-[#2a3d55]", text: "text-white/80" },
    { name: "3 — Ko'k→kulrang", bg: "bg-gradient-to-r from-[#2a3545] to-[#34363a]", text: "text-white/80" },
    { name: "4 — Kulrang→ko'k", bg: "bg-gradient-to-r from-[#26282c] to-[#1e2d42]", text: "text-white/80" },
    { name: "5 — Och ko'k→oq", bg: "bg-gradient-to-r from-[#dce6f0] to-[#edf1f5]", text: "text-[#1e2d42]" },
    { name: "6 — Ko'k gradient to'q", bg: "bg-gradient-to-r from-[#2a5080] to-[#4a7ab5]", text: "text-white/90" },
    { name: "7 — Tun→ko'k", bg: "bg-gradient-to-r from-[#0f1923] to-[#1e3a5f]", text: "text-white/70" },
    { name: "8 — Ko'k→binafsha", bg: "bg-gradient-to-r from-[#1e2d42] to-[#2a2540]", text: "text-white/80" },
    { name: "9 — Diagonal ko'k", bg: "bg-gradient-to-br from-[#1e2d42] via-[#253550] to-[#1e2d42]", text: "text-white/80" },
    { name: "10 — Qora→kulrang→ko'k", bg: "bg-gradient-to-r from-[#16181a] via-[#26282c] to-[#2a3545]", text: "text-white/80" },
  ];

  const v = variants[active];

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e4e7ea] py-3">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {variants.map((item, i) => (
            <button key={i} onClick={() => setActive(i)} className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-medium transition-all ${active === i ? "bg-[#16181a] text-white" : "bg-white border border-[#e4e7ea] text-[#7c8490] hover:text-[#16181a]"}`}>
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-10">
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#16181a] mb-5">Mashhur kurslar</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {courses.map((c) => (
            <div key={c.title} className={`relative overflow-hidden rounded-[18px] bg-gradient-to-br ${c.gradient} flex flex-col`}>
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
              <svg className="absolute right-4 top-1/3 w-[60px] h-[60px] text-white/[0.08]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d={c.iconPath} /></svg>
              <div className="relative p-5 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">{c.category}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-[11px]">{c.format}</span>
                </div>
                <h3 className="text-[17px] font-bold text-white">{c.title}</h3>
                <p className="text-[12px] text-white/35 mt-1">{c.provider}</p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-white/30">
                  <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-white/50 text-white/50" />{c.rating}</span>
                  <span>{c.duration}</span>
                </div>
              </div>
              <div className="relative mx-3 mb-3 rounded-[12px] bg-white/[0.1] border border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
                <span className="text-[14px] font-bold text-white">{c.price === "Bepul" ? "Bepul" : `${c.price} so'm`}</span>
                <ArrowRight className="w-4 h-4 text-white/30" />
              </div>
            </div>
          ))}
        </div>

        <button className={`mt-5 w-full py-3.5 rounded-[14px] text-[14px] font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90 ${v.bg} ${v.text}`}>
          Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
