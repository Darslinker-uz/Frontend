import type { NextAuthConfig } from "next-auth";

// Edge-safe config — shared between middleware and full auth.
// Must NOT import Prisma, bcrypt, or any Node-only module.
export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/auth" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id: string; role: string; phone: string };
        token.userId = u.id;
        token.role = u.role;
        token.phone = u.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const s = session.user as any;
        s.id = token.userId;
        s.role = token.role;
        s.phone = token.phone;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname, origin } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;

      // Admin auth page — always accessible
      if (pathname === "/admin/auth") return true;

      // Admin pages — require admin role, else redirect to /admin/auth
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn || role !== "admin") {
          return Response.redirect(new URL("/admin/auth", origin));
        }
        return true;
      }

      if (pathname.startsWith("/dashboard")) {
        return isLoggedIn;
      }
      return true;
    },
  },
};
