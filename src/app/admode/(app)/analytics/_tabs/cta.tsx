"use client";

import { useEffect, useState } from "react";
import { useAdminTheme } from "@/context/admin-theme-context";

type PeriodId = "1d" | "7d" | "30d" | "90d" | "apr" | "mar" | "feb" | "yan" | "dek" | "noy";

interface Row {
  key: string;
  label: string;
  shown: number;
  closed: number;
  instagram: number;
  telegram: number;
  none: number;
  clicks: number;
  rate: number;
}

interface Kpi {
  shown: number;
  closed: number;
  instagram: number;
  telegram: number;
  none: number;
  clicks: number;
  rate: number;
  uniqueVisitors: number;
  people: { closed: number; instagram: number; telegram: number };
}

interface SeriesPoint {
  date: string;
  shown: number;
  closed: number;
  instagram: number;
  telegram: number;
  none: number;
}

interface Data {
  kpi: Kpi;
  byTrigger: Row[];
  byDevice: Row[];
  byPage: Row[];
  series: SeriesPoint[];
}

type Cfg = ReturnType<typeof useAdminTheme>["config"];

const pct = (n: number, of: number) => (of > 0 ? `${Math.round((n / of) * 1000) / 10}%` : "0%");

export function CtaTab({ period }: { period: PeriodId }) {
  const { config } = useAdminTheme();
  // Natija qaysi davr uchun kelgani bilan saqlanadi — davr o'zgarganda "yuklanmoqda" o'zi hisoblanadi.
  const [result, setResult] = useState<{ period: PeriodId; data: Data | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/analytics/cta?period=${period}`)
      .then((r) => r.json())
      .then((d: Data) => {
        if (!cancelled) setResult({ period, data: d });
      })
      .catch((e) => {
        console.error("[cta]", e);
        if (!cancelled) setResult({ period, data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const loading = result?.period !== period;
  const data = result?.data ?? null;

  if (loading) {
    return <p className="text-[13px] py-12 text-center" style={{ color: config.textMuted }}>Yuklanmoqda...</p>;
  }
  if (!data || !data.kpi) {
    return <p className="text-[13px] py-12 text-center" style={{ color: config.textMuted }}>Ma&apos;lumotni yuklab bo&apos;lmadi</p>;
  }

  const { kpi } = data;
  const funnel: { label: string; count: number; color: string; hint?: string }[] = [
    { label: "Modal ko'rsatildi", count: kpi.shown, color: config.accent, hint: `${kpi.uniqueVisitors} ta noyob odam` },
    { label: "X bosib yopdi", count: kpi.closed, color: "#94a3b8", hint: `${kpi.people.closed} ta noyob odam` },
    { label: "Instagram bosdi", count: kpi.instagram, color: "#d6249f", hint: `${kpi.people.instagram} ta noyob odam` },
    { label: "Telegram bosdi", count: kpi.telegram, color: "#26A5E4", hint: `${kpi.people.telegram} ta noyob odam` },
    { label: "Hech narsa qilmay ketdi", count: kpi.none, color: "#f59e0b", hint: "Sahifani yopdi yoki boshqa sahifaga o'tdi" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Ko'rsatildi" value={kpi.shown} hint={`${kpi.uniqueVisitors} ta noyob odam`} config={config} />
        <Stat label="Ijtimoiy tarmoqqa o'tdi" value={kpi.clicks} hint="Instagram + Telegram" config={config} />
        <Stat label="Konversiya" value={`${kpi.rate}%`} hint="O'tganlar / ko'rsatilganlar" config={config} />
        <Stat label="Javobsiz ketdi" value={kpi.none} hint={pct(kpi.none, kpi.shown)} config={config} />
      </div>

      <Card config={config} title="CTA voronkasi" subtitle="Modal ko'rsatilgan har bir holat qanday tugaganini ko'rsatadi">
        {kpi.shown === 0 ? (
          <Empty config={config} />
        ) : (
          <div className="space-y-3">
            {funnel.map((f) => (
              <div key={f.label}>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <span className="text-[13px] font-medium" style={{ color: config.text }}>{f.label}</span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold tabular-nums" style={{ color: config.text }}>{f.count.toLocaleString()}</span>
                    <span className="tabular-nums" style={{ color: config.textDim }}>· {pct(f.count, kpi.shown)}</span>
                  </div>
                </div>
                <div className="h-6 rounded-md overflow-hidden" style={{ backgroundColor: config.hover }}>
                  <div className="h-full transition-all" style={{ width: `${(f.count / kpi.shown) * 100}%`, backgroundColor: f.color }} />
                </div>
                {f.hint && <p className="text-[10px] mt-1" style={{ color: config.textDim }}>{f.hint}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Breakdown config={config} title="Qaysi trigger ishladi?" subtitle="Modalni nima chiqargan" rows={data.byTrigger} />
        <Breakdown config={config} title="Qurilma bo'yicha" subtitle="Telefon va kompyuter" rows={data.byDevice} />
      </div>

      <Breakdown
        config={config}
        title="Sahifa turi bo'yicha"
        subtitle="Ariza formali sahifalarda modal yomon ishlasa, shu yerdan ko'rinadi"
        rows={data.byPage}
      />

      <Card config={config} title="Kunlik dinamika" subtitle="Ko'rsatuv kuni bo'yicha">
        {data.series.length === 0 ? (
          <Empty config={config} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ color: config.textMuted }}>
                  <Th>Sana</Th><Th right>Ko&apos;rsatildi</Th><Th right>Yopdi</Th><Th right>Instagram</Th><Th right>Telegram</Th><Th right>Javobsiz</Th>
                </tr>
              </thead>
              <tbody>
                {[...data.series].reverse().map((s) => (
                  <tr key={s.date} style={{ borderTop: `1px solid ${config.surfaceBorder}`, color: config.text }}>
                    <td className="py-2 pr-3 tabular-nums">{s.date}</td>
                    <Td>{s.shown}</Td><Td>{s.closed}</Td><Td>{s.instagram}</Td><Td>{s.telegram}</Td><Td>{s.none}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="text-[11px]" style={{ color: config.textDim }}>
        Statistikada faqat real mehmonlar: botlar va admin/assistant hisoblanmaydi. Modalni sinash uchun istalgan ochiq sahifa manziliga{" "}
        <code>?cta=preview</code> qo&apos;shing (hech narsa yozilmaydi).
      </p>
    </div>
  );
}

function Breakdown({ config, title, subtitle, rows }: { config: Cfg; title: string; subtitle: string; rows: Row[] }) {
  return (
    <Card config={config} title={title} subtitle={subtitle}>
      {rows.length === 0 ? (
        <Empty config={config} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ color: config.textMuted }}>
                <Th>Nomi</Th><Th right>Ko&apos;rsatildi</Th><Th right>Yopdi</Th><Th right>Instagram</Th><Th right>Telegram</Th><Th right>O&apos;tdi %</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} style={{ borderTop: `1px solid ${config.surfaceBorder}`, color: config.text }}>
                  <td className="py-2 pr-3">{r.label}</td>
                  <Td>{r.shown}</Td><Td>{r.closed}</Td><Td>{r.instagram}</Td><Td>{r.telegram}</Td>
                  <td className="py-2 text-right font-semibold tabular-nums">{r.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function Card({ config, title, subtitle, children }: { config: Cfg; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <h3 className="text-[15px] font-bold mb-1" style={{ color: config.text }}>{title}</h3>
      <p className="text-[12px] mb-4" style={{ color: config.textMuted }}>{subtitle}</p>
      {children}
    </div>
  );
}

function Empty({ config }: { config: Cfg }) {
  return (
    <p className="text-[13px] py-8 text-center" style={{ color: config.textMuted }}>
      Bu davrda hali ma&apos;lumot yo&apos;q — modal real mehmonlarga ko&apos;rsatilgach shu yerda paydo bo&apos;ladi
    </p>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th className={`py-2 font-medium ${right ? "text-right" : "text-left"} pr-3 last:pr-0`}>{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="py-2 pr-3 text-right tabular-nums">{children}</td>;
}

function Stat({ label, value, hint, config }: { label: string; value: number | string; hint?: string; config: Cfg }) {
  return (
    <div className="rounded-[10px] p-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <span className="text-[11px]" style={{ color: config.textMuted }}>{label}</span>
      <p className="text-[20px] font-bold tabular-nums mt-1" style={{ color: config.text }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {hint && <p className="text-[10px] mt-0.5" style={{ color: config.textDim }}>{hint}</p>}
    </div>
  );
}
