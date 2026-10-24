import Link from "next/link";
import { FeaturePage, FOR_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { LeadsPreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /for/it-schools — "IT o'quv markazi uchun CRM" (docs/crm-pages-keywords.md).
// Faqat tasdiqlangan umumiy imkoniyatlar IT akademiya misolida (modul bo'yicha to'lov — crm-content/features-explorer'da bor).

const c: FeaturePageContent = {
  path: "/for/it-schools",
  ref: "for-it-schools",
  parent: FOR_CRUMB,
  crumb: "IT akademiyalar",
  metaTitle: "IT o'quv markazi va akademiya uchun CRM — Darslinker",
  metaDescription:
    "IT o'quv markazi uchun CRM: lidlar va sinov darslari, modul bo'yicha to'lov, guruhlar va davomat, jonli quiz bilan mavzuni tekshirish.",
  keywords: ["IT o'quv markazi uchun CRM", "IT akademiya boshqaruv tizimi", "dasturlash kurslari uchun o'quvchilar hisobi"],
  title: "IT o'quv markazi va akademiya uchun CRM",
  lead: "IT akademiyalar va dasturlash kurslarida murojaat ko'p, kurslar modullarga bo'lingan, guruhlar esa uzoq davom etadi. Darslinker arizadan tortib to'lovgacha hammasini bitta tizimda yuritadi.",
  Preview: LeadsPreview,
  how: {
    question: "IT akademiyada guruhlar va o'quvchilarni qanday boshqarish mumkin?",
    answer:
      "Darslinker'da kursga qiziqqanlar lid sifatida kiritiladi va sinov darsidan keyin o'quvchiga aylanadi. Har guruh uchun o'qituvchi, xona va jadval belgilanadi, to'lov esa oylik yoki modul bo'yicha hisoblanadi. O'qituvchi davomatni darsda belgilaydi, mavzuni jonli quiz bilan tekshiradi.",
    steps: [
      { title: "Lid → sinov darsi → o'quvchi", text: "Har bir murojaat Kanban doskada kuzatiladi va bir bosishda o'quvchiga aylanadi." },
      { title: "Modul bo'yicha to'lov", text: "To'lov oylik yoki kurs moduli bo'yicha belgilanadi, qarz o'zi hisoblanadi." },
      { title: "Darsda nazorat", text: "Davomat telefondan belgilanadi, mavzu jonli quiz bilan tekshiriladi." },
    ],
  },
  summary: [
    "Reklamadan kelgan har bir ariza lid sifatida Kanban doskada kuzatiladi.",
    "To'lov oylik yoki modul bo'yicha belgilanadi, qarz o'zi hisoblanadi.",
    "Davomat telefondan belgilanadi, mavzu jonli quiz bilan tekshiriladi.",
    "Dashboard'da guruhni tark etganlar va sinovdan keyin ketganlar alohida ko'rinadi.",
  ],
  compare: {
    question: "Google Sheets yoki Excel'dan nimasi farq qiladi?",
    beforeLabel: "Google Sheets yoki Excel'da",
    rows: [
      ["Reklamadan kelgan arizalar", "Bir varaqqa yoziladi, kim bilan gaplashilgani noma'lum", "Har bir lid bosqichi bilan doskada"],
      ["Modulli to'lov", "Har modul uchun to'lov qo'lda solishtiriladi", "Modul bo'yicha qarz o'zi hisoblanadi"],
      ["Kursni tashlab ketish", "Kech bilinadi", "Guruhni tark etganlar alohida ko'rsatkichda"],
      ["Mavzuni tekshirish", "Alohida xizmat yoki og'zaki so'rov", "Jonli quiz markaz tizimining o'zida"],
    ],
  },
  benefits: {
    question: "IT akademiya uchun Darslinker nima beradi?",
    items: [
      { title: "Arizalar yo'qolmaydi", text: "Reklamadan keladigan ko'p murojaatlar bitta doskada, kim sinov darsiga kelgani ko'rinadi." },
      { title: "Kurs tuzilishiga mos to'lov", text: "Modullarga bo'lingan kurslarda to'lov modul bo'yicha hisoblanadi." },
      { title: "Mavzu tushunilganini bilasiz", text: "Jonli quiz bilan har mavzu oxirida tez tekshiruv o'tkazasiz." },
      { title: "Ketayotganlar erta seziladi", text: "Dashboard'da guruhni tark etganlar va sinovdan keyin ketganlar alohida ko'rinadi." },
    ],
  },
  related: {
    title: "IT akademiya uchun asosiy imkoniyatlar",
    text: (
      <p>
        <Link href="/features/leads" className={TEXT_LINK}>Lidlar</Link>,{" "}
        <Link href="/features/payments" className={TEXT_LINK}>to&apos;lov va qarzdorlik</Link>,{" "}
        <Link href="/features/live-quiz" className={TEXT_LINK}>jonli quiz</Link>{" "}va{" "}
        <Link href="/features/reports" className={TEXT_LINK}>hisobotlar</Link>{" "}haqida alohida sahifalarda yozdik.
      </p>
    ),
  },
  faqs: [
    { q: "IT akademiyada lidlarni sinov darsidan o'quvchiga aylantirib, modul to'lovlarini hisoblaydigan dastur qaysi?", a: "Darslinker'da ikkalasi ham bor: lidlar Kanban doskada sinov darsigacha kuzatiladi va bir bosishda o'quvchiga aylanadi. To'lov oylik yoki modul bo'yicha belgilanadi, qarz avtomatik hisoblanadi." },
    { q: "Sinov darsiga kelganlarni qanday kuzataman?", a: "Ular lid sifatida Kanban doskada turadi. Sinov darsidan keyin kursga yozilganlar bir bosishda o'quvchiga aylanadi." },
    { q: "Darslinker faqat dasturlash kurslari uchunmi?", a: "Yo'q. Dizayn, SMM va boshqa IT yo'nalishlari uchun ham mos: tizim guruh, davomat, to'lov va lidlarni yuritadi." },
    { q: "Kursni tashlab ketayotganlarni qanday bilaman?", a: "Dashboard'da guruhni tark etganlar va sinovdan keyin ketganlar alohida ko'rsatkich sifatida ko'rinadi. Davomat pasaygan o'quvchini esa uning profilida erta sezasiz." },
    { q: "IT akademiya uchun qaysi tarif mos?", a: `O'quvchilar soniga qarab: 100 tagachasiga Minimal (${PLANS[0].price} so'm/oy), 250 tagachasiga Standart, 600 tagachasiga Biznes tarifi mos. Barcha imkoniyatlar har bir tarifda bor.` },
  ],
  cta: {
    title: "IT akademiyangizni bitta tizimga o'tkazing",
    text: "14 kun bepul sinov, karta kerak emas. Guruhlar va lidlarni birinchi kundan tizimda yuritasiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
