import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { CustomizationPreview } from "@/components/crm/feature-previews";
import { PLANS } from "@/lib/crm-content";

// /features/customization — "o'quv markazi uchun moslashuvchan CRM" (docs/crm-pages-keywords.md).
// Egasi tasdiqlagan (2026-10-23): logo va nom, dashboard ranglari, xabar matnlari, tayyor rollar,
// maxsus rollarni support qo'shib beradi (markaz o'zi yaratmaydi), o'z manzili markaz.darslinker.app.

const c: FeaturePageContent = {
  path: "/features/customization",
  ref: "feature-customization",
  parent: FEATURES_CRUMB,
  crumb: "Markazga moslash",
  metaTitle: "O'quv markazi uchun moslashuvchan CRM va LMS — Darslinker",
  metaDescription:
    "Darslinker'ni markazingizga moslang: logotip va nom, dashboard dizayni va ranglari, ota-onaga xabar matnlari va xodimlar uchun rollar.",
  keywords: ["o'quv markazi uchun moslashuvchan CRM", "dizaynini moslash mumkin bo'lgan CRM", "CRM'da logo va ranglarni sozlash", "xodimlar uchun rollar", "markazga mos boshqaruv tizimi"],
  eyebrow: "Imkoniyat · Markazga moslash",
  title: "O'quv markazi uchun moslashuvchan CRM",
  lead: "Darslinker O'zbekistondagi har bir o'quv markaziga o'z uslubida ishlash imkonini beradi: tizim markazingiz nomi va logotipi bilan ishlaydi, dashboard dizayni va ranglarini o'zingiz tanlaysiz, ota-onaga boradigan xabarlarni o'z uslubingizda yozasiz.",
  Preview: CustomizationPreview,
  how: {
    question: "CRM'ni o'quv markazining ish tartibiga moslash mumkinmi?",
    answer:
      "Ha. Har bir markaz Darslinker'da o'z logotipi va nomi bilan, o'z manzilida ishlaydi. Dashboard ranglarini markaz o'zi tanlaydi, ota-onaga yuboriladigan xabar matnlarini o'zgartiradi. Xodimlar uchun tayyor rollar bor, maxsus rol kerak bo'lsa, support qo'shib beradi.",
    steps: [
      { title: "Brendni qo'shasiz", text: "Markaz logotipi va nomi tizimda ko'rinadi." },
      { title: "Ranglarni tanlaysiz", text: "Dashboard'ni o'zingizga yoqqan rangga moslaysiz." },
      { title: "Xabarlarni yozasiz", text: "Ota-onaga boradigan xabar matnlarini o'z uslubingizda o'zgartirasiz." },
    ],
  },
  summary: [
    "Tizimda markazingiz logotipi va nomi ko'rinadi, har markaz o'z manzilida ishlaydi.",
    "Dashboard ranglarini markaz o'ziga yoqqan ko'rinishga moslaydi.",
    "Ota-onaga boradigan xabar matnlarini markaz o'zi o'zgartiradi.",
    "Tayyor rollar bor, maxsus rol kerak bo'lsa support qo'shib beradi. Barcha tariflarda.",
  ],
  compare: {
    question: "Tayyor shablon yoki Excel'dan nimasi farq qiladi?",
    beforeLabel: "Tayyor shablon yoki Excel'da",
    rows: [
      ["Brend", "Umumiy ko'rinish, markaz nomi yo'q", "Markaz logotipi va nomi bilan"],
      ["Ko'rinish", "Hamma uchun bir xil", "Dashboard ranglarini o'zingiz tanlaysiz"],
      ["Ota-onaga xabar", "Har safar qo'lda yoziladi", "Matn bir marta o'z uslubingizda sozlanadi"],
      ["Xodimlar huquqi", "Hamma bir faylni ko'radi", "Tayyor rollar, kerak bo'lsa maxsus rol"],
    ],
  },
  benefits: {
    question: "Darslinker'da nimalarni moslash mumkin?",
    items: [
      { title: "Logotip va nom", text: "Tizimda markazingiz nomi va logotipi turadi, xodimlar o'z markazi tizimida ishlaydi." },
      { title: "Dashboard ranglari", text: "Ranglarni markazingiz uslubiga yoki o'zingizga qulay ko'rinishga moslaysiz." },
      { title: "Ota-onaga xabar matnlari", text: "Darsga kelmadi, qarzdorlik va to'lov tasdig'i xabarlarini bemalol o'zgartirasiz." },
      { title: "Rollar", text: "Rahbar, administrator, o'qituvchi va kassir uchun tayyor rollar bor. Maxsus rol kerak bo'lsa, support qo'shib beradi." },
      { title: "O'z manzilingiz", text: "Har markaz o'z manzilida ishlaydi: markaz.darslinker.app." },
      { title: "Kerakli imkoniyat", text: "Markazingizga kerakli imkoniyat yo'qmi? Ayting — o'rganib, tizimga qo'shishga tayyormiz." },
    ],
  },
  related: {
    title: "Moslash oson, ishlatish undan ham oson",
    text: (
      <p>
        Sozlamalar bir marta qilinadi, keyin har kuni oddiy ishlaysiz. Xodimlar tizimni qanday tez
        o&apos;rganishi —{" "}
        <Link href="/features/easy-to-use" className={TEXT_LINK}>oson boshqaruv</Link>{" "}sahifasida, ota-onaga
        xabarlar qanday borishi —{" "}
        <Link href="/features/parents" className={TEXT_LINK}>ota-onalar uchun</Link>{" "}sahifasida.
      </p>
    ),
  },
  faqs: [
    { q: "O'quv markazi CRM'ida logotip, ranglar, ota-onaga xabar matnlari va xodimlar rollarini sozlash mumkinmi?", a: "Ha, Darslinker'da. Markaz logotipi va nomi tizimda ko'rinadi, dashboard ranglarini o'zingiz tanlaysiz, ota-onaga xabar matnlarini o'zgartirasiz. Rahbar, administrator, o'qituvchi va kassir uchun tayyor rollar bor, maxsus rolni support qo'shib beradi." },
    { q: "Tizimga markaz logotipini qo'ysa bo'ladimi?", a: "Ha. Markaz logotipi va nomi tizimda ko'rinadi." },
    { q: "Tizim dizaynini markazimizga moslasak bo'ladimi?", a: "Ha. Tizimda markazingiz logotipi va nomi ko'rinadi, dashboard ranglarini esa o'zingizga yoqqan ko'rinishga moslaysiz." },
    { q: "Dashboard rangini o'zgartirsa bo'ladimi?", a: "Ha. Dashboard ranglarini markaz o'ziga yoqqan rangga moslaydi." },
    { q: "Ota-onaga boradigan xabar matnini o'zgartirsa bo'ladimi?", a: "Ha. Har bir xabar matnini markaz o'z uslubida bemalol o'zgartira oladi." },
    { q: "O'zimizga kerakli rol yaratsa bo'ladimi?", a: "Tizimda rahbar, administrator, o'qituvchi va kassir uchun tayyor rollar bor. Boshqa rol kerak bo'lsa, support uni markazingiz uchun qo'shib beradi." },
    { q: "Bu imkoniyatlar qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi, 14 kun bepul sinab ko'rish mumkin.` },
  ],
  cta: {
    title: "Tizimni markazingizga moslang",
    text: "14 kun bepul sinov, karta kerak emas. Logotip, ranglar va xabarlarni birinchi kundayoq sozlaysiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
