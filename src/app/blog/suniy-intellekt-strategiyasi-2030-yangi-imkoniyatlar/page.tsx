import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/suniy-intellekt-strategiyasi-2030-yangi-imkoniyatlar`;

export const metadata: Metadata = {
  title: "Sun'iy intellekt strategiyasi 2030: kimlar uchun imkoniyat? | Darslinker",
  description:
    "$6 mlrd investitsiya, 800 MVt infratuzilma, 200+ loyiha 7 sohada — O'zbekiston AI strategiyasi 2030 kimlar uchun imkoniyat ochayotgani.",
  keywords: [
    "sun'iy intellekt strategiyasi 2030",
    "O'zbekiston AI strategiyasi",
    "AI investitsiya O'zbekiston",
    "sun'iy intellekt loyihalari 2026",
    "AI imkoniyatlari O'zbekiston",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  {
    q: "O'zbekistonning sun'iy intellekt strategiyasi qachon va qanday qabul qilingan?",
    a: "Strategiya 2024-yil 14-oktabrda Prezident farmoni (PQ-358) bilan tasdiqlangan va 2030-yilgacha mo'ljallangan. Asosiy maqsadlar — AI asosidagi dasturiy mahsulot va xizmatlar hajmini 1,5 mlrd dollarga yetkazish, yagona portal xizmatlarining 10 foizini AI asosida ko'rsatish va mamlakatni xalqaro AI tayyorlik reytingida top-50 davlat qatoriga olib chiqish.",
  },
  {
    q: "2026-yil avgustda strategiya bo'yicha nima yangilik bo'ldi?",
    a: "Prezidentga sohadagi natijalar va ustuvor vazifalar bo'yicha taqdimot qilindi. Shu doirada Raqamli texnologiyalar vazirligi birinchi vazir o'rinbosari Oleg Pekosh 2026-yil 8-avgustda O'zbekiston AI infratuzilmasiga $6 mlrddan ortiq xususiy investitsiya jalb qilish bo'yicha kelishuvlar imzolanganini e'lon qildi — bu mablag' 2030-yilgacha jami 800 MVt quvvatga ega hisoblash infratuzilmasini bosqichma-bosqich yaratishga yo'naltiriladi.",
  },
  {
    q: "Qaysi sohalarda AI loyihalari eng ko'p amalga oshirilmoqda?",
    a: "2026-yilning o'zida tibbiyot, energetika, transport, bojxona, huquqiy xizmatlar, jamoat xavfsizligi hamda ekologiya va geologiya sohalarida AI loyihalari qayd etilgan. Jami 2030-yilgacha 200 dan ortiq yangi loyiha, shu jumladan 2026-yilning o'zida 100 dan ortiq loyiha amalga oshirilishi rejalashtirilgan — lekin har bir sohada aniq qaysi loyiha ishlayotgani haligacha alohida-alohida rasman e'lon qilinmagan.",
  },
  {
    q: "Oddiy talaba yoki mutaxassis uchun bu strategiyadan qanday amaliy foyda bor?",
    a: "Kadrlar tayyorlashda aniq raqamlar bor: hozirgacha 1,5 milliondan ortiq kishi AI bo'yicha sertifikat olgan, jumladan 900 nafar rahbar xodim, 3 ming davlat xizmatchisi va 1 ming bank xodimi maxsus o'qitilgan, shuningdek loyihalarni amalga oshirish uchun 222 nafar AI maslahatchisi tanlab olingan. Bundan tashqari 2026-yildan \"Besh million sun'iy intellekt yetakchilari\" loyihasi ishlamoqda — bu dastur haqida batafsil AI qaysi kasblarni o'zgartiryapti maqolamizda yozilgan.",
  },
  {
    q: "NVIDIA superkompyuteri nima va u nima uchun kerak?",
    a: "2026-yil yozida ishga tushirilgan bu hisoblash infratuzilmasi AI modellarini o'qitish va ishga tushirish uchun mo'ljallangan quvvatli serverlar majmuasi. Hozircha jahon superkompyuterlar reytingida 321-o'rinni egallaydi, oylik yuklamasi esa 90 foizga yetgan — ya'ni deyarli to'liq band. Mavjud $24 mln sarmoyaga qo'shimcha yana $70 mln klasterni kengaytirishga yil oxirigacha taklif qilingan.",
  },
  {
    q: "O'zbekiston xalqaro AI reytingida qaysi o'rinda turibdi?",
    a: "So'nggi yillarda mamlakat xalqaro AI tayyorlik reytingida (Government AI Readiness Index) 25 pog'ona ko'tarilib, 62-o'rinni egalladi. 2030-yilgacha strategiyaning maqsadi — shu reytingda dunyodagi eng ilg'or 50 davlat qatoriga kirish.",
  },
  {
    q: "Bu strategiya ish o'rinlariga qanday ta'sir qiladi?",
    a: "Strategiyaning o'zi ish o'rinlarini qisqartirishga emas, infratuzilma va kadr salohiyatini oshirishga qaratilgan. Ammo amaliyotda AI allaqachon ayrim kasblarni — masalan call-markaz va buxgalteriya sohasini — o'zgartira boshlagan. Bu haqda alohida AI qaysi kasblarni o'zgartiryapti maqolasida batafsil yozilgan.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "O'zbekiston sun'iy intellekt strategiyasi (2030): kimlar uchun yangi imkoniyat ochadi?",
      description:
        "$6 mlrd xususiy investitsiya, 800 MVt infratuzilma va 200 dan ortiq loyiha 7 sohada — O'zbekistonning 2030-yilgacha AI strategiyasi talaba, mutaxassis va tadbirkor uchun qanday imkoniyat ochayotgani ko'rsatilgan.",
      datePublished: "2026-08-28",
      dateModified: "2026-08-28",
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
      name: "O'zbekistonda 2026-yilda AI loyihalari amalga oshirilayotgan sohalar",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Tibbiyot" },
        { "@type": "ListItem", position: 2, name: "Energetika" },
        { "@type": "ListItem", position: 3, name: "Transport" },
        { "@type": "ListItem", position: 4, name: "Bojxona" },
        { "@type": "ListItem", position: 5, name: "Huquqiy xizmatlar" },
        { "@type": "ListItem", position: 6, name: "Jamoat xavfsizligi" },
        { "@type": "ListItem", position: 7, name: "Ekologiya va geologiya" },
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
        { "@type": "ListItem", position: 3, name: "AI strategiyasi 2030", item: url },
      ],
    },
  ],
};

const kadrRows = [
  { toifa: "Sertifikat olganlar", son: "1,5 mln+", izoh: "AI bo'yicha umumiy sertifikatlash dasturi doirasida" },
  { toifa: "Rahbar xodimlar", son: "900 nafar", izoh: "Maxsus AI kursidan o'tgan" },
  { toifa: "Davlat xizmatchilari", son: "3 000 nafar", izoh: "AI vositalaridan foydalanishga o'qitilgan" },
  { toifa: "Bank xodimlari", son: "1 000 nafar", izoh: "AI vositalaridan foydalanishga o'qitilgan" },
  { toifa: "AI maslahatchilari", son: "222 nafar", izoh: "Loyihalarni amalga oshirish uchun tanlab olingan" },
];

const infraRows = [
  { yonalish: "Xususiy investitsiya kelishuvi", raqam: "$6 mlrd+", izoh: "2030-yilgacha, 2026-yil 8-avgustda e'lon qilindi" },
  { yonalish: "Rejalashtirilgan quvvat", raqam: "800 MVt", izoh: "Hisoblash infratuzilmasi, bosqichma-bosqich" },
  { yonalish: "GPU klaster (mavjud)", raqam: "$24 mln", izoh: "Joriy sarmoya" },
  { yonalish: "GPU klaster (kengaytirish)", raqam: "$70 mln", izoh: "Yil oxirigacha taklif qilingan" },
  { yonalish: "NVIDIA superkompyuter", raqam: "321-o'rin", izoh: "Jahon superkompyuterlar reytingida, oylik yuklama 90%" },
];

const sohalar = [
  "Tibbiyot",
  "Energetika",
  "Transport",
  "Bojxona",
  "Huquqiy xizmatlar",
  "Jamoat xavfsizligi",
  "Ekologiya va geologiya",
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
            <span className="text-[#16181a]">AI strategiyasi 2030</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-08-28">28-avgust, 2026</time> · Yangilangan: 2026-08 · O&apos;quvchilar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              O&apos;zbekiston sun&apos;iy intellekt strategiyasi (2030): kimlar uchun yangi imkoniyat ochadi?
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              2026-yil 8-avgustda O&apos;zbekiston AI infratuzilmasiga <strong>$6 mlrddan ortiq</strong> xususiy investitsiya kelishuvlarini imzoladi — maqsad 2030-yilgacha <strong>800 MVt</strong> quvvatga ega hisoblash infratuzilmasi yaratish. Shu bilan bir vaqtda tibbiyot, energetika, transport, bojxona, huquq, xavfsizlik va ekologiya kabi <strong>7 sohada 200 dan ortiq</strong> AI loyihasi amalga oshirilmoqda, mamlakat esa xalqaro AI tayyorlik reytingida <strong>25 pog&apos;ona ko&apos;tarilib 62-o&apos;ringa</strong> chiqdi. Bu — talaba, davlat xizmatchisi, bank xodimi va tadbirkor uchun turlicha, ammo aniq imkoniyat degani.
            </p>
          </section>

          {/* Section 1: why now */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Nega bu mavzu 2026-yil avgustda yana kun tartibiga keldi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              O&apos;zbekistonning sun&apos;iy intellekt strategiyasi 2024-yil 14-oktabrda Prezident farmoni (PQ-358) bilan tasdiqlangan va 2030-yilgacha mo&apos;ljallangan. Lekin 2026-yil avgust oyida jarayon aniq sezilarli tezlashdi: Prezident Shavkat Mirziyoyevga sohadagi natijalar va ustuvor vazifalar bo&apos;yicha taqdimot qilindi, shundan so&apos;ng Raqamli texnologiyalar vazirligi birinchi vazir o&apos;rinbosari Oleg Pekosh &quot;O&apos;zbekiston 24&quot; telekanaliga bergan intervyusida AI infratuzilmasiga <strong className="text-[#16181a]">$6 mlrddan ortiq</strong> xususiy investitsiya jalb qilish bo&apos;yicha kelishuvlar imzolanganini e&apos;lon qildi (
              <a href="https://www.spot.uz/ru/2026/08/08/artificial-intelligence" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Spot.uz, 2026-08-08</a>
              ).
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Bu mablag&apos; hisobiga 2030-yilgacha jami <strong className="text-[#16181a]">800 MVt</strong> quvvatga ega hisoblash infratuzilmasi mamlakat bo&apos;ylab bosqichma-bosqich quriladi. Sabab oddiy: mavjud infratuzilma allaqachon <strong className="text-[#16181a]">90 foiz</strong> yuklangan — ya&apos;ni deyarli to&apos;liq band, kengaytirmasdan yangi loyihalarga joy qolmayapti.
            </p>
          </section>

          {/* Section 2: sectors */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Qaysi sohalarda 200 dan ortiq loyiha amalga oshiriladi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              2030-yilgacha jami <strong className="text-[#16181a]">200 dan ortiq</strong> yangi AI loyihasi, shu jumladan <strong className="text-[#16181a]">2026-yilning o&apos;zida 100 dan ortiq</strong> loyiha rejalashtirilgan (
              <a href="https://www.gazeta.uz/oz/2026/08/07/ai-uzbekistan/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Gazeta.uz, 2026-08-07</a>
              ). Joriy yilda quyidagi yetti sohada AI loyihalari qayd etilgan:
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
              {sohalar.map((s) => (
                <li key={s} className="text-[15px] text-[#16181a]/80 flex items-start gap-2">
                  <span className="text-[#7ea2d4] mt-0.5">●</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Loyihalarni amalga oshirishda IT Park rezidentlari, startaplar va 20 dan ortiq AI laboratoriyasi ishtirok etmoqda. Har bir sohada aniq qaysi loyiha ishlayotgani hozircha alohida-alohida rasman e&apos;lon qilinmagan — ma&apos;lum bo&apos;lgani shu: sohalar ro&apos;yxati va umumiy son.
            </p>
          </section>

          {/* Section 3: kadrlar */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Kadrlar tayyorlashda kimlar ustuvor turibdi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Infratuzilmadan tashqari strategiyaning ikkinchi ustuni — odamlarni tayyorlash. Hozirgacha jalb qilinganlar soni aniq ko&apos;rsatilgan:
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Toifa</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Son</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Izoh</th>
                  </tr>
                </thead>
                <tbody>
                  {kadrRows.map((r) => (
                    <tr key={r.toifa} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.toifa}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.son}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.izoh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Bundan tashqari 2026-yildan &quot;Besh million sun&apos;iy intellekt yetakchilari&quot; loyihasi ishlamoqda — shu yilning o&apos;zida 500 ming kishi, 2035-yilga qadar jami 5 million kishi o&apos;qitilishi rejalashtirilgan. Bu dastur va AI allaqachon o&apos;zgartirayotgan aniq kasblar haqida{" "}
              <Link href="/blog/ai-qaysi-kasblarni-ozgartiryapti" className="text-[#7ea2d4] hover:underline">AI qaysi kasblarni o&apos;zgartiryapti maqolamizda</Link>{" "}
              batafsil yozilgan.
            </p>
          </section>

          {/* Section 4: investors/entrepreneurs */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Tadbirkor va IT mutaxassislar uchun qanday infratuzilma imkoniyati bor?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-4">
              Hisoblash quvvatiga eng ko&apos;p ehtiyoj sezadigan tomon — AI mahsulot yaratayotgan startap va IT kompaniyalar. 2026-yil yozida ishga tushirilgan NVIDIA texnologiyasidagi superkompyuter buning aniq belgisi: hozircha jahon superkompyuterlar reytingida <strong className="text-[#16181a]">321-o&apos;rinni</strong> egallaydi (
              <a href="https://www.spot.uz/oz/2026/08/07/ai-uzbekistan" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Spot.uz, 2026-08-07</a>
              ), oylik yuklamasi esa 90 foizga yetgan.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea] mb-4">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Yo&apos;nalish</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Raqam</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Izoh</th>
                  </tr>
                </thead>
                <tbody>
                  {infraRows.map((r) => (
                    <tr key={r.yonalish} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.yonalish}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.raqam}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.izoh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Bunday miqyosdagi infratuzilma kengayishi AI mahsulot ustida ishlaydigan dasturchi va data mutaxassislar uchun ham amaliy natija beradi — hisoblash quvvati tanqisligi endi loyihani cho&apos;zib yubormaydi. Bu yo&apos;nalishga qadam qo&apos;yishni rejalashtirganlar uchun{" "}
              <Link href="/blog/dasturlashni-noldan-organish-6-oylik-yol-xaritasi" className="text-[#7ea2d4] hover:underline">dasturlashni noldan o&apos;rganish rejasi</Link>{" "}
              boshlang&apos;ich qadam bo&apos;lishi mumkin.
            </p>
          </section>

          {/* Section 5: ranking */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">O&apos;zbekiston xalqaro AI reytingida qayerda turibdi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              So&apos;nggi yillarda mamlakat xalqaro AI tayyorlik reytingida (Government AI Readiness Index) <strong className="text-[#16181a]">25 pog&apos;ona ko&apos;tarilib, 62-o&apos;rinni</strong> egalladi. 2030-yilgacha strategiyaning rasmiy maqsadi — shu reytingda dunyodagi eng ilg&apos;or <strong className="text-[#16181a]">50 davlat</strong> qatoriga kirish. Bu ko&apos;tarilish tasodifiy emas — aynan yuqorida sanab o&apos;tilgan investitsiya, infratuzilma va kadrlar bo&apos;yicha qadamlar reytingga bevosita ta&apos;sir qiladigan mezonlar hisoblanadi.
            </p>
          </section>

          {/* Risks */}
          <section className="mb-10 bg-[#fff8f0] border border-[#f0e0cc] rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Nimalarga e&apos;tibor berish kerak?</h2>
            <ul className="space-y-2.5">
              {[
                "$6 mlrdlik kelishuv — imzolangan investitsiya niyati, hali sarflangan mablag' emas; qaysi kompaniyalar imzolagani rasman e'lon qilinmagan",
                "NVIDIA superkompyuter jahon reytingida 321-o'rinda — bu katta qadam, lekin hali yetakchi davlatlar darajasidan ancha uzoq",
                "200 dan ortiq loyiha rejalashtirilgan raqam — barchasi amalga oshgani haqida yakuniy hisobot hali yo'q, 2026-yil davomida kuzatish kerak",
                "\"Besh million AI yetakchilari\" va $1,5 mlrd dasturiy mahsulot maqsadlari — 2026-yil emas, 2030 yoki 2035-yilgacha mo'ljallangan uzoq muddatli reja",
                "Sohalar (tibbiyot, transport va h.k.) bo'yicha aniq loyiha nomlari va byudjeti hali oshkor qilinmagan — faqat ro'yxat va umumiy son ma'lum",
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
              Davlat va xususiy sektor AI&apos;ga milliardlab dollar yo&apos;naltirayotgan paytda, shu sohada ko&apos;nikma egallash endi erta emas — o&apos;z vaqtida qadam. Qaysi kasblar allaqachon o&apos;zgarayotgani{" "}
              <Link href="/blog/ai-qaysi-kasblarni-ozgartiryapti" className="text-[#7ea2d4] hover:underline">AI qaysi kasblarni o&apos;zgartiryapti maqolasida</Link>{" "}
              yozilgan. Sun&apos;iy intellekt yo&apos;nalishida bilim olishni boshlash uchun quyidagi kurslar bilan tanishing.
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
