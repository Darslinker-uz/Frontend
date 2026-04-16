"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const categoriyalar = ["IT & Dasturlash", "Dizayn", "Marketing", "Xorijiy tillar", "Biznes & Startap", "Akademik fanlar"];
const formatlar = ["Onlayn", "Oflayn", "Gibrid", "Video"];
const tillar = ["O'zbek", "Rus", "Ingliz"];
const darajalar = ["Boshlang'ich", "O'rta", "Ilg'or"];
const tolovTuri = ["Bir martalik", "Oylik"];

const inputClass = "w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all";
const selectClass = "w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white/70 focus:outline-none focus:border-[#7ea2d4]/40 transition-all appearance-none";
const textareaClass = "w-full px-4 py-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40 transition-all resize-none";
const labelClass = "text-[12px] text-white/30 mb-1.5 block";

export default function NewListingPage() {
  const [isFree, setIsFree] = useState(false);
  const [format, setFormat] = useState("");

  const showLocation = format === "Oflayn" || format === "Gibrid";
  const showSchedule = format !== "Video" && format !== "";

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8 max-w-[700px] mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold text-white mb-1">Yangi e&apos;lon</h1>
      <p className="text-[14px] text-white/40 mb-6">* belgilangan maydonlar majburiy</p>

      <div className="space-y-5">
        {/* ASOSIY */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 space-y-4">
          <h2 className="text-[15px] font-bold text-white">Asosiy ma&apos;lumotlar</h2>
          <div>
            <label className={labelClass}>Kurs nomi *</label>
            <input placeholder="Masalan: JavaScript Full-stack bootcamp" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Kategoriya *</label>
            <select className={selectClass}>
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
              {/* Bepul/Pullik toggle */}
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setIsFree(false)} className={`flex-1 h-[36px] rounded-[8px] text-[13px] font-medium transition-all ${!isFree ? "bg-[#7ea2d4] text-white" : "bg-white/[0.06] text-white/30 hover:text-white/50"}`}>
                  Pullik
                </button>
                <button onClick={() => setIsFree(true)} className={`flex-1 h-[36px] rounded-[8px] text-[13px] font-medium transition-all ${isFree ? "bg-[#7ea2d4] text-white" : "bg-white/[0.06] text-white/30 hover:text-white/50"}`}>
                  Bepul
                </button>
              </div>
              {!isFree && (
                <input placeholder="650,000 so'm" className={inputClass} />
              )}
            </div>
          </div>
          <div>
            <label className={labelClass}>Davomiylik *</label>
            <input placeholder="Masalan: 6 oy" className={inputClass} />
          </div>
        </div>

        {/* QO'SHIMCHA */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 space-y-4">
          <h2 className="text-[15px] font-bold text-white">Qo&apos;shimcha</h2>
          <div>
            <label className={labelClass}>Kurs tavsifi</label>
            <textarea placeholder="Kursda nima o'rgatiladi..." className={textareaClass} rows={4} />
          </div>
          {showLocation && (
            <div>
              <label className={labelClass}>Manzil *</label>
              <input placeholder="Toshkent, Chilonzor tumani..." className={inputClass} />
            </div>
          )}
          {showSchedule && (
            <div>
              <label className={labelClass}>Dars jadvali</label>
              <input placeholder="Du-Ju, 14:00-16:00" className={inputClass} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Til</label>
              <select className={selectClass}>
                {tillar.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Daraja</label>
              <select className={selectClass}>
                <option value="">Tanlang</option>
                {darajalar.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>O&apos;quvchilar limiti</label>
              <input type="number" placeholder="20" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>To&apos;lov turi</label>
              <select className={selectClass}>
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
            <input placeholder="Ism familiya" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tajriba</label>
            <textarea placeholder="5 yillik tajriba, Google sertifikati..." className={textareaClass} rows={3} />
          </div>
        </div>

        {/* OPSIYALAR */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 space-y-4">
          <h2 className="text-[15px] font-bold text-white">Opsiyalar</h2>
          <div>
            <label className={labelClass}>Dars rejasi</label>
            <textarea placeholder={"1-oy: Asoslar\n2-oy: Amaliy\n3-oy: Real loyiha"} className={textareaClass} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Sertifikat</label>
              <select className={selectClass}>
                <option value="yoq">Yo&apos;q</option>
                <option value="ha">Ha, beriladi</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Demo dars</label>
              <select className={selectClass}>
                <option value="yoq">Yo&apos;q</option>
                <option value="ha">Ha, bor</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Chegirma / aksiya</label>
            <input placeholder="Birinchi oy 50% chegirma" className={inputClass} />
          </div>
        </div>

        <button className="w-full h-[50px] rounded-[12px] bg-[#7ea2d4] text-white text-[16px] font-medium hover:bg-[#6b91c3] transition-colors">
          E&apos;lonni joylash
        </button>
      </div>
    </div>
  );
}
