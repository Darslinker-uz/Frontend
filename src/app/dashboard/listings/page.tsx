"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Star, Users, Zap, Pause, Play, AlertCircle } from "lucide-react";

interface Listing {
  id: number;
  title: string;
  category: string;
  format: string;
  price: string;
  priceFree: boolean;
  status: "aktiv" | "pauza" | "rad_etilgan" | "moderatsiyada";
  boost: null | "A" | "B";
  views: number;
  leads: number;
  createdAt: string;
}

const initialListings: Listing[] = [
  { id: 1, title: "JavaScript & React Full-stack", category: "IT & Dasturlash", format: "Oflayn", price: "650,000", priceFree: false, status: "aktiv", boost: "A", views: 1240, leads: 18, createdAt: "2026-03-15" },
  { id: 2, title: "UI/UX dizayn Figma masterclass", category: "Dizayn", format: "Onlayn", price: "Bepul", priceFree: true, status: "aktiv", boost: "B", views: 890, leads: 12, createdAt: "2026-03-20" },
  { id: 3, title: "IELTS Intensive 7.0+", category: "Xorijiy tillar", format: "Oflayn", price: "600,000", priceFree: false, status: "pauza", boost: null, views: 450, leads: 5, createdAt: "2026-04-01" },
  { id: 4, title: "Python Backend Development", category: "IT & Dasturlash", format: "Oflayn", price: "750,000", priceFree: false, status: "moderatsiyada", boost: null, views: 0, leads: 0, createdAt: "2026-04-15" },
];

const statusConfig = {
  aktiv: { label: "Aktiv", color: "#22c55e", icon: Eye },
  pauza: { label: "Pauza", color: "#f59e0b", icon: Pause },
  rad_etilgan: { label: "Rad etilgan", color: "#ef4444", icon: AlertCircle },
  moderatsiyada: { label: "Tekshiruvda", color: "#3b82f6", icon: Eye },
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState<"hammasi" | Listing["status"]>("hammasi");
  const [confirmDelete, setConfirmDelete] = useState<Listing | null>(null);
  const [confirmPause, setConfirmPause] = useState<Listing | null>(null);

  const filtered = filter === "hammasi" ? listings : listings.filter(l => l.status === filter);

  const openPauseModal = (l: Listing) => {
    setConfirmPause(l);
    setMenuOpen(null);
  };

  const openDeleteModal = (l: Listing) => {
    setConfirmDelete(l);
    setMenuOpen(null);
  };

  const togglePause = () => {
    if (!confirmPause) return;
    setListings(prev => prev.map(l => l.id === confirmPause.id ? { ...l, status: l.status === "aktiv" ? "pauza" : "aktiv" } : l));
    setConfirmPause(null);
  };

  const deleteListing = () => {
    if (!confirmDelete) return;
    setListings(prev => prev.filter(l => l.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const counts = {
    hammasi: listings.length,
    aktiv: listings.filter(l => l.status === "aktiv").length,
    pauza: listings.filter(l => l.status === "pauza").length,
    moderatsiyada: listings.filter(l => l.status === "moderatsiyada").length,
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold text-white">E&apos;lonlar</h1>
          <p className="text-[14px] text-white/40 mt-0.5">Barcha e&apos;lonlaringizni boshqaring</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/listings/new" className="h-[40px] px-4 rounded-[10px] bg-white text-[#16181a] text-[13px] font-medium flex items-center gap-2 hover:bg-white/90 transition-colors">
            <Plus className="w-4 h-4" /> Yangi e&apos;lon
          </Link>
          <Link href="/dashboard/boost" className="h-[40px] px-4 rounded-[10px] bg-white/[0.08] border border-white/[0.12] text-white text-[13px] font-medium flex items-center gap-2 hover:bg-white/[0.12] transition-colors">
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
          <button key={tab.key} onClick={() => setFilter(tab.key)} className={`shrink-0 h-[36px] px-4 rounded-full text-[13px] font-medium transition-all flex items-center gap-2 ${filter === tab.key ? "bg-white text-[#16181a]" : "bg-white/[0.06] text-white/50 hover:text-white/80"}`}>
            {tab.label}
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${filter === tab.key ? "bg-[#16181a]/10 text-[#16181a]" : "bg-white/[0.06]"}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Listings */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((listing) => {
            const StatusIcon = statusConfig[listing.status].icon;
            return (
              <div key={listing.id} className="rounded-[14px] bg-white/[0.04] border border-white/[0.06] p-4 md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="h-[22px] px-2.5 rounded-full text-[11px] font-medium flex items-center gap-1" style={{ backgroundColor: `${statusConfig[listing.status].color}20`, color: statusConfig[listing.status].color }}>
                        <StatusIcon className="w-3 h-3" /> {statusConfig[listing.status].label}
                      </span>
                      {listing.boost && (
                        <span className="h-[22px] px-2.5 rounded-full bg-gradient-to-r from-[#7ea2d4] to-[#4a7ab5] text-white text-[11px] font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-white" /> {listing.boost}-class
                        </span>
                      )}
                      <span className="text-[11px] text-white/25">{listing.category}</span>
                    </div>
                    <h3 className="text-[15px] md:text-[16px] font-semibold text-white leading-tight">{listing.title}</h3>
                    <div className="flex items-center gap-4 mt-3 text-[12px] text-white/40">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {listing.views}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {listing.leads} ariza</span>
                      <span>{listing.priceFree ? "Bepul" : `${listing.price} so'm`}</span>
                      <span className="hidden md:inline">{listing.format}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === listing.id ? null : listing.id)} className="w-9 h-9 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/70 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === listing.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-10 z-50 w-[200px] rounded-[10px] bg-[#1e2024] border border-white/[0.08] shadow-xl py-1">
                          <Link href={`/dashboard/listings/${listing.id}/edit`} onClick={() => setMenuOpen(null)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-all">
                            <Edit className="w-3.5 h-3.5" /> Tahrirlash
                          </Link>
                          <Link href={`/dashboard/listings/${listing.id}/boost`} onClick={() => setMenuOpen(null)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#7ea2d4] hover:bg-[#7ea2d4]/10 transition-all">
                            <Zap className="w-3.5 h-3.5" /> Boost qilish
                          </Link>
                          {listing.status !== "moderatsiyada" && (
                            <button onClick={() => openPauseModal(listing)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-all">
                              {listing.status === "aktiv" ? <><Pause className="w-3.5 h-3.5" /> Pauzaga qo&apos;yish</> : <><Play className="w-3.5 h-3.5" /> Aktivlashtirish</>}
                            </button>
                          )}
                          <div className="border-t border-white/[0.06] my-1" />
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
        <div className="flex flex-col items-center justify-center py-16 rounded-[14px] border border-dashed border-white/[0.08]">
          <p className="text-[14px] text-white/40 mb-3">
            {filter === "hammasi" ? "Hali e'lon qo'shilmagan" : `${statusConfig[filter as keyof typeof statusConfig]?.label || ""} e'lon yo'q`}
          </p>
          {filter === "hammasi" && (
            <Link href="/dashboard/listings/new" className="h-[36px] px-4 rounded-[8px] bg-white/[0.06] text-white text-[13px] font-medium flex items-center gap-2 hover:bg-white/[0.1] transition-colors">
              <Plus className="w-3.5 h-3.5" /> E&apos;lon qo&apos;shish
            </Link>
          )}
        </div>
      )}

      {/* Pauza modal */}
      {confirmPause && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmPause(null)} />
          <div className="relative bg-[#1e2024] rounded-[18px] border border-white/[0.08] p-6 max-w-[420px] w-full">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-[12px] bg-amber-500/15 flex items-center justify-center shrink-0">
                {confirmPause.status === "aktiv" ? <Pause className="w-5 h-5 text-amber-400" /> : <Play className="w-5 h-5 text-green-400" />}
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-white">
                  {confirmPause.status === "aktiv" ? "Pauzaga qo'yish" : "Aktivlashtirish"}
                </h3>
                <p className="text-[13px] text-white/50 mt-1">
                  {confirmPause.status === "aktiv"
                    ? "E'lon pauzada bo'lganda qidiruvda ko'rinmaydi. Xohlagan vaqtda qayta yoqishingiz mumkin."
                    : "E'lon qayta aktiv bo'ladi va qidiruvda ko'rinadi."
                  }
                </p>
              </div>
            </div>
            <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] p-3 mb-5">
              <p className="text-[11px] text-white/30 mb-0.5">{confirmPause.category}</p>
              <p className="text-[13px] font-semibold text-white">{confirmPause.title}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmPause(null)} className="flex-1 h-[44px] rounded-[10px] bg-white/[0.06] text-white/60 text-[14px] font-medium hover:bg-white/[0.1] transition-colors">
                Bekor
              </button>
              <button onClick={togglePause} className="flex-1 h-[44px] rounded-[10px] bg-white text-[#16181a] text-[14px] font-medium hover:bg-white/90 transition-colors">
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
          <div className="relative bg-[#1e2024] rounded-[18px] border border-white/[0.08] p-6 max-w-[420px] w-full">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-[12px] bg-red-500/15 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-white">E&apos;lonni o&apos;chirish</h3>
                <p className="text-[13px] text-white/50 mt-1">
                  E&apos;lon butunlay o&apos;chiriladi va qaytarib bo&apos;lmaydi. Statistika va arizalar tarixi ham yo&apos;qoladi.
                </p>
              </div>
            </div>
            <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] p-3 mb-5">
              <p className="text-[11px] text-white/30 mb-0.5">{confirmDelete.category}</p>
              <p className="text-[13px] font-semibold text-white">{confirmDelete.title}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-white/30">
                <span>{confirmDelete.views} ko&apos;rishlar</span>
                <span>•</span>
                <span>{confirmDelete.leads} ariza</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[44px] rounded-[10px] bg-white/[0.06] text-white/60 text-[14px] font-medium hover:bg-white/[0.1] transition-colors">
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
