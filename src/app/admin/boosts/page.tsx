"use client";

import { useEffect, useState } from "react";
import {
  Search, Zap, Crown, Award, Eye, Users as UsersIcon, Rows3, LayoutGrid, Calendar,
  TrendingUp, DollarSign, X, Building2, ArrowUpRight, StopCircle, Play,
  MoreHorizontal, Check, XCircle,
} from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type BoostClass = "A" | "B";
type BoostStatus = "pending" | "active" | "ended" | "stopped" | "rejected";

interface Boost {
  id: number;
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

interface ApiBoost {
  id: number;
  type: "a_class" | "b_class";
  pricePerDay: number;
  daysTotal: number;
  totalPaid: number;
  startDate: string;
  endDate: string;
  status: BoostStatus;
  views: number;
  leadsCount: number;
  daysLeft: number;
  listing: {
    id: number;
    title: string;
    category: { id: number; name: string };
    user: { id: number; name: string };
  };
}

function mapBoost(b: ApiBoost): Boost {
  return {
    id: b.id,
    centerName: b.listing.user.name,
    listingTitle: b.listing.title,
    category: b.listing.category.name,
    boostClass: b.type === "a_class" ? "A" : "B",
    daysTotal: b.daysTotal,
    daysLeft: b.daysLeft,
    pricePerDay: b.pricePerDay,
    totalPaid: b.totalPaid,
    startedAt: b.startDate.slice(0, 10),
    endsAt: b.endDate.slice(0, 10),
    status: b.status,
    views: b.views,
    leads: b.leadsCount,
  };
}

const CLASS_CFG: Record<BoostClass, { label: string; color: string; softBg: string; icon: typeof Crown }> = {
  A: { label: "A class", color: "#f59e0b", softBg: "linear-gradient(135deg, rgba(245,158,11,0.14), rgba(245,158,11,0.04))", icon: Crown },
  B: { label: "B class", color: "#3b82f6", softBg: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(59,130,246,0.04))", icon: Award },
};

const STATUS_CFG: Record<BoostStatus, { label: string; color: string }> = {
  pending: { label: "Kutilmoqda", color: "#f59e0b" },
  active: { label: "Aktiv", color: "#22c55e" },
  ended: { label: "Tugagan", color: "#64748b" },
  stopped: { label: "To'xtatilgan", color: "#ef4444" },
  rejected: { label: "Rad etilgan", color: "#ef4444" },
};

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n);

// Gantt window
const WINDOW_START = new Date("2026-04-01").getTime();
const WINDOW_END = new Date("2026-05-15").getTime();
const WINDOW_SPAN = WINDOW_END - WINDOW_START;
const TODAY = new Date("2026-04-20").getTime();
const todayPct = ((TODAY - WINDOW_START) / WINDOW_SPAN) * 100;
const bStart = (b: Boost) => ((new Date(b.startedAt).getTime() - WINDOW_START) / WINDOW_SPAN) * 100;
const bWidth = (b: Boost) => ((new Date(b.endsAt).getTime() - new Date(b.startedAt).getTime()) / WINDOW_SPAN) * 100;

type View = "list" | "timeline" | "group";
type Tab = "kutilmoqda" | "aktiv" | "arxiv";

export default function AdminBoostsPage() {
  const { config } = useAdminTheme();
  const [view, setView] = useState<View>("list");
  const [tab, setTab] = useState<Tab>("kutilmoqda");
  const [search, setSearch] = useState("");
  const [openBoost, setOpenBoost] = useState<Boost | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [boosts, setBoosts] = useState<Boost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/boosts");
        const data: { boosts: ApiBoost[] } = await res.json();
        if (cancelled) return;
        setBoosts((data.boosts ?? []).map(mapBoost));
      } catch {
        if (!cancelled) setBoosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = boosts.filter(b => {
    if (tab === "kutilmoqda" && b.status !== "pending") return false;
    if (tab === "aktiv" && b.status !== "active") return false;
    if (tab === "arxiv" && (b.status === "active" || b.status === "pending")) return false;
    if (search) {
      const q = search.toLowerCase();
      const idStr = `B-${b.id}`.toLowerCase();
      if (!b.centerName.toLowerCase().includes(q) && !b.listingTitle.toLowerCase().includes(q) && !idStr.includes(q)) return false;
    }
    return true;
  });

  const counts = {
    kutilmoqda: boosts.filter(b => b.status === "pending").length,
    aktiv: boosts.filter(b => b.status === "active").length,
    arxiv: boosts.filter(b => b.status === "ended" || b.status === "stopped" || b.status === "rejected").length,
  };

  const active = boosts.filter(b => b.status === "active");
  const activeRevenue = active.reduce((s, b) => s + b.totalPaid, 0);
  const aClassActive = active.filter(b => b.boostClass === "A").length;
  const bClassActive = active.filter(b => b.boostClass === "B").length;
  const totalRevenue = boosts.reduce((s, b) => s + b.totalPaid, 0);

  const stop = async (id: number) => {
    const prev = boosts;
    setBoosts(p => p.map(b => (b.id === id ? { ...b, status: "stopped", daysLeft: 0 } : b)));
    setMenuOpen(null);
    try {
      const res = await fetch(`/api/admin/boosts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setBoosts(prev);
    }
  };
  const resume = async (id: number) => {
    const prev = boosts;
    setBoosts(p => p.map(b => (b.id === id ? { ...b, status: "active" } : b)));
    setMenuOpen(null);
    try {
      const res = await fetch(`/api/admin/boosts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resume" }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setBoosts(prev);
    }
  };

  const approve = async (id: number) => {
    const prev = boosts;
    setBoosts(p => p.map(b => (b.id === id ? { ...b, status: "active" } : b)));
    setMenuOpen(null);
    try {
      const res = await fetch(`/api/admin/boosts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setBoosts(prev);
    }
  };

  const reject = async (id: number, reason: string) => {
    const prev = boosts;
    setBoosts(p => p.map(b => (b.id === id ? { ...b, status: "rejected" } : b)));
    setMenuOpen(null);
    try {
      const res = await fetch(`/api/admin/boosts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setBoosts(prev);
    }
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: config.text }}>Boostlar</h1>
          <p className="mt-1 text-sm" style={{ color: config.textMuted }}>E&apos;lonlarni yuqoriga chiqarish — aktiv boostlar va daromad</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <StatCard label="Aktiv boostlar" value={active.length.toString()} sub={`${aClassActive}A + ${bClassActive}B`} icon={Zap} color="#22c55e" config={config} />
          <StatCard label="Aktiv daromad" value={`${(activeRevenue / 1000000).toFixed(1)}M`} sub="davom etayotgan" icon={TrendingUp} color="#f59e0b" config={config} />
          <StatCard label="Jami daromad" value={`${(totalRevenue / 1000000).toFixed(1)}M`} sub={`${boosts.length} ta boost`} icon={DollarSign} color={config.accent} accentText={config.accentText} config={config} />
          <StatCard label="O'rtacha muddat" value={`${boosts.length > 0 ? Math.round(boosts.reduce((s, b) => s + b.daysTotal, 0) / boosts.length) : 0} kun`} sub="har bir boost" icon={Calendar} color="#3b82f6" config={config} />
        </div>

        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
              {[
                { k: "kutilmoqda" as Tab, label: "Kutilmoqda", count: counts.kutilmoqda },
                { k: "aktiv" as Tab, label: "Aktiv", count: counts.aktiv },
                { k: "arxiv" as Tab, label: "Arxiv", count: counts.arxiv },
              ].map(t => {
                const isActive = tab === t.k;
                return (
                  <button
                    key={t.k}
                    onClick={() => setTab(t.k)}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-medium transition-all"
                    style={{ backgroundColor: isActive ? config.accent : "transparent", color: isActive ? config.accentText : config.textMuted }}
                  >
                    {t.label}
                    <span className="text-[10px] font-bold opacity-80">{t.count}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Qidirish..."
                className="h-10 pl-9 pr-3 rounded-lg text-[13px] outline-none w-[220px]"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
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
                  style={{ backgroundColor: isActive ? config.accent : "transparent", color: isActive ? config.accentText : config.textMuted }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[12px] p-4 animate-pulse"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
              >
                <div className="h-4 w-1/3 rounded mb-3" style={{ backgroundColor: config.hover }} />
                <div className="h-3 w-2/3 rounded mb-3" style={{ backgroundColor: config.hover }} />
                <div className="h-6 w-full rounded" style={{ backgroundColor: config.hover }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl p-16 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
            <Zap className="w-10 h-10 mx-auto mb-3" style={{ color: config.textDim }} />
            <p className="text-sm" style={{ color: config.textMuted }}>Boost topilmadi</p>
          </div>
        ) : (
          <>
            {view === "list" && (
              <ListView items={filtered} config={config} onOpen={setOpenBoost} onMenu={setMenuOpen} menuOpen={menuOpen} onStop={stop} onResume={resume} onApprove={approve} onReject={reject} />
            )}
            {view === "timeline" && (
              <TimelineView items={filtered} config={config} onOpen={setOpenBoost} />
            )}
            {view === "group" && (
              <GroupView items={filtered} config={config} onOpen={setOpenBoost} onMenu={setMenuOpen} menuOpen={menuOpen} onStop={stop} onResume={resume} onApprove={approve} onReject={reject} />
            )}
          </>
        )}

        <div className="mt-4 flex items-center justify-between text-xs" style={{ color: config.textDim }}>
          <span>Jami: {filtered.length} ta boost</span>
        </div>
      </div>

      {openBoost && (
        <BoostDetailModal
          boost={openBoost}
          onClose={() => setOpenBoost(null)}
          onStop={() => { stop(openBoost.id); setOpenBoost(null); }}
          onResume={() => { resume(openBoost.id); setOpenBoost(null); }}
          config={config}
        />
      )}
    </div>
  );
}

// ==================== VIEWS ====================

type Cfg = ReturnType<typeof useAdminTheme>["config"];

function ListView({ items, config, onOpen, onMenu, menuOpen, onStop, onResume, onApprove, onReject }: {
  items: Boost[]; config: Cfg; onOpen: (b: Boost) => void; onMenu: (id: number | null) => void; menuOpen: number | null; onStop: (id: number) => void; onResume: (id: number) => void; onApprove: (id: number) => void; onReject: (id: number, reason: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      {items.map(b => <RailCard key={b.id} boost={b} config={config} onOpen={onOpen} onMenu={onMenu} menuOpen={menuOpen} onStop={onStop} onResume={onResume} onApprove={onApprove} onReject={onReject} />)}
    </div>
  );
}

function GroupView({ items, config, onOpen, onMenu, menuOpen, onStop, onResume, onApprove, onReject }: {
  items: Boost[]; config: Cfg; onOpen: (b: Boost) => void; onMenu: (id: number | null) => void; menuOpen: number | null; onStop: (id: number) => void; onResume: (id: number) => void; onApprove: (id: number) => void; onReject: (id: number, reason: string) => void;
}) {
  return (
    <div className="space-y-6">
      {(["A", "B"] as BoostClass[]).map(cls => {
        const group = items.filter(b => b.boostClass === cls);
        if (group.length === 0) return null;
        const cfg = CLASS_CFG[cls];
        const revenue = group.reduce((s, b) => s + b.totalPaid, 0);
        const totalLeads = group.reduce((s, b) => s + b.leads, 0);
        return (
          <div key={cls}>
            <div className="rounded-[12px] p-3 mb-2.5 flex items-center gap-3 flex-wrap" style={{ background: cfg.softBg, border: `1px solid ${cfg.color}33` }}>
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: `${cfg.color}33` }}>
                <cfg.icon className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div>
                <p className="text-[14px] font-bold" style={{ color: config.text }}>{cfg.label}</p>
                <p className="text-[11px]" style={{ color: config.textMuted }}>{group.length} ta · kuniga {cls === "A" ? "100k" : "70k"}</p>
              </div>
              <div className="ml-auto flex items-center gap-4 text-[11px]">
                <div className="text-right">
                  <p style={{ color: config.textDim }}>Daromad</p>
                  <p className="text-[13px] font-bold" style={{ color: config.text }}>{fmt(revenue / 1000000)}M</p>
                </div>
                <div className="text-right">
                  <p style={{ color: config.textDim }}>Lead</p>
                  <p className="text-[13px] font-bold" style={{ color: "#22c55e" }}>{totalLeads}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {group.map(b => <RailCard key={b.id} boost={b} config={config} onOpen={onOpen} onMenu={onMenu} menuOpen={menuOpen} onStop={onStop} onResume={onResume} onApprove={onApprove} onReject={onReject} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineView({ items, config, onOpen }: { items: Boost[]; config: Cfg; onOpen: (b: Boost) => void }) {
  return (
    <div className="rounded-[14px] overflow-hidden" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <div className="px-5 pt-4 pb-2 flex items-center justify-between" style={{ color: config.textDim }}>
        {["1 Apr", "10 Apr", "20 Apr", "1 May", "10 May"].map((d, i) => (
          <span key={i} className="text-[10px]">{d}</span>
        ))}
      </div>

      <div className="relative pb-3" style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
        <div className="absolute top-0 bottom-0 w-px z-10 pointer-events-none" style={{ left: `calc(20px + (100% - 40px) * ${todayPct / 100})`, backgroundColor: "#ef4444" }}>
          <span className="absolute -top-0.5 -translate-x-1/2 text-[9px] px-1 py-0.5 rounded" style={{ backgroundColor: "#ef4444", color: "#ffffff" }}>Bugun</span>
        </div>
        {items.map((b, i) => {
          const cfg = CLASS_CFG[b.boostClass];
          return (
            <div
              key={b.id}
              onClick={() => onOpen(b)}
              className="px-5 py-2.5 cursor-pointer transition-colors"
              style={{ borderTop: i > 0 ? `1px solid ${config.surfaceBorder}` : "none" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = config.hover}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div className="flex items-center gap-3">
                <div className="w-40 md:w-52 shrink-0 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="inline-flex items-center gap-0.5 px-1.5 h-4 rounded text-[9px] font-bold shrink-0" style={{ backgroundColor: `${cfg.color}22`, color: cfg.color }}>
                      <cfg.icon className="w-2.5 h-2.5" />
                      {b.boostClass}
                    </div>
                    <p className="text-[12px] font-semibold truncate" style={{ color: config.text }}>{b.listingTitle}</p>
                  </div>
                  <p className="text-[10px] truncate" style={{ color: config.textDim }}>{b.centerName}</p>
                </div>
                <div className="flex-1 relative h-7">
                  <div
                    className="absolute inset-y-0 rounded-md flex items-center px-2 overflow-hidden"
                    style={{ left: `${bStart(b)}%`, width: `${bWidth(b)}%`, background: `linear-gradient(90deg, ${cfg.color}55, ${cfg.color}aa)`, border: `1px solid ${cfg.color}` }}
                  >
                    <span className="text-[10px] font-bold truncate" style={{ color: "#ffffff" }}>
                      {b.status === "active" ? `${b.daysLeft}k qoldi` : STATUS_CFG[b.status].label}
                    </span>
                  </div>
                </div>
                <div className="w-20 shrink-0 text-right hidden md:block">
                  <p className="text-[12px] font-bold" style={{ color: config.text }}>{fmt(b.totalPaid / 1000)}k</p>
                  <p className="text-[10px]" style={{ color: "#22c55e" }}>{b.leads} lead</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-2 flex items-center gap-4 text-[10px]" style={{ borderTop: `1px solid ${config.surfaceBorder}`, color: config.textMuted }}>
        <span className="flex items-center gap-1.5"><span className="w-2 h-0.5" style={{ backgroundColor: "#ef4444" }} />Bugun</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#f59e0b66" }} />A class</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#3b82f666" }} />B class</span>
      </div>
    </div>
  );
}

// ==================== RAIL CARD ====================

function RailCard({ boost, config, onOpen, onMenu, menuOpen, onStop, onResume, onApprove, onReject }: {
  boost: Boost; config: Cfg; onOpen: (b: Boost) => void; onMenu: (id: number | null) => void; menuOpen: number | null; onStop: (id: number) => void; onResume: (id: number) => void; onApprove: (id: number) => void; onReject: (id: number, reason: string) => void;
}) {
  const cfg = CLASS_CFG[boost.boostClass];
  const stat = STATUS_CFG[boost.status];
  const pct = boost.daysTotal > 0 ? ((boost.daysTotal - boost.daysLeft) / boost.daysTotal) * 100 : 100;
  const urgent = boost.status === "active" && boost.daysLeft <= 3;

  return (
    <div
      className="rounded-[12px] p-4 cursor-pointer transition-colors"
      style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, borderLeft: `3px solid ${cfg.color}` }}
      onClick={() => onOpen(boost)}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="inline-flex items-center gap-1 px-1.5 h-5 rounded text-[10px] font-bold shrink-0" style={{ backgroundColor: `${cfg.color}22`, color: cfg.color }}>
            <cfg.icon className="w-3 h-3" />
            {cfg.label}
          </div>
          <span className="text-[10px] font-mono shrink-0" style={{ color: config.textDim }}>{boost.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-1.5 h-[18px] rounded-full flex items-center" style={{ backgroundColor: `${stat.color}22`, color: stat.color }}>{stat.label}</span>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onMenu(menuOpen === boost.id ? null : boost.id)}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
              style={{ color: config.textMuted }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen === boost.id && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => onMenu(null)} />
                <div className="absolute right-0 top-8 z-20 w-44 rounded-lg py-1.5 shadow-xl" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                  <MenuBtn icon={Eye} label="Batafsil" onClick={() => { onOpen(boost); onMenu(null); }} config={config} />
                  {boost.status === "pending" && <MenuBtn icon={Check} label="Tasdiqlash" onClick={() => onApprove(boost.id)} config={config} />}
                  {boost.status === "pending" && <MenuBtn icon={XCircle} label="Rad etish" onClick={() => { const reason = prompt("Rad etish sababi?") ?? ""; if (reason.trim()) onReject(boost.id, reason.trim()); else onMenu(null); }} config={config} danger />}
                  {boost.status === "active" && <MenuBtn icon={StopCircle} label="To'xtatish" onClick={() => onStop(boost.id)} config={config} danger />}
                  {boost.status === "stopped" && <MenuBtn icon={Play} label="Davom ettirish" onClick={() => onResume(boost.id)} config={config} />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold truncate" style={{ color: config.text }}>{boost.listingTitle}</p>
          <p className="text-[11px] truncate flex items-center gap-1" style={{ color: config.textMuted }}>
            <Building2 className="w-3 h-3" />
            {boost.centerName} · {boost.category}
          </p>
        </div>
        <div className="text-right shrink-0">
          {boost.status === "active"
            ? <p className="text-[14px] font-bold" style={{ color: urgent ? "#ef4444" : config.text }}>{boost.daysLeft} kun</p>
            : <p className="text-[12px] font-semibold" style={{ color: stat.color }}>—</p>
          }
          <p className="text-[10px]" style={{ color: config.textDim }}>{fmt(boost.totalPaid / 1000)}k so&apos;m</p>
        </div>
      </div>

      <div className="relative h-6 rounded-md overflow-hidden mb-2.5" style={{ backgroundColor: config.hover }}>
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-end pr-2 transition-all"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${urgent ? "#ef444466" : `${cfg.color}66`}, ${urgent ? "#ef4444" : cfg.color})` }}
        >
          <span className="text-[10px] font-bold text-white">{Math.round(pct)}%</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <span className="text-[10px] font-medium" style={{ color: config.textDim }}>{boost.startedAt.slice(5)}</span>
          <span className="text-[10px] font-medium" style={{ color: config.textDim }}>{boost.endsAt.slice(5)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px]" style={{ color: config.textMuted }}>
        <span><Eye className="w-3 h-3 inline mr-1" />{fmt(boost.views)}</span>
        <span style={{ color: "#22c55e" }}><UsersIcon className="w-3 h-3 inline mr-1" />{boost.leads} lead</span>
        <span className="ml-auto text-[10px]" style={{ color: config.textDim }}>
          {boost.leads > 0 ? `${fmt(Math.round(boost.totalPaid / boost.leads / 1000))}k/lead` : ""}
        </span>
      </div>
    </div>
  );
}

// ==================== STAT CARD ====================

function StatCard({ label, value, sub, icon: Icon, color, accentText, config }: {
  label: string; value: string; sub: string; icon: typeof Zap; color: string; accentText?: string; config: Cfg;
}) {
  return (
    <div className="p-4 md:p-5 rounded-xl" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] font-medium mb-1" style={{ color: config.textMuted }}>{label}</div>
          <div className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: config.text }}>{value}</div>
        </div>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "22" }}>
          <Icon className="w-4 h-4" style={{ color: accentText || color }} />
        </div>
      </div>
      <div className="text-[11px] mt-2" style={{ color: config.textDim }}>{sub}</div>
    </div>
  );
}

// ==================== MENU BTN ====================

function MenuBtn({ icon: Icon, label, onClick, config, danger }: {
  icon: typeof Zap; label: string; onClick: () => void; config: Cfg; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors"
      style={{ color: danger ? "#ef4444" : config.text }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = config.hover}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// ==================== DETAIL MODAL ====================

function BoostDetailModal({ boost, onClose, onStop, onResume, config }: {
  boost: Boost; onClose: () => void; onStop: () => void; onResume: () => void; config: Cfg;
}) {
  const cfg = CLASS_CFG[boost.boostClass];
  const ClsIcon = cfg.icon;
  const stat = STATUS_CFG[boost.status];
  const progress = boost.daysTotal > 0 ? ((boost.daysTotal - boost.daysLeft) / boost.daysTotal) * 100 : 100;
  const cpl = boost.leads > 0 ? Math.round(boost.totalPaid / boost.leads) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-t-2xl md:rounded-2xl overflow-hidden"
        style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 md:px-6 py-4 flex items-start justify-between" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cfg.color}22` }}>
              <ClsIcon className="w-5 h-5" style={{ color: cfg.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] font-semibold" style={{ color: config.text }}>{boost.id}</span>
                <span className="text-[10px] font-semibold px-1.5 h-[18px] rounded-full flex items-center" style={{ backgroundColor: `${stat.color}22`, color: stat.color }}>{stat.label}</span>
              </div>
              <p className="text-[15px] font-bold mt-0.5" style={{ color: config.text }}>{cfg.label} boost</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center" style={{ color: config.textMuted }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 md:px-6 py-5 space-y-5">
          <div className="rounded-xl p-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <p className="text-[15px] font-semibold mb-1" style={{ color: config.text }}>{boost.listingTitle}</p>
            <div className="flex items-center gap-2 text-[12px]" style={{ color: config.textMuted }}>
              <Building2 className="w-3.5 h-3.5" />
              <span>{boost.centerName}</span>
              <span>·</span>
              <span>{boost.category}</span>
            </div>
          </div>

          {boost.status === "active" && (
            <div>
              <div className="flex items-center justify-between text-[12px] mb-2">
                <span style={{ color: config.textMuted }}>Progress</span>
                <span style={{ color: config.text }}>{boost.daysTotal - boost.daysLeft} / {boost.daysTotal} kun</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: config.hover }}>
                <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: cfg.color }} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Boshlangan" value={boost.startedAt} config={config} />
            <Stat label="Tugaydi" value={boost.endsAt} config={config} />
            <Stat label="Kuniga" value={`${fmt(boost.pricePerDay)} so'm`} config={config} />
            <Stat label="Jami to'landi" value={`${fmt(boost.totalPaid)} so'm`} config={config} highlight />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: config.textDim }}>Natija</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                <p className="text-[11px]" style={{ color: config.textMuted }}>Ko&apos;rish</p>
                <p className="text-[18px] font-bold mt-0.5" style={{ color: config.text }}>{fmt(boost.views)}</p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                <p className="text-[11px]" style={{ color: config.textMuted }}>Leadlar</p>
                <p className="text-[18px] font-bold mt-0.5" style={{ color: "#22c55e" }}>{boost.leads}</p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                <p className="text-[11px]" style={{ color: config.textMuted }}>Bir lead narxi</p>
                <p className="text-[18px] font-bold mt-0.5" style={{ color: config.text }}>{fmt(cpl / 1000)}k</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              className="flex-1 h-11 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: config.hover, color: config.text, border: `1px solid ${config.surfaceBorder}` }}
            >
              <ArrowUpRight className="w-4 h-4" />
              E&apos;lonni ko&apos;rish
            </button>
            {boost.status === "active" && (
              <button
                onClick={onStop}
                className="flex-1 h-11 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <StopCircle className="w-4 h-4" />
                To&apos;xtatish
              </button>
            )}
            {boost.status === "stopped" && (
              <button
                onClick={onResume}
                className="flex-1 h-11 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <Play className="w-4 h-4" />
                Davom ettirish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, config, highlight }: { label: string; value: string; config: Cfg; highlight?: boolean }) {
  return (
    <div className="rounded-lg p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <p className="text-[11px]" style={{ color: config.textMuted }}>{label}</p>
      <p className="text-[14px] font-semibold mt-0.5" style={{ color: highlight ? config.accent : config.text }}>{value}</p>
    </div>
  );
}

