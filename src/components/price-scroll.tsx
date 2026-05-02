"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

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
  accent: string;
}

const MIN_DEFAULT = 10_000;
const MAX_DEFAULT = 5_000_000;
const STEP_DEFAULT = 1_000;

function clamp(v: number, min: number, max: number, step: number) {
  const rounded = Math.round(v / step) * step;
  return Math.min(max, Math.max(min, rounded));
}

function format(v: number) {
  return new Intl.NumberFormat("uz-UZ").format(v).replace(/\s/g, ",");
}

export function PriceScroll({
  value,
  onChange,
  min = MIN_DEFAULT,
  max = MAX_DEFAULT,
  step = STEP_DEFAULT,
  bg,
  border,
  text,
  textMuted,
  accent,
}: Props) {
  const displayRef = useRef<HTMLDivElement>(null);
  const v = clamp(value || min, min, max, step);
  const pct = ((v - min) / (max - min)) * 100;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const el = displayRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (editing) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -step : step;
      onChange(clamp(v + delta, min, max, step));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [v, min, max, step, onChange, editing]);

  const dec = () => onChange(clamp(v - step, min, max, step));
  const inc = () => onChange(clamp(v + step, min, max, step));

  const startEdit = () => {
    setDraft(String(v));
    setEditing(true);
  };
  const finishEdit = () => {
    const n = Number(draft.replace(/[^\d]/g, ""));
    if (Number.isFinite(n) && n > 0) {
      onChange(clamp(n, min, max, step));
    }
    setEditing(false);
    setDraft("");
  };

  return (
    <div className="rounded-[10px] p-3" style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
      <div
        ref={displayRef}
        className="flex items-center justify-between gap-3 select-none"
      >
        <button
          type="button"
          onClick={dec}
          disabled={v <= min}
          className="w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ backgroundColor: border, color: text }}
          aria-label="Kamaytirish"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex-1 text-center" title="Scroll qiling yoki bosib kiriting">
          {editing ? (
            <input
              type="text"
              autoFocus
              inputMode="numeric"
              value={draft}
              onChange={(e) => setDraft(e.target.value.replace(/[^\d\s,.]/g, ""))}
              onBlur={finishEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); finishEdit(); }
                if (e.key === "Escape") { setEditing(false); setDraft(""); }
              }}
              className="w-full text-center bg-transparent text-[20px] font-bold leading-tight tabular-nums focus:outline-none"
              style={{ color: text }}
            />
          ) : (
            <button
              type="button"
              onClick={startEdit}
              className="w-full text-center cursor-text"
              aria-label="Narxni qo'lda kiritish"
            >
              <div className="text-[20px] font-bold leading-tight tabular-nums" style={{ color: text }}>
                {format(v)}
              </div>
            </button>
          )}
          <div className="text-[11px]" style={{ color: textMuted }}>so&apos;m</div>
        </div>

        <button
          type="button"
          onClick={inc}
          disabled={v >= max}
          className="w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ backgroundColor: border, color: text }}
          aria-label="Oshirish"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="relative mt-3 h-[22px] flex items-center">
        <div className="absolute inset-x-0 h-[4px] rounded-full" style={{ backgroundColor: border }} />
        <div className="absolute h-[4px] rounded-full" style={{ width: `${pct}%`, backgroundColor: accent }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={v}
          onChange={(e) => onChange(clamp(Number(e.target.value), min, max, step))}
          className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
        />
      </div>

      <div className="flex items-center justify-between mt-1.5 text-[10px]" style={{ color: textMuted }}>
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
