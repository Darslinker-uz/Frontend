import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/telegram";
import { authConfig } from "@/lib/auth.config";
import { getAssistant } from "@/lib/assistants";

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
          onboardingCompleted: user.onboardingCompleted,
        } as { id: string; name: string; phone: string; role: string; onboardingCompleted: boolean };
      },
    }),
    Credentials({
      id: "assistant-password",
      name: "Assistant password",
      credentials: {
        phone: { label: "Telefon", type: "tel" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;
        const phone = normalizePhone(String(credentials.phone));
        const password = String(credentials.password);

        // Hardcoded ASSISTANTS dict'iga tekshiruv
        const assistant = getAssistant(phone);
        if (!assistant) return null;
        if (assistant.passwordHash !== sha256(password)) return null;

        // DB'da User yozuvi (find_or_create) — session uchun kerak
        // Role conflict tekshiruvi: agar boshqa rol bilan bo'lsa, kirishga ruxsat bermaymiz
        const existing = await prisma.user.findUnique({ where: { phone } });
        if (existing && existing.role !== "assistant") return null;
        if (existing && existing.banned) return null;

        const user = existing ?? await prisma.user.create({
          data: {
            name: assistant.name,
            phone,
            passwordHash: assistant.passwordHash,
            role: "assistant",
            onboardingCompleted: true,
          },
        });
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date(), name: assistant.name },
        });

        return {
          id: String(user.id),
          name: assistant.name,
          phone: user.phone,
          role: user.role,
          onboardingCompleted: true,
        } as { id: string; name: string; phone: string; role: string; onboardingCompleted: boolean };
      },
    }),
    Credentials({
      name: "Telegram bot code",
      credentials: {
        phone: { label: "Telefon", type: "tel" },
        code: { label: "Kod", type: "text" },
        expectedRole: { label: "Expected role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) return null;

        const phone = normalizePhone(String(credentials.phone));
        const code = String(credentials.code).trim();
        const expectedRole = credentials?.expectedRole ? String(credentials.expectedRole) : null;

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
        // Gate by role — /center accepts only providers, /student accepts only students.
        // Admins always sign in via the password flow, so they never end up here.
        if (expectedRole && user.role !== expectedRole) return null;

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
          onboardingCompleted: user.onboardingCompleted,
        } as { id: string; name: string; phone: string; role: string; onboardingCompleted: boolean };
      },
    }),
  ],
});
