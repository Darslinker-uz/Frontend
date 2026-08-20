import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/onlayn-talim-bozori-2026`;

export const metadata: Metadata = {
  title: "O'zbekistonda onlayn ta'lim bozori: 2026 statistika | Darslinker",
  description:
    "Internet qamrovi 94,2%, uzbekcoders.uz'da 1,4 mln foydalanuvchi, global bozor $389 mlrd. IT Park, davlat dasturlari va raqamli ko'nikmalar statistikasi — 2026.",
  keywords: [
    "onlayn ta'lim bozori O'zbekiston",
    "raqamli ko'nikmalar statistika",
    "IT Park statistika 2026",
    "onlayn kurslar bozori",
    "internet foydalanuvchilari O'zbekiston 2026",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  {
    q: "O'zbekistonda hozir necha foiz aholi internetdan foydalanadi?",
    a: "Davlat statistika qo'mitasining uy xo'jaliklari so'rovi natijalariga ko'ra, 2025-yil yanvar-avgust holatida aholining 94,2 foizi internetdan foydalanadi. Bu ko'rsatkich besh yil ichida deyarli 18 foiz punktga o'sdi: 2021-yilda 76,6%, 2022-yilda 83,9%, 2023-yilda 89%, 2024-yilda 93,3% edi.",
  },
  {
    q: "Global onlayn ta'lim bozori qanchalik katta?",
    a: "Custom Market Insights ma'lumotlariga ko'ra, global onlayn ta'lim bozori 2025-yilda $324 mlrd, 2026-yilda esa taxminan $389 mlrd ga yetadi va 2026-2035 oralig'ida yiliga o'rtacha 20,2% o'sish sur'atida kengayib, 2035-yilga qadar $2 039 mlrd ga yetishi kutilmoqda.",
  },
  {
    q: "O'zbekistonda onlayn ta'lim qanchalik iste'mol qilinmoqda?",
    a: "Bu haqda topilgan eng aniq raqam — davlatning Coursera bilan hamkorlikdagi uzbekcoders.uz platformasi statistikasi: 1,4 million faol foydalanuvchi (90%i talaba-yoshlar, 50%i ayollar), 2024-yilda esa professional IT sertifikatga yozilish 206%ga oshgan (gov.uz). Bu bitta davlat homiylik qiladigan platformaga tegishli raqam — xususiy onlayn kurs bozori bo'yicha shunga o'xshash yig'ma statistika hali yo'q.",
  },
  {
    q: "\"Bir million dasturchi\" loyihasi qanday maqsad qo'ygan?",
    a: "Loyiha 2025–2026-yillarda 2,5 million kishini xalqaro IT sertifikatiga, shulardan 30 ming kishini professional xalqaro sertifikatga yetkazishni maqsad qilgan, asosiy yetkazish vositasi — uzbekcoders.uz. Uning mantiqiy davomi sifatida 2026-yildan \"Besh million sun'iy intellekt yetakchilari\" loyihasi ishga tushdi — shu yilning o'zida 500 ming, 2035-yilga qadar jami 5 million kishi AI ko'nikmalariga o'qitiladi.",
  },
  {
    q: "IT Park qancha yangi ish o'rni yaratmoqda?",
    a: "2024-yil 3-chorak yakuniga ko'ra IT Park rezidentlari 36,3 ming kishini ish bilan ta'minlagan — bu 2023-yil oxiridagi ko'rsatkichdan 10 ming kishiga ko'p. 2025-yil sentabr–noyabr oylarida qo'shimcha 267 ta eksportga yo'naltirilgan kompaniya rezident bo'ldi; ular orasidagi xorijiy kapitalli 158 tasi 2026-yil oxirigacha 6 500 dan ortiq yangi ish o'rni yaratishni rejalashtirmoqda.",
  },
  {
    q: "Bu raqamlar onlayn kurs izlayotgan odam uchun nimani anglatadi?",
    a: "Uch narsa bir vaqtda to'g'ri keladi: internet endi texnik to'siq emas (94,2% qamrov), davlat millionlab odamni raqamli ko'nikmalarga o'qitishni maqsad qilgan, va IT sohasida minglab yangi ish o'rni ochilmoqda. Ammo bu ehtiyojni qondiradigan tizimli onlayn kurs manbai hali O'zbekistonda keng shakllanmagan — ko'pchilik hamon ijtimoiy tarmoqdagi tarqoq e'lonlar orqali kurs qidiradi.",
  },
  {
    q: "Onlayn kurslarni O'zbekistonda qayerdan topish mumkin?",
    a: "Kurslarni qanday izlash mumkinligi haqida batafsil qo'llanma Darslinker blogida bor. Yo'nalish bo'yicha (IT, sun'iy intellekt, dizayn, marketing) kurslarni Darslinker platformasida ko'rish mumkin.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "O'zbekistonda onlayn ta'lim bozori: 2026-yil raqamlari",
      description:
        "Internet qamrovi, uzbekcoders.uz (Coursera) foydalanuvchi statistikasi, global onlayn ta'lim bozori hajmi, davlat raqamli ko'nikmalar dasturlari va IT Park statistikasi asosida O'zbekistonda onlayn ta'lim bozorining hozirgi holati tahlil qilingan.",
      datePublished: "2026-08-20",
      dateModified: "2026-08-20",
      inLanguage: "uz-UZ",
      author: { "@type": "Organization", name: "Darslinker.uz" },
      publisher: {
        "@type": "Organization",
        name: "Darslinker.uz",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
      },
      mainEntityOfPage: url,
    },
    {
      "@type": "ItemList",
      name: "O'zbekistonning raqamli ko'nikmalar dasturlari (2026)",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Raqamli O'zbekiston-2030", description: "AI asosidagi dasturiy mahsulot va xizmatlar hajmini $1,5 mlrd ga yetkazish (PF-6079, 2020-10-05)" },
        { "@type": "ListItem", position: 2, name: "Bir million dasturchi", description: "2,5 million kishini xalqaro IT sertifikatiga yetkazish (2025-2026), uzbekcoders.uz orqali" },
        { "@type": "ListItem", position: 3, name: "Besh million sun'iy intellekt yetakchilari", description: "2026 yilda 500 ming, 2035 yilga qadar 5 million kishini AI ko'nikmalariga o'qitish" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Asosiy", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: "Onlayn ta'lim bozori 2026", item: url },
      ],
    },
  ],
};

const internetRows = [
  { yil: "2021", ulush: "76,6%" },
  { yil: "2022", ulush: "83,9%" },
  { yil: "2023", ulush: "89%" },
  { yil: "2024", ulush: "93,3%" },
  { yil: "2025 (yanvar–avgust)", ulush: "94,2%" },
];

const bozorRows = [
  { korsatkich: "Bozor hajmi (2026)", qiymat: "≈$389 mlrd", manba: "Custom Market Insights" },
  { korsatkich: "Bozor hajmi (2025 → 2035 prognoz)", qiymat: "$324 mlrd → $2 039 mlrd", manba: "Custom Market Insights" },
  { korsatkich: "Yillik o'sish sur'ati (CAGR)", qiymat: "20,2% (2026–2035)", manba: "Custom Market Insights" },
];

const dasturRows = [
  { dastur: "Raqamli O'zbekiston-2030", maqsad: "AI asosidagi dasturiy mahsulot va xizmatlar hajmini $1,5 mlrd ga yetkazish", manba: "PF-6079-son farmon, 2020-10-05" },
  { dastur: "Bir million dasturchi", maqsad: "2,5 mln kishini xalqaro IT sertifikatiga, 30 ming kishini professional sertifikatga yetkazish (2025–2026)", manba: "gov.uz" },
  { dastur: "Besh million AI yetakchilari", maqsad: "2026 yilda 500 ming, 2035 yilgacha jami 5 mln kishini AI ko'nikmalariga o'qitish", manba: "12news.uz, 2026-01" },
];

const courseraRows = [
  { korsatkich: "Faol foydalanuvchilar", qiymat: "1,4 million", manba: "gov.uz" },
  { korsatkich: "Talaba-yoshlar ulushi", qiymat: "90%", manba: "gov.uz" },
  { korsatkich: "Ayollar ulushi", qiymat: "50%", manba: "gov.uz" },
  { korsatkich: "Professional IT sertifikat ro'yxati o'sishi (2024)", qiymat: "+206%", manba: "gov.uz" },
  { korsatkich: "IT Park uchun ajratilgan litsenziyalar", qiymat: "1 000 ta", manba: "gov.uz" },
];

const itParkRows = [
  { korsatkich: "Jami rezidentlar", qiymat: "2 384 ta (2024, 3-chorak)", manba: "IT Park hisoboti" },
  { korsatkich: "Xorijga xizmat ko'rsatuvchi kompaniyalar", qiymat: "936 ta (yillik +170%)", manba: "IT Park hisoboti" },
  { korsatkich: "Rezidentlar xodimlari", qiymat: "36 300 kishi (2023 oxiridan +10 ming)", manba: "IT Park hisoboti" },
  { korsatkich: "Yangi eksport rezidentlari", qiymat: "267 ta kompaniya (2025, sentabr–noyabr)", manba: "Spot.uz, 2025-12-10" },
  { korsatkich: "Rejalashtirilgan yangi ish o'rinlari", qiymat: "6 500 dan ortiq (xorijiy rezidentlar, 2026 oxirigacha)", manba: "Spot.uz, 2025-12-10" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="bg-white min-h-screen">
        <article className="max-w-[760px] mx-auto px-5 md:px-6 py-10 md:py-14">
          <nav className="text-[13px] text-[#7c8490] mb-5">
            <Link href="/" className="hover:text-[#16181a]">Asosiy</Link>
            <span className="mx-2">›</span>
            <Link href="/blog" className="hover:text-[#16181a]">Blog</Link>
            <span className="mx-2">›</span>
            <span className="text-[#16181a]">Onlayn ta&apos;lim bozori 2026</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-08-20">20-avgust, 2026</time> · Yangilangan: 2026-08 · O&apos;quvchilar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              O&apos;zbekistonda onlayn ta&apos;lim bozori: 2026-yil raqamlari
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              O&apos;zbekistonda internetdan foydalanuvchilar ulushi 2025-yil avgust holatida <strong>94,2%</strong>ga yetdi (Davlat statistika qo&apos;mitasi), davlatning Coursera bilan hamkorlikdagi <strong>uzbekcoders.uz</strong> platformasida esa <strong>1,4 million</strong> faol foydalanuvchi ro&apos;yxatdan o&apos;tgan — shundan 90%i talaba-yoshlar. Global onlayn ta&apos;lim bozori 2026-yilda <strong>$389 mlrd</strong>ga baholanib, yiliga ~20% o&apos;smoqda. Infratuzilma ham, foydalanuvchi talabi ham bor — lekin bitta davlat dasturidan tashqarida tizimli, xususiy onlayn kurs bozori O&apos;zbekistonda hali shakllanish bosqichida.
            </p>
          </section>

          {/* Section 1: internet infra */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">O&apos;zbekistonda internet infratuzilmasi onlayn ta&apos;lim uchun yetarlimi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Ha, texnik ma&apos;noda — deyarli to&apos;liq qamrov. Davlat statistika qo&apos;mitasining uy xo&apos;jaliklari so&apos;rovi natijalariga ko&apos;ra (
              <a href="https://uz.kursiv.media/uz/2025-09-30/ozbekistonda-internetdan-foydalanuvchilar-soni-94-foizdan-oshdi/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Kursiv.media, 2025-09-30</a>
              ), internetdan foydalanuvchilar ulushi besh yil ichida deyarli 18 foiz punktga o&apos;sdi:
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Yil</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Internetdan foydalanuvchilar ulushi</th>
                  </tr>
                </thead>
                <tbody>
                  {internetRows.map((r) => (
                    <tr key={r.yil} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.yil}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.ulush}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Bu — shunchaki &ldquo;internet bor&rdquo; degani. Butun bozor bo&apos;yicha onlayn ta&apos;lim iste&apos;moli haqida rasmiy, yig&apos;ma o&apos;lchov O&apos;zbekiston uchun hali yo&apos;q — lekin bitta yirik, raqamlari e&apos;lon qilingan platforma statistikasi bor, u quyida ko&apos;rsatilgan.
            </p>
          </section>

          {/* Section 2: global market */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Global onlayn ta&apos;lim bozori qanday o&apos;sib bormoqda?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Tahlilchilar orasida aniq raqam farq qiladi — bozor ta&apos;rifiga qarab baholash o&apos;zgaradi — lekin tendensiya bir xil: tez o&apos;sish.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Ko&apos;rsatkich</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Qiymat</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Manba</th>
                  </tr>
                </thead>
                <tbody>
                  {bozorRows.map((r) => (
                    <tr key={r.korsatkich} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.korsatkich}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.qiymat}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.manba}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Manba: <a href="https://www.custommarketinsights.com/report/e-learning-market/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Custom Market Insights</a>. Bu — xalqaro bozor ko&apos;rsatkichi; O&apos;zbekistonga tegishli alohida segment hisob-kitobi rasman e&apos;lon qilinmagan, lekin quyida shunga eng yaqin turadigan mahalliy raqam bor.
            </p>
          </section>

          {/* Section 2b: uzbekcoders.uz / Coursera */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">O&apos;zbekistonda onlayn kurs qanchalik iste&apos;mol qilinmoqda?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Bu savolga eng yaqin javob — davlatning Coursera bilan hamkorlikdagi <strong>uzbekcoders.uz</strong> platformasi statistikasi. Bu yagona keng ko&apos;lamli, raqamlari e&apos;lon qilingan onlayn ta&apos;lim loyihasi (
              <a href="https://gov.uz/oz/digital/news/view/28934" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">gov.uz</a>
              ):
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Ko&apos;rsatkich</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Qiymat</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Manba</th>
                  </tr>
                </thead>
                <tbody>
                  {courseraRows.map((r) => (
                    <tr key={r.korsatkich} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.korsatkich}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.qiymat}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.manba}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mt-4">
              206% o&apos;sish — bitta yilda (2024) — shu paytgacha O&apos;zbekistonda onlayn kurs iste&apos;moli haqida topilgan eng aniq talab signali. Lekin bu bitta, davlat homiylik qilgan platformaga tegishli raqam; xususiy onlayn kurs bozori haqida shunga o&apos;xshash yig&apos;ma statistika hali yo&apos;q.
            </p>
          </section>

          {/* Section 3: government programs */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Davlat raqamli ko&apos;nikmalarga qancha e&apos;tibor qaratmoqda?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Uchta dastur bir-birini davom ettiradi — strategiyadan ommaviy o&apos;qitishgacha:
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Dastur</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Maqsad</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Manba</th>
                  </tr>
                </thead>
                <tbody>
                  {dasturRows.map((r) => (
                    <tr key={r.dastur} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.dastur}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.maqsad}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.manba}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mt-4">
              To&apos;liq matn: <a href="https://www.norma.uz/oz/qonunchilikda_yangi/raqamli_uzbekiston-2030_strategiyasi_qabul_qilindi" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Norma.uz</a> (Raqamli O&apos;zbekiston-2030), <a href="https://gov.uz/oz/yoshlar/sections/view/28106" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">gov.uz</a> (Bir million dasturchi), <a href="https://12news.uz/earn/ozbekiston-5-million-nafar-suniy-intellekt-yetakchisini-tayyorlashni-rejalashtirmoqda/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">12news.uz</a> (Besh million AI yetakchilari).
            </p>
          </section>

          {/* Section 4: IT Park */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">IT Park o&apos;sishi ish bozoriga qanday ta&apos;sir qilmoqda?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Rezidentlar soni va eksport hajmi bir vaqtda o&apos;smoqda — bu esa yangi kadrga bo&apos;lgan talabni ham oshiradi:
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Ko&apos;rsatkich</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Qiymat</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Manba</th>
                  </tr>
                </thead>
                <tbody>
                  {itParkRows.map((r) => (
                    <tr key={r.korsatkich} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.korsatkich}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.qiymat}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.manba}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              To&apos;liq hisobot: <a href="https://www.it-park.uz/uz/itpark/news/o-zbekistondan-eksport-geografiyasi-78-mamlakatga-kengaydi-3-chorak-yakunlari" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">IT Park, 3-chorak yakunlari</a> va <a href="https://www.spot.uz/oz/2025/12/10/exporting-company" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Spot.uz, 2025-12-10</a>.
            </p>
          </section>

          {/* Section 5: synthesis */}
          <section className="mb-10 bg-[#f8f9fa] rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Bu raqamlar birga nimani ko&apos;rsatadi?</h2>
            <p className="text-[15.5px] text-[#16181a] leading-relaxed">
              Beshta fakt bitta yo&apos;nalishga ishora qiladi. Internet endi texnik to&apos;siq emas — aholining 94,2%i ulangan. uzbekcoders.uz&apos;dagi 1,4 million foydalanuvchi va 2024-yilda professional sertifikatga yozilishning 206%ga o&apos;sishi — talab allaqachon real ekanini ko&apos;rsatadi. Davlat &ldquo;Bir million dasturchi&rdquo; va &ldquo;Besh million AI yetakchilari&rdquo; kabi dasturlar bilan yana millionlab kishini raqamli ko&apos;nikmalarga o&apos;qitishni rejalashtirmoqda. IT Park rezidentlari esa minglab yangi ish o&apos;rnini — shu jumladan mahalliy kadr talab qiladigan o&apos;rinlarni — ochmoqda. Global onlayn ta&apos;lim bozori esa allaqachon $389 mlrd ga yetib, yiliga 20% o&apos;smoqda — ya&apos;ni bu modelning o&apos;zi ishlashi allaqachon isbotlangan. Ammo bularning barchasini bog&apos;laydigan, tizimli va ishonchli onlayn kurs manbai O&apos;zbekistonda hali keng tarqalmagan — ko&apos;pchilik hamon{" "}
              <Link href="/blog/kurslarni-qayerdan-topish-mumkin" className="text-[#7ea2d4] hover:underline">ijtimoiy tarmoqdagi tarqoq e&apos;lonlar orqali kurs qidiradi</Link>
              . Talab ham, infratuzilma ham tayyor — bo&apos;shliq shu ikkisini bog&apos;laydigan qismda.
            </p>
          </section>

          {/* Honest caveats */}
          <section className="mb-10 bg-[#fff8f0] border border-[#f0e0cc] rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Nimani hisobga olish kerak?</h2>
            <ul className="space-y-2.5">
              {[
                "O'zbekiston uchun xususiy onlayn kurs bozori hajmi bo'yicha rasmiy hisobot yo'q — 1,4 million foydalanuvchi raqami faqat bitta davlat homiylik qiladigan platformaga (uzbekcoders.uz) tegishli, butun bozorga emas",
                "Global bozor raqamlari ($389 mlrd, 2026) tahlilchiga qarab farq qiladi — bozor ta'rifi (korporativ + akademik + K-12) manbadan manbaga o'zgaradi, bu yerda bitta manba (Custom Market Insights) izchil keltirilgan",
                "IT Park va davlat dasturlaridagi raqamlar (5 mln kishi, 6 500 ish o'rni) — rejalashtirilgan maqsadlar, allaqachon erishilgan yakuniy natija emas",
                "94,2% internet qamrovi — foydalanish imkoniyati, onlayn kursni tugatish yoki muntazam foydalanish darajasi haqida emas",
              ].map((f, i) => (
                <li key={i} className="text-[15px] text-[#16181a]/80 flex items-start gap-2">
                  <span className="text-[#c9922f] mt-0.5">▲</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Tez-tez beriladigan savollar</h2>
            <FaqList items={faqs} />
          </section>

          {/* CTA */}
          <section className="border-t border-[#e4e7ea] pt-10">
            <p className="text-[15.5px] text-[#16181a]/75 mb-3">
              Raqamlar shuni ko&apos;rsatadiki, raqamli ko&apos;nikma o&apos;rganish endi ixtiyoriy emas — standart talabga aylanmoqda. Qaysi kasb qanday maosh berishi haqida{" "}
              <Link href="/blog/ai-qaysi-kasblarni-ozgartiryapti" className="text-[#7ea2d4] hover:underline">AI kasblarni qanday o&apos;zgartirayotgani</Link>{" "}
              bilan, kurs tanlashda nimaga qarash kerakligi esa{" "}
              <Link href="/blog/kursni-qanday-tanlash-7-mezon" className="text-[#7ea2d4] hover:underline">7 mezon qo&apos;llanmasi</Link>{" "}
              bilan ko&apos;rish mumkin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kurslar/g/it"
                className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                IT kurslarini ko&apos;rish →
              </Link>
              <Link
                href="/kurslar/g/suniy-intellekt"
                className="inline-flex items-center gap-2 border-2 border-[#e4e7ea] hover:border-[#16181a] text-[#16181a] rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                AI kurslarini ko&apos;rish →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
