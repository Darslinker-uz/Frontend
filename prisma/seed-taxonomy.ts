import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Idempotent seed — re-running merges, doesn't duplicate.
// Updates the taxonomy for the SEO/AEO landing pages strategy.

const TAXONOMY: { group: { name: string; slug: string; icon: string; color: string; description: string; order: number }; categories: { name: string; slug: string }[] }[] = [
  {
    group: { name: "Tillar", slug: "tillar", icon: "languages", color: "#22c55e", description: "Xorijiy va mahalliy tillarni o'rganish kurslari", order: 1 },
    categories: [
      { name: "Ingliz tili", slug: "ingliz-tili" },
      { name: "IELTS", slug: "ielts" },
      { name: "TOEFL", slug: "toefl" },
      { name: "CEFR", slug: "cefr" },
      { name: "Rus tili", slug: "rus-tili" },
      { name: "Koreys tili", slug: "koreys-tili" },
      { name: "Yapon tili", slug: "yapon-tili" },
      { name: "Xitoy tili", slug: "xitoy-tili" },
      { name: "Nemis tili", slug: "nemis-tili" },
      { name: "Fransuz tili", slug: "fransuz-tili" },
      { name: "Arab tili", slug: "arab-tili" },
      { name: "Turk tili", slug: "turk-tili" },
      { name: "Ispan tili", slug: "ispan-tili" },
      { name: "Italyan tili", slug: "italyan-tili" },
      { name: "O'zbek tili (chet elliklar uchun)", slug: "ozbek-tili" },
    ],
  },
  {
    group: { name: "IT & Dasturlash", slug: "it", icon: "code", color: "#3b82f6", description: "Dasturlash, kiberxavfsizlik, AI va boshqa IT yo'nalishlar", order: 2 },
    categories: [
      { name: "Frontend", slug: "frontend" },
      { name: "Backend", slug: "backend" },
      { name: "Full-stack", slug: "fullstack" },
      { name: "Mobile dasturlash", slug: "mobile-dasturlash" },
      { name: "iOS dasturlash", slug: "ios-dasturlash" },
      { name: "Android dasturlash", slug: "android-dasturlash" },
      { name: "Python", slug: "python" },
      { name: "JavaScript", slug: "javascript" },
      { name: "React", slug: "react" },
      { name: "Node.js", slug: "nodejs" },
      { name: "DevOps", slug: "devops" },
      { name: "Data Science", slug: "data-science" },
      { name: "Machine Learning", slug: "machine-learning" },
      { name: "Sun'iy intellekt (AI)", slug: "sunyi-intellekt" },
      { name: "Prompt Engineering", slug: "prompt-engineering" },
      { name: "Kiberxavfsizlik", slug: "kiberxavfsizlik" },
      { name: "Game Development", slug: "game-dev" },
      { name: "Ma'lumotlar bazasi (SQL)", slug: "ma-lumotlar-bazasi" },
      { name: "QA / Testing", slug: "qa-testing" },
      { name: "Cloud (AWS/GCP/Azure)", slug: "cloud" },
    ],
  },
  {
    group: { name: "Biznes & Marketing", slug: "biznes", icon: "briefcase", color: "#f59e0b", description: "Marketing, sotuv, tadbirkorlik va boshqa biznes ko'nikmalari", order: 3 },
    categories: [
      { name: "Digital marketing", slug: "digital-marketing" },
      { name: "SMM", slug: "smm" },
      { name: "SEO", slug: "seo" },
      { name: "Kontekst reklama", slug: "kontekst-reklama" },
      { name: "Email marketing", slug: "email-marketing" },
      { name: "Brending", slug: "brending" },
      { name: "Copywriting", slug: "copywriting" },
      { name: "Tadbirkorlik", slug: "tadbirkorlik" },
      { name: "Boshqaruv", slug: "boshqaruv" },
      { name: "Moliya", slug: "moliya" },
      { name: "Investitsiya", slug: "investitsiya" },
      { name: "HR", slug: "hr" },
      { name: "Sotuv", slug: "sotuv" },
      { name: "Buxgalteriya", slug: "buxgalteriya" },
      { name: "Loyiha boshqaruvi", slug: "loyiha-boshqaruvi" },
    ],
  },
  {
    group: { name: "Dizayn & San'at", slug: "dizayn", icon: "palette", color: "#06b6d4", description: "UI/UX, grafik dizayn, motion va kreativ kasblar", order: 4 },
    categories: [
      { name: "UI/UX dizayn", slug: "ui-ux" },
      { name: "Grafik dizayn", slug: "grafik-dizayn" },
      { name: "Figma", slug: "figma" },
      { name: "Photoshop", slug: "photoshop" },
      { name: "Illustrator", slug: "illustrator" },
      { name: "3D modeling", slug: "3d-modeling" },
      { name: "Motion dizayn", slug: "motion-dizayn" },
      { name: "Video editing", slug: "video-editing" },
      { name: "Fotografiya", slug: "fotografiya" },
      { name: "Rasm chizish", slug: "rasm-chizish" },
      { name: "Musiqa", slug: "musiqa" },
      { name: "Raqs", slug: "raqs" },
    ],
  },
  {
    group: { name: "Akademik fanlar", slug: "akademik", icon: "book", color: "#0ea5e9", description: "Matematika, fizika, kimyo va imtihonga tayyorgarlik", order: 5 },
    categories: [
      { name: "Matematika", slug: "matematika" },
      { name: "Fizika", slug: "fizika" },
      { name: "Kimyo", slug: "kimyo" },
      { name: "Biologiya", slug: "biologiya" },
      { name: "Tarix", slug: "tarix" },
      { name: "Geografiya", slug: "geografiya" },
      { name: "Adabiyot", slug: "adabiyot" },
      { name: "Olimpiada", slug: "olimpiada" },
      { name: "DTM tayyorgarlik", slug: "dtm" },
      { name: "SAT / GMAT / GRE", slug: "sat-gmat" },
    ],
  },
  {
    group: { name: "Bolalar uchun", slug: "bolalar", icon: "smile", color: "#ec4899", description: "5-15 yoshdagi bolalar uchun ta'lim yo'nalishlari", order: 6 },
    categories: [
      { name: "Bolalar dasturlash", slug: "bolalar-dasturlash" },
      { name: "Robotika", slug: "robotika" },
      { name: "Bolalar ingliz tili", slug: "bolalar-ingliz-tili" },
      { name: "Shaxmat", slug: "shaxmat" },
      { name: "Bolalar matematika", slug: "bolalar-matematika" },
      { name: "Bolalar rasm chizish", slug: "bolalar-rasm" },
      { name: "Bolalar musiqa", slug: "bolalar-musiqa" },
      { name: "Bolalar sporti", slug: "bolalar-sport" },
      { name: "Erta rivojlanish", slug: "erta-rivojlanish" },
      { name: "Tezkor o'qish", slug: "tezkor-oqish" },
    ],
  },
  {
    group: { name: "Kasbiy ko'nikmalar", slug: "kasbiy", icon: "tools", color: "#8b5cf6", description: "Avto haydash, kulinariya, fitnes va boshqa kasbiy yo'nalishlar", order: 7 },
    categories: [
      { name: "Avtomobil haydash", slug: "avto-haydash" },
      { name: "Kulinariya", slug: "kulinariya" },
      { name: "Konditerlik", slug: "konditerlik" },
      { name: "Fitnes", slug: "fitnes" },
      { name: "Yoga", slug: "yoga" },
      { name: "Massaj", slug: "massaj" },
      { name: "Manikur va pedikur", slug: "manikur" },
      { name: "Soch turmaklash", slug: "soch-turmaklash" },
      { name: "Vizaj", slug: "vizaj" },
      { name: "Avto-remont", slug: "avto-remont" },
    ],
  },
];

async function main() {
  console.log("Taxonomy seed boshlandi...");

  let groupCount = 0;
  let categoryCount = 0;

  for (const item of TAXONOMY) {
    const group = await prisma.categoryGroup.upsert({
      where: { slug: item.group.slug },
      create: item.group,
      update: item.group,
    });
    groupCount++;

    for (let i = 0; i < item.categories.length; i++) {
      const cat = item.categories[i];
      await prisma.category.upsert({
        where: { slug: cat.slug },
        create: { name: cat.name, slug: cat.slug, groupId: group.id, order: i },
        update: { name: cat.name, groupId: group.id, order: i },
      });
      categoryCount++;
    }
  }

  console.log(`✓ ${groupCount} guruh, ${categoryCount} yo'nalish`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
