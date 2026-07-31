import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/ishonchli-oquv-markazni-qanday-tekshirish`;

export const metadata: Metadata = {
  title: "Ishonchli o'quv markazni qanday tekshirish kerak? 5 mezon | Darslinker",
  description:
    "O'quv markazga pul to'lashdan oldin 5 narsani tekshiring: ro'yxatdan o'tish, ruxsat hujjati, shartnoma, o'qituvchi darajasi va manzil. 2026 qo'llanma.",
  keywords: [
    "ishonchli o'quv markaz",
    "o'quv markaz tekshirish",
    "o'quv markaz litsenziya",
    "kurs puli qaytariladimi",
    "o'quv markaz shartnoma",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  {
    q: "O'quv markazda litsenziya bo'lishi shartmi?",
    a: "Har doim emas. 2020-yil 24-avgustdagi PF-6044 farmoniga ko'ra, chet tillarini o'rgatish kurslari 2021-yil 1-yanvardan litsenziyalashdan chiqarilib, xabardor qilish tartibiga o'tkazilgan. Ya'ni til markazi litsenziyasiz ham qonuniy ishlashi mumkin, lekin vakolatli organga xabarnoma bergan bo'lishi kerak. Diplom beradigan nodavlat oliy ta'lim tashkilotlari uchun litsenziya hamon majburiy.",
  },
  {
    q: "Markazning hujjatini qayerdan tekshirsam bo'ladi?",
    a: "Litsenziya va ruxsat hujjatlari license.gov.uz saytining reestr bo'limida hujjat raqami bo'yicha tekshiriladi. Markaz yuridik shaxs sifatida ro'yxatdan o'tganini esa my.gov.uz'dagi 'Yuridik shaxslarning hisobga qo'yilgan ma'lumotlari' xizmati yoki orginfo.uz orqali STIR bo'yicha ko'rish mumkin.",
  },
  {
    q: "Yozma shartnomasiz o'qishga yozilsam bo'ladimi?",
    a: "Yo'q. Raqobatni rivojlantirish va iste'molchilar huquqlarini himoya qilish qo'mitasi 2024-2025-yillarda nodavlat ta'lim xizmatlari bo'yicha 1200 ga yaqin murojaat qabul qilgan va shikoyatlarning katta qismi aynan shartnoma shartlari hamda pulni qaytarish tartibi haqida yetarli ma'lumot berilmagani bilan bog'liq. Shartnomasiz to'lov — pulni qaytarib olish uchun huquqiy asosingiz yo'qligini anglatadi.",
  },
  {
    q: "Kursni tashlab ketsam, pulim qaytariladimi?",
    a: "Bu shartnomada qanday yozilganiga bog'liq. Shuning uchun imzolashdan oldin bekor qilish tartibi, qaytarish muddati va qaytarish usuli yozilganini tekshiring — tomonlar boshqacha kelishmagan bo'lsa, pul to'lov qilingan usulda qaytariladi.",
  },
  {
    q: "\"2+6\" dasturi nima va u nega ishonch signali?",
    a: "Bu 2025-yil 8-oktabrdagi 632-son qaror bilan joriy etilgan davlat subsidiyasi: 14-30 yoshdagi yoshlar o'quv markazida xorijiy tilni o'qishning dastlabki 2 oyini o'zi to'laydi, keyingi 6 oyi davlat hisobidan qoplanadi. Dasturda qatnashish uchun markaz elektron platformada ro'yxatdan o'tishi, davomatni kunlik elektron nazoratga ulashi va o'qituvchilari kamida B2 darajasidagi sertifikatga ega bo'lishi talab qilinadi. Markaz shu ro'yxatda bo'lsa, uning hujjatlari va o'qituvchi darajasi allaqachon tashqi tekshiruvdan o'tgan bo'ladi.",
  },
  {
    q: "Subsidiya miqdori qancha?",
    a: "Oylik subsidiya bazaviy hisoblash miqdoriga (BHM) bog'langan: Toshkent shahrida 2 BHM gacha, Qoraqalpog'iston va viloyat markazlarida 1,5 BHM gacha, tuman va shaharlarda 1 BHM gacha. 2026-yil 1-sentabrdan BHM 440 000 so'm — bu Toshkent uchun oyiga 880 000 so'mgacha degani. Dastur bo'yicha yiliga 20 000 nafargacha yosh qamrab olinadi.",
  },
  {
    q: "Darslinker markazlarni tekshiradimi?",
    a: "Darslinker — katalog: har bir e'lon sahifasida markazning narxi, formati, hududi va aloqa ma'lumotlari ochiq ko'rsatiladi, shuning uchun taqqoslash va bog'lanish oson. Hujjat darajasidagi rasmiy tekshiruvni esa yuqorida ko'rsatilgan davlat resurslari orqali o'zingiz o'tkazasiz — bu ikki bosqich bir-birini to'ldiradi.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Ishonchli o'quv markazni qanday tekshirish kerak? 5 mezon (2026)",
      description:
        "O'quv markazga pul to'lashdan oldin tekshiriladigan 5 mezon: yuridik ro'yxat, ruxsat hujjati, shartnoma va pul qaytarish, davlat dasturidagi maqom, jismoniy tekshiruv.",
      datePublished: "2026-07-31",
      dateModified: "2026-07-31",
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
      name: "O'quv markazning ishonchliligini 5 qadamda tekshirish",
      description:
        "To'lovdan oldin o'quv markazni rasmiy manbalar va shartnoma orqali tekshirish tartibi.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Yuridik shaxs sifatida ro'yxatdan o'tganini tekshiring", text: "STIR bo'yicha my.gov.uz yoki orginfo.uz'da tashkilot nomi, ro'yxatdan o'tgan sanasi, faoliyat turi va rahbarini ko'ring." },
        { "@type": "HowToStep", position: 2, name: "Ruxsat hujjatini so'rang va reestrdan tekshiring", text: "Litsenziya yoki xabarnoma raqamini so'rab, license.gov.uz reestrida hujjat raqami bo'yicha izlang." },
        { "@type": "HowToStep", position: 3, name: "Yozma shartnomani o'qing", text: "Umumiy summa, dars soni, bekor qilish tartibi va pulni qaytarish muddati yozilganini tekshiring." },
        { "@type": "HowToStep", position: 4, name: "Davlat dasturidagi maqomini aniqlang", text: "Markaz \"2+6\" til subsidiyasi dasturida qatnashishini so'rang — bu tashqi tekshiruvdan o'tgani signali." },
        { "@type": "HowToStep", position: 5, name: "Manzilga borib ko'ring", text: "Offline kurs bo'lsa, sinf, jihoz va demo darsni o'z ko'zingiz bilan ko'rmasdan to'lov qilmang." },
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
        { "@type": "ListItem", position: 3, name: "Ishonchli o'quv markazni qanday tekshirish", item: url },
      ],
    },
  ],
};

const criteriaRows = [
  { n: "1", mezon: "Yuridik ro'yxat", qayerdan: "my.gov.uz / orginfo.uz", nima: "STIR, ro'yxat sanasi, rahbar, manzil" },
  { n: "2", mezon: "Ruxsat hujjati", qayerdan: "license.gov.uz reestri", nima: "Litsenziya yoki xabarnoma raqami" },
  { n: "3", mezon: "Shartnoma", qayerdan: "Markazning o'zidan", nima: "Summa, dars soni, pul qaytarish tartibi" },
  { n: "4", mezon: "Davlat dasturi", qayerdan: "Markazdan so'rash", nima: "\"2+6\" subsidiyasida qatnashadimi" },
  { n: "5", mezon: "Jismoniy tekshiruv", qayerdan: "Manzilga borish", nima: "Sinf, jihoz, demo dars" },
];

const redFlags = [
  "Hujjat raqamini aytishdan bosh tortadi yoki \"bizda hammasi bor\" deb umumiy javob beradi",
  "To'lovni tashkilot hisobiga emas, xodimning shaxsiy karta raqamiga so'raydi",
  "Yozma shartnoma bermaydi — faqat Telegram'dagi yozishmalar bilan cheklanadi",
  "\"Bugun to'lasangiz chegirma, o'rin qolmadi\" — o'ylab ko'rishga vaqt bermaydigan bosim",
  "Real manzili yo'q yoki manzili boshqa tashkilotga tegishli bo'lib chiqadi",
  "Pulni qaytarish sharti shartnomada umuman yozilmagan",
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
            <span className="text-[#16181a]">Ishonchli o&apos;quv markazni tekshirish</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-07-31">31-iyul, 2026</time> · O&apos;quvchilar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              Ishonchli o&apos;quv markazni qanday tekshirish kerak? 5 mezon (2026)
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              Ishonchli o&apos;quv markazni tekshirish uchun to&apos;lovdan oldin 5 narsani aniqlang: markaz yuridik shaxs sifatida ro&apos;yxatdan o&apos;tganmi, ruxsat hujjati (litsenziya yoki xabarnoma) bormi, yozma shartnomada pul qaytarish sharti yozilganmi, o&apos;qituvchi darajasi tasdiqlanganmi va manzili real mavjudmi. Markazlarni taqqoslashni{" "}
              <Link href="/oquv-markazlar" className="text-[#7ea2d4] hover:underline font-semibold">Darslinker katalogidan</Link>{" "}
              boshlab, hujjatlarni quyidagi davlat resurslarida tekshirish qulay.
            </p>
          </section>

          {/* Why it matters */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Nega markazni oldindan tekshirish kerak?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Chunki eng ko&apos;p shikoyat aynan to&apos;lovdan keyin paydo bo&apos;ladi. Raqobatni rivojlantirish va iste&apos;molchilar huquqlarini himoya qilish qo&apos;mitasi ma&apos;lumotiga ko&apos;ra, 2024-2025-yillarda nodavlat ta&apos;lim xizmatlari bo&apos;yicha 1200 ga yaqin murojaat kelib tushgan (
              <a href="https://www.gazeta.uz/oz/2025/12/18/nno/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Gazeta.uz</a>
              ).
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Shikoyatlarning asosiy uch sababi: ta&apos;lim sifati qoniqarsizligi, ko&apos;rsatilmagan xizmat uchun pul olinishi va shartnoma shartlari hamda pulni qaytarish tartibi haqida yetarli ma&apos;lumot berilmasligi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Bu uchtasining ikkitasi — pul bilan bog&apos;liq va ularning barchasi to&apos;lovdan <strong className="text-[#16181a]">oldin</strong> 15 daqiqalik tekshiruv bilan oldini olsa bo&apos;ladi.
            </p>
          </section>

          {/* Wrong question */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">&ldquo;Litsenziyangiz bormi?&rdquo; — nega bu noto&apos;g&apos;ri savol?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Chunki ko&apos;pchilik o&apos;quv markazlarga endi litsenziya talab qilinmaydi. 2020-yil 24-avgustdagi{" "}
              <a href="https://lex.uz/docs/-4966394" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">PF-6044 Farmoni</a>{" "}
              bilan chet tillarini o&apos;rgatish kurslarini tashkil etish 2021-yil 1-yanvardan litsenziyalash ro&apos;yxatidan chiqarilib, <strong className="text-[#16181a]">xabardor qilish tartibi</strong>ga o&apos;tkazildi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Ya&apos;ni til markazi litsenziyasiz ham to&apos;liq qonuniy ishlashi mumkin — lekin u faoliyatni boshlagani haqida vakolatli organga xabarnoma yuborgan bo&apos;lishi shart. Bu tartib{" "}
              <a href="https://lex.uz/docs/-5511879" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">&ldquo;Litsenziyalash, ruxsat berish va xabardor qilish tartib-taomillari to&apos;g&apos;risida&rdquo;gi Qonun</a>{" "}
              bilan tartibga solingan. Diplom beradigan nodavlat oliy ta&apos;lim tashkilotlari uchun esa litsenziya hamon majburiy.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Shuning uchun to&apos;g&apos;ri savol boshqacha yangraydi: <strong className="text-[#16181a]">&ldquo;Qaysi hujjat asosida ishlaysiz — litsenziya yoki xabarnoma? Raqamini ayting.&rdquo;</strong> Aniq raqam aytilmasa — bu allaqachon birinchi signal.
            </p>
          </section>

          {/* Table */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Qaysi 5 mezonni va qayerdan tekshirish kerak?</h2>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">#</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Mezon</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Qayerdan</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Nimani ko&apos;rasiz</th>
                  </tr>
                </thead>
                <tbody>
                  {criteriaRows.map((r) => (
                    <tr key={r.n} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.n}</td>
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.mezon}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.qayerdan}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.nima}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 1 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">1. Markaz yuridik shaxs sifatida ro&apos;yxatdan o&apos;tganmi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Bu eng birinchi va eng oson tekshiruv. Markazdan STIR (soliq to&apos;lovchi identifikatsiya raqami) va tashkilotning to&apos;liq rasmiy nomini so&apos;rang — reklama nomi bilan hujjatdagi nom ko&apos;pincha farq qiladi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Keyin{" "}
              <a href="https://my.gov.uz/oz/service/77" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">my.gov.uz&apos;dagi &ldquo;Yuridik shaxslarning hisobga qo&apos;yilgan ma&apos;lumotlari&rdquo;</a>{" "}
              xizmati yoki{" "}
              <a href="https://orginfo.uz/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">orginfo.uz</a>{" "}
              orqali tekshiring. Orginfo Davlat statistika qo&apos;mitasining ochiq ma&apos;lumotlariga tayanadi va tashkilotni nomi bo&apos;yicha ham topish imkonini beradi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Nimaga qaraysiz: ro&apos;yxatdan o&apos;tgan sana (bir oylik tashkilot 5 yillik tajriba haqida gapirayotgan bo&apos;lsa — nomuvofiqlik), asosiy faoliyat turi ta&apos;lim sohasiga tegishlimi, rasmiy manzil va rahbar ismi.
            </p>
          </section>

          {/* 2 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">2. Ruxsat hujjati reestrda bormi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Markaz aytgan hujjat raqamini{" "}
              <a href="https://license.gov.uz/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">license.gov.uz</a>{" "}
              saytining reestr bo&apos;limida hujjat raqami bo&apos;yicha izlang. Bu &ldquo;Litsenziya&rdquo; axborot tizimi — litsenziyalar ham, xabarnomalar ham shu tizim orqali rasmiylashtiriladi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Devorga osilgan chiroyli sertifikat hech narsani isbotlamaydi. Reestrda topilmagan hujjat — mavjud emas degani. Agar hujjat nusxasida QR-kod bo&apos;lsa, uni skanerlab ham tekshirsa bo&apos;ladi.
            </p>
          </section>

          {/* 3 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">3. Shartnomada pul qaytarish sharti yozilganmi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Yozma shartnomasiz to&apos;lov qilish — pulni qaytarib olish uchun huquqiy asosingizni yo&apos;qotish demak. Shartnomani imzolashdan oldin quyidagi 5 bandni topganingizga ishonch hosil qiling:
            </p>
            <ul className="space-y-2.5 ml-1 mb-3">
              {[
                "Umumiy summa — oylik narx emas, kursning to'liq narxi",
                "Dars soni va davomiyligi — necha dars, har biri necha daqiqa",
                "Qoldirilgan dars tartibi — kim aybdor bo'lsa ham, dars qayta o'tiladimi",
                "Bekor qilish tartibi — o'qishni to'xtatsangiz nima bo'ladi",
                "Pulni qaytarish muddati va usuli — necha kun ichida va qaysi yo'l bilan",
              ].map((p, i) => (
                <li key={i} className="text-[15px] text-[#16181a]/80 flex items-start gap-2">
                  <span className="text-[#7ea2d4] mt-1">▸</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              <a href="https://raqobat.gov.uz/uz/istemolchilar-huquqlarini-himoya-qilish-togrisidagi-qonunning-asosiy-jihatlari/" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Iste&apos;molchilar huquqlarini himoya qilish to&apos;g&apos;risidagi qonun</a>{" "}
              bo&apos;yicha, tomonlar boshqacha kelishmagan bo&apos;lsa, pul to&apos;lov amalga oshirilgan usulda qaytariladi. Naqd to&apos;lov qilib kvitansiya olmagan bo&apos;lsangiz — buni isbotlash qiyin bo&apos;ladi.
            </p>
          </section>

          {/* 4 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">4. Markaz &ldquo;2+6&rdquo; davlat dasturida qatnashadimi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Bu 2026-yilda paydo bo&apos;lgan eng kuchli tashqi ishonch signali — va ko&apos;pchilik undan xabarsiz. 2025-yil 8-oktabrdagi{" "}
              <a href="https://lex.uz/uz/docs/-7759309" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">632-son qaror</a>{" "}
              bilan &ldquo;2+6&rdquo; dasturi joriy etildi: 14-30 yoshdagi yosh xorijiy tilni o&apos;rganishning dastlabki 2 oyini o&apos;zi to&apos;laydi, keyingi 6 oyi davlat subsidiyasi hisobidan qoplanadi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Markaz bu dasturga o&apos;z-o&apos;zidan kira olmaydi. Qatnashish uchun u elektron platformada belgilangan tartibda ro&apos;yxatdan o&apos;tishi, o&apos;quvchilar davomatini kunlik elektron nazoratga ulashi va o&apos;qituvchilari kamida <strong className="text-[#16181a]">B2</strong> yoki unga tenglashtirilgan til sertifikatiga ega bo&apos;lishi talab qilinadi. Ariza beruvchi yoshdan esa kamida B1 darajadagi sertifikat va kursda 70% davomat so&apos;raladi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Subsidiya miqdori bazaviy hisoblash miqdoriga (BHM) bog&apos;langan: Toshkent shahrida 2 BHM gacha, Qoraqalpog&apos;iston Respublikasi va viloyat markazlarida 1,5 BHM gacha, tuman va shaharlarda 1 BHM gacha oyiga. 2026-yil 1-sentabrdan BHM 440 000 so&apos;mni tashkil etadi — ya&apos;ni Toshkentda oyiga 880 000 so&apos;mgacha. Dastur yiliga 20 000 nafargacha yoshni qamrab oladi va 2031-yilgacha amal qiladi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Siz uchun xulosa oddiy: markaz shu ro&apos;yxatda bo&apos;lsa, uning hujjatlari va o&apos;qituvchilarining darajasi allaqachon tashqi tekshiruvdan o&apos;tgan. Til kursi qidirayotgan bo&apos;lsangiz, bu savolni albatta bering —{" "}
              <Link href="/kurslar" className="text-[#7ea2d4] hover:underline">yo&apos;nalish bo&apos;yicha kurslar ro&apos;yxatini</Link>{" "}
              ko&apos;rib chiqib, tanlangan markazlarga aynan shu savolni yozing.
            </p>
          </section>

          {/* 5 */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">5. Manzil real mavjudmi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Offline kurs bo&apos;lsa, to&apos;lovdan oldin manzilga borib ko&apos;rish — Raqobat qo&apos;mitasining ham iste&apos;molchilarga bergan bevosita tavsiyasi. 20 daqiqalik tashrif hujjatlar bermaydigan ma&apos;lumotni beradi: sinf haqiqatan bormi, nechta o&apos;quvchi sig&apos;adi, jihoz ishlaydimi, xodimlar savolga qanday javob beradi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              O&apos;z hududingizdagi markazlarni oldindan ko&apos;rib chiqish uchun{" "}
              <Link href="/joylar" className="text-[#7ea2d4] hover:underline">viloyat bo&apos;yicha qidiruv sahifasidan</Link>{" "}
              foydalanish mumkin — manzil va aloqa ma&apos;lumotlari e&apos;lon sahifasida ko&apos;rsatilgan bo&apos;ladi.
            </p>
          </section>

          {/* Red flags */}
          <section className="mb-10 bg-red-50 border border-red-100 rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Qaysi xavf signallarida to&apos;lov qilmaslik kerak?</h2>
            <ul className="space-y-2.5">
              {redFlags.map((f, i) => (
                <li key={i} className="text-[15px] text-[#16181a]/80 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Darslinker */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Tekshiruvni qayerdan boshlash qulay?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Yuqoridagi 5 mezon rasmiy hujjatlarni tekshiradi, lekin undan oldin sizga taqqoslash uchun ro&apos;yxat kerak bo&apos;ladi.{" "}
              <Link href="/oquv-markazlar" className="text-[#7ea2d4] hover:underline">Darslinker katalogida</Link>{" "}
              markazlar 7 ta yo&apos;nalish guruhi bo&apos;yicha bo&apos;lingan va 14 ta viloyat bo&apos;yicha filtrlanadi. Har bir e&apos;lon sahifasida narx, format (onlayn, offline yoki gibrid), hudud va aloqa ma&apos;lumotlari ochiq ko&apos;rsatiladi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Amaliy tartib shunday: katalogdan 3-4 ta nomzod tanlaysiz, ularning STIR va hujjat raqamini so&apos;raysiz, davlat reestrlaridan tekshirasiz, shartnomani o&apos;qiysiz — va shundan keyingina to&apos;laysiz. Markaz sifatini baholash mezonlari (o&apos;qituvchi, metodika, demo dars) haqida alohida qo&apos;llanma bor:{" "}
              <Link href="/blog/kursni-qanday-tanlash-7-mezon" className="text-[#7ea2d4] hover:underline">kursni qanday tanlash — 7 mezon</Link>. Qidiruvni umuman qayerdan boshlashni bilmasangiz:{" "}
              <Link href="/blog/kurslarni-qayerdan-topish-mumkin" className="text-[#7ea2d4] hover:underline">kurslarni qayerdan topish mumkin</Link>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Tez-tez beriladigan savollar</h2>
            <FaqList items={faqs} />
          </section>

          <section className="border-t border-[#e4e7ea] pt-10">
            <p className="text-[15.5px] text-[#16181a]/75 mb-4">
              Tekshirishni boshlash uchun avval nomzodlar ro&apos;yxatini tuzing — hudud va yo&apos;nalish bo&apos;yicha filtrlab ko&apos;ring:
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/oquv-markazlar"
                className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                O&apos;quv markazlarni ko&apos;rish →
              </Link>
              <Link
                href="/kurslar"
                className="inline-flex items-center gap-2 border-2 border-[#e4e7ea] hover:border-[#16181a] text-[#16181a] rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Yo&apos;nalish bo&apos;yicha kurslar →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
