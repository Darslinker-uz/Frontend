import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "node:crypto";

// Production-safe seed: only creates records if missing. Never deletes.
// Run once after first deploy: `npx tsx prisma/seed-prod.ts`

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

async function main() {
  console.log("Production seed boshlandi...");

  // ==================== ADMIN USER ====================
  const adminPhone = process.env.ADMIN_PHONE ?? "+998901110000";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "CHANGE_ME_NOW";
  const adminName = process.env.ADMIN_NAME ?? "Admin";

  if (adminPassword === "CHANGE_ME_NOW") {
    console.warn("⚠️  ADMIN_PASSWORD env not set — using default 'CHANGE_ME_NOW'. Change it immediately!");
  }

  const existingAdmin = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        name: adminName,
        phone: adminPhone,
        passwordHash: hash(adminPassword),
        role: "admin",
      },
    });
    console.log(`✓ Admin yaratildi: ${admin.phone}`);
  } else {
    console.log(`  Admin allaqachon bor: ${existingAdmin.phone}`);
  }

  // ==================== TAXONOMY ====================
  // To'liq taxonomy uchun `npx tsx prisma/seed-taxonomy.ts` ishlatish tavsiya etiladi.
  // Bu yerda admin yaratiladi xolos.
  console.log("✓ Admin yaratish tugadi. Taxonomiya uchun: npx tsx prisma/seed-taxonomy.ts");

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
