import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { SecurityPreview } from "@/components/crm/feature-previews";
import { PLANS } from "@/lib/crm-content";

// /features/security — "o'quv markazi CRM ma'lumotlar xavfsizligi" (docs/crm-pages-keywords.md).
// Egasi tasdiqlagan (2026-10-24): har kuni zaxira nusxa; ulanish HTTPS (darslinker.app'da tekshirildi);
// kirish telefon raqami va parol bilan; markaz o'z ma'lumotini istalgan payt yuklab oladi; Darslinker xodimlari
// ma'lumotga faqat support uchun va markaz ruxsati bilan kiradi. PRODUCT.md: har markaz ma'lumoti ajratilgan, rollar.
// Yozilmaydi: server joylashuvi, saqlashdagi shifrlash, ikki bosqichli kirish, sertifikatlar.

const c: FeaturePageContent = {
  path: "/features/security",
  ref: "feature-security",
  parent: FEATURES_CRUMB,
  crumb: "Xavfsizlik",
  metaTitle: "Xavfsiz CRM va LMS: o'quv markazi ma'lumotlari himoyasi — Darslinker",
  metaDescription:
    "Xavfsiz CRM va LMS: Darslinker'da har kuni zaxira nusxa olinadi, ulanish shifrlangan, har markaz ma'lumoti alohida. Ma'lumotni istalgan payt yuklab olasiz.",
  keywords: ["xavfsiz CRM", "xavfsiz LMS", "CRM ma'lumotlar xavfsizligi", "o'quv markazi ma'lumotlarini himoya qilish", "CRM zaxira nusxa", "ma'lumotlarni eksport qilish"],
  title: "O'quv markazi uchun xavfsiz CRM va LMS",
  lead: "O'quvchilar, to'lovlar, quiz natijalari va ota-onalar haqidagi ma'lumot markaz uchun eng qimmatli narsa. Darslinker'da undan har kuni zaxira nusxa olinadi, ulanish shifrlangan, har markazning ma'lumoti alohida saqlanadi va uni istalgan payt yuklab olishingiz mumkin.",
  Preview: SecurityPreview,
  summary: [
    "Ma'lumotlardan har kuni zaxira nusxa olinadi.",
    "Tizimga ulanish shifrlangan (HTTPS), kirish telefon raqami va parol bilan.",
    "Har markazning ma'lumoti boshqa markazlardan ajratilgan, xodimlar faqat o'z bo'limini ko'radi.",
    "Markaz o'z ma'lumotini istalgan payt yuklab oladi. Darslinker xodimlari unga faqat markaz ruxsati bilan kiradi.",
  ],
  how: {
    question: "O'quv markazi CRM'ida ma'lumotlar xavfsizmi?",
    answer:
      "Darslinker'da ma'lumotlar bir necha qatlam bilan himoyalangan. Har kuni zaxira nusxa olinadi, shuning uchun ma'lumot yo'qolib qolmaydi. Tizimga ulanish shifrlangan, kirish telefon raqami va parol bilan. Har markazning ma'lumoti alohida, xodimlar esa faqat o'z roliga tegishli bo'limni ko'radi.",
    steps: [
      { title: "Har kuni zaxira", text: "Ma'lumotlardan har kuni zaxira nusxa olinadi." },
      { title: "Himoyalangan kirish", text: "Ulanish shifrlangan, har xodim telefon raqami va paroli bilan kiradi." },
      { title: "Nazorat sizda", text: "Kim nimani ko'rishini rollar belgilaydi, ma'lumotni istalgan payt yuklab olasiz." },
    ],
  },
  benefits: {
    question: "Bu himoyalar markazga nima beradi?",
    items: [
      { title: "Ma'lumot yo'qolmaydi", text: "Kunlik zaxira nusxa tufayli o'quvchilar, to'lovlar va davomat tarixi saqlanib qoladi." },
      { title: "Begona ko'zdan himoya", text: "Har markazning ma'lumoti alohida. Boshqa markaz ham, tasodifiy odam ham uni ko'ra olmaydi." },
      { title: "Xodim faqat o'z ishini ko'radi", text: "O'qituvchi o'z guruhlarini, kassir to'lovlarni ko'radi. Hamma narsani faqat rahbar ko'radi." },
      { title: "Ma'lumot sizniki", text: "Uni istalgan payt yuklab olasiz. Darslinker xodimlari ma'lumotga faqat support uchun va sizning ruxsatingiz bilan kiradi." },
    ],
  },
  compare: {
    question: "Daftar yoki Excel'dan nimasi xavfsizroq?",
    rows: [
      ["Yo'qolish xavfi", "Daftar yo'qoladi, fayl o'chib ketadi yoki kompyuter buziladi", "Har kuni zaxira nusxa olinadi"],
      ["Kim ko'radi", "Faylni ochgan har kim hammasini ko'radi", "Har xodim faqat o'z bo'limini ko'radi"],
      ["Ulashish", "Fayl Telegram yoki fleshka orqali tarqaladi", "Ma'lumot tizimda qoladi, kirish parol bilan"],
    ],
  },
  related: {
    title: "Rollar va boshqaruv",
    text: (
      <p>
        Xodimlar uchun rollar va kim nimani ko&apos;rishi haqida{" "}
        <Link href="/features/customization" className={TEXT_LINK}>markazga moslash</Link>{" "}sahifasida yozdik.
        Ma&apos;lumotni ko&apos;chirish va tizimni sozlashda{" "}
        <Link href="/features/support" className={TEXT_LINK}>support</Link>{" "}yordam beradi.
      </p>
    ),
  },
  faqs: [
    { q: "O'quv markazi CRM'ida o'quvchilar ma'lumoti xavfsizmi?", a: "Darslinker'da ma'lumotlardan har kuni zaxira nusxa olinadi, tizimga ulanish shifrlangan (HTTPS), kirish telefon raqami va parol bilan. Har markazning ma'lumoti boshqa markazlardan ajratilgan." },
    { q: "Qaysi CRM va LMS xavfsiz, nimaga qarash kerak?", a: "Xavfsiz tizimda ma'lumotdan muntazam zaxira nusxa olinadi, ulanish shifrlangan bo'ladi, har xodim o'z paroli bilan kiradi va faqat o'z bo'limini ko'radi. Ma'lumotni istalgan payt yuklab olish imkoni ham bo'lishi kerak. Darslinker'da bularning barchasi bor: zaxira nusxa har kuni olinadi." },
    { q: "Ma'lumotlardan zaxira nusxa olinadimi?", a: "Ha, har kuni. Shuning uchun ma'lumot tasodifan yo'qolib qolmaydi." },
    { q: "Ma'lumotimni yuklab ola olamanmi?", a: "Ha. Markaz o'z ma'lumotini istalgan payt yuklab oladi. Ma'lumot markazniki." },
    { q: "Darslinker xodimlari ma'lumotimizni ko'radimi?", a: "Faqat support uchun va markazning ruxsati bilan. Masalan, ma'lumotni ko'chirish yoki muammoni hal qilishda." },
    { q: "Tizimga qanday kiriladi?", a: "Har xodim uchun telefon raqamiga akkaunt ochiladi, u parol bilan kiradi. Har xodim faqat o'z roliga tegishli bo'limlarni ko'radi." },
    { q: "Bu himoyalar qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi.` },
  ],
  cta: {
    title: "Ma'lumotlaringizni ishonchli joyda saqlang",
    text: "14 kun bepul sinov, karta kerak emas. Mavjud ro'yxatni ko'chirishda yordam beramiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
