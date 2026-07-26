-- Telegram username uchun alohida ustun.
-- Ilgari u `message` ichiga "Telegram: @user" matni sifatida yozilar,
-- ko'rsatiladigan har joyda regex bilan qayta ajratilardi.

-- 1) Yangi ustun (nullable, mavjud ma'lumotga ta'sir qilmaydi)
ALTER TABLE "leads" ADD COLUMN "telegram" TEXT;

-- 2) Backfill: eski arizalardagi "Telegram: @user" matnini ustunga ko'chiramiz
--    va o'sha bo'lakni message'dan olib tashlaymiz. message faqat shu matndan
--    iborat bo'lsa NULL bo'ladi. Boshqa qatorlarga tegilmaydi.
UPDATE "leads"
SET
  "telegram" = substring("message" from 'Telegram:[[:space:]]*@?(\w+)'),
  "message"  = NULLIF(
                 btrim(regexp_replace("message", 'Telegram:[[:space:]]*@?\w+', '', 'gi')),
                 ''
               )
WHERE "message" ~* 'Telegram:[[:space:]]*@?\w+';
