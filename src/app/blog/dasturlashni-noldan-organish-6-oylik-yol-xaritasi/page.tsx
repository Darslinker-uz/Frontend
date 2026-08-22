import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/dasturlashni-noldan-organish-6-oylik-yol-xaritasi`;

export const metadata: Metadata = {
  title: "Dasturlashni noldan: 6 oylik reja (2026) | Darslinker",
  description:
    "Dasturlashni noldan o'rganish uchun 6 oylik reja: asos, frontend yoki backend, portfolio va ish qidiruv. hh.uz, Najot Ta'lim va School 21 asosida.",
  keywords: [
    "dasturlashni noldan o'rganish",
    "dasturlash 6 oylik reja",
    "dasturchi bo'lish yo'li",
    "dasturlashni qanday o'rganish kerak",
    "IT kasbga o'tish O'zbekiston",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  {
    q: "Dasturlashni noldan necha oyda o'rganish mumkin?",
    a: "Kuniga 4-5 soat intensiv shug'ullanib, bitta yo'nalishga (frontend yoki backend) toraytirilgan holda 6 oy — portfolio va boshlang'ich darajaga yetarli. Rasmiy dasturlar buni boshqacha ko'rsatadi: Najot Ta'lim'ning to'liq bootcamp yo'li (Foundation + Result) 8 oydan boshlanadi, bepul School 21'ning to'liq dasturchi dasturi esa 1,5-3 yil davom etadi. Farq — chuqurlik va qamrovda, shuning uchun 6 oylik reja \"ishga kirish\" darajasiga mo'ljallangan, uch yillik tajribaga emas.",
  },
  {
    q: "Python yoki JavaScript — qaysi tildan boshlash kerak?",
    a: "Ikkalasi ham keng tarqalgan boshlang'ich til, tanlov ko'proq maqsadga bog'liq. Backend yoki umumiy dasturlash mantig'i uchun Python qulayroq — Najot Ta'lim'ning Foundation bosqichi ham aynan C va Python asoslaridan boshlaydi. Frontend (veb-sayt interfeysi)ga to'g'ridan-to'g'ri yo'l olmoqchi bo'lsangiz, JavaScript va keyin React mantiqiyroq, chunki brauzerda faqat shu til ishlaydi.",
  },
  {
    q: "Kursga pul sarflamasdan dasturlashni o'rganish mumkinmi?",
    a: "Ha, kamida ikkita real yo'l bor. School 21 — Toshkent va Samarqandda ishlaydigan, to'liq bepul dasturlash maktabi: 18 yoshdan (ota-ona roziligi bilan 17 yoshda ham), 90 daqiqalik onlayn test va 14 kunlik intensiv \"basseyn\" bosqichidan o'tish kerak, dars mentorsiz, loyiha asosida o'tadi. Ikkinchi yo'l — Yoshlar bandlik agentligining \"Kelajak kasblari\" granti: IQ va ingliz tili imtihonidan o'tgan nomzodlar uchun kursga to'lovni 6 oygacha, 1,3 mln so'mgacha qoplaydi.",
  },
  {
    q: "Frontend yoki Backend — qaysi yo'nalish tezroq ish topishga yordam beradi?",
    a: "2026-yil holatida Toshkentda hh.uz'da frontend bo'yicha 82 ta, backend bo'yicha 75 ta ochiq o'rin bor, lekin ikkalasida ham junior deyarli yo'q — ko'pchiligi 1-3 yil tajriba so'raydi. Tezlik farqi kasbda emas, portfolio taqdimotida: frontend'da natija vizual bo'lgani uchun ko'rsatish osonroq, backend'da esa boshlang'ich maosh ko'pincha yuqoriroq (masalan Najot Ta'lim'ning o'z fullstack o'rni 8-16 mln so'm).",
  },
  {
    q: "Portfolio uchun nechta loyiha kerak va ular qanday bo'lishi kerak?",
    a: "3-4 ta to'liq, deploy qilingan loyiha yetarli — tutorial'dan ko'chirilgan emas, o'ziga xos muammoni yechadigan (masalan real ma'lumotlar bilan ishlaydigan kichik xizmat). Loyihalar GitHub'da ochiq turishi va frontend uchun Vercel/Netlify, backend uchun Render/Railway kabi xizmatda ishga tushirilgan bo'lishi kerak — faqat kod fayllari emas, ishlaydigan havola ko'rsatish ish beruvchi uchun ancha ishonchli.",
  },
  {
    q: "AI vositalar (ChatGPT, GitHub Copilot) dasturlashni o'rganishda yordam beradimi?",
    a: "Ha, kodlashni sezilarli tezlashtiradi, lekin fundamental bilim o'rnini bosmaydi — ish beruvchilar intervyuda aynan shu ikkinchisini tekshiradi. 2026-yilda AI yordamida ishlaydigan past narxli o'rinlar ham paydo bo'ldi (masalan ALIFCO'ning \"Full-stack (AI-assisted)\" o'rni 5-7 mln so'm, o'rtacha middle taklifdan uch barobar past) — bu shuni ko'rsatadiki, faqat AI orqali kod yozish bozorda past narxlangan ko'nikma, chuqur tushuncha esa hamon qadrlanadi.",
  },
  {
    q: "Diplom shart emasmi — faqat portfolio bilan ishga kirish mumkinmi?",
    a: "Ko'pchilik IT kompaniya uchun ha — hh.uz'dagi ochiq e'lonlarning katta qismi diplom emas, texnologiya va tajribani (React, TypeScript, Node.js kabi) so'raydi. School 21 kabi rasmiy dasturlar ham diplomsiz kirish imkoniyati beradi — rasmiy ta'lim tarixi umuman shart emas. Bu sohada portfolio va ko'nikma odatda qog'ozdan muhimroq.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Dasturlashni noldan o'rganish: 6 oylik yo'l xaritasi (2026)",
      description:
        "Dasturlashni noldan o'rganish uchun 6 oylik amaliy reja: asos, frontend yoki backend tanlash, portfolio va ish qidiruv. hh.uz, Najot Ta'lim va School 21 ma'lumoti asosida.",
      datePublished: "2026-08-22",
      dateModified: "2026-08-22",
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
      name: "Dasturlashni noldan o'rganish: 6 oylik yo'l xaritasi",
      description: "Nol tajribadan boshlab portfolio bilan birinchi ishga yoki freelance buyurtmaga qadar 4 bosqichli amaliy reja.",
      totalTime: "P6M",
      step: [
        {
          "@type": "HowToStep",
          name: "1-2 oy: asos",
          text: "Dasturlash mantig'i, bitta til (Python yoki JavaScript), Git/GitHub va oddiy algoritmlar o'rganiladi. Maqsad — kichik konsol dasturlar yozish va GitHub profilini ochish.",
        },
        {
          "@type": "HowToStep",
          name: "3-4 oy: yo'nalish va amaliyot",
          text: "Frontend (HTML/CSS/JS/React) yoki Backend (Python/Django yoki Node.js/Express) tanlanadi va real vazifalar ustida ishlanadi.",
        },
        {
          "@type": "HowToStep",
          name: "5-oy: portfolio",
          text: "3-4 ta to'liq loyiha yakunlanadi va deploy qilinadi (Vercel/Netlify yoki Render/Railway), GitHub'da ko'rinadigan portfolio shakllantiriladi.",
        },
        {
          "@type": "HowToStep",
          name: "6-oy: ish qidiruv",
          text: "CV va GitHub profili tayyorlanadi, hh.uz va ish.uz'ga murojaat qilinadi, ochiq loyihalarga kichik hissa qo'shiladi.",
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
        { "@type": "ListItem", position: 3, name: "Dasturlashni noldan o'rganish", item: url },
      ],
    },
  ],
};

const rejaRows = [
  { bosqich: "1-2 oy", maqsad: "Asos", vazifalar: "Dasturlash mantig'i, bitta til (Python yoki JavaScript), Git/GitHub, oddiy algoritmlar", natija: "Kichik konsol dasturlar, ochilgan GitHub profili" },
  { bosqich: "3-4 oy", maqsad: "Yo'nalish va amaliyot", vazifalar: "Frontend (HTML/CSS/JS/React) yoki Backend (Python/Django yoki Node.js/Express) tanlab, real vazifalar bajarish", natija: "Ishlaydigan 1-2 ta kichik loyiha" },
  { bosqich: "5-oy", maqsad: "Portfolio", vazifalar: "3-4 ta to'liq loyihani yakunlash va deploy qilish (Vercel/Netlify yoki Render/Railway)", natija: "GitHub'da ko'rinadigan, ishlaydigan portfolio" },
  { bosqich: "6-oy", maqsad: "Ish qidiruv", vazifalar: "CV va GitHub profilini tayyorlash, hh.uz/ish.uz'ga murojaat, ochiq loyihalarga hissa", natija: "Birinchi intervyu yoki freelance buyurtma" },
];

const yonalishRows = [
  { nomi: "Frontend", tex: "HTML/CSS/JavaScript, React", ochiq: "82 ta (1 tasi junior, 1-3 yil tajriba so'raydi)", izoh: "Natija vizual, portfolio ko'rsatish oson" },
  { nomi: "Backend", tex: "Python/Django yoki Node.js/Express", ochiq: "75 ta (aniq junior yo'q)", izoh: "Boshlang'ich maosh ko'pincha yuqoriroq (fullstack 8-16 mln so'm)" },
];

const yolRows = [
  { yoli: "O'zi o'rganish", narxi: "Bepul", muddat: "Cheklanmagan, o'z tezligida", talab: "Tuzilma yo'q, o'z-o'zini nazorat qilish kerak" },
  { yoli: "School 21", narxi: "Bepul", muddat: "Low-code 6 oy-1,5 yil / to'liq dastur 1,5-3 yil", talab: "18 yosh+, 90 daq test + 14 kunlik \"basseyn\", mentorsiz P2P format" },
  { yoli: "Najot Ta'lim (bootcamp)", narxi: "Toshkentda ~1,2 mln so'm/oy dan", muddat: "Formatga qarab 8 oydan", talab: "Foundation + Result bosqichlari, \"Kelajak kasblari\" granti bilan qoplanishi mumkin" },
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
            <span className="text-[#16181a]">Dasturlashni noldan o&apos;rganish</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-08-22">22-avgust, 2026</time> · Yangilangan: 2026-08 · O&apos;quvchilar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              Dasturlashni noldan o&apos;rganish: 6 oylik yo&apos;l xaritasi (2026)
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              Dasturlashni noldan o&apos;rganib, portfolio bilan birinchi ishga tayyor bo&apos;lish uchun kuniga 4-5 soat intensiv mashg&apos;ulot bilan <strong>6 oy</strong> real muddat — lekin faqat bitta yo&apos;nalishga (frontend <strong>yoki</strong> backend) toraytirilgan holda. Rasmiy bootcamplar to&apos;liq mutaxassislik uchun ko&apos;proq beradi: Najot Ta&apos;lim <strong>8 oydan</strong>, bepul School 21 esa <strong>6 oydan 3 yilgacha</strong>. Reja: <strong>1-2 oy</strong> — asos, <strong>3-4 oy</strong> — tanlangan yo&apos;nalish va amaliy loyihalar, <strong>5-oy</strong> — portfolio, <strong>6-oy</strong> — ish qidiruv.
            </p>
          </section>

          {/* Section: is 6 months enough */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Haqiqatda 6 oy yetarlimi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              2026-yil avgust holatida Toshkentda hh.uz&apos;da &quot;junior developer&quot; so&apos;rovi 38 ta natija beradi, lekin haqiqiy tajribasiz o&apos;rin sanoqli: &quot;Boshlang&apos;ich dasturchi&quot; (3-10 mln so&apos;m) va 1C dasturchi stajyori (3-5 mln so&apos;m) kabi bir necha o&apos;rin bor, qolgan &quot;Junior&quot; nomli o&apos;rinlar ham (masalan HamkorBank&apos;ning Junior Go Developer, QRHUB&apos;ning Junior Java Developer) 1-3 yil tajriba so&apos;raydi. Bu manzara{" "}
              <Link href="/blog/frontend-dasturchi-maoshi" className="text-[#7ea2d4] hover:underline">frontend dasturchi maoshi tahlilimizda</Link>{" "}
              ko&apos;rilgan holat bilan bir xil — 82 ta frontend e&apos;londan atigi bittasi ochiq junior.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Rasmiy o&apos;quv dasturlari bilan taqqoslasak, manzara aniqroq bo&apos;ladi.{" "}
              <a href="https://kurslar.najottalim.uz/dasturlash" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Najot Ta&apos;lim</a>
              &apos;ning dasturlash yo&apos;nalishi ikki bosqichli: avval Foundation (dasturlash mantig&apos;i, C va Python asoslari), so&apos;ngra tanlangan mutaxassislik bo&apos;yicha Result bosqichi (Frontend React, Backend Node.js/Python, C# .NET yoki Flutter). To&apos;liq yo&apos;l formatga qarab <strong className="text-[#16181a]">8 oydan</strong> boshlanadi, Toshkent filialida narxi oyiga taxminan 1,2 mln so&apos;mdan. Bepul{" "}
              <a href="https://21-school.uz/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">School 21</a>{" "}
              esa boshqacha quriladi: 90 daqiqalik test va 14 kunlik intensiv &quot;basseyn&quot; bosqichidan o&apos;tgach, low-code yo&apos;nalish <strong className="text-[#16181a]">6 oydan 1,5 yilgacha</strong>, to&apos;liq dasturchi dasturi esa <strong className="text-[#16181a]">1,5-3 yil</strong> (jumladan 3 oylik majburiy amaliyot) davom etadi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Xulosa: 6 oy — portfolio va boshlang&apos;ich darajaga yetarli, lekin bu uch yillik tajribaga teng degani emas. Bu rejaning maqsadi &quot;junior&quot; yorlig&apos;ini emas, ko&apos;rsatiladigan 3-4 ta ishlaydigan loyihani qo&apos;lga kiritish.
            </p>
          </section>

          {/* Plan overview table */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">6 oylik reja: umumiy ko&apos;rinish</h2>
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
                    <tr key={r.bosqich} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.bosqich}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.maqsad}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.vazifalar}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.natija}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Month 1-2 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">1-2 oy: qanday asos qo&apos;yiladi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Birinchi ikki oyda maqsad — yo&apos;nalishni emas, dasturlash mantig&apos;ini tushunish. Bitta til tanlanadi: umumiy mantiq va backend uchun Python qulayroq (Najot Ta&apos;lim&apos;ning Foundation bosqichi ham aynan C va Python asoslaridan boshlaydi), veb-interfeysga to&apos;g&apos;ridan-to&apos;g&apos;ri yo&apos;l uchun JavaScript mantiqiyroq. Shu bilan birga Git/GitHub va oddiy algoritmlar (saralash, qidiruv, shart operatorlari) o&apos;rganiladi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Bu bosqichda tuzilgan dastur kerak bo&apos;lmasa ham, tanlov bor: to&apos;liq bepul, lekin talabchan School 21 yo&apos;li — 18 yoshdan (ota-ona roziligi bilan 17 yoshda ham), 90 daqiqalik onlayn o&apos;yin-test va 14 kunlik intensiv &quot;basseyn&quot; bosqichidan o&apos;tish, mentorsiz, loyiha asosida. Kunlik ko&apos;p soat ajrata olmaydiganlar uchun bu format mos kelmasligi mumkin — o&apos;shanda o&apos;z-o&apos;zidan o&apos;rganish yoki pullik bootcamp qulayroq.
            </p>
          </section>

          {/* Month 3-4 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">3-4 oy: Frontend yoki Backend — qaysi yo&apos;nalishni tanlash kerak?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Ikkinchi bosqichda yo&apos;nalish tanlanadi va real vazifalar ustida ishlanadi. Toshkentdagi ochiq o&apos;rinlar soni ikkalasida ham katta, lekin xususiyati boshqa:
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Yo&apos;nalish</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Asosiy texnologiya</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Toshkentda ochiq o&apos;rin (hh.uz)</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Xususiyat</th>
                  </tr>
                </thead>
                <tbody>
                  {yonalishRows.map((r) => (
                    <tr key={r.nomi} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.nomi}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.tex}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.ochiq}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.izoh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] text-[#7c8490] mb-4">
              Manba:{" "}
              <a href="https://tashkent.hh.uz/vacancies/backend-developer" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">hh.uz Toshkent, backend-developer</a>{" "}
              va frontend dasturchi maoshi tahlilimizdagi hh.uz ma&apos;lumoti, 2026-yil avgust holatiga qo&apos;lda olingan.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Xulosa: ikkalasida ham junior eshigi tor, tanlov ko&apos;proq shaxsiy qiziqishga bog&apos;liq — Frontend vizual natija va tezroq ko&apos;rsatiladigan portfolio uchun, Backend esa mantiqiy fikrlash va odatda yuqoriroq boshlang&apos;ich maosh uchun (masalan Najot Ta&apos;lim&apos;ning o&apos;z fullstack o&apos;rni 8-16 mln so&apos;m, DevCore&apos;ning Node.js o&apos;rni $2 000gacha).
            </p>
          </section>

          {/* Month 5 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">5-oy: portfolio uchun nechta loyiha kifoya?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Uchinchi bosqichning maqsadi — <strong className="text-[#16181a]">3-4 ta to&apos;liq, deploy qilingan loyiha</strong>. Tutorial&apos;dan bir xilda ko&apos;chirilgan ishlar emas, o&apos;ziga xos muammoni yechadigan kichik xizmat (masalan real ma&apos;lumotlar bilan ishlaydigan onlayn buyurtma yoki byudjet hisoblagich) qadrlanadi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Loyihalar GitHub&apos;da ochiq turishi va ishga tushirilgan bo&apos;lishi kerak — frontend uchun Vercel yoki Netlify, backend uchun Render yoki Railway kabi bepul xizmatlar yetarli. Faqat kod fayllari emas, ishlaydigan havola ko&apos;rsatish ish beruvchi uchun ancha ishonchli signal.
            </p>
          </section>

          {/* Month 6 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">6-oy: ishga qanday chiqish mumkin?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              So&apos;nggi oyda CV va GitHub profili tayyorlanadi, so&apos;ngra uchta yo&apos;nalishda qidiruv boshlanadi: hh.uz va ish.uz&apos;da &quot;Boshlang&apos;ich dasturchi&quot; yoki tegishli texnologiya nomi bilan qidirish, ochiq loyihalarga (open source) kichik hissa qo&apos;shib tajriba ko&apos;rsatish, va Telegram&apos;dagi IT vakansiya kanallariga murojaat.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              AI vositalar (GitHub Copilot, ChatGPT) kodlashni tezlashtiradi, lekin fundamental bilim o&apos;rnini bosmaydi. 2026-yilda AI yordamida ishlaydigan past narxli o&apos;rinlar ham paydo bo&apos;ldi — ALIFCO&apos;ning &quot;Full-stack (AI-assisted)&quot; o&apos;rni 5-7 mln so&apos;m, o&apos;rtacha middle taklifdan uch barobar past. Ya&apos;ni faqat AI orqali kod yozish bozorda past narxlangan ko&apos;nikma, chuqur tushuncha esa hamon qadrlanadi.
            </p>
          </section>

          {/* Free vs paid paths */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Bepul va pullik yo&apos;llar qanday farq qiladi?</h2>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Yo&apos;l</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Narxi</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Muddat</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Talab/Format</th>
                  </tr>
                </thead>
                <tbody>
                  {yolRows.map((r) => (
                    <tr key={r.yoli} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.yoli}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.narxi}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.muddat}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.talab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              To&apos;rtinchi variant ham bor:{" "}
              <a href="https://uza.uz/en/posts/kelajak-kasblari-loyihasi-orqali-yoshlarning-daromadi-ortmoqda_603629" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Yoshlar bandlik agentligining &quot;Kelajak kasblari&quot; granti</a>{" "}
              orqali IQ va ingliz tili imtihonidan o&apos;tgan nomzodlar uchun kursga to&apos;lov 6 oygacha, 1,3 mln so&apos;mgacha qoplanadi — bu pullik bootcampni amalda bepulga yaqinlashtirishi mumkin.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Pullik bootcamp tanlashdan oldin markazning yuridik holati va shartnomasini tekshirish ham muhim —{" "}
              <Link href="/blog/ishonchli-oquv-markazni-qanday-tekshirish" className="text-[#7ea2d4] hover:underline">bu qanday qilinishi alohida maqolada</Link>{" "}
              yozilgan.
            </p>
          </section>

          {/* Risks */}
          <section className="mb-10 bg-[#fff8f0] border border-[#f0e0cc] rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Nimalarga e&apos;tibor berish kerak?</h2>
            <ul className="space-y-2.5">
              {[
                "6 oy — faqat bitta yo'nalishga toraytirilgan, kuniga 4-5 soat intensiv rejaga tegishli; kam vaqt bilan muddat tabiiy ravishda cho'ziladi",
                "hh.uz'dagi \"Junior\" nomli o'rinlarning aksariyati baribir 1-3 yil tajriba so'raydi — nol tajribali nomzod uchun real yo'l \"Boshlang'ich dasturchi\" yoki kichik loyihadagi stajirovka",
                "Faqat AI vositalar orqali yozilgan kod portfolio sifatida kuchsiz — ish beruvchi kodni tushunishni intervyuda alohida tekshiradi",
                "School 21'ning to'liq dasturchi dasturi 1,5-3 yil davom etadi — bu 6 oylik rejadan farqli, ancha chuqurroq va uzoqroq yo'l",
                "Bootcamp narxi filialga qarab farq qiladi (masalan Toshkent va boshqa viloyat filiallari orasida) — ro'yxatdan o'tishdan oldin aniq narxni saytdan tekshirish kerak",
                "Portfolio loyihalari tutorial'dan ko'chirilgan bo'lsa, intervyuda darhol bilinadi — o'ziga xos muammoni yechgan loyiha kerak",
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
              Yo&apos;nalish tanlashda boshlang&apos;ich maosh va talab qanday ko&apos;rinishini{" "}
              <Link href="/blog/frontend-dasturchi-maoshi" className="text-[#7ea2d4] hover:underline">frontend dasturchi maoshi tahlilida</Link>{" "}
              batafsil ko&apos;rish mumkin. Tuzilgan dastur va amaliy nazorat orqali tezroq o&apos;rganish uchun quyidagi kurslar bilan tanishing — kurs tanlashda nimaga qarash kerakligi{" "}
              <Link href="/blog/kursni-qanday-tanlash-7-mezon" className="text-[#7ea2d4] hover:underline">7 ta mezon bo&apos;yicha qo&apos;llanmada</Link>{" "}
              yozilgan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kurslar/frontend"
                className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Frontend kurslarini ko&apos;rish →
              </Link>
              <Link
                href="/kurslar/backend"
                className="inline-flex items-center gap-2 border-2 border-[#e4e7ea] hover:border-[#16181a] text-[#16181a] rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Backend kurslarini ko&apos;rish →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
