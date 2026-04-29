import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seed boshlandi (faqat taxonomiya — test user/e'lon yo'q)...");

  // Teskari bog'liqlik tartibida tozalash
  await prisma.rating.deleteMany();
  await prisma.review.deleteMany();
  await prisma.botPendingAction.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.boost.deleteMany();
  await prisma.balanceLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.manager.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.partnerApplication.deleteMany();
  await prisma.helpLead.deleteMany();
  await prisma.authCode.deleteMany();
  await prisma.category.deleteMany();
  await prisma.categoryGroup.deleteMany();
  await prisma.user.deleteMany();

  // ==================== TAXONOMY (groups + categories) ====================
  const groups = await Promise.all([
    prisma.categoryGroup.create({ data: { name: "Tillar", slug: "tillar", description: "Ingliz, rus, IELTS va boshqa tillar", icon: "languages", color: "#22c55e", order: 1 } }),
    prisma.categoryGroup.create({ data: { name: "IT & Dasturlash", slug: "it", description: "Python, JavaScript, AI va boshqa IT yo'nalishlar", icon: "code", color: "#3b82f6", order: 2 } }),
    prisma.categoryGroup.create({ data: { name: "Biznes & Marketing", slug: "biznes", description: "Marketing, sotuv, SMM va tadbirkorlik", icon: "briefcase", color: "#f59e0b", order: 3 } }),
    prisma.categoryGroup.create({ data: { name: "Dizayn & San'at", slug: "dizayn", description: "UI/UX, grafik dizayn va kreativ kasblar", icon: "palette", color: "#06b6d4", order: 4 } }),
    prisma.categoryGroup.create({ data: { name: "Akademik fanlar", slug: "akademik", description: "Matematika, fizika, DTM tayyorgarlik", icon: "book", color: "#0ea5e9", order: 5 } }),
    prisma.categoryGroup.create({ data: { name: "Bolalar uchun", slug: "bolalar", description: "Bolalar uchun ta'lim yo'nalishlari", icon: "smile", color: "#ec4899", order: 6 } }),
    prisma.categoryGroup.create({ data: { name: "Kasbiy ko'nikmalar", slug: "kasbiy", description: "Avto haydash, fitnes, kulinariya va boshqalar", icon: "tools", color: "#8b5cf6", order: 7 } }),
  ]);
  const grp = Object.fromEntries(groups.map(g => [g.slug, g]));

  await Promise.all([
    prisma.category.create({ data: { groupId: grp.tillar.id, name: "Ingliz tili", slug: "ingliz-tili", order: 1 } }),
    prisma.category.create({ data: { groupId: grp.tillar.id, name: "IELTS", slug: "ielts", order: 2 } }),
    prisma.category.create({ data: { groupId: grp.tillar.id, name: "Rus tili", slug: "rus-tili", order: 3 } }),
    prisma.category.create({ data: { groupId: grp.tillar.id, name: "Koreys tili", slug: "koreys-tili", order: 4 } }),
    prisma.category.create({ data: { groupId: grp.it.id, name: "Frontend", slug: "frontend", order: 1 } }),
    prisma.category.create({ data: { groupId: grp.it.id, name: "Backend", slug: "backend", order: 2 } }),
    prisma.category.create({ data: { groupId: grp.it.id, name: "Data Science", slug: "data-science", order: 3 } }),
    prisma.category.create({ data: { groupId: grp.biznes.id, name: "Digital marketing", slug: "digital-marketing", order: 1 } }),
    prisma.category.create({ data: { groupId: grp.biznes.id, name: "SMM", slug: "smm", order: 2 } }),
    prisma.category.create({ data: { groupId: grp.dizayn.id, name: "UI/UX dizayn", slug: "ui-ux", order: 1 } }),
  ]);

  console.log(`  ${groups.length} guruh, 10 ta yo'nalish`);
  console.log("\n✓ Seed tugadi.");
  console.log("  Admin: npx tsx prisma/seed-prod.ts (.env da ADMIN_PHONE, ADMIN_PASSWORD)");
  console.log("  To'liq taxonomiya: npx tsx prisma/seed-taxonomy.ts");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
