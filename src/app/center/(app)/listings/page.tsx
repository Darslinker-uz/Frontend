"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Star, Users, Zap, Pause, Play, AlertCircle } from "lucide-react";
import { useDashboardTheme } from "@/context/dashboard-theme-context";

type DbStatus = "pending" | "active" | "paused" | "rejected";

interface ApiListing {
  id: number;
  title: string;
  format: "offline" | "online" | "video";
  price: number;
  views: number;
  status: DbStatus;
  createdAt: string;
  category: { id: number; name: string; slug: string; color: string | null; pendingApproval?: boolean };
  _count: { leads: number; boosts: number };
}

interface Listing {
  id: number;
  title: string;
  category: string;
  categoryPending: boolean;
  format: string;
  price: string;
  priceFree: boolean;
  status: "aktiv" | "pauza" | "rad_etilgan" | "moderatsiyada";
  boost: null | "A" | "B";
  views: number;
  leads: number;
  createdAt: string;
}

const STATUS_MAP: Record<DbStatus, Listing["status"]> = {
  active: "aktiv",
  paused: "pauza",
  rejected: "rad_etilgan",
  pending: "moderatsiyada",
};

const FORMAT_MAP: Record<ApiListing["format"], string> = {
  offline: "Oflayn",
  online: "Onlayn",
  video: "Video",
};

function fromApi(l: ApiListing): Listing {
  return {
    id: l.id,
    title: l.title,
    category: l.category?.name ?? "—",
    categoryPending: !!l.category?.pendingApproval,
    format: FORMAT_MAP[l.format],
    price: l.price === 0 ? "Bepul" : new Intl.NumberFormat("uz-UZ").format(l.price),
    priceFree: l.price === 0,
    status: STATUS_MAP[l.status],
    boost: l._count.boosts > 0 ? "A" : null,
    views: l.views,
    leads: l._count.leads,
    createdAt: l.createdAt.slice(0, 10),
  };
}

const statusConfig = {
  aktiv: { label: "Aktiv", color: "#22c55e", icon: Eye },
  pauza: { label: "Pauza", color: "#f59e0b", icon: Pause },
  rad_etilgan: { label: "Rad etilgan", color: "#ef4444", icon: AlertCircle },
  moderatsiyada: { label: "Tekshiruvda", color: "#3b82f6", icon: Eye },
};

export default function ListingsPage() {
  const { config } = useDashboardTheme();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState<"hammasi" | Listing["status"]>("hammasi");
  const [confirmDelete, setConfirmDelete] = useState<Listing | null>(null);
  const [confirmPause, setConfirmPause] = useState<Listing | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard/listings", { cache: "no-store" });
        const data: { listings: ApiListing[] } = await res.json();
        if (!cancelled) setListings((data.listings ?? []).map(fromApi));
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = filter === "hammasi" ? listings : listings.filter(l => l.status === filter);

  const openPauseModal = (l: Listing) => {
    setConfirmPause(l);
    setMenuOpen(null);
  };

  const openDeleteModal = (l: Listing) => {
    setConfirmDelete(l);
    setMenuOpen(null);
  };

  const togglePause = async () => {
    if (!confirmPause) return;
    const target = confirmPause;
    const nextStatus: Listing["status"] = target.status === "aktiv" ? "pauza" : "aktiv";
    const apiStatus = nextStatus === "aktiv" ? "active" : "paused";
    setListings(prev => prev.map(l => l.id === target.id ? { ...l, status: nextStatus } : l));
    setConfirmPause(null);
    try {
      const res = await fetch(`/api/dashboard/listings/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: apiStatus }),
      });
      if (!res.ok) {
        setListings(prev => prev.map(l => l.id === target.id ? { ...l, status: target.status } : l));
      }
    } catch {
      setListings(prev => prev.map(l => l.id === target.id ? { ...l, status: target.status } : l));
    }
  };

  const deleteListing = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete.id;
    const prevList = listings;
    setListings(prev => prev.filter(l => l.id !== id));
    setConfirmDelete(null);
    try {
      const res = await fetch(`/api/dashboard/listings/${id}`, { method: "DELETE" });
      if (!res.ok) setListings(prevList);
    } catch {
      setListings(prevList);
    }
  };

  const counts = {
    hammasi: listings.length,
    aktiv: listings.filter(l => l.status === "aktiv").length,
    pauza: listings.filter(l => l.status === "pauza").length,
    moderatsiyada: listings.filter(l => l.status === "moderatsiyada").length,
  };

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>E&apos;lonlar</h1>
          <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>Barcha e&apos;lonlaringizni boshqaring</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/center/listings/new" className="h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2 transition-colors" style={{ backgroundColor: config.accent, color: config.accentText }}>
            <Plus className="w-4 h-4" /> Yangi e&apos;lon
          </Link>
          <Link href="/center/boost" className="h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2 transition-colors" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}>
            <Zap className="w-4 h-4" /> Boost
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {[
          { key: "hammasi" as const, label: "Hammasi", count: counts.hammasi },
          { key: "aktiv" as const, label: "Aktiv", count: counts.aktiv },
          { key: "pauza" as const, label: "Pauza", count: counts.pauza },
          { key: "moderatsiyada" as const, label: "Tekshiruvda", count: counts.moderatsiyada },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} className="shrink-0 h-[36px] px-4 rounded-full text-[13px] font-medium transition-all flex items-center gap-2" style={filter === tab.key ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textMuted }}>
            {tab.label}
            <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={filter === tab.key ? { backgroundColor: `${config.accentText}1a`, color: config.accentText } : { backgroundColor: config.hover }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Listings */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((listing) => {
            const StatusIcon = statusConfig[listing.status].icon;
            return (
              <div key={listing.id} className="rounded-[14px] p-4 md:p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="h-[22px] px-2.5 rounded-full text-[11px] font-medium flex items-center gap-1" style={{ backgroundColor: `${statusConfig[listing.status].color}20`, color: statusConfig[listing.status].color }}>
                        <StatusIcon className="w-3 h-3" /> {statusConfig[listing.status].label}
                      </span>
                      {listing.categoryPending && (
                        <span className="h-[22px] px-2.5 rounded-full text-[11px] font-medium flex items-center gap-1" style={{ backgroundColor: "#f59e0b22", color: "#a16207" }}>
                          ⏳ Yo&apos;nalish tasdiqlanmoqda
                        </span>
                      )}
                      {listing.boost && (
                        <span className="h-[22px] px-2.5 rounded-full bg-gradient-to-r from-[#7ea2d4] to-[#4a7ab5] text-white text-[11px] font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-white" /> {listing.boost}-class
                        </span>
                      )}
                      <span className="text-[11px]" style={{ color: config.textDim }}>{listing.category}</span>
                    </div>
                    <h3 className="text-[15px] md:text-[16px] font-semibold leading-tight" style={{ color: config.text }}>{listing.title}</h3>
                    <div className="flex items-center gap-4 mt-3 text-[12px]" style={{ color: config.textMuted }}>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {listing.views}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {listing.leads} ariza</span>
                      <span>{listing.priceFree ? "Bepul" : `${listing.price} so'm`}</span>
                      <span className="hidden md:inline">{listing.format}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === listing.id ? null : listing.id)} className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-all" style={{ backgroundColor: config.surface, color: config.textMuted }}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === listing.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-10 z-50 w-[200px] rounded-[10px] shadow-xl py-1" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                          <Link href={`/center/listings/${listing.id}/edit`} onClick={() => setMenuOpen(null)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-all" style={{ color: config.textMuted }}>
                            <Edit className="w-3.5 h-3.5" /> Tahrirlash
                          </Link>
                          <Link href={`/center/listings/${listing.id}/boost`} onClick={() => setMenuOpen(null)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#7ea2d4] hover:bg-[#7ea2d4]/10 transition-all">
                            <Zap className="w-3.5 h-3.5" /> Boost qilish
                          </Link>
                          {listing.status !== "moderatsiyada" && (
                            <button onClick={() => openPauseModal(listing)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-all" style={{ color: config.textMuted }}>
                              {listing.status === "aktiv" ? <><Pause className="w-3.5 h-3.5" /> Pauzaga qo&apos;yish</> : <><Play className="w-3.5 h-3.5" /> Aktivlashtirish</>}
                            </button>
                          )}
                          <div className="my-1" style={{ borderTop: `1px solid ${config.surfaceBorder}` }} />
                          <button onClick={() => openDeleteModal(listing)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-all">
                            <Trash2 className="w-3.5 h-3.5" /> O&apos;chirish
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 rounded-[14px] border border-dashed" style={{ borderColor: config.surfaceBorder }}>
          <p className="text-[14px] mb-3" style={{ color: config.textMuted }}>
            {filter === "hammasi" ? "Hali e'lon qo'shilmagan" : `${statusConfig[filter as keyof typeof statusConfig]?.label || ""} e'lon yo'q`}
          </p>
          {filter === "hammasi" && (
            <Link href="/center/listings/new" className="h-[36px] px-4 rounded-[8px] text-[13px] font-medium flex items-center gap-2 transition-colors" style={{ backgroundColor: config.hover, color: config.text }}>
              <Plus className="w-3.5 h-3.5" /> E&apos;lon qo&apos;shish
            </Link>
          )}
        </div>
      )}

      {/* Pauza modal */}
      {confirmPause && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmPause(null)} />
          <div className="relative rounded-[18px] p-6 max-w-[420px] w-full" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-[12px] bg-amber-500/15 flex items-center justify-center shrink-0">
                {confirmPause.status === "aktiv" ? <Pause className="w-5 h-5 text-amber-400" /> : <Play className="w-5 h-5 text-green-400" />}
              </div>
              <div>
                <h3 className="text-[17px] font-bold" style={{ color: config.text }}>
                  {confirmPause.status === "aktiv" ? "Pauzaga qo'yish" : "Aktivlashtirish"}
                </h3>
                <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>
                  {confirmPause.status === "aktiv"
                    ? "E'lon pauzada bo'lganda qidiruvda ko'rinmaydi. Xohlagan vaqtda qayta yoqishingiz mumkin."
                    : "E'lon qayta aktiv bo'ladi va qidiruvda ko'rinadi."
                  }
                </p>
              </div>
            </div>
            <div className="rounded-[12px] p-3 mb-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
              <p className="text-[11px] mb-0.5" style={{ color: config.textDim }}>{confirmPause.category}</p>
              <p className="text-[13px] font-semibold" style={{ color: config.text }}>{confirmPause.title}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmPause(null)} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium transition-colors" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                Bekor
              </button>
              <button onClick={togglePause} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium transition-colors" style={{ backgroundColor: config.accent, color: config.accentText }}>
                {confirmPause.status === "aktiv" ? "Pauzaga qo'yish" : "Aktivlashtirish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* O'chirish modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative rounded-[18px] p-6 max-w-[420px] w-full" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-[12px] bg-red-500/15 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold" style={{ color: config.text }}>E&apos;lonni o&apos;chirish</h3>
                <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>
                  E&apos;lon butunlay o&apos;chiriladi va qaytarib bo&apos;lmaydi. Statistika va arizalar tarixi ham yo&apos;qoladi.
                </p>
              </div>
            </div>
            <div className="rounded-[12px] p-3 mb-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
              <p className="text-[11px] mb-0.5" style={{ color: config.textDim }}>{confirmDelete.category}</p>
              <p className="text-[13px] font-semibold" style={{ color: config.text }}>{confirmDelete.title}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px]" style={{ color: config.textDim }}>
                <span>{confirmDelete.views} ko&apos;rishlar</span>
                <span>•</span>
                <span>{confirmDelete.leads} ariza</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium transition-colors" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                Bekor
              </button>
              <button onClick={deleteListing} className="flex-1 h-[44px] rounded-[10px] bg-red-500 text-white text-[14px] font-medium hover:bg-red-500/90 transition-colors">
                Ha, o&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
