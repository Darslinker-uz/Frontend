// CRM/LMS marketing sahifasining manzili. Hozircha yopiq demo (/democrm, noindex);
// bosh sahifaga ko'chirilganda faqat shu konstanta "/" ga o'zgartiriladi.
export const CRM_HOME: string = "/democrm";

// CRM/LMS sahifalari: navbar "Ariza qoldirish" + yangi ko'rinish, CRM footer.
// Qolgan (katalog) sahifalar — eski navbar, "Yordam", oddiy footer.
export const isCrmPage = (pathname: string) =>
  CRM_HOME === "/" ? pathname === "/" : pathname === CRM_HOME || pathname.startsWith(`${CRM_HOME}/`);
