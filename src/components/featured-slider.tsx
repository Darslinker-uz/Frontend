"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import type { Slide } from "@/lib/featured-slide";

const SLIDE_DURATION = 6000;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FeaturedSlider({ initialSlides }: { initialSlides: Slide[] }) {
  // Server'dan kelgan slides darhol ishlatiladi — fetch yoki loading yo'q.
  // Random shuffle mount paytida bir marta (per session).
  const [slides] = useState<Slide[]>(() => shuffle(initialSlides));
  const [current, setCurrent] = useState(0);
  const [prevIndex, setPrevIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const goTo = useCallback((index: number) => {
    setPrevIndex(current);
    setCurrent(index);
    setProgress(0);
    progressRef.current = 0;
    startTimeRef.current = performance.now();
  }, [current]);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min(elapsed / SLIDE_DURATION, 1);
      progressRef.current = pct;
      setProgress(pct);

      if (pct >= 1) {
        setPrevIndex(current);
        setCurrent((c) => (c + 1) % slides.length);
        startTimeRef.current = now;
        progressRef.current = 0;
        setProgress(0);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [current, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-[24px] overflow-hidden relative bg-gradient-to-br ${slides[current].gradient}`}>
      <div className="relative min-h-[360px] md:min-h-[480px]">
        {slides.map((slide, i) => {
          let tx = "100%";
          if (i === current) tx = "0%";
          else if (i === prevIndex) tx = "-100%";

          return (
            <div
              key={i}
              className={`absolute inset-0 ${slide.imageUrl ? "" : `bg-gradient-to-br ${slide.gradient}`} ${i === current ? "z-10" : i === prevIndex ? "z-[5]" : "z-0"}`}
              style={{
                transform: `translate3d(${tx}, 0, 0)`,
                transition: i === current || i === prevIndex ? "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
                willChange: "transform",
                backgroundColor: slide.imageUrl ? "#16181a" : undefined,
              }}
            >
              {slide.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.imageUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover hidden md:block" style={{ objectPosition: `${slide.imageAPosX}% ${slide.imageAPosY}%`, transform: `scale(${slide.imageAZoom / 100})`, transformOrigin: `${slide.imageAPosX}% ${slide.imageAPosY}%` }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.imageUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover md:hidden" style={{ objectPosition: `${slide.imageAMPosX}% ${slide.imageAMPosY}%`, transform: `scale(${slide.imageAMZoom / 100})`, transformOrigin: `${slide.imageAMPosX}% ${slide.imageAMPosY}%` }} />
                  <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(slide.imageDarkness ?? 15) / 100})` }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              )}

              <Link href={`/kurslar/${slide.categorySlug}/${slide.slug}`} className="absolute inset-0 z-[2]" />
              <div className="relative flex min-h-[300px] md:min-h-[340px]">
                <div className="flex-1 p-5 pt-6 pb-[70px] md:p-10 md:pb-20 lg:p-12 lg:pb-20 flex flex-col">
                  <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-4 md:mb-6">
                    {!slide.title.toLowerCase().includes(slide.category.toLowerCase()) && (
                      <span className="inline-flex items-center px-2.5 md:px-3 py-1 rounded-full bg-white/20 text-white text-[11px] md:text-[12px] font-semibold backdrop-blur-sm">{slide.category}</span>
                    )}
                    <span className="inline-flex items-center px-2.5 md:px-3 py-1 rounded-full bg-white/10 text-white/70 text-[11px] md:text-[12px] font-medium">{slide.format}</span>
                    <span className="inline-flex items-center gap-1 px-2.5 md:px-3 py-1 rounded-full bg-white/10 text-white/70 text-[11px] md:text-[12px] font-medium"><MapPin className="w-3 h-3" />{slide.location}</span>
                  </div>

                  <h2 className="text-[22px] md:text-[32px] lg:text-[36px] font-bold text-white leading-[1.15] mb-2 md:mb-3 line-clamp-2 min-h-[52px] md:min-h-[76px]">{slide.title}</h2>
                  <p className="text-[13px] md:text-[15px] text-white/50 mb-auto">{slide.subtitle} &middot; {slide.location}</p>

                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-4 md:mt-6">
                    <div className="px-3 md:px-4 py-2 md:py-2.5 rounded-[10px] md:rounded-[14px] bg-white/10">
                      <p className="text-[9px] md:text-[10px] text-white/40 mb-0.5">Narx</p>
                      <p className="text-[14px] md:text-[17px] font-bold text-white">{slide.price}</p>
                    </div>
                    <div className="hidden md:block px-3 md:px-4 py-2 md:py-2.5 rounded-[10px] md:rounded-[14px] bg-white/10">
                      <p className="text-[9px] md:text-[10px] text-white/40 mb-0.5">Davomiylik</p>
                      <p className="text-[14px] md:text-[17px] font-bold text-white">{slide.duration}</p>
                    </div>
                    {slide.format && (
                      <div className="px-3 md:px-4 py-2 md:py-2.5 rounded-[10px] md:rounded-[14px] bg-white/10">
                        <p className="text-[9px] md:text-[10px] text-white/40 mb-0.5">Format</p>
                        <p className="text-[14px] md:text-[17px] font-bold text-white">{slide.format}</p>
                      </div>
                    )}
                  </div>
                </div>

                {!slide.imageUrl && (
                  <div className="hidden lg:flex items-center justify-center w-[280px] shrink-0 pr-6">
                    <svg className="h-[220px] w-[220px] text-white/[0.12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={slide.iconPath} />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-20 rounded-[14px] md:rounded-[16px] bg-white/[0.08] backdrop-blur-md border border-white/[0.08] px-4 py-3 md:px-6 md:py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={prev} className="w-8 h-8 md:w-9 md:h-9 rounded-[8px] md:rounded-[10px] border border-white/15 flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/25 transition-colors shrink-0">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="relative h-[5px] rounded-full overflow-hidden transition-all duration-300" style={{ width: i === current ? 28 : 5 }}>
                <div className="absolute inset-0 bg-white/15" />
                {i === current && <div className="absolute inset-0 bg-white/60 rounded-full" style={{ width: `${progress * 100}%` }} />}
                {i < current && <div className="absolute inset-0 bg-white/40 rounded-full" />}
              </button>
            ))}
          </div>
          <span className="sm:hidden text-[12px] text-white/30 font-medium tabular-nums">{current + 1}/{slides.length}</span>
          <button onClick={next} className="w-8 h-8 md:w-9 md:h-9 rounded-[8px] md:rounded-[10px] border border-white/15 flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/25 transition-colors shrink-0">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/kurslar/${slides[current].categorySlug}/${slides[current].slug}`} className="h-[34px] md:h-[38px] px-4 md:px-5 rounded-[8px] md:rounded-[10px] bg-white/50 text-[#16181a] text-[12px] md:text-[13px] font-semibold hover:bg-white/70 transition-colors flex items-center">Bog&apos;lanish</Link>
          <Link href={`/kurslar/${slides[current].categorySlug}/${slides[current].slug}`} className="hidden sm:flex h-[34px] md:h-[38px] px-4 md:px-5 rounded-[8px] md:rounded-[10px] bg-white/50 text-[#16181a] text-[12px] md:text-[13px] font-semibold hover:bg-white/70 transition-colors items-center">Batafsil</Link>
        </div>
      </div>
    </div>
  );
}
