"use client";

import { useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star, Video, MapPin, UserCheck } from "lucide-react";
import Link from "next/link";
import { FAKE_TUTORS, type FakeTutor, tutorInitials } from "@/data/fake-tutors";

// Katta slider kartasi — bosh sahifadagi mashhur kurslar kartasi o'lchamida (360×560)
function TutorSlideCard({ t }: { t: FakeTutor }) {
  // Real repetitor (slug bor) → uning detail sahifasiga, fake → /repetitorlar/barcha
  const href = t.slug ? `/repetitorlar/${t.slug}` : "/repetitorlar/barcha";
  return (
    <Link href={href} className="group relative overflow-hidden rounded-[22px] flex flex-col shrink-0 w-[360px] h-[500px] md:h-[560px] cursor-pointer" style={{ background: t.gradient }}>
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
      {/* Watermark icon */}
      <svg className="absolute -right-6 -bottom-6 w-[180px] h-[180px] text-white/[0.05]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></svg>
      {/* Hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.06] transition-all duration-300 z-[1]" />

      <div className="relative z-[2] p-6 md:p-7 flex-1 flex flex-col">
        {/* Avatar + verified */}
        <div className="relative w-[76px] h-[76px]">
          <div className="w-[76px] h-[76px] rounded-full bg-white/20 border border-white/20 flex items-center justify-center text-[28px] font-bold text-white">
            {tutorInitials(t.name)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center" title="Tekshirilgan">
            <UserCheck className="w-3.5 h-3.5 text-fuchsia-700" />
          </div>
        </div>

        {/* Name + subject */}
        <h3 className="text-[26px] md:text-[28px] font-bold text-white leading-tight mt-5">{t.name}</h3>
        <p className="text-[14px] text-white/70 mt-1.5">{t.subject}</p>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-white bg-white/15 border border-white/15 rounded-full px-2.5 py-1">
            {t.online ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
            {t.region}
          </span>
          <span className="inline-flex items-center text-[12px] font-medium text-white bg-white/15 border border-white/15 rounded-full px-2.5 py-1">
            {t.experience} yil tajriba
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-4">
          <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
          <span className="text-[14px] font-bold text-white">{t.rating.toFixed(1)}</span>
          <span className="text-[13px] text-white/50">({t.reviews} sharh)</span>
        </div>

        <div className="mt-auto" />
      </div>

      {/* Price bar */}
      <div className="relative z-[2] mx-4 mb-4 rounded-[14px] bg-white/[0.1] border border-white/[0.08] px-5 py-3.5 flex items-center justify-between">
        <span className="text-[16px] font-bold text-white">{t.price.toLocaleString("ru-RU")} so&apos;m<span className="text-white/60 font-normal text-[13px]">/soat</span></span>
        <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
      </div>
    </Link>
  );
}

export function RepetitorlarSlider({ tutors }: { tutors?: FakeTutor[] }) {
  // Dastlabki 10 ta repetitor (props bo'lsa real+fake, bo'lmasa faqat fake demo)
  const TUTORS = (tutors && tutors.length > 0 ? tutors : FAKE_TUTORS).slice(0, 10);
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

    const moveNext = () => {
      const step = getStep();
      animateScroll(step, () => {
        const first = el.children[0] as HTMLElement;
        el.appendChild(first);
        el.scrollLeft -= step;
        startAuto();
      });
    };

    const movePrev = () => {
      const step = getStep();
      const last = el.children[el.children.length - 1] as HTMLElement;
      el.insertBefore(last, el.children[0]);
      el.scrollLeft += step;
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
    return () => clearTimeout(autoTimer);
  }, []);

  const handlePrev = useCallback(() => onPrevRef.current(), []);
  const handleNext = useCallback(() => onNextRef.current(), []);

  return (
    <div>
      <div ref={ref} className="flex gap-5 overflow-x-auto md:overflow-hidden scrollbar-hide" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {TUTORS.map((t, i) => <TutorSlideCard key={i} t={t} />)}
      </div>

      {/* Controls */}
      <div className="mt-6">
        <div className="flex items-center md:hidden">
          <Link href="/repetitorlar/barcha" className="flex-1 h-11 rounded-full bg-white border border-[#e4e7ea] text-[#16181a] text-[13px] font-medium hover:border-fuchsia-300 flex items-center justify-center gap-2 transition-all">
            Barcha repetitorlar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2 justify-center">
          <Link href="/repetitorlar/barcha" className="h-10 px-5 rounded-full bg-white border border-[#e4e7ea] text-[#16181a] text-[13px] font-medium hover:border-fuchsia-300 flex items-center gap-2 transition-all">
            Barcha repetitorlar <ArrowRight className="w-4 h-4" />
          </Link>
          <button onClick={handlePrev} aria-label="Oldingi" className="w-10 h-10 rounded-full bg-white border border-[#e4e7ea] text-[#16181a] hover:border-fuchsia-300 hover:text-fuchsia-700 flex items-center justify-center transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNext} aria-label="Keyingi" className="w-10 h-10 rounded-full bg-white border border-[#e4e7ea] text-[#16181a] hover:border-fuchsia-300 hover:text-fuchsia-700 flex items-center justify-center transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
