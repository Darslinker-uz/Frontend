import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge-safe middleware — uses authConfig (no Prisma imports).
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/center/:path*", "/admode", "/admode/:path*", "/auth/welcome"],
};
