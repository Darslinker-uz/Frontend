"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Eye, MessageSquare, Star, ExternalLink, ArrowUpDown } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type PeriodId = "1d" | "7d" | "30d" | "90d" | "apr" | "mar" | "feb" | "yan" | "dek" | "noy";

interface Row {
  id: number;
  title: string;
  slug: string;
  status: string;
  centerName: string;
  centerId: number | null;
  categoryName: string;
  categorySlug: string | null;
  views: number;
  leads: number;
  ctr: number;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
}

type SortKey = "views" | "leads" | "ctr" | "rating" | "createdAt";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  active: { label: "Aktiv", color: "#22c55e" },
  pending: { label: "Tekshiruvda", color: "#f59e0b" },
  paused: { label: "To'xtatilgan", color: "#94a3b8" },
  rejected: { label: "Rad etilgan", color: "#ef4444" },
};

export function ListingsTab({ period }: { period: PeriodId }) {
  const { config } = useAdminTheme();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("leads");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/analytics/listings?period=${period}`)
      .then(r => r.json())
      .then((d: { listings: Row[] }) => { if (!cancelled) setRows(d.listings ?? []); })
      .catch(e => console.error(e))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [period]);

  const filtered = useMemo(() => {
    return rows
      .filter(r => statusFilter === "all" || r.status === statusFilter)
      .filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.centerName.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        let av: number, bv: number;
        switch (sortKey) {
          case "views": av = a.views; bv = b.views; break;
          case "leads": av = a.leads; bv = b.leads; break;
          case "ctr": av = a.ctr; bv = b.ctr; break;
          case "rating": av = a.ratingAvg; bv = b.ratingAvg; break;
          case "createdAt": av = new Date(a.createdAt).getTime(); bv = new Date(b.createdAt).getTime(); break;
        }
        return sortDir === "desc" ? bv - av : av - bv;
      });
  }, [rows, search, statusFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="E'lon yoki markaz nomi..."
            className="w-full h-[38px] pl-9 pr-3 rounded-lg text-[13px] focus:outline-none"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          {(["all", "active", "pending", "paused", "rejected"] as const).map(s => {
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="h-7 px-2.5 rounded text-[11.5px] font-medium transition-all"
                style={{ backgroundColor: active ? config.accent : "transparent", color: active ? config.accentText : config.textMuted }}
              >
                {s === "all" ? "Hammasi" : (STATUS_LABEL[s]?.label ?? s)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryStat label="E'lonlar" value={filtered.length} icon={ExternalLink} color="#7ea2d4" config={config} />
        <SummaryStat label="Jami view" value={filtered.reduce((s, r) => s + r.views, 0)} icon={Eye} color="#06b6d4" config={config} />
        <SummaryStat label="Jami lead" value={filtered.reduce((s, r) => s + r.leads, 0)} icon={MessageSquare} color="#22c55e" config={config} />
        <SummaryStat label="O'rt. CTR" value={filtered.length > 0 ? `${(filtered.reduce((s, r) => s + r.ctr, 0) / filtered.length).toFixed(2)}%` : "0%"} icon={Star} color="#f59e0b" config={config} />
      </div>

      {/* Table */}
      <div className="rounded-[12px] overflow-hidden" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead style={{ backgroundColor: config.hover }}>
              <tr style={{ color: config.textMuted }}>
                <th className="text-left px-4 py-3 font-medium">E'lon</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Markaz</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Yo'nalish</th>
                <th className="text-right px-3 py-3 font-medium cursor-pointer" onClick={() => toggleSort("views")}>
                  <span className="inline-flex items-center gap-1">View <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-right px-3 py-3 font-medium cursor-pointer" onClick={() => toggleSort("leads")}>
                  <span className="inline-flex items-center gap-1">Lead <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-right px-3 py-3 font-medium cursor-pointer" onClick={() => toggleSort("ctr")}>
                  <span className="inline-flex items-center gap-1">CTR <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-right px-3 py-3 font-medium hidden md:table-cell cursor-pointer" onClick={() => toggleSort("rating")}>
                  <span className="inline-flex items-center gap-1">Reyting <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-center px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-[12px]" style={{ color: config.textMuted }}>Yuklanmoqda...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-[12px]" style={{ color: config.textMuted }}>E'lon topilmadi</td></tr>
              ) : (
                filtered.map((r, i) => {
                  const status = STATUS_LABEL[r.status] ?? { label: r.status, color: "#94a3b8" };
                  return (
                    <tr key={r.id} style={{ borderTop: i > 0 ? `1px solid ${config.surfaceBorder}` : "none" }}>
                      <td className="px-4 py-3">
                        <Link href={`/admode/listings/${r.id}/edit`} className="flex items-center gap-2 hover:underline" style={{ color: config.text }}>
                          <span className="font-medium truncate max-w-[260px]">{r.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-50 shrink-0" />
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell" style={{ color: config.textMuted }}>{r.centerName}</td>
                      <td className="px-4 py-3 hidden lg:table-cell" style={{ color: config.textMuted }}>{r.categoryName}</td>
                      <td className="px-3 py-3 text-right tabular-nums" style={{ color: config.text }}>{r.views.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right tabular-nums font-semibold" style={{ color: r.leads > 0 ? "#22c55e" : config.textMuted }}>{r.leads}</td>
                      <td className="px-3 py-3 text-right tabular-nums" style={{ color: config.text }}>{r.ctr.toFixed(2)}%</td>
                      <td className="px-3 py-3 text-right hidden md:table-cell" style={{ color: config.textMuted }}>
                        {r.ratingCount > 0 ? `${r.ratingAvg.toFixed(1)} (${r.ratingCount})` : "—"}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex h-[20px] px-2 rounded-full text-[10px] font-bold items-center" style={{ backgroundColor: `${status.color}22`, color: status.color }}>
                          {status.label}
                        </span>
                      </td>
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
function SummaryStat({ label, value, icon: Icon, color, config }: { label: string; value: number | string; icon: typeof Eye; color: string; config: Cfg }) {
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
