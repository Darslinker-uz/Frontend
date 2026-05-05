import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "Darslinker haqida — O'zbekistonning kurslar platformasi",
  description:
    "Darslinker — O'zbekistonda kurslar va o'quv markazlarini bir joyda topish, qiyoslash va tanlash uchun ta'lim platformasi. Toshkent va barcha viloyatlar.",
  alternates: { canonical: `${SITE_URL}/haqimizda` },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: `${SITE_URL}/haqimizda`,
    siteName: "Darslinker.uz",
    title: "Darslinker haqida — O'zbekistonning kurslar platformasi",
    description:
      "Darslinker — O'zbekistonda kurslar va o'quv markazlarini bir joyda topish, qiyoslash va tanlash uchun ta'lim platformasi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Darslinker haqida — O'zbekistonning kurslar platformasi",
    description:
      "Darslinker — O'zbekistonda kurslar va o'quv markazlarini bir joyda topish va qiyoslash uchun ta'lim platformasi.",
  },
};

const faqs = [
  {
    q: "Darslinker nima?",
    a: "Darslinker — O'zbekistondagi kurslar va o'quv markazlarini bir joyda topish va qiyoslash uchun ta'lim platformasi.",
  },
  {
    q: "Darslinker bepulmi?",
    a: "O'quvchilar uchun katalog va qidiruv to'liq bepul. O'quv markazlari uchun esa obuna asosida ishlaydi.",
  },
  {
    q: "Qaysi shaharlarda ishlaydi?",
    a: "Darslinker Toshkent shahri va O'zbekistonning barcha viloyatlari bo'yicha ishlaydi.",
  },
  {
    q: "Qanday turdagi kurslar bor?",
    a: "Tillar, IT, akademik tayyorlov, kasbiy va boshqa yo'nalishlar — onlayn va offline formatlarda.",
  },
  {
    q: "O'quv markazi sifatida qanday qo'shilish mumkin?",
    a: "Hamkorlik sahifasi orqali ariza qoldirib, o'z markazingiz va kurslaringizni Darslinker'ga joylashtirishingiz mumkin.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "name": "Darslinker haqida",
      "url": `${SITE_URL}/haqimizda`,
      "inLanguage": "uz",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "Darslinker",
      "url": SITE_URL,
      "logo": `${SITE_URL}/icon-512.png`,
      "foundingDate": "2024",
      "description":
        "O'zbekistondagi kurslar va o'quv markazlarini bir joyda topish va qiyoslash uchun ta'lim platformasi.",
      "areaServed": { "@type": "Country", "name": "O'zbekiston" },
      "sameAs": [
        "https://t.me/darslinker",
        "https://instagram.com/darslinker",
      ],
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

export default function HaqimizdaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-white min-h-screen">
        <article className="max-w-[760px] mx-auto px-5 md:px-6 py-12 md:py-16">
          <header className="mb-12">
            <h1 className="text-[32px] md:text-[44px] font-bold text-[#16181a] leading-tight tracking-tight">
              Darslinker haqida
            </h1>
            <p className="mt-5 text-[16px] md:text-[18px] text-[#16181a]/75 leading-relaxed">
              Darslinker — O&apos;zbekistondagi kurslar va o&apos;quv markazlarini bir joyda
              topishni soddalashtiradigan ta&apos;lim platformasi. Toshkent shahri va
              barcha viloyatlardagi sifatli kurslarni bir joyda qidiring, qiyoslang va
              tanlang.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">
              Nima uchun Darslinker?
            </h2>
            <p className="text-[15.5px] md:text-[16px] text-[#16181a]/75 leading-relaxed mb-4">
              O&apos;zbekistonda ta&apos;lim talabi yildan-yilga o&apos;sib bormoqda, ammo
              o&apos;quvchilar oldida bitta katta savol turadi: qayerdan kurs topish kerak?
            </p>
            <ul className="space-y-2.5 text-[15.5px] md:text-[16px] text-[#16181a]/75 leading-relaxed mb-4 pl-5 list-disc">
              <li>
                O&apos;quv markazlar internetda ko&apos;rinmaydi — ko&apos;pchilik
                web-saytsiz yoki SEO ustida ishlamagan.
              </li>
              <li>
                O&apos;quvchilar tarqoq ma&apos;lumotlar (Telegram kanallar, Instagram,
                og&apos;zaki tavsiyalar) orasidan tanlashga majbur.
              </li>
              <li>
                Narx, format, joylashuv va metodika bo&apos;yicha bir joyda qiyoslash
                imkoniyati yo&apos;q edi.
              </li>
            </ul>
            <p className="text-[15.5px] md:text-[16px] text-[#16181a]/75 leading-relaxed">
              Darslinker shu farqni yopadi — bir joyda, filtrli va shaffof katalog.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">
              Bizning missiyamiz qanday?
            </h2>
            <p className="text-[15.5px] md:text-[16px] text-[#16181a]/75 leading-relaxed">
              Darslinker missiyasi —{" "}
              <strong className="text-[#16181a]">
                o&apos;quv markazlari va o&apos;quvchilarni bir-biriga yaqinlashtirish va
                O&apos;zbekistonda sifatli ta&apos;limni rivojlantirish
              </strong>
              . Biz har ikki tarafga foyda olib keladigan ekotizim quramiz: o&apos;quvchilar
              o&apos;ziga mos kursni topadi, markazlar haqiqiy auditoriyaga yetib boradi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">
              Qanday yo&apos;l bosib o&apos;tdik?
            </h2>
            <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
              <table className="w-full text-[15px] md:text-[16px] mb-4">
                <tbody className="divide-y divide-[#e4e7ea]">
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-[#16181a] whitespace-nowrap align-top">
                      2024
                    </td>
                    <td className="py-3 text-[#16181a]/75">
                      Custdev — bozor va ehtiyojlarni o&apos;rganish
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-[#16181a] whitespace-nowrap align-top">
                      2025
                    </td>
                    <td className="py-3 text-[#16181a]/75">
                      Mahsulotni qurish va dastlabki sinovlar
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-[#16181a] whitespace-nowrap align-top">
                      2026 boshi
                    </td>
                    <td className="py-3 text-[#16181a]/75">
                      Ommaviy launch — platforma keng auditoriyaga taqdim qilindi
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[15.5px] md:text-[16px] text-[#16181a]/75 leading-relaxed">
              Har bosqichda real foydalanuvchilar va o&apos;quv markazlari bilan ishladik —
              taxminlar bilan emas, ehtiyojlar bilan qurdik.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">
              Hozir nima taklif qilamiz?
            </h2>
            <ul className="space-y-3 text-[15.5px] md:text-[16px] text-[#16181a]/75 leading-relaxed">
              <li>
                <strong className="text-[#16181a]">Geografik qamrov</strong> — Toshkent
                shahri va O&apos;zbekistonning barcha viloyatlari bo&apos;yicha o&apos;quv
                markazlari.
              </li>
              <li>
                <strong className="text-[#16181a]">Turli yo&apos;nalishlar</strong> —{" "}
                <Link
                  href="/kurslar/g/tillar"
                  className="text-[#7ea2d4] hover:text-[#5b87c0] underline-offset-2 hover:underline"
                >
                  tillar
                </Link>
                , IT, akademik, kasbiy va boshqa sohalar bo&apos;yicha kurslar.
              </li>
              <li>
                <strong className="text-[#16181a]">Bir joyda qiyoslash</strong> — narx,
                format (onlayn/offline), joylashuv, metodika — bir nechta kursni yonma-yon
                ko&apos;rish.
              </li>
              <li>
                <strong className="text-[#16181a]">O&apos;quvchilar uchun bepul</strong> —
                katalog va qidiruv hech qanday to&apos;lovsiz.
              </li>
              <li>
                <strong className="text-[#16181a]">O&apos;quv markazlar uchun obuna</strong>
                {" "}— markazlar obuna asosida o&apos;z kurslarini joylashtirib, real
                auditoriyaga yetib boradi.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">
              Kelajak rejalar
            </h2>
            <p className="text-[15.5px] md:text-[16px] text-[#16181a]/75 leading-relaxed">
              Yaqin oylarda 500+ kursga, kelgusi yillarda 5000+ kursga yetish —
              Darslinker&apos;ni O&apos;zbekistondagi eng to&apos;liq ta&apos;lim
              katalogiga aylantirish maqsadimiz.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">
              Tez-tez beriladigan savollar
            </h2>
            <FaqList items={faqs} />
          </section>

          <section className="border-t border-[#e4e7ea] pt-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">
              Boshlang
            </h2>
            <Link
              href="/kurslar"
              className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
            >
              Toshkent va viloyatlar bo&apos;yicha kurslarni ko&apos;rish
              <span aria-hidden>→</span>
            </Link>
          </section>
        </article>
      </main>
    </>
  );
}
