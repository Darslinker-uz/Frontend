"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MapPin, BookOpen, Search, ChevronDown, Target, Check } from "lucide-react";

type Region = { slug: string; name: string };
type Group = { slug: string; name: string; count: number };

type Props = {
  totalCenters: number;
  totalCategories: number;
  totalRegions: number;
  regions: Region[];
  groups: Group[];
  topRegions: Region[];
};

// Custom dropdown — Portal-rendered to escape hero's overflow-hidden clipping
function FilterDropdown<T>({
  icon,
  placeholder,
  items,
  selected,
  onSelect,
  getKey,
  getLabel,
  getCount,
}: {
  icon: React.ReactNode;
  placeholder: string;
  items: T[];
  selected: T | null;
  onSelect: (item: T | null) => void;
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  getCount?: (item: T) => number;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePos = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 240),
    });
  };

  useEffect(() => {
    if (!open) return;
    updatePos();
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScrollOrResize = () => {
      updatePos();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  const renderPanel = () => {
    if (!open || !pos) return null;
    return (
      <div
        ref={panelRef}
        className="fixed z-[200] bg-[#0f231a] border border-emerald-700/40 rounded-[14px] shadow-2xl shadow-black/40 overflow-hidden"
        style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
      >
        <div className="max-h-[320px] overflow-y-auto overscroll-contain p-1.5">
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left rounded-[8px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors text-[13.5px]"
          >
            <div className="w-3.5 h-3.5 shrink-0">{!selected && <Check className="w-3.5 h-3.5 text-emerald-300" />}</div>
            <span className="flex-1">{placeholder}</span>
          </button>
          {items.length === 0 ? (
            <div className="px-3 py-3 text-[13px] text-white/40 text-center">Hech narsa topilmadi</div>
          ) : (
            items.map((item) => {
              const k = getKey(item);
              const isSelected = selected !== null && getKey(selected) === k;
              const count = getCount?.(item);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-left rounded-[8px] transition-colors text-[13.5px] ${
                    isSelected ? "bg-emerald-500/15 text-white" : "text-white/85 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <div className="w-3.5 h-3.5 shrink-0">
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-300" />}
                  </div>
                  <span className="flex-1 truncate">{getLabel(item)}</span>
                  {typeof count === "number" && (
                    <span className={`text-[11px] tabular-nums ${isSelected ? "text-emerald-200" : "text-white/40"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full md:flex-1">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.04] rounded-[10px] transition-colors group"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-emerald-300 shrink-0">{icon}</span>
        <span className={`flex-1 text-[14px] truncate ${selected ? "text-white" : "text-white/60"}`}>
          {selected ? getLabel(selected) : placeholder}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/50 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {mounted && typeof window !== "undefined" && createPortal(renderPanel(), document.body)}
    </div>
  );
}

export function OquvMarkazlarHero({ totalCenters: _totalCenters, totalCategories: _totalCategories, totalRegions: _totalRegions, regions, groups, topRegions }: Props) {
  void _totalCenters; void _totalCategories; void _totalRegions;

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  return (
    <div className="max-w-[1600px] mx-auto px-5 md:px-20 pt-6 md:pt-8 pb-6">
      <div className="relative rounded-[16px] md:rounded-[20px] border border-[#e4e7ea] overflow-hidden bg-gradient-to-br from-[#0f231a] via-[#1a4d3f] to-[#2d7a6a]">
        {/* Wave animations */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] overflow-hidden pointer-events-none">
          <svg className="absolute bottom-0 w-[200%] h-[60px] animate-[waveMove_6s_linear_infinite]" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1440,0 1440,30 L1440,60 L0,60 Z" fill="rgba(126,212,178,0.06)" />
          </svg>
          <svg className="absolute bottom-0 w-[200%] h-[60px] animate-[waveMove_8s_linear_infinite]" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,35 C200,10 400,55 600,35 C800,10 1000,55 1200,35 C1400,10 1440,35 1440,35 L1440,60 L0,60 Z" fill="rgba(126,212,178,0.04)" />
          </svg>
        </div>

        {/* Subtle ambient glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="relative px-5 py-8 md:px-10 md:py-12 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2.5 py-1 mb-4">
            <Target className="w-3 h-3 text-emerald-300" />
            <span className="text-[11px] font-semibold text-white tracking-wider uppercase">O&apos;zingizga mosini toping</span>
          </div>

          {/* H1 */}
          <h1 className="text-[29px] md:text-[39px] font-semibold text-white tracking-[-0.02em] mb-3 max-w-[820px] mx-auto leading-tight">
            O&apos;zbekistondagi o&apos;quv markazlar katalogi
          </h1>

          {/* Subtitle — AEO question format */}
          <p className="text-[13px] md:text-[15px] text-white/70 max-w-[620px] mx-auto">
            Qaysi o&apos;quv markazi sizga mos? Solishtiring, sharhlarni o&apos;qing, to&apos;g&apos;ri tanlov qiling.
          </p>

          {/* Filter form */}
          <form
            action="/kurslar"
            method="GET"
            className="mt-6 md:mt-7 bg-white/[0.08] backdrop-blur-xl border border-white/15 rounded-[14px] p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-1 max-w-[720px] mx-auto text-left shadow-2xl shadow-black/30"
          >
            {/* Hidden inputs for form submission */}
            {selectedRegion && <input type="hidden" name="region" value={selectedRegion.name} />}
            {selectedGroup && <input type="hidden" name="guruh" value={selectedGroup.slug} />}

            <FilterDropdown<Region>
              icon={<MapPin className="w-4 h-4" />}
              placeholder="Barcha viloyatlar"
              items={regions}
              selected={selectedRegion}
              onSelect={setSelectedRegion}
              getKey={(r) => r.slug}
              getLabel={(r) => r.name}
            />

            <div className="hidden md:block w-px h-6 bg-white/10 shrink-0" />

            <FilterDropdown<Group>
              icon={<BookOpen className="w-4 h-4" />}
              placeholder="Barcha yo'nalishlar"
              items={groups}
              selected={selectedGroup}
              onSelect={setSelectedGroup}
              getKey={(g) => g.slug}
              getLabel={(g) => g.name}
              getCount={(g) => g.count}
            />

            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-[14px] font-semibold rounded-[10px] px-5 py-2.5 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/30 shrink-0"
            >
              <Search className="w-4 h-4" /> Qidir
            </button>
          </form>

        </div>

        <style>{`@keyframes waveMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </div>
    </div>
  );
}
