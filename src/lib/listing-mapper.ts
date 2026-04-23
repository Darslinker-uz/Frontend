// Client-safe mapper — no Prisma imports. Converts API listing shape into
// the Course type used by public UI components.

import { GRADIENT_OPTIONS, ICON_OPTIONS, type Course } from "@/data/courses";

const DEFAULT_GRADIENT = GRADIENT_OPTIONS[0].value;
const DEFAULT_ICON_PATH = ICON_OPTIONS[0].path;

const FORMAT_LABELS: Record<"offline" | "online" | "video", Course["format"]> = {
  offline: "Offline",
  online: "Online",
  video: "Video",
};

export interface ApiListing {
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
  imagePosX?: number;
  imagePosY?: number;
  imageAPosX?: number;
  imageAPosY?: number;
  imageAMPosX?: number;
  imageAMPosY?: number;
  imageCPosX?: number;
  imageCPosY?: number;
  imageCMPosX?: number;
  imageCMPosY?: number;
  imageZoom?: number;
  imageAZoom?: number;
  imageAMZoom?: number;
  imageCZoom?: number;
  imageCMZoom?: number;
  views: number;
  category: { id: number; name: string; slug: string; color: string | null };
  user: { id: number; name: string; centerName?: string | null };
  _count?: { leads: number };
}

export function apiListingToCourse(l: ApiListing): Course {
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
    imagePosX: l.imagePosX ?? 50,
    imagePosY: l.imagePosY ?? 50,
    imageAPosX: l.imageAPosX ?? 50,
    imageAPosY: l.imageAPosY ?? 50,
    imageAMPosX: l.imageAMPosX ?? 50,
    imageAMPosY: l.imageAMPosY ?? 50,
    imageCPosX: l.imageCPosX ?? 50,
    imageCPosY: l.imageCPosY ?? 50,
    imageCMPosX: l.imageCMPosX ?? 50,
    imageCMPosY: l.imageCMPosY ?? 50,
    imageZoom: l.imageZoom ?? 100,
    imageAZoom: l.imageAZoom ?? 100,
    imageAMZoom: l.imageAMZoom ?? 100,
    imageCZoom: l.imageCZoom ?? 100,
    imageCMZoom: l.imageCMZoom ?? 100,
  };
}
