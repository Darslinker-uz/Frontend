"use client";

import { useState } from "react";
import { PhoneInput, TelegramInput } from "@/components/phone-input";

const variants = [
  { name: "1 — Och ko'k", bg: "bg-gradient-to-br from-[#e8f0f9] via-[#dce8f5] to-[#cddcef]", inputBg: "bg-white border-[#c5d5e8]", inputFocus: "focus:border-[#7ea2d4]", textMuted: "text-[#6a85a5]", btn: "bg-[#4a7ab5] text-white", tagText: "text-[#6a85a5]/60", light: true },
  { name: "2 — Och kulrang", bg: "bg-gradient-to-br from-[#e8eaed] via-[#e2e5e9] to-[#dcdfe4]", inputBg: "bg-white border-[#d0d5dd]", inputFocus: "focus:border-[#7ea2d4]", textMuted: "text-[#7c8490]", btn: "bg-[#16181a] text-white", tagText: "text-[#7c8490]/50", light: true },
  { name: "3 — Och yashil", bg: "bg-gradient-to-br from-[#e5f2ee] via-[#dbeee7] to-[#cfe8df]", inputBg: "bg-white border-[#b8d8ca]", inputFocus: "focus:border-[#4a9e8a]", textMuted: "text-[#5a8a7a]", btn: "bg-[#2d6a5a] text-white", tagText: "text-[#5a8a7a]/60", light: true },
  { name: "4 — Och binafsha", bg: "bg-gradient-to-br from-[#ede8f5] via-[#e5dff0] to-[#ddd5ea]", inputBg: "bg-white border-[#c8bede]", inputFocus: "focus:border-[#8b7bb5]", textMuted: "text-[#7a6a9a]", btn: "bg-[#6b5b95] text-white", tagText: "text-[#7a6a9a]/60", light: true },
  { name: "5 — Och sariq", bg: "bg-gradient-to-br from-[#f5f0e5] via-[#f0ebe0] to-[#eae4d5]", inputBg: "bg-white border-[#d8d0be]", inputFocus: "focus:border-[#c4a84e]", textMuted: "text-[#8a7a55]", btn: "bg-[#7a6520] text-white", tagText: "text-[#8a7a55]/60", light: true },
];

export default function CheckPage() {
  const [active, setActive] = useState(0);
  const v = variants[active];
  const isLight = v.light;

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e4e7ea] py-3">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {variants.map((vr, i) => (
            <button key={i} onClick={() => setActive(i)} className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-medium transition-all ${active === i ? "bg-[#16181a] text-white" : "bg-white border border-[#e4e7ea] text-[#7c8490] hover:text-[#16181a]"}`}>
              {vr.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-8">
        <section className={`${v.bg} rounded-[20px] p-8 md:p-12`}>
          <div className="text-center mb-10">
            <h2 className={`text-[30px] md:text-[44px] font-bold tracking-[-0.03em] ${isLight ? "text-[#16181a]" : "text-white"}`}>Yordam kerakmi?</h2>
            <p className={`text-[15px] mt-3 max-w-[400px] mx-auto ${v.textMuted}`}>Ma&apos;lumotlaringizni qoldiring — biz sizga eng mos kursni topib beramiz</p>
          </div>
          <div className="max-w-[520px] mx-auto space-y-3">
            <input placeholder="Ismingiz" className={`w-full h-[52px] px-4 text-[16px] rounded-[12px] ${v.inputBg} ${isLight ? "text-[#16181a] placeholder:text-[#7c8490]/50" : "text-white placeholder:text-white/25"} focus:outline-none ${v.inputFocus} transition-all`} />
            <PhoneInput className={`w-full h-[52px] px-4 text-[16px] rounded-[12px] ${v.inputBg} ${isLight ? "text-[#16181a] placeholder:text-[#7c8490]/50" : "text-white placeholder:text-white/25"} focus:outline-none ${v.inputFocus} transition-all`} />
            <TelegramInput className={`w-full h-[52px] px-4 text-[16px] rounded-[12px] ${v.inputBg} ${isLight ? "text-[#16181a] placeholder:text-[#7c8490]/50" : "text-white placeholder:text-white/25"} focus:outline-none ${v.inputFocus} transition-all`} />
            <input placeholder="Qaysi sohaga qiziqasiz?" className={`w-full h-[52px] px-4 text-[16px] rounded-[12px] ${v.inputBg} ${isLight ? "text-[#16181a] placeholder:text-[#7c8490]/50" : "text-white placeholder:text-white/25"} focus:outline-none ${v.inputFocus} transition-all`} />
            <button className={`w-full h-[52px] rounded-[12px] text-[15px] font-semibold ${v.btn}`}>Ariza yuborish</button>
          </div>
          <div className="hidden md:flex justify-center gap-6 mt-10">
            {["Sizga mos kurslarni tanlab beramiz", "Narx va sifatni solishtiramiz", "24 soat ichida javob beramiz", "Xizmat bepul"].map((t) => (
              <span key={t} className={`text-[12px] ${v.tagText} flex items-center gap-1.5`}>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                {t}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
