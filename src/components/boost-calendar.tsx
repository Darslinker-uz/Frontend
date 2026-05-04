"use client";

import { useEffect, useState } from "react";

interface CalendarDay {
  date: string;        // YYYY-MM-DD
  available: boolean;
}

interface Props {
  type: "a_class" | "b_class";
  duration: number;        // tanlangan kun soni
  startDate: string | null; // tanlangan boshlanish kuni (YYYY-MM-DD) yoki null
  onSelect: (date: string) => void;
  bg: string;
  border: string;
  surface: string;
  text: string;
  textMuted: string;
  textDim: string;
  accent: string;
}

const WEEKDAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

export function BoostCalendar({
  type, duration, startDate, onSelect,
  bg, border, surface, text, textMuted, textDim, accent,
}: Props) {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/boost/calendar?type=${type}`, { cache: "no-store", credentials: "same-origin" })
      .then(r => r.json())
      .then(data => { if (!cancelled && data.days) setDays(data.days); })
      .catch(e => console.error("[boost-calendar]", e))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [type]);

  // Hozirgi va tanlangan diapazon
  const startIdx = startDate ? days.findIndex(d => d.date === startDate) : -1;
  const selectedRange = startIdx >= 0
    ? days.slice(startIdx, startIdx + duration).map(d => d.date)
    : [];
  const skippedInRange = startIdx >= 0
    ? days.slice(startIdx, startIdx + duration).filter(d => !d.available).map(d => d.date)
    : [];

  if (loading) {
    return <p className="text-[13px] text-center py-6" style={{ color: textMuted }}>Calendar yuklanmoqda...</p>;
  }
  if (days.length === 0) {
    return <p className="text-[13px] text-center py-6" style={{ color: textMuted }}>Calendar yuklanmadi</p>;
  }

  // Birinchi kunni mos kun-haftaga moslash uchun bo'sh kataklar
  const firstDate = new Date(days[0].date);
  const firstWeekday = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1; // Yakshanba=6, Du=0
  const monthLabel = `${MONTHS[firstDate.getMonth()]} ${firstDate.getFullYear()}`;

  return (
    <div className="rounded-[12px] p-4" style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold" style={{ color: text }}>{monthLabel}</span>
        <div className="flex items-center gap-3 text-[10px]" style={{ color: textDim }}>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bg, border: `1px solid ${border}` }} />Bo&apos;sh</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/60" />Band</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />Tanlangan</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-[10px] text-center font-medium" style={{ color: textDim }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map(d => {
          const isInRange = selectedRange.includes(d.date);
          const isStart = d.date === startDate;
          const isSkipped = skippedInRange.includes(d.date);
          const dayNum = new Date(d.date).getDate();

          let bgColor = bg;
          let borderColor = border;
          let textColor = text;
          let cursor = d.available ? "pointer" : "not-allowed";

          if (!d.available && !isInRange) {
            bgColor = "rgba(239, 68, 68, 0.18)";
            borderColor = "rgba(239, 68, 68, 0.4)";
            textColor = "#ef4444";
          }
          if (isInRange && !isSkipped) {
            bgColor = accent;
            borderColor = accent;
            textColor = "#ffffff";
          }
          if (isInRange && isSkipped) {
            bgColor = "rgba(239, 68, 68, 0.4)";
            borderColor = "#ef4444";
            textColor = "#ffffff";
          }
          if (isStart) {
            borderColor = "#ffffff";
          }

          return (
            <button
              key={d.date}
              type="button"
              disabled={!d.available}
              onClick={() => d.available && onSelect(d.date)}
              className="aspect-square rounded-[8px] text-[12px] font-semibold transition-all border-2 flex items-center justify-center"
              style={{
                backgroundColor: bgColor,
                borderColor: borderColor,
                color: textColor,
                cursor,
                opacity: !d.available && !isInRange ? 0.6 : 1,
              }}
              title={d.available ? "Bo'sh — bossangiz boshlanish kuni" : "Band — bu kun bron qilingan"}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      {startDate && skippedInRange.length > 0 && (
        <div className="mt-3 rounded-[8px] p-2.5 text-[11px]" style={{ backgroundColor: "#f59e0b15", color: "#a16207" }}>
          ⚠️ {skippedInRange.length} ta kun band — bu kunlar o&apos;tkazib yuboriladi va pul faqat bo&apos;sh kunlar uchun olinadi.
        </div>
      )}
    </div>
  );
}
