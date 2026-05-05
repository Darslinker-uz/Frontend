// Format input as Uzbek phone: +998 XX XXX XX XX
// - Handles raw digits, + prefix, and any whitespace/symbols
// - If 9 digits given (no country code), auto-prepends 998
export function formatUzPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 9) digits = "998" + digits;
  digits = digits.slice(0, 12);
  if (!digits) return "";

  const parts: string[] = [digits.slice(0, 3)];
  if (digits.length > 3) parts.push(digits.slice(3, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 8));
  if (digits.length > 8) parts.push(digits.slice(8, 10));
  if (digits.length > 10) parts.push(digits.slice(10, 12));
  return "+" + parts.join(" ");
}
