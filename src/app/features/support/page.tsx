import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { SupportPreview } from "@/components/crm/feature-previews";
import { PLANS } from "@/lib/crm-content";

// /features/support — "o'quv markazi CRM o'rnatish va sozlash" + do'stona support (docs/crm-pages-keywords.md).
// Egasi tasdiqlagan (2026-10-24): o'rnatish vaziyatga qarab (onlayn uchrashuv, Telegram yoki markazga borib);
// har bir tarifda to'liq sozlab beriladi; o'rgatish — onlayn meeting, video, Telegram; support haftaning 7 kuni
// 10:00–20:00; yangi imkoniyat so'rovi hamma tarifda — avval ko'rib chiqiladi, tasdiqlansa tez qo'shiladi.
// Muddat (kun/soat) va'da qilinmaydi.

const c: FeaturePageContent = {
  path: "/features/support",
  ref: "feature-support",
  parent: FEATURES_CRUMB,
  crumb: "Support va sozlash",
  metaTitle: "CRM o'rnatish, sozlash va do'stona support — Darslinker",
  metaDescription:
    "Darslinker'ni birgalikda o'rnatamiz va har bir tarifda to'liq sozlab beramiz, xodimlarni o'rgatamiz. Support haftaning 7 kuni, 10:00–20:00.",
  keywords: ["o'quv markazi CRM o'rnatish va sozlash", "CRM'ni sozlab berish", "supporti yaxshi CRM", "kerakli funksiyani qo'shib beradigan CRM", "do'stona support"],
  title: "O'quv markazi CRM'ini o'rnatish, sozlash va do'stona support",
  lead: "Darslinker'da o'quv markazlari tizim bilan yolg'iz qolmaydi: uni birgalikda o'rnatamiz, har bir tarifda to'liq sozlab beramiz va xodimlaringizni o'rgatamiz. Savol tug'ilsa, support haftaning 7 kuni, 10:00 dan 20:00 gacha javob beradi.",
  Preview: SupportPreview,
  summary: [
    "Tizimni birgalikda o'rnatamiz: onlayn uchrashuvda, Telegram orqali yoki kerak bo'lsa markazingizga borib.",
    "Har bir tarifda to'liq sozlab beramiz: ro'yxatni ko'chirish, guruhlar, jadval, rollar, xabar matnlari.",
    "Xodimlarni onlayn uchrashuv, video darslar va Telegram orqali o'rgatamiz.",
    "Support haftaning 7 kuni, 10:00–20:00. Kerakli imkoniyat so'rovini ko'rib chiqib, tez qo'shamiz.",
  ],
  how: {
    question: "Darslinker'ni o'rnatish va sozlash qanday o'tadi?",
    answer:
      "Vaziyatga qarab tizimni onlayn uchrashuvda, Telegram orqali yoki markazingizga borib birgalikda o'rnatamiz. Har bir tarifda uni to'liq sozlab beramiz: o'quvchilar ro'yxatini ko'chiramiz, guruhlar, jadval, xodimlar rollari va ota-onaga xabar matnlarini sozlaymiz. Keyin xodimlaringizni o'rgatamiz va ish boshlanadi.",
    steps: [
      { title: "Birgalikda o'rnatamiz", text: "Onlayn uchrashuvda, Telegram orqali yoki markazga borib, sizga qulay usulda." },
      { title: "To'liq sozlab beramiz", text: "Ro'yxatni ko'chiramiz, guruhlar, jadval, rollar va xabar matnlarini sozlaymiz." },
      { title: "Xodimlarni o'rgatamiz", text: "Onlayn uchrashuvda, video darslar bilan va Telegram orqali." },
    ],
  },
  benefits: {
    question: "Darslinker support'i markazga nima beradi?",
    items: [
      { title: "Har bir tarifda to'liq sozlash", text: "Eng kichik tarifda ham tizimni sizning o'rningizga sozlab beramiz, alohida xizmat sotib olish shart emas." },
      { title: "O'rgatish uch xil usulda", text: "Onlayn uchrashuv, qayta ko'rish mumkin bo'lgan video darslar va Telegram orqali savol-javob." },
      { title: "Haftaning 7 kuni javob", text: "Support har kuni 10:00 dan 20:00 gacha ishlaydi, dam olish kunlari ham." },
      { title: "Kerakli imkoniyat qo'shiladi", text: "So'rovingizni ko'rib chiqamiz: platformaga to'g'ri kelsa, tasdiqlanadi va cho'zmasdan qo'shiladi." },
    ],
  },
  compare: {
    question: "Tizimni o'zingiz yolg'iz o'rnatishdan nimasi farq qiladi?",
    beforeLabel: "O'zingiz yolg'iz",
    rows: [
      ["Boshlash", "Qo'llanmalarni o'qib, hammasini o'zingiz sozlaysiz", "Birgalikda o'rnatamiz va to'liq sozlab beramiz"],
      ["Mavjud ma'lumot", "Har bir o'quvchini qo'lda kiritasiz", "Ro'yxatni Excel'dan ko'chirib beramiz"],
      ["Xodimlarni o'rgatish", "O'zingiz tushuntirasiz", "Onlayn uchrashuv, video va Telegram orqali o'rgatamiz"],
      ["Savol tug'ilsa", "Javobni o'zingiz qidirasiz", "Support haftaning 7 kuni, 10:00–20:00"],
      ["Kerakli funksiya", "Bori bilan ishlashga majbursiz", "So'rov ko'rib chiqiladi va tasdiqlansa tez qo'shiladi"],
    ],
  },
  related: {
    title: "Support, qulaylik va moslash",
    text: (
      <p>
        Tizimning o&apos;zi ham o&apos;rganishga oson, bu haqda{" "}<Link href="/features/easy-to-use" className={TEXT_LINK}>oson boshqaruv</Link>{" "}sahifasida.
        Logotip, ranglar va xabar matnlarini sozlash haqida{" "}<Link href="/features/customization" className={TEXT_LINK}>markazga moslash</Link>{" "}
        sahifasida. Sozlash va support barcha{" "}<Link href="/pricing" className={TEXT_LINK}>tariflarga</Link>{" "}kiradi.
      </p>
    ),
  },
  faqs: [
    { q: "O'quv markazi CRM'ini o'rnatib va sozlab beradigan kompaniya bormi?", a: "Ha, Darslinker jamoasi buni qiladi: tizimni birgalikda o'rnatamiz va har bir tarifda to'liq sozlab beramiz: o'quvchilar ro'yxatini ko'chiramiz, guruhlar, jadval, rollar va ota-onaga xabar matnlarini sozlaymiz, keyin xodimlarni o'rgatamiz." },
    { q: "O'rnatish qanday o'tadi: onlayn yoki markazga kelasizmi?", a: "Vaziyatga qarab: onlayn uchrashuvda, Telegram orqali yoki kerak bo'lsa markazingizga borib o'rnatamiz." },
    { q: "Sozlash uchun alohida pul to'lash kerakmi?", a: `Yo'q. To'liq sozlash har bir tarifga kiradi. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi.` },
    { q: "Xodimlarni qanday o'rgatasiz?", a: "Uch xil usulda: onlayn uchrashuv belgilab o'rgatamiz, video darslar yuboramiz va Telegram orqali savollarga javob beramiz." },
    { q: "Support qachon ishlaydi?", a: "Haftaning 7 kuni, 10:00 dan 20:00 gacha. Telegram orqali yozasiz: @Darslinker_Support." },
    { q: "Bizga kerakli funksiyani qo'shib bera olasizmi?", a: "Ha, so'rov barcha tariflarda qabul qilinadi. Har bir so'rovni avval ko'rib chiqamiz: u platformaga qanchalik to'g'ri kelishini baholaymiz. Tasdiqlansa, imkoniyat cho'zmasdan qo'shiladi." },
    { q: "Bu xizmatlar qaysi tarifda bor?", a: "Barcha tariflarda: o'rnatish, to'liq sozlash, o'rgatish va support har bir tarifga kiradi." },
  ],
  cta: {
    title: "Markazingizni birga ishga tushiramiz",
    text: "14 kun bepul sinov, karta kerak emas. Ariza qoldiring, o'rnatish va sozlashni birgalikda boshlaymiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
