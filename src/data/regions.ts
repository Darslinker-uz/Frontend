// O'zbekiston bo'yicha viloyat va tumanlar/shaharlar ro'yxati.
// SEO va lokal qidiruv uchun ishlatiladi (e'lon manzili, /kurslar/.../{viloyat} sahifalari).
//
// Toshkent shahri uchun 12 ta tuman ko'rsatilgan.
// Boshqa viloyatlar uchun katta shaharlar.

export interface Region {
  name: string;
  slug: string;
  // "Districts" — Toshkent shahri uchun tumanlar, viloyatlar uchun shaharlar
  districts: string[];
}

// Viloyat nomidan SEO-friendly slug yaratadi.
// Ko'p ishlatiladigan natijalar: "Toshkent shahri" → "toshkent-shahri"
export function regionNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[''ʻ`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Slugdan viloyat nomini topish
export function findRegionBySlug(slug: string): Region | null {
  const normalized = slug.toLowerCase();
  return REGIONS.find(r => r.slug === normalized) ?? null;
}

export const REGIONS: Region[] = [
  {
    name: "Toshkent shahri",
    slug: "toshkent-shahri",
    districts: [
      "Bektemir",
      "Chilonzor",
      "Mirobod",
      "Mirzo Ulug'bek",
      "Olmazor",
      "Sergeli",
      "Shayxontohur",
      "Uchtepa",
      "Yakkasaroy",
      "Yangihayot",
      "Yashnobod",
      "Yunusobod",
    ],
  },
  { name: "Toshkent viloyati", slug: "toshkent-viloyati", districts: ["Chirchiq", "Angren", "Olmaliq", "Bekobod", "Ohangaron", "Nurafshon", "Yangiyo'l", "Parkent"] },
  { name: "Samarqand", slug: "samarqand", districts: ["Samarqand", "Kattaqo'rg'on", "Urgut", "Bulung'ur", "Ishtixon"] },
  { name: "Buxoro", slug: "buxoro", districts: ["Buxoro", "Kogon", "G'ijduvon", "Olot", "Vobkent"] },
  { name: "Andijon", slug: "andijon", districts: ["Andijon", "Asaka", "Xonobod", "Shahrixon", "Marhamat"] },
  { name: "Farg'ona", slug: "fargona", districts: ["Farg'ona", "Marg'ilon", "Quva", "Qo'qon", "Quvasoy"] },
  { name: "Namangan", slug: "namangan", districts: ["Namangan", "Chust", "Pop", "Kosonsoy", "Uchqo'rg'on"] },
  { name: "Qashqadaryo", slug: "qashqadaryo", districts: ["Qarshi", "Shahrisabz", "G'uzor", "Kasbi"] },
  { name: "Surxondaryo", slug: "surxondaryo", districts: ["Termiz", "Denov", "Sherobod"] },
  { name: "Xorazm", slug: "xorazm", districts: ["Urganch", "Xiva", "Xonqa", "Yangiariq"] },
  { name: "Navoiy", slug: "navoiy", districts: ["Navoiy", "Zarafshon", "Karmana"] },
  { name: "Jizzax", slug: "jizzax", districts: ["Jizzax", "Gallaorol", "Forish", "Zafarobod"] },
  { name: "Sirdaryo", slug: "sirdaryo", districts: ["Guliston", "Yangiyer", "Boyovut"] },
  { name: "Qoraqalpog'iston", slug: "qoraqalpogiston", districts: ["Nukus", "Mo'ynoq", "Xo'jayli", "Beruniy"] },
];
