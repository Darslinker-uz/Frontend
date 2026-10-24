"use client";

import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { PhoneInput } from "@/components/phone-input";
import { useCrmApplyForm } from "@/components/crm/crm-apply";

// /contact — "Ikki yo'l" (egasi tanlagan, 2026-10-25): chapda ariza formasi (modalsiz), o'ngda Telegram support.
// Bitta ekranga sig'adi (ekran minus 62px navbar). Faqat tasdiqlangan kanal: @Darslinker_Support, har kuni 10:00–20:00.

const SUPPORT_URL = "https://t.me/Darslinker_Support";

const INPUT = "w-full h-[52px] rounded-[14px] border border-[#e3e7ec] bg-[#f7f8fa] px-4 text-[16px] text-[#16181a] placeholder:text-[#8792a0] focus:border-[#7ea2d4] focus:outline-none md:h-[58px] md:text-[17px]";

export function ContactForm() {
  const f = useCrmApplyForm("contact");

  return (
    <section className="flex min-h-[calc(100dvh-62px)] items-center justify-center px-4 py-3 md:px-10 md:py-6">
      <div className="grid w-full max-w-[1240px] gap-3 md:grid-cols-2 md:gap-5">
        <div className="rounded-[28px] bg-white p-5 md:min-h-[500px] md:p-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#5b87c0]">1-yo&apos;l</p>
          <h1 className="mt-2 text-[24px] font-bold tracking-[-0.035em] md:text-[36px]">Ariza qoldiring</h1>
          {f.done ? (
            <div className="flex flex-col items-center py-8 text-center" role="status">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7ea2d4]/20"><Check className="h-7 w-7 text-[#2d5a8a]" /></span>
              <p className="mt-4 text-[22px] font-bold">Ariza qabul qilindi</p>
              <p className="mt-2 text-[15px] text-[#6a7585]">Tez orada bog&apos;lanamiz.</p>
            </div>
          ) : (
            <form className="mt-4 space-y-2.5 md:mt-7 md:space-y-3" onSubmit={(e) => { e.preventDefault(); f.submit(); }}>
              <input value={f.name} onChange={(e) => f.setName(e.target.value)} placeholder="Ismingiz" aria-label="Ismingiz" autoComplete="name" className={INPUT} disabled={f.busy} />
              <PhoneInput value={f.phone} onChange={(e) => f.setPhone(e.target.value)} className={INPUT} disabled={f.busy} />
              <input value={f.centerName} onChange={(e) => f.setCenterName(e.target.value)} placeholder="O'quv markaz nomi" aria-label="O'quv markaz nomi" autoComplete="organization" className={INPUT} disabled={f.busy} />
              {f.error && <p className="text-[13px] text-red-600">{f.error}</p>}
              <button type="submit" disabled={f.busy || !f.canSubmit} className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#2d5a8a] text-[16px] font-semibold text-white transition-colors hover:bg-[#244c76] disabled:cursor-not-allowed disabled:opacity-40 md:h-[60px] md:text-[17px]">
                {f.busy ? "Yuborilmoqda..." : <>Yuborish <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}
        </div>

        <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-[#16181a] p-5 text-white md:min-h-[500px] md:p-10">
          <div aria-hidden="true" className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#2d5a8a]/50 blur-3xl" />
          <div className="relative">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7ea2d4]">2-yo&apos;l</p>
            <h2 className="mt-2 text-[24px] font-bold tracking-[-0.035em] md:text-[36px]">Telegram&apos;da yozing</h2>
            <p className="mt-1 text-[15px] text-white/55 md:mt-3 md:text-[17px]">@Darslinker_Support · Har kuni, 10:00–20:00</p>
          </div>
          <div className="relative mt-4 flex items-center justify-between md:mt-0">
            <span className="text-[16px] font-semibold md:text-[18px]">Chatni ochish</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#16181a] transition-transform group-hover:rotate-45 md:h-16 md:w-16">
              <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6" />
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
