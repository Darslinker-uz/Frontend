import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const site = "https://darslinker.uz";
const slug = "ozbekistonda-qaysi-kurslarga-talab-yuqori";
const url = `${site}/blog/${slug}`;
const title = "O‘zbekistonda qaysi kurslarga talab yuqori? Darslinker tahlili (2026)";
const description = "Rus tili birinchi o‘rinda: Darslinker’da har to‘rtinchi ariza shu yo‘nalishga tushgan. 25 yo‘nalish bo‘yicha jadval va mamlakat miqyosidagi rasmiy raqamlar.";

const cover = "/images/blog-covers/qaysi-kurslarga-talab-yuqori-1536x1024.jpg";
const coverAlt = "“Eng talabgir kurslar” infografikasi: rus tili, ingliz tili va matematika bo‘yicha ko‘rishlar va arizalar ulushi";

const statUz = "https://talimxabarlari.uz/73004/";
const efEpi = "https://kun.uz/en/news/2026/01/27/ef-epi-ranks-uzbekistan-among-countries-with-low-english-proficiency";
const ieltsKun = "https://kun.uz/en/news/2024/12/14/uzbekistan-sees-fivefold-growth-in-ielts-success-among-youth";
const epsTopik = "https://gov.uz/oz/migration/news/view/171091";
const milliySertifikat = "https://kun.uz/news/2026/09/22/milliy-sertifikat-imtihonlariga-royxatdan-otish-tartibi-ozgardi";
const onaTili = "https://gov.uz/en/uzbmb/news/view/100788";
const germaniya = "https://www.gazeta.uz/oz/2026/09/14/work-in-germany/";
const trendsTillar = "https://trends.google.com/trends/explore?date=today%2012-m&geo=UZ&q=%2Fm%2F06b_j,%2Fm%2F02h40lc,%2Fm%2F02hwhyv,%2Fm%2F0jzc,%2Fm%2F04306rv";

export const metadata: Metadata = {
  title: { absolute: "Qaysi kurslarga talab yuqori? 2026 tahlili | Darslinker.uz" },
  description,
  alternates: { canonical: url },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "article", locale: "uz_UZ", siteName: "Darslinker.uz", url, title, description,
    publishedTime: "2026-10-12", modifiedTime: "2026-10-12",
    images: [{ url: `${site}${cover}`, width: 1536, height: 1024, alt: coverAlt }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${site}${cover}`] },
};

// Manba: Darslinker.uz production bazasi, 2026-07-11 — 2026-10-11.
// Ko'rishlar: view_events (2 385 ta), arizalar: leads (220 ta). Ulushlar shu jamiga nisbatan.
const yonalishlar = [
  ["1", "Rus tili", "19,7%", "25,9%"],
  ["2", "Matematika", "12,5%", "9,1%"],
  ["3", "Ingliz tili", "11,1%", "8,6%"],
  ["4", "Nemis tili", "9,5%", "5,5%"],
  ["5", "Kimyo", "5,9%", "7,7%"],
  ["6", "Koreys tili", "5,4%", "6,8%"],
  ["7", "IELTS", "5,1%", "5,5%"],
  ["8", "Arab tili", "4,9%", "5,9%"],
  ["9", "Biologiya", "4,7%", "3,6%"],
  ["10", "Ona tili", "4,2%", "4,1%"],
  ["11", "Kompyuter savodxonligi", "3,1%", "3,6%"],
  ["12", "Robototexnika", "2,0%", "1,4%"],
  ["—", "Qolgan 13 yo‘nalish", "12,0%", "12,3%"],
];

const guruhlar = [
  ["Tillar (xorijiy tillar va ona tili)", "61,6%", "64,5%"],
  ["Akademik fanlar", "27,3%", "25,9%"],
  ["IT va dasturlash", "8,3%", "7,3%"],
  ["Kasbiy ko‘nikmalar", "1,4%", "0,5%"],
  ["Dizayn va san’at", "1,0%", "1,8%"],
  ["Marketing va SMM", "0,3%", "0%"],
];

const konversiya = [
  ["Rus tili", "12,2"],
  ["Kimyo", "12,1"],
  ["Koreys tili", "11,6"],
  ["Arab tili", "11,1"],
  ["Ingliz tili", "7,2"],
  ["Matematika", "6,7"],
  ["Nemis tili", "5,3"],
];

const topilmalar = [
  "Rus tili ikkala o‘lchovda ham birinchi: e’lon ko‘rishlarining 19,7 foizi va arizalarning 25,9 foizi.",
  "Ingliz tili alohida olganda uchinchi (11,1%), IELTS va CEFR bilan birga esa ikkinchi (16,4%).",
  "Har o‘nta ko‘rishdan oltitasi til kurslariga to‘g‘ri keladi: tillar guruhi — 61,6 foiz.",
  "Akademik fanlar ikkinchi yirik guruh (27,3%); ichida matematika yetakchi.",
  "IT va dasturlash guruhi 8,3 foiz oldi, eng ko‘p ko‘rilgani — kompyuter savodxonligi.",
];

const faqs = [
  { q: "O‘zbekistonda eng ko‘p qaysi kurs izlanadi?", a: "Darslinker.uz platformasining 2026-yil 11-iyuldan 11-oktabrgacha bo‘lgan ma’lumotiga ko‘ra, birinchi o‘rinda rus tili: e’lon ko‘rishlarining 19,7 foizi va kursga qoldirilgan arizalarning 25,9 foizi shu yo‘nalishga to‘g‘ri keldi. Keyingi o‘rinlarda matematika (12,5%) va ingliz tili (11,1%). Mamlakat bo‘yicha kurs yo‘nalishlari reytingini rasmiy idoralar e’lon qilmaydi." },
  { q: "Ingliz tili nega birinchi o‘rinda emas?", a: "Ingliz tili e’lonlari ko‘rishlarning 11,1 foizini oldi. IELTS (5,1%) va CEFR (0,2%) tayyorlov kurslari qo‘shib hisoblansa, ingliz tili bilan bog‘liq yo‘nalishlar 16,4 foizga yetadi va rus tilidan keyin ikkinchi o‘ringa chiqadi. Platformada ingliz tili bo‘yicha faol e’lonlar rus tilidagidan ko‘p (9 ta va 4 ta), lekin rus tili e’lonlari 1,8 barobar ko‘p ko‘rilgan." },
  { q: "IT kurslariga talab qanchalik?", a: "IT va dasturlash guruhi Darslinker’dagi ko‘rishlarning 8,3 foizini va arizalarning 7,3 foizini oldi. Guruh ichida eng ko‘p ko‘rilgani kompyuter savodxonligi (3,1%) va robototexnika (2,0%); backend, frontend va Data Science yo‘nalishlarining har biri 1,5 foizdan kam." },
  { q: "Akademik fanlarga talab qanday?", a: "Darslinker’da matematika, kimyo va biologiya birgalikda ko‘rishlarning 23,1 foizini oldi. Mamlakat miqyosida ham hajm katta: Bilim va malakalarni baholash agentligi ma’lumotiga ko‘ra, 2025-yil sentabr–dekabrda milliy sertifikat imtihonlarida 255 217 kishi qatnashgan, 2026-yilning shu davriga esa 496 303 ta o‘rin ajratilgan." },
  { q: "Bu raqamlar butun O‘zbekistonga tegishlimi?", a: "Foizlar faqat Darslinker.uz’ga kirgan foydalanuvchilarga tegishli: 3 oyda 2 385 ta e’lon ko‘rilishi va 220 ta ariza. Mamlakat miqyosidagi raqamlar maqolada alohida jadvalda, rasmiy manbalar bilan berilgan. Hududlar bo‘yicha taqsimot hisoblanmagan, shuning uchun viloyatingizdagi manzara boshqacha bo‘lishi mumkin." },
  { q: "Ko‘rish va ariza o‘rtasida qanday farq bor?", a: "Ko‘rish — foydalanuvchi kurs e’loni sahifasini ochgani; bir sessiyada bir e’lon bir marta sanaladi. Ariza — foydalanuvchi shu kursga ismi va telefon raqamini qoldirgani. Ko‘rish qiziqishni, ariza esa o‘qishga tayyorlikni ko‘rsatadi, shu sabab ikkala ko‘rsatkich jadvalda yonma-yon berilgan." },
  { q: "Bu ma’lumotdan o‘z maqolamda foydalansam bo‘ladimi?", a: "Ha. Raqamlarni manbani ko‘rsatgan holda keltirish mumkin: “Darslinker.uz tahlili, 2026-yil 11-iyul — 11-oktabr” va shu sahifaga havola. Ulushlar platforma ichidagi ko‘rishlar va arizalarga nisbatan hisoblangani ham qayd etilsa, o‘quvchi raqamni to‘g‘ri tushunadi." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting", "@id": `${url}#article`, headline: title, description,
      mainEntityOfPage: url, inLanguage: "uz-UZ", datePublished: "2026-10-12", dateModified: "2026-10-12",
      image: { "@type": "ImageObject", url: `${site}${cover}`, width: 1536, height: 1024 },
      author: { "@type": "Organization", name: "Darslinker.uz", url: site },
      publisher: { "@type": "Organization", name: "Darslinker.uz", url: site, logo: { "@type": "ImageObject", url: `${site}/icon-512.png` } },
      citation: [milliySertifikat, onaTili, statUz, efEpi, ieltsKun, epsTopik, germaniya, trendsTillar],
    },
    {
      "@type": "ItemList",
      name: "Darslinker.uz’da eng ko‘p ko‘rilgan kurs yo‘nalishlari (2026-yil 11-iyul — 11-oktabr)",
      itemListElement: yonalishlar.slice(0, 12).map((r, i) => ({
        "@type": "ListItem", position: i + 1, name: r[1], description: `E’lon ko‘rishlari ulushi ${r[2]}, arizalar ulushi ${r[3]}`,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Asosiy", item: site },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ] },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-[#16181a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-[960px] px-5 py-10 md:px-8 md:py-14">
        <nav aria-label="Sahifa yo‘li" className="mb-6 flex flex-wrap gap-2 text-sm text-[#7c8490]">
          <Link href="/">Asosiy</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>Qaysi kurslarga talab yuqori</span>
        </nav>
        <header className="mx-auto mb-7 max-w-[760px]">
          <p className="mb-3 text-sm text-[#7c8490]">Darslinker.uz · <time dateTime="2026-10-12">12-oktabr, 2026</time> · Yangilangan: 2026-10 · O‘quvchilar uchun</p>
          <h1 className="text-[32px] font-bold leading-[1.15] tracking-tight md:text-[46px]">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-[#59616c]">Kurs yo‘nalishlari bo‘yicha talab reytingini O‘zbekistonda hech bir rasmiy idora e’lon qilmaydi. Darslinker jamoasi platformadagi 3 oylik ko‘rishlar va arizalarni yo‘nalishlar kesimida hisoblab, mamlakat miqyosidagi ochiq raqamlar bilan yonma-yon qo‘ydi.</p>
        </header>
        <figure className="mb-10">
          <Image src={cover} alt={coverAlt} width={1536} height={1024} sizes="(max-width: 960px) 100vw, 896px" loading="eager" fetchPriority="high" className="h-auto w-full rounded-2xl" />
        </figure>
        <div className="mx-auto max-w-[760px] space-y-10 text-[17px] leading-[1.85] [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-snug [&_p+p]:mt-4 [&_a]:text-[#426a9e] [&_a]:underline [&_a]:underline-offset-4 [&_li]:mb-2">
          <section aria-labelledby="short-answer" className="rounded-xl bg-[#e8f0f9]/60 p-5 md:p-6">
            <h2 id="short-answer">Qisqa javob</h2>
            <p>Darslinker.uz’da 2026-yil 11-iyuldan 11-oktabrgacha eng ko‘p talab <strong>rus tili</strong> kurslariga bo‘ldi: e’lon ko‘rishlarining <strong>19,7 foizi</strong> va arizalarning <strong>25,9 foizi</strong>. Ikkinchi o‘rinda matematika (12,5%), uchinchi o‘rinda ingliz tili (11,1%); IELTS bilan birga hisoblansa, ingliz tili 16,4 foiz bilan ikkinchi o‘ringa chiqadi. Tillar jami ko‘rishlarning 61,6 foizini, akademik fanlar 27,3 foizini, IT va dasturlash 8,3 foizini oldi. Tahlil 2 385 ta ko‘rish va 220 ta arizaga asoslangan.</p>
          </section>

          <section>
            <h2>Tahlilning beshta asosiy topilmasi</h2>
            <ol className="list-decimal pl-5">
              {topilmalar.map(t => <li key={t}>{t}</li>)}
            </ol>
          </section>

          <section>
            <h2>Qaysi yo‘nalishlar eng ko‘p ko‘rilgan va so‘ralgan?</h2>
            <p>Uch oyda platformadagi 25 yo‘nalish bo‘yicha e’lonlar ko‘rilgan. Jadvalda ikki ko‘rsatkich yonma-yon turadi: foydalanuvchilar qaysi yo‘nalishdagi e’lonlarni ochgani va qaysi biriga ariza qoldirgani.</p>
            <div className="overflow-x-auto rounded-xl border border-[#e5e8eb]">
              <table className="w-full min-w-[520px] text-left text-sm leading-relaxed">
                <caption className="p-3 text-left text-[#59616c]">Darslinker.uz’da kurs yo‘nalishlariga talab, 2026-yil 11-iyul — 11-oktabr</caption>
                <thead className="bg-[#e8f0f9]"><tr>{["№", "Yo‘nalish", "Ko‘rishlar ulushi", "Arizalar ulushi"].map(h => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
                <tbody>{yonalishlar.map(row => <tr key={row[1]} className="border-t border-[#e5e8eb]"><td className="p-3 text-[#7c8490]">{row[0]}</td><th scope="row" className="p-3">{row[1]}</th><td className="p-3">{row[2]}</td><td className="p-3">{row[3]}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="!mt-3 text-sm text-[#59616c]">Manba: Darslinker.uz ichki ma’lumoti. Ko‘rishlar jami 2 385 ta, arizalar jami 220 ta; ulushlar shu jamiga nisbatan.</p>
            <p>Rus tili ikkala ko‘rsatkichda ham birinchi, va arizalardagi ulushi ko‘rishlardagidan yuqori: har to‘rtinchi ariza <Link href="/kurslar/rus-tili">rus tili kurslariga</Link> qoldirilgan. Birinchi o‘n ikkitalikdan yettitasi til yo‘nalishi.</p>
            <p>Ingliz tili alohida olganda uchinchi o‘rinda. Lekin platformada u uch yo‘nalishga bo‘lingan: umumiy <Link href="/kurslar/ingliz-tili">ingliz tili</Link> (11,1%), <Link href="/kurslar/ielts">IELTS tayyorlov</Link> (5,1%) va CEFR (0,2%). Uchalasi birga 16,4 foiz ko‘rish va 14,1 foiz ariza beradi, ya’ni rus tilidan keyingi ikkinchi natija.</p>
            <p><Link href="/kurslar/matematika">Matematika</Link>, kimyo va biologiya birgalikda ko‘rishlarning 23,1 foizini oldi. Davr iyul–oktabrga to‘g‘ri keladi, ya’ni o‘quv yili boshlanishi shu oyna ichida; boshqa mavsumda fanlar ulushi boshqacha chiqishi mumkin.</p>
          </section>

          <section>
            <h2>Tillar, fanlar va IT o‘rtasida talab qanday taqsimlangan?</h2>
            <p>Yo‘nalishlar platformadagi oltita guruhga jamlansa, manzara soddalashadi: ko‘rishlarning 61,6 foizi tillarga, 27,3 foizi akademik fanlarga to‘g‘ri keladi.</p>
            <div className="overflow-x-auto rounded-xl border border-[#e5e8eb]">
              <table className="w-full min-w-[520px] text-left text-sm leading-relaxed">
                <caption className="p-3 text-left text-[#59616c]">Yo‘nalish guruhlari bo‘yicha talab, 2026-yil 11-iyul — 11-oktabr</caption>
                <thead className="bg-[#e8f0f9]"><tr>{["Guruh", "Ko‘rishlar ulushi", "Arizalar ulushi"].map(h => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
                <tbody>{guruhlar.map(row => <tr key={row[0]} className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">{row[0]}</th><td className="p-3">{row[1]}</td><td className="p-3">{row[2]}</td></tr>)}</tbody>
              </table>
            </div>
            <p>IT va dasturlash guruhida eng ko‘p ko‘rilgani dasturlash emas, <Link href="/kurslar/kompyuter-savodxonligi">kompyuter savodxonligi</Link> (3,1%) va robototexnika (2,0%). Backend, frontend va Data Science yo‘nalishlarining har biri 1,5 foizdan kam ko‘rish oldi.</p>
            <p>Dizayn, marketing va kasbiy ko‘nikmalar guruhlari birgalikda 2,7 foiz. Bu yo‘nalishlarda platformadagi e’lonlar soni ham kam: SMM bo‘yicha 11-oktabr holatiga bitta faol e’lon bor edi. Shuning uchun past ulushni bozorda talab yo‘qligi deb o‘qib bo‘lmaydi.</p>
          </section>

          <section>
            <h2>Butun O‘zbekiston bo‘yicha ochiq ma’lumotlar nima deydi?</h2>
            <p>Davlat idoralari kurs bozorini yo‘nalishlar bo‘yicha o‘lchamaydi, shuning uchun mamlakat miqyosida tayyor reyting yo‘q. Lekin imtihon va dastur raqamlari ayrim yo‘nalishlardagi talab hajmini ko‘rsatadi. Ular boshqa narsani o‘lchaydi, shu sabab platforma foizlari bilan qo‘shilmagan, alohida jadvalda berilgan.</p>
            <div className="overflow-x-auto rounded-xl border border-[#e5e8eb]">
              <table className="w-full min-w-[560px] text-left text-sm leading-relaxed">
                <caption className="p-3 text-left text-[#59616c]">Yo‘nalishlar bo‘yicha mamlakat miqyosidagi ko‘rsatkichlar</caption>
                <thead className="bg-[#e8f0f9]"><tr>{["Yo‘nalish", "Ko‘rsatkich", "Manba"].map(h => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
                <tbody>
                  <tr className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">Ta’lim xizmatlari</th><td className="p-3">2026-yil yanvar–aprelda o‘sish sur’ati 122,6%</td><td className="p-3"><a href={statUz}>Milliy statistika qo‘mitasi</a></td></tr>
                  <tr className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">Akademik fanlar</th><td className="p-3">Milliy sertifikat: 2025-yil sentabr–dekabrda 11 ta imtihonda 255 217 kishi qatnashgan; 2026-yilning shu davriga 15 ta imtihon uchun 496 303 ta o‘rin ajratilgan</td><td className="p-3"><a href={milliySertifikat}>Bilim va malakalarni baholash agentligi, Kun.uz, 22.09.2026</a></td></tr>
                  <tr className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">Ona tili</th><td className="p-3">2025-yil noyabrdagi ona tili va adabiyot milliy sertifikat imtihonida 88 mingdan ortiq kishi qatnashgan</td><td className="p-3"><a href={onaTili}>Bilim va malakalarni baholash agentligi, 10.11.2025</a></td></tr>
                  <tr className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">Ingliz tili</th><td className="p-3">EF EPI 2025: 123 davlat ichida 104-o‘rin, 429 ball (2024-yilda 98-o‘rin, 439 ball)</td><td className="p-3"><a href={efEpi}>Kun.uz, 27.01.2026</a></td></tr>
                  <tr className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">IELTS</th><td className="p-3">2024-yilda 53 mingga yaqin kishi 5.5 va undan yuqori ball oldi — 2020-yilga nisbatan 5 barobar ko‘p</td><td className="p-3"><a href={ieltsKun}>British Council va IDP ma’lumoti, Kun.uz</a></td></tr>
                  <tr className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">Koreys tili</th><td className="p-3">EPS-TOPIK 2026: 8 158 kishi ro‘yxatdan o‘tdi, 6 468 kishi imtihon topshirdi, 1 878 kishi o‘tdi</td><td className="p-3"><a href={epsTopik}>Migratsiya agentligi, 26.05.2026</a></td></tr>
                  <tr className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">Nemis tili</th><td className="p-3">2026-yil sentabr: Germaniyada qurilish sohasida 200 ta ish o‘rni, nomzodlarga 8 oylik bepul nemis tili kursi (A1 dan B1 gacha)</td><td className="p-3"><a href={germaniya}>Migratsiya agentligi, Gazeta.uz, 14.09.2026</a></td></tr>
                </tbody>
              </table>
            </div>
            <p>Akademik fanlardagi talab hajmi shu yerda ko‘rinadi: 2025-yilning to‘rt oyida milliy sertifikat imtihonlarida 255 217 kishi qatnashgan, 2026-yilning shu davriga esa 496 303 ta o‘rin ajratilgan. Darslinker’da matematika, kimyo va biologiyaning yuqori o‘rinlarda turishi shu manzaraga mos.</p>
            <p>Ingliz tili bo‘yicha ikki raqam bir-biriga zid emas. IELTS’dan yuqori ball olganlar besh barobar ko‘paygan, ayni paytda mamlakatning umumiy darajasi EF reytingida pasaygan. Ya’ni imtihonga tayyorlanadiganlar soni o‘syapti, lekin umumiy daraja hali past.</p>
            <p>Koreys tilida imtihon topshirgan 6 468 kishidan 1 878 nafari o‘tgan, bu 29 foiz. Nemis tilida esa talabni mehnat migratsiyasi dasturlari qo‘llab turibdi: Migratsiya agentligi e’lonida til kursi ish taklifining bir qismi sifatida berilgan.</p>
            <p>Rus tili va arab tili kurslariga talabni o‘lchaydigan rasmiy raqam topilmadi. Rus tili bo‘yicha mamlakat miqyosidagi yagona ochiq signal — qidiruvlar: <a href={trendsTillar}>Google Trends ma’lumotiga ko‘ra</a>, O‘zbekistonda oxirgi 12 oyda rus tili mavzusiga qiziqish ingliz tili mavzusidagidan 1,3 barobar yuqori bo‘lgan. Bu ko‘rsatkich tarjima va darslik so‘rovlarini ham o‘z ichiga oladi, lekin yo‘nalishi platformadagi tartib bilan bir xil.</p>
          </section>

          <section>
            <h2>Ko‘p ko‘rilgan yo‘nalishga ko‘p ariza ham tushadimi?</h2>
            <p>Har doim emas. Har 100 ta ko‘rishga to‘g‘ri keladigan arizalar soni yo‘nalishdan yo‘nalishga ikki barobardan ko‘p farq qiladi. Platforma bo‘yicha o‘rtacha ko‘rsatkich — 100 ta ko‘rishga 9,2 ta ariza.</p>
            <div className="overflow-x-auto rounded-xl border border-[#e5e8eb]">
              <table className="w-full min-w-[420px] text-left text-sm leading-relaxed">
                <caption className="p-3 text-left text-[#59616c]">Har 100 ta e’lon ko‘rilishiga to‘g‘ri keladigan arizalar (100 dan ortiq ko‘rilgan yo‘nalishlar)</caption>
                <thead className="bg-[#e8f0f9]"><tr>{["Yo‘nalish", "100 ko‘rishga ariza"].map(h => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
                <tbody>{konversiya.map(row => <tr key={row[0]} className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">{row[0]}</th><td className="p-3">{row[1]}</td></tr>)}</tbody>
              </table>
            </div>
            <p>Rus tili, kimyo, <Link href="/kurslar/koreys-tili">koreys tili</Link> va <Link href="/kurslar/arab-tili">arab tili</Link> e’lonlarini ochganlar o‘rtachadan ko‘proq ariza qoldirgan. <Link href="/kurslar/nemis-tili">Nemis tili</Link> esa teskari holat: ko‘rishlar bo‘yicha to‘rtinchi o‘rinda (9,5%), lekin 100 ta ko‘rishga 5,3 ta ariza — jadvaldagi eng past natija.</p>
            <p>Taklif bilan solishtirish ham shuni ko‘rsatadi. 11-oktabr holatiga platformada ingliz tili bo‘yicha 9 ta, rus tili bo‘yicha 4 ta faol e’lon bor edi. Shunga qaramay rus tili e’lonlari uch oyda 1,8 barobar ko‘p ko‘rilgan.</p>
          </section>

          <section>
            <h2>Tahlil qanday o‘tkazildi va qanday cheklovlari bor?</h2>
            <p>Platforma qismi Darslinker.uz bazasidagi ikki turdagi yozuvga asoslangan, davr — 2026-yil 11-iyuldan 11-oktabrgacha. Mamlakat qismi rasmiy e’lonlar va ochiq manbalardan olingan.</p>
            <ul className="list-disc pl-5">
              <li><strong>Ko‘rish</strong> — kurs e’loni sahifasi brauzerda ochilgani. Bir sessiyada bir e’lon bir marta sanaladi. Jami 2 385 ta.</li>
              <li><strong>Ariza</strong> — foydalanuvchi kursga ismi va telefon raqamini qoldirgani. Bir telefon raqamidan bir e’longa bitta ariza sanaladi. Jami 220 ta.</li>
              <li><strong>Ulush</strong> — yo‘nalishdagi ko‘rishlar yoki arizalar sonining jami songa nisbati. Guruhlar platformadagi kategoriya guruhlari bo‘yicha jamlangan.</li>
            </ul>
            <p>Raqamlarni o‘qishda to‘rt narsani hisobga olish kerak:</p>
            <ol className="list-decimal pl-5">
              <li>Foizlar Darslinker’ga kirgan odamlarga tegishli. Kursni faqat Telegram yoki tanishlar orqali topadigan auditoriya hisobda yo‘q.</li>
              <li>Ko‘rishlar taklifga bog‘liq. E’lon bo‘lmagan yo‘nalishni ko‘rib ham, unga ariza qoldirib ham bo‘lmaydi.</li>
              <li>Tanlanma kichik. 220 ta arizada bir yo‘nalishga tushgan 2–3 ta ariza ulushni 1 foiz punktga o‘zgartiradi. Ro‘yxatning quyi qismidagi o‘rinlarni qat’iy reyting deb olmang.</li>
              <li>Hududlar bo‘yicha kesim hisoblanmagan. Shahar va viloyatlarda yo‘nalishlar tartibi boshqacha bo‘lishi mumkin.</li>
            </ol>
          </section>

          <section>
            <h2>Kurs tanlayotgan odam va o‘quv markazi uchun bu nimani anglatadi?</h2>
            <p>Talab yuqori yo‘nalishda tanlov ham ko‘p bo‘ladi, lekin bu sizga aynan shu kurs kerak degani emas. Raqamlar boshqalar nimani izlayotganini ko‘rsatadi; o‘zingizga mos kursni maqsad, daraja va jadval hal qiladi. Tanlashda nimaga qarash kerakligi <Link href="/blog/kursni-qanday-tanlash-7-mezon">kurs tanlashning 7 mezoni</Link> maqolasida, ingliz tiliga ketadigan vaqt esa <Link href="/blog/ingliz-tilini-noldan-organish-qancha-vaqt-oladi">ingliz tilini noldan o‘rganish muddati</Link> haqidagi maqolada yozilgan.</p>
            <p>O‘quv markazlari uchun jadvalning foydali tomoni boshqa. Nemis tili kabi ko‘p ko‘rilib, kam ariza olayotgan yo‘nalishlarda e’lonning o‘zi — narx, jadval va dars formati qanchalik aniq yozilgani — qayta ko‘rib chiqishga arziydi. Bozorning umumiy raqamlari <Link href="/blog/onlayn-talim-bozori-2026">onlayn ta’lim bozori tahlilida</Link> jamlangan.</p>
            <p><Link href="/">Darslinker.uz</Link> — O‘zbekistonda kurslar, o‘quv markazlari va repetitorlarni topishga yordam beradigan ta’lim platformasi. Jadvaldagi yo‘nalishlar bo‘yicha e’lonlarni shu yerda solishtirib, markazga to‘g‘ridan-to‘g‘ri ariza qoldirish mumkin.</p>
            <div className="!mt-5 flex flex-wrap gap-3">
              <Link href="/kurslar/rus-tili" className="inline-flex items-center rounded-xl bg-[#16181a] px-5 py-3 text-[15px] font-semibold !text-white !no-underline">Rus tili kurslarini ko‘rish →</Link>
              <Link href="/kurslar/ingliz-tili" className="inline-flex items-center rounded-xl border-2 border-[#e5e8eb] px-5 py-3 text-[15px] font-semibold !text-[#16181a] !no-underline">Ingliz tili kurslari →</Link>
              <Link href="/kurslar/g/tillar" className="inline-flex items-center rounded-xl border-2 border-[#e5e8eb] px-5 py-3 text-[15px] font-semibold !text-[#16181a] !no-underline">Barcha til kurslari →</Link>
            </div>
          </section>

          <section>
            <h2>Ko‘p so‘raladigan savollar</h2>
            <div className="space-y-6">{faqs.map(f => <div key={f.q}><h3 className="mb-2 text-lg font-semibold">{f.q}</h3><p>{f.a}</p></div>)}</div>
          </section>

          <section className="border-t border-[#e5e8eb] pt-6 text-sm text-[#59616c]">
            <h2>Manbalar va iqtibos keltirish</h2>
            <p>Platforma raqamlari Darslinker.uz bazasidan 2026-yil 11-oktabrda olingan; tashqi manbalar 12-oktabrda tekshirilgan. Raqamlardan manbani ko‘rsatgan holda foydalanish mumkin: “Darslinker.uz tahlili, 2026-yil 11-iyul — 11-oktabr” va shu sahifaga havola.</p>
            <ul className="mt-3 list-disc pl-5">
              <li><a href={milliySertifikat}>Kun.uz — milliy sertifikat imtihonlari, 22.09.2026</a></li>
              <li><a href={onaTili}>Bilim va malakalarni baholash agentligi — ona tili va adabiyot imtihoni, 10.11.2025</a></li>
              <li><a href={statUz}>Talimxabarlari.uz — ta’lim xizmatlari hajmi, Milliy statistika qo‘mitasi ma’lumoti, 07.06.2026</a></li>
              <li><a href={efEpi}>Kun.uz — EF EPI 2025 reytingi, 27.01.2026</a></li>
              <li><a href={ieltsKun}>Kun.uz — IELTS natijalari, British Council va IDP ma’lumoti, 14.12.2024</a></li>
              <li><a href={epsTopik}>Migratsiya agentligi — EPS-TOPIK 2026 natijalari, 26.05.2026</a></li>
              <li><a href={germaniya}>Gazeta.uz — Germaniyadagi ish o‘rinlari, 14.09.2026</a></li>
              <li><a href={trendsTillar}>Google Trends — O‘zbekiston, oxirgi 12 oy, til mavzulari</a></li>
            </ul>
          </section>
        </div>
      </article>
    </main>
  );
}
