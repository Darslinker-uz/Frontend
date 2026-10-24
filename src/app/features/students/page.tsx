import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { StudentsPreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /features/students — "o'quvchilar bazasini yuritish dasturi" (docs/crm-pages-keywords.md).
// Faktlar: holatlar sinov → faol → ketgan, bitta raqamga bir nechta farzand, profilda davomat/to'lov/quiz, Excel import.

const c: FeaturePageContent = {
  path: "/features/students",
  ref: "feature-students",
  parent: FEATURES_CRUMB,
  crumb: "O'quvchilar bazasi",
  metaTitle: "O'quvchilar bazasini yuritish dasturi — Darslinker",
  metaDescription:
    "O'quv markazi uchun o'quvchilar bazasi: har o'quvchining holati, davomati, to'lovlari va quiz natijalari bitta profilda. Ro'yxat Excel'dan ko'chiriladi.",
  keywords: ["o'quvchilar bazasini yuritish dasturi", "o'quvchilar hisobi", "o'quvchilar ro'yxati dasturi", "o'quvchi tarixi va to'lovlari"],
  eyebrow: "Imkoniyat · O'quvchilar",
  title: "O'quvchilar bazasini yuritish dasturi",
  lead: "Darslinker O'zbekistondagi o'quv markazlari uchun o'quvchilar hisobini bitta joyga yig'adi: har o'quvchining holati, guruhi, davomati, to'lovlari va quiz natijalari bitta profilda. Kim sinovda, kim faol o'qiyapti, kim ketgani doim ko'rinib turadi.",
  Preview: StudentsPreview,
  how: {
    question: "O'quvchilar bazasida qanday ma'lumotlar yuritiladi?",
    answer:
      "Darslinker'da har o'quvchining profili bor: u qaysi guruhda o'qiydi, davomati qanday, qancha to'lagan va qarzi bormi, quizlarda qanday natija ko'rsatgan. O'quvchi holati sinov, faol yoki ketgan deb belgilanadi, shuning uchun markazdagi umumiy manzara doim aniq.",
    steps: [
      { title: "Ro'yxat ko'chiriladi", text: "Mavjud o'quvchilar Excel'dan tizimga yuklanadi, qo'lda kiritish shart emas." },
      { title: "Holat belgilanadi", text: "Har o'quvchi sinov, faol yoki ketgan holatida bo'ladi." },
      { title: "Tarix o'zi to'planadi", text: "Davomat, to'lov va quiz natijalari profilga o'zi tushib boradi." },
    ],
  },
  summary: [
    "Har o'quvchining guruhi, davomati, to'lovlari, qarzi va quiz natijalari bitta profilda.",
    "O'quvchi holati uch xil: sinov, faol va ketgan.",
    "Bitta telefon raqamiga bir nechta farzand bog'lanadi.",
    "Mavjud ro'yxat Excel'dan ko'chiriladi. Imkoniyat barcha tariflarda bor.",
  ],
  compare: {
    question: "Daftar yoki Excel'dan nimasi farq qiladi?",
    rows: [
      ["O'quvchi haqida ma'lumot", "Ism daftarda, to'lov Excel'da, davomat jurnalda — har biri alohida joyda", "Hammasi bitta profilda, bir bosishda ko'rinadi"],
      ["Kim ketganini bilish", "Odatda o'quvchi kelmay qo'ygach, kech bilinadi", "Holat \"ketgan\" deb belgilanadi, ketganlar ro'yxati alohida"],
      ["Bir oiladan bir nechta farzand", "Har farzand alohida yoziladi, ota-ona raqami takrorlanadi", "Bitta raqamga bir nechta farzand bog'lanadi"],
      ["Xodim almashganda", "Daftar yoki fayl bilan birga ma'lumot ham yo'qolishi mumkin", "Tarix tizimda qoladi, yangi xodim davom ettiradi"],
    ],
  },
  benefits: {
    question: "O'quvchilar hisobini tizimda yuritish nima beradi?",
    items: [
      { title: "Hamma narsa bitta profilda", text: "O'quvchi haqida bilish uchun daftar, Excel va chatlarni titkilash shart emas." },
      { title: "Holatlar aniq", text: "Sinovdagi, faol va ketgan o'quvchilar alohida ko'rinadi, kim ketganini kech bilmaysiz." },
      { title: "Bir oiladan bir nechta farzand", text: "Bitta telefon raqamiga bir nechta farzand bog'lanadi, ota-ona hamma xabarni bir joyda oladi." },
      { title: "Tarix yo'qolmaydi", text: "O'qituvchi yoki administrator almashsa ham o'quvchining butun tarixi tizimda qoladi." },
    ],
  },
  related: {
    title: "Profil boshqa imkoniyatlar bilan bog'langan",
    text: (
      <p>
        Profilga{" "}
        <Link href="/features/attendance" className={TEXT_LINK}>davomat</Link>,{" "}
        <Link href="/features/payments" className={TEXT_LINK}>to&apos;lovlar</Link>{" "}va{" "}
        <Link href="/features/live-quiz" className={TEXT_LINK}>quiz natijalari</Link>{" "}o&apos;zi tushadi.
        Yangi o&apos;quvchi qanday paydo bo&apos;lishi —{" "}
        <Link href="/features/leads" className={TEXT_LINK}>lidlar</Link>{" "}sahifasida.
      </p>
    ),
  },
  faqs: [
    { q: "O'quvchining qanday holatlari bor?", a: "Uchta: sinov (sinov darslarida), faol (o'qiyapti) va ketgan. Holatlar bo'yicha o'quvchilarni alohida ko'rish mumkin." },
    { q: "Bir oiladan bir nechta farzand o'qisa-chi?", a: "Bitta telefon raqamiga bir nechta farzand bog'lanadi. Ota-ona har bir farzandi haqidagi xabarlarni shu raqam orqali oladi." },
    { q: "Mavjud ro'yxatni qanday ko'chiraman?", a: "Excel faylidan yuklaysiz. Kerak bo'lsa, ko'chirishda yordam beramiz." },
    { q: "O'quvchilar, guruhlar, davomat va to'lovlarni bitta profilda yuritadigan dastur bormi?", a: "Ha, Darslinker. Har o'quvchining profilida uning guruhi, davomati, to'lovlari, qarzi va quiz natijalari birga turadi. Mavjud ro'yxatni Excel'dan ko'chirish mumkin." },
    { q: "O'quvchilar ma'lumotini kim ko'radi?", a: "Har xodim o'z roliga tegishli qismni ko'radi: masalan, o'qituvchi o'z guruhlarini, kassir to'lovlarni. Rahbar hammasini ko'radi." },
    { q: "Ketgan o'quvchining ma'lumoti o'chib ketadimi?", a: "Yo'q. Ketgan o'quvchi \"ketgan\" holatida qoladi va uning tarixi tizimda saqlanadi." },
    { q: "Bu imkoniyat qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar o'quvchilar soniga qarab tanlanadi va oyiga ${PLANS[0].price} so'mdan boshlanadi.` },
  ],
  cta: {
    title: "O'quvchilaringizni bitta bazaga yig'ing",
    text: "14 kun bepul sinov, karta kerak emas. Ro'yxatni Excel'dan ko'chirib, birinchi kundan ishlaysiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
