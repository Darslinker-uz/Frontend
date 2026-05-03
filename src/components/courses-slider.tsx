"use client";

import { useEffect, useRef, useCallback } from "react";
import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/data/courses";

function CourseCard({ c }: { c: Course }) {
  return (
    <Link href={`/kurslar/${c.categorySlug}/${c.slug}`} className={`group relative overflow-hidden rounded-[22px] bg-gradient-to-br ${c.gradient} flex flex-col shrink-0 w-[360px] h-[500px] md:h-[560px] cursor-pointer transition-all`}>
      {c.imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.imageUrl} alt={c.title} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: `${c.imagePosX ?? 50}% ${c.imagePosY ?? 50}%`, transform: `scale(${(c.imageZoom ?? 100) / 100})`, transformOrigin: `${c.imagePosX ?? 50}% ${c.imagePosY ?? 50}%` }} />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
          <svg className="absolute right-5 bottom-24 w-[90px] h-[90px] text-white/[0.06]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"><path d={c.iconPath} /></svg>
        </>
      )}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all duration-300 z-[1]" />
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
    </Link>
  );
}

export function CoursesSlider({ courses }: { courses: Course[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const onPrevRef = useRef(() => {});
  const onNextRef = useRef(() => {});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    let animating = false;
    let autoTimer: ReturnType<typeof setTimeout>;

    const getStep = () => {
      const first = el.children[0] as HTMLElement;
      return first.offsetWidth + 20; // card width + gap
    };

    const animateScroll = (distance: number, onDone: () => void) => {
      if (animating) return;
      animating = true;
      const start = el.scrollLeft;
      const end = start + distance;
      const duration = 400;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        el.scrollLeft = start + distance * ease;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.scrollLeft = end;
          animating = false;
          onDone();
        }
      };
      requestAnimationFrame(tick);
    };

    // O'ngga — oxirgi cardni boshiga qo'yish (chapga scroll)
    const moveNext = () => {
      const step = getStep();
      animateScroll(step, () => {
        // Birinchi cardni olib oxiriga qo'shamiz
        const first = el.children[0] as HTMLElement;
        el.appendChild(first);
        // Scroll pozitsiyani tuzatamiz (card ko'chgani uchun)
        el.scrollLeft -= step;
        startAuto();
      });
    };

    // Chapga — birinchi cardni oxiridan olib boshiga qo'yish
    const movePrev = () => {
      const step = getStep();
      // Oxirgi cardni olib boshiga qo'shamiz
      const last = el.children[el.children.length - 1] as HTMLElement;
      el.insertBefore(last, el.children[0]);
      // Scroll pozitsiyani tuzatamiz
      el.scrollLeft += step;
      // Keyin chapga animatsiya
      animateScroll(-step, () => {
        startAuto();
      });
    };

    onNextRef.current = () => {
      clearTimeout(autoTimer);
      moveNext();
    };

    onPrevRef.current = () => {
      clearTimeout(autoTimer);
      movePrev();
    };

    const startAuto = () => {
      clearTimeout(autoTimer);
      autoTimer = setTimeout(() => {
        moveNext();
      }, 3000);
    };

    startAuto();

    return () => {
      clearTimeout(autoTimer);
    };
  }, [courses.length]);

  const handlePrev = useCallback(() => onPrevRef.current(), []);
  const handleNext = useCallback(() => onNextRef.current(), []);

  return (
    <div>
      <div ref={ref} className="flex gap-5 overflow-x-auto md:overflow-hidden" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {courses.map((c, i) => <CourseCard key={i} c={c} />)}
      </div>

      {/* Barcha kurslar + < > */}
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 mt-5">
        <div className="flex items-center md:hidden">
          <Link href="/kurslar" className="flex-1 h-11 rounded-full bg-white text-[#16181a] text-[13px] font-medium hover:bg-white/80 flex items-center justify-center gap-2 transition-all">
            Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2 justify-center">
          <Link href="/kurslar" className="h-10 px-5 rounded-full bg-white text-[#16181a] text-[13px] font-medium hover:bg-white/80 flex items-center gap-2 transition-all">
            Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
          </Link>
          <button onClick={handlePrev} className="w-10 h-10 rounded-full bg-white text-[#16181a] hover:bg-white/80 flex items-center justify-center transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNext} className="w-10 h-10 rounded-full bg-white text-[#16181a] hover:bg-white/80 flex items-center justify-center transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
