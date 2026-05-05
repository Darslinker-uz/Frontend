"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  TrendingDown, Users, FileText, CreditCard, Zap, Eye, MessageSquare,
  ArrowUpRight, ArrowDownRight, Building2, Crown, Award, Calendar,
  ChevronDown, Check, BarChart3, Tags, Filter, Activity, Target, Rocket,
} from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";
import { ListingsTab } from "./_tabs/listings";
import { CentersTab } from "./_tabs/centers";
import { CategoriesTab } from "./_tabs/categories";
import { FunnelTab } from "./_tabs/funnel";
import { LeadsTab } from "./_tabs/leads";
import { BoostTab } from "./_tabs/boost";

type TabId = "umumiy" | "listings" | "centers" | "categories" | "funnel" | "leads" | "boost";

const TABS: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: "umumiy", label: "Umumiy", icon: BarChart3 },
  { id: "listings", label: "E'lonlar", icon: FileText },
  { id: "centers", label: "Markazlar", icon: Building2 },
  { id: "categories", label: "Yo'nalishlar", icon: Tags },
  { id: "funnel", label: "Konversiya", icon: Filter },
  { id: "leads", label: "Lead sifati", icon: Target },
  { id: "boost", label: "Boost ROI", icon: Rocket },
];

type PeriodId = "1d" | "7d" | "30d" | "90d" | "apr" | "mar" | "feb" | "yan" | "dek" | "noy";
type PeriodKind = "preset" | "month";

const PERIODS: { id: PeriodId; label: string; kind: PeriodKind }[] = [
  { id: "1d", label: "1 kun", kind: "preset" },
  { id: "7d", label: "7 kun", kind: "preset" },
  { id: "30d", label: "30 kun", kind: "preset" },
  { id: "90d", label: "90 kun", kind: "preset" },
  { id: "apr", label: "Aprel 2026", kind: "month" },
  { id: "mar", label: "Mart 2026", kind: "month" },
  { id: "feb", label: "Fevral 2026", kind: "month" },
  { id: "yan", label: "Yanvar 2026", kind: "month" },
  { id: "dek", label: "Dekabr 2025", kind: "month" },
  { id: "noy", label: "Noyabr 2025", kind: "month" },
];

interface KpiRow {
  revenue: number; views: number; uniqueVisitors: number; leads: number; users: number; listings: number;
  revenueDelta: number; viewsDelta: number; leadsDelta: number; usersDelta: number; listingsDelta: number;
}

interface RevenueMonthRow { label: string; balance: number; boost: number; leads: number }
interface UserGrowthRow { label: string; teachers: number; students: number }
interface CategoryRow { name: string; color: string; listings: number; leads: number; revenue: number }
interface CenterRow { name: string; listings: number; leads: number; boosts: number; revenue: number }
interface FunnelRow { label: string; count: number; pct: number }
interface TrafficRow { label: string; value: number; color: string }

interface AnalyticsResponse {
  kpi: KpiRow;
  revenueByMonth: RevenueMonthRow[];
  userGrowth: UserGrowthRow[];
  topCategories: CategoryRow[];
  topCenters: CenterRow[];
  trafficSources: TrafficRow[];
  conversionFunnel: FunnelRow[];
}

const EMPTY_KPI: KpiRow = {
  revenue: 0, views: 0, uniqueVisitors: 0, leads: 0, users: 0, listings: 0,
  revenueDelta: 0, viewsDelta: 0, leadsDelta: 0, usersDelta: 0, listingsDelta: 0,
};

const EMPTY_DATA: AnalyticsResponse = {
  kpi: EMPTY_KPI,
  revenueByMonth: [],
  userGrowth: [],
  topCategories: [],
  topCenters: [],
  trafficSources: [],
  conversionFunnel: [],
};

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n);

export default function AdminAnalyticsPage() {
  const { config } = useAdminTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabId | null;
  const tab: TabId = tabParam && TABS.some(t => t.id === tabParam) ? tabParam : "umumiy";
  const setTab = (next: TabId) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (next === "umumiy") sp.delete("tab");
    else sp.set("tab", next);
    router.push(`/admode/analytics${sp.toString() ? `?${sp.toString()}` : ""}`);
  };

  const [period, setPeriod] = useState<PeriodId>("30d");
  const [monthOpen, setMonthOpen] = useState(false);
  const [data, setData] = useState<AnalyticsResponse>(EMPTY_DATA);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (tab !== "umumiy") return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/admin/analytics?period=${period}`);
        if (!res.ok) throw new Error("Failed to load analytics");
        const json: AnalyticsResponse = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) { console.error(e); setData(EMPTY_DATA); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [period, tab]);

  const kpi = data.kpi;
  const activeMeta = PERIODS.find(p => p.id === period)!;
  const months = PERIODS.filter(p => p.kind === "month");

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: config.text }}>Analytics</h1>
            <p className="mt-1 text-sm" style={{ color: config.textMuted }}>Platforma ko&apos;rsatkichlari · {activeMeta.label}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
              {(["1d", "7d", "30d", "90d"] as PeriodId[]).map(p => {
                const meta = PERIODS.find(x => x.id === p)!;
                const isActive = period === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className="h-8 px-3 rounded-md text-[12px] font-medium transition-all"
                    style={{ backgroundColor: isActive ? config.accent : "transparent", color: isActive ? config.accentText : config.textMuted }}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <button
                onClick={() => setMonthOpen(!monthOpen)}
                className="flex items-center gap-2 h-10 px-3 rounded-lg text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: activeMeta.kind === "month" ? `${config.accent}14` : config.surface,
                  border: `1px solid ${activeMeta.kind === "month" ? config.accent : config.surfaceBorder}`,
                  color: activeMeta.kind === "month" ? config.accent : config.text,
                }}
              >
                <Calendar className="w-3.5 h-3.5" />
                {activeMeta.kind === "month" ? activeMeta.label : "Oy bo'yicha"}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {monthOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMonthOpen(false)} />
                  <div className="absolute top-11 right-0 z-20 w-48 rounded-lg py-1.5 shadow-xl" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                    {months.map(m => {
                      const isActive = period === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => { setPeriod(m.id); setMonthOpen(false); }}
                          className="w-full flex items-center justify-between h-9 px-3 text-[13px] transition-colors"
                          style={{ color: isActive ? config.accent : config.text }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = config.hover}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          {m.label}
                          {isActive && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {TABS.map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="shrink-0 h-9 px-3.5 rounded-lg text-[12.5px] font-medium transition-all flex items-center gap-1.5"
                style={{
                  backgroundColor: active ? config.accent : config.surface,
                  color: active ? config.accentText : config.textMuted,
                  border: `1px solid ${active ? config.accent : config.surfaceBorder}`,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB: Umumiy */}
        {tab === "umumiy" && (
        <>
        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
          <KpiCard label="Daromad" value={`${(kpi.revenue / 1000000).toFixed(1)}M`} unit="so'm" delta={kpi.revenueDelta} icon={CreditCard} color="#22c55e" config={config} />
          <KpiCard label="Sayt ko'rishi" value={fmt(kpi.views)} unit={`${fmt(kpi.uniqueVisitors)} unique`} delta={kpi.viewsDelta} icon={Eye} color="#06b6d4" config={config} />
          <KpiCard label="Leadlar" value={fmt(kpi.leads)} unit="ta" delta={kpi.leadsDelta} icon={MessageSquare} color="#3b82f6" config={config} />
          <KpiCard label="Yangi user" value={fmt(kpi.users)} unit="ta" delta={kpi.usersDelta} icon={Users} color="#f59e0b" config={config} />
          <KpiCard label="Yangi e'lonlar" value={fmt(kpi.listings)} unit="ta" delta={kpi.listingsDelta} icon={FileText} color="#ec4899" config={config} />
        </div>

        {/* REVENUE CHART + TRAFFIC */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mb-6">
          <div className="rounded-[14px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <RevenueChart data={data.revenueByMonth} config={config} />
          </div>

          <div className="rounded-[14px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <h3 className="text-[15px] font-bold mb-1" style={{ color: config.text }}>Trafik manbalari</h3>
            <p className="text-[12px] mb-5" style={{ color: config.textMuted }}>Foizlarda</p>
            <DonutChart data={data.trafficSources} config={config} />
          </div>
        </div>

        {/* USER GROWTH + CONVERSION FUNNEL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="rounded-[14px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-bold" style={{ color: config.text }}>Foydalanuvchilar o&apos;sishi</h3>
                <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>Oylik qo&apos;shilish</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <LegendDot color="#8b5cf6" label="Markaz" />
                <LegendDot color="#06b6d4" label="O'quvchi" />
              </div>
            </div>
            <LineChart data={data.userGrowth} config={config} />
          </div>

          <div className="rounded-[14px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <h3 className="text-[15px] font-bold mb-1" style={{ color: config.text }}>Konversiya voronkasi</h3>
            <p className="text-[12px] mb-5" style={{ color: config.textMuted }}>E&apos;londan sotib olishgacha</p>
            <FunnelChart data={data.conversionFunnel} config={config} />
          </div>
        </div>

        {/* TOP CATEGORIES + TOP CENTERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="rounded-[14px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <h3 className="text-[15px] font-bold mb-1" style={{ color: config.text }}>Eng ko&apos;p talab — kategoriyalar</h3>
            <p className="text-[12px] mb-4" style={{ color: config.textMuted }}>Leadlar soni bo&apos;yicha</p>
            <div className="space-y-3">
              {data.topCategories.map(c => {
                const maxLeads = Math.max(...data.topCategories.map(x => x.leads));
                const pct = (c.leads / maxLeads) * 100;
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-[13px] font-medium truncate" style={{ color: config.text }}>{c.name}</span>
                        <span className="text-[11px] shrink-0" style={{ color: config.textDim }}>· {c.listings} e&apos;lon</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[12px] font-semibold" style={{ color: "#22c55e" }}>{c.leads}L</span>
                        <span className="text-[12px] font-bold tabular-nums" style={{ color: config.text }}>{c.revenue}M</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: config.hover }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[14px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <h3 className="text-[15px] font-bold mb-1" style={{ color: config.text }}>Top markazlar</h3>
            <p className="text-[12px] mb-4" style={{ color: config.textMuted }}>Daromad bo&apos;yicha</p>
            <div className="space-y-2">
              {data.topCenters.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ backgroundColor: config.hover }}>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center text-[12px] font-bold" style={{ backgroundColor: i < 3 ? `${config.accent}22` : config.surfaceBorder, color: i < 3 ? config.accent : config.textMuted }}>
                    {i + 1}
                  </div>
                  <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${config.accent}14` }}>
                    <Building2 className="w-4 h-4" style={{ color: config.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: config.text }}>{c.name}</p>
                    <p className="text-[11px]" style={{ color: config.textMuted }}>
                      {c.listings} e&apos;lon · {c.leads} lead · {c.boosts} boost
                    </p>
                  </div>
                  <p className="text-[14px] font-bold tabular-nums shrink-0" style={{ color: config.text }}>{c.revenue}M</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOOST ROI + OTHER METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-[14px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4" style={{ color: "#f59e0b" }} />
              <h3 className="text-[14px] font-bold" style={{ color: config.text }}>A class boost</h3>
            </div>
            <p className="text-[11px] mb-4" style={{ color: config.textMuted }}>Samaradorlik</p>
            <MetricRow label="Aktiv" value="24 ta" config={config} />
            <MetricRow label="O'rtacha ko'rish" value="3,240" config={config} />
            <MetricRow label="O'rtacha lead" value="28 ta" config={config} color="#22c55e" />
            <MetricRow label="CPL" value="36k so'm" config={config} />
            <MetricRow label="ROI" value="+142%" config={config} color="#22c55e" last />
          </div>

          <div className="rounded-[14px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4" style={{ color: "#3b82f6" }} />
              <h3 className="text-[14px] font-bold" style={{ color: config.text }}>B class boost</h3>
            </div>
            <p className="text-[11px] mb-4" style={{ color: config.textMuted }}>Samaradorlik</p>
            <MetricRow label="Aktiv" value="18 ta" config={config} />
            <MetricRow label="O'rtacha ko'rish" value="1,820" config={config} />
            <MetricRow label="O'rtacha lead" value="14 ta" config={config} color="#22c55e" />
            <MetricRow label="CPL" value="50k so'm" config={config} />
            <MetricRow label="ROI" value="+96%" config={config} color="#22c55e" last />
          </div>

          <div className="rounded-[14px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" style={{ color: config.accent }} />
              <h3 className="text-[14px] font-bold" style={{ color: config.text }}>Faollik</h3>
            </div>
            <p className="text-[11px] mb-4" style={{ color: config.textMuted }}>Bugungi</p>
            <MetricRow label="Sayt tashrifi" value="4,820" config={config} icon={Eye} />
            <MetricRow label="Yangi lead" value="42" config={config} icon={MessageSquare} color="#22c55e" />
            <MetricRow label="Yangi boost" value="6" config={config} icon={Zap} color="#f59e0b" />
            <MetricRow label="To'lovlar" value="28" config={config} icon={CreditCard} />
            <MetricRow label="Aktiv markaz" value="94" config={config} icon={Building2} last />
          </div>
        </div>
        </>
        )}

        {tab === "listings" && <ListingsTab period={period} />}
        {tab === "centers" && <CentersTab period={period} />}
        {tab === "categories" && <CategoriesTab period={period} />}
        {tab === "funnel" && <FunnelTab period={period} />}
        {tab === "leads" && <LeadsTab period={period} />}
        {tab === "boost" && <BoostTab period={period} />}
      </div>
    </div>
  );
}

// ==================== COMPONENTS ====================

type Cfg = ReturnType<typeof useAdminTheme>["config"];

function KpiCard({ label, value, unit, delta, icon: Icon, color, config }: {
  label: string; value: string; unit: string; delta: number; icon: typeof Users; color: string; config: Cfg;
}) {
  const positive = delta >= 0;
  return (
    <div className="p-4 md:p-5 rounded-xl" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div
          className="inline-flex items-center gap-0.5 h-5 px-1.5 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: positive ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.14)", color: positive ? "#22c55e" : "#ef4444" }}
        >
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {positive ? "+" : ""}{delta}%
        </div>
      </div>
      <div className="text-[12px] font-medium mb-1" style={{ color: config.textMuted }}>{label}</div>
      <div className="flex items-baseline gap-1">
        <div className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: config.text }}>{value}</div>
        <div className="text-[11px]" style={{ color: config.textDim }}>{unit}</div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function RevenueChart({ data, config }: { data: RevenueMonthRow[]; config: Cfg }) {
  if (!data.length) return <p className="text-[13px]" style={{ color: config.textMuted }}>Ma&apos;lumot yo&apos;q</p>;
  const [hover, setHover] = useState<number | null>(null);
  const totals = data.map(d => d.balance + d.boost + d.leads);
  const rawMax = Math.max(...totals);
  // round up to nearest 10
  const max = Math.ceil(rawMax / 10) * 10;
  const ticks = [0, max / 4, max / 2, (max * 3) / 4, max];

  const currentTotal = totals[totals.length - 1];
  const prevTotal = totals[totals.length - 2];
  const deltaPct = ((currentTotal - prevTotal) / prevTotal) * 100;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <h3 className="text-[15px] font-bold" style={{ color: config.text }}>Daromad dinamikasi</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[28px] font-bold tracking-tight" style={{ color: config.text }}>{currentTotal.toFixed(1)}M</span>
            <span className="text-[12px]" style={{ color: config.textMuted }}>so&apos;m · {data[data.length - 1].label}</span>
            <span
              className="inline-flex items-center gap-0.5 h-5 px-1.5 rounded-full text-[10px] font-bold ml-1"
              style={{ backgroundColor: deltaPct >= 0 ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.14)", color: deltaPct >= 0 ? "#22c55e" : "#ef4444" }}
            >
              {deltaPct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {deltaPct >= 0 ? "+" : ""}{deltaPct.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <LegendDot color="#3b82f6" label="Balans" />
          <LegendDot color="#f59e0b" label="Boost" />
          <LegendDot color="#22c55e" label="Leadlar" />
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: "240px" }}>
        {/* Y-axis ticks + gridlines */}
        <div className="absolute inset-0 pl-10">
          {ticks.slice().reverse().map(t => (
            <div key={t} className="absolute left-10 right-0 border-t" style={{ top: `${((max - t) / max) * 100}%`, borderColor: config.surfaceBorder, borderStyle: t === 0 ? "solid" : "dashed" }} />
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-10 flex flex-col justify-between py-0">
          {ticks.slice().reverse().map(t => (
            <span key={t} className="text-[10px] tabular-nums" style={{ color: config.textDim }}>{t}M</span>
          ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 pl-12 flex items-end justify-between gap-2 md:gap-3">
          {data.map((d, i) => {
            const total = totals[i];
            const totalH = (total / max) * 100;
            const balancePct = d.balance / total;
            const boostPct = d.boost / total;
            const leadsPct = d.leads / total;
            const isHover = hover === i;
            return (
              <div
                key={d.label}
                className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {/* Tooltip */}
                {isHover && (
                  <div className="absolute bottom-full mb-2 px-3 py-2 rounded-lg z-20 whitespace-nowrap pointer-events-none shadow-xl" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                    <p className="text-[11px] font-bold mb-1.5" style={{ color: config.text }}>{d.label} · {total.toFixed(1)}M so&apos;m</p>
                    <div className="space-y-0.5">
                      <TooltipRow color="#3b82f6" label="Balans" value={d.balance.toFixed(1)} config={config} />
                      <TooltipRow color="#f59e0b" label="Boost" value={d.boost.toFixed(1)} config={config} />
                      <TooltipRow color="#22c55e" label="Leadlar" value={d.leads.toFixed(1)} config={config} />
                    </div>
                  </div>
                )}
                <div className="w-full max-w-[56px] rounded-t-md overflow-hidden transition-all flex flex-col-reverse" style={{ height: `${totalH}%`, filter: isHover ? "brightness(1.15)" : "brightness(1)" }}>
                  <div className="w-full transition-all" style={{ height: `${balancePct * 100}%`, background: "linear-gradient(180deg, #3b82f6, #2563eb)" }} />
                  <div className="w-full transition-all" style={{ height: `${boostPct * 100}%`, background: "linear-gradient(180deg, #f59e0b, #d97706)" }} />
                  <div className="w-full transition-all" style={{ height: `${leadsPct * 100}%`, background: "linear-gradient(180deg, #22c55e, #16a34a)", borderTopLeftRadius: "6px", borderTopRightRadius: "6px" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="pl-12 flex items-end justify-between gap-2 md:gap-3 mt-2">
        {data.map((d, i) => (
          <div key={d.label} className="flex-1 flex justify-center">
            <span className="text-[11px] font-medium" style={{ color: hover === i ? config.text : config.textDim }}>{d.label}</span>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-4" style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
        <SummaryCell color="#3b82f6" label="Balans" value={`${data.reduce((s, d) => s + d.balance, 0).toFixed(1)}M`} config={config} />
        <SummaryCell color="#f59e0b" label="Boost" value={`${data.reduce((s, d) => s + d.boost, 0).toFixed(1)}M`} config={config} />
        <SummaryCell color="#22c55e" label="Leadlar" value={`${data.reduce((s, d) => s + d.leads, 0).toFixed(1)}M`} config={config} />
      </div>
    </div>
  );
}

function TooltipRow({ color, label, value, config }: { color: string; label: string; value: string; config: Cfg }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[11px]">
      <span className="inline-flex items-center gap-1.5" style={{ color: config.textMuted }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
      <span className="font-semibold tabular-nums" style={{ color: config.text }}>{value}M</span>
    </div>
  );
}

function SummaryCell({ color, label, value, config }: { color: string; label: string; value: string; config: Cfg }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px]" style={{ color: config.textMuted }}>{label}</span>
      </div>
      <p className="text-[15px] font-bold tabular-nums" style={{ color: config.text }}>{value}</p>
    </div>
  );
}

function LineChart({ data, config }: { data: UserGrowthRow[]; config: Cfg }) {
  if (!data.length) return <p className="text-[13px]" style={{ color: config.textMuted }}>Ma&apos;lumot yo&apos;q</p>;
  const max = Math.max(...data.map(d => d.students), ...data.map(d => d.teachers * 8), 1);
  const w = 100;
  const h = 160;
  const step = w / (data.length - 1);

  const studentPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${i * step},${h - (d.students / max) * h}`).join(" ");
  const teacherPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${i * step},${h - (d.teachers * 8 / max) * h}`).join(" ");

  return (
    <div>
      <div className="relative h-44">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
          {[0.25, 0.5, 0.75].map(y => (
            <line key={y} x1="0" y1={h * y} x2={w} y2={h * y} stroke={config.surfaceBorder} strokeWidth="0.3" />
          ))}
          <path d={`${studentPath} L${w},${h} L0,${h} Z`} fill="#06b6d4" opacity="0.12" />
          <path d={studentPath} fill="none" stroke="#06b6d4" strokeWidth="1.2" />
          <path d={teacherPath} fill="none" stroke="#8b5cf6" strokeWidth="1.2" />
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={i * step} cy={h - (d.students / max) * h} r="1" fill="#06b6d4" />
              <circle cx={i * step} cy={h - (d.teachers * 8 / max) * h} r="1" fill="#8b5cf6" />
            </g>
          ))}
        </svg>
      </div>
      <div className="flex items-center justify-between mt-2">
        {data.map(d => (
          <span key={d.label} className="text-[10px]" style={{ color: config.textDim }}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data, config }: { data: TrafficRow[]; config: Cfg }) {
  if (!data.length) return <p className="text-[13px]" style={{ color: config.textMuted }}>—</p>;
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 48;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {data.map((d, i) => {
            const dash = (d.value / total) * circ;
            const el = (
              <circle
                key={i}
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth="14"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[22px] font-bold" style={{ color: config.text }}>{total}%</p>
          <p className="text-[10px]" style={{ color: config.textDim }}>jami</p>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {data.map(d => (
          <div key={d.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[12px] truncate" style={{ color: config.textMuted }}>{d.label}</span>
            </div>
            <span className="text-[12px] font-semibold tabular-nums" style={{ color: config.text }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelChart({ data, config }: { data: FunnelRow[]; config: Cfg }) {
  if (!data.length) return <p className="text-[13px]" style={{ color: config.textMuted }}>—</p>;
  const max = data[0].count || 1;
  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = (d.count / max) * 100;
        const dropPct = i > 0 ? ((data[i - 1].count - d.count) / data[i - 1].count) * 100 : 0;
        return (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${config.accent}22`, color: config.accent }}>
                  {i + 1}
                </div>
                <span className="text-[13px] font-medium" style={{ color: config.text }}>{d.label}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                {i > 0 && (
                  <span className="flex items-center gap-0.5" style={{ color: "#ef4444" }}>
                    <TrendingDown className="w-3 h-3" />−{dropPct.toFixed(0)}%
                  </span>
                )}
                <span className="font-bold" style={{ color: config.text }}>{fmt(d.count)}</span>
              </div>
            </div>
            <div className="h-7 rounded-md overflow-hidden relative" style={{ backgroundColor: config.hover }}>
              <div
                className="h-full flex items-center px-2 transition-all"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${config.accent}, ${config.accent}88)` }}
              >
                <span className="text-[10px] font-bold" style={{ color: config.accentText }}>{d.pct.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MetricRow({ label, value, config, color, icon: Icon, last }: { label: string; value: string; config: Cfg; color?: string; icon?: typeof Users; last?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: last ? "none" : `1px solid ${config.surfaceBorder}` }}>
      <span className="text-[12px] flex items-center gap-1.5" style={{ color: config.textMuted }}>
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: config.textDim }} />}
        {label}
      </span>
      <span className="text-[13px] font-semibold tabular-nums" style={{ color: color || config.text }}>{value}</span>
    </div>
  );
}
