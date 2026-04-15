"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const gradients = [
  "from-[#0f1923] via-[#1a3350] to-[#2d5a8a]",
  "from-[#1a3350] via-[#2d5a8a] to-[#7ea2d4]",
  "from-[#0f1923] via-[#1e3a5f] to-[#4a7ab5]",
  "from-[#2d5a8a] via-[#1a3350] to-[#0f1923]",
  "from-[#16243a] via-[#3d6a96] to-[#7ea2d4]",
  "from-[#0f1923] via-[#2d5a8a] to-[#1a3350]",
];

export function HeroSearch() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % gradients.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-[16px] md:rounded-[20px] border border-[#e4e7ea] overflow-hidden">
      {/* Gradient layers — faqat hozirgi va keyingi ko'rinadi */}
      {gradients.map((g, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-gradient-to-br ${g}`}
          style={{
            opacity: i === index ? 1 : 0,
            transition: "opacity 4s ease-in-out",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative px-5 py-5 md:px-10 md:py-8">
        <h1 className="text-[18px] md:text-[26px] font-semibold text-white tracking-[-0.02em] mb-4 md:mb-5">
          O&apos;zingizga mos kursni toping
        </h1>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-white/25" />
            <input
              type="text"
              placeholder="Kurs izlash..."
              className="w-full h-[40px] md:h-[44px] pl-9 md:pl-10 pr-4 rounded-[10px] md:rounded-[12px] bg-white/[0.07] border border-white/[0.1] text-[13px] md:text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#7ea2d4]/40 focus:border-[#7ea2d4]/50 transition-all"
            />
          </div>
          <button className="h-[40px] w-[40px] md:h-[44px] md:w-auto md:px-4 rounded-[10px] md:rounded-[12px] border border-white/[0.1] text-white/50 font-medium hover:bg-white/[0.06] transition-colors flex items-center justify-center md:gap-2 shrink-0">
            <SlidersHorizontal className="w-[16px] h-[16px]" />
            <span className="hidden md:inline text-[14px]">Filtr</span>
          </button>
          <button className="h-[40px] w-[40px] md:h-[44px] md:w-auto md:px-5 rounded-[10px] md:rounded-[12px] bg-[#7ea2d4] text-[#16181a] text-[14px] font-semibold hover:bg-[#7ea2d4]/90 transition-colors flex items-center justify-center shrink-0">
            <Search className="w-[16px] h-[16px] md:hidden" />
            <span className="hidden md:inline">Qidirish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
