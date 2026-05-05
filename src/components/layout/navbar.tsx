"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, BookOpen, Wifi, WifiOff, PenLine, MessageCircle, ChevronDown, Info } from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

const mobileBaseLinks = [
  { href: "/", label: "Asosiy", icon: Home },
  { href: "/kurslar?format=online", label: "Onlayn", icon: Wifi },
  { href: "/kurslar?format=offline", label: "Oflayn", icon: WifiOff },
  { href: "/blog", label: "Blog", icon: PenLine },
  { href: "/haqimizda", label: "Haqimizda", icon: Info },
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

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [regions, setRegions] = useState<ApiRegion[]>([]);
  const [mobileKurslarOpen, setMobileKurslarOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);
  const megaRef = useRef<HTMLDivElement | null>(null);
  const megaPanelRef = useRef<HTMLDivElement | null>(null);

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
    const onClick = (e: MouseEvent) => {
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

  return (
    <header className="sticky top-0 z-[60]">
      {/* Glass fon — menu yopiq holatda. Menu ochilganda dropdown
          to'g'ridan-to'g'ri navbar ostidan ham ko'rinadi */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-200"
        aria-hidden
        style={{
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: open ? "none" : "saturate(200%) blur(40px)",
          WebkitBackdropFilter: open ? "none" : "saturate(200%) blur(40px)",
          opacity: open ? 0 : 1,
        }}
      />
      <div className="relative z-[70] px-4 md:max-w-[1600px] md:mx-auto md:px-20 flex items-center justify-between h-[62px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <DarslinkerLogo size={28} />
          <span className="text-[20px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight text-[#16181a]">
            Dars<span className="text-[#7ea2d4]">Linker</span>
          </span>
        </Link>

        {/* Desktop Actions — center */}
        <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <Link href="/">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Asosiy
            </Button>
          </Link>
          {/* Kurslar — click-toggle megamenu trigger */}
          <div className="relative" ref={megaRef}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMegaOpen((v) => !v)}
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium gap-1"
              aria-expanded={megaOpen}
              aria-haspopup="menu"
            >
              Kurslar
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
            </Button>
          </div>
          <Link href="/kurslar?format=online">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Onlayn
            </Button>
          </Link>
          <Link href="/kurslar?format=offline">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Oflayn
            </Button>
          </Link>
          <Link href="/blog">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Blog
            </Button>
          </Link>
          <Link href="/haqimizda">
            <Button
              variant="ghost"
              className="rounded-[10px] text-[#16181a] hover:bg-[#f2f4f5] h-9 px-4 text-[14px] font-medium"
            >
              Haqimizda
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-[10px] hover:bg-[#f2f4f5] transition-colors relative z-[60]">
          <div className="relative w-5 h-5">
            <Menu className={`h-5 w-5 text-[#16181a] absolute inset-0 transition-all duration-300 ${open ? "opacity-0 scale-50" : "opacity-100 scale-100"}`} />
            <X className={`h-5 w-5 text-[#16181a] absolute inset-0 transition-all duration-300 ${open ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
          </div>
        </button>
      </div>

      {/* Desktop Megamenu */}
      {megaOpen && groupsForMega.length > 0 && (
        <div
          ref={megaPanelRef}
          className="hidden md:block absolute top-[62px] left-1/2 -translate-x-1/2 z-[80] pt-2"
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

      {/* Mobile Dropdown Menu — bounce animation */}
      <div
        className={`md:hidden fixed left-0 right-0 z-[55] origin-top transition-transform duration-600 ${open ? "translate-y-0" : "-translate-y-full"}`}
        style={{
          top: "-200px",
          height: "780px",
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "saturate(200%) blur(40px)",
          WebkitBackdropFilter: "saturate(200%) blur(40px)",
          transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        <div className="flex flex-col h-full pt-[262px] pb-6 px-4 overflow-y-auto">
          <nav className="flex-1 flex flex-col items-center justify-center gap-1.5">
            <div className="w-full flex flex-col gap-1.5 items-center">
              {/* Asosiy */}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="w-full flex items-center py-4 text-[20px] font-semibold text-[#16181a]/70 hover:text-[#16181a] hover:bg-white/50 rounded-xl border border-[#16181a]/10 transition-colors"
              >
                <Home className="w-5 h-5 shrink-0 ml-auto mr-3" />
                <span className="mr-auto">Asosiy</span>
              </Link>

              {/* Kurslar — accordion */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => setMobileKurslarOpen((v) => !v)}
                  className="w-full flex items-center py-4 text-[20px] font-semibold text-[#16181a]/70 hover:text-[#16181a] hover:bg-white/50 rounded-xl border border-[#16181a]/10 transition-colors"
                  aria-expanded={mobileKurslarOpen}
                >
                  <BookOpen className="w-5 h-5 shrink-0 ml-auto mr-3" />
                  <span className="mr-auto flex items-center gap-2">
                    Kurslar
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileKurslarOpen ? "rotate-180" : ""}`} />
                  </span>
                </button>
                {mobileKurslarOpen && (
                  <div className="mt-1.5 space-y-1.5">
                    <Link
                      href="/kurslar"
                      onClick={() => setOpen(false)}
                      className="block w-full text-center py-2.5 text-[14px] font-semibold text-[#7ea2d4] hover:bg-white/50 rounded-lg border border-[#7ea2d4]/30 transition-colors"
                    >
                      Barcha kurslar
                    </Link>
                    {groupsForMega.map((g) => (
                      <div key={g.slug} className="rounded-lg border border-[#16181a]/10 bg-white/40">
                        <button
                          type="button"
                          onClick={() => setMobileExpandedGroup((v) => (v === g.slug ? null : g.slug))}
                          className="w-full flex items-center justify-between px-4 py-3 text-[14px] font-semibold text-[#16181a]/80"
                          aria-expanded={mobileExpandedGroup === g.slug}
                        >
                          <span>{g.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === g.slug ? "rotate-180" : ""}`} />
                        </button>
                        {mobileExpandedGroup === g.slug && (
                          <ul className="px-4 pb-3 space-y-1.5">
                            {g.cats.map((c) => (
                              <li key={c.slug}>
                                <Link
                                  href={`/kurslar/${c.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="block py-1.5 text-[13.5px] text-[#16181a]/70 hover:text-[#16181a]"
                                >
                                  {c.name}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link
                                href={`/kurslar/g/${g.slug}`}
                                onClick={() => setOpen(false)}
                                className="inline-block mt-0.5 text-[12.5px] text-[#7ea2d4] font-semibold"
                              >
                                Barchasini ko&apos;rish &rarr;
                              </Link>
                            </li>
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Qolgan linklar */}
              {mobileBaseLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center py-4 text-[20px] font-semibold text-[#16181a]/70 hover:text-[#16181a] hover:bg-white/50 rounded-xl border border-[#16181a]/10 transition-colors"
                >
                  <link.icon className="w-5 h-5 shrink-0 ml-auto mr-3" />
                  <span className="mr-auto">{link.label}</span>
                </Link>
              ))}
            </div>
          </nav>
          {/* Yordam tugma */}
          <a
            href="https://t.me/DarslinkerSupport"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-4 text-[16px] font-semibold text-[#16181a]/80 hover:text-[#16181a] hover:bg-white/40 rounded-xl border border-[#16181a]/10 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Yordam
          </a>
        </div>
      </div>

      {/* Backdrop overlay — menu ortida */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-[45] bg-black/15 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
