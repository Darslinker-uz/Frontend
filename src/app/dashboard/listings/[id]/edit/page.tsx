"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, GripVertical, X, Save } from "lucide-react";

const categoriyalar = ["IT & Dasturlash", "Dizayn", "Marketing", "Xorijiy tillar", "Biznes & Startap", "Akademik fanlar"];
const formatlar = ["Onlayn", "Oflayn", "Gibrid", "Video"];
const tillar = ["O'zbek", "Rus", "Ingliz"];
const darajalar = ["Boshlang'ich", "O'rta", "Ilg'or"];
const tolovTuri = ["Bir martalik", "Oylik"];

const inputClass = "w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all";
const selectClass = "w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white/70 focus:outline-none focus:border-[#7ea2d4]/40 transition-all appearance-none";
const textareaClass = "w-full px-4 py-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all resize-none";
const labelClass = "text-[12px] text-white/30 mb-1.5 block";

// Mock data — haqiqiy DB dan keladi
const mockListing = {
  title: "JavaScript & React Full-stack",
  category: "IT & Dasturlash",
  format: "Oflayn",
  price: "650,000",
  priceFree: false,
  duration: "6 oy",
  description: "Noldan boshlab JavaScript, React, Node.js va boshqa zamonaviy texnologiyalarni o'rganing.",
  location: "Toshkent, Chilonzor tumani",
  schedule: "Du-Ju, 14:00-16:00",
  language: "O'zbek",
  level: "Boshlang'ich",
  limit: 20,
  paymentType: "Oylik",
  teacher: "Najot Ta'lim",
  experience: "5+ yillik tajriba, Meta sertifikati",
  lessons: ["HTML/CSS asoslari", "JavaScript fundamentals", "React komponentlar", "Real loyiha"],
  certificate: "ha",
  demo: "ha",
  discount: "",
};

export default function EditListingPage() {
  const [isFree, setIsFree] = useState(mockListing.priceFree);
  const [format, setFormat] = useState(mockListing.format);
  const [lessons, setLessons] = useState<string[]>(mockListing.lessons);

  const showLocation = format === "Oflayn" || format === "Gibrid";
  const showSchedule = format !== "Video" && format !== "";

  const addLesson = () => setLessons([...lessons, ""]);
  const removeLesson = (i: number) => setLessons(lessons.filter((_, idx) => idx !== i));
  const updateLesson = (i: number, v: string) => setLessons(lessons.map((l, idx) => idx === i ? v : l));

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link href="/dashboard/listings" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold text-white mb-1">E&apos;lonni tahrirlash</h1>
      <p className="text-[14px] text-white/40 mb-6">O&apos;zgarishlardan so&apos;ng saqlashni unutmang</p>

      <div className="space-y-5">
        {/* ASOSIY */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 space-y-4">
          <h2 className="text-[15px] font-bold text-white">Asosiy ma&apos;lumotlar</h2>
          <div>
            <label className={labelClass}>Kurs nomi *</label>
            <input defaultValue={mockListing.title} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Kategoriya *</label>
            <select defaultValue={mockListing.category} className={selectClass}>
              <option value="">Tanlang</option>
              {categoriyalar.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Format *</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className={selectClass}>
                <option value="">Tanlang</option>
                {formatlar.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Narx *</label>
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setIsFree(false)} className={`flex-1 h-[36px] rounded-[8px] text-[13px] font-medium transition-all ${!isFree ? "bg-white text-[#16181a]" : "bg-white/[0.06] text-white/30"}`}>Pullik</button>
                <button onClick={() => setIsFree(true)} className={`flex-1 h-[36px] rounded-[8px] text-[13px] font-medium transition-all ${isFree ? "bg-white text-[#16181a]" : "bg-white/[0.06] text-white/30"}`}>Bepul</button>
              </div>
              {!isFree && <input defaultValue={mockListing.price} className={inputClass} />}
            </div>
          </div>
          <div>
            <label className={labelClass}>Davomiylik *</label>
            <input defaultValue={mockListing.duration} className={inputClass} />
          </div>
        </div>

        {/* QO'SHIMCHA */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 space-y-4">
          <h2 className="text-[15px] font-bold text-white">Qo&apos;shimcha</h2>
          <div>
            <label className={labelClass}>Kurs tavsifi</label>
            <textarea defaultValue={mockListing.description} className={textareaClass} rows={4} />
          </div>
          {showLocation && (
            <div>
              <label className={labelClass}>Manzil *</label>
              <input defaultValue={mockListing.location} className={inputClass} />
            </div>
          )}
          {showSchedule && (
            <div>
              <label className={labelClass}>Dars jadvali</label>
              <input defaultValue={mockListing.schedule} className={inputClass} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Til</label>
              <select defaultValue={mockListing.language} className={selectClass}>
                {tillar.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Daraja</label>
              <select defaultValue={mockListing.level} className={selectClass}>
                <option value="">Tanlang</option>
                {darajalar.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>O&apos;quvchilar limiti</label>
              <input type="number" defaultValue={mockListing.limit} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>To&apos;lov turi</label>
              <select defaultValue={mockListing.paymentType} className={selectClass}>
                {tolovTuri.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* O'QITUVCHI */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 space-y-4">
          <h2 className="text-[15px] font-bold text-white">O&apos;qituvchi haqida</h2>
          <div>
            <label className={labelClass}>Ism</label>
            <input defaultValue={mockListing.teacher} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tajriba</label>
            <textarea defaultValue={mockListing.experience} className={textareaClass} rows={3} />
          </div>
        </div>

        {/* OPSIYALAR */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 space-y-4">
          <h2 className="text-[15px] font-bold text-white">Opsiyalar</h2>
          <div>
            <label className={labelClass}>Dars rejasi</label>
            <div className="space-y-2">
              {lessons.map((lesson, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] focus-within:border-[#7ea2d4]/40 transition-all">
                    <GripVertical className="w-4 h-4 text-white/20 shrink-0 cursor-grab" />
                    <span className="text-[12px] text-white/30 font-medium shrink-0 min-w-[24px]">{i + 1}.</span>
                    <input type="text" value={lesson} onChange={(e) => updateLesson(i, e.target.value)} placeholder="Mavzu nomi..." className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/20 focus:outline-none" />
                  </div>
                  {lessons.length > 1 && (
                    <button type="button" onClick={() => removeLesson(i)} className="w-[44px] h-[44px] rounded-[10px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addLesson} className="w-full h-[40px] rounded-[10px] border border-dashed border-white/[0.12] text-white/40 text-[13px] font-medium hover:border-[#7ea2d4]/40 hover:text-[#7ea2d4] hover:bg-[#7ea2d4]/5 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Mavzu qo&apos;shish
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Sertifikat</label>
              <select defaultValue={mockListing.certificate} className={selectClass}>
                <option value="yoq">Yo&apos;q</option>
                <option value="ha">Ha, beriladi</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Demo dars</label>
              <select defaultValue={mockListing.demo} className={selectClass}>
                <option value="yoq">Yo&apos;q</option>
                <option value="ha">Ha, bor</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Chegirma / aksiya</label>
            <input defaultValue={mockListing.discount} placeholder="Birinchi oy 50% chegirma" className={inputClass} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button className="flex-1 h-[50px] rounded-[12px] bg-white text-[#16181a] text-[15px] font-medium hover:bg-[#6b91c3] transition-colors flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Saqlash
          </button>
          <Link href="/dashboard/listings" className="h-[50px] px-5 rounded-[12px] bg-white/[0.06] text-white/60 text-[15px] font-medium hover:bg-white/[0.1] transition-colors flex items-center justify-center">
            Bekor
          </Link>
        </div>
      </div>
    </div>
  );
}
