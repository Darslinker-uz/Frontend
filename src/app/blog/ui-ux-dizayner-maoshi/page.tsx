import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/ui-ux-dizayner-maoshi`;

export const metadata: Metadata = {
  title: "UI/UX dizayner maoshi O'zbekistonda (2026) | Darslinker",
  description:
    "Toshkentdagi 22 ta dizayn e'loni qo'lda tahlil qilindi: maosh atigi bittasida ochiq, talab bank va fintechdan kelyapti, \"junior\" yorlig'i yo'q. Portfolio uchun 3 oqim qoidasi.",
  keywords: [
    "UI/UX dizayner maoshi",
    "dizayner qancha oladi O'zbekiston",
    "UX designer ish Toshkent",
    "dizayn portfolio talablari",
    "UI UX vakansiya 2026",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  {
    q: "O'zbekistonda UI/UX dizayner qancha maosh oladi?",
    a: "2026-yil 12-avgust holatida ochiq raqam yozilgan dizayn e'lonlari 6 383 670 so'mdan 25 046 200 so'mgacha oraliqda. Pastki chegara — Cobiz'ning Junior Frontend UI/UX Developer o'rni (6 383 670–8 937 000 so'm), yuqori chegara — Raqamli rivojlanish departamentining Senior UX/UI o'rni (25 046 200 so'mdan). Muammo shundaki, Toshkentdagi dizayn e'lonlarining aksariyati raqamni umuman ko'rsatmaydi.",
  },
  {
    q: "Nega dizayn vakansiyalarida maosh yozilmaydi?",
    a: "hh.uz'ning Toshkent ro'yxatidagi 22 ta dizayn o'rnidan faqat bittasida raqam bor — u ham dizayner o'rni emas, PROWEB.UZ'ning \"PRO Design\" kursi spikeri (10 mln so'mdan). UCMG, PAYNET, Xalq Banki, Korzinka, Uzum, Ipotekabank — barchasi maoshni suhbatga qoldirgan. Dasturchi e'lonlari bilan solishtirganda farq sezilarli: xuddi shu ro'yxatdagi frontend o'rinlarida 15–20 mln so'm ochiq yozilgan.",
  },
  {
    q: "UI/UX dizaynerni O'zbekistonda kim yollaydi?",
    a: "Asosan bank va fintech. Toshkentdagi 22 ta dizayn e'lonidan 9 tasi shu sektordan: TBC Operations to'rtta o'rin (Payme mahsulot dizayni yo'nalishi bilan birga), Ipotekabank OTP Group ikkita, shuningdek PAYNET, Xalq Banki va Alif Uzbekistan. Yana 3 tasi marketplace va riteyldan — Uzum Technologies, Korzinka, Uysot. Ya'ni ish beruvchi dizayn studiyasi emas, mahsulot kompaniyasi.",
  },
  {
    q: "Junior dizayner O'zbekistonda ish topa oladimi?",
    a: "To'g'ridan-to'g'ri \"junior UI/UX dizayner\" o'rni Toshkent ro'yxatida yo'q. 22 ta e'londan 14 tasi kamida 3 yil tajriba so'raydi. Topilgan yagona ochiq junior o'rni — Cobiz'ning \"Frontend UI/UX Developer (Junior)\" vakansiyasi, ya'ni dizayn va kod aralashgan gibrid lavozim. Kirish nuqtasi sof dizaynda emas, qo'shni ko'nikma bilan birga turibdi.",
  },
  {
    q: "UI/UX portfolio nimani ko'rsatishi kerak?",
    a: "Talabning yarmidan ko'pi bank, fintech va marketplace'dan kelayotgani portfolio mazmunini belgilaydi: to'lov yoki o'tkazma oqimi, katalog va qidiruv oqimi, ariza yoki ro'yxatdan o'tish formasi. Har bir keys to'rt qavatdan iborat bo'lishi kerak — muammo, qaror va uning sababi, ekranlar, natija. E'lonlar tili ham shuni tasdiqlaydi: 2026-yil 8-iyuldagi Toshkent vakansiyasi \"amalga oshirilgan loyihalar bilan portfolio\" so'raydi, tayyor ekran to'plamini emas.",
  },
  {
    q: "AI dizaynerlarga bo'lgan talabni kamaytiryaptimi?",
    a: "Hozircha yo'q, lekin talab shaklini o'zgartiryapti. Figma'ning 2026-yilgi Design Hiring Study hisobotida rahbarlarning 82 foizi dizaynerga ehtiyoj oshgan yoki o'zgarmagan deb javob bergan, 73 foizi esa AI vositalarini bilish talabi ortganini aytgan. O'zbekistonda buning aniq belgisi bor: TBC Operations Toshkentda \"Conversational Interface Designer\" — suhbat interfeysi dizayneri o'rnini ochgan.",
  },
  {
    q: "GorodRabot va hh.uz'da ko'rsatilgan o'rtacha raqamlarga ishonish mumkinmi?",
    a: "Ehtiyotkorlik bilan. GorodRabot.uz O'zbekiston bo'yicha 962 ta UI/UX vakansiyasi va 14 026 000 so'm o'rtachani ko'rsatadi, lekin sahifadagi minimal va maksimal qiymatlar (10 018 500 va 18 033 200 so'm) bitta ish beruvchining — Free.uz'ning e'loniga aynan mos keladi, u esa Oqqo'rg'on, To'raqo'rg'on, Sherobod, Bulung'ur kabi o'nlab hududlarda takrorlangan. Ya'ni mamlakat o'rtachasi ko'p e'londan emas, bir e'londan hosil bo'lgan.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "O'zbekistonda UI/UX dizayner: maosh, talab va portfolio (2026)",
      description:
        "Toshkentdagi 22 ta ochiq dizayn e'loni qo'lda tahlil qilindi: maoshning ko'rinmasligi, bank va fintech talabi, junior kirish nuqtasi va portfolio uchun uch oqim qoidasi.",
      datePublished: "2026-08-12",
      dateModified: "2026-08-12",
      inLanguage: "uz-UZ",
      author: { "@type": "Organization", name: "Darslinker.uz" },
      publisher: {
        "@type": "Organization",
        name: "Darslinker.uz",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
      },
      mainEntityOfPage: url,
      about: { "@type": "Occupation", name: "UI/UX dizayner" },
    },
    {
      "@type": "Occupation",
      name: "UI/UX dizayner",
      description:
        "Mobil ilova va veb-mahsulotlarning foydalanuvchi interfeysi hamda foydalanish tajribasini loyihalaydigan mutaxassis. O'zbekistonda talabning asosiy qismi bank, fintech va marketplace kompaniyalaridan keladi.",
      occupationLocation: { "@type": "City", name: "Toshkent" },
      skills: "Figma, prototiplash, foydalanuvchi tadqiqoti, dizayn tizimi, mobil va veb interfeys",
      estimatedSalary: [
        {
          "@type": "MonetaryAmount",
          name: "Ochiq raqam ko'rsatilgan dizayn e'lonlari oralig'i (2026-yil 12-avgust)",
          currency: "UZS",
          value: {
            "@type": "QuantitativeValue",
            minValue: 6383670,
            maxValue: 25046200,
            unitText: "MONTH",
          },
        },
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
        { "@type": "ListItem", position: 3, name: "UI/UX dizayner maoshi", item: url },
      ],
    },
  ],
};

const sectorRows = [
  {
    sektor: "Bank va fintech",
    elon: "9 ta",
    kompaniyalar: "TBC Operations (4 o'rin, Payme bilan), Ipotekabank OTP (2), PAYNET, Xalq Banki, Alif Uzbekistan",
  },
  {
    sektor: "IT autsors va studiya",
    elon: "7 ta",
    kompaniyalar: "UCMG, Telecom Soft, Nettosoft, Urban Lab, Way II Management, Idea Concept Group, Digitcore",
  },
  {
    sektor: "Marketplace va riteyl",
    elon: "3 ta",
    kompaniyalar: "Uzum Technologies (Uzum Tezkor), Korzinka, Uysot",
  },
  { sektor: "Davlat va sanoat", elon: "2 ta", kompaniyalar: "Kosmik monitoring markazi, INSON AJ" },
  { sektor: "Ta'lim", elon: "1 ta", kompaniyalar: "PROWEB.UZ (kurs spikeri)" },
];

const salaryRows = [
  {
    lavozim: "Senior UX/UI dizayner",
    kompaniya: "Raqamli rivojlanish departamenti",
    maosh: "25 046 200 so'mdan",
  },
  { lavozim: "UI/UX Designer", kompaniya: "Free.uz", maosh: "10 018 500–18 033 200 so'm" },
  { lavozim: "\"PRO Design\" kursi spikeri", kompaniya: "PROWEB.UZ", maosh: "10 mln so'mdan" },
  {
    lavozim: "Frontend UI/UX Developer (Junior)",
    kompaniya: "Cobiz",
    maosh: "6 383 670–8 937 000 so'm",
  },
  { lavozim: "Grafik & Web Dizayner", kompaniya: "4Prep", maosh: "$500–800 (≈5,9–9,5 mln)" },
];

const experienceRows = [
  { daraja: "3–6 yil tajriba", soni: "13 ta", izoh: "Ro'yxatning yarmidan ko'pi shu guruhda" },
  { daraja: "6+ yil tajriba", soni: "1 ta", izoh: "Idea Concept Group, Senior UI/UX" },
  { daraja: "1–3 yil tajriba", soni: "6 ta", izoh: "Ichida grafik va veb-dizayn o'rinlari ham bor" },
  { daraja: "Tajriba talab qilinmaydi", soni: "2 ta", izoh: "Ikkalasi ham TBC'ning rahbar o'rni — filtr belgisi noto'g'ri" },
  { daraja: "\"Junior\" deb belgilangan", soni: "0 ta", izoh: "Toshkent ro'yxatida umuman uchramaydi" },
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
            <span className="text-[#16181a]">UI/UX dizayner maoshi</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-08-12">12-avgust, 2026</time> · Yangilangan: 2026-08 · O&apos;quvchilar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              O&apos;zbekistonda UI/UX dizayner: maosh, talab va portfolio (2026)
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              2026-yil 12-avgust holatida hh.uz&apos;ning Toshkent ro&apos;yxatida{" "}
              <strong>22 ta dizayn o&apos;rni</strong> ochiq turibdi, lekin ulardan atigi bittasida maosh raqami yozilgan — u ham dizayner emas, dizayn kursi spikeri o&apos;rni. Ochiq raqamlar boshqa manbalarda{" "}
              <strong>6,4 mln so&apos;mdan 25 mln so&apos;mgacha</strong> oraliqda. Talabning eng katta qismi bank va fintechdan kelyapti (22 tadan 9 ta e&apos;lon), 14 tasi kamida 3 yil tajriba so&apos;raydi, &ldquo;junior&rdquo; deb belgilangan sof dizayn o&apos;rni esa bitta ham yo&apos;q.
            </p>
          </section>

          {/* Who hires */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Toshkentda bugun kim dizayner qidiryapti?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              hh.uz&apos;ning Toshkent bo&apos;yicha &ldquo;UX designer&rdquo; so&apos;rovi 56 ta natija beradi, ammo ro&apos;yxatning ko&apos;rinadigan qismidan faqat{" "}
              <strong className="text-[#16181a]">22 tasi haqiqiy dizayn o&apos;rni</strong> — qolganlari dasturchi, product manager va biznes-analitik vakansiyalari. Shu 22 tasini ish beruvchi turi bo&apos;yicha ajratganda manzara aniq bo&apos;ladi.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Sektor</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">E&apos;lon</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Kompaniyalar</th>
                  </tr>
                </thead>
                <tbody>
                  {sectorRows.map((r) => (
                    <tr key={r.sektor} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a] whitespace-nowrap">{r.sektor}</td>
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.elon}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.kompaniyalar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] text-[#7c8490] mt-3">
              Manba:{" "}
              <a href="https://tashkent.hh.uz/vacancies/ux-designer" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">hh.uz Toshkent — UX designer</a>, 2026-yil 12-avgust holatiga qo&apos;lda ajratilgan.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mt-4">
              Bundan bitta amaliy xulosa chiqadi: bu bozorda dizaynerni reklama agentligi emas, mahsulot kompaniyasi yollaydi. TBC Operations bir vaqtning o&apos;zida to&apos;rtta o&apos;rin ochgan — App Design rahbari, Payme mahsulot dizayni rahbari, Middle Product Designer va suhbat interfeysi dizayneri. Ya&apos;ni 22 ta e&apos;lonning 4 tasi bitta fintech guruhiga tegishli.
            </p>
          </section>

          {/* Salary */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">UI/UX dizayner qancha oladi va nega raqam ko&apos;rinmaydi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Yuqoridagi 22 ta e&apos;londan{" "}
              <strong className="text-[#16181a]">faqat bittasida oylik yozilgan</strong> — PROWEB.UZ&apos;ning &ldquo;PRO Design&rdquo; kursi spikeri o&apos;rni, 10 mln so&apos;mdan. Ya&apos;ni Toshkentda dizayn o&apos;rgatish uchun ochiq narx bor, dizayn qilish uchun yo&apos;q.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Taqqoslash uchun: xuddi shu ro&apos;yxatdagi dasturchi o&apos;rinlarida raqam bemalol turibdi — I TECH IT GROUP frontend uchun 15–20 mln so&apos;m, EVENTSOLUTIONS senior iOS uchun 40–50 mln so&apos;m yozgan. Quyidagi jadvalga esa turli manbalardan topilgan, raqami ochiq dizayn e&apos;lonlari yig&apos;ilgan.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Lavozim</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Kompaniya</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Oylik</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryRows.map((r) => (
                    <tr key={`${r.lavozim}-${r.kompaniya}`} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.lavozim}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.kompaniya}</td>
                      <td className="px-4 py-3 font-medium text-[#16181a] whitespace-nowrap">{r.maosh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] text-[#7c8490] mt-3">
              Manbalar:{" "}
              <a href="https://tashkent.gorodrabot.uz/ui_ux_%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%B5%D1%80" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">GorodRabot.uz Toshkent</a>,{" "}
              <a href="https://tashkent.hh.uz/vacancies/ui-ux-web-designer" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">hh.uz</a>{" "}
              va ish-bor.uz, 2026-yil 12-avgust. Dollar summasi Markaziy bankning o&apos;sha kundagi 11 889,95 so&apos;mlik kursida hisoblangan (
              <a href="https://cbu.uz/uz/arkhiv-kursov-valyut/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">cbu.uz</a>
              ).
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mt-4">
              Bu raqamlarni davlat statistikasi bilan yonma-yon qo&apos;yish kerak. Milliy statistika qo&apos;mitasi ma&apos;lumotiga ko&apos;ra 2026-yil yanvar-iyun oylarida Toshkent shahri bo&apos;yicha o&apos;rtacha oylik nominal ish haqi{" "}
              <strong className="text-[#16181a]">12 mln 13,9 ming so&apos;m</strong>, mamlakat bo&apos;yicha 7 mln 91,1 ming so&apos;m bo&apos;lgan (
              <a href="https://stat.uz/uz/matbuot-markazi/qo-mita-yangiliklar/69378-o-zbekiston-respublikasida-o-rtacha-oylik-nominal-hisoblangan-ish-haqi-25-07-2026" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">stat.uz</a>
              ). Junior dizayn o&apos;rni (6,4–8,9 mln) poytaxt o&apos;rtachasidan past, senior o&apos;rni (25 mln) esa undan ikki barobar yuqori.
            </p>
          </section>

          {/* Aggregator inflation */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">&ldquo;962 ta vakansiya&rdquo; raqami nimani anglatadi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              GorodRabot.uz O&apos;zbekiston bo&apos;yicha UI/UX dizayner so&apos;roviga{" "}
              <strong className="text-[#16181a]">962 ta e&apos;lon va 14 026 000 so&apos;m o&apos;rtacha</strong> ko&apos;rsatadi. Sahifadagi minimal va maksimal chegaralar esa 10 018 500 va 18 033 200 so&apos;m.
            </p>
            <div className="bg-[#f8f9fa] rounded-[12px] p-5 mb-3">
              <p className="text-[15.5px] text-[#16181a] leading-relaxed">
                Aynan shu ikki raqam — 10 018 500 va 18 033 200 — bitta ish beruvchining, Free.uz&apos;ning e&apos;lonidagi oraliqqa mos keladi. O&apos;sha e&apos;lon Oqqo&apos;rg&apos;on, To&apos;raqo&apos;rg&apos;on, Sherobod, Bulung&apos;ur, Keles va yana o&apos;nlab hududlar uchun aynan bir xil shartlar bilan takrorlangan. Ya&apos;ni &ldquo;mamlakat o&apos;rtachasi&rdquo; ko&apos;p e&apos;londan emas, bir e&apos;londan hosil bo&apos;lgan.
              </p>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Xuddi shu agregatorning Toshkent sahifasi 70 ta e&apos;lon, 18 965 000 so&apos;m o&apos;rtacha va 50 000 000 so&apos;mlik maksimum ko&apos;rsatadi. Ikki sahifa o&apos;rtasidagi 4,9 mln so&apos;mlik farq bozor holatini emas, ro&apos;yxatga qanday e&apos;lonlar tushganini aks ettiradi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mt-3">
              Shuning uchun maosh kutish agregator o&apos;rtachasidan emas, aniq kompaniyaning aniq e&apos;lonidan qurilishi kerak. Bu maqolada ham o&apos;rtacha raqam asosiy ko&apos;rsatkich sifatida ishlatilmadi.
            </p>
          </section>

          {/* Junior entry */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Junior dizayner uchun kirish nuqtasi bormi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Toshkent ro&apos;yxatidagi 22 ta dizayn e&apos;lonini tajriba talabi bo&apos;yicha ajratganda quyidagi taqsimot chiqadi.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Talab</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">E&apos;lon</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Izoh</th>
                  </tr>
                </thead>
                <tbody>
                  {experienceRows.map((r) => (
                    <tr key={r.daraja} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a] whitespace-nowrap">{r.daraja}</td>
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.soni}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.izoh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mt-4">
              Topilgan yagona ochiq junior o&apos;rni hh.uz&apos;da emas, GorodRabot ro&apos;yxatida turibdi:{" "}
              <strong className="text-[#16181a]">Cobiz — Frontend UI/UX Developer (Junior), 6 383 670–8 937 000 so&apos;m</strong>. Lavozim nomiga e&apos;tibor bering: bu sof dizayn emas, dizayn va kod aralashgan o&apos;rin.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mt-3">
              Bu tasodif emas. Boshlang&apos;ich daraja uchun bozorda ochilgan eshiklar odatda gibrid bo&apos;ladi: dizayn plus verstka, dizayn plus SMM grafikasi, dizayn plus marketing materiallari (masalan Ipotekabank OTP&apos;ning Marketing Designer o&apos;rni). Sof mahsulot dizayni esa uchinchi yildan boshlab ochiladi.
            </p>
          </section>

          {/* Portfolio framework */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Portfolio nimani ko&apos;rsatishi kerak?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              E&apos;lonlar matni portfolio haqida qisqa gapiradi, lekin bir xil gapiradi. 2026-yil 8-iyulda joylashtirilgan Toshkent vakansiyasi &ldquo;2 yildan ortiq tajriba va amalga oshirilgan loyihalar bilan portfolio&rdquo; so&apos;raydi. Free.uz e&apos;loni &ldquo;kamida 2 yil UI/UX yoki grafik dizayn tajribasi, Figma&apos;ni chuqur bilish&rdquo; deb yozgan. ish-bor.uz arxividagi 5 mln so&apos;mlik veb-dizayner e&apos;lonida esa yagona talab sifatida &ldquo;yaxshi portfolio&rdquo; yozilgan.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Ish beruvchilarning tarkibi (9 ta bank va fintech, 3 ta marketplace) portfolio mazmunini ham belgilaydi. Shundan kelib chiqib quyidagi tuzilma ishlaydi — uni <strong className="text-[#16181a]">uch oqim qoidasi</strong> deb atash mumkin.
            </p>
            <div className="rounded-[12px] border border-[#e4e7ea] overflow-hidden mb-4">
              {[
                {
                  n: "1",
                  t: "To'lov yoki o'tkazma oqimi",
                  d: "Payme, PAYNET, Xalq Banki, Alif — bu kompaniyalarning har biri pul harakati ekranlarini quradi. Summa kiritish, tasdiqlash, xatolik holati va cheki bo'lgan to'liq oqim bitta keys uchun yetarli.",
                },
                {
                  n: "2",
                  t: "Katalog va qidiruv oqimi",
                  d: "Uzum, Korzinka, Uysot — mahsulot yoki e'lon ro'yxati, filtr, kartochka va bo'sh natija holati. Filtrni mobil ekranda qanday joylashtirgan bo'lsangiz, aynan shu joyda tajriba ko'rinadi.",
                },
                {
                  n: "3",
                  t: "Ariza yoki ro'yxatdan o'tish formasi",
                  d: "Har bir mahsulotda bor va deyarli hamma joyda yomon ishlaydi. Maydonlar soni, xatolik matnlari, SMS tasdiqlash — bu qism dizaynerning tafsilotga munosabatini eng tez ko'rsatadi.",
                },
              ].map((s) => (
                <div key={s.n} className="flex gap-4 p-5 border-b border-[#e4e7ea] last:border-b-0">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#16181a] text-white flex items-center justify-center text-[14px] font-bold">{s.n}</div>
                  <div>
                    <div className="text-[16px] font-semibold text-[#16181a] mb-1">{s.t}</div>
                    <p className="text-[15px] text-[#16181a]/75 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Har bir keys to&apos;rt qavatdan iborat bo&apos;lishi kerak:{" "}
              <strong className="text-[#16181a]">muammo → qaror va uning sababi → ekranlar → natija</strong>. Uchinchi qavatsiz portfolio rasm to&apos;plamiga aylanadi, ikkinchisisiz esa suhbatda &ldquo;nega bunday qildingiz?&rdquo; savoliga javob qolmaydi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Nima ishlamaydi: mashhur ilovalarning so&apos;ralmagan &ldquo;redizayni&rdquo;, kontekstsiz chiroyli ekranlar va bitta loyihadan 20 ta rasm. Yuqoridagi ro&apos;yxatdagi hech bir kompaniya vizual uslub bo&apos;yicha dizayner qidirmayapti — ularning barchasida tayyor dizayn tizimi bor.
            </p>
          </section>

          {/* AI */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">AI dizaynerni almashtiryaptimi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Raqamlar hozircha buni ko&apos;rsatmayapti. Figma&apos;ning 2026-yilgi Design Hiring Study hisobotida rahbarlarning{" "}
              <strong className="text-[#16181a]">82 foizi</strong> dizaynerga ehtiyoj oshgan yoki avvalgidek qolgan deb javob bergan, 47 foizi esa ehtiyoj aynan oshganini aytgan (
              <a href="https://www.figma.com/blog/why-demand-for-designers-is-on-the-rise/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Figma, 2026</a>
              ).
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              O&apos;zgargani — talab tarkibi. O&apos;sha hisobotda yollovchilarning 73 foizi AI vositalarini bilish talabi ortganini, 79 foizi esa AI mahsulotlarini loyihalash ko&apos;nikmasi zarurligini bildirgan. Senior o&apos;rinlarga talab ortgani 56 foiz, junior o&apos;rin yollayotganlar ulushi esa 25 foiz — bu Toshkentdagi taqsimot bilan bir xil yo&apos;nalishda.
            </p>
            <div className="bg-[#f8f9fa] rounded-[12px] p-5">
              <p className="text-[15.5px] text-[#16181a] leading-relaxed">
                Mahalliy bozorda buning aniq belgisi bor: TBC Operations Toshkentda{" "}
                <strong>Conversational Interface Designer</strong> — suhbat interfeysi dizayneri o&apos;rnini ochgan, Uzum Technologies esa Uzum Tezkor uchun alohida Lead UX/UI Researcher qidiryapti. Ikkala lavozim ham klassik &ldquo;ekran chizuvchi&rdquo; roldan uzoq: biri dialog oqimini, ikkinchisi tadqiqot jarayonini loyihalaydi.
              </p>
            </div>
          </section>

          {/* Risks */}
          <section className="mb-10 bg-[#fff8f0] border border-[#f0e0cc] rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Raqamlarni o&apos;qiyotganda nimani hisobga olish kerak?</h2>
            <ul className="space-y-2.5">
              {[
                "22 ta e'londan 21 tasida maosh yozilmagan — ya'ni raqamni birinchi bo'lib siz aytasiz, tayyor bo'lib boring",
                "Agregator o'rtachalari (14,0 mln va 18,9 mln) bitta ish beruvchining takroriy e'lonlaridan shishib ketishi mumkin",
                "\"Tajriba talab qilinmaydi\" belgisi rahbar o'rinlarida ham uchraydi — bu e'lon filtrining xatosi, taklif emas",
                "Dollardagi taklif ($500–800) so'mdagi o'rta darajali takliflardan past bo'lishi mumkin",
                "E'lonlarning bir qismi soliqqacha, bir qismi qo'lga tegadigan summani ko'rsatadi — suhbatda aniqlash shart",
                "Talabning yarmi bank va fintechga bog'langan: bu sektor investitsiyani qisqartirsa, dizayn o'rinlari birinchi bo'lib yopiladi",
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
              Yuqoridagi uch oqimni portfolioga qo&apos;yish uchun Figma va mahsulot dizayni asoslari kerak bo&apos;ladi. Yo&apos;nalish bo&apos;yicha kurslarni narx, format va manzil bo&apos;yicha solishtirish mumkin:
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 mb-4">
              Kurs tanlashda nimaga qarash kerakligi{" "}
              <Link href="/blog/kursni-qanday-tanlash-7-mezon" className="text-[#7ea2d4] hover:underline">7 ta mezon bo&apos;yicha qo&apos;llanmada</Link> yozilgan, to&apos;lovdan oldin markazni tekshirish tartibi esa{" "}
              <Link href="/blog/ishonchli-oquv-markazni-qanday-tekshirish" className="text-[#7ea2d4] hover:underline">alohida maqolada</Link>. Qo&apos;shni kasblarning raqamlari qiziqtirsa —{" "}
              <Link href="/blog/frontend-dasturchi-maoshi" className="text-[#7ea2d4] hover:underline">frontend dasturchi maoshi</Link> va{" "}
              <Link href="/blog/smm-mutaxassisi-qancha-ishlaydi" className="text-[#7ea2d4] hover:underline">SMM mutaxassisi qancha ishlaydi</Link>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kurslar/ui-ux"
                className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                UI/UX kurslarini ko&apos;rish →
              </Link>
              <Link
                href="/kurslar/g/dizayn"
                className="inline-flex items-center gap-2 border-2 border-[#e4e7ea] hover:border-[#16181a] text-[#16181a] rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Dizayn yo&apos;nalishi →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
