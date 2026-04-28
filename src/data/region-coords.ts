// Viloyat va Toshkent shahri tumanlari uchun lat/lng markazlari.
// GPS coords → eng yaqin viloyat/tuman aniqlash uchun ishlatiladi.
// Hammasi taxminiy markaz nuqtalari (Wikipedia/Google Maps).

export interface GeoPoint {
  name: string;
  lat: number;
  lng: number;
}

// 14 ta viloyat markazi
export const REGION_COORDS: GeoPoint[] = [
  { name: "Toshkent shahri",   lat: 41.3111, lng: 69.2797 },
  { name: "Toshkent viloyati", lat: 41.0000, lng: 69.5000 },
  { name: "Samarqand",         lat: 39.6542, lng: 66.9597 },
  { name: "Buxoro",            lat: 39.7747, lng: 64.4286 },
  { name: "Andijon",           lat: 40.7821, lng: 72.3442 },
  { name: "Farg'ona",          lat: 40.3894, lng: 71.7869 },
  { name: "Namangan",          lat: 40.9983, lng: 71.6726 },
  { name: "Qashqadaryo",       lat: 38.8400, lng: 65.7900 },
  { name: "Surxondaryo",       lat: 37.2242, lng: 67.2783 },
  { name: "Xorazm",            lat: 41.5500, lng: 60.6314 },
  { name: "Navoiy",            lat: 40.0844, lng: 65.3792 },
  { name: "Jizzax",            lat: 40.1158, lng: 67.8422 },
  { name: "Sirdaryo",          lat: 40.4897, lng: 68.7842 },
  { name: "Qoraqalpog'iston",  lat: 42.4731, lng: 59.6103 },
];

// Toshkent shahri tumanlari (12 ta)
export const TASHKENT_DISTRICT_COORDS: GeoPoint[] = [
  { name: "Bektemir",       lat: 41.2256, lng: 69.3553 },
  { name: "Chilonzor",      lat: 41.2756, lng: 69.2050 },
  { name: "Mirobod",        lat: 41.2911, lng: 69.2706 },
  { name: "Mirzo Ulug'bek", lat: 41.3300, lng: 69.3000 },
  { name: "Olmazor",        lat: 41.3478, lng: 69.2256 },
  { name: "Sergeli",        lat: 41.2233, lng: 69.2389 },
  { name: "Shayxontohur",   lat: 41.3225, lng: 69.2403 },
  { name: "Uchtepa",        lat: 41.2900, lng: 69.1700 },
  { name: "Yakkasaroy",     lat: 41.2917, lng: 69.2467 },
  { name: "Yangihayot",     lat: 41.2200, lng: 69.2700 },
  { name: "Yashnobod",      lat: 41.2950, lng: 69.3100 },
  { name: "Yunusobod",      lat: 41.3650, lng: 69.2850 },
];
