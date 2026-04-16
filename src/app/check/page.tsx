"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CheckPage() {
  const [active, setActive] = useState(0);

  const variants = [
    "1 — Shimmer",
    "2 — Pulse glow",
    "3 — Moving gradient",
    "4 — Particles",
    "5 — Wave",
  ];

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e4e7ea] py-3">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {variants.map((v, i) => (
            <button key={i} onClick={() => setActive(i)} className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-medium transition-all ${active === i ? "bg-[#16181a] text-white" : "bg-white border border-[#e4e7ea] text-[#7c8490] hover:text-[#16181a]"}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-8">

        {/* 1 — Shimmer light sweep */}
        {active === 0 && (
          <div className="relative rounded-[16px] md:rounded-[20px] border border-[#e4e7ea] overflow-hidden bg-gradient-to-br from-[#0f1923] via-[#1a3350] to-[#2d5a8a]">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_4s_ease-in-out_infinite] -translate-x-full" />
            </div>
            <div className="relative px-5 py-5 md:px-10 md:py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-0 mb-3 md:mb-4">
                <h1 className="text-[18px] md:text-[26px] font-semibold text-white tracking-[-0.02em]">O&apos;zingizga mos kursni toping</h1>
                <Link href="/kurslar" className="hidden md:inline-flex items-center gap-2 h-[48px] px-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[15px] font-semibold hover:bg-white/25 transition-colors shrink-0">
                  Barcha kurslarni ko&apos;rish <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-[13px] md:text-[15px] text-white/70 max-w-[420px]">Kurslarni solishtiring, tanlang va o&apos;rganishni boshlang</p>
              <Link href="/kurslar" className="md:hidden inline-flex items-center gap-2 h-[44px] px-6 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[14px] font-semibold hover:bg-white/25 transition-colors mt-4">
                Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 2 — Pulse glow */}
        {active === 1 && (
          <div className="relative rounded-[16px] md:rounded-[20px] border border-[#e4e7ea] overflow-hidden bg-gradient-to-br from-[#0f1923] via-[#1a3350] to-[#2d5a8a]">
            <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-[#7ea2d4]/20 blur-[100px] animate-[pulseGlow_5s_ease-in-out_infinite]" />
            <div className="absolute -bottom-20 -right-20 w-[250px] h-[250px] rounded-full bg-[#4a7ab5]/15 blur-[80px] animate-[pulseGlow_5s_ease-in-out_infinite_1.5s]" />
            <div className="relative px-5 py-5 md:px-10 md:py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-0 mb-3 md:mb-4">
                <h1 className="text-[18px] md:text-[26px] font-semibold text-white tracking-[-0.02em]">O&apos;zingizga mos kursni toping</h1>
                <Link href="/kurslar" className="hidden md:inline-flex items-center gap-2 h-[48px] px-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[15px] font-semibold hover:bg-white/25 transition-colors shrink-0">
                  Barcha kurslarni ko&apos;rish <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-[13px] md:text-[15px] text-white/70 max-w-[420px]">Kurslarni solishtiring, tanlang va o&apos;rganishni boshlang</p>
              <Link href="/kurslar" className="md:hidden inline-flex items-center gap-2 h-[44px] px-6 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[14px] font-semibold hover:bg-white/25 transition-colors mt-4">
                Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 3 — Moving gradient */}
        {active === 2 && (
          <div className="relative rounded-[16px] md:rounded-[20px] border border-[#e4e7ea] overflow-hidden">
            <div className="absolute inset-0 bg-[length:300%_300%] bg-gradient-to-br from-[#0f1923] via-[#2d5a8a] to-[#0f1923] animate-[moveGrad_8s_ease_infinite]" />
            <div className="relative px-5 py-5 md:px-10 md:py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-0 mb-3 md:mb-4">
                <h1 className="text-[18px] md:text-[26px] font-semibold text-white tracking-[-0.02em]">O&apos;zingizga mos kursni toping</h1>
                <Link href="/kurslar" className="hidden md:inline-flex items-center gap-2 h-[48px] px-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[15px] font-semibold hover:bg-white/25 transition-colors shrink-0">
                  Barcha kurslarni ko&apos;rish <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-[13px] md:text-[15px] text-white/70 max-w-[420px]">Kurslarni solishtiring, tanlang va o&apos;rganishni boshlang</p>
              <Link href="/kurslar" className="md:hidden inline-flex items-center gap-2 h-[44px] px-6 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[14px] font-semibold hover:bg-white/25 transition-colors mt-4">
                Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 4 — Floating particles (dots) */}
        {active === 3 && (
          <div className="relative rounded-[16px] md:rounded-[20px] border border-[#e4e7ea] overflow-hidden bg-gradient-to-br from-[#0f1923] via-[#1a3350] to-[#2d5a8a]">
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white/20 animate-[floatUp_6s_ease-in-out_infinite]"
                  style={{
                    left: `${8 + i * 8}%`,
                    bottom: `-5%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${4 + (i % 3) * 2}s`,
                  }}
                />
              ))}
            </div>
            <div className="relative px-5 py-5 md:px-10 md:py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-0 mb-3 md:mb-4">
                <h1 className="text-[18px] md:text-[26px] font-semibold text-white tracking-[-0.02em]">O&apos;zingizga mos kursni toping</h1>
                <Link href="/kurslar" className="hidden md:inline-flex items-center gap-2 h-[48px] px-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[15px] font-semibold hover:bg-white/25 transition-colors shrink-0">
                  Barcha kurslarni ko&apos;rish <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-[13px] md:text-[15px] text-white/70 max-w-[420px]">Kurslarni solishtiring, tanlang va o&apos;rganishni boshlang</p>
              <Link href="/kurslar" className="md:hidden inline-flex items-center gap-2 h-[44px] px-6 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[14px] font-semibold hover:bg-white/25 transition-colors mt-4">
                Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 5 — Wave line */}
        {active === 4 && (
          <div className="relative rounded-[16px] md:rounded-[20px] border border-[#e4e7ea] overflow-hidden bg-gradient-to-br from-[#0f1923] via-[#1a3350] to-[#2d5a8a]">
            <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden">
              <svg className="absolute bottom-0 w-[200%] h-[60px] animate-[waveMove_6s_linear_infinite]" viewBox="0 0 1440 60" preserveAspectRatio="none">
                <path d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1440,0 1440,30 L1440,60 L0,60 Z" fill="rgba(126,162,212,0.06)" />
              </svg>
              <svg className="absolute bottom-0 w-[200%] h-[60px] animate-[waveMove_8s_linear_infinite]" viewBox="0 0 1440 60" preserveAspectRatio="none">
                <path d="M0,35 C200,10 400,55 600,35 C800,10 1000,55 1200,35 C1400,10 1440,35 1440,35 L1440,60 L0,60 Z" fill="rgba(126,162,212,0.04)" />
              </svg>
            </div>
            <div className="relative px-5 py-5 md:px-10 md:py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-0 mb-3 md:mb-4">
                <h1 className="text-[18px] md:text-[26px] font-semibold text-white tracking-[-0.02em]">O&apos;zingizga mos kursni toping</h1>
                <Link href="/kurslar" className="hidden md:inline-flex items-center gap-2 h-[48px] px-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[15px] font-semibold hover:bg-white/25 transition-colors shrink-0">
                  Barcha kurslarni ko&apos;rish <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-[13px] md:text-[15px] text-white/70 max-w-[420px]">Kurslarni solishtiring, tanlang va o&apos;rganishni boshlang</p>
              <Link href="/kurslar" className="md:hidden inline-flex items-center gap-2 h-[44px] px-6 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[14px] font-semibold hover:bg-white/25 transition-colors mt-4">
                Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes moveGrad {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-120px) scale(0.5); opacity: 0; }
        }
        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
