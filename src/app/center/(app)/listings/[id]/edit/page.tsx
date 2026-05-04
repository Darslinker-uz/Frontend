"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle, Monitor, Smartphone, Plus, X, GripVertical, Check } from "lucide-react";
import { useDashboardTheme } from "@/context/dashboard-theme-context";
import { ImageUpload } from "@/components/image-upload";
import { PriceScroll } from "@/components/price-scroll";
import { REGIONS } from "@/data/regions";

const FORMAT_TO_UI: Record<string, string> = { offline: "Oflayn", online: "Onlayn", video: "Video", hybrid: "Gibrid" };
const UI_TO_FORMAT: Record<string, "offline" | "online" | "video" | "hybrid"> = {
  Oflayn: "offline",
  Gibrid: "hybrid",
  Onlayn: "online",
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
  imageDarkness?: number;
  status: "pending" | "active" | "paused" | "rejected";
  category: { id: number; name: string; slug: string; group?: { id: number; name: string; slug: string } | null };
  language: string;
  languages?: string[];
  level: string | null;
  levels?: string[];
  branches?: { region: string | null; district: string | null; address: string | null; price?: number | null; sortOrder: number }[];
  studentLimit: number | null;
  paymentType: string | null;
  schedule: string | null;
  teacherName: string | null;
  teacherExperience: string | null;
  certificate: boolean;
  demoLesson: boolean;
  discount: string | null;
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
  const [taxonomy, setTaxonomy] = useState<TaxonomyGroup[]>([]);
  const [groupId, setGroupId] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [format, setFormat] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [branches, setBranches] = useState<{ region: string; district: string; address: string; price: number | null }[]>([
    { region: "", district: "", address: "", price: null },
  ]);
  const region = branches[0]?.region ?? "";
  const city = branches[0]?.district ?? "";
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
  const [imageDarkness, setImageDarkness] = useState(15);
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/dashboard/listings/${listingId}`, { cache: "no-store", credentials: "same-origin" });
        if (res.status === 404) { if (!cancelled) setNotFound(true); return; }
        const data: { listing: ApiListing } = await res.json();
        if (cancelled) return;
        const l = data.listing;
        setTitle(l.title);
        setGroupId(l.category.group?.id ?? "");
        setCategoryId(l.category.id ?? "");
        setFormat(FORMAT_TO_UI[l.format] ?? "Onlayn");
        setIsFree(l.price === 0);
        setPrice(l.price);
        setDuration(l.duration ?? "");
        setDescription(l.description ?? "");
        if (l.branches && l.branches.length > 0) {
          setBranches(l.branches.map(b => ({
            region: b.region ?? "",
            district: b.district ?? "",
            address: b.address ?? "",
            price: b.price ?? null,
          })));
        } else if (l.region || l.district || l.location) {
          setBranches([{
            region: l.region ?? "",
            district: l.district ?? "",
            address: l.location ?? "",
            price: null,
          }]);
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
        setImageDarkness(l.imageDarkness ?? 15);
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
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
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

    setSaving(true);
    try {
      const filledBranches = showLocation
        ? branches.filter(b => b.region || b.district || b.address)
        : [];
      const firstBranch = filledBranches[0];
      const location = firstBranch
        ? [firstBranch.address, firstBranch.district, firstBranch.region].filter(Boolean).join(" · ")
        : null;
      const res = await fetch(`/api/dashboard/listings/${listingId}`, {
        method: "PATCH",
        credentials: "same-origin",
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
            price: b.price,
          })),
          format: UI_TO_FORMAT[format],
          price: isFree ? 0 : price,
          duration,
          description,
          location,
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
          imageDarkness,
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
      router.push("/center/listings");
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
        <Link href="/center/listings" className="text-[13px] text-[#7ea2d4]">Orqaga qaytish</Link>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link href="/center/listings" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6">
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
                  <input
                    type="text"
                    inputMode="numeric"
                    value={br.price ? new Intl.NumberFormat("uz-UZ").format(br.price).replace(/\s/g, ",") : ""}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      const next = [...branches];
                      next[i] = { ...next[i], price: raw ? Math.min(100_000_000, Number(raw)) : null };
                      setBranches(next);
                    }}
                    placeholder="Filial uchun maxsus narx (ixtiyoriy) — bo'sh qoldirsa asosiy narx"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              ))}
              {branches.length < 10 && (
                <button
                  type="button"
                  onClick={() => setBranches([...branches, { region: "", district: "", address: "", price: null }])}
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
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px]" style={labelStyle}>Qoraytirish (matn ko&apos;rinishi uchun)</label>
                        <span className="text-[11px]" style={{ color: config.textDim }}>{imageDarkness}%</span>
                      </div>
                      <input type="range" min={0} max={50} value={imageDarkness} onChange={(e) => setImageDarkness(Number(e.target.value))} className="w-full accent-[#7ea2d4]" />
                      <p className="text-[10px] mt-1" style={{ color: config.textDim }}>Yorug&apos; rasmlarda 15-25%, qora rasmlarda 0-10% tavsiya etiladi</p>
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
          <Link href="/center/listings" className="h-[50px] px-5 rounded-[12px] text-[15px] font-medium flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
            Bekor
          </Link>
        </div>
      </div>
    </div>
  );
}
