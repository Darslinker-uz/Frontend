// Server'da ham client'da ham ishlatish mumkin — "use client" yo'q.
// Course (lib/listings.ts'dan) → Slide (FeaturedSlider'da render uchun).
import { GRADIENT_OPTIONS, ICON_OPTIONS, type Course } from "@/data/courses";

const DEFAULT_GRADIENT = GRADIENT_OPTIONS[0].value;
const DEFAULT_ICON = ICON_OPTIONS[0].path;

export interface Slide {
  slug: string;
  categorySlug: string;
  category: string;
  format: string;
  location: string;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  gradient: string;
  iconPath: string;
  imageUrl: string | null;
  imageAPosX: number;
  imageAPosY: number;
  imageAMPosX: number;
  imageAMPosY: number;
  imageAZoom: number;
  imageAMZoom: number;
  imageDarkness?: number;
}

export function courseToSlide(c: Course): Slide {
  return {
    slug: c.slug,
    categorySlug: c.categorySlug,
    category: c.category,
    format: c.format,
    location: c.district || c.region || c.location || "Online",
    title: c.title,
    subtitle: c.provider,
    price: c.priceFree ? "Bepul" : `${c.price} so'm`,
    duration: c.duration ?? "—",
    gradient: c.gradient ?? DEFAULT_GRADIENT,
    iconPath: c.iconPath ?? DEFAULT_ICON,
    imageUrl: c.imageUrl ?? null,
    imageAPosX: c.imageAPosX ?? 50,
    imageAPosY: c.imageAPosY ?? 50,
    imageAMPosX: c.imageAMPosX ?? 50,
    imageAMPosY: c.imageAMPosY ?? 50,
    imageAZoom: c.imageAZoom ?? 100,
    imageAMZoom: c.imageAMZoom ?? 100,
    imageDarkness: c.imageDarkness ?? 15,
  };
}
