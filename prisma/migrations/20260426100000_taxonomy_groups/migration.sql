-- 1) Wipe data tables that depend on categories/listings (foydalanuvchilar va auth saqlanadi)
DELETE FROM "ratings";
DELETE FROM "reviews";
DELETE FROM "boosts";
DELETE FROM "leads";
DELETE FROM "listings";
DELETE FROM "categories";

-- 2) Listings'ga region/district qo'shish
ALTER TABLE "listings" ADD COLUMN "region" TEXT;
ALTER TABLE "listings" ADD COLUMN "district" TEXT;

-- 3) Categories: subcategories massivni o'chirish, groupId qo'shish
ALTER TABLE "categories" DROP COLUMN IF EXISTS "subcategories";
ALTER TABLE "categories" ADD COLUMN "group_id" INTEGER;

-- 4) Yangi category_groups jadvali
CREATE TABLE "category_groups" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "icon" TEXT,
  "color" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX "category_groups_name_key" ON "category_groups"("name");
CREATE UNIQUE INDEX "category_groups_slug_key" ON "category_groups"("slug");

-- 5) Foreign key — keyin seed'dan keyin NOT NULL qilamiz (hozir nullable)
ALTER TABLE "categories" ADD CONSTRAINT "categories_group_id_fkey"
  FOREIGN KEY ("group_id") REFERENCES "category_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 6) Compound unique va indeks
CREATE INDEX "categories_group_id_idx" ON "categories"("group_id");
CREATE UNIQUE INDEX "categories_group_id_slug_key" ON "categories"("group_id", "slug");
