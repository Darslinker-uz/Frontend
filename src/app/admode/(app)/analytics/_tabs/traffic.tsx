"use client";

import { useEffect, useState, useMemo } from "react";
import { Users, UserCheck, Bot, Activity, Globe, Search, Share2, Link as LinkIcon, MoreHorizontal } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type TrafficPeriod = "7d" | "30d" | "90d" | "180d" | "365d";

interface KPI { total: number; unique: number; real: number; ai: number }
interface SeriesPoint { date: string; real: number; bots: number }
interface BotRow { name: string; count: number }
interface CategoryRow { key: string; label: string; count: number }
interface PathRow { path: string; count: number }

interface Data {
  period: TrafficPeriod;
  bucket: "day" | "week" | "month";
  kpi: KPI;
  series: SeriesPoint[];
  bots: BotRow[];
  categories: CategoryRow[];
  topPaths: PathRow[];
}

const PERIODS: { id: TrafficPeriod; label: string }[] = [
  { id: "7d", label: "1 hafta" },
  { id: "30d", label: "1 oy" },
  { id: "90d", label: "3 oy" },
  { id: "180d", label: "6 oy" },
  { id: "365d", label: "1 yil" },
];

const CATEGORY_META: Record<string, { color: string; icon: typeof Globe }> = {
  real: { color: "#22c55e", icon: Users },
  ai: { color: "#a855f7", icon: Bot },
  search: { color: "#3b82f6", icon: Search },
  social: { color: "#ec4899", icon: Share2 },
  other: { color: "#64748b", icon: MoreHorizontal },
};

function formatBucketLabel(date: string, bucket: "day" | "week" | "month"): string {
  if (bucket === "month") {
    const [, m] = date.split("-");
    const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
    return months[parseInt(m, 10) - 1] ?? date;
  }
  // day or week → "DD/MM"
  const [, m, d] = date.split("-");
  return `${d}/${m}`;
}

export function TrafficTab() {
  const { config } = useAdminTheme();
  const [period, setPeriod] = useState<TrafficPeriod>("30d");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/analytics/traffic?period=${period}`)
      .then((r) => r.json())
      .then((d: Data) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => console.error("[traffic]", e))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const maxValue = useMemo(() => {
    if (!data) return 0;
    return data.series.reduce((m, p) => Math.max(m, p.real + p.bots), 0);
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Davr selektor */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[12px]" style={{ color: config.textMuted }}>Davr:</span>
        <div className="inline-flex items-center gap-1 p-1 rounded-[10px]" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          {PERIODS.map((p) => {
            const isActive = period === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className="h-8 px-3 rounded-[8px] text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: isActive ? config.accent : "transparent",
                  color: isActive ? config.accentText : config.textMuted,
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading || !data ? (
        <p className="text-[13px] py-12 text-center" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Jami tashriflar" value={data.kpi.total} icon={Activity} color="#7ea2d4" config={config} />
            <Stat label="Unique visitor" value={data.kpi.unique} icon={UserCheck} color="#22c55e" config={config} hint="noyob sessionlar" />
            <Stat label="Real odamlar" value={data.kpi.real} icon={Users} color="#3b82f6" config={config} hint="bot bo'lmagan" />
            <Stat label="AI bot tashrifi" value={data.kpi.ai} icon={Bot} color="#a855f7" config={config} hint="GPT, Gemini, Claude..." />
          </div>

          {/* Time series chart */}
          <div className="rounded-[12px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-[15px] font-bold" style={{ color: config.text }}>
                  {data.bucket === "day" ? "Kunlik" : data.bucket === "week" ? "Haftalik" : "Oylik"} tashriflar
                </h3>
                <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>Real odamlar va botlar</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#3b82f6" }} />
                  <span style={{ color: config.textMuted }}>Real</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#a855f7" }} />
                  <span style={{ color: config.textMuted }}>Botlar</span>
                </div>
              </div>
            </div>

            {data.series.length === 0 || maxValue === 0 ? (
              <p className="text-[13px] py-12 text-center" style={{ color: config.textMuted }}>
                Hali ma&apos;lumot to&apos;planmagan — middleware endi yozishni boshladi
              </p>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex items-end gap-[3px] h-[180px] min-w-fit pl-1 pr-1">
                  {data.series.map((p, i) => {
                    const total = p.real + p.bots;
                    const heightPct = maxValue > 0 ? (total / maxValue) * 100 : 0;
                    const realPct = total > 0 ? (p.real / total) * 100 : 0;
                    const showLabel = data.series.length <= 30 || i % Math.ceil(data.series.length / 12) === 0;
                    return (
                      <div key={p.date} className="flex flex-col items-center gap-1.5" style={{ minWidth: data.bucket === "day" ? 14 : 28 }}>
                        <div
                          className="w-full rounded-t-[3px] flex flex-col justify-end relative group"
                          style={{ height: 160 }}
                          title={`${p.date}\nReal: ${p.real} · Botlar: ${p.bots}`}
                        >
                          <div
                            className="w-full rounded-t-[3px] flex flex-col"
                            style={{
                              height: `${heightPct}%`,
                              minHeight: total > 0 ? 2 : 0,
                              backgroundColor: "#a855f7",
                            }}
                          >
                            <div
                              className="w-full rounded-t-[3px]"
                              style={{ height: `${realPct}%`, backgroundColor: "#3b82f6" }}
                            />
                          </div>
                        </div>
                        <span className="text-[9px] tabular-nums whitespace-nowrap" style={{ color: showLabel ? config.textMuted : "transparent" }}>
                          {formatBucketLabel(p.date, data.bucket)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bot breakdown + top paths */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-[12px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
              <h3 className="text-[15px] font-bold mb-1" style={{ color: config.text }}>AI agentlar va botlar</h3>
              <p className="text-[12px] mb-4" style={{ color: config.textMuted }}>Eng faol bot turlari</p>
              {data.bots.length === 0 ? (
                <p className="text-[13px] py-6 text-center" style={{ color: config.textMuted }}>Hali bot tashrifi yo&apos;q</p>
              ) : (
                <div className="space-y-2">
                  {data.bots.slice(0, 12).map((b) => {
                    const max = data.bots[0]?.count ?? 1;
                    const pct = (b.count / max) * 100;
                    return (
                      <div key={b.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-medium" style={{ color: config.text }}>{b.name}</span>
                          <span className="text-[11px] tabular-nums font-bold" style={{ color: config.textMuted }}>{b.count.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: config.hover }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#a855f7" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-[12px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
              <h3 className="text-[15px] font-bold mb-1" style={{ color: config.text }}>Eng ko&apos;p ko&apos;rilgan sahifalar</h3>
              <p className="text-[12px] mb-4" style={{ color: config.textMuted }}>Top 10 sahifa</p>
              {data.topPaths.length === 0 ? (
                <p className="text-[13px] py-6 text-center" style={{ color: config.textMuted }}>Ma&apos;lumot yo&apos;q</p>
              ) : (
                <div className="space-y-2.5">
                  {data.topPaths.map((p) => {
                    const max = data.topPaths[0]?.count ?? 1;
                    const pct = (p.count / max) * 100;
                    return (
                      <div key={p.path}>
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <a
                            href={p.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] font-mono truncate flex items-center gap-1"
                            style={{ color: config.text }}
                          >
                            <LinkIcon className="w-3 h-3 shrink-0" style={{ color: config.textDim }} />
                            <span className="truncate">{p.path}</span>
                          </a>
                          <span className="text-[11px] tabular-nums font-bold shrink-0" style={{ color: config.textMuted }}>{p.count.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: config.hover }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: config.accent }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Category breakdown — manba bo'yicha */}
          <div className="rounded-[12px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <h3 className="text-[15px] font-bold mb-1" style={{ color: config.text }}>Manba bo&apos;yicha taqsimot</h3>
            <p className="text-[12px] mb-4" style={{ color: config.textMuted }}>Tashriflar qaysi turdagi tomondan kelyapti</p>
            {data.categories.length === 0 ? (
              <p className="text-[13px] py-6 text-center" style={{ color: config.textMuted }}>Ma&apos;lumot yo&apos;q</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {data.categories
                  .slice()
                  .sort((a, b) => b.count - a.count)
                  .map((c) => {
                    const meta = CATEGORY_META[c.key] ?? CATEGORY_META.other;
                    const Icon = meta.icon;
                    const total = data.kpi.total || 1;
                    const pct = ((c.count / total) * 100).toFixed(1);
                    return (
                      <div
                        key={c.key}
                        className="rounded-[10px] p-3"
                        style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-7 h-7 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: `${meta.color}22` }}
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                          </div>
                          <span className="text-[11px]" style={{ color: config.textMuted }}>{c.label}</span>
                        </div>
                        <p className="text-[18px] font-bold tabular-nums" style={{ color: config.text }}>{c.count.toLocaleString()}</p>
                        <p className="text-[10px] mt-0.5 tabular-nums" style={{ color: config.textDim }}>{pct}% jamidan</p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

type Cfg = ReturnType<typeof useAdminTheme>["config"];
function Stat({ label, value, icon: Icon, color, hint, config }: { label: string; value: number | string; icon: typeof Activity; color: string; hint?: string; config: Cfg }) {
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
