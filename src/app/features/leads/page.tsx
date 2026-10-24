import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { LeadsPreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /features/leads — "o'quv markazi uchun lidlar va arizalar hisobi" (docs/crm-pages-keywords.md).
// Faktlar: Kanban doska, lidni bir bosishda o'quvchiga aylantirish, dashboard'da faol lid va sinovdan keyin ketganlar.
// Marketplace arizalari CRM'ga avtomatik tushishi tasdiqlanmagan (SPEC: 2-bosqich) — "marketplace orqali ariza keladi" deyiladi xolos.

const c: FeaturePageContent = {
  path: "/features/leads",
  ref: "feature-leads",
  parent: FEATURES_CRUMB,
  crumb: "Lidlar",
  metaTitle: "O'quv markazi uchun lidlar va arizalar hisobi — Darslinker",
  metaDescription:
    "O'quv markazi uchun lidlar hisobi: har ariza Kanban doskada, lid bir bosishda o'quvchiga aylanadi. Marketplace orqali yangi arizalar ham keladi.",
  keywords: ["o'quv markazi uchun lidlar hisobi", "kursga kelgan arizalarni boshqarish", "yangi o'quvchilarni jalb qilish", "kursga yozilish arizalari"],
  title: "O'quv markazi uchun lidlar va arizalar hisobi",
  lead: "Darslinker kursga kelgan arizalarni yo'qotmaslikka yordam beradi. Telefon, Telegram yoki Instagram orqali kelgan har bir murojaat Kanban doskaga kiritiladi: kim sinov darsiga keldi, kim o'ylab ko'ryapti, hammasi ko'z oldingizda.",
  Preview: LeadsPreview,
  how: {
    question: "Kursga kelgan arizalarni yo'qotmasdan qanday kuzatish mumkin?",
    answer:
      "Darslinker'da har bir ariza lid sifatida kiritiladi va Kanban doskada bosqichma-bosqich siljiydi: yangi, sinov darsi, o'quvchi. Lid kursga yozilganda u bir bosishda o'quvchiga aylanadi, ma'lumotlarni qaytadan kiritish kerak emas.",
    steps: [
      { title: "Ariza kiritiladi", text: "Qayerdan kelganidan qat'i nazar, har bir murojaat lid sifatida doskaga tushadi." },
      { title: "Bosqichlar bo'ylab siljiydi", text: "Yangi, sinov darsi va boshqa bosqichlar bo'yicha kim qayerda ekani ko'rinadi." },
      { title: "O'quvchiga aylanadi", text: "Kursga yozilgan lid bir bosishda o'quvchi bo'ladi." },
    ],
  },
  summary: [
    "Har bir ariza lid sifatida Kanban doskaga kiritiladi: yangi, sinov darsi, o'quvchi.",
    "Kursga yozilgan lid bir bosishda o'quvchiga aylanadi, ma'lumot qayta kiritilmaydi.",
    "Dashboard'da faol lidlar va sinovdan keyin ketganlar soni ko'rinadi.",
    "Darslinker marketplace orqali markazga yangi o'quvchilardan arizalar ham keladi.",
  ],
  compare: {
    question: "Daftar yoki chatdan nimasi farq qiladi?",
    beforeLabel: "Daftar yoki Telegram chatda",
    rows: [
      ["Arizani saqlash", "Chatlar orasida yo'qoladi yoki daftarda qoladi", "Har bir ariza doskada, bosqichi bilan"],
      ["Kim qayerda ekani", "Yodda tutish yoki qayta so'rash kerak", "Yangi, sinov darsi va o'quvchilar bir qarashda ko'rinadi"],
      ["O'quvchiga aylantirish", "Ism va raqam qaytadan yoziladi", "Bir bosishda, ma'lumotlar saqlanib qoladi"],
      ["Natijani o'lchash", "Nechta ariza o'quvchiga aylangani noma'lum", "Faol lidlar va sinovdan keyin ketganlar dashboard'da"],
    ],
  },
  benefits: {
    question: "Lidlarni tizimda yuritish nima beradi?",
    items: [
      { title: "Hech bir ariza unutilmaydi", text: "Murojaatlar chat va daftarlarda yo'qolib ketmaydi, hammasi bitta doskada." },
      { title: "Sinov darsi nazoratda", text: "Sinov darsiga kelganlar va undan keyin ketganlar alohida ko'rinadi." },
      { title: "Rahbar uchun raqamlar", text: "Dashboard'da faol lidlar soni va sinovdan keyin ketganlar ko'rinadi." },
      { title: "Yangi arizalar oqimi", text: "Darslinker marketplace'da kurs qidirayotgan o'quvchilar markazingizga to'g'ridan-to'g'ri ariza qoldiradi." },
    ],
  },
  related: {
    title: "Mavjud o'quvchilar va yangi arizalar bitta platformada",
    text: (
      <p>
        CRM odatda mavjud o&apos;quvchilarni boshqaradi. Darslinker&apos;da bunga qo&apos;shimcha ravishda{" "}
        <Link href="/marketplace" className={TEXT_LINK}>marketplace</Link>{" "}ham bor: o&apos;quvchilar u yerda
        kurslarni solishtirib, markazingizga ariza qoldiradi. Lid o&apos;quvchiga aylangach, uning ma&apos;lumotlari{" "}
        <Link href="/features/students" className={TEXT_LINK}>o&apos;quvchilar bazasida</Link>{" "}davom etadi.
      </p>
    ),
  },
  faqs: [
    { q: "Lid nima?", a: "Kursga qiziqib murojaat qilgan, lekin hali o'qishni boshlamagan odam. Masalan, narx so'ragan yoki sinov darsiga yozilgan kishi." },
    { q: "O'quv markaziga telefon, Telegram va Instagram'dan kelgan arizalarni yo'qotmay kuzatish uchun CRM bormi?", a: "Ha, Darslinker'da qayerdan kelganidan qat'i nazar, har bir ariza lid sifatida Kanban doskaga kiritiladi va bosqichma-bosqich kuzatiladi: yangi, sinov darsi, o'quvchi. Kursga yozilgan lid bir bosishda o'quvchiga aylanadi." },
    { q: "Lidni o'quvchiga aylantirish uchun ma'lumotni qaytadan kiritish kerakmi?", a: "Yo'q. Lid bir bosishda o'quvchiga aylanadi, kiritilgan ma'lumotlar saqlanib qoladi." },
    { q: "Sinov darsidan keyin ketganlarni qanday bilaman?", a: "Dashboard'da \"sinovdan keyin ketganlar\" alohida ko'rsatkich sifatida ko'rinadi. Shu orqali sinov darslari qanchalik natija berayotganini bilasiz." },
    { q: "Darslinker yangi o'quvchi topishga yordam beradimi?", a: "Ha. Darslinker marketplace'da o'quvchilar kurslarni solishtiradi va markazga to'g'ridan-to'g'ri ariza qoldiradi." },
    { q: "Bu imkoniyat qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi.` },
  ],
  cta: {
    title: "Har bir arizani o'quvchiga aylantiring",
    text: "14 kun bepul sinov, karta kerak emas. Lidlar doskasini o'z arizalaringiz bilan sinab ko'rasiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
