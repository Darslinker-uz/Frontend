import Link from "next/link";
import { ArrowRight } from "lucide-react";

type HeroVariant = "default" | "tutors" | "centers";

type HeroSearchProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: HeroVariant;
};

const VARIANTS: Record<HeroVariant, { gradient: string; waveA: string; waveB: string }> = {
  default: {
    gradient: "from-[#0f1923] via-[#1a3350] to-[#2d5a8a]",
    waveA: "rgba(126,162,212,0.06)",
    waveB: "rgba(126,162,212,0.04)",
  },
  tutors: {
    gradient: "from-[#1b1023] via-[#3a1e4f] to-[#7a3d8a]",
    waveA: "rgba(212,162,212,0.06)",
    waveB: "rgba(212,162,212,0.04)",
  },
  centers: {
    gradient: "from-[#0f231f] via-[#1a4d3f] to-[#2d7a6a]",
    waveA: "rgba(126,212,178,0.06)",
    waveB: "rgba(126,212,178,0.04)",
  },
};

export function HeroSearch({
  title = "O'zingizga mos kursni toping",
  subtitle = "Kurslarni solishtiring, tanlang va o'rganishni boshlang",
  ctaLabel = "Barcha kurslarni ko'rish",
  ctaHref = "/kurslar",
  variant = "default",
}: HeroSearchProps = {}) {
  const v = VARIANTS[variant];
  return (
    <div className={`relative rounded-[16px] md:rounded-[20px] border border-[#e4e7ea] overflow-hidden bg-gradient-to-br ${v.gradient}`}>
      <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden">
        <svg className="absolute bottom-0 w-[200%] h-[60px] animate-[waveMove_6s_linear_infinite]" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1440,0 1440,30 L1440,60 L0,60 Z" fill={v.waveA} />
        </svg>
        <svg className="absolute bottom-0 w-[200%] h-[60px] animate-[waveMove_8s_linear_infinite]" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,35 C200,10 400,55 600,35 C800,10 1000,55 1200,35 C1400,10 1440,35 1440,35 L1440,60 L0,60 Z" fill={v.waveB} />
        </svg>
      </div>
      <div className="relative px-5 py-5 md:px-10 md:py-8">
        {/* Desktop — text chap, CTA o'ng (vertikal o'rtada) */}
        <div className="hidden md:flex md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-semibold text-white tracking-[-0.02em] mb-3">
              {title}
            </h1>
            <p className="text-[15px] text-white/70 max-w-[420px]">{subtitle}</p>
          </div>
          <Link href={ctaHref} className="inline-flex items-center gap-2 h-[48px] px-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[15px] font-semibold hover:bg-white/25 transition-colors shrink-0">
            {ctaLabel} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        {/* Mobil */}
        <div className="md:hidden">
          <h1 className="text-[18px] font-semibold text-white tracking-[-0.02em] mb-3">
            {title}
          </h1>
          <Link href={ctaHref} className="inline-flex items-center justify-center gap-2 h-[44px] px-6 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[14px] font-semibold hover:bg-white/25 transition-colors mt-4 w-full">
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
