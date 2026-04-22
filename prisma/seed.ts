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
  await prisma.user.deleteMany();

  // ==================== CATEGORIES ====================
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "IT & Dasturlash", slug: "dasturlash", description: "Python, JavaScript, React va boshqalar", icon: "code", color: "#3b82f6", order: 1, subcategories: ["JavaScript", "Python", "React", "Flutter", "Data Science", "Backend", "Frontend", "Mobile"] } }),
    prisma.category.create({ data: { name: "Sun'iy Intellekt", slug: "sunyi-intellekt", description: "Prompt engineering va AI vositalardan to'g'ri foydalanish", icon: "sparkles", color: "#a855f7", order: 2, subcategories: ["Prompt engineering", "ChatGPT", "Midjourney", "AI agent", "Machine Learning", "AI biznesda"] } }),
    prisma.category.create({ data: { name: "Marketing", slug: "marketing", description: "SEO, kontekst reklama, brending", icon: "megaphone", color: "#f59e0b", order: 3, subcategories: ["SEO", "Kontekst reklama", "Email marketing", "Brending", "Kontent marketing"] } }),
    prisma.category.create({ data: { name: "SMM", slug: "smm", description: "Ijtimoiy tarmoqlarda promotion va kontent", icon: "share", color: "#ec4899", order: 4, subcategories: ["Instagram SMM", "TikTok SMM", "Telegram", "YouTube", "Facebook Ads", "Reels/shorts"] } }),
    prisma.category.create({ data: { name: "Dizayn", slug: "dizayn", description: "UI/UX, Figma, Photoshop, Illustrator", icon: "palette", color: "#06b6d4", order: 5, subcategories: ["UI/UX", "Figma", "Photoshop", "Illustrator", "Grafik dizayn", "Motion dizayn"] } }),
    prisma.category.create({ data: { name: "Xorijiy tillar", slug: "xorijiy-tillar", description: "Ingliz, rus, koreys, arab tillari", icon: "languages", color: "#22c55e", order: 6, subcategories: ["Ingliz tili", "Rus tili", "Koreys tili", "Arab tili", "Nemis tili", "IELTS", "CEFR"] } }),
    prisma.category.create({ data: { name: "Biznes & Startap", slug: "biznes", description: "Tadbirkorlik, moliya, boshqaruv", icon: "briefcase", color: "#8b5cf6", order: 7, subcategories: ["Tadbirkorlik", "Moliya", "Boshqaruv", "Startup", "Investitsiya"] } }),
    prisma.category.create({ data: { name: "Akademik fanlar", slug: "akademik", description: "Matematika, fizika, kimyo", icon: "book", color: "#0ea5e9", order: 8, active: false, subcategories: ["Matematika", "Fizika", "Kimyo", "Biologiya", "Olimpiada"] } }),
  ]);
  const cat = Object.fromEntries(categories.map(c => [c.slug, c]));
  console.log(`  ${categories.length} ta kategoriya`);

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
    prisma.listing.create({ data: { userId: teachers[0].id, categoryId: cat.dasturlash.id, title: "JavaScript & React Full-stack", slug: "javascript-react-fullstack", description: "Noldan professionalgacha 6 oyda. Real loyihalar va mentorlik.", price: 2_500_000, format: "offline", location: "Toshkent · Chilonzor", duration: "6 oy", phone: "+998711234567", color: "blue", icon: "code", status: "active", views: 4820 } }),
    prisma.listing.create({ data: { userId: teachers[0].id, categoryId: cat.dasturlash.id, title: "Python Backend Bootcamp", slug: "python-backend-bootcamp", description: "Django, FastAPI, PostgreSQL — backend muhandisligi bo'yicha intensiv.", price: 3_000_000, format: "offline", location: "Toshkent · Yunusobod", duration: "8 oy", phone: "+998711234567", color: "green", icon: "code", status: "active", views: 3250 } }),
    prisma.listing.create({ data: { userId: teachers[1].id, categoryId: cat["xorijiy-tillar"].id, title: "IELTS Premium 7.0+", slug: "ielts-premium-7", description: "6 oyda 7.0+ balni kafolatlaymiz. TEFL sertifikatli o'qituvchilar.", price: 1_800_000, format: "offline", location: "Toshkent · Mirzo Ulug'bek", duration: "6 oy", phone: "+998712345678", color: "orange", icon: "book", status: "active", views: 2140 } }),
    prisma.listing.create({ data: { userId: teachers[2].id, categoryId: cat.marketing.id, title: "Digital Marketing A-Z", slug: "digital-marketing-az", description: "SMM, kontent, Meta Ads, Google Ads — amaliy loyihalar bilan.", price: 1_200_000, format: "online", duration: "4 oy", phone: "+998903456789", color: "rose", icon: "chart", status: "active", views: 890 } }),
    prisma.listing.create({ data: { userId: teachers[4].id, categoryId: cat.dizayn.id, title: "UI/UX Figma Pro", slug: "ui-ux-figma-pro", description: "Product dizayn, wireframing, prototipga to'liq kurs.", price: 1_500_000, format: "offline", location: "Samarqand", duration: "4 oy", phone: "+998935678901", color: "purple", icon: "palette", status: "active", views: 1120 } }),
    prisma.listing.create({ data: { userId: teachers[2].id, categoryId: cat.marketing.id, title: "SMM Pro Course", slug: "smm-pro-course", description: "Instagram, Telegram, TikTok — content strategy va reklama.", price: 800_000, format: "online", duration: "3 oy", phone: "+998903456789", color: "gold", icon: "chat", status: "pending", views: 0 } }),
    prisma.listing.create({ data: { userId: teachers[3].id, categoryId: cat.dasturlash.id, title: "Data Science", slug: "data-science", description: "Python, NumPy, Pandas, ML asoslari.", price: 2_800_000, format: "offline", location: "Toshkent", duration: "8 oy", phone: "+998714567890", color: "navy", icon: "chart", status: "paused", views: 420 } }),
    prisma.listing.create({ data: { userId: teachers[0].id, categoryId: cat.dasturlash.id, title: "Node.js Backend", slug: "nodejs-backend", description: "Node.js, Express, MongoDB — backend asoslari.", price: 1_800_000, format: "offline", location: "Toshkent · Chilonzor", duration: "5 oy", phone: "+998711234567", color: "green", icon: "code", status: "rejected", rejectReason: "Surat sifati past, qaytadan yuklang", views: 0 } }),
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
