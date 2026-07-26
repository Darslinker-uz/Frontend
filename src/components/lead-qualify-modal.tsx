"use client";

import { useEffect, useState } from "react";
import { X, Check, ArrowLeft, Send, CalendarClock, Clock, Wallet, AlertCircle } from "lucide-react";
import {
  START_TIMING_OPTIONS,
  PREFERRED_TIME_OPTIONS,
  BUDGET_OPTIONS,
  type LeadQualifyAnswers,
  type StartTiming,
  type PreferredTime,
  type Budget,
} from "@/lib/lead-qualify";

/** Sahifa ranglariga moslash — kurs (dark), markaz (emerald), repetitor (fuchsia). */
type Accent = "dark" | "emerald" | "fuchsia";

const ACCENT: Record<Accent, {
  solid: string; selected: string; box: string; bar: string; iconWrap: string; icon: string;
}> = {
  dark: {
    solid: "bg-[#16181a] hover:bg-[#2b2f33] disabled:bg-[#16181a]/40",
    selected: "border-[#16181a] bg-[#16181a]/[0.04]",
    box: "bg-[#16181a] border-[#16181a] text-white",
    bar: "bg-[#16181a]",
    iconWrap: "bg-[#16181a]/[0.06]",
    icon: "text-[#16181a]",
  },
  emerald: {
    solid: "bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300",
    selected: "border-emerald-500 bg-emerald-50",
    box: "bg-emerald-600 border-emerald-600 text-white",
    bar: "bg-emerald-600",
    iconWrap: "bg-emerald-50",
    icon: "text-emerald-600",
  },
  fuchsia: {
    solid: "bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-fuchsia-300",
    selected: "border-fuchsia-500 bg-fuchsia-50",
    box: "bg-fuchsia-600 border-fuchsia-600 text-white",
    bar: "bg-fuchsia-600",
    iconWrap: "bg-fuchsia-50",
    icon: "text-fuchsia-600",
  },
};

const STEPS = [
  { icon: CalendarClock, title: "Kursni qachon boshlamoqchisiz?", hint: null },
  { icon: Clock, title: "Sizga qaysi vaqt qulay?", hint: "Bir nechtasini tanlashingiz mumkin" },
  { icon: Wallet, title: "Oyiga qancha ajrata olasiz?", hint: null },
] as const;

const TOTAL = STEPS.length;

type Props = {
  open: boolean;
  accent?: Accent;
  submitting: boolean;
  error?: string | null;
  /** Javoblar (yoki to'ldirilgan qismi) bilan arizani yuboradi. */
  onSubmit: (answers: LeadQualifyAnswers) => void;
  /** Xatolik chiqqanda formaga qaytish — ariza yuborilmaydi. */
  onCancel: () => void;
};

/**
 * Ism/telefon to'g'ri to'ldirilgach chiqadigan 3 bosqichli ixtiyoriy savollar.
 *
 * Yopish (X / Escape / "O'tkazib yuborish") arizani BEKOR QILMAYDI — shu paytgacha
 * belgilangan javoblar bilan yuboradi. Faqat xatolik holatida yopish formaga
 * qaytaradi, aks holda foydalanuvchi noto'g'ri raqamni tuzata olmay qolardi.
 */
export function LeadQualifyModal({ open, accent = "dark", submitting, error, onSubmit, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [startTiming, setStartTiming] = useState<StartTiming | null>(null);
  const [preferredTimes, setPreferredTimes] = useState<PreferredTime[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);

  const submitNow = () => onSubmit({ startTiming, preferredTimes, budget });
  // Xato bo'lsa yopish = formaga qaytish, aks holda = shu javoblar bilan yuborish.
  const dismiss = () => (error ? onCancel() : submitNow());

  // Qayta ochilganda birinchi savoldan boshlanadi (javoblar saqlanib qoladi).
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) dismiss();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, submitting, error, startTiming, preferredTimes, budget]);

  if (!open) return null;

  const a = ACCENT[accent];
  const current = STEPS[step];
  const StepIcon = current.icon;
  const isLast = step === TOTAL - 1;

  /** "Farqi yo'q" boshqa vaqtlar bilan birga tanlanmaydi. */
  const toggleTime = (value: PreferredTime) => {
    setPreferredTimes(prev => {
      if (value === "any") return prev.includes("any") ? [] : ["any"];
      const withoutAny = prev.filter(v => v !== "any");
      return withoutAny.includes(value)
        ? withoutAny.filter(v => v !== value)
        : [...withoutAny, value];
    });
  };

  const options =
    step === 0 ? START_TIMING_OPTIONS : step === 1 ? PREFERRED_TIME_OPTIONS : BUDGET_OPTIONS;

  const isSelected = (value: string) =>
    step === 0 ? startTiming === value
      : step === 1 ? preferredTimes.includes(value as PreferredTime)
        : budget === value;

  const choose = (value: string) => {
    if (step === 0) setStartTiming(prev => (prev === value ? null : (value as StartTiming)));
    else if (step === 1) toggleTime(value as PreferredTime);
    else setBudget(prev => (prev === value ? null : (value as Budget)));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-[2px] p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-qualify-step-title"
    >
      <div className="w-full sm:max-w-[440px] max-h-[92vh] overflow-y-auto bg-white rounded-t-[24px] sm:rounded-[22px] shadow-2xl">
        {/* Mobil "tortish" chizig'i */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-9 h-1 rounded-full bg-[#dfe3e8]" />
        </div>

        <div className="px-5 sm:px-6 pt-3 sm:pt-5 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-[11px] flex items-center justify-center ${a.iconWrap}`}>
                <StepIcon className={`w-[18px] h-[18px] ${a.icon}`} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa2ad]">
                  {step + 1} / {TOTAL} · Ixtiyoriy
                </p>
                <p className="text-[12.5px] text-[#7c8490] leading-tight">
                  Sizga mosroq taklif uchun
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              disabled={submitting}
              aria-label={error ? "Formaga qaytish" : "O'tkazib yuborib, arizani yuborish"}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#8c94a0] hover:bg-[#f2f4f6] hover:text-[#16181a] transition-colors disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bosqich indikatori */}
          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-[3px] flex-1 rounded-full transition-colors ${i <= step ? a.bar : "bg-[#e9ecef]"}`}
              />
            ))}
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-1">
          <h3 id="lead-qualify-step-title" className="text-[17px] font-bold text-[#16181a] leading-snug">
            {current.title}
          </h3>
          {current.hint && (
            <p className="text-[12.5px] text-[#7c8490] mt-1">{current.hint}</p>
          )}

          <div className="mt-4 space-y-2">
            {options.map(o => {
              const selected = isSelected(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  disabled={submitting}
                  aria-pressed={selected}
                  onClick={() => choose(o.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[13px] border text-left transition-colors disabled:opacity-60 ${
                    selected ? a.selected : "border-[#e4e7ea] bg-white hover:border-[#c9ced5]"
                  }`}
                >
                  <span
                    className={`shrink-0 w-[19px] h-[19px] border flex items-center justify-center transition-colors ${
                      step === 1 ? "rounded-[6px]" : "rounded-full"
                    } ${selected ? a.box : "border-[#cfd5db] bg-white"}`}
                  >
                    {selected && <Check className="w-3 h-3" strokeWidth={3} />}
                  </span>
                  <span className="text-[14px] text-[#16181a]">{o.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mx-5 sm:mx-6 mt-4 flex items-start gap-2 text-[12.5px] text-red-700 bg-red-50 border border-red-100 rounded-[11px] px-3 py-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
            <span>{error}</span>
          </div>
        )}

        <div className="px-5 sm:px-6 pt-5 pb-5 sm:pb-6">
          <div className="flex items-center gap-2.5">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                disabled={submitting}
                className="shrink-0 h-12 px-4 inline-flex items-center gap-1.5 rounded-[12px] border border-[#e4e7ea] text-[14px] font-medium text-[#5b6472] hover:bg-[#f7f8f9] transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" /> Ortga
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? submitNow() : setStep(s => s + 1))}
              disabled={submitting}
              className={`flex-1 h-12 inline-flex items-center justify-center gap-2 text-white text-[15px] font-semibold rounded-[12px] transition-colors ${a.solid}`}
            >
              {isLast ? (
                <>
                  <Send className="w-4 h-4" />
                  {submitting ? "Yuborilmoqda..." : "Arizani yuborish"}
                </>
              ) : (
                "Keyingi"
              )}
            </button>
          </div>

          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={error ? onCancel : submitNow}
              disabled={submitting}
              className="text-[12.5px] text-[#8c94a0] hover:text-[#16181a] underline underline-offset-[3px] transition-colors disabled:opacity-50"
            >
              {error ? "Formaga qaytish" : "Savollarsiz yuborish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
