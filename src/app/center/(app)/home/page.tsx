"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Users, BarChart3, Wallet, Plus, ArrowRight, Phone, Clock } from "lucide-react";
import { useLeads } from "@/context/leads-context";
import { useDashboardTheme } from "@/context/dashboard-theme-context";

interface Stats {
  user: { name: string; balance: number };
  listings: { total: number; active: number };
  leads: { total: number; thisMonth: number; converted: number };
  conversion: number;
}

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n);

export default function DashboardPage() {
  const { leads, stats: leadStats } = useLeads();
  const { config } = useDashboardTheme();
  const [serverStats, setServerStats] = useState<Stats | null>(null);
  const recentLeads = leads.filter(l => l.status === "yangi").slice(0, 5);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
        const data: Stats = await res.json();
        if (!cancelled) setServerStats(data);
      } catch (e) { console.error(e); }
    })();
    return () => { cancelled = true; };
  }, []);

  const totalLeads = serverStats?.leads.total ?? leadStats.total;
  const thisMonth = serverStats?.leads.thisMonth ?? leadStats.yangi;
  const conversion = serverStats?.conversion ?? leadStats.konversiya;
  const balance = serverStats?.user.balance ?? 0;

  const statCards = [
    { label: "Jami arizalar", value: String(totalLeads), icon: Users },
    { label: "Bu oy", value: String(thisMonth), icon: TrendingUp },
    { label: "Konversiya", value: `${conversion}%`, icon: BarChart3 },
    { label: "Balans", value: fmt(balance), icon: Wallet },
  ];

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>Dashboard</h1>
          <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>Xush kelibsiz!</p>
        </div>
        <Link
          href="/center/listings/new"
          className="h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2 transition-colors"
          style={{ backgroundColor: config.accent, color: config.accentText }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = config.accentHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = config.accent; }}
        >
          <Plus className="w-4 h-4" /> Yangi e&apos;lon
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-[14px] p-4"
              style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
            >
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-3"
                style={{ backgroundColor: config.hover }}
              >
                <Icon className="w-4 h-4" style={{ color: config.textMuted }} />
              </div>
              <p className="text-[20px] font-bold" style={{ color: config.text }}>{stat.value}</p>
              <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* E'lonlarim */}
      <div
        className="rounded-[16px] p-5 md:p-6 mb-6"
        style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Mening e&apos;lonlarim</h2>
          <Link href="/center/listings" className="text-[13px] text-[#7ea2d4] font-medium flex items-center gap-1">
            Barchasi <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div
          className="flex flex-col items-center justify-center py-12 rounded-[12px] border border-dashed"
          style={{ borderColor: config.surfaceBorder }}
        >
          <p className="text-[14px] mb-3" style={{ color: config.textMuted }}>Hali e&apos;lon qo&apos;shilmagan</p>
          <Link
            href="/center/listings/new"
            className="h-[36px] px-4 rounded-[8px] text-[13px] font-medium flex items-center gap-2 transition-colors"
            style={{ backgroundColor: config.hover, color: config.text }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = config.active; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = config.hover; }}
          >
            <Plus className="w-3.5 h-3.5" /> E&apos;lon qo&apos;shish
          </Link>
        </div>
      </div>

      {/* Oxirgi arizalar */}
      <div
        className="rounded-[16px] p-5 md:p-6"
        style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Yangi arizalar</h2>
          <Link href="/center/leads" className="text-[13px] text-[#7ea2d4] font-medium flex items-center gap-1">
            Barchasi ({totalLeads}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentLeads.length > 0 ? (
          <div className="space-y-2">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-[12px] px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
              >
                <div>
                  <p className="text-[14px] font-medium" style={{ color: config.text }}>{lead.name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: config.textDim }}>{lead.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] flex items-center gap-1" style={{ color: config.textDim }}><Clock className="w-3 h-3" /> {lead.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-12 rounded-[12px] border border-dashed"
            style={{ borderColor: config.surfaceBorder }}
          >
            <p className="text-[14px]" style={{ color: config.textMuted }}>Hali arizalar yo&apos;q</p>
          </div>
        )}
      </div>
    </div>
  );
}
