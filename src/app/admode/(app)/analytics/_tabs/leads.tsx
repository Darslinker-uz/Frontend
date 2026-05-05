"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Target, Clock, CheckCircle2 } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type PeriodId = "1d" | "7d" | "30d" | "90d" | "apr" | "mar" | "feb" | "yan" | "dek" | "noy";

interface StatusRow { status: string; label: string; color: string; count: number; pct: number }
interface CenterRow { id: number; name: string; total: number; converted: number; cancelled: number; pending: number; winRate: number; responseRate: number }
interface Data { total: number; deadLeads: number; statusBreakdown: StatusRow[]; centers: CenterRow[] }

export function LeadsTab({ period }: { period: PeriodId }) {
  const { config } = useAdminTheme();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/analytics/leads?period=${period}`)
      .then(r => r.json())
      .then((d: Data) => { if (!cancelled) setData(d); })
      .catch(e => console.error(e))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [period]);

  if (loading || !data) {
    return <p className="text-[13px] py-12 text-center" style={{ color: config.textMuted }}>Yuklanmoqda...</p>;
  }

  const converted = data.statusBreakdown.find(s => s.status === "converted")?.count ?? 0;
  const winRate = data.total > 0 ? (converted / data.total) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Jami arizalar" value={data.total} icon={Target} color="#7ea2d4" config={config} />
        <Stat label="Win rate" value={`${winRate.toFixed(1)}%`} icon={CheckCircle2} color="#22c55e" config={config} hint="converted/jami" />
        <Stat label="Javobsiz (24+ soat)" value={data.deadLeads} icon={AlertTriangle} color="#ef4444" config={config} hint="markaz hali bog'lanmagan" />
        <Stat label="Yangi (kutmoqda)" value={data.statusBreakdown.find(s => s.status === "new_lead")?.count ?? 0} icon={Clock} color="#f59e0b" config={config} />
      </div>

      {/* Status breakdown */}
      <div className="rounded-[12px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <h3 className="text-[15px] font-bold mb-4" style={{ color: config.text }}>Status taqsimoti</h3>
        {data.statusBreakdown.length === 0 ? (
          <p className="text-[13px] py-4 text-center" style={{ color: config.textMuted }}>Ma&apos;lumot yo&apos;q</p>
        ) : (
          <div className="space-y-3">
            {data.statusBreakdown.map(s => (
              <div key={s.status}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[13px] font-medium" style={{ color: config.text }}>{s.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[12px]">
                    <span className="font-bold tabular-nums" style={{ color: config.text }}>{s.count}</span>
                    <span className="tabular-nums" style={{ color: config.textDim }}>{s.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: config.hover }}>
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Per-center performance */}
      <div className="rounded-[12px] overflow-hidden" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <div className="p-5 pb-3">
          <h3 className="text-[15px] font-bold" style={{ color: config.text }}>Markazlar bo&apos;yicha lead samaradorligi</h3>
          <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>Win rate = converted / jami arizalar</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead style={{ backgroundColor: config.hover }}>
              <tr style={{ color: config.textMuted }}>
                <th className="text-left px-4 py-2.5 font-medium">Markaz</th>
                <th className="text-right px-3 py-2.5 font-medium">Jami</th>
                <th className="text-right px-3 py-2.5 font-medium">Converted</th>
                <th className="text-right px-3 py-2.5 font-medium hidden md:table-cell">Qiziqmadi</th>
                <th className="text-right px-3 py-2.5 font-medium hidden md:table-cell">Javobsiz</th>
                <th className="text-right px-3 py-2.5 font-medium">Win rate</th>
                <th className="text-right px-3 py-2.5 font-medium hidden lg:table-cell">Javob %</th>
              </tr>
            </thead>
            <tbody>
              {data.centers.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[12px]" style={{ color: config.textMuted }}>Ma&apos;lumot yo&apos;q</td></tr>
              ) : (
                data.centers.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: i > 0 ? `1px solid ${config.surfaceBorder}` : "none" }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: config.text }}>{c.name}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums" style={{ color: config.textMuted }}>{c.total}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold" style={{ color: "#22c55e" }}>{c.converted}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell" style={{ color: "#ef4444" }}>{c.cancelled}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell" style={{ color: "#f59e0b" }}>{c.pending}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums" style={{ color: c.winRate >= 30 ? "#22c55e" : config.text }}>{c.winRate}%</td>
                    <td className="px-3 py-2.5 text-right tabular-nums hidden lg:table-cell" style={{ color: c.responseRate >= 80 ? "#22c55e" : c.responseRate >= 50 ? "#f59e0b" : "#ef4444" }}>{c.responseRate}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type Cfg = ReturnType<typeof useAdminTheme>["config"];
function Stat({ label, value, icon: Icon, color, hint, config }: { label: string; value: number | string; icon: typeof Target; color: string; hint?: string; config: Cfg }) {
  return (
    <div className="rounded-[10px] p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <span className="text-[11px]" style={{ color: config.textMuted }}>{label}</span>
      </div>
      <p className="text-[18px] font-bold tabular-nums" style={{ color: config.text }}>{typeof value === "number" ? value.toLocaleString() : value}</p>
      {hint && <p className="text-[10px] mt-0.5" style={{ color: config.textDim }}>{hint}</p>}
    </div>
  );
}
