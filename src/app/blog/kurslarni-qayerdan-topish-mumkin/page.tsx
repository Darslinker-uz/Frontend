import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/kurslarni-qayerdan-topish-mumkin`;

export const metadata: Metadata = {
  title: "Kurslarni qayerdan topish mumkin? (2026) | Darslinker",
  description:
    "O'zbekistonda kurslarni qayerdan topish mumkin — ijtimoiy tarmoq, tavsiya yoki katalogdan. Yo'nalish, shahar va narx bo'yicha qidirish uchun qo'llanma.",
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  { q: "Darslinker'da kurs qidirish bepulmi?", a: "Ha. O'quvchilar uchun qidiruv, filtrlash va markazlarga murojaat qilish butunlay bepul." },
  { q: "Qaysi yo'nalishlar bo'yicha kurslarni topsam bo'ladi?", a: "7 ta asosiy guruh bo'yicha: Tillar, IT va dasturlash, Biznes va marketing, Dizayn va san'at, Akademik fanlar, Bolalar uchun yo'nalishlar va kasbiy ko'nikmalar (masalan, haydovchilik, kulinariya)." },
  { q: "Faqat Toshkentdagi markazlarni ko'rsatadimi?", a: "Yo'q. Barcha 14 ta viloyat (Toshkent shahri, Toshkent viloyati, Samarqand, Buxoro, Andijon, Farg'ona, Namangan va boshqalar) bo'yicha filtrlash mavjud." },
  { q: "Onlayn kurslarni ham topish mumkinmi?", a: "Ha. Format bo'yicha — onlayn, offline yoki gibrid — filtrlash mavjud, shuning uchun boshqa shahardan bo'lsangiz ham mos kursni topa olasiz." },
  { q: "Markazning ishonchli ekanligini qanday bilsam bo'ladi?", a: "Har bir markaz sahifasida narx, format va aloqa ma'lumotlari ko'rsatilgan. Tanlash bosqichida qaysi mezonlarga qarash kerakligi haqida batafsil: kursni qanday tanlash bo'yicha qo'llanma." },
  { q: "Bir nechta markazning narxini bir joyda solishtirsam bo'ladimi?", a: "Ha, bu katalog orqali qidirishning asosiy afzalligi — bir nechta markazni yonma-yon ko'rib, narx va formatni solishtirish mumkin." },
  { q: "O'quv markaz sifatida ro'yxatdan o'tishim mumkinmi?", a: "Ha, markazlar o'z kurslarini bepul yoki pullik joylashtirishi mumkin. Batafsil: hamkorlik sahifasi." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "O'zbekistonda kurslarni qayerdan topish mumkin? (2026 qo'llanma)",
      datePublished: "2026-07-02",
      dateModified: "2026-07-02",
      author: { "@type": "Organization", name: "Darslinker.uz" },
      publisher: { "@type": "Organization", name: "Darslinker.uz", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
      mainEntityOfPage: url,
    },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

const comparisonRows = [
  { mezon: "Manba", social: "Ijtimoiy tarmoq reklamasi / tavsiya", katalog: "Bitta markazlashgan katalog" },
  { mezon: "Solishtirish", social: "Har bir markazni alohida qidirish kerak", katalog: "Bir nechta markazni yonma-yon ko'rish" },
  { mezon: "Filtrlash", social: "Yo'q — qo'lda qidirish", katalog: "Yo'nalish, shahar, narx, format bo'yicha filtr" },
  { mezon: "Narxni ko'rish", social: "Ko'pincha faqat murojaatdan keyin", katalog: "Sahifada oldindan ko'rinadi" },
  { mezon: "Vaqt", social: "Bir necha kun (turli manba, turli format)", katalog: "Bir necha daqiqa" },
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
            <span className="text-[#16181a]">Kurslarni qayerdan topish mumkin</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">Yangilangan: 2026-07</div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              O&apos;zbekistonda kurslarni qayerdan topish mumkin? (2026 qo&apos;llanma)
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              O&apos;zbekistonda kurslarni eng tez topish uchun{" "}
              <Link href="/kurslar" className="text-[#7ea2d4] hover:underline font-semibold">Darslinker.uz</Link> kabi katalogdan foydalanish qulay — bu yerda yo&apos;nalish, shahar va narx bo&apos;yicha filtrlab, bir nechta o&apos;quv markazini bir joyda solishtirish mumkin. Ijtimoiy tarmoqlarda alohida-alohida qidirishga qaraganda ancha tezroq yo&apos;l.
            </p>
          </section>

          {/* Problem */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Nega kurs qidirish qiyin bo&apos;lib qolgan?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              O&apos;zbekistonda ta&apos;lim xizmatlari hajmi 2025-yil yanvar-aprel oylarida 11,1 trillion so&apos;mga yetdi — bir yil oldingiga nisbatan 8,4% o&apos;sish (
              <a href="https://yuz.uz/en/news/v-uzbekistane-obem-uslug-v-sfere-obrazovaniya-dostig-111-trln-sumov" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Davlat statistika qo&apos;mitasi ma&apos;lumotlari</a>
              ). Bozor o&apos;sgani sayin o&apos;quv markazlar soni ham ko&apos;paymoqda — bu esa tanlov ko&apos;payishi bilan birga, solishtirish qiyinlashishini ham anglatadi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Aksariyat markazlar o&apos;zini faqat ijtimoiy tarmoqlarda reklama qiladi. O&apos;zbekistonda Telegram&apos;dan 27 million (aholining 76%), Instagram&apos;dan esa 11 million kishi foydalanadi (
              <a href="https://datareportal.com/reports/digital-2026-uzbekistan" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">DataReportal, Digital 2026: Uzbekistan</a>
              ) — lekin bu kanallar tarqoq: har bir markaz o&apos;z sahifasida reklama qiladi, ularni bir joyda solishtirib bo&apos;lmaydi.
            </p>
          </section>

          {/* Criteria for a good discovery platform */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Yaxshi qidiruv platformasida nima bo&apos;lishi kerak?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Kurs qidirishning har xil usuli bor — do&apos;stlar tavsiyasi, Google qidiruvi, ijtimoiy tarmoq reklamasi. Lekin qaysi usulni tanlashingizdan qat&apos;i nazar, natija sifatli bo&apos;lishi uchun quyidagi 5 narsaga e&apos;tibor bering:
            </p>
            <ul className="space-y-2.5 ml-1">
              {[
                "Haqiqiy e'lonlar ro'yxati — reklama emas, filtrlab ko'rish mumkin bo'lgan katalog",
                "Yo'nalish, shahar va narx bo'yicha filtr",
                "O'quvchi uchun bepul foydalanish",
                "Bir nechta markazni bir joyda solishtirish imkoni",
                "Format bo'yicha ajratish — onlayn, offline yoki gibrid",
              ].map((p, i) => (
                <li key={i} className="text-[15px] text-[#16181a]/80 flex items-start gap-2">
                  <span className="text-[#7ea2d4] mt-1">▸</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Comparison table */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Ijtimoiy tarmoqda qidirish va katalog orqali qidirish — farqi</h2>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Mezon</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Ijtimoiy tarmoq / tavsiya</th>
                    <th className="px-4 py-3 font-semibold text-[#16181a]">Katalog</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((r, i) => (
                    <tr key={i} className="border-t border-[#e4e7ea]">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.mezon}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.social}</td>
                      <td className="px-4 py-3 text-[#16181a]/75">{r.katalog}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Common mistakes */}
          <section className="mb-10 bg-red-50 border border-red-100 rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Kurs qidirishda ko&apos;p uchraydigan 3 xato</h2>
            <ol className="space-y-2.5 text-[15px] text-[#16181a]/80">
              <li><strong className="text-[#16181a]">1. Faqat bitta manbaga ishonish</strong> — bitta Instagram sahifasidagi reklamaga qarab qaror qilish, boshqa variantlarni solishtirmaslik ko&apos;pincha noto&apos;g&apos;ri tanlovga olib keladi.</li>
              <li><strong className="text-[#16181a]">2. Narxni oldindan bilmaslik</strong> — ko&apos;p markazlar narxni faqat to&apos;g&apos;ridan-to&apos;g&apos;ri murojaat qilgandan keyin aytadi, bu bir nechta markazga alohida yozishishga va vaqt yo&apos;qotishga olib keladi.</li>
              <li><strong className="text-[#16181a]">3. Hududni hisobga olmaslik</strong> — masofa uzoq bo&apos;lgan markazni tanlab, keyin muntazam yetib borish qiyin bo&apos;lib qolishi — offline kursni tashlab ketishning eng ko&apos;p uchraydigan sababi.</li>
            </ol>
          </section>

          {/* How Darslinker works */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Darslinker qanday ishlaydi?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              <Link href="/kurslar" className="text-[#7ea2d4] hover:underline">Darslinker katalogida</Link> kurslar 7 ta yo&apos;nalish guruhiga bo&apos;lingan — Tillar, IT va dasturlash, Biznes va marketing, Dizayn va san&apos;at, Akademik fanlar, Bolalar uchun yo&apos;nalishlar va kasbiy ko&apos;nikmalar (masalan, haydovchilik kurslari). Har bir yo&apos;nalish ichida narx, shahar va format bo&apos;yicha filtrlash mumkin.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Agar aynan o&apos;z hududingizdagi markazlarni ko&apos;rmoqchi bo&apos;lsangiz —{" "}
              <Link href="/joylar" className="text-[#7ea2d4] hover:underline">viloyat bo&apos;yicha qidiruv sahifasi</Link>{" "}
              orqali 14 ta viloyatning istalganida joylashgan markazlarni ko&apos;rish mumkin.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Tez-tez beriladigan savollar</h2>
            <FaqList items={faqs} />
          </section>

          <section className="border-t border-[#e4e7ea] pt-10">
            <p className="text-[15.5px] text-[#16181a]/75 mb-4">
              O&apos;zingizga mos kursni topish uchun yo&apos;nalish va shahar bo&apos;yicha filtrlab ko&apos;ring:
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kurslar"
                className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Barcha kurslarni ko&apos;rish →
              </Link>
              <Link
                href="/joylar"
                className="inline-flex items-center gap-2 border-2 border-[#e4e7ea] hover:border-[#16181a] text-[#16181a] rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Hududim bo&apos;yicha qidirish →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
