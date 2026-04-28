import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "node:crypto";

// Production-safe seed: adminni upsert qiladi (xavfsiz parol .env da). Mavjud ma'lumotlarni o'chirmaydi.
// Deploy: `npx tsx prisma/seed-prod.ts`

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("998")) return "+" + digits;
  if (digits.length === 9) return "+998" + digits;
  return "+" + digits;
}

async function main() {
  console.log("Production seed boshlandi...");

  const adminPhone = normalizePhone(process.env.ADMIN_PHONE ?? "+998338880133");
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? "Admin";

  if (!adminPassword || adminPassword.trim() === "") {
    const anyAdmin = await prisma.user.findFirst({ where: { role: "admin" } });
    if (anyAdmin) {
      console.log(`ADMIN_PASSWORD o'rnatilmagan — admin o'zgartirilmadi (${anyAdmin.phone}).`);
    } else {
      console.error("ADMIN_PASSWORD .env da bo'lishi kerak. Birinchi adminni yaratish uchun parol bering.");
      process.exit(1);
    }
  } else {
    await prisma.user.upsert({
      where: { phone: adminPhone },
      create: {
        name: adminName,
        phone: adminPhone,
        passwordHash: hash(adminPassword),
        role: "admin",
      },
      update: {
        name: adminName,
        passwordHash: hash(adminPassword),
        role: "admin",
        banned: false,
      },
    });
    console.log(`✓ Admin tayyor: ${adminPhone} (/admode — telefon + parol)`);
  }

  console.log("✓ Admin qismi tugadi. Taxonomiya: npx tsx prisma/seed-taxonomy.ts");
  console.log("\n✓ Production seed tugadi");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
