import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { ImportPreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /features/easy-to-use — "o'quv markazi uchun oson CRM" + Excel'dan o'tish (docs/crm-pages-keywords.md).
// Interfeys tili tasdiqlanmagan — "to'liq o'zbek tilida" deb yozilmaydi.

const c: FeaturePageContent = {
  path: "/features/easy-to-use",
  ref: "feature-easy-to-use",
  parent: FEATURES_CRUMB,
  crumb: "Oson boshqaruv",
  metaTitle: "O'quv markazi uchun oson CRM: Excel'dan o'tish — Darslinker",
  metaDescription:
    "Qulay interfeysli, oson boshqariladigan CRM: har xodim faqat o'z bo'limini ko'radi, telefondan ishlaydi, ro'yxat Excel'dan ko'chiriladi.",
  keywords: ["o'quv markazi uchun oson CRM", "qulay interfeysli CRM", "oson boshqariladigan CRM", "oddiy o'quv markazi boshqaruv dasturi", "Excel'dan CRM'ga o'tish", "o'quvchilar ro'yxatini Excel'dan yuklash"],
  eyebrow: "Imkoniyat · Oson boshqaruv",
  title: "O'quv markazi uchun oson CRM",
  lead: "Darslinker — O'zbekistondagi o'quv markazlari uchun qulay interfeysli, oson boshqariladigan CRM va LMS. Har xodim faqat o'ziga kerakli bo'limni ko'radi, tizim telefondan ham ishlaydi, o'quvchilar ro'yxati esa Excel'dan bir martada ko'chiriladi.",
  Preview: ImportPreview,
  how: {
    question: "Excel'dagi o'quvchilar bazasini CRM'ga qanday ko'chirish mumkin?",
    answer:
      "Mavjud o'quvchilar ro'yxatini Excel faylidan Darslinker'ga yuklaysiz. Har bir o'quvchini qaytadan qo'lda kiritish shart emas. Ko'chirishda qiynalsangiz, jamoamiz yordam beradi. Ro'yxat tizimga tushgach, davomat va to'lovlarni birinchi kundan yuritasiz.",
    steps: [
      { title: "Excel faylni yuklaysiz", text: "Hozirgi o'quvchilar ro'yxati tizimga bir martada ko'chiriladi." },
      { title: "Xodimlarni qo'shasiz", text: "Administrator, o'qituvchi va kassirga kirish beriladi, har biri o'z bo'limini ko'radi." },
      { title: "Ishni boshlaysiz", text: "Davomat, to'lov va lidlarni o'sha kundan tizimda yuritasiz." },
    ],
  },
  summary: [
    "Har xodim faqat o'z roliga tegishli bo'limlarni ko'radi: o'qituvchi, administrator, kassir, rahbar.",
    "Tizim brauzerda ishlaydi, telefonda esa Telegram ichida mini ilova sifatida ham ochiladi.",
    "O'quvchilar ro'yxati Excel'dan ko'chiriladi, kerak bo'lsa yordam beramiz.",
    "14 kun bepul sinov, karta talab qilinmaydi. Savollar uchun Telegram orqali support bor.",
  ],
  compare: {
    question: "Daftar yoki Excel'dan o'tish qanchalik oson?",
    rows: [
      ["Boshlash", "Har bir yangi oy uchun jadval yoki daftar qaytadan tayyorlanadi", "Ro'yxat bir marta Excel'dan ko'chiriladi va ish boshlanadi"],
      ["Kim nimani ko'radi", "Hamma bitta faylni ochadi, tasodifan o'chirib yuborish mumkin", "Har xodim faqat o'z bo'limini ko'radi"],
      ["Telefondan ishlash", "Excel telefonda noqulay", "Brauzerda yoki Telegram mini ilovada qulay ishlaydi"],
      ["Yordam", "Muammoni o'zingiz hal qilasiz", "Telegram orqali support yordam beradi"],
    ],
  },
  benefits: {
    question: "Nega Darslinker'ni o'rganish oson?",
    items: [
      { title: "Har kim faqat o'z bo'limini ko'radi", text: "O'qituvchi davomat va guruhlarini, kassir to'lovlarni ko'radi. Ortiqcha menyular chalg'itmaydi." },
      { title: "Telefondan ishlaydi", text: "Tizim brauzerda ochiladi. O'qituvchi davomatni darsda telefondan belgilaydi, ilova o'rnatish shart emas." },
      { title: "Excel'dan tez o'tish", text: "Daftar yoki Excel'da yuritilgan ro'yxatni qaytadan yozish kerak emas, u fayldan ko'chiriladi." },
      { title: "Yordam yonida", text: "Savol tug'ilsa, Telegram orqali support'ga yozasiz va ishni to'xtatmay davom etasiz." },
    ],
  },
  related: {
    title: "Oson, lekin markazingizga mos",
    text: (
      <p>
        Darslinker&apos;ni markazingizga moslash ham oson: logotip, dashboard ranglari va ota-onaga xabar
        matnlari —{" "}
        <Link href="/features/customization" className={TEXT_LINK}>markazga moslash</Link>{" "}sahifasida.
        Rollar bo&apos;yicha kim nimani ko&apos;rishi ham shu yerda tushuntirilgan. Telefonda ishlash —{" "}
        <Link href="/features/telegram" className={TEXT_LINK}>Telegram mini ilova</Link>{" "}sahifasida.
      </p>
    ),
  },
  faqs: [
    { q: "Xodimlar CRM'ni qancha vaqtda o'rganadi?", a: "Har xodim faqat o'ziga tegishli bo'limlarni ko'radi, shuning uchun o'rganadigan narsa kam. O'qituvchi uchun asosiy ish — davomat belgilash va quiz o'tkazish." },
    { q: "Excel'dagi o'quvchilar ro'yxatini CRM'ga ko'chirib, xodimlarga tez o'rgatish mumkinmi?", a: "Ha. Darslinker'da ro'yxat Excel faylidan bir martada ko'chiriladi, kerak bo'lsa yordam beramiz. Xodimlar tez o'rganadi, chunki har biri faqat o'z roliga tegishli bo'limlarni ko'radi." },
    { q: "Kompyuter shartmi?", a: "Yo'q. Tizim brauzerda ishlaydi: kompyuterdan ham, telefondan ham foydalanish mumkin." },
    { q: "Telefon uchun ilova bormi?", a: "Alohida ilova yuklab olish shart emas: tizim telefon brauzerida ishlaydi va Telegram ichida mini ilova sifatida ham ochiladi." },
    { q: "Muammo bo'lsa kimga murojaat qilaman?", a: "Telegram orqali support'ga yozasiz: @Darslinker_Support." },
    { q: "Sinab ko'rsa bo'ladimi?", a: `Ha. Istalgan tarifni 14 kun bepul sinab ko'rish mumkin, karta talab qilinmaydi. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi.` },
  ],
  cta: {
    title: "Daftar va Excel'dan bir kunda o'ting",
    text: "14 kun bepul sinov, karta kerak emas. Ro'yxatni ko'chiramiz, siz esa birinchi kundan tizimda ishlaysiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
