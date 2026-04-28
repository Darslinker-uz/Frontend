"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, X, Loader2, RotateCcw } from "lucide-react";

// 10 ta variant: 3s kechikish + 15s sanagich + har hil chiqish animatsyasi.
// Replay tugmasi animatsyani qaytadan ko'rsatadi.

const SHOW_DELAY_MS = 3000;
const COUNTDOWN_S = 15;

export default function CheckPage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen pb-20">
      <style>{`
        @keyframes a1 { from { transform: translateY(120%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes a2 { 0% { transform: translateY(120%); opacity: 0 } 60% { transform: translateY(-10%); opacity: 1 } 80% { transform: translateY(4%) } 100% { transform: translateY(0) } }
        @keyframes a3 { from { transform: translateY(40px) scale(0.95); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }
        @keyframes a4 { from { transform: scale(0.5); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes a5 { from { transform: translate(60%, 60%); opacity: 0 } to { transform: translate(0, 0); opacity: 1 } }
        @keyframes a6 { from { transform: translate(-60%, 60%); opacity: 0 } to { transform: translate(0, 0); opacity: 1 } }
        @keyframes a7 { from { transform: translateY(-120%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes a8 { 0% { transform: scale(0.8); opacity: 0 } 60% { transform: scale(1.06); opacity: 1 } 100% { transform: scale(1) } }
        @keyframes a9 { from { transform: rotateX(-80deg); opacity: 0; transform-origin: bottom } to { transform: rotateX(0); opacity: 1; transform-origin: bottom } }
        @keyframes a10 { from { transform: translateY(80%) rotate(-6deg); opacity: 0 } to { transform: translateY(0) rotate(0); opacity: 1 } }

        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <h1 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.02em]">
            Animatsya + countdown variantlari
          </h1>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2 max-w-[700px]">
            Har biri 3 soniyadan keyin chiqadi, 15 soniya sanaydi. Animatsya har xil — qaysisi yoqsa raqamini ayting.
            Yuqori burchakdagi <RotateCcw className="inline w-3.5 h-3.5" /> tugma animatsyani qaytadan ko&apos;rsatadi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VariantCard num={1} name="Slide up + Top bar" desc="Pastdan oddiy + yuqorida progress." anim="a1">
            <Banner Component={CountdownTopBar} animKey="a1" />
          </VariantCard>
          <VariantCard num={2} name="Bounce up + Bottom bar" desc="Sakrashli + tugmalar ostida progress." anim="a2">
            <Banner Component={CountdownBottomBar} animKey="a2" />
          </VariantCard>
          <VariantCard num={3} name="Soft fade + Ring around X" desc="Yumshoq fade + X atrofida halka." anim="a3">
            <Banner Component={CountdownRing} animKey="a3" />
          </VariantCard>
          <VariantCard num={4} name="Zoom + Number badge" desc="O'rtadan kattalashadi + raqam." anim="a4">
            <Banner Component={CountdownBadge} animKey="a4" />
          </VariantCard>
          <VariantCard num={5} name="Slide right+up + Pie" desc="Diagonal o'ng-yuqoridan + pie." anim="a5">
            <Banner Component={CountdownPie} animKey="a5" />
          </VariantCard>
          <VariantCard num={6} name="Slide left+up + Color border" desc="Diagonal chap-yuqoridan + rangli border." anim="a6">
            <Banner Component={CountdownBorderShift} animKey="a6" />
          </VariantCard>
          <VariantCard num={7} name="Drop from top + Pulsing orb" desc="Yuqoridan tushadi + pulsatsiya." anim="a7">
            <Banner Component={CountdownOrb} animKey="a7" />
          </VariantCard>
          <VariantCard num={8} name="Spring scale + Text countdown" desc="Springli kattalashish + matn." anim="a8">
            <Banner Component={CountdownText} animKey="a8" />
          </VariantCard>
          <VariantCard num={9} name="3D flip up + Below progress" desc="3D yuqoriga aylanadi + indikator." anim="a9">
            <Banner Component={CountdownBelowButtons} animKey="a9" />
          </VariantCard>
          <VariantCard num={10} name="Tilted slide + Shimmer" desc="Burilgan slide + shimmer." anim="a10">
            <Banner Component={CountdownShimmer} animKey="a10" />
          </VariantCard>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Wrappers ─────────────────────────

function VariantCard({ num, name, desc, children }: { num: number; name: string; desc: string; anim: string; children: React.ReactNode }) {
  const [key, setKey] = useState(0);
  return (
    <div className="rounded-[18px] bg-white border border-[#e4e7ea] overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#e4e7ea] flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-[#16181a] text-white text-[13px] font-bold flex items-center justify-center shrink-0">{num}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold text-[#16181a] truncate">{name}</h3>
          <p className="text-[12px] text-[#7c8490] truncate">{desc}</p>
        </div>
        <button
          onClick={() => setKey(k => k + 1)}
          aria-label="Replay"
          title="Animatsyani qaytadan ko'rsatish"
          className="w-9 h-9 rounded-full bg-[#f0f2f3] hover:bg-[#e4e7ea] text-[#16181a]/70 flex items-center justify-center shrink-0 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      <div key={key} className="relative bg-[#fafbfc] min-h-[280px] flex items-end justify-center overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface CountdownProps {
  visible: boolean;
  remaining: number;
  remainingS: number;
  onYes: () => void;
  onNo: () => void;
  animKey: string;
}

function Banner({ Component, animKey }: { Component: (p: CountdownProps) => React.ReactNode; animKey: string }) {
  const [show, setShow] = useState(false);
  const [remaining, setRemaining] = useState(1);
  const [remainingS, setRemainingS] = useState(COUNTDOWN_S);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setShow(false);
    setRemaining(1);
    setRemainingS(COUNTDOWN_S);

    showTimer.current = setTimeout(() => {
      setShow(true);
      const startTime = Date.now();
      interval.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const left = Math.max(0, COUNTDOWN_S - elapsed);
        setRemaining(left / COUNTDOWN_S);
        setRemainingS(Math.ceil(left));
        if (left <= 0) {
          setShow(false);
          if (interval.current) clearInterval(interval.current);
        }
      }, 100);
    }, SHOW_DELAY_MS);
  };

  useEffect(() => {
    start();
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (interval.current) clearInterval(interval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setShow(false);
    if (interval.current) clearInterval(interval.current);
  };

  return Component({ visible: show, remaining, remainingS, onYes: close, onNo: close, animKey });
}

// ───────────────────────── Shared inner content ─────────────────────────

function shellStyle(animKey: string): React.CSSProperties {
  return {
    animation: `${animKey} 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) both`,
  };
}

const SHELL_BASE = "absolute bottom-3 left-3 right-3 md:bottom-4 md:left-1/2 md:right-auto md:w-[360px] md:-translate-x-1/2 rounded-[16px] bg-white border border-[#e4e7ea] shadow-2xl overflow-hidden";

function MapAndContent() {
  return (
    <>
      <div className="relative h-[100px] bg-[#dde6ef] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 100" preserveAspectRatio="xMidYMid slice">
          <path d="M-20,30 Q90,5 180,40 T420,20" stroke="#a3bdd7" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M-20,65 Q120,80 250,60 T420,70" stroke="#a3bdd7" strokeWidth="2" fill="none" opacity="0.5" />
          <circle cx="80" cy="45" r="2.5" fill="#7ea2d4" opacity="0.5" />
          <circle cx="180" cy="70" r="2.5" fill="#7ea2d4" opacity="0.5" />
          <circle cx="280" cy="30" r="2.5" fill="#7ea2d4" opacity="0.5" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#4a7ab5]/30 animate-ping" />
            <div className="relative w-9 h-9 rounded-full bg-[#4a7ab5] flex items-center justify-center shadow-xl">
              <MapPin className="w-4 h-4 text-white fill-current" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pt-3 pb-1">
        <h3 className="text-[14px] font-bold text-[#16181a]">
          Sizning hududingizdagi kurslarni ko&apos;rsataylikmi?
        </h3>
      </div>
    </>
  );
}

function ButtonRow({ onNo, onYes }: { onNo: () => void; onYes: () => void }) {
  return (
    <div className="px-4 pt-2 pb-3 flex items-center gap-2">
      <button onClick={onNo} className="flex-1 h-[36px] rounded-[10px] bg-[#f0f2f3] hover:bg-[#e4e7ea] text-[#7c8490] text-[12.5px] font-semibold">Yo&apos;q</button>
      <button onClick={onYes} className="flex-1 h-[36px] rounded-[10px] bg-[#4a7ab5] hover:bg-[#3a5a8c] text-white text-[12.5px] font-semibold">Ha</button>
    </div>
  );
}

function CloseX({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-[#16181a]/60">
      <X className="w-3.5 h-3.5" />
    </button>
  );
}

// ───────────────────────── 10 ta variant ─────────────────────────

function CountdownTopBar({ visible, remaining, onYes, onNo, animKey }: CountdownProps) {
  if (!visible) return null;
  return (
    <div className={SHELL_BASE} style={shellStyle(animKey)}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#e4e7ea] z-10">
        <div className="h-full bg-[#4a7ab5] transition-all duration-100 ease-linear" style={{ width: `${remaining * 100}%` }} />
      </div>
      <CloseX onClick={onNo} />
      <MapAndContent />
      <ButtonRow onNo={onNo} onYes={onYes} />
    </div>
  );
}

function CountdownBottomBar({ visible, remaining, onYes, onNo, animKey }: CountdownProps) {
  if (!visible) return null;
  return (
    <div className={SHELL_BASE} style={shellStyle(animKey)}>
      <CloseX onClick={onNo} />
      <MapAndContent />
      <ButtonRow onNo={onNo} onYes={onYes} />
      <div className="h-0.5 bg-[#e4e7ea]">
        <div className="h-full bg-[#4a7ab5] transition-all duration-100 ease-linear" style={{ width: `${remaining * 100}%` }} />
      </div>
    </div>
  );
}

function CountdownRing({ visible, remaining, onYes, onNo, animKey }: CountdownProps) {
  if (!visible) return null;
  const c = 2 * Math.PI * 11;
  return (
    <div className={SHELL_BASE} style={shellStyle(animKey)}>
      <button onClick={onNo} className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center">
        <svg className="absolute inset-0" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="11" stroke="#e4e7ea" strokeWidth="2" fill="white" />
          <circle cx="14" cy="14" r="11" stroke="#4a7ab5" strokeWidth="2" fill="none" strokeDasharray={c} strokeDashoffset={c * (1 - remaining)} transform="rotate(-90 14 14)" style={{ transition: "stroke-dashoffset 100ms linear" }} />
        </svg>
        <X className="w-3.5 h-3.5 text-[#16181a]/60 relative z-10" />
      </button>
      <MapAndContent />
      <ButtonRow onNo={onNo} onYes={onYes} />
    </div>
  );
}

function CountdownBadge({ visible, remainingS, onYes, onNo, animKey }: CountdownProps) {
  if (!visible) return null;
  return (
    <div className={SHELL_BASE} style={shellStyle(animKey)}>
      <CloseX onClick={onNo} />
      <div className="absolute top-2 left-2 z-10 h-6 min-w-[24px] px-2 rounded-full bg-[#16181a] text-white text-[11px] font-bold flex items-center justify-center">{remainingS}s</div>
      <MapAndContent />
      <ButtonRow onNo={onNo} onYes={onYes} />
    </div>
  );
}

function CountdownPie({ visible, remaining, onYes, onNo, animKey }: CountdownProps) {
  if (!visible) return null;
  const angle = remaining * 360;
  const r = 11;
  const x = 14 + r * Math.sin((angle * Math.PI) / 180);
  const y = 14 - r * Math.cos((angle * Math.PI) / 180);
  const largeArc = angle > 180 ? 1 : 0;
  return (
    <div className={SHELL_BASE} style={shellStyle(animKey)}>
      <CloseX onClick={onNo} />
      <div className="absolute top-2 left-2 z-10 w-7 h-7">
        <svg viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="11" fill="#e4e7ea" />
          <path d={`M 14 14 L 14 3 A 11 11 0 ${largeArc} 1 ${x} ${y} Z`} fill="#4a7ab5" />
        </svg>
      </div>
      <MapAndContent />
      <ButtonRow onNo={onNo} onYes={onYes} />
    </div>
  );
}

function CountdownBorderShift({ visible, remaining, onYes, onNo, animKey }: CountdownProps) {
  if (!visible) return null;
  const color = remaining > 0.66 ? "#22c55e" : remaining > 0.33 ? "#f59e0b" : "#ef4444";
  return (
    <div className={SHELL_BASE} style={{ ...shellStyle(animKey), border: `2px solid ${color}`, transition: "border-color 300ms" }}>
      <CloseX onClick={onNo} />
      <MapAndContent />
      <ButtonRow onNo={onNo} onYes={onYes} />
    </div>
  );
}

function CountdownOrb({ visible, remainingS, onYes, onNo, animKey }: CountdownProps) {
  if (!visible) return null;
  return (
    <div className={SHELL_BASE} style={shellStyle(animKey)}>
      <CloseX onClick={onNo} />
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex w-full h-full rounded-full bg-[#4a7ab5] opacity-75 animate-ping" />
          <span className="relative inline-flex w-2 h-2 rounded-full bg-[#4a7ab5]" />
        </span>
        <span className="text-[11px] font-bold text-[#16181a]/70">{remainingS}s</span>
      </div>
      <MapAndContent />
      <ButtonRow onNo={onNo} onYes={onYes} />
    </div>
  );
}

function CountdownText({ visible, remainingS, onYes, onNo, animKey }: CountdownProps) {
  if (!visible) return null;
  return (
    <div className={SHELL_BASE} style={shellStyle(animKey)}>
      <CloseX onClick={onNo} />
      <MapAndContent />
      <p className="px-4 pb-1 text-[10.5px] text-[#7c8490] font-medium">
        Avtomatik yopiladi: <span className="text-[#4a7ab5] font-bold">{remainingS}s</span>
      </p>
      <ButtonRow onNo={onNo} onYes={onYes} />
    </div>
  );
}

function CountdownBelowButtons({ visible, remaining, onYes, onNo, animKey }: CountdownProps) {
  if (!visible) return null;
  return (
    <div className={SHELL_BASE} style={shellStyle(animKey)}>
      <CloseX onClick={onNo} />
      <MapAndContent />
      <ButtonRow onNo={onNo} onYes={onYes} />
      <div className="px-4 pb-2.5">
        <div className="h-1 rounded-full bg-[#e4e7ea] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#4a7ab5] to-[#7ea2d4] transition-all duration-100 ease-linear" style={{ width: `${remaining * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function CountdownShimmer({ visible, remaining, onYes, onNo, animKey }: CountdownProps) {
  if (!visible) return null;
  return (
    <div className={SHELL_BASE} style={shellStyle(animKey)}>
      <div className="absolute top-0 left-0 right-0 h-[3px] z-10 bg-[#e4e7ea] overflow-hidden">
        <div
          className="h-full transition-all duration-100 ease-linear"
          style={{
            width: `${remaining * 100}%`,
            backgroundImage: "linear-gradient(90deg, #4a7ab5 0%, #a3c0db 50%, #4a7ab5 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s linear infinite",
          }}
        />
      </div>
      <CloseX onClick={onNo} />
      <MapAndContent />
      <ButtonRow onNo={onNo} onYes={onYes} />
    </div>
  );
}
