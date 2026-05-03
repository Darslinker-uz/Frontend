-- Listing'ga ko'p til qo'shish (eski 'language' saqlanadi)
ALTER TABLE "listings"
  ADD COLUMN "languages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Mavjud e'lonlar uchun: 'language' qiymatini 'languages' massiviga ko'chiramiz
UPDATE "listings"
SET "languages" = ARRAY["language"]
WHERE "language" IS NOT NULL AND "language" <> '';
