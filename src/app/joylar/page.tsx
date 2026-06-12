import type { Metadata } from "next";
import Link from "next/link";
import { getActiveRegions } from "@/lib/regions";
import { getActiveListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "Joylar — O'zbekistondagi kurslar hududlar bo'yicha | Darslinker",
  description:
    "O'zbekiston bo'yicha barcha hududlardagi o'quv markazlari va kurslar — Toshkent, Samarqand, Buxoro va boshqa shaharlar.",
  alternates: { canonical: `${SITE_URL}/joylar` },
};

export default async function JoylarIndexPage() {
  const regions = await getActiveRegions();
  const allListings = await getActiveListings({ includeRemote: false });

  const counts = allListings.reduce<Record<string, number>>((acc, l) => {
    if (l.region) acc[l.region] = (acc[l.region] ?? 0) + 1;
    for (const b of l.branches ?? []) {
      if (b.region) acc[b.region] = (acc[b.region] ?? 0) + 1;
    }
    return acc;
  }, {});

  const regionsWithCount = regions
    .map((r) => ({ ...r, count: counts[r.name] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  return (
    <main className="bg-white min-h-screen">
      <article className="max-w-[1100px] mx-auto px-5 md:px-6 py-10 md:py-14">
        <header className="mb-10">
          <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
            O&apos;zbekiston bo&apos;yicha o&apos;quv markazlar
          </h1>
          <p className="mt-4 text-[15.5px] md:text-[17px] text-[#16181a]/75 leading-relaxed max-w-[720px]">
            Hududingizni tanlang va o&apos;sha joydagi barcha o&apos;quv markazlari va kurslarni bir joyda ko&apos;ring.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {regionsWithCount.map((r) => (
            <Link
              key={r.slug}
              href={`/joylar/${r.slug}`}
              className="group block bg-white rounded-[12px] border border-[#e4e7ea] hover:border-[#16181a]/20 hover:shadow-md transition-all p-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#16181a]">{r.name}</h2>
                <span className="text-[13px] text-[#7c8490]">{r.count} kurs</span>
              </div>
            </Link>
          ))}
        </section>
      </article>
    </main>
  );
}
