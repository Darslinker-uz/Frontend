-- Listing'ga ko'p daraja qo'shish (eski 'level' o'zgarmaydi)
ALTER TABLE "listings"
  ADD COLUMN "levels" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Mavjud e'lonlar uchun: agar 'level' to'ldirilgan bo'lsa, 'levels' ga ko'chiramiz
UPDATE "listings"
SET "levels" = ARRAY["level"]
WHERE "level" IS NOT NULL AND "level" <> '';

-- Filiallar jadvali
CREATE TABLE "listing_locations" (
  "id"         SERIAL PRIMARY KEY,
  "listing_id" INTEGER NOT NULL,
  "region"     TEXT,
  "district"   TEXT,
  "address"    TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "listing_locations_listing_id_fkey"
    FOREIGN KEY ("listing_id") REFERENCES "listings"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "listing_locations_listing_id_idx" ON "listing_locations"("listing_id");
CREATE INDEX "listing_locations_region_idx"     ON "listing_locations"("region");

-- Mavjud e'lonlar uchun: 'region/district/location' qiymatlarini 1 ta filial sifatida ko'chiramiz
INSERT INTO "listing_locations" ("listing_id", "region", "district", "address", "sort_order")
SELECT "id", "region", "district", "location", 0
FROM "listings"
WHERE "region" IS NOT NULL OR "district" IS NOT NULL OR "location" IS NOT NULL;
