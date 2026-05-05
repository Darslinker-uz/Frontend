export type PeriodId = "1d" | "7d" | "30d" | "90d" | "apr" | "mar" | "feb" | "yan" | "dek" | "noy";

export function resolveRange(period: PeriodId): { start: Date; end: Date } {
  const now = new Date();
  switch (period) {
    case "1d": return { start: new Date(now.getTime() - 24 * 3600 * 1000), end: now };
    case "7d": return { start: new Date(now.getTime() - 7 * 24 * 3600 * 1000), end: now };
    case "30d": return { start: new Date(now.getTime() - 30 * 24 * 3600 * 1000), end: now };
    case "90d": return { start: new Date(now.getTime() - 90 * 24 * 3600 * 1000), end: now };
    case "apr": return { start: new Date(Date.UTC(2026, 3, 1)), end: new Date(Date.UTC(2026, 4, 1)) };
    case "mar": return { start: new Date(Date.UTC(2026, 2, 1)), end: new Date(Date.UTC(2026, 3, 1)) };
    case "feb": return { start: new Date(Date.UTC(2026, 1, 1)), end: new Date(Date.UTC(2026, 2, 1)) };
    case "yan": return { start: new Date(Date.UTC(2026, 0, 1)), end: new Date(Date.UTC(2026, 1, 1)) };
    case "dek": return { start: new Date(Date.UTC(2025, 11, 1)), end: new Date(Date.UTC(2026, 0, 1)) };
    case "noy": return { start: new Date(Date.UTC(2025, 10, 1)), end: new Date(Date.UTC(2025, 11, 1)) };
    default: return { start: new Date(now.getTime() - 30 * 24 * 3600 * 1000), end: now };
  }
}
