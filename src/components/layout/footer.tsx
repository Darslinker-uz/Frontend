import Link from "next/link";

const footerLinks = {
  Kategoriyalar: [
    { href: "/kurslar/dasturlash", label: "Dasturlash" },
    { href: "/kurslar/dizayn", label: "Dizayn" },
    { href: "/kurslar/marketing", label: "Marketing" },
    { href: "/kurslar/ingliz-tili", label: "Ingliz tili" },
    { href: "/kurslar/rus-tili", label: "Rus tili" },
  ],
  Platforma: [
    { href: "/kurslar", label: "Barcha kurslar" },
    { href: "/dashboard/listings/new", label: "E'lon berish" },
    { href: "/auth", label: "Kirish" },
  ],
  Maqolalar: [
    { href: "/blog", label: "Blog" },
    { href: "/blog/qanday-kurs-tanlash", label: "Qanday kurs tanlash" },
    { href: "/blog/online-vs-offline", label: "Online vs Offline" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-[#e4e7ea]">
      <div className="max-w-[1060px] mx-auto px-5 py-14">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <Link href="/" className="inline-block">
              <span className="text-[18px] font-[family-name:var(--font-outfit)] font-bold tracking-tight text-[#16181a]">
                Dars<span className="text-[#7ea2d4]">linker</span>.uz
              </span>
            </Link>
            <p className="text-[14px] text-[#7c8490] mt-3 max-w-[240px] leading-relaxed">
              O&apos;zbekistondagi eng yaxshi kurslarni bir joyda toping va
              solishtiring.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div
              key={title}
              className="col-span-1 md:col-span-2 lg:col-span-2"
            >
              <h3 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
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
          ))}
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
              href="#"
              className="w-9 h-9 rounded-[10px] border border-[#e4e7ea] flex items-center justify-center text-[#7c8490] hover:text-[#16181a] hover:border-[#16181a]/20 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="#"
              className="w-9 h-9 rounded-[10px] border border-[#e4e7ea] flex items-center justify-center text-[#7c8490] hover:text-[#16181a] hover:border-[#16181a]/20 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
