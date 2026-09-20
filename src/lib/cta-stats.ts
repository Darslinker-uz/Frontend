import { prisma } from "@/lib/prisma";
import { resolveRange, type PeriodId } from "@/lib/analytics-period";

type Outcome = "closed" | "instagram" | "telegram" | "none";

const TRIGGER_LABELS: Record<string, string> = {
  time: "2-sahifa + 20 soniya",
  scroll: "Yarmigacha scroll",
  exit: "Saytdan chiqmoqchi (desktop)",
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Telefon",
  desktop: "Kompyuter",
};

// Sahifa turi bo'yicha guruhlash — ariza formali sahifalarda modal yomon ishlamayaptimi, shuni ko'rish uchun.
export function pageGroup(path: string | null): string {
  if (!path) return "Noma'lum";
  const seg = path.split("?")[0].split("/").filter(Boolean);
  if (seg.length === 0) return "Bosh sahifa";
  const [a, b, c] = seg;
  if (a === "blog") return "Blog";
  if (a === "kurslar") {
    if (seg.length === 3 && b !== "g" && c !== "joy" && c !== "t") return "Kurs sahifasi (ariza formali)";
    return "Yo'nalish / kurslar ro'yxati";
  }
  if (a === "oquv-markazlar") return seg.length === 2 && b !== "barchasi" ? "Markaz sahifasi (ariza formali)" : "Markazlar ro'yxati";
  if (a === "repetitorlar") return seg.length === 2 && b !== "barcha" ? "Repetitor sahifasi (ariza formali)" : "Repetitorlar ro'yxati";
  if (a === "joylar") return "Joylar";
  if (a === "haqimizda") return "Haqimizda";
  return "Boshqa";
}

interface Tally {
  shown: number;
  closed: number;
  instagram: number;
  telegram: number;
  none: number;
}

const emptyTally = (): Tally => ({ shown: 0, closed: 0, instagram: 0, telegram: 0, none: 0 });

function withRate(t: Tally) {
  const clicks = t.instagram + t.telegram;
  return { ...t, clicks, rate: t.shown > 0 ? Math.round((clicks / t.shown) * 1000) / 10 : 0 };
}

// CTA modal voronkasi: tanlangan davrda ko'rsatilgan har bir modal (impression) qanday tugaganini hisoblaydi.
export async function getCtaStats(period: PeriodId) {
  const { start, end } = resolveRange(period);

  const shownRows = await prisma.ctaEvent.findMany({
    where: { eventType: "shown", createdAt: { gte: start, lt: end } },
    select: { impressionId: true, visitorId: true, trigger: true, path: true, device: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const ids = shownRows.map((r) => r.impressionId);
  const followRows = ids.length
    ? await prisma.ctaEvent.findMany({
        where: { impressionId: { in: ids }, eventType: { in: ["closed", "click_instagram", "click_telegram"] } },
        select: { impressionId: true, eventType: true },
      })
    : [];

  // Har ko'rsatuv uchun natija: bosish (instagram/telegram) yopishdan ustun, hech narsa bo'lmasa — "none".
  const outcomeById = new Map<string, Outcome>();
  for (const f of followRows) {
    const next: Outcome =
      f.eventType === "click_instagram" ? "instagram" : f.eventType === "click_telegram" ? "telegram" : "closed";
    const cur = outcomeById.get(f.impressionId);
    if (!cur || cur === "closed") outcomeById.set(f.impressionId, next);
  }

  const total = emptyTally();
  const byTrigger = new Map<string, Tally>();
  const byDevice = new Map<string, Tally>();
  const byPage = new Map<string, Tally>();
  const byDay = new Map<string, Tally>();
  const people = {
    shown: new Set<string>(),
    closed: new Set<string>(),
    instagram: new Set<string>(),
    telegram: new Set<string>(),
  };

  const add = (map: Map<string, Tally>, key: string, outcome: Outcome) => {
    const t = map.get(key) ?? emptyTally();
    t.shown += 1;
    t[outcome] += 1;
    map.set(key, t);
  };

  for (const r of shownRows) {
    const outcome = outcomeById.get(r.impressionId) ?? "none";
    total.shown += 1;
    total[outcome] += 1;
    people.shown.add(r.visitorId);
    if (outcome !== "none") people[outcome].add(r.visitorId);

    add(byTrigger, r.trigger ?? "unknown", outcome);
    add(byDevice, r.device ?? "unknown", outcome);
    add(byPage, pageGroup(r.path), outcome);
    add(byDay, r.createdAt.toISOString().slice(0, 10), outcome);
  }

  const rows = (map: Map<string, Tally>, labels?: Record<string, string>) =>
    [...map.entries()]
      .map(([key, t]) => ({ key, label: labels?.[key] ?? key, ...withRate(t) }))
      .sort((x, y) => y.shown - x.shown);

  return {
    period,
    kpi: {
      ...withRate(total),
      uniqueVisitors: people.shown.size,
      people: {
        closed: people.closed.size,
        instagram: people.instagram.size,
        telegram: people.telegram.size,
      },
    },
    byTrigger: rows(byTrigger, TRIGGER_LABELS),
    byDevice: rows(byDevice, DEVICE_LABELS),
    byPage: rows(byPage),
    series: [...byDay.entries()]
      .map(([date, t]) => ({ date, ...t }))
      .sort((x, y) => x.date.localeCompare(y.date)),
  };
}
