-- E'lon uchun ixtiyoriy aloqa maydonlari: sayt havolasi, Instagram, Telegram.
-- Telefon allaqachon mavjud (Listing.phone — NOT NULL, provider'dan default).
-- Bu yangi 3 ta — barchasi NULLable, eski e'lonlar tegmaydi.
ALTER TABLE "listings"
  ADD COLUMN "website" TEXT,
  ADD COLUMN "instagram" TEXT,
  ADD COLUMN "telegram" TEXT;
