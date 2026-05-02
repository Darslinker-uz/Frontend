// Assistant permissions — granular access control.
// Super admin'ning yordamchilari kodda hardcoded (src/lib/assistants.ts).
// Har assistant uchun aniq ruxsatlar belgilanadi.
//
// Yangi permission qo'shish:
//   1. Permission interface'ga key qo'shing
//   2. Assistant config'ida to'ldiring
//   3. Tegishli sahifa/API'ga `requirePermission(perm)` qo'shing.

export interface Permissions {
  listing: {
    view: boolean;       // Barcha e'lonlarni ko'rish (admin sahifa)
    create: boolean;     // O'quv markaz nomidan yangi e'lon yaratish
    edit: boolean;       // Mavjud e'lonni tahrirlash
    approve: boolean;    // Pending'ni tasdiqlash/rad etish
    delete: boolean;     // O'chirish
  };
  user: {
    view: boolean;
    edit: boolean;
    balanceTopup: boolean;
  };
  lead: {
    view: boolean;
    edit: boolean;       // Status o'zgartirish (bog'lanildi, ...)
  };
  boost: {
    view: boolean;       // Boost ro'yxatini ko'rish
    request: boolean;    // Boost so'rovini yuborish (admin tasdiqlaydi)
    approve: boolean;    // Pending boost tasdiqlash/rad etish
    grant: boolean;      // Bepul boost berish
  };
  taxonomy: {
    edit: boolean;       // Kategoriya/guruh CRUD
  };
  region: {
    edit: boolean;
  };
  content: {             // Manba + Blog
    view: boolean;
    edit: boolean;
    publish: boolean;
  };
  faq: {
    edit: boolean;
  };
  payment: {
    view: boolean;
  };
  analytics: {
    view: boolean;
  };
}

// Default — barcha ruxsatlar yo'q. Assistant config'ida kerakliligini true qilamiz.
export const NO_PERMISSIONS: Permissions = {
  listing: { view: false, create: false, edit: false, approve: false, delete: false },
  user: { view: false, edit: false, balanceTopup: false },
  lead: { view: false, edit: false },
  boost: { view: false, request: false, approve: false, grant: false },
  taxonomy: { edit: false },
  region: { edit: false },
  content: { view: false, edit: false, publish: false },
  faq: { edit: false },
  payment: { view: false },
  analytics: { view: false },
};

// Admin har doim hammasi true. Assistant tekshiruvi uchun helper.
export const ALL_PERMISSIONS: Permissions = {
  listing: { view: true, create: true, edit: true, approve: true, delete: true },
  user: { view: true, edit: true, balanceTopup: true },
  lead: { view: true, edit: true },
  boost: { view: true, request: true, approve: true, grant: true },
  taxonomy: { edit: true },
  region: { edit: true },
  content: { view: true, edit: true, publish: true },
  faq: { edit: true },
  payment: { view: true },
  analytics: { view: true },
};

// Permission key — sahifa/API ga gate qo'yish uchun. Masalan: "listing.create"
export type PermissionKey =
  | "listing.view" | "listing.create" | "listing.edit" | "listing.approve" | "listing.delete"
  | "user.view" | "user.edit" | "user.balanceTopup"
  | "lead.view" | "lead.edit"
  | "boost.view" | "boost.request" | "boost.approve" | "boost.grant"
  | "taxonomy.edit"
  | "region.edit"
  | "content.view" | "content.edit" | "content.publish"
  | "faq.edit"
  | "payment.view"
  | "analytics.view";

export function hasPermission(perms: Permissions, key: PermissionKey): boolean {
  const [domain, action] = key.split(".") as [keyof Permissions, string];
  const group = perms[domain];
  if (!group) return false;
  return Boolean((group as Record<string, boolean>)[action]);
}

// Boshqa ruxsatlarni helper — Permissions object'idan deep merge qiladi.
// Default NO_PERMISSIONS'dan boshlab, granted ruxsatlarni overlay qilamiz.
export function buildPermissions(granted: Partial<{
  [K in keyof Permissions]: Partial<Permissions[K]>
}>): Permissions {
  const result = JSON.parse(JSON.stringify(NO_PERMISSIONS)) as Permissions;
  for (const domain of Object.keys(granted) as (keyof Permissions)[]) {
    const g = granted[domain];
    if (!g) continue;
    Object.assign(result[domain], g);
  }
  return result;
}
