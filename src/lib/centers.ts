// Markaz (User.profileType=CENTER) ma'lumotlarini DB'dan olish va aggregate qilish
if (process.env.NEXT_RUNTIME && !process.env.SKIP_SERVER_ONLY) { require("server-only"); }

import { prisma } from "@/lib/prisma";
import { FORMAT_LABELS } from "@/lib/listings";

// Deterministik gradient — user.id asosida, refresh'larda bir xil qoladi
const GRADIENTS = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #10b981, #06b6d4)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #0ea5e9, #6366f1)",
  "linear-gradient(135deg, #ec4899, #8b5cf6)",
  "linear-gradient(135deg, #14b8a6, #06b6d4)",
  "linear-gradient(135deg, #f97316, #eab308)",
  "linear-gradient(135deg, #a855f7, #ec4899)",
  "linear-gradient(135deg, #ef4444, #f97316)",
  "linear-gradient(135deg, #1e293b, #475569)",
  "linear-gradient(135deg, #84cc16, #22c55e)",
  "linear-gradient(135deg, #3b82f6, #2563eb)",
  "linear-gradient(135deg, #d946ef, #a855f7)",
  "linear-gradient(135deg, #f43f5e, #ec4899)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
];

function gradientForUser(userId: number): string {
  return GRADIENTS[Math.abs(userId) % GRADIENTS.length];
}

// Public sahifadagi grid karta uchun yetarli ma'lumot
export type CenterListItem = {
  id: number;
  slug: string;
  provider: string;
  description: string | null;
  categories: string[];
  regions: string[];
  avgRating: number;
  ratingCount: number;
  courseCount: number;
  imageUrl: string | null;
  gradient: string;
  certificate: boolean;
  firstSlug: string;
  firstCategorySlug: string;
};

// Markaz detail sahifasi uchun to'liq ma'lumot
export type CenterCourseItem = {
  id: number;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  format: string;
  duration: string;
  price: string;
  level: string;
};

export type CenterDetail = CenterListItem & {
  phone: string;
  telegram: string | null;
  instagram: string | null;
  website: string | null;
  foundedYear: number;
  courses: CenterCourseItem[];
};

// Markaz uchun listing shape — Prisma select bilan moslashtirilgan
type ListingForCenter = {
  id: number;
  title: string;
  slug: string;
  price: number;
  format: "offline" | "online" | "video" | "hybrid";
  region: string | null;
  duration: string | null;
  level: string | null;
  certificate: boolean;
  phoneShown: boolean;
  website: string | null;
  instagram: string | null;
  telegram: string | null;
  branches: { region: string | null }[];
  category: { name: string; slug: string };
  ratings: { stars: number }[];
};

// User → listings struktura
type UserWithListings = {
  id: number;
  slug: string | null;
  name: string;
  centerName: string | null;
  bio: string | null;
  phone: string;
  createdAt: Date;
  listings: ListingForCenter[];
};

function userToCenterListItem(u: UserWithListings): CenterListItem {
  const provider = u.centerName?.trim() || u.name;
  const categoriesSet = new Set<string>();
  const regionsSet = new Set<string>();
  let ratingSum = 0;
  let ratingCount = 0;
  let hasCertificate = false;
  let firstSlug = "";
  let firstCategorySlug = "";
  let firstListing = true;

  for (const l of u.listings) {
    if (firstListing) {
      firstSlug = l.slug;
      firstCategorySlug = l.category.slug;
      firstListing = false;
    }
    if (l.category?.name) categoriesSet.add(l.category.name);
    if (l.region) regionsSet.add(l.region);
    for (const b of l.branches) if (b.region) regionsSet.add(b.region);
    if (l.certificate) hasCertificate = true;
    for (const r of l.ratings) {
      ratingSum += r.stars;
      ratingCount++;
    }
  }
  const avgRating = ratingCount > 0 ? ratingSum / ratingCount : 0;

  return {
    id: u.id,
    slug: u.slug ?? "",
    provider,
    description: u.bio,
    categories: Array.from(categoriesSet),
    regions: Array.from(regionsSet),
    avgRating,
    ratingCount,
    courseCount: u.listings.length,
    imageUrl: null,
    gradient: gradientForUser(u.id),
    certificate: hasCertificate,
    firstSlug,
    firstCategorySlug,
  };
}

const formatPrice = (p: number): string =>
  p === 0 ? "Bepul" : new Intl.NumberFormat("uz-UZ").format(p) + " so'm";

function listingToCenterCourse(l: ListingForCenter): CenterCourseItem {
  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    category: l.category.name,
    categorySlug: l.category.slug,
    format: FORMAT_LABELS[l.format] ?? "Online",
    duration: l.duration ?? "—",
    price: formatPrice(l.price),
    level: l.level ?? "—",
  };
}

// Aktiv markazlar ro'yxati — public /oquv-markazlar uchun
// CENTER profileType + aktiv listing'i bor + slug to'ldirilgan
// opts.region — faqat shu viloyatda (region yoki branch.region match) listing'i bor markazlar
export async function getActiveCenters(opts?: { region?: string }): Promise<CenterListItem[]> {
  const regionFilter = opts?.region;
  const users = await prisma.user.findMany({
    where: {
      // profileType emas — listingType orqali filter qilamiz
      // User'da kamida 1 ta COURSE listing bo'lsa, /oquv-markazlar'da chiqadi
      role: "provider",
      banned: false,
      slug: { not: null },
      // Listing'i bor — bo'sh markazlarni public sahifada ko'rsatmaymiz
      listings: {
        some: {
          status: "active",
          listingType: "COURSE", // /oquv-markazlar — faqat markaz kurslari
          category: { active: true, pendingApproval: false },
          ...(regionFilter
            ? {
                OR: [
                  { region: regionFilter },
                  { branches: { some: { region: regionFilter } } },
                ],
              }
            : {}),
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      centerName: true,
      bio: true,
      phone: true,
      createdAt: true,
      listings: {
        where: {
          status: "active",
          listingType: "COURSE", // detail sahifa — faqat markaz kurslari
          category: { active: true, pendingApproval: false },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          format: true,
          region: true,
          duration: true,
          level: true,
          certificate: true,
          phoneShown: true,
          website: true,
          instagram: true,
          telegram: true,
          branches: { select: { region: true } },
          category: { select: { name: true, slug: true } },
          ratings: { select: { stars: true } },
        },
      },
    },
  });

  return users.map(userToCenterListItem);
}

// Bitta markazni slug bo'yicha topish — /oquv-markazlar/[slug] uchun
export async function getCenterBySlug(slug: string): Promise<CenterDetail | null> {
  const u = await prisma.user.findFirst({
    where: {
      slug,
      role: "provider",
      banned: false,
      // Markaz sahifasi — kamida 1 ta COURSE listing'i bo'lsin
      listings: {
        some: {
          status: "active",
          listingType: "COURSE",
          category: { active: true, pendingApproval: false },
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      centerName: true,
      bio: true,
      phone: true,
      createdAt: true,
      listings: {
        where: {
          status: "active",
          listingType: "COURSE", // detail sahifa — faqat markaz kurslari
          category: { active: true, pendingApproval: false },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          format: true,
          region: true,
          duration: true,
          level: true,
          certificate: true,
          phoneShown: true,
          website: true,
          instagram: true,
          telegram: true,
          branches: { select: { region: true } },
          category: { select: { name: true, slug: true } },
          ratings: { select: { stars: true } },
        },
      },
    },
  });

  if (!u) return null;

  const base = userToCenterListItem(u);
  // Telegram/Instagram/Website — bizda User'da yo'q, listing'lardan birinchi mavjudini olamiz
  const firstListingWithLinks = u.listings.find(l => l.telegram || l.instagram || l.website) ?? null;

  return {
    ...base,
    phone: u.phone,
    telegram: firstListingWithLinks?.telegram ?? null,
    instagram: firstListingWithLinks?.instagram ?? null,
    website: firstListingWithLinks?.website ?? null,
    foundedYear: u.createdAt.getFullYear(),
    courses: u.listings.map(listingToCenterCourse),
  };
}

// O'xshash markazlar — kategoriya bo'yicha mos keluvchi 3 ta
export async function getRelatedCenters(currentId: number, categories: string[], limit = 3): Promise<CenterListItem[]> {
  if (categories.length === 0) return [];
  const users = await prisma.user.findMany({
    where: {
      id: { not: currentId },
      // profileType emas — listingType orqali filter qilamiz
      // User'da kamida 1 ta COURSE listing bo'lsa, /oquv-markazlar'da chiqadi
      role: "provider",
      banned: false,
      slug: { not: null },
      listings: {
        some: {
          status: "active",
          category: {
            name: { in: categories },
            active: true,
            pendingApproval: false,
          },
        },
      },
    },
    take: limit,
    select: {
      id: true,
      slug: true,
      name: true,
      centerName: true,
      bio: true,
      phone: true,
      createdAt: true,
      listings: {
        where: {
          status: "active",
          listingType: "COURSE", // detail sahifa — faqat markaz kurslari
          category: { active: true, pendingApproval: false },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          format: true,
          region: true,
          duration: true,
          level: true,
          certificate: true,
          phoneShown: true,
          website: true,
          instagram: true,
          telegram: true,
          branches: { select: { region: true } },
          category: { select: { name: true, slug: true } },
          ratings: { select: { stars: true } },
        },
      },
    },
  });

  return users.map(userToCenterListItem);
}
