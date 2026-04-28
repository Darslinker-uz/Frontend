import type { NextAuthConfig } from "next-auth";

// Edge-safe config — shared between middleware and full auth.
// Must NOT import Prisma, bcrypt, or any Node-only module.
export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/center" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as unknown as { id: string; role: string; phone: string; onboardingCompleted?: boolean };
        token.userId = u.id;
        token.role = u.role;
        token.phone = u.phone;
        token.onboardingCompleted = u.onboardingCompleted ?? true;
      }
      // When session is updated (useSession().update()) after completing onboarding,
      // flip the flag in the token so subsequent middleware checks see it true.
      if (trigger === "update" && session?.onboardingCompleted === true) {
        token.onboardingCompleted = true;
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
        s.onboardingCompleted = token.onboardingCompleted ?? true;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname, origin } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const u = auth?.user as { role?: string; onboardingCompleted?: boolean } | undefined;
      const role = u?.role;

      // Admin auth pages — always accessible (legacy redirect handled by route file)
      if (pathname === "/admode" || pathname === "/admin/auth") return true;

      // Admin pages — require admin role, else send to /admode
      if (pathname.startsWith("/admode/")) {
        if (!isLoggedIn || role !== "admin") {
          return Response.redirect(new URL("/admode", origin));
        }
        return true;
      }

      // Welcome page — must be logged in; once onboarding is done, bounce away
      if (pathname === "/auth/welcome") {
        if (!isLoggedIn) return Response.redirect(new URL("/center", origin));
        if (u?.onboardingCompleted) return Response.redirect(new URL("/center/home", origin));
        return true;
      }

      // /center bare path is the provider login page — public, always accessible.
      // Anything below /center/* is the provider app and requires auth.
      if (pathname === "/center") return true;
      if (pathname.startsWith("/center/")) {
        if (!isLoggedIn) return false;
        // Only providers (and admins) have a dashboard. Students get sent home.
        if (role === "student") return Response.redirect(new URL("/", origin));
        // Provider hasn't finished onboarding → force welcome page
        if (role === "provider" && u?.onboardingCompleted === false) {
          return Response.redirect(new URL("/auth/welcome", origin));
        }
        return true;
      }
      return true;
    },
  },
};
