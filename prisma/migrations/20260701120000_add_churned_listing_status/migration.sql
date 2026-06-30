-- AlterEnum
-- "churned": shartnoma bekor qilingan e'lon. Sahifa tirik qoladi (SEO),
-- lead yo'naltirilmaydi, public'da "hamkor emas + o'xshash kurslar" ko'rsatiladi.
-- PG 16: ADD VALUE transaction ichida ishlaydi (qiymat shu migration'da ishlatilmaydi).
ALTER TYPE "ListingStatus" ADD VALUE IF NOT EXISTS 'churned';
