-- Yo'nalish so'rovi mexanizmi uchun maydonlar
ALTER TABLE "categories" ADD COLUMN "pending_approval" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "categories" ADD COLUMN "proposed_by_id" INTEGER;

ALTER TABLE "categories" ADD CONSTRAINT "categories_proposed_by_id_fkey"
  FOREIGN KEY ("proposed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "categories_pending_approval_idx" ON "categories"("pending_approval");
