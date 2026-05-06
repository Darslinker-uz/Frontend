import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/oquv-markaz-yangi-oquvchi-topish`;

export const metadata: Metadata = {
  title: "Yangi o'quvchi topish: o'quv markaz uchun 5 strategiya | Darslinker",
  description:
    "O'quv markaz uchun yangi o'quvchi topishning 5 ta amaliy strategiyasi 2026: SEO, marketplace, Telegram/Instagram, referrals va hamkorlik. Lid narxi va samaradorlik solishtirish.",
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  { q: "O'quv markaz uchun bitta lid (yangi o'quvchi) qancha turadi?", a: "O'zbekistonda 2026 da: Instagram reklama orqali 30,000-80,000 so'm, Telegram orqali 15,000-40,000 so'm, marketplace platformalari orqali 5,000-25,000 so'm, organik SEO orqali deyarli bepul (lekin uzoq investitsiya)." },
  { q: "Faqat Telegram va Instagram'da bo'lish yetarlimi?", a: "Yetarli emas. Ikkala kanal ham mavjud auditoriyaga reklama qiladi. Yangi o'quvchilar 'kurs qidiraman' deb qidirganda — Google va platformalar orqali topishadi, ijtimoiy tarmoqlardan emas." },
  { q: "Sayt qurish kerakmi?", a: "Ha, lekin oddiy bir sahifali sayt yetarli. Yoki marketplace'da to'liq profil — bu ham yangi o'quvchilar uchun 'sayt' vazifasini bajaradi va arzonroq." },
  { q: "SEO o'rganish qancha vaqt oladi?", a: "Asosiy bilim — 1-2 oy. Lekin natija ko'rinishi 3-6 oy kerak. Sabr qiluvchilar uchun eng arzon va barqaror kanal." },
  { q: "Reklamaga qancha pul ajratish kerak?", a: "Boshlovchi markaz uchun: oyiga 1,500,000-3,000,000 so'm. Asosiy ko'rsatkich — har lid narxi (CPL): 30,000 so'mdan past — yaxshi, undan yuqori — kanalni qayta baholash kerak." },
  { q: "Talabalar tavsiyasi (referral) qanday ishga tushadi?", a: "2 yo'l: 1) bonus bering (sertifikat, chegirma) tavsiya qiluvchiga; 2) yopiq Telegram chatida o'quvchilarni faollashtiring — ular o'zlari tavsiyalashadi." },
  { q: "Marketplace platforma bilan ishlash arzonmi?", a: "Ha. CPL odatda Instagramdan 3-5 baravar past, chunki marketplace'ga 'kurs qidirayotgan' yuqori intent foydalanuvchilar keladi. Lekin har platformaning komissiya yoki obuna haqi bor." },
];

const strategies = [
  {
    rank: 1,
    title: "Sayt + SEO (organik)",
    cpl: "5,000-15,000 so'm",
    setupTime: "3-6 oy",
    pros: ["Eng arzon CPL uzoq muddat", "Brand authority quradi", "Reklama to'xtagach ham ishlaydi"],
    cons: ["Birinchi natija 3-6 oy kutiladi", "SEO bilim yoki mutaxassis kerak"],
    bestFor: "Uzoq muddat investitsiyaga tayyor markazlar",
    detail: "O'quv markazning o'z sayti — yoki yo'q bo'lsa, marketplace profili. Google'da 'Toshkentda ingliz tili kursi' deb qidirgan odam sizga keladi. SEO o'rganish — alohida ko'nikma, lekin yagona barqaror manba.",
  },
  {
    rank: 2,
    title: "Marketplace platformalari (Darslinker kabi)",
    cpl: "5,000-25,000 so'm",
    setupTime: "1-7 kun",
    pros: ["Arzon CPL — yuqori intent foydalanuvchilar keladi", "Tez sozlash (1 hafta)", "SEO o'zi qilingan — siz faqat profilni to'ldirasiz"],
    cons: ["Komissiya yoki oylik obuna bor", "Profilni doimiy yangilab turish kerak"],
    bestFor: "Tez natija va past CPL kerak bo'lgan markazlar",
    detail: "Kataloglashtirilgan platforma'larda profil yarating. Foydalanuvchi 'kurs qidiraman' deb keladi — sizning markaz filtrlardan o'tib chiqsa — to'g'ridan-to'g'ri murojaat qiladi. Bu yondashuv 2024-yildan boshlab O'zbekistonda kuchayib bormoqda.",
  },
  {
    rank: 3,
    title: "Instagram va Telegram reklama",
    cpl: "30,000-80,000 so'm",
    setupTime: "1-3 kun",
    pros: ["Tez ishga tushadi", "Auditoriya parametrlarini boshqarish mumkin", "Vizual kontent uchun yaxshi"],
    cons: ["CPL eng yuqori", "Reklama to'xtagach — lid yo'q", "Auditoriya tom ma'noda kurs qidirmaydi — banner ko'radi"],
    bestFor: "Tez natija va auditoriya bilan munosabat qurmoqchi markazlar",
    detail: "Eng mashhur kanal — lekin eng qimmati ham. Targetlangan reklama (yosh, hudud, qiziqish) bilan ishlaydi. Story va Reels — eng yaxshi format. Lekin reklama to'xtagach lid oqimi ham to'xtaydi.",
  },
  {
    rank: 4,
    title: "Talabalar referrali (word of mouth)",
    cpl: "0-10,000 so'm (bonus)",
    setupTime: "Doimiy",
    pros: ["Eng arzon va yuqori sifatli lidlar", "Yangi o'quvchi avval ishonadi", "Bonus tizimi orqali rag'batlantirish oson"],
    cons: ["Asta-sekin o'sadi", "Sifat har doim ham yuqori bo'lmaydi (qarindoshlar)", "Asosiy o'quvchilar mamnun bo'lmasa — ishlamaydi"],
    bestFor: "Sifatli xizmat ko'rsatuvchi va o'quvchilar mamnun bo'lgan markazlar",
    detail: "Mavjud o'quvchilarni do'stlarini olib kelishga rag'batlantirish: 100,000 so'm chegirma yoki bepul oy. Yopiq Telegram chati ham yaxshi ishlaydi — o'quvchilar bir-biriga tavsiya qiladi. Sharti — sizning xizmatingiz haqiqatdan ham yaxshi bo'lishi.",
  },
  {
    rank: 5,
    title: "Hamkorlik (cross-promotion)",
    cpl: "0-20,000 so'm",
    setupTime: "1-4 hafta",
    pros: ["Yangi auditoriya, lekin shu bozorda", "Bir tomonlama xarajat emas (almashinuv)", "Brand authority oshadi"],
    cons: ["Mos hamkor topish vaqt oladi", "Manfaatlar tushunmovchiligi bo'lishi mumkin"],
    bestFor: "Niche markazlar (masalan IELTS markazi + til universiteti)",
    detail: "Boshqa, lekin sizga to'g'ri kelmaydigan biznes bilan auditoriya almashinuv: maktab → universitet tayyorlovi, sport zal → fitnes mutaxassisi. Telegram chati va Instagram'da bir-birini reklama qiladi. Yoki o'quv markazlar bir-biri bilan: ingliz tili → IELTS → universitet.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Yangi o'quvchi topish: o'quv markaz uchun 5 strategiya 2026",
      datePublished: "2026-05-04",
      dateModified: "2026-05-04",
      author: { "@type": "Organization", name: "Darslinker.uz" },
      publisher: { "@type": "Organization", name: "Darslinker.uz", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
      mainEntityOfPage: url,
    },
    {
      "@type": "ItemList",
      itemListElement: strategies.map((s) => ({ "@type": "ListItem", position: s.rank, name: s.title })),
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
          <nav className="text-[13px] text-[#7c8490] mb-5">
            <Link href="/" className="hover:text-[#16181a]">Asosiy</Link>
            <span className="mx-2">›</span>
            <Link href="/blog" className="hover:text-[#16181a]">Blog</Link>
            <span className="mx-2">›</span>
            <span className="text-[#16181a]">O&apos;quv markaz uchun lid topish</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">Yangilangan: 2026-05 • O&apos;quv markaz egalari uchun</div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              Yangi o&apos;quvchi topish: o&apos;quv markaz uchun 5 strategiya 2026
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              Eng arzon va barqaror kanallar: <strong>SEO + marketplace platformalari</strong> (CPL 5,000-25,000 so&apos;m). Tezkor natija uchun: <strong>Instagram/Telegram reklama</strong> (30,000-80,000 so&apos;m). Eng sifatli — <strong>talabalar tavsiyasi</strong>. Bitta kanal yetmaydi — kamida 2-3 tasini parallel ishlatish kerak.
            </p>
          </section>

          {/* Why this matters */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Nega yangi o&apos;quvchi topish qiyin?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              2024-2026 yillarda O&apos;zbekistonda ta&apos;lim bozori 2-3 baravar o&apos;sdi — mingdan ortiq yangi o&apos;quv markaz va onlayn kurs platformalari paydo bo&apos;ldi. Foydalanuvchi tanlovi kengaydi, lekin har bir markazning <strong>e&apos;tibor olishi qiyinlashdi</strong>.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Aksariyat markazlar faqat Instagram va Telegram&apos;ga tayanadi. Bu kanallar ishlayapti, lekin ikkita asosiy muammosi bor:
            </p>
            <ul className="space-y-2 text-[15px] text-[#16181a]/80 mb-3 pl-5 list-disc">
              <li><strong>CPL yuqori</strong> — bitta lid 30,000-80,000 so&apos;mga tushadi, kichik markazlar uchun bardosh bo&apos;la olmaydi</li>
              <li><strong>Auditoriya passiv</strong> — Instagram&apos;dagi odam &quot;kurs qidirmagan&quot;, banner ko&apos;rgan; uning intentsi past</li>
            </ul>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Yangi o&apos;quvchi <strong>aktiv qidirayotgan</strong> joydan kelishi kerak: Google qidiruv, marketplace platformalari, mavjud o&apos;quvchilar tavsiyasi. Quyida 5 ta strategiya — har biri o&apos;ziga xos CPL va vaqt bilan.
            </p>
          </section>

          {/* Strategies */}
          <section className="mb-10">
            <h2 className="text-[24px] md:text-[28px] font-bold text-[#16181a] mb-5">5 ta strategiya</h2>
            <div className="space-y-6">
              {strategies.map((s) => (
                <div key={s.rank} className="border border-[#e4e7ea] rounded-[14px] p-5 md:p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#16181a] text-white text-[16px] md:text-[20px] font-bold flex items-center justify-center">
                      {s.rank}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[20px] md:text-[24px] font-bold text-[#16181a]">{s.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wide bg-blue-100 text-blue-800 rounded-full px-2.5 py-1">
                          CPL: {s.cpl}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wide bg-purple-100 text-purple-800 rounded-full px-2.5 py-1">
                          ⏱ {s.setupTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[14.5px] text-[#16181a]/75 leading-relaxed mb-4">{s.detail}</p>

                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 rounded-[10px] p-4">
                      <h4 className="text-[12px] font-semibold text-green-800 uppercase tracking-wider mb-2">Pluslar</h4>
                      <ul className="space-y-1.5">
                        {s.pros.map((p, i) => (
                          <li key={i} className="text-[14px] text-[#16181a]/80 flex items-start gap-2">
                            <span className="text-green-700 mt-0.5">+</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-[10px] p-4">
                      <h4 className="text-[12px] font-semibold text-red-800 uppercase tracking-wider mb-2">Minuslar</h4>
                      <ul className="space-y-1.5">
                        {s.cons.map((c, i) => (
                          <li key={i} className="text-[14px] text-[#16181a]/80 flex items-start gap-2">
                            <span className="text-red-700 mt-0.5">−</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e4e7ea]">
                    <span className="text-[13.5px] text-[#16181a]/70">
                      <strong>Kim uchun mos:</strong> {s.bestFor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison summary */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Strategiyalarni qiyoslash</h2>
            <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
              <table className="w-full text-[13.5px] md:text-[14.5px] border-collapse">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b-2 border-[#16181a]">
                    <th className="text-left p-2.5 font-semibold text-[#16181a]">Strategiya</th>
                    <th className="text-left p-2.5 font-semibold text-[#16181a]">CPL</th>
                    <th className="text-left p-2.5 font-semibold text-[#16181a]">Vaqt</th>
                    <th className="text-left p-2.5 font-semibold text-[#16181a]">Bardosh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e7ea]">
                  <tr><td className="p-2.5 font-semibold text-[#16181a]">SEO</td><td className="p-2.5">5-15k</td><td className="p-2.5">3-6 oy</td><td className="p-2.5">Yuqori (uzoq)</td></tr>
                  <tr><td className="p-2.5 font-semibold text-[#16181a]">Marketplace</td><td className="p-2.5">5-25k</td><td className="p-2.5">1 hafta</td><td className="p-2.5">Yuqori</td></tr>
                  <tr><td className="p-2.5 font-semibold text-[#16181a]">IG/Telegram reklama</td><td className="p-2.5">30-80k</td><td className="p-2.5">1-3 kun</td><td className="p-2.5">Past</td></tr>
                  <tr><td className="p-2.5 font-semibold text-[#16181a]">Referral</td><td className="p-2.5">0-10k</td><td className="p-2.5">Doimiy</td><td className="p-2.5">Yuqori</td></tr>
                  <tr><td className="p-2.5 font-semibold text-[#16181a]">Hamkorlik</td><td className="p-2.5">0-20k</td><td className="p-2.5">1-4 hafta</td><td className="p-2.5">O&apos;rtacha</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Recommended order */}
          <section className="mb-10 bg-[#f8f9fa] rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Birinchi navbatda nima qilish kerak?</h2>
            <p className="text-[15px] text-[#16181a]/80 leading-relaxed mb-3">
              Boshlovchi yoki kichik markazlar uchun yo&apos;l xaritasi:
            </p>
            <ol className="space-y-2 text-[15px] text-[#16181a]/80 pl-5 list-decimal">
              <li><strong>Marketplace profili</strong> — 1 hafta, arzon CPL, tezkor natija (1-chi oy)</li>
              <li><strong>Instagram/Telegram reklama</strong> — birinchi auditoriyani jalb qilish (1-3 oy)</li>
              <li><strong>Referral tizimi</strong> — birinchi o&apos;quvchilar mamnun bo&apos;lganda (3+ oy)</li>
              <li><strong>SEO va sayt</strong> — uzoq muddatga investitsiya (6+ oy)</li>
              <li><strong>Hamkorlik</strong> — markaz brendi qurilgach (12+ oy)</li>
            </ol>
          </section>

          {/* External links */}
          <section className="mb-10">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Foydali manbalar</h2>
            <ul className="space-y-2 text-[14.5px] text-[#16181a]/80">
              <li>▸ <a href="https://business.facebook.com" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Meta Business Suite</a> — Instagram va Facebook reklamasini boshqarish</li>
              <li>▸ <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Google Search Console</a> — saytingiz Google&apos;da qanday ko&apos;rinishini tekshirish (SEO uchun)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Tez-tez beriladigan savollar</h2>
            <FaqList items={faqs} />
          </section>

          {/* Final CTA — to /hamkorlik */}
          <section className="border-t border-[#e4e7ea] pt-10">
            <div className="bg-[#16181a] text-white rounded-[16px] p-6 md:p-8">
              <h2 className="text-[22px] md:text-[28px] font-bold mb-3">
                O&apos;quv markazingizni Darslinker katalogiga qo&apos;shing
              </h2>
              <p className="text-[15px] text-white/75 leading-relaxed mb-5 max-w-[640px]">
                Darslinker — O&apos;zbekistondagi mahalliy o&apos;quv markazlarni kataloglashtirilgan platforma.
                Marketplace strategiyasi (#2 strategiya) orqali siz aktiv qidirayotgan o&apos;quvchilarga to&apos;g&apos;ridan-to&apos;g&apos;ri yetib borasiz —
                Instagramga qaraganda 3-5 baravar past CPL bilan.
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
