-- FAQ table for admin-managed Q&A
CREATE TABLE "faqs" (
  "id" SERIAL PRIMARY KEY,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "page" TEXT NOT NULL DEFAULT 'home',
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "faqs_active_idx" ON "faqs"("active");
CREATE INDEX "faqs_page_idx" ON "faqs"("page");

-- Seed 7 ta FAQ (homepage'dan ko'chiriladi)
INSERT INTO "faqs" ("question", "answer", "page", "order", "updated_at") VALUES
  ('Darslinker.uz nima?',
   'Darslinker.uz — O''zbekistondagi online va offline o''quv kurslarini bir joydan topish, solishtirish va tanlash imkonini beruvchi ta''lim platformasi. Dasturlash, chet tillari, dizayn, IELTS, marketing, biznes va o''nlab boshqa yo''nalishlar bo''yicha o''quv markazlarini bir interfeysda topasiz.',
   'home', 1, CURRENT_TIMESTAMP),
  ('Kurslarni qanday topish mumkin?',
   'Bosh sahifadagi qidiruv yoki "Yo''nalishlar" bo''limi orqali sizga kerakli mavzuni tanlang. Har bir kursda narx, davomiylik, format (online/offline), o''qituvchi, o''quv markaz va viloyat bo''yicha to''liq ma''lumot mavjud.',
   'home', 2, CURRENT_TIMESTAMP),
  ('Kurs uchun to''lovni qanday qilaman?',
   'To''lov to''g''ridan-to''g''ri o''quv markaz bilan kelishiladi. Darslinker.uz xizmati o''quvchilar uchun butunlay bepul — biz faqat sizga eng mos kursni topishga yordam beramiz.',
   'home', 3, CURRENT_TIMESTAMP),
  ('Online va offline kurslar farqi nimada?',
   'Online kurslar Telegram, Zoom yoki maxsus platforma orqali masofadan olib boriladi. Offline kurslar esa o''quv markazning fizik joyida o''tkaziladi. Har bir kurs sahifasida format aniq belgilanadi va siz o''zingizga qulay variantni tanlashingiz mumkin.',
   'home', 4, CURRENT_TIMESTAMP),
  ('Reyting va sharh haqiqiymi?',
   'Ha. Har bir kurs uchun faqat Telegram bot orqali tasdiqlangan haqiqiy o''quvchilar sharh va reyting qoldira oladi. Bu sizga kurs sifati haqida ishonchli ma''lumot beradi.',
   'home', 5, CURRENT_TIMESTAMP),
  ('Qaysi viloyatlarda kurslar mavjud?',
   'Toshkent, Samarqand, Buxoro, Andijon, Farg''ona, Namangan, Qashqadaryo, Surxondaryo, Xorazm, Navoiy, Jizzax, Sirdaryo, Qoraqalpog''iston va O''zbekistonning barcha viloyatlarida kurslar bor. Bosh sahifadagi "Yo''nalishlar" yoki kurs sahifasida viloyat filtridan foydalaning.',
   'home', 6, CURRENT_TIMESTAMP),
  ('O''quv markaz sifatida qanday qo''shilaman?',
   'Hamkorlik sahifasidan ariza qoldiring — biz siz bilan bog''lanamiz va kurslaringizni platformada joylashtirishga yordam beramiz. Kurs joylash dastlabki davrda bepul.',
   'home', 7, CURRENT_TIMESTAMP);
