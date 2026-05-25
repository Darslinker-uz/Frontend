/**
 * AI kurs qidiruv — /kurslar filtrlari bilan mos, Redis kesh ustida.
 * Mijoz matnidan intent → filtrlash + relevantsiya balli.
 */

import { chatCompletion, type ChatTurn } from "@/lib/openai";
import { getAllCachedCourses, type CachedCourse } from "@/lib/courses-redis";

export type ListingFormat = "offline" | "online" | "video" | "hybrid";

export type CourseSearchIntent = {
  /** Eski API / sarlavha uchun asosiy kalit */
  query: string;
  subjects: string[];
  categorySlugs: string[];
  groupSlugs: string[];
  keywords: string[];
  level?: "beginner" | "some" | "experienced";
  format?: ListingFormat;
  region?: string;
  district?: string;
  priceMax?: number;
  freeOnly?: boolean;
};

type SubjectDef = {
  key: string;
  label: string;
  categorySlugs: string[];
  groupSlugs: string[];
  keywords: string[];
  patterns: RegExp[];
};

/** DB taksonomiya (seed-taxonomy) + keng kalit so'zlar */
const SUBJECTS: SubjectDef[] = [
  {
    key: "kimyo",
    label: "Kimyo",
    categorySlugs: ["kimyo"],
    groupSlugs: ["akademik"],
    keywords: ["kimyo", "kimy", "ximiya", "chemistry", "organik", "neorganik"],
    patterns: [/kimyo?/i, /\bximiya\b/i],
  },
  {
    key: "biologiya",
    label: "Biologiya",
    categorySlugs: ["biologiya"],
    groupSlugs: ["akademik"],
    keywords: ["biologiya", "biolog", "biology", "anatomiya", "genetika"],
    patterns: [/biolog/i, /anatomiya/i],
  },
  {
    key: "matematika",
    label: "Matematika",
    categorySlugs: ["matematika", "bolalar-matematika"],
    groupSlugs: ["akademik", "bolalar"],
    keywords: ["matematika", "algebra", "geometriya", "math", "matem"],
    patterns: [/matematik/i, /\bmath\b/i, /algebra/i, /geometriya/i],
  },
  {
    key: "fizika",
    label: "Fizika",
    categorySlugs: ["fizika"],
    groupSlugs: ["akademik"],
    keywords: ["fizika", "physics", "mexanika"],
    patterns: [/fizik/i, /physics/i],
  },
  {
    key: "ingliz",
    label: "Ingliz tili",
    categorySlugs: ["ingliz-tili", "ielts", "toefl", "cefr", "bolalar-ingliz-tili"],
    groupSlugs: ["tillar", "bolalar"],
    keywords: ["ingliz", "english", "ielts", "toefl", "cefr", "ingliz tili"],
    patterns: [/ingliz/i, /\bielts\b/i, /\btoefl\b/i, /\benglish\b/i],
  },
  {
    key: "rus",
    label: "Rus tili",
    categorySlugs: ["rus-tili"],
    groupSlugs: ["tillar"],
    keywords: ["rus tili", "rus", "русский"],
    patterns: [/rus(\s*tili)?/i],
  },
  {
    key: "koreys",
    label: "Koreys tili",
    categorySlugs: ["koreys-tili"],
    groupSlugs: ["tillar"],
    keywords: ["koreys", "korean", "topik"],
    patterns: [/koreys/i, /korean/i, /topik/i],
  },
  {
    key: "turk",
    label: "Turk tili",
    categorySlugs: ["turk-tili"],
    groupSlugs: ["tillar"],
    keywords: ["turk", "turk tili"],
    patterns: [/turk(\s*tili)?/i],
  },
  {
    key: "python",
    label: "Python",
    categorySlugs: ["python"],
    groupSlugs: ["it"],
    keywords: ["python", "питон", "django", "flask"],
    patterns: [/python/i, /питон/i],
  },
  {
    key: "javascript",
    label: "JavaScript",
    categorySlugs: ["javascript", "react", "nodejs"],
    groupSlugs: ["it"],
    keywords: ["javascript", "react", "node", "js", "frontend", "backend"],
    patterns: [/javascript/i, /\bjs\b/i, /react/i, /node\.?js/i],
  },
  {
    key: "it",
    label: "IT",
    categorySlugs: [],
    groupSlugs: ["it"],
    keywords: ["it", "dasturlash", "programming", "dastur", "kod", "developer"],
    patterns: [/\bit\b/i, /dasturlash/i, /programming/i],
  },
  {
    key: "marketing",
    label: "Marketing",
    categorySlugs: ["digital-marketing", "smm", "seo", "kontekst-reklama"],
    groupSlugs: ["biznes"],
    keywords: ["marketing", "smm", "reklama", "target", "seo"],
    patterns: [/marketing/i, /\bsmm\b/i, /reklama/i],
  },
  {
    key: "dizayn",
    label: "Dizayn",
    categorySlugs: ["ui-ux", "grafik-dizayn", "figma"],
    groupSlugs: ["dizayn"],
    keywords: ["dizayn", "design", "ui", "ux", "figma"],
    patterns: [/dizayn/i, /design/i, /ui\/?ux/i, /figma/i],
  },
  {
    key: "robototexnika",
    label: "Robototexnika",
    categorySlugs: ["robotika"],
    groupSlugs: ["bolalar", "it"],
    keywords: ["robot", "robototexnika", "robotatexnika", "robotika", "robokidz", "arduino"],
    patterns: [/robot/i, /robototexnika/i, /robotatexnika/i],
  },
  {
    key: "mental",
    label: "Mental arifmetika",
    categorySlugs: [],
    groupSlugs: ["bolalar"],
    keywords: ["mental", "arifmetika"],
    patterns: [/mental/i],
  },
  {
    key: "shaxmat",
    label: "Shaxmat",
    categorySlugs: ["shaxmat"],
    groupSlugs: ["bolalar"],
    keywords: ["shaxmat", "chess"],
    patterns: [/shaxmat/i, /chess/i],
  },
  {
    key: "dtm",
    label: "DTM tayyorgarlik",
    categorySlugs: ["dtm"],
    groupSlugs: ["akademik"],
    keywords: ["dtm", "milliy sertifikat", "sertifikat"],
    patterns: [/dtm/i, /milliy\s*sertifikat/i],
  },
  {
    key: "tarix",
    label: "Tarix",
    categorySlugs: ["tarix"],
    groupSlugs: ["akademik"],
    keywords: ["tarix", "history", " tarix "],
    patterns: [/tarix/i],
  },
  {
    key: "geografiya",
    label: "Geografiya",
    categorySlugs: ["geografiya"],
    groupSlugs: ["akademik"],
    keywords: ["geografiya", "geography"],
    patterns: [/geografiya/i],
  },
  {
    key: "adabiyot",
    label: "Adabiyot",
    categorySlugs: ["adabiyot"],
    groupSlugs: ["akademik"],
    keywords: ["adabiyot", "literature"],
    patterns: [/adabiyot/i],
  },
  {
    key: "ona-tili",
    label: "Ona tili",
    categorySlugs: ["ozbek-tili"],
    groupSlugs: ["tillar"],
    keywords: ["ona tili", "ona-tili", "o'zbek tili", "ozbek tili", "узбек"],
    patterns: [/ona\s*tili/i, /o['']?zbek\s*tili/i, /ozbek\s*tili/i],
  },
  {
    key: "xitoy",
    label: "Xitoy tili",
    categorySlugs: ["xitoy-tili"],
    groupSlugs: ["tillar"],
    keywords: ["xitoy", "xitoy tili", "chinese", "hsk"],
    patterns: [/xitoy/i, /chinese/i, /\bhsk\b/i],
  },
  {
    key: "nemis",
    label: "Nemis tili",
    categorySlugs: ["nemis-tili"],
    groupSlugs: ["tillar"],
    keywords: ["nemis", "nemis tili", "german", "deutsch"],
    patterns: [/nemis/i, /german/i, /deutsch/i],
  },
  {
    key: "fransuz",
    label: "Fransuz tili",
    categorySlugs: ["fransuz-tili"],
    groupSlugs: ["tillar"],
    keywords: ["fransuz", "fransuz tili", "french"],
    patterns: [/fransuz/i, /french/i],
  },
  {
    key: "yapon",
    label: "Yapon tili",
    categorySlugs: ["yapon-tili"],
    groupSlugs: ["tillar"],
    keywords: ["yapon", "yapon tili", "japanese"],
    patterns: [/yapon/i, /japanese/i],
  },
  {
    key: "arab",
    label: "Arab tili",
    categorySlugs: ["arab-tili"],
    groupSlugs: ["tillar"],
    keywords: ["arab", "arab tili", "arabic"],
    patterns: [/arab/i, /arabic/i],
  },
  {
    key: "ispan",
    label: "Ispan tili",
    categorySlugs: ["ispan-tili"],
    groupSlugs: ["tillar"],
    keywords: ["ispan", "ispan tili", "spanish"],
    patterns: [/ispan/i, /spanish/i],
  },
  {
    key: "italyan",
    label: "Italyan tili",
    categorySlugs: ["italyan-tili"],
    groupSlugs: ["tillar"],
    keywords: ["italyan", "italyan tili", "italian"],
    patterns: [/italyan/i, /italian/i],
  },
  {
    key: "kompyuter",
    label: "Kompyuter savodxonligi",
    categorySlugs: ["ma-lumotlar-bazasi"],
    groupSlugs: ["it"],
    keywords: ["kompyuter", "savodxonligi", "kompyuter savodxonligi", "computer literacy", "pc"],
    patterns: [/kompyuter/i, /savodxonligi/i],
  },
  {
    key: "frontend",
    label: "Frontend",
    categorySlugs: ["frontend"],
    groupSlugs: ["it"],
    keywords: ["frontend", "front-end", "html", "css"],
    patterns: [/frontend/i, /front[\s-]?end/i],
  },
  {
    key: "backend",
    label: "Backend",
    categorySlugs: ["backend"],
    groupSlugs: ["it"],
    keywords: ["backend", "back-end", "server"],
    patterns: [/backend/i, /back[\s-]?end/i],
  },
  {
    key: "fullstack",
    label: "Full-stack",
    categorySlugs: ["fullstack"],
    groupSlugs: ["it"],
    keywords: ["fullstack", "full-stack", "full stack"],
    patterns: [/full[\s-]?stack/i],
  },
  {
    key: "web",
    label: "Web dasturlash",
    categorySlugs: ["frontend", "fullstack", "javascript"],
    groupSlugs: ["it"],
    keywords: ["web", "web dasturlash", "veb", "website"],
    patterns: [/web[\s-]?dasturlash/i, /\bveb\b/i],
  },
  {
    key: "ai",
    label: "Sun'iy intellekt",
    categorySlugs: ["sunyi-intellekt", "machine-learning", "prompt-engineering"],
    groupSlugs: ["it"],
    keywords: ["sun'iy intellekt", "suniy intellekt", "ai", "chatgpt", "machine learning"],
    patterns: [/sun['']?iy\s*intellekt/i, /\bai\b/i, /chatgpt/i],
  },
  {
    key: "smm",
    label: "SMM",
    categorySlugs: ["smm"],
    groupSlugs: ["biznes"],
    keywords: ["smm", "instagram", "telegram marketing"],
    patterns: [/\bsmm\b/i],
  },
  {
    key: "olimpiada",
    label: "Olimpiada",
    categorySlugs: ["olimpiada"],
    groupSlugs: ["akademik"],
    keywords: ["olimpiada", "olympiad"],
    patterns: [/olimpiada/i],
  },
];

const SUBJECT_BY_KEY = new Map(SUBJECTS.map(s => [s.key, s]));

const GROUP_ALIASES: Record<string, { slugs: string[]; patterns: RegExp[] }> = {
  akademik: { slugs: ["akademik"], patterns: [/akademik\s*fan/i, /akademik/i, /fan(lar)?/i, /dtm/i, /sertifikat/i] },
  tillar: {
    slugs: ["tillar"],
    patterns: [/xorijiy\s*til/i, /til(lar)?\s*kurs/i, /til\s*o['']rgan/i],
  },
  bolalar: { slugs: ["bolalar"], patterns: [/bolalar\s*uchun/i, /bolaga/i, /kids/i] },
  it: { slugs: ["it"], patterns: [/it\s*va\s*dasturlash/i, /\bit\b.*dasturlash/i] },
  biznes: { slugs: ["biznes"], patterns: [/marketing\s*va\s*smm/i, /biznes/i] },
  dizayn: { slugs: ["dizayn"], patterns: [/dizayn\s*va\s*san/i, /dizayn/i, /san['']?at/i] },
  kasbiy: { slugs: ["kasbiy"], patterns: [/kasbiy\s*ko['']nikma/i] },
};

const LEVEL_KEYWORDS: Record<string, string[]> = {
  beginner: ["boshlang", "beginner", "noldan", "yangi", "start"],
  some: ["o'rta", "orta", "ozgina", "asosiy", "basic"],
  experienced: ["yuqori", "advanced", "professional", "pro", "tajriba"],
};

const FORMAT_PATTERNS: { format: ListingFormat; patterns: RegExp[] }[] = [
  { format: "offline", patterns: [/oflayn/i, /offline/i, /joyida/i, /auditoriya/i] },
  { format: "online", patterns: [/onlayn/i, /online/i, /zoom/i, /masofaviy/i] },
  { format: "video", patterns: [/video\s*kurs/i, /\bvideo\b/i, /yozilgan/i] },
  { format: "hybrid", patterns: [/gibrid/i, /hybrid/i, /aralash/i] },
];

const REGION_ALIASES: { name: string; patterns: RegExp[] }[] = [
  { name: "Toshkent shahri", patterns: [/toshkent\s*shahri/i, /toshkentda/i, /\btoshkent\b/i] },
  { name: "Toshkent viloyati", patterns: [/toshkent\s*viloyati/i] },
  { name: "Samarqand", patterns: [/samarqand/i] },
  { name: "Buxoro", patterns: [/buxoro/i] },
  { name: "Andijon", patterns: [/andijon/i] },
  { name: "Farg'ona", patterns: [/farg'ona|fargona/i] },
  { name: "Namangan", patterns: [/namangan/i] },
];

const DISTRICT_PATTERNS: { district: string; patterns: RegExp[] }[] = [
  { district: "Chilonzor", patterns: [/chilonzor/i] },
  { district: "Yakkasaroy", patterns: [/yakkasaroy/i] },
  { district: "Uchtepa", patterns: [/uchtepa/i] },
  { district: "Mirzo Ulug'bek", patterns: [/mirzo\s*ulug/i] },
];

const RE_SHOW_COURSES =
  /kurslarni?\s*ko|ko['']rsat|ko['']rib\s*ber|chiqar|ro['']yxat|toping|izlab\s*ber|izlang|qaysi\s*kurs|qidiryapman|izlayapman|menga\s+kurs/i;
const RE_EXPLICIT_ALL_COURSES = /hammasini|barchasini|barcha\s*kurs|hamma\s*kurs/i;
const RE_COURSE_CONTEXT = /kurs|til\s*bo|fan|o['']qish|o['']rganmoqchi|yo'nalish|soha|daraja/i;
const RE_WAIT_FOR_MORE = /^(kurs\s*kerak|til\s*bo['']yicha|nima\s*gap|qalesan|qalaysiz)$/i;
const RE_SUBJECT_KURS = /(\p{L}+)\s*kurs(lar)?/iu;

function normalizeText(text: string) {
  return text.trim().toLowerCase();
}

function detectSubjects(text: string): SubjectDef[] {
  const low = normalizeText(text);
  const found = new Map<string, SubjectDef>();

  for (const s of SUBJECTS) {
    if (s.patterns.some(p => p.test(low))) found.set(s.key, s);
    if (low.includes(s.label.toLowerCase())) found.set(s.key, s);
    for (const kw of s.keywords) {
      if (low.includes(kw.toLowerCase())) found.set(s.key, s);
    }
    for (const slug of s.categorySlugs) {
      const spaced = slug.replace(/-/g, " ");
      if (low.includes(spaced) || low.includes(slug)) found.set(s.key, s);
    }
  }

  const kursMatch = text.match(RE_SUBJECT_KURS);
  if (kursMatch?.[1]) {
    const word = kursMatch[1].toLowerCase();
    for (const s of SUBJECTS) {
      if (s.key === word || s.keywords.some(k => k.includes(word) || word.includes(k))) {
        found.set(s.key, s);
      }
    }
  }

  return [...found.values()];
}

function detectGroups(text: string): string[] {
  const slugs: string[] = [];
  for (const g of Object.values(GROUP_ALIASES)) {
    if (g.patterns.some(p => p.test(text))) slugs.push(...g.slugs);
  }
  return [...new Set(slugs)];
}

function buildIntent(partial: Partial<CourseSearchIntent> & { query: string }): CourseSearchIntent {
  const subjects = partial.subjects ?? [];
  const categorySlugs = new Set(partial.categorySlugs ?? []);
  const groupSlugs = new Set(partial.groupSlugs ?? []);
  const keywords = new Set(partial.keywords ?? []);

  for (const key of subjects) {
    const s = SUBJECT_BY_KEY.get(key);
    if (!s) continue;
    s.categorySlugs.forEach(c => categorySlugs.add(c));
    s.groupSlugs.forEach(g => groupSlugs.add(g));
    s.keywords.forEach(k => keywords.add(k));
  }

  return {
    query: partial.query,
    subjects,
    categorySlugs: [...categorySlugs],
    groupSlugs: [...groupSlugs],
    keywords: [...keywords],
    level: partial.level,
    format: partial.format,
    region: partial.region,
    district: partial.district,
    priceMax: partial.priceMax,
    freeOnly: partial.freeOnly,
  };
}

function extractLevel(text: string): CourseSearchIntent["level"] | undefined {
  const low = normalizeText(text);
  if (/boshlang|beginner|noldan/.test(low)) return "beginner";
  if (/o['']rta|orta|ozgina|asosiy/.test(low)) return "some";
  if (/yuqori|advanced|tajriba/.test(low)) return "experienced";
  return undefined;
}

function extractFormat(text: string): ListingFormat | undefined {
  for (const { format, patterns } of FORMAT_PATTERNS) {
    if (patterns.some(p => p.test(text))) return format;
  }
  return undefined;
}

function extractRegion(text: string): string | undefined {
  for (const r of REGION_ALIASES) {
    if (r.patterns.some(p => p.test(text))) return r.name;
  }
  return undefined;
}

function extractDistrict(text: string): string | undefined {
  for (const d of DISTRICT_PATTERNS) {
    if (d.patterns.some(p => p.test(text))) return d.district;
  }
  return undefined;
}

function extractPriceMax(text: string): number | undefined {
  const m = text.match(/(\d[\d\s]{3,})\s*(ming|mln|so'm)?/i);
  if (!m) return undefined;
  let n = parseInt(m[1].replace(/\s/g, ""), 10);
  if (!Number.isFinite(n)) return undefined;
  if (/mln/i.test(m[2] ?? "") || /mln/i.test(text)) n *= 1_000_000;
  else if (/ming/i.test(m[2] ?? "") || n < 10_000) n *= 1000;
  return n;
}

function findSubjectInHistory(history: ChatTurn[]): string | null {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role !== "user") continue;
    const subs = detectSubjects(history[i].content);
    if (subs.length) return subs[0].key;
  }
  return null;
}

function isKursConversation(history: ChatTurn[], text: string) {
  const blob = [...history.map(h => h.content), text].join(" ");
  return RE_COURSE_CONTEXT.test(blob);
}

/** Matnda yoki suhbat tarixida aniq yo'nalish bormi */
export function hasTopicInTextOrHistory(text: string, history: ChatTurn[] = []): boolean {
  if (detectSubjects(text).length > 0) return true;
  if (detectGroups(text).length > 0) return true;
  return findSubjectInHistory(history) !== null;
}

/** «Kurs kerak», «kurslarni ko'rsat» — yo'nalishsiz umumiy so'rov */
export function isVagueCourseRequest(text: string): boolean {
  const low = normalizeText(text);
  if (RE_EXPLICIT_ALL_COURSES.test(low)) return false;
  if (detectSubjects(text).length > 0 || detectGroups(text).length > 0) return false;

  if (
    /^kurs(lar)?\s*kerak/i.test(low) ||
    /menga\s+kurs(lar)?/i.test(low) ||
    /kurs(lar)?\s*(kerak|qidiryapman|izlayapman)/i.test(low)
  ) {
    return true;
  }

  if (/\bkurs(lar)?\b/i.test(low) && /(ko['']rsat|ko['']rib|chiqar|toping|izlab|izlang)/i.test(low)) {
    return true;
  }

  return false;
}

/** Yo'nalish aniqlanmaguncha kurs ro'yxati chiqmasin — tabiiy savol */
export function getDirectionClarificationReply(): string {
  return (
    "Albatta, yordam beraman! Qaysi yo'nalishda kurs qidiryapsiz?\n\n" +
    "Masalan:\n" +
    "• Ingliz tili, rus tili, koreys tili, ona tili\n" +
    "• IT va dasturlash (python, frontend, robototexnika…)\n" +
    "• Kimyo, biologiya, matematika, fizika, tarix\n" +
    "• Marketing, dizayn\n\n" +
    "Yo'nalishni yozing — shu bo'yicha mos kurslarni ko'rsataman."
  );
}

/** Qoida asosida intent (tez) */
export function resolveCourseSearchIntent(text: string, history: ChatTurn[] = []): CourseSearchIntent | null {
  const low = normalizeText(text);
  const inKurs = isKursConversation(history, text);

  if (RE_WAIT_FOR_MORE.test(low)) return null;

  const level = extractLevel(text);
  const format = extractFormat(text);
  const region = extractRegion(text);
  const district = extractDistrict(text);
  const priceMax = extractPriceMax(text);
  const freeOnly = /bepul|free|tekin/i.test(low);

  if (RE_EXPLICIT_ALL_COURSES.test(low)) {
    return buildIntent({ query: "", level, format, region, district, priceMax, freeOnly });
  }

  const subjectsNow = detectSubjects(text);
  const groupsNow = detectGroups(text);
  const histKey = findSubjectInHistory(history);

  if (RE_SHOW_COURSES.test(low) && !subjectsNow.length && !groupsNow.length && !histKey) {
    return null;
  }

  if (RE_SHOW_COURSES.test(low) || subjectsNow.length || groupsNow.length) {
    const subs =
      subjectsNow.length > 0
        ? subjectsNow
        : histKey
          ? [SUBJECT_BY_KEY.get(histKey)!].filter(Boolean)
          : [];
    const query = subs[0]?.key ?? (groupsNow[0] ?? "");
    if (subs.length || groupsNow.length) {
      return buildIntent({
        query,
        subjects: subs.map(s => s.key),
        groupSlugs: groupsNow,
        level,
        format,
        region,
        district,
        priceMax,
        freeOnly,
      });
    }
  }

  /** «kimyo», «tarix», «ona tili» — darhol qidiruv (kurs so'zi shart emas) */
  if (subjectsNow.length) {
    return buildIntent({
      query: subjectsNow[0].key,
      subjects: subjectsNow.map(s => s.key),
      groupSlugs: groupsNow,
      level,
      format,
      region,
      district,
      priceMax,
      freeOnly,
    });
  }

  if (groupsNow.length) {
    return buildIntent({
      query: groupsNow[0],
      subjects: [],
      groupSlugs: groupsNow,
      level,
      format,
      region,
      district,
      priceMax,
      freeOnly,
    });
  }

  if (level && inKurs) {
    const histKey = findSubjectInHistory(history);
    if (histKey) {
      return buildIntent({
        query: histKey,
        subjects: [histKey],
        level,
        format,
        region,
        district,
        priceMax,
        freeOnly,
      });
    }
  }

  if ((format || region || district || priceMax || freeOnly) && (inKurs || /kurs/i.test(low))) {
    if (!histKey && !subjectsNow.length && !groupsNow.length) return null;
    return buildIntent({
      query: histKey ?? subjectsNow[0]?.key ?? "",
      subjects: histKey ? [histKey] : subjectsNow.map(s => s.key),
      groupSlugs: groupsNow,
      level,
      format,
      region,
      district,
      priceMax,
      freeOnly,
    });
  }

  return null;
}

/** GPT — noaniq so'rovlarda (ixtiyoriy) */
export async function resolveCourseSearchIntentAsync(
  text: string,
  history: ChatTurn[] = []
): Promise<CourseSearchIntent | null> {
  const ruled = resolveCourseSearchIntent(text, history);
  if (ruled) return ruled;

  if (!RE_COURSE_CONTEXT.test(text) && !/kurs/i.test(text)) return null;

  const raw = await chatCompletion({
    system: `Sen Darslinker.uz kurs qidiruv tahlilchisisan. Foydalanuvchi O'zbek tilida yozadi.
Faqat JSON qaytaring, boshqa matn yo'q:
{"subjects":["kimyo"],"categorySlugs":[],"groupSlugs":[],"format":null,"region":null,"district":null,"level":null,"priceMax":null,"freeOnly":false}
subjects: kimyo, biologiya, matematika, fizika, ingliz, rus, python, javascript, it, marketing, dizayn, robototexnika, dtm va hokazo.
categorySlugs: matematika, kimyo, biologiya, ingliz-tili, ielts, python, ...
groupSlugs: akademik, tillar, it, biznes, dizayn, bolalar
format: offline|online|video|hybrid yoki null`,
    user: text.slice(0, 400),
    maxTokens: 120,
    temperature: 0.1,
  });

  if (!raw) return null;

  try {
    const json = JSON.parse(raw.replace(/```json?\s*|\s*```/g, "").trim()) as {
      subjects?: string[];
      categorySlugs?: string[];
      groupSlugs?: string[];
      format?: ListingFormat | null;
      region?: string | null;
      district?: string | null;
      level?: CourseSearchIntent["level"] | null;
      priceMax?: number | null;
      freeOnly?: boolean;
    };
    const subjects = (json.subjects ?? []).filter(k => SUBJECT_BY_KEY.has(k));
    if (!subjects.length && !json.categorySlugs?.length && !json.groupSlugs?.length) return null;
    return buildIntent({
      query: subjects[0] ?? json.categorySlugs?.[0] ?? "",
      subjects,
      categorySlugs: json.categorySlugs ?? [],
      groupSlugs: json.groupSlugs ?? [],
      level: json.level ?? undefined,
      format: json.format ?? undefined,
      region: json.region ?? undefined,
      district: json.district ?? undefined,
      priceMax: json.priceMax ?? undefined,
      freeOnly: json.freeOnly,
    });
  } catch {
    return null;
  }
}

function formatMatchesCourse(courseFormat: string, filter: ListingFormat): boolean {
  const f = courseFormat.toLowerCase();
  if (filter === "online") return f === "online" || f === "hybrid";
  if (filter === "offline") return f === "offline" || f === "hybrid";
  return f === filter;
}

function regionMatchesCourse(c: CachedCourse, region: string, district?: string): boolean {
  if (c.format === "online" || c.format === "video") return true;
  if (district) {
    if (c.district === district && (!region || c.region === region)) return true;
    if (c.branchDistricts.includes(district)) return true;
  }
  if (c.region === region) return true;
  if (c.branchRegions.includes(region)) return true;
  const loc = `${c.location ?? ""} ${c.region ?? ""} ${c.district ?? ""}`.toLowerCase();
  return loc.includes(region.toLowerCase()) || (district ? loc.includes(district.toLowerCase()) : false);
}

function scoreCourse(c: CachedCourse, intent: CourseSearchIntent): number {
  const hay = `${c.title} ${c.description ?? ""} ${c.categoryName} ${c.categorySlug} ${c.groupSlug} ${c.centerName} ${c.location ?? ""}`.toLowerCase();
  let score = 0;

  const hasTopic =
    intent.subjects.length > 0 ||
    intent.categorySlugs.length > 0 ||
    intent.groupSlugs.length > 0 ||
    intent.keywords.length > 0 ||
    !!intent.query;

  if (!hasTopic) {
    return c.views;
  }

  for (const slug of intent.categorySlugs) {
    if (c.categorySlug === slug) score += 100;
    else if (c.categorySlug.includes(slug) || slug.includes(c.categorySlug)) score += 70;
  }

  for (const g of intent.groupSlugs) {
    if (c.groupSlug === g) score += 45;
  }

  for (const key of intent.subjects) {
    const s = SUBJECT_BY_KEY.get(key);
    if (!s) continue;
    if (s.categorySlugs.includes(c.categorySlug)) score += 100;
    if (c.categoryName.toLowerCase() === s.label.toLowerCase()) score += 95;
    if (c.categoryName.toLowerCase().includes(s.label.toLowerCase())) score += 80;
    if (s.groupSlugs.includes(c.groupSlug)) score += 25;
    for (const kw of s.keywords) {
      if (hay.includes(kw)) score += 40;
      if (c.title.toLowerCase().includes(kw)) score += 35;
      if (c.categoryName.toLowerCase().includes(kw)) score += 55;
    }
  }

  for (const kw of intent.keywords) {
    if (hay.includes(kw)) score += 25;
  }

  if (intent.query && intent.query.length >= 2) {
    const q = intent.query.toLowerCase();
    if (c.categorySlug.includes(q) || q.includes(c.categorySlug)) score += 30;
    if (hay.includes(q)) score += 20;
  }

  if (score === 0) return 0;

  if (intent.level) {
    const levelText = [c.level, ...c.levels].filter(Boolean).join(" ").toLowerCase();
    const kw = LEVEL_KEYWORDS[intent.level] ?? [];
    if (kw.some(k => levelText.includes(k))) score += 30;
    else if (intent.level === "beginner" && !levelText) score += 10;
  }

  score += Math.min(c.views / 30, 15);
  return score;
}

function passesHardFilters(c: CachedCourse, intent: CourseSearchIntent): boolean {
  if (intent.format && !formatMatchesCourse(c.format, intent.format)) return false;
  if (intent.freeOnly && c.price !== 0) return false;
  if (intent.priceMax != null && c.price > intent.priceMax) return false;
  if (intent.region && !regionMatchesCourse(c, intent.region, intent.district)) return false;
  return true;
}

/** Aniq fan: faqat shu kategoriya (kimyo→kimyo, ona tili→ozbek-tili) */
function isStrictTopicIntent(intent: CourseSearchIntent): boolean {
  if (intent.categorySlugs.length > 0) return true;
  if (intent.subjects.length === 1) return true;
  if (intent.groupSlugs.length === 1 && intent.subjects.length === 0) return true;
  return false;
}

function matchesStrictTopic(c: CachedCourse, intent: CourseSearchIntent): boolean {
  const allowedSlugs = new Set(intent.categorySlugs);
  const allowedGroups = new Set(intent.groupSlugs);

  for (const key of intent.subjects) {
    const s = SUBJECT_BY_KEY.get(key);
    s?.categorySlugs.forEach(slug => allowedSlugs.add(slug));
    s?.groupSlugs.forEach(g => allowedGroups.add(g));
  }

  if (allowedSlugs.size > 0) {
    return allowedSlugs.has(c.categorySlug);
  }
  if (allowedGroups.size > 0) {
    return allowedGroups.has(c.groupSlug);
  }
  return true;
}

/** Redis keshdan filtrlash + tartiblash */
export async function searchCoursesByIntent(intent: CourseSearchIntent): Promise<number[]> {
  const all = await getAllCachedCourses();
  const strict = isStrictTopicIntent(intent);
  let pool = all.filter(c => passesHardFilters(c, intent));

  if (strict) {
    pool = pool.filter(c => matchesStrictTopic(c, intent));
    if (!pool.length) return [];
    return pool
      .map(c => ({ id: c.id, score: scoreCourse(c, intent) }))
      .sort((a, b) => b.score - a.score)
      .map(s => s.id);
  }

  if (!pool.length) pool = all;

  const scored = pool
    .map(c => ({ id: c.id, score: scoreCourse(c, intent) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length) return scored.map(s => s.id);

  if (!intent.query && intent.subjects.length === 0 && !intent.groupSlugs.length) {
    return pool.sort((a, b) => b.views - a.views).map(c => c.id);
  }

  if (intent.groupSlugs.length) {
    return pool
      .filter(c => intent.groupSlugs.includes(c.groupSlug))
      .sort((a, b) => b.views - a.views)
      .map(c => c.id);
  }

  const q = intent.query.toLowerCase();
  return pool
    .filter(c => `${c.title} ${c.description ?? ""}`.toLowerCase().includes(q))
    .sort((a, b) => b.views - a.views)
    .map(c => c.id);
}

export function browseListTitleFromIntent(intent: CourseSearchIntent): string {
  if (!intent.query && intent.subjects.length === 0 && !intent.categorySlugs.length) {
    return "📚 Kurslar";
  }
  const key = intent.subjects[0] ?? intent.query;
  const label = SUBJECT_BY_KEY.get(key)?.label ?? intent.categorySlugs[0] ?? key;
  const lvl =
    intent.level === "beginner"
      ? " (boshlang'ich)"
      : intent.level === "some"
        ? " (o'rta)"
        : intent.level === "experienced"
          ? " (yuqori)"
          : "";
  const fmt = intent.format
    ? ` · ${intent.format === "offline" ? "Oflayn" : intent.format === "online" ? "Onlayn" : intent.format}`
    : "";
  const loc = intent.region ? ` · ${intent.region}` : "";
  return `🔎 ${label}${lvl}${fmt}${loc} bo'yicha kurslar`;
}

/** Eski API: faqat query kaliti bo'yicha sarlavha */
export function browseListTitle(query: string, level?: string): string {
  const intent = buildIntent({
    query: query.trim().toLowerCase(),
    subjects: SUBJECT_BY_KEY.has(query) ? [query] : detectSubjects(query).map(s => s.key),
    level: level as CourseSearchIntent["level"],
  });
  return browseListTitleFromIntent(intent);
}

/** Eski API: query string + level */
export async function searchListingsByQuery(query: string, level?: string): Promise<number[]> {
  const intent = buildIntent({
    query: query.trim().toLowerCase(),
    subjects: SUBJECT_BY_KEY.has(query) ? [query] : detectSubjects(query).map(s => s.key),
    level: level as CourseSearchIntent["level"],
  });
  return searchCoursesByIntent(intent);
}
