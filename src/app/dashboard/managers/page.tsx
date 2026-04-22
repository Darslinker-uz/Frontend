"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, Shield, Eye, FileText, Users, Wallet, Zap, BarChart3, Check, X, Send, Crown, User, AlertCircle } from "lucide-react";
import { useDashboardTheme } from "@/context/dashboard-theme-context";

type Permission = "view_leads" | "manage_leads" | "view_listings" | "create_listings" | "edit_listings" | "boost" | "view_balance" | "topup" | "view_stats" | "manage_managers";

const PERMISSIONS: { key: Permission; label: string; desc: string; icon: typeof Users; group: string }[] = [
  { key: "view_leads", label: "Arizalarni ko'rish", desc: "Barcha arizalarni ko'rish", icon: Eye, group: "Arizalar" },
  { key: "manage_leads", label: "Arizalarni boshqarish", desc: "Statusni o'zgartirish, izoh yozish", icon: Users, group: "Arizalar" },
  { key: "view_listings", label: "E'lonlarni ko'rish", desc: "Barcha e'lonlarni ko'rish", icon: Eye, group: "E'lonlar" },
  { key: "create_listings", label: "E'lon yaratish", desc: "Yangi e'lon qo'shish", icon: Plus, group: "E'lonlar" },
  { key: "edit_listings", label: "E'lon tahrirlash", desc: "Mavjud e'lonni o'zgartirish", icon: Pencil, group: "E'lonlar" },
  { key: "boost", label: "Boost qilish", desc: "E'lonlarni ko'tarish", icon: Zap, group: "E'lonlar" },
  { key: "view_balance", label: "Balansni ko'rish", desc: "Balans va tranzaksiyalar", icon: Wallet, group: "Moliya" },
  { key: "topup", label: "Balans to'ldirish", desc: "Balansga pul kiritish", icon: Wallet, group: "Moliya" },
  { key: "view_stats", label: "Statistika", desc: "Hisobotlar va tahlil", icon: BarChart3, group: "Boshqa" },
  { key: "manage_managers", label: "Menejerlarni boshqarish", desc: "Yangi menejer qo'shish/o'chirish", icon: UserCog as any, group: "Boshqa" },
];

type Role = "admin" | "sales" | "content" | "finance" | "custom";

const ROLE_PRESETS: Record<Role, { label: string; desc: string; color: string; permissions: Permission[] }> = {
  admin: {
    label: "To'liq admin",
    desc: "Barcha huquqlarga ega",
    color: "#a855f7",
    permissions: ["view_leads", "manage_leads", "view_listings", "create_listings", "edit_listings", "boost", "view_balance", "topup", "view_stats", "manage_managers"],
  },
  sales: {
    label: "Sales menejer",
    desc: "Faqat arizalar bilan ishlaydi",
    color: "#22c55e",
    permissions: ["view_leads", "manage_leads", "view_listings"],
  },
  content: {
    label: "Content menejer",
    desc: "E'lonlar va kontentni boshqaradi",
    color: "#3b82f6",
    permissions: ["view_listings", "create_listings", "edit_listings", "view_stats"],
  },
  finance: {
    label: "Moliya",
    desc: "Balans va to'lovlar",
    color: "#f59e0b",
    permissions: ["view_balance", "topup", "view_stats"],
  },
  custom: {
    label: "Maxsus",
    desc: "O'zingiz tanlaysiz",
    color: "#6b7280",
    permissions: [],
  },
};

interface Manager {
  id: number;
  name: string;
  phone: string;
  telegram?: string;
  role: Role;
  permissions: Permission[];
  addedAt: string;
  status: "aktiv" | "taklif_qilindi";
}

const initialManagers: Manager[] = [
  { id: 1, name: "Aziz Karimov", phone: "+998 90 111 22 33", telegram: "@azizk", role: "admin", permissions: ROLE_PRESETS.admin.permissions, addedAt: "2026-03-10", status: "aktiv" },
  { id: 2, name: "Nigora Saidova", phone: "+998 91 222 33 44", telegram: "@nigora_s", role: "sales", permissions: ROLE_PRESETS.sales.permissions, addedAt: "2026-03-25", status: "aktiv" },
  { id: 3, name: "Sardor Qodirov", phone: "+998 93 333 44 55", role: "content", permissions: ROLE_PRESETS.content.permissions, addedAt: "2026-04-05", status: "taklif_qilindi" },
];

const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
const avatarColor = (name: string) => {
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4", "#ef4444", "#f97316"];
  return colors[name.charCodeAt(0) % colors.length];
};

function UserCog(props: any) {
  return <Shield {...props} />;
}

export default function ManagersPage() {
  const { config } = useDashboardTheme();
  const [managers, setManagers] = useState<Manager[]>(initialManagers);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [editor, setEditor] = useState<{ mode: "add" | "edit"; manager?: Manager } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Manager | null>(null);

  const removeManager = () => {
    if (!confirmDelete) return;
    setManagers(prev => prev.filter(m => m.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>Menejerlar</h1>
          <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>Jamoaga menejer qo&apos;shing va huquqlarini belgilang</p>
        </div>
        <button onClick={() => setEditor({ mode: "add" })} className="h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2 hover:opacity-90" style={{ backgroundColor: config.accent, color: config.accentText }}>
          <Plus className="w-4 h-4" /> Menejer qo&apos;shish
        </button>
      </div>

      {/* Info card */}
      <div className="rounded-[14px] p-4 mb-5 flex items-start gap-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: config.hover }}>
          <AlertCircle className="w-4 h-4" style={{ color: config.textMuted }} />
        </div>
        <div>
          <p className="text-[13px] font-medium" style={{ color: config.text }}>Menejer qanday ishlaydi?</p>
          <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>Siz menejerga taklif yuborasiz. U Telegram bot orqali kirib, belgilangan huquqlar bilan dashboard ga ulanadi.</p>
        </div>
      </div>

      {/* Managers list */}
      <div className="space-y-3">
        {managers.map((m) => {
          const role = ROLE_PRESETS[m.role];
          return (
            <div key={m.id} className="rounded-[14px] p-4 md:p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-[14px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(m.name) }}>
                  {initials(m.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-[15px] font-semibold" style={{ color: config.text }}>{m.name}</p>
                    <span className="h-[20px] px-2 rounded-full text-[10px] font-bold flex items-center gap-1" style={{ backgroundColor: `${role.color}20`, color: role.color }}>
                      {m.role === "admin" && <Crown className="w-2.5 h-2.5" />}
                      {role.label}
                    </span>
                    {m.status === "taklif_qilindi" && (
                      <span className="h-[20px] px-2 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-400">Taklif kutilmoqda</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[12px] mb-2" style={{ color: config.textMuted }}>
                    <span>{m.phone}</span>
                    {m.telegram && <span>{m.telegram}</span>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px]" style={{ color: config.textDim }}>{m.permissions.length} ta huquq:</span>
                    {m.permissions.slice(0, 3).map((p) => {
                      const perm = PERMISSIONS.find(x => x.key === p);
                      return perm ? <span key={p} className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: config.textMuted, backgroundColor: config.hover }}>{perm.label}</span> : null;
                    })}
                    {m.permissions.length > 3 && <span className="text-[11px]" style={{ color: config.textDim }}>+{m.permissions.length - 3}</span>}
                  </div>
                </div>
                <div className="relative">
                  <button onClick={() => setMenuOpen(menuOpen === m.id ? null : m.id)} className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.surface, color: config.textMuted }}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {menuOpen === m.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                      <div className="absolute right-0 top-10 z-50 w-[200px] rounded-[10px] shadow-xl py-1" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                        <button onClick={() => { setEditor({ mode: "edit", manager: m }); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px]" style={{ color: config.textMuted }}>
                          <Pencil className="w-3.5 h-3.5" /> Tahrirlash
                        </button>
                        <div className="my-1" style={{ borderTop: `1px solid ${config.surfaceBorder}` }} />
                        <button onClick={() => { setConfirmDelete(m); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06]">
                          <Trash2 className="w-3.5 h-3.5" /> Olib tashlash
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {managers.length === 0 && (
          <div className="rounded-[14px] border border-dashed p-12 text-center" style={{ borderColor: config.surfaceBorder }}>
            <p className="text-[14px]" style={{ color: config.textMuted }}>Hali menejer qo&apos;shilmagan</p>
          </div>
        )}
      </div>

      {/* Editor modal */}
      {editor && <ManagerEditor editor={editor} onClose={() => setEditor(null)} onSave={(m) => {
        if (editor.mode === "add") {
          setManagers(prev => [...prev, { ...m, id: Date.now(), addedAt: new Date().toISOString().slice(0, 10), status: "taklif_qilindi" }]);
        } else if (editor.mode === "edit" && editor.manager) {
          setManagers(prev => prev.map(x => x.id === editor.manager!.id ? { ...x, ...m } : x));
        }
        setEditor(null);
      }} />}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative rounded-[18px] p-6 max-w-[420px] w-full" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-[12px] bg-red-500/15 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold" style={{ color: config.text }}>Menejerni olib tashlash</h3>
                <p className="text-[13px] mt-1" style={{ color: config.textMuted }}><span className="font-medium" style={{ color: config.text }}>{confirmDelete.name}</span> dashboard ga kirish huquqidan mahrum bo&apos;ladi. Bu amaliyotni qaytarish mumkin.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>Bekor</button>
              <button onClick={removeManager} className="flex-1 h-[44px] rounded-[10px] bg-red-500 text-white text-[14px] font-medium hover:bg-red-500/90">Ha, olib tashlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============== MANAGER EDITOR MODAL ==============

function ManagerEditor({ editor, onClose, onSave }: {
  editor: { mode: "add" | "edit"; manager?: Manager };
  onClose: () => void;
  onSave: (m: Omit<Manager, "id" | "addedAt" | "status">) => void;
}) {
  const { config } = useDashboardTheme();
  const m = editor.manager;
  const [name, setName] = useState(m?.name || "");
  const [phone, setPhone] = useState(m?.phone || "");
  const [telegram, setTelegram] = useState(m?.telegram || "");
  const [role, setRole] = useState<Role>(m?.role || "sales");
  const [permissions, setPermissions] = useState<Permission[]>(m?.permissions || ROLE_PRESETS.sales.permissions);

  const selectRole = (r: Role) => {
    setRole(r);
    if (r !== "custom") {
      setPermissions(ROLE_PRESETS[r].permissions);
    }
  };

  const togglePerm = (p: Permission) => {
    setRole("custom");
    setPermissions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const canSave = name.trim() && phone.trim() && permissions.length > 0;

  // Group permissions
  const groups = PERMISSIONS.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p);
    return acc;
  }, {} as Record<string, typeof PERMISSIONS>);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-[20px] w-full max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
        {/* Header */}
        <div className="sticky top-0 px-6 pt-5 pb-4 flex items-center justify-between" style={{ backgroundColor: config.sidebar, borderBottom: `1px solid ${config.surfaceBorder}` }}>
          <div>
            <h2 className="text-[18px] font-bold" style={{ color: config.text }}>{editor.mode === "add" ? "Yangi menejer" : "Menejerni tahrirlash"}</h2>
            <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>Ma&apos;lumotlar va huquqlarni belgilang</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover }}>
            <X className="w-4 h-4" style={{ color: config.textMuted }} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Asosiy */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: config.textDim }}>Shaxsiy ma&apos;lumotlar</p>
            <div className="space-y-3">
              <div>
                <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Ism familiya *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism familiya" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              </div>
              <div>
                <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Telefon *</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              </div>
              <div>
                <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Telegram <span style={{ color: config.textDim }}>(ixtiyoriy)</span></label>
                <input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@username" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              </div>
            </div>
          </div>

          {/* Rol presetlar */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: config.textDim }}>Rol (tez tanlash)</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ROLE_PRESETS) as Role[]).map((r) => {
                const preset = ROLE_PRESETS[r];
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => selectRole(r)}
                    className="text-left p-3 rounded-[12px] border-2 transition-all"
                    style={{
                      backgroundColor: isActive ? config.hover : config.surface,
                      borderColor: isActive ? preset.color : config.surfaceBorder,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.color }} />
                      <span className="text-[13px] font-semibold" style={{ color: config.text }}>{preset.label}</span>
                      {isActive && <Check className="w-3.5 h-3.5 ml-auto" style={{ color: preset.color }} />}
                    </div>
                    <p className="text-[11px]" style={{ color: config.textMuted }}>{preset.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Huquqlar */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: config.textDim }}>Huquqlar ({permissions.length})</p>
            <div className="space-y-4">
              {Object.entries(groups).map(([groupName, perms]) => (
                <div key={groupName} className="rounded-[12px] p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                  <p className="text-[12px] font-semibold mb-2 px-1" style={{ color: config.textMuted }}>{groupName}</p>
                  <div className="space-y-1">
                    {perms.map((p) => {
                      const checked = permissions.includes(p.key);
                      const Icon = p.icon;
                      return (
                        <label key={p.key} className="flex items-center gap-3 py-2 px-2 rounded-[8px] cursor-pointer" style={{ backgroundColor: "transparent" }}>
                          <button
                            type="button"
                            onClick={() => togglePerm(p.key)}
                            className="w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 transition-all"
                            style={{
                              backgroundColor: checked ? config.accent : "transparent",
                              borderColor: checked ? config.accent : config.surfaceBorder,
                            }}
                          >
                            {checked && <Check className="w-3 h-3" style={{ color: config.accentText }} />}
                          </button>
                          <Icon className="w-4 h-4 shrink-0" style={{ color: config.textMuted }} />
                          <div className="flex-1">
                            <p className="text-[13px]" style={{ color: config.text }}>{p.label}</p>
                            <p className="text-[11px]" style={{ color: config.textDim }}>{p.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 flex gap-2" style={{ backgroundColor: config.sidebar, borderTop: `1px solid ${config.surfaceBorder}` }}>
          <button onClick={onClose} className="flex-1 h-[46px] rounded-[10px] text-[14px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>Bekor</button>
          <button
            disabled={!canSave}
            onClick={() => canSave && onSave({ name, phone, telegram: telegram || undefined, role, permissions })}
            className="flex-1 h-[46px] rounded-[10px] text-[14px] font-medium flex items-center justify-center gap-2"
            style={canSave ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textDim, cursor: "not-allowed" }}
          >
            {editor.mode === "add" ? <><Send className="w-4 h-4" /> Taklif yuborish</> : "Saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}
