-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('lugat', 'qollanma', 'sharh', 'savol');
CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "articles" (
  "id"           SERIAL PRIMARY KEY,
  "slug"         TEXT NOT NULL,
  "title"        TEXT NOT NULL,
  "excerpt"      TEXT,
  "content"      TEXT NOT NULL,
  "type"         "ArticleType" NOT NULL,
  "cover_image"  TEXT,
  "status"       "ArticleStatus" NOT NULL DEFAULT 'draft',
  "views"        INTEGER NOT NULL DEFAULT 0,
  "category_id"  INTEGER,
  "group_id"     INTEGER,
  "published_at" TIMESTAMP(3),
  "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"   TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");
CREATE INDEX "articles_type_idx" ON "articles"("type");
CREATE INDEX "articles_status_idx" ON "articles"("status");
CREATE INDEX "articles_category_id_idx" ON "articles"("category_id");
CREATE INDEX "articles_group_id_idx" ON "articles"("group_id");

ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "articles" ADD CONSTRAINT "articles_group_id_fkey"
  FOREIGN KEY ("group_id") REFERENCES "category_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
