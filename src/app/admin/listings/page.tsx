"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Check, X, Eye, MoreHorizontal, AlertCircle, Clock, Zap, MapPin, Pause, Play, Trash2, Pencil, Plus, Star, ArrowRight } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";
import { GRADIENT_OPTIONS, ICON_OPTIONS } from "@/data/courses";

type Status = "pending" | "active" | "paused" | "rejected";

interface Listing {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  format: "offline" | "online" | "video";
  location: string | null;
  duration: string | null;
  phone: string;
  imageUrl: string | null;
  imagePosX: number;
  imagePosY: number;
  imageZoom: number;
  color: string | null;
  icon: string | null;
  views: number;
  status: Status;
  rejectReason: string | null;
  createdAt: string;
  user: { id: number; name: string; phone: string; telegramChatId: string | null };
  category: { id: number; name: string; slug: string; color: string | null };
  _count: { leads: number; boosts: number };
}

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  pending: { label: "Tekshiruvda", color: "#f59e0b" },
  active: { label: "Aktiv", color: "#22c55e" },
  paused: { label: "Pauza", color: "#64748b" },
  rejected: { label: "Rad etilgan", color: "#ef4444" },
};

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n);
const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Hozir";
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 172800) return "Kecha";
  return new Date(iso).toLocaleDateString("uz-UZ");
};

export default function AdminListingsPage() {
  const { config } = useAdminTheme();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"hammasi" | Status>("pending");
  const [search, setSearch] = useState("");
  const [openListing, setOpenListing] = useState<Listing | null>(null);
  const [rejectModal, setRejectModal] = useState<Listing | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Listing | null>(null);
  const isLight = config.id === "light" || config.id === "cream";

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/listings");
      const d = await r.json();
      setListings(d.listings);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = listings.filter(l => {
    if (tab !== "hammasi" && l.status !== tab) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!l.title.toLowerCase().includes(q) && !l.user.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    hammasi: listings.length,
    pending: listings.filter(l => l.status === "pending").length,
    active: listings.filter(l => l.status === "active").length,
    paused: listings.filter(l => l.status === "paused").length,
    rejected: listings.filter(l => l.status === "rejected").length,
  };

  const updateStatus = async (id: number, patch: { status?: Status; rejectReason?: string }) => {
    const prev = [...listings];
    setListings(p => p.map(l => l.id === id ? { ...l, ...patch } : l));
    try {
      await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (e) { console.error(e); setListings(prev); }
  };

  const approve = (id: number) => { updateStatus(id, { status: "active" }); setMenuOpen(null); };
  const togglePause = (l: Listing) => { updateStatus(l.id, { status: l.status === "active" ? "paused" : "active" }); setMenuOpen(null); };

  const reject = () => {
    if (!rejectModal || !rejectReason.trim()) return;
    updateStatus(rejectModal.id, { status: "rejected", rejectReason });
    setRejectModal(null);
    setRejectReason("");
    setMenuOpen(null);
  };

  const deleteListing = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete.id;
    const prev = [...listings];
    setListings(p => p.filter(l => l.id !== id));
    setConfirmDelete(null);
    setMenuOpen(null);
    try {
      await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    } catch (e) { console.error(e); setListings(prev); }
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>E&apos;lonlar moderatsiyasi</h1>
          <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>
            {loading ? "Yuklanmoqda..." : counts.pending > 0 ? <>{" "}<span style={{ color: config.accent }}>{counts.pending} ta</span> e&apos;lon tekshiruv kutmoqda</> : "Barcha e'lon tekshiruv kutmoqda"}
          </p>
        </div>
        <Link
          href="/admin/listings/new"
          className="h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2"
          style={{ backgroundColor: config.accent, color: config.accentText }}
        >
          <Plus className="w-4 h-4" /> <span className="hidden md:inline">Yangi e&apos;lon</span>
        </Link>
      </div>

      <div className="mb-4 max-w-[400px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kurs nomi yoki markaz..."
            className="w-full h-[42px] pl-10 pr-4 rounded-[10px] text-[14px] focus:outline-none transition-colors"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {[
          { key: "pending" as const, label: "Tekshiruvda", count: counts.pending },
          { key: "active" as const, label: "Aktiv", count: counts.active },
          { key: "paused" as const, label: "Pauza", count: counts.paused },
          { key: "rejected" as const, label: "Rad etilgan", count: counts.rejected },
          { key: "hammasi" as const, label: "Hammasi", count: counts.hammasi },
        ].map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="shrink-0 h-[36px] px-4 rounded-full text-[13px] font-medium flex items-center gap-2"
              style={{
                backgroundColor: isActive ? config.accent : config.surface,
                color: isActive ? config.accentText : config.textMuted,
                border: `1px solid ${isActive ? config.accent : config.surfaceBorder}`,
              }}
            >
              {t.label}
              <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: isActive ? `${config.accentText}22` : config.hover, color: isActive ? config.accentText : config.textDim }}>
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
        <div className="space-y-3">
          {filtered.map((l) => (
            <div key={l.id} className="rounded-[14px] p-4 md:p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="h-[22px] px-2.5 rounded-full text-[10px] font-bold flex items-center gap-1" style={{ backgroundColor: `${STATUS_CONFIG[l.status].color}22`, color: STATUS_CONFIG[l.status].color }}>
                      {l.status === "pending" && <Clock className="w-2.5 h-2.5" />}
                      {STATUS_CONFIG[l.status].label}
                    </span>
                    {l._count.boosts > 0 && (
                      <span className="h-[22px] px-2.5 rounded-full text-[10px] font-bold flex items-center gap-1" style={{ backgroundColor: `${config.accent}22`, color: config.accent }}>
                        <Zap className="w-2.5 h-2.5 fill-current" /> boost
                      </span>
                    )}
                    <span className="text-[11px]" style={{ color: config.textDim }}>{l.category.name}</span>
                  </div>
                  <h3 className="text-[15px] md:text-[16px] font-semibold leading-tight" style={{ color: config.text }}>{l.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-[12px]" style={{ color: config.textMuted }}>
                    <span>{l.user.name}</span>
                    <span>•</span>
                    <span>{l.price === 0 ? "Bepul" : `${fmt(l.price)} so'm`}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:inline capitalize">{l.format}</span>
                    {l.location && (
                      <>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:flex items-center gap-1"><MapPin className="w-3 h-3" />{l.location}</span>
                      </>
                    )}
                  </div>
                  {l.status === "active" && (
                    <div className="flex items-center gap-3 mt-2 text-[11px]" style={{ color: config.textDim }}>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmt(l.views)}</span>
                      <span>{l._count.leads} ariza</span>
                      <span>•</span>
                      <span>{timeAgo(l.createdAt)}</span>
                    </div>
                  )}
                  {l.rejectReason && (
                    <div className="mt-3 rounded-[10px] p-2.5 flex items-start gap-2" style={{ backgroundColor: "#ef44441a", border: "1px solid #ef444433" }}>
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
                      <p className="text-[12px]" style={{ color: "#ef4444" }}>{l.rejectReason}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {l.status === "pending" && (
                    <>
                      <button
                        onClick={() => approve(l.id)}
                        className="hidden md:flex h-[36px] px-3 rounded-[8px] items-center gap-1.5 text-[12px] font-medium"
                        style={{ backgroundColor: "#22c55e22", color: "#22c55e" }}
                      >
                        <Check className="w-3.5 h-3.5" /> Tasdiqlash
                      </button>
                      <button
                        onClick={() => { setRejectModal(l); setRejectReason(""); }}
                        className="hidden md:flex h-[36px] px-3 rounded-[8px] items-center gap-1.5 text-[12px] font-medium"
                        style={{ backgroundColor: "#ef444422", color: "#ef4444" }}
                      >
                        <X className="w-3.5 h-3.5" /> Rad etish
                      </button>
                    </>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === l.id ? null : l.id)}
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                      style={{ backgroundColor: config.hover, color: config.textMuted }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === l.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-10 z-50 w-[200px] rounded-[10px] py-1 shadow-xl" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                          <button onClick={() => { setOpenListing(l); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px]" style={{ color: config.textMuted }}>
                            <Eye className="w-3.5 h-3.5" /> Batafsil
                          </button>
                          <Link href={`/admin/listings/${l.id}/edit`} className="w-full flex items-center gap-2 px-3 py-2 text-[13px]" style={{ color: config.textMuted }} onClick={() => setMenuOpen(null)}>
                            <Pencil className="w-3.5 h-3.5" /> Tahrirlash
                          </Link>
                          {(l.status === "active" || l.status === "paused") && (
                            <button onClick={() => togglePause(l)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px]" style={{ color: config.textMuted }}>
                              {l.status === "active" ? <><Pause className="w-3.5 h-3.5" /> Pauzaga qo&apos;yish</> : <><Play className="w-3.5 h-3.5" /> Aktivlashtirish</>}
                            </button>
                          )}
                          <div style={{ borderTop: `1px solid ${config.surfaceBorder}` }} className="my-1" />
                          <button onClick={() => { setConfirmDelete(l); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px]" style={{ color: "#ef4444" }}>
                            <Trash2 className="w-3.5 h-3.5" /> O&apos;chirish
                          </button>
                          {l.status === "pending" && (
                            <>
                              <div style={{ borderTop: `1px solid ${config.surfaceBorder}` }} className="my-1" />
                              <button onClick={() => approve(l.id)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px]" style={{ color: "#22c55e" }}>
                                <Check className="w-3.5 h-3.5" /> Tasdiqlash
                              </button>
                              <button onClick={() => { setRejectModal(l); setRejectReason(""); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px]" style={{ color: "#ef4444" }}>
                                <X className="w-3.5 h-3.5" /> Rad etish
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {l.status === "pending" && (
                <div className="md:hidden flex gap-2 mt-3">
                  <button onClick={() => approve(l.id)} className="flex-1 h-[36px] rounded-[8px] flex items-center justify-center gap-1.5 text-[12px] font-medium" style={{ backgroundColor: "#22c55e22", color: "#22c55e" }}>
                    <Check className="w-3.5 h-3.5" /> Tasdiqlash
                  </button>
                  <button onClick={() => { setRejectModal(l); setRejectReason(""); }} className="flex-1 h-[36px] rounded-[8px] flex items-center justify-center gap-1.5 text-[12px] font-medium" style={{ backgroundColor: "#ef444422", color: "#ef4444" }}>
                    <X className="w-3.5 h-3.5" /> Rad etish
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>E&apos;lon topilmadi</p>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative rounded-[18px] p-6 max-w-[440px] w-full" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-[12px] bg-red-500/15 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold" style={{ color: config.text }}>E&apos;lonni o&apos;chirish</h3>
                <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>E&apos;lon butunlay o&apos;chiriladi. Statistika va arizalar tarixi ham yo&apos;q bo&apos;ladi.</p>
              </div>
            </div>
            <div className="rounded-[10px] p-3 mb-4" style={{ backgroundColor: config.hover }}>
              <p className="text-[13px] font-semibold" style={{ color: config.text }}>{confirmDelete.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: config.textMuted }}>{confirmDelete.user.name} • {confirmDelete._count.leads} ariza</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                Bekor
              </button>
              <button onClick={deleteListing} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium text-white" style={{ backgroundColor: "#ef4444" }}>
                Ha, o&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRejectModal(null)} />
          <div className="relative rounded-[18px] p-6 max-w-[460px] w-full" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-[12px] bg-red-500/15 flex items-center justify-center shrink-0">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold" style={{ color: config.text }}>E&apos;lonni rad etish</h3>
                <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>Kurs egasi sababni ko&apos;radi va e&apos;lonni qayta yuboradi</p>
              </div>
            </div>
            <div className="rounded-[10px] p-3 mb-4" style={{ backgroundColor: config.hover }}>
              <p className="text-[13px] font-semibold" style={{ color: config.text }}>{rejectModal.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: config.textMuted }}>{rejectModal.user.name}</p>
            </div>
            <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Rad etish sababi *</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Masalan: Kurs tavsifi yetarli emas..."
              className="w-full p-3 rounded-[10px] text-[14px] focus:outline-none resize-none"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setRejectModal(null)} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                Bekor
              </button>
              <button
                onClick={reject}
                disabled={!rejectReason.trim()}
                className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium"
                style={{ backgroundColor: rejectReason.trim() ? "#ef4444" : "#ef444433", color: "#ffffff", cursor: rejectReason.trim() ? "pointer" : "not-allowed" }}
              >
                Rad etish
              </button>
            </div>
          </div>
        </div>
      )}

      {openListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenListing(null)} />
          <div className="relative rounded-[20px] w-full max-w-[560px] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="sticky top-0 px-6 pt-5 pb-4 flex items-start justify-between" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, borderBottom: `1px solid ${config.surfaceBorder}` }}>
              <div>
                <h2 className="text-[18px] font-bold" style={{ color: config.text }}>{openListing.title}</h2>
                <div className="flex items-center gap-2 mt-1 text-[12px]" style={{ color: config.textMuted }}>
                  <span>{openListing.category.name}</span>
                  <span>•</span>
                  <span className="capitalize">{openListing.format}</span>
                  {openListing.location && (<><span>•</span><span>{openListing.location}</span></>)}
                </div>
              </div>
              <button onClick={() => setOpenListing(null)} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* ======== PREVIEW CARD — saytda qanday ko'rinishi ======== */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>
                  Saytda ko&apos;rinishi
                </p>
                {(() => {
                  const gradient = openListing.color
                    ? (GRADIENT_OPTIONS.find(g => g.id === openListing.color)?.value ?? GRADIENT_OPTIONS[0].value)
                    : GRADIENT_OPTIONS[0].value;
                  const iconPath = openListing.icon
                    ? (ICON_OPTIONS.find(i => i.id === openListing.icon)?.path ?? ICON_OPTIONS[0].path)
                    : ICON_OPTIONS[0].path;
                  const priceLabel = openListing.price === 0
                    ? "Bepul"
                    : `${new Intl.NumberFormat("uz-UZ").format(openListing.price)} so'm`;
                  const posX = openListing.imagePosX ?? 50;
                  const posY = openListing.imagePosY ?? 50;
                  const zoom = (openListing.imageZoom ?? 100) / 100;
                  return (
                    <div className="flex justify-center">
                      <div className={`relative overflow-hidden rounded-[22px] bg-gradient-to-br ${gradient} flex flex-col w-[300px] h-[440px]`}>
                        {openListing.imageUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={openListing.imageUrl}
                              alt={openListing.title}
                              className="absolute inset-0 w-full h-full object-cover"
                              style={{
                                objectPosition: `${posX}% ${posY}%`,
                                transform: `scale(${zoom})`,
                                transformOrigin: `${posX}% ${posY}%`,
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                            <svg className="absolute right-5 bottom-20 w-[80px] h-[80px] text-white/[0.08]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
                              <path d={iconPath} />
                            </svg>
                          </>
                        )}
                        <div className="relative z-[2] p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-1.5 mb-4">
                            <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold">{openListing.category.name}</span>
                            <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/60 text-[11px] capitalize">{openListing.format === "offline" ? "Offline" : openListing.format === "online" ? "Online" : "Video"}</span>
                          </div>
                          <h3 className="text-[18px] font-bold text-white leading-tight line-clamp-3">{openListing.title}</h3>
                          <p className="text-[12px] text-white/40 mt-2">{openListing.user.name}</p>
                          {openListing.location && (
                            <p className="text-[11px] text-white/30 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{openListing.location}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-[11px] text-white/30">
                            <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-white/50 text-white/50" />5.0</span>
                            {openListing.duration && <span>{openListing.duration}</span>}
                          </div>
                          <div className="mt-auto" />
                        </div>
                        <div className="relative z-[2] mx-3 mb-3 rounded-[12px] bg-white/[0.1] border border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
                          <span className="text-[14px] font-bold text-white">{priceLabel}</span>
                          <ArrowRight className="w-4 h-4 text-white/30" />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* ======== TAVSIF ======== */}
              {openListing.description && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Tavsif</p>
                  <div className="rounded-[12px] p-4" style={{ backgroundColor: config.hover }}>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: config.text }}>{openListing.description}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Kurs egasi</p>
                <div className="rounded-[12px] p-4" style={{ backgroundColor: config.hover }}>
                  <p className="text-[14px] font-semibold" style={{ color: config.text }}>{openListing.user.name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>Yuborilgan: {timeAgo(openListing.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Narx</p>
                <div className="rounded-[12px] p-4 flex items-center justify-between" style={{ backgroundColor: config.hover }}>
                  <span className="text-[18px] font-bold" style={{ color: config.text }}>{openListing.price === 0 ? "Bepul" : `${fmt(openListing.price)} so'm`}</span>
                  {openListing._count.boosts > 0 && (
                    <span className="h-[26px] px-3 rounded-full text-[11px] font-bold flex items-center gap-1" style={{ backgroundColor: `${config.accent}22`, color: config.accent }}>
                      <Zap className="w-3 h-3 fill-current" /> boost
                    </span>
                  )}
                </div>
              </div>

              {openListing.status === "active" && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Statistika</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                      <p className="text-[11px]" style={{ color: config.textMuted }}>Ko&apos;rishlar</p>
                      <p className="text-[16px] font-bold mt-0.5" style={{ color: config.text }}>{fmt(openListing.views)}</p>
                    </div>
                    <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                      <p className="text-[11px]" style={{ color: config.textMuted }}>Arizalar</p>
                      <p className="text-[16px] font-bold mt-0.5" style={{ color: config.text }}>{openListing._count.leads}</p>
                    </div>
                  </div>
                </div>
              )}

              {openListing.rejectReason && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#ef4444" }}>Rad etish sababi</p>
                  <div className="rounded-[12px] p-4" style={{ backgroundColor: "#ef44441a", border: "1px solid #ef444433" }}>
                    <p className="text-[13px]" style={{ color: "#ef4444" }}>{openListing.rejectReason}</p>
                  </div>
                </div>
              )}

              {openListing.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { approve(openListing.id); setOpenListing(null); }} className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-1.5" style={{ backgroundColor: "#22c55e", color: "#ffffff" }}>
                    <Check className="w-4 h-4" /> Tasdiqlash
                  </button>
                  <button onClick={() => { setRejectModal(openListing); setOpenListing(null); }} className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-1.5" style={{ backgroundColor: "#ef4444", color: "#ffffff" }}>
                    <X className="w-4 h-4" /> Rad etish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
