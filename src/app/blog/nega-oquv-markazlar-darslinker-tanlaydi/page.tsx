import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/nega-oquv-markazlar-darslinker-tanlaydi`;

export const metadata: Metadata = {
  title: "Nega o'quv markazlar Darslinker'ni tanlaydi? 5 ta sabab (2026) | Darslinker",
  description:
    "Darslinker o'quv markazlarga nima beradi? SEO, marketplace katalog, real-time Telegram lid, CRM kabinet va organik ko'rinish — bir platformada. 5 ta asosiy imkoniyat batafsil.",
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  {
    q: "Hamkor bo'lish qanday yo'lga qo'yiladi?",
    a: "Hamkorlik sahifasidan ariza qoldirasiz, jamoamiz siz bilan bog'lanadi va ulanish jarayonini birga bosqichma-bosqich o'tkazamiz. CRM kabinetni sozlash, profilni to'ldirish, birinchi e'lonni joylashtirish — odatda bir kun ichida tugaydi.",
  },
  {
    q: "Lidlar markazga qanday yetkaziladi?",
    a: "Har bir lid (ariza) avval markazingizning CRM kabinetiga tushadi — bu yerda saqlanadi, kuzatiladi va boshqariladi. Telegram bot ulangan bo'lsa, qo'shimcha real-time xabarnoma ham yuboriladi. Telefon raqamingiz e'lon ostida ko'rinadi — o'quvchi to'g'ridan-to'g'ri qo'ng'iroq qilishi ham mumkin.",
  },
  {
    q: "Markaz qanday yo'l bilan topda chiqadi?",
    a: "Markazingiz organik tarzda ham ko'rinadi — reyting, ko'rishlar (views) va faollik bo'yicha topda chiqadi. Bundan tashqari qo'shimcha visibility imkoniyatlari ham mavjud, ular yangi kurs ochilganda yoki mavsumiy yuklamada foydali bo'ladi.",
  },
  {
    q: "Google'da paydo bo'lish qancha vaqt oladi?",
    a: "Profil to'liq to'ldirilgandan keyin odatda 1-3 hafta ichida Google indeksiga tushadi. Aniq tepa pozitsiyaga chiqish — kontent sifati, kalit so'zlar va konkurentlarga bog'liq. Marketplace SEO darslinker.uz domen avtoritetidan foydalanadi, shuning uchun yangi sayt qurishdan tezroq.",
  },
  {
    q: "Telegram bot qanday ulanadi?",
    a: "CRM kabinetda Telegram nomer bilan ro'yxatdan o'tish kifoya. Ro'yxatdan o'tgach, bot avtomatik ulanadi va har yangi lid real-time xabarnoma sifatida keladi. Bot ulanmagan taqdirda ham lidlar CRM'da saqlanadi — yo'qolmaydi.",
  },
  {
    q: "Birdaniga necha kurs joylashtirish mumkin?",
    a: "Birdaniga 10 tagacha kurs joylashtirish mumkin. Istisno: bitta kursning bir nechta filiali — masalan, bir xil dasturlash kursini 10 ta hududda taklif qilsangiz — yagona kurs sifatida hisoblanadi. Har filial uchun alohida narx va manzil ko'rsatish imkoniyati mavjud.",
  },
];

const capabilities = [
  {
    n: 1,
    icon: "🔍",
    title: "Google'da topda — SEO sizga bog'liq emas",
    short: "Markaz nomi va kurslari Darslinker orqali Google'da topiladi",
    body: "Darslinker.uz domen avtoriteti, schema markup, sitemap va indekslangan minglab sahifalar — hammasi tayyor. Siz faqat profil to'ldirasiz, qolgan SEO ishi platforma tomonidan qilinadi. Sayt qurish, hosting, SEO mutaxassis yollash — hech biriga vaqt va pul sarflamaysiz.",
    bullet: "Google indeksi 1-3 haftada",
  },
  {
    n: 2,
    icon: "📚",
    title: "Kurslar katalogi — to'g'ri o'quvchi sizni topadi",
    short: "O'quvchilar yo'nalish, hudud, narx bo'yicha qidirib topadi",
    body: "Foydalanuvchi 'Toshkentda IELTS kursi' yoki '500 mingdan arzon dasturlash' deb qidiradi — Darslinker filtri uni aniq sizga olib keladi. Bu Instagram banneri emas: bu yerda o'quvchi aktiv kurs qidiryapti. Intent yuqori — konversiya ham yuqori.",
    bullet: "Yo'nalish · hudud · narx · format",
  },
  {
    n: 3,
    icon: "📲",
    title: "Lid + Telegram bot + qo'ng'iroq",
    short: "Ariza Telegram'ga real-time keladi, telefon raqam ham ko'rinadi",
    body: "O'quvchi sahifadan ariza qoldiradi — markazingiz Telegram chat'iga real-time xabar tushadi. Bot ulangan bo'lsa darhol, ulanmasa CRM'da saqlanadi — yo'qolmaydi. Bundan tashqari telefon raqamingiz ko'rinib turadi: o'quvchi to'g'ridan-to'g'ri qo'ng'iroq qilishi ham mumkin.",
    bullet: "Real-time · lid · qo'ng'iroq",
  },
  {
    n: 4,
    icon: "🖥️",
    title: "CRM kabineti — bitta dashboard'da hammasi",
    short: "Lidlar, e'lonlar, balans, statistika, managerlar — bir joyda",
    body: "Excel'da lid yozib yurish, alohida CRM'ga pul to'lash, statistika uchun tashqi sayt — kerak emas. Darslinker kabineti: lidlar tarixi, e'lonlarni tahrirlash, balans, statistika va manager qo'shish — barchasi bitta interfeysda.",
    bullet: "Lid · e'lon · balans · manager",
  },
  {
    n: 5,
    icon: "📈",
    title: "Reyting qancha yuqori — topda ko'rinish va lid shuncha ko'p",
    short: "Yaxshi reyting → topda chiqish → ko'p lid",
    body: "Markazingiz reytingi va o'quvchilar faolligi to'g'ridan-to'g'ri saralab inobatga olinadi. Yaxshi reyting → topda ko'rinish → ko'proq odam profilingizni ko'radi → ko'proq lid keladi. Sifatli xizmat ko'rsatuvchi markazlar tabiiy ravishda yuqoriga chiqadi va ko'p mijoz oladi.",
    bullet: "Reyting · top · ko'p lid",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Nega o'quv markazlar Darslinker'ni tanlaydi? 5 ta sabab (2026)",
      datePublished: "2026-05-10",
      dateModified: "2026-05-10",
      author: { "@type": "Organization", name: "Darslinker.uz" },
      publisher: { "@type": "Organization", name: "Darslinker.uz", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
      mainEntityOfPage: url,
    },
    {
      "@type": "ItemList",
      itemListElement: capabilities.map((c) => ({ "@type": "ListItem", position: c.n, name: c.title })),
    },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="bg-white min-h-screen">
        <article className="max-w-[860px] mx-auto px-5 md:px-6 py-10 md:py-14">
          {/* Breadcrumb */}
          <nav className="text-[13px] text-[#7c8490] mb-5">
            <Link href="/" className="hover:text-[#16181a]">Asosiy</Link>
            <span className="mx-2">›</span>
            <Link href="/blog" className="hover:text-[#16181a]">Blog</Link>
            <span className="mx-2">›</span>
            <span className="text-[#16181a]">Nega Darslinker?</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">Yangilangan: 2026-05 • O&apos;quv markaz egalari uchun</div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              Nega o&apos;quv markazlar Darslinker&apos;ni tanlaydi? 5 ta sabab (2026)
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              Darslinker — o&apos;quv markaz uchun <strong>SEO + marketplace + lid tizimi + CRM</strong> bir platformada.
              Sayt qurish, SEO mutaxassis yollash, lid kuzatish — hech biriga vaqt sarflamaysiz.
              Markazingiz Google&apos;da va Darslinker&apos;da bir vaqtda ko&apos;rinishni boshlaydi.
            </p>
          </section>

          {/* Why this matters — pain hook */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Sayt va SEO o&apos;rniga — nima qilamiz?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Har bir o&apos;quv markaz duch keladigan dilemma: <strong>o&apos;z saytim bo&apos;lsin</strong>, lekin SEO uchun 6-9 oy va minglab dollar ketadi.
              Reklama bilan esa CPL yuqori, ijtimoiy tarmoqlardan potensial va organik lid deyarli yo&apos;q. Shu yerda Darslinker beradigan yechim:
              sizning kurslaringiz tayyor SEO infratuzilmasi ustida turadi, lidlar to&apos;g&apos;ridan-to&apos;g&apos;ri keladi.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Quyida Darslinker o&apos;quv markazlarga nima imkoniyatlar berishi haqida bilib olasiz.
            </p>
          </section>

          {/* 5 capabilities */}
          <section className="mb-10">
            <h2 className="text-[24px] md:text-[28px] font-bold text-[#16181a] mb-5">5 ta asosiy imkoniyat</h2>
            <div className="space-y-6">
              {capabilities.map((c) => (
                <div key={c.n} className="border border-[#e4e7ea] rounded-[14px] p-5 md:p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#16181a] text-white text-[16px] md:text-[20px] font-bold flex items-center justify-center">
                      {c.n}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[20px] md:text-[24px] font-bold text-[#16181a] flex items-center gap-2">
                        <span aria-hidden>{c.icon}</span>
                        <span>{c.title}</span>
                      </h3>
                      <div className="mt-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wide bg-[#f1f5fb] text-[#3a6ea5] rounded-full px-2.5 py-1">
                          {c.bullet}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[14.5px] text-[#16181a]/75 leading-relaxed mb-4">{c.body}</p>

                  {/* Inline mini-mockup per capability */}
                  {c.n === 1 && (
                    <div className="bg-[#f8f9fa] rounded-[10px] p-4 mt-3">
                      <div className="text-[11px] text-[#7c8490] mb-2">Google qidiruv</div>
                      <div className="bg-white border border-[#e4e7ea] rounded-[8px] p-3">
                        <div className="text-[12px] text-[#7c8490]">darslinker.uz › kurslar › ingliz-tili</div>
                        <div className="text-[14px] text-[#1a0dab] font-medium mt-1">Toshkentda ingliz tili kursi — Darslinker</div>
                        <div className="text-[12px] text-[#16181a]/70 mt-1">Toshkent, Yunusobod, Speak Up Academy. 500 000 so&apos;m/oy. IELTS, suhbat klubi...</div>
                      </div>
                    </div>
                  )}
                  {c.n === 2 && (
                    <div className="bg-[#f8f9fa] rounded-[10px] p-4 mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {["Ingliz tili", "Toshkent", "500k dan past", "Onlayn"].map((f) => (
                          <span key={f} className="text-[11px] bg-white border border-[#e4e7ea] rounded-full px-2.5 py-1 text-[#16181a]/80">
                            {f}
                          </span>
                        ))}
                      </div>
                      <div className="text-[12px] text-[#7c8490] mt-3">→ 24 ta mos kurs topildi</div>
                    </div>
                  )}
                  {c.n === 3 && (
                    <div className="bg-[#f8f9fa] rounded-[10px] p-4 mt-3">
                      <div className="bg-[#229ED9] text-white rounded-[10px] p-3 max-w-[420px]">
                        <div className="text-[11px] opacity-80 mb-1">Darslinker bot · hozir</div>
                        <div className="text-[13px] leading-relaxed">
                          🔔 <strong>Yangi ariza</strong>
                          <br />Aziza Karimova — +998 90 123 45 67
                          <br />Kurs: IELTS Foundation
                        </div>
                      </div>
                    </div>
                  )}
                  {c.n === 4 && (
                    <div className="bg-[#f8f9fa] rounded-[10px] p-4 mt-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { l: "Lidlar", v: "47" },
                          { l: "E'lonlar", v: "12" },
                          { l: "Balans", v: "1.2M" },
                          { l: "Managerlar", v: "3" },
                        ].map((t) => (
                          <div key={t.l} className="bg-white border border-[#e4e7ea] rounded-[8px] p-2.5 text-center">
                            <div className="text-[16px] font-bold text-[#16181a]">{t.v}</div>
                            <div className="text-[11px] text-[#7c8490]">{t.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {c.n === 5 && (
                    <div className="bg-[#f8f9fa] rounded-[10px] p-4 mt-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white border border-[#e4e7ea] rounded-[8px] p-2.5">
                          <div className="text-[13px] text-[#16181a]">🥇 Markaz A — ⭐ 4.9</div>
                          <span className="text-[10px] bg-[#dcfce7] text-[#166534] rounded-full px-2 py-0.5 font-semibold">47 LID</span>
                        </div>
                        <div className="flex items-center justify-between bg-white border border-[#e4e7ea] rounded-[8px] p-2.5">
                          <div className="text-[13px] text-[#16181a]">🥈 Markaz B — ⭐ 4.7</div>
                          <span className="text-[10px] bg-[#dcfce7] text-[#166534] rounded-full px-2 py-0.5 font-semibold">32 LID</span>
                        </div>
                        <div className="flex items-center justify-between bg-white border border-[#e4e7ea] rounded-[8px] p-2.5">
                          <div className="text-[13px] text-[#16181a]">🥉 Markaz C — ⭐ 4.5</div>
                          <span className="text-[10px] bg-[#dcfce7] text-[#166534] rounded-full px-2 py-0.5 font-semibold">21 LID</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Comparison table */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">O&apos;z saytim vs Darslinker bilan</h2>
            <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
              <table className="w-full text-[13.5px] md:text-[14.5px] border-collapse">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b-2 border-[#16181a]">
                    <th className="text-left p-2.5 font-semibold text-[#16181a]">Mezon</th>
                    <th className="text-left p-2.5 font-semibold text-[#16181a]">O&apos;z saytim</th>
                    <th className="text-left p-2.5 font-semibold text-[#16181a]">Darslinker bilan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e7ea]">
                  <tr><td className="p-2.5 font-semibold text-[#16181a]">Sozlash vaqti</td><td className="p-2.5">1-3 oy</td><td className="p-2.5 text-green-700">1 kun</td></tr>
                  <tr><td className="p-2.5 font-semibold text-[#16181a]">Sayt + hosting</td><td className="p-2.5">3-5M so&apos;m</td><td className="p-2.5 text-green-700">Tayyor infratuzilma</td></tr>
                  <tr><td className="p-2.5 font-semibold text-[#16181a]">Google SEO natija</td><td className="p-2.5">3-6 oy</td><td className="p-2.5 text-green-700">1-3 hafta</td></tr>
                  <tr><td className="p-2.5 font-semibold text-[#16181a]">CRM</td><td className="p-2.5">Alohida xizmat</td><td className="p-2.5 text-green-700">Ichida bor</td></tr>
                  <tr><td className="p-2.5 font-semibold text-[#16181a]">Mijoz oqimi</td><td className="p-2.5">Reklamaga bog&apos;liq</td><td className="p-2.5 text-green-700">Doimiy</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Tez-tez beriladigan savollar</h2>
            <FaqList items={faqs} />
          </section>

          {/* Final CTA */}
          <section className="border-t border-[#e4e7ea] pt-10">
            <div className="bg-[#16181a] text-white rounded-[16px] p-6 md:p-8">
              <h2 className="text-[22px] md:text-[28px] font-bold mb-3">
                Hamkor bo&apos;ling — markazingiz Google&apos;da ko&apos;rinishni boshlasin
              </h2>
              <p className="text-[15px] text-white/75 leading-relaxed mb-5 max-w-[640px]">
                Ariza qoldiring — jamoamiz siz bilan bog&apos;lanadi va ulanish jarayonini birga o&apos;tkazamiz.
                Markazingiz Google&apos;da va Darslinker&apos;da bir vaqtda ko&apos;rinadi, lidlar Telegram orqali real-time keladi.
              </p>
              <Link
                href="/hamkorlik"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#7ea2d4] text-[#16181a] hover:text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
              >
                Hamkor bo&apos;lish — ariza qoldirish →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
