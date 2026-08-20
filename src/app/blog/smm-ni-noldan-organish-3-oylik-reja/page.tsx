import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/smm-ni-noldan-organish-3-oylik-reja`;

export const metadata: Metadata = {
  title: "SMM'ni noldan o'rganish: 3 oylik reja (2026) | Darslinker",
  description:
    "SMM'ni noldan o'rganish uchun 3 oylik amaliy reja: 1-oy asos, 2-oy AI vositalar va reklama testi, 3-oy portfolio va birinchi mijoz. hh.uz talablari asosida.",
  keywords: [
    "SMM ni noldan o'rganish",
    "SMM 3 oylik reja",
    "SMM qanday o'rganiladi",
    "SMM mutaxassisi bo'lish",
    "SMM o'rganish O'zbekiston",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  {
    q: "SMM'ni noldan necha oyda o'rganish mumkin?",
    a: "Boshlang'ich (3-5 mln so'm) lavozimga yetish uchun 2-4 oy izchil amaliyot va 3-5 ta real portfolio ishi odatda yetarli — bu hh.uz va GorodRabot.uz'dagi vakansiya talablaridan kelib chiqadigan xulosa (batafsil: SMM mutaxassisi qancha ishlaydi tahlili). Bu maqoladagi 3 oylik reja aynan shu muddatga mo'ljallangan: oxirgi oyda portfolio va birinchi mijoz bilan yakunlanadi.",
  },
  {
    q: "Portfolio uchun aniq nima kerak?",
    a: "3-5 ta real ish namunasi — o'zingizning yoki bepul/arzon ishlagan mahalliy biznesning Instagram yoki Telegram sahifasi, o'sish statistikasi (obunachi, qamrov, so'rovlar soni) bilan birga. Faqat dizayn maketlari yoki \"portfolio sayti\" hh.uz'dagi ko'pchilik e'lon uchun yetarli emas — ish beruvchilar o'lchanadigan natija so'raydi.",
  },
  {
    q: "Pullik kurs shart, yoki o'zi o'rgansa bo'ladimi?",
    a: "Asoslarni bepul manbalardan (platformalarning o'z yordam markazlari, YouTube) o'rganish mumkin, lekin tuzilgan dastur va amaliy nazorat vaqtni qisqartiradi — ayniqsa reklama kabinetlari va analitika bo'yicha, chunki bu yerda xato qimmatga tushadi (real pul sarflanadi). Darslinker'da SMM yo'nalishidagi kurslarni ko'rish mumkin.",
  },
  {
    q: "O'rganish uchun reklama byudjeti kerakmi?",
    a: "Ha, targeting'ni real sinash uchun kamida kichik test byudjeti kerak: Toshkentda odatiy amaliyot — kuniga $5-10, 7-14 kun davomida bitta kampaniyani sinash (uzneo.uz ma'lumoti). Buni 2-oyda, asoslar mustahkamlangandan keyin qilish tavsiya etiladi — pulni bevosita sarflashdan oldin emas.",
  },
  {
    q: "Instagram yoki Telegram — qaysi birini birinchi o'rganish kerak?",
    a: "Ikkalasi ham kerak, lekin ular boshqa mantiqqa ishlaydi. O'zbekistonda Telegram 27 mln, Instagram esa 11 mln faol foydalanuvchiga ega (101digital.uz, 2026), va Telegram Ads narxi (~€0,002/klik) Instagram'nikidan ($0,05-0,25/klik) sezilarli arzon. Shu bilan birga vizual va ehtiyot lidlar uchun Instagram hamon ustunroq. Amaliy reja: 1-oyda ikkalasini ham o'rganib, 2-oyda qaysi biri niша (soha) uchun ishlashini testda aniqlash.",
  },
  {
    q: "Qanday AI vositalarini bilish shart?",
    a: "Uchta vosita boshlang'ich uchun yetarli: matn va kontent-reja uchun ChatGPT yoki Claude, grafika uchun Canva AI (oyiga taxminan 50 ta bepul generatsiya), video montaj uchun CapCut. Bu vositalar ishni tezlashtiradi, lekin strategiya va targeting bilim o'rnini bosmaydi — ish beruvchilar aynan shu ikkinchisini tekshiradi.",
  },
  {
    q: "Birinchi mijozni qayerdan topish mumkin?",
    a: "Uch yo'nalish: (1) hh.uz va ish.uz'dagi \"SMM menejer\" e'lonlariga portfolio bilan murojaat, (2) Telegram'dagi freelance/vakansiya kanallariga (masalan, \"Freelance UZB\" turidagi guruhlarga) e'lon qoldirish, (3) mahalliy kichik biznesga (kafe, do'kon, fitnes zal) bir oy bepul yoki chegirmali ishlab, natijani portfolio sifatida olish. Uchinchisi eng tez portfolio to'ldiradi, birinchisi esa doimiy ishga olib boradi.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "SMM'ni noldan o'rganish: 3 oylik reja (2026)",
      description:
        "SMM'ni noldan o'rganish uchun 3 oylik amaliy reja: 1-oy asos, 2-oy AI vositalar va reklama testi, 3-oy portfolio va birinchi mijoz. O'zbekiston bozori uchun moslashtirilgan.",
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
      "@type": "HowTo",
      name: "SMM'ni noldan o'rganish: 3 oylik reja",
      description: "Nol tajribadan boshlab birinchi SMM mijoz yoki ishga qadar 3 bosqichli amaliy reja.",
      totalTime: "P3M",
      step: [
        {
          "@type": "HowToStep",
          name: "1-oy: asoslar",
          text: "Instagram va Telegram platforma mantig'i, kontent reja tuzish, hashtag va analitika asoslari o'rganiladi. Maqsad — platformalarni tushunish, hali reklama kabinetiga tegilmaydi.",
        },
        {
          "@type": "HowToStep",
          name: "2-oy: vositalar va test",
          text: "ChatGPT/Claude, Canva AI, CapCut kabi AI vositalar ishga tushiriladi; kichik byudjetli ($5-10/kun) reklama testi sinaladi; targeting asoslari amaliyotda mustahkamlanadi.",
        },
        {
          "@type": "HowToStep",
          name: "3-oy: portfolio va mijoz",
          text: "3-5 ta real ish namunasi to'planadi (o'z sahifasi yoki mahalliy biznes bilan), so'ngra hh.uz, ish.uz va Telegram freelance kanallari orqali birinchi mijoz yoki ish topiladi.",
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
        { "@type": "ListItem", position: 3, name: "SMM'ni noldan o'rganish: 3 oylik reja", item: url },
      ],
    },
  ],
};

const rejaRows = [
  { oy: "1-oy", maqsad: "Platforma va kontent asoslari", vazifalar: "Instagram + Telegram mantig'ini o'rganish, kontent-reja tuzish, hashtag va asosiy analitika (qamrov, saqlash, bosishlar)", natija: "10-15 ta o'z postingi, platforma metrikalarini o'qiy olish" },
  { oy: "2-oy", maqsad: "AI vositalar va reklama testi", vazifalar: "ChatGPT/Claude, Canva AI, CapCut'ni ish jarayoniga qo'shish; $5-10/kun byudjet bilan bitta targeting testi (7-14 kun)", natija: "Bitta yakunlangan reklama testi + natija hisoboti" },
  { oy: "3-oy", maqsad: "Portfolio va birinchi mijoz", vazifalar: "3-5 ta real ish namunasi yig'ish (o'z sahifasi yoki mahalliy biznes), hh.uz/ish.uz va Telegram kanallariga murojaat", natija: "Portfolio tayyor + birinchi mijoz yoki ish suhbati" },
];

const platformaRows = [
  { nomi: "Telegram", foydalanuvchi: "27 mln", reklamaNarxi: "~€0,002 / klik", tavsiya: "1-2 post/kun" },
  { nomi: "Instagram", foydalanuvchi: "11 mln", reklamaNarxi: "$0,05-0,25 / klik", tavsiya: "4-5 post/hafta + kunlik Stories" },
];

const vositaRows = [
  { nomi: "ChatGPT / Claude", vazifa: "Kontent-reja, caption, g'oya generatsiyasi", narxi: "Bepul versiya yetarli" },
  { nomi: "Canva AI", vazifa: "Post va banner dizayni", narxi: "Bepul (oyiga ~50 generatsiya)" },
  { nomi: "CapCut", vazifa: "Reels/video montaj", narxi: "Bepul" },
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
            <span className="text-[#16181a]">SMM&apos;ni noldan o&apos;rganish</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-08-20">20-avgust, 2026</time> · Yangilangan: 2026-08 · O&apos;quvchilar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              SMM&apos;ni noldan o&apos;rganish: 3 oylik reja (2026)
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              SMM&apos;ni noldan o&apos;rganib, boshlang&apos;ich (3-5 mln so&apos;m) lavozimga tayyor bo&apos;lish uchun taxminan <strong>2-4 oy</strong> izchil amaliyot va <strong>3-5 ta real portfolio ishi</strong> kifoya. 3 oylik reja: <strong>1-oy</strong> — platforma va kontent asoslari, <strong>2-oy</strong> — AI vositalar bilan ishlab chiqarish va kichik reklama testi ($5-10/kun), <strong>3-oy</strong> — portfolio yig&apos;ish va birinchi mijoz. O&apos;zbekistonda Telegram (27 mln foydalanuvchi) va Instagram (11 mln) ikkalasi ham kerak — lekin har biri boshqa strategiya talab qiladi.
            </p>
          </section>

          {/* Section 1: how long really */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Haqiqatda necha oy kerak?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              2026-yil avgust holatida Toshkentda hh.uz&apos;da 195 ta ochiq &quot;SMM menejer&quot; vakansiyasi bor (
              <a href="https://tashkent.hh.uz/vacancies/smm_menedzher" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">hh.uz</a>
              ) — talab yuqori, lekin ko&apos;pchilik e&apos;lon diplom emas, portfolio so&apos;raydi. Boshlang&apos;ich (3-5 mln so&apos;m) lavozimlar uchun odatda <strong className="text-[#16181a]">2-4 oy izchil amaliyot va 3-5 ta real ish namunasi</strong> yetarli bo&apos;ladi — bu xulosani biz avval{" "}
              <Link href="/blog/smm-mutaxassisi-qancha-ishlaydi" className="text-[#7ea2d4] hover:underline">SMM mutaxassisi qancha ishlaydi tahlilida</Link>{" "}
              batafsil ko&apos;rgan edik. Quyidagi 3 oylik reja aynan shu muddatga mo&apos;ljallangan.
            </p>
          </section>

          {/* Plan table */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">3 oylik reja: umumiy ko&apos;rinish</h2>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Bosqich</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Maqsad</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Asosiy vazifalar</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Kutilgan natija</th>
                  </tr>
                </thead>
                <tbody>
                  {rejaRows.map((r) => (
                    <tr key={r.oy} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.oy}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.maqsad}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.vazifalar}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.natija}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Month 1 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">1-oy: qanday poydevor qo&apos;yiladi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Birinchi oyda maqsad — pul sarflamasdan platforma mantig&apos;ini tushunish. Instagram va Telegram O&apos;zbekistonda boshqa-boshqa auditoriya va narx bilan ishlaydi (
              <a href="https://101digital.uz/uz/blog/ozbekistonda-onlayn-reklama-taqqoslash-google-ads-instagram-telegram-2026/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">101digital.uz, 2026</a>
              ):
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Platforma</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Foydalanuvchi (O&apos;zbekiston)</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Reklama narxi</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Kontent tavsiyasi</th>
                  </tr>
                </thead>
                <tbody>
                  {platformaRows.map((r) => (
                    <tr key={r.nomi} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.nomi}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.foydalanuvchi}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.reklamaNarxi}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.tavsiya}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Bitta amaliy qoida ham bor: mahalliy auditoriyaga yetish uchun kontentning <strong className="text-[#16181a]">80-85%i o&apos;zbek tilida</strong> bo&apos;lishi tavsiya etiladi (101digital.uz). 1-oy oxirigacha shaxsiy yoki kelishilgan sahifada kamida 10-15 ta post joylab, qamrov va saqlash ko&apos;rsatkichlarini o&apos;qishni o&apos;rganish kifoya — hali reklama kabinetiga tegish shart emas.
            </p>
          </section>

          {/* Month 2 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">2-oy: AI vositalar va reklama testini qanday sinab ko&apos;rish kerak?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Ikkinchi oyda ishlab chiqarish tezlashadi va birinchi pul sarflanadigan test qo&apos;shiladi. Uchta AI vosita boshlang&apos;ich uchun yetarli:
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Vosita</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Vazifa</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Narxi</th>
                  </tr>
                </thead>
                <tbody>
                  {vositaRows.map((r) => (
                    <tr key={r.nomi} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.nomi}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.vazifa}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.narxi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Shu bilan birga birinchi targeting testi qilinadi: Toshkentda odatiy amaliyot — kuniga <strong className="text-[#16181a]">$5-10 byudjet bilan 7-14 kun</strong> bitta kampaniyani sinash (
              <a href="https://uzneo.uz/uz/blog/skolko-stoit-smm-v-tashkente-2026" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">uzneo.uz</a>
              ). Bu bosqichning maqsadi katta natija emas — reklama kabineti, auditoriya sozlamalari va hisobotni amalda tushunish.
            </p>
          </section>

          {/* Month 3 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">3-oy: portfolio va birinchi mijozni qanday topish kerak?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Uchinchi oyning yagona maqsadi — 1 va 2-oydagi ishni <strong className="text-[#16181a]">3-5 ta ko&apos;rsatiladigan natijaga</strong> aylantirish: obunachi o&apos;sishi, qamrov, kelgan so&apos;rovlar soni. Eng tez yo&apos;l — mahalliy kichik biznesga (kafe, do&apos;kon, fitnes zal) bir oy bepul yoki chegirmali ishlab, real raqam olish.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Portfolio tayyor bo&apos;lgach, uchta yo&apos;nalishda qidiruv boshlanadi: hh.uz va ish.uz&apos;dagi &quot;SMM menejer&quot; e&apos;lonlariga to&apos;g&apos;ridan-to&apos;g&apos;ri murojaat, Telegram&apos;dagi freelance/vakansiya kanallariga e&apos;lon qoldirish, va mavjud mijozdan tavsiya so&apos;rash. Ko&apos;pchilik boshlovchi aynan shu 3-oy yakunida birinchi pullik ishga yoki ish suhbatiga chiqadi.
            </p>
          </section>

          {/* Risks */}
          <section className="mb-10 bg-[#fff8f0] border border-[#f0e0cc] rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Nimalarga e&apos;tibor berish kerak?</h2>
            <ul className="space-y-2.5">
              {[
                "Reklama byudjetini 1-oyda emas — asoslar mustahkamlangan 2-oyda sarflash tavsiya etiladi, aks holda pul tajriba yo'qligi tufayli behuda ketadi",
                "AI vositalar (ChatGPT, Canva AI, CapCut) ishni tezlashtiradi, lekin strategiya va targeting bilimi o'rnini bosmaydi — ish beruvchilar aynan shuni tekshiradi",
                "Faqat Instagram'ga e'tibor qaratish xato: Telegram O'zbekistonda 27 mln foydalanuvchi bilan kattaroq va reklamasi arzonroq",
                "\"Portfolio\" sifatida faqat dizayn maketlarini ko'rsatish yetarli emas — o'lchanadigan natija (o'sish, so'rov soni) bo'lishi shart",
                "3 oylik reja o'rtacha muddat — real vaqt kunlik sarflanadigan soatga bog'liq; kam vaqt bilan reja cho'zilishi tabiiy",
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
              SMM boshlang&apos;ich lavozimlarda qancha to&apos;lanishi va qaysi ko&apos;nikmalar maoshni oshirishi haqida{" "}
              <Link href="/blog/smm-mutaxassisi-qancha-ishlaydi" className="text-[#7ea2d4] hover:underline">SMM mutaxassisi qancha ishlaydi tahlili</Link>{" "}
              bilan, tuzilgan dastur va amaliy nazorat orqali tezroq o&apos;rganish uchun esa quyidagi kurslar bilan tanishish mumkin.
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
                Digital marketing kurslarini ko&apos;rish →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
