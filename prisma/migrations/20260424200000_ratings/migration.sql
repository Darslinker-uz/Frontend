-- CreateTable
CREATE TABLE "ratings" (
  "id" SERIAL NOT NULL,
  "listing_id" INTEGER NOT NULL,
  "phone" TEXT NOT NULL,
  "chat_id" TEXT,
  "stars" INTEGER NOT NULL,
  "comment" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (unique: bir telefon — bir listing uchun bitta reyting)
CREATE UNIQUE INDEX "ratings_listing_id_phone_key" ON "ratings"("listing_id", "phone");
CREATE INDEX "ratings_listing_id_idx" ON "ratings"("listing_id");
CREATE INDEX "ratings_phone_idx" ON "ratings"("phone");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
