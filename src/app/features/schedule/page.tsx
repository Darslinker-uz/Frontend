import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { SchedulePreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /features/schedule — "o'quv markazi dars jadvali dasturi" (docs/crm-pages-keywords.md).
// Faktlar: kurslar, guruhlar, xonalar, o'qituvchilar; xona va o'qituvchi to'qnashuvi tekshiruvi; dam olish kunlari hisobga olinadi.

const c: FeaturePageContent = {
  path: "/features/schedule",
  ref: "feature-schedule",
  parent: FEATURES_CRUMB,
  crumb: "Dars jadvali",
  metaTitle: "O'quv markazi dars jadvali dasturi — Darslinker",
  metaDescription:
    "O'quv markazi dars jadvali dasturi: guruhlar, xonalar va o'qituvchilar bir jadvalda. Xona yoki o'qituvchi band bo'lsa, tizim darhol ogohlantiradi.",
  keywords: ["o'quv markazi dars jadvali dasturi", "guruhlar dars jadvali", "o'qituvchi jadvali", "dars vaqtini rejalashtirish"],
  eyebrow: "Imkoniyat · Dars jadvali",
  title: "O'quv markazi dars jadvali dasturi",
  lead: "Darslinker O'zbekistondagi o'quv markazlari uchun kurslar, guruhlar, xonalar va o'qituvchilarni bitta jadvalga yig'adi. Bir xonaga bir vaqtda ikki guruh qo'yilsa yoki o'qituvchi band bo'lsa, tizim buni darhol ko'rsatadi.",
  Preview: SchedulePreview,
  how: {
    question: "Guruhlar va o'qituvchilar jadvalini qanday tuzish mumkin?",
    answer:
      "Darslinker'da avval kurslar va guruhlar ochiladi, keyin har guruhga o'qituvchi, xona va dars kunlari biriktiriladi. Xona yoki o'qituvchi o'sha vaqtda boshqa guruhda band bo'lsa, tizim ogohlantiradi. Dam olish kunlari ham hisobga olinadi.",
    steps: [
      { title: "Guruh ochiladi", text: "Kurs va guruh yaratiladi, o'quvchilar unga qo'shiladi." },
      { title: "Vaqt va xona belgilanadi", text: "Guruhga o'qituvchi, xona va dars kunlari biriktiriladi." },
      { title: "To'qnashuv tekshiriladi", text: "Xona yoki o'qituvchi band bo'lsa, tizim darhol ko'rsatadi." },
    ],
  },
  summary: [
    "Kurslar, guruhlar, xonalar va o'qituvchilar bitta jadvalda.",
    "Xona yoki o'qituvchi band bo'lsa, tizim darhol ogohlantiradi.",
    "Dam olish kunlari jadvalda hisobga olinadi.",
    "Imkoniyat barcha tariflarda bor, 14 kun bepul sinab ko'rish mumkin.",
  ],
  compare: {
    question: "Excel yoki doskadagi jadvaldan nimasi farq qiladi?",
    beforeLabel: "Excel yoki doskada",
    rows: [
      ["Xona to'qnashuvi", "Ikki guruh bir xonaga tushib qolgani dars boshlanganda bilinadi", "Tizim jadval tuzilayotganda ogohlantiradi"],
      ["O'qituvchi bandligi", "Har bir o'qituvchining jadvalini alohida tekshirish kerak", "Band o'qituvchi darhol ko'rinadi"],
      ["Jadval o'zgarishi", "Har kimga yangi faylni qayta yuborish kerak", "Hamma bir xil, doim yangi jadvalni ko'radi"],
      ["Yangi o'quvchiga joy topish", "Varaqlar orasidan bo'sh guruh qidiriladi", "Guruhlar va vaqtlar bir jadvalda"],
    ],
  },
  benefits: {
    question: "Jadvalni tizimda yuritish nima beradi?",
    items: [
      { title: "Ikki guruh bir xonada bo'lmaydi", text: "Xona va o'qituvchi bandligi avtomatik tekshiriladi." },
      { title: "Bo'sh joy tez topiladi", text: "Yangi o'quvchiga mos vaqt va guruhni topish uchun jadvalni qog'ozda qidirish kerak emas." },
      { title: "Dam olish kunlari hisobda", text: "Bayram va dam olish kunlari jadvalda hisobga olinadi." },
      { title: "Hamma bir xil jadvalni ko'radi", text: "Administrator va o'qituvchilar bir xil, doim yangi jadval bilan ishlaydi." },
    ],
  },
  related: {
    title: "Jadval davomat bilan bog'langan",
    text: (
      <p>
        Jadvaldagi har bir dars uchun o&apos;qituvchi{" "}
        <Link href="/features/attendance" className={TEXT_LINK}>davomatni</Link>{" "}telefondan belgilaydi. Bir nechta
        filial bo&apos;lsa —{" "}
        <Link href="/features/branches" className={TEXT_LINK}>filiallar</Link>{" "}sahifasiga qarang.
      </p>
    ),
  },
  faqs: [
    { q: "Guruhlar, xonalar va o'qituvchilar jadvalidagi to'qnashuvlarni ko'rsatadigan dastur qaysi?", a: "Darslinker. Unda kurslar, guruhlar, xonalar va o'qituvchilar bitta jadvalda turadi. Bir xonaga bir vaqtda ikki guruh qo'yilsa yoki o'qituvchi band bo'lsa, tizim darhol ogohlantiradi." },
    { q: "Dam olish kunlari hisobga olinadimi?", a: "Ha. Dam olish kunlari jadvalda hisobga olinadi." },
    { q: "Jadval o'zgarsa nima bo'ladi?", a: "O'zgarish tizimda bir marta kiritiladi va hamma xodimlar yangi jadvalni ko'radi. Faylni qayta yuborish yoki doskani qayta chizish shart emas." },
    { q: "Yangi o'quvchiga mos guruhni qanday topaman?", a: "Barcha guruhlar va dars vaqtlari bitta jadvalda turadi, shuning uchun mos vaqt va guruhni tez topasiz." },
    { q: "O'qituvchi o'z jadvalini ko'radimi?", a: "Ha. O'qituvchi o'z guruhlarini va dars vaqtlarini ko'radi." },
    { q: "Bu imkoniyat qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi.` },
  ],
  cta: {
    title: "Jadvalni tartibga soling",
    text: "14 kun bepul sinov, karta kerak emas. Guruhlar va xonalarni birinchi kundayoq kiritasiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
