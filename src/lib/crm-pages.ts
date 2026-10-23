// CRM/LMS marketing sahifasining manzili — bosh sahifa (2026-10-23 dan; avval /democrm demo edi).
export const CRM_HOME: string = "/";

// Katalog bosh sahifasi (avvalgi "/").
export const MARKETPLACE_HOME = "/marketplace";

// CRM/LMS sahifalari: navbar "Ariza qoldirish" + yangi ko'rinish, CRM footer.
// Qolgan (katalog) sahifalar — eski navbar, "Yordam", oddiy footer.
export const isCrmPage = (pathname: string) =>
  CRM_HOME === "/" ? pathname === "/" : pathname === CRM_HOME || pathname.startsWith(`${CRM_HOME}/`);

// Katalog bo'limi: bu sahifalarda logotip /marketplace ga olib boradi (qolganlarida — "/").
const CATALOG_PREFIXES = [MARKETPLACE_HOME, "/kurslar", "/oquv-markazlar", "/repetitorlar", "/joylar"];
export const isCatalogPage = (pathname: string) =>
  CATALOG_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
