// Repetitor (User.profileType=TUTOR) ma'lumotlarini DB'dan olish va aggregate qilish
// Markazlar lib'ining aynan parallel versiyasi — faqat profileType bo'yicha farq qiladi
if (process.env.NEXT_RUNTIME && !process.env.SKIP_SERVER_ONLY) { require("server-only"); }

import { prisma } from "@/lib/prisma";
import { FORMAT_LABELS } from "@/lib/listings";

// Repetitor uchun deterministik gradient — markazlardan farqli rang palitra
// (vizual ajratish: markaz — sovuq ranglar, repetitor — issiq ranglar)
const GRADIENTS = [
  "linear-gradient(135deg, #a855f7, #ec4899)",
  "linear-gradient(135deg, #f43f5e, #ec4899)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #d946ef, #a855f7)",
  "linear-gradient(135deg, #be123c, #f43f5e)",
  "linear-gradient(135deg, #c026d3, #ec4899)",
  "linear-gradient(135deg, #9333ea, #d946ef)",
  "linear-gradient(135deg, #db2777, #f43f5e)",
  "linear-gradient(135deg, #ea580c, #f97316)",
  "linear-gradient(135deg, #7c3aed, #a78bfa)",
  "linear-gradient(135deg, #b91c1c, #ea580c)",
  "linear-gradient(135deg, #a21caf, #c026d3)",
  "linear-gradient(135deg, #b45309, #d97706)",
  "linear-gradient(135deg, #92400e, #ea580c)",
];

function gradientForUser(userId: number): string {
  return GRADIENTS[Math.abs(userId) % GRADIENTS.length];
}

// Public sahifadagi grid karta uchun yetarli ma'lumot
export type TutorListItem = {
  id: number;
  slug: string;
  fullName: string;
  description: string | null;
  subjects: string[];
  regions: string[];
  avgRating: number;
  ratingCount: number;
  courseCount: number;
  imageUrl: string | null;
  gradient: string;
  firstSlug: string;
  firstCategorySlug: string;
};

// Repetitor detail sahifasi uchun
export type TutorCourseItem = {
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

export type TutorDetail = TutorListItem & {
  phone: string;
  telegram: string | null;
  instagram: string | null;
  website: string | null;
  // Repetitor uchun "founded year" o'rniga "ish boshlangan yil"
  startedYear: number;
  courses: TutorCourseItem[];
};

type ListingForTutor = {
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

type UserWithListings = {
  id: number;
  slug: string | null;
  name: string;
  centerName: string | null;
  bio: string | null;
  phone: string;
  createdAt: Date;
  listings: ListingForTutor[];
};

function userToTutorListItem(u: UserWithListings): TutorListItem {
  // TUTOR uchun fullName = User.name (shaxs ismi), centerName ishlatilmaydi
  const fullName = u.name;
  const subjectsSet = new Set<string>();
  const regionsSet = new Set<string>();
  let ratingSum = 0;
  let ratingCount = 0;
  let firstSlug = "";
  let firstCategorySlug = "";
  let firstListing = true;

  for (const l of u.listings) {
    if (firstListing) {
      firstSlug = l.slug;
      firstCategorySlug = l.category.slug;
      firstListing = false;
    }
    if (l.category?.name) subjectsSet.add(l.category.name);
    if (l.region) regionsSet.add(l.region);
    for (const b of l.branches) if (b.region) regionsSet.add(b.region);
    for (const r of l.ratings) {
      ratingSum += r.stars;
      ratingCount++;
    }
  }
  const avgRating = ratingCount > 0 ? ratingSum / ratingCount : 0;

  return {
    id: u.id,
    slug: u.slug ?? "",
    fullName,
    description: u.bio,
    subjects: Array.from(subjectsSet),
    regions: Array.from(regionsSet),
    avgRating,
    ratingCount,
    courseCount: u.listings.length,
    imageUrl: null,
    gradient: gradientForUser(u.id),
    firstSlug,
    firstCategorySlug,
  };
}

const formatPrice = (p: number): string =>
  p === 0 ? "Bepul" : new Intl.NumberFormat("uz-UZ").format(p) + " so'm";

function listingToTutorCourse(l: ListingForTutor): TutorCourseItem {
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

// Aktiv repetitorlar ro'yxati — public /repetitorlar uchun
export async function getActiveTutors(): Promise<TutorListItem[]> {
  const users = await prisma.user.findMany({
    where: {
      // profileType emas — listingType orqali filter (switch mode)
      role: "provider",
      banned: false,
      slug: { not: null },
      listings: {
        some: {
          status: "active",
          listingType: "TUTOR_SERVICE", // /repetitorlar — faqat repetitor xizmatlari
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
          listingType: "TUTOR_SERVICE", // detail sahifa — faqat repetitor xizmatlari
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

  return users.map(userToTutorListItem);
}

// Bitta repetitorni slug bo'yicha topish — /repetitorlar/[slug] uchun
export async function getTutorBySlug(slug: string): Promise<TutorDetail | null> {
  const u = await prisma.user.findFirst({
    where: {
      slug,
      role: "provider",
      banned: false,
      // Repetitor sahifasi — kamida 1 ta TUTOR_SERVICE listing bo'lishi shart
      listings: {
        some: {
          status: "active",
          listingType: "TUTOR_SERVICE",
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
          listingType: "TUTOR_SERVICE", // detail sahifa — faqat repetitor xizmatlari
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

  const base = userToTutorListItem(u);
  const firstListingWithLinks = u.listings.find(l => l.telegram || l.instagram || l.website) ?? null;

  return {
    ...base,
    phone: u.phone,
    telegram: firstListingWithLinks?.telegram ?? null,
    instagram: firstListingWithLinks?.instagram ?? null,
    website: firstListingWithLinks?.website ?? null,
    startedYear: u.createdAt.getFullYear(),
    courses: u.listings.map(listingToTutorCourse),
  };
}

// O'xshash repetitorlar — fan bo'yicha mos keluvchi 3 ta
export async function getRelatedTutors(currentId: number, subjects: string[], limit = 3): Promise<TutorListItem[]> {
  if (subjects.length === 0) return [];
  const users = await prisma.user.findMany({
    where: {
      id: { not: currentId },
      // profileType emas — listingType orqali filter (switch mode)
      role: "provider",
      banned: false,
      slug: { not: null },
      listings: {
        some: {
          status: "active",
          category: {
            name: { in: subjects },
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
          listingType: "TUTOR_SERVICE", // detail sahifa — faqat repetitor xizmatlari
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

  return users.map(userToTutorListItem);
}
