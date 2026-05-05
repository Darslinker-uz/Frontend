"use client";

import { useEffect, useState } from "react";
import { TrendingDown } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type PeriodId = "1d" | "7d" | "30d" | "90d" | "apr" | "mar" | "feb" | "yan" | "dek" | "noy";

interface Stage { key: string; label: string; count: number; pct: number; dropPct: number }
interface Summary { viewToLead: number; leadToContact: number; leadToSuccess: number; cancelled: number }

export function FunnelTab({ period }: { period: PeriodId }) {
  const { config } = useAdminTheme();
  const [stages, setStages] = useState<Stage[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/analytics/funnel?period=${period}`)
      .then(r => r.json())
      .then((d: { stages: Stage[]; summary: Summary }) => {
        if (!cancelled) { setStages(d.stages ?? []); setSummary(d.summary ?? null); }
      })
      .catch(e => console.error(e))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [period]);

  const max = stages[0]?.count || 1;

  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="View → Lead" value={`${summary.viewToLead.toFixed(3)}%`} config={config} hint="Ko'ruvchi ariza qoldirish nisbati" />
          <Stat label="Lead → Bog'lanish" value={`${summary.leadToContact.toFixed(2)}%`} config={config} hint="Markaz qancha tezlikda bog'landi" />
          <Stat label="Lead → Success" value={`${summary.leadToSuccess.toFixed(2)}%`} config={config} hint="Yopilgan arizalar nisbati" />
          <Stat label="Bekor qilingan" value={summary.cancelled} config={config} hint="Cancelled / lost / rejected" />
        </div>
      )}

      <div className="rounded-[12px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <h3 className="text-[15px] font-bold mb-1" style={{ color: config.text }}>Konversiya voronkasi</h3>
        <p className="text-[12px] mb-5" style={{ color: config.textMuted }}>Foydalanuvchi yo&apos;li bo&apos;ylab drop-off</p>
        {loading ? (
          <p className="text-[13px] py-8 text-center" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        ) : stages.length === 0 ? (
          <p className="text-[13px] py-8 text-center" style={{ color: config.textMuted }}>Ma&apos;lumot yo&apos;q</p>
        ) : (
          <div className="space-y-3">
            {stages.map((s, i) => {
              const pct = (s.count / max) * 100;
              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${config.accent}22`, color: config.accent }}>
                        {i + 1}
                      </div>
                      <span className="text-[13px] font-medium" style={{ color: config.text }}>{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      {i > 0 && s.dropPct > 0 && (
                        <span className="flex items-center gap-0.5" style={{ color: "#ef4444" }}>
                          <TrendingDown className="w-3 h-3" />−{s.dropPct.toFixed(0)}%
                        </span>
                      )}
                      <span className="font-bold tabular-nums" style={{ color: config.text }}>{s.count.toLocaleString()}</span>
                      <span className="tabular-nums" style={{ color: config.textDim }}>· {s.pct.toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="h-7 rounded-md overflow-hidden relative" style={{ backgroundColor: config.hover }}>
                    <div className="h-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${config.accent}, ${config.accent}88)` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

type Cfg = ReturnType<typeof useAdminTheme>["config"];
function Stat({ label, value, hint, config }: { label: string; value: number | string; hint?: string; config: Cfg }) {
  return (
    <div className="rounded-[10px] p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <span className="text-[11px]" style={{ color: config.textMuted }}>{label}</span>
      <p className="text-[20px] font-bold tabular-nums mt-1" style={{ color: config.text }}>{typeof value === "number" ? value.toLocaleString() : value}</p>
      {hint && <p className="text-[10px] mt-0.5" style={{ color: config.textDim }}>{hint}</p>}
    </div>
  );
}
