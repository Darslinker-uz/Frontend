import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { PaymentsPreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /features/payments — "o'quv markazida to'lov va qarzdorlik hisobi" (docs/crm-pages-keywords.md).
// To'lov usullari: naqd, karta, o'tkazma — qo'lda kiritiladi, chek bilan. Onlayn to'lov (Click/Payme) yo'q — yozilmaydi.

const c: FeaturePageContent = {
  path: "/features/payments",
  ref: "feature-payments",
  parent: FEATURES_CRUMB,
  crumb: "To'lov va qarzdorlik",
  metaTitle: "O'quv markazida to'lov va qarzdorlik hisobi — Darslinker",
  metaDescription:
    "O'quv markazida to'lov va qarzdorlik hisobi: to'lov chek bilan qayd etiladi, qarz o'zi hisoblanadi, qarzdorlar ro'yxati doim tayyor.",
  keywords: ["o'quv markazida to'lov hisobi", "qarzdorlik nazorati", "o'quvchilar to'lovi nazorati", "o'quv markazi qarzdorlar ro'yxati", "kurs to'lovlarini hisoblash"],
  title: "O'quv markazida to'lov va qarzdorlik hisobi",
  lead: "Darslinker o'quv markazida to'lov hisobini soddalashtiradi: kim qancha to'lagani, kimning qarzi borligi va kimga eslatish kerakligi bir joyda ko'rinadi. To'lov chek bilan qayd etiladi, qarz esa o'zi hisoblanadi.",
  Preview: PaymentsPreview,
  how: {
    question: "O'quv markazidagi qarzdorlikni qanday nazorat qilish mumkin?",
    answer:
      "Darslinker'da har o'quvchi uchun to'lov rejasi oylik yoki modul bo'yicha belgilanadi va qarz avtomatik hisoblanadi. To'lov qabul qilinganda administrator uni chek bilan kiritadi. Natijada qarzdorlar ro'yxati qo'lda tuzilmaydi, u doim tayyor turadi.",
    steps: [
      { title: "To'lov rejasi belgilanadi", text: "O'quvchi guruhga qo'shilganda to'lov oylik yoki modul bo'yicha belgilanadi." },
      { title: "Qarz o'zi hisoblanadi", text: "To'lov muddati kelganda qarz avtomatik paydo bo'ladi, hech narsani qo'lda sanash kerak emas." },
      { title: "To'lov chek bilan kiritiladi", text: "Naqd, karta yoki o'tkazma orqali to'lov qabul qilinadi va chek chiqadi." },
    ],
  },
  summary: [
    "To'lov naqd, karta yoki o'tkazma orqali qabul qilinadi va chek bilan qayd etiladi.",
    "To'lov rejasi oylik yoki modul bo'yicha belgilanadi, qarz avtomatik hisoblanadi.",
    "Qarzdorlar ro'yxati doim tayyor, ota-onaga qarzdorlik va to'lov haqida Telegram xabar boradi.",
    "Dashboard'da qarzdorlar soni va shu oy to'laganlar alohida ko'rinadi.",
  ],
  compare: {
    question: "Daftar yoki Excel'dan nimasi farq qiladi?",
    rows: [
      ["Qarzdorlarni topish", "Har oy jadvalni qo'lda tekshirib, sanab chiqish kerak", "Qarzdorlar ro'yxati o'zi tuziladi"],
      ["Qarzni hisoblash", "Kim qaysi oy uchun to'lagani qo'lda solishtiriladi", "To'lov rejasi asosida qarz avtomatik paydo bo'ladi"],
      ["To'lov tasdig'i", "Chek yo'q yoki qog'ozda, keyin topish qiyin", "Har to'lovga chek, o'quvchi profilida saqlanadi"],
      ["Ota-onaga eslatma", "Administrator har biriga qo'ng'iroq qiladi", "Qarzdorlik va to'lov haqida Telegram xabar o'zi boradi"],
    ],
  },
  benefits: {
    question: "To'lov hisobini tizimda yuritish nima beradi?",
    items: [
      { title: "Qarzdorlar ro'yxati doim tayyor", text: "Kim qancha qarzdorligini bilish uchun daftar yoki Excel varaqlarini titkilash shart emas." },
      { title: "Har to'lovga chek", text: "Har bir to'lov chek bilan qayd etiladi: kim, qachon, qancha va qaysi usulda to'lagani saqlanadi." },
      { title: "Ota-onaga xabar", text: "Qarzdorlik paydo bo'lsa yoki to'lov qabul qilinsa, ota-onaga Telegram orqali xabar boradi." },
      { title: "Rahbar uchun aniq raqamlar", text: "Dashboard'da qarzdorlar soni va shu oy to'laganlar alohida ko'rinadi." },
    ],
  },
  related: {
    title: "To'lov o'quvchi tarixi bilan birga",
    text: (
      <p>
        Har o&apos;quvchining to&apos;lovlari uning profilida{" "}<Link href="/features/attendance" className={TEXT_LINK}>davomati</Link>{" "}bilan birga
        turadi. Ota-onaga to&apos;lov va qarzdorlik xabarlari qanday borishini{" "}
        <Link href="/features/parents" className={TEXT_LINK}>ota-onalar uchun</Link>{" "}sahifasida, umumiy moliyaviy holatni esa{" "}
        <Link href="/features/reports" className={TEXT_LINK}>hisobotlarda</Link>{" "}ko&apos;rasiz.
      </p>
    ),
  },
  faqs: [
    { q: "Qanday to'lov usullari qayd etiladi?", a: "Naqd pul, karta va bank o'tkazmasi. To'lovni administrator qabul qilib, tizimga chek bilan kiritadi." },
    { q: "O'quv markazida to'lov va qarzdorlikni avtomatik hisoblaydigan dastur bormi?", a: "Ha, Darslinker'da to'lov rejasi oylik yoki modul bo'yicha belgilanadi va qarz avtomatik hisoblanadi. To'lov chek bilan qayd etiladi, qarzdorlar ro'yxati esa doim tayyor turadi." },
    { q: "Ota-ona to'lov haqida xabar oladimi?", a: "Ha. To'lov qabul qilinganda tasdiq, qarzdorlik paydo bo'lganda eslatma Telegram orqali boradi. Xabar matnini markaz o'zi o'zgartira oladi." },
    { q: "Qarzdorlar ro'yxatini qanday ko'raman?", a: "Qarzdorlar ro'yxati tizimda doim tayyor turadi, uni qo'lda tuzish shart emas. Dashboard'da esa qarzdorlar soni alohida ko'rsatkich sifatida ko'rinadi." },
    { q: "To'lovlarni kim kiritadi?", a: "Odatda administrator yoki kassir. Har xodim faqat o'z roliga tegishli bo'limlarni ko'radi." },
    { q: "Bu imkoniyat qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi, 14 kun bepul sinab ko'rish mumkin.` },
  ],
  cta: {
    title: "Qarzdorlikni vaqtida ko'ring",
    text: "14 kun bepul sinov, karta kerak emas. O'quvchilar ro'yxatini Excel'dan ko'chirib, to'lovlarni birinchi kundan tizimda yuritasiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
