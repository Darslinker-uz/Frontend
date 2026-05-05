"use client";

import { useEffect, useState } from "react";
import { Rocket, Eye, MessageSquare, Wallet } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type PeriodId = "1d" | "7d" | "30d" | "90d" | "apr" | "mar" | "feb" | "yan" | "dek" | "noy";

interface SummaryRow { type: string; count: number; spent: number; views: number; leads: number; cpl: number; ctr: number }
interface TopRow { id: number; listingId: number; title: string; centerName: string; type: string; spent: number; views: number; leads: number; cpl: number; ctr: number; daysTotal: number; status: string }
interface Data { summary: SummaryRow[]; top: TopRow[]; totalRevenue: number; activeCount: number }

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
  a_class: { label: "A-class", color: "#f59e0b" },
  b_class: { label: "B-class", color: "#3b82f6" },
};

export function BoostTab({ period }: { period: PeriodId }) {
  const { config } = useAdminTheme();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/analytics/boost?period=${period}`)
      .then(r => r.json())
      .then((d: Data) => { if (!cancelled) setData(d); })
      .catch(e => console.error(e))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [period]);

  if (loading || !data) {
    return <p className="text-[13px] py-12 text-center" style={{ color: config.textMuted }}>Yuklanmoqda...</p>;
  }

  const totalLeads = data.summary.reduce((s, r) => s + r.leads, 0);
  const totalViews = data.summary.reduce((s, r) => s + r.views, 0);
  const avgCpl = totalLeads > 0 ? Math.round(data.totalRevenue / totalLeads) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Aktiv boost" value={data.activeCount} icon={Rocket} color="#f59e0b" config={config} />
        <Stat label="Boost view" value={totalViews} icon={Eye} color="#06b6d4" config={config} />
        <Stat label="Boost lead" value={totalLeads} icon={MessageSquare} color="#22c55e" config={config} />
        <Stat label="O'rt. CPL" value={`${avgCpl.toLocaleString()} so'm`} icon={Wallet} color="#7ea2d4" config={config} hint="Cost per lead" />
      </div>

      {/* Per-type comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.summary.map(s => {
          const meta = TYPE_LABEL[s.type] ?? { label: s.type, color: "#94a3b8" };
          return (
            <div key={s.type} className="rounded-[12px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${meta.color}22` }}>
                  <Rocket className="w-4 h-4" style={{ color: meta.color }} />
                </div>
                <h3 className="text-[14px] font-bold" style={{ color: config.text }}>{meta.label}</h3>
                <span className="ml-auto text-[12px]" style={{ color: config.textMuted }}>{s.count} ta</span>
              </div>
              <div className="space-y-2">
                <Row label="View" value={s.views.toLocaleString()} config={config} />
                <Row label="Lead" value={s.leads.toLocaleString()} color="#22c55e" config={config} />
                <Row label="CTR" value={`${s.ctr}%`} config={config} />
                <Row label="Sarflandi" value={`${(s.spent / 1_000_000).toFixed(2)}M so'm`} config={config} />
                <Row label="CPL" value={`${s.cpl.toLocaleString()} so'm`} color={s.cpl > 0 && s.cpl < 50000 ? "#22c55e" : config.text} config={config} last />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top boosts */}
      <div className="rounded-[12px] overflow-hidden" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <div className="p-5 pb-3">
          <h3 className="text-[15px] font-bold" style={{ color: config.text }}>Eng samarali boost'lar</h3>
          <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>Lead soniga ko&apos;ra</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead style={{ backgroundColor: config.hover }}>
              <tr style={{ color: config.textMuted }}>
                <th className="text-left px-4 py-2.5 font-medium">E'lon</th>
                <th className="text-left px-4 py-2.5 font-medium hidden md:table-cell">Markaz</th>
                <th className="text-center px-3 py-2.5 font-medium">Tur</th>
                <th className="text-right px-3 py-2.5 font-medium">View</th>
                <th className="text-right px-3 py-2.5 font-medium">Lead</th>
                <th className="text-right px-3 py-2.5 font-medium hidden md:table-cell">Sarflandi</th>
                <th className="text-right px-3 py-2.5 font-medium hidden lg:table-cell">CPL</th>
              </tr>
            </thead>
            <tbody>
              {data.top.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[12px]" style={{ color: config.textMuted }}>Boost yo&apos;q</td></tr>
              ) : (
                data.top.map((b, i) => {
                  const meta = TYPE_LABEL[b.type] ?? { label: b.type, color: "#94a3b8" };
                  return (
                    <tr key={b.id} style={{ borderTop: i > 0 ? `1px solid ${config.surfaceBorder}` : "none" }}>
                      <td className="px-4 py-2.5 font-medium" style={{ color: config.text }}>{b.title}</td>
                      <td className="px-4 py-2.5 hidden md:table-cell" style={{ color: config.textMuted }}>{b.centerName}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="inline-flex h-[20px] px-2 rounded-full text-[10px] font-bold items-center" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums" style={{ color: config.textMuted }}>{b.views.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums font-semibold" style={{ color: b.leads > 0 ? "#22c55e" : config.textMuted }}>{b.leads}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell" style={{ color: config.text }}>{(b.spent / 1000).toFixed(0)}k</td>
                      <td className="px-3 py-2.5 text-right tabular-nums hidden lg:table-cell" style={{ color: config.textMuted }}>{b.cpl > 0 ? `${b.cpl.toLocaleString()}` : "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type Cfg = ReturnType<typeof useAdminTheme>["config"];
function Stat({ label, value, icon: Icon, color, hint, config }: { label: string; value: number | string; icon: typeof Rocket; color: string; hint?: string; config: Cfg }) {
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

function Row({ label, value, color, last, config }: { label: string; value: string; color?: string; last?: boolean; config: Cfg }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: last ? "none" : `1px solid ${config.surfaceBorder}` }}>
      <span className="text-[12px]" style={{ color: config.textMuted }}>{label}</span>
      <span className="text-[13px] font-semibold tabular-nums" style={{ color: color || config.text }}>{value}</span>
    </div>
  );
}
