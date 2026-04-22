"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, GripVertical, X, Check, Star, ArrowRight } from "lucide-react";
import { GRADIENT_OPTIONS, ICON_OPTIONS } from "@/data/courses";
import { useAdminTheme } from "@/context/admin-theme-context";

const categoriyalar = ["IT & Dasturlash", "Dizayn", "Marketing", "Xorijiy tillar", "Biznes & Startap", "Akademik fanlar"];
const formatlar = ["Onlayn", "Oflayn", "Gibrid", "Video"];

export default function AdminNewListingPage() {
  const { config } = useAdminTheme();
  const [isFree, setIsFree] = useState(false);
  const [format, setFormat] = useState("");
  const [lessons, setLessons] = useState<string[]>([""]);
  const [gradient, setGradient] = useState(GRADIENT_OPTIONS[0]);
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [provider, setProvider] = useState("");

  const addLesson = () => setLessons([...lessons, ""]);
  const removeLesson = (i: number) => setLessons(lessons.filter((_, idx) => idx !== i));
  const updateLesson = (i: number, v: string) => setLessons(lessons.map((l, idx) => idx === i ? v : l));

  const showLocation = format === "Oflayn" || format === "Gibrid";

  const inputStyle = {
    backgroundColor: config.hover,
    border: `1px solid ${config.surfaceBorder}`,
    color: config.text,
  };
  const labelStyle = { color: config.textMuted };
  const sectionStyle = {
    backgroundColor: config.surface,
    border: `1px solid ${config.surfaceBorder}`,
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link
        href="/admin/listings"
        className="inline-flex items-center gap-2 text-[13px] font-medium mb-6"
        style={{ color: config.accent }}
      >
        <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold mb-1" style={{ color: config.text }}>Yangi e&apos;lon (admin)</h1>
      <p className="text-[14px] mb-6" style={{ color: config.textMuted }}>Admin tomonidan yaratilgan e&apos;lon avtomatik aktivlashadi</p>

      <div className="space-y-5">
        {/* ASOSIY */}
        <div className="rounded-[16px] p-5 space-y-4" style={sectionStyle}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Asosiy ma&apos;lumotlar</h2>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Kurs nomi *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: JavaScript Full-stack bootcamp" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Kurs egasi / markaz *</label>
            <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Masalan: Najot Ta'lim" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Kategoriya *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-[44px] px-3 rounded-[10px] text-[14px] focus:outline-none appearance-none" style={inputStyle}>
              <option value="">Tanlang</option>
              {categoriyalar.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Format *</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full h-[44px] px-3 rounded-[10px] text-[14px] focus:outline-none appearance-none" style={inputStyle}>
                <option value="">Tanlang</option>
                {formatlar.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Narx *</label>
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setIsFree(false)} className="flex-1 h-[36px] rounded-[8px] text-[13px] font-medium" style={{ backgroundColor: !isFree ? config.accent : config.hover, color: !isFree ? config.accentText : config.textDim }}>Pullik</button>
                <button onClick={() => setIsFree(true)} className="flex-1 h-[36px] rounded-[8px] text-[13px] font-medium" style={{ backgroundColor: isFree ? config.accent : config.hover, color: isFree ? config.accentText : config.textDim }}>Bepul</button>
              </div>
              {!isFree && <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="650,000 so'm" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />}
            </div>
          </div>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Davomiylik *</label>
            <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Masalan: 6 oy" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />
          </div>
          {showLocation && (
            <div>
              <label className="text-[12px] mb-1.5 block" style={labelStyle}>Manzil *</label>
              <input placeholder="Toshkent, Chilonzor tumani..." className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none" style={inputStyle} />
            </div>
          )}
        </div>

        {/* KO'RINISH — RANG VA IKON */}
        <div className="rounded-[16px] p-5 space-y-4" style={sectionStyle}>
          <div>
            <h2 className="text-[15px] font-bold" style={{ color: config.text }}>E&apos;lon ko&apos;rinishi</h2>
            <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>Kurs cardining rangi va ikoni</p>
          </div>

          {/* Preview */}
          <div className={`relative overflow-hidden rounded-[18px] bg-gradient-to-br ${gradient.value} p-5`}>
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
            <svg className="absolute right-4 top-1/3 w-[60px] h-[60px] text-white/[0.08]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={icon.path} />
            </svg>
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">{category || "Kategoriya"}</span>
                {format && <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-[11px]">{format}</span>}
              </div>
              <h3 className="text-[17px] font-bold text-white leading-tight min-h-[44px]">{title || "Kurs nomi"}</h3>
              <p className="text-[12px] text-white/35 mt-1">{provider || "Kurs egasi"}</p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-white/30">
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-white/50 text-white/50" />5.0</span>
                <span>{duration || "Davomiylik"}</span>
              </div>
              <div className="mt-4 rounded-[12px] bg-white/[0.1] border border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
                <span className="text-[14px] font-bold text-white">{isFree ? "Bepul" : price ? `${price} so'm` : "Narx"}</span>
                <ArrowRight className="w-4 h-4 text-white/30" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Rang</label>
            <div className="grid grid-cols-5 gap-2">
              {GRADIENT_OPTIONS.map((g) => {
                const isActive = gradient.id === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGradient(g)}
                    title={g.label}
                    className={`relative h-[44px] rounded-[10px] bg-gradient-to-br ${g.value}`}
                    style={{
                      boxShadow: isActive ? `0 0 0 2px ${config.bg}, 0 0 0 4px ${config.accent}` : "none",
                    }}
                  >
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
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setIcon(ic)}
                    title={ic.label}
                    className="h-[44px] rounded-[10px] flex items-center justify-center"
                    style={{
                      backgroundColor: isActive ? config.active : config.hover,
                      border: `1px solid ${isActive ? config.accent : config.surfaceBorder}`,
                    }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isActive ? config.text : config.textMuted }}>
                      <path d={ic.path} />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TAVSIF VA DARS REJASI */}
        <div className="rounded-[16px] p-5 space-y-4" style={sectionStyle}>
          <h2 className="text-[15px] font-bold" style={{ color: config.text }}>Kurs haqida</h2>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Tavsif</label>
            <textarea rows={4} placeholder="Kurs haqida qisqacha ma'lumot..." className="w-full p-3 rounded-[10px] text-[14px] focus:outline-none resize-none" style={inputStyle} />
          </div>
          <div>
            <label className="text-[12px] mb-1.5 block" style={labelStyle}>Dars rejasi</label>
            <div className="space-y-2">
              {lessons.map((lesson, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 h-[44px] px-3 rounded-[10px]" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}>
                    <GripVertical className="w-4 h-4 shrink-0 cursor-grab" style={{ color: config.textDim }} />
                    <span className="text-[12px] font-medium shrink-0 min-w-[24px]" style={{ color: config.textDim }}>{i + 1}.</span>
                    <input value={lesson} onChange={(e) => updateLesson(i, e.target.value)} placeholder={i === 0 ? "Masalan: HTML/CSS asoslari" : "Mavzu..."} className="flex-1 bg-transparent text-[14px] focus:outline-none" style={{ color: config.text }} />
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

        <button className="w-full h-[50px] rounded-[12px] text-[16px] font-medium" style={{ backgroundColor: config.accent, color: config.accentText }}>
          E&apos;lonni yaratish
        </button>
      </div>
    </div>
  );
}
