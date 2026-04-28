<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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
