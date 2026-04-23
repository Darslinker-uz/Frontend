import { prisma } from "@/lib/prisma";
import { GRADIENT_OPTIONS, ICON_OPTIONS, type Course } from "@/data/courses";

const DEFAULT_GRADIENT = GRADIENT_OPTIONS[0].value;
const DEFAULT_ICON_PATH = ICON_OPTIONS[0].path;

const FORMAT_LABELS: Record<"offline" | "online" | "video", Course["format"]> = {
  offline: "Offline",
  online: "Online",
  video: "Video",
};

interface ListingFromDb {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  format: "offline" | "online" | "video";
  location: string | null;
  duration: string | null;
  color: string | null;
  icon: string | null;
  imageUrl: string | null;
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
  category: { name: string; slug: string } | null;
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
  return {
    slug: l.slug,
    title: l.title,
    category: l.category?.name ?? "—",
    categorySlug: l.category?.slug ?? "",
    format: FORMAT_LABELS[l.format] ?? "Online",
    provider: l.user?.centerName ?? l.user?.name ?? "—",
    location: l.location ?? "",
    price,
    priceFree: l.price === 0,
    rating: "5.0",
    duration: l.duration ?? "—",
    description: l.description ?? "",
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
  };
}

export async function getActiveListings(options?: { categorySlug?: string; limit?: number }): Promise<Course[]> {
  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
      ...(options?.categorySlug ? { category: { slug: options.categorySlug } } : {}),
    },
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
    take: options?.limit,
    select: {
      id: true, title: true, slug: true, description: true, price: true,
      format: true, location: true, duration: true, color: true, icon: true, imageUrl: true, imagePosX: true, imagePosY: true, imageAPosX: true, imageAPosY: true, imageAMPosX: true, imageAMPosY: true, imageCPosX: true, imageCPosY: true, imageCMPosX: true, imageCMPosY: true, imageZoom: true, imageAZoom: true, imageAMZoom: true, imageCZoom: true, imageCMZoom: true, views: true,
      category: { select: { name: true, slug: true } },
      user: { select: { name: true, centerName: true } },
    },
  });
  return listings.map(listingToCourse);
}

export async function getListingBySlug(slug: string): Promise<{ course: Course; id: number } | null> {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    select: {
      id: true, title: true, slug: true, description: true, price: true,
      format: true, location: true, duration: true, color: true, icon: true, imageUrl: true, imagePosX: true, imagePosY: true, imageAPosX: true, imageAPosY: true, imageAMPosX: true, imageAMPosY: true, imageCPosX: true, imageCPosY: true, imageCMPosX: true, imageCMPosY: true, imageZoom: true, imageAZoom: true, imageAMZoom: true, imageCZoom: true, imageCMZoom: true, views: true,
      status: true, phone: true,
      category: { select: { name: true, slug: true } },
      user: { select: { name: true, centerName: true } },
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
          format: true, location: true, duration: true, color: true, icon: true, imageUrl: true,
          imagePosX: true, imagePosY: true, imageAPosX: true, imageAPosY: true, imageAMPosX: true, imageAMPosY: true, imageCPosX: true, imageCPosY: true, imageCMPosX: true, imageCMPosY: true, imageZoom: true, imageAZoom: true, imageAMZoom: true, imageCZoom: true, imageCMZoom: true, views: true, status: true,
          category: { select: { name: true, slug: true } },
          user: { select: { name: true, centerName: true } },
        },
      },
    },
  });
  return boosts
    .map(b => b.listing)
    .filter(l => l.status === "active")
    .map(listingToCourse);
}

export async function getActiveCategories() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: {
      name: true,
      slug: true,
      description: true,
      subcategories: true,
      _count: { select: { listings: { where: { status: "active" } } } },
    },
  });
  return categories.map(c => ({
    name: c.name,
    slug: c.slug,
    desc: c.description ?? "",
    count: c._count.listings,
    subcategories: c.subcategories,
  }));
}
