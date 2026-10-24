import Link from "next/link";
import { FeaturePage, FOR_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { SchedulePreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /for/language-centers — "til markazi uchun CRM" (docs/crm-pages-keywords.md).
// Faqat umumiy (tasdiqlangan) imkoniyatlar til markazi misolida; IELTS ball hisobi kabi maxsus funksiyalar yo'q — yozilmaydi.

const c: FeaturePageContent = {
  path: "/for/language-centers",
  ref: "for-language-centers",
  parent: FOR_CRUMB,
  crumb: "Til markazlari",
  metaTitle: "Til markazi uchun CRM: guruh, davomat, to'lov — Darslinker",
  metaDescription:
    "Til o'quv markazi uchun CRM: daraja bo'yicha guruhlar, dars jadvali, davomat, oylik to'lov va qarzdorlik, ota-onaga Telegram xabar va darsda jonli quiz.",
  keywords: ["til markazi uchun CRM", "til o'quv markazini boshqarish dasturi", "ingliz tili markazi davomat va to'lov tizimi"],
  title: "Til markazi uchun CRM",
  lead: "Til markazlarida (ingliz, rus, koreys yoki boshqa til kurslarida) guruhlar ko'p, jadval tez-tez o'zgaradi, to'lov esa har oy keladi. Darslinker shularning hammasini bitta tizimda yuritadi.",
  Preview: SchedulePreview,
  how: {
    question: "Til markazi guruhlari va to'lovlarini qanday boshqarish mumkin?",
    answer:
      "Darslinker'da har bir daraja yoki kurs uchun guruh ochiladi, guruhga xona, o'qituvchi va dars vaqti biriktiriladi. O'qituvchi davomatni darsda telefondan belgilaydi, oylik to'lov va qarz esa avtomatik hisoblanadi. Kelmagan o'quvchi yoki qarzdorlik haqida ota-onaga Telegram xabar boradi.",
    steps: [
      { title: "Guruhlar va jadval", text: "Har daraja uchun guruh, xona va o'qituvchi belgilanadi, bandlik to'qnashuvi ko'rinadi." },
      { title: "Davomat va to'lov", text: "Davomat darsda belgilanadi, oylik to'lov va qarz o'zi hisoblanadi." },
      { title: "Ota-ona bilan aloqa", text: "Kelmadi, qarzdorlik va to'lov tasdig'i haqida Telegram xabar avtomatik boradi." },
    ],
  },
  summary: [
    "Har daraja yoki kurs uchun guruh: xona, o'qituvchi va dars vaqti bir jadvalda.",
    "Davomat darsda telefondan belgilanadi, oylik to'lov va qarz o'zi hisoblanadi.",
    "So'z boyligi va grammatikani jonli quiz bilan o'yin shaklida takrorlash mumkin.",
    "Sinov darsiga kelganlar lid sifatida kuzatiladi va bir bosishda o'quvchiga aylanadi.",
  ],
  compare: {
    question: "Til markazini Excel'da yuritishdan nimasi farq qiladi?",
    rows: [
      ["Ko'p guruh jadvali", "Har daraja uchun alohida varaq, xona to'qnashuvi kech bilinadi", "Barcha guruhlar bitta jadvalda, to'qnashuv darhol ko'rinadi"],
      ["Oylik to'lov", "Har oy kim to'laganini qo'lda tekshirish", "Qarz o'zi hisoblanadi, qarzdorlar ro'yxati tayyor"],
      ["Sinov darsi", "Qiziqqanlar chatda yo'qolib ketadi", "Lid doskada, sinovdan keyin o'quvchiga aylanadi"],
      ["Darsni qiziqarli qilish", "Og'zaki so'rov, faqat bir-ikki o'quvchi qatnashadi", "Jonli quiz: har o'quvchi telefondan javob beradi"],
    ],
  },
  benefits: {
    question: "Til markazi uchun Darslinker nima beradi?",
    items: [
      { title: "Ko'p guruhda tartib", text: "Daraja va vaqt bo'yicha o'nlab guruhlar bitta jadvalda, xona yoki o'qituvchi bandligi darhol ko'rinadi." },
      { title: "Darsda jonli quiz", text: "So'z boyligi yoki grammatikani o'yin shaklida takrorlash: o'quvchilar telefondan qo'shiladi, reyting jonli yangilanadi." },
      { title: "Sinov darsidan o'quvchigacha", text: "Kursga yozilmoqchi bo'lganlar lid sifatida kiritiladi, sinov darsidan keyin bir bosishda o'quvchiga aylanadi." },
      { title: "Yangi o'quvchilar oqimi", text: "Darslinker marketplace'da til kurslari bo'yicha qidirayotgan o'quvchilar markazingizga ariza qoldiradi." },
    ],
  },
  related: {
    title: "Til markazi uchun asosiy imkoniyatlar",
    text: (
      <p>
        <Link href="/features/schedule" className={TEXT_LINK}>Dars jadvali</Link>,{" "}
        <Link href="/features/attendance" className={TEXT_LINK}>davomat</Link>,{" "}
        <Link href="/features/payments" className={TEXT_LINK}>to&apos;lov va qarzdorlik</Link>,{" "}
        <Link href="/features/live-quiz" className={TEXT_LINK}>jonli quiz</Link>,{" "}
        <Link href="/features/parents" className={TEXT_LINK}>ota-onaga xabar</Link>{" "}va{" "}
        <Link href="/features/leads" className={TEXT_LINK}>lidlar</Link>{" "}haqida alohida sahifalarda yozdik.
      </p>
    ),
  },
  faqs: [
    { q: "Darslinker qaysi til kurslari uchun mos?", a: "Ingliz, rus, koreys, nemis va boshqa har qanday til kurslari uchun. Tizim guruh, jadval, davomat va to'lovni yuritadi, kurs qaysi tilda ekanidan qat'i nazar." },
    { q: "Til markazida darajalar bo'yicha guruhlar, jadval, davomat va oylik to'lovlarni qaysi dasturda yuritish mumkin?", a: "Buni Darslinker'da yuritish mumkin: har daraja uchun guruh ochilib, unga xona, o'qituvchi va dars vaqti biriktiriladi. Davomat telefondan belgilanadi, oylik to'lov va qarz avtomatik hisoblanadi." },
    { q: "Sinov darsiga kelganlarni qanday yuritaman?", a: "Ular lid sifatida kiritiladi va Kanban doskada kuzatiladi. Sinov darsidan keyin lid bir bosishda o'quvchiga aylanadi." },
    { q: "IELTS yoki CEFR tayyorlov kurslari uchun mosmi?", a: "Ha. Darslinker har qanday kurs uchun guruh, jadval, davomat va to'lovni yuritadi. Mavzuni takrorlash uchun darsda jonli quiz o'tkazish mumkin." },
    { q: "Bolalar guruhlari bo'lsa, ota-onalar xabar oladimi?", a: "Ha. Farzandi darsga kelmasa, qarz paydo bo'lsa yoki to'lov qabul qilinsa, ota-onaga Telegram orqali avtomatik xabar boradi." },
    { q: "Til markazi uchun qaysi tarif mos?", a: `O'quvchilar soniga qarab: 100 tagachasiga Minimal (${PLANS[0].price} so'm/oy), 250 tagachasiga Standart, 600 tagachasiga Biznes tarifi mos. Barcha imkoniyatlar har bir tarifda bor.` },
  ],
  cta: {
    title: "Til markazingizni tartibga soling",
    text: "14 kun bepul sinov, karta kerak emas. Guruhlar ro'yxatini Excel'dan ko'chirib, birinchi kundan ishlaysiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
