"use client";

import { useEffect, useState } from "react";
import { Tags, MessageSquare, Eye } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type PeriodId = "1d" | "7d" | "30d" | "90d" | "apr" | "mar" | "feb" | "yan" | "dek" | "noy";

interface Row {
  id: number;
  name: string;
  slug: string;
  color: string;
  groupName: string | null;
  listings: number;
  views: number;
  leads: number;
  ctr: number;
}

export function CategoriesTab({ period }: { period: PeriodId }) {
  const { config } = useAdminTheme();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/analytics/categories?period=${period}`)
      .then(r => r.json())
      .then((d: { categories: Row[] }) => { if (!cancelled) setRows(d.categories ?? []); })
      .catch(e => console.error(e))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [period]);

  const sorted = [...rows].sort((a, b) => b.leads - a.leads);
  const maxLeads = Math.max(...sorted.map(r => r.leads), 1);
  const totals = {
    cats: sorted.length,
    listings: sorted.reduce((s, r) => s + r.listings, 0),
    views: sorted.reduce((s, r) => s + r.views, 0),
    leads: sorted.reduce((s, r) => s + r.leads, 0),
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Yo'nalishlar" value={totals.cats} icon={Tags} color="#7ea2d4" config={config} />
        <Stat label="E'lonlar" value={totals.listings} icon={Tags} color="#06b6d4" config={config} />
        <Stat label="Jami view" value={totals.views} icon={Eye} color="#f59e0b" config={config} />
        <Stat label="Jami lead" value={totals.leads} icon={MessageSquare} color="#22c55e" config={config} />
      </div>

      <div className="rounded-[12px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <h3 className="text-[15px] font-bold mb-4" style={{ color: config.text }}>Yo&apos;nalishlar bo&apos;yicha</h3>
        {loading ? (
          <p className="text-[13px] py-8 text-center" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        ) : sorted.length === 0 ? (
          <p className="text-[13px] py-8 text-center" style={{ color: config.textMuted }}>Ma&apos;lumot yo&apos;q</p>
        ) : (
          <div className="space-y-3">
            {sorted.map(r => {
              const pct = (r.leads / maxLeads) * 100;
              return (
                <div key={r.id}>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                      <span className="text-[13px] font-medium" style={{ color: config.text }}>{r.name}</span>
                      {r.groupName && <span className="text-[11px]" style={{ color: config.textDim }}>· {r.groupName}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-[12px]">
                      <span style={{ color: config.textMuted }}>{r.listings} e&apos;lon</span>
                      <span style={{ color: config.textMuted }}>{r.views.toLocaleString()} view</span>
                      <span className="font-semibold" style={{ color: "#22c55e" }}>{r.leads} lead</span>
                      <span style={{ color: config.text }}>{r.ctr.toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: config.hover }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: r.color }} />
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
function Stat({ label, value, icon: Icon, color, config }: { label: string; value: number | string; icon: typeof Eye; color: string; config: Cfg }) {
  return (
    <div className="rounded-[10px] p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <span className="text-[11px]" style={{ color: config.textMuted }}>{label}</span>
      </div>
      <p className="text-[18px] font-bold tabular-nums" style={{ color: config.text }}>{typeof value === "number" ? value.toLocaleString() : value}</p>
    </div>
  );
}
