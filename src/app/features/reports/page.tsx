import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { DashboardPreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /features/reports — "o'quv markazi uchun hisobot va analitika" (docs/crm-pages-keywords.md).
// Faqat dashboard'dagi 8 ko'rsatkich (PRODUCT.md). Daromad/xarajat hisobotlari tasdiqlanmagan — yozilmaydi.

const METRICS = ["Faol lidlar", "Faol o'quvchilar", "Guruhlar", "Qarzdorlar", "Sinovdagi o'quvchilar", "Shu oy to'laganlar", "Guruhni tark etganlar", "Sinovdan keyin ketganlar"];

const c: FeaturePageContent = {
  path: "/features/reports",
  ref: "feature-reports",
  parent: FEATURES_CRUMB,
  crumb: "Hisobotlar",
  metaTitle: "O'quv markazi uchun hisobot va dashboard — Darslinker",
  metaDescription:
    "O'quv markazi uchun dashboard: faol o'quvchilar, lidlar, qarzdorlar, shu oy to'laganlar va ketayotganlar. 8 ta ko'rsatkich bitta ekranda.",
  keywords: ["o'quv markazi uchun hisobot", "o'quv markazi dashboard", "qarzdorlik hisoboti", "o'quv markazi analitika"],
  title: "O'quv markazi uchun hisobot va dashboard",
  lead: "Darslinker o'quv markazi rahbariga markaz holatini bitta ekranda ko'rsatadi: nechta o'quvchi faol, nechta lid bor, kim qarzdor va kim ketyapti. Raqamlarni hech kim qo'lda sanamaydi.",
  Preview: DashboardPreview,
  how: {
    question: "Rahbar o'quv markazi natijalarini qaysi hisobotlardan ko'ra oladi?",
    answer: `Darslinker dashboard'ida 8 ta asosiy ko'rsatkich bor: ${METRICS.join(", ").toLowerCase()}. Raqamlar davomat, to'lov va lidlar tizimga kiritilishi bilan o'zi yangilanadi, hech kim ularni qo'lda sanamaydi.`,
    steps: [
      { title: "Xodimlar ishlaydi", text: "Davomat, to'lov va lidlar har kuni tizimga kiritiladi." },
      { title: "Raqamlar o'zi hisoblanadi", text: "Dashboard ko'rsatkichlari kiritilgan ma'lumotdan avtomatik chiqadi." },
      { title: "Rahbar ko'radi", text: "Markaz holatini bir qarashda tushunadi va kerakli joyga e'tibor beradi." },
    ],
  },
  summary: [
    "Dashboard'da 8 ta asosiy ko'rsatkich bor: faol o'quvchilardan qarzdorlargacha.",
    "Raqamlar davomat, to'lov va lidlardan avtomatik hisoblanadi.",
    "Guruhni tark etganlar va sinovdan keyin ketganlar alohida ko'rinadi.",
    "Dashboard'ni markaz rahbari ko'radi, boshqa xodimlar faqat o'z bo'limini.",
  ],
  compare: {
    question: "Excel'dagi hisobotdan nimasi farq qiladi?",
    beforeLabel: "Excel'da",
    rows: [
      ["Hisobotni tayyorlash", "Oy oxirida jadvallarni yig'ib, qo'lda sanash kerak", "Raqamlar o'zi hisoblanadi, istalgan payt tayyor"],
      ["Qarzdorlar soni", "To'lovlar varag'idan alohida hisoblanadi", "Dashboard'da alohida ko'rsatkich"],
      ["Ketayotgan o'quvchilar", "Ko'pincha umuman hisoblanmaydi", "Guruhni tark etganlar va sinovdan keyin ketganlar alohida"],
      ["Xato ehtimoli", "Formula yoki nusxa ko'chirishda xato bo'lishi mumkin", "Kundalik ishdan to'g'ridan-to'g'ri olinadi"],
    ],
  },
  benefits: {
    question: "Dashboard rahbarga nima beradi?",
    items: [
      { title: "Qarzdorlar soni doim ko'rinadi", text: "Qancha o'quvchi qarzdor ekanini bilish uchun ro'yxat tuzish kerak emas." },
      { title: "Ketayotganlar erta seziladi", text: "Guruhni tark etganlar va sinovdan keyin ketganlar alohida ko'rsatkichda." },
      { title: "Sotuv holati aniq", text: "Faol lidlar va sinovdagi o'quvchilar soni yangi o'quvchilar oqimini ko'rsatadi." },
      { title: "Qo'lda hisob yo'q", text: "Raqamlar xodimlarning kundalik ishidan o'zi to'planadi." },
    ],
  },
  related: {
    title: "Raqamlar qayerdan keladi",
    text: (
      <p>
        Ko&apos;rsatkichlar{" "}
        <Link href="/features/students" className={TEXT_LINK}>o&apos;quvchilar bazasi</Link>,{" "}
        <Link href="/features/payments" className={TEXT_LINK}>to&apos;lov va qarzdorlik</Link>{" "}va{" "}
        <Link href="/features/leads" className={TEXT_LINK}>lidlar</Link>{" "}ma&apos;lumotlaridan hisoblanadi.
      </p>
    ),
  },
  faqs: [
    { q: "O'quvchilar, qarzdorlar va faol lidlar sonini bitta dashboard'da ko'rsatadigan tizim bormi?", a: "Ha, Darslinker dashboard'ida 8 ta ko'rsatkich bor: faol o'quvchilar, faol lidlar, guruhlar, qarzdorlar, sinovdagilar, shu oy to'laganlar, guruhni tark etganlar va sinovdan keyin ketganlar. Raqamlar avtomatik hisoblanadi." },
    { q: "Ko'rsatkichlar nimani bildiradi?", a: "Faol o'quvchilar hozir o'qiyotganlar. Faol lidlar hali o'quvchiga aylanmagan murojaatlar. Sinovdagilar sinov darslariga qatnayotganlar. Qarzdorlar to'lovi kechikkanlar. Shu oy to'laganlar, guruhni tark etganlar va sinovdan keyin ketganlar alohida sanaladi." },
    { q: "Raqamlarni kim kiritadi?", a: "Hech kim alohida kiritmaydi. Ko'rsatkichlar davomat, to'lov va lidlar bo'yicha kundalik ishdan avtomatik hisoblanadi." },
    { q: "Dashboard'ni kim ko'radi?", a: "Markaz rahbari. Boshqa xodimlar o'z rollariga tegishli bo'limlarni ko'radi." },
    { q: "Bu imkoniyat qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi.` },
  ],
  cta: {
    title: "Markazingizni raqamlar bilan boshqaring",
    text: "14 kun bepul sinov, karta kerak emas. Dashboard birinchi kiritilgan ma'lumotdan ishlay boshlaydi.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
