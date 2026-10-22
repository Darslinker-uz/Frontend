import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqList } from "@/components/faq-item";
import { CrmApplyButton } from "@/components/crm/crm-apply";
import { HomeHero } from "@/components/crm/home-hero";
import { ProblemsSection } from "@/components/crm/problems-section";
import { WhyDarslinker } from "@/components/crm/why-darslinker";
import { FeaturesExplorer } from "@/components/crm/features-explorer";
import { PricingSection, type PlanInfo } from "@/components/crm/pricing-section";
import { StartSteps } from "@/components/crm/start-steps";

// Bosh sahifaning barcha bo'limlari (hero'dan yakuniy CTA'gacha) — bitta manba.
// Bosh sahifa (/) shu komponentni ishlatadi.
// Tariflar va FAQ shu yerda — bosh sahifa ulardan JSON-LD (schema) ham quradi.

// Tariflar (egasi tasdiqlagan, 2026-10-22; bepul tarif yo'q). Kartalarda faqat asosiy narx;
// qo'shimcha o'quvchi to'lovi faqat FAQ'da. 6/12 oylik narxlar pricing-section'da chegirmadan hisoblanadi.
export const PLANS: PlanInfo[] = [
  {
    id: "minimal",
    name: "Minimal",
    price: "190 000",
    unit: "so'm/oy",
    students: "100 tagacha o'quvchi",
    audience: "Kichik markazlar va repetitorlar uchun — 100 tagacha o‘quvchi, bitta filial.",
    features: ["1 filial, 3 xodim", "Asosiy CRM va hisobotlar"],
  },
  {
    id: "standart",
    name: "Standart",
    price: "370 000",
    unit: "so'm/oy",
    students: "250 tagacha o'quvchi",
    audience: "O‘sayotgan, bitta filialli markazlar uchun — 250 tagacha o‘quvchi.",
    features: ["1 filial, 5 xodim", "Cheksiz jonli quiz", "Ota-onaga Telegram xabar", "Lidlar va importga yordam"],
  },
  {
    id: "biznes",
    name: "Biznes",
    price: "670 000",
    unit: "so'm/oy",
    students: "600 tagacha o'quvchi",
    audience: "Kengayayotgan markazlar uchun — 600 tagacha o‘quvchi, 3 tagacha filial.",
    features: ["3 filial, 15 xodim", "Standart'dagi hammasi", "O'qituvchi oyligi va xarajatlar", "Barcha to'lov rejimlari"],
    featured: true,
  },
  {
    id: "korporativ",
    name: "Korporativ",
    price: "1 470 000",
    unit: "so'm/oy",
    students: "1 500 tagacha o'quvchi",
    audience: "Filiallar tarmog‘i uchun — 1 500 tagacha o‘quvchi, 6 tagacha filial.",
    features: ["6 filial, cheksiz xodim", "Biznes'dagi hammasi"],
  },
];

export const FAQS = [
  {
    q: "Darslinker nima?",
    a: "Darslinker — o'quv markazlari uchun interaktiv CRM va LMS platformasi. O'quvchilar, guruhlar, dars jadvali, davomat, to'lov va qarzdorlik bitta tizimda yuritiladi. Jonli quiz va ota-onaga Telegram xabarlari esa o'quvchini markazda ushlab qolishga yordam beradi.",
  },
  {
    q: "Darslinker'ni sinab ko'rsa bo'ladimi?",
    a: "Ha. Istalgan tarifni 14 kun bepul sinab ko'rasiz, karta talab qilinmaydi. Eng kichik tarif — Minimal: oyiga 190 000 so'm, 100 tagacha o'quvchi.",
  },
  {
    q: "Tarifdagi o'quvchilar sonidan oshib ketsa nima bo'ladi?",
    a: "Tarif chegarasidan oshgan har 10 ta o'quvchi uchun oyiga 20 000 so'm qo'shiladi. Boshlangan har 10 talik to'liq sanaladi: masalan, Biznes tarifida 601 ta o'quvchi bo'lsa, +20 000 so'm.",
  },
  {
    q: "Uzoq muddatga to'lasam chegirma bormi?",
    a: "Ha: 6 oyga to'lovda 10%, 12 oyga to'lovda 20% chegirma.",
  },
  {
    q: "Ota-onaga xabar qanday boradi?",
    a: "Telegram bot orqali. O'quvchi darsga kelmasa, qarzdorlik paydo bo'lsa yoki to'lov qabul qilinsa, ota-onaga avtomatik xabar boradi. SMS kerak emas, shuning uchun bu xabarlar uchun alohida pul to'lanmaydi.",
  },
  {
    q: "Jonli quiz qanday ishlaydi?",
    a: "O'qituvchi quizni markaz panelida yaratadi va o'yinni boshlaydi. O'quvchilar PIN kod bilan telefondan qo'shiladi, savollarga vaqt ichida javob beradi va reyting jonli yangilanadi. Taymer va ballar serverda hisoblanadi.",
  },
  {
    q: "Darslinker kurslar katalogi ishlashda davom etadimi?",
    a: "Ha. O'quv markazlar, repetitorlar va kurslar katalogi darslinker.uz/kurslar sahifasida avvalgidek ishlaydi.",
  },
];

export function HomeSections() {
  return (
    <>
        <HomeHero />

        {/* MARKAZNING TO'RT ASOSIY MUAMMOSI */}
        <ProblemsSection />

        {/* NIMA UCHUN DARSLINKER — boshqa CRM'lardan farqi */}
        <WhyDarslinker />

        {/* DARSLINKER IMKONIYATLARI */}
        <FeaturesExplorer />

        {/* TARIFLAR */}
        <PricingSection plans={PLANS} />

        {/* QANDAY BOSHLANADI — tariflardan keyin, "sinab ko'rsam nima bo'ladi?" savoliga javob */}
        <StartSteps />

        {/* FAQ */}
        <section id="savollar" className="scroll-mt-20 max-w-[1600px] mx-auto px-5 md:px-20 py-14 md:py-20">
          <div className="bg-white rounded-[20px] p-6 md:p-10 border border-[#e4e7ea]">
            <h2 className="text-[24px] md:text-[32px] font-bold tracking-[-0.03em]">Ko&apos;p so&apos;raladigan savollar</h2>
            <div className="mt-6">
              <FaqList items={FAQS} />
            </div>
          </div>
        </section>

        {/* YAKUNIY CTA — boshidagi daftar motivi yopiladi */}
        <section className="max-w-[1600px] mx-auto px-5 md:px-20 pb-16 md:pb-24">
          <div className="rounded-[24px] bg-[#1e2024] text-white p-8 md:p-14 grid md:grid-cols-[1fr_auto] gap-8 items-center overflow-hidden">
            <div>
              <p className="font-[family-name:var(--font-kalam)] text-[26px] md:text-[34px] text-[#7ea2d4] leading-tight">Daftarni yoping.</p>
              <h2 className="mt-2 text-[28px] md:text-[40px] font-bold tracking-[-0.03em] leading-tight">
                Markazingizni bugun tizimga o&apos;tkazing
              </h2>
              <p className="mt-3 text-[15px] md:text-[17px] text-white/60 max-w-[520px]">
                14 kun bepul sinov, karta kerak emas. O&apos;quvchilar ro&apos;yxatini Excel&apos;dan ko&apos;chirib, birinchi kundan ishlaysiz.
              </p>
            </div>
            <CrmApplyButton refSource="home" className="h-[56px] px-8 rounded-[14px] bg-white text-[#16181a] text-[16px] font-semibold hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2">
              Bepul sinab ko&apos;rish <ArrowRight className="w-4 h-4" />
            </CrmApplyButton>
          </div>
          <p className="mt-6 text-center text-[14px] text-[#7c8490]">
            Kurs yoki o&apos;quv markaz qidiryapsizmi?{" "}
            <Link href="/kurslar" className="font-semibold text-[#2d5a8a] hover:underline">Kurslar katalogi</Link>
          </p>
        </section>
    </>
  );
}
