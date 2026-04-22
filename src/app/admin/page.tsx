"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FileText, MessageSquare, CreditCard, TrendingUp, TrendingDown, Zap, Building2, ArrowRight, Eye } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

interface Stats {
  stats: {
    users: { total: number; delta: number };
    listings: { active: number; delta: number };
    revenue: { thisMonth: number; delta: number };
    conversion: { rate: number; delta: number };
  };
  urgent: {
    pendingListings: number;
    newStudentLeads: number;
    newPartnerApps: number;
    newHelpReqs: number;
  };
  boosts: {
    aClass: number;
    bClass: number;
    monthlyRevenue: number;
  };
  today: {
    leads: number;
    users: number;
    totalViews: number;
  };
  recentActivity: Array<{
    type: string;
    time: string;
    user: string;
    action: string;
    detail?: string;
  }>;
}

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n);
const fmtMoney = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return fmt(n);
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Hozir";
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 172800) return "Kecha";
  return `${Math.floor(diff / 86400)} kun oldin`;
}

export default function AdminHomePage() {
  const { config } = useAdminTheme();
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/dashboard-stats", { cache: "no-store" });
        const d: Stats = await res.json();
        if (!cancelled) setData(d);
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const statCards = data ? [
    { label: "Foydalanuvchilar", value: fmt(data.stats.users.total), change: `${data.stats.users.delta >= 0 ? "+" : ""}${data.stats.users.delta}%`, trend: data.stats.users.delta >= 0 ? "up" : "down", icon: Users, href: "/admin/users" },
    { label: "Aktiv e'lonlar", value: fmt(data.stats.listings.active), change: `${data.stats.listings.delta >= 0 ? "+" : ""}${data.stats.listings.delta}%`, trend: data.stats.listings.delta >= 0 ? "up" : "down", icon: FileText, href: "/admin/listings" },
    { label: "Oylik daromad", value: fmtMoney(data.stats.revenue.thisMonth), change: `${data.stats.revenue.delta >= 0 ? "+" : ""}${data.stats.revenue.delta}%`, trend: data.stats.revenue.delta >= 0 ? "up" : "down", icon: CreditCard, href: "/admin/payments" },
    { label: "Konversiya", value: `${data.stats.conversion.rate}%`, change: `${data.stats.conversion.delta >= 0 ? "+" : ""}${data.stats.conversion.delta}%`, trend: data.stats.conversion.delta >= 0 ? "up" : "down", icon: TrendingUp, href: "/admin/analytics" },
  ] : [];

  const urgentTasks = data ? [
    { label: "Moderatsiya kutayotgan e'lonlar", count: data.urgent.pendingListings, href: "/admin/listings?status=pending", icon: FileText },
    { label: "Yangi o'quvchi leadlari", count: data.urgent.newStudentLeads, href: "/admin/leads?tab=students", icon: Users },
    { label: "Hamkorlik so'rovlari", count: data.urgent.newPartnerApps, href: "/admin/leads?tab=hamkorlik", icon: Building2 },
    { label: "Yordam so'rovlari", count: data.urgent.newHelpReqs, href: "/admin/leads?tab=yordam", icon: MessageSquare },
  ] : [];

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>Admin panel</h1>
        <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>Platforma umumiy holati</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[14px] p-4 h-[110px]" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }} />
          ))
          : statCards.map((s) => {
            const Icon = s.icon;
            const isUp = s.trend === "up";
            return (
              <Link
                key={s.label}
                href={s.href}
                className="rounded-[14px] p-4 transition-all hover:scale-[1.01]"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
                    <Icon className="w-4 h-4" style={{ color: config.textMuted }} />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: isUp ? "#22c55e" : "#ef4444" }}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.change}
                  </div>
                </div>
                <p className="text-[20px] font-bold" style={{ color: config.text }}>{s.value}</p>
                <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>{s.label}</p>
              </Link>
            );
          })}
      </div>

      {/* Urgent tasks */}
      <div className="mb-6">
        <h2 className="text-[15px] font-bold mb-3" style={{ color: config.text }}>E&apos;tibor talab qiladi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {urgentTasks.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.label}
                href={t.href}
                className="rounded-[14px] p-4 flex items-center gap-3 transition-all"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
              >
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${config.accent}22` }}>
                  <Icon className="w-5 h-5" style={{ color: config.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold" style={{ color: config.text }}>{t.label}</p>
                  <p className="text-[13px]" style={{ color: config.textMuted }}>{t.count} ta yangi</p>
                </div>
                <ArrowRight className="w-4 h-4" style={{ color: config.textDim }} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Activity + Quick stats grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent activity */}
        <div className="lg:col-span-2 rounded-[16px] p-5 md:p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Oxirgi faoliyat</h2>
            <Link href="/admin/analytics" className="text-[13px] font-medium flex items-center gap-1" style={{ color: config.accent }}>
              Barchasi <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-0">
            {loading && <p className="text-[13px] py-4" style={{ color: config.textMuted }}>Yuklanmoqda...</p>}
            {!loading && (data?.recentActivity.length ?? 0) === 0 && (
              <p className="text-[13px] py-4" style={{ color: config.textMuted }}>Hozircha faoliyat yo&apos;q</p>
            )}
            {data?.recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-3" style={{ borderTop: i > 0 ? `1px solid ${config.surfaceBorder}` : "none" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                  {a.user.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px]" style={{ color: config.text }}>
                    <span className="font-semibold">{a.user}</span>{" "}
                    <span style={{ color: config.textMuted }}>{a.action}</span>
                    {a.detail && <span className="font-medium"> — {a.detail}</span>}
                  </p>
                  <p className="text-[11px]" style={{ color: config.textDim }}>{timeAgo(a.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-3">
          <div className="rounded-[16px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: config.accent }} />
              <h3 className="text-[13px] font-bold" style={{ color: config.text }}>Aktiv boostlar</h3>
            </div>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span style={{ color: config.textMuted }}>A-class</span>
                <span className="font-bold" style={{ color: config.text }}>{data?.boosts.aClass ?? 0} ta</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: config.textMuted }}>B-class</span>
                <span className="font-bold" style={{ color: config.text }}>{data?.boosts.bClass ?? 0} ta</span>
              </div>
              <div className="pt-2" style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: config.text }}>Oylik daromad</span>
                  <span className="font-bold text-[14px]" style={{ color: config.accent }}>{fmtMoney(data?.boosts.monthlyRevenue ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[16px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4" style={{ color: config.textMuted }} />
              <h3 className="text-[13px] font-bold" style={{ color: config.text }}>Bugun</h3>
            </div>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span style={{ color: config.textMuted }}>Jami ko&apos;rishlar</span>
                <span className="font-bold" style={{ color: config.text }}>{fmt(data?.today.totalViews ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: config.textMuted }}>Yangi leadlar</span>
                <span className="font-bold" style={{ color: config.text }}>{data?.today.leads ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: config.textMuted }}>Ro&apos;yxatdan o&apos;tish</span>
                <span className="font-bold" style={{ color: config.text }}>{data?.today.users ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
