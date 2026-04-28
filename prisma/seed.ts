import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "node:crypto";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Oddiy parol hash — dev uchun. Production'da bcrypt ishlatiladi.
const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

async function main() {
  console.log("Seed boshlandi...");

  // Tartib: eski datani tozalash (teskari bog'liqlik tartibida)
  await prisma.rating.deleteMany();
  await prisma.review.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.boost.deleteMany();
  await prisma.balanceLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.manager.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.partnerApplication.deleteMany();
  await prisma.helpLead.deleteMany();
  await prisma.category.deleteMany();
  await prisma.categoryGroup.deleteMany();
  await prisma.user.deleteMany();

  // ==================== TAXONOMY (groups + categories) ====================
  // To'liq taxonomiya `prisma/seed-taxonomy.ts`'da; bu yerda eng keng tarqalgan
  // yo'nalishlardan ozgina to'plam — listing'larga bog'lash uchun yetadi.
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

  const categories = await Promise.all([
    // Tillar
    prisma.category.create({ data: { groupId: grp.tillar.id, name: "Ingliz tili", slug: "ingliz-tili", order: 1 } }),
    prisma.category.create({ data: { groupId: grp.tillar.id, name: "IELTS", slug: "ielts", order: 2 } }),
    prisma.category.create({ data: { groupId: grp.tillar.id, name: "Rus tili", slug: "rus-tili", order: 3 } }),
    prisma.category.create({ data: { groupId: grp.tillar.id, name: "Koreys tili", slug: "koreys-tili", order: 4 } }),
    // IT
    prisma.category.create({ data: { groupId: grp.it.id, name: "Frontend", slug: "frontend", order: 1 } }),
    prisma.category.create({ data: { groupId: grp.it.id, name: "Backend", slug: "backend", order: 2 } }),
    prisma.category.create({ data: { groupId: grp.it.id, name: "Data Science", slug: "data-science", order: 3 } }),
    // Biznes
    prisma.category.create({ data: { groupId: grp.biznes.id, name: "Digital marketing", slug: "digital-marketing", order: 1 } }),
    prisma.category.create({ data: { groupId: grp.biznes.id, name: "SMM", slug: "smm", order: 2 } }),
    // Dizayn
    prisma.category.create({ data: { groupId: grp.dizayn.id, name: "UI/UX dizayn", slug: "ui-ux", order: 1 } }),
  ]);
  const cat = Object.fromEntries(categories.map(c => [c.slug, c]));
  console.log(`  ${groups.length} guruh, ${categories.length} yo'nalish`);

  // ==================== USERS ====================
  const admin = await prisma.user.create({
    data: { name: "Admin Main", phone: "+998901110000", passwordHash: hash("admin123"), role: "admin" },
  });

  const teachers = await Promise.all([
    prisma.user.create({ data: { name: "Najot Ta'lim", phone: "+998711234567", passwordHash: hash("pass"), role: "provider", telegramChatId: "@najot_talim", balance: 2_500_000 } }),
    prisma.user.create({ data: { name: "Everest School", phone: "+998712345678", passwordHash: hash("pass"), role: "provider", telegramChatId: "@everest_sch", balance: 1_800_000 } }),
    prisma.user.create({ data: { name: "Marketing Pro", phone: "+998903456789", passwordHash: hash("pass"), role: "provider", balance: 950_000 } }),
    prisma.user.create({ data: { name: "IT Park Academy", phone: "+998714567890", passwordHash: hash("pass"), role: "provider", telegramChatId: "@itpark", balance: 0, banned: true } }),
    prisma.user.create({ data: { name: "Sarvar Nazarov", phone: "+998935678901", passwordHash: hash("pass"), role: "provider", telegramChatId: "@sarvar_n", balance: 200_000 } }),
  ]);

  const students = await Promise.all([
    prisma.user.create({ data: { name: "Jasur Karimov", phone: "+998901234567", passwordHash: hash("pass"), role: "student", telegramChatId: "@jasurk" } }),
    prisma.user.create({ data: { name: "Madina Rahimova", phone: "+998912345678", passwordHash: hash("pass"), role: "student" } }),
    prisma.user.create({ data: { name: "Bobur Toshmatov", phone: "+998933456789", passwordHash: hash("pass"), role: "student" } }),
    prisma.user.create({ data: { name: "Nilufar Azimova", phone: "+998944567890", passwordHash: hash("pass"), role: "student", telegramChatId: "@nilufar" } }),
  ]);
  console.log(`  1 admin, ${teachers.length} teacher, ${students.length} student`);

  // ==================== LISTINGS ====================
  const listings = await Promise.all([
    prisma.listing.create({ data: { userId: teachers[0].id, categoryId: cat.frontend.id, title: "JavaScript & React Full-stack", slug: "javascript-react-fullstack", description: "Noldan professionalgacha 6 oyda. Real loyihalar va mentorlik.", price: 2_500_000, format: "offline", location: "Toshkent · Chilonzor", region: "Toshkent shahri", district: "Chilonzor", duration: "6 oy", phone: "+998711234567", color: "blue", icon: "code", status: "active", views: 4820 } }),
    prisma.listing.create({ data: { userId: teachers[0].id, categoryId: cat.backend.id, title: "Python Backend Bootcamp", slug: "python-backend-bootcamp", description: "Django, FastAPI, PostgreSQL — backend muhandisligi bo'yicha intensiv.", price: 3_000_000, format: "offline", location: "Toshkent · Yunusobod", region: "Toshkent shahri", district: "Yunusobod", duration: "8 oy", phone: "+998711234567", color: "green", icon: "code", status: "active", views: 3250 } }),
    prisma.listing.create({ data: { userId: teachers[1].id, categoryId: cat.ielts.id, title: "IELTS Premium 7.0+", slug: "ielts-premium-7", description: "6 oyda 7.0+ balni kafolatlaymiz. TEFL sertifikatli o'qituvchilar.", price: 1_800_000, format: "offline", location: "Toshkent · Mirzo Ulug'bek", region: "Toshkent shahri", district: "Mirzo Ulug'bek", duration: "6 oy", phone: "+998712345678", color: "orange", icon: "book", status: "active", views: 2140 } }),
    prisma.listing.create({ data: { userId: teachers[2].id, categoryId: cat["digital-marketing"].id, title: "Digital Marketing A-Z", slug: "digital-marketing-az", description: "SMM, kontent, Meta Ads, Google Ads — amaliy loyihalar bilan.", price: 1_200_000, format: "online", duration: "4 oy", phone: "+998903456789", color: "rose", icon: "chart", status: "active", views: 890 } }),
    prisma.listing.create({ data: { userId: teachers[4].id, categoryId: cat["ui-ux"].id, title: "UI/UX Figma Pro", slug: "ui-ux-figma-pro", description: "Product dizayn, wireframing, prototipga to'liq kurs.", price: 1_500_000, format: "offline", location: "Samarqand", region: "Samarqand", duration: "4 oy", phone: "+998935678901", color: "purple", icon: "palette", status: "active", views: 1120 } }),
    prisma.listing.create({ data: { userId: teachers[2].id, categoryId: cat.smm.id, title: "SMM Pro Course", slug: "smm-pro-course", description: "Instagram, Telegram, TikTok — content strategy va reklama.", price: 800_000, format: "online", duration: "3 oy", phone: "+998903456789", color: "gold", icon: "chat", status: "pending", views: 0 } }),
    prisma.listing.create({ data: { userId: teachers[3].id, categoryId: cat["data-science"].id, title: "Data Science", slug: "data-science-listing", description: "Python, NumPy, Pandas, ML asoslari.", price: 2_800_000, format: "offline", location: "Toshkent", region: "Toshkent shahri", duration: "8 oy", phone: "+998714567890", color: "navy", icon: "chart", status: "paused", views: 420 } }),
    prisma.listing.create({ data: { userId: teachers[0].id, categoryId: cat.backend.id, title: "Node.js Backend", slug: "nodejs-backend", description: "Node.js, Express, MongoDB — backend asoslari.", price: 1_800_000, format: "offline", location: "Toshkent · Chilonzor", region: "Toshkent shahri", district: "Chilonzor", duration: "5 oy", phone: "+998711234567", color: "green", icon: "code", status: "rejected", rejectReason: "Surat sifati past, qaytadan yuklang", views: 0 } }),
  ]);
  console.log(`  ${listings.length} ta e'lon`);

  // ==================== LEADS ====================
  const leads = await Promise.all([
    prisma.lead.create({ data: { listingId: listings[0].id, name: students[0].name, phone: students[0].phone, status: "converted", note: "Kursga yozildi, 1-smena" } }),
    prisma.lead.create({ data: { listingId: listings[0].id, name: "Aziza Raxmonova", phone: "+998901112244", status: "new_lead" } }),
    prisma.lead.create({ data: { listingId: listings[1].id, name: students[3].name, phone: students[3].phone, status: "contacted", note: "Ertaga bog'laniladi" } }),
    prisma.lead.create({ data: { listingId: listings[2].id, name: students[2].name, phone: students[2].phone, status: "converted" } }),
    prisma.lead.create({ data: { listingId: listings[2].id, name: students[1].name, phone: students[1].phone, status: "new_lead", message: "6 oyda 7.0+ ball uchun intensiv kerak" } }),
    prisma.lead.create({ data: { listingId: listings[6].id, name: "Sardor Umarov", phone: "+998905678901", status: "disputed", note: "Sifatsiz ma'lumot berdi" } }),
  ]);
  console.log(`  ${leads.length} ta lead`);

  // ==================== BOOSTS ====================
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

  await Promise.all([
    prisma.boost.create({ data: { listingId: listings[0].id, type: "a_class", pricePerDay: 100_000, daysTotal: 30, totalPaid: 3_000_000, startDate: daysAgo(6), endDate: daysFromNow(24), status: "active", views: 4820, leadsCount: 42 } }),
    prisma.boost.create({ data: { listingId: listings[2].id, type: "a_class", pricePerDay: 100_000, daysTotal: 10, totalPaid: 1_000_000, startDate: daysAgo(3), endDate: daysFromNow(7), status: "active", views: 2140, leadsCount: 18 } }),
    prisma.boost.create({ data: { listingId: listings[3].id, type: "b_class", pricePerDay: 70_000, daysTotal: 7, totalPaid: 490_000, startDate: daysAgo(3), endDate: daysFromNow(4), status: "active", views: 890, leadsCount: 7 } }),
  ]);
  console.log(`  3 ta boost`);

  // ==================== PAYMENTS ====================
  await Promise.all([
    prisma.payment.create({ data: { userId: teachers[0].id, amount: 5_000_000, type: "topup", status: "success", method: "payme", description: "Balans to'ldirish" } }),
    prisma.payment.create({ data: { userId: teachers[0].id, amount: 3_000_000, type: "boost", status: "success", method: "internal", description: "A class boost · 30 kun" } }),
    prisma.payment.create({ data: { userId: students[0].id, amount: 35_000, type: "lead", status: "success", method: "click", description: "Lead to'lovi" } }),
    prisma.payment.create({ data: { userId: teachers[1].id, amount: 10_000_000, type: "topup", status: "success", method: "payme" } }),
    prisma.payment.create({ data: { userId: teachers[2].id, amount: 2_000_000, type: "topup", status: "pending", method: "uzcard" } }),
  ]);
  console.log("  5 ta to'lov");

  // ==================== HELP LEADS ====================
  await Promise.all([
    prisma.helpLead.create({ data: { name: "Jamoliddin Yusupov", phone: "+998901112233", interest: "Dasturlash (veb)", message: "Noldan boshlab JavaScript o'rganmoqchiman, qaysi markaz yaxshi?", status: "new_req" } }),
    prisma.helpLead.create({ data: { name: "Shaxnoza Alimova", phone: "+998912223344", interest: "Dizayn", message: "Figma + UI/UX bo'yicha kurs kerak, byudjet 500k gacha", status: "new_req" } }),
    prisma.helpLead.create({ data: { name: "Abduraxmon Usmonov", phone: "+998933334455", interest: "IELTS", message: "6 oyda 7.0+ balga tayyorlanish", status: "answered" } }),
  ]);
  console.log("  3 ta yordam so'rovi");

  // ==================== PARTNER APPLICATIONS ====================
  await Promise.all([
    prisma.partnerApplication.create({ data: { name: "Alisher Boboqulov", phone: "+998712003040", telegram: "@alisher_b", centerName: "Genius IT Academy", category: "IT & Dasturlash", city: "Toshkent", studentsCount: "80-100", message: "5 yillik tajribamiz bor", status: "new_app" } }),
    prisma.partnerApplication.create({ data: { name: "Nargiza Rasulova", phone: "+998661234567", centerName: "English World Samarqand", category: "Xorijiy tillar", city: "Samarqand", studentsCount: "150+", message: "Samarqandda eng yirik ingliz tili markazi", status: "new_app" } }),
    prisma.partnerApplication.create({ data: { name: "Madina Xolmatova", phone: "+998953456789", centerName: "Speak Up", category: "Xorijiy tillar", city: "Toshkent", studentsCount: "200+", message: "10+ yil tajriba, TEFL sertifikatli o'qituvchilar", status: "accepted" } }),
  ]);
  console.log("  3 ta hamkorlik arizasi");

  console.log("\n✓ Seed tugadi");
  console.log(`  Admin: phone=${admin.phone} password=admin123`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
