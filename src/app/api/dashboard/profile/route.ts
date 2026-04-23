import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/dashboard/profile — fetch current user's profile
export async function GET() {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      centerName: true,
      email: true,
      phone: true,
      role: true,
      telegramChatId: true,
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user });
}

// PATCH /api/dashboard/profile — update name / email
export async function PATCH(request: Request) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (name.length < 2) return NextResponse.json({ error: "Ism juda qisqa" }, { status: 400 });
    data.name = name;
  }
  if (body.email !== undefined) {
    if (body.email === null || body.email === "") {
      data.email = null;
    } else if (typeof body.email === "string") {
      const email = body.email.trim();
      if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        return NextResponse.json({ error: "Email formati noto'g'ri" }, { status: 400 });
      }
      data.email = email || null;
    }
  }
  if (body.centerName !== undefined) {
    if (body.centerName === null || body.centerName === "") {
      data.centerName = null;
    } else if (typeof body.centerName === "string") {
      const centerName = body.centerName.trim();
      if (centerName.length > 100) {
        return NextResponse.json({ error: "Markaz nomi juda uzun (maksimum 100 belgi)" }, { status: 400 });
      }
      data.centerName = centerName || null;
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, centerName: true, email: true, phone: true, role: true },
  });

  return NextResponse.json({ user });
}
