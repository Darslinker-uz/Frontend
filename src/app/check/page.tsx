"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const courses = [
  { title: "JavaScript & React", category: "Dasturlash", format: "Offline", provider: "Najot Ta'lim", price: "650 000", rating: "4.9", duration: "6 oy", gradient: "from-[#4a7ab5] via-[#7ea2d4] to-[#a3c4e8]", iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { title: "UI/UX dizayn Figma", category: "Dizayn", format: "Online", provider: "Sarvar Nazarov", price: "Bepul", rating: "4.7", duration: "3 oy", gradient: "from-[#6b5b95] via-[#8b7bb5] to-[#b0a3d4]", iconPath: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586" },
  { title: "Digital Marketing & SMM", category: "Marketing", format: "Offline", provider: "Marketing Pro", price: "400 000", rating: "4.6", duration: "4 oy", gradient: "from-[#a35b2d] via-[#c47e4a] to-[#d4a07e]", iconPath: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { title: "IELTS Intensive 7.0+", category: "Ingliz tili", format: "Offline", provider: "Everest School", price: "600 000", rating: "4.9", duration: "2 oy", gradient: "from-[#2d6a5a] via-[#4a9e8a] to-[#7ec4b8]", iconPath: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { title: "Flutter mobil ilova", category: "Dasturlash", format: "Video", provider: "Botir Xolmatov", price: "Bepul", rating: "4.5", duration: "3 oy", gradient: "from-[#7a6520] via-[#a08a35] to-[#c4a84e]", iconPath: "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" },
  { title: "Data Science & AI", category: "Dasturlash", format: "Bootcamp", provider: "AI Academy", price: "1 200 000", rating: "4.9", duration: "4 oy", gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]", iconPath: "M12 2a10 10 0 1 0 10 10H12V2z" },
  { title: "Python Backend", category: "Dasturlash", format: "Offline", provider: "Najot Ta'lim", price: "750 000", rating: "4.8", duration: "5 oy", gradient: "from-[#2d6a5a] via-[#4a9e8a] to-[#7ec4b8]", iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { title: "Grafik Dizayn Pro", category: "Dizayn", format: "Offline", provider: "Astrum IT", price: "900 000", rating: "4.7", duration: "4 oy", gradient: "from-[#8b2f3a] via-[#b34a58] to-[#d4707e]", iconPath: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586" },
];

function CourseCard({ c }: { c: typeof courses[0] }) {
  return (
    <div className={`relative overflow-hidden rounded-[22px] bg-gradient-to-br ${c.gradient} flex flex-col shrink-0 w-[360px] h-[560px]`}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
      <svg className="absolute right-5 bottom-24 w-[90px] h-[90px] text-white/[0.06]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"><path d={c.iconPath} /></svg>
      <div className="relative p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-5">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold">{c.category}</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-[12px]">{c.format}</span>
        </div>
        <h3 className="text-[22px] font-bold text-white leading-tight">{c.title}</h3>
        <p className="text-[14px] text-white/35 mt-3">{c.provider}</p>
        <div className="flex items-center gap-3 mt-4 text-[13px] text-white/30">
          <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-white/50 text-white/50" />{c.rating}</span>
          <span>{c.duration}</span>
        </div>
        <div className="mt-auto" />
      </div>
      <div className="relative mx-4 mb-4 rounded-[14px] bg-white/[0.1] border border-white/[0.08] px-5 py-3.5 flex items-center justify-between">
        <span className="text-[16px] font-bold text-white">{c.price === "Bepul" ? "Bepul" : `${c.price} so'm`}</span>
        <ArrowRight className="w-4 h-4 text-white/30" />
      </div>
    </div>
  );
}

function AnimPause({ onPrev, onNext }: { onPrev: React.MutableRefObject<() => void>, onNext: React.MutableRefObject<() => void> }) {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const cardW = 380;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let id: number;
    let paused = true;
    let pauseTimer: ReturnType<typeof setTimeout>;

    const half = el.scrollWidth / 2;

    const wrap = () => {
      if (posRef.current >= half) { posRef.current -= half; targetRef.current -= half; }
      if (posRef.current < 0) { posRef.current += half; targetRef.current += half; }
    };

    const startPause = () => { paused = true; pauseTimer = setTimeout(() => { targetRef.current += cardW; paused = false; }, 3000); };

    onPrev.current = () => {
      clearTimeout(pauseTimer);
      targetRef.current -= cardW;
      paused = false;
    };
    onNext.current = () => {
      clearTimeout(pauseTimer);
      targetRef.current += cardW;
      paused = false;
    };

    const go = () => {
      if (!paused) {
        const diff = targetRef.current - posRef.current;
        if (Math.abs(diff) < 1) {
          posRef.current = targetRef.current;
          wrap();
          startPause();
        }
        else posRef.current += diff * 0.05;
      }
      wrap();
      el.scrollLeft = posRef.current;
      id = requestAnimationFrame(go);
    };
    startPause();
    id = requestAnimationFrame(go);
    return () => { cancelAnimationFrame(id); clearTimeout(pauseTimer); };
  }, [onPrev, onNext]);

  return (
    <div ref={ref} className="flex gap-5 overflow-hidden" style={{ scrollbarWidth: "none" }}>
      {[...courses, ...courses].map((c, i) => <CourseCard key={i} c={c} />)}
    </div>
  );
}

export default function CheckPage() {
  const onPrev = useRef(() => {});
  const onNext = useRef(() => {});

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="py-10 space-y-6">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20">
          <h2 className="text-[24px] md:text-[28px] font-bold text-[#16181a] mb-5">Mashhur kurslar</h2>
        </div>

        <AnimPause onPrev={onPrev} onNext={onNext} />

        {/* Barcha kurslar + < > */}
        <div className="max-w-[1600px] mx-auto px-5 md:px-20">
          {/* Mobil — button to'liq kenglikda, < > ostida */}
          <div className="flex flex-col gap-3 md:hidden">
            <button className="w-full h-11 rounded-full bg-[#16181a] text-white text-[13px] font-medium hover:bg-[#16181a]/80 flex items-center justify-center gap-2 transition-all">
              Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => onPrev.current()} className="w-10 h-10 rounded-full bg-[#16181a] text-white hover:bg-[#16181a]/80 flex items-center justify-center transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => onNext.current()} className="w-10 h-10 rounded-full bg-[#16181a] text-white hover:bg-[#16181a]/80 flex items-center justify-center transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Desktop — button o'rtada, < > o'ngda */}
          <div className="hidden md:flex items-center">
            <div className="flex-1" />
            <button className="h-10 px-5 rounded-full bg-[#16181a] text-white text-[13px] font-medium hover:bg-[#16181a]/80 flex items-center gap-2 transition-all">
              Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex-1 flex justify-end gap-2">
              <button onClick={() => onPrev.current()} className="w-10 h-10 rounded-full bg-[#16181a] text-white hover:bg-[#16181a]/80 flex items-center justify-center transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => onNext.current()} className="w-10 h-10 rounded-full bg-[#16181a] text-white hover:bg-[#16181a]/80 flex items-center justify-center transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
