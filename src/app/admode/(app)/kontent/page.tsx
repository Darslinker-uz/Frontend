"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, GraduationCap, Star, HelpCircle, FileText,
  MoreHorizontal, X, AlertCircle, ExternalLink,
} from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

// ───────────────────────────── Types ─────────────────────────────

type ArticleType = "lugat" | "qollanma" | "sharh" | "savol" | "blog";
type ArticleStatus = "draft" | "published";

// Blog turida public URL /blog/{slug}, qolganlarida /manba/{slug}
const PUBLIC_PREFIX: Record<ArticleType, string> = {
  lugat: "/manba",
  qollanma: "/manba",
  sharh: "/manba",
  savol: "/manba",
  blog: "/blog",
};

interface AdminArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  type: ArticleType;
  coverImage: string | null;
  author: string | null;
  readTime: string | null;
  status: ArticleStatus;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: number; name: string; slug: string } | null;
  group: { id: number; name: string; slug: string } | null;
  categoryId?: number | null;
  groupId?: number | null;
}

interface ApiCategory { id: number; name: string; slug: string }
interface ApiGroup { id: number; name: string; slug: string; categories: ApiCategory[] }

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; article: AdminArticle };

// ─────────────────────────── Helpers ─────────────────────────────

const TYPE_LABELS: Record<ArticleType, string> = {
  lugat: "Lug'at",
  qollanma: "Qo'llanma",
  sharh: "Sharh",
  savol: "Savol",
  blog: "Blog",
};

const TYPE_ICONS = {
  lugat: BookOpen,
  qollanma: GraduationCap,
  sharh: Star,
  savol: HelpCircle,
  blog: FileText,
} as const;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’ʻ`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function formatDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" });
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

// ─────────────────────────── Page ────────────────────────────────

export default function AdminKontentPage() {
  const { config } = useAdminTheme();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ArticleType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ArticleStatus>("all");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [topError, setTopError] = useState<string | null>(null);

  const loadAll = async () => {
    try {
      const [aRes, gRes] = await Promise.all([
        jsonFetch<{ articles: AdminArticle[] }>("/api/admin/manba"),
        jsonFetch<{ groups: ApiGroup[] }>("/api/admin/categories"),
      ]);
      setArticles(aRes.articles ?? []);
      setGroups(gRes.groups ?? []);
    } catch (e) {
      console.error("[admin/manba] load failed", e);
      setTopError(e instanceof Error ? e.message : "Yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const q = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.slug.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [articles, typeFilter, statusFilter, q]);

  // ───── Mutations ─────

  const toggleStatus = async (a: AdminArticle) => {
    setBusyId(a.id);
    const nextStatus: ArticleStatus = a.status === "published" ? "draft" : "published";
    const prev = articles;
    setArticles((p) => p.map((x) => x.id === a.id ? { ...x, status: nextStatus } : x));
    try {
      await jsonFetch(`/api/admin/manba/${a.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (e) {
      setArticles(prev);
      setTopError(e instanceof Error ? e.message : "Status o'zgartirib bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  const deleteArticle = async (a: AdminArticle) => {
    if (!confirm(`"${a.title}" kontentini o'chirishni tasdiqlaysizmi?`)) return;
    setBusyId(a.id);
    const prev = articles;
    setArticles((p) => p.filter((x) => x.id !== a.id));
    try {
      await jsonFetch(`/api/admin/manba/${a.id}`, { method: "DELETE" });
    } catch (e) {
      setArticles(prev);
      setTopError(e instanceof Error ? e.message : "O'chirib bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  // ─────────── Render ───────────

  const counts = {
    all: articles.length,
    blog: articles.filter(a => a.type === "blog").length,
    lugat: articles.filter(a => a.type === "lugat").length,
    qollanma: articles.filter(a => a.type === "qollanma").length,
    sharh: articles.filter(a => a.type === "sharh").length,
    savol: articles.filter(a => a.type === "savol").length,
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>Kontent</h1>
          <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>
            {loading ? "Yuklanmoqda..." : `${articles.length} ta kontent, ${articles.filter(a => a.status === "published").length} ta nashr qilingan`} — Manba (lug'at/qo'llanma/sharh/savol) + Blog
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="h-[40px] px-4 rounded-[10px] text-[13px] font-semibold flex items-center gap-2"
          style={{ backgroundColor: config.accent, color: config.accentText }}
        >
          <Plus className="w-4 h-4" /> Yangi kontent
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

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div className="max-w-[400px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sarlavha yoki slug..."
            className="w-full h-[42px] pl-10 pr-4 rounded-[10px] text-[14px] focus:outline-none"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip active={typeFilter === "all"} onClick={() => setTypeFilter("all")} label={`Hammasi · ${counts.all}`} />
          <Chip active={typeFilter === "blog"} onClick={() => setTypeFilter("blog")} label={`Blog · ${counts.blog}`} />
          <Chip active={typeFilter === "lugat"} onClick={() => setTypeFilter("lugat")} label={`Lug'at · ${counts.lugat}`} />
          <Chip active={typeFilter === "qollanma"} onClick={() => setTypeFilter("qollanma")} label={`Qo'llanma · ${counts.qollanma}`} />
          <Chip active={typeFilter === "sharh"} onClick={() => setTypeFilter("sharh")} label={`Sharh · ${counts.sharh}`} />
          <Chip active={typeFilter === "savol"} onClick={() => setTypeFilter("savol")} label={`Savol · ${counts.savol}`} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip active={statusFilter === "all"} onClick={() => setStatusFilter("all")} label="Barcha statuslar" small />
          <Chip active={statusFilter === "published"} onClick={() => setStatusFilter("published")} label="Nashr qilingan" small />
          <Chip active={statusFilter === "draft"} onClick={() => setStatusFilter("draft")} label="Qoralama" small />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>
            {q || typeFilter !== "all" || statusFilter !== "all" ? "Topilmadi" : "Hali kontent qo'shilmagan."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-[14px] overflow-hidden" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
                    <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3" style={{ color: config.textDim }}>Sarlavha</th>
                    <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3" style={{ color: config.textDim }}>Turi</th>
                    <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3" style={{ color: config.textDim }}>Status</th>
                    <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3" style={{ color: config.textDim }}>Sana</th>
                    <th className="text-right text-[11px] font-bold uppercase tracking-wider px-4 py-3" style={{ color: config.textDim }}>Ko&apos;rishlar</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const Icon = TYPE_ICONS[a.type];
                    return (
                      <tr key={a.id} style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div>
                              <p className="text-[14px] font-semibold truncate max-w-[400px]" style={{ color: config.text }}>{a.title}</p>
                              <p className="text-[11px] font-mono truncate max-w-[400px]" style={{ color: config.textDim }}>{a.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                            <Icon className="w-2.5 h-2.5" /> {TYPE_LABELS[a.type]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {a.status === "published" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/15 text-green-500">
                              <Eye className="w-2.5 h-2.5" /> Nashr
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-500/15 text-gray-400">
                              <EyeOff className="w-2.5 h-2.5" /> Qoralama
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[12px]" style={{ color: config.textMuted }}>{formatDate(a.publishedAt ?? a.createdAt)}</td>
                        <td className="px-4 py-3 text-right text-[13px] font-semibold" style={{ color: config.text }}>{a.views}</td>
                        <td className="px-4 py-3">
                          <RowMenu
                            article={a}
                            isOpen={openMenu === a.id}
                            busy={busyId === a.id}
                            onOpen={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                            onClose={() => setOpenMenu(null)}
                            onEdit={() => { setOpenMenu(null); setModal({ mode: "edit", article: a }); }}
                            onToggle={() => { setOpenMenu(null); toggleStatus(a); }}
                            onDelete={() => { setOpenMenu(null); deleteArticle(a); }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((a) => {
              const Icon = TYPE_ICONS[a.type];
              return (
                <div key={a.id} className="rounded-[12px] p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-[14px] font-semibold flex-1" style={{ color: config.text }}>{a.title}</p>
                    <RowMenu
                      article={a}
                      isOpen={openMenu === a.id}
                      busy={busyId === a.id}
                      onOpen={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                      onClose={() => setOpenMenu(null)}
                      onEdit={() => { setOpenMenu(null); setModal({ mode: "edit", article: a }); }}
                      onToggle={() => { setOpenMenu(null); toggleStatus(a); }}
                      onDelete={() => { setOpenMenu(null); deleteArticle(a); }}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                      <Icon className="w-2.5 h-2.5" /> {TYPE_LABELS[a.type]}
                    </span>
                    {a.status === "published" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/15 text-green-500">
                        <Eye className="w-2.5 h-2.5" /> Nashr
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-500/15 text-gray-400">
                        <EyeOff className="w-2.5 h-2.5" /> Qoralama
                      </span>
                    )}
                    <span className="text-[11px]" style={{ color: config.textDim }}>· {formatDate(a.publishedAt ?? a.createdAt)}</span>
                    <span className="text-[11px]" style={{ color: config.textDim }}>· {a.views} ko&apos;rish</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {modal && (
        <ArticleModal
          existing={modal.mode === "edit" ? modal.article : undefined}
          groups={groups}
          onClose={() => setModal(null)}
          onSaved={async () => {
            setModal(null);
            await loadAll();
          }}
        />
      )}
    </div>
  );
}

// ───────────────────── Chip ────────────────────────

function Chip({ active, onClick, label, small }: { active: boolean; onClick: () => void; label: string; small?: boolean }) {
  const { config } = useAdminTheme();
  return (
    <button
      onClick={onClick}
      className={`${small ? "h-[28px] px-2.5 text-[11px]" : "h-[32px] px-3 text-[12px]"} rounded-full font-medium transition-all`}
      style={{
        backgroundColor: active ? config.accent : config.surface,
        color: active ? config.accentText : config.textMuted,
        border: `1px solid ${active ? config.accent : config.surfaceBorder}`,
      }}
    >
      {label}
    </button>
  );
}

// ───────────────────── Row Menu ────────────────────

function RowMenu({
  article, isOpen, busy, onOpen, onClose, onEdit, onToggle, onDelete,
}: {
  article: AdminArticle; isOpen: boolean; busy: boolean;
  onOpen: () => void; onClose: () => void;
  onEdit: () => void; onToggle: () => void; onDelete: () => void;
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
            className="absolute right-0 top-10 z-50 w-[200px] rounded-[12px] p-1.5 shadow-2xl"
            style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
          >
            <MenuItem icon={Pencil} label="Tahrirlash" color={config.text} onClick={onEdit} />
            <MenuItem
              icon={article.status === "published" ? EyeOff : Eye}
              label={article.status === "published" ? "Qoralamaga" : "Nashr qilish"}
              color={config.text}
              onClick={onToggle}
            />
            <a
              href={`${PUBLIC_PREFIX[article.type]}/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[13px] font-medium hover:bg-black/5"
              style={{ color: config.text }}
            >
              <ExternalLink className="w-4 h-4 shrink-0" /> Ko&apos;rish
            </a>
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

// ───────────────────── Article Modal ────────────────

function ArticleModal({
  existing, groups, onClose, onSaved,
}: {
  existing?: AdminArticle;
  groups: ApiGroup[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { config } = useAdminTheme();
  const isLight = config.id === "light" || config.id === "cream";

  const [type, setType] = useState<ArticleType>(existing?.type ?? "blog");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(existing));
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [coverImage, setCoverImage] = useState(existing?.coverImage ?? "");
  const [author, setAuthor] = useState(existing?.author ?? "");
  const [readTime, setReadTime] = useState(existing?.readTime ?? "");
  const [categoryId, setCategoryId] = useState<number | "">(existing?.category?.id ?? existing?.categoryId ?? "");
  const [groupId, setGroupId] = useState<number | "">(existing?.group?.id ?? existing?.groupId ?? "");
  const [status, setStatus] = useState<ArticleStatus>(existing?.status ?? "draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const canSubmit = title.trim().length >= 3 && content.trim().length >= 20 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        type,
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        coverImage: coverImage.trim() || null,
        author: author.trim() || null,
        readTime: readTime.trim() || null,
        status,
        categoryId: categoryId === "" ? null : categoryId,
        groupId: groupId === "" ? null : groupId,
      };
      if (existing) {
        await jsonFetch(`/api/admin/manba/${existing.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        await jsonFetch(`/api/admin/manba`, {
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
    <div className="fixed inset-0 z-[100] flex items-stretch md:items-center justify-center p-3 md:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative rounded-[18px] w-full max-w-[680px] max-h-[92vh] flex flex-col overflow-hidden"
        style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
      >
        {/* Sticky header */}
        <div
          className="flex items-start justify-between px-5 md:px-6 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${config.surfaceBorder}`, backgroundColor: isLight ? "#ffffff" : config.sidebar }}
        >
          <h2 className="text-[18px] font-bold" style={{ color: config.text }}>
            {existing ? "Kontentni tahrirlash" : "Yangi kontent"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Turi *">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ArticleType)}
                className="w-full h-[40px] px-3 rounded-[10px] text-[14px] focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              >
                <option value="blog">Blog (erkin maqola → /blog)</option>
                <option value="lugat">Lug&apos;at (atama → /manba)</option>
                <option value="qollanma">Qo&apos;llanma (step-by-step → /manba)</option>
                <option value="sharh">Sharh (top X → /manba)</option>
                <option value="savol">Savol (FAQ → /manba)</option>
              </select>
            </Field>

            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                className="w-full h-[40px] px-3 rounded-[10px] text-[14px] focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              >
                <option value="draft">Qoralama</option>
                <option value="published">Nashr qilingan</option>
              </select>
            </Field>
          </div>

          <Field label="Sarlavha *">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Masalan: IELTS deganda nima tushuniladi?"
              className="w-full h-[40px] px-3 rounded-[10px] text-[14px] focus:outline-none"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
          </Field>

          <Field label="Slug">
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlugTouched(true); setSlug(e.target.value.toLowerCase()); }}
              placeholder="ielts-nima"
              className="w-full h-[40px] px-3 rounded-[10px] text-[14px] font-mono focus:outline-none"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
            <p className="text-[10px] mt-1" style={{ color: config.textDim }}>
              Faqat kichik harf, raqam va &quot;-&quot;. Bo&apos;sh qoldirsangiz, sarlavhadan avtomatik yaratiladi.
            </p>
          </Field>

          <Field label={`Excerpt — qisqa tavsif (${excerpt.length}/300)`}>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value.slice(0, 300))}
              placeholder="SEO uchun qisqa tavsif (1-2 jumla)..."
              rows={2}
              className="w-full px-3 py-2 rounded-[10px] text-[13px] focus:outline-none resize-none"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
          </Field>

          <Field label="Matn (markdown) *">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"## Sarlavha\n\nMatn paragraf...\n\n**bold** va *italic*\n\n- ro'yxat 1\n- ro'yxat 2\n\n[link](https://example.com)"}
              className="w-full px-3 py-2 rounded-[10px] text-[13px] font-mono focus:outline-none resize-y h-[200px]"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
            <p className="text-[10px] mt-1" style={{ color: config.textDim }}>
              Markdown qo&apos;llab-quvvatlanadi: ## sarlavha, **bold**, *italic*, [link](url), - ro&apos;yxat. Kamida 20 belgi.
            </p>
          </Field>

          <Field label="Cover image URL (ixtiyoriy)">
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full h-[40px] px-3 rounded-[10px] text-[13px] font-mono focus:outline-none"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Muallif (ixtiyoriy, blog uchun)">
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ali Karimov"
                className="w-full h-[40px] px-3 rounded-[10px] text-[13px] focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
            </Field>
            <Field label="O'qish vaqti (ixtiyoriy)">
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 daqiqa"
                className="w-full h-[40px] px-3 rounded-[10px] text-[13px] focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Yo'nalish (ixtiyoriy)">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full h-[40px] px-3 rounded-[10px] text-[13px] focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              >
                <option value="">— Tanlanmagan —</option>
                {groups.map((g) => (
                  <optgroup key={g.id} label={g.name}>
                    {g.categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>

            <Field label="Guruh (ixtiyoriy)">
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full h-[40px] px-3 rounded-[10px] text-[13px] focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              >
                <option value="">— Tanlanmagan —</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </Field>
          </div>

          {error && <p className="text-[12px] mt-1" style={{ color: "#ef4444" }}>{error}</p>}
        </div>

        {/* Sticky footer */}
        <div
          className="px-5 md:px-6 py-3 flex gap-2 shrink-0"
          style={{ borderTop: `1px solid ${config.surfaceBorder}`, backgroundColor: isLight ? "#ffffff" : config.sidebar }}
        >
          <button
            onClick={onClose}
            className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium"
            style={{ backgroundColor: config.hover, color: config.textMuted, border: `1px solid ${config.surfaceBorder}` }}
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
      <label className="text-[11px] block mb-1.5 font-medium" style={{ color: config.textDim }}>{label}</label>
      {children}
    </div>
  );
}
