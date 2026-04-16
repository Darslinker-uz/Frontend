"use client";

import { useEffect, useRef } from "react";
import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Course {
  title: string;
  category: string;
  format: string;
  provider: string;
  location: string;
  price: string;
  priceFree: boolean;
  rating: string;
  duration: string;
  gradient: string;
  iconPath: string;
}

function CourseCard({ c }: { c: Course }) {
  return (
    <div className={`group relative overflow-hidden rounded-[22px] bg-gradient-to-br ${c.gradient} flex flex-col shrink-0 w-[360px] h-[500px] md:h-[560px] cursor-pointer transition-all`}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all duration-300 z-[1]" />
      <svg className="absolute right-5 bottom-24 w-[90px] h-[90px] text-white/[0.06]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"><path d={c.iconPath} /></svg>
      <div className="relative z-[2] p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-5">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold">{c.category}</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-[12px]">{c.format}</span>
        </div>
        <h3 className="text-[22px] font-bold text-white leading-tight">{c.title}</h3>
        <p className="text-[14px] text-white/35 mt-3">{c.provider} · {c.location}</p>
        <div className="flex items-center gap-3 mt-4 text-[13px] text-white/30">
          <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-white/50 text-white/50" />{c.rating}</span>
          <span>{c.duration}</span>
        </div>
        <div className="mt-auto" />
      </div>
      <div className="relative z-[2] mx-4 mb-4 rounded-[14px] bg-white/[0.1] border border-white/[0.08] px-5 py-3.5 flex items-center justify-between">
        <span className="text-[16px] font-bold text-white">{c.priceFree ? "Bepul" : `${c.price} so'm`}</span>
        <ArrowRight className="w-4 h-4 text-white/30" />
      </div>
    </div>
  );
}

export function CoursesSlider({ courses }: { courses: Course[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const onPrevRef = useRef(() => {});
  const onNextRef = useRef(() => {});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Mobileda animatsiya yo'q — faqat native scroll
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const cardW = el.querySelector<HTMLElement>(":scope > div")?.offsetWidth ?? 360;
    const gap = 20;
    const step = cardW + gap;
    const half = el.scrollWidth / 2;
    const centerOffset = (el.offsetWidth - cardW) / 2;
    let id: number;
    let paused = true;
    let pauseTimer: ReturnType<typeof setTimeout>;
    let cardIndex = 0;

    posRef.current = -centerOffset;
    targetRef.current = -centerOffset;

    const wrap = () => {
      if (posRef.current >= half) { posRef.current -= half; targetRef.current -= half; }
      if (posRef.current < 0) { posRef.current += half; targetRef.current += half; }
    };

    const startPause = () => { paused = true; pauseTimer = setTimeout(() => { cardIndex++; targetRef.current = cardIndex * step - centerOffset; paused = false; }, 3000); };

    onPrevRef.current = () => {
      clearTimeout(pauseTimer);
      cardIndex--;
      targetRef.current = cardIndex * step - centerOffset;
      paused = false;
    };
    onNextRef.current = () => {
      clearTimeout(pauseTimer);
      cardIndex++;
      targetRef.current = cardIndex * step - centerOffset;
      paused = false;
    };

    const go = () => {
      if (!paused) {
        const diff = targetRef.current - posRef.current;
        if (Math.abs(diff) < 1) {
          posRef.current = targetRef.current;
          wrap();
          cardIndex = Math.round((posRef.current + centerOffset) / step);
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
  }, []);

  return (
    <div>
      <div ref={ref} className="flex gap-5 overflow-x-auto md:overflow-hidden" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {[...courses, ...courses].map((c, i) => <CourseCard key={i} c={c} />)}
      </div>

      {/* Barcha kurslar + < > */}
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 mt-5">
        {/* Mobil */}
        <div className="flex items-center md:hidden">
          <Link href="/kurslar" className="flex-1 h-11 rounded-full bg-white text-[#16181a] text-[13px] font-medium hover:bg-white/80 flex items-center justify-center gap-2 transition-all">
            Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2 justify-center">
          <Link href="/kurslar" className="h-10 px-5 rounded-full bg-white text-[#16181a] text-[13px] font-medium hover:bg-white/80 flex items-center gap-2 transition-all">
            Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
          </Link>
          <button onClick={() => onPrevRef.current()} className="w-10 h-10 rounded-full bg-white text-[#16181a] hover:bg-white/80 flex items-center justify-center transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => onNextRef.current()} className="w-10 h-10 rounded-full bg-white text-[#16181a] hover:bg-white/80 flex items-center justify-center transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
