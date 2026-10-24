import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { TelegramPreview } from "@/components/crm/feature-previews";
import { PLANS } from "@/lib/crm-content";

// /features/parents — ota-onaga xabarlar va ota-onaning farzandini nazorat qilishi.
// Tasdiqlangan: Telegram xabarlari (kelmadi, qarzdorlik, to'lov tasdig'i), matnni markaz o'zgartiradi,
// bitta raqamga bir nechta farzand; ota-ona farzandini kuzatadi (egasi, 2026-10-24) — davomat va to'lov
// (PRODUCT.md "Ota-ona" roli). Baholar/uy vazifasi hali tayyor emas — yozilmaydi.

const c: FeaturePageContent = {
  path: "/features/parents",
  ref: "feature-parents",
  parent: FEATURES_CRUMB,
  crumb: "Ota-onalar uchun",
  metaTitle: "Ota-onaga xabar va farzandni nazorat qilish — Darslinker",
  metaDescription:
    "Ota-ona farzandining davomati va to'lovlarini kuzatadi, darsga kelmasa yoki qarz paydo bo'lsa Telegram orqali darhol xabar oladi. SMS kerak emas.",
  keywords: ["ota-onaga davomat xabari", "ota-ona farzandini nazorat qilish", "Telegram orqali to'lov eslatmasi", "ota-onalarga avtomatik xabar"],
  eyebrow: "Imkoniyat · Ota-onalar uchun",
  title: "Ota-onaga xabar va farzandni nazorat qilish",
  lead: "Darslinker O'zbekistondagi o'quv markazlarida ota-ona bilan aloqani avtomatlashtiradi. Ota-ona farzandining davomati va to'lovlarini kuzatib boradi, darsga kelmasa yoki qarz paydo bo'lsa, buni Telegram orqali darhol biladi.",
  Preview: TelegramPreview,
  summary: [
    "Ota-onaga uch holatda avtomatik xabar boradi: darsga kelmadi, qarzdorlik, to'lov tasdig'i.",
    "Ota-ona farzandining davomati va to'lovlarini o'zi kuzatib boradi.",
    "Xabarlar Telegram orqali boradi, SMS uchun alohida pul to'lanmaydi. Matnni markaz o'zi o'zgartiradi.",
    "Bitta telefon raqamiga bir nechta farzand bog'lanadi. Imkoniyat barcha tariflarda bor.",
  ],
  how: {
    question: "Ota-ona farzandining davomatini qanday biladi?",
    answer:
      "O'qituvchi darsda davomatni belgilaydi. Farzand kelmagan deb belgilansa, ota-onasiga darhol Telegram orqali xabar boradi. Qarzdorlik paydo bo'lganda va to'lov qabul qilinganda ham ota-ona avtomatik xabar oladi. Bundan tashqari ota-ona farzandining davomati va to'lovlarini o'zi kuzatib boradi.",
    steps: [
      { title: "Davomat belgilanadi", text: "O'qituvchi dars boshida kelganlarni telefondan belgilaydi." },
      { title: "Ota-ona xabar oladi", text: "Farzand kelmasa, qarz paydo bo'lsa yoki to'lov qabul qilinsa — Telegram'da xabar." },
      { title: "Ota-ona kuzatib boradi", text: "Farzandining davomati va to'lovlarini o'zi ko'radi, markazga qo'ng'iroq qilishi shart emas." },
    ],
  },
  benefits: {
    question: "Ota-ona bilan aloqani avtomatlashtirish nima beradi?",
    items: [
      { title: "Ota-ona xotirjam", text: "Farzandi darsda bo'lmasa, ota-ona buni markaz qo'ng'iroq qilmasdan biladi." },
      { title: "Administrator vaqti tejaladi", text: "Har bir ota-onaga qo'lda yozish yoki qo'ng'iroq qilish shart emas, xabar tizimdan o'zi ketadi." },
      { title: "To'lovlar shaffof", text: "To'lov qabul qilinganda tasdiq, qarz paydo bo'lganda eslatma boradi. Ota-ona qancha to'laganini biladi." },
      { title: "Bir oiladan bir nechta farzand", text: "Bitta raqamga bir nechta farzand bog'lanadi, ota-ona hamma xabarni bir joyda oladi." },
    ],
  },
  compare: {
    question: "SMS va qo'ng'iroqdan nimasi farq qiladi?",
    beforeLabel: "SMS yoki qo'ng'iroq bilan",
    rows: [
      ["Xabar narxi", "Har SMS uchun to'lov bor", "Telegram xabari uchun alohida pul to'lanmaydi"],
      ["Xodim vaqti", "Administrator har ota-onaga qo'lda yozadi yoki qo'ng'iroq qiladi", "Xabar tizimdan o'zi ketadi"],
      ["Farzandni kuzatish", "Ota-ona markazga qo'ng'iroq qilib so'raydi", "Ota-ona davomat va to'lovlarni o'zi ko'radi"],
      ["Xabar matni", "Har safar qaytadan yoziladi", "Markaz bir marta o'z uslubida sozlaydi"],
    ],
  },
  related: {
    title: "Xabarlar davomat va to'lovdan keladi",
    text: (
      <p>
        Xabarlar{" "}
        <Link href="/features/attendance" className={TEXT_LINK}>davomat</Link>{" "}va{" "}
        <Link href="/features/payments" className={TEXT_LINK}>to&apos;lov hisobi</Link>{" "}bilan bog&apos;langan.
        Ota-ona Darslinker&apos;ni Telegram ichida, alohida ilova o&apos;rnatmasdan ishlatishi haqida —{" "}
        <Link href="/features/telegram" className={TEXT_LINK}>Telegram mini ilova</Link>{" "}sahifasida. Xabar
        matnlarini sozlash —{" "}
        <Link href="/features/customization" className={TEXT_LINK}>markazga moslash</Link>{" "}sahifasida.
      </p>
    ),
  },
  faqs: [
    { q: "O'zbekistonda ota-onalarga Telegram orqali davomat va to'lov haqida xabar yuboradigan CRM bormi?", a: "Ha, Darslinker. Farzandi darsga kelmasa, qarzdorlik paydo bo'lsa yoki to'lov qabul qilinsa, ota-onaga Telegram orqali avtomatik xabar boradi. SMS kerak emas, xabar matnini markaz o'zi o'zgartiradi." },
    { q: "Ota-ona farzandini qanday nazorat qiladi?", a: "Ota-ona farzandining davomati va to'lovlarini o'zi kuzatib boradi, muhim holatlar haqida esa Telegram orqali avtomatik xabar oladi." },
    { q: "SMS'dan nimasi yaxshi?", a: "Telegram xabarlari uchun alohida pul to'lanmaydi. SMS'da esa har xabar uchun to'lov bor." },
    { q: "Xabar matnini o'zgartirsa bo'ladimi?", a: "Ha. Har bir xabar matnini markaz o'zi, o'z uslubiga moslab o'zgartira oladi." },
    { q: "Bir oiladan bir nechta farzand o'qisa-chi?", a: "Bitta telefon raqamiga bir nechta farzand bog'lanadi. Ota-ona har bir farzandi haqidagi xabarni shu raqam orqali oladi." },
    { q: "Bu imkoniyat qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi, 14 kun bepul sinab ko'rish mumkin.` },
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
