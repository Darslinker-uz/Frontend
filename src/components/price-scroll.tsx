"use client";

import { useState } from "react";

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  bg: string;
  border: string;
  text: string;
  textMuted: string;
  accent?: string;
}

const MIN_DEFAULT = 10_000;
const MAX_DEFAULT = 5_000_000;

function format(v: number): string {
  return new Intl.NumberFormat("uz-UZ").format(v).replace(/\s/g, ",");
}

export function PriceScroll({
  value,
  onChange,
  min = MIN_DEFAULT,
  max = MAX_DEFAULT,
  bg,
  border,
  text,
  textMuted,
  accent = "#7ea2d4",
}: Props) {
  const [focused, setFocused] = useState(false);

  // Faqat raqamlarni chiqarib, vergullar bilan formatlab kiritamiz.
  // Foydalanuvchi 300000 yozsa, ekranda 300,000 ko'rinadi.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    if (!raw) {
      onChange(0);
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    onChange(n > max ? max : n);
  };

  const display = value > 0 ? format(value) : "";
  const showError = value > 0 && value < min;

  return (
    <div>
      <div
        className="relative rounded-[10px] transition-all"
        style={{
          backgroundColor: bg,
          border: `2px solid ${focused ? accent : (showError ? "#ef4444" : border)}`,
          boxShadow: focused ? `0 0 0 3px ${accent}22` : "none",
        }}
      >
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Narxni yozing"
          aria-label="Kurs narxi"
          className="w-full h-[56px] pl-4 pr-20 rounded-[10px] text-[22px] font-bold leading-tight tabular-nums focus:outline-none placeholder:font-normal placeholder:text-[16px]"
          style={{
            color: text,
            backgroundColor: "transparent",
          }}
        />
        <div
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[14px] font-medium"
          style={{ color: textMuted }}
        >
          so&apos;m
        </div>
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[11px]" style={{ color: showError ? "#ef4444" : textMuted }}>
        {showError ? (
          <span>Eng kam: {format(min)} so&apos;m</span>
        ) : (
          <>
            <span>Eng kam: {format(min)}</span>
            <span>Eng ko&apos;p: {format(max)}</span>
          </>
        )}
      </div>
    </div>
  );
}
