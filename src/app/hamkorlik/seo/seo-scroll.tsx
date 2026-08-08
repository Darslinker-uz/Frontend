"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Search } from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

const CONTACT_URL = "https://t.me/Darslinker_Support";

const ACCENT = "#7ea2d4";
const WIN = "#5fd39a";

const SECTIONS = [
  { id: "muammo", label: "Muammo" },
  { id: "seo", label: "SEO" },
  { id: "geo", label: "GEO" },
  { id: "website", label: "Website" },
  { id: "yol", label: "6 oy" },
  { id: "tariflar", label: "Tariflar" },
  { id: "boshlash", label: "Boshlash" },
];

/* ────────────────────────────  hooks  ──────────────────────────── */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** Qidiruv satri uchun: yozadi → kutadi → o'chiradi → keyingisi. */
function useTypingLoop(items: readonly string[], active: boolean, reduced: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) return;
    if (reduced) {
      const id = setTimeout(() => setText(items[0]), 0);
      return () => clearTimeout(id);
    }
    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;
    let i = 0;
    let c = 0;
    let erasing = false;
    const step = () => {
      if (cancelled) return;
      const full = items[i];
      if (!erasing) {
        c += 1;
        setText(full.slice(0, c));
        if (c >= full.length) {
          erasing = true;
          t = setTimeout(step, 1500);
          return;
        }
        t = setTimeout(step, 60);
      } else {
        c -= 1;
        setText(full.slice(0, c));
        if (c <= 0) {
          erasing = false;
          i = (i + 1) % items.length;
          t = setTimeout(step, 320);
          return;
        }
        t = setTimeout(step, 25);
      }
    };
    t = setTimeout(step, 500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [items, active, reduced]);
  return text;
}

/** So'zma-so'z ochilish — AI javobi effekti uchun. */
function useReveal(count: number, active: boolean, reduced: boolean, speed = 75, delay = 600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) {
      const id = setTimeout(() => setN(0), 0);
      return () => clearTimeout(id);
    }
    if (reduced) {
      const id = setTimeout(() => setN(count), 0);
      return () => clearTimeout(id);
    }
    let cancelled = false;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      if (cancelled) return;
      i += 1;
      setN(i);
      if (i < count) t = setTimeout(step, speed);
    };
    t = setTimeout(step, delay);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [count, active, reduced, speed, delay]);
  return n;
}

function useTween(from: number, to: number, active: boolean, reduced: boolean, duration = 2400, delay = 600) {
  const [v, setV] = useState(from);
  useEffect(() => {
    if (!active) {
      const id = setTimeout(() => setV(from), 0);
      return () => clearTimeout(id);
    }
    if (reduced) {
      const id = setTimeout(() => setV(to), 0);
      return () => clearTimeout(id);
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, active, reduced, duration, delay]);
  return v;
}

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Bo'lim kontentini mavjud balandlikka sig'diradi.
 *
 * Sig'masa kontent kengroq virtual enlikda joylashtiriladi va bir butun holda
 * `scale()` bilan kichraytiriladi — ya'ni "zoom out". Shu sababli hech qachon
 * kesilmaydi va nisbatlar buzilmaydi. Hammasi imperativ: React state yo'q,
 * demak birinchi kadrda ham sakrash ko'rinmaydi.
 */
function FitBox({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const outer = outerRef.current;
    const sizer = sizerRef.current;
    const inner = innerRef.current;
    if (!outer || !sizer || !inner) return;

    // k — masshtab. Kontent `100/k`% enlikda joylashadi, so'ng k ga kichrayadi:
    // ko'rinadigan enlik yana 100% bo'ladi, balandlik esa k marta kamayadi.
    const layoutAt = (k: number) => {
      inner.style.width = k < 1 ? `${100 / k}%` : "100%";
      return inner.scrollHeight * k;
    };

    const run = () => {
      const avail = outer.clientHeight;
      if (!avail) return;

      let k = 1;
      let visible = layoutAt(1);
      // Qo'zg'almas nuqta iteratsiyasi — 5-6 qadamda yaqinlashadi.
      for (let step = 0; step < 8 && visible > avail; step += 1) {
        const nextK = k * (avail / visible);
        const converged = Math.abs(nextK - k) < 0.004;
        k = nextK;
        visible = layoutAt(k);
        if (converged) break;
      }

      if (visible > avail) {
        // Yaqinlashmadi — demak kontentda balandligi enlikka bog'liq element bor
        // (aspect-ratio). Kenglikni o'zgartirmay, markazdan bir tekis kichraytiramiz:
        // bu har doim aniq va bir qadamda sig'adi.
        inner.style.width = "100%";
        const natural = inner.scrollHeight;
        k = natural > avail ? avail / natural : 1;
        visible = natural * k;
        inner.style.transformOrigin = "top center";
      } else {
        inner.style.transformOrigin = "top left";
      }

      inner.style.transform = k < 1 ? `scale(${k})` : "";
      sizer.style.height = `${Math.min(visible, avail)}px`;
    };

    run();

    const ro = new ResizeObserver(run);
    ro.observe(outer);
    window.addEventListener("resize", run);
    // Shrift kech yuklansa balandlik o'zgaradi — qayta o'lchaymiz.
    document.fonts?.ready.then(run).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", run);
    };
  }, []);

  return (
    <div ref={outerRef} className="h-full flex flex-col justify-center">
      <div ref={sizerRef} className="w-full max-w-[1180px] mx-auto">
        <div ref={innerRef} className="flow-root" style={{ transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────  atoms  ──────────────────────────── */

function Caret() {
  return <span className="seo-caret ml-[2px] inline-block w-[2px] h-[0.95em] translate-y-[0.12em] bg-[#7ea2d4]" />;
}

function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[11px] md:text-[12px] font-mono uppercase tracking-[0.22em]">
      <span className="text-white/25">{n}</span>
      <span className="h-px w-6 bg-white/15" />
      <span className="text-[#7ea2d4]">{children}</span>
    </div>
  );
}

function Bar({ w, tone = "dim" }: { w: string; tone?: "dim" | "title" | "url" }) {
  const bg = tone === "title" ? "bg-white/22" : tone === "url" ? "bg-[#5fd39a]/25" : "bg-white/10";
  return <span className={`block h-[7px] md:h-[8px] rounded-full ${bg}`} style={{ width: w }} />;
}

/** SERP qatori — skeleton ko'rinishda, hech kimning nomi ishlatilmaydi. */
function SerpRow({
  rank,
  you = false,
  dim = false,
  titleW = "62%",
  urlW = "34%",
}: {
  rank: number | string;
  you?: boolean;
  dim?: boolean;
  titleW?: string;
  urlW?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 md:gap-4 h-full rounded-xl px-3 md:px-4 border transition-colors duration-500 ${
        you
          ? "border-[#7ea2d4]/60 bg-[#7ea2d4]/[0.10]"
          : dim
            ? "border-white/[0.06] bg-white/[0.015]"
            : "border-white/[0.07] bg-white/[0.025]"
      }`}
    >
      <span
        className={`w-6 md:w-7 shrink-0 text-right font-mono text-[11px] md:text-[13px] tabular-nums ${
          you ? "text-[#7ea2d4]" : "text-white/25"
        }`}
      >
        {rank}
      </span>
      <span
        className={`w-6 h-6 md:w-7 md:h-7 shrink-0 rounded-md ${
          you ? "bg-[#7ea2d4]/30 ring-1 ring-[#7ea2d4]/50" : "bg-white/[0.06]"
        }`}
      />
      {you ? (
        <span className="text-[12px] md:text-[14px] font-semibold text-white">Sizning biznesingiz</span>
      ) : (
        <span className="flex-1 space-y-[6px] md:space-y-2 py-1">
          <Bar w={titleW} tone="title" />
          <Bar w={urlW} tone="url" />
        </span>
      )}
    </div>
  );
}

/* ────────────────────────────  01 · muammo  ──────────────────────────── */

const QUERIES = [
  "toshkentda ingliz tili kursi",
  "eng yaxshi it kurslari narxi",
  "yaqin atrofdagi o'quv markaz",
  "bolalar uchun shaxmat to'garagi",
] as const;

function SectionHook({ inView, onNext }: { inView: boolean; onNext?: () => void }) {
  const reduced = useReducedMotion();
  const typed = useTypingLoop(QUERIES, inView, reduced);

  return (
    <>
      <Eyebrow n="01">Muammo</Eyebrow>

      <h2 className="mt-6 md:mt-8 text-[34px] min-[400px]:text-[40px] sm:text-[58px] md:text-[76px] font-bold leading-[1.02] tracking-[-0.04em]">
        Mijoz qayerda izlasa,
        <br />
        <span className="text-white/70">o&apos;sha yerda ko&apos;rining.</span>
      </h2>

      <div className="mt-8 md:mt-11 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-8 lg:gap-14 items-start">
        <div>
          <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.035] px-4 md:px-5 h-[52px] md:h-[60px]">
            <Search className="w-4 h-4 md:w-[18px] md:h-[18px] text-white/35 shrink-0" />
            <span className="font-mono text-[12.5px] min-[400px]:text-[14px] md:text-[16px] text-white/85 truncate">
              {typed}
              <Caret />
            </span>
          </div>
          <p className="mt-6 md:mt-8 text-[14px] md:text-[22px] lg:text-[24px] text-white/50 leading-[1.5] max-w-[460px] md:max-w-[650px]">
            Odamlar har kuni siz taklif qilayotgan xizmatlarni izlaydi — Google&apos;dan qidiradi,
            ChatGPT va boshqa AI&apos;lardan so&apos;raydi. Savol shundaki: siz u yerda ko&apos;rinyapsizmi?
          </p>
        </div>

        <div className="space-y-2 md:space-y-2.5">
          {[1, 2, 3].map((r) => (
            <div key={r} className="h-[44px] sm:h-[52px] md:h-[58px]">
              <SerpRow rank={r} titleW={`${68 - r * 6}%`} urlW={`${38 - r * 3}%`} />
            </div>
          ))}

          <div className="flex items-center gap-3 py-2 md:py-3">
            <span className="h-px flex-1 bg-white/[0.07]" />
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.18em] text-white/25">
              YANA 43 TA NATIJA
            </span>
            <span className="h-px flex-1 bg-white/[0.07]" />
          </div>

          <div className="h-[44px] sm:h-[52px] md:h-[58px] rounded-xl border border-dashed border-white/15 bg-transparent flex items-center gap-3 md:gap-4 px-3 md:px-4">
            <span className="w-6 md:w-7 shrink-0 text-right font-mono text-[11px] md:text-[13px] tabular-nums text-white/30">
              47
            </span>
            <span className="w-6 h-6 md:w-7 md:h-7 shrink-0 rounded-md bg-white/[0.04]" />
            <span className="text-[12px] md:text-[14px] text-white/35">Sizning biznesingiz</span>
          </div>
        </div>
      </div>

      <div className="mt-10 md:mt-14 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          aria-label="Keyingi bo‘limga o‘tish"
          className="group inline-flex cursor-pointer items-center gap-3 rounded-full text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ea2d4]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#07080b]"
        >
          <span className="font-mono text-[11px] md:text-[12px] font-medium tracking-[0.16em] uppercase">
            Pastga suring
          </span>
          <span className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] shadow-[0_0_20px_rgba(126,162,212,0.14)] transition-colors group-hover:border-white/30 group-hover:bg-white/[0.12]">
            <ArrowDown className="size-4 text-[#9bb9e2] seo-nudge" strokeWidth={2.25} />
          </span>
        </button>
      </div>
    </>
  );
}

/* ────────────────────────────  02 · seo  ──────────────────────────── */

const SEO_RANK_STAGES = [
  {
    rank: 47,
    label: "TOP-10 dan past",
    ctr: "<1%",
    bar: 2,
    result: "Mijozlarning aksariyati bu natijagacha yetib bormaydi.",
  },
  {
    rank: 10,
    label: "TOP-10",
    ctr: "2–5%",
    bar: 13,
    result: "Birinchi sahifada ko'rinasiz va ilk barqaror tashriflar boshlanadi.",
  },
  {
    rank: 3,
    label: "TOP-3",
    ctr: "10–19%",
    bar: 48,
    result: "Eng ko'p e'tibor beriladigan natijalar qatoriga kirasiz.",
  },
  {
    rank: 1,
    label: "TOP-1",
    ctr: "28–40%",
    bar: 100,
    result: "Eng katta ko'rinish va organik klik ulushiga ega bo'lasiz.",
  },
] as const;

function useRankJourney(active: boolean, reduced: boolean) {
  const [journey, setJourney] = useState({ rank: 47, stageIndex: 0 });
  const [run, setRun] = useState({ startStage: 0, version: 0 });

  const selectStage = useCallback((stageIndex: number) => {
    const stage = SEO_RANK_STAGES[stageIndex];
    setJourney({ rank: stage.rank, stageIndex });
    setRun((current) => ({ startStage: stageIndex, version: current.version + 1 }));
  }, []);

  useEffect(() => {
    if (!active) {
      const reset = setTimeout(() => setJourney({ rank: 47, stageIndex: 0 }), 0);
      return () => clearTimeout(reset);
    }
    if (reduced) {
      const selected = SEO_RANK_STAGES[run.startStage];
      const showSelected = setTimeout(
        () => setJourney({ rank: selected.rank, stageIndex: run.startStage }),
        0,
      );
      return () => clearTimeout(showSelected);
    }

    let frame = 0;
    const startedAt = performance.now();
    const holdDuration = 3000;
    const travelDurations = [0, 3400, 2400, 2000];
    const ease = (value: number) => value * value * (3 - 2 * value);
    const segment = (elapsed: number, start: number, duration: number, from: number, to: number) => {
      const progress = Math.min(Math.max((elapsed - start) / duration, 0), 1);
      return Math.round(from + (to - from) * ease(progress));
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const start = SEO_RANK_STAGES[run.startStage];
      let next: { rank: number; stageIndex: number } = {
        rank: start.rank,
        stageIndex: run.startStage,
      };
      let cursor = holdDuration;
      let keepRunning = elapsed < holdDuration && run.startStage < SEO_RANK_STAGES.length - 1;

      for (let targetIndex = run.startStage + 1; targetIndex < SEO_RANK_STAGES.length; targetIndex += 1) {
        const previous = SEO_RANK_STAGES[targetIndex - 1];
        const target = SEO_RANK_STAGES[targetIndex];
        const travelDuration = travelDurations[targetIndex];

        if (elapsed < cursor) break;
        if (elapsed < cursor + travelDuration) {
          next = {
            rank: segment(elapsed, cursor, travelDuration, previous.rank, target.rank),
            stageIndex: targetIndex,
          };
          keepRunning = true;
          break;
        }

        cursor += travelDuration;
        next = { rank: target.rank, stageIndex: targetIndex };

        if (targetIndex === SEO_RANK_STAGES.length - 1) break;
        if (elapsed < cursor + holdDuration) {
          keepRunning = true;
          break;
        }
        cursor += holdDuration;
      }

      setJourney((current) =>
        current.rank === next.rank && current.stageIndex === next.stageIndex ? current : next,
      );
      if (keepRunning) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduced, run]);

  return { ...journey, selectStage };
}

function useTypedStageText(text: string, active: boolean, reduced: boolean) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!active) {
      const reset = setTimeout(() => setTyped(""), 0);
      return () => clearTimeout(reset);
    }
    if (reduced) {
      const finish = setTimeout(() => setTyped(text), 0);
      return () => clearTimeout(finish);
    }

    let index = 0;
    setTyped("");
    const timer = setInterval(() => {
      index += 1;
      setTyped(text.slice(0, index));
      if (index >= text.length) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, [text, active, reduced]);

  return typed;
}

function SectionSeo({ inView }: { inView: boolean }) {
  const reduced = useReducedMotion();
  const { rank: pos, stageIndex, selectStage } = useRankJourney(inView, reduced);
  const stage = SEO_RANK_STAGES[stageIndex];
  const typedResult = useTypedStageText(stage.result, inView, reduced);

  return (
    <>
      <Eyebrow n="02">SEO — Google qidiruvi</Eyebrow>

      <div className="mt-5 md:mt-8 grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-6 sm:gap-9 lg:gap-16 items-center">
        <div>
          <h2 className="text-[30px] min-[400px]:text-[34px] sm:text-[52px] md:text-[66px] font-bold leading-[1.03] tracking-[-0.04em]">
            Google&apos;da
            <br />
            yuqoriroq ko&apos;rining.
          </h2>

          <div className="mt-5 sm:mt-7 md:mt-10 flex items-end gap-3 sm:gap-4">
            <div
              className="font-mono font-bold tabular-nums leading-none tracking-[-0.05em] text-[58px] sm:text-[84px] md:text-[110px] transition-colors duration-700"
              style={{ color: pos <= 3 ? WIN : ACCENT }}
            >
              #{pos}
            </div>
            <div className="pb-2 md:pb-4 font-mono text-[11px] md:text-[13px] uppercase tracking-[0.16em] text-white/30">
              o&apos;rin
            </div>
          </div>

          <div
            key={stage.label}
            className="mt-4 sm:mt-5 md:mt-7 max-w-[470px] rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 seo-stage-in"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] md:text-[11px] font-bold tracking-[0.18em] text-[#7ea2d4]">
                  {stage.label}
                </div>
                <div className="mt-1 text-[13px] md:text-[15px] text-white/45">
                  Taxminiy organik kirish ehtimoli
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[30px] md:text-[40px] font-bold leading-none tabular-nums text-white">
                  {stage.ctr}
                </span>
              </div>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7ea2d4] to-[#5fd39a] transition-[width] duration-700 ease-out"
                style={{ width: `${stage.bar}%` }}
              />
            </div>

            <div className="mt-3 flex items-start justify-between gap-3 sm:gap-4">
              <p className="min-h-[3.9em] sm:min-h-[2.9em] text-[12px] md:text-[14px] leading-[1.45] text-white/55">
                {typedResult}
                {typedResult.length < stage.result.length && <Caret />}
              </p>
              <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[10px] md:text-[11px] text-white/55">
                ORGANIK CTR
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-white/35">
              Pozitsiyani tanlang
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] md:text-[10px] text-white/25">
              Avtomatik · 3 soniya
            </span>
          </div>

          <div className="relative mt-5 md:mt-7 px-1 md:px-2">
            <div className="absolute left-6 right-6 md:left-8 md:right-8 top-[18px] md:top-[24px]">
              <div className="h-px bg-white/10" />
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#7ea2d4] to-[#5fd39a] transition-[width] duration-700 ease-out"
                style={{ width: `${(stageIndex / (SEO_RANK_STAGES.length - 1)) * 100}%` }}
              />
            </div>

            <div className="relative flex justify-between">
              {SEO_RANK_STAGES.map((item, index) => {
                const reached = index <= stageIndex;
                const current = index === stageIndex;
                return (
                  <button
                    key={item.rank}
                    type="button"
                    onClick={() => selectStage(index)}
                    aria-label={`${item.label} natijasini ko'rish`}
                    aria-pressed={current}
                    className="group relative z-10 flex w-12 md:w-16 cursor-pointer flex-col items-center gap-2 focus-visible:outline-none"
                  >
                    <span
                      className={`flex size-9 md:size-12 items-center justify-center rounded-full border-2 bg-[#0d0f14] font-mono text-[11px] md:text-[14px] font-bold transition-all duration-500 group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-[#7ea2d4] group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-[#0b0d11] ${
                        current
                          ? "scale-110 border-[#7ea2d4] !bg-[#7ea2d4] text-[#07080b] shadow-[0_0_24px_rgba(126,162,212,0.38)]"
                          : reached
                            ? "border-[#7ea2d4]/70 text-[#9bb9e2]"
                            : "border-white/12 text-white/30"
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span
                      className={`whitespace-nowrap font-mono text-[8px] md:text-[10px] tracking-[0.08em] transition-colors ${
                        reached ? "text-white/60" : "text-white/25"
                      }`}
                    >
                      {index === 0 ? "START" : item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 md:mt-8 h-[52px] md:h-[62px]">
            <SerpRow rank={pos} you />
          </div>

          <p className="mt-3 text-center font-mono text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-white/25">
            Etapni bosing yoki avtomatik natijani kuzating
          </p>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────  03 · geo  ──────────────────────────── */

type Token = { t: string; hl?: boolean };

const GEO_ANSWER: Token[] = [
  { t: "Sizning" }, { t: "hududingizda" }, { t: "yaxshi" }, { t: "variantlardan" }, { t: "biri" },
  { t: "—" }, { t: "Sizning", hl: true }, { t: "biznesingiz", hl: true }, { t: "." },
  { t: "Ular" }, { t: "haqida" }, { t: "batafsil" }, { t: "ma'lumot" }, { t: "va" },
  { t: "sharhlar" }, { t: "ochiq" }, { t: "manbalarda" }, { t: "mavjud." },
];

const GEO_ENGINES = ["ChatGPT", "Gemini"] as const;
const GEO_SOURCES = ["biznesingiz.uz", "darslinker.uz", "google maps"];

function AiEngineLogo({ engine }: { engine: (typeof GEO_ENGINES)[number] }) {
  if (engine === "Gemini") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 md:size-8 shrink-0 fill-[#8e75b2]">
        <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 md:size-8 shrink-0 fill-white/90">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654 2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function SectionGeo({ inView }: { inView: boolean }) {
  const reduced = useReducedMotion();
  const shown = useReveal(GEO_ANSWER.length, inView, reduced, 66, 1100);
  const sources = useReveal(GEO_SOURCES.length, inView, reduced, 220, 2600);

  return (
    <>
      <Eyebrow n="03">GEO — AI tavsiyalari</Eyebrow>

      <h2 className="mt-6 md:mt-8 whitespace-nowrap text-[clamp(24px,8vw,66px)] font-bold leading-[1.03] tracking-[-0.055em]">
        AI sizni tavsiya qilsin.
      </h2>

      <div className="mt-8 md:mt-11 grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.8fr)] gap-8 lg:gap-14 items-start">
        <div>
          <div className="flex flex-wrap gap-3 md:gap-4 mb-5 md:mb-7">
            {GEO_ENGINES.map((e, i) => (
              <span
                key={e}
                className={`inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 md:px-5 py-2.5 md:py-3 font-mono text-[20px] md:text-[24px] text-white/65 transition-all duration-500 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: `${i * 110}ms` }}
              >
                <AiEngineLogo engine={e} />
                {e}
              </span>
            ))}
          </div>

          <div
            className={`rounded-2xl border p-4 md:p-6 transition-all duration-500 delay-300 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ borderColor: "rgba(95,211,154,0.24)", background: "rgba(95,211,154,0.05)" }}
          >
            <p className="text-[14px] md:text-[17px] leading-[1.75] text-white/80">
              {GEO_ANSWER.map((w, i) => (
                <span
                  key={i}
                  className={`transition-opacity duration-300 ${i < shown ? "opacity-100" : "opacity-0"} ${
                    w.hl ? "text-white font-semibold bg-[#5fd39a]/20 rounded px-1 -mx-[2px]" : ""
                  }`}
                >
                  {w.t}{" "}
                </span>
              ))}
              {shown < GEO_ANSWER.length && <Caret />}
            </p>

            <div className="mt-5 md:mt-6 pt-4 border-t border-white/[0.07] flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-white/30 mr-1">
                Manbalar
              </span>
              {GEO_SOURCES.map((s, i) => (
                <span
                  key={s}
                  className={`rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10.5px] md:text-[11.5px] text-white/55 transition-all duration-400 ${
                    i < sources ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[14px] md:text-[17px] lg:text-[28px] xl:text-[30px] text-white/50 leading-[1.6] lg:leading-[1.45] lg:pt-4">
          ChatGPT, Gemini va boshqa modellar javob berayotganda ochiq manbalarga tayanadi.
          Biz sizning ma&apos;lumotlaringizni shu manbalarda to&apos;g&apos;ri, to&apos;liq va
          bir xil qilib joylashtiramiz — <span className="text-white/80">AI tavsiyalarida
          ko&apos;rinish imkoniyatingiz</span> shunda oshadi.
        </p>
      </div>
    </>
  );
}

/* ────────────────────────────  04 · website  ──────────────────────────── */

const SITE_BADGES = ["Mobilga mos", "Tez ochiladi", "SEO asosi", "Murojaat tizimi"];
const WEBSITE_BROWSER_TEXT = "Sizning biznesingiz — endi onlayn";

function SectionWebsite({ inView }: { inView: boolean }) {
  const reduced = useReducedMotion();
  const browserText = useTypedStageText(WEBSITE_BROWSER_TEXT, inView, reduced);
  const blocks = useReveal(6, inView, reduced, 230, 1300);
  const badges = useReveal(SITE_BADGES.length, inView, reduced, 130, 2700);

  const show = (i: number) =>
    `transition-all duration-500 ${blocks > i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`;

  return (
    <>
      <Eyebrow n="04">Website — birinchi oy</Eyebrow>

      <div className="mt-6 md:mt-8 grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)] gap-9 lg:gap-14 items-center">
        <div>
          <h2 className="text-[32px] min-[400px]:text-[38px] sm:text-[52px] md:text-[66px] font-bold leading-[1.03] tracking-[-0.04em]">
            Birinchi oydayoq professional website&apos;ga ega bo&apos;ling.
          </h2>
          <p className="mt-6 md:mt-8 text-[14px] md:text-[17px] text-white/50 leading-[1.6] max-w-[430px]">
            Agar saytingiz bo&apos;lmasa, birinchi oy ichida zamonaviy va mobilga mos website,
            xizmatlaringiz taqdimoti, murojaat tizimi va boshlang&apos;ich SEO sozlamalari
            tayyorlanadi.
          </p>
          <div className="mt-6 md:mt-8 flex flex-wrap gap-2">
            {SITE_BADGES.map((b, i) => (
              <span
                key={b}
                className={`rounded-full border border-[#7ea2d4]/25 bg-[#7ea2d4]/[0.07] px-3 py-1.5 text-[11.5px] md:text-[13px] text-white/70 transition-all duration-400 ${
                  i < badges ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="flex items-center gap-3 px-3 md:px-4 h-[42px] md:h-[48px] border-b border-white/[0.07]">
            <span className="flex gap-1.5">
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <span key={c} className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: c }} />
              ))}
            </span>
            <span className="flex-1 rounded-md bg-white/[0.05] h-[24px] md:h-[28px] flex items-center px-3 font-mono text-[10.5px] md:text-[12px] text-white/50">
              {browserText}
              {browserText.length < WEBSITE_BROWSER_TEXT.length && <Caret />}
            </span>
          </div>

          <div className="p-2.5 md:p-5 space-y-2.5 md:space-y-4">
            <div className={`flex items-center justify-between ${show(0)}`}>
              <span className="w-16 md:w-20 h-3.5 md:h-4 rounded bg-[#7ea2d4]/40" />
              <span className="flex gap-2 md:gap-3">
                {[26, 22, 30].map((w, i) => (
                  <span key={i} className="h-2.5 rounded bg-white/12" style={{ width: w }} />
                ))}
              </span>
            </div>

            <div className={`rounded-xl bg-white/[0.035] p-4 md:p-6 space-y-2.5 md:space-y-3 ${show(1)}`}>
              <span className="block h-4 md:h-6 rounded bg-white/20 w-[72%]" />
              <span className="block h-4 md:h-6 rounded bg-white/12 w-[48%]" />
              <span className="block h-2.5 rounded bg-white/[0.09] w-[60%] !mt-4" />
              <span className="block h-[30px] md:h-[34px] rounded-lg bg-[#7ea2d4]/35 w-[112px] md:w-[130px] !mt-5" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 md:gap-4">
              {[2, 3, 4].map((step, i) => (
                <div key={i} className={`rounded-xl bg-white/[0.035] p-3 md:p-4 space-y-2 ${show(step)}`}>
                  <span className="block w-6 h-6 md:w-7 md:h-7 rounded-md bg-[#7ea2d4]/25" />
                  <span className="block h-2.5 rounded bg-white/15 w-[80%]" />
                  <span className="block h-2 rounded bg-white/[0.08] w-[62%]" />
                </div>
              ))}
            </div>

            <div className={`rounded-xl border border-[#7ea2d4]/25 bg-[#7ea2d4]/[0.06] p-3 md:p-4 flex items-center gap-3 ${show(5)}`}>
              <span className="flex-1 h-[26px] md:h-[30px] rounded-lg bg-white/[0.06]" />
              <span className="h-[26px] md:h-[30px] w-[74px] md:w-[92px] rounded-lg bg-[#7ea2d4]/45" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────  05 · yo'l  ──────────────────────────── */

const CHART_PTS = [
  { x: 30, y: 232 },
  { x: 146, y: 214 },
  { x: 262, y: 182 },
  { x: 378, y: 138 },
  { x: 494, y: 84 },
  { x: 610, y: 30 },
];

const CHART_PATH =
  "M30,232 C76,229 106,221 146,214 C196,205 222,196 262,182 C310,165 340,155 378,138 C424,117 456,102 494,84 C540,62 574,45 610,30";

const PHASES = [
  { range: "1-oy", title: "Asos", items: ["Website", "Tahlil", "Strategiya"] },
  { range: "2–3-oy", title: "Qurilish", items: ["Texnik optimizatsiya", "Kontent yaratish"] },
  { range: "4–6-oy", title: "O'sish", items: ["Google pozitsiyalari", "Tashriflar", "Murojaatlar"] },
];

function SectionRoad({ inView }: { inView: boolean }) {
  const reduced = useReducedMotion();
  const cards = useReveal(PHASES.length, inView, reduced, 200, 1500);

  return (
    <>
      <Eyebrow n="05">6 oylik yo&apos;l</Eyebrow>

      <h2 className="mt-6 md:mt-8 text-[32px] min-[400px]:text-[38px] sm:text-[52px] md:text-[62px] font-bold leading-[1.03] tracking-[-0.04em] max-w-[760px]">
        Natijaga olib boradigan yo&apos;l.
      </h2>

      <div className="mt-5 md:mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.015] p-3 md:p-6">
        {/* max-w shart: aspect-ratio cheksiz kengaysa FitBox iteratsiyasi yaqinlashmaydi. */}
        <svg viewBox="0 0 640 275" className="w-full max-w-[760px] mx-auto h-auto" role="img" aria-label="6 oylik o'sish grafigi">
          <defs>
            <linearGradient id="seo-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity="0.28" />
              <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="seo-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={ACCENT} stopOpacity="0.5" />
              <stop offset="100%" stopColor={WIN} />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1="30"
              x2="610"
              y1={40 + i * 55}
              y2={40 + i * 55}
              stroke="rgba(255,255,255,0.055)"
              strokeWidth="1"
            />
          ))}

          <path
            d={`${CHART_PATH} L610,245 L30,245 Z`}
            fill="url(#seo-area)"
            className={inView ? "seo-chart-area" : ""}
            style={{ opacity: inView ? undefined : 0 }}
          />
          <path
            d={CHART_PATH}
            fill="none"
            stroke="url(#seo-line)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            className={inView ? "seo-chart-line" : ""}
            style={inView ? undefined : { strokeDasharray: 1, strokeDashoffset: 1 }}
          />

          {CHART_PTS.map((p, i) => (
            <g key={i} className={inView ? "seo-chart-dot" : ""} style={{ opacity: inView ? undefined : 0, animationDelay: `${1.1 + i * 0.13}s` }}>
              <circle cx={p.x} cy={p.y} r={i === CHART_PTS.length - 1 ? 6 : 4} fill="#07080b" />
              <circle
                cx={p.x}
                cy={p.y}
                r={i === CHART_PTS.length - 1 ? 6 : 4}
                fill="none"
                stroke={i === CHART_PTS.length - 1 ? WIN : ACCENT}
                strokeWidth="2.5"
              />
            </g>
          ))}

          {CHART_PTS.map((p, i) => (
            <text
              key={`t-${i}`}
              x={p.x}
              y={266}
              textAnchor="middle"
              className="font-mono"
              fontSize="12"
              fill="rgba(255,255,255,0.3)"
            >
              {i + 1}-oy
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-4 md:mt-9 grid sm:grid-cols-3 gap-3 sm:gap-6 md:gap-10">
        {PHASES.map((p, i) => (
          <div
            key={p.title}
            className={`transition-all duration-500 ${
              i < cards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            } ${i > 0 ? "sm:pl-6 md:pl-8 sm:border-l border-white/[0.08] pt-5 sm:pt-0 border-t sm:border-t-0" : ""}`}
          >
            <div className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-[#7ea2d4]">
              {p.range}
            </div>
            <h3 className="mt-2 text-[19px] md:text-[24px] font-semibold tracking-[-0.02em]">{p.title}</h3>
            <ul className="mt-2 sm:mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 sm:block sm:space-y-2 text-[13px] md:text-[15px] text-white/50">
              {p.items.map((it) => (
                <li key={it} className="flex items-center gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-7 md:mt-10 pt-5 md:pt-7 border-t border-white/[0.08] text-[14px] md:text-[17px] text-white/50 leading-[1.6] max-w-[820px]">
        Maqsadimiz — muhim qidiruvlar bo&apos;yicha Google TOP-10 natijalariga chiqish va AI
        tavsiyalarida ko&apos;rinish uchun kuchli raqamli asos yaratish.
      </p>
    </>
  );
}

/* ────────────────────────────  06 · tariflar  ──────────────────────────── */

const TARIFFS = [
  {
    name: "Standart",
    price: 300,
    tag: "Internetda ishonchli o'rin egallash uchun",
    features: [
      "Zamonaviy website — birinchi oyda tayyor",
      "Telegram bot orqali ariza qabul qilish",
      "Texnik SEO sozlamalari",
      "Kalit so'zlar tahlili va sahifalar strukturasi",
      "Oyiga 2–4 ta SEO kontent",
      "Google Xarita va lokal qidiruvda ko'rinish",
      "Oylik hisobot",
    ],
    featured: false,
  },
  {
    name: "Biznes",
    price: 600,
    tag: "Google va AI'da barqaror o'sish uchun",
    features: [
      "Standart tarifidagi barcha xizmatlar",
      "Kengaytirilgan texnik va on-page SEO",
      "Oyiga 6–8 ta professional kontent",
      "AEO — savol-javob kontenti",
      "GEO — AI tavsiyalarida ko'rinish ustida ishlash",
      "Raqobatchilar tahlili va tashqi SEO",
      "Oylik strategik uchrashuv",
    ],
    featured: true,
  },
];

function TariffCheck({ muted = false }: { muted?: boolean }) {
  return (
    <span className={`mt-[2px] flex size-4 shrink-0 items-center justify-center rounded-full ${muted ? "bg-white/[0.06]" : "bg-[#7ea2d4]/15"}`}>
      <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke={muted ? "rgba(255,255,255,.35)" : ACCENT} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

function MobilePricing() {
  return (
      <div className="flex min-h-[clamp(430px,62dvh,570px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
        <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
          <div>
            <div className="font-mono text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Standart</div>
            <div className="mt-1.5 text-[11.5px] text-white/40">Ishga tushirish uchun kerakli hammasi</div>
          </div>
          <div className="font-mono text-[34px] font-bold">$300<span className="text-[11px] font-normal text-white/35">/oy</span></div>
        </div>
        <ul className="grid flex-1 grid-cols-2 content-center gap-x-4 gap-y-3 p-5">
          {TARIFFS[0].features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-[11px] leading-[1.35] text-white/60"><TariffCheck muted /><span>{feature}</span></li>
          ))}
        </ul>
        <div className="flex flex-1 flex-col justify-center border-t border-[#7ea2d4]/25 bg-[#7ea2d4]/[0.08] p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[12px] font-bold uppercase tracking-[0.15em] text-[#9bb9e2]">Biznes</div>
              <div className="mt-1.5 text-[10.5px] text-white/40">Standartdagi barcha xizmatlar +</div>
            </div>
            <div className="font-mono text-[34px] font-bold text-[#7ea2d4]">$600<span className="text-[11px] font-normal text-white/35">/oy</span></div>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            {TARIFFS[1].features.slice(1).map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-[11px] leading-[1.35] text-white/72"><TariffCheck /><span>{feature}</span></li>
            ))}
          </ul>
        </div>
      </div>
    );

}

function PriceTag({ value, active, featured }: { value: number; active: boolean; featured: boolean }) {
  const reduced = useReducedMotion();
  const v = useTween(0, value, active, reduced, 1300, 250);
  return (
    <div className="flex items-baseline gap-1.5 mt-0 sm:mt-3 shrink-0">
      <span
        className={`font-mono font-bold tabular-nums leading-none tracking-[-0.04em] text-[32px] sm:text-[40px] md:text-[56px] ${
          featured ? "text-[#7ea2d4]" : "text-white"
        }`}
      >
        ${v.toLocaleString("en-US")}
      </span>
      <span className="text-[13px] md:text-[15px] text-white/35">/oy</span>
    </div>
  );
}

function SectionPricing({ inView }: { inView: boolean }) {
  return (
    <>
      <Eyebrow n="06">Tariflar</Eyebrow>

      <h2 className="mt-6 md:mt-8 text-[32px] min-[400px]:text-[38px] sm:text-[52px] md:text-[62px] font-bold leading-[1.03] tracking-[-0.04em]">
        Mos tarifni tanlang.
      </h2>

      <div className="mt-4 sm:hidden">
        <MobilePricing />
      </div>

      <div className="mt-5 md:mt-10 hidden sm:grid sm:grid-cols-2 gap-3 md:gap-6">
        {TARIFFS.map((p, i) => (
          <div
            key={p.name}
            className={`relative rounded-2xl border p-4 md:p-7 transition-all duration-600 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } ${
              p.featured
                ? "border-[#7ea2d4]/45 bg-[#7ea2d4]/[0.06]"
                : "border-white/[0.09] bg-white/[0.02]"
            }`}
            style={{ transitionDelay: `${i * 130}ms` }}
          >
            <div className="block">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/45">
                  {p.name}
                </span>
                {p.featured && (
                  <span className="rounded bg-[#7ea2d4] px-2 py-0.5 font-mono text-[9px] md:text-[10px] font-bold tracking-[0.14em] text-[#07080b]">
                    TAVSIYA ETAMIZ
                  </span>
                )}
              </div>

              <PriceTag value={p.price} active={inView} featured={p.featured} />
            </div>

            <div className="mt-1 sm:mt-1.5 text-[12px] md:text-[13px] text-white/35">{p.tag}</div>

            <ul className="mt-4 md:mt-7 grid grid-cols-1 gap-x-3 gap-y-2 md:gap-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[12.5px] md:text-[14px] text-white/60 leading-[1.4]">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 md:w-3.5 md:h-3.5 mt-[4px] shrink-0" fill="none" stroke={ACCENT} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-3 sm:mt-6 md:mt-8 text-[11px] sm:text-[12.5px] md:text-[14px] text-white/35">
        Har ikki tarifda ham doimiy aloqa va bajarilgan ishlar bo&apos;yicha hisobot mavjud.
      </p>
    </>
  );
}

/* ────────────────────────────  07 · cta  ──────────────────────────── */

function SectionCta({ inView }: { inView: boolean }) {
  const reduced = useReducedMotion();
  const searchText = "sizning xizmatingiz";
  const typed = useTypedStageText(searchText, inView, reduced);

  return (
    <>
      <Eyebrow n="07">Boshlash</Eyebrow>

      <div className="mt-6 md:mt-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] gap-9 lg:gap-16 items-center">
        <div>
          <h2 className="text-[38px] min-[400px]:text-[44px] sm:text-[62px] md:text-[82px] font-bold leading-[1] tracking-[-0.04em]">
            Bugun
            <br />
            <span className="text-[#7ea2d4]">boshlang</span>.
          </h2>

          <p className="mt-6 md:mt-8 text-[14px] md:text-[18px] text-white/55 leading-[1.6] max-w-[520px]">
            Alohida dasturchi, dizayner va SEO mutaxassis izlash shart emas — barcha jarayonni
            bitta jamoa boshqaradi. Biznesingizni o&apos;rganib, sizga mos tarif va dastlabki
            rivojlanish rejasini tavsiya qilamiz.
          </p>

          <p className="mt-4 md:mt-5 text-[13px] md:text-[16px] text-white/40">
            Website va SEO xizmatlari — oyiga{" "}
            <span className="font-mono font-semibold text-[#7ea2d4]">$300</span> dan.
          </p>

          <div className="mt-8 md:mt-11 flex w-full flex-wrap items-center justify-between gap-x-7 gap-y-4 md:w-auto md:justify-start">
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group order-2 inline-flex items-center gap-2.5 rounded-full bg-[#7ea2d4] px-6 md:order-1 md:px-8 h-[50px] md:h-[58px] text-[15px] md:text-[17px] font-semibold text-[#07080b] hover:bg-white transition-colors"
            >
              Bog&apos;lanish
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
            </a>
            <Link
              href="/"
              className="group order-1 inline-flex items-center gap-2 text-[14px] md:order-2 md:text-[16px] font-medium text-white/50 hover:text-white transition-colors"
            >
              Asosiy saytga
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.035] px-4 md:px-5 h-[50px] md:h-[58px]">
            <Search className="w-4 h-4 md:w-[18px] md:h-[18px] text-white/35 shrink-0" />
            <span className="font-mono text-[12.5px] md:text-[15px] text-white/85 truncate">
              {typed}
              {typed.length < searchText.length && <Caret />}
            </span>
          </div>

          <div className="mt-4 space-y-2 md:space-y-2.5">
            <div
              className={`h-[54px] md:h-[60px] transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <SerpRow rank={1} you />
            </div>
            {[2, 3].map((r) => (
              <div key={r} className="h-[54px] md:h-[60px]">
                <SerpRow rank={r} dim titleW={`${62 - r * 5}%`} urlW={`${34 - r * 3}%`} />
              </div>
            ))}
          </div>

          <p className="mt-4 font-mono text-[10.5px] md:text-[11.5px] uppercase tracking-[0.18em] text-white/25">
            Maqsad shu — mijoz qidirganda sizni topsin
          </p>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────  shell  ──────────────────────────── */

const RENDERERS = [
  SectionHook,
  SectionSeo,
  SectionGeo,
  SectionWebsite,
  SectionRoad,
  SectionPricing,
  SectionCta,
];

function Panel({
  id,
  index,
  register,
  Body,
  onNext,
}: {
  id: string;
  index: number;
  register: (i: number, el: HTMLElement | null) => void;
  Body: (p: { inView: boolean; onNext?: () => void }) => React.ReactNode;
  onNext?: () => void;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.18);

  return (
    <section
      id={id}
      ref={(node) => {
        ref.current = node;
        register(index, node);
      }}
      className="relative h-full snap-start snap-always overflow-hidden px-5 md:px-10 py-5 md:py-10"
    >
      <FitBox>
        <Body inView={inView} onNext={onNext} />
      </FitBox>
    </section>
  );
}

export function SeoScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

  const register = useCallback((i: number, el: HTMLElement | null) => {
    panels.current[i] = el;
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(el.scrollTop / max, 1) : 0);
    const line = el.scrollTop + el.clientHeight * 0.35;
    let best = 0;
    panels.current.forEach((p, i) => {
      if (p && p.offsetTop <= line) best = i;
    });
    setActive(best);
  }, []);

  const goTo = useCallback((i: number) => {
    const el = scrollRef.current;
    const target = panels.current[i];
    if (!el || !target) return;
    el.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(Math.min(active + 1, SECTIONS.length - 1));
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(Math.max(active - 1, 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, goTo]);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#07080b] text-white font-[family-name:var(--font-outfit)]">
      <style>{`
        @keyframes seoCaretBlink { 0%,45% { opacity: 1 } 50%,95% { opacity: 0 } 100% { opacity: 1 } }
        @keyframes seoNudgeDown { 0%,100% { transform: translateY(0) } 50% { transform: translateY(5px) } }
        @keyframes seoPulseDot { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: .35; transform: scale(.8) } }
        @keyframes seoDrawLine { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
        @keyframes seoFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes seoDotIn { from { opacity: 0; transform: scale(.4) } to { opacity: 1; transform: scale(1) } }
        @keyframes seoStageIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }

        .seo-caret { animation: seoCaretBlink 1.05s steps(1) infinite; }
        .seo-nudge { animation: seoNudgeDown 1.6s ease-in-out infinite; }
        .seo-pulse { animation: seoPulseDot 1.5s ease-in-out infinite; }
        .seo-chart-line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: seoDrawLine 1.9s cubic-bezier(0.16,1,0.3,1) 0.25s forwards; }
        .seo-chart-area { opacity: 0; animation: seoFadeIn 1s ease-out 1.1s forwards; }
        .seo-chart-dot { opacity: 0; transform-box: fill-box; transform-origin: center; animation: seoDotIn .5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .seo-stage-in { animation: seoStageIn .45s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .seo-caret, .seo-nudge, .seo-pulse, .seo-stage-in { animation: none; }
          .seo-chart-line { stroke-dashoffset: 0; animation: none; }
          .seo-chart-area, .seo-chart-dot { opacity: 1; animation: none; }
        }
      `}</style>

      <header className="relative z-20 shrink-0 border-b border-white/[0.06] bg-[#07080b]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 md:px-10 h-[58px] md:h-[68px]">
          <div className="flex items-center gap-2.5 md:gap-3">
            <DarslinkerLogo size={30} />
            <span className="hidden min-[380px]:inline text-[16px] md:text-[18px] font-semibold tracking-tight">
              Darslinker
            </span>
            <span className="hidden md:inline h-4 w-px bg-white/12 mx-1" />
            <span className="hidden md:inline font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
              Website · SEO · AEO · GEO
            </span>
          </div>
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 md:gap-2 h-[34px] md:h-[38px] rounded-full bg-white/[0.06] border border-white/12 px-4 md:px-5 text-[12px] md:text-[13px] font-medium hover:bg-[#7ea2d4] hover:text-[#07080b] hover:border-[#7ea2d4] transition-colors"
          >
            Bog&apos;lanish
            <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:rotate-12 transition-transform" />
          </a>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
          <div
            className="h-full bg-[#7ea2d4] transition-[width] duration-150 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </header>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain snap-y snap-mandatory"
      >
        {SECTIONS.map((s, i) => (
          <Panel
            key={s.id}
            id={s.id}
            index={i}
            register={register}
            Body={RENDERERS[i]}
            onNext={i < SECTIONS.length - 1 ? () => goTo(i + 1) : undefined}
          />
        ))}
      </div>

      <nav
        aria-label="Bo'limlar"
        className="pointer-events-none fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      >
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className="pointer-events-auto group flex items-center gap-2.5"
            aria-label={s.label}
            aria-current={i === active ? "true" : undefined}
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-300 ${
                i === active ? "text-white/60 opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`h-[2px] rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-[#7ea2d4]" : "w-3 bg-white/20 group-hover:bg-white/45"
              }`}
            />
          </button>
        ))}
      </nav>
    </div>
  );
}
