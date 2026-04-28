import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  const userId = Number((session?.user as { id?: string })?.id);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { name?: unknown; centerName?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const centerName = String(body.centerName ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json({ error: "Ism kamida 2 belgi bo'lishi kerak" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "Ism juda uzun (maksimum 100 belgi)" }, { status: 400 });
  }
  if (centerName.length < 2) {
    return NextResponse.json({ error: "Markaz nomi kamida 2 belgi bo'lishi kerak" }, { status: 400 });
  }
  if (centerName.length > 100) {
    return NextResponse.json({ error: "Markaz nomi juda uzun (maksimum 100 belgi)" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name, centerName, onboardingCompleted: true },
  });

  return NextResponse.json({ ok: true });
}
