import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/require-permission";

// GET /api/admin/centers — barcha markazlar (provider + profileType=CENTER) + statistika
export async function GET(request: Request) {
  const deny = await requirePermission("user.view");
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // 'active' | 'banned' | 'pending' | null
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";

  // Filter
  type UserWhere = NonNullable<Parameters<typeof prisma.user.findMany>[0]>["where"];
  const where: UserWhere = {
    role: "provider",
    profileType: "CENTER",
  };
  if (status === "active") {
    where.banned = false;
    where.onboardingCompleted = true;
  } else if (status === "banned") {
    where.banned = true;
  } else if (status === "pending") {
    where.banned = false;
    where.onboardingCompleted = false;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { centerName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  const centers = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      centerName: true,
      slug: true,
      bio: true,
      phone: true,
      email: true,
      telegramChatId: true,
      banned: true,
      onboardingCompleted: true,
      createdAt: true,
      lastActiveAt: true,
      _count: {
        select: { listings: true },
      },
      listings: {
        select: {
          id: true,
          title: true,
          status: true,
          views: true,
          category: { select: { name: true, slug: true } },
        },
      },
    },
  });

  // Aggregate stats — kategoriyalar, viloyatlar (listings'dan)
  const withStats = centers.map(c => {
    const activeListings = c.listings.filter(l => l.status === "active").length;
    const totalViews = c.listings.reduce((a, l) => a + (l.views ?? 0), 0);
    const categories = Array.from(
      new Set(c.listings.map(l => l.category?.name).filter((x): x is string => !!x))
    );
    return {
      id: c.id,
      name: c.name,
      centerName: c.centerName,
      slug: c.slug,
      bio: c.bio,
      phone: c.phone,
      email: c.email,
      telegramChatId: c.telegramChatId,
      banned: c.banned,
      onboardingCompleted: c.onboardingCompleted,
      createdAt: c.createdAt.toISOString(),
      lastActiveAt: c.lastActiveAt.toISOString(),
      listingsTotal: c._count.listings,
      listingsActive: activeListings,
      totalViews,
      categories,
    };
  });

  return NextResponse.json({ centers: withStats });
}
