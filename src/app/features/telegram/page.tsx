import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { MiniAppPreview } from "@/components/crm/feature-previews";
import { PLANS } from "@/lib/crm-content";

// /features/telegram — "o'quv markazi uchun Telegram bot" + Telegram mini ilova (docs/crm-pages-keywords.md).
// Egasi tasdiqlagan (2026-10-24): Darslinker'dan Telegram ichida, mobil ilova sifatida foydalanish mumkin;
// ota-ona farzandini kuzatadi. Mini ilova ichidagi aniq bo'limlar va boshqa foydalanuvchilar (o'quvchi,
// xodim) hali tasdiqlanmagan — yozilmaydi. Ota-onaga xabarlar alohida sahifada: /features/parents.

const c: FeaturePageContent = {
  path: "/features/telegram",
  ref: "feature-telegram",
  parent: FEATURES_CRUMB,
  crumb: "Telegram mini ilova",
  metaTitle: "O'quv markazi uchun Telegram bot va mini ilova — Darslinker",
  metaDescription:
    "Darslinker'dan Telegram ichida, mobil ilova sifatida foydalaning: App Store yoki Play Market'dan hech narsa o'rnatish shart emas.",
  keywords: ["o'quv markazi uchun Telegram bot", "Telegram mini app CRM", "o'quv markazi Telegram integratsiyasi", "Telegram orqali boshqariladigan CRM"],
  title: "O'quv markazi uchun Telegram bot va mini ilova",
  lead: "Darslinker'dan Telegram ichida, mobil ilova sifatida foydalanish mumkin. Telegram ko'pchilikning telefonida allaqachon bor, shuning uchun alohida ilova yuklab olish va uni o'rganish shart emas.",
  Preview: MiniAppPreview,
  summary: [
    "Darslinker Telegram ichida mini ilova sifatida ochiladi, alohida ilova o'rnatish shart emas.",
    "Ota-ona Telegram orqali farzandining davomati va to'lovlarini kuzatadi va avtomatik xabarlar oladi.",
    "Kompyuterda esa tizim oddiy brauzerda ishlaydi.",
    "Android'da ham, iPhone'da ham, Telegram bor joyda ishlaydi.",
  ],
  how: {
    question: "Telegram mini ilova nima va u qanday ishlaydi?",
    answer:
      "Telegram mini ilova Telegram'ning o'zida ochiladigan dastur. Foydalanuvchi markaz botini ochadi va Darslinker'dan to'g'ridan-to'g'ri Telegram'da foydalanadi: App Store yoki Play Market'dan hech narsa yuklab olish shart emas. Xabarlar ham, ilova ham bitta joyda, Telegram'da.",
    steps: [
      { title: "Botni ochadi", text: "Foydalanuvchi markaz botini Telegram'da ochadi." },
      { title: "Ilova Telegram ichida ochiladi", text: "Darslinker alohida o'rnatmasdan, Telegram oynasining o'zida ishlaydi." },
      { title: "Xabarlar shu yerga keladi", text: "Muhim xabarlar ham o'sha Telegram chatiga keladi." },
    ],
  },
  benefits: {
    question: "Telegram ichida ishlash nima beradi?",
    items: [
      { title: "Ilova o'rnatish shart emas", text: "Telefonda joy egallamaydi, yangilanishlarni kutish va o'rnatish kerak emas." },
      { title: "Hammaga tanish", text: "Telegram'dan hamma foydalanadi, yangi ilovani o'rganish shart emas. Ayniqsa ota-onalar uchun qulay." },
      { title: "Xabar va ilova bir joyda", text: "Ota-ona xabarni oladi va kerak bo'lsa, shu yerning o'zida batafsil ko'radi." },
      { title: "Har qanday telefonda", text: "Android'da ham, iPhone'da ham, Telegram bor joyda ishlaydi." },
    ],
  },
  compare: {
    question: "Alohida mobil ilovadan nimasi farq qiladi?",
    beforeLabel: "Alohida mobil ilova",
    rows: [
      ["Boshlash", "App Store yoki Play Market'dan yuklab olish, ro'yxatdan o'tish", "Markaz botini Telegram'da ochish kifoya"],
      ["Telefon xotirasi", "Ilova joy egallaydi", "Telegram ichida ishlaydi"],
      ["O'rganish", "Yangi ilova interfeysiga ko'nikish kerak", "Tanish Telegram ichida"],
      ["Xabarlar", "Ilovaning o'z bildirishnomalari, ular ko'pincha o'chirib qo'yiladi", "Odatiy Telegram chatiga keladi"],
    ],
  },
  related: {
    title: "Ota-onalar uchun",
    text: (
      <p>
        Ota-onaga avtomatik xabarlar (darsga kelmadi, qarzdorlik, to&apos;lov tasdig&apos;i) va farzandni kuzatish haqida{" "}
        <Link href="/features/parents" className={TEXT_LINK}>ota-onalar uchun</Link>{" "}sahifasida yozdik. Kompyuterda tizim oddiy brauzerda ishlaydi, bu
        haqda{" "}<Link href="/features/easy-to-use" className={TEXT_LINK}>oson boshqaruv</Link>{" "}sahifasida.
      </p>
    ),
  },
  faqs: [
    { q: "Darslinker'ning mobil ilovasi bormi?", a: "Darslinker'dan Telegram ichida, mini ilova sifatida foydalanish mumkin. Alohida ilova yuklab olish shart emas." },
    { q: "Telegram mini ilova nima?", a: "Telegram ichida ochiladigan ilova. U Telegram oynasining o'zida ishlaydi, App Store yoki Play Market'dan o'rnatish kerak emas." },
    { q: "Ota-onalar Telegram orqali nima qiladi?", a: "Farzandining davomati va to'lovlarini kuzatadi va muhim holatlar haqida avtomatik xabar oladi." },
    { q: "Kompyuterda ishlasa bo'ladimi?", a: "Ha. Kompyuterda Darslinker oddiy brauzerda ishlaydi." },
    { q: "Bu imkoniyat qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi, 14 kun bepul sinab ko'rish mumkin.` },
  ],
  cta: {
    title: "Markazingizni Telegram'ga olib kiring",
    text: "14 kun bepul sinov, karta kerak emas. Ota-onalar alohida ilova o'rnatmasdan, Telegram'ning o'zida foydalanadi.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
