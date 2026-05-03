"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Star, ArrowRight, AlertCircle, Save, Monitor, Smartphone, ShieldCheck, MapPin, Plus, X, GripVertical } from "lucide-react";
import { GRADIENT_OPTIONS, ICON_OPTIONS, ICON_CATEGORIES } from "@/data/courses";
import { useAdminTheme } from "@/context/admin-theme-context";
import { ImageUpload } from "@/components/image-upload";
import { PriceScroll } from "@/components/price-scroll";
import { REGIONS } from "@/data/regions";

const FORMAT_TO_UI: Record<string, string> = { offline: "Oflayn", online: "Onlayn", video: "Video", hybrid: "Gibrid" };
const UI_TO_FORMAT: Record<string, "offline" | "online" | "video" | "hybrid"> = {
  Onlayn: "online",
  Oflayn: "offline",
  Gibrid: "hybrid",
  Video: "video",
};

const formatlar = ["Onlayn", "Oflayn", "Gibrid", "Video"];
const tillar: { code: string; label: string }[] = [
  { code: "uz", label: "O'zbek" },
  { code: "ru", label: "Rus" },
  { code: "en", label: "Ingliz" },
];
const darajalar = ["Boshlang'ich", "O'rta", "Yuqori", "Mutaxassis"];
const tolovTuri = ["Bir martalik", "Oylik"];

interface TaxonomyGroup {
  id: number;
  name: string;
  slug: string;
  categories: { id: number; name: string; slug: string }[];
}

type Status = "pending" | "active" | "paused" | "rejected";

const STATUS_META: Record<Status, { label: string; color: string }> = {
  pending: { label: "Tekshiruvda", color: "#f59e0b" },
  active: { label: "Aktiv", color: "#22c55e" },
  paused: { label: "To'xtatilgan", color: "#94a3b8" },
  rejected: { label: "Rad etilgan", color: "#ef4444" },
};

const inputClass = "w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all";
const selectClass = "w-full h-[44px] px-3 rounded-[10px] text-[14px] focus:outline-none focus:border-[#7ea2d4]/40 transition-all appearance-none";
const textareaClass = "w-full px-4 py-3 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all resize-none";
const labelClass = "text-[12px] mb-1.5 block";

interface ApiListing {
  id: number;
  title: string;
  description: string | null;
  price: number;
  format: "offline" | "online" | "video";
  location: string | null;
  region: string | null;
  district: string | null;
  duration: string | null;
  lessons: string[];
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
  status: Status;
  rejectReason: string | null;
  category: { id: number; name: string; slug: string; pendingApproval?: boolean; group?: { id: number; name: string; slug: string } | null };
  user: { id: number; name: string; centerName: string | null; phone: string };
  language: string;
  languages?: string[];
  level: string | null;
  levels?: string[];
  branches?: { region: string | null; district: string | null; address: string | null; sortOrder: number }[];
  studentLimit: number | null;
  paymentType: string | null;
  schedule: string | null;
  teacherName: string | null;
  teacherExperience: string | null;
  certificate: boolean;
  demoLesson: boolean;
  discount: string | null;
}

export default function AdminEditListingPage() {
  const { config } = useAdminTheme();
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params.id);

  const inputStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text };
  const selectStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.textMuted };
  const readonlyStyle = { backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.textMuted };
  const labelStyle = { color: config.textDim };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [taxonomy, setTaxonomy] = useState<TaxonomyGroup[]>([]);
  const [groupId, setGroupId] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [providerName, setProviderName] = useState("");
  const [format, setFormat] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState(50000);
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [branches, setBranches] = useState<{ region: string; district: string; address: string }[]>([
    { region: "", district: "", address: "" },
  ]);
  const region = branches[0]?.region ?? "";
  const city = branches[0]?.district ?? "";
  const [status, setStatus] = useState<Status>("active");
  const [rejectReason, setRejectReason] = useState("");

  const [gradient, setGradient] = useState(GRADIENT_OPTIONS[0]);
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [iconCategoryId, setIconCategoryId] = useState(ICON_CATEGORIES[0].id);

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
  const [languages, setLanguages] = useState<string[]>(["uz"]);
  const [levels, setLevels] = useState<string[]>([]);
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

  const selectedGroup = taxonomy.find(g => g.id === groupId);
  const availableCategories = selectedGroup?.categories ?? [];
  const selectedCategory = availableCategories.find(c => c.id === categoryId) ?? null;
  const categoryDisplayName = selectedCategory?.name ?? "Yo'nalish";

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

  // Pending category metadata — banner uchun
  const [pendingCategory, setPendingCategory] = useState<{ id: number; name: string; groupName: string | null } | null>(null);
  const [approvingCategory, setApprovingCategory] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/listings/${listingId}`, { cache: "no-store" });
        if (res.status === 404) { if (!cancelled) setNotFound(true); return; }
        if (!res.ok) { if (!cancelled) setError("Yuklashda xatolik"); return; }
        const data: { listing: ApiListing } = await res.json();
        if (cancelled) return;
        const l = data.listing;
        setTitle(l.title);
        setGroupId(l.category?.group?.id ?? "");
        setCategoryId(l.category?.id ?? "");
        if (l.category?.pendingApproval) {
          setPendingCategory({ id: l.category.id, name: l.category.name, groupName: l.category.group?.name ?? null });
        } else {
          setPendingCategory(null);
        }
        setProviderName(l.user?.centerName ? `${l.user.centerName} (${l.user.name})` : (l.user?.name ?? ""));
        setFormat(FORMAT_TO_UI[l.format] ?? "Onlayn");
        setIsFree(l.price === 0);
        setPrice(l.price === 0 ? 50000 : l.price);
        setDuration(l.duration ?? "");
        setDescription(l.description ?? "");
        // Filiallar — yangi jadvaldan, bo'lmasa eski region/district'dan
        if (l.branches && l.branches.length > 0) {
          setBranches(l.branches.map(b => ({
            region: b.region ?? "",
            district: b.district ?? "",
            address: b.address ?? "",
          })));
        } else if (l.region || l.district || l.location) {
          setBranches([{
            region: l.region ?? "",
            district: l.district ?? "",
            address: l.location ?? "",
          }]);
        }
        setStatus(l.status);
        setRejectReason(l.rejectReason ?? "");
        if (l.color) {
          const g = GRADIENT_OPTIONS.find(x => x.id === l.color);
          if (g) setGradient(g);
        }
        if (l.icon) {
          const ic = ICON_OPTIONS.find(x => x.id === l.icon);
          if (ic) {
            setIcon(ic);
            const cat = ICON_CATEGORIES.find(c => c.icons.some(i => i.id === ic.id));
            if (cat) setIconCategoryId(cat.id);
          }
        }
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
        setLessons(l.lessons && l.lessons.length > 0 ? l.lessons : [""]);
        setLanguages(l.languages && l.languages.length > 0 ? l.languages : (l.language ? [l.language] : ["uz"]));
        setLevels(l.levels && l.levels.length > 0 ? l.levels : (l.level ? [l.level] : []));
        setPaymentType(l.paymentType ?? tolovTuri[0]);
        setSchedule(l.schedule ?? "");
        setTeacherName(l.teacherName ?? "");
        setTeacherExperience(l.teacherExperience ?? "");
        setCertificate(Boolean(l.certificate));
        setDemoLesson(Boolean(l.demoLesson));
        setDiscount(l.discount ?? "");
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [listingId]);

  const showLocation = format === "Oflayn" || format === "Gibrid";
  const showSchedule = format !== "Video" && format !== "";

  const save = async () => {
    setError(null);
    if (!title.trim() || title.trim().length < 3) { setError("Kurs nomini kiriting"); return; }
    if (!categoryId) { setError("Yo'nalishni tanlang"); return; }
    if (!format) { setError("Formatni tanlang"); return; }
    if (!isFree && price < 10000) { setError("Narx 10,000 so'mdan kam bo'lmasin"); return; }
    if (status === "rejected" && !rejectReason.trim()) { setError("Rad etish sababini kiriting"); return; }

    setSaving(true);
    try {
      const filledBranches = showLocation
        ? branches.filter(b => b.region || b.district || b.address)
        : [];
      const firstBranch = filledBranches[0];
      const location = firstBranch
        ? [firstBranch.address, firstBranch.district, firstBranch.region].filter(Boolean).join(" · ")
        : null;
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          categoryId: categoryId || null,
          region: firstBranch?.region || null,
          district: firstBranch?.district || null,
          branches: filledBranches.map(b => ({
            region: b.region || null,
            district: b.district || null,
            address: b.address || null,
          })),
          format: UI_TO_FORMAT[format],
          price: isFree ? 0 : price,
          duration: duration || null,
          description: description || null,
          location,
          color: gradient.id,
          icon: icon.id,
          status,
          rejectReason: status === "rejected" ? rejectReason : null,
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
          lessons: lessons.map(s => s.trim()).filter(s => s.length > 0),
          language: languages[0] || "uz",
          languages,
          level: levels[0] || null,
          levels,
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
        setSaving(false);
        return;
      }
      router.push("/admode/listings");
      router.refresh();
    } catch {
      setError("Tarmoq xatosi, qayta urining");
      setSaving(false);
    }
  };

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
        <Link href="/admode/listings" className="text-[13px]" style={{ color: config.accent }}>Orqaga qaytish</Link>
      </div>
    );
  }

  const activeIconCategory = ICON_CATEGORIES.find(c => c.id === iconCategoryId) ?? ICON_CATEGORIES[0];
  const cityLabel = showLocation && city ? city : "Online";
  const priceFormatted = new Intl.NumberFormat("uz-UZ").format(price).replace(/\s/g, ",");
  const priceLabel = isFree ? "Bepul" : `${priceFormatted} so'm`;
  const priceShort = isFree ? "Bepul" : priceFormatted;
  const statusMeta = STATUS_META[status];

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
      <Link href="/admode/listings" className="inline-flex items-center gap-2 text-[13px] font-medium mb-6" style={{ color: config.accent }}>
        <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
      </Link>

      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
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

      <div className="rounded-[12px] p-3 mb-5 flex items-start gap-2.5" style={{ backgroundColor: "#22c55e14", border: "1px solid #22c55e33" }}>
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
        <p className="text-[12px] leading-relaxed" style={{ color: "#22c55e" }}>
          <b>Admin rejimi.</b> O&apos;zgarishlar avtomatik qo&apos;llanadi va qayta moderatsiyaga yuborilmaydi. Holatni qo&apos;lda o&apos;zgartirishingiz mumkin.
        </p>
      </div>

      <div className="space-y-5">
        {/* PENDING CATEGORY BANNER — yangi yo'nalish so'rovi */}
        {pendingCategory && (
          <div className="rounded-[16px] p-4 sm:p-5" style={{ backgroundColor: "#f59e0b15", border: "1px solid #f59e0b40" }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "#f59e0b22", color: "#a16207" }}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold" style={{ color: "#a16207" }}>
                  ⚠ Yangi yo&apos;nalish so&apos;rovi
                </p>
                <p className="text-[13px] mt-1" style={{ color: "#a16207" }}>
                  O&apos;qituvchi yangi yo&apos;nalish taklif qilgan: <strong>&ldquo;{pendingCategory.name}&rdquo;</strong>
                  {pendingCategory.groupName ? <> &mdash; <em>{pendingCategory.groupName}</em> guruhida</> : null}
                </p>
                <p className="text-[11px] mt-2" style={{ color: "#a16207" }}>
                  <strong>Tasdiqlash:</strong> yo&apos;nalish saytda paydo bo&apos;ladi va boshqa o&apos;qituvchilar ham foydalanishi mumkin bo&apos;ladi.
                  <br /><strong>Boshqasiga ko&apos;chirish:</strong> formadagi yo&apos;nalish guruh + yo&apos;nalish dropdown&apos;laridan mavjud yo&apos;nalishni tanlang va saqlang.
                </p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <button
                    type="button"
                    disabled={approvingCategory}
                    onClick={async () => {
                      setApprovingCategory(true);
                      try {
                        const res = await fetch(`/api/admin/categories/${pendingCategory.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ approve: true }),
                        });
                        if (!res.ok) {
                          const data = await res.json().catch(() => null);
                          setError(data?.error ?? "Tasdiqlashda xatolik");
                        } else {
                          setPendingCategory(null);
                        }
                      } catch {
                        setError("Tarmoq xatosi");
                      } finally {
                        setApprovingCategory(false);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 h-[36px] px-4 rounded-[8px] text-[13px] font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {approvingCategory ? "Tasdiqlanmoqda..." : "Yo'nalishni tasdiqlash"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASOSIY */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Asosiy ma&apos;lumotlar</h2>
          <div>
            <label className={labelClass} style={labelStyle}>Kurs nomi *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} style={inputStyle} />
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
                <option value="">Tanlang</option>
                {taxonomy.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Yo&apos;nalish *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                disabled={!groupId}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">{groupId ? "Tanlang" : "Avval guruhni tanlang"}</option>
                {availableCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>O&apos;qituvchi</label>
            <input value={providerName} disabled readOnly className={inputClass} style={{ ...readonlyStyle, opacity: 0.7, cursor: "not-allowed" }} />
            <p className="text-[11px] mt-1" style={{ color: config.textDim }}>O&apos;qituvchini o&apos;zgartirish uchun e&apos;lonni qayta yarating.</p>
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

        {/* TAVSIF */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Tavsif</h2>
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={labelClass} style={labelStyle}>Filiallar (manzillar)</label>
                <span className="text-[11px]" style={{ color: config.textDim }}>{branches.length} / 10</span>
              </div>
              {branches.map((br, i) => (
                <div key={i} className="rounded-[10px] p-3 space-y-2" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold" style={{ color: config.text }}>Filial {i + 1}</span>
                    {branches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setBranches(branches.filter((_, idx) => idx !== i))}
                        className="text-[11px] font-medium hover:underline"
                        style={{ color: "#ef4444" }}
                      >
                        O&apos;chirish
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <select
                      value={br.region}
                      onChange={(e) => {
                        const next = [...branches];
                        next[i] = { ...next[i], region: e.target.value, district: "" };
                        setBranches(next);
                      }}
                      className={selectClass}
                      style={selectStyle}
                    >
                      <option value="">Viloyat</option>
                      {REGIONS.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
                    </select>
                    <select
                      value={br.district}
                      onChange={(e) => {
                        const next = [...branches];
                        next[i] = { ...next[i], district: e.target.value };
                        setBranches(next);
                      }}
                      disabled={!br.region}
                      className={selectClass}
                      style={selectStyle}
                    >
                      <option value="">{br.region === "Toshkent shahri" ? "Tuman" : "Shahar"}</option>
                      {REGIONS.find(r => r.name === br.region)?.districts.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={br.address}
                    onChange={(e) => {
                      const next = [...branches];
                      next[i] = { ...next[i], address: e.target.value.slice(0, 200) };
                      setBranches(next);
                    }}
                    placeholder="Ko'cha, bino raqami (ixtiyoriy)"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              ))}
              {branches.length < 10 && (
                <button
                  type="button"
                  onClick={() => setBranches([...branches, { region: "", district: "", address: "" }])}
                  className="w-full h-[40px] rounded-[10px] border border-dashed text-[13px] font-medium hover:border-[#7ea2d4]/40 hover:text-[#7ea2d4] hover:bg-[#7ea2d4]/5 transition-all flex items-center justify-center gap-2"
                  style={{ borderColor: config.surfaceBorder, color: config.textMuted }}
                >
                  <Plus className="w-4 h-4" /> Yana filial qo&apos;shish
                </button>
              )}
            </div>
          )}
        </div>

        {/* QO'SHIMCHA */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Qo&apos;shimcha</h2>
          {showSchedule && (
            <div>
              <label className={labelClass} style={labelStyle}>Dars jadvali</label>
              <input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="Du-Ju, 14:00-16:00" className={inputClass} style={inputStyle} />
            </div>
          )}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={labelClass} style={labelStyle}>Dars tili</label>
              <div className="flex flex-wrap gap-1.5">
                {tillar.map((t) => {
                  const checked = languages.includes(t.code);
                  return (
                    <button
                      key={t.code}
                      type="button"
                      onClick={() => setLanguages(checked ? languages.filter(l => l !== t.code) : [...languages, t.code])}
                      className="px-3 h-[36px] rounded-[8px] text-[12px] font-medium transition-all flex items-center gap-1.5"
                      style={{
                        backgroundColor: checked ? config.accent : config.hover,
                        color: checked ? config.accentText : config.textMuted,
                        border: `1px solid ${checked ? config.accent : config.surfaceBorder}`,
                      }}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] mt-1" style={{ color: config.textDim }}>Bir nechta til tanlanishi mumkin</p>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Darajalar</label>
              <div className="flex flex-wrap gap-1.5">
                {darajalar.map((d) => {
                  const checked = levels.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setLevels(checked ? levels.filter(l => l !== d) : [...levels, d])}
                      className="px-3 h-[36px] rounded-[8px] text-[12px] font-medium transition-all flex items-center gap-1.5"
                      style={{
                        backgroundColor: checked ? config.accent : config.hover,
                        color: checked ? config.accentText : config.textMuted,
                        border: `1px solid ${checked ? config.accent : config.surfaceBorder}`,
                      }}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                      {d}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] mt-1" style={{ color: config.textDim }}>Bir nechta daraja tanlanishi mumkin</p>
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

        {/* STATUS */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Holat (admin)</h2>
          <div>
            <label className={labelClass} style={labelStyle}>E&apos;lon holati</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={selectClass} style={selectStyle}>
              <option value="active">Aktiv</option>
              <option value="paused">To&apos;xtatilgan</option>
              <option value="pending">Tekshiruvda</option>
              <option value="rejected">Rad etilgan</option>
            </select>
          </div>
          {status === "rejected" && (
            <div>
              <label className={labelClass} style={labelStyle}>Rad etish sababi *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Rad etish sababini yozing..."
                className={textareaClass}
                style={inputStyle}
              />
            </div>
          )}
        </div>

        {/* KURS RASMI VA KO'RINISHI */}
        <div className="rounded-[16px] p-4 sm:p-5 space-y-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div>
            <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Kurs rasmi va ko&apos;rinishi</h2>
            <p className="text-[12px] mt-1" style={{ color: config.textMuted }}>Rasm va uning Desktop / Mobil qurilmalarda ko&apos;rinishi</p>
          </div>

          <div className="min-w-0">
            <label className={labelClass} style={labelStyle}>Rasm (ixtiyoriy)</label>
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

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 h-[50px] rounded-[12px] text-[15px] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: config.accent, color: config.accentText }}
          >
            <Save className="w-4 h-4" /> {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
          <Link href="/admode/listings" className="h-[50px] px-5 rounded-[12px] text-[15px] font-medium flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
            Bekor
          </Link>
        </div>
      </div>
    </div>
  );
}
