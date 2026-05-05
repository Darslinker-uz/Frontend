import Link from "next/link";
import { getActiveCategoryGroups } from "@/lib/listings";

const platformLinks = [
  { href: "/kurslar", label: "Barcha kurslar" },
  { href: "/kurslar?format=online", label: "Onlayn kurslar" },
  { href: "/kurslar?format=offline", label: "Oflayn kurslar" },
  { href: "/manba", label: "Manba" },
  { href: "/blog", label: "Maqolalar" },
  { href: "/haqimizda", label: "Haqimizda" },
  { href: "/hamkorlik", label: "Hamkorlik qilish" },
];

export async function Footer() {
  // Guruhlar va eng mashhur yo'nalishlarni server'dan olamiz. Xato yuzaga
  // kelsa (DB tushib qolgan vaziyat) — fallback'siz bo'sh ro'yxat bilan
  // ishlaydi, footer baribir xatosiz render bo'ladi.
  let groups: Awaited<ReturnType<typeof getActiveCategoryGroups>> = [];
  try {
    groups = await getActiveCategoryGroups();
  } catch {
    groups = [];
  }

  // Top yo'nalishlar — faqat aktiv kursi bor (count > 0) yo'nalishlar.
  // Har guruhdan eng ko'p e'lonli 2 ta, keyin umumiy bo'yicha tartiblab 12 ta tanlaymiz.
  const allCats = groups
    .flatMap((g) =>
      g.categories
        .filter((c) => c.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 2)
        .map((c) => ({ name: c.name, slug: c.slug, count: c.count })),
    )
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Guruhlar — admin nazoratida (kursi bor-yo'qligiga qaramay), 7 tasini ko'rsatamiz.
  const topGroups = groups
    .slice()
    .sort((a, b) => b.listingsCount - a.listingsCount)
    .slice(0, 7);

  return (
    <footer className="mt-auto bg-white border-t border-[#e4e7ea]">
      <div className="max-w-[1280px] mx-auto px-5 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-[18px] font-bold tracking-tight text-[#16181a]">
                darslinker.uz
              </span>
            </Link>
            <p className="text-[14px] text-[#7c8490] mt-3 max-w-[240px] leading-relaxed">
              O&apos;zbekistondagi eng yaxshi kurslarni bir joyda toping.
            </p>
          </div>

          {/* Yo'nalishlar */}
          <div className="col-span-1">
            <h3 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-4">
              Yo&apos;nalishlar
            </h3>
            <ul className="space-y-2.5">
              {allCats.length > 0 ? (
                allCats.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/kurslar/${cat.slug}`}
                      className="text-[14px] text-[#16181a]/70 hover:text-[#16181a] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/kurslar"
                    className="text-[14px] text-[#16181a]/70 hover:text-[#16181a] transition-colors"
                  >
                    Barcha kurslar
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Yo'nalish guruhlari */}
          <div className="col-span-1">
            <h3 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-4">
              Guruhlar
            </h3>
            <ul className="space-y-2.5">
              {topGroups.length > 0 ? (
                topGroups.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/kurslar/g/${g.slug}`}
                      className="text-[14px] text-[#16181a]/70 hover:text-[#16181a] transition-colors"
                    >
                      {g.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/kurslar"
                    className="text-[14px] text-[#16181a]/70 hover:text-[#16181a] transition-colors"
                  >
                    Kurslar
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Platforma */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-4">
              Platforma
            </h3>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-[#16181a]/70 hover:text-[#16181a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e4e7ea] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#7c8490]">
            &copy; {new Date().getFullYear()} Darslinker. Barcha huquqlar
            himoyalangan.
          </p>
          <div className="flex items-center gap-2">
            {/* Telegram */}
            <a
              href="https://t.me/darslinker"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-[10px] border border-[#e4e7ea] flex items-center justify-center text-[#7c8490] hover:text-[#16181a] hover:border-[#16181a]/20 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/darslinker"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-[10px] border border-[#e4e7ea] flex items-center justify-center text-[#7c8490] hover:text-[#16181a] hover:border-[#16181a]/20 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
