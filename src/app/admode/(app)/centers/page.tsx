"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Building2, GraduationCap, Eye, Ban, CheckCircle2, ExternalLink, Phone, Calendar, BookOpen, X, MoreHorizontal, Edit3, Save, RefreshCw } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type ProfileType = "CENTER" | "TUTOR";

type Center = {
  id: number;
  name: string;
  centerName: string | null;
  slug: string | null;
  bio: string | null;
  phone: string;
  email: string | null;
  telegramChatId: string | null;
  banned: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  lastActiveAt: string;
  listingsTotal: number;
  listingsActive: number;
  totalViews: number;
  categories: string[];
};

const initials = (s: string) => s.split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase();
const avatarGradient = (id: number) => {
  const gradients = [
    "linear-gradient(135deg, #6366f1, #8b5cf6)",
    "linear-gradient(135deg, #10b981, #06b6d4)",
    "linear-gradient(135deg, #f59e0b, #ef4444)",
    "linear-gradient(135deg, #0ea5e9, #6366f1)",
    "linear-gradient(135deg, #ec4899, #8b5cf6)",
    "linear-gradient(135deg, #14b8a6, #06b6d4)",
  ];
  return gradients[Math.abs(id) % gradients.length];
};

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short", year: "numeric" });
};

export default function CentersAdminPage() {
  const { config } = useAdminTheme();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "banned" | "pending">("all");
  const [editing, setEditing] = useState<Center | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (status !== "all") qs.set("status", status);
    if (search.trim()) qs.set("search", search.trim());
    const r = await fetch(`/api/admin/centers?${qs.toString()}`);
    if (r.ok) {
      const data = await r.json();
      setCenters(data.centers ?? []);
    }
    setLoading(false);
  }, [status, search]);

  useEffect(() => { load(); }, [load]);

  const total = centers.length;
  const activeCount = centers.filter(c => !c.banned && c.onboardingCompleted).length;
  const pendingCount = centers.filter(c => !c.banned && !c.onboardingCompleted).length;
  const bannedCount = centers.filter(c => c.banned).length;

  return (
    <div className="px-5 md:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] md:text-[30px] font-bold tracking-[-0.02em]" style={{ color: config.text }}>
            O&apos;quv markazlar
          </h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: config.textMuted }}>
            Markazlar moderatsiyasi: ban, edit, profile turi
          </p>
        </div>
        <button
          onClick={() => load()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors"
          style={{ backgroundColor: config.hover, color: config.textMuted }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Yangilash
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: "Jami", value: total, icon: Building2, color: "#7ea2d4" },
          { label: "Faol", value: activeCount, icon: CheckCircle2, color: "#22c55e" },
          { label: "Kutilmoqda", value: pendingCount, icon: Calendar, color: "#f59e0b" },
          { label: "Bloklangan", value: bannedCount, icon: Ban, color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="rounded-[14px] p-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[20px] md:text-[24px] font-bold leading-none" style={{ color: config.text }}>{s.value}</div>
                <div className="text-[11px] mt-1" style={{ color: config.textMuted }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 px-3 rounded-[10px]" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: config.textMuted }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Markaz nomi, telefon yoki slug bo'yicha qidirish..."
            className="flex-1 bg-transparent text-[14px] py-2.5 outline-none"
            style={{ color: config.text }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: config.textMuted }}>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] p-1" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          {(["all", "active", "pending", "banned"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-colors"
              style={{
                backgroundColor: status === s ? config.accent : "transparent",
                color: status === s ? config.accentText : config.textMuted,
              }}
            >
              {s === "all" ? "Hammasi" : s === "active" ? "Faol" : s === "pending" ? "Kutilmoqda" : "Bloklangan"}
            </button>
          ))}
        </div>
      </div>

      {/* Centers list */}
      {loading ? (
        <div className="rounded-[14px] p-10 text-center" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.textMuted }}>
          Yuklanmoqda...
        </div>
      ) : centers.length === 0 ? (
        <div className="rounded-[14px] p-10 text-center" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: config.textMuted }} />
          <h3 className="text-[16px] font-bold" style={{ color: config.text }}>Markaz topilmadi</h3>
          <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>Filter yoki qidiruv shartlarini o&apos;zgartiring</p>
        </div>
      ) : (
        <div className="space-y-2">
          {centers.map((c) => (
            <CenterRow key={c.id} center={c} config={config} onEdit={() => setEditing(c)} onReload={load} />
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <EditCenterModal
          center={editing}
          config={config}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function CenterRow({ center, config, onEdit, onReload }: {
  center: Center;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  onEdit: () => void;
  onReload: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const display = center.centerName?.trim() || center.name;
  const statusBadge = center.banned
    ? { label: "Bloklangan", color: "#ef4444", bg: "#ef444420" }
    : !center.onboardingCompleted
      ? { label: "Kutilmoqda", color: "#f59e0b", bg: "#f59e0b20" }
      : { label: "Faol", color: "#22c55e", bg: "#22c55e20" };

  async function toggleBan() {
    setMenuOpen(false);
    if (!confirm(center.banned ? `${display} ni qaytadan faollashtiramizmi?` : `${display} ni bloklaymizmi?`)) return;
    const r = await fetch(`/api/admin/centers/${center.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banned: !center.banned }),
    });
    if (r.ok) onReload();
    else alert("Xatolik. Qaytadan urinib ko'ring.");
  }

  return (
    <div className="rounded-[14px] p-4 md:p-5 flex items-center gap-3 md:gap-4 transition-colors" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <div className="w-11 h-11 md:w-12 md:h-12 rounded-[12px] flex items-center justify-center text-white text-[16px] md:text-[18px] font-bold shrink-0" style={{ background: avatarGradient(center.id) }}>
        {initials(display)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-[14px] md:text-[15px] font-bold truncate" style={{ color: config.text }}>{display}</h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider" style={{ backgroundColor: statusBadge.bg, color: statusBadge.color }}>
            {statusBadge.label}
          </span>
          {center.slug && (
            <span className="text-[11px] truncate" style={{ color: config.textMuted }}>
              /{center.slug}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 md:gap-4 mt-1.5 text-[12px]" style={{ color: config.textMuted }}>
          <span className="inline-flex items-center gap-1">
            <Phone className="w-3 h-3" /> {center.phone}
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> {center.listingsActive}/{center.listingsTotal} kurs
          </span>
          <span className="hidden md:inline-flex items-center gap-1">
            <Eye className="w-3 h-3" /> {center.totalViews} ko&apos;rish
          </span>
        </div>
        {center.categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-2">
            {center.categories.slice(0, 4).map(cat => (
              <span key={cat} className="text-[10.5px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                {cat}
              </span>
            ))}
            {center.categories.length > 4 && (
              <span className="text-[10.5px]" style={{ color: config.textMuted }}>+{center.categories.length - 4}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {center.slug && (
          <Link
            href={`/oquv-markazlar/${center.slug}`}
            target="_blank"
            className="p-2 rounded-[8px] transition-colors"
            style={{ color: config.textMuted }}
            title="Public sahifa"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
        <button
          onClick={onEdit}
          className="p-2 rounded-[8px] transition-colors"
          style={{ color: config.textMuted }}
          title="Tahrirlash"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="p-2 rounded-[8px] transition-colors"
            style={{ color: config.textMuted }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] rounded-[10px] py-1.5 shadow-xl" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                <button
                  onClick={toggleBan}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium hover:opacity-80 transition-opacity"
                  style={{ color: center.banned ? "#22c55e" : "#ef4444" }}
                >
                  {center.banned ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Faollashtirish</>
                  ) : (
                    <><Ban className="w-3.5 h-3.5" /> Bloklash</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EditCenterModal({ center, config, onClose, onSaved }: {
  center: Center;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [centerName, setCenterName] = useState(center.centerName ?? "");
  const [name, setName] = useState(center.name);
  const [bio, setBio] = useState(center.bio ?? "");
  const [slug, setSlug] = useState(center.slug ?? "");
  const [profileType, setProfileType] = useState<ProfileType>("CENTER");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    setSaving(true);
    const r = await fetch(`/api/admin/centers/${center.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, centerName, bio, slug, profileType }),
    });
    setSaving(false);
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setError(data.error ?? "Saqlashda xatolik");
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-[520px] w-full max-h-[90vh] overflow-y-auto rounded-[18px] p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-bold" style={{ color: config.text }}>Markazni tahrirlash</h2>
            <p className="text-[12px] mt-1" style={{ color: config.textMuted }}>ID: {center.id} · {center.phone}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-[8px]" style={{ color: config.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold mb-1.5" style={{ color: config.textMuted }}>Profil turi</label>
            <div className="grid grid-cols-2 gap-2">
              {(["CENTER", "TUTOR"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setProfileType(t)}
                  className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors"
                  style={{
                    backgroundColor: profileType === t ? `${config.accent}30` : config.hover,
                    color: profileType === t ? config.text : config.textMuted,
                    border: profileType === t ? `1px solid ${config.accent}` : `1px solid transparent`,
                  }}
                >
                  {t === "CENTER" ? <Building2 className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                  {t === "CENTER" ? "O'quv markaz" : "Repetitor"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1.5" style={{ color: config.textMuted }}>Mas&apos;ul shaxs ismi</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-[10px] text-[14px]"
              style={{ backgroundColor: config.hover, color: config.text, border: `1px solid ${config.surfaceBorder}` }}
            />
          </div>

          {profileType === "CENTER" && (
            <div>
              <label className="block text-[11px] font-semibold mb-1.5" style={{ color: config.textMuted }}>Markaz nomi</label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[10px] text-[14px]"
                style={{ backgroundColor: config.hover, color: config.text, border: `1px solid ${config.surfaceBorder}` }}
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold mb-1.5" style={{ color: config.textMuted }}>
              Slug (URL) — bo&apos;sh qoldirsangiz avto-yaratiladi
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="masalan: najot-talim"
              className="w-full px-3 py-2.5 rounded-[10px] text-[14px] font-mono"
              style={{ backgroundColor: config.hover, color: config.text, border: `1px solid ${config.surfaceBorder}` }}
            />
            {slug && <p className="text-[11px] mt-1 font-mono" style={{ color: config.textMuted }}>/oquv-markazlar/{slug}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1.5" style={{ color: config.textMuted }}>
              Tavsif (bio) — SEO/AEO uchun muhim
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 rounded-[10px] text-[14px] resize-none"
              style={{ backgroundColor: config.hover, color: config.text, border: `1px solid ${config.surfaceBorder}` }}
            />
            <p className="text-[10.5px] mt-1" style={{ color: config.textMuted }}>{bio.length} / 2000</p>
          </div>

          {error && (
            <div className="text-[12px] px-3 py-2 rounded-[8px]" style={{ backgroundColor: "#ef444420", color: "#ef4444" }}>
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-[10px] text-[13px] font-medium"
              style={{ backgroundColor: config.hover, color: config.textMuted }}
            >
              Bekor
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-[10px] text-[13px] font-bold flex items-center justify-center gap-1.5 disabled:opacity-60"
              style={{ backgroundColor: config.accent, color: config.accentText }}
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
