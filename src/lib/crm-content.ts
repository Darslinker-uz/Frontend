import type { CrmPlan } from "@/components/crm/crm-apply";

// CRM/LMS haqidagi umumiy ma'lumot — bitta manba: bosh sahifa (UI + JSON-LD), /haqimizda,
// llms.txt va llms-full.txt shu yerdan oladi. Faktlar — docs PRODUCT.md va egasining qarorlari;
// tasdiqlanmagan narsa (reyting, mijozlar soni, Click/Payme…) bu yerga yozilmaydi.

// Bitta jumlali tavsif — hamma joyda aynan shu (PRODUCT.md, 1-bo'lim).
export const TAGLINE = "Darslinker • o'quv markazlari uchun interaktiv CRM va LMS platformasi";

export const CRM_DESCRIPTION =
  "O'zbekistondagi o'quv markazlari uchun CRM va LMS: o'quvchilar, davomat, to'lov va qarzdorlik bitta tizimda, jonli quiz va ota-onaga Telegram xabar.";

export const CRM_KEYWORDS = [
  "o'quv markaz CRM",
  "o'quv markazi uchun CRM",
  "o'quv markaz dasturi",
  "LMS",
  "davomat jurnali",
  "qarzdorlik nazorati",
  "ota-onaga Telegram xabar",
  "jonli quiz",
  "Darslinker",
];

// Imkoniyatlar — har bir tarifda bor (2026-10-23 qarori). SoftwareApplication.featureList va llms.txt uchun.
export const CRM_FEATURES = [
  "O'quvchilar bazasi: sinov, faol va ketgan holatlari",
  "Guruhlar, xonalar, o'qituvchilar va dars jadvali",
  "Davomat: o'qituvchi telefondan belgilaydi",
  "Gamifikatsiya: jonli quiz, PIN bilan qo'shilish, jonli reyting",
  "Ota-onaga Telegram xabar: darsga kelmadi, qarzdorlik, to'lov tasdig'i",
  "Ota-ona farzandining davomati va to'lovlarini kuzatadi",
  "Telegram mini ilova: Darslinker'dan Telegram ichida, alohida ilova o'rnatmasdan foydalanish",
  "To'lov va qarzdorlik: naqd, karta yoki o'tkazma, chek bilan",
  "Lidlar: Kanban doska, lidni o'quvchiga aylantirish",
  "Dashboard: 8 ta asosiy ko'rsatkich",
  "Excel import",
  "Rollar: rahbar, administrator, o'qituvchi, kassir",
  "Do'stona support: birgalikda o'rnatish, to'liq sozlash va o'rgatish; haftaning 7 kuni 10:00–20:00",
];

export type PlanInfo = {
  id: CrmPlan;
  name: string;
  price: string;
  unit: string;
  audience: string; // kimlar uchun — mobil kartada nom va narx ostida
  features: string[];
  featured?: boolean;
};

// Tariflar (egasi tasdiqlagan, 2026-10-22; bepul tarif yo'q). 2026-10-23: barcha imkoniyatlar har bir
// tarifda — tariflar faqat hajm (o'quvchi, filial, xodim) bilan farqlanadi. Kartalarda faqat asosiy narx;
// qo'shimcha o'quvchi to'lovi faqat FAQ'da. 6/12 oylik narxlar pricing-section'da chegirmadan hisoblanadi.
export const PLANS: PlanInfo[] = [
  {
    id: "minimal",
    name: "Minimal",
    price: "190 000",
    unit: "so'm/oy",
    audience: "Kichik markazlar va repetitorlar uchun. 100 tagacha o'quvchi, bitta filial.",
    features: ["100 tagacha o'quvchi", "1 filial, 3 xodim", "Barcha imkoniyatlar"],
  },
  {
    id: "standart",
    name: "Standart",
    price: "370 000",
    unit: "so'm/oy",
    audience: "O'sayotgan, bitta filialli markazlar uchun. 250 tagacha o'quvchi.",
    features: ["250 tagacha o'quvchi", "1 filial, 5 xodim", "Barcha imkoniyatlar"],
  },
  {
    id: "biznes",
    name: "Biznes",
    price: "670 000",
    unit: "so'm/oy",
    audience: "Kengayayotgan markazlar uchun. 600 tagacha o'quvchi, 3 tagacha filial.",
    features: ["600 tagacha o'quvchi", "3 filial, 15 xodim", "Barcha imkoniyatlar"],
    featured: true,
  },
  {
    id: "korporativ",
    name: "Korporativ",
    price: "1 470 000",
    unit: "so'm/oy",
    audience: "Filiallar tarmog'i uchun. 1 500 tagacha o'quvchi, 6 tagacha filial.",
    features: ["1 500 tagacha o'quvchi", "6 filial, cheksiz xodim", "Barcha imkoniyatlar"],
  },
];

export const FAQS = [
  {
    q: "Darslinker nima?",
    a: "Darslinker O'zbekistondagi o'quv markazlari uchun yaratilgan interaktiv CRM va LMS platformasi. O'quvchilar, guruhlar, dars jadvali, davomat, to'lov va qarzdorlik bitta tizimda yuritiladi. Jonli quiz va ota-onaga Telegram xabarlari esa o'quvchini markazda ushlab qolishga yordam beradi.",
  },
  {
    q: "O'quv markaz uchun CRM nima beradi?",
    a: "CRM markazdagi barcha hisobni bir joyga yig'adi: kim qaysi guruhda o'qiydi, kim darsga kelmadi, kim qancha to'ladi va kimning qarzi bor. Daftar yoki Excel'da bu ma'lumotlar tarqoq bo'ladi va qarzdorlik kech bilinadi. Darslinker'da davomat, to'lov va qarzdorlik avtomatik bog'lanadi, ota-onaga xabar esa Telegram orqali o'zi boradi.",
  },
  {
    q: "Darslinker qaysi markazlar uchun mos?",
    a: "Xususiy o'quv markazlari (til, IT, abituriyentlarga tayyorlov va boshqa yo'nalishlar) va repetitorlar uchun. Ayniqsa hali daftar yoki Excel'da ishlayotgan markazlar uchun: mavjud o'quvchilar ro'yxatini Excel'dan ko'chirish mumkin, bunda yordam beramiz.",
  },
  {
    q: "Darslinker'ni sinab ko'rsa bo'ladimi?",
    a: "Ha. Istalgan tarifni 14 kun bepul sinab ko'rasiz, karta talab qilinmaydi. Eng kichik tarif Minimal: oyiga 190 000 so'm, 100 tagacha o'quvchi.",
  },
  {
    q: "Tariflar bir-biridan nimasi bilan farq qiladi?",
    a: "Barcha imkoniyatlar har bir tarifda bor: gamifikatsiya (jonli quiz), ota-onaga Telegram xabar, lidlar, davomat, to'lov va qarzdorlik, hisobotlar. Tariflar faqat hajm bilan farq qiladi: o'quvchilar soni, filiallar va xodimlar soni.",
  },
  {
    q: "Tarifdagi o'quvchilar sonidan oshib ketsa nima bo'ladi?",
    a: "Tarif chegarasidan oshgan har 10 ta o'quvchi uchun oyiga 20 000 so'm qo'shiladi. Boshlangan har 10 talik to'liq sanaladi: masalan, Biznes tarifida 601 ta o'quvchi bo'lsa, +20 000 so'm.",
  },
  {
    q: "Uzoq muddatga to'lasam chegirma bormi?",
    a: "Ha: 6 oyga to'lovda 10%, 12 oyga to'lovda 20% chegirma.",
  },
  {
    q: "Ota-onaga xabar qanday boradi?",
    a: "Telegram bot orqali. O'quvchi darsga kelmasa, qarzdorlik paydo bo'lsa yoki to'lov qabul qilinsa, ota-onaga avtomatik xabar boradi. SMS kerak emas, shuning uchun bu xabarlar uchun alohida pul to'lanmaydi.",
  },
  {
    q: "Jonli quiz qanday ishlaydi?",
    a: "O'qituvchi quizni markaz panelida yaratadi va o'yinni boshlaydi. O'quvchilar PIN kod bilan telefondan qo'shiladi, savollarga vaqt ichida javob beradi va reyting jonli yangilanadi. Taymer va ballar serverda hisoblanadi.",
  },
  {
    q: "Darslinker kurslar katalogi ishlashda davom etadimi?",
    a: "Ha. O'quv markazlar, repetitorlar va kurslar katalogi darslinker.uz/marketplace sahifasida avvalgidek ishlaydi.",
  },
];
