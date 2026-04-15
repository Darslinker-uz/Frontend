import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Phone OTP",
      credentials: {
        phone: { label: "Telefon", type: "tel" },
        otp: { label: "Kod", type: "text" },
      },
      async authorize(credentials) {
        // TODO: Play Mobile SMS OTP tekshiruv
        // Hozircha demo uchun har qanday kodni qabul qiladi
        if (!credentials?.phone || !credentials?.otp) return null;

        // TODO: DB dan foydalanuvchini topish yoki yaratish
        return {
          id: "1",
          name: "Demo User",
          phone: credentials.phone as string,
          role: "student",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: string }).role;
        token.phone = (user as unknown as { phone: string }).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).phone = token.phone as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
});
