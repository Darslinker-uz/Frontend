"use client";

import { useEffect, useState } from "react";
import { Search, MoreHorizontal, Shield, GraduationCap, User as UserIcon, UserCog, Ban, CheckCircle2, Trash2, Eye, Phone, Calendar, X, Wallet, Plus, Minus, FilePlus2 } from "lucide-react";
import Link from "next/link";
import { useAdminTheme } from "@/context/admin-theme-context";

type Role = "admin" | "provider" | "student" | "assistant";

interface User {
  id: number;
  name: string;
  centerName: string | null;
  phone: string;
  email: string | null;
  telegramChatId: string | null;
  role: Role;
  banned: boolean;
  balance: number;
  createdAt: string;
  lastActiveAt: string;
  listingsCount: number;
  revenue?: number;
  leadsCount?: number;
}

const ROLE_CONFIG: Record<Role, { label: string; icon: typeof Shield; color: string }> = {
  admin: { label: "Admin", icon: Shield, color: "#a855f7" },
  provider: { label: "Kurs egasi", icon: GraduationCap, color: "#3b82f6" },
  student: { label: "O'quvchi", icon: UserIcon, color: "#22c55e" },
  assistant: { label: "Yordamchi", icon: UserCog, color: "#7ea2d4" },
};

const initials = (n: string) => n.split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase();
const avatarColor = (n: string) => {
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4", "#ef4444", "#f97316"];
  return colors[n.charCodeAt(0) % colors.length];
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("uz-UZ", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch { return iso.slice(0, 10); }
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Hozir";
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 172800) return "Kecha";
  return `${Math.floor(diff / 86400)} kun oldin`;
}

export default function AdminUsersPage() {
  const { config } = useAdminTheme();
  const [tab, setTab] = useState<"hammasi" | Role>("hammasi");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [openUser, setOpenUser] = useState<User | null>(null);
  const [topupUser, setTopupUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/users");
      const data = await r.json();
      setUsers(data.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter(u => {
    if (tab !== "hammasi" && u.role !== tab) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.phone.includes(search)) return false;
    return true;
  });

  const counts = {
    hammasi: users.length,
    admin: users.filter(u => u.role === "admin").length,
    provider: users.filter(u => u.role === "provider").length,
    student: users.filter(u => u.role === "student").length,
    assistant: users.filter(u => u.role === "assistant").length,
  };

  const toggleBlock = async (user: User) => {
    setMenuOpen(null);
    const prev = [...users];
    setUsers(p => p.map(u => u.id === user.id ? { ...u, banned: !u.banned } : u));
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banned: !user.banned }),
      });
    } catch (e) {
      console.error(e);
      setUsers(prev);
    }
  };

  const deleteUser = async (id: number) => {
    const prev = [...users];
    setUsers(p => p.filter(u => u.id !== id));
    setOpenUser(null);
    try {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
      setUsers(prev);
    }
  };

  const clearUserTelegram = async (user: User) => {
    try {
      const r = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramChatId: null }),
      });
      if (!r.ok) return;
      setUsers(p => p.map(u => (u.id === user.id ? { ...u, telegramChatId: null } : u)));
      setOpenUser(ou => (ou && ou.id === user.id ? { ...ou, telegramChatId: null } : ou));
    } catch (e) {
      console.error(e);
    }
  };

  const topup = async (userId: number, amount: number, note: string) => {
    const res = await fetch(`/api/admin/users/${userId}/topup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, note: note || undefined }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Xatolik");
    setUsers(p => p.map(u => u.id === userId ? { ...u, balance: data.user.balance } : u));
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>Foydalanuvchilar</h1>
        <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>
          {loading ? "Yuklanmoqda..." : `${users.length} ta foydalanuvchi`}
        </p>
      </div>

      <div className="mb-4 max-w-[400px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism yoki telefon..."
            className="w-full h-[42px] pl-10 pr-4 rounded-[10px] text-[14px] focus:outline-none transition-colors"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {[
          { key: "hammasi" as const, label: "Hammasi", count: counts.hammasi },
          { key: "provider" as const, label: "Kurs egalari", count: counts.provider },
          { key: "student" as const, label: "O'quvchilar", count: counts.student },
          { key: "admin" as const, label: "Adminlar", count: counts.admin },
          { key: "assistant" as const, label: "Yordamchilar", count: counts.assistant },
        ].map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="shrink-0 h-[36px] px-4 rounded-full text-[13px] font-medium transition-all flex items-center gap-2"
              style={{
                backgroundColor: isActive ? config.accent : config.surface,
                color: isActive ? config.accentText : config.textMuted,
                border: `1px solid ${isActive ? config.accent : config.surfaceBorder}`,
              }}
            >
              {t.label}
              <span
                className="text-[11px] px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: isActive ? `${config.accentText}22` : config.hover, color: isActive ? config.accentText : config.textDim }}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="rounded-[14px]" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          {filtered.map((u, i) => {
            const Icon = ROLE_CONFIG[u.role].icon;
            const roleColor = ROLE_CONFIG[u.role].color;
            return (
              <div key={u.id} className="flex items-center gap-3 px-4 md:px-5 py-3 md:py-4" style={{ borderTop: i > 0 ? `1px solid ${config.surfaceBorder}` : "none" }}>
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-[12px] flex items-center justify-center text-[13px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(u.name) }}>
                  {initials(u.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[14px] font-semibold truncate" style={{ color: config.text }}>
                      {u.name}
                      {u.role === "provider" && u.centerName && (
                        <span className="font-normal" style={{ color: config.textMuted }}> — {u.centerName}</span>
                      )}
                    </p>
                    <span className="h-[20px] px-2 rounded-full text-[10px] font-bold flex items-center gap-1" style={{ backgroundColor: `${roleColor}22`, color: roleColor }}>
                      <Icon className="w-2.5 h-2.5" />
                      {ROLE_CONFIG[u.role].label}
                    </span>
                    {u.banned && (
                      <span className="h-[20px] px-2 rounded-full text-[10px] font-medium bg-red-500/20 text-red-400 flex items-center gap-1">
                        <Ban className="w-2.5 h-2.5" /> Bloklangan
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[12px]" style={{ color: config.textMuted }}>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{u.phone}</span>
                    <span className="hidden md:flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(u.createdAt)}</span>
                    <span className="hidden lg:inline">•</span>
                    <span className="hidden lg:inline" style={{ color: config.textDim }}>{timeAgo(u.lastActiveAt)}</span>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-end gap-0.5 shrink-0 min-w-[120px]">
                  {u.role === "provider" && (
                    <>
                      <p className="text-[12px] font-semibold flex items-center gap-1" style={{ color: config.text }}>
                        <Wallet className="w-3 h-3" style={{ color: config.textMuted }} />
                        {u.balance.toLocaleString()} so&apos;m
                      </p>
                      <p className="text-[11px]" style={{ color: config.textDim }}>{u.listingsCount} e&apos;lon</p>
                    </>
                  )}
                  {u.role === "student" && (
                    <p className="text-[12px] font-semibold" style={{ color: config.text }}>{u.leadsCount ?? 0} ariza</p>
                  )}
                </div>

                <div className="relative shrink-0">
                  <button
                    onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-colors"
                    style={{ backgroundColor: config.hover, color: config.textMuted }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {menuOpen === u.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                      <div className="absolute right-0 top-11 z-50 w-[200px] rounded-[12px] p-1.5 shadow-2xl" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                        <MenuItem
                          icon={Eye}
                          label="Batafsil"
                          color={config.text}
                          onClick={() => { setOpenUser(u); setMenuOpen(null); }}
                        />
                        {u.role === "provider" && (
                          <MenuItem
                            icon={FilePlus2}
                            label="E'lon qo'shish"
                            color={config.text}
                            href={`/admode/listings/new?providerId=${u.id}`}
                            onClick={() => setMenuOpen(null)}
                          />
                        )}
                        {u.role === "provider" && (
                          <MenuItem
                            icon={Wallet}
                            label="Balans"
                            color="#22c55e"
                            onClick={() => { setTopupUser(u); setMenuOpen(null); }}
                          />
                        )}
                        <div className="h-px my-1" style={{ backgroundColor: config.surfaceBorder }} />
                        <MenuItem
                          icon={!u.banned ? Ban : CheckCircle2}
                          label={!u.banned ? "Bloklash" : "Blokdan chiqarish"}
                          color={!u.banned ? "#ef4444" : "#22c55e"}
                          onClick={() => toggleBlock(u)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Foydalanuvchi topilmadi</p>
        </div>
      )}

      {openUser && (
        <UserDetailModal
          user={openUser}
          onClose={() => setOpenUser(null)}
          onToggleBlock={() => toggleBlock(openUser)}
          onDelete={() => deleteUser(openUser.id)}
          onClearTelegram={() => clearUserTelegram(openUser)}
        />
      )}

      {topupUser && (
        <TopUpModal
          user={topupUser}
          onClose={() => setTopupUser(null)}
          onSubmit={async (amount, note) => {
            await topup(topupUser.id, amount, note);
            setTopupUser(null);
          }}
        />
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, color, onClick, href }: { icon: typeof Eye; label: string; color: string; onClick?: () => void; href?: string }) {
  const { config } = useAdminTheme();
  const [hover, setHover] = useState(false);
  const cls = "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors";
  const style = { backgroundColor: hover ? config.hover : "transparent", color };
  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={cls}
        style={style}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span>{label}</span>
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cls}
      style={style}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function TopUpModal({ user, onClose, onSubmit }: { user: User; onClose: () => void; onSubmit: (amount: number, note: string) => Promise<void> }) {
  const { config } = useAdminTheme();
  const isLight = config.id === "light" || config.id === "cream";
  const [mode, setMode] = useState<"add" | "subtract">("add");
  const [amountStr, setAmountStr] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = Number(amountStr.replace(/\D/g, ""));
  const signedAmount = mode === "add" ? amount : -amount;
  const nextBalance = user.balance + signedAmount;
  const canSubmit = amount > 0 && nextBalance >= 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(signedAmount, note);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xatolik");
      setSubmitting(false);
    }
  };

  const presets = [50000, 100000, 200000, 500000, 1000000];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-[18px] w-full max-w-[440px] p-5" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-bold" style={{ color: config.text }}>Balansni sozlash</h2>
            <p className="text-[12px] mt-1" style={{ color: config.textMuted }}>{user.name} · {user.phone}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-[12px] p-3 mb-4 flex items-center justify-between" style={{ backgroundColor: config.hover }}>
          <span className="text-[12px]" style={{ color: config.textMuted }}>Joriy balans</span>
          <span className="text-[15px] font-bold" style={{ color: config.text }}>{user.balance.toLocaleString()} so&apos;m</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <button onClick={() => setMode("add")} className="h-[40px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-1.5" style={mode === "add" ? { backgroundColor: "#22c55e", color: "#ffffff" } : { backgroundColor: config.hover, color: config.textMuted, border: `1px solid ${config.surfaceBorder}` }}>
            <Plus className="w-3.5 h-3.5" /> Qo&apos;shish
          </button>
          <button onClick={() => setMode("subtract")} className="h-[40px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-1.5" style={mode === "subtract" ? { backgroundColor: "#ef4444", color: "#ffffff" } : { backgroundColor: config.hover, color: config.textMuted, border: `1px solid ${config.surfaceBorder}` }}>
            <Minus className="w-3.5 h-3.5" /> Kamaytirish
          </button>
        </div>

        <div className="mb-3">
          <label className="text-[11px] block mb-1.5" style={{ color: config.textDim }}>Summa (so&apos;m)</label>
          <input
            type="text"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="0"
            className="w-full h-[44px] px-4 rounded-[10px] text-[16px] font-semibold focus:outline-none"
            style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {presets.map(p => (
              <button key={p} type="button" onClick={() => setAmountStr(String(p))} className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted, border: `1px solid ${config.surfaceBorder}` }}>
                {p >= 1000000 ? `${p / 1000000}M` : `${p / 1000}k`}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[11px] block mb-1.5" style={{ color: config.textDim }}>Izoh (ixtiyoriy)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Masalan: Qaytarib berish, sovg'a..."
            className="w-full h-[40px] px-4 rounded-[10px] text-[13px] focus:outline-none"
            style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        </div>

        {amount > 0 && (
          <div className="rounded-[10px] p-3 mb-4 flex items-center justify-between" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}>
            <span className="text-[12px]" style={{ color: config.textMuted }}>Yangi balans</span>
            <span className="text-[15px] font-bold" style={{ color: nextBalance < 0 ? "#ef4444" : mode === "add" ? "#22c55e" : config.text }}>
              {nextBalance.toLocaleString()} so&apos;m
            </span>
          </div>
        )}

        {error && (
          <p className="text-[12px] mb-3" style={{ color: "#ef4444" }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full h-[44px] rounded-[10px] text-[14px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: config.accent, color: config.accentText }}
        >
          {submitting ? "Yuborilmoqda..." : mode === "add" ? "Balansga qo'shish" : "Balansdan kamaytirish"}
        </button>

        {mode === "add" && user.telegramChatId && (
          <p className="text-[11px] text-center mt-2" style={{ color: config.textDim }}>
            Userga Telegram orqali xabar yuboriladi
          </p>
        )}
        {mode === "add" && !user.telegramChatId && (
          <p className="text-[11px] text-center mt-2" style={{ color: "#f59e0b" }}>
            User Telegram'ga ulanmagan — xabar yuborilmaydi
          </p>
        )}
      </div>
    </div>
  );
}

function UserDetailModal({
  user,
  onClose,
  onToggleBlock,
  onDelete,
  onClearTelegram,
}: {
  user: User;
  onClose: () => void;
  onToggleBlock: () => void;
  onDelete: () => void;
  onClearTelegram: () => void | Promise<void>;
}) {
  const { config } = useAdminTheme();
  const [clearingTg, setClearingTg] = useState(false);
  const Icon = ROLE_CONFIG[user.role].icon;
  const roleColor = ROLE_CONFIG[user.role].color;
  const isLight = config.id === "light" || config.id === "cream";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-[20px] w-full max-w-[520px] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
        <div className="sticky top-0 px-6 pt-6 pb-4 flex items-start justify-between" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, borderBottom: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-[16px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(user.name) }}>
              {initials(user.name)}
            </div>
            <div>
              <h2 className="text-[18px] font-bold" style={{ color: config.text }}>{user.name}</h2>
              {user.role === "provider" && user.centerName && (
                <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>{user.centerName}</p>
              )}
              <span className="inline-flex items-center gap-1 mt-1 h-[22px] px-2.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: `${roleColor}22`, color: roleColor }}>
                <Icon className="w-3 h-3" />
                {ROLE_CONFIG[user.role].label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Kontakt</p>
            <div className="rounded-[12px] p-4 space-y-2.5" style={{ backgroundColor: config.hover }}>
              <div className="flex items-center gap-2 text-[13px]" style={{ color: config.text }}>
                <Phone className="w-3.5 h-3.5" style={{ color: config.textMuted }} />
                {user.phone}
              </div>
              {user.telegramChatId && (
                <div className="flex items-center gap-2 text-[13px]" style={{ color: config.text }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" style={{ color: config.textMuted }}>
                    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                  </svg>
                  <span className="break-all">{user.telegramChatId}</span>
                </div>
              )}
              {user.role === "provider" && user.telegramChatId && (
                <button
                  type="button"
                  disabled={clearingTg}
                  onClick={async () => {
                    if (!confirm("Telegram chat ID tozalanadi. Markaz keyin bot orqali qayta ulashi kerak. Davom etasizmi?")) return;
                    setClearingTg(true);
                    try {
                      await onClearTelegram();
                    } finally {
                      setClearingTg(false);
                    }
                  }}
                  className="mt-2 w-full h-[40px] rounded-[10px] text-[12px] font-medium border transition-opacity disabled:opacity-50"
                  style={{ borderColor: config.surfaceBorder, color: "#b45309", backgroundColor: "#fffbeb" }}
                >
                  {clearingTg ? "Tozalanmoqda..." : "Telegram ID ni tozalash (noto'g'ri id / chat not found)"}
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Statistika</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                <p className="text-[11px]" style={{ color: config.textMuted }}>Ro&apos;yxatdan o&apos;tgan</p>
                <p className="text-[14px] font-semibold mt-0.5" style={{ color: config.text }}>{formatDate(user.createdAt)}</p>
              </div>
              <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                <p className="text-[11px]" style={{ color: config.textMuted }}>Oxirgi faoliyat</p>
                <p className="text-[14px] font-semibold mt-0.5" style={{ color: config.text }}>{timeAgo(user.lastActiveAt)}</p>
              </div>
              {user.role === "provider" && (
                <>
                  <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                    <p className="text-[11px]" style={{ color: config.textMuted }}>E&apos;lonlar</p>
                    <p className="text-[14px] font-semibold mt-0.5" style={{ color: config.text }}>{user.listingsCount}</p>
                  </div>
                  <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                    <p className="text-[11px]" style={{ color: config.textMuted }}>Daromad</p>
                    <p className="text-[14px] font-semibold mt-0.5" style={{ color: config.text }}>{(user.revenue ?? 0).toLocaleString()} so&apos;m</p>
                  </div>
                </>
              )}
              {user.role === "student" && (
                <div className="rounded-[12px] p-3 col-span-2" style={{ backgroundColor: config.hover }}>
                  <p className="text-[11px]" style={{ color: config.textMuted }}>Qoldirgan arizalar</p>
                  <p className="text-[14px] font-semibold mt-0.5" style={{ color: config.text }}>{user.leadsCount ?? 0}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onToggleBlock}
              className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium"
              style={{ backgroundColor: !user.banned ? "#ef444422" : "#22c55e22", color: !user.banned ? "#ef4444" : "#22c55e" }}
            >
              {!user.banned ? "Bloklash" : "Blokdan chiqarish"}
            </button>
            <button
              onClick={onDelete}
              className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium"
              style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1.5" />
              O&apos;chirish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
