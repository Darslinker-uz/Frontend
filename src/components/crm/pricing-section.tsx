"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CrmApplyButton, type CrmPlan } from "@/components/crm/crm-apply";
import { scrollToCenter } from "@/components/smooth-scroll";

// Tariflar bo'limi. Ma'lumot — docs PRODUCT.md, 7-bo'lim. Kartalarda faqat asosiy narx;
// qo'shimcha o'quvchi to'lovi faqat FAQ'da (SPEC 2-bo'lim). Chegirmalar: 6 oyga −10%, 12 oyga −20%.
// Ko'rinish: davr almashtirgichi, brend ko'kidagi tarif kartalari, tanlangan davr bo'yicha jami summa.
// lg+: 4 ta to'liq karta qatorda. Mobil/planshet: 4 ta ixcham karta ketma-ket (nom, narx, kimlar uchun);
// karta bosilganda to'liq ochiladi va ekran o'rtasiga keladi, bir vaqtda bittasi ochiq (MobilePlans).

export type PlanInfo = {
  id: CrmPlan;
  name: string;
  price: string;
  unit: string;
  students: string;
  audience: string; // kimlar uchun — mobil kartada nom va narx ostida
  features: string[];
  featured?: boolean;
};

const PERIODS = [
  { months: 1, label: "Oylik", discount: 0 },
  { months: 6, label: "6 oy", discount: 0.1 },
  { months: 12, label: "12 oy", discount: 0.2 },
];

const toNumber = (price: string) => Number(price.replace(/\s/g, ""));
const formatSum = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Tarif kartalarining rang to'plami (bitta joyda — kerak bo'lsa ranglarni shu yerdan o'zgartirish oson).
type Theme = {
  block: string; // katta blok
  sw: string; // davr almashtirgichi foni
  swPill: string; // sirg'aluvchi indikator
  swOn: string; // tanlangan davr matni
  swOff: string; // tanlanmagan davr matni
  discOn: string; // tanlangan davrdagi "−10%"
  discOff: string;
  card: string; // oddiy tarif kartasi (foni + chegara + matn rangi)
  feat: string; // ajratilgan (featured) tarif kartasi
  muted: string; // oddiy kartadagi ikkinchi darajali matn
  featMuted: string;
  body: string; // imkoniyatlar matni (oddiy)
  featBody: string;
  check: string;
  featCheck: string;
  line: string; // ajratuvchi chiziq (oddiy kartada)
  featLine: string;
  cta: string;
  featCta: string;
};

// Tanlangan ko'rinish: katta blok foni yo'q — kartalar to'g'ridan-to'g'ri bo'lim fonida, har biri brend
// ko'kida (#5b87c0), oq matn. Barcha kartalar bir xil, alohida belgi yo'q.
const t: Theme = {
  block: "",
  sw: "bg-white ring-1 ring-[#dfe3e8]", swPill: "bg-[#5b87c0]", swOn: "text-white", swOff: "text-[#2d5a8a] hover:text-[#16304c]",
  discOn: "text-white", discOff: "text-[#5b87c0]",
  card: "bg-[#5b87c0] text-white shadow-[0_20px_40px_-26px_rgba(45,90,138,0.7)]",
  feat: "bg-[#5b87c0] text-white shadow-[0_20px_40px_-26px_rgba(45,90,138,0.7)]",
  muted: "text-white/70", featMuted: "text-white/70",
  body: "text-white/90", featBody: "text-white/90",
  check: "text-white/75", featCheck: "text-white/75",
  line: "border-white/20", featLine: "border-white/20",
  cta: "bg-white/15 text-white hover:bg-white/25",
  featCta: "bg-white/15 text-white hover:bg-white/25",
};

export function PricingSection({ plans }: { plans: PlanInfo[] }) {
  const [period, setPeriod] = useState(0);
  const { months, discount } = PERIODS[period];

  return (
    <section id="narxlar" aria-labelledby="pricing-title" className="scroll-mt-20 bg-[#e8eaed] py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-20">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 id="pricing-title" className="text-[32px] font-bold leading-[1.05] tracking-[-0.035em] text-[#16181a] md:text-[48px]">
            Tariflar va narxlar
          </h2>
          <p className="mt-4 text-[16px] font-light leading-relaxed text-[#5d6672] md:text-[19px]">
            Istalgan tarifni 14 kun bepul sinab ko&apos;ring
          </p>
        </div>

        <div className={`mt-8 md:mt-12 ${t.block}`}>
          {/* Davr almashtirgichi: sirg'aluvchi indikator */}
          <div className="mx-auto max-w-[460px]">
            <div role="radiogroup" aria-label="To'lov davri" className={`relative grid grid-cols-3 rounded-[16px] p-1.5 ${t.sw}`}>
              <span
                aria-hidden="true"
                className={`absolute bottom-1.5 left-1.5 top-1.5 w-[calc((100%-12px)/3)] rounded-[12px] transition-transform duration-300 ease-out ${t.swPill}`}
                style={{ transform: `translateX(${period * 100}%)` }}
              />
              {PERIODS.map((p, i) => (
                <button
                  key={p.months}
                  type="button"
                  role="radio"
                  aria-checked={period === i}
                  onClick={() => setPeriod(i)}
                  className={`relative z-10 flex h-11 items-center justify-center gap-1.5 px-3 text-[14px] font-semibold transition-colors sm:px-6 ${period === i ? t.swOn : t.swOff}`}
                >
                  {p.label}
                  {p.discount > 0 && <span className={`text-[11px] font-bold ${period === i ? t.discOn : t.discOff}`}>−{p.discount * 100}%</span>}
                </button>
              ))}
            </div>
          </div>

          <MobilePlans plans={plans} period={period} t={t} />

          <div className="mt-8 hidden items-stretch gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-4">
            {plans.map((p) => {
              const monthly = toNumber(p.price) * (1 - discount);
              const f = p.featured;
              const muted = f ? t.featMuted : t.muted;
              return (
                <div key={p.id} className={`relative flex flex-col rounded-[28px] p-7 ${f ? t.feat : t.card}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[20px] font-bold">{p.name}</h3>
                  </div>
                  {/* Kimlar uchun — o'quvchilar soni ham shu jumlada; 2 qatorga joy, kartalar bir tekis tursin */}
                  <p className={`mt-2 min-h-[42px] text-[14px] leading-[1.5] ${muted}`}>{p.audience}</p>
                  <p className="mt-6 flex items-end gap-1.5">
                    <Odometer value={formatSum(monthly)} className="text-[38px] font-bold tracking-[-0.035em]" />
                    <span className={`mb-[3px] text-[14px] ${muted}`}>{p.unit}</span>
                  </p>
                  {/* key — davr almashganda qator qayta paydo bo'ladi (pr-in animatsiyasi) */}
                  <p key={months} className={`mt-1 h-5 text-[13px] motion-safe:animate-[pr-in_.5s_ease-out_both] ${muted}`}>
                    {months > 1 && monthly > 0 ? `${months} oyga jami: ${formatSum(monthly * months)} so'm` : ""}
                  </p>
                  <ul className={`mt-6 flex-1 space-y-3 border-t pt-6 ${f ? t.featLine : t.line}`}>
                    {p.features.map((x) => (
                      <li key={x} className="flex gap-2.5 text-[14px]">
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${f ? t.featCheck : t.check}`} strokeWidth={2.5} />
                        <span className={f ? t.featBody : t.body}>{x}</span>
                      </li>
                    ))}
                  </ul>
                  <CrmApplyButton
                    plan={p.id}
                    refSource="pricing"
                    className={`mt-7 h-[50px] rounded-[14px] text-[15px] font-semibold transition-colors ${f ? t.featCta : t.cta}`}
                  >
                    Sinab ko&apos;rish
                  </CrmApplyButton>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-4 rounded-[24px] bg-white p-6 ring-1 ring-[#e4e7ea] md:flex-row md:items-center md:p-7">
          <div>
            <h3 className="text-[18px] font-bold text-[#16181a]">Individual</h3>
            <p className="mt-1 text-[14px] text-[#6a7585]">1500 dan ortiq o&apos;quvchi yoki ko&apos;p filialli tarmoq — narx va shartlar kelishuv asosida.</p>
          </div>
          <CrmApplyButton plan="individual" refSource="pricing" className="h-[48px] shrink-0 rounded-[12px] bg-[#f0f2f3] px-6 text-[15px] font-semibold text-[#16181a] transition-colors hover:bg-[#e4e7ea]">
            Bog&apos;lanish
          </CrmApplyButton>
        </div>
      </div>

      <style>{"@keyframes pr-in { from { opacity: 0; transform: translateY(6px); filter: blur(3px) } to { opacity: 1; transform: none; filter: none } }"}</style>
    </section>
  );
}

// ——— Mobil/planshet: ixcham kartalar ———

function MobilePlans({ plans, period, t }: { plans: PlanInfo[]; period: number; t: Theme }) {
  // Bir vaqtda bitta tarif ochiq: boshqasi ochilsa, oldingisi yopiladi.
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <ol className="mt-6 space-y-5 lg:hidden">
      {plans.map((p) => (
        <li key={p.id}>
          <MobilePlan p={p} period={period} t={t} open={openId === p.id} onOpen={() => setOpenId(p.id)} onClose={() => setOpenId(null)} />
        </li>
      ))}
    </ol>
  );
}

function MobilePlan({ p, period, t, open, onOpen, onClose }: { p: PlanInfo; period: number; t: Theme; open: boolean; onOpen: () => void; onClose: () => void }) {
  const cardRef = useRef<HTMLElement>(null);
  const { months, discount } = PERIODS[period];
  const monthly = toNumber(p.price) * (1 - discount);
  const f = p.featured;
  const muted = f ? t.featMuted : t.muted;
  const panelId = `plan-m-${p.id}`;

  // Yopiq kartaning istalgan joyiga bosish — ochadi; ochiq kartaga qayta bosish hech narsa qilmaydi.
  // Yopish faqat "Yopish" tugmasi orqali yoki boshqa karta ochilganda. Ochilish animatsiyasi (500ms)
  // tugagach karta ekranning qoq o'rtasiga silliq keladi (imkoniyatlar papkasidagidek).
  const openCard = () => {
    if (open) return;
    onOpen();
    window.setTimeout(() => cardRef.current && scrollToCenter(cardRef.current), 520);
  };

  return (
    <article ref={cardRef} onClick={openCard} className={`relative rounded-[22px] transition-colors duration-500 ${open ? "" : "cursor-pointer"} ${f ? t.feat : t.card}`}>
      <div className="px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="pt-0.5 text-[22px] font-bold leading-none">{p.name}</h3>
          {/* "so'm/oy" narx ostida — uzun narx (1 470 000) tor ekranda nomga tegmasin */}
          <p className="flex shrink-0 flex-col items-end">
            <Odometer value={formatSum(monthly)} className="text-[26px] font-bold tracking-[-0.03em]" />
            <span className={`mt-1 text-[11px] ${muted}`}>{p.unit}</span>
          </p>
        </div>
        <p className={`mt-3 text-[14px] leading-relaxed ${muted}`}>{p.audience}</p>
      </div>

      <div id={panelId} className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="px-5 pt-4">
            {months > 1 && <p className={`text-[12px] ${muted}`}>{months} oyga jami: {formatSum(monthly * months)} so&apos;m</p>}
            <ul className={`mt-3 space-y-2.5 border-t pt-4 ${f ? t.featLine : t.line}`}>
              {p.features.map((x) => (
                <li key={x} className={`flex gap-2.5 text-[14px] ${f ? t.featBody : t.body}`}>
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${f ? t.featCheck : t.check}`} strokeWidth={2.5} />
                  {x}
                </li>
              ))}
            </ul>
            <CrmApplyButton plan={p.id} refSource="pricing" className={`mt-5 h-[48px] w-full rounded-[14px] text-[15px] font-semibold ${f ? t.featCta : t.cta}`}>
              Sinab ko&apos;rish
            </CrmApplyButton>
          </div>
        </div>
      </div>

      {/* Pastki qator: o'ng tomonda "Batafsil" / "Yopish" */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          // Kartaning o'z onClick'iga yetib bormasin (aks holda "Yopish" darhol qayta ochib yuborardi).
          e.stopPropagation();
          if (open) onClose();
          else openCard();
        }}
        className={`mt-4 flex w-full items-center justify-end gap-1.5 border-t px-5 py-3 text-[13px] font-medium ${f ? t.featLine : t.line} ${muted}`}
      >
        {open ? "Yopish" : "Batafsil"}
        <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
    </article>
  );
}

// Odometr: har raqam 0–9 ustunida vertikal aylanib yangi qiymatga keladi; o'ngdan chapga
// biroz kechikish bilan — to'lqin effekti. Raqamlar o'ng chetdan hisoblanib kalitlanadi,
// shuning uchun uzunlik o'zgarsa ham birliklar joyida qoladi.
function Odometer({ value, className }: { value: string; className?: string }) {
  const chars = value.split("");
  return (
    <span className={`inline-flex leading-none ${className ?? ""}`}>
      <span className="sr-only">{value}</span>
      {chars.map((c, i) => {
        const fromRight = chars.length - i;
        if (!/\d/.test(c)) return <span key={`s${fromRight}`} aria-hidden="true" className="inline-block w-[0.25em]" />;
        const d = Number(c);
        return (
          // Har raqam bir xil enli qutida (jadval raqamlari kabi), raqam markazda. Ustun eni eng keng
          // raqamga yoki joriy raqamga bog'lansa, "1" atrofida bo'shliq yoki raqamlar yopishib qoladi.
          <span key={fromRight} aria-hidden="true" className="relative inline-block h-[1em] w-[0.62em] overflow-hidden text-center leading-[1em] tracking-normal">
            <span
              className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-[cubic-bezier(.2,.9,.25,1.15)] motion-reduce:transition-none"
              style={{ transform: `translateY(-${d * 10}%)`, transitionDelay: `${(fromRight - 1) * 45}ms` }}
            >
              {DIGITS.map((n) => <span key={n} className="block h-[1em] leading-[1em]">{n}</span>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
