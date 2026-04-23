"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Star, ArrowRight, AlertCircle, MapPin, Monitor, Smartphone, ShieldCheck } from "lucide-react";
import { GRADIENT_OPTIONS, ICON_OPTIONS, ICON_CATEGORIES } from "@/data/courses";
import { useAdminTheme } from "@/context/admin-theme-context";
import { ImageUpload } from "@/components/image-upload";
import { PriceScroll } from "@/components/price-scroll";

const formatlar = ["Onlayn", "Oflayn", "Gibrid", "Video"];
const FORMAT_MAP: Record<string, "offline" | "online" | "video"> = {
  Onlayn: "online",
  Oflayn: "offline",
  Gibrid: "offline",
  Video: "video",
};

const REGIONS: { name: string; cities: string[] }[] = [
  { name: "Toshkent shahri", cities: ["Toshkent"] },
  { name: "Toshkent viloyati", cities: ["Chirchiq", "Angren", "Olmaliq", "Bekobod", "Ohangaron"] },
  { name: "Samarqand", cities: ["Samarqand", "Kattaqo'rg'on", "Urgut"] },
  { name: "Buxoro", cities: ["Buxoro", "Kogon", "G'ijduvon"] },
  { name: "Andijon", cities: ["Andijon", "Asaka", "Xonobod"] },
  { name: "Farg'ona", cities: ["Farg'ona", "Marg'ilon", "Quva"] },
  { name: "Namangan", cities: ["Namangan", "Chust", "Pop"] },
  { name: "Qashqadaryo", cities: ["Qarshi", "Shahrisabz"] },
  { name: "Surxondaryo", cities: ["Termiz", "Denov"] },
  { name: "Xorazm", cities: ["Urganch", "Xiva"] },
  { name: "Navoiy", cities: ["Navoiy", "Zarafshon"] },
  { name: "Jizzax", cities: ["Jizzax", "Gallaorol"] },
  { name: "Sirdaryo", cities: ["Guliston", "Yangiyer"] },
  { name: "Qoraqalpog'iston", cities: ["Nukus", "Mo'ynoq"] },
];

const inputClass = "w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all";
const selectClass = "w-full h-[44px] px-3 rounded-[10px] text-[14px] focus:outline-none focus:border-[#7ea2d4]/40 transition-all appearance-none";
const textareaClass = "w-full px-4 py-3 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all resize-none";
const labelClass = "text-[12px] mb-1.5 block";

interface ProviderOption { id: number; name: string; phone: string }
interface CategoryOption { id: number; name: string; slug: string }

export default function AdminNewListingPage() {
  const { config } = useAdminTheme();
  const router = useRouter();

  const inputStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text };
  const selectStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.textMuted };
  const labelStyle = { color: config.textDim };

  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  const [providerId, setProviderId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const [isFree, setIsFree] = useState(false);
  const [format, setFormat] = useState("");
  const [gradient, setGradient] = useState(GRADIENT_OPTIONS[0]);
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [iconCategoryId, setIconCategoryId] = useState(ICON_CATEGORIES[0].id);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(50000);
  const [duration, setDuration] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");

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

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [uRes, cRes] = await Promise.all([
          fetch("/api/admin/users?role=provider", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);
        if (uRes.ok) {
          const { users } = await uRes.json();
          if (!cancelled) {
            const list = (users as Array<{ id: number; name: string; phone: string; role: string }>)
              .filter(u => u.role === "provider")
              .map(u => ({ id: u.id, name: u.name, phone: u.phone }));
            setProviders(list);
          }
        }
        if (cRes.ok) {
          const { categories: cats } = await cRes.json();
          if (!cancelled) {
            setCategories((cats as Array<{ id: number; name: string; slug: string }>).map(c => ({ id: c.id, name: c.name, slug: c.slug })));
          }
        }
      } catch (e) {
        console.error("[admin/new] load failed", e);
      } finally {
        if (!cancelled) setLoadingLookups(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const selectedProvider = providers.find(p => p.id === providerId);
  const selectedCategory = categories.find(c => c.id === categoryId);
  const providerName = selectedProvider?.name ?? "O'qituvchi";

  const showLocation = format === "Oflayn" || format === "Gibrid";
  const showSchedule = format !== "Video" && format !== "";

  const submit = async () => {
    setError(null);
    if (!providerId) { setError("O'qituvchini tanlang"); return; }
    if (!categoryId) { setError("Kategoriyani tanlang"); return; }
    if (!title.trim() || title.trim().length < 3) { setError("Kurs nomini kiriting"); return; }
    if (!format) { setError("Formatni tanlang"); return; }
    if (!isFree && price < 10000) { setError("Narx 10,000 so'mdan kam bo'lmasin"); return; }

    setSubmitting(true);
    try {
      const location = showLocation && city ? `${city}${region ? " · " + region : ""}` : null;
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: providerId,
          categoryId,
          title,
          description: description || null,
          price: isFree ? 0 : price,
          format: FORMAT_MAP[format] ?? "online",
          location,
          duration: duration || null,
          phone: selectedProvider?.phone || "",
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
          color: gradient.id,
          icon: icon.id,
          status: "active",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Saqlashda xatolik");
        setSubmitting(false);
        return;
      }
      router.push("/admin/listings");
      router.refresh();
    } catch {
      setError("Tarmoq xatosi, qayta urining");
      setSubmitting(false);
    }
  };

  const activeIconCategory = ICON_CATEGORIES.find(c => c.id === iconCategoryId) ?? ICON_CATEGORIES[0];
  const cityLabel = showLocation && city ? city : "Online";
  const priceFormatted = new Intl.NumberFormat("uz-UZ").format(price).replace(/\s/g, ",");
  const priceLabel = isFree ? "Bepul" : `${priceFormatted} so'm`;
  const priceShort = isFree ? "Bepul" : priceFormatted;
  const categoryDisplay = selectedCategory?.name ?? "Kategoriya";

  type VariantKind = "hero" | "b" | "c";
  type VariantMeta = {
    id: "a-desktop" | "a-mobile" | "b" | "c-desktop" | "c-mobile";
    label: string;
    shortLabel: string;
    kind: VariantKind;
    aspect: string;
    maxW: number;
    posX: number; posY: number; zoom: number;
    setX: (n: number) => void;
    setY: (n: number) => void;
    setZoom: (n: number) => void;
  };

  const variants: VariantMeta[] = [
    { id: "a-desktop", label: "A-class · Desktop", shortLabel: "A · Desktop", kind: "hero", aspect: "12/5",  maxW: 720, posX: imageAPosX, posY: imageAPosY, zoom: imageAZoom, setX: setImageAPosX, setY: setImageAPosY, setZoom: setImageAZoom },
    { id: "a-mobile",  label: "A-class · Mobile",  shortLabel: "A · Mobile",  kind: "hero", aspect: "1/1",   maxW: 380, posX: imageAMPosX, posY: imageAMPosY, zoom: imageAMZoom, setX: setImageAMPosX, setY: setImageAMPosY, setZoom: setImageAMZoom },
    { id: "b",         label: "B-class · Slider",  shortLabel: "B · Slider",  kind: "b",    aspect: "9/13",  maxW: 360, posX: imagePosX, posY: imagePosY, zoom: imageZoom, setX: setImagePosX, setY: setImagePosY, setZoom: setImageZoom },
    { id: "c-desktop", label: "C-class · Desktop", shortLabel: "C · Desktop", kind: "c",    aspect: "4/3",   maxW: 480, posX: imageCPosX, posY: imageCPosY, zoom: imageCZoom, setX: setImageCPosX, setY: setImageCPosY, setZoom: setImageCZoom },
    { id: "c-mobile",  label: "C-class · Mobile",  shortLabel: "C · Mobile",  kind: "c",    aspect: "9/13",  maxW: 360, posX: imageCMPosX, posY: imageCMPosY, zoom: imageCMZoom, setX: setImageCMPosX, setY: setImageCMPosY, setZoom: setImageCMZoom },
  ];
  const active = variants.find(v => v.id === activeVariant) ?? variants[0];

  const renderVariant = (v: VariantMeta) => {
    const style: React.CSSProperties = { aspectRatio: v.aspect };
    const imgStyle: React.CSSProperties = { objectPosition: `${v.posX}% ${v.posY}%`, transform: `scale(${v.zoom / 100})`, transformOrigin: `${v.posX}% ${v.posY}%` };

    if (v.kind === "hero") {
      return (
        <div style={style} className={`relative overflow-hidden rounded-[24px] bg-gradient-to-br ${gradient.value} w-full`}>
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={v.label} className="absolute inset-0 w-full h-full object-cover" style={imgStyle} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <svg className="absolute right-6 bottom-6 w-[120px] h-[120px] text-white/[0.12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d={icon.path} /></svg>
            </>
          )}
          <div className="relative z-[2] p-5 pt-6 flex flex-col h-full">
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-sm">{categoryDisplay}</span>
              {format && <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-[11px] font-medium">{format}</span>}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-[11px] font-medium"><MapPin className="w-3 h-3" />{cityLabel}</span>
            </div>
            <h2 className="text-[20px] font-bold text-white leading-[1.15] mb-2 line-clamp-2">{title || "Kurs nomi"}</h2>
            <p className="text-[12px] text-white/50 mb-auto line-clamp-1">{providerName} &middot; {cityLabel}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <div className="px-2.5 py-1.5 rounded-[8px] bg-white/10">
                <p className="text-[9px] text-white/40 mb-0.5">Narx</p>
                <p className="text-[12px] font-bold text-white">{priceShort}</p>
              </div>
              <div className="px-2.5 py-1.5 rounded-[8px] bg-white/10">
                <p className="text-[9px] text-white/40 mb-0.5">Davom.</p>
                <p className="text-[12px] font-bold text-white">{duration || "—"}</p>
              </div>
              <div className="px-2.5 py-1.5 rounded-[8px] bg-white/10">
                <p className="text-[9px] text-white/40 mb-0.5">Reyting</p>
                <p className="text-[12px] font-bold text-white flex items-center gap-0.5"><Star className="w-3 h-3 fill-white text-white" />5.0</p>
              </div>
              <div className="px-2.5 py-1.5 rounded-[8px] bg-white/10">
                <p className="text-[9px] text-white/40 mb-0.5">Bo&apos;sh joy</p>
                <p className="text-[12px] font-bold text-white">Yangi</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (v.kind === "b") {
      return (
        <div style={style} className={`relative overflow-hidden rounded-[22px] bg-gradient-to-br ${gradient.value} flex flex-col w-full`}>
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={v.label} className="absolute inset-0 w-full h-full object-cover" style={imgStyle} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
              <svg className="absolute right-5 bottom-24 w-[90px] h-[90px] text-white/[0.06]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"><path d={icon.path} /></svg>
            </>
          )}
          <div className="relative z-[2] p-6 md:p-7 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold">{categoryDisplay}</span>
              {format && <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-[12px]">{format}</span>}
            </div>
            <h3 className="text-[22px] font-bold text-white leading-tight line-clamp-3">{title || "Kurs nomi"}</h3>
            <p className="text-[14px] text-white/35 mt-3 line-clamp-1">{providerName} &middot; {cityLabel}</p>
            <div className="flex items-center gap-3 mt-4 text-[13px] text-white/30">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-white/50 text-white/50" />5.0</span>
              <span>{duration || "Davomiylik"}</span>
            </div>
            <div className="mt-auto" />
          </div>
          <div className="relative z-[2] mx-4 mb-4 rounded-[14px] bg-white/[0.1] border border-white/[0.08] px-5 py-3.5 flex items-center justify-between">
            <span className="text-[16px] font-bold text-white">{priceLabel}</span>
            <ArrowRight className="w-4 h-4 text-white/30" />
          </div>
        </div>
      );
    }

    return (
      <div style={style} className={`relative overflow-hidden rounded-[18px] bg-gradient-to-br ${gradient.value} flex flex-col w-full`}>
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={v.label} className="absolute inset-0 w-full h-full object-cover" style={imgStyle} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/85" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        )}
        <div className="relative z-[2] p-5 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">{categoryDisplay}</span>
            {format && <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-[11px]">{format}</span>}
          </div>
          <h3 className="text-[17px] font-bold text-white leading-tight line-clamp-2">{title || "Kurs nomi"}</h3>
          <p className="text-[12px] text-white/35 mt-1 line-clamp-1">{providerName} &middot; {cityLabel}</p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-white/30">
            <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-white/50 text-white/50" />5.0</span>
            <span>{duration || "Davom."}</span>
          </div>
        </div>
        <div className="relative z-[2] mx-3 mb-3 rounded-[12px] bg-white/[0.1] border border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
          <span className="text-[14px] font-bold text-white">{priceLabel}</span>
          <ArrowRight className="w-3 h-3 text-white/30" />
        </div>
      </div>
    );
  };

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link href="/admin/listings" className="inline-flex items-center gap-2 text-[13px] font-medium mb-6" style={{ color: config.accent }}>
        <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold mb-1" style={{ color: config.text }}>Yangi e&apos;lon</h1>
      <p className="text-[14px] mb-4" style={{ color: config.textMuted }}>* belgilangan maydonlar majburiy</p>

      <div className="rounded-[12px] p-3 mb-5 flex items-start gap-2.5" style={{ backgroundColor: "#22c55e14", border: "1px solid #22c55e33" }}>
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
        <p className="text-[12px] leading-relaxed" style={{ color: "#22c55e" }}>
          <b>Admin tomonidan yaratilgan.</b> E&apos;lon moderatsiyadan o&apos;tkazilmasdan darhol <b>aktiv</b> holatda saytga chiqadi.
        </p>
      </div>

      <div className="space-y-5">
        {/* O'QITUVCHI VA KATEGORIYA */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>O&apos;qituvchi va kategoriya</h2>
          <div>
            <label className={labelClass} style={labelStyle}>O&apos;qituvchi (provider) *</label>
            <select
              value={providerId ?? ""}
              onChange={(e) => setProviderId(e.target.value ? Number(e.target.value) : null)}
              className={selectClass}
              style={selectStyle}
            >
              <option value="">{loadingLookups ? "Yuklanmoqda..." : "Tanlang"}</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.name} · {p.phone}</option>
              ))}
            </select>
            {!loadingLookups && providers.length === 0 && (
              <p className="text-[11px] mt-1" style={{ color: config.textDim }}>Provider rolli foydalanuvchi topilmadi</p>
            )}
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Kategoriya *</label>
            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              className={selectClass}
              style={selectStyle}
            >
              <option value="">{loadingLookups ? "Yuklanmoqda..." : "Tanlang"}</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* ASOSIY */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Asosiy ma&apos;lumotlar</h2>
          <div>
            <label className={labelClass} style={labelStyle}>Kurs nomi *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: JavaScript Full-stack bootcamp" className={inputClass} style={inputStyle} />
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
                <button onClick={() => setIsFree(false)} className="flex-1 h-[36px] rounded-[8px] text-[13px] font-medium transition-all" style={!isFree ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textDim }}>
                  Pullik
                </button>
                <button onClick={() => setIsFree(true)} className="flex-1 h-[36px] rounded-[8px] text-[13px] font-medium transition-all" style={isFree ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textDim }}>
                  Bepul
                </button>
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
            <label className={labelClass} style={labelStyle}>Davomiylik *</label>
            <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Masalan: 6 oy" className={inputClass} style={inputStyle} />
          </div>
        </div>

        {/* QO'SHIMCHA */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Qo&apos;shimcha</h2>
          <div>
            <label className={labelClass} style={labelStyle}>Kurs tavsifi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Kursda nima o'rgatiladi..." className={textareaClass} style={inputStyle} rows={4} />
          </div>
          {showLocation && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} style={labelStyle}>Viloyat *</label>
                  <select value={region} onChange={(e) => { setRegion(e.target.value); setCity(""); }} className={selectClass} style={selectStyle}>
                    <option value="">Tanlang</option>
                    {REGIONS.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Shahar *</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!region} className={selectClass} style={selectStyle}>
                    <option value="">{region ? "Tanlang" : "Avval viloyatni tanlang"}</option>
                    {REGIONS.find(r => r.name === region)?.cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}
          {showSchedule && (
            <div>
              <label className={labelClass} style={labelStyle}>Dars jadvali</label>
              <input placeholder="Du-Ju, 14:00-16:00" className={inputClass} style={inputStyle} />
            </div>
          )}
        </div>

        {/* KURS RASMI VA E'LON KO'RINISHI */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div>
            <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Kurs rasmi va e&apos;lon ko&apos;rinishi</h2>
            <p className="text-[12px] mt-1" style={{ color: config.textMuted }}>Rasm yuklang va u Desktop hamda Mobil qurilmalarda qanday ko&apos;rinishini ko&apos;ring</p>
          </div>

          <div className="min-w-0">
            <label className={labelClass} style={labelStyle}>Rasm (ixtiyoriy)</label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              disabled={submitting}
              label=""
              bg={config.hover}
              border={config.surfaceBorder}
              text={config.text}
              textMuted={config.textMuted}
            />
          </div>

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
                {renderVariant(active)}
              </div>
            </div>

            {imageUrl && (
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
            )}
          </div>

          {!imageUrl && (
            <>
              <div className="h-px" style={{ backgroundColor: config.surfaceBorder }} />

              <div className="space-y-4">
                {/* Color picker */}
                <div>
                  <label className={labelClass} style={labelStyle}>Rang</label>
                  <div className="grid grid-cols-5 gap-2">
                    {GRADIENT_OPTIONS.map((g) => {
                      const isActive = gradient.id === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGradient(g)}
                          title={g.label}
                          className={`relative h-[40px] rounded-[10px] bg-gradient-to-br ${g.value} ${isActive ? "ring-2 ring-white ring-offset-2 ring-offset-[#16181a]" : ""}`}
                        >
                          {isActive && <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Icon picker */}
                <div className="min-w-0">
                  <label className={labelClass} style={labelStyle}>Ikon</label>
                  <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
                    {ICON_CATEGORIES.map(c => {
                      const isActive = iconCategoryId === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setIconCategoryId(c.id)}
                          className="shrink-0 px-2.5 py-1 rounded-[8px] text-[11px] font-medium whitespace-nowrap transition-all"
                          style={{
                            backgroundColor: isActive ? config.accent : config.hover,
                            color: isActive ? config.accentText : config.textMuted,
                            border: `1px solid ${isActive ? config.accent : config.surfaceBorder}`,
                          }}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {activeIconCategory.icons.map(ic => {
                      const isActive = icon.id === ic.id;
                      return (
                        <button
                          key={ic.id}
                          type="button"
                          onClick={() => setIcon(ic)}
                          title={ic.label}
                          className="h-[40px] rounded-[8px] flex items-center justify-center transition-all"
                          style={{
                            backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                            border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)" }}>
                            <path d={ic.path} />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-[10px]" style={{ backgroundColor: "#ef444414", border: "1px solid #ef444433", color: "#ef4444" }}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[13px]">{error}</p>
          </div>
        )}

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full h-[50px] rounded-[12px] text-[16px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: config.accent, color: config.accentText }}
        >
          {submitting ? "Yuborilmoqda..." : "E'lonni yaratish"}
        </button>
      </div>
    </div>
  );
}
