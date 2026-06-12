"use client";

import { useMemo, useState } from "react";
import { Search, X, ArrowUpDown, Video, MapPin, SlidersHorizontal } from "lucide-react";
import { FAKE_TUTORS } from "@/data/fake-tutors";
import { TutorCard } from "@/components/tutor-card";

const SUBJECT_LABELS: Record<string, string> = {
  matematika: "Matematika",
  "ingliz-tili": "Ingliz tili",
  fizika: "Fizika",
  kimyo: "Kimyo",
  biologiya: "Biologiya",
  "ona-tili": "Ona tili",
  informatika: "Informatika",
  "rus-tili": "Rus tili",
  tarix: "Tarix",
  geografiya: "Geografiya",
};

type Format = "all" | "online" | "offline";
type Price = "all" | "lt50" | "mid" | "gt70";
type Sort = "tavsiya" | "reyting" | "narx-asc" | "narx-desc" | "tajriba" | "sharh";

const SORT_LABELS: Record<Sort, string> = {
  tavsiya: "Tavsiya etilgan",
  reyting: "Reyting bo'yicha",
  "narx-asc": "Avval arzon narx",
  "narx-desc": "Avval qimmat narx",
  tajriba: "Ko'p tajriba",
  sharh: "Ko'p sharh",
};

const PRICE_CHIPS: { v: Price; label: string }[] = [
  { v: "all", label: "Hammasi" },
  { v: "lt50", label: "50 000 gacha" },
  { v: "mid", label: "50–70 000" },
  { v: "gt70", label: "70 000+" },
];

const FilterLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wide shrink-0">{children}</span>
);

export function RepetitorlarBarchaClient() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState<string>("all");
  const [format, setFormat] = useState<Format>("all");
  const [price, setPrice] = useState<Price>("all");
  const [region, setRegion] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("tavsiya");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const subjectFacets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of FAKE_TUTORS) counts.set(t.subjectKey, (counts.get(t.subjectKey) ?? 0) + 1);
    return [...counts.entries()]
      .map(([key, count]) => ({ key, label: SUBJECT_LABELS[key] ?? key, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const regionOptions = useMemo(() => {
    const set = new Set(FAKE_TUTORS.map((t) => t.region));
    return [...set].sort((a, b) => (a === "Onlayn" ? -1 : b === "Onlayn" ? 1 : a.localeCompare(b)));
  }, []);

  const inPrice = (p: number) =>
    price === "all" ? true : price === "lt50" ? p < 50000 : price === "mid" ? p >= 50000 && p <= 70000 : p > 70000;

  const result = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = FAKE_TUTORS.filter((t) => {
      if (subject !== "all" && t.subjectKey !== subject) return false;
      if (format === "online" && !t.online) return false;
      if (format === "offline" && t.online) return false;
      if (region !== "all" && t.region !== region) return false;
      if (!inPrice(t.price)) return false;
      if (q && !`${t.name} ${t.subject}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...list];
    switch (sort) {
      case "reyting": sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
      case "narx-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "narx-desc": sorted.sort((a, b) => b.price - a.price); break;
      case "tajriba": sorted.sort((a, b) => b.experience - a.experience); break;
      case "sharh": sorted.sort((a, b) => b.reviews - a.reviews); break;
      default: break; // tavsiya — original tartib
    }
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, subject, format, price, region, sort]);

  // Ikkilamchi filtrlar soni (mobil "Filtrlar" badge uchun)
  const secondaryCount = (format !== "all" ? 1 : 0) + (price !== "all" ? 1 : 0) + (region !== "all" ? 1 : 0);
  const hasActive = search !== "" || subject !== "all" || secondaryCount > 0;
  const reset = () => { setSearch(""); setSubject("all"); setFormat("all"); setPrice("all"); setRegion("all"); };

  // Ikkilamchi filtrlar — desktopda doim, mobilda "Filtrlar" ostida
  const secondaryFilters = (
    <div className="flex flex-col gap-3">
      {/* Format */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterLabel>Format</FilterLabel>
        <div className="inline-flex bg-[#f2f4f5] rounded-[10px] p-0.5">
          {([["all", "Hammasi"], ["online", "Onlayn"], ["offline", "Oflayn"]] as const).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFormat(v)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-colors ${
                format === v ? "bg-white text-[#16181a] shadow-sm" : "text-[#7c8490] hover:text-[#16181a]"
              }`}
            >
              {v === "online" && <Video className="w-3.5 h-3.5" />}
              {v === "offline" && <MapPin className="w-3.5 h-3.5" />}
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Narx */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterLabel>Narx / soat</FilterLabel>
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRICE_CHIPS.map((p) => (
            <button
              key={p.v}
              onClick={() => setPrice(p.v)}
              className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${
                price === p.v ? "bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700" : "bg-white border-[#e4e7ea] text-[#475569] hover:border-fuchsia-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hudud */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterLabel>Hudud</FilterLabel>
        <div className="flex items-center gap-2 px-3 bg-white border border-[#e4e7ea] rounded-[10px]">
          <MapPin className="w-3.5 h-3.5 text-[#7c8490]" />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-transparent text-[12.5px] font-medium text-[#16181a] py-1.5 pr-1 outline-none cursor-pointer"
            aria-label="Hudud"
          >
            <option value="all">Barcha hudud</option>
            {regionOptions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  const sortSelect = (
    <div className="flex items-center gap-2 px-3 bg-[#f8fafc] border border-[#e4e7ea] rounded-[12px]">
      <ArrowUpDown className="w-4 h-4 text-[#7c8490] shrink-0" />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as Sort)}
        className="flex-1 bg-transparent text-[14px] font-medium text-[#16181a] py-2.5 pr-1 outline-none cursor-pointer"
        aria-label="Saralash"
      >
        {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
          <option key={s} value={s}>{SORT_LABELS[s]}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      {/* ───── TOOLBAR ───── */}
      <div className="bg-white rounded-[18px] border border-[#e4e7ea] p-3 md:p-4 mb-5 space-y-3">
        {/* Qidiruv (+ saralash desktopda) */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex items-center gap-2 flex-1 px-3.5 bg-[#f8fafc] border border-[#e4e7ea] rounded-[12px]">
            <Search className="w-4 h-4 text-[#7c8490] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism yoki fan bo'yicha qidiring…"
              className="flex-1 bg-transparent text-[14px] text-[#16181a] py-2.5 outline-none placeholder:text-[#9aa3ad]"
            />
            {search && <button onClick={() => setSearch("")} aria-label="Tozalash"><X className="w-4 h-4 text-[#9aa3ad]" /></button>}
          </div>
          <div className="hidden sm:block w-[210px] shrink-0">{sortSelect}</div>
        </div>

        {/* Fan chiplari */}
        <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 scrollbar-hide">
          <button
            onClick={() => setSubject("all")}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
              subject === "all" ? "bg-[#16181a] border-[#16181a] text-white" : "bg-white border-[#e4e7ea] text-[#475569] hover:border-fuchsia-300"
            }`}
          >
            Barcha fanlar
          </button>
          {subjectFacets.map((s) => (
            <button
              key={s.key}
              onClick={() => setSubject(s.key)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
                subject === s.key ? "bg-fuchsia-600 border-fuchsia-600 text-white" : "bg-white border-[#e4e7ea] text-[#475569] hover:border-fuchsia-300"
              }`}
            >
              {s.label}
              <span className={`text-[11px] ${subject === s.key ? "text-white/70" : "text-[#9aa3ad]"}`}>{s.count}</span>
            </button>
          ))}
        </div>

        {/* Mobil: saralash + Filtrlar toggle */}
        <div className="flex sm:hidden items-stretch gap-2">
          <div className="flex-1">{sortSelect}</div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`relative inline-flex items-center gap-2 px-4 rounded-[12px] border text-[14px] font-medium transition-colors ${
              filtersOpen || secondaryCount > 0 ? "bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700" : "bg-white border-[#e4e7ea] text-[#16181a]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filtrlar
            {secondaryCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-fuchsia-600 text-white text-[11px] font-bold flex items-center justify-center">{secondaryCount}</span>
            )}
          </button>
        </div>

        {/* Ikkilamchi filtrlar — desktopda doim, mobilda toggle ostida */}
        <div className="hidden sm:block border-t border-[#f0f2f3] pt-3">{secondaryFilters}</div>
        {filtersOpen && <div className="sm:hidden border-t border-[#f0f2f3] pt-3">{secondaryFilters}</div>}
      </div>

      {/* Natija soni + tozalash */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <p className="text-[14px] text-[#7c8490]">
          <span className="font-bold text-[#16181a]">{result.length}</span> ta repetitor
          {subject !== "all" ? ` · ${SUBJECT_LABELS[subject] ?? subject}` : ""}
        </p>
        {hasActive && (
          <button onClick={reset} className="inline-flex items-center gap-1 text-[13px] font-medium text-[#7c8490] hover:text-fuchsia-700 shrink-0">
            <X className="w-3.5 h-3.5" /> Tozalash
          </button>
        )}
      </div>

      {/* Grid */}
      {result.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-20 rounded-[18px] bg-white border border-[#e4e7ea]">
          <p className="text-[16px] text-[#7c8490] font-medium">Repetitor topilmadi</p>
          <p className="text-[13px] text-[#7c8490]/60 mt-1">Filtrlarni o&apos;zgartirib ko&apos;ring</p>
          {hasActive && (
            <button onClick={reset} className="mt-4 px-4 py-2 rounded-full bg-fuchsia-600 text-white text-[13px] font-medium hover:bg-fuchsia-700 transition-colors">
              Filtrlarni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {result.map((t, i) => <TutorCard key={i} t={t} />)}
        </div>
      )}
    </div>
  );
}
