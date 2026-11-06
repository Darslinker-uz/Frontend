import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";
import { CrmApplyButton } from "@/components/crm/crm-apply";

// Tavsiyalar formati (docs/crm-blog-plan.md, G1–G10). Raqobatchilar haqidagi faktlar faqat ularning rasmiy
// saytlaridan, 2026-11-06 holatida tekshirilgan. Darslinker haqida faqat PRODUCT.md "Hozir bor" imkoniyatlari.

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const SLUG = "ozbekistonda-eng-yaxshi-crm-oquv-markazlari-uchun";
const url = `${SITE_URL}/blog/${SLUG}`;
const TITLE = "O'zbekistonda o'quv markazlari uchun eng yaxshi CRM qaysi? (2026)";
const DESCRIPTION =
  "Modme, Darslinker, EduTizim, SchoolUp va Edulog: narx, sinov muddati, ota-onaga xabar, to'lov va mobil ilova bo'yicha rasmiy saytlardan yig'ilgan taqqoslash.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Darslinker` },
  description: DESCRIPTION,
  keywords: [
    "o'quv markazi uchun eng yaxshi CRM",
    "o'quv markazlari uchun CRM O'zbekiston",
    "Modme CRM",
    "EduTizim",
    "Edulog CRM",
    "SchoolUp CRM",
    "Darslinker CRM",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "O'zbekistonda o'quv markazlari uchun eng yaxshi CRM qaysi?",
    a: "Hamma markazga birdek mos keladigan bitta CRM yo'q. Ko'p markaz ishlatadigan va o'z mobil ilovalari bor tizim kerak bo'lsa Modme, o'quvchini darsda faol ushlab qolish va ota-onaga Telegram xabar muhim bo'lsa Darslinker, Click va Payme orqali onlayn to'lov kerak bo'lsa EduTizim yoki SchoolUp, oylik eng kam to'lov muhim bo'lsa Edulog ko'rib chiqishga arziydi.",
  },
  {
    q: "O'quv markazi uchun CRM oyiga qancha turadi?",
    a: "2026-yil noyabr holatida rasmiy saytlarga ko'ra kichik markaz uchun eng arzon oylik tariflar Darslinker'da 190 000 so'm va Edulog'da 200 000 so'm. Modme Start tarifi 3 oyga 1 500 000 so'm, ya'ni oyiga taxminan 500 000 so'm. SchoolUp oylik to'lov o'rniga 7 200 000 so'mdan boshlanadigan bir martalik litsenziya sotadi. EduTizim narxlarini saytida ochiq ko'rsatmaydi.",
  },
  {
    q: "CRM bilan o'quv markazini boshqarish dasturining farqi bormi?",
    a: "Amalda bu bitta narsa. O'quv markazlari uchun CRM deganda o'quvchilar, guruhlar, davomat va to'lovni yuritadigan boshqaruv dasturi tushuniladi. Darslinker kabi onlayn CRM brauzerda ishlaydi va kompyuterga dastur o'rnatishni talab qilmaydi.",
  },
  {
    q: "Qaysi CRM'ni bepul sinab ko'rish mumkin?",
    a: "Darslinker 14 kun, Modme va EduTizim 7 kun bepul sinov beradi. SchoolUp umumiy demo hisob, Edulog esa demo versiya taklif qiladi.",
  },
  {
    q: "Ota-onaga xabar yuborish uchun SMS kerakmi?",
    a: "Shart emas. EduTizim va Edulog SMS provayderlari bilan ishlaydi, SMS esa provayder tarifi bo'yicha alohida to'lanadi. Darslinker va Edulog Telegram bot orqali xabar yuboradi, SchoolUp'da ota-onalar uchun alohida mobil ilova bor.",
  },
  {
    q: "Qaysi CRM'da o'quvchilar to'lovni Click yoki Payme orqali qila oladi?",
    a: "Rasmiy saytlarida EduTizim Click, Payme, Atmos va Multicard'ni, SchoolUp esa Payme va Click'ni ko'rsatadi. Darslinker'da to'lov naqd, karta yoki o'tkazma sifatida qo'lda qayd etiladi, onlayn to'lov integratsiyasi hozircha yo'q.",
  },
  {
    q: "CRM'ni tanlashdan oldin nimani tekshirish kerak?",
    a: "Kamida uchta narsani tekshiring. Markazingiz pulni naqd yoki onlayn yig'ishini, ota-onalar bilan qaysi kanal orqali aloqa qilishingizni va byudjet oylik obunaga yoki bir martalik to'lovga mosligini. Keyin bepul sinov davrida o'z guruhlaringiz bilan bir hafta ishlab ko'ring.",
  },
];

type Item = {
  name: string;
  site: string;
  siteLabel: string;
  intro: ReactNode;
  pros: string[];
  cons: string[];
  fit: string;
};

const items: Item[] = [
  {
    name: "Modme",
    site: "https://modme.uz/en",
    siteLabel: "modme.uz",
    intro:
      "Toshkentda 2020-yilda tashkil topgan Modme bozorda eng ko'p tanilgan tizimlardan biri. Spot.uz 2023-yilda platformadan 330 dan ortiq o'quv markazi foydalanishini yozgan. Saytida o'quvchilar va o'qituvchilar uchun alohida mobil ilovalar, moliya bo'limi va olti xil to'lov rejimi ko'rsatilgan.",
    pros: [
      "Ko'p markazda sinalgan, 2023-yildayoq 330 dan ortiq mijoz",
      "O'quvchi va o'qituvchi uchun App Store va Google Play'da alohida ilovalar",
      "Olti xil to'lov rejimi va qarzdorlar hisobi",
    ],
    cons: [
      "Narx oylik emas, 3 oylik paket bilan to'lanadi. Start tarifi 3 oyga 1 500 000 so'm",
      "Gamifikatsiya moduli alohida, oyiga 150 000 so'm",
    ],
    fit: "Ko'p filialli, o'z mobil ilovasi bo'lgan tizimni istagan va narx farqi muhim bo'lmagan markazlar.",
  },
  {
    name: "Darslinker",
    site: "/",
    siteLabel: "darslinker.uz",
    intro: (
      <>
        Darslinker{" "}
        <Link href="/" className="text-[#2d5a8a] font-semibold hover:underline">o&apos;quv markazlari uchun CRM va LMS</Link>. Bitta
        tizimda o&apos;quvchilar bazasi, davomat, to&apos;lov va qarzdorlik, lidlar va dashboard bilan birga darsda jonli quiz va
        ota-onaga Telegram xabar ishlaydi. Barcha imkoniyatlar har bir tarifda bor, tariflar faqat o&apos;quvchi, filial va xodim
        soni bilan farq qiladi.
      </>
    ),
    pros: [
      "Darsda jonli quiz va reyting har tarifda, alohida modul to'lovisiz",
      "Ota-onaga Telegram xabar va farzand kuzatuvi, SMS uchun pul to'lanmaydi",
      "Oyiga 190 000 so'mdan, 14 kun bepul sinov, tizimni birga o'rnatish va sozlash",
    ],
    cons: [
      "Click yoki Payme orqali onlayn to'lov yo'q, to'lov qo'lda qayd etiladi",
      "CRM yo'nalishi 2026-yil oktabrda ishga tushgan, mijozlar soni hali kam",
    ],
    fit: "O'quvchini darsda faol ushlab qolish va ota-onalar bilan aloqani avtomatlashtirishni birinchi o'ringa qo'ygan markazlar.",
  },
  {
    name: "EduTizim",
    site: "https://edutizim.uz/en",
    siteLabel: "edutizim.uz",
    intro:
      "EduTizim o'zini o'quv markazlari uchun CRM va ERP tizimi deb ataydi. Saytida 200 dan ortiq ta'lim markazi har kuni foydalanishi yozilgan. Davomat, moliya, ish haqi, lidlar voronkasi, turniket va yuzni tanish orqali kirish nazorati ham bor.",
    pros: [
      "Click, Payme, Atmos va Multicard orqali onlayn to'lov",
      "Hikvision turniketi va yuzni tanish bilan kirish nazorati",
      "amoCRM, Facebook va IP-telefoniya bilan integratsiya",
    ],
    cons: [
      "Narxlar saytda ochiq ko'rsatilmagan, so'rov orqali aniqlanadi",
      "Ota-onaga xabar SMS orqali, SMS provayder tarifi bo'yicha alohida to'lanadi",
    ],
    fit: "Onlayn to'lov, turniket va xodimlar hisobi muhim bo'lgan yirik markazlar.",
  },
  {
    name: "SchoolUp",
    site: "https://schoolup.uz",
    siteLabel: "schoolup.uz",
    intro:
      "SchoolUp CRM va LMS platformasini obuna emas, bir martalik litsenziya sifatida sotadi. Saytida 2020-yildan beri ishlashi va Toshkent, Farg'ona, Samarqand kabi 20 dan ortiq shahardagi 250 dan ortiq markaz bilan hamkorligi yozilgan.",
    pros: [
      "Oylik to'lov yo'q, cheksiz o'quvchi va guruh",
      "O'quvchi, ota-ona, o'qituvchi va IELTS CD Mock uchun to'rtta ilova",
      "Payme va Click orqali onlayn to'lov",
    ],
    cons: [
      "Boshlang'ich to'lov katta, litsenziya 7 200 000 so'mdan boshlanadi",
      "Bepul sinov muddati yo'q, faqat umumiy demo hisob",
    ],
    fit: "Bir marta to'lab, uzoq muddat ishlatmoqchi bo'lgan va IELTS tayyorlov bilan shug'ullanadigan markazlar.",
  },
  {
    name: "Edulog",
    site: "https://edulog.uz/",
    siteLabel: "edulog.uz",
    intro:
      "Edulog o'zini o'quv markazlari uchun oddiy va yengil tizim deb ta'riflaydi. Uni Toshkentdagi Netson korxonasi ishlab chiqqan. Uchala tarifda ham Telegram bot, mobil ilova va o'quvchi kabineti bor.",
    pros: [
      "Oylik narx past, Start tarifi oyiga 200 000 so'm",
      "Telegram bot, mobil ilova va o'quvchi kabineti barcha tariflarda",
      "O'qituvchi va xodimlar ish haqi avtomatik hisoblanadi",
    ],
    cons: [
      "Bosh sahifada lidlar bilan ishlash bo'limi ko'rsatilmagan",
      "Bepul sinov o'rniga faqat demo versiya",
    ],
    fit: "Byudjeti cheklangan, asosiy hisob-kitob va o'quvchi kabineti yetarli bo'lgan kichik markazlar.",
  },
];

const compareRows = [
  { name: "Modme", price: "1 500 000 so'm / 3 oy (Start, 100 tagacha)", trial: "7 kun", parents: "Saytda ko'rsatilmagan", pay: "Saytda ko'rsatilmagan", app: "O'quvchi va o'qituvchi ilovasi" },
  { name: "Darslinker", price: "190 000 so'm / oy (100 tagacha)", trial: "14 kun", parents: "Telegram bot", pay: "Qo'lda qayd", app: "Telegram mini ilova" },
  { name: "EduTizim", price: "Saytda ochiq emas", trial: "7 kun", parents: "SMS", pay: "Click, Payme, Atmos, Multicard", app: "O'qituvchi ilovasi" },
  { name: "SchoolUp", price: "7 200 000 so'mdan, bir martalik", trial: "Demo hisob", parents: "Ota-ona ilovasi", pay: "Payme, Click", app: "4 ta ilova" },
  { name: "Edulog", price: "200 000 so'm / oy (Start)", trial: "Demo versiya", parents: "SMS, Telegram bot", pay: "Bosh sahifada yo'q", app: "Mobil ilova" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      datePublished: "2026-11-06",
      dateModified: "2026-11-06",
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
      name: "O'zbekistondagi o'quv markazlari uchun CRM tizimlari",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: it.site.startsWith("http") ? it.site : SITE_URL,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Asosiy", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: "Eng yaxshi CRM", item: url },
      ],
    },
  ],
};

const H2 = "text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3";
const P = "text-[15.5px] text-[#16181a]/75 leading-relaxed";
const LINK = "text-[#2d5a8a] font-semibold hover:underline";

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
            <span className="text-[#16181a]">Eng yaxshi CRM</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-11-06">6-noyabr, 2026</time>{" "}· Yangilangan: 2026-11 · O&apos;quv markazlar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">{TITLE}</h1>
          </header>

          <section className="mb-10 rounded-[14px] bg-[#f4f6f8] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqa javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              Hamma markazga birdek mos keladigan bitta eng yaxshi CRM yo&apos;q, tanlov markazingiz qanday ishlashiga bog&apos;liq.
              Ko&apos;p markazda sinalgan va o&apos;z mobil ilovalari bor tizim kerak bo&apos;lsa <strong>Modme</strong>, o&apos;quvchini
              darsda faol ushlab qolish va ota-onaga Telegram xabar muhim bo&apos;lsa <strong>Darslinker</strong>, Click va Payme
              orqali onlayn to&apos;lov kerak bo&apos;lsa <strong>EduTizim</strong> yoki <strong>SchoolUp</strong>, oylik to&apos;lov
              eng past bo&apos;lishi kerak bo&apos;lsa <strong>Edulog</strong> mos keladi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Nega bitta &ldquo;eng yaxshi&rdquo; CRM yo&apos;q?</h2>
            <p className={`${P} mb-3`}>
              O&apos;zbekistonda o&apos;quv markazlari juda turlicha. Golden Pages katalogining o&apos;zida 2026-yil noyabr holatida
              1008 ta tashkilot o&apos;quv markazi sifatida ro&apos;yxatga olingan. Ularning ichida bir xonali kichik markaz ham,
              o&apos;nlab guruhli filiallar tarmog&apos;i ham bor. Kichik markaz uchun oylik to&apos;lov hal qiluvchi bo&apos;lsa,
              katta tarmoqqa onlayn to&apos;lov va kirish nazorati muhimroq.
            </p>
            <p className={P}>
              Shuning uchun bu maqolada ballar bilan reyting tuzmadik. O&apos;quv markazini boshqarish va avtomatlashtirish uchun
              maxsus qilingan beshta CRM dasturining rasmiy saytlarini 2026-yil noyabrda birma-bir ko&apos;rib chiqdik va har biri qaysi markazga mos
              ekanini yozdik. Ro&apos;yxatda Darslinker ham bor, uning kamchiliklarini ham ochiq yozdik.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Qaysi mezonlar bo&apos;yicha solishtirdik?</h2>
            <p className={`${P} mb-3`}>Har bir tizimni markaz egasi birinchi so&apos;raydigan oltita savol bo&apos;yicha tekshirdik:</p>
            <ul className="space-y-2 ml-1">
              {[
                "Kichik markaz uchun eng arzon tarif qancha va qanday to'lanadi",
                "Bepul sinov bormi va necha kun",
                "Ota-onaga xabar qaysi kanal orqali boradi",
                "O'quvchi to'lovni onlayn qila oladimi",
                "Mobil ilova yoki Telegram ichida ishlash imkoni",
                "Darsni qiziqarli qiladigan quiz va gamifikatsiya bormi",
              ].map((c) => (
                <li key={c} className="text-[15px] text-[#16181a]/80 flex items-start gap-2">
                  <span className="text-[#5b87c0] mt-1">▸</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Beshta CRM bir jadvalda qanday ko&apos;rinadi?</h2>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full min-w-[680px] text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">CRM</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Eng arzon tarif</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Bepul sinov</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Ota-onaga xabar</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Onlayn to&apos;lov</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Telefonda</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((r) => (
                    <tr key={r.name} className="border-t border-[#e4e7ea] align-top">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.name}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.price}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.trial}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.parents}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.pay}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.app}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[12.5px] text-[#7c8490] mt-2">
              Ma&apos;lumotlar har bir tizimning rasmiy saytidan 2026-yil 6-noyabr holatida olingan. &ldquo;Saytda ko&apos;rsatilmagan&rdquo;
              degani imkoniyat yo&apos;q degani emas, uni sotuv bo&apos;limidan so&apos;rab aniqlash kerak.
            </p>
          </section>

          {items.map((it, i) => (
            <section key={it.name} className="mb-10">
              <h2 className={H2}>{i + 1}. {it.name} kimga mos keladi?</h2>
              <p className={`${P} mb-3`}>{it.intro}</p>
              <ul className="space-y-2 mb-3">
                {it.pros.map((p) => (
                  <li key={p} className="text-[14.5px] text-[#16181a]/80 flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span><span>{p}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2 mb-3">
                {it.cons.map((c) => (
                  <li key={c} className="text-[14.5px] text-[#16181a]/70 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span><span>{c}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[15px] text-[#16181a]/75">
                Kimga mos keladi? {it.fit} Rasmiy sayt{" "}
                {it.site.startsWith("http") ? (
                  <a href={it.site} target="_blank" rel="noreferrer noopener" className={LINK}>{it.siteLabel}</a>
                ) : (
                  <Link href={it.site} className={LINK}>{it.siteLabel}</Link>
                )}
                .
              </p>
            </section>
          ))}

          <section className="mb-10">
            <h2 className={H2}>Bir yilda qaysi biri qanchaga tushadi?</h2>
            <p className={`${P} mb-3`}>
              Oylik narxni solishtirish chalg&apos;itishi mumkin, chunki tizimlar har xil muddatga sotiladi. Shuning uchun 100 tagacha
              o&apos;quvchili markaz bir yil ishlatsa qancha to&apos;lashini rasmiy narxlar bo&apos;yicha hisoblab chiqdik. Hisobda
              uzoq muddatga to&apos;lov chegirmalari hisobga olingan, SMS va boshqa qo&apos;shimcha xizmatlar kiritilmagan.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full min-w-[560px] text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">CRM</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">1 yilga to&apos;lov</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Qanday hisoblandi</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Darslinker", "1 824 000 so'm", "Minimal tarif 190 000 so'm × 12 oy, 12 oyga to'lovda 20% chegirma"],
                    ["Edulog", "1 920 000 so'm", "Start tarifining yillik narxi"],
                    ["Modme", "5 400 000 so'm", "Start tarifining 12 oylik narxi, saytda 12 oyga 2 oy bonus ham yozilgan"],
                    ["SchoolUp", "7 200 000 so'mdan", "Bir martalik litsenziya, oylik to'lov yo'q"],
                    ["EduTizim", "Noma'lum", "Narx saytda ko'rsatilmagan"],
                  ].map(([n, sum, how]) => (
                    <tr key={n} className="border-t border-[#e4e7ea] align-top">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{n}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{sum}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`${P} mt-3`}>
              Birinchi yilda oylik obunali tizimlar arzonroq tushadi. SchoolUp esa bir marta to&apos;lanadi, shuning uchun bir necha yil
              ishlatilsa farq qisqaradi. Litsenziyadan keyin yangilanish yoki qo&apos;llab-quvvatlash uchun alohida to&apos;lov bor-yo&apos;qligi
              saytda yozilmagan, uni shartnoma oldidan so&apos;rab aniqlash kerak. Tariflar o&apos;quvchilar soni bo&apos;yicha ham farq
              qiladi. Markazingiz 100 tadan katta bo&apos;lsa, har tizimning keyingi tarifiga qarang.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>amoCRM yoki Bitrix24 kabi umumiy CRM o&apos;quv markaziga to&apos;g&apos;ri keladimi?</h2>
            <p className={`${P} mb-3`}>
              amoCRM va Bitrix24 savdo bo&apos;limlari uchun qurilgan. Ularda arizalar voronkasi, qo&apos;ng&apos;iroqlar va
              mijozlar bilan yozishma kuchli, lekin guruh, dars jadvali, davomat va oylik qarzdorlik tayyor holda yo&apos;q. Bularni
              qo&apos;shimcha ilova yoki dasturchi yordamida sozlash kerak bo&apos;ladi.
            </p>
            <p className={P}>
              Masalan, Bitrix24 bozorida &ldquo;o&apos;quv markazi uchun tayyor CRM&rdquo; nomli ilova bor, lekin uning tavsifi
              mehnat muhofazasi bo&apos;yicha o&apos;qitish va seminarlarga ro&apos;yxatdan o&apos;tishga qaratilgan, til yoki IT kurslari
              uchun emas. Shuning uchun asosiy ishi guruhlarda dars o&apos;tish bo&apos;lgan markazga yuqoridagi maxsus tizimlar
              odatda kamroq sozlash talab qiladi. Umumiy CRM faqat arizalar ko&apos;p, darslar esa boshqa joyda yuritiladigan
              holatda o&apos;rinli. EduTizim kabi ba&apos;zi tizimlar amoCRM bilan integratsiyani ham taklif qiladi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Markazingizga qaysi biri mosligini qanday aniqlash mumkin?</h2>
            <p className={`${P} mb-3`}>
              Taqqoslash jadvalini yodlash shart emas. Uchta savolga javob bering, ro&apos;yxat o&apos;zi qisqaradi.
            </p>
            <ol className="space-y-3 mb-3 list-decimal pl-5">
              <li className={P}>
                <strong className="text-[#16181a]">Pul qanday yig&apos;iladi?</strong> Ota-onalar ko&apos;proq naqd yoki kartadan
                o&apos;tkazma qilsa, to&apos;lovni qo&apos;lda qayd etish yetarli. Ular ilovadan Click yoki Payme bilan to&apos;lashni
                kutsa, EduTizim yoki SchoolUp kabi integratsiyasi bor tizimga qarang.
              </li>
              <li className={P}>
                <strong className="text-[#16181a]">Ota-onalar bilan qaysi kanal ishlaydi?</strong> Ota-onalarning deyarli hammasi
                Telegram&apos;da bo&apos;lsa, Telegram bot SMS&apos;dan arzonroq tushadi. SMS esa Telegram&apos;dan foydalanmaydigan
                ota-onaga ham yetib boradi, lekin har xabar uchun provayderga to&apos;lanadi. Bu farq haqida{" "}
                <Link href="/features/parents" className={LINK}>ota-onalar bilan aloqa</Link>{" "}sahifasida batafsil yozganmiz.
              </li>
              <li className={P}>
                <strong className="text-[#16181a]">Byudjet qanday tuzilgan?</strong> Bir martalik katta to&apos;lov qila olsangiz,
                SchoolUp litsenziyasi uzoq muddatda arzonroq bo&apos;lishi mumkin. Oyma-oy to&apos;lash qulay bo&apos;lsa, oylik
                obunali tizimlar kerak. 100 tagacha o&apos;quvchili markaz uchun ular oyiga 190 000 so&apos;mdan boshlanadi.
              </li>
            </ol>
            <p className={P}>
              Tizimni tanlashning umumiy mezonlarini{" "}
              <Link href="/crm-comparison" className={LINK}>CRM tanlash qo&apos;llanmasida</Link>{" "}yozganmiz. Qaysi tizimni
              tanlamang, bepul sinov davrida bitta haqiqiy guruhni to&apos;liq yuritib ko&apos;ring. Davomat, to&apos;lov va ota-onaga
              xabar bir hafta ichida qanday ishlashi har qanday taqdimotdan ko&apos;proq narsani ko&apos;rsatadi.
            </p>
          </section>

          <section className="mb-12">
            <h2 className={H2}>Ko&apos;p so&apos;raladigan savollar</h2>
            <FaqList items={faqs} />
          </section>

          <section className="rounded-[18px] bg-[#f4f6f8] p-6 md:p-8">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a]">Darslinker&apos;ni o&apos;z markazingizda sinab ko&apos;ring</h2>
            <p className={`${P} mt-2`}>
              Agar sizga jonli quiz va ota-onaga Telegram xabar muhim bo&apos;lsa, Darslinker&apos;ni 14 kun bepul ishlatib ko&apos;ring.
              O&apos;quvchilar ro&apos;yxatini ko&apos;chirishda va tizimni sozlashda{" "}
              <Link href="/features/support" className={LINK}>support jamoamiz</Link>{" "}yordam beradi. Barcha narxlar{" "}
              <Link href="/pricing" className={LINK}>tariflar sahifasida</Link>.
            </p>
            <CrmApplyButton
              refSource="blog-eng-yaxshi-crm"
              className="mt-5 inline-flex h-[52px] items-center gap-2 rounded-full bg-[#2d5a8a] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#244c76]"
            >
              Bepul sinab ko&apos;rish →
            </CrmApplyButton>
          </section>

          <p className="mt-8 text-[12.5px] text-[#7c8490]">
            Ma&apos;lumotlar olingan rasmiy saytlar{" "}
            <a href="https://modme.uz/en/prices" target="_blank" rel="noreferrer noopener" className="hover:underline">modme.uz</a>,{" "}
            <a href="https://edutizim.uz/en" target="_blank" rel="noreferrer noopener" className="hover:underline">edutizim.uz</a>,{" "}
            <a href="https://schoolup.uz" target="_blank" rel="noreferrer noopener" className="hover:underline">schoolup.uz</a>,{" "}
            <a href="https://edulog.uz/" target="_blank" rel="noreferrer noopener" className="hover:underline">edulog.uz</a>, Modme mijozlari soni{" "}
            <a href="https://www.spot.uz/ru/2023/03/07/modme-crm/" target="_blank" rel="noreferrer noopener" className="hover:underline">Spot.uz</a>,{" "}
            markazlar soni{" "}
            <a href="https://www.goldenpages.uz/uz/rubrics/?Id=105990" target="_blank" rel="noreferrer noopener" className="hover:underline">Golden Pages</a>,{" "}
            Bitrix24 ilovasi{" "}
            <a href="https://www.bitrix24.ru/apps/app/152747.gotovaya_crm_dlya_uchebnogo_tsentra/" target="_blank" rel="noreferrer noopener" className="hover:underline">Bitrix24 Market</a>.
            Tekshiruv sanasi 2026-yil 6-noyabr.
          </p>
        </article>
      </main>
    </>
  );
}
