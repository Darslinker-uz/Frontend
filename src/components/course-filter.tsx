"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { type Course } from "@/data/courses";

const PRICE_MAX = 2000000;
const PRICE_STEP = 50000;
const PRICE_TOTAL_STEPS = PRICE_MAX / PRICE_STEP;
const FORMATS = ["Onlayn", "Oflayn", "Gibrid", "Video"];

// Server'dan keladigan struktura — DB taksonomiya
export interface FilterGroup {
  name: string;
  slug: string;
  categories: { name: string; slug: string; count: number }[];
}
export interface FilterRegion {
  name: string;
  slug: string;
}

function formatPrice(v: number) {
  if (v === 0) return "0";
  return v.toLocaleString("uz-UZ").replace(/\s/g, ",");
}

function PriceRangeSlider({ minVal, maxVal, onMinChange, onMaxChange }: { minVal: number; maxVal: number; onMinChange: (v: number) => void; onMaxChange: (v: number) => void }) {
  const minPrice = minVal * PRICE_STEP;
  const maxPrice = maxVal * PRICE_STEP;
  const minPct = (minVal / PRICE_TOTAL_STEPS) * 100;
  const maxPct = (maxVal / PRICE_TOTAL_STEPS) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-medium text-[#16181a]">{minPrice === 0 ? "Bepul" : formatPrice(minPrice)}</span>
        <span className="text-[10px] text-[#7c8490]">so&apos;m</span>
        <span className="text-[12px] font-medium text-[#16181a]">{formatPrice(maxPrice)}{maxPrice === PRICE_MAX ? "+" : ""}</span>
      </div>
      <div className="relative h-[36px] flex items-center">
        <div className="absolute left-0 right-0 h-[4px] rounded-full bg-[#e4e7ea]" />
        <div className="absolute h-[4px] rounded-full bg-[#7ea2d4]" style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }} />
        <input type="range" min={0} max={PRICE_TOTAL_STEPS} value={minVal} onChange={(e) => { const v = Number(e.target.value); if (v < maxVal) onMinChange(v); }} className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#7ea2d4] [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer" />
        <input type="range" min={0} max={PRICE_TOTAL_STEPS} value={maxVal} onChange={(e) => { const v = Number(e.target.value); if (v > minVal) onMaxChange(v); }} className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#7ea2d4] [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer" />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-[#7c8490]/50">0</span>
        <span className="text-[9px] text-[#7c8490]/50">500,000</span>
        <span className="text-[9px] text-[#7c8490]/50">1,000,000</span>
        <span className="text-[9px] text-[#7c8490]/50">2,000,000</span>
      </div>
    </div>
  );
}

interface FilterState {
  search: string;
  groupSlug: string | null;       // tanlangan guruh (yo'nalishlar guruhi)
  categorySlug: string | null;    // tanlangan yo'nalish (kategoriya)
  format: string | null;
  priceMin: number;
  priceMax: number;
  region: string | null;          // viloyat nomi (DB Region.name)
}

function getActiveTags(f: FilterState, groups: FilterGroup[]): { label: string; clear: () => FilterState }[] {
  const tags: { label: string; clear: () => FilterState }[] = [];
  if (f.groupSlug) {
    const group = groups.find(g => g.slug === f.groupSlug);
    if (group) tags.push({ label: group.name, clear: () => ({ ...f, groupSlug: null, categorySlug: null }) });
  }
  if (f.categorySlug) {
    const cat = groups.flatMap(g => g.categories).find(c => c.slug === f.categorySlug);
    if (cat) tags.push({ label: cat.name, clear: () => ({ ...f, categorySlug: null }) });
  }
  if (f.format) {
    tags.push({ label: f.format, clear: () => ({ ...f, format: null }) });
  }
  if (f.priceMin > 0 || f.priceMax < PRICE_TOTAL_STEPS) {
    const minP = f.priceMin * PRICE_STEP;
    const maxP = f.priceMax * PRICE_STEP;
    tags.push({ label: `${minP === 0 ? "0" : formatPrice(minP)} — ${formatPrice(maxP)}${maxP === PRICE_MAX ? "+" : ""} so'm`, clear: () => ({ ...f, priceMin: 0, priceMax: PRICE_TOTAL_STEPS }) });
  }
  if (f.region) {
    tags.push({ label: f.region, clear: () => ({ ...f, region: null }) });
  }
  return tags;
}

const defaultFilter: FilterState = { search: "", groupSlug: null, categorySlug: null, format: null, priceMin: 0, priceMax: PRICE_TOTAL_STEPS, region: null };

function FilterContent({ filter, setFilter, groups, regions }: { filter: FilterState; setFilter: (f: FilterState) => void; groups: FilterGroup[]; regions: FilterRegion[] }) {
  // Tanlangan guruh ochiladi (kategoriyalari ko'rsatiladi)
  const openGroupSlug = filter.groupSlug;

  const toggleGroup = (slug: string) => {
    if (filter.groupSlug === slug) {
      setFilter({ ...filter, groupSlug: null, categorySlug: null });
    } else {
      setFilter({ ...filter, groupSlug: slug, categorySlug: null });
    }
  };

  const toggleCategory = (slug: string) => {
    if (filter.categorySlug === slug) {
      setFilter({ ...filter, categorySlug: null });
    } else {
      setFilter({ ...filter, categorySlug: slug });
    }
  };

  const setFormat = (f: string) => {
    setFilter({ ...filter, format: filter.format === f ? null : f });
  };

  return (
    <div className="space-y-6">
      {/* GURUH → YO'NALISH (Variant B taksonomiya) */}
      {groups.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold text-[#16181a] uppercase tracking-wider mb-3">Yo&apos;nalishlar</p>
          <div className="space-y-0.5">
            {groups.map((g) => {
              const open = openGroupSlug === g.slug;
              const totalCount = g.categories.reduce((s, c) => s + c.count, 0);
              return (
                <div key={g.slug}>
                  <button onClick={() => toggleGroup(g.slug)} className={`w-full text-left px-3 py-2.5 rounded-[10px] text-[14px] font-medium flex items-center justify-between transition-all ${open ? "bg-[#7ea2d4]/10 text-[#4a7ab5] border-l-2 border-[#7ea2d4]" : "text-[#7c8490] hover:bg-[#f0f2f3]"}`}>
                    <span className="flex items-center gap-2 min-w-0">
                      <ChevronRight className={`w-4 h-4 transition-transform shrink-0 ${open ? "rotate-90 text-[#7ea2d4]" : "opacity-30"}`} />
                      <span className="truncate">{g.name}</span>
                    </span>
                    <span className={`text-[12px] shrink-0 ml-2 ${open ? "text-[#7ea2d4]/60" : "text-[#7c8490]/40"}`}>{totalCount}</span>
                  </button>
                  {open && g.categories.length > 0 && (
                    <div className="ml-8 mt-1 mb-2 space-y-0.5">
                      {g.categories.map((c) => {
                        const selected = filter.categorySlug === c.slug;
                        return (
                          <button
                            key={c.slug}
                            onClick={() => toggleCategory(c.slug)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-[8px] text-[13px] flex items-center justify-between transition-colors ${selected ? "bg-[#7ea2d4]/15 text-[#4a7ab5] font-semibold" : "text-[#16181a]/70 hover:bg-[#f0f2f3]"}`}
                          >
                            <span className="truncate">{c.name}</span>
                            <span className="text-[11px] text-[#7c8490]/50 shrink-0 ml-2">{c.count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="text-[12px] font-semibold text-[#16181a] uppercase tracking-wider mb-3">Format</p>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <button key={f} onClick={() => setFormat(f)} className={`h-[36px] px-4 rounded-full text-[13px] font-medium transition-all ${filter.format === f ? "bg-[#7ea2d4] text-white" : "bg-[#f0f2f3] text-[#7c8490] hover:text-[#16181a]"}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* VILOYAT (DB-driven) */}
      {regions.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold text-[#16181a] uppercase tracking-wider mb-3">Joylashuv</p>
          <select
            value={filter.region ?? ""}
            onChange={(e) => setFilter({ ...filter, region: e.target.value || null })}
            className="w-full h-[42px] px-3 rounded-[10px] bg-[#f0f2f3] border border-[#e4e7ea] text-[14px] text-[#16181a] focus:outline-none focus:border-[#7ea2d4]"
          >
            <option value="">Barcha viloyatlar</option>
            {regions.map((r) => <option key={r.slug} value={r.name}>{r.name}</option>)}
          </select>
        </div>
      )}

      <div>
        <p className="text-[12px] font-semibold text-[#16181a] uppercase tracking-wider mb-3">Narx</p>
        <PriceRangeSlider minVal={filter.priceMin} maxVal={filter.priceMax} onMinChange={(v) => setFilter({ ...filter, priceMin: v })} onMaxChange={(v) => setFilter({ ...filter, priceMax: v })} />
      </div>
    </div>
  );
}

export function applyFilter(courses: Course[], filter: FilterState): Course[] {
  let result = courses;
  if (filter.search) {
    const q = filter.search.toLowerCase();
    result = result.filter(c => c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  }
  // Yo'nalish (kategoriya) tanlangan bo'lsa — aniq yo'nalish bo'yicha
  if (filter.categorySlug) {
    result = result.filter(c => c.categorySlug === filter.categorySlug);
  } else if (filter.groupSlug) {
    // Faqat guruh tanlangan bo'lsa — guruh ichidagi barcha yo'nalishlar
    result = result.filter(c => c.groupSlug === filter.groupSlug);
  }
  if (filter.format) {
    // Variant 2 (inkluziv): Gibrid kurslar Onlayn va Oflayn filterlarida ham chiqadi
    if (filter.format === "Onlayn") {
      result = result.filter(c => c.format === "Online" || c.format === "Gibrid");
    } else if (filter.format === "Oflayn") {
      result = result.filter(c => c.format === "Offline" || c.format === "Gibrid");
    } else if (filter.format === "Gibrid") {
      result = result.filter(c => c.format === "Gibrid");
    } else if (filter.format === "Video") {
      result = result.filter(c => c.format === "Video");
    }
  }
  const minPrice = filter.priceMin * PRICE_STEP;
  const maxPrice = filter.priceMax * PRICE_STEP;
  if (minPrice > 0 || maxPrice < PRICE_MAX) {
    result = result.filter(c => {
      if (c.priceFree) return minPrice === 0;
      const p = parseInt(c.price.replace(/\s/g, ""));
      return p >= minPrice && (maxPrice === PRICE_MAX || p <= maxPrice);
    });
  }
  // Viloyat filter — Listing.region (text) ni Region.name bilan to'g'ridan-to'g'ri solishtirish
  if (filter.region) {
    result = result.filter(c => c.region === filter.region);
  }
  return result;
}

const URL_FORMAT_MAP: Record<string, string> = { "online": "Onlayn", "offline": "Oflayn", "video": "Video" };

interface CourseFilterProps {
  courses: Course[];
  groups: FilterGroup[];
  regions: FilterRegion[];
  onFilter: (filtered: Course[]) => void;
  children?: React.ReactNode;
  initialCategory?: string;
  initialSearch?: string;
  initialFormat?: string;
  onClearCategory?: () => void;
}

export function CourseFilter({ courses, groups, regions, onFilter, children, initialCategory, initialSearch, initialFormat, onClearCategory }: CourseFilterProps) {
  const [filter, setFilter] = useState<FilterState>(() => {
    const base = { ...defaultFilter };
    if (initialCategory) base.categorySlug = initialCategory;
    if (initialSearch) base.search = initialSearch;
    if (initialFormat) base.format = URL_FORMAT_MAP[initialFormat] || null;
    return base;
  });
  const [filterOpen, setFilterOpen] = useState(false);

  // initial filtrlar bor bo'lsa darhol qo'llash
  useEffect(() => {
    const base = { ...defaultFilter };
    if (initialSearch) base.search = initialSearch;
    if (initialFormat) base.format = URL_FORMAT_MAP[initialFormat] || null;
    if (initialSearch || initialFormat) {
      onFilter(applyFilter(courses, base));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tags = getActiveTags(filter, groups);
  const hasFilter = tags.length > 0;
  const filtered = applyFilter(courses, filter);

  // Sidebar da filtr darhol qo'llanadi (real-time)
  const updateFilter = useCallback((newFilter: FilterState) => {
    setFilter(newFilter);
    onFilter(applyFilter(courses, newFilter));
  }, [courses, onFilter]);

  // Qo'llash bosilganda
  const applyFilter_ = useCallback(() => {
    onFilter(applyFilter(courses, filter));
  }, [courses, filter, onFilter]);

  const clearAll = useCallback(() => {
    if (initialCategory && onClearCategory) {
      onClearCategory();
      return;
    }
    const cleared = defaultFilter;
    setFilter(cleared);
    onFilter(applyFilter(courses, cleared));
  }, [courses, onFilter, initialCategory, onClearCategory]);

  const removeTag = useCallback((clearFn: () => FilterState) => {
    const newFilter = clearFn();
    if (initialCategory && !newFilter.categorySlug && onClearCategory) {
      onClearCategory();
      return;
    }
    setFilter(newFilter);
    onFilter(applyFilter(courses, newFilter));
  }, [courses, onFilter, initialCategory, onClearCategory]);

  // Search — real-time ishlaydi (yozgan zahoti)
  const handleSearch = useCallback((search: string) => {
    const newFilter = { ...filter, search };
    setFilter(newFilter);
    onFilter(applyFilter(courses, newFilter));
  }, [filter, courses, onFilter]);

  // Mobil — Qo'llash bosilganda
  const applyAndClose = useCallback(() => {
    onFilter(applyFilter(courses, filter));
    setFilterOpen(false);
  }, [courses, filter, onFilter]);

  return (
    <>
      {/* Mobil */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
            <input type="text" value={filter.search} onChange={(e) => handleSearch(e.target.value)} placeholder="Kurs izlash..." className="w-full h-[44px] pl-10 pr-4 rounded-[12px] bg-white border border-[#e4e7ea] text-[16px] placeholder:text-[#7c8490]/50 focus:outline-none" />
          </div>
          <button onClick={() => setFilterOpen(true)} className="shrink-0 h-[44px] px-4 rounded-[12px] bg-white border border-[#e4e7ea] text-[#16181a] text-[13px] font-medium flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filtr {hasFilter && <span className="w-5 h-5 rounded-full bg-[#7ea2d4] text-white text-[10px] flex items-center justify-center">{tags.length}</span>}
          </button>
        </div>
        {/* Aktiv taglar */}
        {hasFilter && (
          <div className="flex items-center gap-2 flex-wrap">
            {tags.map((t) => (
              <button key={t.label} onClick={() => removeTag(t.clear)} className="h-[28px] px-3 rounded-full bg-[#7ea2d4] text-white text-[11px] font-medium flex items-center gap-1.5">
                {t.label} <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={clearAll} className="text-[12px] text-[#7ea2d4] font-medium">Tozalash</button>
          </div>
        )}
        <p className="text-[12px] text-[#7c8490]">{filtered.length} ta kurs topildi</p>

        {/* Fullscreen filtr */}
        <div className={`fixed inset-0 z-[100] bg-white transition-all duration-300 ${filterOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-[#e4e7ea] flex items-center justify-between">
            <h3 className="text-[20px] font-bold text-[#16181a]">Filtr</h3>
            <button onClick={() => setFilterOpen(false)} className="w-9 h-9 rounded-full bg-[#f0f2f3] flex items-center justify-center"><X className="w-5 h-5 text-[#7c8490]" /></button>
          </div>
          <div className="overflow-y-auto p-5" style={{ height: "calc(100vh - 140px)" }}>
            <FilterContent filter={filter} setFilter={setFilter} groups={groups} regions={regions} />
            {/* Tanlangan filtr teglari */}
            {tags.length > 0 && (
              <div className="mt-6 pt-5 border-t border-[#e4e7ea]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-semibold text-[#16181a] uppercase tracking-wider">Tanlangan</span>
                  <button onClick={() => setFilter(defaultFilter)} className="text-[12px] text-[#7ea2d4] font-medium">Tozalash</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <button key={t.label} onClick={() => setFilter(t.clear())} className="h-[30px] px-3 rounded-full bg-[#7ea2d4]/10 text-[#4a7ab5] text-[12px] font-medium flex items-center gap-1.5 border border-[#7ea2d4]/20">
                      {t.label} <X className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e4e7ea] p-5">
            <button onClick={applyAndClose} className="w-full h-[48px] rounded-[14px] bg-[#16181a] text-white text-[15px] font-medium">Qo&apos;llash</button>
          </div>
        </div>
      </div>

      {/* Desktop — Sidebar */}
      <div className="hidden md:block w-[260px] shrink-0 pr-6">
        <div className="sticky top-[62px] h-[calc(100vh-62px)] py-5 flex flex-col">
          <button onClick={applyFilter_} className={`w-full h-[40px] rounded-[10px] border-2 text-[13px] font-medium mb-3 shrink-0 transition-all bg-white ${hasFilter ? "border-[#16181a] text-[#16181a] hover:bg-[#16181a] hover:text-white" : "border-[#e4e7ea] text-[#7c8490]/40"}`}>
            {hasFilter ? "Qo'llash" : "Filtr tanlang"}
          </button>
          <div className="flex-1 overflow-y-auto rounded-[16px] bg-white border border-[#e4e7ea]" style={{ scrollbarWidth: "none" }}>
            <div className="p-4">
              <FilterContent filter={filter} setFilter={updateFilter} groups={groups} regions={regions} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop — Search + taglar (content tepasida) */}
      <div className="hidden md:block flex-1 border-l border-[#e4e7ea] pl-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
          <input type="text" value={filter.search} onChange={(e) => handleSearch(e.target.value)} placeholder="Kurs izlash..." className="w-full h-[44px] pl-10 pr-4 rounded-[12px] bg-white border border-[#e4e7ea] text-[14px] placeholder:text-[#7c8490]/50 focus:outline-none focus:ring-2 focus:ring-[#7ea2d4]/30 transition-all" />
        </div>
        {hasFilter && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-[12px] text-[#7c8490]">Filtrlar:</span>
            {tags.map((t) => (
              <button key={t.label} onClick={() => removeTag(t.clear)} className="h-[28px] px-3 rounded-full bg-[#7ea2d4] text-white text-[11px] font-medium flex items-center gap-1.5">
                {t.label} <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={clearAll} className="text-[12px] text-[#7ea2d4] font-medium hover:underline">Tozalash</button>
          </div>
        )}
        <p className="text-[13px] text-[#7c8490] mb-5">{filtered.length} ta kurs topildi</p>
        {children}
      </div>
    </>
  );
}
