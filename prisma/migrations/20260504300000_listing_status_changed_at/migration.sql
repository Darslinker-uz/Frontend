-- Status oxirgi marta qachon o'zgargani — kutuvdagi e'lonlarda
-- "kutuvga o'tgan vaqt" ko'rsatish uchun.
-- NULL bo'lsa fallback'da createdAt ko'rsatamiz.
ALTER TABLE "listings"
  ADD COLUMN "status_changed_at" TIMESTAMP(3);

-- Mavjud e'lonlar uchun: createdAt ni statusChangedAt sifatida ko'chiramiz
-- (status haqiqatan qachon o'rnatilganini bilmaymiz, lekin createdAt
-- yangi e'lonlar uchun aniq, tahrir qilingani uchun yaqin yaxshilanma)
UPDATE "listings"
SET "status_changed_at" = "created_at"
WHERE "status_changed_at" IS NULL;
