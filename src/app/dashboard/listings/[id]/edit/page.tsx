"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle, Monitor, Smartphone } from "lucide-react";
import { useDashboardTheme } from "@/context/dashboard-theme-context";
import { ImageUpload } from "@/components/image-upload";
import { PriceScroll } from "@/components/price-scroll";

const FORMAT_TO_UI: Record<string, string> = { offline: "Oflayn", online: "Onlayn", video: "Video" };
const UI_TO_FORMAT: Record<string, "offline" | "online" | "video"> = {
  Oflayn: "offline",
  Gibrid: "offline",
  Onlayn: "online",
  Video: "video",
};

const formatlar = ["Onlayn", "Oflayn", "Gibrid", "Video"];

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
  imagePosX: number;
  imagePosY: number;
  imageAPosX: number;
  imageAPosY: number;
  imageAMPosX: number;
  imageAMPosY: number;
  imageCPosX: number;
  imageCPosY: number;
  imageCMPosX: number;
  imageCMPosY: number;
  imageZoom: number;
  imageAZoom: number;
  imageAMZoom: number;
  imageCZoom: number;
  imageCMZoom: number;
  status: "pending" | "active" | "paused" | "rejected";
  category: { id: number; name: string; slug: string };
}

export default function EditListingPage() {
  const { config } = useDashboardTheme();
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params.id);

  const inputStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text };
  const selectStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.textMuted };
  const labelStyle = { color: config.textDim };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [format, setFormat] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState(50000);
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePosX, setImagePosX] = useState(50);
  const [imagePosY, setImagePosY] = useState(50);
  const [imageAPosX, setImageAPosX] = useState(50);
  const [imageAPosY, setImageAPosY] = useState(50);
  const [imageAMPosX, setImageAMPosX] = useState(50);
  const [imageAMPosY, setImageAMPosY] = useState(50);
  const [imageCPosX, setImageCPosX] = useState(50);
  const [imageCPosY, setImageCPosY] = useState(50);
  const [imageCMPosX, setImageCMPosX] = useState(50);
  const [imageCMPosY, setImageCMPosY] = useState(50);
  const [imageZoom, setImageZoom] = useState(100);
  const [imageAZoom, setImageAZoom] = useState(100);
  const [imageAMZoom, setImageAMZoom] = useState(100);
  const [imageCZoom, setImageCZoom] = useState(100);
  const [imageCMZoom, setImageCMZoom] = useState(100);
  const [activeVariant, setActiveVariant] = useState<"a-desktop" | "a-mobile" | "b" | "c-desktop" | "c-mobile">("a-desktop");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/dashboard/listings/${listingId}`, { cache: "no-store" });
        if (res.status === 404) { if (!cancelled) setNotFound(true); return; }
        const data: { listing: ApiListing } = await res.json();
        if (cancelled) return;
        const l = data.listing;
        setTitle(l.title);
        setCategoryName(l.category.name);
        setFormat(FORMAT_TO_UI[l.format] ?? "Onlayn");
        setIsFree(l.price === 0);
        setPrice(l.price === 0 ? 50000 : l.price);
        setDuration(l.duration ?? "");
        setDescription(l.description ?? "");
        setLocation(l.location ?? "");
        setImageUrl(l.imageUrl);
        setImagePosX(l.imagePosX ?? 50);
        setImagePosY(l.imagePosY ?? 50);
        setImageAPosX(l.imageAPosX ?? 50);
        setImageAPosY(l.imageAPosY ?? 50);
        setImageAMPosX(l.imageAMPosX ?? 50);
        setImageAMPosY(l.imageAMPosY ?? 50);
        setImageCPosX(l.imageCPosX ?? 50);
        setImageCPosY(l.imageCPosY ?? 50);
        setImageCMPosX(l.imageCMPosX ?? 50);
        setImageCMPosY(l.imageCMPosY ?? 50);
        setImageZoom(l.imageZoom ?? 100);
        setImageAZoom(l.imageAZoom ?? 100);
        setImageAMZoom(l.imageAMZoom ?? 100);
        setImageCZoom(l.imageCZoom ?? 100);
        setImageCMZoom(l.imageCMZoom ?? 100);
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [listingId]);

  const showLocation = format === "Oflayn" || format === "Gibrid";

  const save = async () => {
    setError(null);
    if (!title.trim() || title.trim().length < 3) { setError("Kurs nomini kiriting"); return; }
    if (!format) { setError("Formatni tanlang"); return; }
    if (!isFree && price < 10000) { setError("Narx 10,000 so'mdan kam bo'lmasin"); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          format: UI_TO_FORMAT[format],
          price: isFree ? 0 : price,
          duration,
          description,
          location: showLocation ? location : null,
          imageUrl,
          imagePosX,
          imagePosY,
          imageAPosX,
          imageAPosY,
          imageAMPosX,
          imageAMPosY,
          imageCPosX,
          imageCPosY,
          imageCMPosX,
          imageCMPosY,
          imageZoom,
          imageAZoom,
          imageAMZoom,
          imageCZoom,
          imageCMZoom,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Saqlashda xatolik");
        setSaving(false);
        return;
      }
      router.push("/dashboard/listings");
      router.refresh();
    } catch {
      setError("Tarmoq xatosi, qayta urining");
      setSaving(false);
    }
  };

  const inputClass = "w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all";
  const selectClass = "w-full h-[44px] px-3 rounded-[10px] text-[14px] focus:outline-none focus:border-[#7ea2d4]/40 transition-all appearance-none";
  const textareaClass = "w-full px-4 py-3 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all resize-none";
  const labelClass = "text-[12px] mb-1.5 block";

  if (loading) {
    return (
      <div className="px-5 md:px-8 py-16 text-center">
        <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
      </div>
    );
  }
  if (notFound) {
    return (
      <div className="px-5 md:px-8 py-16 text-center">
        <p className="text-[16px] mb-3" style={{ color: config.text }}>E&apos;lon topilmadi</p>
        <Link href="/dashboard/listings" className="text-[13px] text-[#7ea2d4]">Orqaga qaytish</Link>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link href="/dashboard/listings" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold mb-1" style={{ color: config.text }}>E&apos;lonni tahrirlash</h1>
      <p className="text-[14px] mb-4" style={{ color: config.textMuted }}>O&apos;zgarishlardan so&apos;ng saqlashni unutmang</p>

      <div className="rounded-[12px] p-3 mb-5 flex items-start gap-2.5" style={{ backgroundColor: "#f59e0b14", border: "1px solid #f59e0b33" }}>
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
        <p className="text-[12px] leading-relaxed" style={{ color: "#f59e0b" }}>
          <b>Diqqat:</b> Kurs nomi, tavsifi, narxi, davomiyligi, manzili yoki rasmi o&apos;zgartirilsa, e&apos;lon <b>admin tasdig&apos;iga qaytariladi</b> va tasdiq kelgunicha saytda ko&apos;rinmaydi.
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Asosiy ma&apos;lumotlar</h2>
          <div>
            <label className={labelClass} style={labelStyle}>Kurs nomi *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Kategoriya</label>
            <input value={categoryName} disabled className={inputClass} style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} />
            <p className="text-[11px] mt-1" style={{ color: config.textDim }}>Kategoriyani o&apos;zgartirish uchun admin bilan bog&apos;laning</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={labelStyle}>Format *</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className={selectClass} style={selectStyle}>
                <option value="">Tanlang</option>
                {formatlar.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Narx *</label>
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setIsFree(false)} className="flex-1 h-[36px] rounded-[8px] text-[13px] font-medium transition-all" style={!isFree ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textDim }}>Pullik</button>
                <button onClick={() => setIsFree(true)} className="flex-1 h-[36px] rounded-[8px] text-[13px] font-medium transition-all" style={isFree ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textDim }}>Bepul</button>
              </div>
              {!isFree && (
                <PriceScroll
                  value={price}
                  onChange={setPrice}
                  bg={config.hover}
                  border={config.surfaceBorder}
                  text={config.text}
                  textMuted={config.textMuted}
                  accent={config.accent}
                />
              )}
            </div>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Davomiylik</label>
            <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="6 oy" className={inputClass} style={inputStyle} />
          </div>
        </div>

        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Tavsif</h2>
          <div>
            <label className={labelClass} style={labelStyle}>Kurs tavsifi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={textareaClass} style={inputStyle} rows={4} />
          </div>
          {showLocation && (
            <div>
              <label className={labelClass} style={labelStyle}>Manzil *</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Toshkent, Chilonzor tumani" className={inputClass} style={inputStyle} />
            </div>
          )}
        </div>

        {/* KURS RASMI VA KO'RINISHI — pastda, saqlash dan oldin */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div>
            <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Kurs rasmi va ko&apos;rinishi</h2>
            <p className="text-[12px] mt-1" style={{ color: config.textMuted }}>Rasm va uning Desktop / Mobil qurilmalarda ko&apos;rinishi</p>
          </div>

          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            disabled={saving}
            label=""
            bg={config.hover}
            border={config.surfaceBorder}
            text={config.text}
            textMuted={config.textMuted}
          />

          {imageUrl && (() => {
            const variants = [
              { id: "a-desktop" as const, label: "A-class · Desktop", shortLabel: "A · Desktop", aspect: "12/5",  maxW: 720, posX: imageAPosX, posY: imageAPosY, zoom: imageAZoom, setX: setImageAPosX, setY: setImageAPosY, setZoom: setImageAZoom },
              { id: "a-mobile"  as const, label: "A-class · Mobile",  shortLabel: "A · Mobile",  aspect: "1/1",   maxW: 380, posX: imageAMPosX, posY: imageAMPosY, zoom: imageAMZoom, setX: setImageAMPosX, setY: setImageAMPosY, setZoom: setImageAMZoom },
              { id: "b"         as const, label: "B-class · Slider",  shortLabel: "B · Slider",  aspect: "9/13",  maxW: 360, posX: imagePosX, posY: imagePosY, zoom: imageZoom, setX: setImagePosX, setY: setImagePosY, setZoom: setImageZoom },
              { id: "c-desktop" as const, label: "C-class · Desktop", shortLabel: "C · Desktop", aspect: "4/3",   maxW: 480, posX: imageCPosX, posY: imageCPosY, zoom: imageCZoom, setX: setImageCPosX, setY: setImageCPosY, setZoom: setImageCZoom },
              { id: "c-mobile"  as const, label: "C-class · Mobile",  shortLabel: "C · Mobile",  aspect: "9/13",  maxW: 360, posX: imageCMPosX, posY: imageCMPosY, zoom: imageCMZoom, setX: setImageCMPosX, setY: setImageCMPosY, setZoom: setImageCMZoom },
            ];
            const active = variants.find(v => v.id === activeVariant) ?? variants[0];
            return (
              <>
                <div className="h-px" style={{ backgroundColor: config.surfaceBorder }} />
                <div className="space-y-3">
                  <div>
                    <label className={labelClass} style={labelStyle}>Ko&apos;rinish tanlash</label>
                    <p className="text-[11px]" style={{ color: config.textDim }}>Tanlangan ko&apos;rinish uchun rasmni sozlang</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {variants.map(v => {
                      const isActive = activeVariant === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setActiveVariant(v.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all"
                          style={{
                            backgroundColor: isActive ? config.accent : config.hover,
                            color: isActive ? config.accentText : config.textMuted,
                            border: `1px solid ${isActive ? config.accent : config.surfaceBorder}`,
                          }}
                        >
                          {v.id.includes("mobile") ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                          {v.shortLabel}
                        </button>
                      );
                    })}
                  </div>
                  <div className="pt-2 flex justify-center">
                    <div className="w-full" style={{ maxWidth: active.maxW }}>
                      <div
                        className="relative overflow-hidden rounded-[14px] w-full"
                        style={{
                          aspectRatio: active.aspect,
                          backgroundColor: config.hover,
                          border: `1px solid ${config.surfaceBorder}`,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} alt={active.label} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: `${active.posX}% ${active.posY}%`, transform: `scale(${active.zoom / 100})`, transformOrigin: `${active.posX}% ${active.posY}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[12px] p-4 space-y-3" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold" style={{ color: config.text }}>{active.label}</span>
                      <button type="button" onClick={() => { active.setX(50); active.setY(50); active.setZoom(100); }} className="text-[11px] font-medium hover:underline" style={{ color: config.textMuted }}>
                        Tiklash
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px]" style={labelStyle}>Gorizontal</label>
                          <span className="text-[11px]" style={{ color: config.textDim }}>{active.posX}%</span>
                        </div>
                        <input type="range" min={0} max={100} value={active.posX} onChange={(e) => active.setX(Number(e.target.value))} className="w-full accent-[#7ea2d4]" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px]" style={labelStyle}>Vertikal</label>
                          <span className="text-[11px]" style={{ color: config.textDim }}>{active.posY}%</span>
                        </div>
                        <input type="range" min={0} max={100} value={active.posY} onChange={(e) => active.setY(Number(e.target.value))} className="w-full accent-[#7ea2d4]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px]" style={labelStyle}>Zoom</label>
                        <span className="text-[11px]" style={{ color: config.textDim }}>{(active.zoom / 100).toFixed(2)}x</span>
                      </div>
                      <input type="range" min={100} max={300} step={5} value={active.zoom} onChange={(e) => active.setZoom(Number(e.target.value))} className="w-full accent-[#7ea2d4]" />
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-[10px]" style={{ backgroundColor: "#ef444414", border: "1px solid #ef444433", color: "#ef4444" }}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[13px]">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 h-[50px] rounded-[12px] text-[15px] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: config.accent, color: config.accentText }}
          >
            <Save className="w-4 h-4" /> {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
          <Link href="/dashboard/listings" className="h-[50px] px-5 rounded-[12px] text-[15px] font-medium flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
            Bekor
          </Link>
        </div>
      </div>
    </div>
  );
}
