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

  // ==================== CATEGORIES ====================
  const defaultCategories = [
    { slug: "dasturlash", name: "IT & Dasturlash", description: "Python, JavaScript, React va boshqalar", icon: "code", color: "#3b82f6", order: 1, subcategories: ["JavaScript", "Python", "React", "Flutter", "Data Science", "Backend", "Frontend", "Mobile"] },
    { slug: "sunyi-intellekt", name: "Sun'iy Intellekt", description: "Prompt engineering va AI vositalardan to'g'ri foydalanish", icon: "sparkles", color: "#a855f7", order: 2, subcategories: ["Prompt engineering", "ChatGPT", "Midjourney", "AI agent", "Machine Learning", "AI biznesda"] },
    { slug: "marketing", name: "Marketing", description: "SEO, kontekst reklama, brending", icon: "megaphone", color: "#f59e0b", order: 3, subcategories: ["SEO", "Kontekst reklama", "Email marketing", "Brending", "Kontent marketing"] },
    { slug: "smm", name: "SMM", description: "Ijtimoiy tarmoqlarda promotion va kontent", icon: "share", color: "#ec4899", order: 4, subcategories: ["Instagram SMM", "TikTok SMM", "Telegram", "YouTube", "Facebook Ads", "Reels/shorts"] },
    { slug: "dizayn", name: "Dizayn", description: "UI/UX, Figma, Photoshop, Illustrator", icon: "palette", color: "#06b6d4", order: 5, subcategories: ["UI/UX", "Figma", "Photoshop", "Illustrator", "Grafik dizayn", "Motion dizayn"] },
    { slug: "xorijiy-tillar", name: "Xorijiy tillar", description: "Ingliz, rus, koreys, arab tillari", icon: "languages", color: "#22c55e", order: 6, subcategories: ["Ingliz tili", "Rus tili", "Koreys tili", "Arab tili", "Nemis tili", "IELTS", "CEFR"] },
    { slug: "biznes", name: "Biznes & Startap", description: "Tadbirkorlik, moliya, boshqaruv", icon: "briefcase", color: "#8b5cf6", order: 7, subcategories: ["Tadbirkorlik", "Moliya", "Boshqaruv", "Startup", "Investitsiya"] },
    { slug: "akademik", name: "Akademik fanlar", description: "Matematika, fizika, kimyo", icon: "book", color: "#0ea5e9", order: 8, active: false, subcategories: ["Matematika", "Fizika", "Kimyo", "Biologiya", "Olimpiada"] },
  ];

  let createdCount = 0;
  for (const c of defaultCategories) {
    const existing = await prisma.category.findUnique({ where: { slug: c.slug } });
    if (!existing) {
      await prisma.category.create({ data: c });
      createdCount++;
    }
  }
  console.log(`✓ Kategoriyalar: ${createdCount} ta yangi, ${defaultCategories.length - createdCount} ta mavjud`);

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
