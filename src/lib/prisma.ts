// server-only guard — Next.js webpack RSC context'da bundling vaqtida ishlaydi.
// Node CLI scriptlar (bot-poll, sync-courses) uchun bypass qilamiz:
// SKIP_SERVER_ONLY=1 yoki NEXT_RUNTIME yo'q bo'lganda.
if (process.env.NEXT_RUNTIME && !process.env.SKIP_SERVER_ONLY) {
  // Faqat Next.js context'da require — script'larda skip
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("server-only");
}

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Singleton pattern: hot-reload vaqtida qayta-qayta yaratilmasligi uchun
// globalThis'da saqlanadi (Next.js dev mode).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
