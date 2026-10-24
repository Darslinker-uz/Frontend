import Link from "next/link";
import { FeaturePage, FOR_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { TelegramPreview } from "@/components/crm/feature-previews";
import { PLANS } from "@/lib/crm-content";

// /for/kids-centers — "bolalar o'quv markazi uchun CRM" (docs/crm-pages-keywords.md).
// Asosiy urg'u: ota-ona bilan aloqa (Telegram), bitta raqamga bir nechta farzand, davomat, jonli quiz.

const c: FeaturePageContent = {
  path: "/for/kids-centers",
  ref: "for-kids-centers",
  parent: FOR_CRUMB,
  crumb: "Bolalar markazlari",
  metaTitle: "Bolalar o'quv markazi uchun CRM — Darslinker",
  metaDescription:
    "Bolalar o'quv markazi uchun CRM: ota-ona farzandining davomati va to'lovini kuzatadi, kelmasa Telegram'da darhol xabar oladi.",
  keywords: ["bolalar o'quv markazi uchun CRM", "bolalar markazi davomat dasturi", "ota-onalarga avtomatik xabar", "bolalar kurslari o'quvchilari hisobi"],
  title: "Bolalar o'quv markazi uchun CRM",
  lead: "Bolalar o'quv markazlarida asosiy mijoz ota-ona. U farzandi darsga kelganini, to'lov qabul qilinganini bilishni istaydi. Darslinker bu xabarlarni Telegram orqali o'zi yuboradi, ota-ona esa farzandining davomati va to'lovlarini kuzatib boradi.",
  Preview: TelegramPreview,
  how: {
    question: "Bolalar markazida ota-onalarni davomatdan qanday xabardor qilish mumkin?",
    answer:
      "Darslinker'da o'qituvchi davomatni darsda telefondan belgilaydi. Farzand darsga kelmagan deb belgilansa, ota-onasiga darhol Telegram orqali xabar boradi. Qarzdorlik paydo bo'lganda va to'lov qabul qilinganda ham ota-ona avtomatik xabar oladi.",
    steps: [
      { title: "Davomat belgilanadi", text: "O'qituvchi dars boshida kelganlarni telefondan belgilaydi." },
      { title: "Ota-ona xabar oladi", text: "Farzand kelmasa, ota-onasiga Telegram xabar o'zi boradi." },
      { title: "To'lov ham shaffof", text: "To'lov qabul qilinganda tasdiq, qarz paydo bo'lganda eslatma boradi." },
    ],
  },
  summary: [
    "Farzandi darsga kelmasa, ota-onaga darhol Telegram xabar boradi.",
    "Ota-ona farzandining davomati va to'lovlarini o'zi kuzatib boradi.",
    "Bitta telefon raqamiga bir nechta farzand bog'lanadi.",
    "Darsda jonli quiz bolalarga musobaqa kabi yoqadi.",
  ],
  compare: {
    question: "Telefon qo'ng'iroqlari va daftardan nimasi farq qiladi?",
    beforeLabel: "Qo'ng'iroq va daftar bilan",
    rows: [
      ["Bola darsga kelmasa", "Administrator ota-onaga qo'ng'iroq qiladi yoki umuman xabar bermaydi", "Ota-ona Telegram'da darhol xabar oladi"],
      ["To'lov", "Ota-ona qancha to'laganini so'rab qo'ng'iroq qiladi", "To'lov tasdig'i keladi, tarixni o'zi ko'radi"],
      ["Bir oiladan bir nechta bola", "Har biri alohida yoziladi", "Bitta raqamga bir nechta farzand"],
      ["Xabar ohangi", "Har safar har xil yoziladi", "Markaz matnni bir marta iliq uslubda sozlaydi"],
    ],
  },
  benefits: {
    question: "Bolalar markazi uchun Darslinker nima beradi?",
    items: [
      { title: "Ota-ona xotirjam", text: "Farzandi darsda bo'lmasa, ota-ona buni markaz qo'ng'iroq qilmasdan biladi." },
      { title: "Bir oiladan bir nechta farzand", text: "Bitta telefon raqamiga bir nechta farzand bog'lanadi, xabarlar bitta joyga keladi." },
      { title: "Dars o'yin shaklida", text: "Jonli quiz bolalarga musobaqa kabi yoqadi: reyting jonli yangilanadi." },
      { title: "Xabar matni sizning uslubingizda", text: "Ota-onaga boradigan xabarlarni markaz o'zi, iliq va tushunarli qilib yozadi." },
    ],
  },
  related: {
    title: "Bolalar markazi uchun asosiy imkoniyatlar",
    text: (
      <p>
        <Link href="/features/parents" className={TEXT_LINK}>Ota-onaga xabar va nazorat</Link>,{" "}
        <Link href="/features/attendance" className={TEXT_LINK}>davomat</Link>,{" "}
        <Link href="/features/live-quiz" className={TEXT_LINK}>jonli quiz</Link>{" "}va{" "}
        <Link href="/features/customization" className={TEXT_LINK}>xabar matnlarini moslash</Link>{" "}haqida alohida
        sahifalarda yozdik.
      </p>
    ),
  },
  faqs: [
    { q: "Farzandi darsga kelmaganda yoki to'lov qilinganda ota-onaga Telegram'dan avtomatik xabar yuborish mumkinmi?", a: "Ha, Darslinker buni o'zi qiladi: farzandi darsga kelmasa, qarzdorlik paydo bo'lsa yoki to'lov qabul qilinsa, ota-onaga Telegram orqali avtomatik xabar boradi. Xabar matnini markaz o'zi sozlaydi." },
    { q: "Bir oiladan ikki-uch farzand o'qisa-chi?", a: "Bitta telefon raqamiga bir nechta farzand bog'lanadi. Ota-ona har bir farzandi haqidagi xabarni shu raqam orqali oladi." },
    { q: "Xabarlar uchun SMS to'lovi bormi?", a: "Yo'q. Xabarlar Telegram orqali boradi, ular uchun alohida pul to'lanmaydi." },
    { q: "Mental arifmetika yoki boshqa bolalar kurslari uchun mosmi?", a: "Ha. Darslinker har qanday bolalar kursi uchun guruh, jadval, davomat va to'lovni yuritadi, ota-onalar bilan aloqani esa avtomatlashtiradi." },
    { q: "Ota-ona farzandini qanday kuzatadi?", a: "Ota-ona farzandining davomati va to'lovlarini o'zi ko'radi, muhim holatlarda esa Telegram orqali avtomatik xabar oladi." },
    { q: "Bolalar markazi uchun qaysi tarif mos?", a: `O'quvchilar soniga qarab: 100 tagachasiga Minimal (${PLANS[0].price} so'm/oy), 250 tagachasiga Standart tarifi mos. Barcha imkoniyatlar har bir tarifda bor.` },
  ],
  cta: {
    title: "Ota-onalar bilan aloqani avtomatlashtiring",
    text: "14 kun bepul sinov, karta kerak emas. Birinchi xabarlar davomat belgilangan kuniyoq boradi.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
