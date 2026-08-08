import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/smm-mutaxassisi-qancha-ishlaydi`;

export const metadata: Metadata = {
  title: "O'zbekistonda SMM mutaxassisi qancha ishlaydi? (2026) | Darslinker",
  description:
    "195 ta vakansiya asosida: SMM mutaxassisi 2026-da 3-18 mln so'm oladi. Boshlovchi, o'rta va senior daraja, freelance narxlari va milliy o'rtacha ish haqi bilan taqqos.",
  keywords: [
    "SMM mutaxassisi maoshi",
    "SMM menejer qancha oladi",
    "SMM ish haqi O'zbekiston",
    "targetolog maoshi",
    "SMM kasbi 2026",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  {
    q: "SMM mutaxassisi O'zbekistonda qancha maosh oladi?",
    a: "2026-yil avgust holatida hh.uz va GorodRabot.uz e'lonlariga ko'ra Toshkentda SMM mutaxassisi oyiga 3 mln so'mdan 18 mln so'mgacha oladi. Boshlovchi daraja 3-5 mln, tajribali mutaxassis 5-10 mln, katta (senior) darajadagi PR va SMM menejer 15-18 mln so'm. GorodRabot.uz bo'yicha Toshkentdagi o'rtacha taklif 8,3 mln so'm atrofida.",
  },
  {
    q: "Bu maosh O'zbekistondagi o'rtacha ish haqidan yuqorimi?",
    a: "O'rta darajadagi SMM mutaxassisi milliy o'rtacha ish haqiga yaqin turadi. Milliy statistika qo'mitasi ma'lumotiga ko'ra 2026-yil yanvar-iyun oylarida o'rtacha oylik nominal ish haqi 7 mln 91,1 ming so'mni tashkil etdi. Toshkent shahri bo'yicha esa 12 mln 13,9 ming so'm — ya'ni poytaxtda o'rtacha SMM taklifi shahar o'rtachasidan pastroq. Shahar o'rtachasidan oshish uchun senior daraja yoki qo'shimcha mijozlar kerak bo'ladi.",
  },
  {
    q: "Freelance ishlash oylik maoshdan ko'proq beradimi?",
    a: "Ha, lekin barqarorlik hisobiga. Toshkent bozorida bitta brendni to'liq yuritish oyiga taxminan 3-6 mln so'mdan boshlanadi, o'rta darajadagi xizmat 7-15 mln so'm turadi. Ya'ni ikkita barqaror mijoz allaqachon o'rtacha oylik maoshni beradi. Ammo mijoz topish, shartnoma va to'lovni ta'minlash — bularning hammasi sizning zimmangizda bo'ladi.",
  },
  {
    q: "SMM ni o'rganish uchun qancha vaqt kerak?",
    a: "Vakansiyalarda ko'rsatilgan talablarga qarab, boshlang'ich darajaga (3-5 mln so'mlik stajyor o'rinlari) chiqish uchun odatda 2-4 oylik izchil mashq va 3-5 ta real ish namunasi yetarli. 5 mln so'mdan yuqori takliflar deyarli har doim portfolio va o'lchanadigan natija talab qiladi — obunachi o'sishi, arizalar soni yoki reklama xarajatining qaytimi.",
  },
  {
    q: "SMM va targetolog — bir xil kasbmi?",
    a: "Yo'q. SMM mutaxassisi kontent, sahifa yuritish va auditoriya bilan muloqotga javob beradi. Targetolog esa pulli reklamani sozlaydi va byudjetni boshqaradi. Vakansiyalarda bu ikkisi ko'pincha bitta o'ringa birlashtiriladi, va aynan shu birlashgan ko'nikma to'plami maoshni yuqori pog'onaga olib chiqadi.",
  },
  {
    q: "O'zbekistonda SMM ga talab qanchalik katta?",
    a: "DataReportal ma'lumotiga ko'ra 2025-yil oktabr holatida O'zbekistonda 33,1 mln internet foydalanuvchisi (aholining 89,0%) va 14,1 mln ijtimoiy tarmoq profili (37,9%) qayd etilgan. Auditoriya soni va biznesning onlayn kanalga o'tishi vakansiyalar sonida ko'rinadi: 2026-yil avgust holatida faqat hh.uz'da Toshkent bo'yicha 195 ta SMM menejer e'loni ochiq turgan.",
  },
  {
    q: "Viloyatda ishlash mumkinmi yoki Toshkentga ko'chish kerakmi?",
    a: "Masofaviy ishlash bu kasbning asosiy afzalligi. hh.uz'da Samarqand bo'yicha ham 5-10 mln so'mlik takliflar uchraydi. Viloyat ish haqi darajasi bilan taqqoslaganda farq sezilarli: Qashqadaryo viloyatida barcha sohalar bo'yicha o'rtacha ish haqi 4 mln 865 ming so'mni tashkil etadi, ya'ni masofadan ishlaydigan o'rta darajali SMM mutaxassisi hududidagi o'rtachadan yuqori turishi mumkin.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "O'zbekistonda SMM mutaxassisi qancha ishlaydi? (2026)",
      description:
        "hh.uz va GorodRabot.uz vakansiyalari asosida SMM mutaxassisi maoshi: boshlovchi, o'rta va senior daraja, freelance narxlari hamda milliy o'rtacha ish haqi bilan taqqoslash.",
      datePublished: "2026-08-09",
      dateModified: "2026-08-09",
      inLanguage: "uz-UZ",
      author: { "@type": "Organization", name: "Darslinker.uz" },
      publisher: {
        "@type": "Organization",
        name: "Darslinker.uz",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
      },
      mainEntityOfPage: url,
      about: { "@type": "Occupation", name: "SMM mutaxassisi" },
    },
    {
      "@type": "Occupation",
      name: "SMM mutaxassisi",
      description:
        "Ijtimoiy tarmoqlarda brend sahifasini yuritish, kontent tayyorlash, auditoriya bilan muloqot va pulli reklamani boshqarish bilan shug'ullanuvchi mutaxassis.",
      occupationLocation: { "@type": "Country", name: "O'zbekiston" },
      estimatedSalary: [
        {
          "@type": "MonetaryAmountDistribution",
          name: "Oylik taklif (Toshkent, 2026-yil avgust)",
          currency: "UZS",
          duration: "P1M",
          median: 8278000,
          percentile10: 3000000,
          percentile90: 18000000,
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
        { "@type": "ListItem", position: 3, name: "SMM mutaxassisi qancha ishlaydi", item: url },
      ],
    },
  ],
};

const salaryRows = [
  {
    daraja: "Boshlovchi / stajyor",
    maosh: "3–5 mln so'm",
    talab: "Portfolio o'rniga 3–5 ta ish namunasi",
    manba: "hh.uz e'lonlari (qo'lga)",
  },
  {
    daraja: "SMM mutaxassisi",
    maosh: "3–7 mln so'm",
    talab: "Mustaqil kontent va sahifa yuritish",
    manba: "hh.uz e'lonlari (qo'lga)",
  },
  {
    daraja: "SMM / kontent menejer",
    maosh: "5–15 mln so'm",
    talab: "Strategiya, jamoa bilan ishlash, hisobot",
    manba: "hh.uz e'lonlari (soliqqacha)",
  },
  {
    daraja: "Senior PR va SMM menejer",
    maosh: "15–18 mln so'm",
    talab: "Brend darajasidagi javobgarlik, byudjet",
    manba: "hh.uz, EVOS e'loni (soliqqacha)",
  },
];

const freelanceRows = [
  { daraja: "Start", narx: "3–6 mln so'm / oy", ichida: "Sahifa yuritish, cheklangan Reels, mijoz suratlari" },
  { daraja: "Ishchi daraja", narx: "7–15 mln so'm / oy", ichida: "Muntazam Reels, dizayn, Direct javoblari, hisobot" },
  { daraja: "Produksiya bilan", narx: "15–25+ mln so'm / oy", ichida: "Suratga olish kunlari, keng montaj, ko'p format" },
];

const skillRows = [
  { konikma: "Targeting (pulli reklama)", tasir: "Eng katta sakrash — byudjet javobgarligi maoshni yuqori pog'onaga chiqaradi" },
  { konikma: "Video / Reels montaji", tasir: "Produksiya ichkarida bo'lsa, xizmat narxi 2 barobargacha oshadi" },
  { konikma: "Analitika va hisobot", tasir: "\"Obunachi\" emas, \"ariza narxi\" bilan gapira olish — senior belgisi" },
  { konikma: "Ikki tilli kontent", tasir: "O'zbek va rus tilida yuritish alohida qatorda to'lanadi" },
  { konikma: "Marketplace bilan ishlash", tasir: "hh.uz'da alohida \"marketplace menejer\" o'rinlari 10 mln so'mdan boshlanadi" },
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
            <span className="text-[#16181a]">SMM mutaxassisi qancha ishlaydi</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-08-09">9-avgust, 2026</time> · O&apos;quvchilar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              O&apos;zbekistonda SMM mutaxassisi qancha ishlaydi? (2026)
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              2026-yil avgust holatida Toshkentda SMM mutaxassisi oyiga <strong>3 mln so&apos;mdan 18 mln so&apos;mgacha</strong> oladi: boshlovchi daraja 3-5 mln, tajribali mutaxassis 5-10 mln, senior PR va SMM menejer 15-18 mln so&apos;m. GorodRabot.uz bo&apos;yicha Toshkentdagi o&apos;rtacha taklif 8,3 mln so&apos;m — bu milliy o&apos;rtacha ish haqidan (7,09 mln) yuqori, lekin Toshkent shahri o&apos;rtachasidan (12,01 mln) past.
            </p>
          </section>

          {/* Salary table */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Daraja bo&apos;yicha maosh qanday taqsimlangan?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Quyidagi jadval 2026-yil avgust holatida ochiq turgan e&apos;lonlar asosida tuzilgan. Bir raqam emas, oraliq berilgani muhim: bitta kasb nomi ostida bir-biridan uch barobar farq qiladigan o&apos;rinlar yashiringan.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Daraja</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Oylik</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Nima talab qilinadi</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Manba</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryRows.map((r) => (
                    <tr key={r.daraja} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.daraja}</td>
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.maosh}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.talab}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.manba}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] text-[#7c8490] mt-3">
              Manba:{" "}
              <a href="https://tashkent.hh.uz/vacancies/smm_menedzher" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">hh.uz Toshkent</a>{" "}
              (195 ta ochiq e&apos;lon) va{" "}
              <a href="https://tashkent.gorodrabot.uz/smm-%D0%BC%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">GorodRabot.uz</a>{" "}
              (93 ta e&apos;lon, o&apos;rtacha 8 278 000 so&apos;m, oraliq 2 000 000 – 18 028 600 so&apos;m), 2026-yil avgust.
            </p>
          </section>

          {/* The original angle */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Bu ko&apos;p pulmi? Milliy o&apos;rtacha bilan solishtiramiz</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Maosh raqamining o&apos;zi hech narsa aytmaydi — u faqat taqqoslaganda ma&apos;no kasb etadi. Milliy statistika qo&apos;mitasi ma&apos;lumotiga ko&apos;ra, 2026-yil yanvar-iyun oylarida O&apos;zbekistonda o&apos;rtacha oylik nominal ish haqi{" "}
              <strong className="text-[#16181a]">7 mln 91,1 ming so&apos;m</strong> ni tashkil etdi va bir yilda 18,4% ga o&apos;sdi (
              <a href="https://stat.uz/uz/matbuot-markazi/qo-mita-yangiliklar/69378-o-zbekiston-respublikasida-o-rtacha-oylik-nominal-hisoblangan-ish-haqi-25-07-2026" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">stat.uz</a>
              ).
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Toshkent shahrida esa bu ko&apos;rsatkich <strong className="text-[#16181a]">12 mln 13,9 ming so&apos;m</strong>. Eng past hudud — Qashqadaryo viloyati, 4 mln 865 ming so&apos;m.
            </p>
            <div className="bg-[#f8f9fa] rounded-[12px] p-5 mb-3">
              <p className="text-[15.5px] text-[#16181a] leading-relaxed">
                Shundan kelib chiqadigan xulosa reklama va&apos;dalaridan farq qiladi: <strong>o&apos;rta darajadagi SMM mutaxassisi (5-7 mln) mamlakat o&apos;rtachasiga teng keladi, lekin Toshkent o&apos;rtachasidan past turadi.</strong> Poytaxtdagi shahar o&apos;rtachasidan oshish uchun senior darajaga chiqish yoki oylik ustiga qo&apos;shimcha mijoz olish kerak.
              </p>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Taqqoslash uchun: eng yuqori o&apos;rtacha ish haqi bank, sug&apos;urta va kredit sohasida — 19 mln 100 ming so&apos;m. Ya&apos;ni SMM eng daromadli soha emas, lekin unga kirish uchun diplom ham, litsenziya ham talab qilinmaydi. Kasbning asosiy jozibasi shunda.
            </p>
          </section>

          {/* Demand */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Nega bu kasbga talab bor?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Chunki auditoriya allaqachon onlayn, biznes esa uning ortidan endi yetib boryapti. DataReportal ma&apos;lumotiga ko&apos;ra 2025-yil oktabr holatida O&apos;zbekistonda{" "}
              <strong className="text-[#16181a]">33,1 mln internet foydalanuvchisi</strong> (aholining 89,0%) va{" "}
              <strong className="text-[#16181a]">14,1 mln ijtimoiy tarmoq profili</strong> (37,9%) qayd etilgan (
              <a href="https://datareportal.com/reports/digital-2026-uzbekistan" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Digital 2026: Uzbekistan</a>
              ).
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Bu raqamlar vakansiyalarda ko&apos;rinadi: 2026-yil avgust holatida faqat hh.uz&apos;da Toshkent bo&apos;yicha 195 ta SMM menejer e&apos;loni ochiq turgan. Talab ish beruvchi tomonidan ham, mijoz tomonidan ham keladi — ikkinchisi keyingi bo&apos;limda.
            </p>
          </section>

          {/* Freelance */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Freelance oylik maoshdan ko&apos;proq beradimi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Ha — lekin barqarorlik hisobiga. Toshkent bozorida bitta brendni yuritish xizmati quyidagicha narxlanadi:
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Daraja</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Oyiga</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Nima kiradi</th>
                  </tr>
                </thead>
                <tbody>
                  {freelanceRows.map((r) => (
                    <tr key={r.daraja} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.daraja}</td>
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.narx}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.ichida}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Hisob oddiy: <strong className="text-[#16181a]">ikkita o&apos;rta darajadagi mijoz allaqachon Toshkent o&apos;rtacha ish haqini beradi.</strong> Uchtasi — senior vakansiyadan yuqori.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Lekin bu raqamlar ostida ko&apos;rinmaydigan ish bor: mijoz qidirish, shartnoma tuzish, to&apos;lovni undirish va natijani asoslash. Reklama byudjeti odatda alohida qator bo&apos;ladi — test bosqichi ko&apos;pincha 7-14 kun davomida kuniga $5-10 sarflanadi (
              <a href="https://uzneo.uz/uz/blog/skolko-stoit-smm-v-tashkente-2026" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">uzneo.uz, 2026</a>
              ). Bu pul sizniki emas, mijozniki — lekin natija uchun javobgarlik sizda.
            </p>
          </section>

          {/* Skills */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Qaysi ko&apos;nikma maoshni oshiradi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              E&apos;lonlardagi talablarni yuqori va quyi maosh oralig&apos;i bo&apos;yicha ajratganda, farqni beradigan bir necha aniq ko&apos;nikma ko&apos;rinadi:
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Ko&apos;nikma</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Maoshga ta&apos;siri</th>
                  </tr>
                </thead>
                <tbody>
                  {skillRows.map((r) => (
                    <tr key={r.konikma} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.konikma}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.tasir}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mt-4">
              Eng qisqa xulosa: <strong className="text-[#16181a]">byudjetga javob beradigan odam kontent chiqaradigan odamdan qimmatroq turadi.</strong> Shuning uchun SMM va targeting ko&apos;nikmalarini birga o&apos;rganish maoshning yuqori pog&apos;onasiga eng tez yo&apos;l hisoblanadi.
            </p>
          </section>

          {/* Timeline */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Qancha vaqtda birinchi ishga chiqish mumkin?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Vakansiyalardagi talablarga qarab realistik manzara shunday: 3-5 mln so&apos;mlik boshlang&apos;ich o&apos;rinlar diplom emas, <strong className="text-[#16181a]">ish namunasi</strong> so&apos;raydi. Odatda 2-4 oylik izchil mashq va 3-5 ta real keys yetarli bo&apos;ladi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              5 mln so&apos;mdan yuqori takliflar esa deyarli har doim o&apos;lchanadigan natija talab qiladi — obunachi o&apos;sishi emas, balki ariza soni, ariza narxi yoki reklama xarajatining qaytimi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Amaliy maslahat: birinchi keyslarni tanishlaringizning kichik biznesida bepul yoki arzon qiling, lekin natijani raqam bilan yozib boring. Portfolioda &ldquo;chiroyli sahifa yuritdim&rdquo; emas, &ldquo;3 oyda ariza narxini 40 000 so&apos;mdan 18 000 so&apos;mga tushirdim&rdquo; degan gap ishlaydi.
            </p>
          </section>

          {/* Honest risks */}
          <section className="mb-10 bg-[#fff8f0] border border-[#f0e0cc] rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Nimani hisobga olish kerak?</h2>
            <ul className="space-y-2.5">
              {[
                "\"SMM = tez pul\" degan va'da bozor ma'lumotiga to'g'ri kelmaydi — o'rta daraja mamlakat o'rtachasiga teng, ko'proq emas",
                "Raqobat kirish darajasida yuqori: to'siq past bo'lgani uchun boshlovchilar ko'p, ajralib turish portfolio orqali bo'ladi",
                "E'lonlardagi raqamlarning bir qismi \"soliqqacha\", bir qismi \"qo'lga\" — taqqoslashda buni tekshirish kerak",
                "Freelance daromadi barqaror emas: mijoz ketishi bilan oylik nolga tushadi",
                "Reklama platformalari va formatlar tez o'zgaradi — bir marta o'rganib qo'yish yetarli bo'lmaydi",
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
              Agar raqamlar sizga mos kelsa, keyingi qadam — o&apos;rganishni boshlash. Yo&apos;nalish bo&apos;yicha kurslarni narx va format bo&apos;yicha solishtirib ko&apos;rish mumkin:
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 mb-4">
              Kurs tanlashda nimaga qarash kerakligi haqida alohida qo&apos;llanma bor:{" "}
              <Link href="/blog/kursni-qanday-tanlash-7-mezon" className="text-[#7ea2d4] hover:underline">kursni qanday tanlash — 7 mezon</Link>. To&apos;lovdan oldin markazni tekshirish tartibi esa{" "}
              <Link href="/blog/ishonchli-oquv-markazni-qanday-tekshirish" className="text-[#7ea2d4] hover:underline">bu yerda</Link> yozilgan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kurslar/smm"
                className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                SMM kurslarini ko&apos;rish →
              </Link>
              <Link
                href="/kurslar/digital-marketing"
                className="inline-flex items-center gap-2 border-2 border-[#e4e7ea] hover:border-[#16181a] text-[#16181a] rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Digital marketing kurslari →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
