"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Plus, GripVertical, X, Check, Star, ArrowRight, AlertCircle, MapPin, Monitor, Smartphone } from "lucide-react";
import { GRADIENT_OPTIONS, ICON_OPTIONS, ICON_CATEGORIES } from "@/data/courses";
import { useDashboardTheme } from "@/context/dashboard-theme-context";
import { ImageUpload } from "@/components/image-upload";
import { PriceScroll } from "@/components/price-scroll";
import { REGIONS } from "@/data/regions";

interface TaxonomyGroup {
  id: number;
  name: string;
  slug: string;
  categories: { id: number; name: string; slug: string }[];
}

const formatlar = ["Onlayn", "Oflayn", "Gibrid", "Video"];
const tillar: { code: string; label: string }[] = [
  { code: "uz", label: "O'zbek" },
  { code: "ru", label: "Rus" },
  { code: "en", label: "Ingliz" },
];
const darajalar = ["Boshlang'ich", "O'rta", "Yuqori", "Mutaxassis"];
const tolovTuri = ["Bir martalik", "Oylik"];

const inputClass = "w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all";
const selectClass = "w-full h-[44px] px-3 rounded-[10px] text-[14px] focus:outline-none focus:border-[#7ea2d4]/40 transition-all appearance-none";
const textareaClass = "w-full px-4 py-3 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all resize-none";
const labelClass = "text-[12px] mb-1.5 block";

export default function NewListingPage() {
  const { config } = useDashboardTheme();
  const { data: session } = useSession();
  const providerName = (session?.user as { name?: string })?.name ?? "Sizning markazingiz";
  const inputStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text };
  const selectStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.textMuted };
  const labelStyle = { color: config.textDim };
  const [isFree, setIsFree] = useState(false);
  const [format, setFormat] = useState("");
  const [lessons, setLessons] = useState<string[]>([""]);
  const [gradient, setGradient] = useState(GRADIENT_OPTIONS[0]);
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [iconCategoryId, setIconCategoryId] = useState(ICON_CATEGORIES[0].id);
  const [title, setTitle] = useState("");
  const [taxonomy, setTaxonomy] = useState<TaxonomyGroup[]>([]);
  const [groupId, setGroupId] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  // Yangi yo'nalish so'rovi rejimi — kategoriya dropdown'da "Boshqa yo'nalish so'rash" tanlanganda
  const [requestNewCategory, setRequestNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [price, setPrice] = useState(50000);
  const [duration, setDuration] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  const [description, setDescription] = useState("");
  // 10 new detail fields
  const [language, setLanguage] = useState("uz");
  const [level, setLevel] = useState("");
  const [paymentType, setPaymentType] = useState(tolovTuri[0]);
  const [schedule, setSchedule] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherExperience, setTeacherExperience] = useState("");
  const [certificate, setCertificate] = useState(false);
  const [demoLesson, setDemoLesson] = useState(false);
  const [discount, setDiscount] = useState("");
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
  const router = useRouter();

  const addLesson = () => setLessons([...lessons, ""]);
  const removeLesson = (i: number) => setLessons(lessons.filter((_, idx) => idx !== i));
  const updateLesson = (i: number, v: string) => setLessons(lessons.map((l, idx) => idx === i ? v : l));

  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories", { cache: "no-store" })
      .then(r => r.json())
      .then((data: { groups: TaxonomyGroup[] }) => {
        if (!cancelled) setTaxonomy(data.groups ?? []);
      })
      .catch(e => console.error("[form] load taxonomy failed", e));
    return () => { cancelled = true; };
  }, []);

  const selectedGroup = taxonomy.find(g => g.id === groupId);
  const availableCategories = selectedGroup?.categories ?? [];
  const selectedCategory = availableCategories.find(c => c.id === categoryId) ?? null;
  const categoryDisplayName = selectedCategory?.name ?? "Yo'nalish";

  const showLocation = format === "Oflayn" || format === "Gibrid";
  const showSchedule = format !== "Video" && format !== "";

  const submit = async () => {
    setError(null);
    if (!title.trim() || title.trim().length < 3) { setError("Kurs nomini kiriting"); return; }
    if (!groupId) { setError("Yo'nalish guruhini tanlang"); return; }
    if (requestNewCategory) {
      if (!newCategoryName.trim() || newCategoryName.trim().length < 2) {
        setError("Yangi yo'nalish nomini kiriting (kamida 2 belgi)");
        return;
      }
    } else {
      if (!categoryId) { setError("Yo'nalishni tanlang"); return; }
    }
    if (!format) { setError("Formatni tanlang"); return; }
    if (!isFree && price < 10000) { setError("Narx 10,000 so'mdan kam bo'lmasin"); return; }

    setSubmitting(true);
    try {
      const location = showLocation && city ? `${city}${region ? " · " + region : ""}` : null;
      const res = await fetch("/api/dashboard/listings", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          categoryId: requestNewCategory ? null : (categoryId || null),
          proposedCategoryName: requestNewCategory ? newCategoryName.trim() : undefined,
          proposedGroupId: requestNewCategory ? Number(groupId) : undefined,
          region: region || null,
          district: city || null,
          format,
          price: isFree ? 0 : price,
          priceFree: isFree,
          duration,
          location,
          description,
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
          lessons: lessons.map(s => s.trim()).filter(s => s.length > 0),
          language,
          level: level || null,
          paymentType: paymentType || null,
          schedule: showSchedule ? (schedule || null) : null,
          teacherName: teacherName || null,
          teacherExperience: teacherExperience || null,
          certificate,
          demoLesson,
          discount: discount || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Saqlashda xatolik");
        setSubmitting(false);
        return;
      }
      router.push("/center/listings");
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
      // A-class FeaturedSlider — matches src/components/featured-slider.tsx
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
          <div className="relative z-[2] p-5 pt-6 flex flex-col h-full txt-shadow-overlay">
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-sm">{categoryDisplayName}</span>
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
      // B-class CoursesSlider — matches src/components/courses-slider.tsx
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
          <div className="relative z-[2] p-6 md:p-7 flex-1 flex flex-col txt-shadow-overlay">
            <div className="flex items-center gap-2 mb-5">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold">{categoryDisplayName}</span>
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

    // C-class kurslar grid — matches src/app/kurslar/page.tsx
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
        <div className="relative z-[2] p-5 flex-1 txt-shadow-overlay">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">{categoryDisplayName}</span>
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
      <Link href="/center/home" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold mb-1" style={{ color: config.text }}>Yangi e&apos;lon</h1>
      <p className="text-[14px] mb-6" style={{ color: config.textMuted }}>* belgilangan maydonlar majburiy</p>

      <div className="space-y-5">
        {/* ASOSIY */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Asosiy ma&apos;lumotlar</h2>
          <div>
            <label className={labelClass} style={labelStyle}>Kurs nomi *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: JavaScript Full-stack bootcamp" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Yo&apos;nalish guruhi *</label>
            <select
              value={groupId}
              onChange={(e) => {
                setGroupId(e.target.value ? Number(e.target.value) : "");
                setCategoryId("");
                setRequestNewCategory(false);
                setNewCategoryName("");
              }}
              className={selectClass}
              style={selectStyle}
            >
              <option value="">Tanlang</option>
              {taxonomy.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Yo&apos;nalish *</label>
            <select
              value={requestNewCategory ? "__request__" : categoryId}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "__request__") {
                  setRequestNewCategory(true);
                  setCategoryId("");
                } else {
                  setRequestNewCategory(false);
                  setNewCategoryName("");
                  setCategoryId(v ? Number(v) : "");
                }
              }}
              disabled={!groupId}
              className={selectClass}
              style={selectStyle}
            >
              <option value="">{groupId ? "Tanlang" : "Avval guruhni tanlang"}</option>
              {availableCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              {groupId && <option value="__request__">✨ Boshqa yo&apos;nalish so&apos;rash</option>}
            </select>
            {requestNewCategory && (
              <div className="mt-2 rounded-[10px] p-3" style={{ backgroundColor: "#f59e0b15", border: "1px solid #f59e0b40" }}>
                <p className="text-[12px] font-medium mb-1.5" style={{ color: "#a16207" }}>Yangi yo&apos;nalish nomi</p>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value.slice(0, 60))}
                  placeholder="Masalan: Quran o'qish, Aviomexanik, Kalligrafiya..."
                  className={inputClass}
                  style={inputStyle}
                />
                <p className="text-[11px] mt-1.5" style={{ color: "#a16207" }}>
                  ⏳ E&apos;loningiz admin yo&apos;nalishni tasdiqlaganidan keyin sayt&apos;da paydo bo&apos;ladi.
                </p>
              </div>
            )}
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
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masalan: 6 oylik JavaScript Full-stack bootcamp. 1-oyda HTML/CSS va JS asoslari. 2-3 oyda React, Next.js, TypeScript. 4-5 oyda Node.js, Express, MongoDB. Yakuniy oyda 2 ta real loyiha + portfolio. Har hafta jonli amaliyot va code review."
              className={textareaClass}
              style={inputStyle}
              rows={5}
            />
            <div className="flex items-center justify-between gap-3 mt-1.5">
              <p className="text-[11px]" style={{ color: description.length > 0 && description.length < 150 ? "#f59e0b" : config.textDim }}>
                {description.length > 0 && description.length < 150
                  ? `SEO uchun kamida 150 belgi tavsiya qilinadi (yana ${150 - description.length} belgi)`
                  : "Kursni batafsil tavsiflang — qidiruv tizimlari ko'p matnli sahifalarni yaxshi ko'radi."}
              </p>
              <p className="text-[11px] shrink-0" style={{ color: config.textDim }}>{description.length} belgi</p>
            </div>
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
                  <label className={labelClass} style={labelStyle}>{region === "Toshkent shahri" ? "Tuman *" : "Shahar *"}</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!region} className={selectClass} style={selectStyle}>
                    <option value="">{region ? "Tanlang" : "Avval viloyatni tanlang"}</option>
                    {REGIONS.find(r => r.name === region)?.districts.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Manzil *</label>
                <input placeholder="Tuman, ko'cha, bino raqami" className={inputClass} style={inputStyle} />
              </div>
            </>
          )}
          {showSchedule && (
            <div>
              <label className={labelClass} style={labelStyle}>Dars jadvali</label>
              <input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="Du-Ju, 14:00-16:00" className={inputClass} style={inputStyle} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={labelStyle}>Til</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectClass} style={selectStyle}>
                {tillar.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Daraja</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass} style={selectStyle}>
                <option value="">Tanlang</option>
                {darajalar.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={labelClass} style={labelStyle}>To&apos;lov turi</label>
              <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className={selectClass} style={selectStyle}>
                {tolovTuri.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* O'QITUVCHI */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold" style={{ color: config.text }}>O&apos;qituvchi haqida</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: config.hover, color: config.textDim }}>ixtiyoriy</span>
          </div>
          <p className="text-[12px]" style={{ color: config.textMuted }}>To&apos;ldirilmasa, e&apos;lon sahifasida ushbu bo&apos;lim ko&apos;rinmaydi.</p>
          <div>
            <label className={labelClass} style={labelStyle}>Ism</label>
            <input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="Ism familiya" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Tajriba</label>
            <textarea value={teacherExperience} onChange={(e) => setTeacherExperience(e.target.value)} placeholder="5 yillik tajriba, Google sertifikati..." className={textareaClass} style={inputStyle} rows={3} />
          </div>
        </div>

        {/* OPSIYALAR */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Opsiyalar</h2>
          <div>
            <label className={labelClass} style={labelStyle}>Dars rejasi</label>
            <div className="space-y-2">
              {lessons.map((lesson, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 h-[44px] px-3 rounded-[10px] focus-within:border-[#7ea2d4]/40 transition-all" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}>
                    <GripVertical className="w-4 h-4 shrink-0 cursor-grab" style={{ color: config.textDim }} />
                    <span className="text-[12px] font-medium shrink-0 min-w-[24px]" style={{ color: config.textDim }}>{i + 1}.</span>
                    <input
                      type="text"
                      value={lesson}
                      onChange={(e) => updateLesson(i, e.target.value)}
                      placeholder={i === 0 ? "Masalan: HTML/CSS asoslari" : "Mavzu nomi..."}
                      className="flex-1 bg-transparent text-[14px] placeholder:text-white/20 focus:outline-none"
                      style={{ color: config.text }}
                    />
                  </div>
                  {lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(i)}
                      className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all shrink-0"
                      style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.textDim }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLesson}
                className="w-full h-[40px] rounded-[10px] border border-dashed text-[13px] font-medium hover:border-[#7ea2d4]/40 hover:text-[#7ea2d4] hover:bg-[#7ea2d4]/5 transition-all flex items-center justify-center gap-2"
                style={{ borderColor: config.surfaceBorder, color: config.textMuted }}
              >
                <Plus className="w-4 h-4" /> Mavzu qo&apos;shish
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={labelStyle}>Sertifikat</label>
              <select value={certificate ? "ha" : "yoq"} onChange={(e) => setCertificate(e.target.value === "ha")} className={selectClass} style={selectStyle}>
                <option value="yoq">Yo&apos;q</option>
                <option value="ha">Ha, beriladi</option>
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Demo dars</label>
              <select value={demoLesson ? "ha" : "yoq"} onChange={(e) => setDemoLesson(e.target.value === "ha")} className={selectClass} style={selectStyle}>
                <option value="yoq">Yo&apos;q</option>
                <option value="ha">Ha, bor</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Chegirma / aksiya</label>
            <input value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Birinchi oy 50% chegirma" className={inputClass} style={inputStyle} />
          </div>
        </div>

        {/* KURS RASMI VA E'LON KO'RINISHI — eng pastda, submit dan oldin */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div>
            <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Kurs rasmi va e&apos;lon ko&apos;rinishi</h2>
            <p className="text-[12px] mt-1" style={{ color: config.textMuted }}>Rasm yuklang va u Desktop hamda Mobil qurilmalarda qanday ko&apos;rinishini ko&apos;ring</p>
          </div>

          {/* 1. Rasm joylash */}
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

          {/* Tab buttons + active preview + shared slider panel */}
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

              {/* 3. Rang + Ikon — rasm yuklanmaganda */}
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
          {submitting ? "Yuborilmoqda..." : "E'lonni joylash"}
        </button>
      </div>
    </div>
  );
}
