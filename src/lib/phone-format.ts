// Format input as Uzbek phone: +998 XX XXX XX XX
// - Auto-prepends 998 only if user typed 9 digits without country code
//   (skipped when digits already start with 998 to avoid double-prefix bug)
export function formatUzPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 9 && !digits.startsWith("998")) {
    digits = "998" + digits;
  }
  digits = digits.slice(0, 12);
  if (!digits) return "";

  const parts: string[] = [digits.slice(0, 3)];
  if (digits.length > 3) parts.push(digits.slice(3, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 8));
  if (digits.length > 8) parts.push(digits.slice(8, 10));
  if (digits.length > 10) parts.push(digits.slice(10, 12));
  return "+" + parts.join(" ");
}

// Default placeholder/initial value for phone inputs
export const UZ_PHONE_PREFIX = "+998 ";

// True only if user typed something beyond the country code (>3 digits)
export function hasUzPhoneContent(value: string): boolean {
  return value.replace(/\D/g, "").length > 3;
}
