import { prisma } from "@/lib/prisma";
import { GRADIENT_OPTIONS, ICON_OPTIONS, type Course } from "@/data/courses";

const DEFAULT_GRADIENT = GRADIENT_OPTIONS[0].value;
const DEFAULT_ICON_PATH = ICON_OPTIONS[0].path;

const FORMAT_LABELS: Record<"offline" | "online" | "video" | "hybrid", Course["format"]> = {
  offline: "Offline",
  online: "Online",
  video: "Video",
  hybrid: "Gibrid",
};

interface ListingBranch {
  region: string | null;
  district: string | null;
  address: string | null;
  sortOrder?: number;
}

interface ListingFromDb {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  format: "offline" | "online" | "video" | "hybrid";
  location: string | null;
  region: string | null;
  district: string | null;
  duration: string | null;
  lessons: string[];
  ratings?: { stars: number }[];
  color: string | null;
  icon: string | null;
  imageUrl: string | null;
  branches?: ListingBranch[];
  levels?: string[];
  imagePosX: number;
  imagePosY: number;
  imageAPosX: number;
  imageAPosY: number;
  imageAMPosX: number;
  imageAMPosY: number;
  imageCPosX: number;
  imageCPosY: number;
  imageCMPosX: number;
  imageCMPosY: number;
  imageZoom: number;
  imageAZoom: number;
  imageAMZoom: number;
  imageCZoom: number;
  imageCMZoom: number;
  views: number;
  language?: string;
  level?: string | null;
  studentLimit?: number | null;
  schedule?: string | null;
  certificate?: boolean;
  demoLesson?: boolean;
  discount?: string | null;
  teacherName?: string | null;
  teacherExperience?: string | null;
  paymentType?: string | null;
  phone?: string | null;
  category: { name: string; slug: string; group?: { name: string; slug: string } | null } | null;
  user: { name: string; centerName?: string | null } | null;
}

export function listingToCourse(l: ListingFromDb): Course {
  const gradient = l.color
    ? (GRADIENT_OPTIONS.find(g => g.id === l.color)?.value ?? DEFAULT_GRADIENT)
    : DEFAULT_GRADIENT;
  const iconPath = l.icon
    ? (ICON_OPTIONS.find(i => i.id === l.icon)?.path ?? DEFAULT_ICON_PATH)
    : DEFAULT_ICON_PATH;
  const price = l.price === 0 ? "Bepul" : new Intl.NumberFormat("uz-UZ").format(l.price);
  const rs = l.ratings ?? [];
  const ratingCount = rs.length;
  const ratingAvg = ratingCount > 0 ? rs.reduce((a, r) => a + r.stars, 0) / ratingCount : 0;
  return {
    slug: l.slug,
    title: l.title,
    category: l.category?.name ?? "—",
    categorySlug: l.category?.slug ?? "",
    groupName: l.category?.group?.name,
    groupSlug: l.category?.group?.slug,
    format: FORMAT_LABELS[l.format] ?? "Online",
    provider: l.user?.centerName ?? l.user?.name ?? "—",
    location: l.location ?? "",
    region: l.region,
    district: l.district,
    branches: (l.branches ?? []).map(b => ({
      region: b.region,
      district: b.district,
      address: b.address,
    })),
    price,
    priceFree: l.price === 0,
    rating: "5.0",
    duration: l.duration ?? "—",
    description: l.description ?? "",
    lessons: l.lessons ?? [],
    gradient,
    iconPath,
    imageUrl: l.imageUrl,
    imagePosX: l.imagePosX,
    imagePosY: l.imagePosY,
    imageAPosX: l.imageAPosX,
    imageAPosY: l.imageAPosY,
    imageAMPosX: l.imageAMPosX,
    imageAMPosY: l.imageAMPosY,
    imageCPosX: l.imageCPosX,
    imageCPosY: l.imageCPosY,
    imageCMPosX: l.imageCMPosX,
    imageCMPosY: l.imageCMPosY,
    imageZoom: l.imageZoom,
    imageAZoom: l.imageAZoom,
    imageAMZoom: l.imageAMZoom,
    imageCZoom: l.imageCZoom,
    imageCMZoom: l.imageCMZoom,
    language: l.language ?? "uz",
    level: l.level ?? undefined,
    levels: l.levels && l.levels.length > 0
      ? l.levels
      : (l.level ? [l.level] : []),
    studentLimit: l.studentLimit ?? undefined,
    schedule: l.schedule ?? undefined,
    certificate: l.certificate ?? false,
    demoLesson: l.demoLesson ?? false,
    discount: l.discount ?? undefined,
    teacherName: l.teacherName ?? undefined,
    teacherExperience: l.teacherExperience ?? undefined,
    paymentType: l.paymentType ?? undefined,
    phone: l.phone ?? undefined,
    ratingAvg,
    ratingCount,
  };
}

export async function getActiveListings(options?: {
  categorySlug?: string;
  groupSlug?: string;
  region?: string;
  district?: string;
  limit?: number;
  // Lokatsiya filter qo'llanganda online/video doim qo'shilsin (har joydan kirish mumkin)
  includeRemote?: boolean;
}): Promise<Course[]> {
  // Lokatsiya filter — yangi 'branches' jadvalida HAR QANDAY filial
  // tanlangan region/tumanga to'g'ri kelsa chiqsin (inclusive). Eski
  // 'region/district' maydonlari ham qo'llab-quvvatlanadi (fallback)
  // — eski e'lonlar uchun ham ishlasin. Onlayn/video doim chiqadi.
  type ListingWhere = NonNullable<Parameters<typeof prisma.listing.findMany>[0]>["where"];
  const locationFilter: ListingWhere = (options?.region || options?.district) ? {
    OR: [
      // Yangi: filiallardan birortasi mos kelsa
      {
        branches: {
          some: {
            ...(options.region ? { region: options.region } : {}),
            ...(options.district ? { district: options.district } : {}),
          },
        },
      },
      // Eski: listing.region/district to'g'ri kelsa (backward compat)
      {
        AND: [
          ...(options.region ? [{ region: options.region }] : []),
          ...(options.district ? [{ district: options.district }] : []),
        ],
      },
      ...(options.includeRemote !== false ? [{ format: { in: ["online" as const, "video" as const] } }] : []),
    ],
  } : {};

  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
      category: {
        active: true,
        pendingApproval: false,
        ...(options?.categorySlug ? { slug: options.categorySlug } : {}),
        ...(options?.groupSlug ? { group: { slug: options.groupSlug } } : {}),
      },
      ...locationFilter,
    },
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
    take: options?.limit,
    select: {
      id: true, title: true, slug: true, description: true, price: true,
      format: true, location: true, region: true, district: true, duration: true, lessons: true, color: true, icon: true, imageUrl: true, imagePosX: true, imagePosY: true, imageAPosX: true, imageAPosY: true, imageAMPosX: true, imageAMPosY: true, imageCPosX: true, imageCPosY: true, imageCMPosX: true, imageCMPosY: true, imageZoom: true, imageAZoom: true, imageAMZoom: true, imageCZoom: true, imageCMZoom: true, views: true,
      language: true, level: true, levels: true, studentLimit: true, schedule: true, certificate: true, demoLesson: true, discount: true, teacherName: true, teacherExperience: true, paymentType: true,
      branches: { select: { region: true, district: true, address: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
      category: { select: { name: true, slug: true, group: { select: { name: true, slug: true } } } },
      user: { select: { name: true, centerName: true } },
      ratings: { select: { stars: true } },
    },
  });
  return listings.map(listingToCourse);
}

export async function getListingBySlug(slug: string): Promise<{ course: Course; id: number } | null> {
  const listing = await prisma.listing.findFirst({
    where: {
      slug,
      // Pending yo'nalishli e'lonlar publik detail'da ham ko'rinmasin
      category: { active: true, pendingApproval: false },
    },
    select: {
      id: true, title: true, slug: true, description: true, price: true,
      format: true, location: true, region: true, district: true, duration: true, lessons: true, color: true, icon: true, imageUrl: true, imagePosX: true, imagePosY: true, imageAPosX: true, imageAPosY: true, imageAMPosX: true, imageAMPosY: true, imageCPosX: true, imageCPosY: true, imageCMPosX: true, imageCMPosY: true, imageZoom: true, imageAZoom: true, imageAMZoom: true, imageCZoom: true, imageCMZoom: true, views: true,
      language: true, level: true, levels: true, studentLimit: true, schedule: true, certificate: true, demoLesson: true, discount: true, teacherName: true, teacherExperience: true, paymentType: true,
      branches: { select: { region: true, district: true, address: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
      status: true, phone: true,
      category: { select: { name: true, slug: true, group: { select: { name: true, slug: true } } } },
      user: { select: { name: true, centerName: true } },
      ratings: { select: { stars: true } },
    },
  });
  if (!listing || listing.status !== "active") return null;
  // Increment views — fire-and-forget
  prisma.listing.update({ where: { id: listing.id }, data: { views: { increment: 1 } } })
    .catch(e => console.error("view increment failed", e));
  return { course: listingToCourse(listing), id: listing.id };
}

export async function getFeaturedListings(): Promise<Course[]> {
  const now = new Date();
  const boosts = await prisma.boost.findMany({
    where: {
      status: "active",
      type: "a_class",
      startDate: { lte: now },
      endDate: { gte: now },
    },
    take: 10,
    orderBy: { startDate: "desc" },
    include: {
      listing: {
        select: {
          id: true, title: true, slug: true, description: true, price: true,
          format: true, location: true, region: true, district: true, duration: true, color: true, icon: true, imageUrl: true,
          imagePosX: true, imagePosY: true, imageAPosX: true, imageAPosY: true, imageAMPosX: true, imageAMPosY: true, imageCPosX: true, imageCPosY: true, imageCMPosX: true, imageCMPosY: true, imageZoom: true, imageAZoom: true, imageAMZoom: true, imageCZoom: true, imageCMZoom: true, views: true, status: true, lessons: true,
          language: true, level: true, levels: true, studentLimit: true, schedule: true, certificate: true, demoLesson: true, discount: true, teacherName: true, teacherExperience: true, paymentType: true,
      branches: { select: { region: true, district: true, address: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
          category: { select: { name: true, slug: true, group: { select: { name: true, slug: true } } } },
          user: { select: { name: true, centerName: true } },
          ratings: { select: { stars: true } },
        },
      },
    },
  });
  return boosts
    .map(b => b.listing)
    .filter(l => l.status === "active")
    .map(listingToCourse);
}

// Public: recent ratings WITH a non-empty comment for the listing detail page.
// Stars are intentionally not exposed — the comment list is purely textual feedback.
// Phone numbers are masked (only operator + last 2 digits visible).
export async function getRecentComments(listingId: number, limit = 200) {
  const rows = await prisma.rating.findMany({
    where: { listingId, comment: { not: null } },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, phone: true, comment: true, createdAt: true },
  });
  return rows.map((r) => ({
    id: r.id,
    comment: r.comment as string,
    createdAt: r.createdAt,
    phoneMasked: maskPhone(r.phone),
  }));
}

function maskPhone(phone: string): string {
  // +998901234567  →  +998 90 *** ** 67
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9) return phone;
  const last2 = digits.slice(-2);
  // Find operator code (positions 3..5 of 998 prefix)
  const op = digits.startsWith("998") ? digits.slice(3, 5) : digits.slice(0, 2);
  const cc = digits.startsWith("998") ? "+998" : "+";
  return `${cc} ${op} *** ** ${last2}`;
}

// Bitta yo'nalish (Category) ro'yxati — listing detail va kategoriya sahifalari uchun.
export async function getActiveCategories() {
  const categories = await prisma.category.findMany({
    where: { active: true, group: { active: true } },
    orderBy: [{ groupId: "asc" }, { order: "asc" }],
    select: {
      name: true,
      slug: true,
      description: true,
      group: { select: { name: true, slug: true } },
      _count: { select: { listings: { where: { status: "active" } } } },
    },
  });
  return categories.map(c => ({
    name: c.name,
    slug: c.slug,
    desc: c.description ?? "",
    count: c._count.listings,
    groupName: c.group.name,
    groupSlug: c.group.slug,
  }));
}

// Guruhlar (top-level taxonomy) — bosh sahifa va megamenu uchun.
export async function getActiveCategoryGroups(opts?: { homepageOnly?: boolean }) {
  const groups = await prisma.categoryGroup.findMany({
    where: {
      active: true,
      ...(opts?.homepageOnly ? { showOnHomepage: true } : {}),
    },
    orderBy: { order: "asc" },
    select: {
      name: true,
      slug: true,
      description: true,
      icon: true,
      color: true,
      showOnHomepage: true,
      _count: { select: { categories: { where: { active: true } } } },
      categories: {
        where: { active: true },
        orderBy: { order: "asc" },
        select: {
          name: true,
          slug: true,
          _count: { select: { listings: { where: { status: "active" } } } },
        },
      },
    },
  });
  return groups.map(g => ({
    name: g.name,
    slug: g.slug,
    desc: g.description ?? "",
    icon: g.icon,
    color: g.color,
    showOnHomepage: g.showOnHomepage,
    categoriesCount: g._count.categories,
    listingsCount: g.categories.reduce((sum, c) => sum + c._count.listings, 0),
    categories: g.categories.map(c => ({
      name: c.name,
      slug: c.slug,
      count: c._count.listings,
    })),
  }));
}
