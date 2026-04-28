-- Region table for navbar/admin control
CREATE TABLE "regions" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "regions_active_idx" ON "regions"("active");
CREATE INDEX "regions_featured_idx" ON "regions"("featured");

-- Seed 14 region (mavjud regions.ts'dan).
-- Birinchi 6 viloyat featured=true (hozirgi navbar bilan mos).
INSERT INTO "regions" ("name", "slug", "active", "featured", "order", "updated_at") VALUES
  ('Toshkent shahri',   'toshkent-shahri',   true, true,  1,  CURRENT_TIMESTAMP),
  ('Toshkent viloyati', 'toshkent-viloyati', true, false, 2,  CURRENT_TIMESTAMP),
  ('Samarqand',         'samarqand',         true, true,  3,  CURRENT_TIMESTAMP),
  ('Buxoro',            'buxoro',            true, true,  4,  CURRENT_TIMESTAMP),
  ('Andijon',           'andijon',           true, true,  5,  CURRENT_TIMESTAMP),
  ('Farg''ona',         'fargona',           true, true,  6,  CURRENT_TIMESTAMP),
  ('Namangan',          'namangan',          true, true,  7,  CURRENT_TIMESTAMP),
  ('Qashqadaryo',       'qashqadaryo',       true, false, 8,  CURRENT_TIMESTAMP),
  ('Surxondaryo',       'surxondaryo',       true, false, 9,  CURRENT_TIMESTAMP),
  ('Xorazm',            'xorazm',            true, false, 10, CURRENT_TIMESTAMP),
  ('Navoiy',            'navoiy',            true, false, 11, CURRENT_TIMESTAMP),
  ('Jizzax',            'jizzax',            true, false, 12, CURRENT_TIMESTAMP),
  ('Sirdaryo',          'sirdaryo',          true, false, 13, CURRENT_TIMESTAMP),
  ('Qoraqalpog''iston', 'qoraqalpogiston',   true, false, 14, CURRENT_TIMESTAMP);
