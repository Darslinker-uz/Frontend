import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";
import { CrmApplyButton } from "@/components/crm/crm-apply";

// Platforma formati (docs/crm-blog-plan.md, G1–G10). CRM va ERP ta'rifi IBM'dan, raqobatchilar narxi va imkoniyatlari
// ularning rasmiy saytlaridan 2026-11-06 holatida. Darslinker haqida faqat PRODUCT.md "Hozir bor"; Darslinker ERP emas.

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const SLUG = "yangi-oquv-markazi-uchun-crm-yoki-erp";
const url = `${SITE_URL}/blog/${SLUG}`;
const TITLE = "Yangi o'quv markazi uchun CRM yoki ERP: nimadan boshlash kerak? (2026)";
const DESCRIPTION =
  "Yangi ochilgan o'quv markaziga ERP emas, CRM kerak. Birinchi 90 kunda qaysi imkoniyat kerakligi, birinchi yil xarajati va tanlashdagi xatolar.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Darslinker` },
  description: DESCRIPTION,
  keywords: [
    "yangi o'quv markazi uchun CRM",
    "o'quv markazi uchun ERP",
    "o'quv markazi ochish uchun dastur",
    "CRM va ERP farqi",
    "o'quv markazini boshqarish dasturi",
  ],
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz", title: TITLE, description: DESCRIPTION },
};

const faqs = [
  {
    q: "Yangi o'quv markaziga CRM kerakmi yoki ERP?",
    a: "Boshlanishida CRM yetadi. CRM o'quvchilar, guruhlar, davomat, to'lov va ota-onalar bilan aloqani yuritadi. ERP esa ish haqi, kadrlar va kirish nazorati kabi ichki jarayonlar uchun kerak bo'ladi va odatda xodimlar hamda filiallar ko'paygandan keyin dolzarb bo'ladi.",
  },
  {
    q: "CRM va ERP farqi nima?",
    a: "CRM mijozlar bilan ishlaydi, o'quv markazida bu o'quvchilar, ota-onalar va arizalar. ERP esa ichki ishlarni boshqaradi, masalan moliya hisobi, xodimlar va ish haqi. IBM ta'rifiga ko'ra ERP orqa ofis jarayonlari uchun, CRM esa sotuv, marketing va mijozlarga xizmat uchun.",
  },
  {
    q: "Necha o'quvchidan keyin CRM kerak bo'ladi?",
    a: "Aniq bir son yo'q. Bitta guruh va bitta o'qituvchi bo'lsa, Excel ham yetishi mumkin. Qarzni qidirish, davomatni sanash va ota-onalarga qo'ng'iroq qilish har kuni vaqt ola boshlasa, CRM'ga o'tish payti kelgan.",
  },
  {
    q: "Yangi markaz uchun CRM oyiga qancha turadi?",
    a: "2026-yil noyabr holatida rasmiy saytlarga ko'ra 100 tagacha o'quvchili markaz uchun Darslinker oyiga 190 000 so'm, Edulog Start tarifi oyiga 200 000 so'm, Modme Start tarifi esa 3 oyga 1 500 000 so'm turadi.",
  },
  {
    q: "Darslinker ERP'mi?",
    a: "Yo'q. Darslinker o'quv markazlari uchun CRM va LMS. Unda o'quvchilar, davomat, to'lov va qarzdorlik, lidlar, dashboard, jonli quiz va ota-onaga Telegram xabar bor. Ish haqi hisobi va turniket kabi ERP qismlari yo'q.",
  },
  {
    q: "Ochilishdan oldin CRM o'rnatish kerakmi?",
    a: "Ha, imkon bo'lsa birinchi guruh ochilishidan oldin. Shunda birinchi o'quvchidan boshlab hamma ma'lumot bitta tizimda yig'iladi va keyinroq daftardan ko'chirishga vaqt ketmaydi.",
  },
];

const PLAN_90 = [
  { when: "1-oy", what: "O'quvchilar ro'yxati, guruh va dars jadvali, davomat, to'lov va qarzdorlik", why: "Pul va davomat birinchi kundan yo'qolmasligi kerak" },
  { when: "2-oy", what: "Ota-onaga avtomatik xabar, lidlar doskasi", why: "Birinchi qarzlar va sinov darsiga yozilganlar paydo bo'ladi" },
  { when: "3-oy", what: "Dashboard, xodimlar uchun rollar, darsda jonli quiz", why: "Ikkinchi xodim keladi, o'quvchini ushlab qolish muhim bo'ladi" },
  { when: "Keyinroq", what: "Filiallar, ish haqi hisobi, onlayn to'lov, turniket", why: "Markaz kengayganda kerak bo'ladigan ERP qismlari" },
];

const COSTS = [
  ["Darslinker", "1 824 000 so'm", "Minimal tarif 190 000 so'm × 12 oy, 12 oyga to'lovda 20% chegirma"],
  ["Edulog", "1 920 000 so'm", "Start tarifining yillik narxi"],
  ["Modme", "5 400 000 so'm", "Start tarifining 12 oylik narxi"],
  ["SchoolUp", "7 200 000 so'mdan", "Bir martalik litsenziya"],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      datePublished: "2026-11-07",
      dateModified: "2026-11-07",
      inLanguage: "uz-UZ",
      author: { "@type": "Organization", name: "Darslinker.uz" },
      publisher: { "@type": "Organization", name: "Darslinker.uz", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
      mainEntityOfPage: url,
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
        { "@type": "ListItem", position: 3, name: "Yangi markaz uchun CRM", item: url },
      ],
    },
  ],
};

const H2 = "text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3";
const P = "text-[15.5px] text-[#16181a]/75 leading-relaxed";
const LINK = "text-[#2d5a8a] font-semibold hover:underline";
const TH = "px-4 py-3 font-semibold text-[#16181a]";
const TD = "px-4 py-3 text-[#16181a]/75";

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
            <span className="text-[#16181a]">Yangi markaz uchun CRM</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">
              Nashr etilgan: <time dateTime="2026-11-07">7-noyabr, 2026</time>{" "}· Yangilangan: 2026-11 · O&apos;quv markazlar uchun
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">{TITLE}</h1>
          </header>

          <section className="mb-10 rounded-[14px] bg-[#f4f6f8] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqa javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              Yangi o&apos;quv markaziga birinchi kundan ERP shart emas. O&apos;quvchilar ro&apos;yxati, guruh va jadval, davomat,
              to&apos;lov va qarzdorlik hamda ota-onaga xabarni yuritadigan CRM yetadi. Ish haqi, kadrlar va kirish nazorati kabi
              ERP qismlari xodimlar va filiallar ko&apos;payganda kerak bo&apos;ladi. Masalan, <strong>Darslinker</strong>&apos;da
              100 tagacha o&apos;quvchili markaz uchun tarif oyiga 190 000 so&apos;m va 14 kun bepul sinov bor.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Yangi markaz nega CRM va ERP orasida adashadi?</h2>
            <p className={`${P} mb-3`}>
              Markaz ochgan odam &ldquo;o&apos;quv markazi uchun dastur&rdquo; deb qidirsa, natijada CRM ham, ERP ham chiqadi.
              Ba&apos;zi tizimlar o&apos;zini ikkalasi deb ataydi. Masalan, EduTizim o&apos;zini o&apos;quv markazlari uchun CRM va
              ERP tizimi deb taqdim etadi va unda ish haqi, xodimlar KPI&apos;si, turniket orqali kirish nazorati ham bor.
            </p>
            <p className={P}>
              Bu imkoniyatlar katta markazga foydali. Lekin bitta xona va ikki guruh bilan ochilgan markaz ularning ko&apos;pidan
              birinchi yilda foydalanmaydi, ortiqcha sozlamalar esa tizimni o&apos;rganishni qiyinlashtiradi. Shuning uchun avval
              farqni tushunib olish kerak.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>CRM va ERP farqi nima?</h2>
            <p className={`${P} mb-4`}>
              IBM ta&apos;rifiga ko&apos;ra ERP kompaniyaning orqa ofisini boshqaradi, ya&apos;ni moliya, xodimlar va operatsiyalarni.
              CRM esa mijozlar bilan ishlashga, sotuv, marketing va xizmat ko&apos;rsatishga qaratilgan. O&apos;quv markazida bu
              farq shunday ko&apos;rinadi.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full min-w-[560px] text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className={TH}>Vazifa</th>
                    <th className={TH}>CRM</th>
                    <th className={TH}>ERP</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Kim bilan ishlaydi", "O'quvchilar, ota-onalar, arizalar", "Xodimlar, moliya, ichki jarayonlar"],
                    ["Kundalik ish", "Davomat, to'lov, qarzdorlik, ota-onaga xabar", "Ish haqi, KPI, xarajatlar, kirish nazorati"],
                    ["Qachon kerak", "Birinchi o'quvchidan boshlab", "Xodim va filial ko'payganda"],
                    ["Yangi markazga", "Darhol kerak", "Odatda keyinroq"],
                  ].map(([a, b, c]) => (
                    <tr key={a} className="border-t border-[#e4e7ea] align-top">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{a}</td>
                      <td className={TD}>{b}</td>
                      <td className={TD}>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Excel qachongacha yetadi va CRM qachon kerak bo&apos;ladi?</h2>
            <p className={`${P} mb-3`}>
              Bitta guruh va bitta o&apos;qituvchi bilan boshlagan markazga Excel yoki daftar ham yetishi mumkin. Bu bosqichda
              tizimga pul sarflash shart emas. Quyidagi belgilardan ikkitasi paydo bo&apos;lsa, CRM&apos;ga o&apos;tish payti kelgan.
            </p>
            <ul className="space-y-2 ml-1 mb-3">
              {[
                "Kim qarzdorligini bilish uchun har safar jadvalni boshidan qarab chiqasiz",
                "Davomatni oy oxirida qo'lda sanaysiz",
                "Darsga kelmagan o'quvchining ota-onasiga har kuni qo'ng'iroq qilasiz",
                "Telegram va Instagram'dan kelgan arizalar chatlarda yo'qolib qoladi",
                "Ikkinchi administrator keldi va bitta faylni ikki kishi o'zgartiryapti",
              ].map((c) => (
                <li key={c} className="text-[15px] text-[#16181a]/80 flex items-start gap-2">
                  <span className="text-[#5b87c0] mt-1">▸</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <p className={P}>
              Ochilishdan oldin tizim tanlab qo&apos;yish undan ham yaxshi. Birinchi o&apos;quvchidan boshlab ma&apos;lumot bitta
              joyda yig&apos;iladi va bir necha oydan keyin daftardan ko&apos;chirishga vaqt ketmaydi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Birinchi 90 kunda qaysi imkoniyat kerak?</h2>
            <p className={`${P} mb-4`}>
              Yangi markaz hamma imkoniyatni birdaniga ishga tushirishi shart emas. Biz uni ehtiyoj paydo bo&apos;lish tartibida
              bosqichlarga bo&apos;ldik.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full min-w-[600px] text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className={TH}>Bosqich</th>
                    <th className={TH}>Nima yoqiladi</th>
                    <th className={TH}>Nega aynan shu payt</th>
                  </tr>
                </thead>
                <tbody>
                  {PLAN_90.map((r) => (
                    <tr key={r.when} className="border-t border-[#e4e7ea] align-top">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{r.when}</td>
                      <td className={TD}>{r.what}</td>
                      <td className={TD}>{r.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`${P} mt-3`}>
              Jadvalning oxirgi qatoridagi imkoniyatlar ERP&apos;ga yaqin. Ularni tanlash markaz bir yil ishlab, haqiqiy ehtiyoj
              ko&apos;ringandan keyin osonroq. Ota-onalar bilan aloqa nega ikkinchi oydayoq muhim ekanini{" "}
              <Link href="/features/parents" className={LINK}>ota-onaga xabar</Link>{" "}sahifasida yozganmiz.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Yangi markaz uchun CRM birinchi yilda qanchaga tushadi?</h2>
            <p className={`${P} mb-4`}>
              Yangi markaz odatda eng kichik tarifdan boshlaydi, shuning uchun 100 tagacha o&apos;quvchiga mo&apos;ljallangan
              tariflarni solishtirdik.
              Narxlar rasmiy saytlardan 2026-yil 6-noyabr holatida olingan, SMS va boshqa qo&apos;shimcha xizmatlar kiritilmagan.
            </p>
            <div className="overflow-x-auto rounded-[12px] border border-[#e4e7ea]">
              <table className="w-full min-w-[560px] text-[14px]">
                <thead>
                  <tr className="bg-[#f8f9fa] text-left">
                    <th className={TH}>CRM</th>
                    <th className={TH}>Birinchi yil</th>
                    <th className={TH}>Qanday hisoblandi</th>
                  </tr>
                </thead>
                <tbody>
                  {COSTS.map(([n, sum, how]) => (
                    <tr key={n} className="border-t border-[#e4e7ea] align-top">
                      <td className="px-4 py-3 font-medium text-[#16181a]">{n}</td>
                      <td className={TD}>{sum}</td>
                      <td className={TD}>{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`${P} mt-3`}>
              Yangi markaz uchun pulning o&apos;zidan ham muhimi bepul sinov. Darslinker 14 kun, Modme va EduTizim 7 kun sinov
              beradi. Bu tizimlarning batafsil taqqoslashi{" "}
              <Link href="/blog/ozbekistonda-eng-yaxshi-crm-oquv-markazlari-uchun" className={LINK}>eng yaxshi CRM</Link>{" "}
              maqolasida.
            </p>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Yangi markazlar tizim tanlashda qanday xatoga yo&apos;l qo&apos;yadi?</h2>
            <ol className="space-y-3 list-decimal pl-5">
              <li className={P}>
                <strong className="text-[#16181a]">Keraksiz ERP&apos;ni oldindan sotib olish.</strong> Ish haqi va turniket moduli
                bir yildan keyin kerak bo&apos;lishi mumkin, lekin to&apos;lov hozirdan boshlanadi.
              </li>
              <li className={P}>
                <strong className="text-[#16181a]">Faqat narxga qarab tanlash.</strong> Arzon tizimda ota-onaga xabar SMS orqali
                bo&apos;lsa, har xabar uchun alohida to&apos;lov oylik narxga qo&apos;shiladi.
              </li>
              <li className={P}>
                <strong className="text-[#16181a]">Sinovni bo&apos;sh tizimda o&apos;tkazish.</strong> Sinov davrida haqiqiy
                guruhni kiriting, davomat belgilang, to&apos;lov qabul qiling. Shundagina tizim sizga mosmi, bilinadi.
              </li>
              <li className={P}>
                <strong className="text-[#16181a]">O&apos;tishni keyinga qoldirish.</strong> Markaz qancha kech o&apos;tsa, Excel va
                daftardagi ma&apos;lumot shuncha ko&apos;payadi va ko&apos;chirish qiyinlashadi.
              </li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className={H2}>Darslinker yangi markazga qanday mos keladi?</h2>
            <p className={`${P} mb-3`}>
              Darslinker{" "}
              <Link href="/" className={LINK}>o&apos;quv markazlari uchun CRM va LMS platformasi</Link>. Unda yuqoridagi jadvalning birinchi uch oyidagi hamma narsa bor va
              barcha imkoniyatlar eng kichik tarifda ham ochiq. Yangi markaz uchun quyidagilar muhim.
            </p>
            <ul className="space-y-2 ml-1 mb-3">
              {[
                "Minimal tarif oyiga 190 000 so'm, 100 tagacha o'quvchi, 1 filial va 3 xodim uchun",
                "14 kun bepul sinov, karta talab qilinmaydi",
                "Tizimni support jamoasi birga o'rnatadi va har bir tarifda to'liq sozlab beradi",
                "Ota-onaga xabar Telegram orqali boradi, SMS uchun alohida to'lov yo'q",
                "O'quvchilar 100 tadan oshsa, tarifni darhol almashtirish shart emas, har 10 ta ortiqcha o'quvchiga oyiga 20 000 so'm qo'shiladi",
              ].map((c) => (
                <li key={c} className="text-[15px] text-[#16181a]/80 flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <p className={`${P} mb-4`}>
              Darslinker ERP emas. Unda ish haqi hisobi, turniket va Click yoki Payme orqali onlayn to&apos;lov yo&apos;q, to&apos;lov
              qo&apos;lda qayd etiladi. Bular birinchi kundan kerak bo&apos;lsa, boshqa tizimlarga ham qarang. Kichik markaz uchun
              batafsil ma&apos;lumot{" "}
              <Link href="/for/small-centers" className={LINK}>kichik markazlar uchun</Link>{" "}sahifasida, barcha narxlar{" "}
              <Link href="/pricing" className={LINK}>tariflar sahifasida</Link>.
            </p>
            <CrmApplyButton
              refSource="blog-yangi-markaz-crm"
              className="inline-flex h-[48px] items-center gap-2 rounded-full border-2 border-[#2d5a8a] px-6 text-[15px] font-semibold text-[#2d5a8a] transition-colors hover:bg-[#2d5a8a] hover:text-white"
            >
              14 kun bepul sinab ko&apos;rish →
            </CrmApplyButton>
          </section>

          <section className="mb-12">
            <h2 className={H2}>Ko&apos;p so&apos;raladigan savollar</h2>
            <FaqList items={faqs} />
          </section>

          <section className="rounded-[18px] bg-[#f4f6f8] p-6 md:p-8">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a]">Markazingizni birinchi kundan tartibli boshlang</h2>
            <p className={`${P} mt-2`}>
              Ariza qoldiring. Darslinker&apos;ni markazingiz uchun ochamiz, birinchi guruhlarni birga kiritamiz va 14 kun davomida
              haqiqiy ishda sinab ko&apos;rasiz.
            </p>
            <CrmApplyButton
              refSource="blog-yangi-markaz-crm-end"
              className="mt-5 inline-flex h-[52px] items-center gap-2 rounded-full bg-[#2d5a8a] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#244c76]"
            >
              Bepul sinab ko&apos;rish →
            </CrmApplyButton>
          </section>

          <p className="mt-8 text-[12.5px] text-[#7c8490]">
            Ma&apos;lumotlar olingan manbalar{" "}
            <a href="https://www.ibm.com/topics/erp-vs-crm" target="_blank" rel="noreferrer noopener" className="hover:underline">IBM</a>,{" "}
            <a href="https://edutizim.uz/en" target="_blank" rel="noreferrer noopener" className="hover:underline">edutizim.uz</a>,{" "}
            <a href="https://modme.uz/en/prices" target="_blank" rel="noreferrer noopener" className="hover:underline">modme.uz</a>,{" "}
            <a href="https://edulog.uz/" target="_blank" rel="noreferrer noopener" className="hover:underline">edulog.uz</a>,{" "}
            <a href="https://schoolup.uz" target="_blank" rel="noreferrer noopener" className="hover:underline">schoolup.uz</a>.
            Narxlar 2026-yil 6-noyabr holatida.
          </p>
        </article>
      </main>
    </>
  );
}
