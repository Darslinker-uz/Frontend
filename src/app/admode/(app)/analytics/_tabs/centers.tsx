"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Eye, MessageSquare, Building2, Wallet, ArrowUpDown } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type PeriodId = "1d" | "7d" | "30d" | "90d" | "apr" | "mar" | "feb" | "yan" | "dek" | "noy";

interface Row {
  id: number;
  name: string;
  banned: boolean;
  listings: number;
  views: number;
  leads: number;
  ctr: number;
  revenue: number;
  balance: number;
  ratingAvg: number;
  ratingCount: number;
}

type SortKey = "listings" | "views" | "leads" | "ctr" | "revenue" | "rating";

export function CentersTab({ period }: { period: PeriodId }) {
  const { config } = useAdminTheme();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("leads");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/analytics/centers?period=${period}`)
      .then(r => r.json())
      .then((d: { centers: Row[] }) => { if (!cancelled) setRows(d.centers ?? []); })
      .catch(e => console.error(e))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [period]);

  const filtered = useMemo(() => {
    return rows
      .filter(r => !r.banned)
      .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        let av: number, bv: number;
        switch (sortKey) {
          case "listings": av = a.listings; bv = b.listings; break;
          case "views": av = a.views; bv = b.views; break;
          case "leads": av = a.leads; bv = b.leads; break;
          case "ctr": av = a.ctr; bv = b.ctr; break;
          case "revenue": av = a.revenue; bv = b.revenue; break;
          case "rating": av = a.ratingAvg; bv = b.ratingAvg; break;
        }
        return sortDir === "desc" ? bv - av : av - bv;
      });
  }, [rows, search, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const totalLeads = filtered.reduce((s, r) => s + r.leads, 0);
  const totalViews = filtered.reduce((s, r) => s + r.views, 0);
  const totalRevenue = filtered.reduce((s, r) => s + r.revenue, 0);

  return (
    <div className="space-y-4">
      <div className="relative max-w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Markaz nomi..."
          className="w-full h-[38px] pl-9 pr-3 rounded-lg text-[13px] focus:outline-none"
          style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Aktiv markaz" value={filtered.length} icon={Building2} color="#7ea2d4" config={config} />
        <Stat label="Jami view" value={totalViews} icon={Eye} color="#06b6d4" config={config} />
        <Stat label="Jami lead" value={totalLeads} icon={MessageSquare} color="#22c55e" config={config} />
        <Stat label="Daromad" value={`${(totalRevenue / 1_000_000).toFixed(1)}M`} icon={Wallet} color="#f59e0b" config={config} />
      </div>

      <div className="rounded-[12px] overflow-hidden" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead style={{ backgroundColor: config.hover }}>
              <tr style={{ color: config.textMuted }}>
                <th className="text-left px-4 py-3 font-medium">Markaz</th>
                <th className="text-right px-3 py-3 font-medium cursor-pointer" onClick={() => toggleSort("listings")}>
                  <span className="inline-flex items-center gap-1">E'lon <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-right px-3 py-3 font-medium cursor-pointer hidden md:table-cell" onClick={() => toggleSort("views")}>
                  <span className="inline-flex items-center gap-1">View <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-right px-3 py-3 font-medium cursor-pointer" onClick={() => toggleSort("leads")}>
                  <span className="inline-flex items-center gap-1">Lead <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-right px-3 py-3 font-medium hidden md:table-cell cursor-pointer" onClick={() => toggleSort("ctr")}>
                  <span className="inline-flex items-center gap-1">CTR <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-right px-3 py-3 font-medium cursor-pointer" onClick={() => toggleSort("revenue")}>
                  <span className="inline-flex items-center gap-1">Daromad <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="text-right px-3 py-3 font-medium hidden lg:table-cell cursor-pointer" onClick={() => toggleSort("rating")}>
                  <span className="inline-flex items-center gap-1">Reyting <ArrowUpDown className="w-3 h-3" /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-[12px]" style={{ color: config.textMuted }}>Yuklanmoqda...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[12px]" style={{ color: config.textMuted }}>Markaz topilmadi</td></tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.id} style={{ borderTop: i > 0 ? `1px solid ${config.surfaceBorder}` : "none" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: config.text }}>{r.name}</td>
                    <td className="px-3 py-3 text-right tabular-nums" style={{ color: config.textMuted }}>{r.listings}</td>
                    <td className="px-3 py-3 text-right tabular-nums hidden md:table-cell" style={{ color: config.text }}>{r.views.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold" style={{ color: r.leads > 0 ? "#22c55e" : config.textMuted }}>{r.leads}</td>
                    <td className="px-3 py-3 text-right tabular-nums hidden md:table-cell" style={{ color: config.text }}>{r.ctr.toFixed(2)}%</td>
                    <td className="px-3 py-3 text-right tabular-nums" style={{ color: config.text }}>{(r.revenue / 1_000_000).toFixed(2)}M</td>
                    <td className="px-3 py-3 text-right hidden lg:table-cell" style={{ color: config.textMuted }}>
                      {r.ratingCount > 0 ? `${r.ratingAvg.toFixed(1)} (${r.ratingCount})` : "—"}
                    </td>
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
