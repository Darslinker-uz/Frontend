"use client";

import { useState } from "react";
import {
  MapPin, X, ArrowRight, Navigation, Compass, Loader2, Check,
  Sparkles, Globe, Target,
} from "lucide-react";

// 10 ta lokatsiya so'rash UI varianti — desktop va mobil uchun real komponentlar.
// Foydalanuvchi qaysi varianti yoqishini ko'rib aytadi.

export default function CheckPage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <h1 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.02em]">
            Lokatsiya so&apos;rash UI variantlari
          </h1>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2 max-w-[680px]">
            10 ta variant — har biri desktop va mobil uchun mos. &quot;Ha&quot; tugmalari namuna uchun, real GPS so&apos;ramaydi.
            Sizga yoqqanini raqami bilan ayting (1-10).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VariantCard num={1} name="Inline top banner" desc="Sahifa yuqorisida nozik chiziq. Hozirgi varyant.">
            <V1 />
          </VariantCard>

          <VariantCard num={2} name="Bottom sheet (mobil-style)" desc="Pastdan chiqadi, telegrafdek katta CTA.">
            <V2 />
          </VariantCard>

          <VariantCard num={3} name="Center modal + illustratsiya" desc="Premium feel, xarita rasmi bilan.">
            <V3 />
          </VariantCard>

          <VariantCard num={4} name="Side toast (o&apos;ng)" desc="Yon tomondan suzib chiqadi, fokus buzmaydi.">
            <V4 />
          </VariantCard>

          <VariantCard num={5} name="Map preview card" desc="Xarita sxemasi bilan vizual karta.">
            <V5 />
          </VariantCard>

          <VariantCard num={6} name="Compact pill (kichik)" desc="Filter panelda kichkina pin tugma.">
            <V6 />
          </VariantCard>

          <VariantCard num={7} name="Hero banner (rangli)" desc="Katta rangli banner, eng ko&apos;rinarli.">
            <V7 />
          </VariantCard>

          <VariantCard num={8} name="Floating action button" desc="Material-style FAB pastda o&apos;ng burchakda.">
            <V8 />
          </VariantCard>

          <VariantCard num={9} name="Notification card" desc="Tizim xabarnomasi shaklida.">
            <V9 />
          </VariantCard>

          <VariantCard num={10} name="Inline filter row" desc="Filter chip qatoriga integrlangan.">
            <V10 />
          </VariantCard>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Wrapper ─────────────────────────

function VariantCard({ num, name, desc, children }: { num: number; name: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] bg-white border border-[#e4e7ea] overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#e4e7ea] flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-[#16181a] text-white text-[13px] font-bold flex items-center justify-center shrink-0">{num}</span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-[#16181a] truncate">{name}</h3>
          <p className="text-[12px] text-[#7c8490] truncate">{desc}</p>
        </div>
      </div>
      <div className="p-4 md:p-5 bg-[#fafbfc] min-h-[200px] flex items-start justify-center">
        {children}
      </div>
    </div>
  );
}

function useMock() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const handle = () => {
    setState("loading");
    setTimeout(() => setState("done"), 1200);
    setTimeout(() => setState("idle"), 2500);
  };
  return { state, handle };
}

// ───────────────────────── Variant 1: Inline top banner ─────────────────────────

function V1() {
  const { state, handle } = useMock();
  return (
    <div className="w-full">
      <div className="rounded-[14px] border border-[#16181a]/10 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-full bg-[#7ea2d4]/15 flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-[#4a7ab5]" />
        </div>
        <div className="flex-1 text-[13px] text-[#16181a]/80 leading-snug">
          Joylashuvingizga eng yaqin kurslarni ko&apos;rsataymimi?
        </div>
        <button
          onClick={handle}
          disabled={state !== "idle"}
          className="h-[36px] px-4 rounded-[10px] bg-[#16181a] text-white text-[12.5px] font-semibold flex items-center gap-1.5 disabled:opacity-50"
        >
          {state === "loading" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : state === "done" ? <Check className="w-3.5 h-3.5" /> : "Ha"}
        </button>
        <button className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[#7c8490] hover:bg-[#f0f2f3]">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ───────────────────────── Variant 2: Bottom sheet ─────────────────────────

function V2() {
  const { state, handle } = useMock();
  return (
    <div className="w-full max-w-[420px]">
      <div className="relative rounded-t-[24px] bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.08)] border border-[#e4e7ea] border-b-0 overflow-hidden">
        <div className="w-12 h-1 bg-[#e4e7ea] rounded-full mx-auto mt-2" />
        <div className="p-5 md:p-6">
          <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-[#7ea2d4] to-[#4a7ab5] flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h4 className="text-[18px] font-bold text-[#16181a] text-center leading-tight">
            Yaqin atrofdagi kurslar
          </h4>
          <p className="text-[13px] text-[#7c8490] text-center mt-1.5 leading-relaxed">
            Joylashuvingizni aniqlasak, sizga eng mos kurslarni topamiz
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button
              onClick={handle}
              disabled={state !== "idle"}
              className="w-full h-[48px] rounded-[12px] bg-[#16181a] text-white text-[14px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> :
               state === "done" ? <Check className="w-4 h-4" /> :
               <><Navigation className="w-4 h-4" /> Joylashuvni ulashish</>}
            </button>
            <button className="w-full h-[44px] rounded-[12px] text-[13px] text-[#7c8490] font-medium hover:bg-[#f0f2f3]">
              Hozir emas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Variant 3: Center modal ─────────────────────────

function V3() {
  const { state, handle } = useMock();
  return (
    <div className="w-full max-w-[400px]">
      <div className="rounded-[20px] bg-white border border-[#e4e7ea] shadow-2xl overflow-hidden">
        {/* Decorative top */}
        <div className="relative h-[100px] bg-gradient-to-br from-[#dee8f5] via-[#c8dbed] to-[#a3c0db] flex items-center justify-center overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path d="M0,50 Q50,20 100,50 T200,50 L200,100 L0,100 Z" fill="white" />
          </svg>
          <div className="relative w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center">
            <MapPin className="w-7 h-7 text-[#4a7ab5]" />
          </div>
          <div className="absolute top-3 right-3">
            <button className="w-8 h-8 rounded-full bg-white/40 hover:bg-white flex items-center justify-center text-[#16181a]/60">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="px-6 pt-5 pb-6 text-center">
          <h4 className="text-[19px] font-bold text-[#16181a] tracking-tight">
            Joylashuvga ruxsat
          </h4>
          <p className="text-[13px] text-[#7c8490] mt-2 leading-relaxed">
            Sizning shaharingizdagi va atrofdagi eng yaxshi kurslarni topamiz
          </p>
          <button
            onClick={handle}
            disabled={state !== "idle"}
            className="mt-5 w-full h-[48px] rounded-[12px] bg-[#16181a] text-white text-[14px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> :
             state === "done" ? <><Check className="w-4 h-4" /> Topildi!</> :
             "Ruxsat berish"}
          </button>
          <button className="mt-2 text-[12px] text-[#7c8490] hover:text-[#16181a]">
            Keyinroq
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Variant 4: Side toast ─────────────────────────

function V4() {
  const { state, handle } = useMock();
  return (
    <div className="w-full max-w-[340px]">
      <div className="rounded-[14px] bg-[#16181a] text-white p-4 shadow-2xl border border-white/10 flex items-start gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-white/10 flex items-center justify-center shrink-0">
          <Compass className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-snug">
            Yaqin kurslarni topamizmi?
          </p>
          <p className="text-[11px] text-white/60 mt-0.5 leading-snug">
            Joylashuvingizni aniqlash kerak
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={handle}
              disabled={state !== "idle"}
              className="h-[30px] px-3 rounded-[8px] bg-white text-[#16181a] text-[12px] font-semibold flex items-center gap-1 disabled:opacity-50"
            >
              {state === "loading" ? <Loader2 className="w-3 h-3 animate-spin" /> :
               state === "done" ? <Check className="w-3 h-3" /> :
               "Ha"}
            </button>
            <button className="h-[30px] px-3 rounded-[8px] text-[12px] text-white/70 hover:bg-white/10 font-medium">
              Yo&apos;q
            </button>
          </div>
        </div>
        <button className="text-white/40 hover:text-white shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ───────────────────────── Variant 5: Map preview card ─────────────────────────

function V5() {
  const { state, handle } = useMock();
  return (
    <div className="w-full max-w-[380px]">
      <div className="rounded-[18px] bg-white border border-[#e4e7ea] overflow-hidden">
        {/* Mini map */}
        <div className="relative h-[120px] bg-[#dde6ef] overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 120">
            <path d="M-20,40 Q90,15 180,50 T420,30" stroke="#a3bdd7" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M-20,75 Q120,90 250,70 T420,80" stroke="#a3bdd7" strokeWidth="2" fill="none" opacity="0.5" />
            <circle cx="80" cy="55" r="3" fill="#7ea2d4" opacity="0.5" />
            <circle cx="180" cy="80" r="3" fill="#7ea2d4" opacity="0.5" />
            <circle cx="280" cy="40" r="3" fill="#7ea2d4" opacity="0.5" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#4a7ab5]/20 animate-ping" />
              <div className="relative w-10 h-10 rounded-full bg-[#4a7ab5] flex items-center justify-center shadow-xl">
                <MapPin className="w-5 h-5 text-white fill-current" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h4 className="text-[15px] font-bold text-[#16181a]">Sizning hududingizdagi kurslar</h4>
          <p className="text-[12px] text-[#7c8490] mt-1 leading-relaxed">
            Joylashuvni aniqlasak, eng yaqin o&apos;quv markazlarni topamiz
          </p>
          <button
            onClick={handle}
            disabled={state !== "idle"}
            className="mt-3 w-full h-[40px] rounded-[10px] bg-[#4a7ab5] hover:bg-[#3a5a8c] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
          >
            {state === "loading" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
             state === "done" ? <><Check className="w-3.5 h-3.5" /> Topildi</> :
             <><MapPin className="w-3.5 h-3.5" /> OK</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Variant 6: Compact pill ─────────────────────────

function V6() {
  const { state, handle } = useMock();
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-[#7c8490] font-medium">Filter:</span>
        <span className="px-3 h-[32px] rounded-full bg-[#f0f2f3] text-[12px] flex items-center gap-1 text-[#16181a]/70">
          Format: Online <X className="w-3 h-3 cursor-pointer" />
        </span>
        <button
          onClick={handle}
          disabled={state !== "idle"}
          className="h-[32px] px-3 rounded-full bg-[#16181a] text-white text-[12px] font-semibold flex items-center gap-1.5 disabled:opacity-50"
        >
          {state === "loading" ? <Loader2 className="w-3 h-3 animate-spin" /> :
           state === "done" ? <><Check className="w-3 h-3" /> Topildi</> :
           <><MapPin className="w-3 h-3" /> Yaqin atrofda</>}
        </button>
        <button className="h-[32px] px-3 rounded-full border border-dashed border-[#16181a]/20 text-[12px] text-[#7c8490] hover:border-[#16181a]/40">
          + Boshqa filter
        </button>
      </div>
    </div>
  );
}

// ───────────────────────── Variant 7: Hero banner (rangli) ─────────────────────────

function V7() {
  const { state, handle } = useMock();
  return (
    <div className="w-full">
      <div className="relative rounded-[18px] overflow-hidden bg-gradient-to-br from-[#4a7ab5] via-[#5b87c0] to-[#7ea2d4] p-5 md:p-6 text-white">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-[14px] bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[16px] md:text-[18px] font-bold leading-tight">
              Sizga yaqin kurslarni topib beramiz
            </h4>
            <p className="text-[12px] md:text-[13px] text-white/85 mt-1 leading-snug">
              Joylashuvga ruxsat bering — bir necha soniyada eng mos kurslar paydo bo&apos;ladi
            </p>
          </div>
          <button
            onClick={handle}
            disabled={state !== "idle"}
            className="hidden md:flex h-[44px] px-5 rounded-[12px] bg-white text-[#16181a] text-[13px] font-bold items-center gap-2 hover:bg-white/95 disabled:opacity-50 shrink-0"
          >
            {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> :
             state === "done" ? <Check className="w-4 h-4" /> :
             <>Boshlash <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
        <button
          onClick={handle}
          disabled={state !== "idle"}
          className="md:hidden mt-4 w-full h-[42px] rounded-[12px] bg-white text-[#16181a] text-[13px] font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> :
           state === "done" ? <Check className="w-4 h-4" /> :
           <>Boshlash <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}

// ───────────────────────── Variant 8: Floating action button ─────────────────────────

function V8() {
  const { state, handle } = useMock();
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="w-full h-[200px] relative bg-[#f0f2f3] rounded-[12px] border border-dashed border-[#e4e7ea] flex items-center justify-center">
      <span className="text-[12px] text-[#7c8490]">Sahifa kontenti shu yerda...</span>
      <div className="absolute bottom-4 right-4">
        {expanded && (
          <div className="absolute bottom-[60px] right-0 w-[260px] rounded-[14px] bg-white border border-[#e4e7ea] shadow-2xl p-4">
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-[#e4e7ea] rotate-45" />
            <h5 className="text-[13px] font-bold text-[#16181a]">Yaqin atrofda</h5>
            <p className="text-[12px] text-[#7c8490] mt-1 leading-snug">Joylashuvga ko&apos;ra mos kurslarni ko&apos;rasiz</p>
            <button
              onClick={handle}
              disabled={state !== "idle"}
              className="mt-3 w-full h-[36px] rounded-[8px] bg-[#16181a] text-white text-[12px] font-semibold disabled:opacity-50"
            >
              {state === "loading" ? "Aniqlanyapti..." : state === "done" ? "Topildi ✓" : "Ruxsat berish"}
            </button>
          </div>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-12 h-12 rounded-full bg-[#16181a] text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
        >
          {expanded ? <X className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

// ───────────────────────── Variant 9: Notification card ─────────────────────────

function V9() {
  const { state, handle } = useMock();
  return (
    <div className="w-full max-w-[380px]">
      <div className="rounded-[14px] bg-white border border-[#e4e7ea] p-4 shadow-md">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#7ea2d4]/15 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#4a7ab5]" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#ef4444] border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <h5 className="text-[13px] font-bold text-[#16181a]">Darslinker.uz</h5>
              <span className="text-[11px] text-[#7c8490] shrink-0">Hozir</span>
            </div>
            <p className="text-[13px] text-[#16181a]/80 mt-0.5 leading-snug">
              Yaqin atrofdagi kurslarni ko&apos;rsatish uchun joylashuvga ruxsat bering
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handle}
                disabled={state !== "idle"}
                className="h-[32px] px-3 rounded-[8px] bg-[#16181a] text-white text-[12px] font-semibold flex items-center gap-1 disabled:opacity-50"
              >
                {state === "loading" ? <Loader2 className="w-3 h-3 animate-spin" /> :
                 state === "done" ? <Check className="w-3 h-3" /> :
                 "Ruxsat berish"}
              </button>
              <button className="h-[32px] px-3 rounded-[8px] text-[12px] text-[#7c8490] hover:bg-[#f0f2f3] font-medium">
                Yo&apos;q
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Variant 10: Inline filter row ─────────────────────────

function V10() {
  const { state, handle } = useMock();
  return (
    <div className="w-full">
      <div className="rounded-[14px] bg-white border border-[#e4e7ea] p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <h5 className="text-[12px] font-bold text-[#16181a]/60 uppercase tracking-wider">Tezkor filter</h5>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="h-[34px] px-3 rounded-[10px] bg-[#f0f2f3] text-[12.5px] text-[#16181a] font-medium hover:bg-[#e4e7ea]">
            <Globe className="w-3.5 h-3.5 inline mr-1.5" /> Online
          </button>
          <button className="h-[34px] px-3 rounded-[10px] bg-[#f0f2f3] text-[12.5px] text-[#16181a] font-medium hover:bg-[#e4e7ea]">
            Bepul
          </button>
          <button className="h-[34px] px-3 rounded-[10px] bg-[#f0f2f3] text-[12.5px] text-[#16181a] font-medium hover:bg-[#e4e7ea]">
            Bootcamp
          </button>
          <span className="h-5 w-px bg-[#e4e7ea] mx-1" />
          <button
            onClick={handle}
            disabled={state !== "idle"}
            className="h-[34px] px-3 rounded-[10px] bg-gradient-to-r from-[#4a7ab5] to-[#7ea2d4] text-white text-[12.5px] font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            {state === "loading" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
             state === "done" ? <><Check className="w-3.5 h-3.5" /> Aniqlandi</> :
             <><MapPin className="w-3.5 h-3.5" /> Yaqin atrofda</>}
          </button>
        </div>
      </div>
    </div>
  );
}
