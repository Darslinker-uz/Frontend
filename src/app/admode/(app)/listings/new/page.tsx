"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Star, ArrowRight, AlertCircle, MapPin, Monitor, Smartphone, ShieldCheck, Plus, X, GripVertical, Search, ChevronDown } from "lucide-react";
import { GRADIENT_OPTIONS, ICON_OPTIONS, ICON_CATEGORIES } from "@/data/courses";
import { useAdminTheme } from "@/context/admin-theme-context";
import { ImageUpload } from "@/components/image-upload";
import { PriceScroll } from "@/components/price-scroll";
import { REGIONS } from "@/data/regions";

const formatlar = ["Onlayn", "Oflayn", "Gibrid", "Video"];
const FORMAT_MAP: Record<string, "offline" | "online" | "video" | "hybrid"> = {
  Onlayn: "online",
  Oflayn: "offline",
  Gibrid: "hybrid",
  Video: "video",
};
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

interface ProviderOption { id: number; name: string; centerName: string | null; phone: string }

interface TaxonomyGroup {
  id: number;
  name: string;
  slug: string;
  categories: { id: number; name: string; slug: string }[];
}

function AdminNewListingPageInner() {
  const { config } = useAdminTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProviderId = searchParams.get("providerId");

  const inputStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text };
  const selectStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.textMuted };
  const labelStyle = { color: config.textDim };

  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [taxonomy, setTaxonomy] = useState<TaxonomyGroup[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  const [providerId, setProviderId] = useState<number | null>(null);
  const [providerSearch, setProviderSearch] = useState("");
  const [providerOpen, setProviderOpen] = useState(false);
  const [groupId, setGroupId] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [requestNewCategory, setRequestNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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
  const [lessons, setLessons] = useState<string[]>([""]);
  const [activeVariant, setActiveVariant] = useState<"a-desktop" | "a-mobile" | "b" | "c-desktop" | "c-mobile">("a-desktop");
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

  const addLesson = () => setLessons([...lessons, ""]);
  const removeLesson = (i: number) => setLessons(lessons.filter((_, idx) => idx !== i));
  const updateLesson = (i: number, v: string) => setLessons(lessons.map((l, idx) => idx === i ? v : l));

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
            const list = (users as Array<{ id: number; name: string; centerName: string | null; phone: string; role: string }>)
              .filter(u => u.role === "provider")
              .map(u => ({ id: u.id, name: u.name, centerName: u.centerName ?? null, phone: u.phone }));
            setProviders(list);
            // Preselect from ?providerId= (when admin lands here from the users page menu)
            if (initialProviderId) {
              const idNum = Number(initialProviderId);
              if (list.some(p => p.id === idNum)) setProviderId(idNum);
            }
          }
        }
        if (cRes.ok) {
          const data = await cRes.json();
          if (!cancelled) {
            setTaxonomy((data.groups ?? []) as TaxonomyGroup[]);
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
  const selectedGroup = taxonomy.find(g => g.id === groupId);
  const availableCategories = selectedGroup?.categories ?? [];
  const selectedCategory = availableCategories.find(c => c.id === categoryId) ?? null;
  const providerName = selectedProvider?.centerName ?? selectedProvider?.name ?? "O'qituvchi";

  const showLocation = format === "Oflayn" || format === "Gibrid";
  const showSchedule = format !== "Video" && format !== "";

  const submit = async () => {
    setError(null);
    if (!providerId) { setError("O'qituvchini tanlang"); return; }
    if (requestNewCategory) {
      if (!groupId) { setError("Avval guruhni tanlang"); return; }
      if (!newCategoryName.trim() || newCategoryName.trim().length < 2) {
        setError("Yangi yo'nalish nomini kiriting");
        return;
      }
    } else if (!categoryId) {
      setError("Yo'nalishni tanlang");
      return;
    }
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
          categoryId: requestNewCategory ? null : (categoryId || null),
          proposedCategoryName: requestNewCategory ? newCategoryName.trim() : undefined,
          proposedGroupId: requestNewCategory ? Number(groupId) : undefined,
          region: region || null,
          district: city || null,
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
          lessons: lessons.map(s => s.trim()).filter(s => s.length > 0),
          status: "active",
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
      router.push("/admode/listings");
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
  const categoryDisplayName = selectedCategory?.name ?? "Yo'nalish";

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
      <Link href="/admode/listings" className="inline-flex items-center gap-2 text-[13px] font-medium mb-6" style={{ color: config.accent }}>
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
            <div className="relative">
              {selectedProvider ? (
                <div className="flex items-center gap-2 h-[44px] px-3 rounded-[10px]" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium truncate" style={{ color: config.text }}>
                      {selectedProvider.centerName ?? selectedProvider.name}
                      {selectedProvider.centerName && (
                        <span className="font-normal" style={{ color: config.textMuted }}> ({selectedProvider.name})</span>
                      )}
                    </p>
                    <p className="text-[11px]" style={{ color: config.textDim }}>{selectedProvider.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setProviderId(null); setProviderSearch(""); setProviderOpen(true); }}
                    className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 transition-colors shrink-0"
                    style={{ color: config.textMuted }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: config.textDim }} />
                  <input
                    type="text"
                    value={providerSearch}
                    onChange={(e) => { setProviderSearch(e.target.value); setProviderOpen(true); }}
                    onFocus={() => setProviderOpen(true)}
                    placeholder={loadingLookups ? "Yuklanmoqda..." : "Markaz nomi, ism yoki telefon orqali qidiring..."}
                    className="w-full h-[44px] pl-10 pr-9 rounded-[10px] text-[14px] focus:outline-none focus:border-[#7ea2d4]/40 transition-all"
                    style={inputStyle}
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: config.textDim }} />
                </>
              )}
              {providerOpen && !selectedProvider && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProviderOpen(false)} />
                  <div className="absolute left-0 right-0 top-[48px] z-50 max-h-[280px] overflow-y-auto rounded-[10px] p-1 shadow-2xl" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                    {(() => {
                      const q = providerSearch.trim().toLowerCase();
                      const list = q
                        ? providers.filter(p =>
                            p.name.toLowerCase().includes(q) ||
                            (p.centerName ?? "").toLowerCase().includes(q) ||
                            p.phone.includes(q)
                          )
                        : providers;
                      if (list.length === 0) {
                        return <p className="text-[12px] px-3 py-2" style={{ color: config.textDim }}>Topilmadi</p>;
                      }
                      return list.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { setProviderId(p.id); setProviderOpen(false); setProviderSearch(""); }}
                          className="w-full text-left px-2.5 py-2 rounded-[8px] hover:opacity-100 transition-colors"
                          style={{ color: config.text, backgroundColor: "transparent" }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.hover}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <p className="text-[13px] font-medium truncate">
                            {p.centerName ?? p.name}
                            {p.centerName && (
                              <span className="font-normal" style={{ color: config.textMuted }}> ({p.name})</span>
                            )}
                          </p>
                          <p className="text-[11px]" style={{ color: config.textDim }}>{p.phone}</p>
                        </button>
                      ));
                    })()}
                  </div>
                </>
              )}
            </div>
            {!loadingLookups && providers.length === 0 && (
              <p className="text-[11px] mt-1" style={{ color: config.textDim }}>Provider rolli foydalanuvchi topilmadi</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={labelStyle}>Yo&apos;nalish guruhi *</label>
              <select
                value={groupId}
                onChange={(e) => { setGroupId(e.target.value ? Number(e.target.value) : ""); setCategoryId(""); }}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">{loadingLookups ? "Yuklanmoqda..." : "Tanlang"}</option>
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
                {groupId && <option value="__request__">✨ Yangi yo&apos;nalish so&apos;rash</option>}
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
                    Admin yaratganda darhol ko&apos;rinadi. Assistant uchun super admin tasdig&apos;idan keyin chiqadi.
                  </p>
                </div>
              )}
            </div>
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
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masalan: 6 oylik JavaScript Full-stack bootcamp. 1-oyda HTML/CSS va JS asoslari. 2-3 oyda React, Next.js, TypeScript. 4-5 oyda Node.js, Express, MongoDB. Yakuniy oyda 2 ta real loyiha + portfolio."
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

        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div>
            <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Dars rejasi</h2>
            <p className="text-[12px] mt-1" style={{ color: config.textMuted }}>Kurs davomida o&apos;tiladigan mavzular ro&apos;yxati (e&apos;lon sahifasida ko&apos;rinadi)</p>
          </div>
          <div className="space-y-2">
            {lessons.map((lesson, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 h-[44px] px-3 rounded-[10px] focus-within:border-[#7ea2d4]/40 transition-all" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}>
                  <GripVertical className="w-4 h-4 shrink-0" style={{ color: config.textDim }} />
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

export default function AdminNewListingPage() {
  return (
    <Suspense fallback={<div className="px-5 md:px-8 py-6 md:py-8 text-[14px] opacity-60">Yuklanmoqda...</div>}>
      <AdminNewListingPageInner />
    </Suspense>
  );
}
