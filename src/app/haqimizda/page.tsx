import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";
import { CRM_FEATURES, PLANS, TAGLINE } from "@/lib/crm-content";
import { SHARE_OG, SHARE_TWITTER } from "@/lib/share-meta";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const SUPPORT_URL = "https://t.me/Darslinker_Support";

// Kompaniya sahifasi. 2026-10-23 dan Darslinker'ning asosiy mahsuloti — o'quv markazlari uchun
// CRM va LMS; kurslar katalogi /marketplace da davom etadi. Faktlar — src/lib/crm-content.ts va
// egasining ma'lumotlari (tarix jadvali). Tasdiqlanmagan raqam yoki va'da qo'shilmaydi.

const TITLE = "Darslinker haqida — o'quv markazlari uchun CRM va LMS";
const DESCRIPTION =
  "Darslinker — O'zbekistondagi o'quv markazlari uchun interaktiv CRM va LMS platformasi: davomat, to'lov va qarzdorlik, jonli quiz va ota-onaga Telegram xabarlari bitta tizimda.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["Darslinker", "Darslinker haqida", "o'quv markaz CRM", "CRM va LMS", "Darslinker marketplace"],
  alternates: { canonical: `${SITE_URL}/haqimizda` },
  openGraph: { ...SHARE_OG, url: `${SITE_URL}/haqimizda`, title: TITLE, description: DESCRIPTION },
  twitter: { ...SHARE_TWITTER, title: TITLE, description: DESCRIPTION },
};

const minPrice = PLANS[0].price;

const faqs = [
  {
    q: "Darslinker nima?",
    a: "Darslinker — O'zbekistondagi o'quv markazlari uchun interaktiv CRM va LMS platformasi. O'quvchilar, guruhlar, dars jadvali, davomat, to'lov va qarzdorlik bitta tizimda yuritiladi, jonli quiz va ota-onaga Telegram xabarlari esa o'quvchini markazda ushlab qolishga yordam beradi.",
  },
  {
    q: "Darslinker kimlar uchun?",
    a: "Xususiy o'quv markazlari (til, IT, abituriyentlarga tayyorlov va boshqa yo'nalishlar) va repetitorlar uchun. Ayniqsa hali daftar yoki Excel'da ishlayotgan markazlar uchun.",
  },
  {
    q: "Darslinker qancha turadi?",
    a: `Tariflar oyiga ${minPrice} so'mdan boshlanadi. Barcha imkoniyatlar har bir tarifda bor, tariflar faqat o'quvchilar, filiallar va xodimlar soni bilan farq qiladi. Istalgan tarifni 14 kun bepul sinab ko'rish mumkin.`,
  },
  {
    q: "Darslinker yangi o'quvchi topishga yordam beradimi?",
    a: "Ha. Darslinker'da kurslar marketplace'i ham bor (darslinker.uz/marketplace). O'quvchilar u yerda kurslarni solishtiradi va markazga to'g'ridan-to'g'ri ariza qoldiradi, shuning uchun markaz CRM bilan birga qo'shimcha lidlar ham oladi.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "name": "Darslinker haqida",
      "url": `${SITE_URL}/haqimizda`,
      "description": DESCRIPTION,
      "inLanguage": "uz",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": { "@id": `${SITE_URL}/#organization` },
      "mainEntity": { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "Darslinker",
      "url": SITE_URL,
      "logo": `${SITE_URL}/icon-512.png`,
      "foundingDate": "2025-09",
      "description": TAGLINE,
      "areaServed": { "@type": "Country", "name": "O'zbekiston" },
      "sameAs": [
        "https://t.me/darslinker",
        "https://www.instagram.com/darslinker",
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": SUPPORT_URL,
        "availableLanguage": ["Uzbek", "uz"],
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
  ],
};

const P = "text-[15.5px] md:text-[16px] text-[#16181a]/75 leading-relaxed";
const H2 = "text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4";
const LINK = "text-[#426a9e] underline underline-offset-4 hover:text-[#16181a]";

export default function HaqimizdaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white min-h-screen">
        <article className="max-w-[760px] mx-auto px-5 md:px-6 py-12 md:py-16">
          <header className="mb-12">
            <h1 className="text-[32px] md:text-[44px] font-bold text-[#16181a] leading-tight tracking-tight">
              Darslinker haqida
            </h1>
            <p className="mt-5 text-[16px] md:text-[18px] text-[#16181a]/75 leading-relaxed">
              Darslinker — O&apos;zbekistondagi o&apos;quv markazlari uchun interaktiv CRM va LMS
              platformasi. O&apos;quvchilar, guruhlar, davomat, to&apos;lov va qarzdorlik bitta
              tizimda yuritiladi, jonli quiz va ota-onaga Telegram xabarlari esa o&apos;quvchini
              markazda ushlab qolishga yordam beradi.
            </p>
          </header>

          <section className="mb-10">
            <h2 className={H2}>Qaysi muammoni yechamiz?</h2>
            <p className={`${P} mb-4`}>
              Ko&apos;p o&apos;quv markazlari hali ham daftar, Excel va Telegram chatlarida ishlaydi.
              Natijada:
            </p>
            <ul className={`space-y-2.5 ${P} mb-4 pl-5 list-disc`}>
              <li>qarzdorlik vaqtida bilinmaydi — to&apos;lovlar turli joyda qayd etiladi;</li>
              <li>guruh va dars vaqtlari chalkashadi, bo&apos;sh joyni topish qiyinlashadi;</li>
              <li>o&apos;quvchi darslarni qoldira boshlaganini kech sezasiz;</li>
              <li>ota-onaga xabar berish uchun pullik SMS yoki qo&apos;lda qo&apos;ng&apos;iroq kerak.</li>
            </ul>
            <p className={P}>
              Darslinker shu ishlarni bitta tizimga yig&apos;adi va o&apos;quvchini ushlab qolishga
              alohida e&apos;tibor beradi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Darslinker nimalar qila oladi?</h2>
            <ul className={`space-y-2.5 ${P} pl-5 list-disc`}>
              {CRM_FEATURES.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <p className={`${P} mt-4`}>
              Barcha imkoniyatlar har bir tarifda bor. Tariflar oyiga {minPrice} so&apos;mdan
              boshlanadi va faqat o&apos;quvchilar, filiallar va xodimlar soni bilan farq qiladi —{" "}
              <Link href="/#narxlar" className={LINK}>tariflar va narxlar</Link>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Bizning missiyamiz qanday?</h2>
            <p className={P}>
              Darslinker missiyasi —{" "}
              <strong className="text-[#16181a]">
                O&apos;zbekistondagi o&apos;quv markazlariga boshqaruvni soddalashtirish va
                o&apos;quvchini markazda ushlab qolishga yordam berish
              </strong>
              . Rahbar hisob-kitobga emas, ta&apos;lim sifatiga ko&apos;proq vaqt ajratsin,
              o&apos;quvchi esa darsga qiziqib qatnasin.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Yangi o&apos;quvchilar ham shu yerdan keladi</h2>
            <p className={`${P} mb-4`}>
              CRM odatda markazda allaqachon o&apos;qiyotgan o&apos;quvchilarni boshqaradi. Lekin
              markaz uchun yangi o&apos;quvchi topish ham shunchalik muhim. Shuning uchun
              Darslinker&apos;da CRM bilan bir qatorda kurslar marketplace&apos;i ham ishlaydi.
            </p>
            <p className={`${P} mb-4`}>
              <Link href="/marketplace" className={LINK}>Darslinker marketplace</Link>{" "}
              — o&apos;quvchilar Toshkent shahri va viloyatlardagi kurslarni yo&apos;nalish, narx
              va joylashuv bo&apos;yicha solishtiradigan katalog. Markazingiz va kurslaringiz
              shu yerda ko&apos;rinsa, kurs qidirayotgan o&apos;quvchilar sizga to&apos;g&apos;ridan-to&apos;g&apos;ri
              ariza qoldiradi.
            </p>
            <p className={P}>
              Natijada bitta platformada ikkala ish bo&apos;ladi: mavjud o&apos;quvchilarni
              tartibli boshqarasiz va marketplace orqali qo&apos;shimcha lidlar olasiz.
            </p>
          </section>

          <section className="mb-12">
            <h2 className={H2}>Tez-tez beriladigan savollar</h2>
            <FaqList items={faqs} />
          </section>

          <section className="mb-12">
            <h2 className={H2}>Qanday yo&apos;l bosib o&apos;tdik?</h2>
            <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
              <table className="w-full text-[15px] md:text-[16px] mb-4">
                <tbody className="divide-y divide-[#e4e7ea]">
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-[#16181a] whitespace-nowrap align-top">
                      19-sentyabr, 2025
                    </td>
                    <td className="py-3 text-[#16181a]/75">
                      darslinker.uz domeni olindi; shu davrda loyiha ustida ish boshlandi
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-[#16181a] whitespace-nowrap align-top">
                      Mart, 2026
                    </td>
                    <td className="py-3 text-[#16181a]/75">
                      Darslinker platformasi ishga tushdi
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-[#16181a] whitespace-nowrap align-top">
                      19-sentyabr, 2026
                    </td>
                    <td className="py-3 text-[#16181a]/75">
                      Ilk qadamga bir yil: olti oyda 30 dan ortiq o&apos;quv markazi va 3 000 ga yaqin o&apos;quvchi hamda ota-ona
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-[#16181a] whitespace-nowrap align-top">
                      Oktyabr, 2026
                    </td>
                    <td className="py-3 text-[#16181a]/75">
                      Darslinker o&apos;quv markazlari uchun CRM va LMS platformasiga aylandi; kurslar katalogi marketplace sifatida davom etadi
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={P}>
              Loyihaning boshlanishi, jamoamiz va dastlabki natijalar haqida{" "}
              <Link href="/blog/darslinker-qachon-tashkil-topgan" className={LINK}>
                Darslinker tarixi: birinchi qadamdan ilk natijalargacha
              </Link>{" "}
              maqolasida batafsil yozdik.
            </p>
          </section>

          <section className="mb-12">
            <h2 className={H2}>Biz bilan bog&apos;lanish</h2>
            <p className={P}>
              Savolingiz bo&apos;lsa yoki markazingizda Darslinker&apos;ni ishga tushirmoqchi
              bo&apos;lsangiz, Telegram orqali yozing:{" "}
              <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
                @Darslinker_Support
              </a>
              .
            </p>
          </section>

          <section className="border-t border-[#e4e7ea] pt-10">
            <h2 className={H2}>Boshlang</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                CRM va LMS bilan tanishish
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-[#f0f2f3] hover:bg-[#e4e7ea] text-[#16181a] rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Kurslarni ko&apos;rish
              </Link>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
