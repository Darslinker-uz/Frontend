import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Returns null if the caller is an admin, otherwise a 401/403 NextResponse.
// Usage:
//   const deny = await requireAdmin();
//   if (deny) return deny;
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
