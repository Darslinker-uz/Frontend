import Link from "next/link";
import { FeaturePage, FEATURES_CRUMB, TEXT_LINK, featureMetadata, type FeaturePageContent } from "@/components/crm/feature-page";
import { BranchesPreview } from "@/components/crm/feature-previews";

// /features/branches — "o'quv markazining filiallarini boshqarish" (docs/crm-pages-keywords.md).
// Tasdiqlangan: tariflardagi filial soni (1/1/3/6, ko'prog'i Individual). Filiallar bo'yicha alohida kassa,
// hisobot, filial direktori roli — egasi hali tasdiqlamagan, shuning uchun yozilmaydi.

const c: FeaturePageContent = {
  path: "/features/branches",
  ref: "feature-branches",
  parent: FEATURES_CRUMB,
  crumb: "Filiallar",
  metaTitle: "Ko'p filialli o'quv markazi uchun CRM — Darslinker",
  metaDescription:
    "O'quv markazlari tarmog'i uchun CRM: barcha filiallar bitta tizimda. Biznes tarifida 3 ta, Korporativ tarifida 6 ta filial, undan ko'pi uchun Individual tarif.",
  keywords: ["o'quv markazining filiallarini boshqarish", "bir nechta filial hisobi", "ko'p filialli markaz CRM'i", "o'quv markazlari tarmog'i uchun CRM"],
  title: "Filiallari bor o'quv markazi uchun CRM",
  lead: "Ko'p filialli o'quv markazlari uchun Darslinker barcha filiallarni bitta CRM tizimiga yig'adi. Yangi filial ochilsa, alohida dastur yoki yangi Excel varag'i kerak emas.",
  Preview: BranchesPreview,
  how: {
    question: "Bir nechta o'quv markazini bitta tizimda boshqarish mumkinmi?",
    answer:
      "Ha. Darslinker'da markazning barcha filiallari bitta tizimda turadi: o'quvchilar, guruhlar, davomat va to'lovlar har filial uchun alohida jadval yoki dasturda tarqalib ketmaydi. Filiallar soni tarifga bog'liq: Biznes tarifida 3 ta, Korporativ tarifida 6 ta.",
    steps: [
      { title: "Tarifni tanlaysiz", text: "Filiallar soniga qarab: 1 ta, 3 ta yoki 6 ta. Undan ko'p bo'lsa, Individual tarif." },
      { title: "Filiallarni qo'shasiz", text: "Har bir filial tizimga qo'shiladi va o'z o'quvchilari bilan yuritiladi." },
      { title: "Bitta joydan boshqarasiz", text: "Rahbar barcha filiallarni alohida dasturlarsiz, bitta tizimdan kuzatadi." },
    ],
  },
  summary: [
    "Markazning barcha filiallari bitta tizimda yuritiladi.",
    "Filiallar soni tarifga kiradi: Minimal va Standart tarifida 1 ta, Biznes tarifida 3 ta, Korporativ tarifida 6 ta.",
    "6 tadan ko'p filial uchun Individual tarif kelishuv asosida.",
    "Davomat, to'lov va ota-onaga xabarlar barcha filiallarda bir xil ishlaydi.",
  ],
  compare: {
    question: "Har filialda alohida dastur yoki Excel'dan nimasi farq qiladi?",
    beforeLabel: "Har filialda alohida",
    rows: [
      ["Umumiy holatni ko'rish", "Har filialdan ma'lumot so'rab, qo'lda yig'ish kerak", "Barcha filiallar bitta tizimda"],
      ["Yangi filial ochish", "Yangi dastur yoki fayl noldan sozlanadi", "Filial mavjud tizimga qo'shiladi"],
      ["Ish tartibi", "Har filial o'zicha yuritadi", "Davomat, to'lov va xabarlar hamma joyda bir xil"],
      ["Narx", "Har filial uchun alohida obuna yoki dastur", "Filiallar soni tarifga kiradi"],
    ],
  },
  benefits: {
    question: "Filiallarni bitta tizimda yuritish nima beradi?",
    items: [
      { title: "Hamma narsa bir joyda", text: "Har filial uchun alohida daftar, Excel yoki dastur yuritish shart emas." },
      { title: "Yangi filial tez ochiladi", text: "Yangi filial uchun tizimni noldan sozlash kerak emas, u mavjud tizimga qo'shiladi." },
      { title: "Bir xil tartib", text: "Davomat, to'lov va ota-onaga xabarlar barcha filiallarda bir xil ishlaydi." },
      { title: "Narx oldindan ma'lum", text: "Filiallar soni tarifga kiradi. Har filial uchun alohida obuna sotib olish kerak emas." },
    ],
  },
  related: {
    title: "Filiallar va tarif",
    text: (
      <p>
        Biznes tarifida 600 tagacha o&apos;quvchi va 3 ta filial, Korporativ tarifida 1 500 tagacha o&apos;quvchi va 6 ta
        filial bor. Batafsil:{" "}<Link href="/pricing" className={TEXT_LINK}>tariflar va narxlar</Link>. Rahbar uchun umumiy ko&apos;rsatkichlar{" "}
        <Link href="/features/reports" className={TEXT_LINK}>hisobotlar</Link>{" "}sahifasida.
      </p>
    ),
  },
  faqs: [
    { q: "Bir nechta filialning o'quvchilari, davomati va to'lovlarini bitta tizimda boshqarish mumkinmi?", a: "Ha. Darslinker'da markazning barcha filiallari bitta tizimda yuritiladi: alohida dastur yoki Excel kerak emas. Davomat, to'lov va ota-onaga xabarlar hamma filialda bir xil ishlaydi. Biznes tarifida 3 ta, Korporativ tarifida 6 ta filial, undan ko'pi uchun Individual tarif." },
    { q: "Nechta filial qo'shsa bo'ladi?", a: "Minimal va Standart tariflarida 1 ta, Biznes tarifida 3 ta, Korporativ tarifida 6 ta filial. Undan ko'p filial uchun Individual tarif kelishuv asosida." },
    { q: "Har filial uchun alohida to'lash kerakmi?", a: "Yo'q. Filiallar soni tarifga kiradi, alohida obuna kerak emas." },
    { q: "Ko'p filialli tarmoq uchun qaysi tarif mos?", a: "3 tagacha filial va 600 tagacha o'quvchi bo'lsa, Biznes tarifi mos. 6 tagacha filial va 1 500 tagacha o'quvchi bo'lsa, Korporativ tarif. Undan katta tarmoqlar uchun Individual tarif kelishuv asosida." },
    { q: "Filiallarda imkoniyatlar bir xilmi?", a: "Ha. Davomat, to'lov, ota-onaga xabar, jonli quiz va boshqa imkoniyatlar barcha filiallarda bir xil ishlaydi." },
    { q: "Filiallar ko'payganda tarifni almashtirsa bo'ladimi?", a: "Ha. Markaz o'sishi bilan kattaroq tarifga o'tish mumkin." },
  ],
  cta: {
    title: "Barcha filiallarni bitta tizimga yig'ing",
    text: "14 kun bepul sinov, karta kerak emas. Filiallaringizni sinov davomida qo'shib ko'rasiz.",
  },
};

export const metadata = featureMetadata(c);

export default function Page() {
  return <FeaturePage c={c} />;
}
