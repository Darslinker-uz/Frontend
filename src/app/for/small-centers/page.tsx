import Link from "next/link";
import { FeaturePage, FOR_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { ImportPreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /for/small-centers — "kichik o'quv markazi uchun CRM" (docs/crm-pages-keywords.md).
// Asosiy dalil: Minimal tarif (narx PLANS'dan), barcha imkoniyatlar har tarifda, Excel'dan o'tish, 14 kun sinov.

const MIN = PLANS[0];

const c: FeaturePageContent = {
  path: "/for/small-centers",
  ref: "for-small-centers",
  parent: FOR_CRUMB,
  crumb: "Kichik markazlar",
  metaTitle: "Kichik o'quv markazi uchun CRM — Darslinker",
  metaDescription: `Kichik o'quv markazi uchun CRM: oyiga ${MIN.price} so'm, 100 tagacha o'quvchi, barcha imkoniyatlar bilan. Excel'dan o'tishda yordam beramiz.`,
  keywords: ["kichik o'quv markazi uchun CRM", "yangi o'quv markazi boshqaruv dasturi", "kichik markaz uchun arzon CRM", "sodda CRM o'quv markazi"],
  title: "Kichik o'quv markazi uchun CRM",
  lead: `Kichik va yangi ochilgan o'quv markazlarida ham davomat, to'lov va qarzdorlik tartibli bo'lishi kerak. Darslinker'ning Minimal tarifi oyiga ${MIN.price} so'm va unda barcha imkoniyatlar bor.`,
  Preview: ImportPreview,
  how: {
    question: "Kichik o'quv markaziga qaysi boshqaruv tizimi mos?",
    answer: `Kichik markazga sodda, tez o'rganiladigan va narxi o'quvchilar soniga mos tizim kerak. Darslinker'ning Minimal tarifi oyiga ${MIN.price} so'm: 100 tagacha o'quvchi, 1 filial va 3 xodim. Imkoniyatlar katta tariflardagi bilan bir xil: davomat, to'lov, ota-onaga Telegram xabar, jonli quiz, lidlar.`,
    steps: [
      { title: "Ro'yxatni ko'chirasiz", text: "Daftar yoki Excel'dagi o'quvchilar ro'yxati tizimga yuklanadi." },
      { title: "Tez boshlaysiz", text: "Ro'yxatni ko'chirishda yordam beramiz, keyin davomat va to'lovlarni tizimda yuritasiz." },
      { title: "O'sgan sari kengayasiz", text: "O'quvchilar ko'paysa, kattaroq tarifga o'tasiz yoki faqat ortiqcha o'quvchilar uchun to'laysiz." },
    ],
  },
  summary: [
    `Minimal tarif: oyiga ${MIN.price} so'm, 100 tagacha o'quvchi, 1 filial, 3 xodim.`,
    "Kichik tarifda ham barcha imkoniyatlar bor: davomat, to'lov, ota-onaga xabar, jonli quiz, lidlar.",
    "O'quvchilar ro'yxati daftar yoki Excel'dan ko'chiriladi, bunda yordam beramiz.",
    "100 tadan oshsa, har 10 o'quvchiga oyiga +20 000 so'm qo'shiladi.",
  ],
  compare: {
    question: "Daftar yoki Excel bilan davom etishdan nimasi farq qiladi?",
    rows: [
      ["Vaqt", "Har oy jadvallar va qarzlarni qo'lda tekshirish", "Davomat va qarz o'zi hisoblanadi"],
      ["Ota-onaga xabar", "Har biriga qo'ng'iroq yoki yozish", "Telegram orqali avtomatik"],
      ["O'sganda", "Varaqlar ko'payib, chalkashlik ortadi", "O'quvchilar ko'paysa, tizim bilan birga o'sadi"],
      ["Xarajat", "Bepul, lekin vaqt va yo'qolgan to'lovlar hisobiga", `Oyiga ${MIN.price} so'm, barcha imkoniyatlar bilan`],
    ],
  },
  benefits: {
    question: "Kichik markaz uchun Darslinker nima beradi?",
    items: [
      { title: "Narx hajmga mos", text: `Minimal tarif oyiga ${MIN.price} so'm, 100 tagacha o'quvchi uchun. Keraksiz hajm uchun to'lamaysiz.` },
      { title: "Imkoniyatlar cheklanmaydi", text: "Kichik tarifda ham barcha imkoniyatlar bor, hech biri yopiq emas." },
      { title: "O'rganish oson", text: "Har xodim faqat o'z bo'limini ko'radi, tizim telefondan ham ishlaydi." },
      { title: "Sinab ko'rib tanlaysiz", text: "14 kun bepul sinov, karta talab qilinmaydi." },
    ],
  },
  related: {
    title: "O'sish uchun joy bor",
    text: (
      <p>
        O&apos;quvchilar 100 tadan oshsa, tarifni darhol almashtirish shart emas: har 10 ta ortiqcha o&apos;quvchi
        uchun oyiga 20 000 so&apos;m qo&apos;shiladi. Batafsil:{" "}<Link href="/pricing" className={TEXT_LINK}>tariflar va narxlar</Link>. Tizimga qanday tez
        o&apos;tilishi haqida{" "}<Link href="/features/easy-to-use" className={TEXT_LINK}>oson boshqaruv</Link>{" "}sahifasida.
      </p>
    ),
  },
  faqs: [
    { q: "Kichik markaz uchun CRM qancha turadi?", a: `Minimal tarif oyiga ${MIN.price} so'm: ${MIN.features[0]}, ${MIN.features[1]}. 6 oyga to'lasangiz 10%, 12 oyga to'lasangiz 20% chegirma.` },
    { q: "Kichik tarifda imkoniyatlar cheklanganmi?", a: "Yo'q. Barcha imkoniyatlar har bir tarifda bor. Tariflar faqat o'quvchilar, filiallar va xodimlar soni bilan farq qiladi." },
    { q: "Endi ochilgan markazga ham mos keladimi?", a: "Ha. Hali o'quvchilar kam bo'lsa ham, boshidanoq davomat va to'lovlarni tartibli yuritish keyinchalik ko'p vaqtni tejaydi." },
    { q: "100 tagacha o'quvchisi bor kichik markaz uchun sodda va hamyonbop CRM qaysi?", a: `Darslinker'ning Minimal tarifi: oyiga ${MIN.price} so'm, 100 tagacha o'quvchi. Hamyonbop tarif bo'lsa ham barcha imkoniyatlar bor, tizim esa sodda: har xodim faqat o'z bo'limini ko'radi.` },
    { q: "Bepul tarif bormi?", a: "Bepul tarif yo'q, lekin istalgan tarifni 14 kun bepul sinab ko'rish mumkin." },
  ],
  cta: {
    title: "Kichik markazni katta tartib bilan boshqaring",
    text: "14 kun bepul sinov, karta kerak emas. Ro'yxatni birga ko'chiramiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
