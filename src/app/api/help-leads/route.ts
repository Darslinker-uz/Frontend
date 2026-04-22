import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyHelpLead } from "@/lib/bot-handler";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// POST /api/help-leads — body: { name, phone, interest, message? }
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`help:${ip}`, { limit: 3, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Juda ko'p so'rov. Biroz kuting." }, { status: 429 });
  }

  let body: { name?: unknown; phone?: unknown; interest?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const interest = String(body.interest ?? "").trim();
  const message = body.message ? String(body.message).trim() : null;

  if (!name || !phone || !interest) {
    return NextResponse.json({ error: "name, phone, interest majburiy" }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ error: "Ism juda qisqa" }, { status: 400 });
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) {
    return NextResponse.json({ error: "Telefon formati noto'g'ri" }, { status: 400 });
  }

  const lead = await prisma.helpLead.create({
    data: { name, phone, interest, message, status: "new_req" },
  });

  notifyHelpLead({
    name, phone, interest, message, createdAt: lead.createdAt,
  }).catch(e => console.error("[help-lead] telegram notify failed", e));

  return NextResponse.json({ lead }, { status: 201 });
}
