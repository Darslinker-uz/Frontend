"use client";

import { useEffect, useState } from "react";
import { Search, Wallet, Zap, Users, RotateCcw, TrendingUp, Calendar, CreditCard, CheckCircle2, Clock, XCircle, ArrowUpRight, X, MoreHorizontal, Download, Phone } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type PayType = "topup" | "boost" | "lead" | "refund";
type PayStatus = "success" | "pending" | "cancelled";
type PayMethod = "click" | "payme" | "uzcard" | "humo" | "internal";

interface ApiUser {
  id: number;
  name: string;
  phone: string;
  role: "admin" | "provider" | "student";
}

interface ApiPayment {
  id: number;
  userId: number;
  amount: number;
  type: PayType;
  status: PayStatus;
  method: PayMethod;
  description: string | null;
  txnRef: string | null;
  createdAt: string;
  user: ApiUser;
}

interface Payment {
  id: string;
  userName: string;
  userPhone: string;
  userRole: "teacher" | "student";
  type: PayType;
  amount: number;
  status: PayStatus;
  method: PayMethod;
  date: string;
  time: string;
  note?: string;
  refOrder?: string;
}

function mapPayment(p: ApiPayment): Payment {
  const dt = new Date(p.createdAt);
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  const time = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  const userRole: "teacher" | "student" =
    p.user.role === "provider" ? "teacher" : p.user.role === "student" ? "student" : "teacher";
  return {
    id: `TXN-${p.id}`,
    userName: p.user.name,
    userPhone: p.user.phone,
    userRole,
    type: p.type,
    amount: p.amount,
    status: p.status,
    method: p.method,
    date,
    time,
    note: p.description ?? undefined,
    refOrder: p.txnRef ?? undefined,
  };
}

const TYPE_CONFIG: Record<PayType, { label: string; icon: typeof Wallet; color: string; bg: string }> = {
  topup: { label: "Balans to'ldirish", icon: Wallet, color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  boost: { label: "Boost to'lovi", icon: Zap, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  lead: { label: "Lead to'lovi", icon: Users, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  refund: { label: "Refund", icon: RotateCcw, color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const STATUS_CONFIG: Record<PayStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  success: { label: "Muvaffaqiyatli", color: "#22c55e", icon: CheckCircle2 },
  pending: { label: "Kutilmoqda", color: "#f59e0b", icon: Clock },
  cancelled: { label: "Bekor qilingan", color: "#ef4444", icon: XCircle },
};

const METHOD_LABEL: Record<PayMethod, string> = {
  click: "Click",
  payme: "Payme",
  uzcard: "Uzcard",
  humo: "Humo",
  internal: "Ichki balans",
};

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n);
const initials = (n: string) => n.split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase();

export default function AdminPaymentsPage() {
  const { config } = useAdminTheme();
  const [tab, setTab] = useState<"hammasi" | PayType>("hammasi");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"hammasi" | PayStatus>("hammasi");
  const [openTx, setOpenTx] = useState<Payment | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/payments");
        if (!res.ok) throw new Error("Failed to load payments");
        const data: { payments: ApiPayment[] } = await res.json();
        if (!cancelled) setPayments(data.payments.map(mapPayment));
      } catch (err) {
        if (!cancelled) console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = payments.filter(p => {
    if (tab !== "hammasi" && p.type !== tab) return false;
    if (statusFilter !== "hammasi" && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.userName.toLowerCase().includes(q) && !p.userPhone.includes(search) && !p.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    hammasi: payments.length,
    topup: payments.filter(p => p.type === "topup").length,
    boost: payments.filter(p => p.type === "boost").length,
    lead: payments.filter(p => p.type === "lead").length,
    refund: payments.filter(p => p.type === "refund").length,
  };

  const successful = payments.filter(p => p.status === "success");
  const totalIncome = successful.filter(p => p.type !== "refund").reduce((s, p) => s + p.amount, 0);
  const totalRefund = successful.filter(p => p.type === "refund").reduce((s, p) => s + p.amount, 0);
  const netRevenue = totalIncome - totalRefund;
  const today = (() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  })();
  const todayRevenue = successful.filter(p => p.date === today && p.type !== "refund").reduce((s, p) => s + p.amount, 0);

  const refund = async (id: string) => {
    const numericId = id.replace(/^TXN-/, "");
    try {
      const res = await fetch(`/api/admin/payments/${numericId}/refund`, { method: "POST" });
      if (!res.ok) throw new Error("Refund failed");
      const data: { refund: ApiPayment } = await res.json();
      setPayments(prev => [mapPayment(data.refund), ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setMenuOpen(null);
    }
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: config.text }}>To&apos;lovlar</h1>
            <p className="mt-1 text-sm" style={{ color: config.textMuted }}>Platformadagi barcha tranzaksiyalar, refundlar va daromadlar</p>
          </div>
          <button
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          >
            <Download className="w-4 h-4" />
            Eksport (CSV)
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <StatCard label="Jami daromad" value={`${(totalIncome / 1000000).toFixed(1)}M`} sub="muvaffaqiyatli tranzaksiyalar" icon={TrendingUp} accent="#22c55e" config={config} />
          <StatCard label="Bugungi daromad" value={`${(todayRevenue / 1000000).toFixed(1)}M`} sub={today} icon={Calendar} accent={config.accent} accentText={config.accentText} config={config} />
          <StatCard label="Refundlar" value={`${(totalRefund / 1000).toFixed(0)}K`} sub={`${successful.filter(p => p.type === "refund").length} ta`} icon={RotateCcw} accent="#ef4444" config={config} />
          <StatCard label="Sof daromad" value={`${(netRevenue / 1000000).toFixed(1)}M`} sub="daromad − refund" icon={ArrowUpRight} accent="#3b82f6" config={config} />
        </div>

        <div className="rounded-xl overflow-hidden mb-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex overflow-x-auto">
            {[
              { k: "hammasi" as const, label: "Hammasi", count: counts.hammasi, icon: CreditCard },
              { k: "topup" as const, label: "Balans", count: counts.topup, icon: Wallet },
              { k: "boost" as const, label: "Boost", count: counts.boost, icon: Zap },
              { k: "lead" as const, label: "Leadlar", count: counts.lead, icon: Users },
              { k: "refund" as const, label: "Refund", count: counts.refund, icon: RotateCcw },
            ].map(t => {
              const active = tab === t.k;
              const Icon = t.icon;
              return (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k)}
                  className="flex items-center gap-2 px-4 md:px-5 h-11 text-sm font-medium whitespace-nowrap transition-colors"
                  style={{
                    color: active ? config.text : config.textMuted,
                    backgroundColor: active ? config.active : "transparent",
                    borderBottom: active ? `2px solid ${config.accent}` : "2px solid transparent",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  <span className="ml-1 text-xs px-1.5 rounded" style={{ backgroundColor: config.hover, color: config.textMuted }}>{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="TXN ID, foydalanuvchi ismi, telefon..."
              className="w-full h-10 pl-10 pr-4 rounded-lg text-sm outline-none"
              style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            {(["hammasi", "success", "pending", "cancelled"] as const).map(s => {
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3 h-8 rounded-md text-xs font-medium transition-colors capitalize"
                  style={{
                    backgroundColor: active ? config.accent : "transparent",
                    color: active ? config.accentText : config.textMuted,
                  }}
                >
                  {s === "hammasi" ? "Barcha holat" : STATUS_CONFIG[s].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="hidden md:grid grid-cols-[1.1fr_1.5fr_1fr_0.9fr_1.1fr_40px] gap-3 px-5 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: config.textDim, borderBottom: `1px solid ${config.surfaceBorder}` }}>
            <div>TXN ID</div>
            <div>Foydalanuvchi</div>
            <div>Tur</div>
            <div>Summa</div>
            <div>Holat / Vaqt</div>
            <div></div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 rounded-full animate-spin mb-3" style={{ border: `2px solid ${config.surfaceBorder}`, borderTopColor: config.accent }} />
              <p className="text-sm" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <CreditCard className="w-10 h-10 mx-auto mb-3" style={{ color: config.textDim }} />
              <p className="text-sm" style={{ color: config.textMuted }}>Tranzaksiyalar topilmadi</p>
            </div>
          ) : (
            filtered.map((p, i) => {
              const typeCfg = TYPE_CONFIG[p.type];
              const statusCfg = STATUS_CONFIG[p.status];
              const TypeIcon = typeCfg.icon;
              const StatusIcon = statusCfg.icon;
              const isRefund = p.type === "refund";
              return (
                <div
                  key={p.id}
                  className="grid grid-cols-1 md:grid-cols-[1.1fr_1.5fr_1fr_0.9fr_1.1fr_40px] gap-3 px-5 py-4 items-center transition-colors"
                  style={{
                    borderBottom: i < filtered.length - 1 ? `1px solid ${config.surfaceBorder}` : "none",
                  }}
                >
                  <div>
                    <div className="font-mono text-sm font-semibold" style={{ color: config.text }}>{p.id}</div>
                    <div className="text-xs mt-0.5" style={{ color: config.textDim }}>{METHOD_LABEL[p.method]}</div>
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0" style={{ backgroundColor: config.hover, color: config.text }}>
                      {initials(p.userName)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium" style={{ color: config.text }}>{p.userName}</div>
                      <div className="text-xs truncate" style={{ color: config.textDim }}>{p.userPhone}</div>
                    </div>
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}>
                      <TypeIcon className="w-3.5 h-3.5" />
                      {typeCfg.label}
                    </div>
                    {p.note && <div className="mt-1 text-[11px] truncate max-w-[200px]" style={{ color: config.textDim }}>{p.note}</div>}
                  </div>

                  <div className="text-sm font-semibold tabular-nums" style={{ color: isRefund ? "#ef4444" : config.text }}>
                    {isRefund ? "−" : "+"}{fmt(p.amount)} so&apos;m
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: statusCfg.color }}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusCfg.label}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: config.textDim }}>{p.date} · {p.time}</div>
                  </div>

                  <div className="relative flex justify-end">
                    <button
                      onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                      className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                      style={{ color: config.textMuted }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = config.hover}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === p.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-9 z-20 w-48 rounded-lg py-1.5 shadow-xl" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                          <MenuBtn icon={ArrowUpRight} label="Batafsil" onClick={() => { setOpenTx(p); setMenuOpen(null); }} config={config} />
                          {p.type !== "refund" && p.status === "success" && (
                            <MenuBtn icon={RotateCcw} label="Refund qilish" onClick={() => refund(p.id)} config={config} danger />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs" style={{ color: config.textDim }}>
          <span>Jami: {filtered.length} ta tranzaksiya</span>
          <span>Yangilangan: hozir</span>
        </div>
      </div>

      {openTx && <PaymentDetailModal tx={openTx} onClose={() => setOpenTx(null)} onRefund={() => { refund(openTx.id); setOpenTx(null); }} config={config} />}
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent, accentText, config }: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Wallet;
  accent: string;
  accentText?: string;
  config: ReturnType<typeof useAdminTheme>["config"];
}) {
  return (
    <div className="p-4 md:p-5 rounded-xl" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] font-medium mb-1" style={{ color: config.textMuted }}>{label}</div>
          <div className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: config.text }}>{value}</div>
        </div>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent + "22" }}>
          <Icon className="w-4 h-4" style={{ color: accentText || accent }} />
        </div>
      </div>
      <div className="text-[11px] mt-2" style={{ color: config.textDim }}>{sub}</div>
    </div>
  );
}

function MenuBtn({ icon: Icon, label, onClick, config, danger }: {
  icon: typeof Wallet;
  label: string;
  onClick: () => void;
  config: ReturnType<typeof useAdminTheme>["config"];
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors"
      style={{ color: danger ? "#ef4444" : config.text }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = config.hover}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function PaymentDetailModal({ tx, onClose, onRefund, config }: {
  tx: Payment;
  onClose: () => void;
  onRefund: () => void;
  config: ReturnType<typeof useAdminTheme>["config"];
}) {
  const typeCfg = TYPE_CONFIG[tx.type];
  const statusCfg = STATUS_CONFIG[tx.status];
  const TypeIcon = typeCfg.icon;
  const StatusIcon = statusCfg.icon;
  const isRefund = tx.type === "refund";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-t-2xl md:rounded-2xl overflow-hidden"
        style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 md:px-6 py-4 flex items-start justify-between" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
          <div>
            <div className="font-mono text-lg font-bold" style={{ color: config.text }}>{tx.id}</div>
            <div className="text-xs mt-0.5" style={{ color: config.textMuted }}>{tx.date} · {tx.time}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center" style={{ color: config.textMuted }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 md:px-6 py-5 space-y-5">
          <div className="flex items-center justify-center py-6 rounded-xl" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}>
                <TypeIcon className="w-3.5 h-3.5" />
                {typeCfg.label}
              </div>
              <div className="text-3xl font-bold tabular-nums" style={{ color: isRefund ? "#ef4444" : config.text }}>
                {isRefund ? "−" : "+"}{fmt(tx.amount)} so&apos;m
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: statusCfg.color }}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusCfg.label}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: config.textDim }}>Foydalanuvchi</div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: config.hover, color: config.text }}>
                {initials(tx.userName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: config.text }}>{tx.userName}</div>
                <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: config.textMuted }}>
                  <Phone className="w-3 h-3" />
                  {tx.userPhone}
                </div>
              </div>
              <div className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                {tx.userRole === "teacher" ? "Kurs egasi" : "O'quvchi"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: config.textDim }}>Tafsilotlar</div>
            <div className="rounded-lg divide-y" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, borderColor: config.surfaceBorder }}>
              <DetailRow label="To'lov usuli" value={METHOD_LABEL[tx.method]} config={config} />
              {tx.refOrder && <DetailRow label={isRefund ? "Qaytarilgan tranzaksiya" : "Bog'liq buyurtma"} value={tx.refOrder} config={config} />}
              {tx.note && <DetailRow label="Izoh" value={tx.note} config={config} />}
            </div>
          </div>

          {tx.type !== "refund" && tx.status === "success" && (
            <div className="pt-2">
              <button
                onClick={onRefund}
                className="w-full h-11 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <RotateCcw className="w-4 h-4" />
                Refund qilish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, config }: { label: string; value: string; config: ReturnType<typeof useAdminTheme>["config"] }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 gap-3">
      <span className="text-xs" style={{ color: config.textMuted }}>{label}</span>
      <span className="text-sm font-medium text-right" style={{ color: config.text }}>{value}</span>
    </div>
  );
}
