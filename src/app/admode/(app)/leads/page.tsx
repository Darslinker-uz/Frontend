"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Phone, MessageSquare, Handshake, Check, X, Send, Building2, GraduationCap, User as UserIcon, ChevronDown, ChevronRight, ChevronLeft, MapPin, Calendar } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type Tab = "students" | "yordam" | "hamkorlik";

// ==================== TYPES ====================

type StudentStatus = "new_lead" | "contacted" | "converted" | "disputed";

interface StudentLead {
  id: number;
  name: string;
  phone: string;
  course: string;
  status: StudentStatus;
  time: string; // ISO date
}

interface CenterGroup {
  id: number;
  name: string;
  city: string;
  category: string;
  totalLeads: number;
  boughtThisWeek: number;
  leads: StudentLead[];
}

type HelpStatus = "new_req" | "answered" | "closed";

interface HelpLead {
  id: number;
  name: string;
  phone: string;
  interest: string;
  message?: string;
  status: HelpStatus;
  createdAt: string;
}

type PartnerStatus = "new_app" | "in_progress" | "accepted" | "rejected";

interface PartnerLead {
  id: number;
  name: string;
  phone: string;
  telegram?: string;
  centerName: string;
  category: string;
  city: string;
  studentsCount: string;
  message?: string;
  status: PartnerStatus;
  createdAt: string;
}

// ==================== UTILS ====================

const initials = (n: string) => n.split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase();
const avatarColor = (n: string) => {
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4", "#ef4444", "#f97316"];
  return colors[n.charCodeAt(0) % colors.length];
};

const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Hozir";
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 172800) return "Kecha";
  return `${Math.floor(diff / 86400)} kun oldin`;
};

const TAB_META: Record<Tab, { label: string; subtitle: string; icon: typeof MessageSquare; color: string }> = {
  students: { label: "O'quvchilar", subtitle: "Markazlar bo'yicha", icon: GraduationCap, color: "#3b82f6" },
  yordam: { label: "Yordam so'rovlari", subtitle: "Bosh sahifa formasi", icon: MessageSquare, color: "#f59e0b" },
  hamkorlik: { label: "Hamkorlik", subtitle: "Yangi markaz arizalari", icon: Handshake, color: "#22c55e" },
};

const STUDENT_STATUS_MAP: Record<StudentStatus, { label: string; color: string }> = {
  new_lead: { label: "Yangi", color: "#3b82f6" },
  contacted: { label: "Jarayonda", color: "#f59e0b" },
  converted: { label: "Sotib oldi", color: "#22c55e" },
  disputed: { label: "Sifatsiz", color: "#ef4444" },
};

const HELP_STATUS_MAP: Record<HelpStatus, { label: string; color: string }> = {
  new_req: { label: "Javob kutmoqda", color: "#f59e0b" },
  answered: { label: "Javob berilgan", color: "#22c55e" },
  closed: { label: "Yopilgan", color: "#64748b" },
};

const PARTNER_STATUS_MAP: Record<PartnerStatus, { label: string; color: string }> = {
  new_app: { label: "Ko'rib chiqilmagan", color: "#3b82f6" },
  in_progress: { label: "Jarayonda", color: "#f59e0b" },
  accepted: { label: "Qabul qilingan", color: "#22c55e" },
  rejected: { label: "Rad etilgan", color: "#ef4444" },
};

function AdminLeadsContent() {
  const { config } = useAdminTheme();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab");
  const initial: Tab = (rawTab === "yordam" || rawTab === "hamkorlik" || rawTab === "students") ? rawTab : "students";
  const [tab, setTab] = useState<Tab>(initial);

  const [centers, setCenters] = useState<CenterGroup[]>([]);
  const [helpLeads, setHelpLeads] = useState<HelpLead[]>([]);
  const [partnerLeads, setPartnerLeads] = useState<PartnerLead[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingHelp, setLoadingHelp] = useState(true);
  const [loadingPartner, setLoadingPartner] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, hRes, pRes] = await Promise.all([
          fetch("/api/admin/leads/students"),
          fetch("/api/admin/leads/help"),
          fetch("/api/admin/leads/partner"),
        ]);
        const [sData, hData, pData] = await Promise.all([sRes.json(), hRes.json(), pRes.json()]);
        setCenters(sData.centers ?? []);
        setHelpLeads(hData.leads ?? []);
        setPartnerLeads(pData.apps ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingStudents(false);
        setLoadingHelp(false);
        setLoadingPartner(false);
      }
    };
    load();
  }, []);

  const isLight = config.id === "light";

  const counts: Record<Tab, number> = {
    students: centers.reduce((s, c) => s + c.leads.length, 0),
    yordam: helpLeads.filter(l => l.status === "new_req").length,
    hamkorlik: partnerLeads.filter(l => l.status === "new_app").length,
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>Leadlar</h1>
        <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>O'quvchilar, yordam so'rovlari va hamkorlik arizalari</p>
      </div>

      {/* Top tabs — horizontal */}
      <div
        className="flex items-center gap-1 p-1 rounded-[14px] mb-5 overflow-x-auto"
        style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
      >
        {(["students", "yordam", "hamkorlik"] as Tab[]).map((k) => {
          const m = TAB_META[k];
          const Icon = m.icon;
          const isActive = tab === k;
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] transition-all shrink-0"
              style={{
                backgroundColor: isActive ? `${m.color}1a` : "transparent",
                color: isActive ? m.color : config.textMuted,
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[13px] font-semibold">{m.label}</span>
              <span
                className="h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{
                  backgroundColor: isActive ? `${m.color}33` : config.hover,
                  color: isActive ? m.color : config.textMuted,
                }}
              >
                {counts[k]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div>
        {tab === "students" && <StudentsTab config={config} isLight={isLight} centers={centers} loading={loadingStudents} />}
        {tab === "yordam" && <HelpTab config={config} isLight={isLight} helpLeads={helpLeads} setHelpLeads={setHelpLeads} loading={loadingHelp} />}
        {tab === "hamkorlik" && <PartnerTab config={config} isLight={isLight} partnerLeads={partnerLeads} setPartnerLeads={setPartnerLeads} loading={loadingPartner} />}
      </div>
    </div>
  );
}

// ==================== STUDENTS TAB ====================

type DatePreset = "bugun" | "7" | "30" | "this_month" | "specific_month" | "all" | "custom";
const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: "bugun", label: "Bugun" },
  { id: "7", label: "7 kun" },
  { id: "30", label: "30 kun" },
  { id: "this_month", label: "Bu oy" },
  { id: "all", label: "Barchasi" },
];

const UZ_MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
function formatYearMonth(ym: string): string {
  // "2026-06" → "Iyun 2026"
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  return `${UZ_MONTHS[m - 1]} ${y}`;
}

function datePresetCutoff(p: DatePreset, customFrom?: string, customTo?: string, specificMonth?: string): { from?: Date; to?: Date } {
  const now = new Date();
  if (p === "all") return {};
  if (p === "bugun") {
    const from = new Date(now); from.setHours(0, 0, 0, 0);
    return { from };
  }
  if (p === "7") return { from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
  if (p === "30") return { from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
  if (p === "this_month") {
    return { from: new Date(now.getFullYear(), now.getMonth(), 1) };
  }
  if (p === "specific_month" && specificMonth) {
    // YYYY-MM format → birinchi va oxirgi kun
    const [y, m] = specificMonth.split("-").map(Number);
    return {
      from: new Date(y, m - 1, 1, 0, 0, 0),
      to: new Date(y, m, 0, 23, 59, 59), // oxirgi kun (day=0 of next month)
    };
  }
  if (p === "custom") {
    return {
      from: customFrom ? new Date(customFrom + "T00:00:00") : undefined,
      to: customTo ? new Date(customTo + "T23:59:59") : undefined,
    };
  }
  return {};
}

// ==================== REUSABLE FILTER COMPONENTS ====================

type ThemeConfig = ReturnType<typeof useAdminTheme>["config"];

// Date filter button + popover (preset + oy picker + custom range)
function DateFilter({
  datePreset, setDatePreset,
  customFrom, setCustomFrom,
  customTo, setCustomTo,
  specificMonth, setSpecificMonth,
  config, isLight,
}: {
  datePreset: DatePreset;
  setDatePreset: (p: DatePreset) => void;
  customFrom: string;
  setCustomFrom: (s: string) => void;
  customTo: string;
  setCustomTo: (s: string) => void;
  specificMonth: string;
  setSpecificMonth: (s: string) => void;
  config: ThemeConfig;
  isLight: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [monthGridOpen, setMonthGridOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState<number>(new Date().getFullYear());
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="h-10 px-3 rounded-[12px] text-[12.5px] font-semibold flex items-center gap-2 transition-colors"
        style={{
          backgroundColor: datePreset !== "30" ? "#3b82f622" : config.surface,
          color: datePreset !== "30" ? "#3b82f6" : config.text,
          border: `1px solid ${datePreset !== "30" ? "#3b82f640" : config.surfaceBorder}`,
        }}
      >
        <Calendar className="w-4 h-4" />
        {datePreset === "custom"
          ? customFrom && customTo ? `${customFrom.slice(5)} — ${customTo.slice(5)}` : "Sana tanlash"
          : datePreset === "specific_month" && specificMonth ? formatYearMonth(specificMonth)
          : DATE_PRESETS.find(p => p.id === datePreset)?.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-12 left-0 z-30 rounded-[14px] p-3 min-w-[300px] shadow-xl" style={{ backgroundColor: isLight ? "#fff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Tezkor tanlov</p>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {DATE_PRESETS.filter(p => p.id !== "all").map(p => (
              <button
                key={p.id}
                onClick={() => { setDatePreset(p.id); setOpen(false); }}
                className="h-9 px-3 rounded-[10px] text-[12.5px] font-semibold transition-colors"
                style={{
                  backgroundColor: datePreset === p.id ? "#3b82f6" : config.hover,
                  color: datePreset === p.id ? "#fff" : config.text,
                }}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                if (specificMonth) {
                  const [y] = specificMonth.split("-").map(Number);
                  setPickerYear(y);
                }
                setMonthGridOpen(o => !o);
              }}
              className="h-9 px-3 rounded-[10px] text-[12.5px] font-semibold flex items-center justify-between gap-1 transition-colors"
              style={{
                backgroundColor: datePreset === "specific_month" ? "#3b82f6" : config.hover,
                color: datePreset === "specific_month" ? "#fff" : config.text,
              }}
            >
              <span className="truncate">
                {datePreset === "specific_month" && specificMonth ? formatYearMonth(specificMonth) : "Oy tanlash"}
              </span>
              <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${monthGridOpen ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={() => { setDatePreset("all"); setOpen(false); setMonthGridOpen(false); }}
              className="h-9 px-3 rounded-[10px] text-[12.5px] font-semibold transition-colors"
              style={{
                backgroundColor: datePreset === "all" ? "#3b82f6" : config.hover,
                color: datePreset === "all" ? "#fff" : config.text,
              }}
            >
              Barchasi
            </button>
          </div>
          {monthGridOpen && (
            <div className="mb-3 rounded-[12px] p-3" style={{ backgroundColor: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", border: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-center justify-between mb-3">
                <button type="button" onClick={() => setPickerYear(y => y - 1)} className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                  style={{ color: config.text, backgroundColor: isLight ? "#ffffff" : "rgba(255,255,255,0.08)", border: `1px solid ${config.surfaceBorder}` }}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[15px] font-bold" style={{ color: config.text }}>{pickerYear}</span>
                <button type="button" onClick={() => setPickerYear(y => y + 1)} disabled={pickerYear >= new Date().getFullYear()}
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ color: config.text, backgroundColor: isLight ? "#ffffff" : "rgba(255,255,255,0.08)", border: `1px solid ${config.surfaceBorder}` }}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {UZ_MONTHS.map((label, idx) => {
                  const m = idx + 1;
                  const ym = `${pickerYear}-${String(m).padStart(2, "0")}`;
                  const isSelected = specificMonth === ym && datePreset === "specific_month";
                  const now = new Date();
                  const isFuture = pickerYear === now.getFullYear() && m > now.getMonth() + 1;
                  return (
                    <button key={m} type="button" disabled={isFuture}
                      onClick={() => { setSpecificMonth(ym); setDatePreset("specific_month"); setMonthGridOpen(false); setOpen(false); }}
                      className="h-10 rounded-[8px] text-[12.5px] font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: isSelected ? "#3b82f6" : isLight ? "#ffffff" : "rgba(255,255,255,0.08)",
                        color: isSelected ? "#ffffff" : config.text,
                        border: `1px solid ${isSelected ? "#3b82f6" : isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"}`,
                      }}>
                      {label.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div style={{ borderTop: `1px solid ${config.surfaceBorder}` }} className="pt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Yoki aniq sana oraliq</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <label className="text-[10px] mb-1 block" style={{ color: config.textMuted }}>Boshlanish</label>
                <input type="date" value={customFrom}
                  onChange={e => { setCustomFrom(e.target.value); setDatePreset("custom"); }}
                  className="w-full h-9 px-2 rounded-[8px] text-[12px] focus:outline-none"
                  style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              </div>
              <div className="flex-1">
                <label className="text-[10px] mb-1 block" style={{ color: config.textMuted }}>Tugash</label>
                <input type="date" value={customTo}
                  onChange={e => { setCustomTo(e.target.value); setDatePreset("custom"); }}
                  className="w-full h-9 px-2 rounded-[8px] text-[12px] focus:outline-none"
                  style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              disabled={datePreset === "custom" && (!customFrom || !customTo)}
              className="w-full h-9 rounded-[10px] text-[12.5px] font-semibold transition-colors"
              style={{
                backgroundColor: datePreset === "custom" && customFrom && customTo ? "#3b82f6" : config.hover,
                color: datePreset === "custom" && customFrom && customTo ? "#fff" : config.textMuted,
              }}>
              Qo&apos;llash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Generic single-select dropdown with optional search
function SelectFilter<T extends string | number>({
  value, onChange, options, allLabel, placeholder, color, icon: Icon, withSearch,
  config, isLight,
}: {
  value: T | "all";
  onChange: (v: T | "all") => void;
  options: { value: T; label: string }[];
  allLabel: string;
  placeholder: string;
  color: string; // hex eg "#10b981"
  icon: React.ComponentType<{ className?: string }>;
  withSearch?: boolean;
  config: ThemeConfig;
  isLight: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!open) setSearch(""); }, [open]);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const selectedLabel = value === "all" ? placeholder : (options.find(o => o.value === value)?.label ?? String(value));
  const filtered = withSearch && search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="h-10 px-3 rounded-[12px] text-[12.5px] font-semibold flex items-center gap-2 transition-colors"
        style={{
          backgroundColor: value !== "all" ? `${color}22` : config.surface,
          color: value !== "all" ? color : config.text,
          border: `1px solid ${value !== "all" ? `${color}40` : config.surfaceBorder}`,
        }}
      >
        <Icon className="w-4 h-4" />
        <span className="truncate max-w-[140px]">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`absolute top-12 left-0 z-30 rounded-[12px] shadow-xl overflow-hidden ${withSearch ? "min-w-[260px]" : "min-w-[200px]"}`}
          style={{ backgroundColor: isLight ? "#fff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
          {withSearch && (
            <div className="p-2" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: config.textDim }} />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={`${placeholder} qidirish...`}
                  className="w-full h-9 pl-8 pr-3 rounded-[8px] text-[12.5px] focus:outline-none"
                  style={{ backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)", border: `1px solid ${config.surfaceBorder}`, color: config.text }}
                />
              </div>
            </div>
          )}
          <div className="p-2 max-h-[260px] overflow-y-auto">
            <button
              onClick={() => { onChange("all"); setOpen(false); }}
              className="w-full h-9 px-3 rounded-[8px] text-[12.5px] text-left transition-colors"
              style={{ backgroundColor: value === "all" ? `${color}22` : "transparent", color: value === "all" ? color : config.text }}
            >
              {allLabel} ({options.length})
            </button>
            {filtered.length === 0 ? (
              <p className="text-[12px] py-3 px-3 text-center" style={{ color: config.textMuted }}>Topilmadi</p>
            ) : (
              filtered.map(o => (
                <button
                  key={String(o.value)}
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  className="w-full h-9 px-3 rounded-[8px] text-[12.5px] text-left truncate transition-colors"
                  style={{ backgroundColor: value === o.value ? `${color}22` : "transparent", color: value === o.value ? color : config.text }}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Search-first filter bar wrapper
function FilterBar({
  search, setSearch, placeholder, totalCount, activeFiltersCount, onClear, config, children,
}: {
  search: string;
  setSearch: (s: string) => void;
  placeholder: string;
  totalCount: number;
  activeFiltersCount: number;
  onClear: () => void;
  config: ThemeConfig;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="rounded-[20px] p-1.5 flex items-center gap-2" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <Search className="w-5 h-5 ml-3" style={{ color: config.textMuted }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={placeholder}
          className="flex-1 h-12 px-2 text-[15px] focus:outline-none bg-transparent" style={{ color: config.text }} />
        <span className="text-[12px] mr-2" style={{ color: config.textDim }}>{totalCount} ta</span>
        {activeFiltersCount > 0 && (
          <button onClick={onClear} className="h-10 px-3 rounded-[14px] text-[12px] font-semibold flex items-center gap-1" style={{ backgroundColor: config.hover, color: config.text }}>
            <X className="w-3 h-3" /> {activeFiltersCount}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {children}
      </div>
    </div>
  );
}

function StudentsTab({ config, isLight, centers, loading }: { config: ReturnType<typeof useAdminTheme>["config"]; isLight: boolean; centers: CenterGroup[]; loading: boolean }) {
  const [openCenter, setOpenCenter] = useState<number | null>(null);
  const [openLead, setOpenLead] = useState<{ lead: StudentLead; center: CenterGroup } | null>(null);

  // ==================== FILTERLAR ====================
  const [datePreset, setDatePreset] = useState<DatePreset>("30");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  const [specificMonth, setSpecificMonth] = useState<string>(""); // YYYY-MM format
  // (Variants olib tashlandi: advancedOpen, openDropdown, dropdownSearch — reusable komponentlar o'zi boshqaradi)
  const [centerFilter, setCenterFilter] = useState<number | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (openCenter === null && centers.length > 0) {
      setOpenCenter(centers[0].id);
    }
  }, [centers, openCenter]);

  // Unique kategoriyalar va kurslar — filter dropdown'lar uchun
  const allCategories = Array.from(new Set(centers.map(c => c.category).filter(Boolean))).sort();
  const allCourses = Array.from(new Set(centers.flatMap(c => c.leads.map(l => l.course)).filter(Boolean))).sort();

  // Filter logika
  const { from, to } = datePresetCutoff(datePreset, customFrom, customTo, specificMonth);
  const q = search.toLowerCase().trim();
  const filtered = centers
    .filter(c => centerFilter === "all" || c.id === centerFilter)
    .filter(c => categoryFilter === "all" || c.category === categoryFilter)
    .map(c => {
      const filteredLeads = c.leads.filter(l => {
        const leadDate = new Date(l.time);
        if (from && leadDate < from) return false;
        if (to && leadDate > to) return false;
        if (courseFilter !== "all" && l.course !== courseFilter) return false;
        if (q && !l.name.toLowerCase().includes(q) && !l.phone.includes(search) && !l.course.toLowerCase().includes(q)) return false;
        return true;
      });
      return { ...c, _leads: filteredLeads };
    })
    .filter(c => c._leads.length > 0);

  const totalLeads = filtered.reduce((s, c) => s + c._leads.length, 0);
  const activeFiltersCount =
    (centerFilter !== "all" ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0) +
    (courseFilter !== "all" ? 1 : 0) +
    (q ? 1 : 0);

  // Tozalash funksiyasi (barcha variantlar ishlatadi)
  const clearAllFilters = () => {
    setCenterFilter("all");
    setCategoryFilter("all");
    setCourseFilter("all");
    setSearch("");
    setDatePreset("30");
    setCustomFrom("");
    setCustomTo("");
    setSpecificMonth("");
  };

  return (
    <div>
      {/* SARLAVHA */}
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5" style={{ color: "#3b82f6" }} />
        <h2 className="text-[18px] font-bold" style={{ color: config.text }}>O&apos;quvchilar</h2>
        <span className="text-[12px]" style={{ color: config.textMuted }}>· {totalLeads} ta lead topildi</span>
      </div>

      {/* FILTER BAR */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder="Lid izlash: ism, telefon yoki kurs..."
        totalCount={totalLeads}
        activeFiltersCount={activeFiltersCount}
        onClear={clearAllFilters}
        config={config}
      >
        <DateFilter
          datePreset={datePreset} setDatePreset={setDatePreset}
          customFrom={customFrom} setCustomFrom={setCustomFrom}
          customTo={customTo} setCustomTo={setCustomTo}
          specificMonth={specificMonth} setSpecificMonth={setSpecificMonth}
          config={config} isLight={isLight}
        />
        <SelectFilter
          value={centerFilter}
          onChange={setCenterFilter}
          options={centers.map(c => ({ value: c.id, label: c.name }))}
          allLabel="Barchasi"
          placeholder="Markaz"
          color="#10b981"
          icon={Building2}
          withSearch
          config={config} isLight={isLight}
        />
        <SelectFilter
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={allCategories.map(c => ({ value: c, label: c }))}
          allLabel="Barchasi"
          placeholder="Yo'nalish"
          color="#a855f7"
          icon={MessageSquare}
          withSearch
          config={config} isLight={isLight}
        />
        <SelectFilter
          value={courseFilter}
          onChange={setCourseFilter}
          options={allCourses.map(c => ({ value: c, label: c }))}
          allLabel="Barchasi"
          placeholder="Kurs"
          color="#f97316"
          icon={UserIcon}
          withSearch
          config={config} isLight={isLight}
        />
      </FilterBar>

      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <GraduationCap className="w-10 h-10 mx-auto mb-3" style={{ color: config.textDim }} />
          <p className="text-[14px]" style={{ color: config.textMuted }}>Topilmadi</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(center => {
            const isOpen = openCenter === center.id;
            const leads = center._leads;
            return (
              <div key={center.id} className="rounded-[14px] overflow-hidden" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                <button
                  onClick={() => setOpenCenter(isOpen ? null : center.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
                  style={{ backgroundColor: isOpen ? config.hover : "transparent" }}
                >
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${config.accent}22` }}>
                    <Building2 className="w-4.5 h-4.5" style={{ color: config.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-semibold truncate" style={{ color: config.text }}>{center.name}</p>
                      <span className="text-[11px] px-1.5 h-[18px] rounded flex items-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>{center.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] mt-0.5" style={{ color: config.textMuted }}>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{center.city}</span>
                      <span>·</span>
                      <span>{center.totalLeads} ta jami</span>
                      <span>·</span>
                      <span style={{ color: "#22c55e" }}>+{center.boughtThisWeek} shu hafta</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 hidden md:block">
                    <p className="text-[18px] font-bold" style={{ color: config.text }}>{leads.length}</p>
                    <p className="text-[10px]" style={{ color: config.textDim }}>lead</p>
                  </div>
                  {isOpen
                    ? <ChevronDown className="w-4 h-4 shrink-0" style={{ color: config.textMuted }} />
                    : <ChevronRight className="w-4 h-4 shrink-0" style={{ color: config.textMuted }} />}
                </button>

                {isOpen && leads.length > 0 && (
                  <div style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
                    {leads.map((lead, idx) => {
                      const s = STUDENT_STATUS_MAP[lead.status];
                      return (
                        <button
                          key={lead.id}
                          onClick={() => setOpenLead({ lead, center })}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                          style={{ borderTop: idx > 0 ? `1px solid ${config.surfaceBorder}` : "none" }}
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(lead.name) }}>
                            {initials(lead.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold truncate" style={{ color: config.text }}>{lead.name}</p>
                            <p className="text-[11px] truncate" style={{ color: config.textMuted }}>{lead.phone} · {lead.course}</p>
                          </div>
                          <span className="text-[10px] px-2 h-[18px] rounded-full font-semibold shrink-0" style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.label}</span>
                          <span className="text-[11px] shrink-0 hidden md:inline" style={{ color: config.textDim }}>{timeAgo(lead.time)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {openLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenLead(null)} />
          <div className="relative rounded-[20px] w-full max-w-[480px] overflow-hidden" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="px-6 pt-5 pb-4 flex items-start justify-between" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[14px] font-bold text-white" style={{ backgroundColor: avatarColor(openLead.lead.name) }}>
                  {initials(openLead.lead.name)}
                </div>
                <div>
                  <h2 className="text-[17px] font-bold" style={{ color: config.text }}>{openLead.lead.name}</h2>
                  <p className="text-[12px] flex items-center gap-1" style={{ color: config.textMuted }}>
                    <Calendar className="w-3 h-3" />{timeAgo(openLead.lead.time)}
                  </p>
                </div>
              </div>
              <button onClick={() => setOpenLead(null)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <a href={`tel:${openLead.lead.phone}`} className="flex items-center gap-2 rounded-[12px] p-3" style={{ backgroundColor: config.hover, color: config.text }}>
                <Phone className="w-4 h-4" style={{ color: config.textMuted }} />
                <span className="text-[14px]">{openLead.lead.phone}</span>
              </a>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Qaysi markazga qoldirgan</p>
                <div className="rounded-[12px] p-3 flex items-center gap-3" style={{ backgroundColor: config.hover }}>
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: `${config.accent}22` }}>
                    <Building2 className="w-4 h-4" style={{ color: config.accent }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: config.text }}>{openLead.center.name}</p>
                    <p className="text-[11px]" style={{ color: config.textMuted }}>{openLead.center.city} · {openLead.center.category}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Qiziqgan kurs</p>
                <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                  <p className="text-[14px] font-semibold" style={{ color: config.text }}>{openLead.lead.course}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== HELP TAB ====================

function HelpTab({ config, isLight, helpLeads, setHelpLeads, loading }: { config: ReturnType<typeof useAdminTheme>["config"]; isLight: boolean; helpLeads: HelpLead[]; setHelpLeads: React.Dispatch<React.SetStateAction<HelpLead[]>>; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<HelpLead | null>(null);

  // Filterlar
  const [datePreset, setDatePreset] = useState<DatePreset>("30");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  const [specificMonth, setSpecificMonth] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<HelpStatus | "all">("all");
  const [interestFilter, setInterestFilter] = useState<string>("all");

  const allInterests = Array.from(new Set(helpLeads.map(l => l.interest).filter(Boolean))).sort();

  const { from, to } = datePresetCutoff(datePreset, customFrom, customTo, specificMonth);
  const q = search.toLowerCase();
  const filtered = helpLeads.filter(l => {
    const created = new Date(l.createdAt);
    if (from && created < from) return false;
    if (to && created > to) return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (interestFilter !== "all" && l.interest !== interestFilter) return false;
    if (q && !l.name.toLowerCase().includes(q) && !l.phone.includes(search) && !l.interest.toLowerCase().includes(q)) return false;
    return true;
  });

  const activeFiltersCount =
    (statusFilter !== "all" ? 1 : 0) +
    (interestFilter !== "all" ? 1 : 0) +
    (q ? 1 : 0);

  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setInterestFilter("all");
    setDatePreset("30");
    setCustomFrom("");
    setCustomTo("");
    setSpecificMonth("");
  };

  const handleStatus = async (lead: HelpLead, status: "answered" | "closed") => {
    const prev = helpLeads;
    setHelpLeads(list => list.map(l => l.id === lead.id ? { ...l, status } : l));
    setOpen({ ...lead, status });
    try {
      const r = await fetch(`/api/admin/leads/help/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error("Failed");
    } catch (e) {
      console.error(e);
      setHelpLeads(prev);
      setOpen(lead);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5" style={{ color: "#f59e0b" }} />
        <h2 className="text-[18px] font-bold" style={{ color: config.text }}>Yordam so&apos;rovlari</h2>
        <span className="text-[12px]" style={{ color: config.textMuted }}>· {filtered.length} ta topildi</span>
      </div>

      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder="Ism, telefon yoki yo'nalish..."
        totalCount={filtered.length}
        activeFiltersCount={activeFiltersCount}
        onClear={clearAllFilters}
        config={config}
      >
        <DateFilter
          datePreset={datePreset} setDatePreset={setDatePreset}
          customFrom={customFrom} setCustomFrom={setCustomFrom}
          customTo={customTo} setCustomTo={setCustomTo}
          specificMonth={specificMonth} setSpecificMonth={setSpecificMonth}
          config={config} isLight={isLight}
        />
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={(["new_req", "answered", "closed"] as HelpStatus[]).map(s => ({ value: s, label: HELP_STATUS_MAP[s].label }))}
          allLabel="Barchasi"
          placeholder="Status"
          color="#f59e0b"
          icon={Check}
          config={config} isLight={isLight}
        />
        {allInterests.length > 0 && (
          <SelectFilter
            value={interestFilter}
            onChange={setInterestFilter}
            options={allInterests.map(i => ({ value: i, label: i }))}
            allLabel="Barchasi"
            placeholder="Yo'nalish"
            color="#a855f7"
            icon={MessageSquare}
            withSearch
            config={config} isLight={isLight}
          />
        )}
      </FilterBar>

      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(l => {
            const s = HELP_STATUS_MAP[l.status];
            return (
              <button
                key={l.id}
                onClick={() => setOpen(l)}
                className="w-full rounded-[14px] p-4 text-left"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[12px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(l.name) }}>
                    {initials(l.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[14px] font-semibold" style={{ color: config.text }}>{l.name}</p>
                      <span className="h-[18px] px-2 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] mb-1" style={{ color: config.textMuted }}>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</span>
                      <span>·</span>
                      <span className="font-medium" style={{ color: config.text }}>{l.interest}</span>
                    </div>
                    {l.message && <p className="text-[12px] line-clamp-1" style={{ color: config.textDim }}>&ldquo;{l.message}&rdquo;</p>}
                  </div>
                  <span className="text-[11px] shrink-0" style={{ color: config.textDim }}>{timeAgo(l.createdAt)}</span>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
              <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: config.textDim }} />
              <p className="text-[14px]" style={{ color: config.textMuted }}>Topilmadi</p>
            </div>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(null)} />
          <div className="relative rounded-[20px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="px-6 pt-5 pb-4 flex items-start justify-between" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[14px] font-bold text-white" style={{ backgroundColor: avatarColor(open.name) }}>
                  {initials(open.name)}
                </div>
                <div>
                  <h2 className="text-[17px] font-bold" style={{ color: config.text }}>{open.name}</h2>
                  <p className="text-[12px]" style={{ color: config.textMuted }}>{timeAgo(open.createdAt)}</p>
                </div>
              </div>
              <button onClick={() => setOpen(null)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <a href={`tel:${open.phone}`} className="flex items-center gap-2 rounded-[12px] p-3" style={{ backgroundColor: config.hover, color: config.text }}>
                <Phone className="w-4 h-4" style={{ color: config.textMuted }} />
                <span className="text-[14px]">{open.phone}</span>
              </a>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Qiziqgan yo&apos;nalish</p>
                <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                  <p className="text-[14px] font-semibold" style={{ color: config.text }}>{open.interest}</p>
                </div>
              </div>
              {open.message && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Xabar</p>
                  <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                    <p className="text-[13px]" style={{ color: config.text }}>{open.message}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {open.status !== "answered" && open.status !== "closed" && (
                  <button
                    onClick={() => handleStatus(open, "answered")}
                    className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2"
                    style={{ backgroundColor: config.accent, color: config.accentText }}
                  >
                    <Send className="w-4 h-4" /> Javob berdim
                  </button>
                )}
                {open.status !== "closed" && (
                  <button
                    onClick={() => handleStatus(open, "closed")}
                    className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#ef444422", color: "#ef4444" }}
                  >
                    <X className="w-4 h-4" /> Yopish
                  </button>
                )}
                <button onClick={() => setOpen(null)} className="h-[44px] px-4 rounded-[10px] text-[13px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                  Bekor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PARTNER TAB ====================

function PartnerTab({ config, isLight, partnerLeads, setPartnerLeads, loading }: { config: ReturnType<typeof useAdminTheme>["config"]; isLight: boolean; partnerLeads: PartnerLead[]; setPartnerLeads: React.Dispatch<React.SetStateAction<PartnerLead[]>>; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<PartnerLead | null>(null);

  // Filterlar
  const [datePreset, setDatePreset] = useState<DatePreset>("30");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  const [specificMonth, setSpecificMonth] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<PartnerStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  const allCategories = Array.from(new Set(partnerLeads.map(l => l.category).filter(Boolean))).sort();
  const allCities = Array.from(new Set(partnerLeads.map(l => l.city).filter(Boolean))).sort();

  const { from, to } = datePresetCutoff(datePreset, customFrom, customTo, specificMonth);
  const q = search.toLowerCase();
  const filtered = partnerLeads.filter(l => {
    const created = new Date(l.createdAt);
    if (from && created < from) return false;
    if (to && created > to) return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (categoryFilter !== "all" && l.category !== categoryFilter) return false;
    if (cityFilter !== "all" && l.city !== cityFilter) return false;
    if (q && !l.name.toLowerCase().includes(q) && !l.phone.includes(search) && !l.centerName.toLowerCase().includes(q)) return false;
    return true;
  });

  const activeFiltersCount =
    (statusFilter !== "all" ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0) +
    (cityFilter !== "all" ? 1 : 0) +
    (q ? 1 : 0);

  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setCityFilter("all");
    setDatePreset("30");
    setCustomFrom("");
    setCustomTo("");
    setSpecificMonth("");
  };

  const updateStatus = async (lead: PartnerLead, status: PartnerStatus) => {
    const prev = partnerLeads;
    // Optimistic
    setPartnerLeads(list => list.map(l => l.id === lead.id ? { ...l, status } : l));
    setOpen(null);
    try {
      const r = await fetch(`/api/admin/leads/partner/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error("Failed");
    } catch (e) {
      console.error(e);
      setPartnerLeads(prev); // rollback
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Handshake className="w-5 h-5" style={{ color: "#22c55e" }} />
        <h2 className="text-[18px] font-bold" style={{ color: config.text }}>Hamkorlik arizalari</h2>
        <span className="text-[12px]" style={{ color: config.textMuted }}>· {filtered.length} ta topildi</span>
      </div>

      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder="Ism, telefon yoki markaz nomi..."
        totalCount={filtered.length}
        activeFiltersCount={activeFiltersCount}
        onClear={clearAllFilters}
        config={config}
      >
        <DateFilter
          datePreset={datePreset} setDatePreset={setDatePreset}
          customFrom={customFrom} setCustomFrom={setCustomFrom}
          customTo={customTo} setCustomTo={setCustomTo}
          specificMonth={specificMonth} setSpecificMonth={setSpecificMonth}
          config={config} isLight={isLight}
        />
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={(["new_app", "in_progress", "accepted", "rejected"] as PartnerStatus[]).map(s => ({ value: s, label: PARTNER_STATUS_MAP[s].label }))}
          allLabel="Barchasi"
          placeholder="Status"
          color="#22c55e"
          icon={Check}
          config={config} isLight={isLight}
        />
        {allCategories.length > 0 && (
          <SelectFilter
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={allCategories.map(c => ({ value: c, label: c }))}
            allLabel="Barchasi"
            placeholder="Yo'nalish"
            color="#a855f7"
            icon={MessageSquare}
            withSearch
            config={config} isLight={isLight}
          />
        )}
        {allCities.length > 0 && (
          <SelectFilter
            value={cityFilter}
            onChange={setCityFilter}
            options={allCities.map(c => ({ value: c, label: c }))}
            allLabel="Barchasi"
            placeholder="Shahar"
            color="#0ea5e9"
            icon={MapPin}
            withSearch
            config={config} isLight={isLight}
          />
        )}
      </FilterBar>

      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(l => {
            const s = PARTNER_STATUS_MAP[l.status];
            return (
              <button
                key={l.id}
                onClick={() => setOpen(l)}
                className="w-full rounded-[14px] p-4 text-left"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${config.accent}22` }}>
                    <Building2 className="w-5 h-5" style={{ color: config.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[14px] font-semibold" style={{ color: config.text }}>{l.centerName}</p>
                      <span className="h-[18px] px-2 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] flex-wrap mb-1" style={{ color: config.textMuted }}>
                      <span>{l.category}</span>
                      <span>·</span>
                      <span>{l.city}</span>
                      <span>·</span>
                      <span>{l.studentsCount} o&apos;quvchi</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]" style={{ color: config.textDim }}>
                      <UserIcon className="w-3 h-3" />
                      <span>{l.name}</span>
                      <span>·</span>
                      <span>{l.phone}</span>
                    </div>
                  </div>
                  <span className="text-[11px] shrink-0" style={{ color: config.textDim }}>{timeAgo(l.createdAt)}</span>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
              <Handshake className="w-10 h-10 mx-auto mb-3" style={{ color: config.textDim }} />
              <p className="text-[14px]" style={{ color: config.textMuted }}>Topilmadi</p>
            </div>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(null)} />
          <div className="relative rounded-[20px] w-full max-w-[540px] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="px-6 pt-5 pb-4 flex items-start justify-between" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: `${config.accent}22` }}>
                  <Building2 className="w-6 h-6" style={{ color: config.accent }} />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold" style={{ color: config.text }}>{open.centerName}</h2>
                  <p className="text-[12px]" style={{ color: config.textMuted }}>{open.category} · {open.city}</p>
                </div>
              </div>
              <button onClick={() => setOpen(null)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Mas&apos;ul shaxs</p>
                <div className="rounded-[12px] p-4 flex items-center gap-3" style={{ backgroundColor: config.hover }}>
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[12px] font-bold text-white" style={{ backgroundColor: avatarColor(open.name) }}>
                    {initials(open.name)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: config.text }}>{open.name}</p>
                    <p className="text-[12px]" style={{ color: config.textMuted }}>{open.phone}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${open.phone}`} className="rounded-[12px] p-3 flex items-center gap-2" style={{ backgroundColor: config.hover, color: config.text }}>
                  <Phone className="w-4 h-4" style={{ color: config.textMuted }} />
                  <span className="text-[13px]">Qo&apos;ng&apos;iroq</span>
                </a>
                {open.telegram && (
                  <a href={`https://t.me/${open.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="rounded-[12px] p-3 flex items-center gap-2" style={{ backgroundColor: config.hover, color: config.text }}>
                    <Send className="w-4 h-4" style={{ color: config.textMuted }} />
                    <span className="text-[13px]">{open.telegram}</span>
                  </a>
                )}
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Markaz haqida</p>
                <div className="rounded-[12px] p-4 space-y-2" style={{ backgroundColor: config.hover }}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span style={{ color: config.textMuted }}>Yo&apos;nalish</span>
                    <span className="font-semibold" style={{ color: config.text }}>{open.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span style={{ color: config.textMuted }}>Shahar</span>
                    <span className="font-semibold" style={{ color: config.text }}>{open.city}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span style={{ color: config.textMuted }}>O&apos;quvchilar</span>
                    <span className="font-semibold" style={{ color: config.text }}>{open.studentsCount}</span>
                  </div>
                </div>
              </div>

              {open.message && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Xabar</p>
                  <div className="rounded-[12px] p-4" style={{ backgroundColor: config.hover }}>
                    <p className="text-[13px]" style={{ color: config.text }}>{open.message}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                {open.status === "new_app" && (
                  <button
                    onClick={() => updateStatus(open, "in_progress")}
                    className="w-full h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#f59e0b22", color: "#f59e0b" }}
                  >
                    Jarayonga olish
                  </button>
                )}
                <div className="flex gap-2">
                  {open.status !== "accepted" && (
                    <button
                      onClick={() => updateStatus(open, "accepted")}
                      className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#22c55e", color: "#ffffff" }}
                    >
                      <Check className="w-4 h-4" /> Qabul qilish
                    </button>
                  )}
                  {open.status !== "rejected" && (
                    <button
                      onClick={() => updateStatus(open, "rejected")}
                      className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
                    >
                      <X className="w-4 h-4" /> Rad etish
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense>
      <AdminLeadsContent />
    </Suspense>
  );
}
