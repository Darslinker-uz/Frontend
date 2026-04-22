"use client";

import { useState } from "react";
import { Crown, Award, Eye, Users as UsersIcon, Search, SlidersHorizontal, Rows3, LayoutGrid, Calendar, ChevronDown, X, Check } from "lucide-react";

// ==================== DATA ====================

type BoostClass = "A" | "B";
type BoostStatus = "aktiv" | "tugagan" | "to'xtatilgan";

interface Boost {
  id: string;
  centerName: string;
  listingTitle: string;
  category: string;
  boostClass: BoostClass;
  daysTotal: number;
  daysLeft: number;
  pricePerDay: number;
  totalPaid: number;
  startedAt: string;
  endsAt: string;
  status: BoostStatus;
  views: number;
  leads: number;
}

const BOOSTS: Boost[] = [
  { id: "B-2041", centerName: "Najot Ta'lim", listingTitle: "JavaScript & React Full-stack", category: "IT", boostClass: "A", daysTotal: 30, daysLeft: 24, pricePerDay: 100000, totalPaid: 3000000, startedAt: "2026-04-12", endsAt: "2026-05-12", status: "aktiv", views: 4820, leads: 42 },
  { id: "B-2040", centerName: "Everest School", listingTitle: "IELTS Premium 7.0+", category: "Tillar", boostClass: "A", daysTotal: 10, daysLeft: 7, pricePerDay: 100000, totalPaid: 1000000, startedAt: "2026-04-15", endsAt: "2026-04-25", status: "aktiv", views: 2140, leads: 18 },
  { id: "B-2039", centerName: "Marketing Pro", listingTitle: "Digital Marketing A-Z", category: "Marketing", boostClass: "B", daysTotal: 7, daysLeft: 4, pricePerDay: 70000, totalPaid: 490000, startedAt: "2026-04-14", endsAt: "2026-04-21", status: "aktiv", views: 890, leads: 7 },
  { id: "B-2038", centerName: "IT Park Academy", listingTitle: "Python Backend Bootcamp", category: "IT", boostClass: "A", daysTotal: 15, daysLeft: 11, pricePerDay: 100000, totalPaid: 1500000, startedAt: "2026-04-13", endsAt: "2026-04-28", status: "aktiv", views: 3250, leads: 28 },
  { id: "B-2037", centerName: "Sarvar Nazarov", listingTitle: "UI/UX Figma Pro", category: "Dizayn", boostClass: "B", daysTotal: 14, daysLeft: 3, pricePerDay: 70000, totalPaid: 980000, startedAt: "2026-04-07", endsAt: "2026-04-21", status: "aktiv", views: 1120, leads: 9 },
  { id: "B-2036", centerName: "Najot Ta'lim", listingTitle: "Node.js Backend", category: "IT", boostClass: "B", daysTotal: 10, daysLeft: 1, pricePerDay: 70000, totalPaid: 700000, startedAt: "2026-04-01", endsAt: "2026-04-11", status: "aktiv", views: 1560, leads: 14 },
  { id: "B-2035", centerName: "Everest School", listingTitle: "SAT Preparation", category: "Tillar", boostClass: "A", daysTotal: 7, daysLeft: 0, pricePerDay: 100000, totalPaid: 700000, startedAt: "2026-04-05", endsAt: "2026-04-12", status: "tugagan", views: 980, leads: 8 },
  { id: "B-2033", centerName: "Marketing Pro", listingTitle: "SMM Pro Course", category: "Marketing", boostClass: "B", daysTotal: 7, daysLeft: 0, pricePerDay: 70000, totalPaid: 490000, startedAt: "2026-03-28", endsAt: "2026-04-04", status: "tugagan", views: 670, leads: 5 },
];

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n);

const CLASS_CFG: Record<BoostClass, { label: string; color: string; softBg: string; icon: typeof Crown }> = {
  A: { label: "A class", color: "#f59e0b", softBg: "linear-gradient(135deg, rgba(245,158,11,0.14), rgba(245,158,11,0.04))", icon: Crown },
  B: { label: "B class", color: "#3b82f6", softBg: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(59,130,246,0.04))", icon: Award },
};

const STATUS_CFG: Record<BoostStatus, { label: string; color: string }> = {
  aktiv: { label: "Aktiv", color: "#22c55e" },
  tugagan: { label: "Tugagan", color: "#64748b" },
  "to'xtatilgan": { label: "To'xtatilgan", color: "#ef4444" },
};

const S = {
  bg: "#0e1015",
  surface: "rgba(255,255,255,0.04)",
  surfaceStrong: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.06)",
  sidebar: "#16181a",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.55)",
  textDim: "rgba(255,255,255,0.3)",
  hover: "rgba(255,255,255,0.06)",
};

// Shared Gantt window
const WINDOW_START = new Date("2026-04-01").getTime();
const WINDOW_END = new Date("2026-05-15").getTime();
const WINDOW_SPAN = WINDOW_END - WINDOW_START;
const TODAY = new Date("2026-04-20").getTime();
const todayPct = ((TODAY - WINDOW_START) / WINDOW_SPAN) * 100;

const bStart = (b: Boost) => ((new Date(b.startedAt).getTime() - WINDOW_START) / WINDOW_SPAN) * 100;
const bWidth = (b: Boost) => ((new Date(b.endsAt).getTime() - new Date(b.startedAt).getTime()) / WINDOW_SPAN) * 100;

// ==================== MAIN ====================

const VARIANTS = [
  "1 — Pill filters",
  "2 — View switcher",
  "3 — Tabs",
  "4 — Sidebar filters",
  "5 — Top filter bar",
];

export default function CheckPage() {
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: S.bg, color: S.text }}>
      <div className="sticky top-0 z-50 backdrop-blur-md py-3" style={{ backgroundColor: "rgba(22,24,26,0.85)", borderBottom: `1px solid ${S.border}` }}>
        <div className="px-5 md:px-8 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {VARIANTS.map((v, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="shrink-0 px-4 h-8 rounded-full text-[12px] font-medium transition-all"
              style={{
                backgroundColor: active === i ? "#ffffff" : S.surfaceStrong,
                color: active === i ? "#16181a" : S.textMuted,
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 md:px-8 py-6 md:py-10">
        {active === 0 && <V1PillFilters />}
        {active === 1 && <V2ViewSwitcher />}
        {active === 2 && <V3Tabs />}
        {active === 3 && <V4SidebarFilters />}
        {active === 4 && <V5TopBar />}
      </div>
    </div>
  );
}

// ==================== V1 — PILL FILTERS ====================
// Default: standart rail list (barchasi), filter pill bosilganda filtrlash

function V1PillFilters() {
  type Filter = "hammasi" | "A" | "B" | "urgent" | "arxiv";
  const [filter, setFilter] = useState<Filter>("hammasi");

  const filtered = BOOSTS.filter(b => {
    if (filter === "hammasi") return b.status === "aktiv";
    if (filter === "A") return b.boostClass === "A" && b.status === "aktiv";
    if (filter === "B") return b.boostClass === "B" && b.status === "aktiv";
    if (filter === "urgent") return b.status === "aktiv" && b.daysLeft <= 3;
    if (filter === "arxiv") return b.status !== "aktiv";
    return true;
  });

  const counts = {
    hammasi: BOOSTS.filter(b => b.status === "aktiv").length,
    A: BOOSTS.filter(b => b.boostClass === "A" && b.status === "aktiv").length,
    B: BOOSTS.filter(b => b.boostClass === "B" && b.status === "aktiv").length,
    urgent: BOOSTS.filter(b => b.status === "aktiv" && b.daysLeft <= 3).length,
    arxiv: BOOSTS.filter(b => b.status !== "aktiv").length,
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Header title="Boostlar" subtitle="Filterlar orqali kerakli guruhni ko'ring" />

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {[
          { k: "hammasi" as Filter, label: "Hammasi", color: "#ffffff" },
          { k: "A" as Filter, label: "A class", color: "#f59e0b" },
          { k: "B" as Filter, label: "B class", color: "#3b82f6" },
          { k: "urgent" as Filter, label: "Tugamoqda", color: "#ef4444" },
          { k: "arxiv" as Filter, label: "Arxiv", color: "#64748b" },
        ].map(f => {
          const isActive = filter === f.k;
          return (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium transition-all"
              style={{
                backgroundColor: isActive ? `${f.color}22` : S.surface,
                color: isActive ? f.color : S.textMuted,
                border: `1px solid ${isActive ? `${f.color}55` : S.border}`,
              }}
            >
              {f.label}
              <span className="text-[10px] font-bold opacity-80">{counts[f.k]}</span>
            </button>
          );
        })}
      </div>

      <RailList items={filtered} />
    </div>
  );
}

// ==================== V2 — VIEW SWITCHER ====================
// Default: rail list, View mode tugmalari: List / Timeline / Group

function V2ViewSwitcher() {
  type View = "list" | "timeline" | "group";
  const [view, setView] = useState<View>("list");
  const active = BOOSTS.filter(b => b.status === "aktiv");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <h1 className="text-[24px] font-bold">Boostlar</h1>
          <p className="text-[13px] mt-1" style={{ color: S.textMuted }}>{active.length} ta aktiv</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: S.surface, border: `1px solid ${S.border}` }}>
          {[
            { k: "list" as View, label: "Ro'yxat", icon: Rows3 },
            { k: "timeline" as View, label: "Timeline", icon: Calendar },
            { k: "group" as View, label: "Guruh", icon: LayoutGrid },
          ].map(v => {
            const Icon = v.icon;
            const isActive = view === v.k;
            return (
              <button
                key={v.k}
                onClick={() => setView(v.k)}
                className="flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: isActive ? S.text : "transparent",
                  color: isActive ? S.bg : S.textMuted,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {view === "list" && <RailList items={active} />}
      {view === "timeline" && <TimelineView items={active} />}
      {view === "group" && <GroupedView items={active} />}
    </div>
  );
}

// ==================== V3 — TABS ====================
// Default: "Hammasi" tab active, cards grid

function V3Tabs() {
  type Tab = "hammasi" | "A" | "B" | "urgent" | "arxiv";
  const [tab, setTab] = useState<Tab>("hammasi");

  const items = BOOSTS.filter(b => {
    if (tab === "hammasi") return b.status === "aktiv";
    if (tab === "A") return b.boostClass === "A" && b.status === "aktiv";
    if (tab === "B") return b.boostClass === "B" && b.status === "aktiv";
    if (tab === "urgent") return b.status === "aktiv" && b.daysLeft <= 3;
    if (tab === "arxiv") return b.status !== "aktiv";
    return true;
  });

  const counts = {
    hammasi: BOOSTS.filter(b => b.status === "aktiv").length,
    A: BOOSTS.filter(b => b.boostClass === "A" && b.status === "aktiv").length,
    B: BOOSTS.filter(b => b.boostClass === "B" && b.status === "aktiv").length,
    urgent: BOOSTS.filter(b => b.status === "aktiv" && b.daysLeft <= 3).length,
    arxiv: BOOSTS.filter(b => b.status !== "aktiv").length,
  };

  const tabs: { k: Tab; label: string }[] = [
    { k: "hammasi", label: "Hammasi" },
    { k: "A", label: "A class" },
    { k: "B", label: "B class" },
    { k: "urgent", label: "Tugamoqda" },
    { k: "arxiv", label: "Arxiv" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <Header title="Boostlar" subtitle="Tablarga bosib turdagina filtrlash" />

      <div className="flex overflow-x-auto mb-5" style={{ borderBottom: `1px solid ${S.border}` }}>
        {tabs.map(t => {
          const isActive = tab === t.k;
          return (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className="flex items-center gap-2 h-11 px-4 md:px-5 text-[13px] font-medium whitespace-nowrap transition-colors"
              style={{
                color: isActive ? S.text : S.textMuted,
                borderBottom: `2px solid ${isActive ? S.text : "transparent"}`,
                marginBottom: "-1px",
              }}
            >
              {t.label}
              <span className="text-[10px] px-1.5 h-[18px] rounded-full flex items-center font-bold" style={{ backgroundColor: S.hover, color: S.textMuted }}>{counts[t.k]}</span>
            </button>
          );
        })}
      </div>

      <CardGrid items={items} />
    </div>
  );
}

// ==================== V4 — SIDEBAR FILTERS ====================
// Default: chap sidebar filter paneli + o'ngda standart list

function V4SidebarFilters() {
  const [classFilter, setClassFilter] = useState<Set<BoostClass>>(new Set());
  const [statusFilter, setStatusFilter] = useState<Set<BoostStatus>>(new Set(["aktiv"]));
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sort, setSort] = useState<"newest" | "ending" | "revenue">("ending");

  const filtered = BOOSTS
    .filter(b => classFilter.size === 0 || classFilter.has(b.boostClass))
    .filter(b => statusFilter.size === 0 || statusFilter.has(b.status))
    .filter(b => !urgentOnly || (b.status === "aktiv" && b.daysLeft <= 3))
    .sort((a, b) => {
      if (sort === "ending") return a.daysLeft - b.daysLeft;
      if (sort === "revenue") return b.totalPaid - a.totalPaid;
      return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
    });

  const toggleClass = (c: BoostClass) => {
    const next = new Set(classFilter);
    if (next.has(c)) next.delete(c); else next.add(c);
    setClassFilter(next);
  };
  const toggleStatus = (s: BoostStatus) => {
    const next = new Set(statusFilter);
    if (next.has(s)) next.delete(s); else next.add(s);
    setStatusFilter(next);
  };

  const hasFilters = classFilter.size > 0 || statusFilter.size !== 1 || !statusFilter.has("aktiv") || urgentOnly;

  return (
    <div>
      <Header title="Boostlar" subtitle="Chap paneldan filterlang" />

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
        <div className="rounded-[14px] p-4 h-fit" style={{ backgroundColor: S.surface, border: `1px solid ${S.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-4 h-4" style={{ color: S.textMuted }} />
            <p className="text-[13px] font-bold">Filterlar</p>
            {hasFilters && (
              <button onClick={() => { setClassFilter(new Set()); setStatusFilter(new Set(["aktiv"])); setUrgentOnly(false); }} className="ml-auto text-[11px]" style={{ color: "#ef4444" }}>
                Tozalash
              </button>
            )}
          </div>

          <FilterGroup title="Class">
            {(["A", "B"] as BoostClass[]).map(c => {
              const cfg = CLASS_CFG[c];
              return (
                <Checkbox key={c} checked={classFilter.has(c)} onChange={() => toggleClass(c)} label={cfg.label} color={cfg.color} />
              );
            })}
          </FilterGroup>

          <FilterGroup title="Holat">
            {(["aktiv", "tugagan", "to'xtatilgan"] as BoostStatus[]).map(s => {
              const cfg = STATUS_CFG[s];
              return (
                <Checkbox key={s} checked={statusFilter.has(s)} onChange={() => toggleStatus(s)} label={cfg.label} color={cfg.color} />
              );
            })}
          </FilterGroup>

          <FilterGroup title="Maxsus">
            <Checkbox checked={urgentOnly} onChange={() => setUrgentOnly(!urgentOnly)} label="Tugamoqda (≤3 kun)" color="#ef4444" />
          </FilterGroup>

          <FilterGroup title="Tartib" last>
            {[
              { k: "ending" as const, label: "Tez tugaydigan" },
              { k: "newest" as const, label: "Eng yangi" },
              { k: "revenue" as const, label: "Daromad bo'yicha" },
            ].map(o => (
              <button
                key={o.k}
                onClick={() => setSort(o.k)}
                className="w-full flex items-center gap-2 h-7 px-2 rounded-md text-[12px] text-left transition-colors"
                style={{ backgroundColor: sort === o.k ? S.hover : "transparent", color: sort === o.k ? S.text : S.textMuted }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sort === o.k ? S.text : S.textDim }} />
                {o.label}
              </button>
            ))}
          </FilterGroup>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3 text-[12px]" style={{ color: S.textMuted }}>
            <span>{filtered.length} ta natija</span>
          </div>
          <RailList items={filtered} />
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`${last ? "" : "pb-4 mb-4"}`} style={last ? {} : { borderBottom: `1px solid ${S.border}` }}>
      <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: S.textDim }}>{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Checkbox({ checked, onChange, label, color }: { checked: boolean; onChange: () => void; label: string; color: string }) {
  return (
    <button onClick={onChange} className="w-full flex items-center gap-2 h-7 rounded-md text-[12px] text-left transition-colors px-1" style={{ color: checked ? S.text : S.textMuted }}>
      <div
        className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
        style={{
          backgroundColor: checked ? color : "transparent",
          border: `1.5px solid ${checked ? color : S.border}`,
        }}
      >
        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>
      {label}
    </button>
  );
}

// ==================== V5 — TOP FILTER BAR ====================
// Default: standart cards, yuqorida search + filter chips + sort dropdown

function V5TopBar() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<BoostClass | null>(null);
  const [statusFilter, setStatusFilter] = useState<BoostStatus | "all">("aktiv");
  const [sort, setSort] = useState<"ending" | "revenue" | "newest">("ending");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = BOOSTS
    .filter(b => statusFilter === "all" || b.status === statusFilter)
    .filter(b => !classFilter || b.boostClass === classFilter)
    .filter(b => !search || b.listingTitle.toLowerCase().includes(search.toLowerCase()) || b.centerName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "ending") return a.daysLeft - b.daysLeft;
      if (sort === "revenue") return b.totalPaid - a.totalPaid;
      return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
    });

  const sortLabels = { ending: "Tez tugaydigan", revenue: "Daromad bo'yicha", newest: "Eng yangi" };

  return (
    <div className="max-w-6xl mx-auto">
      <Header title="Boostlar" subtitle="Yuqorida qidiruv va filterlar" />

      <div className="rounded-[12px] p-3 mb-5" style={{ backgroundColor: S.surface, border: `1px solid ${S.border}` }}>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: S.textDim }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="E'lon yoki markaz nomi..."
              className="w-full h-9 pl-9 pr-3 rounded-md text-[13px] outline-none"
              style={{ backgroundColor: S.bg, border: `1px solid ${S.border}`, color: S.text }}
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-md" style={{ backgroundColor: S.bg, border: `1px solid ${S.border}` }}>
            {([
              { k: "aktiv" as const, label: "Aktiv" },
              { k: "tugagan" as const, label: "Tugagan" },
              { k: "all" as const, label: "Hammasi" },
            ]).map(s => {
              const isActive = statusFilter === s.k;
              return (
                <button
                  key={s.k}
                  onClick={() => setStatusFilter(s.k)}
                  className="h-8 px-2.5 rounded text-[11px] font-medium transition-colors"
                  style={{ backgroundColor: isActive ? S.surfaceStrong : "transparent", color: isActive ? S.text : S.textMuted }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 h-9 px-3 rounded-md text-[12px] font-medium"
              style={{ backgroundColor: S.bg, border: `1px solid ${S.border}`, color: S.text }}
            >
              {sortLabels[sort]}
              <ChevronDown className="w-3 h-3" style={{ color: S.textMuted }} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute top-10 right-0 z-20 w-44 rounded-md py-1 shadow-xl" style={{ backgroundColor: S.sidebar, border: `1px solid ${S.border}` }}>
                  {(Object.entries(sortLabels) as [typeof sort, string][]).map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => { setSort(k); setSortOpen(false); }}
                      className="w-full h-8 px-3 text-left text-[12px] flex items-center gap-2 transition-colors"
                      style={{ color: sort === k ? S.text : S.textMuted }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = S.hover}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {sort === k && <Check className="w-3 h-3" />}
                      <span className={sort === k ? "" : "pl-5"}>{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[11px]" style={{ color: S.textDim }}>Class:</span>
          {(["A", "B"] as BoostClass[]).map(c => {
            const cfg = CLASS_CFG[c];
            const isActive = classFilter === c;
            return (
              <button
                key={c}
                onClick={() => setClassFilter(isActive ? null : c)}
                className="inline-flex items-center gap-1 h-6 px-2 rounded-full text-[11px] font-medium transition-all"
                style={{
                  backgroundColor: isActive ? `${cfg.color}22` : "transparent",
                  color: isActive ? cfg.color : S.textMuted,
                  border: `1px solid ${isActive ? `${cfg.color}55` : S.border}`,
                }}
              >
                <cfg.icon className="w-3 h-3" />
                {cfg.label}
                {isActive && <X className="w-2.5 h-2.5 ml-0.5" />}
              </button>
            );
          })}
          {(classFilter || search) && (
            <button onClick={() => { setClassFilter(null); setSearch(""); }} className="ml-auto text-[11px]" style={{ color: "#ef4444" }}>
              Filtrlarni tozalash
            </button>
          )}
        </div>
      </div>

      <CardGrid items={filtered} />
    </div>
  );
}

// ==================== SHARED VIEW COMPONENTS ====================

function RailList({ items }: { items: Boost[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: S.surface, border: `1px dashed ${S.border}` }}>
        <p className="text-[14px]" style={{ color: S.textMuted }}>Boost topilmadi</p>
      </div>
    );
  }
  return (
    <div className="space-y-2.5">
      {items.map(b => <RailCard key={b.id} boost={b} />)}
    </div>
  );
}

function RailCard({ boost }: { boost: Boost }) {
  const cfg = CLASS_CFG[boost.boostClass];
  const stat = STATUS_CFG[boost.status];
  const pct = boost.daysTotal > 0 ? ((boost.daysTotal - boost.daysLeft) / boost.daysTotal) * 100 : 100;
  const urgent = boost.status === "aktiv" && boost.daysLeft <= 3;
  return (
    <div className="rounded-[12px] p-4" style={{ backgroundColor: S.surface, border: `1px solid ${S.border}`, borderLeft: `3px solid ${cfg.color}` }}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="inline-flex items-center gap-1 px-1.5 h-5 rounded text-[10px] font-bold shrink-0" style={{ backgroundColor: `${cfg.color}22`, color: cfg.color }}>
            <cfg.icon className="w-3 h-3" />
            {cfg.label}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold truncate">{boost.listingTitle}</p>
            <p className="text-[11px] truncate" style={{ color: S.textMuted }}>{boost.centerName}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          {boost.status === "aktiv"
            ? <p className="text-[13px] font-bold" style={{ color: urgent ? "#ef4444" : S.text }}>{boost.daysLeft} kun</p>
            : <p className="text-[12px] font-semibold" style={{ color: stat.color }}>{stat.label}</p>
          }
          <p className="text-[10px]" style={{ color: S.textDim }}>{fmt(boost.totalPaid / 1000)}k so&apos;m</p>
        </div>
      </div>
      <div className="relative h-6 rounded-md overflow-hidden mb-2" style={{ backgroundColor: S.hover }}>
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-end pr-2 transition-all"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${urgent ? "#ef444466" : `${cfg.color}66`}, ${urgent ? "#ef4444" : cfg.color})` }}
        >
          <span className="text-[10px] font-bold text-white">{Math.round(pct)}%</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <span className="text-[10px] font-medium" style={{ color: S.textDim }}>{boost.startedAt.slice(5)}</span>
          <span className="text-[10px] font-medium" style={{ color: S.textDim }}>{boost.endsAt.slice(5)}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[11px]" style={{ color: S.textMuted }}>
        <span><Eye className="w-3 h-3 inline mr-1" />{fmt(boost.views)}</span>
        <span style={{ color: "#22c55e" }}><UsersIcon className="w-3 h-3 inline mr-1" />{boost.leads} lead</span>
      </div>
    </div>
  );
}

function CardGrid({ items }: { items: Boost[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: S.surface, border: `1px dashed ${S.border}` }}>
        <p className="text-[14px]" style={{ color: S.textMuted }}>Boost topilmadi</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map(b => <RailCard key={b.id} boost={b} />)}
    </div>
  );
}

function TimelineView({ items }: { items: Boost[] }) {
  return (
    <div className="rounded-[14px] overflow-hidden" style={{ backgroundColor: S.surface, border: `1px solid ${S.border}` }}>
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between pb-2" style={{ color: S.textDim }}>
          {["1 Apr", "10 Apr", "20 Apr", "1 May", "10 May"].map((d, i) => (
            <span key={i} className="text-[10px]">{d}</span>
          ))}
        </div>
      </div>
      <div className="relative pb-3">
        <div className="absolute top-0 bottom-0 w-px z-10" style={{ left: `calc(20px + (100% - 40px) * ${todayPct / 100})`, backgroundColor: "#ef4444" }} />
        {items.map((b, i) => {
          const cfg = CLASS_CFG[b.boostClass];
          return (
            <div key={b.id} className="px-5 py-2" style={{ borderTop: i === 0 ? `1px solid ${S.border}` : "none" }}>
              <div className="flex items-center gap-3">
                <div className="w-40 shrink-0 min-w-0">
                  <p className="text-[12px] font-semibold truncate">{b.listingTitle}</p>
                  <p className="text-[10px] truncate" style={{ color: S.textDim }}>{b.centerName}</p>
                </div>
                <div className="flex-1 relative h-6">
                  <div
                    className="absolute inset-y-0 rounded-sm flex items-center px-1.5 overflow-hidden"
                    style={{ left: `${bStart(b)}%`, width: `${bWidth(b)}%`, background: `linear-gradient(90deg, ${cfg.color}55, ${cfg.color}bb)` }}
                  >
                    <span className="text-[9px] font-bold">{b.daysLeft}k</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GroupedView({ items }: { items: Boost[] }) {
  return (
    <div className="space-y-5">
      {(["A", "B"] as BoostClass[]).map(cls => {
        const group = items.filter(b => b.boostClass === cls);
        if (group.length === 0) return null;
        const cfg = CLASS_CFG[cls];
        return (
          <div key={cls}>
            <div className="rounded-[12px] p-3 mb-2 flex items-center gap-3" style={{ background: cfg.softBg, border: `1px solid ${cfg.color}33` }}>
              <cfg.icon className="w-4 h-4" style={{ color: cfg.color }} />
              <p className="text-[13px] font-bold">{cfg.label}</p>
              <span className="text-[11px]" style={{ color: S.textMuted }}>· {group.length} ta</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {group.map(b => <RailCard key={b.id} boost={b} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==================== HELPERS ====================

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-[24px] font-bold">{title}</h1>
      {subtitle && <p className="text-[13px] mt-1" style={{ color: S.textMuted }}>{subtitle}</p>}
    </div>
  );
}
