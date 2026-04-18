"use client";

import Link from "next/link";
import { TrendingUp, Users, BarChart3, Wallet, Plus, ArrowRight, Phone, Clock } from "lucide-react";
import { useLeads } from "@/context/leads-context";

export default function DashboardPage() {
  const { leads, stats } = useLeads();
  const recentLeads = leads.filter(l => l.status === "yangi").slice(0, 5);

  const statCards = [
    { label: "Jami arizalar", value: String(stats.total), icon: Users },
    { label: "Yangi", value: String(stats.yangi), icon: TrendingUp },
    { label: "Konversiya", value: `${stats.konversiya}%`, icon: BarChart3 },
    { label: "Balans", value: "50,000", icon: Wallet },
  ];

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold text-white">Dashboard</h1>
          <p className="text-[14px] text-white/40 mt-0.5">Xush kelibsiz!</p>
        </div>
        <Link href="/dashboard/listings/new" className="h-[40px] px-4 rounded-[10px] bg-white text-[#16181a] text-[13px] font-medium flex items-center gap-2 hover:bg-white/90 transition-colors">
          <Plus className="w-4 h-4" /> Yangi e&apos;lon
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-[14px] border border-white/[0.06] bg-white/[0.04] p-4">
              <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-white/60" />
              </div>
              <p className="text-[20px] font-bold text-white">{stat.value}</p>
              <p className="text-[12px] text-white/40 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* E'lonlarim */}
      <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-bold text-white">Mening e&apos;lonlarim</h2>
          <Link href="/dashboard/listings" className="text-[13px] text-[#7ea2d4] font-medium flex items-center gap-1">
            Barchasi <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-12 rounded-[12px] border border-dashed border-white/[0.08]">
          <p className="text-[14px] text-white/40 mb-3">Hali e&apos;lon qo&apos;shilmagan</p>
          <Link href="/dashboard/listings/new" className="h-[36px] px-4 rounded-[8px] bg-white/[0.06] text-white text-[13px] font-medium flex items-center gap-2 hover:bg-white/[0.1] transition-colors">
            <Plus className="w-3.5 h-3.5" /> E&apos;lon qo&apos;shish
          </Link>
        </div>
      </div>

      {/* Oxirgi arizalar */}
      <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-bold text-white">Yangi arizalar</h2>
          <Link href="/dashboard/leads" className="text-[13px] text-[#7ea2d4] font-medium flex items-center gap-1">
            Barchasi ({stats.total}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentLeads.length > 0 ? (
          <div className="space-y-2">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-white">{lead.name}</p>
                  <p className="text-[12px] text-white/30 mt-0.5">{lead.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-white/20 flex items-center gap-1"><Clock className="w-3 h-3" /> {lead.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 rounded-[12px] border border-dashed border-white/[0.08]">
            <p className="text-[14px] text-white/40">Hali arizalar yo&apos;q</p>
          </div>
        )}
      </div>
    </div>
  );
}
