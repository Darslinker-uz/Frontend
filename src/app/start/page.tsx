import Link from "next/link";
import { ArrowRight, BookOpen, Target, Trophy, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: Target, title: "Yo'nalish", desc: "Sohani tanlang" },
  { icon: BookOpen, title: "Darslar", desc: "Bosqichma-bosqich" },
  { icon: Trophy, title: "Test va ball", desc: "Har bosqich 100 ball" },
  { icon: CheckCircle2, title: "Sertifikat", desc: "Yakunda oling" },
];

export default function StartPage() {
  return (
    <div className="bg-[#f0f2f3] min-h-[calc(100vh-62px)] flex flex-col">
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-20 py-5 md:py-8 flex flex-col justify-center gap-5 md:gap-7">

        {/* HERO */}
        <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden border border-[#e4e7ea] bg-gradient-to-br from-[#0f1923] via-[#1a3350] to-[#2d5a8a]">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[50px] overflow-hidden">
            <svg className="absolute bottom-0 w-[200%] h-[50px] animate-[waveMove_6s_linear_infinite]" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1440,0 1440,30 L1440,60 L0,60 Z" fill="rgba(126,162,212,0.06)" />
            </svg>
            <svg className="absolute bottom-0 w-[200%] h-[50px] animate-[waveMove_8s_linear_infinite]" viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,35 C200,10 400,55 600,35 C800,10 1000,55 1200,35 C1400,10 1440,35 1440,35 L1440,60 L0,60 Z" fill="rgba(126,162,212,0.04)" />
            </svg>
          </div>

          <div className="relative px-5 py-8 md:px-12 md:py-12 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-[11px] md:text-[12px] font-semibold">
              <Sparkles className="w-3 h-3 text-[#7ea2d4]" />
              DarsLinker <span className="text-white">Start</span>
            </div>
            <h1 className="text-[26px] md:text-[42px] font-bold text-white leading-[1.15] tracking-[-0.02em] mt-4">
              Bepul boshlang&apos;ich<br className="hidden md:block" /> kurslar
            </h1>
            <p className="text-[13px] md:text-[15px] text-white/60 mt-3 max-w-[440px] mx-auto leading-relaxed">
              Fundamental bilimlar — dars, test, ball
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3 mt-6">
              <Link href="/start/kurslar" className="inline-flex items-center justify-center gap-2 h-[44px] md:h-[48px] px-6 md:px-7 rounded-full bg-white text-[#16181a] text-[14px] font-semibold hover:bg-white/90 transition-colors w-full sm:w-auto">
                Boshlash <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/center" className="inline-flex items-center justify-center gap-2 h-[44px] md:h-[48px] px-6 md:px-7 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[14px] font-semibold hover:bg-white/25 transition-colors w-full sm:w-auto">
                Kirish
              </Link>
            </div>
          </div>
        </div>

        {/* QANDAY ISHLAYDI */}
        <div>
          <p className="text-center text-[11px] md:text-[12px] font-bold text-[#7c8490] uppercase tracking-[0.15em] mb-3 md:mb-4">Qanday ishlaydi</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white rounded-[14px] border border-[#e4e7ea] p-4 md:p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#4a7ab5]" />
                    </div>
                    <span className="text-[11px] font-bold text-[#7c8490]">0{i + 1}</span>
                  </div>
                  <p className="text-[14px] md:text-[15px] font-bold text-[#16181a] leading-tight">{s.title}</p>
                  <p className="text-[12px] md:text-[13px] text-[#7c8490] mt-1 leading-snug">{s.desc}</p>
                </div>
              );
            })}
          </div>
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
