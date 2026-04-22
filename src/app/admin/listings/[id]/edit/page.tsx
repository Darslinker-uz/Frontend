"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, GripVertical, X, Check, Star, ArrowRight, Eye, Save } from "lucide-react";
import { GRADIENT_OPTIONS, ICON_OPTIONS } from "@/data/courses";
import { useAdminTheme } from "@/context/admin-theme-context";

const categoriyalar = ["IT & Dasturlash", "Dizayn", "Marketing", "Xorijiy tillar", "Biznes & Startap", "Akademik fanlar"];
const formatlar = ["Onlayn", "Oflayn", "Gibrid", "Video"];

// Mock e'lon — haqiqiy DB dan keladi
const MOCK = {
  title: "Python & Django Full-stack bootcamp",
  category: "IT & Dasturlash",
  format: "Bootcamp",
  provider: "IT Park Academy",
  price: "850,000",
  priceFree: false,
  duration: "4 oy",
  location: "Chilonzor, Toshkent",
  description: "Python, Django, PostgreSQL, REST API va frontend asoslarini o'rganasiz.",
  lessons: ["Python asoslari", "Django framework", "Database va ORM", "REST API", "Deploy va production"],
  status: "tekshiruvda",
};

export default function AdminEditListingPage() {
  const { config } = useAdminTheme();
  const [isFree, setIsFree] = useState(MOCK.priceFree);
  const [format, setFormat] = useState(MOCK.format);
  const [lessons, setLessons] = useState<string[]>(MOCK.lessons);
  const [gradient, setGradient] = useState(GRADIENT_OPTIONS[0]);
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [title, setTitle] = useState(MOCK.title);
  const [category, setCategory] = useState(MOCK.category);
  const [price, setPrice] = useState(MOCK.price);
  const [duration, setDuration] = useState(MOCK.duration);
  const [provider, setProvider] = useState(MOCK.provider);
  const [description, setDescription] = useState(MOCK.description);

  const addLesson = () => setLessons([...lessons, ""]);
  const removeLesson = (i: number) => setLessons(lessons.filter((_, idx) => idx !== i));
  const updateLesson = (i: number, v: string) => setLessons(lessons.map((l, idx) => idx === i ? v : l));

  const showLocation = format === "Oflayn" || format === "Gibrid" || MOCK.format === "Bootcamp";

  const inputStyle = { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text };
  const labelStyle = { color: config.textMuted };
  const sectionStyle = { backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link href="/admin/listings" className="inline-flex items-center gap-2 text-[13px] font-medium mb-6" style={{ color: config.accent }}>
        <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
      </Link>

      <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>E&apos;lonni tahrirlash</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-[22px] px-2.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: "#f59e0b22", color: "#f59e0b" }}>
              Tekshiruvda
            </span>
            <span className="text-[13px]" style={{ color: config.textMuted }}>{provider}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2" style={{ backgroundColor: "#22c55e", color: "#ffffff" }}>
            <Check className="w-4 h-4" /> Saqlash va tasdiqlash
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* CHAP — tahrirlash */}
        <div className="space-y-5">
          <div className="rounded-[16px] p-5 space-y-4" style={sectionStyle}>
            <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Asosiy ma&apos;lumotlar</h2>
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Kurs nomi</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Kurs egasi</label>
              <input value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Kategoriya</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-[44px] px-3 rounded-[10px] text-[14px] focus:outline-none appearance-none" style={inputStyle}>
                {categoriyalar.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
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
              {!isFree && <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />}
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Tavsif</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-3 rounded-[10px] text-[14px] focus:outline-none resize-none" style={inputStyle} />
            </div>
          </div>

          <div className="rounded-[16px] p-5 space-y-3" style={sectionStyle}>
            <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Rang va ikon</h2>
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Rang</label>
              <div className="grid grid-cols-5 gap-2">
                {GRADIENT_OPTIONS.map((g) => {
                  const isActive = gradient.id === g.id;
                  return (
                    <button key={g.id} type="button" onClick={() => setGradient(g)} title={g.label} className={`relative h-[40px] rounded-[10px] bg-gradient-to-br ${g.value}`} style={{ boxShadow: isActive ? `0 0 0 2px ${config.bg}, 0 0 0 4px ${config.accent}` : "none" }}>
                      {isActive && <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" />}
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
                    <button key={ic.id} type="button" onClick={() => setIcon(ic)} title={ic.label} className="h-[40px] rounded-[10px] flex items-center justify-center" style={{ backgroundColor: isActive ? config.active : config.hover, border: `1px solid ${isActive ? config.accent : config.surfaceBorder}` }}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isActive ? config.text : config.textMuted }}>
                        <path d={ic.path} />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[16px] p-5 space-y-3" style={sectionStyle}>
            <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Dars rejasi</h2>
            <div className="space-y-2">
              {lessons.map((lesson, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 h-[44px] px-3 rounded-[10px]" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}>
                    <GripVertical className="w-4 h-4 shrink-0 cursor-grab" style={{ color: config.textDim }} />
                    <span className="text-[12px] font-medium shrink-0 min-w-[24px]" style={{ color: config.textDim }}>{i + 1}.</span>
                    <input value={lesson} onChange={(e) => updateLesson(i, e.target.value)} className="flex-1 bg-transparent text-[14px] focus:outline-none" style={{ color: config.text }} />
                  </div>
                  {lessons.length > 1 && (
                    <button type="button" onClick={() => removeLesson(i)} className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textDim }}>
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addLesson} className="w-full h-[40px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2" style={{ border: `1px dashed ${config.surfaceBorder}`, color: config.textDim }}>
                <Plus className="w-4 h-4" /> Mavzu qo&apos;shish
              </button>
            </div>
          </div>
        </div>

        {/* O'NG — PREVIEW (sticky) */}
        <div>
          <div className="lg:sticky lg:top-6 space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" style={{ color: config.textMuted }} />
              <p className="text-[13px] font-semibold" style={{ color: config.textMuted }}>Oldindan ko&apos;rish</p>
            </div>

            {/* Preview card — aynan shunday sayt ga chiqadi */}
            <div className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br ${gradient.value} p-6`}>
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
              <svg className="absolute right-6 top-1/3 w-[80px] h-[80px] text-white/[0.08]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={icon.path} />
              </svg>
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold">{category || "Kategoriya"}</span>
                  {format && <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-[11px]">{format}</span>}
                </div>
                <h3 className="text-[22px] font-bold text-white leading-tight">{title || "Kurs nomi"}</h3>
                <p className="text-[13px] text-white/50 mt-1">{provider || "Kurs egasi"}</p>
                {description && <p className="text-[12px] text-white/40 mt-2 line-clamp-2">{description}</p>}
                <div className="flex items-center gap-3 mt-3 text-[12px] text-white/30">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-white/50 text-white/50" />5.0</span>
                  <span>{duration || "Davomiylik"}</span>
                </div>
                <div className="mt-5 rounded-[12px] bg-white/[0.1] border border-white/[0.08] px-4 py-3 flex items-center justify-between">
                  <span className="text-[15px] font-bold text-white">{isFree ? "Bepul" : price ? `${price} so'm` : "Narx"}</span>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </div>
              </div>
            </div>

            {lessons.length > 0 && lessons[0] && (
              <div className="rounded-[14px] p-4" style={sectionStyle}>
                <p className="text-[12px] font-semibold mb-2" style={{ color: config.textMuted }}>Dars rejasi</p>
                <div className="space-y-1.5">
                  {lessons.filter(l => l.trim()).map((l, i) => (
                    <div key={i} className="flex items-center gap-2 text-[13px]" style={{ color: config.text }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ backgroundColor: config.hover, color: config.textMuted }}>{i + 1}</span>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2" style={{ backgroundColor: "#22c55e", color: "#ffffff" }}>
                <Check className="w-4 h-4" /> Saqlash va tasdiqlash
              </button>
              <button className="h-[44px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
