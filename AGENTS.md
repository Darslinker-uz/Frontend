<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Cross-file impact awareness

Loyiha real production'da ishlayapti. Bir qismni o'zgartirish boshqa qismlarni
buzishi mumkin — har o'zgarishda **impact ro'yxati** majburiy.

Quyidagi turdagi fayllar o'zgartirilganda — **avval** barcha foydalanuvchilarini topish:

- `prisma/schema.prisma` → ishlatadigan barcha route, handler, lib, repository
- `src/types/**`, `src/lib/**` (shared types/utils) → barcha import qiluvchi fayllar
- `src/app/api/**` route handlers (signature, response shape) → frontend fetcher'lar, hook'lar
- `middleware.ts`, auth/permission helpers → barcha himoyalangan route'lar
- Shared UI komponentlari (`src/components/**`) → barcha render qiluvchi sahifalar
- ENV o'zgaruvchilari, config fayllar → barcha ishlatuvchi joylar

**Workflow:**

1. O'zgarishdan oldin: `grep`/Explore subagent bilan callers/importers/references topish.
2. Foydalanuvchiga ro'yxat ko'rsatish:
   > Bu o'zgarish quyidagi N joyga ta'sir qiladi:
   > - `path/to/file1.ts` — qanday ta'sir
   > - `path/to/file2.tsx` — qanday ta'sir
   >
   > Shularni ham yangilashim kerakmi?
3. Foydalanuvchi javobiga qarab davom etish.
4. O'zgarishdan keyin: `npx tsc --noEmit` yoki `next build` butun loyiha bo'yicha,
   faqat o'zgartirilgan faylda emas.
5. Agar 1 fayldan ko'p ta'sir bo'lsa — qisqa eslatib o'tish yoki tasdiq olish.

Bug fix yoki kichik refactoring uchun ham qoida amal qiladi.

# DB safety — broader than schema

Quyidagi har qanday DB-ga ta'sir qiluvchi o'zgarishda — **avval matn ko'rinishida
ogohlantirish**, foydalanuvchi aniq "ha" / "qil" / "davom et" demaguncha
**bajarmaslik**. "OK", "yaxshi", "tushundim" — tasdiq EMAS.

Qamrov:

1. `prisma/schema.prisma` har qanday o'zgarishi (column, type, nullable, relation).
2. `prisma migrate dev/deploy/reset`, `prisma db push` (ba'zilari hook bilan ham bloklangan).
3. Ko'p qatorli `updateMany`, `deleteMany` — ayniqsa filtrsiz yoki keng filtr bilan.
4. Raw SQL: `$executeRaw`, `$queryRaw` ichida `UPDATE`, `DELETE`, `ALTER`, `DROP`, `TRUNCATE`.
5. Seed script'lar (mavjud ma'lumotlarni o'chirib qayta yozishi mumkin).
6. Backfill / data migration script'lari.
7. `DATABASE_URL` o'zgartirish, production connection string bilan ishlash.

**Ogohlantirish formati** (kod yozishdan oldin):

> ⚠️ **DB ogohlantirishi**: Bu o'zgarish quyidagilarni qiladi:
> - Aniq nima bo'ladi: [jadval, column, qancha qator, qaysi field qaysi qiymatga]
> - Mavjud ma'lumotlar holati: [saqlanadi / o'zgaradi / yo'qoladi]
> - Qaytarib bo'ladimi: [ha/yo'q]
> - Tavsiya: [`pg_dump` backup, staging'da sinash, dry run]
>
> Davom etaymi? "Ha" deb yozing.

Istisno yo'q: "kichik fix", "tez tuzatish", "test uchun" deb o'zboshimchalik
bilan bajarmaslik.

# Prisma migration safety

Production database has real listings, leads, payments, balance logs. Data loss is irreversible.

**Never run `prisma migrate dev` directly when changing existing fields.** Prisma treats a field rename as `DROP COLUMN` + `ADD COLUMN` — all data in that column is lost.

When the user asks to change `prisma/schema.prisma`:

1. If only the **Prisma field name** needs to change (not the DB column), use `@map("old_column_name")` — no migration needed.
2. If a real schema change is required, run `prisma migrate dev --create-only --name <descriptive_name>` to generate SQL without applying.
3. Open the generated `migration.sql` and check for destructive statements: `DROP COLUMN`, `DROP TABLE`, `ALTER COLUMN ... TYPE` (with incompatible cast), `NOT NULL` added without default.
4. Replace any unintended `DROP COLUMN` + `ADD COLUMN` pair with `ALTER TABLE ... RENAME COLUMN`.
5. Show the final SQL to the user and wait for explicit approval before running `prisma migrate deploy`.
6. Remind the user to take a `pg_dump` backup and test on staging before production.

Never auto-apply migrations to production from a local command.

# SEO / AEO

Public sahifalarga (`src/app/` ostida, lekin `/admin`, `/dashboard`, `/api`,
`/auth` dan tashqari) ta'sir qiladigan har bir o'zgarishda — yangi sahifa,
yangi maydon (course/category schema'ga ta'sir qiladigan), URL o'zgarishi,
render usuli o'zgarishi (server vs client), kontent qo'shilishi — SEO/AEO
masalasini **o'zim ko'taraman** va foydalanuvchidan so'rayman.

Misol savollar (kontekstga qarab tabiiy yoziladi):
- "Bu sahifa Google'da indekslansinmi?"
- "Bu yangi maydonni `Course` JSON-LD markup'ga qo'shaymi?"
- "Bu kontent server'da render bo'lishi kerakmi (crawlerlar uchun)?"
- "Yangi public route paydo bo'ldi — `sitemap.ts` ga qo'shaymi?"

Foydalanuvchi "ha" desa qo'llayman, "yo'q" desa qo'llamayman. Hech qachon
sukut bilan qo'llamayman, hech qachon sukut bilan tashlab ketmayman. Har
o'zgarishni alohida so'rayman.

Admin, dashboard, API, internal logic, type changes, bug fix'lar uchun
SEO savolini ko'tarmayman.
