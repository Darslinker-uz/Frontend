-- Statik blogs.ts'dan migrate qilingan 5 ta dastlabki blog postni o'chirish.
-- Foydalanuvchi xohlamadi — bu 5 ta hozircha kerak emas.
-- Boshqa qo'shilgan blog kontent tegmaydi.
DELETE FROM "articles"
WHERE "type" = 'blog'
  AND "slug" IN (
    'dasturlashni-qayerdan-boshlash',
    'ielts-7-tayyorgarlik',
    'freelance-boshlash',
    'ui-ux-dizayn-trendy',
    'online-vs-offline-kurslar'
  );
