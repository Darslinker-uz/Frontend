import Link from "next/link";
import { FeaturePage, FOR_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { PaymentsPreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /for/tutors — "repetitorlar uchun o'quvchilar hisobi dasturi" (docs/crm-pages-keywords.md).
// Minimal tarif "kichik markazlar va repetitorlar uchun" (crm-content). Faqat tasdiqlangan imkoniyatlar.

const MIN = PLANS[0];

const c: FeaturePageContent = {
  path: "/for/tutors",
  ref: "for-tutors",
  parent: FOR_CRUMB,
  crumb: "Repetitorlar",
  metaTitle: "Repetitorlar uchun o'quvchilar hisobi dasturi — Darslinker",
  metaDescription:
    "Repetitor uchun dastur: o'quvchilar ro'yxati, dars jadvali, davomat, to'lov va qarzdorlik, ota-onaga Telegram xabar bitta tizimda.",
  keywords: ["repetitorlar uchun o'quvchilar hisobi dasturi", "repetitor dars jadvali dasturi", "repetitor to'lov nazorati", "repetitor o'quvchilari bazasi"],
  title: "Repetitorlar uchun o'quvchilar hisobi dasturi",
  lead: "Shaxsiy darslar ko'payganda kim qachon keladi, kim to'lagan, kimga eslatish kerak, hammasini yodda saqlash qiyinlashadi. Darslinker bularni sizning o'rningizga eslab turadi.",
  Preview: PaymentsPreview,
  how: {
    question: "Repetitor dars jadvali va o'quvchilar to'lovini qanday yuritadi?",
    answer:
      "Darslinker'da har o'quvchi yoki guruh uchun dars vaqti belgilanadi, to'lov rejasi esa oylik bo'yicha hisoblanadi. Darsda davomatni telefondan belgilaysiz, to'lov qabul qilinganda uni chek bilan kiritasiz. Qarz o'zi hisoblanadi, ota-onaga esa Telegram orqali xabar boradi.",
    steps: [
      { title: "O'quvchilarni kiritasiz", text: "Ro'yxat Excel'dan yoki qo'lda bir marta kiritiladi." },
      { title: "Jadval va to'lov", text: "Dars vaqtlari va to'lov rejasi belgilanadi, qarz o'zi hisoblanadi." },
      { title: "Ota-ona xabardor", text: "Kelmadi, qarzdorlik va to'lov haqida Telegram xabar avtomatik boradi." },
    ],
  },
  summary: [
    "O'quvchilar ro'yxati, dars vaqtlari, davomat va to'lovlar bitta joyda.",
    "Qarz o'zi hisoblanadi, ota-onaga Telegram orqali xabar boradi.",
    "Tizim telefonda ishlaydi, Telegram ichida mini ilova sifatida ham ochiladi.",
    "Repetitorlar uchun mos tarif Minimal: 100 tagacha o'quvchi.",
  ],
  compare: {
    question: "Daftar va telefondagi eslatmalardan nimasi farq qiladi?",
    beforeLabel: "Daftar va eslatmalarda",
    rows: [
      ["Kim qachon keladi", "Daftarda yoki yodda", "Dars vaqtlari jadvalda"],
      ["Kim to'lagan", "Har oy daftarni varaqlab tekshirish", "To'lovlar va qarz bir qarashda ko'rinadi"],
      ["Ota-onaga eslatish", "Har biriga o'zingiz yozasiz", "Telegram xabar o'zi boradi"],
      ["Darsni qiziqarli qilish", "Qog'oz test", "Jonli quiz, natijalar saqlanadi"],
    ],
  },
  benefits: {
    question: "Repetitor uchun Darslinker nima beradi?",
    items: [
      { title: "Qarz esdan chiqmaydi", text: "Kim qancha to'lagani va kimning qarzi borligi doim ko'rinadi." },
      { title: "Ota-onaga yozish shart emas", text: "Davomat va to'lov haqidagi xabarlar Telegram orqali o'zi boradi." },
      { title: "Dars qiziqarli", text: "Jonli quiz bilan mavzuni o'yin shaklida takrorlaysiz." },
      { title: "Hamma narsa telefonda", text: "Tizim brauzerda ishlaydi, ilova o'rnatish shart emas." },
    ],
  },
  related: {
    title: "Narx va boshlash",
    text: (
      <p>
        Repetitorlar uchun eng mos tarif Minimal: oyiga {MIN.price}{" "}so&apos;m, 100 tagacha o&apos;quvchi. Batafsil:{" "}
        <Link href="/pricing" className={TEXT_LINK}>tariflar</Link>. Imkoniyatlar haqida{" "}<Link href="/features/payments" className={TEXT_LINK}>to&apos;lov</Link>,{" "}
        <Link href="/features/parents" className={TEXT_LINK}>ota-onaga xabar</Link>{" "}va{" "}<Link href="/features/live-quiz" className={TEXT_LINK}>jonli quiz</Link>{" "}sahifalarida, telefonda
        ishlash haqida{" "}<Link href="/features/telegram" className={TEXT_LINK}>Telegram mini ilova</Link>{" "}sahifasida.
      </p>
    ),
  },
  faqs: [
    { q: "Repetitor o'quvchilar ro'yxati, dars jadvali, to'lov va qarzdorlikni qanday tartibli yuritishi mumkin?", a: "Darslinker'da o'quvchilar ro'yxati, dars vaqtlari, davomat va to'lovlar bitta joyda turadi. Qarz avtomatik hisoblanadi, ota-onaga esa Telegram orqali xabar boradi. Repetitorlar uchun mos tarif Minimal." },
    { q: "Yakka ishlaydigan repetitorga ham mosmi?", a: "Ha. Minimal tarif kichik markazlar va repetitorlar uchun mo'ljallangan. Xodimlar bo'lmasa, tizimni o'zingiz yuritasiz." },
    { q: "Ota-onalarga xabar qanday boradi?", a: "Telegram orqali, avtomatik: o'quvchi darsga kelmasa, qarz paydo bo'lsa yoki to'lov qabul qilinsa." },
    { q: "Telefondan ishlatsa bo'ladimi?", a: "Ha. Tizim telefon brauzerida ishlaydi va Telegram ichida mini ilova sifatida ham ochiladi, alohida ilova o'rnatish shart emas." },
    { q: "Guruh darslari ham bo'lsa-chi?", a: "Darslinker shaxsiy o'quvchilar uchun ham, kichik guruhlar uchun ham ishlaydi: har biriga dars vaqti, davomat va to'lov yuritiladi." },
    { q: "Repetitor uchun qancha turadi?", a: `Minimal tarif oyiga ${MIN.price} so'm, 100 tagacha o'quvchi. 6 oyga to'lasangiz 10%, 12 oyga 20% chegirma.` },
    { q: "Sinab ko'rsa bo'ladimi?", a: "Ha. 14 kun bepul, karta talab qilinmaydi." },
  ],
  cta: {
    title: "O'quvchilaringiz hisobini tartibga soling",
    text: "14 kun bepul sinov, karta kerak emas. O'quvchilaringizni kiritib, to'lov va davomatni tizimda yuritasiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
