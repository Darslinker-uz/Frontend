// CRM/LMS marketing sahifasining manzili — bosh sahifa (2026-10-23 dan; avval /democrm demo edi).
export const CRM_HOME: string = "/";

// Katalog bosh sahifasi (avvalgi "/").
export const MARKETPLACE_HOME = "/marketplace";

// CRM/LMS sahifalari: navbar "Ariza qoldirish" + yangi ko'rinish, CRM footer.
// Qolgan (katalog) sahifalar — eski navbar, "Yordam", oddiy footer.
// Yangi CRM/LMS sahifa qo'shilsa — shu ro'yxatga qo'shiladi (prefiks: ichki sahifalari ham kiradi).
// /features, /pricing, /crm-comparison, /for — rejadagi sahifalar (hali yo'q, oldindan qo'shilgan).
const CRM_PREFIXES = ["/haqimizda", "/features", "/pricing", "/crm-comparison", "/for"];
export const isCrmPage = (pathname: string) =>
  pathname === CRM_HOME || CRM_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

// Katalog bo'limi: bu sahifalarda logotip /marketplace ga olib boradi (qolganlarida — "/").
const CATALOG_PREFIXES = [MARKETPLACE_HOME, "/kurslar", "/oquv-markazlar", "/repetitorlar", "/joylar"];
export const isCatalogPage = (pathname: string) =>
  CATALOG_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

// CRM/LMS marketing sahifalari — sitemap va llms.txt shu ro'yxatdan oladi (yangi sahifa qo'shilsa, shu yerga).
export const CRM_SITE_PAGES: { path: string; title: string; about: string }[] = [
  { path: "/features", title: "Imkoniyatlar", about: "CRM va LMS imkoniyatlari va kimlar uchun" },
  { path: "/features/students", title: "O'quvchilar bazasi", about: "holatlar, profil, Excel import" },
  { path: "/features/attendance", title: "Davomat", about: "elektron davomat jurnali, telefondan belgilash" },
  { path: "/features/payments", title: "To'lov va qarzdorlik", about: "chek, avtomatik qarz, qarzdorlar ro'yxati" },
  { path: "/features/parents", title: "Ota-onalar uchun", about: "ota-onaga Telegram xabar va farzandni kuzatish" },
  { path: "/features/telegram", title: "Telegram mini ilova", about: "Darslinker'dan Telegram ichida foydalanish" },
  { path: "/features/lms", title: "LMS", about: "o'quv jarayoni, jonli quiz, natijalar profilda, CRM va LMS farqi" },
  { path: "/features/live-quiz", title: "Jonli quiz", about: "darsda gamifikatsiya, PIN bilan qo'shilish, reyting" },
  { path: "/features/leads", title: "Lidlar", about: "arizalar Kanban doskada, marketplace arizalari" },
  { path: "/features/schedule", title: "Dars jadvali", about: "guruhlar, xonalar, o'qituvchilar, to'qnashuv tekshiruvi" },
  { path: "/features/reports", title: "Hisobotlar", about: "dashboard'da 8 ta ko'rsatkich" },
  { path: "/features/branches", title: "Filiallar", about: "ko'p filialli markaz uchun CRM, barcha filiallar bitta tizimda" },
  { path: "/features/easy-to-use", title: "Oson boshqaruv", about: "qulay interfeys, rollar, Excel'dan o'tish" },
  { path: "/features/customization", title: "Markazga moslash", about: "logotip, dashboard ranglari, xabar matnlari, rollar" },
  { path: "/features/security", title: "Xavfsizlik", about: "xavfsiz CRM va LMS, kunlik zaxira nusxa, shifrlangan ulanish, ma'lumotni yuklab olish" },
  { path: "/features/support", title: "Support va sozlash", about: "birgalikda o'rnatish, to'liq sozlash, o'rgatish, 7 kun 10:00–20:00 support" },
  { path: "/pricing", title: "Tariflar", about: "narxlar, chegirmalar, qaysi tarif mos" },
  { path: "/crm-comparison", title: "CRM tanlash", about: "o'quv markazi uchun CRM tanlash mezonlari" },
  { path: "/for/language-centers", title: "Til markazlari uchun", about: "til markazi uchun CRM" },
  { path: "/for/exam-prep", title: "Abituriyent markazlari uchun", about: "abituriyent tayyorlov markazi uchun CRM" },
  { path: "/for/it-schools", title: "IT akademiyalar uchun", about: "IT o'quv markazi uchun CRM" },
  { path: "/for/kids-centers", title: "Bolalar markazlari uchun", about: "bolalar o'quv markazi uchun CRM" },
  { path: "/for/small-centers", title: "Kichik markazlar uchun", about: "kichik o'quv markazi uchun CRM" },
  { path: "/for/tutors", title: "Repetitorlar uchun", about: "repetitor uchun o'quvchilar hisobi dasturi" },
];
