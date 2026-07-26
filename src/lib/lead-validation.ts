/**
 * Ism/telefon tekshiruvi — client va server BIR XIL qoidadan foydalanadi.
 *
 * Ilgari forma faqat "bo'shmi?" deb qarardi, server esa raqam uzunligini ham
 * tekshirardi. Natijada noto'g'ri raqam bilan modal ochilib, xato faqat
 * yuborishdan keyin chiqardi. Endi ikkala tomon shu funksiyani chaqiradi.
 */
export function validateLeadContact(name: string, phone: string): string | null {
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();

  if (!trimmedName || !trimmedPhone) return "Ism va telefon raqamingizni kiriting";
  if (trimmedName.length < 2) return "Ism juda qisqa";

  const digits = trimmedPhone.replace(/\D/g, "");
  if (digits.length < 9) return "Telefon raqam to'liq emas";
  if (digits.length > 15) return "Telefon raqam juda uzun";

  return null;
}

/**
 * Telegram username — faqat toza handle saqlanadi (@ va t.me/ prefikslarsiz).
 * Ko'rsatishda "@" qo'shiladi. Yaroqsiz bo'lsa null — ariza baribir saqlanadi.
 */
export function sanitizeTelegramHandle(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const handle = raw
    .trim()
    .replace(/^(https?:\/\/)?(t\.me\/|telegram\.me\/)/i, "")
    .replace(/^@+/, "")
    .trim();
  // Telegram qoidasi: 5-32 belgi, harf/raqam/pastki chiziq
  return /^\w{5,32}$/.test(handle) ? handle : null;
}
