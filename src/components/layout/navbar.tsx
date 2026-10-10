"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Menu, X, BookOpen, MapPin, MessageCircle, ChevronDown, GraduationCap, Building2, Newspaper, ArrowUpRight } from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

const SUPPORT_URL = "https://t.me/Darslinker_Support";

// "Asosiy" ataylab yo'q: logotipning o'zi `/` ga link, takroriy ichki link
// bosh sahifaga hech narsa qo'shmaydi — slot Blog'ga berildi.
const mobileLinks = [
  { href: "/repetitorlar", label: "Repetitorlar", desc: "Shaxsiy ustozlar", icon: GraduationCap, primary: true },
  { href: "/oquv-markazlar", label: "Markazlar", desc: "O'quv markazlari", icon: Building2, primary: true },
  { href: "/joylar", label: "Joylar", desc: "Hudud bo'yicha", icon: MapPin, primary: false },
  { href: "/blog", label: "Blog", desc: "Maqolalar", icon: Newspaper, primary: false },
];

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  _count: { listings: number };
};
type ApiGroup = {
  id: number;
  name: string;
  slug: string;
  categories: ApiCategory[];
};
type ApiRegion = {
  id: number;
  name: string;
  slug: string;
  featured: boolean;
  listingCount: number;
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SPRING = "cubic-bezier(0.34, 1.4, 0.64, 1)";
// Scroll'dagi qora shisha kapsula. Tepada fon shaffof, lekin backdrop-filter
// doim yoqiq — shunda o'tish paytida blur "sakrab" paydo bo'lmaydi.
const NIGHT_GLASS: CSSProperties = {
  background: "rgba(22, 24, 26, 0.78)",
  boxShadow: "0 14px 44px -14px rgba(22, 24, 26, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  backdropFilter: "saturate(180%) blur(24px)",
  WebkitBackdropFilter: "saturate(180%) blur(24px)",
};
const CLEAR_GLASS: CSSProperties = {
  background: "rgba(22, 24, 26, 0)",
  boxShadow: "0 0 0 0 rgba(22, 24, 26, 0), inset 0 0 0 rgba(255, 255, 255, 0)",
  backdropFilter: "saturate(180%) blur(24px)",
  WebkitBackdropFilter: "saturate(180%) blur(24px)",
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [regions, setRegions] = useState<ApiRegion[]>([]);
  // Desktop havolalar ortidagi sirpanuvchi hover foni
  const [hoverBox, setHoverBox] = useState({ left: 0, width: 0 });
  const [hovering, setHovering] = useState(false);
  const megaRef = useRef<HTMLDivElement | null>(null);
  const megaPanelRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // Sahifa o'zgarganda menyu holatlarini tiklaymiz — Navbar layout
  // ichida bo'lgani uchun unmount bo'lmaydi, holatlar saqlanib qolmasin.
  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  // Scroll'da navbar kapsulaga yig'iladi. rAF bilan throttle.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobil menyu ochiq: orqa sahifa scroll bo'lmaydi, Escape yopadi.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Kategoriya + viloyat ma'lumotlarini bir marta olamiz.
  // Categories: groups[].categories[]._count.listings.
  // Regions: faqat featured + listingCount bilan.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/categories").then((r) => r.ok ? r.json() : { groups: [] }),
      fetch("/api/regions?featured=1&withCount=1").then((r) => r.ok ? r.json() : { regions: [] }),
    ])
      .then(([catsData, regionsData]: [{ groups?: ApiGroup[] }, { regions?: ApiRegion[] }]) => {
        if (cancelled) return;
        setGroups(Array.isArray(catsData.groups) ? catsData.groups : []);
        setRegions(Array.isArray(regionsData.regions) ? regionsData.regions : []);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Tashqarisiga bosilganda megamenu yopiladi + Escape tugmasi
  useEffect(() => {
    if (!megaOpen) return;
    const onClick = (e: globalThis.MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = megaRef.current?.contains(target);
      const inPanel = megaPanelRef.current?.contains(target);
      if (!inTrigger && !inPanel) setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMegaOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

  // Guruhlar admin tomonidan boshqariladi (active flag) — hammasi ko'rinadi.
  // Yo'nalishlar esa faqat aktiv kursi borlarni ko'rsatamiz (avtomatik).
  const groupsForMega = groups.slice(0, 7).map((g) => ({
    name: g.name,
    slug: g.slug,
    cats: g.categories
      .filter((c) => c._count.listings > 0)
      .sort((a, b) => b._count.listings - a._count.listings)
      .slice(0, 8),
  }));

  // Mashhur shaharlar: admin nazoratida (featured=true) + faqat 1+ aktiv kursli.
  const featuredRegions = regions
    .filter((r) => r.listingCount > 0)
    .slice(0, 6);

  // Mobil menyu ochiq bo'lsa ham kapsula holatida turadi (oq matn, qora shisha).
  const night = scrolled || open;
  const tab = open ? 0 : -1;

  const onLinkEnter = (e: MouseEvent<HTMLElement>) => {
    setHoverBox({ left: e.currentTarget.offsetLeft, width: e.currentTarget.offsetWidth });
    setHovering(true);
  };
  // Rang <nav> dan meros olinadi (kechiktirilgan o'tish uchun) — hover faqat opacity.
  const desktopLink = "relative inline-flex items-center gap-1 h-9 px-3.5 rounded-full text-[14px] font-semibold text-inherit opacity-70 hover:opacity-100 transition-opacity duration-300";

  // Ketma-ketlik: pastga — avval shakl (torayish + radius), keyin fon qorayadi;
  // tepaga — avval fon ochiladi, keyin shakl yoyiladi. --nav-d: shakl, --nav-b: rang.
  const shapeDelay = night ? "0ms" : "var(--nav-b)";
  const paintDelay = night ? "var(--nav-d)" : "0ms";
  const shape = (prop: string) => `${prop} var(--nav-d) ${EASE} ${shapeDelay}`;
  const paint = (prop: string) => `${prop} var(--nav-b) linear ${paintDelay}`;
  const inkStyle: CSSProperties = { transition: paint("color") };
  const ink = night ? "text-white" : "text-[#16181a]";

  // Mobil kartalar navbat bilan "qo'nadi"; yopilganda hammasi birdan ketadi.
  const cardClass = `transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
    open ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-4"
  }`;
  const cardStyle = (i: number): CSSProperties => ({
    transitionDelay: open ? `${60 + i * 60}ms` : "0ms",
    transitionTimingFunction: SPRING,
  });
  const cardGlass = "rounded-[22px] border border-white/10 bg-[#16181a]/80 text-white";

  return (
    <header className="sticky top-0 z-[60] h-[62px] pointer-events-none [--nav-d:360ms] md:[--nav-d:600ms] [--nav-b:240ms] motion-reduce:[--nav-d:0ms]! motion-reduce:[--nav-b:0ms]!">
      {/* Mobil menyu — sahifa xiralashadi, ustida shisha kartalar */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 bg-[#16181a]/40 backdrop-blur-xl transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      <div
        aria-hidden={!open}
        className={`md:hidden fixed inset-x-3 top-[76px] max-h-[calc(100dvh-100px)] overflow-y-auto ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="grid grid-cols-2 gap-2">
          {mobileLinks.filter((l) => l.primary).map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              tabIndex={tab}
              className={`${cardGlass} ${cardClass} flex aspect-[1.15] flex-col justify-between p-4`}
              style={cardStyle(i)}
            >
              <l.icon className="h-7 w-7 text-[#7ea2d4]" />
              <span>
                <span className="block text-[17px] font-bold leading-tight">{l.label}</span>
                <span className="mt-1 block text-[12px] text-white/50">{l.desc}</span>
              </span>
            </Link>
          ))}

          {/* Kurslar — barcha kurslar + yo'nalish guruhlari */}
          <div className={`${cardGlass} ${cardClass} col-span-2 p-4`} style={cardStyle(2)}>
            <Link href="/kurslar" onClick={() => setOpen(false)} tabIndex={tab} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[17px] font-bold">
                <BookOpen className="h-5 w-5 text-[#7ea2d4]" />
                Kurslar
              </span>
              <span className="flex items-center gap-1 text-[12.5px] font-semibold text-[#7ea2d4]">
                Barchasi <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            {groupsForMega.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {groupsForMega.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/kurslar/g/${g.slug}`}
                    onClick={() => setOpen(false)}
                    tabIndex={tab}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] font-medium text-white/75"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {mobileLinks.filter((l) => !l.primary).map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              tabIndex={tab}
              className={`${cardGlass} ${cardClass} flex h-14 items-center justify-center gap-2 text-[15px] font-semibold`}
              style={cardStyle(3 + i)}
            >
              <l.icon className="h-4 w-4 text-[#7ea2d4]" />
              {l.label}
            </Link>
          ))}

          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            tabIndex={tab}
            className={`${cardClass} col-span-2 flex h-14 items-center justify-center gap-2 rounded-[22px] bg-[#7ea2d4] text-[15px] font-semibold text-white`}
            style={cardStyle(5)}
          >
            <MessageCircle className="h-4 w-4" />
            Yordam
          </a>
        </div>
      </div>

      {/* Kenglik padding orqali qisqaradi: 100vw → 1000px (mobilda chetdan 12px). */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          paddingInline: night ? "max(12px, calc((100vw - 1000px) / 2))" : "0px",
          transform: night ? "translateY(10px)" : "translateY(0px)",
          transition: [shape("padding"), shape("transform")].join(", "),
        }}
      >
        <div
          className={`relative pointer-events-auto flex items-center justify-between ${
            night ? "h-[54px] pl-5 pr-3 md:pl-6 md:pr-2.5" : "h-[62px] px-4 md:px-20"
          }`}
          style={{
            borderRadius: night ? 999 : 0,
            ...(night ? NIGHT_GLASS : CLEAR_GLASS),
            transition: [shape("height"), shape("padding"), shape("border-radius"), paint("background-color"), paint("box-shadow")].join(", "),
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <DarslinkerLogo size={28} />
            <span className={`text-[20px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight ${ink}`} style={inkStyle}>
              Dars<span className="text-[#7ea2d4]">Linker</span>
            </span>
          </Link>

          {/* Desktop havolalar — markazda; hover foni havoladan havolaga sirpanadi */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <nav aria-label="Asosiy" className={`relative flex items-center gap-0.5 ${ink}`} style={inkStyle} onMouseLeave={() => setHovering(false)}>
              <span
                aria-hidden
                className="absolute top-0 h-9 rounded-full transition-all duration-300 motion-reduce:transition-none"
                style={{
                  left: hoverBox.left,
                  width: hoverBox.width,
                  opacity: hovering ? 1 : 0,
                  background: night ? "rgba(255, 255, 255, 0.13)" : "rgba(22, 24, 26, 0.07)",
                  transitionTimingFunction: EASE,
                }}
              />
              {/* Joylar — hudud bo'yicha lokal SEO sahifa */}
              <Link href="/joylar" className={desktopLink} onMouseEnter={onLinkEnter}>Joylar</Link>
              <Link href="/repetitorlar" className={desktopLink} onMouseEnter={onLinkEnter}>Repetitorlar</Link>
              <Link href="/oquv-markazlar" className={desktopLink} onMouseEnter={onLinkEnter}>Markazlar</Link>
              <div ref={megaRef} onMouseEnter={onLinkEnter}>
                <button type="button" onClick={() => setMegaOpen((v) => !v)} className={desktopLink} aria-expanded={megaOpen} aria-haspopup="menu">
                  Kurslar
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
              {/* Blog — tahliliy maqolalar, topical authority */}
              <Link href="/blog" className={desktopLink} onMouseEnter={onLinkEnter}>Blog</Link>
            </nav>
          </div>

          {/* Desktop Yordam button — o'ng burchakda */}
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#7ea2d4] text-white text-[14px] font-medium hover:bg-[#5b87c0] transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            Yordam
          </a>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
            className="md:hidden p-2"
          >
            <div className={`relative w-6 h-6 ${ink}`} style={inkStyle}>
              <Menu className={`h-6 w-6 absolute inset-0 transition-all duration-300 ${open ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`} />
              <X className={`h-6 w-6 absolute inset-0 transition-all duration-300 ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`} />
            </div>
          </button>
        </div>

        {/* Desktop Megamenu */}
        {megaOpen && groupsForMega.length > 0 && (
          <div
            ref={megaPanelRef}
            className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 pt-2 pointer-events-auto"
          >
            <div
              className="bg-white rounded-[16px] border border-[#e4e7ea] shadow-2xl shadow-black/10 p-6 w-[min(1100px,calc(100vw-40px))]"
            >
              <div
                className="grid gap-x-6 gap-y-2"
                style={{ gridTemplateColumns: `repeat(${Math.min(groupsForMega.length, 4)}, minmax(0, 1fr))` }}
              >
                {groupsForMega.map((g) => (
                  <div key={g.slug} className="min-w-0">
                    <Link
                      href={`/kurslar/g/${g.slug}`}
                      className="block text-[13px] font-bold uppercase tracking-wider text-[#16181a] hover:text-[#7ea2d4] transition-colors mb-2.5"
                      onClick={() => setMegaOpen(false)}
                    >
                      {g.name}
                    </Link>
                    <ul className="space-y-1.5">
                      {g.cats.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/kurslar/${c.slug}`}
                            className="block text-[13.5px] text-[#16181a]/70 hover:text-[#16181a] transition-colors leading-snug"
                            onClick={() => setMegaOpen(false)}
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={`/kurslar/g/${g.slug}`}
                          className="inline-block mt-1 text-[12.5px] text-[#7ea2d4] hover:text-[#5b87c0] font-semibold transition-colors"
                          onClick={() => setMegaOpen(false)}
                        >
                          Barchasini ko&apos;rish &rarr;
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
              {featuredRegions.length > 0 && (
                <div className="border-t border-[#e4e7ea] mt-5 pt-4 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-[12px] text-[#7c8490] font-medium">Mashhur shaharlar:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {featuredRegions.map((r) => (
                      <Link
                        key={r.id}
                        href={`/kurslar?region=${encodeURIComponent(r.name)}`}
                        className="text-[12.5px] text-[#16181a]/70 hover:text-[#16181a] hover:bg-[#f2f4f5] rounded-md px-2 py-1 transition-colors"
                        onClick={() => setMegaOpen(false)}
                      >
                        {r.name}
                      </Link>
                    ))}
                    <Link
                      href="/kurslar"
                      className="text-[12.5px] text-[#7ea2d4] hover:text-[#5b87c0] font-semibold ml-2 transition-colors"
                      onClick={() => setMegaOpen(false)}
                    >
                      Barcha kurslar &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
