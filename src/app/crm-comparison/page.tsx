import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CrmApplyButton } from "@/components/crm/crm-apply";
import { FaqList } from "@/components/faq-item";
import { PLANS } from "@/lib/crm-content";
import { SHARE_OG, SHARE_TWITTER } from "@/lib/share-meta";

// /crm-comparison — "O'zbekistondagi o'quv markazlari CRM tizimlari" (docs/crm-pages-keywords.md).
// Neytral tanlash qo'llanmasi: mezon → nega muhim → Darslinker'da qanday. Raqobatchilar nomi va ular haqida
// da'vo yo'q (tekshirilgan ma'lumot bo'lmaguncha). Darslinker ustunidagi har bir gap — tasdiqlangan fakt.

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const PATH = "/crm-comparison";
const TITLE = "O'zbekistonda o'quv markazi uchun CRM tanlash — Darslinker";
const DESCRIPTION =
  "O'zbekistondagi o'quv markazlari CRM tizimlarini qanday solishtirish kerak: narx, imkoniyatlar, ota-onaga xabar, sinov muddati va yordam.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["O'zbekistondagi o'quv markazlari CRM tizimlari", "o'quv markazi uchun eng yaxshi CRM", "o'quv markazlari uchun CRM taqqoslash", "CRM tizimlari narxlari"],
  alternates: { canonical: PATH },
  openGraph: { ...SHARE_OG, title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { ...SHARE_TWITTER, title: TITLE, description: DESCRIPTION },
};

const CRITERIA: { name: string; why: string; darslinker: string; href?: string }[] = [
  { name: "Narx qanday hisoblanadi", why: "Ba'zi tizimlarda narx o'quvchi, guruh yoki xodim soniga bog'liq. Markaz o'sganda qancha to'lashingizni oldindan bilish muhim.", darslinker: `O'quvchilar soniga qarab: oyiga ${PLANS[0].price} so'mdan. Chegaradan oshgan har 10 o'quvchiga +20 000 so'm.`, href: "/pricing" },
  { name: "Imkoniyatlar tarifga qarab cheklanadimi", why: "Arzon tarifda kerakli imkoniyat yopiq bo'lsa, qimmatrog'iga o'tishga majbur bo'lasiz.", darslinker: "Cheklanmaydi. Barcha imkoniyatlar har bir tarifda bor.", href: "/features" },
  { name: "Ota-onaga xabar qanday boradi", why: "SMS har xabar uchun pul talab qiladi. Ota-onalar soni ko'p bo'lsa, bu xarajat sezilarli bo'ladi.", darslinker: "Telegram orqali, avtomatik. Xabar uchun alohida pul to'lanmaydi.", href: "/features/parents" },
  { name: "Davomat qanday belgilanadi", why: "O'qituvchi davomatni darsda tez belgilay olmasa, u keyinga qoladi va unutiladi.", darslinker: "O'qituvchi darsda telefondan belgilaydi, ilova o'rnatish shart emas.", href: "/features/attendance" },
  { name: "Qarzdorlik avtomatik hisoblanadimi", why: "Qarzni qo'lda sanash vaqt oladi va xatoga olib keladi.", darslinker: "Ha. Qarz to'lov rejasi asosida o'zi hisoblanadi, qarzdorlar ro'yxati doim tayyor.", href: "/features/payments" },
  { name: "O'quvchini ushlab qolishga yordam beradimi", why: "Hisob yuritish yetarli emas: o'quvchi qiziqib qatnashi uchun dars ham qiziqarli bo'lishi kerak.", darslinker: "Darsda jonli quiz va reyting, kelmagan o'quvchi haqida ota-onaga xabar.", href: "/features/live-quiz" },
  { name: "Yangi o'quvchi topishga yordam", why: "CRM odatda mavjud o'quvchilarni boshqaradi, yangi o'quvchi oqimi alohida masala.", darslinker: "Lidlar Kanban doskada. Bundan tashqari Darslinker marketplace orqali o'quvchilardan ariza keladi.", href: "/features/leads" },
  { name: "Mavjud ma'lumotni ko'chirish", why: "Ro'yxatni qaytadan qo'lda kiritish bir necha kun oladi.", darslinker: "O'quvchilar ro'yxati Excel'dan ko'chiriladi, kerak bo'lsa yordam beramiz.", href: "/features/easy-to-use" },
  { name: "Markazga moslash", why: "Tizim markazning nomi, uslubi va ish tartibiga mos bo'lsa, xodimlar va ota-onalar unga tezroq ko'nikadi.", darslinker: "Logotip va nom, dashboard ranglari, xabar matnlari, rollar.", href: "/features/customization" },
  { name: "Filiallar", why: "Markaz kengaysa, filiallarni alohida tizimlarda yuritish noqulay.", darslinker: "Biznes tarifida 3 ta, Korporativ tarifida 6 ta filial. Undan ko'p — Individual.", href: "/features/branches" },
  { name: "Sinov va boshlash", why: "Tizimni o'z ma'lumotlaringiz bilan sinab ko'rmasdan tanlash xavfli.", darslinker: "14 kun bepul sinov, karta talab qilinmaydi." },
  { name: "Yordam", why: "Savol tug'ilganda tez javob olish ishni to'xtatmaslik uchun muhim.", darslinker: "Telegram orqali support: @Darslinker_Support." },
];

const FAQS = [
  { q: "O'zbekistondagi o'quv markazlari uchun CRM tanlashda nimalarni solishtirish kerak?", a: "Eng muhimlari: narx qanday hisoblanishi, imkoniyatlar tarifga qarab cheklanishi, ota-onaga xabar usuli (SMS yoki Telegram), davomat va qarzdorlik qanchalik oson yuritilishi, ma'lumotni ko'chirish, sinov muddati va yordam." },
  { q: "CRM narxi odatda qanday hisoblanadi?", a: "Tizimlarda narx turlicha hisoblanadi: o'quvchilar, guruhlar yoki xodimlar soniga qarab. Darslinker'da narx o'quvchilar soniga bog'liq va barcha imkoniyatlar har bir tarifda bor." },
  { q: "Sinov muddatida nimani tekshirish kerak?", a: "Ro'yxatni o'z faylingizdan yuklash, davomatni telefondan belgilash, qarzdorlar ro'yxati, ota-onaga xabar usuli, markaz o'sganda narx va yordamning tezligi." },
  { q: "O'quv markaziga CRM nima uchun kerak?", a: "CRM o'quvchilar, guruhlar, davomat, to'lov va qarzdorlikni bir joyga yig'adi. Daftar yoki Excel'da bu ma'lumotlar tarqoq bo'ladi va qarzdorlik yoki o'quvchi qatnovi pasayishi kech bilinadi." },
  { q: "Eng yaxshi CRM qaysi?", a: "Hamma markaz uchun bitta eng yaxshi tizim yo'q. Markazingiz hajmi, byudjeti va ehtiyojlariga mos tizimni yuqoridagi mezonlar bo'yicha solishtiring va sinov muddatida o'z ma'lumotlaringiz bilan tekshirib ko'ring." },
  { q: "Darslinker boshqa CRM'lardan nimasi bilan farq qiladi?", a: "Darslinker o'quvchini ushlab qolishga alohida e'tibor beradi: darsda jonli quiz, ota-onaga Telegram xabarlari. Barcha imkoniyatlar har bir tarifda bor, marketplace orqali esa markazga yangi arizalar ham keladi." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": TITLE,
      "description": DESCRIPTION,
      "url": `${SITE_URL}${PATH}`,
      "inLanguage": "uz",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": `${SITE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "CRM tanlash", "item": `${SITE_URL}${PATH}` },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
    },
  ],
};

const SECTION = "max-w-[1600px] mx-auto px-5 md:px-20";
const H2 = "text-[28px] md:text-[40px] font-bold tracking-[-0.035em] leading-[1.1] text-[#16181a]";

export default function CrmComparisonPage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen text-[#16181a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={`${SECTION} pt-8 pb-12 md:pt-12 md:pb-16`}>
        <nav aria-label="Breadcrumb" className="text-[13px] text-[#7c8490]">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-[#16181a]">Bosh sahifa</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[#16181a]">CRM tanlash</li>
          </ol>
        </nav>
        <h1 className="mt-8 max-w-[960px] text-[36px] font-bold leading-[1.05] tracking-[-0.04em] md:text-[52px] xl:text-[60px]">
          O&apos;zbekistonda o&apos;quv markazi uchun CRM&apos;ni qanday tanlash kerak
        </h1>
        <p className="mt-5 max-w-[760px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">
          O&apos;zbekistonda o&apos;quv markazlari uchun bir nechta CRM tizimi bor. Ular narxi, imkoniyatlari va ishlash
          usuli bilan farq qiladi. Quyida tizimlarni solishtirishda nimalarga qarash kerakligi va har bir mezon
          bo&apos;yicha Darslinker&apos;da qanday ekanini yozdik.
        </p>
        <div className="mt-8 rounded-[22px] bg-white p-6 ring-1 ring-[#e4e7ea] md:p-8">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#5b87c0]">Qisqacha</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              "Hamma markaz uchun bitta eng yaxshi CRM yo'q: tizim markazingiz hajmi va ehtiyojiga mos bo'lishi kerak.",
              "Narx qanday hisoblanishiga va markaz o'sganda qancha bo'lishiga qarang.",
              "Imkoniyatlar arzon tarifda ham ochiqmi, ota-onaga xabar pullik SMS'dami — shuni tekshiring.",
              "Tanlashdan oldin tizimni o'z ma'lumotlaringiz bilan sinov muddatida ishlatib ko'ring.",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-[15px] leading-relaxed md:text-[16px]">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#5b87c0]" strokeWidth={3} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${SECTION} pb-14 md:pb-20`}>
        <h2 className={H2}>O&apos;quv markazi uchun CRM tanlashda nimalarni solishtirish kerak?</h2>
        <div className="mt-8 overflow-x-auto rounded-[22px] bg-white ring-1 ring-[#e4e7ea]">
          <table className="w-full min-w-[760px] text-left text-[15px]">
            <thead className="border-b border-[#e4e7ea] text-[13px] text-[#7c8490]">
              <tr>
                <th className="w-[22%] p-4 font-semibold">Mezon</th>
                <th className="w-[40%] p-4 font-semibold">Nega muhim</th>
                <th className="p-4 font-semibold">Darslinker&apos;da</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f3] align-top">
              {CRITERIA.map((r) => (
                <tr key={r.name}>
                  <td className="p-4 font-bold">{r.name}</td>
                  <td className="p-4 leading-relaxed text-[#5d6672]">{r.why}</td>
                  <td className="p-4 leading-relaxed">
                    {r.darslinker}
                    {r.href && (
                      <>
                        {" "}
                        <Link href={r.href} className="font-semibold text-[#2d5a8a] hover:underline">Batafsil</Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-[#e8eaed] py-14 md:py-20">
        <div className={SECTION}>
          <h2 className={H2}>Tanlashdan oldin nima qilish kerak?</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: "Ehtiyojni yozib chiqing", d: "Markazingizda nechta o'quvchi, filial va xodim bor, eng ko'p vaqt qayerga ketyapti — davomat, to'lovmi yoki ota-ona bilan aloqami." },
              { t: "Narxni o'sish bilan hisoblang", d: "Bugungi narxga emas, o'quvchilar soni oshganda qancha to'lashingizga qarang." },
              { t: "O'z ma'lumotingiz bilan sinang", d: "Sinov muddatida haqiqiy ro'yxatingizni yuklab, xodimlaringiz bilan bir-ikki hafta ishlab ko'ring." },
            ].map((s, i) => (
              <li key={s.t} className="rounded-[22px] bg-white p-6">
                <span className="text-[13px] font-semibold tabular-nums text-[#5b87c0]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[20px] font-bold tracking-[-0.02em]">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#5d6672]">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${SECTION} pt-14 md:pt-20`}>
        <h2 className={H2}>Sinov muddatida nimani tekshirish kerak?</h2>
        <p className="mt-4 max-w-[760px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">
          Har qanday CRM&apos;ni tanlashdan oldin quyidagilarni o&apos;zingiz tekshirib ko&apos;ring. Bu ro&apos;yxat
          istalgan tizimga mos keladi.
        </p>
        <ol className="mt-8 grid gap-3 md:grid-cols-2">
          {[
            "O'quvchilar ro'yxatini o'z faylingizdan yuklab ko'ring: qancha vaqt oldi?",
            "O'qituvchi davomatni telefondan belgilashi qulaymi?",
            "Qarzdorlar ro'yxati o'zi chiqadimi yoki qo'lda tuziladimi?",
            "Ota-onaga xabar qanday boradi va u uchun alohida to'lov bormi?",
            "Markazingiz ikki baravar o'ssa, oylik to'lov qancha bo'ladi?",
            "Savol tug'ilganda yordam qanchalik tez keladi?",
          ].map((q, i) => (
            <li key={q} className="flex gap-4 rounded-[18px] bg-white p-5 text-[15px] leading-relaxed ring-1 ring-[#e4e7ea] md:text-[16px]">
              <span className="text-[13px] font-semibold tabular-nums text-[#5b87c0]">{String(i + 1).padStart(2, "0")}</span>
              {q}
            </li>
          ))}
        </ol>
      </section>

      <section className={`${SECTION} py-14 md:py-20`}>
        <div className="rounded-[20px] border border-[#e4e7ea] bg-white p-6 md:p-10">
          <h2 className="text-[24px] font-bold tracking-[-0.03em] md:text-[32px]">Ko&apos;p so&apos;raladigan savollar</h2>
          <div className="mt-6">
            <FaqList items={FAQS} />
          </div>
        </div>
      </section>

      <section className={`${SECTION} pb-16 md:pb-24`}>
        <div className="grid items-center gap-8 overflow-hidden rounded-[24px] bg-[#1e2024] p-8 text-white md:grid-cols-[1fr_auto] md:p-14">
          <div>
            <h2 className="text-[28px] font-bold leading-tight tracking-[-0.03em] md:text-[40px]">Darslinker&apos;ni o&apos;zingiz solishtiring</h2>
            <p className="mt-3 max-w-[520px] text-[15px] text-white/60 md:text-[17px]">14 kun bepul sinov, karta kerak emas. O&apos;z ma&apos;lumotlaringiz bilan sinab ko&apos;ring.</p>
          </div>
          <CrmApplyButton refSource="crm-comparison" className="inline-flex h-[56px] items-center justify-center gap-2 rounded-[14px] bg-white px-8 text-[16px] font-semibold text-[#16181a] transition-colors hover:bg-white/90">
            Bepul sinab ko&apos;rish <ArrowRight className="h-4 w-4" />
          </CrmApplyButton>
        </div>
      </section>
    </div>
  );
}
