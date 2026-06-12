"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertCircle, Wifi, MapPin, User as UserIcon, GraduationCap, Clock, Sparkles } from "lucide-react";
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

const inputClass = "w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all";
const selectClass = "w-full h-[44px] px-3 rounded-[10px] text-[14px] focus:outline-none focus:border-[#7ea2d4]/40 transition-all appearance-none";
const textareaClass = "w-full px-4 py-3 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all resize-none";
const labelClass = "text-[12px] mb-1.5 block";

// Format'lar — repetitor uchun cheklangan
const FORMATS = [
  { value: "Onlayn", label: "Onlayn", icon: Wifi, desc: "Video qo'ng'iroq orqali" },
  { value: "Oflayn", label: "Yuzma-yuz", icon: MapPin, desc: "Uy darsi yoki tayinlangan joy" },
  { value: "Gibrid", label: "Aralash", icon: Sparkles, desc: "Onlayn + yuzma-yuz" },
];

const FORMAT_TYPES = [
  { value: "individual", label: "1-on-1 individual" },
  { value: "small_group", label: "Kichik guruh (2-5 ta)" },
];

const LEVELS = [
  "1-4 sinflar",
  "5-9 sinflar",
  "10-11 sinflar",
  "DTM tayyorlov",
  "IELTS / CEFR / TOEFL",
  "Olimpiada",
  "Boshlang'ich (kattalar)",
  "O'rta (kattalar)",
  "Yuqori daraja (kattalar)",
];

interface Props {
  providerName: string;
}

export function TutorServiceForm({ providerName }: Props) {
  const { config } = useDashboardTheme();
  const router = useRouter();
  const inputStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text };
  const selectStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.textMuted };
  const labelStyle = { color: config.textDim };

  const [title, setTitle] = useState("");
  const [taxonomy, setTaxonomy] = useState<TaxonomyGroup[]>([]);
  const [groupId, setGroupId] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [requestNewCategory, setRequestNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [format, setFormat] = useState("Onlayn");
  const [formatType, setFormatType] = useState("individual");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");

  const [experienceYears, setExperienceYears] = useState<number | "">("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  const [price, setPrice] = useState(0);
  const [pricePeriod, setPricePeriod] = useState("soat"); // soat | dars | oy
  const [schedule, setSchedule] = useState("");

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.ok ? r.json() : { groups: [] })
      .then((data: { groups?: TaxonomyGroup[] }) => setTaxonomy(data.groups ?? []))
      .catch(() => {});
  }, []);

  const currentGroup = taxonomy.find((g) => g.id === groupId);

  function toggleLevel(level: string) {
    setSelectedLevels((prev) => prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]);
  }

  async function handleSubmit() {
    setError("");
    if (!title.trim() || title.length < 5) { setError("Xizmat nomini to'liq kiriting (kamida 5 belgi)"); return; }
    if (!requestNewCategory && !categoryId) { setError("Fanni tanlang"); return; }
    if (requestNewCategory && (!groupId || !newCategoryName.trim())) { setError("Yangi fan uchun yo'nalish va nomni kiriting"); return; }
    if (price === 0) { setError("Narxni kiriting"); return; }
    if (!description.trim() || description.length < 50) { setError("Tavsifni to'liqroq yozing (kamida 50 belgi)"); return; }
    if (format !== "Onlayn" && !region) { setError("Hudud va shaharni tanlang"); return; }

    setSubmitting(true);
    try {
      // Location string — yuzma-yuz format'da region + district
      const location = format !== "Onlayn" && region
        ? [district, region].filter(Boolean).join(" · ")
        : (format === "Onlayn" ? "Onlayn" : null);
      const branches = format !== "Onlayn" && region
        ? [{ region, district: district || null, address: null, price: null }]
        : [];

      const res = await fetch("/api/dashboard/listings", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "TUTOR", // ← MUHIM: listingType = TUTOR_SERVICE bo'lishi uchun
          title,
          categoryId: requestNewCategory ? null : (categoryId || null),
          proposedCategoryName: requestNewCategory ? newCategoryName.trim() : undefined,
          proposedGroupId: requestNewCategory ? Number(groupId) : undefined,
          region: format !== "Onlayn" ? region : null,
          district: format !== "Onlayn" ? (district || null) : null,
          branches,
          format,
          price,
          priceFree: false,
          duration: pricePeriod === "soat" ? "1 soat" : pricePeriod === "dars" ? "1 dars" : "1 oy",
          location,
          description,
          imageUrl,
          // Repetitor uchun maxsus fieldlar (mavjud schema'da bor)
          teacherName: providerName,
          teacherExperience: experienceYears ? `${experienceYears} yil tajriba` : null,
          levels: selectedLevels,
          paymentType: pricePeriod === "oy" ? "Oylik" : "Bir martalik",
          schedule: schedule.trim() || null,
          studentLimit: formatType === "individual" ? 1 : 5,
          // Markazga xos field'lar — repetitor uchun kerak emas
          certificate: false,
          demoLesson: false,
          lessons: [],
          languages: ["uz"],
          language: "uz",
          phoneShown: false,
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
  }

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-32 md:pb-8 max-w-[840px]">
      {/* Header */}
      <div className="mb-6">
        <Link href="/center/listings" className="inline-flex items-center gap-1.5 text-[13px] mb-3" style={{ color: config.textMuted }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Orqaga
        </Link>
        <h1 className="text-[22px] md:text-[26px] font-bold flex items-center gap-2" style={{ color: config.text }}>
          <GraduationCap className="w-6 h-6 text-fuchsia-600" />
          Yangi repetitor xizmati
        </h1>
        <p className="text-[14px] mt-1" style={{ color: config.textMuted }}>
          O&apos;qituvchi sifatida o&apos;quvchilarga taklif qiladigan dars yoki xizmatingiz
        </p>
      </div>

      {/* SECTION 1 — Asosiy ma'lumot */}
      <section className="rounded-[16px] p-5 md:p-6 mb-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <h2 className="text-[14px] font-bold mb-4 flex items-center gap-2" style={{ color: config.text }}>
          <span className="w-6 h-6 rounded-full bg-fuchsia-100 text-fuchsia-700 text-[11px] font-bold flex items-center justify-center">1</span>
          Asosiy ma&apos;lumot
        </h2>

        <div className="space-y-4">
          <div>
            <label className={labelClass} style={labelStyle}>Xizmat nomi *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              placeholder="Masalan: Matematika DTM tayyorlov · 9-11 sinflar"
              className={inputClass}
              style={inputStyle}
            />
            <p className="text-[11px] mt-1" style={{ color: config.textDim }}>{title.length}/100</p>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Fan / Yo&apos;nalish *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <select
                value={groupId}
                onChange={(e) => {
                  setGroupId(Number(e.target.value) || "");
                  setCategoryId("");
                  setRequestNewCategory(false);
                }}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">Guruhni tanlang</option>
                {taxonomy.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <select
                value={requestNewCategory ? "__new__" : categoryId}
                onChange={(e) => {
                  if (e.target.value === "__new__") {
                    setRequestNewCategory(true);
                    setCategoryId("");
                  } else {
                    setRequestNewCategory(false);
                    setCategoryId(Number(e.target.value) || "");
                  }
                }}
                disabled={!currentGroup}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">Fanni tanlang</option>
                {currentGroup?.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                {currentGroup && <option value="__new__">+ Boshqa (qo&apos;lda yozish)</option>}
              </select>
            </div>
            {requestNewCategory && (
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value.slice(0, 60))}
                placeholder="Yangi fan nomi (admin tomonidan ko'rib chiqiladi)"
                className={`${inputClass} mt-2`}
                style={inputStyle}
              />
            )}
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Tavsif *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
              placeholder="Masalan: Real DTM testlari, har hafta progress tekshiruvi, individual yondashuv. 8 yil tajriba, 200+ tayyorlangan o'quvchi..."
              rows={5}
              className={textareaClass}
              style={inputStyle}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px]" style={{ color: config.textDim }}>SEO/AEO uchun muhim — aniq yozing</p>
              <p className="text-[11px]" style={{ color: config.textDim }}>{description.length}/2000</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Format va joy */}
      <section className="rounded-[16px] p-5 md:p-6 mb-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <h2 className="text-[14px] font-bold mb-4 flex items-center gap-2" style={{ color: config.text }}>
          <span className="w-6 h-6 rounded-full bg-fuchsia-100 text-fuchsia-700 text-[11px] font-bold flex items-center justify-center">2</span>
          Format va joy
        </h2>

        <div className="space-y-4">
          <div>
            <label className={labelClass} style={labelStyle}>Dars formati *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                const active = format === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFormat(f.value)}
                    className="flex items-start gap-3 p-3 rounded-[12px] text-left transition-colors"
                    style={{
                      backgroundColor: active ? "#a855f7" + "20" : config.hover,
                      border: active ? "1px solid #a855f7" : `1px solid ${config.surfaceBorder}`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: active ? "#a855f7" : config.surfaceBorder, color: active ? "white" : config.textMuted }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold" style={{ color: config.text }}>{f.label}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: config.textMuted }}>{f.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>O&apos;quvchilar soni *</label>
            <div className="grid grid-cols-2 gap-2">
              {FORMAT_TYPES.map((ft) => {
                const active = formatType === ft.value;
                return (
                  <button
                    key={ft.value}
                    type="button"
                    onClick={() => setFormatType(ft.value)}
                    className="p-3 rounded-[10px] text-[13px] font-medium transition-colors"
                    style={{
                      backgroundColor: active ? "#a855f7" + "20" : config.hover,
                      border: active ? "1px solid #a855f7" : `1px solid ${config.surfaceBorder}`,
                      color: config.text,
                    }}
                  >
                    {ft.label}
                  </button>
                );
              })}
            </div>
          </div>

          {format !== "Onlayn" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className={labelClass} style={labelStyle}>Viloyat *</label>
                <select value={region} onChange={(e) => { setRegion(e.target.value); setDistrict(""); }} className={selectClass} style={selectStyle}>
                  <option value="">Tanlang</option>
                  {REGIONS.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>{region === "Toshkent shahri" ? "Tuman" : "Shahar"}</label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!region} className={selectClass} style={selectStyle}>
                  <option value="">Tanlang</option>
                  {REGIONS.find((r) => r.name === region)?.districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3 — Tajriba va darajalar */}
      <section className="rounded-[16px] p-5 md:p-6 mb-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <h2 className="text-[14px] font-bold mb-4 flex items-center gap-2" style={{ color: config.text }}>
          <span className="w-6 h-6 rounded-full bg-fuchsia-100 text-fuchsia-700 text-[11px] font-bold flex items-center justify-center">3</span>
          Tajriba va kim uchun
        </h2>

        <div className="space-y-4">
          <div>
            <label className={labelClass} style={labelStyle}>Sizning tajribangiz (yil)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value ? Math.min(50, Math.max(0, Number(e.target.value))) : "")}
                placeholder="8"
                min={0}
                max={50}
                className="h-[44px] w-32 px-4 rounded-[10px] text-[15px] text-center"
                style={inputStyle}
              />
              <span className="text-[13px]" style={{ color: config.textMuted }}>yil tajribali repetitor</span>
            </div>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Darajalar (kim uchun mos) *</label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((level) => {
                const active = selectedLevels.includes(level);
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleLevel(level)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors"
                    style={{
                      backgroundColor: active ? "#a855f7" + "20" : config.hover,
                      border: active ? "1px solid #a855f7" : `1px solid ${config.surfaceBorder}`,
                      color: active ? "#a855f7" : config.textMuted,
                    }}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] mt-1" style={{ color: config.textDim }}>Bittadan ko&apos;p tanlash mumkin</p>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Dars jadvali (ixtiyoriy)</label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value.slice(0, 100))}
              placeholder="Masalan: Du-Pa-Ju 17:00-19:00 yoki o'quvchi tanlovi"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>
      </section>

      {/* SECTION 4 — Narx */}
      <section className="rounded-[16px] p-5 md:p-6 mb-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <h2 className="text-[14px] font-bold mb-4 flex items-center gap-2" style={{ color: config.text }}>
          <span className="w-6 h-6 rounded-full bg-fuchsia-100 text-fuchsia-700 text-[11px] font-bold flex items-center justify-center">4</span>
          Narx
        </h2>

        <div className="space-y-4">
          <div>
            <label className={labelClass} style={labelStyle}>Hisob-kitob davri</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "soat", label: "1 soat", icon: Clock },
                { value: "dars", label: "1 dars", icon: GraduationCap },
                { value: "oy", label: "Oylik", icon: UserIcon },
              ].map((p) => {
                const Icon = p.icon;
                const active = pricePeriod === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPricePeriod(p.value)}
                    className="flex flex-col items-center gap-1 p-3 rounded-[10px] text-[12px] font-medium transition-colors"
                    style={{
                      backgroundColor: active ? "#a855f7" + "20" : config.hover,
                      border: active ? "1px solid #a855f7" : `1px solid ${config.surfaceBorder}`,
                      color: config.text,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Narx *</label>
            <PriceScroll
              value={price}
              onChange={setPrice}
              bg={config.hover}
              border={config.surfaceBorder}
              text={config.text}
              textMuted={config.textMuted}
              accent="#a855f7"
            />
            <p className="text-[11px] mt-1" style={{ color: config.textDim }}>
              {price > 0 ? `${new Intl.NumberFormat("uz-UZ").format(price)} so'm / ${pricePeriod === "soat" ? "soat" : pricePeriod === "dars" ? "dars" : "oy"}` : "Narxni belgilang"}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Sizning suratingiz */}
      <section className="rounded-[16px] p-5 md:p-6 mb-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <h2 className="text-[14px] font-bold mb-4 flex items-center gap-2" style={{ color: config.text }}>
          <span className="w-6 h-6 rounded-full bg-fuchsia-100 text-fuchsia-700 text-[11px] font-bold flex items-center justify-center">5</span>
          Suratingiz (ixtiyoriy, lekin tavsiya etiladi)
        </h2>
        <p className="text-[12px] mb-3" style={{ color: config.textMuted }}>
          Yumaloq portrate format. Foydalanuvchilar repetitorni tanish uchun yuzingizni ko&apos;rishi muhim.
        </p>
        <ImageUpload value={imageUrl} onChange={setImageUrl} />
      </section>

      {/* Submit */}
      {error && (
        <div className="flex items-start gap-2 text-[12px] mb-3 px-4 py-3 rounded-[10px]" style={{ backgroundColor: "#ef444420", color: "#ef4444" }}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
        </div>
      )}

      <div className="flex gap-2">
        <Link href="/center/listings" className="flex-1 h-[48px] rounded-[10px] flex items-center justify-center text-[14px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>
          Bekor
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 h-[48px] rounded-[10px] flex items-center justify-center gap-2 text-[14px] font-bold text-white transition-colors disabled:opacity-60"
          style={{ backgroundColor: "#a855f7" }}
        >
          {submitting ? "Saqlanmoqda..." : <>Saqlash <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}
