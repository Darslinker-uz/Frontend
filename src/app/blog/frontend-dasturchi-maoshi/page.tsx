import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/frontend-dasturchi-maoshi`;

export const metadata: Metadata = {
  title: "Frontend dasturchi maoshi O'zbekistonda (2026) | Darslinker",
  description:
    "82 ta ochiq e'lon tahlili: Toshkentda frontend dasturchi 5–20 mln so'm oladi. Junior eshigi qanchalik ochiq, dollar va so'm takliflari farqi — 2026 raqamlari.",
  keywords: [
    "frontend dasturchi maoshi",
    "frontend developer maosh O'zbekiston",
    "dasturchi qancha oladi",
    "junior frontend ish",
    "IT maosh Toshkent 2026",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  {
    q: "O'zbekistonda frontend dasturchi qancha maosh oladi?",
    a: "2026-yil 11-avgust holatida hh.uz'da Toshkent bo'yicha maoshi ochiq ko'rsatilgan frontend e'lonlari 2,4 mln so'mdan 20 mln so'mgacha oraliqda turibdi. Middle darajadagi aniq takliflar 15–20 mln so'm (Crowe TAC, I TECH IT GROUP), Angular yo'nalishi 8 mln so'mdan boshlanadi (INNASOFT), dollarda to'laydigan e'lonlar esa $200 dan $1 000 gacha. Bitta o'rtacha raqam bu bozorni ifodalamaydi — farq deyarli sakkiz barobar.",
  },
  {
    q: "Nega turli saytlarda frontend maoshining o'rtachasi har xil ko'rsatiladi?",
    a: "Chunki o'rtacha raqam qidiruv so'zining yozilishiga bog'liq. GorodRabot.uz'da Toshkent bo'yicha \"frontend-разработчик\" so'rovi 14 ta e'lon va 10 802 000 so'm o'rtachani beradi, \"front-end разработчик\" so'rovi esa 277 ta e'lon va 15 525 000 so'm o'rtachani. Bitta defis 4,7 mln so'm farq qiladi. Sabab — agregatorlar kalit so'zga qarab boshqa lavozimlarni ham ro'yxatga qo'shadi.",
  },
  {
    q: "Junior frontend dasturchi O'zbekistonda ish topa oladimi?",
    a: "Eshik tor. 2026-yil 11-avgust holatida hh.uz'da Toshkent bo'yicha \"frontend\" so'rovi 82 ta vakansiya beradi, ammo ochiq \"junior\" deb belgilangan frontend o'rni bittagina — Green White Solutions'dagi Junior Frontend Developer (Angular), u ham 1–3 yil tajriba so'raydi. Ya'ni \"junior\" yorlig'i noldan boshlaganni emas, arzonroq middle'ni anglatadi.",
  },
  {
    q: "Frontend dasturchiga so'mda yoki dollarda to'lashadimi?",
    a: "Ikkalasi ham uchraydi va farq katta. TENZOR SOFT frontend o'rni uchun $200–700 taklif qiladi, bu Markaziy bankning 2026-yil 5-avgustdagi 11 942,21 so'mlik kursida taxminan 2,4–8,4 mln so'm. Shu paytda so'mda to'laydigan Crowe TAC 15–20 mln so'm yozgan. Dollarda e'lon berish avtomatik yuqori maosh degani emas.",
  },
  {
    q: "Frontend maoshi O'zbekistondagi o'rtacha ish haqidan yuqorimi?",
    a: "Middle darajadan boshlab — ha. Milliy statistika qo'mitasi ma'lumotiga ko'ra 2026-yil yanvar-iyun oylarida o'rtacha oylik nominal ish haqi 7 mln 91,1 ming so'm, Toshkent shahri bo'yicha 12 mln 13,9 ming so'm bo'lgan. 15–20 mln so'mlik middle frontend taklifi poytaxt o'rtachasidan sezilarli yuqori. Lekin 5–7 mln so'mlik boshlang'ich o'rinlar shahar o'rtachasidan past turadi.",
  },
  {
    q: "Vakansiyalarda qaysi texnologiyalar so'ralyapti?",
    a: "Toshkentdagi ochiq e'lonlarda eng ko'p uchraydigan to'plam — React, TypeScript va Redux (masalan UCMG'ning \"Frontend Developer (React / TypeScript / Redux Saga)\" o'rni). Angular alohida yo'nalish sifatida ikkita e'londa (INNASOFT va Green White Solutions) uchraydi. WordPress va veb-sayt yig'ish e'lonlari ham bor, lekin ular odatda past maosh guruhida.",
  },
  {
    q: "Nega e'lonlarning ko'pchiligida maosh yozilmagan?",
    a: "hh.uz'ning Toshkent bo'yicha frontend ro'yxatidagi dastlabki 20 ta e'londan faqat 6 tasida maosh ko'rsatilgan. Qolganlari raqamni suhbatga qoldiradi — bu ish beruvchiga nomzodning kutgan raqamini birinchi eshitish imkonini beradi. Amalda bu shuni anglatadiki, o'z raqamingizni oldindan tayyorlab borish kerak.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "O'zbekistonda frontend dasturchi maoshi va talab (2026)",
      description:
        "hh.uz va GorodRabot.uz'dagi ochiq e'lonlar qo'lda tahlil qilindi: frontend dasturchi maoshi, junior o'rinlar holati, so'm va dollar takliflari farqi.",
      datePublished: "2026-08-11",
      dateModified: "2026-08-11",
      inLanguage: "uz-UZ",
      author: { "@type": "Organization", name: "Darslinker.uz" },
      publisher: {
        "@type": "Organization",
        name: "Darslinker.uz",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
      },
      mainEntityOfPage: url,
      about: { "@type": "Occupation", name: "Frontend dasturchi" },
    },
    {
      "@type": "Occupation",
      name: "Frontend dasturchi",
      description:
        "Veb-sayt va ilovalarning foydalanuvchi ko'radigan qismini React, Angular yoki Vue kabi texnologiyalarda ishlab chiqadigan mutaxassis.",
      occupationLocation: { "@type": "City", name: "Toshkent" },
      estimatedSalary: [
        {
          "@type": "MonetaryAmountDistribution",
          name: "Oylik taklif — hh.uz'da maoshi ko'rsatilgan frontend e'lonlari (2026-yil 11-avgust)",
          currency: "UZS",
          duration: "P1M",
          median: 10750000,
          percentile10: 2400000,
          percentile90: 20000000,
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
        { "@type": "ListItem", position: 3, name: "Frontend dasturchi maoshi", item: url },
      ],
    },
  ],
};

const sourceRows = [
  {
    manba: "hh.uz — \"frontend\", Toshkent",
    elon: "82 ta",
    ortacha: "O'rtacha berilmaydi",
    izoh: "Ro'yxatda backend, QA va PM o'rinlari ham aralash",
  },
  {
    manba: "hh.uz — \"frontend developer\", Toshkent",
    elon: "43 ta",
    ortacha: "O'rtacha berilmaydi",
    izoh: "Torroq so'rov, aralashuv kamroq",
  },
  {
    manba: "GorodRabot.uz — \"frontend-разработчик\", Toshkent",
    elon: "14 ta",
    ortacha: "10 802 000 so'm",
    izoh: "Min 2 407 060 — maks 20 000 000 so'm",
  },
  {
    manba: "GorodRabot.uz — \"front-end разработчик\", Toshkent",
    elon: "277 ta",
    ortacha: "15 525 000 so'm",
    izoh: "Min 3 000 000 — maks 35 000 000 so'm",
  },
  {
    manba: "GorodRabot.uz — \"junior frontend\", O'zbekiston",
    elon: "585 ta",
    ortacha: "9 790 000 so'm",
    izoh: "hh.uz'da xuddi shu so'rov Toshkent bo'yicha 7 ta natija beradi",
  },
];

const vacancyRows = [
  { lavozim: "Middle Frontend Developer", kompaniya: "Crowe TAC", maosh: "15–20 mln so'm" },
  { lavozim: "Frontend-разработчик", kompaniya: "I TECH IT GROUP", maosh: "15–20 mln so'm" },
  { lavozim: "Fullstack-разработчик", kompaniya: "BAIK Technologies", maosh: "15 mln so'mdan" },
  { lavozim: "Senior Full Stack Developer (Python)", kompaniya: "ONLY-TOOLS", maosh: "10–20 mln so'm" },
  { lavozim: "React js frontend-разработчик", kompaniya: "ISROILOVA AZIZA", maosh: "$800–1 000 (≈9,6–11,9 mln)" },
  { lavozim: "Angular Frontend-разработчик", kompaniya: "INNASOFT", maosh: "8 mln so'mdan" },
  { lavozim: "Frontend-разработчик", kompaniya: "TENZOR SOFT", maosh: "$200–700 (≈2,4–8,4 mln)" },
  { lavozim: "Full-stack разработчик (AI-assisted)", kompaniya: "ALIFCO", maosh: "5–7 mln so'm" },
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
            <span className="text-[#16181a]">Frontend dasturchi maoshi</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-08-11">11-avgust, 2026</time> · Yangilangan: 2026-08 · O&apos;quvchilar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              O&apos;zbekistonda frontend dasturchi maoshi va talab (2026)
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              2026-yil 11-avgust holatida Toshkentda maoshi ochiq yozilgan frontend e&apos;lonlari{" "}
              <strong>2,4 mln so&apos;mdan 20 mln so&apos;mgacha</strong> oraliqda: middle daraja 15–20 mln so&apos;m, Angular yo&apos;nalishi 8 mln so&apos;mdan, dollarda to&apos;laydigan e&apos;lonlar $200 dan $1 000 gacha. Eng muhim raqam esa boshqa: hh.uz&apos;dagi 82 ta frontend vakansiyasidan{" "}
              <strong>faqat bittasi ochiq &ldquo;junior&rdquo;</strong> deb belgilangan — va u ham 1–3 yil tajriba so&apos;raydi.
            </p>
          </section>

          {/* Original angle: why the averages disagree */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Nega har bir saytda boshqa o&apos;rtacha raqam chiqadi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Chunki o&apos;rtacha maosh kasbga emas, <strong className="text-[#16181a]">qidiruv so&apos;zining yozilishiga</strong> bog&apos;liq. Quyidagi jadval bitta kun ichida, bitta shahar bo&apos;yicha to&apos;plangan — farqni o&apos;zingiz ko&apos;rasiz.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Manba va so&apos;rov</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">E&apos;lon</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">O&apos;rtacha</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Izoh</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceRows.map((r) => (
                    <tr key={r.manba} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.manba}</td>
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.elon}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.ortacha}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.izoh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] text-[#7c8490] mt-3">
              Manba:{" "}
              <a href="https://tashkent.hh.uz/vacancies/frontend-developer" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">hh.uz Toshkent</a>{" "}
              va{" "}
              <a href="https://tashkent.gorodrabot.uz/front-end_%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%87%D0%B8%D0%BA" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">GorodRabot.uz</a>, 2026-yil 11-avgust holatiga qo&apos;lda olingan.
            </p>
            <div className="bg-[#f8f9fa] rounded-[12px] p-5 mt-4">
              <p className="text-[15.5px] text-[#16181a] leading-relaxed">
                Bitta defis — &ldquo;frontend&rdquo; va &ldquo;front-end&rdquo; — o&apos;rtacha raqamni{" "}
                <strong>10,8 mln so&apos;mdan 15,5 mln so&apos;mga</strong>, ya&apos;ni 44 foizga o&apos;zgartiradi. Sabab: keng so&apos;rov ro&apos;yxatga fullstack, backend va hatto loyiha menejeri o&apos;rinlarini ham qo&apos;shib yuboradi.
              </p>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mt-4">
              Shuning uchun bu maqolada o&apos;rtacha raqam asosiy ko&apos;rsatkich sifatida ishlatilmaydi. Uning o&apos;rniga aniq kompaniya, aniq lavozim va aniq raqam beriladi — tekshirib ko&apos;rish mumkin bo&apos;lgan ma&apos;lumot faqat shu.
            </p>
          </section>

          {/* Real listings */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Toshkentda bugun qanday e&apos;lonlar ochiq turibdi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Quyida hh.uz&apos;ning Toshkent ro&apos;yxatidan maoshi ko&apos;rsatilgan e&apos;lonlar to&apos;liq keltirilgan. Tanlab olinmagan — ro&apos;yxatda raqam yozilganlarining hammasi shu.
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
                  {vacancyRows.map((r) => (
                    <tr key={`${r.lavozim}-${r.kompaniya}`} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.lavozim}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.kompaniya}</td>
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.maosh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] text-[#7c8490] mt-3">
              Dollar summalari Markaziy bankning 2026-yil 5-avgustdagi 11 942,21 so&apos;mlik kursi bo&apos;yicha hisoblangan (
              <a href="https://cbu.uz/uz/arkhiv-kursov-valyut/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">cbu.uz</a>
              ). E&apos;lonlarning bir qismi soliqqacha bo&apos;lgan summani ko&apos;rsatadi.
            </p>
          </section>

          {/* Hidden salaries */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Nega e&apos;lonlarning aksariyatida maosh yozilmagan?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              hh.uz ro&apos;yxatining birinchi 20 ta e&apos;lonidan{" "}
              <strong className="text-[#16181a]">faqat 6 tasida raqam bor</strong>. EPAM Uzbekistan, Xalq Banki, UCMG, KEYSOFT, Unitel — barchasi maoshni suhbatga qoldirgan.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Bu tasodif emas: raqamni yashirgan ish beruvchi nomzodning kutgan summasini birinchi eshitadi va shundan kelib chiqib taklif qiladi. Ochiq raqam yozganlar esa odatda tez yopilishi kerak bo&apos;lgan o&apos;rinlar.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Amaliy xulosa: suhbatga borishdan oldin yuqoridagi jadvaldagi aniq raqamlarni yozib oling. &ldquo;Bozor qancha bersa&rdquo; degan javob bu bozorda 5–7 mln so&apos;mlik taklifga olib boradi, 15–20 mln so&apos;mlikka emas.
            </p>
          </section>

          {/* Currency */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Dollarda to&apos;laydigan kompaniya ko&apos;proq beradimi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Yo&apos;q — bu bozorda valyuta maosh darajasining belgisi emas. TENZOR SOFT frontend o&apos;rni uchun{" "}
              <strong className="text-[#16181a]">$200–700</strong> yozgan, bu joriy kursda 2,4–8,4 mln so&apos;m. Shu paytning o&apos;zida so&apos;mda to&apos;laydigan Crowe TAC middle frontend uchun 15–20 mln so&apos;m taklif qilyapti.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Dollar takliflarining yuqori qismi ham unchalik uzoqqa ketmaydi: React yo&apos;nalishidagi $800–1 000 taklifi taxminan 9,6–11,9 mln so&apos;m — bu so&apos;mdagi middle takliflardan past.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Dollar raqami sezilarli o&apos;sadigan yagona joy — xalqaro mijoz bilan ishlaydigan o&apos;rinlar. Xuddi shu ro&apos;yxatdagi Senior Go Developer vakansiyasi (TETRA SECURITY) $3 500 dan boshlanadi. Farqni valyuta emas, mijozning qayerdaligi yaratadi.
            </p>
          </section>

          {/* Junior door — the 2026 story */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Junior uchun eshik qanchalik ochiq?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Tor. Toshkent bo&apos;yicha 82 ta frontend vakansiyasi orasida ochiq &ldquo;Junior&rdquo; deb nomlangan bitta o&apos;rin bor —{" "}
              <strong className="text-[#16181a]">Green White Solutions&apos;dagi Junior Frontend Developer (Angular)</strong>, va u ham e&apos;londa 1–3 yil tajriba so&apos;raydi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Qolgan e&apos;lonlar Middle, Senior yoki tajriba darajasi ko&apos;rsatilmagan o&apos;rinlar. Ya&apos;ni O&apos;zbekiston bozorida &ldquo;junior&rdquo; so&apos;zi ko&apos;pincha noldan boshlaganni emas, arzonroq middle&apos;ni anglatadi.
            </p>
            <div className="bg-[#f8f9fa] rounded-[12px] p-5 mb-3">
              <p className="text-[15.5px] text-[#16181a] leading-relaxed">
                2026-yilning yangi belgisi ham shu ro&apos;yxatda ko&apos;rinadi: ALIFCO kompaniyasi{" "}
                <strong>&ldquo;Full-stack разработчик (AI-assisted)&rdquo;</strong> nomli o&apos;rinni 5–7 mln so&apos;mga e&apos;lon qilgan — bu middle frontend taklifidan (15–20 mln) uch barobar past. Lavozim nomiga AI kiritilishi ish hajmini emas, narxni o&apos;zgartirgan.
              </p>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Bundan kelib chiqadigan amaliy xulosa: birinchi ishga chiqish uchun &ldquo;junior&rdquo; filtri bilan qidirish samarasiz. Kutilayotgan stek — React va TypeScript — bo&apos;yicha ishlab tugatilgan, ochiq havolada turgan loyiha kerak, chunki tajriba talabini faqat ko&apos;rsatib bo&apos;ladigan ish bosib o&apos;tadi.
            </p>
          </section>

          {/* National comparison */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Bu maosh mamlakat o&apos;rtachasi bilan qanday nisbatda?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Milliy statistika qo&apos;mitasi ma&apos;lumotiga ko&apos;ra, 2026-yil yanvar-iyun oylarida O&apos;zbekistonda o&apos;rtacha oylik nominal ish haqi{" "}
              <strong className="text-[#16181a]">7 mln 91,1 ming so&apos;m</strong>, Toshkent shahri bo&apos;yicha esa{" "}
              <strong className="text-[#16181a]">12 mln 13,9 ming so&apos;m</strong> ni tashkil etdi (
              <a href="https://stat.uz/uz/matbuot-markazi/qo-mita-yangiliklar/69378-o-zbekiston-respublikasida-o-rtacha-oylik-nominal-hisoblangan-ish-haqi-25-07-2026" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">stat.uz</a>
              ).
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Bu ikki raqam bilan taqqoslaganda manzara aniq bo&apos;ladi: 15–20 mln so&apos;mlik middle frontend taklifi poytaxt o&apos;rtachasidan 25–66 foiz yuqori. 5–7 mln so&apos;mlik boshlang&apos;ich o&apos;rin esa Toshkent o&apos;rtachasining yarmiga yaqin.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Ya&apos;ni kasbning daromadi kirish nuqtasida emas, ikkinchi-uchinchi bosqichda paydo bo&apos;ladi. Birinchi yil odatda mamlakat o&apos;rtachasi atrofida o&apos;tadi.
            </p>
          </section>

          {/* Demand */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Talab qayerdan kelyapti va u barqarormi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Talabning asosiy manbasi — eksportga ishlaydigan IT kompaniyalari va ularga berilgan soliq rejimi. 2026-yil iyul oyida IT Park rezidentlari xodimlari uchun soliq imtiyozlari{" "}
              <strong className="text-[#16181a]">2040-yilgacha uzaytirildi</strong>, IT viza va Zero Risk dasturlari kengaytirildi (
              <a href="https://www.spot.uz/oz/2026/07/07/tax-incentives" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Spot.uz, 2026-yil 7-iyul</a>
              ).
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Davlat maqsadlari ham e&apos;lon qilingan: 2030-yilga qadar IT eksportini{" "}
              <strong className="text-[#16181a]">5 mlrd dollarga</strong> yetkazish, 5 000 ta faol startap va 2 mlrd dollarlik investitsiya. StartupBlink reytingida O&apos;zbekiston 31 pog&apos;ona ko&apos;tarilgan, Toshkent Markaziy Osiyo shaharlari orasida birinchi o&apos;rinda.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Bu raqamlar vakansiya sonini kafolatlamaydi, lekin bir narsani ko&apos;rsatadi: ish o&apos;rinlari mahalliy iste&apos;molga emas, eksport buyurtmasiga bog&apos;langan. Shuning uchun ingliz tili bu kasbda maoshga texnologiya darajasida ta&apos;sir qiladi.
            </p>
          </section>

          {/* Stack */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Qaysi stek talab qilinyapti?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Ochiq e&apos;lonlar tili aniq: eng ko&apos;p uchraydigan to&apos;plam —{" "}
              <strong className="text-[#16181a]">React, TypeScript va Redux</strong>. UCMG kompaniyasi o&apos;rinni to&apos;g&apos;ridan-to&apos;g&apos;ri &ldquo;Frontend Developer (React / TypeScript / Redux Saga)&rdquo; deb nomlagan.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Angular alohida, kichikroq yo&apos;nalish sifatida saqlanib qolgan — INNASOFT va Green White Solutions e&apos;lonlarida aynan shu talab qilinadi. Ikkalasi ham raqobati kamroq, lekin o&apos;rin soni ham kam.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Uchinchi guruh — WordPress va veb-sayt yig&apos;ish e&apos;lonlari (masalan TRUSS GLOBAL TAS). Ular kirish uchun oson, lekin yuqoridagi jadvalning past qismida turadi va maosh o&apos;sishi tez to&apos;xtaydi.
            </p>
          </section>

          {/* Risks */}
          <section className="mb-10 bg-[#fff8f0] border border-[#f0e0cc] rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Raqamlarni o&apos;qiyotganda nimani hisobga olish kerak?</h2>
            <ul className="space-y-2.5">
              {[
                "Agregator o'rtachalari (10,8 mln va 15,5 mln) bir kunda, bir shaharda olingan — ularga tayanib maosh kutish xato",
                "82 ta e'londan bittasi junior: kirish darajasidagi raqobat vakansiya sonidan ancha yuqori",
                "E'lonlarning bir qismi soliqqacha, bir qismi qo'lga beriladigan summani ko'rsatadi — suhbatda aniqlash shart",
                "Dollardagi taklif ($200–700) so'mdagi middle taklifidan past bo'lishi mumkin — valyuta o'zi hech narsani anglatmaydi",
                "\"AI-assisted\" nomli o'rinlar 2026-yilda past narx bilan paydo bo'ldi (5–7 mln) — lavozim nomini diqqat bilan o'qish kerak",
                "Vakansiyalarning katta qismi eksport buyurtmasiga bog'liq, ya'ni tashqi bozor sekinlashsa e'lon soni ham qisqaradi",
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
              Agar yuqoridagi stek — React va TypeScript — sizga tanish bo&apos;lmasa, keyingi qadam aynan shu yerdan boshlanadi. Yo&apos;nalish bo&apos;yicha kurslarni narx va format bo&apos;yicha solishtirish mumkin:
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 mb-4">
              Kurs tanlashda nimaga qarash kerakligi{" "}
              <Link href="/blog/kursni-qanday-tanlash-7-mezon" className="text-[#7ea2d4] hover:underline">7 ta mezon bo&apos;yicha qo&apos;llanmada</Link> yozilgan, to&apos;lovdan oldin markazni tekshirish tartibi esa{" "}
              <Link href="/blog/ishonchli-oquv-markazni-qanday-tekshirish" className="text-[#7ea2d4] hover:underline">alohida maqolada</Link>. Boshqa kasbning raqamlari qiziqtirsa —{" "}
              <Link href="/blog/smm-mutaxassisi-qancha-ishlaydi" className="text-[#7ea2d4] hover:underline">SMM mutaxassisi qancha ishlaydi</Link>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kurslar/frontend"
                className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Frontend kurslarini ko&apos;rish →
              </Link>
              <Link
                href="/kurslar/react"
                className="inline-flex items-center gap-2 border-2 border-[#e4e7ea] hover:border-[#16181a] text-[#16181a] rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                React kurslari →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
