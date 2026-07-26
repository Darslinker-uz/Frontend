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
