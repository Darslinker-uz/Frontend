"use client";

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
}: Props) {
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

  return (
    <div className="rounded-[10px] p-3" style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
      <div className="flex items-baseline gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder="0"
          className="flex-1 min-w-0 bg-transparent text-[20px] font-bold leading-tight tabular-nums focus:outline-none"
          style={{ color: text }}
        />
        <span className="text-[13px] shrink-0" style={{ color: textMuted }}>so&apos;m</span>
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[10px]" style={{ color: textMuted }}>
        <span>Eng kam: {format(min)}</span>
        <span>Eng ko&apos;p: {format(max)}</span>
      </div>
    </div>
  );
}
