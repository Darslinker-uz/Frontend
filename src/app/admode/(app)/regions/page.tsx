"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Star, X, AlertCircle, GripVertical,
  MoreHorizontal, MapPin, Search,
} from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

interface AdminRegion {
  id: number;
  name: string;
  slug: string;
  active: boolean;
  featured: boolean;
  order: number;
  listingCount: number;
  createdAt: string;
  updatedAt: string;
}

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; region: AdminRegion };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[''ʻ`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function jsonFetch<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  let data: unknown = null;
  try { data = await res.json(); } catch { /* empty */ }
  if (!res.ok) {
    const msg = data && typeof data === "object" && "error" in (data as Record<string, unknown>)
      ? String((data as Record<string, unknown>).error)
      : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export default function AdminRegionsPage() {
  const { config } = useAdminTheme();
  const [regions, setRegions] = useState<AdminRegion[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [topError, setTopError] = useState<string | null>(null);
  const dragId = useRef<number | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await jsonFetch<{ regions: AdminRegion[] }>("/api/admin/regions");
      setRegions(r.regions ?? []);
    } catch (e) {
      setTopError(e instanceof Error ? e.message : "Yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? regions.filter((r) => r.name.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q))
    : regions;

  const toggle = async (r: AdminRegion, field: "active" | "featured") => {
    setBusyId(r.id);
    const prev = regions;
    const newVal = !r[field];
    setRegions((p) => p.map((x) => x.id === r.id ? { ...x, [field]: newVal } : x));
    try {
      await jsonFetch(`/api/admin/regions/${r.id}`, {
        method: "PATCH",
        body: JSON.stringify({ [field]: newVal }),
      });
    } catch (e) {
      setRegions(prev);
      setTopError(e instanceof Error ? e.message : "O'zgartirib bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (r: AdminRegion) => {
    if (!confirm(`"${r.name}" viloyatini o'chirmoqchimisiz?`)) return;
    setBusyId(r.id);
    const prev = regions;
    setRegions((p) => p.filter((x) => x.id !== r.id));
    try {
      await jsonFetch(`/api/admin/regions/${r.id}`, { method: "DELETE" });
    } catch (e) {
      setRegions(prev);
      setTopError(e instanceof Error ? e.message : "O'chirib bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  // Drag-and-drop
  const onDragStart = (id: number) => () => { dragId.current = id; };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop = async (targetId: number) => {
    const sourceId = dragId.current;
    if (sourceId == null || sourceId === targetId) return;
    const sortedAll = [...regions].sort((a, b) => a.order - b.order);
    const sourceIdx = sortedAll.findIndex((r) => r.id === sourceId);
    const targetIdx = sortedAll.findIndex((r) => r.id === targetId);
    if (sourceIdx < 0 || targetIdx < 0) return;
    const [moved] = sortedAll.splice(sourceIdx, 1);
    sortedAll.splice(targetIdx, 0, moved);
    const reordered = sortedAll.map((r, i) => ({ ...r, order: i + 1 }));
    setRegions(reordered);
    try {
      await jsonFetch("/api/admin/regions", {
        method: "PATCH",
        body: JSON.stringify({ order: reordered.map((r) => ({ id: r.id, order: r.order })) }),
      });
    } catch (e) {
      setTopError(e instanceof Error ? e.message : "Tartibni saqlashda xatolik");
      load();
    }
    dragId.current = null;
  };

  const counts = {
    total: regions.length,
    featured: regions.filter((r) => r.featured).length,
    active: regions.filter((r) => r.active).length,
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>Viloyatlar</h1>
          <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>
            {loading ? "Yuklanmoqda..." : `${counts.total} ta viloyat — ${counts.featured} navbar'da, ${counts.active} aktiv`}
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="h-[40px] px-4 rounded-[10px] text-[13px] font-semibold flex items-center gap-2"
          style={{ backgroundColor: config.accent, color: config.accentText }}
        >
          <Plus className="w-4 h-4" /> Yangi viloyat
        </button>
      </div>

      {topError && (
        <div className="mb-4 rounded-[10px] px-4 py-3 flex items-start gap-2 text-[13px]"
          style={{ backgroundColor: "#ef444415", border: "1px solid #ef444433", color: "#ef4444" }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1">{topError}</div>
          <button onClick={() => setTopError(null)} className="shrink-0 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="mb-4 max-w-[400px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Viloyat nomi yoki slug..."
          className="w-full h-[42px] pl-10 pr-4 rounded-[10px] text-[14px] focus:outline-none"
          style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
        />
      </div>

      <div className="rounded-[14px] p-3 mb-4" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}>
        <p className="text-[12px]" style={{ color: config.textMuted }}>
          ⭐️ <strong>Featured</strong> — navbar megamenu &quot;Mashhur shaharlar&quot;da chiqadi.
          {' '}<strong>Aktiv</strong> — viloyat butunlay yashirilmagan.
          {' '}Navbar'da ko'rinishi uchun: <strong>aktiv + featured + 1+ aktiv kursli</strong>.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="rounded-[14px] overflow-hidden" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 w-12" style={{ color: config.textDim }}></th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3" style={{ color: config.textDim }}>Nom</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3" style={{ color: config.textDim }}>Slug</th>
                  <th className="text-center text-[11px] font-bold uppercase tracking-wider px-4 py-3" style={{ color: config.textDim }}>Aktiv</th>
                  <th className="text-center text-[11px] font-bold uppercase tracking-wider px-4 py-3" style={{ color: config.textDim }}>Featured</th>
                  <th className="text-right text-[11px] font-bold uppercase tracking-wider px-4 py-3" style={{ color: config.textDim }}>Kurslar</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    draggable
                    onDragStart={onDragStart(r.id)}
                    onDragOver={onDragOver}
                    onDrop={() => onDrop(r.id)}
                    style={{ borderBottom: `1px solid ${config.surfaceBorder}`, opacity: r.active ? 1 : 0.5 }}
                  >
                    <td className="px-4 py-3 cursor-move" style={{ color: config.textDim }}>
                      <GripVertical className="w-4 h-4" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" style={{ color: config.textDim }} />
                        <span className="text-[14px] font-semibold" style={{ color: config.text }}>{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] font-mono" style={{ color: config.textDim }}>{r.slug}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggle(r, "active")}
                        disabled={busyId === r.id}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-[8px] transition-all disabled:opacity-50"
                        style={r.active ? { backgroundColor: "#22c55e22", color: "#22c55e" } : { backgroundColor: config.hover, color: config.textDim }}
                      >
                        {r.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggle(r, "featured")}
                        disabled={busyId === r.id}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-[8px] transition-all disabled:opacity-50"
                        style={r.featured ? { backgroundColor: "#f59e0b22", color: "#f59e0b" } : { backgroundColor: config.hover, color: config.textDim }}
                      >
                        <Star className={`w-4 h-4 ${r.featured ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right text-[13px] font-semibold" style={{ color: config.text }}>{r.listingCount}</td>
                    <td className="px-4 py-3">
                      <RowMenu
                        isOpen={openMenu === r.id}
                        busy={busyId === r.id}
                        onOpen={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                        onClose={() => setOpenMenu(null)}
                        onEdit={() => { setOpenMenu(null); setModal({ mode: "edit", region: r }); }}
                        onDelete={() => { setOpenMenu(null); remove(r); }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <RegionModal
          existing={modal.mode === "edit" ? modal.region : undefined}
          onClose={() => setModal(null)}
          onSaved={async () => {
            setModal(null);
            await load();
          }}
        />
      )}
    </div>
  );
}

function RowMenu({
  isOpen, busy, onOpen, onClose, onEdit, onDelete,
}: {
  isOpen: boolean; busy: boolean;
  onOpen: () => void; onClose: () => void;
  onEdit: () => void; onDelete: () => void;
}) {
  const { config } = useAdminTheme();
  return (
    <div className="relative inline-block">
      <button
        onClick={onOpen}
        disabled={busy}
        className="w-9 h-9 rounded-[10px] flex items-center justify-center disabled:opacity-40"
        style={{ backgroundColor: config.hover, color: config.textMuted }}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div
            className="absolute right-0 top-10 z-50 w-[180px] rounded-[12px] p-1.5 shadow-2xl"
            style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
          >
            <MenuItem icon={Pencil} label="Tahrirlash" color={config.text} onClick={onEdit} />
            <div className="h-px my-1" style={{ backgroundColor: config.surfaceBorder }} />
            <MenuItem icon={Trash2} label="O'chirish" color="#ef4444" onClick={onDelete} />
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, color, onClick }: { icon: typeof Eye; label: string; color: string; onClick?: () => void }) {
  const { config } = useAdminTheme();
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors"
      style={{ backgroundColor: hover ? config.hover : "transparent", color }}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function RegionModal({
  existing, onClose, onSaved,
}: {
  existing?: AdminRegion;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { config } = useAdminTheme();
  const isLight = config.id === "light" || config.id === "cream";

  const [name, setName] = useState(existing?.name ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(existing));
  const [active, setActive] = useState(existing?.active ?? true);
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const submit = async () => {
    if (name.trim().length < 2) return;
    setError(null);
    setSubmitting(true);
    try {
      const body = { name: name.trim(), slug: slug.trim() || slugify(name), active, featured };
      if (existing) {
        await jsonFetch(`/api/admin/regions/${existing.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        await jsonFetch("/api/admin/regions", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xatolik");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative rounded-[18px] w-full max-w-[480px] p-6"
        style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
      >
        <div className="flex items-start justify-between mb-5">
          <h2 className="text-[18px] font-bold" style={{ color: config.text }}>
            {existing ? "Viloyatni tahrirlash" : "Yangi viloyat"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] block mb-1.5 font-medium" style={{ color: config.textDim }}>Nom *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Toshkent shahri"
              className="w-full h-[40px] px-3 rounded-[10px] text-[14px] focus:outline-none"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
          </div>

          <div>
            <label className="text-[11px] block mb-1.5 font-medium" style={{ color: config.textDim }}>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
              placeholder="toshkent-shahri"
              className="w-full h-[40px] px-3 rounded-[10px] text-[14px] font-mono focus:outline-none"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
            <p className="text-[10px] mt-1" style={{ color: config.textDim }}>
              Faqat kichik harf, raqam va &quot;-&quot;. Bo&apos;sh qoldirsangiz, nomdan avtomatik yaratiladi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4" />
              <span className="text-[13px]" style={{ color: config.text }}>Aktiv</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4" />
              <span className="text-[13px]" style={{ color: config.text }}>Featured (navbar)</span>
            </label>
          </div>
        </div>

        {error && <p className="text-[12px] mt-3" style={{ color: "#ef4444" }}>{error}</p>}

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium"
            style={{ backgroundColor: config.hover, color: config.textMuted, border: `1px solid ${config.surfaceBorder}` }}
          >
            Bekor qilish
          </button>
          <button
            onClick={submit}
            disabled={name.trim().length < 2 || submitting}
            className="flex-1 h-[44px] rounded-[10px] text-[13px] font-semibold disabled:opacity-50"
            style={{ backgroundColor: config.accent, color: config.accentText }}
          >
            {submitting ? "Saqlanmoqda..." : existing ? "Saqlash" : "Yaratish"}
          </button>
        </div>
      </div>
    </div>
  );
}
