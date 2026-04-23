"use client";

import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, Shield, Eye, FileText, Users, Wallet, Zap, BarChart3, Check, X, Send, Crown, User, AlertCircle, Lock } from "lucide-react";
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

interface ApiManager {
  id: number;
  name: string;
  phone: string;
  telegramChatId: string | null;
  canReply: boolean;
  canManage: boolean;
  active: boolean;
  createdAt: string;
}

// Map API manager to UI shape. Role is derived from permission flags.
function mapApiToUi(m: ApiManager): Manager {
  const role: Role = m.canManage ? "admin" : "sales";
  return {
    id: m.id,
    name: m.name,
    phone: m.phone,
    telegram: m.telegramChatId ? (m.telegramChatId.startsWith("@") ? m.telegramChatId : `@${m.telegramChatId}`) : undefined,
    role,
    permissions: ROLE_PRESETS[role].permissions,
    addedAt: m.createdAt?.slice(0, 10) ?? "",
    status: m.active ? "aktiv" : "taklif_qilindi",
  };
}

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
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [editor, setEditor] = useState<{ mode: "add" | "edit"; manager?: Manager } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Manager | null>(null);

  const reload = async () => {
    try {
      const res = await fetch("/api/dashboard/managers", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json() as { managers: ApiManager[] };
      setManagers(data.managers.map(mapApiToUi));
    } catch (e) {
      console.error("[managers] load failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const removeManager = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete.id;
    setConfirmDelete(null);
    try {
      const res = await fetch(`/api/dashboard/managers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setManagers(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      console.error("[managers] delete failed", e);
    }
  };

  const saveManager = async (m: Omit<Manager, "id" | "addedAt" | "status">) => {
    // Role admin => canManage. Any other role (sales/content/finance/custom) => !canManage but canReply.
    const canManage = m.role === "admin";
    const canReply = true;
    try {
      if (editor?.mode === "add") {
        const res = await fetch("/api/dashboard/managers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: m.name,
            phone: m.phone,
            telegramChatId: m.telegram || null,
            canReply,
            canManage,
          }),
        });
        if (res.ok) {
          const data = await res.json() as { manager: ApiManager };
          setManagers(prev => [mapApiToUi(data.manager), ...prev]);
        }
      } else if (editor?.mode === "edit" && editor.manager) {
        const res = await fetch(`/api/dashboard/managers/${editor.manager.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: m.name,
            phone: m.phone,
            telegramChatId: m.telegram || null,
            canReply,
            canManage,
          }),
        });
        if (res.ok) {
          const data = await res.json() as { manager: ApiManager };
          setManagers(prev => prev.map(x => x.id === data.manager.id ? mapApiToUi(data.manager) : x));
        }
      }
    } catch (e) {
      console.error("[managers] save failed", e);
    } finally {
      setEditor(null);
    }
  };

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <div className="max-w-[600px] mx-auto mt-8 md:mt-16">
        <div className="rounded-[20px] p-8 md:p-12 text-center" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="w-16 h-16 mx-auto mb-5 rounded-[18px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
            <Lock className="w-7 h-7" style={{ color: config.textMuted }} />
          </div>
          <h1 className="text-[22px] md:text-[24px] font-bold mb-2" style={{ color: config.text }}>Menejerlar</h1>
          <p className="text-[14px] mb-5" style={{ color: config.textMuted }}>
            Jamoaga menejer qo&apos;shish va ruxsatlarni boshqarish imkoniyati ustida ishlanmoqda
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold" style={{ backgroundColor: `${config.accent}22`, color: config.accent }}>
            ✨ Tez kunda
          </span>
        </div>
      </div>
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
