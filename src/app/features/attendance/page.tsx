import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { AttendancePreview } from "@/components/crm/features-explorer";
import { PLANS } from "@/lib/crm-content";

// /features/attendance — "o'quv markazi davomat tizimi" (docs/crm-pages-keywords.md).
// Dashboard'da alohida davomat ko'rsatkichi yo'q — yozilmaydi.

const c: FeaturePageContent = {
  path: "/features/attendance",
  ref: "feature-attendance",
  parent: FEATURES_CRUMB,
  crumb: "Davomat",
  metaTitle: "O'quv markazi davomat tizimi — Darslinker",
  metaDescription:
    "O'quv markazi uchun elektron davomat jurnali: o'qituvchi davomatni telefondan belgilaydi, kelmaganlarning ota-onasiga Telegram xabar o'zi boradi.",
  keywords: ["o'quv markazi davomat tizimi", "davomat jurnali elektron", "o'quvchilar davomati dasturi", "davomatni nazorat qilish"],
  title: "O'quv markazi davomat tizimi",
  lead: "Darslinker o'quv markazi uchun elektron davomat jurnalini yuritadi. O'qituvchi davomatni darsning o'zida telefondan belgilaydi: kim kelmagani darhol ko'rinadi, ota-onasiga esa Telegram orqali xabar boradi.",
  Preview: AttendancePreview,
  how: {
    question: "O'quvchilar davomati qanday yuritiladi?",
    answer:
      "Davomatni o'qituvchi dars paytida telefonidan belgilaydi. Buning uchun ilova o'rnatish shart emas, tizim brauzerda ochiladi. Belgilangan davomat o'quvchining profiliga tushadi, darsga kelmaganlarning ota-onasiga esa xabar avtomatik ketadi.",
    steps: [
      { title: "O'qituvchi belgilaydi", text: "Dars boshida guruh ro'yxati telefonda ochiladi, kelganlar bir bosishda belgilanadi." },
      { title: "Ota-onaga xabar boradi", text: "Darsga kelmagan o'quvchining ota-onasiga Telegram orqali avtomatik xabar ketadi." },
      { title: "Tarix saqlanadi", text: "Har o'quvchining davomati uning profilida to'lovlari bilan birga turadi." },
    ],
  },
  summary: [
    "O'qituvchi davomatni dars paytida telefondan belgilaydi, ilova o'rnatish shart emas.",
    "Darsga kelmagan o'quvchining ota-onasiga Telegram xabar avtomatik boradi.",
    "Davomat har o'quvchining profilida to'lovlari bilan birga saqlanadi.",
    "O'qituvchi almashsa ham davomat tarixi tizimda saqlanib qoladi.",
  ],
  compare: {
    question: "Qog'oz jurnaldan nimasi farq qiladi?",
    beforeLabel: "Qog'oz jurnalda",
    rows: [
      ["Davomat belgilash", "Qog'oz jurnalga qo'lda yoziladi, ba'zan keyinga qoladi", "Darsning o'zida telefondan, bir bosishda"],
      ["Ota-onaga xabar", "Administrator har biriga qo'ng'iroq qiladi yoki yozadi", "Telegram xabar avtomatik boradi"],
      ["Kim dars qoldirayotgani", "Jurnalni varaqlab, qo'lda sanash kerak", "O'quvchi profilida davomat tarixi ko'rinadi"],
      ["Jurnal saqlanishi", "Yo'qolishi, yirtilishi yoki o'qituvchi bilan ketishi mumkin", "Tizimda saqlanadi, o'qituvchi almashsa ham qoladi"],
    ],
  },
  benefits: {
    question: "Elektron davomat jurnali nima beradi?",
    items: [
      { title: "Jurnal yo'qolmaydi", text: "Davomat qog'ozda emas, tizimda saqlanadi. O'qituvchi almashsa ham o'quvchining tarixi joyida qoladi." },
      { title: "Ilova shart emas", text: "Davomat telefon brauzerida belgilanadi, o'qituvchiga hech narsa o'rnatish kerak emas." },
      { title: "Ota-ona xabardor", text: "Kelmagan o'quvchi haqida ota-onaga Telegram xabari o'zi boradi. Xabar matnini markaz o'zi o'zgartira oladi." },
      { title: "Qatnov pasayishi seziladi", text: "O'quvchi darslarni tez-tez qoldira boshlasa, buni davomatdan erta ko'rasiz va ketib qolmasidan oldin gaplashasiz." },
    ],
  },
  related: {
    title: "Davomat, to'lov va quiz bitta joyda",
    text: (
      <p>
        O&apos;quvchining davomati uning profilida{" "}<Link href="/features/payments" className={TEXT_LINK}>to&apos;lovlari</Link>{" "}va{" "}
        <Link href="/features/live-quiz" className={TEXT_LINK}>quiz natijalari</Link>{" "}bilan birga ko&apos;rinadi. Ota-onaga xabarlar qanday borishini
        {" "}<Link href="/features/parents" className={TEXT_LINK}>ota-onalar uchun</Link>{" "}sahifasida ko&apos;rasiz. Davomat barcha tariflarda bor, tariflar oyiga{" "}
        {PLANS[0].price}{" "}so&apos;mdan boshlanadi.
      </p>
    ),
  },
  faqs: [
    { q: "O'qituvchi telefonidan davomat belgilab, kelmagan o'quvchining ota-onasiga avtomatik xabar yuboradigan tizim qaysi?", a: "Darslinker'da shunday: o'qituvchi davomatni darsda telefondan belgilaydi, ilova o'rnatish shart emas. O'quvchi kelmagan deb belgilansa, ota-onasiga Telegram orqali avtomatik xabar boradi." },
    { q: "Davomatni kim belgilaydi?", a: "O'qituvchi o'z guruhlari davomatini dars paytida belgilaydi. Markaz rahbari barcha guruhlar davomatini ko'ra oladi." },
    { q: "Davomat uchun ilova o'rnatish kerakmi?", a: "Yo'q. Davomat telefon brauzerida ochiladigan tizimda belgilanadi, alohida ilova o'rnatish shart emas." },
    { q: "Ota-onaga xabar qanday boradi?", a: "O'quvchi darsga kelmagan deb belgilansa, ota-onasiga Telegram bot orqali avtomatik xabar boradi. SMS kerak emas, shuning uchun bu xabarlar uchun alohida pul to'lanmaydi." },
    { q: "Davomatni nazorat qilish uchun nima qilish kerak?", a: "Davomat har darsda belgilansa, kim dars qoldira boshlagani o'quvchi profilida ko'rinadi. Darslinker'da o'qituvchi buni telefondan bir necha soniyada qiladi, ota-ona esa xabarni o'zi oladi." },
    { q: "Ota-onaga boradigan xabar matnini o'zgartirsa bo'ladimi?", a: "Ha. Xabar matnini markaz o'zi, o'z uslubiga moslab o'zgartira oladi." },
    { q: "Davomat qaysi tarifda bor?", a: `Barcha tariflarda. Tariflar oyiga ${PLANS[0].price} so'mdan boshlanadi va faqat hajm bilan farq qiladi. Istalgan tarifni 14 kun bepul sinab ko'rish mumkin.` },
  ],
  cta: {
    title: "Davomatni qog'ozdan tizimga o'tkazing",
    text: "14 kun bepul sinov, karta kerak emas. Ro'yxatni ko'chirishda yordam beramiz, keyin davomatni darsda telefondan belgilaysiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
