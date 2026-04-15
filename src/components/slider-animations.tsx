"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";

const SLIDE_DURATION = 3000;

const demoSlides = [
  {
    category: "Dasturlash",
    format: "Bootcamp",
    location: "Toshkent",
    title: "Python & Django Full-stack",
    subtitle: "IT Park Academy",
    price: "850 000",
    duration: "6 oy",
    rating: "4.9",
    gradient: "from-[#4a7ab5] via-[#7ea2d4] to-[#a3c4e8]",
    iconPath: "M2 3h20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7 8l4 4-4 4M13 16h4",
  },
  {
    category: "Dizayn",
    format: "Online",
    location: "Online",
    title: "UI/UX dizayn Figma masterclass",
    subtitle: "Sarvar Nazarov",
    price: "Bepul",
    duration: "3 oy",
    rating: "4.7",
    gradient: "from-[#6b5b95] via-[#8b7bb5] to-[#b0a3d4]",
    iconPath: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586",
  },
  {
    category: "Marketing",
    format: "Intensiv",
    location: "Samarqand",
    title: "Digital Marketing & SMM",
    subtitle: "Marketing Pro",
    price: "400 000",
    duration: "4 oy",
    rating: "4.6",
    gradient: "from-[#a35b2d] via-[#c47e4a] to-[#d4a07e]",
    iconPath: "M22 12h-4l-3 9L9 3l-3 9H2",
  },
];

function useSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setProgress(0);
    progressRef.current = 0;
    startRef.current = performance.now();
  }, []);

  const next = useCallback(() => goTo((current + 1) % demoSlides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + demoSlides.length) % demoSlides.length), [current, goTo]);

  useEffect(() => {
    startRef.current = performance.now();
    const animate = (now: number) => {
      if (!isPaused) {
        const pct = Math.min((now - startRef.current) / SLIDE_DURATION, 1);
        progressRef.current = pct;
        setProgress(pct);
        if (pct >= 1) {
          setCurrent((c) => (c + 1) % demoSlides.length);
          startRef.current = now;
          progressRef.current = 0;
          setProgress(0);
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPaused, current]);

  return { current, progress, isPaused, setIsPaused, goTo, next, prev, startRef, progressRef };
}

function SliderNav({ current, progress, goTo, prev, next }: { current: number; progress: number; goTo: (i: number) => void; prev: () => void; next: () => void }) {
  return (
    <div className="flex items-center justify-between px-8 md:px-10 pb-6">
      <div className="flex items-center gap-1.5">
        {demoSlides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="relative h-[5px] rounded-full overflow-hidden transition-all duration-300" style={{ width: i === current ? 28 : 5 }}>
            <div className="absolute inset-0 bg-white/15" />
            {i === current && <div className="absolute inset-0 bg-white/60 rounded-full" style={{ width: `${progress * 100}%` }} />}
            {i < current && <div className="absolute inset-0 bg-white/40 rounded-full" />}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-white/30 font-medium tabular-nums">{String(current + 1).padStart(2, "0")}/{String(demoSlides.length).padStart(2, "0")}</span>
        <button onClick={prev} className="w-8 h-8 rounded-[8px] border border-white/15 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={next} className="w-8 h-8 rounded-[8px] border border-white/15 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function SlideContent({ slide }: { slide: typeof demoSlides[0] }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-5">
        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold backdrop-blur-sm">{slide.category}</span>
        <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-[12px] font-medium">{slide.format}</span>
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/70 text-[12px] font-medium"><MapPin className="w-3 h-3" />{slide.location}</span>
      </div>
      <h2 className="text-[26px] md:text-[32px] font-bold text-white leading-[1.12] tracking-[-0.02em] mb-2 line-clamp-2 min-h-[72px]">{slide.title}</h2>
      <p className="text-[14px] text-white/50 mb-auto">{slide.subtitle}</p>
      <div className="flex items-center gap-4 mt-6 mb-5">
        <div className="px-3 py-2 rounded-[12px] bg-white/10 backdrop-blur-sm"><p className="text-[10px] text-white/40">Narx</p><p className="text-[15px] font-bold text-white">{slide.price}</p></div>
        <div className="px-3 py-2 rounded-[12px] bg-white/10 backdrop-blur-sm"><p className="text-[10px] text-white/40">Davomiylik</p><p className="text-[15px] font-bold text-white">{slide.duration}</p></div>
        <div className="px-3 py-2 rounded-[12px] bg-white/10 backdrop-blur-sm"><p className="text-[10px] text-white/40">Reyting</p><p className="text-[15px] font-bold text-white flex items-center gap-1"><Star className="w-3 h-3 fill-white text-white" />{slide.rating}</p></div>
      </div>
      <div className="flex items-center gap-3">
        <button className="h-[40px] px-5 rounded-[10px] bg-white text-[#16181a] text-[13px] font-semibold">Murojaat qilish</button>
        <button className="h-[40px] px-5 rounded-[10px] border border-white/25 text-white text-[13px] font-medium">Batafsil</button>
      </div>
    </>
  );
}

// ====== VARYANT 1: FADE ======
export function SliderFade() {
  const { current, progress, setIsPaused, goTo, next, prev, startRef, progressRef } = useSlider();

  return (
    <div
      className="rounded-[24px] overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); startRef.current = performance.now() - progressRef.current * SLIDE_DURATION; }}
    >
      <div className="relative min-h-[300px]">
        {demoSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-opacity duration-500 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative flex min-h-[300px]">
              <div className="flex-1 p-8 md:p-10 flex flex-col"><SlideContent slide={slide} /></div>
              <div className="hidden md:flex items-center justify-center w-[240px] shrink-0 pr-6">
                <svg className="h-[200px] w-[200px] text-white/[0.12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d={slide.iconPath} /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative z-20"><SliderNav current={current} progress={progress} goTo={goTo} prev={prev} next={next} /></div>
    </div>
  );
}

// ====== VARYANT 2: SLIDE LEFT ======
export function SliderSlide() {
  const { current, progress, setIsPaused, goTo, next, prev, startRef, progressRef } = useSlider();

  return (
    <div
      className="rounded-[24px] overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); startRef.current = performance.now() - progressRef.current * SLIDE_DURATION; }}
    >
      <div className="relative min-h-[300px]">
        {demoSlides.map((slide, i) => {
          let translate = "translate-x-full";
          if (i === current) translate = "translate-x-0";
          else if (i < current) translate = "-translate-x-full";

          return (
            <div
              key={i}
              className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-transform duration-500 ease-in-out ${translate} ${i === current ? "z-10" : "z-0"}`}
            >
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative flex min-h-[300px]">
                <div className="flex-1 p-8 md:p-10 flex flex-col"><SlideContent slide={slide} /></div>
                <div className="hidden md:flex items-center justify-center w-[240px] shrink-0 pr-6">
                  <svg className="h-[200px] w-[200px] text-white/[0.12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d={slide.iconPath} /></svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative z-20 bg-gradient-to-br from-black/20 to-transparent"><SliderNav current={current} progress={progress} goTo={goTo} prev={prev} next={next} /></div>
    </div>
  );
}

// ====== VARYANT 3: SCALE + FADE ======
export function SliderScale() {
  const { current, progress, setIsPaused, goTo, next, prev, startRef, progressRef } = useSlider();

  return (
    <div
      className="rounded-[24px] overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); startRef.current = performance.now() - progressRef.current * SLIDE_DURATION; }}
    >
      <div className="relative min-h-[300px]">
        {demoSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-600 ease-in-out ${i === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"}`}
          >
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative flex min-h-[300px]">
              <div className="flex-1 p-8 md:p-10 flex flex-col"><SlideContent slide={slide} /></div>
              <div className="hidden md:flex items-center justify-center w-[240px] shrink-0 pr-6">
                <svg className="h-[200px] w-[200px] text-white/[0.12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d={slide.iconPath} /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative z-20"><SliderNav current={current} progress={progress} goTo={goTo} prev={prev} next={next} /></div>
    </div>
  );
}

// ====== VARYANT 4: SLIDE UP (pastdan yuqoriga) ======
export function SliderUp() {
  const { current, progress, setIsPaused, goTo, next, prev, startRef, progressRef } = useSlider();

  return (
    <div
      className="rounded-[24px] overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); startRef.current = performance.now() - progressRef.current * SLIDE_DURATION; }}
    >
      <div className="relative min-h-[300px]">
        {demoSlides.map((slide, i) => {
          let transform = "translate-y-full";
          if (i === current) transform = "translate-y-0";
          else if (i < current) transform = "-translate-y-full";

          return (
            <div
              key={i}
              className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-transform duration-500 ease-in-out ${transform} ${i === current ? "z-10" : "z-0"}`}
            >
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative flex min-h-[300px]">
                <div className="flex-1 p-8 md:p-10 flex flex-col"><SlideContent slide={slide} /></div>
                <div className="hidden md:flex items-center justify-center w-[240px] shrink-0 pr-6">
                  <svg className="h-[200px] w-[200px] text-white/[0.12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d={slide.iconPath} /></svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative z-20 bg-gradient-to-br from-black/20 to-transparent"><SliderNav current={current} progress={progress} goTo={goTo} prev={prev} next={next} /></div>
    </div>
  );
}

// ====== VARYANT 5: FLIP (3D burilish) ======
export function SliderFlip() {
  const { current, progress, setIsPaused, goTo, next, prev, startRef, progressRef } = useSlider();

  return (
    <div
      className="rounded-[24px] overflow-hidden relative"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); startRef.current = performance.now() - progressRef.current * SLIDE_DURATION; }}
    >
      <div className="relative min-h-[300px]">
        {demoSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} ${i === current ? "z-10" : "z-0"}`}
            style={{
              transition: "transform 0.6s ease, opacity 0.6s ease",
              transform: i === current ? "rotateY(0deg)" : i < current ? "rotateY(-90deg)" : "rotateY(90deg)",
              opacity: i === current ? 1 : 0,
              backfaceVisibility: "hidden",
            }}
          >
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative flex min-h-[300px]">
              <div className="flex-1 p-8 md:p-10 flex flex-col"><SlideContent slide={slide} /></div>
              <div className="hidden md:flex items-center justify-center w-[240px] shrink-0 pr-6">
                <svg className="h-[200px] w-[200px] text-white/[0.12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d={slide.iconPath} /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative z-20"><SliderNav current={current} progress={progress} goTo={goTo} prev={prev} next={next} /></div>
    </div>
  );
}

// ====== VARYANT 6: BLUR + FADE (xiralashib o'tish) ======
export function SliderBlur() {
  const { current, progress, setIsPaused, goTo, next, prev, startRef, progressRef } = useSlider();

  return (
    <div
      className="rounded-[24px] overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); startRef.current = performance.now() - progressRef.current * SLIDE_DURATION; }}
    >
      <div className="relative min-h-[300px]">
        {demoSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} ${i === current ? "z-10" : "z-0"}`}
            style={{
              transition: "opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease",
              opacity: i === current ? 1 : 0,
              filter: i === current ? "blur(0px)" : "blur(12px)",
              transform: i === current ? "scale(1)" : "scale(1.05)",
            }}
          >
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative flex min-h-[300px]">
              <div className="flex-1 p-8 md:p-10 flex flex-col"><SlideContent slide={slide} /></div>
              <div className="hidden md:flex items-center justify-center w-[240px] shrink-0 pr-6">
                <svg className="h-[200px] w-[200px] text-white/[0.12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d={slide.iconPath} /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative z-20"><SliderNav current={current} progress={progress} goTo={goTo} prev={prev} next={next} /></div>
    </div>
  );
}
