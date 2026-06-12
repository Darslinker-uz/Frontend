-- CreateEnum
CREATE TYPE "UserProfileType" AS ENUM ('CENTER', 'TUTOR');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('COURSE', 'TUTOR_SERVICE');

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "group_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "faqs" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "listing_type" "ListingType" NOT NULL DEFAULT 'COURSE';

-- AlterTable
ALTER TABLE "regions" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "group_chat_id" TEXT,
ADD COLUMN     "group_link_token" TEXT,
ADD COLUMN     "profile_type" "UserProfileType" NOT NULL DEFAULT 'CENTER',
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_slug_key" ON "users"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_group_link_token_key" ON "users"("group_link_token");

-- RenameIndex (idempotent — ba'zi serverlarda eski index nomi yo'q)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i' AND c.relname = 'boosts_type_status_startDate_endDate_idx'
  ) THEN
    ALTER INDEX "boosts_type_status_startDate_endDate_idx"
      RENAME TO "boosts_type_status_start_date_end_date_idx";
  ELSIF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i' AND c.relname = 'boosts_type_status_start_date_end_date_idx'
  ) THEN
    CREATE INDEX "boosts_type_status_start_date_end_date_idx"
      ON "boosts"("type", "status", "start_date", "end_date");
  END IF;
END $$;
