import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { QuizPreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /features/live-quiz — "o'quv markazi uchun jonli quiz" (docs/crm-pages-keywords.md).
// AI quiz, XP va uy vazifasi hali tayyor emas — yozilmaydi.

const c: FeaturePageContent = {
  path: "/features/live-quiz",
  ref: "feature-live-quiz",
  parent: FEATURES_CRUMB,
  crumb: "Jonli quiz",
  metaTitle: "O'quv markazi uchun jonli quiz va gamifikatsiya — Darslinker",
  metaDescription:
    "O'quv markazi uchun jonli quiz: o'quvchilar PIN bilan telefondan qo'shiladi, vaqt ichida javob beradi, reyting jonli yangilanadi. Natijalar saqlanadi.",
  keywords: ["o'quv markazi uchun jonli quiz", "dars uchun online quiz", "darsda viktorina o'tkazish", "gamifikatsiya ta'limda", "o'quvchilar bilimini tekshirish testi"],
  title: "O'quv markazi uchun jonli quiz",
  lead: "Darslinker'da darsni o'yinga aylantirish oson: o'qituvchi quizni boshlaydi, o'quvchilar telefondan qo'shilib, savollarga vaqt ichida javob beradi, reyting esa jonli yangilanadi.",
  Preview: QuizPreview,
  how: {
    question: "Jonli quiz qanday ishlaydi?",
    answer:
      "O'qituvchi quizni markaz panelida yaratadi va darsda o'yinni boshlaydi. O'quvchilar PIN kod orqali telefondan qo'shiladi va har savolga belgilangan vaqt ichida javob beradi. Taymer va ballar serverda hisoblanadi, reyting esa hammaning ko'z oldida jonli yangilanadi.",
    steps: [
      { title: "O'qituvchi quiz tuzadi", text: "Savollar markaz panelida tayyorlanadi va kerakli darsda ishga tushiriladi." },
      { title: "O'quvchilar PIN bilan kiradi", text: "Har kim o'z telefonidan PIN kodni kiritib o'yinga qo'shiladi." },
      { title: "Reyting jonli yangilanadi", text: "To'g'ri javoblar uchun ball beriladi, reyting ekranda ko'rinadi. Natijalar o'quvchi profilida saqlanadi." },
    ],
  },
  summary: [
    "O'qituvchi quizni markaz panelida tuzadi va darsda ishga tushiradi.",
    "O'quvchilar PIN kod bilan telefondan qo'shiladi, ilova o'rnatish shart emas.",
    "Vaqt va ballar avtomatik hisoblanadi, reyting jonli yangilanadi.",
    "Natijalar o'quvchi profilida davomat va to'lovlar bilan birga saqlanadi.",
  ],
  compare: {
    question: "Og'zaki so'rov yoki qog'oz testdan nimasi farq qiladi?",
    beforeLabel: "Og'zaki so'rov yoki qog'oz test",
    rows: [
      ["Kim qatnashadi", "Odatda faqat qo'l ko'targan bir-ikki o'quvchi", "Har bir o'quvchi o'z telefonidan javob beradi"],
      ["Natijani bilish", "Qog'ozlarni yig'ib, keyin tekshirish kerak", "Ballar darhol hisoblanadi, reyting ekranda"],
      ["O'quvchi qiziqishi", "Ko'pchilik uchun zerikarli", "Musobaqa shaklida, vaqt va reyting bilan"],
      ["Natija saqlanishi", "Qog'oz yo'qoladi yoki daftarda qoladi", "O'quvchi profilida davomat va to'lovlar bilan birga"],
    ],
  },
  benefits: {
    question: "Jonli quiz o'quvchilar faolligiga qanday yordam beradi?",
    items: [
      { title: "Dars zerikarli bo'lmaydi", text: "Savol-javob o'yin shaklida o'tadi, o'quvchilar bir-biri bilan musobaqalashadi." },
      { title: "Bilim darhol tekshiriladi", text: "O'qituvchi mavzu qanchalik tushunilganini dars davomida ko'radi." },
      { title: "Natija saqlanadi", text: "Quiz natijalari o'quvchi profilida davomat va to'lovlar bilan birga turadi." },
      { title: "Ilova shart emas", text: "O'quvchilar telefon brauzeridan PIN orqali qo'shiladi, hech narsa o'rnatish kerak emas." },
    ],
  },
  related: {
    title: "O'quvchini markazda ushlab qolish",
    text: (
      <p>
        Qiziqarli dars o&apos;quvchini markazda ushlab qolishga yordam beradi.{" "}
        <Link href="/features/attendance" className={TEXT_LINK}>Davomat</Link>{" "}esa kim dars qoldira
        boshlaganini erta ko&apos;rsatadi. Ikkalasi birga ishlaydi: o&apos;quvchi qiziqib qatnaydi, siz esa
        uning holatini vaqtida bilasiz. Quiz Darslinker&apos;ning{" "}
        <Link href="/features/lms" className={TEXT_LINK}>LMS qismi</Link>{" "}hisoblanadi.
      </p>
    ),
  },
  faqs: [
    { q: "O'quvchilar telefondan PIN bilan qo'shiladigan jonli quizni darsda qanday o'tkazish mumkin?", a: "Darslinker'da o'qituvchi quizni markaz panelida tuzadi va darsda ishga tushiradi. O'quvchilar PIN kod bilan telefondan qo'shiladi, savollarga vaqt ichida javob beradi, reyting esa jonli yangilanadi. Natijalar o'quvchi profilida saqlanadi." },
    { q: "O'quvchilarga ilova o'rnatish kerakmi?", a: "Yo'q. O'quvchilar telefon brauzerida PIN kodni kiritib o'yinga qo'shiladi." },
    { q: "Quizni kim tuzadi?", a: "O'qituvchi o'zi, markaz panelida. Savollarni darsga moslab tayyorlaydi." },
    { q: "Kahoot kabi alohida xizmatdan nimasi farq qiladi?", a: "Darslinker'da jonli quiz markaz tizimining o'zida ishlaydi: alohida xizmatda hisob ochish shart emas, natijalar esa o'quvchi profilida davomat va to'lovlar bilan birga saqlanadi." },
    { q: "Ta'limda gamifikatsiya nima?", a: "Bu o'qishga o'yin elementlarini qo'shish: ball, reyting va musobaqa. Darslinker'da gamifikatsiya jonli quiz orqali ishlaydi: o'quvchilar ball to'playdi va reytingda o'z o'rnini ko'radi." },
    { q: "Natijalar qayerda saqlanadi?", a: "Har o'quvchining quiz natijalari uning profilida saqlanadi va o'qituvchi hamda rahbar ko'ra oladi." },
    { q: "Ballar qanday hisoblanadi?", a: "Taymer va ballar serverda hisoblanadi: javob vaqt ichida va to'g'ri berilsa ball qo'shiladi, reyting jonli yangilanadi." },
    { q: "Jonli quiz qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi, 14 kun bepul sinab ko'rish mumkin.` },
  ],
  cta: {
    title: "Keyingi darsni o'yinga aylantiring",
    text: "14 kun bepul sinov, karta kerak emas. Birinchi quizni sinov davomida darsda o'tkazib ko'ring.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
