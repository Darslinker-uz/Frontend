/**
 * Ariza yuborishdan oldingi ixtiyoriy kvalifikatsiya savollari.
 *
 * Bazada faqat kodlar saqlanadi (`leads.start_timing`, `leads.preferred_times`,
 * `leads.budget`). Ko'rsatiladigan matn HAR DOIM shu fayldan olinadi — forma,
 * bot xabari, admin panel va markaz kabineti bitta manbadan foydalanadi.
 */

export const START_TIMING_OPTIONS = [
  { value: "this_week", label: "Shu hafta" },
  { value: "this_month", label: "Shu oy ichida" },
  { value: "later", label: "Keyinroq" },
] as const;

export const PREFERRED_TIME_OPTIONS = [
  { value: "morning", label: "Ertalab (08:00–12:00)" },
  { value: "afternoon", label: "Kunduzi (12:00–17:00)" },
  { value: "evening", label: "Kechqurun (17:00–21:00)" },
  { value: "any", label: "Farqi yo'q" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "under_500k", label: "500 000 so'mgacha" },
  { value: "500k_1m", label: "500 000 – 1 000 000" },
  { value: "over_1m", label: "1 000 000 dan yuqori" },
  { value: "unsure", label: "Hali aniq emas" },
] as const;

export type StartTiming = (typeof START_TIMING_OPTIONS)[number]["value"];
export type PreferredTime = (typeof PREFERRED_TIME_OPTIONS)[number]["value"];
export type Budget = (typeof BUDGET_OPTIONS)[number]["value"];

/** Modal javoblari — barchasi ixtiyoriy, forma to'ldirilmasa ham ariza yuboriladi. */
export type LeadQualifyAnswers = {
  startTiming: StartTiming | null;
  preferredTimes: PreferredTime[];
  budget: Budget | null;
};

export const EMPTY_QUALIFY_ANSWERS: LeadQualifyAnswers = {
  startTiming: null,
  preferredTimes: [],
  budget: null,
};

const START_TIMING_VALUES = new Set<string>(START_TIMING_OPTIONS.map(o => o.value));
const PREFERRED_TIME_VALUES = new Set<string>(PREFERRED_TIME_OPTIONS.map(o => o.value));
const BUDGET_VALUES = new Set<string>(BUDGET_OPTIONS.map(o => o.value));

/** API tomonda: noma'lum kodni jimgina tashlab yuboradi (ariza baribir saqlanadi). */
export function sanitizeStartTiming(raw: unknown): string | null {
  const v = typeof raw === "string" ? raw : null;
  return v && START_TIMING_VALUES.has(v) ? v : null;
}

export function sanitizePreferredTimes(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (typeof item === "string" && PREFERRED_TIME_VALUES.has(item)) seen.add(item);
  }
  return [...seen];
}

export function sanitizeBudget(raw: unknown): string | null {
  const v = typeof raw === "string" ? raw : null;
  return v && BUDGET_VALUES.has(v) ? v : null;
}

function labelOf(options: readonly { value: string; label: string }[], code: string | null | undefined) {
  if (!code) return null;
  return options.find(o => o.value === code)?.label ?? null;
}

export const startTimingLabel = (code: string | null | undefined) => labelOf(START_TIMING_OPTIONS, code);
export const budgetLabel = (code: string | null | undefined) => labelOf(BUDGET_OPTIONS, code);

/** Bot/admin ko'rinishi uchun qisqartirilgan vaqt yorliqlari: "Ertalab, Kechqurun" */
export function preferredTimesLabel(codes: readonly string[] | null | undefined): string | null {
  if (!codes || codes.length === 0) return null;
  const shortLabels: Record<string, string> = {
    morning: "Ertalab",
    afternoon: "Kunduzi",
    evening: "Kechqurun",
    any: "Farqi yo'q",
  };
  const parts = PREFERRED_TIME_OPTIONS
    .filter(o => codes.includes(o.value))
    .map(o => shortLabels[o.value]);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * Bot xabari uchun tayyor qatorlar. Hech bir javob berilmasa bo'sh massiv
 * qaytadi — xabar hozirgidek qisqa qoladi.
 */
export function qualifyLines(lead: {
  startTiming?: string | null;
  preferredTimes?: readonly string[] | null;
  budget?: string | null;
}): string[] {
  const lines: string[] = [];
  const timing = startTimingLabel(lead.startTiming);
  const times = preferredTimesLabel(lead.preferredTimes);
  const budget = budgetLabel(lead.budget);
  if (timing) lines.push(`🚀 <b>Boshlash:</b> ${timing}`);
  if (times) lines.push(`⏰ <b>Qulay vaqt:</b> ${times}`);
  if (budget) lines.push(`💰 <b>Byudjet:</b> ${budget}`);
  return lines;
}
