import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { LmsPreview } from "@/components/crm/feature-previews";
import { PLANS } from "@/lib/crm-content";

// /features/lms — "o'quv markazi uchun LMS" (docs/crm-pages-keywords.md).
// Faqat hozir ishlaydigan LMS imkoniyatlari: jonli quiz, natijalar profilda, gamifikatsiya (reyting),
// o'qituvchi davomati, ota-ona kuzatuvi (Telegram). Uy vazifasi, baho jurnali, AI quiz hali tayyor emas —
// egasi "tez orada" deb yozishga ruxsat bermagan, shuning uchun umuman tilga olinmaydi.

const c: FeaturePageContent = {
  path: "/features/lms",
  ref: "feature-lms",
  parent: FEATURES_CRUMB,
  crumb: "LMS",
  metaTitle: "O'quv markazi uchun LMS tizimi: CRM bilan bitta platformada — Darslinker",
  metaDescription:
    "Darslinker'ning LMS qismi: darsda jonli quiz, natijalar o'quvchi profilida, reyting va gamifikatsiya, ota-ona kuzatuvi. CRM bilan bitta tizimda.",
  keywords: ["o'quv markazi uchun LMS", "LMS tizimi", "o'quv jarayonini boshqarish tizimi", "CRM va LMS farqi", "o'quvchilar natijalarini kuzatish"],
  title: "O'quv markazi uchun LMS",
  lead: "Darslinker faqat hisob-kitob yuritmaydi, unda o'quv jarayoni uchun LMS tizimi ham bor. Darsda jonli quiz o'tkaziladi, natijalar o'quvchi profiliga tushadi, ota-ona esa farzandi qanday o'qiyotganini kuzatib boradi.",
  Preview: LmsPreview,
  summary: [
    "LMS qismi CRM bilan bitta tizimda: alohida platforma kerak emas.",
    "Darsda jonli quiz: o'quvchilar telefondan PIN bilan qo'shiladi, reyting jonli yangilanadi.",
    "Quiz natijalari o'quvchi profilida davomat va to'lovlar bilan birga saqlanadi.",
    "Ota-ona farzandining davomatini kuzatadi va Telegram orqali xabar oladi.",
  ],
  how: {
    question: "LMS nima va o'quv markaziga nima uchun kerak?",
    answer:
      "LMS (o'quv jarayonini boshqarish tizimi) darsning o'zi bilan ishlaydi: bilim qanday o'zlashtirilyapti, o'quvchi qanchalik faol. CRM esa o'quvchilar, to'lov va lidlarni hisoblaydi. Darslinker'da ikkalasi bitta tizimda: darsdagi quiz natijalari o'quvchining davomati va to'lovlari bilan bir profilda turadi.",
    steps: [
      { title: "Darsda quiz", text: "O'qituvchi quizni markaz panelida tuzib, darsda ishga tushiradi." },
      { title: "Natija profilga tushadi", text: "Har o'quvchining ballari uning profilida saqlanib boradi." },
      { title: "Hamma ko'radi", text: "O'qituvchi va rahbar natijani ko'radi, ota-ona davomatni kuzatadi." },
    ],
  },
  benefits: {
    question: "LMS qismi markazga nima beradi?",
    items: [
      { title: "Bilim darsning o'zida tekshiriladi", text: "Mavzu oxirida jonli quiz: kim tushungan, kim qiynalayotgani darhol ko'rinadi." },
      { title: "O'quvchi qiziqib qatnaydi", text: "Reyting va musobaqa darsni o'yinga aylantiradi, zerikish kamayadi." },
      { title: "Natija yo'qolmaydi", text: "Quiz ballari qog'ozda emas, o'quvchi profilida davomat va to'lovlar bilan birga turadi." },
      { title: "Ikkita tizim shart emas", text: "Hisob uchun bitta, o'quv jarayoni uchun boshqa dastur sotib olish va o'rganish kerak emas." },
    ],
  },
  compare: {
    question: "Faqat CRM'dan nimasi farq qiladi?",
    beforeLabel: "Faqat CRM bilan",
    rows: [
      ["O'quvchi haqida ma'lumot", "To'lov va davomat bor, o'qishi haqida ma'lumot yo'q", "Quiz natijalari ham shu profilda"],
      ["Darsni qiziqarli qilish", "Alohida xizmat yoki og'zaki so'rov", "Jonli quiz tizimning o'zida"],
      ["Ketishi mumkin bo'lganlarni sezish", "Faqat davomat yoki qarz orqali", "Davomat va quiz faolligi birga ko'rinadi"],
      ["Xodimlar uchun", "Hisob va o'quv jarayoni uchun ikki xil dastur", "Bitta tizim, bitta login"],
    ],
  },
  related: {
    title: "LMS qismi batafsil",
    text: (
      <p>
        Darsda quiz qanday o&apos;tishi haqida{" "}
        <Link href="/features/live-quiz" className={TEXT_LINK}>jonli quiz</Link>{" "}sahifasida, o&apos;quvchi profili
        haqida{" "}
        <Link href="/features/students" className={TEXT_LINK}>o&apos;quvchilar bazasi</Link>{" "}sahifasida, ota-onaning
        kuzatuvi haqida esa{" "}
        <Link href="/features/parents" className={TEXT_LINK}>ota-onalar uchun</Link>{" "}sahifasida yozdik.
      </p>
    ),
  },
  faqs: [
    { q: "O'quv markazi uchun LMS kerakmi yoki CRM yetarlimi?", a: "CRM o'quvchilar, to'lov va lidlarni hisoblaydi, LMS esa o'quv jarayonini qo'llab-quvvatlaydi. Darslinker'da ikkalasi bitta tizimda, shuning uchun alohida LMS platformasi sotib olish shart emas." },
    { q: "CRM va LMS farqi nima?", a: "CRM markazning boshqaruvi uchun: o'quvchilar ro'yxati, davomat, to'lov, qarzdorlik, lidlar. LMS o'quv jarayoni uchun: darsdagi topshiriqlar, bilimni tekshirish va natijalar. Darslinker ikkalasini birlashtiradi." },
    { q: "Darslinker'ning LMS qismida nimalar bor?", a: "Darsda jonli quiz (PIN bilan qo'shilish, vaqt, ballar, jonli reyting), quiz natijalarining o'quvchi profilida saqlanishi va ota-onaning farzandi davomati va to'lovlarini kuzatishi." },
    { q: "O'quvchilarga ilova o'rnatish kerakmi?", a: "Yo'q. O'quvchilar quizga telefon brauzeridan PIN orqali qo'shiladi." },
    { q: "LMS qismi qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi va faqat o'quvchilar, filiallar va xodimlar soni bilan farq qiladi.` },
  ],
  cta: {
    title: "Hisob va o'quv jarayoni bitta tizimda",
    text: "14 kun bepul sinov, karta kerak emas. Jonli quizni sinov davomida o'z darsingizda sinab ko'rasiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
