import Link from "next/link";
import { FeaturePage, FOR_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { QuizPreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /for/exam-prep — "abituriyent tayyorlov markazi uchun CRM" (docs/crm-pages-keywords.md).
// Imtihon/baho jurnali hali tayyor emas — faqat jonli quiz natijalari va davomat haqida yoziladi.

const c: FeaturePageContent = {
  path: "/for/exam-prep",
  ref: "for-exam-prep",
  parent: FOR_CRUMB,
  crumb: "Abituriyent markazlari",
  metaTitle: "Abituriyent tayyorlov markazi uchun CRM — Darslinker",
  metaDescription:
    "Abituriyent tayyorlov markazi uchun CRM: davomat va ota-onaga xabar, jonli quiz bilan bilimni tekshirish, to'lov va qarzdorlik hisobi.",
  keywords: ["abituriyent tayyorlov markazi uchun CRM", "test markazi boshqaruv dasturi", "abituriyent guruhlari va davomat hisobi"],
  title: "Abituriyent tayyorlov markazi uchun CRM",
  lead: "Abituriyent va test markazlarida har dars muhim: o'quvchi qoldirgan dars natijaga ta'sir qiladi, ota-ona esa farzandi qanday tayyorlanayotganini bilishni istaydi. Darslinker shuni nazorat qilishga yordam beradi.",
  Preview: QuizPreview,
  how: {
    question: "Imtihonga tayyorlov guruhlarining davomatini va natijalarini qanday kuzatish mumkin?",
    answer:
      "Darslinker'da o'qituvchi davomatni har darsda telefondan belgilaydi, kelmagan o'quvchining ota-onasiga darhol Telegram xabar boradi. Mavzu qanchalik o'zlashtirilganini darsda jonli quiz bilan tekshirasiz, natijalar esa o'quvchi profilida saqlanadi.",
    steps: [
      { title: "Davomat har darsda", text: "Kim dars qoldirgani darhol ko'rinadi, ota-ona ham xabar oladi." },
      { title: "Bilim quiz bilan tekshiriladi", text: "Mavzu oxirida jonli quiz: o'quvchilar telefondan javob beradi, reyting ekranda ko'rinadi." },
      { title: "Natijalar saqlanadi", text: "Quiz natijalari o'quvchi profilida davomat va to'lovlar bilan birga turadi." },
    ],
  },
  summary: [
    "Davomat har darsda telefondan belgilanadi, kelmagan o'quvchining ota-onasiga Telegram xabar boradi.",
    "Mavzu jonli quiz bilan tekshiriladi, natijalar o'quvchi profilida saqlanadi.",
    "Ota-ona farzandining davomati va to'lovlarini o'zi kuzatib boradi.",
    "Qabul mavsumidagi arizalar lid sifatida kuzatiladi, hech biri yo'qolmaydi.",
  ],
  compare: {
    question: "Jurnal va daftardan nimasi farq qiladi?",
    beforeLabel: "Jurnal yoki daftarda",
    rows: [
      ["Dars qoldirish", "Oy oxirida jurnalni ko'rib bilinadi", "Darhol ko'rinadi, ota-ona ham xabar oladi"],
      ["Bilimni tekshirish", "Qog'oz test, keyin qo'lda tekshiriladi", "Jonli quiz, ballar darhol hisoblanadi"],
      ["Natijalar", "Daftarda tarqoq, yo'qolishi mumkin", "O'quvchi profilida saqlanadi"],
      ["Ota-ona bilan aloqa", "Ota-ona markazga qo'ng'iroq qilib so'raydi", "Davomat va to'lovni o'zi kuzatadi"],
    ],
  },
  benefits: {
    question: "Abituriyent markazi uchun Darslinker nima beradi?",
    items: [
      { title: "Ota-ona xotirjam", text: "Farzandi darsga kelmasa yoki to'lov qabul qilinsa, ota-ona Telegram orqali darhol biladi." },
      { title: "Takrorlash qiziqarli", text: "Jonli quiz test savollarini o'yin shaklida takrorlashga yordam beradi, o'quvchilar musobaqalashadi." },
      { title: "Dars qoldirish erta seziladi", text: "Davomat pasaya boshlagan o'quvchi bilan imtihondan ancha oldin gaplashasiz." },
      { title: "Qabul mavsumida tartib", text: "Kursga yozilmoqchi bo'lganlar lid sifatida kiritiladi, hech bir ariza yo'qolmaydi." },
    ],
  },
  related: {
    title: "Abituriyent markazi uchun asosiy imkoniyatlar",
    text: (
      <p>
        <Link href="/features/live-quiz" className={TEXT_LINK}>Jonli quiz</Link>,{" "}
        <Link href="/features/attendance" className={TEXT_LINK}>davomat</Link>,{" "}
        <Link href="/features/parents" className={TEXT_LINK}>ota-onaga xabar</Link>{" "}va{" "}
        <Link href="/features/leads" className={TEXT_LINK}>lidlar</Link>{" "}haqida alohida sahifalarda yozdik.
      </p>
    ),
  },
  faqs: [
    { q: "Test savollarini jonli quiz orqali ishlasa bo'ladimi?", a: "Ha. O'qituvchi savollarni markaz panelida tayyorlaydi, darsda o'yinni boshlaydi, o'quvchilar telefondan PIN bilan qo'shilib javob beradi." },
    { q: "Ota-ona farzandining davomatini qanday biladi?", a: "Farzandi darsga kelmagan deb belgilansa, ota-onasiga Telegram orqali avtomatik xabar boradi." },
    { q: "Abituriyent tayyorlov markazida davomat, test natijalari va ota-onaga xabarlarni birga kuzatadigan CRM bormi?", a: "Ha, Darslinker'da davomat har darsda belgilanadi va kelmagan o'quvchining ota-onasiga Telegram xabar boradi. Test savollarini darsda jonli quiz orqali ishlash mumkin, quiz natijalari o'quvchi profilida saqlanadi." },
    { q: "Ota-ona farzandining tayyorgarligini kuzata oladimi?", a: "Ota-ona farzandining davomati va to'lovlarini kuzatib boradi va farzandi darsga kelmasa, darhol Telegram orqali xabar oladi." },
    { q: "Qabul mavsumida ko'p ariza keladi, ularni qanday yuritaman?", a: "Har bir ariza lid sifatida Kanban doskaga kiritiladi. Kim sinov darsiga kelgani va kim yozilgani ko'rinadi, hech bir ariza yo'qolmaydi." },
    { q: "Abituriyent markazi uchun qaysi tarif mos?", a: `O'quvchilar soniga qarab: 100 tagachasiga Minimal (${PLANS[0].price} so'm/oy), 250 tagachasiga Standart, 600 tagachasiga Biznes tarifi mos. Barcha imkoniyatlar har bir tarifda bor.` },
  ],
  cta: {
    title: "Abituriyentlar tayyorlovini nazoratga oling",
    text: "14 kun bepul sinov, karta kerak emas. Guruhlaringizni sinov davomida tizimga ko'chirasiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
