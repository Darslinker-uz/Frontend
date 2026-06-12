#!/usr/bin/env bash
# PreToolUse hook for Bash — blocks DB-destructive commands until user explicitly approves.
# Exit code 2 sends stderr back to Claude as tool_result (Claude must then ask user).

set -u

input=$(cat)
cmd=$(printf '%s' "$input" | /usr/bin/python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("tool_input",{}).get("command",""))' 2>/dev/null || printf '')

if [ -z "$cmd" ]; then
  exit 0
fi

block() {
  printf 'BLOCKED (DB safety hook): %s\n\n' "$1" >&2
  printf 'Buyruq: %s\n\n' "$cmd" >&2
  printf 'Bu buyruqni ishga tushirishdan oldin foydalanuvchiga matnli ogohlantirish ber:\n' >&2
  printf '  - Aniq nima ozgaradi (jadval, column, qatorlar soni)\n' >&2
  printf '  - Mavjud malumotlar saqlanadimi/yoqoladimi\n' >&2
  printf '  - Qaytarib boladimi, backup tavsiyasi\n' >&2
  printf 'Foydalanuvchi aniq "ha" desa keyin qayta urinib kor.\n' >&2
  exit 2
}

# Always-block destructive Prisma commands
if printf '%s' "$cmd" | /usr/bin/grep -qE '(^|[[:space:]&;|`(])(npx |pnpm |yarn |bun )?prisma[[:space:]]+migrate[[:space:]]+(deploy|reset)([[:space:]]|$)'; then
  block "prisma migrate deploy/reset — production DB ga tasir qiladi"
fi

if printf '%s' "$cmd" | /usr/bin/grep -qE '(^|[[:space:]&;|`(])(npx |pnpm |yarn |bun )?prisma[[:space:]]+db[[:space:]]+push'; then
  block "prisma db push — schemani togridan-togri DB ga itaradi (column drop xavfi)"
fi

# prisma migrate dev — block unless --create-only is present
if printf '%s' "$cmd" | /usr/bin/grep -qE '(^|[[:space:]&;|`(])(npx |pnpm |yarn |bun )?prisma[[:space:]]+migrate[[:space:]]+dev'; then
  if ! printf '%s' "$cmd" | /usr/bin/grep -q -- '--create-only'; then
    block "prisma migrate dev faqat --create-only bilan ishlatilsin (SQL ni avval korish uchun)"
  fi
fi

# Raw destructive SQL via psql/postgres CLI
if printf '%s' "$cmd" | /usr/bin/grep -qiE '(psql|pg_dump|pg_restore).*(DROP[[:space:]]+(TABLE|DATABASE|SCHEMA|COLUMN)|TRUNCATE[[:space:]]+TABLE|DELETE[[:space:]]+FROM)'; then
  block "Raw destructive SQL aniqlandi (DROP/TRUNCATE/DELETE)"
fi

# pg_restore (overwrites data)
if printf '%s' "$cmd" | /usr/bin/grep -qE '(^|[[:space:]&;|`(])pg_restore([[:space:]]|$)'; then
  block "pg_restore — mavjud DB malumotlarini ustiga yozishi mumkin"
fi

exit 0
