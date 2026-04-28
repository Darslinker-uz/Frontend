"use client";

import { useEffect, useState } from "react";
import { Search, Star, Trash2, Pencil, X, Save, Phone, Calendar } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

interface ProviderRow {
  id: number;
  name: string;
  centerName: string | null;
  phone: string;
  listingsCount: number;
  ratingsCount: number;
  avgStars: number;
}

interface RatingRow {
  id: number;
  phone: string;
  stars: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ListingRow {
  id: number;
  title: string;
  slug: string;
  status: string;
  ratingsCount: number;
  avgStars: number;
  ratings: RatingRow[];
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("uz-UZ", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch { return iso.slice(0, 10); }
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={value >= n - 0.25 ? "fill-amber-400 text-amber-400" : "text-[#d4d7db]"} style={{ width: size, height: size }} />
      ))}
    </span>
  );
}

export default function AdminRatingsPage() {
  const { config } = useAdminTheme();
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openProvider, setOpenProvider] = useState<ProviderRow | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/ratings", { cache: "no-store" });
      const d = await r.json();
      setProviders(d.providers ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = providers.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.centerName ?? "").toLowerCase().includes(q) ||
           p.name.toLowerCase().includes(q) ||
           p.phone.includes(q);
  });

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>Reytinglar</h1>
        <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>
          {loading ? "Yuklanmoqda..." : `${providers.length} ta o'quv markaz · eng ko'p baho olganlar tepada`}
        </p>
      </div>

      <div className="mb-4 max-w-[400px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Markaz nomi, ism yoki telefon..."
            className="w-full h-[42px] pl-10 pr-4 rounded-[10px] text-[14px] focus:outline-none transition-colors"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="rounded-[14px]" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          {filtered.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setOpenProvider(p)}
              className="w-full flex items-center gap-3 px-4 md:px-5 py-3 md:py-4 text-left transition-colors hover:opacity-90"
              style={{ borderTop: i > 0 ? `1px solid ${config.surfaceBorder}` : "none" }}
            >
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[13px] font-bold shrink-0" style={{ backgroundColor: p.ratingsCount > 0 ? "#f59e0b22" : config.hover, color: p.ratingsCount > 0 ? "#f59e0b" : config.textDim }}>
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate" style={{ color: config.text }}>
                  {p.centerName ?? p.name}
                  {p.centerName && (
                    <span className="font-normal" style={{ color: config.textMuted }}> ({p.name})</span>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[12px]" style={{ color: config.textMuted }}>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</span>
                  <span className="hidden md:inline">·</span>
                  <span className="hidden md:inline">{p.listingsCount} ta e&apos;lon</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0 min-w-[120px]">
                <div className="flex items-center gap-1.5">
                  <Stars value={p.avgStars} />
                  <span className="text-[13px] font-bold" style={{ color: config.text }}>{p.ratingsCount > 0 ? p.avgStars.toFixed(1) : "—"}</span>
                </div>
                <p className="text-[11px]" style={{ color: config.textDim }}>{p.ratingsCount} baholash</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Markaz topilmadi</p>
        </div>
      )}

      {openProvider && (
        <ProviderDetailModal provider={openProvider} onClose={() => { setOpenProvider(null); load(); }} />
      )}
    </div>
  );
}

function ProviderDetailModal({ provider, onClose }: { provider: ProviderRow; onClose: () => void }) {
  const { config } = useAdminTheme();
  const isLight = config.id === "light" || config.id === "cream";
  const [data, setData] = useState<{ provider: ProviderRow; listings: ListingRow[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/ratings/${provider.id}`, { cache: "no-store" });
      const d = await r.json();
      setData(d);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [provider.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (ratingId: number) => {
    if (!confirm("Reytingni o'chirishni xohlaysizmi?")) return;
    await fetch(`/api/admin/ratings/${provider.id}/${ratingId}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[720px] max-h-[92vh] overflow-y-auto rounded-t-[20px] md:rounded-[20px]" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
        <div className="sticky top-0 px-5 md:px-6 pt-5 pb-4 flex items-start justify-between gap-3" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, borderBottom: `1px solid ${config.surfaceBorder}` }}>
          <div className="min-w-0">
            <h2 className="text-[18px] font-bold truncate" style={{ color: config.text }}>{provider.centerName ?? provider.name}</h2>
            <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>
              {provider.name} · {provider.phone}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.hover, color: config.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-4">
          {loading ? (
            <p className="text-[13px] text-center py-8" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
          ) : data && data.listings.length === 0 ? (
            <p className="text-[13px] text-center py-8" style={{ color: config.textMuted }}>E&apos;lon topilmadi</p>
          ) : data && data.listings.map((l) => (
            <div key={l.id} className="rounded-[12px] p-4" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold truncate" style={{ color: config.text }}>{l.title}</p>
                  <span className="inline-flex h-[20px] px-2 rounded-full text-[10px] font-bold mt-1" style={{ backgroundColor: l.status === "active" ? "#22c55e22" : config.surface, color: l.status === "active" ? "#22c55e" : config.textDim }}>
                    {l.status}
                  </span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Stars value={l.avgStars} size={12} />
                    <span className="text-[12px] font-bold" style={{ color: config.text }}>{l.ratingsCount > 0 ? l.avgStars.toFixed(1) : "—"}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: config.textDim }}>{l.ratingsCount} baholash</p>
                </div>
              </div>

              {l.ratings.length > 0 && (
                <div className="space-y-2">
                  {l.ratings.map((r) => (
                    <RatingRowItem key={r.id} rating={r} providerId={provider.id} onDelete={() => handleDelete(r.id)} onSaved={load} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RatingRowItem({ rating, providerId, onDelete, onSaved }: { rating: RatingRow; providerId: number; onDelete: () => void; onSaved: () => void }) {
  const { config } = useAdminTheme();
  const [editing, setEditing] = useState(false);
  const [stars, setStars] = useState(rating.stars);
  const [comment, setComment] = useState(rating.comment ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/ratings/${providerId}/${rating.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars, comment: comment.trim() || null }),
      });
      setEditing(false);
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="rounded-[10px] p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-semibold" style={{ color: config.text }}>{rating.phone}</span>
            <span className="text-[10px]" style={{ color: config.textDim }}>
              <Calendar className="w-2.5 h-2.5 inline mr-0.5" />{formatDate(rating.createdAt)}
            </span>
          </div>
          {editing ? (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setStars(n)} className="p-0.5">
                    <Star className={`w-5 h-5 ${stars >= n ? "fill-amber-400 text-amber-400" : "text-[#d4d7db]"}`} />
                  </button>
                ))}
                <span className="text-[11px] ml-1" style={{ color: config.textMuted }}>{stars}/5</span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                rows={2}
                className="w-full px-2.5 py-1.5 rounded-[8px] text-[12px] focus:outline-none transition-colors resize-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 mt-1">
                <Stars value={rating.stars} size={12} />
              </div>
              {rating.comment && (
                <p className="text-[12px] mt-1.5" style={{ color: config.textMuted }}>{rating.comment}</p>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {editing ? (
            <>
              <button onClick={save} disabled={saving} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-green-500 hover:bg-green-500/10 transition-colors" title="Saqlash">
                <Save className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => { setEditing(false); setStars(rating.stars); setComment(rating.comment ?? ""); }} className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-colors" style={{ color: config.textDim }} title="Bekor qilish">
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-colors hover:bg-[#7ea2d4]/10 hover:text-[#7ea2d4]" style={{ color: config.textDim }} title="Tahrirlash">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={onDelete} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors" title="O'chirish">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
