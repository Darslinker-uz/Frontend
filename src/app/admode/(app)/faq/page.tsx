"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, AlertCircle, GripVertical,
  MoreHorizontal, HelpCircle, Search,
} from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

interface AdminFaq {
  id: number;
  question: string;
  answer: string;
  page: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; faq: AdminFaq };

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

export default function AdminFaqPage() {
  const { config } = useAdminTheme();
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [pageFilter, setPageFilter] = useState<"all" | "home">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [topError, setTopError] = useState<string | null>(null);
  const dragId = useRef<number | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await jsonFetch<{ faqs: AdminFaq[] }>("/api/admin/faq");
      setFaqs(r.faqs ?? []);
    } catch (e) {
      setTopError(e instanceof Error ? e.message : "Yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const q = search.trim().toLowerCase();
  const filtered = faqs.filter((f) => {
    if (pageFilter !== "all" && f.page !== pageFilter) return false;
    if (q && !f.question.toLowerCase().includes(q) && !f.answer.toLowerCase().includes(q)) return false;
    return true;
  });

  const toggleActive = async (f: AdminFaq) => {
    setBusyId(f.id);
    const prev = faqs;
    setFaqs((p) => p.map((x) => x.id === f.id ? { ...x, active: !x.active } : x));
    try {
      await jsonFetch(`/api/admin/faq/${f.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !f.active }),
      });
    } catch (e) {
      setFaqs(prev);
      setTopError(e instanceof Error ? e.message : "O'zgartirib bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (f: AdminFaq) => {
    if (!confirm(`"${f.question}" savolini o'chirmoqchimisiz?`)) return;
    setBusyId(f.id);
    const prev = faqs;
    setFaqs((p) => p.filter((x) => x.id !== f.id));
    try {
      await jsonFetch(`/api/admin/faq/${f.id}`, { method: "DELETE" });
    } catch (e) {
      setFaqs(prev);
      setTopError(e instanceof Error ? e.message : "O'chirib bo'lmadi");
    } finally {
      setBusyId(null);
    }
  };

  // Drag-drop reorder (faqat shu page ichidagilar)
  const onDragStart = (id: number) => () => { dragId.current = id; };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop = async (targetId: number) => {
    const sourceId = dragId.current;
    if (sourceId == null || sourceId === targetId) return;
    const sortedAll = [...faqs].sort((a, b) => a.order - b.order);
    const sourceIdx = sortedAll.findIndex((r) => r.id === sourceId);
    const targetIdx = sortedAll.findIndex((r) => r.id === targetId);
    if (sourceIdx < 0 || targetIdx < 0) return;
    const [moved] = sortedAll.splice(sourceIdx, 1);
    sortedAll.splice(targetIdx, 0, moved);
    const reordered = sortedAll.map((r, i) => ({ ...r, order: i + 1 }));
    setFaqs(reordered);
    try {
      await jsonFetch("/api/admin/faq", {
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
    all: faqs.length,
    home: faqs.filter((f) => f.page === "home").length,
    active: faqs.filter((f) => f.active).length,
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>FAQ</h1>
          <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>
            {loading ? "Yuklanmoqda..." : `${counts.all} ta savol — ${counts.active} aktiv. Bosh sahifaning "Ko'p so'raladigan savollar" bo'limini boshqaradi.`}
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="h-[40px] px-4 rounded-[10px] text-[13px] font-semibold flex items-center gap-2"
          style={{ backgroundColor: config.accent, color: config.accentText }}
        >
          <Plus className="w-4 h-4" /> Yangi savol
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

      <div className="mb-4 space-y-3">
        <div className="max-w-[400px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Savol yoki javob..."
            className="w-full h-[42px] pl-10 pr-4 rounded-[10px] text-[14px] focus:outline-none"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={pageFilter === "all"} onClick={() => setPageFilter("all")} label={`Hammasi · ${counts.all}`} />
          <Chip active={pageFilter === "home"} onClick={() => setPageFilter("home")} label={`Bosh sahifa · ${counts.home}`} />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Topilmadi</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((f) => (
            <div
              key={f.id}
              draggable
              onDragStart={onDragStart(f.id)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(f.id)}
              className="rounded-[12px] p-4"
              style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, opacity: f.active ? 1 : 0.5 }}
            >
              <div className="flex items-start gap-3">
                <div className="cursor-move pt-0.5" style={{ color: config.textDim }}>
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                      <HelpCircle className="w-2.5 h-2.5" /> {f.page}
                    </span>
                    {f.active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/15 text-green-500">
                        <Eye className="w-2.5 h-2.5" /> Aktiv
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-500/15 text-gray-400">
                        <EyeOff className="w-2.5 h-2.5" /> Yashirin
                      </span>
                    )}
                    <span className="text-[10px]" style={{ color: config.textDim }}>#{f.order}</span>
                  </div>
                  <p className="text-[14px] font-semibold leading-snug" style={{ color: config.text }}>{f.question}</p>
                  <p className="text-[13px] mt-1.5 line-clamp-2 leading-relaxed" style={{ color: config.textMuted }}>{f.answer}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(f)}
                    disabled={busyId === f.id}
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center disabled:opacity-50"
                    style={f.active ? { backgroundColor: "#22c55e22", color: "#22c55e" } : { backgroundColor: config.hover, color: config.textDim }}
                    title={f.active ? "Yashirish" : "Aktivlash"}
                  >
                    {f.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <RowMenu
                    isOpen={openMenu === f.id}
                    busy={busyId === f.id}
                    onOpen={() => setOpenMenu(openMenu === f.id ? null : f.id)}
                    onClose={() => setOpenMenu(null)}
                    onEdit={() => { setOpenMenu(null); setModal({ mode: "edit", faq: f }); }}
                    onDelete={() => { setOpenMenu(null); remove(f); }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <FaqModal
          existing={modal.mode === "edit" ? modal.faq : undefined}
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

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  const { config } = useAdminTheme();
  return (
    <button
      onClick={onClick}
      className="h-[32px] px-3 rounded-full text-[12px] font-medium transition-all"
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

function FaqModal({
  existing, onClose, onSaved,
}: {
  existing?: AdminFaq;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { config } = useAdminTheme();
  const isLight = config.id === "light" || config.id === "cream";

  const [question, setQuestion] = useState(existing?.question ?? "");
  const [answer, setAnswer] = useState(existing?.answer ?? "");
  const [page, setPage] = useState(existing?.page ?? "home");
  const [active, setActive] = useState(existing?.active ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = question.trim().length >= 5 && answer.trim().length >= 10 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const body = { question: question.trim(), answer: answer.trim(), page, active };
      if (existing) {
        await jsonFetch(`/api/admin/faq/${existing.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        await jsonFetch("/api/admin/faq", {
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
        className="relative rounded-[18px] w-full max-w-[640px] max-h-[92vh] flex flex-col overflow-hidden"
        style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
      >
        <div
          className="flex items-start justify-between px-5 md:px-6 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}
        >
          <h2 className="text-[18px] font-bold" style={{ color: config.text }}>
            {existing ? "Savolni tahrirlash" : "Yangi savol"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-4 space-y-3">
          <div>
            <label className="text-[11px] block mb-1.5 font-medium" style={{ color: config.textDim }}>Savol *</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Masalan: Darslinker.uz nima?"
              className="w-full h-[40px] px-3 rounded-[10px] text-[14px] focus:outline-none"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
            <p className="text-[10px] mt-1" style={{ color: config.textDim }}>{question.length} belgi</p>
          </div>

          <div>
            <label className="text-[11px] block mb-1.5 font-medium" style={{ color: config.textDim }}>Javob *</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Batafsil javob — Google FAQPage rich snippet'da chiqadi..."
              rows={6}
              className="w-full px-3 py-2 rounded-[10px] text-[13px] focus:outline-none resize-y"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
            <p className="text-[10px] mt-1" style={{ color: config.textDim }}>{answer.length} belgi (kamida 10)</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] block mb-1.5 font-medium" style={{ color: config.textDim }}>Sahifa</label>
              <select
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="w-full h-[40px] px-3 rounded-[10px] text-[13px] focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              >
                <option value="home">Bosh sahifa</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4" />
                <span className="text-[13px]" style={{ color: config.text }}>Aktiv (sahifada chiqadi)</span>
              </label>
            </div>
          </div>

          {error && <p className="text-[12px] mt-1" style={{ color: "#ef4444" }}>{error}</p>}
        </div>

        <div
          className="px-5 md:px-6 py-3 flex gap-2 shrink-0"
          style={{ borderTop: `1px solid ${config.surfaceBorder}` }}
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
