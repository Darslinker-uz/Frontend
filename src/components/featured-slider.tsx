"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin, Clock, Users } from "lucide-react";
import Link from "next/link";

const SLIDE_DURATION = 6000;

interface Slide {
  slug: string;
  categorySlug: string;
  category: string;
  format: string;
  location: string;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  rating: string;
  seats: string;
  gradient: string;
  iconPath: string;
}

const slides: Slide[] = [
  { slug: "javascript-react-fullstack", categorySlug: "dasturlash", category: "Dasturlash", format: "Bootcamp", location: "Chilonzor, Toshkent", title: "Python & Django Full-stack bootcamp", subtitle: "IT Park Academy", price: "850 000 so'm", duration: "6 oy", rating: "4.9", seats: "3 bo'sh joy", gradient: "from-[#4a7ab5] via-[#7ea2d4] to-[#a3c4e8]", iconPath: "M2 3h20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7 8l4 4-4 4M13 16h4" },
  { slug: "ui-ux-dizayn-figma", categorySlug: "dizayn", category: "Dizayn", format: "Online", location: "Online", title: "UI/UX dizayn Figma masterclass", subtitle: "Sarvar Nazarov", price: "Bepul", duration: "3 oy", rating: "4.7", seats: "1200+ o'quvchilar", gradient: "from-[#6b5b95] via-[#8b7bb5] to-[#b0a3d4]", iconPath: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586" },
  { slug: "ielts-intensive-7", categorySlug: "xorijiy-tillar", category: "Ingliz tili", format: "Offline", location: "Yunusobod, Toshkent", title: "Ingliz tili A1 dan B2 gacha", subtitle: "English Time", price: "350 000 so'm", duration: "8 oy", rating: "4.8", seats: "7 bo'sh joy", gradient: "from-[#2d6a5a] via-[#4a9e8a] to-[#7ec4b8]", iconPath: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { slug: "digital-marketing-smm", categorySlug: "marketing", category: "Marketing", format: "Intensiv", location: "Samarqand", title: "Digital Marketing & SMM intensiv", subtitle: "Marketing Pro", price: "400 000 so'm", duration: "4 oy", rating: "4.6", seats: "5 bo'sh joy", gradient: "from-[#a35b2d] via-[#c47e4a] to-[#d4a07e]", iconPath: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { slug: "data-science-ai-bootcamp", categorySlug: "dasturlash", category: "Data Science", format: "Bootcamp", location: "Mirzo Ulug'bek, Toshkent", title: "Data Science & AI bootcamp", subtitle: "AI Academy", price: "1 200 000 so'm", duration: "4 oy", rating: "4.9", seats: "2 bo'sh joy", gradient: "from-[#16181a] via-[#2a3f5f] to-[#4a7ab5]", iconPath: "M12 2C6.48 2 2 3.34 2 5v14c0 1.66 4.48 3 10 3s10-1.34 10-3V5c0-1.66-4.48-3-10-3zM2 12c0 1.66 4.48 3 10 3s10-1.34 10-3" },
  { slug: "flutter-mobil-ilova", categorySlug: "dasturlash", category: "Mobil dasturlash", format: "Video", location: "YouTube", title: "Flutter — mobil ilova yaratish", subtitle: "Botir Xolmatov", price: "Bepul", duration: "3 oy", rating: "4.5", seats: "2000+ o'quvchilar", gradient: "from-[#7a3e6b] via-[#a05e92] to-[#c47eb5]", iconPath: "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" },
  { slug: "rus-tili-noldan-b1", categorySlug: "xorijiy-tillar", category: "Rus tili", format: "Offline", location: "Toshkent", title: "Rus tili — noldan B1 gacha", subtitle: "Multilang Academy", price: "280 000 so'm", duration: "6 oy", rating: "4.6", seats: "10 bo'sh joy", gradient: "from-[#8b2f3a] via-[#b34a58] to-[#d4707e]", iconPath: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" },
  { slug: "grafik-dizayn-pro", categorySlug: "dizayn", category: "Grafik dizayn", format: "Offline", location: "Chilonzor, Toshkent", title: "Adobe Photoshop & Illustrator Pro", subtitle: "Astrum IT Academy", price: "750 000 so'm", duration: "5 oy", rating: "4.8", seats: "4 bo'sh joy", gradient: "from-[#7a6520] via-[#a08a35] to-[#c4a84e]", iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { slug: "startup-tadbirkorlik", categorySlug: "biznes", category: "Matematika", format: "Online", location: "Online", title: "Olimpiada matematikasi — 9-11 sinf", subtitle: "MathPro Academy", price: "200 000 so'm", duration: "4 oy", rating: "4.9", seats: "15 bo'sh joy", gradient: "from-[#2c2c2c] via-[#424242] to-[#5a5a5a]", iconPath: "M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM6 6h12M6 12h4M6 18h4M14 12h4M14 18h4" },
  { slug: "startup-tadbirkorlik", categorySlug: "biznes", category: "Biznes", format: "Intensiv", location: "Toshkent", title: "Startup va tadbirkorlik asoslari", subtitle: "Business Hub", price: "500 000 so'm", duration: "2 oy", rating: "4.7", seats: "8 bo'sh joy", gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]", iconPath: "M20 7h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" },
];

export function FeaturedSlider() {
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
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
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
  }, [current]);

  return (
    <div
      className={`rounded-[24px] overflow-hidden relative bg-gradient-to-br ${slides[current].gradient}`}
    >
      {/* Slides — chapga surish animatsiya */}
      <div className="relative min-h-[360px] md:min-h-[480px]">
        {slides.map((slide, i) => {
          // Doim chapga: hozirgi=0%, oldingi=-100%, qolganlari=100% (o'ngda kutadi)
          let tx = "100%";
          if (i === current) tx = "0%";
          else if (i === prevIndex) tx = "-100%";

          return (
            <div
              key={i}
              className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} ${i === current ? "z-10" : i === prevIndex ? "z-[5]" : "z-0"}`}
              style={{
                transform: `translate3d(${tx}, 0, 0)`,
                transition: i === current || i === prevIndex ? "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
                willChange: "transform",
              }}
            >
              {/* Dot pattern */}
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

              {/* Card bosilganda kurs sahifasiga o'tish */}
              <Link href={`/kurslar/${slide.categorySlug}/${slide.slug}`} className="absolute inset-0 z-[2]" />
              <div className="relative flex min-h-[300px] md:min-h-[340px]">
                {/* Left — text */}
                <div className="flex-1 p-5 pt-6 pb-[70px] md:p-10 md:pb-20 lg:p-12 lg:pb-20 flex flex-col">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-4 md:mb-6">
                    <span className="inline-flex items-center px-2.5 md:px-3 py-1 rounded-full bg-white/20 text-white text-[11px] md:text-[12px] font-semibold backdrop-blur-sm">{slide.category}</span>
                    <span className="inline-flex items-center px-2.5 md:px-3 py-1 rounded-full bg-white/10 text-white/70 text-[11px] md:text-[12px] font-medium">{slide.format}</span>
                    <span className="inline-flex items-center gap-1 px-2.5 md:px-3 py-1 rounded-full bg-white/10 text-white/70 text-[11px] md:text-[12px] font-medium"><MapPin className="w-3 h-3" />{slide.location}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-[22px] md:text-[32px] lg:text-[36px] font-bold text-white leading-[1.15] mb-2 md:mb-3 line-clamp-2 min-h-[52px] md:min-h-[76px]">{slide.title}</h2>
                  <p className="text-[13px] md:text-[15px] text-white/50 mb-auto">{slide.subtitle} &middot; {slide.location}</p>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-4 md:mt-6">
                    <div className="px-3 md:px-4 py-2 md:py-2.5 rounded-[10px] md:rounded-[14px] bg-white/10">
                      <p className="text-[9px] md:text-[10px] text-white/40 mb-0.5">Narx</p>
                      <p className="text-[14px] md:text-[17px] font-bold text-white">{slide.price}</p>
                    </div>
                    <div className="px-3 md:px-4 py-2 md:py-2.5 rounded-[10px] md:rounded-[14px] bg-white/10">
                      <p className="text-[9px] md:text-[10px] text-white/40 mb-0.5">Davomiylik</p>
                      <p className="text-[14px] md:text-[17px] font-bold text-white">{slide.duration}</p>
                    </div>
                    <div className="px-3 md:px-4 py-2 md:py-2.5 rounded-[10px] md:rounded-[14px] bg-white/10">
                      <p className="text-[9px] md:text-[10px] text-white/40 mb-0.5">Reyting</p>
                      <p className="text-[14px] md:text-[17px] font-bold text-white flex items-center gap-1"><Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-white text-white" />{slide.rating}</p>
                    </div>
                    <div className="hidden sm:block px-3 md:px-4 py-2 md:py-2.5 rounded-[10px] md:rounded-[14px] bg-white/10">
                      <p className="text-[9px] md:text-[10px] text-white/40 mb-0.5">Bo&apos;sh joy</p>
                      <p className="text-[14px] md:text-[17px] font-bold text-white">{slide.seats}</p>
                    </div>
                  </div>
                </div>

                {/* Right — katta icon (faqat desktop) */}
                <div className="hidden lg:flex items-center justify-center w-[280px] shrink-0 pr-6">
                  <svg className="h-[220px] w-[220px] text-white/[0.12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={slide.iconPath} />
                  </svg>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Glass footer — slide ustida */}
      <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-20 rounded-[14px] md:rounded-[16px] bg-white/[0.08] backdrop-blur-md border border-white/[0.08] px-4 py-3 md:px-6 md:py-3.5 flex items-center justify-between gap-3">
        {/* Chap — prev tugma + dots */}
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
          {/* Mobile: faqat counter */}
          <span className="sm:hidden text-[12px] text-white/30 font-medium tabular-nums">{current + 1}/{slides.length}</span>
          <button onClick={next} className="w-8 h-8 md:w-9 md:h-9 rounded-[8px] md:rounded-[10px] border border-white/15 flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/25 transition-colors shrink-0">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* O'ng — buttonlar */}
        <div className="flex items-center gap-2">
          <Link href={`/kurslar/${slides[current].categorySlug}/${slides[current].slug}`} className="h-[34px] md:h-[38px] px-4 md:px-5 rounded-[8px] md:rounded-[10px] bg-white/50 text-[#16181a] text-[12px] md:text-[13px] font-semibold hover:bg-white/70 transition-colors flex items-center">Bog&apos;lanish</Link>
          <Link href={`/kurslar/${slides[current].categorySlug}/${slides[current].slug}`} className="hidden sm:flex h-[34px] md:h-[38px] px-4 md:px-5 rounded-[8px] md:rounded-[10px] bg-white/50 text-[#16181a] text-[12px] md:text-[13px] font-semibold hover:bg-white/70 transition-colors items-center">Batafsil</Link>
        </div>
      </div>
    </div>
  );
}
