"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  FolderTree,
  Tag,
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  AlertCircle,
  MoreHorizontal,
  GripVertical,
  Star,
} from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

// ───────────────────────────── Types ─────────────────────────────

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  active: boolean;
  order: number;
  pendingApproval: boolean;
  _count: { listings: number };
}

interface ApiGroup {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  active: boolean;
  showOnHomepage: boolean;
  order: number;
  categories: ApiCategory[];
}

type GroupModalState =
  | { mode: "create" }
  | { mode: "edit"; group: ApiGroup };

type CategoryModalState =
  | { mode: "create"; groupId: number }
  | { mode: "edit"; groupId: number; category: ApiCategory };

type DragState =
  | { kind: "group"; id: number }
  | { kind: "category"; id: number; groupId: number }
  | null;

// ─────────────────────────── Helpers ─────────────────────────────

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’ʻ`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function jsonFetch<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) {
    const errMsg =
      data && typeof data === "object" && "error" in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).error)
        : `HTTP ${res.status}`;
    throw new Error(errMsg);
  }
  return data as T;
}

// ─────────────────────────── Page ────────────────────────────────

export default function AdminCategoriesPage() {
  const { config } = useAdminTheme();
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [groupModal, setGroupModal] = useState<GroupModalState | null>(null);
  const [categoryModal, setCategoryModal] = useState<CategoryModalState | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [topError, setTopError] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const loadGroups = async () => {
    try {
      const json = await jsonFetch<{ groups: ApiGroup[] }>("/api/admin/categories");
      setGroups(json.groups ?? []);
    } catch (e) {
      console.error("[admin/categories] load failed", e);
      setTopError(e instanceof Error ? e.message : "Yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // ───── Filter ─────
  const q = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        categories: g.categories.filter(
          (c) =>
            c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
        ),
      }))
      .filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.slug.toLowerCase().includes(q) ||
          g.categories.length > 0
      );
  }, [q, groups]);

  const totalCategories = groups.reduce((s, g) => s + g.categories.length, 0);
  const totalListings = groups.reduce(
    (s, g) => s + g.categories.reduce((cs, c) => cs + c._count.listings, 0),
    0
  );
  const pendingCount = groups.reduce(
    (s, g) => s + g.categories.filter((c) => c.pendingApproval).length,
    0
  );

  // ───── Mutations ─────

  // Toggle group active (optimistic)
  const toggleGroupActive = async (g: ApiGroup) => {
    const key = `g-active-${g.id}`;
    setBusyId(key);
    const prev = groups;
    setGroups((p) =>
      p.map((x) => (x.id === g.id ? { ...x, active: !x.active } : x))
    );
    try {
      await jsonFetch(`/api/admin/category-groups/${g.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !g.active }),
      });
    } catch (e) {
      console.error(e);
      setGroups(prev);
      setTopError(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setBusyId(null);
    }
  };

  // Toggle group's showOnHomepage flag — bosh sahifa grid'ida ko'rinadimi
  const toggleGroupHomepage = async (g: ApiGroup) => {
    const key = `g-home-${g.id}`;
    setBusyId(key);
    const prev = groups;
    setGroups((p) =>
      p.map((x) => (x.id === g.id ? { ...x, showOnHomepage: !x.showOnHomepage } : x))
    );
    try {
      await jsonFetch(`/api/admin/category-groups/${g.id}`, {
        method: "PATCH",
        body: JSON.stringify({ showOnHomepage: !g.showOnHomepage }),
      });
    } catch (e) {
      console.error(e);
      setGroups(prev);
      setTopError(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setBusyId(null);
    }
  };

  // Toggle category active (optimistic)
  const toggleCategoryActive = async (g: ApiGroup, c: ApiCategory) => {
    const key = `c-active-${c.id}`;
    setBusyId(key);
    const prev = groups;
    setGroups((p) =>
      p.map((x) =>
        x.id === g.id
          ? {
              ...x,
              categories: x.categories.map((cc) =>
                cc.id === c.id ? { ...cc, active: !cc.active } : cc
              ),
            }
          : x
      )
    );
    try {
      await jsonFetch(`/api/admin/categories/${c.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !c.active }),
      });
    } catch (e) {
      console.error(e);
      setGroups(prev);
      setTopError(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setBusyId(null);
    }
  };

  // Approve pending category
  const approveCategory = async (g: ApiGroup, c: ApiCategory) => {
    const key = `c-approve-${c.id}`;
    setBusyId(key);
    const prev = groups;
    setGroups((p) =>
      p.map((x) =>
        x.id === g.id
          ? {
              ...x,
              categories: x.categories.map((cc) =>
                cc.id === c.id ? { ...cc, pendingApproval: false, active: true } : cc
              ),
            }
          : x
      )
    );
    try {
      await jsonFetch(`/api/admin/categories/${c.id}`, {
        method: "PATCH",
        body: JSON.stringify({ approve: true }),
      });
    } catch (e) {
      console.error(e);
      setGroups(prev);
      setTopError(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setBusyId(null);
    }
  };

  // Swap two groups' order (used after drop)
  const swapGroupOrder = async (aId: number, bId: number) => {
    if (aId === bId) return;
    const a = groups.find((x) => x.id === aId);
    const b = groups.find((x) => x.id === bId);
    if (!a || !b) return;
    const key = `g-order-${aId}`;
    setBusyId(key);
    const prev = groups;
    setGroups((p) =>
      p.map((x) => {
        if (x.id === a.id) return { ...x, order: b.order };
        if (x.id === b.id) return { ...x, order: a.order };
        return x;
      })
    );
    try {
      await Promise.all([
        jsonFetch(`/api/admin/category-groups/${a.id}`, {
          method: "PATCH",
          body: JSON.stringify({ order: b.order }),
        }),
        jsonFetch(`/api/admin/category-groups/${b.id}`, {
          method: "PATCH",
          body: JSON.stringify({ order: a.order }),
        }),
      ]);
    } catch (e) {
      console.error(e);
      setGroups(prev);
      setTopError(e instanceof Error ? e.message : "Tartibni o'zgartirib bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  // Swap two categories' order within the same group
  const swapCategoryOrder = async (groupId: number, aId: number, bId: number) => {
    if (aId === bId) return;
    const group = groups.find((x) => x.id === groupId);
    if (!group) return;
    const a = group.categories.find((c) => c.id === aId);
    const b = group.categories.find((c) => c.id === bId);
    if (!a || !b) return;
    const key = `c-order-${aId}`;
    setBusyId(key);
    const prev = groups;
    setGroups((p) =>
      p.map((x) =>
        x.id === groupId
          ? {
              ...x,
              categories: x.categories.map((cc) => {
                if (cc.id === a.id) return { ...cc, order: b.order };
                if (cc.id === b.id) return { ...cc, order: a.order };
                return cc;
              }),
            }
          : x
      )
    );
    try {
      await Promise.all([
        jsonFetch(`/api/admin/categories/${a.id}`, {
          method: "PATCH",
          body: JSON.stringify({ order: b.order }),
        }),
        jsonFetch(`/api/admin/categories/${b.id}`, {
          method: "PATCH",
          body: JSON.stringify({ order: a.order }),
        }),
      ]);
    } catch (e) {
      console.error(e);
      setGroups(prev);
      setTopError(e instanceof Error ? e.message : "Tartibni o'zgartirib bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  // Delete group
  const deleteGroup = async (g: ApiGroup) => {
    if (g.categories.length > 0) {
      setTopError(`"${g.name}" guruhda ${g.categories.length} ta yo'nalish bor. Avval ularni o'chiring.`);
      return;
    }
    if (!confirm(`"${g.name}" guruhini o'chirishni tasdiqlaysizmi?`)) return;
    const key = `g-del-${g.id}`;
    setBusyId(key);
    const prev = groups;
    setGroups((p) => p.filter((x) => x.id !== g.id));
    try {
      await jsonFetch(`/api/admin/category-groups/${g.id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
      setGroups(prev);
      setTopError(e instanceof Error ? e.message : "O'chirib bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  // Delete category
  const deleteCategory = async (g: ApiGroup, c: ApiCategory) => {
    if (c._count.listings > 0) {
      setTopError(`"${c.name}" da ${c._count.listings} ta e'lon bor. O'chirib bo'lmaydi.`);
      return;
    }
    if (!confirm(`"${c.name}" yo'nalishini o'chirishni tasdiqlaysizmi?`)) return;
    const key = `c-del-${c.id}`;
    setBusyId(key);
    const prev = groups;
    setGroups((p) =>
      p.map((x) =>
        x.id === g.id
          ? { ...x, categories: x.categories.filter((cc) => cc.id !== c.id) }
          : x
      )
    );
    try {
      await jsonFetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
      setGroups(prev);
      setTopError(e instanceof Error ? e.message : "O'chirib bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  // ─────────── Render ───────────
  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>
            Yo&apos;nalishlar
          </h1>
          <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>
            {loading
              ? "Yuklanmoqda..."
              : `${groups.length} ta guruh, ${totalCategories} ta yo'nalish, jami ${totalListings} ta e'lon`}
          </p>
        </div>
        <button
          onClick={() => setGroupModal({ mode: "create" })}
          className="h-[40px] px-4 rounded-[10px] text-[13px] font-semibold flex items-center gap-2 transition-all"
          style={{ backgroundColor: config.accent, color: config.accentText }}
        >
          <Plus className="w-4 h-4" />
          Yangi guruh
        </button>
      </div>

      {topError && (
        <div
          className="mb-4 rounded-[10px] px-4 py-3 flex items-start gap-2 text-[13px]"
          style={{ backgroundColor: "#ef444415", border: "1px solid #ef444433", color: "#ef4444" }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1">{topError}</div>
          <button onClick={() => setTopError(null)} className="shrink-0 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {pendingCount > 0 && (
        <div
          className="mb-4 rounded-[10px] px-4 py-3 flex items-center gap-2 text-[13px] font-medium"
          style={{ backgroundColor: "#f59e0b22", border: "1px solid #f59e0b55", color: "#d97706" }}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {pendingCount} ta yo&apos;nalish so&apos;rovi tasdiqlash kutmoqda
        </div>
      )}

      <div className="mb-5 max-w-[400px]">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: config.textDim }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Yo'nalish nomi yoki slug..."
            className="w-full h-[42px] pl-10 pr-4 rounded-[10px] text-[14px] focus:outline-none transition-colors"
            style={{
              backgroundColor: config.surface,
              border: `1px solid ${config.surfaceBorder}`,
              color: config.text,
            }}
          />
        </div>
      </div>

      {loading ? (
        <div
          className="rounded-[14px] p-12 text-center"
          style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}
        >
          <p className="text-[14px]" style={{ color: config.textMuted }}>
            Yuklanmoqda...
          </p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((g) => {
            const sortedCats = [...g.categories].sort((a, b) => {
              if (a.pendingApproval !== b.pendingApproval) return a.pendingApproval ? -1 : 1;
              return a.order - b.order;
            });
            const groupKey = `group-${g.id}`;
            const isDraggingGroup = drag?.kind === "group" && drag.id === g.id;
            const isGroupDropTarget = dragOver === groupKey && drag?.kind === "group" && drag.id !== g.id;
            return (
              <div
                key={g.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  setDrag({ kind: "group", id: g.id });
                }}
                onDragOver={(e) => {
                  if (drag?.kind === "group" && drag.id !== g.id) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setDragOver(groupKey);
                  }
                }}
                onDragLeave={() => {
                  if (dragOver === groupKey) setDragOver(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (drag?.kind === "group" && drag.id !== g.id) {
                    swapGroupOrder(drag.id, g.id);
                  }
                  setDrag(null);
                  setDragOver(null);
                }}
                onDragEnd={() => {
                  setDrag(null);
                  setDragOver(null);
                }}
                className="rounded-[14px] p-5 transition-all"
                style={{
                  backgroundColor: config.surface,
                  border: isGroupDropTarget
                    ? `2px solid ${config.accent}`
                    : `1px solid ${config.surfaceBorder}`,
                  opacity: isDraggingGroup ? 0.5 : 1,
                }}
              >
                <div
                  className="flex items-start justify-between gap-3 mb-3 pb-3"
                  style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="cursor-grab active:cursor-grabbing shrink-0 -ml-1 p-1 rounded transition-colors"
                      style={{ color: config.textDim }}
                      title="Sudrab tartibni o'zgartirish"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: (g.color ?? "#7ea2d4") + "22",
                        color: g.color ?? "#7ea2d4",
                      }}
                    >
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold" style={{ color: config.text }}>
                        {g.name}
                      </p>
                      <p className="text-[12px]" style={{ color: config.textMuted }}>
                        <code
                          className="px-1 py-0.5 rounded text-[11px] font-mono"
                          style={{ backgroundColor: config.hover }}
                        >
                          {g.slug}
                        </code>
                        {g.description && <span className="ml-2">{g.description}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    <span
                      className="h-[24px] px-2 rounded-full text-[11px] font-bold flex items-center gap-1"
                      style={{ backgroundColor: config.hover, color: config.textDim }}
                    >
                      {g.categories.length} yo&apos;nalish
                    </span>
                    {g.active ? (
                      <span className="h-[24px] px-2 rounded-full text-[11px] font-medium bg-green-500/15 text-green-500 flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" /> Aktiv
                      </span>
                    ) : (
                      <span className="h-[24px] px-2 rounded-full text-[11px] font-medium bg-gray-500/15 text-gray-400 flex items-center gap-1">
                        <EyeOff className="w-2.5 h-2.5" /> Yashirilgan
                      </span>
                    )}
                    {g.showOnHomepage && (
                      <span className="h-[24px] px-2 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-600 flex items-center gap-1" title="Bosh sahifada ko'rsatiladi">
                        ⭐ Bosh sahifa
                      </span>
                    )}
                    <div className="relative shrink-0 ml-1">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === `group-${g.id}` ? null : `group-${g.id}`)
                        }
                        className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-colors"
                        style={{ backgroundColor: config.hover, color: config.textMuted }}
                        title="Amallar"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === `group-${g.id}` && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenMenu(null)}
                          />
                          <div
                            className="absolute right-0 top-9 z-50 w-[180px] rounded-[12px] p-1.5 shadow-2xl"
                            style={{
                              backgroundColor: config.sidebar,
                              border: `1px solid ${config.surfaceBorder}`,
                            }}
                          >
                            <MenuItem
                              icon={Pencil}
                              label="Tahrirlash"
                              color={config.text}
                              onClick={() => {
                                setOpenMenu(null);
                                setGroupModal({ mode: "edit", group: g });
                              }}
                            />
                            <MenuItem
                              icon={g.active ? EyeOff : Eye}
                              label={g.active ? "Yashirish" : "Ko'rsatish"}
                              color={config.text}
                              onClick={() => {
                                setOpenMenu(null);
                                toggleGroupActive(g);
                              }}
                            />
                            <MenuItem
                              icon={Star}
                              label={g.showOnHomepage ? "Bosh sahifadan olib tashlash" : "Bosh sahifaga qo'shish"}
                              color={g.showOnHomepage ? "#f59e0b" : config.text}
                              onClick={() => {
                                setOpenMenu(null);
                                toggleGroupHomepage(g);
                              }}
                            />
                            <div
                              className="h-px my-1"
                              style={{ backgroundColor: config.surfaceBorder }}
                            />
                            <MenuItem
                              icon={Trash2}
                              label="O'chirish"
                              color="#ef4444"
                              onClick={() => {
                                setOpenMenu(null);
                                deleteGroup(g);
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {sortedCats.length === 0 ? (
                  <p className="text-[12px] py-2" style={{ color: config.textDim }}>
                    Hali yo&apos;nalish qo&apos;shilmagan
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {sortedCats.map((c) => {
                      const pending = c.pendingApproval;
                      const catKey = `cat-${c.id}`;
                      const isDraggingCat =
                        drag?.kind === "category" && drag.id === c.id;
                      const isCatDropTarget =
                        dragOver === catKey &&
                        drag?.kind === "category" &&
                        drag.groupId === g.id &&
                        drag.id !== c.id;
                      const rowBg = pending ? "#f59e0b18" : config.hover;
                      const baseBorder = pending
                        ? "1px solid #f59e0b55"
                        : `1px solid transparent`;
                      const rowBorder = isCatDropTarget
                        ? `2px solid ${config.accent}`
                        : baseBorder;
                      return (
                        <div
                          key={c.id}
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation();
                            e.dataTransfer.effectAllowed = "move";
                            setDrag({ kind: "category", id: c.id, groupId: g.id });
                          }}
                          onDragOver={(e) => {
                            if (
                              drag?.kind === "category" &&
                              drag.groupId === g.id &&
                              drag.id !== c.id
                            ) {
                              e.preventDefault();
                              e.stopPropagation();
                              e.dataTransfer.dropEffect = "move";
                              setDragOver(catKey);
                            }
                          }}
                          onDragLeave={() => {
                            if (dragOver === catKey) setDragOver(null);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (
                              drag?.kind === "category" &&
                              drag.groupId === g.id &&
                              drag.id !== c.id
                            ) {
                              swapCategoryOrder(g.id, drag.id, c.id);
                            }
                            setDrag(null);
                            setDragOver(null);
                          }}
                          onDragEnd={() => {
                            setDrag(null);
                            setDragOver(null);
                          }}
                          className="flex items-center justify-between gap-2 px-2 py-2 rounded-[8px] transition-all"
                          style={{
                            backgroundColor: rowBg,
                            border: rowBorder,
                            opacity: isDraggingCat ? 0.5 : 1,
                          }}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div
                              className="cursor-grab active:cursor-grabbing shrink-0"
                              style={{ color: pending ? "#d97706" : config.textDim }}
                              title="Sudrab tartibni o'zgartirish"
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                            <Tag
                              className="w-3.5 h-3.5 shrink-0"
                              style={{ color: pending ? "#d97706" : config.textDim }}
                            />
                            <div className="min-w-0">
                              <p
                                className="text-[13px] font-medium truncate flex items-center gap-1.5"
                                style={{ color: config.text }}
                              >
                                {c.name}
                                {!c.active && !pending && (
                                  <EyeOff
                                    className="w-3 h-3 shrink-0"
                                    style={{ color: config.textDim }}
                                  />
                                )}
                                {pending && (
                                  <span
                                    className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0"
                                    style={{ backgroundColor: "#f59e0b", color: "#fff" }}
                                  >
                                    Yangi
                                  </span>
                                )}
                              </p>
                              <p
                                className="text-[10px] truncate font-mono"
                                style={{ color: pending ? "#d97706" : config.textDim }}
                              >
                                {c.slug}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span
                              className="text-[11px] font-semibold mr-1"
                              style={{ color: config.textMuted }}
                            >
                              {c._count.listings}
                            </span>
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenMenu(
                                    openMenu === `cat-${c.id}` ? null : `cat-${c.id}`
                                  )
                                }
                                disabled={
                                  busyId === `c-active-${c.id}` ||
                                  busyId === `c-del-${c.id}` ||
                                  busyId === `c-approve-${c.id}`
                                }
                                className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors disabled:opacity-40"
                                style={{
                                  backgroundColor: config.surface,
                                  color: config.textMuted,
                                  border: `1px solid ${config.surfaceBorder}`,
                                }}
                                title="Amallar"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                              {openMenu === `cat-${c.id}` && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setOpenMenu(null)}
                                  />
                                  <div
                                    className="absolute right-0 top-9 z-50 w-[180px] rounded-[12px] p-1.5 shadow-2xl"
                                    style={{
                                      backgroundColor: config.sidebar,
                                      border: `1px solid ${config.surfaceBorder}`,
                                    }}
                                  >
                                    <MenuItem
                                      icon={Pencil}
                                      label="Tahrirlash"
                                      color={config.text}
                                      onClick={() => {
                                        setOpenMenu(null);
                                        setCategoryModal({
                                          mode: "edit",
                                          groupId: g.id,
                                          category: c,
                                        });
                                      }}
                                    />
                                    <MenuItem
                                      icon={c.active ? EyeOff : Eye}
                                      label={c.active ? "Yashirish" : "Ko'rsatish"}
                                      color={config.text}
                                      onClick={() => {
                                        setOpenMenu(null);
                                        toggleCategoryActive(g, c);
                                      }}
                                    />
                                    {pending && (
                                      <MenuItem
                                        icon={Check}
                                        label="Tasdiqlash"
                                        color="#22c55e"
                                        onClick={() => {
                                          setOpenMenu(null);
                                          approveCategory(g, c);
                                        }}
                                      />
                                    )}
                                    {c._count.listings === 0 && (
                                      <>
                                        <div
                                          className="h-px my-1"
                                          style={{ backgroundColor: config.surfaceBorder }}
                                        />
                                        <MenuItem
                                          icon={Trash2}
                                          label="O'chirish"
                                          color="#ef4444"
                                          onClick={() => {
                                            setOpenMenu(null);
                                            deleteCategory(g, c);
                                          }}
                                        />
                                      </>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-3 pt-3" style={{ borderTop: `1px dashed ${config.surfaceBorder}` }}>
                  <button
                    onClick={() => setCategoryModal({ mode: "create", groupId: g.id })}
                    className="h-[34px] px-3 rounded-[8px] text-[12px] font-medium flex items-center gap-1.5 transition-colors"
                    style={{
                      backgroundColor: config.hover,
                      color: config.textMuted,
                      border: `1px solid ${config.surfaceBorder}`,
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Yo&apos;nalish qo&apos;shish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-[14px] p-12 text-center"
          style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}
        >
          <p className="text-[14px]" style={{ color: config.textMuted }}>
            {q ? "Topilmadi" : "Hali guruh qo'shilmagan. \"Yangi guruh\" tugmasi orqali yarating."}
          </p>
        </div>
      )}

      {groupModal && (
        <GroupModal
          existing={groupModal.mode === "edit" ? groupModal.group : undefined}
          onClose={() => setGroupModal(null)}
          onSaved={async () => {
            setGroupModal(null);
            await loadGroups();
          }}
        />
      )}

      {categoryModal && (
        <CategoryModal
          groupId={categoryModal.groupId}
          existing={categoryModal.mode === "edit" ? categoryModal.category : undefined}
          groups={groups}
          onClose={() => setCategoryModal(null)}
          onSaved={async () => {
            setCategoryModal(null);
            await loadGroups();
          }}
        />
      )}
    </div>
  );
}

// ───────────────────── MenuItem ─────────────────────────────

function MenuItem({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon: typeof Eye;
  label: string;
  color: string;
  onClick?: () => void;
}) {
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

// ─────────────────────── Group Modal ─────────────────────────────

function GroupModal({
  existing,
  onClose,
  onSaved,
}: {
  existing?: ApiGroup;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { config } = useAdminTheme();
  const isLight = config.id === "light" || config.id === "cream";

  const [name, setName] = useState(existing?.name ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(existing));
  const [description, setDescription] = useState(existing?.description ?? "");
  const [color, setColor] = useState(existing?.color ?? "#7ea2d4");
  const [active, setActive] = useState(existing?.active ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const canSubmit = name.trim().length > 0 && slug.trim().length > 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const body = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        color: color || null,
        active,
      };
      if (existing) {
        await jsonFetch(`/api/admin/category-groups/${existing.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        await jsonFetch(`/api/admin/category-groups`, {
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
        className="relative rounded-[18px] w-full max-w-[480px] p-5"
        style={{
          backgroundColor: isLight ? "#ffffff" : config.sidebar,
          border: `1px solid ${config.surfaceBorder}`,
        }}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5" style={{ color: color || config.textMuted }} />
            <h2 className="text-[17px] font-bold" style={{ color: config.text }}>
              {existing ? "Guruhni tahrirlash" : "Yangi guruh"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: config.hover, color: config.textMuted }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Nom *">
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Masalan: Tillar"
              className="w-full h-[40px] px-3 rounded-[10px] text-[14px] focus:outline-none"
              style={{
                backgroundColor: config.hover,
                border: `1px solid ${config.surfaceBorder}`,
                color: config.text,
              }}
            />
          </Field>

          <Field label="Slug *">
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value.toLowerCase());
              }}
              placeholder="tillar"
              className="w-full h-[40px] px-3 rounded-[10px] text-[14px] font-mono focus:outline-none"
              style={{
                backgroundColor: config.hover,
                border: `1px solid ${config.surfaceBorder}`,
                color: config.text,
              }}
            />
            <p className="text-[10px] mt-1" style={{ color: config.textDim }}>
              Faqat kichik harf, raqam va &quot;-&quot; belgisi
            </p>
          </Field>

          <Field label="Tavsif (ixtiyoriy)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Guruh haqida qisqa ma'lumot..."
              rows={3}
              className="w-full px-3 py-2 rounded-[10px] text-[13px] focus:outline-none resize-none"
              style={{
                backgroundColor: config.hover,
                border: `1px solid ${config.surfaceBorder}`,
                color: config.text,
              }}
            />
          </Field>

          <Field label="Rang">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(color) ? color : "#7ea2d4"}
                onChange={(e) => setColor(e.target.value)}
                className="w-[44px] h-[40px] rounded-[10px] cursor-pointer"
                style={{ border: `1px solid ${config.surfaceBorder}`, backgroundColor: config.hover }}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#7ea2d4"
                className="flex-1 h-[40px] px-3 rounded-[10px] text-[13px] font-mono focus:outline-none"
                style={{
                  backgroundColor: config.hover,
                  border: `1px solid ${config.surfaceBorder}`,
                  color: config.text,
                }}
              />
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                style={{ backgroundColor: color + "22", color }}
              >
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
          </Field>

          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-[13px]" style={{ color: config.text }}>
              Aktiv (saytda ko&apos;rinadi)
            </span>
          </label>
        </div>

        {error && (
          <p className="text-[12px] mt-3" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium"
            style={{
              backgroundColor: config.hover,
              color: config.textMuted,
              border: `1px solid ${config.surfaceBorder}`,
            }}
          >
            Bekor qilish
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
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

// ────────────────────── Category Modal ───────────────────────────

function CategoryModal({
  groupId,
  existing,
  groups,
  onClose,
  onSaved,
}: {
  groupId: number;
  existing?: ApiCategory;
  groups: ApiGroup[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { config } = useAdminTheme();
  const isLight = config.id === "light" || config.id === "cream";

  const [selectedGroupId, setSelectedGroupId] = useState<number>(groupId);
  const [name, setName] = useState(existing?.name ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(existing));
  const [description, setDescription] = useState(existing?.description ?? "");
  const [color, setColor] = useState(existing?.color ?? "");
  const [active, setActive] = useState(existing?.active ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const canSubmit =
    name.trim().length > 0 && slug.trim().length > 0 && selectedGroupId > 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        color: color.trim() || null,
        active,
      };
      if (existing) {
        body.groupId = selectedGroupId;
        await jsonFetch(`/api/admin/categories/${existing.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        body.groupId = selectedGroupId;
        await jsonFetch(`/api/admin/categories`, {
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
        className="relative rounded-[18px] w-full max-w-[480px] p-5"
        style={{
          backgroundColor: isLight ? "#ffffff" : config.sidebar,
          border: `1px solid ${config.surfaceBorder}`,
        }}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5" style={{ color: config.textMuted }} />
            <h2 className="text-[17px] font-bold" style={{ color: config.text }}>
              {existing ? "Yo'nalishni tahrirlash" : "Yangi yo'nalish"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: config.hover, color: config.textMuted }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Guruh *">
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(Number(e.target.value))}
              className="w-full h-[40px] px-3 rounded-[10px] text-[14px] focus:outline-none"
              style={{
                backgroundColor: config.hover,
                border: `1px solid ${config.surfaceBorder}`,
                color: config.text,
              }}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Nom *">
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Masalan: Ingliz tili"
              className="w-full h-[40px] px-3 rounded-[10px] text-[14px] focus:outline-none"
              style={{
                backgroundColor: config.hover,
                border: `1px solid ${config.surfaceBorder}`,
                color: config.text,
              }}
            />
          </Field>

          <Field label="Slug *">
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value.toLowerCase());
              }}
              placeholder="ingliz-tili"
              className="w-full h-[40px] px-3 rounded-[10px] text-[14px] font-mono focus:outline-none"
              style={{
                backgroundColor: config.hover,
                border: `1px solid ${config.surfaceBorder}`,
                color: config.text,
              }}
            />
          </Field>

          <Field label="Tavsif (ixtiyoriy)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Yo'nalish haqida qisqa..."
              rows={2}
              className="w-full px-3 py-2 rounded-[10px] text-[13px] focus:outline-none resize-none"
              style={{
                backgroundColor: config.hover,
                border: `1px solid ${config.surfaceBorder}`,
                color: config.text,
              }}
            />
          </Field>

          <Field label="Rang (ixtiyoriy)">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(color) ? color : "#7ea2d4"}
                onChange={(e) => setColor(e.target.value)}
                className="w-[44px] h-[40px] rounded-[10px] cursor-pointer"
                style={{ border: `1px solid ${config.surfaceBorder}`, backgroundColor: config.hover }}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#7ea2d4 yoki bo'sh qoldiring"
                className="flex-1 h-[40px] px-3 rounded-[10px] text-[13px] font-mono focus:outline-none"
                style={{
                  backgroundColor: config.hover,
                  border: `1px solid ${config.surfaceBorder}`,
                  color: config.text,
                }}
              />
            </div>
          </Field>

          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-[13px]" style={{ color: config.text }}>
              Aktiv (saytda ko&apos;rinadi)
            </span>
          </label>
        </div>

        {error && (
          <p className="text-[12px] mt-3" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium"
            style={{
              backgroundColor: config.hover,
              color: config.textMuted,
              border: `1px solid ${config.surfaceBorder}`,
            }}
          >
            Bekor qilish
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { config } = useAdminTheme();
  return (
    <div>
      <label className="text-[11px] block mb-1.5 font-medium" style={{ color: config.textDim }}>
        {label}
      </label>
      {children}
    </div>
  );
}
