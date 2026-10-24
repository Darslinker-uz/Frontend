"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CrmApplyButton } from "@/components/crm/crm-apply";

// "Qanday boshlanadi" — tariflardan keyin: "Sinab ko'rish"ni bossam nima bo'ladi?
// 4 qadamning hammasi bir vaqtda ko'rinadi; har qadamda qog'oz uslubidagi illyustratsiya (public/images/steps).
// Matnda faqat tasdiqlangan narsalar: ariza, markaz tizimi, Excel import, 14 kun sinov.

const STEPS = [
  { title: "Ariza qoldirasiz", text: "Ism, telefon va markaz nomi. Bir daqiqa ham olmaydi.", image: "/images/steps/apply-paper-v1.png" },
  { title: "Markazingiz tizimi ochiladi", text: "Siz bilan bog'lanamiz va markazingiz uchun alohida manzil ochamiz.", image: "/images/steps/workspace-paper-v1.png" },
  { title: "Ma'lumotlarni ko'chirasiz", text: "O'quvchilar ro'yxatini Excel'dan import qilasiz, xodimlarga rollar berasiz.", image: "/images/steps/import-paper-v1.png" },
  { title: "14 kun bepul ishlaysiz", text: "Barcha imkoniyatlarni real ishda sinaysiz. Karta kerak emas.", image: "/images/steps/trial-paper-v1.png" },
];

export function StartSteps() {
  return (
    <section id="boshlash" aria-labelledby="steps-title" className="mx-auto max-w-[1600px] scroll-mt-24 px-5 py-16 md:px-20 md:py-24">
      {/* Mobil: sarlavha, qadamlar, keyin ariza tugmasi. Desktop: sarlavha va tugma tepada,
          qadamlar ostida; illyustratsiya plitka burchagidan chiqib turadi. */}
      <div className="overflow-hidden rounded-[36px] bg-[#0f2236] p-6 md:p-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-8">
          <div className="lg:col-start-1 lg:row-start-1"><Heading light /></div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:row-start-2 xl:mt-12 xl:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex flex-col rounded-[24px] bg-white/[0.06] p-6 ring-1 ring-white/10">
              {/* Raqam va illyustratsiya bitta qatorda, ustma-ust tushmaydi */}
              <div className="flex items-start justify-between gap-3">
                <span className="text-[44px] font-bold leading-none tracking-[-0.04em] text-white/15">{String(i + 1).padStart(2, "0")}</span>
                <StepImage src={s.image} sizes="112px" className="-mr-2 -mt-2 h-[112px] w-[112px] shrink-0 opacity-70 drop-shadow-[0_18px_26px_rgba(0,0,0,0.35)]" />
              </div>
              <div className="mt-4">
                <h3 className="text-[19px] font-bold tracking-[-0.02em] text-white">{s.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/60">{s.text}</p>
              </div>
            </li>
          ))}
          </ol>
          <div className="mt-8 flex justify-center sm:justify-end lg:col-start-2 lg:row-start-1 lg:mt-0">
            <Cta light />
          </div>
        </div>
      </div>
    </section>
  );
}

function Heading({ center = false, light = false }: { center?: boolean; light?: boolean }) {
  return (
    <div className={`max-w-[680px] ${center ? "mx-auto text-center" : ""}`}>
      <p className={`text-[13px] font-semibold uppercase tracking-[0.08em] ${light ? "text-[#9fbce3]" : "text-[#5b87c0]"}`}>Qanday boshlanadi</p>
      <h2 id="steps-title" className={`mt-3 text-[32px] font-bold leading-[1.05] tracking-[-0.035em] md:whitespace-nowrap md:text-[48px] ${light ? "text-white" : "text-[#16181a]"}`}>
        Darslinker&apos;ga to&apos;rt qadamda o&apos;ting.
      </h2>
      <p className={`mt-4 text-[16px] font-light leading-relaxed md:text-[19px] ${light ? "text-white/60" : "text-[#5d6672]"}`}>
        Ariza qoldiring, markazingiz uchun tizim ochamiz,<br className="hidden md:block" /> ma&apos;lumotlarni ko&apos;chiring va 14 kun sinab ko&apos;ring.
      </p>
    </div>
  );
}

function Cta({ light = false }: { light?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <CrmApplyButton
        refSource="steps"
        className={`inline-flex h-[56px] items-center justify-center gap-2 rounded-full px-8 text-[16px] font-semibold transition-colors ${light ? "bg-white text-[#16181a] hover:bg-white/90" : "bg-[#16181a] text-white hover:bg-[#2a2d31]"}`}
      >
        Ariza qoldirish <ArrowRight className="h-4 w-4" />
      </CrmApplyButton>
      <p className={`text-[13px] ${light ? "text-white/50" : "text-[#7c8490]"}`}>14 kun bepul</p>
    </div>
  );
}

function StepImage({ src, className, sizes }: { src: string; className: string; sizes: string }) {
  return (
    <div aria-hidden="true" className={`relative ${className}`}>
      <Image src={src} alt="" fill sizes={sizes} className="object-contain" />
    </div>
  );
}
