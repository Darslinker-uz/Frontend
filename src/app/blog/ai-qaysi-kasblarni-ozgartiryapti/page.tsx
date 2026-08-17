import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/ai-qaysi-kasblarni-ozgartiryapti`;

export const metadata: Metadata = {
  title: "AI O'zbekistonda qaysi kasblarni o'zgartiryapti? (2026) | Darslinker",
  description:
    "Banklar ovozli AI sinamoqda, Soliq qo'mitasi AI Soliq portalini ishga tushirdi. hh.uz va davlat dasturlari asosida AI qaysi kasblarni o'zgartirayotgani (2026).",
  keywords: [
    "AI kasblarni o'zgartiryapti",
    "sun'iy intellekt ish o'rinlari O'zbekiston",
    "AI qaysi kasblarga tahdid",
    "sun'iy intellekt 2026 O'zbekiston",
    "AI yangi kasblar",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  {
    q: "AI hozircha O'zbekistonda ish o'rinlarini qisqartiryaptimi?",
    a: "Rasman va ommaviy tarzda — yo'q. 2026-yil avgust holatida O'zbekiston bo'yicha AI sabab ish o'rinlari qisqargani haqida rasmiy hisobot yo'q. Lekin aniq belgilar bor: banklar call-markaz uchun ovozli AI'ni sinovdan o'tkazmoqda, Soliq qo'mitasi esa buxgalter va soliq maslahatchisi bajaradigan tushuntirish ishining bir qismini AI Soliq portaliga o'tkazdi (ai.soliq.uz, 2026-yil 29-iyul). Bu hali ommaviy ishdan bo'shatish emas, balki ish vazifalarining sekin qayta taqsimlanishi.",
  },
  {
    q: "Qaysi kasblar AI ta'siriga eng yaqin turibdi?",
    a: "O'zbekistonda aniq signal beradigan uchta yo'nalish: call-markaz operatorlari (banklar ovozli AI sinovida), buxgalter/soliq maslahatchilari (AI Soliq portali tufayli) va tarjimon/kopirayter kabi matn bilan ishlovchi kasblar (Microsoft tadqiqotining global ro'yxatida yuqori o'rinda). Uchalasi ham hozircha to'liq yo'q qilinmayapti — takrorlanuvchi qismi avtomatlashmoqda, murakkab qism odamda qolmoqda.",
  },
  {
    q: "Call-markaz operatori kasbi haqiqatan xavf ostidami?",
    a: "Bu maqoladagi asosiy topilma shu: hh.uz'ning 2026-yil yanvar-fevral tahliliga ko'ra call-markaz operatori O'zbekistonda eng ko'p e'lon beriladigan uchinchi mutaxassislik (5,3% ulush, o'rtacha 7 mln so'm), va aynan shu paytda Kapitalbank, InfinBank, Agrobank, Ipoteka-bank, SQB kabi banklar aynan shu ish o'rnining standart, oddiy so'rovlarga javob berish qismini ovozli AI'ga topshirishni sinamoqda. Ya'ni eng ko'p ishga olinayotgan kasb aynan AI eng oson bajara oladigan vazifalar bilan mos tushmoqda.",
  },
  {
    q: "AI O'zbekistonda qanday yangi kasblar yaratyapti?",
    a: "Mahalliy AI kompaniyalari allaqachon ishga olmoqda: Speko (ovozli AI, Y Combinator 2026 yozgi oqimi ishtirokchisi), NavAI (o'zbek nutqini sintez va tanish), Sino AI (tibbiy diagnostika), FlexAI (chat-bot konstruktori) va Roatify (logistika avtomatizatsiyasi). Bu kompaniyalarga dasturchi, ma'lumot izohlovchi (data annotator) va AI mahsulot mutaxassisi kerak — aksariyati hozircha kichik jamoalar, lekin soni oshib bormoqda.",
  },
  {
    q: "Davlat AI ko'nikmalarini o'rgatish uchun nima qilyapti?",
    a: "2026-yildan boshlab \"Besh million sun'iy intellekt yetakchilari\" loyihasi ishga tushdi — 2026-yilning o'zida 500 ming kishi, 2035-yilga qadar jami 5 million kishi o'qitilishi rejalashtirilgan (\"Bir million dasturchi\" dasturining davomi). Shu bilan birga IT Park 2026-yil yakuniga qadar 300 ta rezidentga, 2 trln so'mlik xizmat hajmiga va 160 mln dollarlik eksportga chiqishni rejalashtirmoqda.",
  },
  {
    q: "AI bilan ishlashni qayerdan o'rganish mumkin?",
    a: "Sun'iy intellekt yo'nalishidagi kurslarni, shu jumladan prompt bilan ishlash va AI vositalaridan foydalanishni o'rgatadigan dasturlarni Darslinker'da ko'rish mumkin. IT asoslarisiz AI vositalaridan samarali foydalanish qiyin bo'lgani uchun ko'p o'quvchi dasturlash yo'nalishidan boshlaydi.",
  },
  {
    q: "Bu o'zgarish qachon sezilarli bo'ladi?",
    a: "Aniq muddat yo'q, lekin sur'atni ko'rsatadigan bitta fakt bor: AI Soliq kabi davlat xizmati loyihadan foydalanuvchi mahsulotga bir necha oy ichida aylandi (2024-yil oktabrdagi strategiyadan 2026-yil iyuldagi ishga tushirilishgacha). Banklardagi ovozli AI hali sinov bosqichida — bu odatda 6-12 oy ichida keng joriy etilishga yoki to'xtatilishga olib keladi.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "AI O'zbekistonda qaysi kasblarni o'zgartiryapti? (2026)",
      description:
        "Banklarning ovozli AI sinovlari, AI Soliq portali, hh.uz vakansiya tahlili va davlat dasturlari asosida O'zbekistonda AI qaysi kasblarni birinchi bo'lib o'zgartirayotgani ko'rsatilgan.",
      datePublished: "2026-08-17",
      dateModified: "2026-08-17",
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
      name: "O'zbekistondagi AI kompaniyalari (2026)",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Speko", description: "Ovozli AI, Y Combinator 2026 yozgi oqimi ishtirokchisi" },
        { "@type": "ListItem", position: 2, name: "NavAI", description: "O'zbek nutqini sintez va tanish tizimlari" },
        { "@type": "ListItem", position: 3, name: "Sino AI", description: "Tibbiy diagnostika uchun AI" },
        { "@type": "ListItem", position: 4, name: "FlexAI", description: "Chat-bot konstruktori" },
        { "@type": "ListItem", position: 5, name: "Roatify", description: "Logistika avtomatizatsiyasi" },
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
        { "@type": "ListItem", position: 3, name: "AI qaysi kasblarni o'zgartiryapti", item: url },
      ],
    },
  ],
};

const kasbRows = [
  { kasb: "Call-markaz operatori", ozgarish: "Banklar oddiy, standart so'rovlar uchun ovozli AI'ni sinamoqda; murakkab va nizoli holatlar odamda qoladi", manba: "Kapitalbank, InfinBank, Agrobank, Ipoteka-bank, SQB (anhor.uz)" },
  { kasb: "Buxgalter / soliq maslahatchisi", ozgarish: "AI Soliq portali soliq reytingi, hisob-faktura sabablari va imtiyozlarni chatda tushuntiradi", manba: "ai.soliq.uz, Soliq qo'mitasi, 2026-07-29" },
  { kasb: "Tarjimon, kopirayter", ozgarish: "Global miqyosda generativ AI'dan eng ko'p ta'sirlanadigan kasblar ro'yxatida yuqori o'rinda", manba: "Microsoft Research (daryo.uz orqali)" },
  { kasb: "Junior dasturchi", ozgarish: "Kodning takrorlanuvchi qismi AI yordamchilar bilan tezlashadi; shu bilan birga IT Park rezidentlari va eksport rejasi o'sishda", manba: "IT Park 2026 rejasi" },
];

const vakansiyaRows = [
  { kasb: "Savdo menejeri", ulush: "12,1%", maosh: "10,5 mln so'm" },
  { kasb: "Savdo konsultanti / kassir", ulush: "6,3%", maosh: "6,6 mln so'm" },
  { kasb: "Call-markaz operatori", ulush: "5,3%", maosh: "7 mln so'm" },
];

const kompaniyaRows = [
  { nomi: "Speko", nima: "Ovozli AI", belgi: "Y Combinator 2026 yozgi oqimi" },
  { nomi: "NavAI", nima: "O'zbek nutqini sintez va tanish", belgi: "Mahalliy til uchun maxsus model" },
  { nomi: "Sino AI", nima: "Tibbiy diagnostika", belgi: "Sog'liqni saqlash yo'nalishi" },
  { nomi: "FlexAI", nima: "Chat-bot konstruktori", belgi: "Biznes uchun tayyor infratuzilma" },
  { nomi: "Roatify", nima: "Logistika avtomatizatsiyasi", belgi: "Yetkazib berish sohasi" },
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
            <span className="text-[#16181a]">AI qaysi kasblarni o&apos;zgartiryapti</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-08-17">17-avgust, 2026</time> · Yangilangan: 2026-08 · O&apos;quvchilar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              AI O&apos;zbekistonda qaysi kasblarni o&apos;zgartiryapti? (2026)
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              2026-yil avgust holatida O&apos;zbekistonda AI ommaviy ish o&apos;rinlarini qisqartirmayapti, lekin uchta yo&apos;nalishda aniq sezilmoqda: banklar call-markaz uchun ovozli AI&apos;ni sinamoqda, Soliq qo&apos;mitasi <strong>AI Soliq</strong> portalini ishga tushirdi, davlat esa &ldquo;Besh million sun&apos;iy intellekt yetakchilari&rdquo; dasturi bilan aholini yangi ko&apos;nikmalarga o&apos;rgatmoqda. Eng ko&apos;p e&apos;lon beriladigan kasblardan biri — call-markaz operatori — aynan shu o&apos;zgarish markazida turibdi.
            </p>
          </section>

          {/* Section 1: is there displacement now */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">AI hozir ish o&apos;rinlarini qisqartiryaptimi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              O&apos;zbekiston bo&apos;yicha AI sabab ish o&apos;rinlari qisqargani haqida rasmiy hisobot yo&apos;q — bu maqolani yozish jarayonida qidirilgan, lekin topilmadi. Solishtirish uchun: qo&apos;shni Qozog&apos;istonda AI 562 kasbga ta&apos;sir qilishi, taxminan 4 mln ish o&apos;rni (band aholining 44%) xavf ostida qolishi mumkinligi haqida hisobot chop etilgan (
              <a href="https://oz.sputniknews.uz/20260429/kazakhstan-suniy-intellekt-ish-orin-tasir-57212125.html" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Sputnik O&apos;zbekiston, 2026-04-29</a>
              ). O&apos;zbekiston uchun bunday miqyosdagi rasmiy hisob-kitob hali yo&apos;q — shuning uchun bu raqamni O&apos;zbekistonga ko&apos;chirib bo&apos;lmaydi, faqat mintaqadagi tendentsiya sifatida ko&apos;rish mumkin.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              O&apos;zbekistonda ko&apos;rinadigani — rasmiy statistika emas, balki aniq amaliy qadamlar: banklarning sinov loyihalari va davlat xizmatlarining AI&apos;ga o&apos;tishi. Quyida ular batafsil.
            </p>
          </section>

          {/* Section 2: which professions table */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Qaysi kasblar birinchi bo&apos;lib o&apos;zgaryapti?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              To&apos;rtta yo&apos;nalishda O&apos;zbekistonga tegishli aniq dalil bor — bittasi global tadqiqot, uchtasi mahalliy voqea:
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Kasb</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Nima o&apos;zgaryapti</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Manba</th>
                  </tr>
                </thead>
                <tbody>
                  {kasbRows.map((r) => (
                    <tr key={r.kasb} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.kasb}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.ozgarish}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.manba}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: original angle - call center */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Nega call-markaz operatori eng ko&apos;p ziddiyatli kasb?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              hh.uz&apos;ning 2026-yil yanvar-fevral tahliliga ko&apos;ra, O&apos;zbekistonda eng ko&apos;p e&apos;lon beriladigan uchta mutaxassislik shunday taqsimlangan (
              <a href="https://uz.kursiv.media/uz/2026-03-16/ozbekistonda-ish-beruvchilar-eng-kop-qidirayotgan-mutaxassisliklar-qaysi/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">kursiv.media</a>
              ):
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Kasb</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">E&apos;lonlar ulushi</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">O&apos;rtacha oylik</th>
                  </tr>
                </thead>
                <tbody>
                  {vakansiyaRows.map((r) => (
                    <tr key={r.kasb} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.kasb}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.ulush}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.maosh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-[#f8f9fa] rounded-[12px] p-5">
              <p className="text-[15.5px] text-[#16181a] leading-relaxed">
                Bu ikkita faktni yonma-yon qo&apos;yish kerak: call-markaz operatori — O&apos;zbekistonda uchinchi eng ko&apos;p ishga olinayotgan mutaxassislik (2026 boshida jami e&apos;lonlarning 5,3%i), va aynan shu paytda mamlakatning yirik banklari <strong>xuddi shu ish o&apos;rnining standart qismi</strong> uchun ovozli AI sinamoqda. Ya&apos;ni eng ko&apos;p ishga olinayotgan boshlang&apos;ich kasb bilan AI eng oson egallay oladigan vazifa turi to&apos;g&apos;ridan-to&apos;g&apos;ri ustma-ust tushmoqda — bu tasodif emas, chunki aynan shu vazifalar (ma&apos;lumot berish, holat tekshirish) ovozli AI uchun texnik jihatdan eng oson yo&apos;nalish hisoblanadi.
              </p>
            </div>
          </section>

          {/* Section 4: government scale */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Davlat qanday tayyorlanyapti?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              2024-yil 14-oktabrda tasdiqlangan Prezident farmoni (№358) bilan O&apos;zbekiston 2030-yilgacha sun&apos;iy intellekt texnologiyalarini rivojlantirish strategiyasini qabul qildi (
              <a href="https://www.norma.uz/oz/qonunchilikda_yangi/suniy_intellekt_tehnologiyalarini_2030_yilga_qadar_rivojlantirish_strategiyasi_tasdiqlandi" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Norma.uz</a>
              ). Maqsad — AI asosidagi dasturiy mahsulot va xizmatlar hajmini <strong className="text-[#16181a]">1,5 mlrd dollarga</strong> yetkazish, raqamli xizmatlar indeksida AI ulushini 10%ga chiqarish va 10 ta ilmiy laboratoriya ochish.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Kadrlar tomoni: 2026-yildan &ldquo;Besh million sun&apos;iy intellekt yetakchilari&rdquo; loyihasi ishga tushdi — shu yilning o&apos;zida <strong className="text-[#16181a]">500 ming kishi</strong>, 2035-yilga qadar jami <strong className="text-[#16181a]">5 million kishi</strong> o&apos;qitilishi rejalashtirilgan (
              <a href="https://12news.uz/earn/ozbekiston-5-million-nafar-suniy-intellekt-yetakchisini-tayyorlashni-rejalashtirmoqda/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">12news.uz</a>
              ), &ldquo;Bir million dasturchi&rdquo; dasturining davomi sifatida. Hozirgacha 1,5 milliondan ortiq kishi AI bo&apos;yicha sertifikat olgan.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              IT Park esa 2026-yil yakuniga qadar 300 ta rezidentga, 2 trln so&apos;mlik xizmat hajmiga va 160 mln dollarlik eksportga chiqishni maqsad qilgan.
            </p>
          </section>

          {/* Section 5: new jobs */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Qaysi yangi kasblar paydo bo&apos;lyapti?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Ish o&apos;rinlarini yo&apos;qotayotgan AI, boshqa tomondan, mahalliy AI kompaniyalarida yangi o&apos;rinlar ochyapti (
              <a href="https://gorgona.uz/blog/ai-uzbekistan-map-2026-updated" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Gorgona AI, 2026 xaritasi</a>
              ):
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Kompaniya</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Yo&apos;nalish</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Izoh</th>
                  </tr>
                </thead>
                <tbody>
                  {kompaniyaRows.map((r) => (
                    <tr key={r.nomi} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.nomi}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.nima}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.belgi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mt-4">
              Bu kompaniyalarning aksariyati hozircha kichik jamoa bilan ishlaydi, lekin Speko&apos;ning Y Combinator&apos;ning 2026 yozgi oqimiga qabul qilingani — O&apos;zbekistondan chiqqan AI startapi uchun kamdan-kam uchraydigan natija.
            </p>
          </section>

          {/* Honest risks */}
          <section className="mb-10 bg-[#fff8f0] border border-[#f0e0cc] rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Nimani hisobga olish kerak?</h2>
            <ul className="space-y-2.5">
              {[
                "O'zbekiston uchun rasmiy \"AI necha ish o'rnini yo'qotdi\" hisoboti yo'q — bu maqoladagi xulosalar bevosita voqealarga (bank sinovlari, AI Soliq) asoslangan, umumlashtirilgan statistikaga emas",
                "AI modellari o'zbek tilida hali inglizcha darajaga yetmagan — aynan shuning uchun NavAI kabi mahalliy nutq modellari alohida ishlab chiqilmoqda, bu to'liq avtomatlashtirishni sekinlashtiradi",
                "Banklardagi ovozli AI hali sinov bosqichida — murakkab, nizoli va yakuniy qaror talab qiluvchi holatlar hamon xodimda qoladi",
                "Kazakhstan uchun chop etilgan 562 kasb / 4 mln ish o'rni raqami O'zbekistonga tegishli emas — mintaqaviy taqqoslash sifatida keltirilgan, mahalliy prognoz sifatida emas",
                "Davlat dasturlaridagi raqamlar (5 mln kishi, 1,5 mlrd dollar) — rejalashtirilgan maqsadlar, allaqachon erishilgan natija emas",
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
              Kasb tanlashda yoki mavjud kasbni yangilashda AI ko&apos;nikmalari endi qo&apos;shimcha emas, standart talabga aylanmoqda. Qaysi kasb qanchalik maosh berishi haqida{" "}
              <Link href="/blog/frontend-dasturchi-maoshi" className="text-[#7ea2d4] hover:underline">frontend dasturchi maoshi tahlili</Link>{" "}
              bilan, kurs tanlashda nimaga qarash kerakligi esa{" "}
              <Link href="/blog/kursni-qanday-tanlash-7-mezon" className="text-[#7ea2d4] hover:underline">7 mezon qo&apos;llanmasi</Link>{" "}
              bilan ko&apos;rish mumkin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kurslar/g/suniy-intellekt"
                className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Sun&apos;iy intellekt kurslarini ko&apos;rish →
              </Link>
              <Link
                href="/kurslar/g/it"
                className="inline-flex items-center gap-2 border-2 border-[#e4e7ea] hover:border-[#16181a] text-[#16181a] rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                IT kurslarini ko&apos;rish →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
