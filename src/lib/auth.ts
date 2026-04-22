import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/telegram";
import { authConfig } from "@/lib/auth.config";

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "admin-password",
      name: "Admin password",
      credentials: {
        phone: { label: "Telefon", type: "tel" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;
        const phone = normalizePhone(String(credentials.phone));
        const password = String(credentials.password);
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user || user.role !== "admin" || user.banned) return null;
        if (!user.passwordHash || user.passwordHash !== sha256(password)) return null;
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() },
        });
        return {
          id: String(user.id),
          name: user.name,
          phone: user.phone,
          role: user.role,
        } as { id: string; name: string; phone: string; role: string };
      },
    }),
    Credentials({
      name: "Telegram bot code",
      credentials: {
        phone: { label: "Telefon", type: "tel" },
        code: { label: "Kod", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) return null;

        const phone = normalizePhone(String(credentials.phone));
        const code = String(credentials.code).trim();

        const authCode = await prisma.authCode.findFirst({
          where: {
            phone,
            code,
            usedAt: null,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });
        if (!authCode) return null;

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user || user.banned) return null;

        await prisma.authCode.update({
          where: { id: authCode.id },
          data: { usedAt: new Date() },
        });
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() },
        });

        return {
          id: String(user.id),
          name: user.name,
          phone: user.phone,
          role: user.role,
        } as { id: string; name: string; phone: string; role: string };
      },
    }),
  ],
});
