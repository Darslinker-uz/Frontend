"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, AlertCircle, Save } from "lucide-react";
import { GRADIENT_OPTIONS, ICON_OPTIONS } from "@/data/courses";
import { useAdminTheme } from "@/context/admin-theme-context";

const formatlar = ["Onlayn", "Oflayn", "Gibrid", "Video"];
const FORMAT_TO_UI: Record<string, string> = { offline: "Oflayn", online: "Onlayn", video: "Video" };
const UI_TO_FORMAT: Record<string, "offline" | "online" | "video"> = {
  Onlayn: "online",
  Oflayn: "offline",
  Gibrid: "offline",
  Video: "video",
};

type Status = "pending" | "active" | "paused" | "rejected";

interface ApiListing {
  id: number;
  title: string;
  description: string | null;
  price: number;
  format: "offline" | "online" | "video";
  location: string | null;
  duration: string | null;
  color: string | null;
  icon: string | null;
  imageUrl: string | null;
  status: Status;
  rejectReason: string | null;
  categoryId: number;
  userId: number;
  category: { id: number; name: string; slug: string };
  user: { id: number; name: string; phone: string };
}

const STATUS_META: Record<Status, { label: string; color: string }> = {
  pending: { label: "Tekshiruvda", color: "#f59e0b" },
  active: { label: "Aktiv", color: "#22c55e" },
  paused: { label: "To'xtatilgan", color: "#94a3b8" },
  rejected: { label: "Rad etilgan", color: "#ef4444" },
};

export default function AdminEditListingPage() {
  const { config } = useAdminTheme();
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [providerName, setProviderName] = useState("");
  const [format, setFormat] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("active");
  const [rejectReason, setRejectReason] = useState("");
  const [gradient, setGradient] = useState(GRADIENT_OPTIONS[0]);
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/listings/${listingId}`, { cache: "no-store" });
        if (res.status === 404) { if (!cancelled) setNotFound(true); return; }
        if (!res.ok) { if (!cancelled) setError("Yuklashda xatolik"); return; }
        const data = await res.json() as { listing: ApiListing };
        if (cancelled) return;
        const l = data.listing;
        setTitle(l.title);
        setCategoryName(l.category?.name ?? "");
        setProviderName(l.user?.name ?? "");
        setFormat(FORMAT_TO_UI[l.format] ?? "Onlayn");
        setIsFree(l.price === 0);
        setPrice(l.price > 0 ? new Intl.NumberFormat("uz-UZ").format(l.price) : "");
        setDuration(l.duration ?? "");
        setLocation(l.location ?? "");
        setDescription(l.description ?? "");
        setStatus(l.status);
        setRejectReason(l.rejectReason ?? "");
        if (l.color) {
          const g = GRADIENT_OPTIONS.find(x => x.id === l.color);
          if (g) setGradient(g);
        }
        if (l.icon) {
          const ic = ICON_OPTIONS.find(x => x.id === l.icon);
          if (ic) setIcon(ic);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [listingId]);

  const showLocation = format === "Oflayn" || format === "Gibrid";

  const inputStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text };
  const readonlyStyle = { backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.textMuted };
  const labelStyle = { color: config.textMuted };
  const sectionStyle = { backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` };

  const save = async () => {
    setError(null);
    if (!title.trim() || title.length < 3) { setError("Kurs nomi kamida 3 belgi"); return; }
    if (!format) { setError("Formatni tanlang"); return; }
    if (!isFree && !price) { setError("Narxni kiriting"); return; }
    if (status === "rejected" && !rejectReason.trim()) { setError("Rad etish sababini kiriting"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          price: isFree ? 0 : Number(price.replace(/\D/g, "")) || 0,
          format: UI_TO_FORMAT[format] ?? "online",
          location: showLocation ? (location || null) : null,
          duration: duration || null,
          color: gradient.id,
          icon: icon.id,
          status,
          rejectReason: status === "rejected" ? rejectReason : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data?.error ?? "Xatolik"); setSaving(false); return; }
      router.push("/admin/listings");
      router.refresh();
    } catch {
      setError("Tarmoq xatosi");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-5 md:px-8 py-6 md:py-8">
        <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="px-5 md:px-8 py-6 md:py-8">
        <Link href="/admin/listings" className="inline-flex items-center gap-2 text-[13px] font-medium mb-6" style={{ color: config.accent }}>
          <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
        </Link>
        <p className="text-[16px] font-semibold" style={{ color: config.text }}>E&apos;lon topilmadi</p>
      </div>
    );
  }

  const statusMeta = STATUS_META[status];

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link href="/admin/listings" className="inline-flex items-center gap-2 text-[13px] font-medium mb-6" style={{ color: config.accent }}>
        <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
      </Link>

      <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>E&apos;lonni tahrirlash</h1>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="h-[22px] px-2.5 rounded-full text-[10px] font-bold flex items-center"
              style={{ backgroundColor: `${statusMeta.color}22`, color: statusMeta.color }}
            >
              {statusMeta.label}
            </span>
            <span className="text-[13px]" style={{ color: config.textMuted }}>{providerName}</span>
          </div>
        </div>
      </div>

      <div className="space-y-5 max-w-3xl">
        {/* Asosiy */}
        <div className="rounded-[16px] p-5 space-y-4" style={sectionStyle}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Asosiy ma&apos;lumotlar</h2>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Kurs nomi</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Kategoriya</label>
              <input value={categoryName} readOnly disabled className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={readonlyStyle} />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Kurs egasi</label>
              <input value={providerName} readOnly disabled className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={readonlyStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full h-[44px] px-3 rounded-[10px] text-[14px] focus:outline-none appearance-none" style={inputStyle}>
                {formatlar.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Davomiylik</label>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Narx</label>
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setIsFree(false)} className="flex-1 h-[36px] rounded-[8px] text-[13px] font-medium" style={{ backgroundColor: !isFree ? config.accent : config.hover, color: !isFree ? config.accentText : config.textDim }}>Pullik</button>
              <button onClick={() => setIsFree(true)} className="flex-1 h-[36px] rounded-[8px] text-[13px] font-medium" style={{ backgroundColor: isFree ? config.accent : config.hover, color: isFree ? config.accentText : config.textDim }}>Bepul</button>
            </div>
            {!isFree && <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="650,000" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />}
          </div>
        </div>

        {/* Tavsif */}
        <div className="rounded-[16px] p-5 space-y-4" style={sectionStyle}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Tavsif</h2>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Kurs tavsifi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Kurs haqida qisqacha..."
              className="w-full px-4 py-3 rounded-[10px] text-[14px] resize-none focus:outline-none"
              style={inputStyle}
            />
          </div>
          {showLocation && (
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Manzil</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Toshkent, Chilonzor tumani..." className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />
            </div>
          )}
        </div>

        {/* Status */}
        <div className="rounded-[16px] p-5 space-y-4" style={sectionStyle}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Holat</h2>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>E&apos;lon holati</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="w-full h-[44px] px-3 rounded-[10px] text-[14px] focus:outline-none appearance-none" style={inputStyle}>
              <option value="active">Aktiv</option>
              <option value="paused">To&apos;xtatilgan</option>
              <option value="pending">Tekshiruvda</option>
              <option value="rejected">Rad etilgan</option>
            </select>
          </div>
          {status === "rejected" && (
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Rad etish sababi *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Sababi..."
                className="w-full px-4 py-3 rounded-[10px] text-[14px] resize-none focus:outline-none"
                style={inputStyle}
              />
            </div>
          )}
        </div>

        {/* Rang va ikon */}
        <div className="rounded-[16px] p-5 space-y-4" style={sectionStyle}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Rang va ikon</h2>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Rang</label>
            <div className="grid grid-cols-5 gap-2">
              {GRADIENT_OPTIONS.map((g) => {
                const isActive = gradient.id === g.id;
                return (
                  <button key={g.id} type="button" onClick={() => setGradient(g)} title={g.label} className={`relative h-[44px] rounded-[10px] bg-gradient-to-br ${g.value}`} style={{ boxShadow: isActive ? `0 0 0 2px ${config.bg}, 0 0 0 4px ${config.accent}` : "none" }}>
                    {isActive && <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Ikon</label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map((ic) => {
                const isActive = icon.id === ic.id;
                return (
                  <button key={ic.id} type="button" onClick={() => setIcon(ic)} title={ic.label} className="h-[44px] rounded-[10px] flex items-center justify-center" style={{ backgroundColor: isActive ? config.active : config.hover, border: `1px solid ${isActive ? config.accent : config.surfaceBorder}` }}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isActive ? config.text : config.textMuted }}>
                      <path d={ic.path} />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-[10px]" style={{ backgroundColor: "#ef444414", border: "1px solid #ef444433", color: "#ef4444" }}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[13px]">{error}</p>
          </div>
        )}

        <div className="flex gap-2 items-center">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 h-[50px] rounded-[12px] text-[15px] font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: config.accent, color: config.accentText }}
          >
            <Save className="w-4 h-4" /> {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
          <Link
            href="/admin/listings"
            className="h-[50px] px-5 rounded-[12px] text-[15px] font-medium flex items-center"
            style={{ backgroundColor: config.hover, color: config.textMuted }}
          >
            Bekor
          </Link>
        </div>
      </div>
    </div>
  );
}
