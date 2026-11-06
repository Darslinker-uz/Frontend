// Blog rejasi (CRM/LMS davri) — admin panel /admode/blog shu ro'yxatni guruhlab ko'rsatadi.
// Mavzu "yozilgan" (done) bo'ladi, qachonki uning slug'i STATIC_BLOG_POSTS'da paydo bo'lsa — qo'lda belgilash yo'q.
// Yozish mezonlari va qoidalar: docs/crm-blog-plan.md. Maqola matni egasi bilan birga yoziladi.
// Har mavzu sotuvchi intent'da: markaz egasining qaror yoki muammo so'roviga javob + mos Darslinker imkoniyati va CTA.
// "imkoniyat" guruhi: bitta maqola = bitta imkoniyat = bitta aniq muammo, yechim sifatida Darslinker va CTA.
// Asosiy so'rovi 27 ta CRM sahifasi (/features, /for, /pricing, /crm-comparison) bilan bir xil bo'lmasligi kerak.

export type BlogPlanCluster = "sotuv" | "imkoniyat" | "tanlash" | "muammo" | "segment" | "ochish";

export type BlogPlanItem = {
  slug: string;
  title: string;
  cluster: BlogPlanCluster;
  // Maqoladagi asosiy CTA sahifalari (birinchisi asosiy).
  cta: string[];
  // Yozishdan oldin e'tibor beriladigan narsa (dublikat xavfi, manba talabi).
  note?: string;
};

export const BLOG_PLAN_CLUSTERS: Record<BlogPlanCluster, string> = {
  sotuv: "Sotuvchi: CRM tanlash",
  imkoniyat: "Sotuvchi: imkoniyat bo'yicha (1 muammo = 1 yechim)",
  tanlash: "Solishtirish",
  muammo: "Muammo va yechim",
  segment: "Markaz turlari",
  ochish: "Markaz ochish va o'sish",
};

export const BLOG_PLAN: BlogPlanItem[] = [
  // Sotuvchi: CRM tanlash — xaridga eng yaqin so'rovlar
  { slug: "ozbekistonda-eng-yaxshi-crm-oquv-markazlari-uchun", title: "O'zbekistonda o'quv markazlari uchun eng yaxshi CRM qaysi? (2026)", cluster: "sotuv", cta: ["/", "/pricing"], note: "Tavsiyalar formati: 5–7 ta CRM nomi bilan, rasmiy saytlaridan tekshirilgan faktlar, kamsitishsiz. ⚠️ /crm-comparison asosiy so'rovi bilan to'qnashadi — yozishdan oldin egasi bilan hal qilinadi" },
  { slug: "oquv-markazi-crm-narxlari", title: "O'quv markazi uchun CRM narxlari: 2026-yilda qancha to'laysiz?", cluster: "sotuv", cta: ["/pricing"], note: "Bozor narxlari faqat raqobatchilarning rasmiy narx sahifalaridan, sanasi bilan" },
  { slug: "oquv-markazi-uchun-bepul-crm", title: "O'quv markazi uchun bepul CRM bormi va u qanchalik yetarli?", cluster: "sotuv", cta: ["/pricing"] },
  { slug: "yangi-oquv-markazi-uchun-crm-yoki-erp", title: "Yangi o'quv markazi uchun CRM yoki ERP: nimadan boshlash kerak? (2026)", cluster: "sotuv", cta: ["/for/small-centers", "/pricing"], note: "Platforma formati. 'O'quv markazi ochishda qaysi tizimlar kerak' mavzusi shu maqolaga birlashtirilgan. Darslinker ERP emas, bu ochiq aytiladi" },
  { slug: "bitrix24-yoki-amocrm-oquv-markazi-uchun", title: "Bitrix24 yoki amoCRM o'quv markaziga to'g'ri keladimi? Ta'lim uchun maxsus CRM'lar", cluster: "sotuv", cta: ["/"], note: "GPT so'rovi: 'Bitrix24 ga o'xshash, lekin ta'lim markazlari uchun CRM bormi?'. Bitrix24/amoCRM haqida faqat rasmiy saytlaridagi faktlar" },
  { slug: "darslinker-sharhi", title: "Darslinker CRM va LMS sharhi: o'quv markazi uchun nimalar bor?", cluster: "sotuv", cta: ["/features", "/pricing"], note: "Faqat PRODUCT.md 'Hozir bor' imkoniyatlari; kamchilik va yo'q narsalar ham ochiq aytiladi" },

  // Sotuvchi: imkoniyat bo'yicha — bitta maqola = bitta imkoniyat = bitta aniq muammo
  { slug: "oquvchilar-royxati-tartibsiz", title: "O'quvchilar ro'yxati daftar va chatlarda tarqalib ketsa nima qilish kerak?", cluster: "imkoniyat", cta: ["/features/students"] },
  { slug: "oqituvchi-davomatni-kech-belgilaydi", title: "O'qituvchi davomatni kech belgilasa yoki unutsa nima qilish kerak?", cluster: "imkoniyat", cta: ["/features/attendance"] },
  { slug: "oquv-markazida-qarzdorlikni-kamaytirish", title: "O'quv markazida qarzdorlikni qanday kamaytirish mumkin?", cluster: "imkoniyat", cta: ["/features/payments", "/features/parents"] },
  { slug: "ota-ona-farzandi-kelmaganini-bilishi", title: "Ota-ona farzandi darsga kelmaganini qanday darhol bilishi mumkin?", cluster: "imkoniyat", cta: ["/features/parents"] },
  { slug: "darsda-oquvchilar-zerikib-qolsa", title: "Darsda o'quvchilar zerikib qolsa nima qilish kerak?", cluster: "imkoniyat", cta: ["/features/live-quiz"] },
  { slug: "oquvchi-bilimini-har-darsda-tekshirish", title: "O'quvchi bilimini har darsda qanday tekshirish mumkin?", cluster: "imkoniyat", cta: ["/features/lms", "/features/live-quiz"] },
  { slug: "kursga-kelgan-arizalar-nega-yoqoladi", title: "Kursga kelgan arizalar nega yo'qoladi va ularni qanday saqlab qolish mumkin?", cluster: "imkoniyat", cta: ["/features/leads"], note: "/features/leads bilan farqi: jarayon va xatolar" },
  { slug: "dars-jadvali-toqnashuvlari", title: "Dars jadvalida xona va o'qituvchi to'qnashuvining oldini qanday olish mumkin?", cluster: "imkoniyat", cta: ["/features/schedule"], note: "/features/schedule bilan farqi: amaliy qoidalar" },
  { slug: "rahbar-markaz-holatini-kuzatish", title: "Rahbar o'quv markazi holatini har kuni qanday kuzatishi mumkin?", cluster: "imkoniyat", cta: ["/features/reports"] },
  { slug: "3-5-filialli-oquv-markazini-boshqarish", title: "3–5 filialli o'quv markazini bitta tizimdan qanday boshqarish mumkin?", cluster: "imkoniyat", cta: ["/features/branches"], note: "GPT so'rovlari: '3 ta filialli', '5 ta filialim bor' — sarlavha shunga moslangan" },
  { slug: "oquv-markazini-avtomatlashtirish-administrator", title: "O'quv markazini avtomatlashtirish: administrator ishining qaysi qismini dasturga topshirish mumkin?", cluster: "imkoniyat", cta: ["/features/easy-to-use"], note: "So'rovlar: 'avtomatlashtirish dasturi', 'administrator dasturi'" },
  { slug: "mobil-ilova-yoki-telegram-mini-ilova", title: "O'quv markaziga mobil ilova kerakmi yoki Telegram mini ilova yetadimi?", cluster: "imkoniyat", cta: ["/features/telegram"] },
  { slug: "excel-yoki-crm-oquv-markazi", title: "Excel yoki CRM: o'quv markaziga qaysi biri arzonga tushadi?", cluster: "imkoniyat", cta: ["/features/easy-to-use", "/pricing"], note: "/features/easy-to-use bilan farqi: xarajat hisobi, o'tish yo'riqnomasi emas" },
  { slug: "xodimlar-uchun-rollar", title: "O'quv markazida xodimlarga kirish huquqlarini qanday taqsimlash kerak?", cluster: "imkoniyat", cta: ["/features/customization"] },
  { slug: "oquv-markazi-malumotlari-yoqolmasligi", title: "O'quv markazi ma'lumotlari yo'qolmasligi uchun nima qilish kerak?", cluster: "imkoniyat", cta: ["/features/security"] },
  { slug: "crm-ga-otish-qancha-vaqt-oladi", title: "O'quv markazi CRM'ga o'tishi qancha vaqt va kuch talab qiladi?", cluster: "imkoniyat", cta: ["/features/support", "/pricing"], note: "Muddat va'da qilinmaydi" },

  // Solishtirish
  { slug: "sms-yoki-telegram-ota-onaga-xabar", title: "SMS yoki Telegram: ota-onaga xabar yuborishning qaysi biri arzon va samarali?", cluster: "tanlash", cta: ["/features/parents"], note: "SMS narxlari faqat operatorlarning rasmiy tariflaridan, sanasi bilan" },
  { slug: "kahoot-muqobili-darsda-jonli-quiz", title: "Kahoot'ga muqobil: darsda jonli quiz o'tkazish uchun qaysi vositalar bor?", cluster: "tanlash", cta: ["/features/live-quiz"], note: "Raqobatchilar haqida faqat rasmiy saytlaridagi faktlar, kamsitmasdan" },
  { slug: "onlayn-crm-yoki-bir-martalik-litsenziya", title: "Onlayn CRM yoki bir martalik litsenziya: o'quv markazi uchun qaysi biri foydali?", cluster: "tanlash", cta: ["/pricing"], note: "So'rov: 'o'quv markazi uchun online dastur'. Obuna va SchoolUp kabi litsenziya solishtiriladi, narxlar rasmiy saytlardan" },
  { slug: "alohida-lms-kerakmi", title: "O'quv markaziga alohida LMS kerakmi yoki CRM ichidagi LMS yetadimi?", cluster: "tanlash", cta: ["/features/lms"], note: "/features/lms FAQ'dagi 'CRM va LMS farqi' bilan takrorlanmasin" },

  // Muammo va yechim — bir nechta imkoniyatni birlashtiradigan muammolar
  { slug: "oquvchilar-nega-ketadi", title: "O'quvchilar o'quv markazidan nega ketadi va buni qanday oldindan sezish mumkin?", cluster: "muammo", cta: ["/features/reports", "/features/attendance"] },
  { slug: "sinov-darsidan-keyin-yozilmaslik", title: "Sinov darsidan keyin o'quvchi nega kursga yozilmaydi?", cluster: "muammo", cta: ["/features/leads", "/features/reports"] },
  { slug: "oqituvchilar-ishini-nazorat-qilish", title: "O'quv markazida o'qituvchilar ishini qanday nazorat qilish mumkin?", cluster: "muammo", cta: ["/features/easy-to-use", "/features/reports"], note: "⚠️ Yozishdan oldin egasidan tasdiq: Darslinker'da rahbar o'qituvchilar ishini qanday ko'radi" },
  { slug: "qogoz-davomat-yashirin-xarajatlari", title: "Davomatni qog'ozda yuritish markazga qanchaga tushadi?", cluster: "muammo", cta: ["/features/attendance"], note: "Hisob faqat 'shartli misol' sifatida" },

  // Markaz turlari
  { slug: "ielts-markazi-natijalarni-kuzatish", title: "IELTS markazi o'quvchilar natijasini qanday kuzatadi?", cluster: "segment", cta: ["/for/language-centers", "/features/live-quiz"] },
  { slug: "bolalar-markazi-ota-ona-ishonchi", title: "Bolalar markazida ota-onalar ishonchini qanday oshirish mumkin?", cluster: "segment", cta: ["/for/kids-centers", "/features/parents"] },
  { slug: "abituriyent-markazi-test-natijalari", title: "Abituriyent markazida test natijalarini qanday kuzatish mumkin?", cluster: "segment", cta: ["/for/exam-prep", "/features/live-quiz"] },
  { slug: "repetitor-koplab-oquvchini-boshqarish", title: "Repetitor 20 tadan ortiq o'quvchini qanday boshqaradi?", cluster: "segment", cta: ["/for/tutors"] },

  // Markaz ochish va o'sish
  { slug: "marketplace-orqali-yangi-oquvchi", title: "Marketplace orqali yangi o'quvchi topish o'quv markaziga nima beradi?", cluster: "ochish", cta: ["/features/leads", "/marketplace"] },
];
