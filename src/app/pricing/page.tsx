import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CrmApplyButton } from "@/components/crm/crm-apply";
import { PricingSection } from "@/components/crm/pricing-section";
import { FaqList } from "@/components/faq-item";
import { CRM_FEATURES, PLANS } from "@/lib/crm-content";
import { SHARE_OG, SHARE_TWITTER } from "@/lib/share-meta";

// /pricing — "o'quv markazi CRM narxi" (docs/crm-pages-keywords.md). Tarif kartalari bosh sahifadagi bilan
// bir xil (PricingSection), ostida 6/12 oylik jami summalar jadvali, qo'shimcha o'quvchi misoli va FAQ.
// Barcha raqamlar PLANS'dan hisoblanadi — narx o'zgarsa, sahifa o'zi yangilanadi.

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const PATH = "/pricing";
const TITLE = "O'quv markazi CRM narxi va tariflari — Darslinker";
const DESCRIPTION = `O'quv markazi CRM narxi: oyiga ${PLANS[0].price} so'mdan. Barcha imkoniyatlar har bir tarifda, farq faqat hajmda. 6 oyga −10%, 12 oyga −20%.`;

// Qaysi tarif mos — o'quvchilar soniga qarab (chegaralar PLANS'dagi features[0] bilan bir xil).
const CHOOSER: [string, string, string][] = [
  ["100 tagacha o'quvchi, 1 filial", PLANS[0].name, `${PLANS[0].price} so'm/oy`],
  ["250 tagacha o'quvchi, 1 filial", PLANS[1].name, `${PLANS[1].price} so'm/oy`],
  ["600 tagacha o'quvchi, 3 tagacha filial", PLANS[2].name, `${PLANS[2].price} so'm/oy`],
  ["1 500 tagacha o'quvchi, 6 tagacha filial", PLANS[3].name, `${PLANS[3].price} so'm/oy`],
  ["1 500 dan ko'p o'quvchi yoki 6 dan ko'p filial", "Individual", "Kelishuv asosida"],
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["o'quv markazi CRM narxi", "o'quv markazini boshqarish dasturi narxi", "CRM oylik to'lovi", "o'quv markazi uchun CRM tariflari"],
  alternates: { canonical: PATH },
  openGraph: { ...SHARE_OG, title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { ...SHARE_TWITTER, title: TITLE, description: DESCRIPTION },
};

const num = (p: string) => Number(p.replace(/\s/g, ""));
const sum = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Qo'shimcha o'quvchi misoli: Standart tarifida 275 o'quvchi → 25 ortiqcha → 3 ta boshlangan o'nlik → +60 000.
const EX_PLAN = PLANS[1];
const EX_LIMIT = 250;
const EX_STUDENTS = 275;
const EX_TENS = Math.ceil((EX_STUDENTS - EX_LIMIT) / 10);
const EX_EXTRA = EX_TENS * 20000;

const FAQS = [
  { q: "O'quv markazi CRM'i oyiga qancha turadi va tariflar nimaga qarab farq qiladi?", a: `Darslinker tariflari oyiga ${PLANS[0].price} so'mdan ${PLANS[PLANS.length - 1].price} so'mgacha. Har bir tarifga barcha imkoniyatlar kiradi: davomat, to'lov va qarzdorlik, ota-onaga Telegram xabar, jonli quiz, lidlar, dars jadvali, hisobotlar. Tariflar faqat o'quvchilar, filiallar va xodimlar soni bilan farq qiladi.` },
  { q: "Qaysi tarifni tanlash kerak?", a: "O'quvchilar soniga qarab: 100 tagachasiga Minimal, 250 tagachasiga Standart, 600 tagachasiga Biznes, 1 500 tagachasiga Korporativ. Undan ko'p bo'lsa yoki filiallar ko'p bo'lsa, Individual tarif kelishuv asosida." },
  { q: "Tarifdagi o'quvchilar sonidan oshib ketsa nima bo'ladi?", a: "Tarif chegarasidan oshgan har 10 ta o'quvchi uchun oyiga 20 000 so'm qo'shiladi. Boshlangan har 10 talik to'liq sanaladi." },
  { q: "Uzoq muddatga to'lasam chegirma bormi?", a: "Ha: 6 oyga to'lovda 10%, 12 oyga to'lovda 20% chegirma." },
  { q: "Bepul sinab ko'rsa bo'ladimi?", a: "Ha. Istalgan tarifni 14 kun bepul sinab ko'rasiz, karta talab qilinmaydi." },
  { q: "SMS uchun alohida to'lov bormi?", a: "Ota-onaga xabarlar Telegram orqali boradi, shuning uchun ular uchun alohida pul to'lanmaydi." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": TITLE,
      "description": DESCRIPTION,
      "url": `${SITE_URL}${PATH}`,
      "inLanguage": "uz",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": `${SITE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Tariflar", "item": `${SITE_URL}${PATH}` },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "name": "Darslinker",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": SITE_URL,
      "publisher": { "@id": `${SITE_URL}/#organization` },
      "offers": PLANS.map((p) => ({
        "@type": "Offer",
        "name": p.name,
        "description": p.audience,
        "price": num(p.price),
        "priceCurrency": "UZS",
        "priceSpecification": { "@type": "UnitPriceSpecification", "price": num(p.price), "priceCurrency": "UZS", "unitCode": "MON", "unitText": "oy" },
      })),
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
    },
  ],
};

const SECTION = "max-w-[1600px] mx-auto px-5 md:px-20";
const H2 = "text-[28px] md:text-[40px] font-bold tracking-[-0.035em] leading-[1.1] text-[#16181a]";

export default function PricingPage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen text-[#16181a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={`${SECTION} pt-8 md:pt-12`}>
        <h1 className="mt-2 max-w-[900px] text-[40px] font-bold leading-[1.02] tracking-[-0.04em] md:text-[56px] xl:text-[64px]">
          O&apos;quv markazi CRM narxi va tariflari
        </h1>
        <p className="mt-5 max-w-[720px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">
          Darslinker CRM va LMS tariflari oyiga {PLANS[0].price}{" "}so&apos;mdan
          boshlanadi. Barcha imkoniyatlar har bir tarifda bor, tariflar faqat o&apos;quvchilar, filiallar va xodimlar
          soni bilan farq qiladi. Istalgan tarifni 14 kun bepul sinab ko&apos;rasiz.
        </p>
        <div className="mt-8 rounded-[22px] bg-white p-6 ring-1 ring-[#e4e7ea] md:p-8">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#5b87c0]">Qisqacha</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              `Narx oyiga ${PLANS[0].price} so'mdan ${PLANS[PLANS.length - 1].price} so'mgacha, o'quvchilar soniga qarab.`,
              "Barcha imkoniyatlar har bir tarifda bor, hech biri yopiq emas.",
              "6 oyga to'lovda 10%, 12 oyga to'lovda 20% chegirma.",
              "Chegaradan oshgan har 10 o'quvchiga oyiga +20 000 so'm. 14 kun bepul sinov.",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-[15px] leading-relaxed md:text-[16px]">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#5b87c0]" strokeWidth={3} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tarif kartalari — bosh sahifadagi bilan bir xil */}
      <PricingSection plans={PLANS} />

      {/* Qaysi tarif mos */}
      <section className={`${SECTION} pt-14 md:pt-20`}>
        <h2 className={H2}>Qaysi tarif sizga mos?</h2>
        <p className="mt-4 max-w-[760px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">
          Tarif markazingizdagi o&apos;quvchilar va filiallar soniga qarab tanlanadi.
        </p>
        <div className="mt-8 overflow-hidden rounded-[22px] bg-white ring-1 ring-[#e4e7ea]">
          <table className="w-full text-left text-[15px]">
            <thead className="border-b border-[#e4e7ea] text-[13px] text-[#7c8490]">
              <tr>
                <th className="p-4 font-semibold">Markazingizda</th>
                <th className="p-4 font-semibold">Tarif</th>
                <th className="hidden p-4 font-semibold sm:table-cell">Narx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f3]">
              {CHOOSER.map(([who, plan, price]) => (
                <tr key={plan}>
                  <td className="p-4">{who}</td>
                  <td className="p-4 font-bold">{plan}<span className="block text-[13px] font-normal text-[#7c8490] sm:hidden">{price}</span></td>
                  <td className="hidden p-4 tabular-nums sm:table-cell">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tarifga nima kiradi */}
      <section className={`${SECTION} py-14 md:py-20`}>
        <h2 className={H2}>Har bir tarifga nimalar kiradi?</h2>
        <p className="mt-4 max-w-[760px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">
          Imkoniyatlar tarifga qarab cheklanmaydi. Minimal tarifda ham, Korporativ tarifda ham quyidagilarning
          hammasi bor.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {CRM_FEATURES.map((f) => (
            <li key={f} className="flex gap-3 rounded-[16px] bg-white p-4 text-[15px] ring-1 ring-[#e4e7ea]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5b87c0]" strokeWidth={3} />
              {f}
            </li>
          ))}
        </ul>
        <Link href="/features" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-[#2d5a8a] hover:underline">
          Imkoniyatlar haqida batafsil <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* 6/12 oylik jami summalar */}
      <section className="bg-[#e8eaed] py-14 md:py-20">
        <div className={SECTION}>
          <h2 className={H2}>Uzoq muddatga to&apos;lasangiz qancha bo&apos;ladi?</h2>
          <p className="mt-4 max-w-[760px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">
            6 oyga to&apos;lovda 10%, 12 oyga to&apos;lovda 20% chegirma beriladi. Quyida har tarif uchun jami summa.
          </p>
          <div className="mt-8 overflow-x-auto rounded-[22px] bg-white ring-1 ring-[#e4e7ea]">
            <table className="w-full min-w-[640px] text-left text-[15px]">
              <thead className="border-b border-[#e4e7ea] text-[13px] text-[#7c8490]">
                <tr>
                  <th className="p-4 font-semibold">Tarif</th>
                  <th className="p-4 font-semibold">Hajm</th>
                  <th className="p-4 font-semibold">Oylik</th>
                  <th className="p-4 font-semibold">6 oy (−10%)</th>
                  <th className="p-4 font-semibold">12 oy (−20%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f3]">
                {PLANS.map((p) => {
                  const m = num(p.price);
                  return (
                    <tr key={p.id}>
                      <td className="p-4 font-bold">{p.name}</td>
                      <td className="p-4 text-[#5d6672]">{p.features[0]}, {p.features[1]}</td>
                      <td className="p-4 tabular-nums">{p.price} so&apos;m</td>
                      <td className="p-4 tabular-nums">{sum(m * 0.9 * 6)} so&apos;m</td>
                      <td className="p-4 tabular-nums">{sum(m * 0.8 * 12)} so&apos;m</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="p-4 font-bold">Individual</td>
                  <td className="p-4 text-[#5d6672]">1 500 dan ortiq o&apos;quvchi yoki ko&apos;p filial</td>
                  <td className="p-4 text-[#5d6672]" colSpan={3}>Kelishuv asosida</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Qo'shimcha o'quvchi */}
      <section className={`${SECTION} py-14 md:py-20`}>
        <div className="rounded-[28px] bg-white p-7 ring-1 ring-[#e4e7ea] md:p-10">
          <h2 className="text-[24px] font-bold tracking-[-0.03em] md:text-[32px]">O&apos;quvchilar soni tarifdan oshsa-chi?</h2>
          <p className="mt-3 max-w-[760px] text-[15px] leading-relaxed text-[#5d6672] md:text-[17px]">
            Tarifni darhol almashtirish shart emas. Chegaradan oshgan har 10 ta o&apos;quvchi uchun oyiga 20 000 so&apos;m
            qo&apos;shiladi, boshlangan har 10 talik to&apos;liq sanaladi.
          </p>
          <p className="mt-4 max-w-[760px] rounded-[14px] bg-[#f0f2f3] px-5 py-4 text-[15px] leading-relaxed md:text-[16px]">
            <span className="font-semibold">Misol:</span> {EX_PLAN.name}{" "}tarifida {EX_LIMIT}{" "}tagacha o&apos;quvchi.
            Markazda {EX_STUDENTS}{" "}ta o&apos;quvchi bo&apos;lsa, {EX_STUDENTS - EX_LIMIT}{" "}tasi ortiqcha, bu {EX_TENS}{" "}ta
            o&apos;nlik, ya&apos;ni +{sum(EX_EXTRA)}{" "}so&apos;m. Oylik to&apos;lov: {sum(num(EX_PLAN.price) + EX_EXTRA)}{" "}so&apos;m.
          </p>
        </div>
      </section>

      <section className={`${SECTION} pb-14 md:pb-20`}>
        <div className="rounded-[20px] border border-[#e4e7ea] bg-white p-6 md:p-10">
          <h2 className="text-[24px] font-bold tracking-[-0.03em] md:text-[32px]">Ko&apos;p so&apos;raladigan savollar</h2>
          <div className="mt-6">
            <FaqList items={FAQS} />
          </div>
        </div>
      </section>

      <section className={`${SECTION} pb-16 md:pb-24`}>
        <div className="grid items-center gap-8 overflow-hidden rounded-[24px] bg-[#1e2024] p-8 text-white md:grid-cols-[1fr_auto] md:p-14">
          <div>
            <h2 className="text-[28px] font-bold leading-tight tracking-[-0.03em] md:text-[40px]">14 kun bepul sinab ko&apos;ring</h2>
            <p className="mt-3 max-w-[520px] text-[15px] text-white/60 md:text-[17px]">Karta kerak emas. Tarifni sinov davomida tanlaysiz.</p>
          </div>
          <CrmApplyButton refSource="pricing-page" className="inline-flex h-[56px] items-center justify-center gap-2 rounded-[14px] bg-white px-8 text-[16px] font-semibold text-[#16181a] transition-colors hover:bg-white/90">
            Bepul sinab ko&apos;rish <ArrowRight className="h-4 w-4" />
          </CrmApplyButton>
        </div>
      </section>
    </div>
  );
}
