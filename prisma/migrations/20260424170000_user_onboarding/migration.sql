-- AlterTable: yangi ustun, default false
ALTER TABLE "users" ADD COLUMN "onboarding_completed" BOOLEAN NOT NULL DEFAULT false;

-- Mavjud foydalanuvchilar uchun onboarding'ni "tugallangan" deb belgilab qo'yamiz —
-- ular welcome sahifaga yo'naltirilmasin.
UPDATE "users" SET "onboarding_completed" = true;
