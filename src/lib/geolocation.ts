// GPS coords (lat/lng) → eng yaqin viloyat/tuman topish.
// Haversine formula bilan masofa hisobi. Toshkent shahri uchun tuman ham qaytariladi.

import { REGION_COORDS, TASHKENT_DISTRICT_COORDS, type GeoPoint } from "@/data/region-coords";

// Yer yuzasidagi 2 nuqta orasidagi masofa (km).
function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

function findNearest(coords: GeoPoint[], point: { lat: number; lng: number }): { name: string; distanceKm: number } | null {
  if (coords.length === 0) return null;
  let best: { name: string; distanceKm: number } | null = null;
  for (const c of coords) {
    const d = haversineKm(c, point);
    if (!best || d < best.distanceKm) best = { name: c.name, distanceKm: d };
  }
  return best;
}

export interface DetectedLocation {
  region: string;          // viloyat nomi
  district: string | null; // faqat Toshkent shahri uchun
  distanceKm: number;      // viloyat markazigacha masofa (debug uchun)
}

// GPS coords → viloyat (+ Toshkent uchun tuman).
export function detectLocation(lat: number, lng: number): DetectedLocation | null {
  const region = findNearest(REGION_COORDS, { lat, lng });
  if (!region) return null;

  // Faqat Toshkent shahri uchun tuman aniqlanadi
  let district: string | null = null;
  if (region.name === "Toshkent shahri") {
    const dist = findNearest(TASHKENT_DISTRICT_COORDS, { lat, lng });
    if (dist) district = dist.name;
  }

  return { region: region.name, district, distanceKm: region.distanceKm };
}
