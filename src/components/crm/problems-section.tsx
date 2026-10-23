"use client";

import type { CSSProperties } from "react";
import { Wallet, CalendarDays, Users, TrendingDown } from "lucide-react";
import { TiltOnScroll } from "@/components/crm/tilt-on-scroll";

// "Markazning to'rt asosiy muammosi" bo'limi. Kartalar rangi — "Yumshoq" (pastdagi `t`).
// Fon — chegarali nuqtali karta. "Tanish muammolarmi?" xl'da kartalar ortida turadi va kartalar
// scroll'da pastga tushganda ochiladi.

const CARDS = [
  { Icon: Wallet, context: "To‘lov kechikishi", label: "Qarzdorlik", title: "Qarzdorlik vaqtida bilinmaydi", text: "To‘lovlar turli joyda qayd etilsa, kim qancha to‘lagani va kimga eslatish kerakligini aniqlash qiyinlashadi.", note: "To‘lovlar va qarzlar bir joyda ko‘rinadi.", tilt: "-6deg" },
  { Icon: CalendarDays, context: "Jadval chalkashligi", label: "Guruhlar", title: "Guruh vaqtlari chalkashadi", text: "Jadval o‘zgarsa, bo‘sh joy yoki to‘lib qolgan guruhni aniqlash qiyinlashadi. O‘quvchi uchun mos vaqt topish ham cho‘ziladi.", note: "Guruhlar va dars vaqtlari tartibda bo‘ladi.", tilt: "4deg" },
  { Icon: Users, context: "O‘quvchi passivligi", label: "Davomat", title: "O‘quvchi qatnovi kamayadi", text: "O‘quvchi darslarni tez-tez qoldira boshlaydi, lekin bu o‘zgarish vaqtida sezilmaydi. Holbuki, erta gaplashib sababini bilish mumkin.", note: "Davomatdan qatnovdagi o‘zgarish seziladi.", tilt: "-4deg" },
  { Icon: TrendingDown, context: "Kursni tark etish", label: "Davomiylik", title: "O‘quvchi erta tark etadi", text: "O‘quvchi ketgach sababini so‘rash ko‘pincha kech bo‘ladi. Ketishidan oldingi belgilarni kuzatish esa qiyin.", note: "O‘quvchi holatini kuzatib, vaqtida bog‘laning.", tilt: "6deg" },
];

type Four = [string, string, string, string];

type Theme = {
  card: string; // umumiy karta: chegara, soya
  tones: Four; // har karta foni
  meta: Four; // yuqori yorliq va ikonka
  panels: Four;
  body: Four;
  note: Four;
};

const four = (v: string): Four => [v, v, v, v];

// Kartalar rangi — "Yumshoq": oltin, ultramarin, binafsha, bordoning sokinroq, kamroq to'yingan
// tuslari (karta tartibida); hamma kartada oq matn.
const t: Theme = {
  card: "shadow-[0_18px_40px_-22px_rgba(22,24,26,0.45)]",
  tones: ["bg-[#b8933f]", "bg-[#5d6bc8]", "bg-[#8f6cc0]", "bg-[#a85d7b]"],
  meta: four("text-white"),
  panels: four("bg-white/15 border-transparent text-white"),
  body: four("text-white/80"),
  note: four("border-white/25 text-white/85"),
};

// Bo'lim foni: katta yumaloq karta — ichi to'ldirilmagan, 8px kulrang chegara va ichida
// shu rangdagi nozik nuqtali to'r.
const BORDER_COLOR = "text-[#b8c0cc]";

export function ProblemsSection() {
  return (
    <section aria-labelledby="problems-title" className="relative z-10 mx-auto -mt-[86px] max-w-[1600px] lg:-mt-[76px] px-5 pb-14 md:px-20 md:pb-20">
      <div className="relative isolate pb-10 md:pb-14">
        <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-[76px] bottom-0 -z-10 hidden lg:block rounded-[28px] md:rounded-[40px] border-[8px] border-current ${BORDER_COLOR}`}>
          <div className="absolute inset-0 rounded-[inherit] opacity-[0.22] bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-[size:22px_22px]" />
        </div>
        {/* xl: scroll bo'yicha kartalar to'g'rilanadi va 190px pastga tushadi (fon tepasidan 126px pastda).
            Sarlavha ustma-ust tushmasligi uchun pastki padding 214px.
            Animatsiya ("magnit") — TiltOnScroll ichida. */}
        {/* Mobil/planshet: "Dasta" — kartalar vertikal; scroll'da har biri navbar ostida to'xtab,
            keyingisi uning ustiga 14px pastroqda taxlanadi. Birinchi karta hero tubidan ~25% chiqib turadi. */}
        <ol className="relative px-3 pt-3 lg:hidden">
          {CARDS.map(({ Icon, context, label, title, text, note }, i) => (
            <li key={label} className="sticky mb-5" style={{ top: `${84 + i * 14}px` }}>
              <article
                className={`rounded-[24px] p-5 ${t.card} ${t.tones[i]}`}
                style={{ rotate: i === 0 ? "-2deg" : i % 2 ? "1.5deg" : "-1.5deg" }}
              >
              <div className={`flex items-center justify-between gap-3 text-[15px] font-bold leading-tight tracking-normal ${t.meta[i]}`}>
                  <span>{context}</span><Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <div className={`mt-6 rounded-[16px] border p-4 ${t.panels[i]}`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-80">{label}</p>
                  <h3 className="mt-2 text-[22px] font-semibold leading-[1.15] tracking-[-0.025em]">{title}</h3>
                </div>
                <p className={`mt-4 text-[15px] leading-[1.65] ${t.body[i]}`}>{text}</p>
              </article>
            </li>
          ))}
          {/* Bo'sh "yo'lak": oxirgi karta ham taxlangach, dasta shu masofa davomida joyida turadi —
              keyingi matn (sarlavha) shu vaqt ekrandan pastda qoladi va faqat dasta yig'ilib bo'lgach,
              u bilan birga yuqoriga chiqa boshlaydi. */}
          <li aria-hidden="true" className="h-[27.5svh]" />
        </ol>
        <div className="hidden lg:block">
        <TiltOnScroll
          behind={
            // Faqat xl: matn doim joyida turadi — kartalar asl holatida uni yopib turadi, pastga tushganda
            // chegara ichki qirrasi (84px) bilan kartalar tepasi (202px) orasida ko'rinadi.
            <p className="pointer-events-none absolute inset-x-0 top-[119px] hidden text-center text-[34px] font-semibold tracking-[-0.02em] leading-[48px] text-[#4b525c] xl:block">
              Sizda ham shu muammolar bormi?
            </p>
          }
          className="grid snap-x snap-mandatory auto-cols-[minmax(260px,82%)] grid-flow-col items-stretch gap-5 overflow-x-auto overscroll-x-contain px-5 pb-8 pt-3 xl:gap-y-0 xl:pb-[214px] sm:auto-cols-[minmax(280px,46%)] xl:grid-flow-row xl:grid-cols-4 xl:overflow-visible xl:px-8">
          {CARDS.map(({ Icon, context, label, title, text, note, tilt }, i) => (
            <article
              key={label}
              className={`group relative isolate flex min-h-[380px] snap-center flex-col xl:row-span-4 xl:grid xl:min-h-0 xl:grid-rows-subgrid overflow-hidden rounded-[24px] ${t.card} ${t.tones[i]} p-5 xl:p-6 xl:[rotate:var(--tilt)]`}
              style={{ "--tilt": tilt } as CSSProperties}
              data-tilt-card
            >
              <div className={`flex items-center justify-between gap-3 text-[16px] font-bold leading-tight tracking-normal ${t.meta[i]}`}>
                <span>{context}</span><Icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className={`mt-9 flex min-h-[124px] flex-col rounded-[16px] border p-4 ${t.panels[i]}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-80">{label}</p>
                <h3 className="mt-3 text-[24px] leading-[1.15] font-semibold tracking-[-0.025em]">{title}</h3>
              </div>
              <p className={`mt-5 flex-1 text-[16px] leading-[1.65] ${t.body[i]}`}>{text}</p>
            </article>
          ))}
        </TiltOnScroll>
        </div>
        {/* Mobilda kichik matn bitta qatorda (shrift ekran eniga bog'langan: 100vw − section'ning 2×20px
            chekkasi, matn uzunligiga bo'lingan). Sarlavha mobilda ikki qator: "Boshqaruvni" ostidagi
            qator eniga cho'ziladi (w-0 + min-w-full konteynerni kengaytirmaydi, textLength yoyadi). */}
        <div className="mx-auto mt-6 max-w-[680px] text-center md:mt-8 md:px-5">
          <p className="hidden text-[34px] font-semibold tracking-[-0.02em] leading-[48px] text-[#4b525c] xl:hidden">Sizda ham shu muammolar bormi?</p>
          <p className="mx-auto mt-4 whitespace-nowrap text-[length:min(19.5px,calc((100vw_-_40px)/21.5))] leading-relaxed text-[#5d6672] md:max-w-[540px] md:text-[22px]">Markaz o‘sgani sari nazorat qiyinlashadi.</p>
          <h2 id="problems-title" className="mt-3 inline-flex flex-col items-stretch whitespace-nowrap text-[length:min(40px,calc((100vw_-_40px)/13))] leading-tight font-semibold tracking-[-0.035em] text-[#16181a] md:block md:text-[40px]">
            <span className="sr-only md:not-sr-only">Boshqaruvni </span>
            <span aria-hidden="true" className="mb-1 block w-0 min-w-full md:hidden">
              <svg viewBox="0 0 560 100" className="block h-auto w-full overflow-visible">
                <text x="0" y="76" textLength="560" lengthAdjust="spacingAndGlyphs" fill="#16181a" fontSize="100" fontWeight="600">
                  boshqaruvni
                </text>
              </svg>
            </span>
            <span>Dars<span className="text-[#2d5a8a]">Linker</span>ga topshiring.</span>
          </h2>
        </div>
      </div>

    </section>
  );
}
