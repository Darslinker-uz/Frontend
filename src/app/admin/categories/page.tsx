"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search, Plus, FolderTree, Edit2, Trash2, MoreHorizontal, X, Check,
  GripVertical, Code2, Palette, Megaphone, Languages, Briefcase, BookOpen,
  Eye, EyeOff, ChevronRight, ChevronDown, Loader2,
} from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

interface Category {
  id: number;
  name: string;
  slug: string;
  desc: string;
  icon: string;
  color: string;
  listingsCount: number;
  active: boolean;
  subcategories: string[];
}

// API category shape (from Prisma)
interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  active: boolean;
  order: number;
  subcategories: string[];
  _count?: { listings: number };
}

function mapFromApi(c: ApiCategory): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    desc: c.description ?? "",
    icon: c.icon ?? "code",
    color: c.color ?? "#3b82f6",
    listingsCount: c._count?.listings ?? 0,
    active: c.active,
    subcategories: c.subcategories ?? [],
  };
}

const ICON_MAP: Record<string, typeof Code2> = {
  code: Code2,
  palette: Palette,
  megaphone: Megaphone,
  languages: Languages,
  briefcase: Briefcase,
  book: BookOpen,
};

const ICON_OPTIONS = [
  { id: "code", label: "Kod" },
  { id: "palette", label: "Dizayn" },
  { id: "megaphone", label: "Marketing" },
  { id: "languages", label: "Tillar" },
  { id: "briefcase", label: "Biznes" },
  { id: "book", label: "Akademik" },
];

const COLOR_OPTIONS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4", "#ef4444", "#f97316",
];

export default function AdminCategoriesPage() {
  const { config } = useAdminTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState<Category | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [dragId, setDragId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/categories", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          alert(json?.error ?? "Kategoriyalarni yuklashda xatolik");
          return;
        }
        const list: ApiCategory[] = json.categories ?? [];
        setCategories(list.map(mapFromApi));
      } catch {
        if (!cancelled) alert("Tarmoq xatosi — kategoriyalar yuklanmadi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = categories.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.subcategories.some(s => s.toLowerCase().includes(q));
  });

  const toggleActive = useCallback(async (id: number) => {
    setMenuOpen(null);
    const current = categories.find(c => c.id === id);
    if (!current) return;
    const nextActive = !current.active;
    // Optimistic update
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: nextActive } : c));
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Xatolik");
      const mapped = mapFromApi({ ...(json.category as ApiCategory), _count: { listings: current.listingsCount } });
      setCategories(prev => prev.map(c => c.id === id ? mapped : c));
    } catch (e) {
      // Revert
      setCategories(prev => prev.map(c => c.id === id ? { ...c, active: current.active } : c));
      alert(e instanceof Error ? e.message : "Holatni o'zgartirishda xatolik");
    }
  }, [categories]);

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const save = useCallback(async (cat: Category) => {
    const isUpdate = cat.id && categories.some(c => c.id === cat.id);
    const payload = {
      name: cat.name,
      slug: cat.slug,
      description: cat.desc,
      icon: cat.icon,
      color: cat.color,
      subcategories: cat.subcategories,
      active: cat.active,
    };
    try {
      const res = await fetch(
        isUpdate ? `/api/admin/categories/${cat.id}` : "/api/admin/categories",
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Saqlashda xatolik");
      const saved = mapFromApi({
        ...(json.category as ApiCategory),
        _count: { listings: isUpdate ? cat.listingsCount : 0 },
      });
      setCategories(prev =>
        isUpdate ? prev.map(c => c.id === saved.id ? saved : c) : [...prev, saved],
      );
      setEditOpen(null);
      setCreateOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Saqlashda xatolik");
    }
  }, [categories]);

  const remove = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json?.error ?? "O'chirishda xatolik");
        return;
      }
      setCategories(prev => prev.filter(c => c.id !== id));
      setDeleteConfirm(null);
      setMenuOpen(null);
    } catch {
      alert("Tarmoq xatosi — o'chirib bo'lmadi.");
    }
  }, []);

  const onDragStart = (id: number) => setDragId(id);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = async (targetId: number) => {
    if (dragId === null || dragId === targetId) return;
    const fromId = dragId;
    setDragId(null);

    let nextOrder: Category[] = categories;
    setCategories(prev => {
      const from = prev.findIndex(c => c.id === fromId);
      const to = prev.findIndex(c => c.id === targetId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      nextOrder = next;
      return next;
    });

    try {
      const res = await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: nextOrder.map(c => c.id) }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error ?? "Tartibni saqlashda xatolik");
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Tartibni saqlashda xatolik");
    }
  };

  const totalListings = categories.reduce((s, c) => s + c.listingsCount, 0);
  const activeCount = categories.filter(c => c.active).length;

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: config.text }}>Kategoriyalar</h1>
            <p className="mt-1 text-sm" style={{ color: config.textMuted }}>E&apos;lonlar saralanadigan yo&apos;nalishlar — {activeCount} aktiv · {totalListings} ta e&apos;lon</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: config.accent, color: config.accentText }}
          >
            <Plus className="w-4 h-4" />
            Yangi kategoriya
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Kategoriya yoki pastki yo'nalish..."
              className="w-full h-10 pl-9 pr-3 rounded-lg text-[13px] outline-none"
              style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
          </div>
          <span className="text-[11px] flex items-center gap-1.5" style={{ color: config.textDim }}>
            <GripVertical className="w-3 h-3" />
            Tartibni o&apos;zgartirish uchun sudrab tashlang
          </span>
        </div>

        {loading ? (
          <div className="rounded-xl p-16 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
            <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" style={{ color: config.textDim }} />
            <p className="text-sm" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl p-16 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
            <FolderTree className="w-10 h-10 mx-auto mb-3" style={{ color: config.textDim }} />
            <p className="text-sm" style={{ color: config.textMuted }}>Topilmadi</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(cat => {
              const Icon = ICON_MAP[cat.icon] ?? Code2;
              const isExpanded = expanded.has(cat.id);
              const isDragging = dragId === cat.id;
              return (
                <div
                  key={cat.id}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(cat.id)}
                  className="rounded-[14px] transition-all"
                  style={{
                    backgroundColor: config.surface,
                    border: `1px solid ${isDragging ? cat.color : config.surfaceBorder}`,
                    opacity: cat.active ? 1 : 0.55,
                  }}
                >
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div
                      draggable
                      onDragStart={() => onDragStart(cat.id)}
                      className="w-4 h-4 shrink-0 cursor-grab flex items-center justify-center"
                      style={{ color: config.textDim }}
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <button onClick={() => toggleExpand(cat.id)} className="w-6 h-6 flex items-center justify-center shrink-0" style={{ color: config.textMuted }}>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}22` }}>
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[14px] font-semibold" style={{ color: config.text }}>{cat.name}</p>
                        {!cat.active && (
                          <span className="text-[10px] px-1.5 h-[18px] rounded-full font-bold flex items-center" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                            Yashirilgan
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] truncate mt-0.5" style={{ color: config.textMuted }}>{cat.desc}</p>
                    </div>

                    <div className="text-right shrink-0 hidden md:block">
                      <p className="text-[16px] font-bold tabular-nums" style={{ color: config.text }}>{cat.listingsCount}</p>
                      <p className="text-[10px]" style={{ color: config.textDim }}>e&apos;lon</p>
                    </div>

                    <div className="relative shrink-0">
                      <button
                        onClick={() => setMenuOpen(menuOpen === cat.id ? null : cat.id)}
                        className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                        style={{ color: config.textMuted }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuOpen === cat.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-0 top-9 z-20 w-48 rounded-lg py-1.5 shadow-xl" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                            <MenuBtn icon={Edit2} label="Tahrirlash" onClick={() => { setEditOpen(cat); setMenuOpen(null); }} config={config} />
                            <MenuBtn
                              icon={cat.active ? EyeOff : Eye}
                              label={cat.active ? "Yashirish" : "Ko'rsatish"}
                              onClick={() => toggleActive(cat.id)}
                              config={config}
                            />
                            <div className="my-1 h-px" style={{ backgroundColor: config.surfaceBorder }} />
                            <MenuBtn icon={Trash2} label="O'chirish" onClick={() => { setDeleteConfirm(cat); setMenuOpen(null); }} config={config} danger />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1" style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
                      <div className="flex items-center justify-between mb-3 mt-3">
                        <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: config.textDim }}>
                          Pastki yo&apos;nalishlar ({cat.subcategories.length})
                        </p>
                        <p className="text-[11px]" style={{ color: config.textDim }}>
                          slug: <span className="font-mono" style={{ color: config.textMuted }}>{cat.slug}</span>
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subcategories.map((sub, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center h-7 px-2.5 rounded-md text-[12px] font-medium"
                            style={{ backgroundColor: `${cat.color}14`, color: cat.color, border: `1px solid ${cat.color}33` }}
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs" style={{ color: config.textDim }}>
          <span>Jami: {categories.length} ta kategoriya</span>
          <span>{activeCount} aktiv · {categories.length - activeCount} yashirilgan</span>
        </div>
      </div>

      {(editOpen || createOpen) && (
        <CategoryFormModal
          initial={editOpen}
          onClose={() => { setEditOpen(null); setCreateOpen(false); }}
          onSave={save}
          config={config}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          category={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => remove(deleteConfirm.id)}
          config={config}
        />
      )}
    </div>
  );
}

// ==================== COMPONENTS ====================

type Cfg = ReturnType<typeof useAdminTheme>["config"];

function MenuBtn({ icon: Icon, label, onClick, config, danger }: {
  icon: typeof Edit2; label: string; onClick: () => void; config: Cfg; danger?: boolean;
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

function CategoryFormModal({ initial, onClose, onSave, config }: {
  initial: Category | null; onClose: () => void; onSave: (c: Category) => void; config: Cfg;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "code");
  const [color, setColor] = useState(initial?.color ?? "#3b82f6");
  const [subcategories, setSubcategories] = useState<string[]>(initial?.subcategories ?? []);
  const [newSub, setNewSub] = useState("");

  const addSub = () => {
    const t = newSub.trim();
    if (!t || subcategories.includes(t)) return;
    setSubcategories(prev => [...prev, t]);
    setNewSub("");
  };

  const removeSub = (s: string) => setSubcategories(prev => prev.filter(x => x !== s));

  const canSave = name.trim().length > 1 && slug.trim().length > 1;

  const submit = () => {
    if (!canSave) return;
    onSave({
      id: initial?.id ?? 0,
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      desc: desc.trim(),
      icon,
      color,
      listingsCount: initial?.listingsCount ?? 0,
      active: initial?.active ?? true,
      subcategories,
    });
  };

  const SelectedIcon = ICON_MAP[icon] ?? Code2;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-t-2xl md:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex items-start justify-between shrink-0" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
              <SelectedIcon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold" style={{ color: config.text }}>
                {initial ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
              </h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>{name || "Nom kiritilmagan"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center" style={{ color: config.textMuted }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Nom" config={config}>
              <input
                value={name}
                onChange={e => { setName(e.target.value); if (!initial) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); }}
                className="w-full h-10 px-3 rounded-md text-[13px] outline-none"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
                placeholder="Masalan: IT & Dasturlash"
              />
            </Field>
            <Field label="Slug" config={config}>
              <input
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full h-10 px-3 rounded-md text-[13px] outline-none font-mono"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
                placeholder="dasturlash"
              />
            </Field>
          </div>

          <Field label="Qisqa tavsif" config={config}>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full h-10 px-3 rounded-md text-[13px] outline-none"
              style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              placeholder="Kategoriya haqida qisqacha..."
            />
          </Field>

          <Field label="Icon" config={config}>
            <div className="grid grid-cols-6 gap-1.5">
              {ICON_OPTIONS.map(o => {
                const I = ICON_MAP[o.id];
                const isActive = icon === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setIcon(o.id)}
                    title={o.label}
                    className="h-11 rounded-md flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: isActive ? `${color}22` : config.surface,
                      border: `1px solid ${isActive ? color : config.surfaceBorder}`,
                    }}
                  >
                    <I className="w-5 h-5" style={{ color: isActive ? color : config.textMuted }} />
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Rang" config={config}>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_OPTIONS.map(c => {
                const isActive = color === c;
                return (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: c,
                      boxShadow: isActive ? `0 0 0 2px ${config.sidebar}, 0 0 0 4px ${c}` : "none",
                    }}
                  >
                    {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label={`Pastki yo'nalishlar (${subcategories.length})`} config={config}>
            <div className="flex gap-2 mb-2">
              <input
                value={newSub}
                onChange={e => setNewSub(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSub())}
                className="flex-1 h-9 px-3 rounded-md text-[13px] outline-none"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
                placeholder="Masalan: Python, React..."
              />
              <button
                onClick={addSub}
                disabled={!newSub.trim()}
                className="h-9 px-3 rounded-md text-[12px] font-semibold disabled:opacity-40"
                style={{ backgroundColor: config.hover, color: config.text, border: `1px solid ${config.surfaceBorder}` }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
              {subcategories.length === 0 && <span className="text-[11px]" style={{ color: config.textDim }}>Hali qo&apos;shilmagan</span>}
              {subcategories.map(s => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1 rounded-md text-[12px] font-medium"
                  style={{ backgroundColor: `${color}14`, color, border: `1px solid ${color}33` }}
                >
                  {s}
                  <button onClick={() => removeSub(s)} className="w-4 h-4 rounded flex items-center justify-center hover:bg-black/20 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </Field>
        </div>

        <div className="px-6 py-4 flex items-center gap-2 shrink-0" style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-lg text-[13px] font-medium"
            style={{ backgroundColor: config.hover, color: config.text, border: `1px solid ${config.surfaceBorder}` }}
          >
            Bekor
          </button>
          <button
            onClick={submit}
            disabled={!canSave}
            className="flex-1 h-11 rounded-lg text-[13px] font-semibold disabled:opacity-40"
            style={{ backgroundColor: config.accent, color: config.accentText }}
          >
            {initial ? "Saqlash" : "Qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, config }: { label: string; children: React.ReactNode; config: Cfg }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider font-semibold mb-1.5 block" style={{ color: config.textDim }}>{label}</label>
      {children}
    </div>
  );
}

function DeleteConfirmModal({ category, onClose, onConfirm, config }: {
  category: Category; onClose: () => void; onConfirm: () => void; config: Cfg;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(239,68,68,0.15)" }}>
            <Trash2 className="w-5 h-5" style={{ color: "#ef4444" }} />
          </div>
          <h2 className="text-[17px] font-bold mb-1" style={{ color: config.text }}>Kategoriyani o&apos;chirish</h2>
          <p className="text-[13px]" style={{ color: config.textMuted }}>
            &ldquo;<span style={{ color: config.text }}>{category.name}</span>&rdquo; kategoriyasini o&apos;chirmoqchimisiz?
            {category.listingsCount > 0 && (
              <> Bunda <span className="font-semibold" style={{ color: "#ef4444" }}>{category.listingsCount} ta e&apos;lon</span> kategoriyasiz qoladi.</>
            )}
          </p>
        </div>
        <div className="px-6 pb-6 flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-lg text-[13px] font-medium"
            style={{ backgroundColor: config.hover, color: config.text, border: `1px solid ${config.surfaceBorder}` }}
          >
            Bekor
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-lg text-[13px] font-semibold"
            style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
          >
            O&apos;chirish
          </button>
        </div>
      </div>
    </div>
  );
}
