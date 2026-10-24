"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { BookOpen, MapPin, MessageCircle, ChevronDown, GraduationCap, Building2, Newspaper, ArrowUpRight, LayoutGrid, Wallet, Headset } from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";
import { scrollToTop } from "@/components/smooth-scroll";
import { CrmApplyButton } from "@/components/crm/crm-apply";
import { CRM_HOME, MARKETPLACE_HOME, isCatalogPage, isCrmPage } from "@/lib/crm-pages";

const SUPPORT_URL = "https://t.me/Darslinker_Support";

// Navbar CTA qoidasi: CRM/LMS sahifalarida — "Ariza qoldirish" (ariza modali),
// katalog sahifalarida (kurslar, markazlar, repetitorlar, joylar, blog…) — "Yordam".
// CRM sahifalari ro'yxati — src/lib/crm-pages.ts. Ko'rinish ham ikkiga bo'lingan: CRM sahifasida
// yangi (shaffof tepa, ko'kish shisha kapsula, katta logo), katalogda — asl (qora kapsula).

// "Asosiy" ataylab yo'q: logotipning o'zi `/` ga link, takroriy ichki link
// bosh sahifaga hech narsa qo'shmaydi — slot Blog'ga berildi.
const mobileLinks = [
  { href: "/repetitorlar", label: "Repetitorlar", desc: "Shaxsiy ustozlar", icon: GraduationCap, primary: true },
  { href: "/oquv-markazlar", label: "Markazlar", desc: "O'quv markazlari", icon: Building2, primary: true },
  { href: "/joylar", label: "Joylar", desc: "Hudud bo'yicha", icon: MapPin, primary: false },
  { href: "/blog", label: "Blog", desc: "Maqolalar", icon: Newspaper, primary: false },
];

// CRM/LMS sahifalaridagi havolalar — hammasi alohida sahifalarga (bosh sahifa bo'limlariga emas):
// har sahifadan ichki havola oladi, SEO uchun shu muhimroq. Dropdown ataylab yo'q (2026-10-25 qarori).
const crmLinks = [
  { href: "/features", label: "Imkoniyatlar", desc: "Darslinker nima qiladi", icon: LayoutGrid },
  { href: "/features/support", label: "Support", desc: "O'rnatish va yordam", icon: Headset },
  { href: "/pricing", label: "Tariflar", desc: "Narx va chegirmalar", icon: Wallet },
  { href: "/blog", label: "Blog", desc: "Maqolalar", icon: Newspaper },
  { href: "/contact", label: "Aloqa", desc: "Telegram va ariza", icon: MessageCircle },
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
// Scroll'dagi kapsula — ko'kish muz shisha, chegarasiz. Fon shaffofroq va blur kuchli:
// ostidagi kontent xira ko'rinadi, lekin matn o'qilishiga xalaqit bermaydi.
const CAPSULE_WIDTH = 1200;
const CAPSULE_HEIGHT = 60;
const TOP_HEIGHT = 78;
// Zichroq va kam to'yingan: ostidagi rangli kartalar (oltin, ultramarin...) kapsulani bo'yab yubormasin.
const ICE_GLASS: CSSProperties = {
  background: "rgba(238, 243, 249, 0.9)",
  boxShadow: "0 12px 36px -16px rgba(45, 90, 138, 0.35), 0 0 0 1px rgba(22, 24, 26, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
  backdropFilter: "saturate(120%) blur(24px)",
  WebkitBackdropFilter: "saturate(120%) blur(24px)",
};

// CRM: tepada (hero holatida) navbar to'liq shaffof — hero foni (Aurora) ortidan ko'rinsin.
// Scroll'da ICE_GLASS kapsulasiga o'tadi.
const CLEAR_TOP: CSSProperties = {
  background: "rgba(240, 242, 243, 0)",
  boxShadow: "0 0 0 0 rgba(22, 24, 26, 0), inset 0 0 0 rgba(255, 255, 255, 0)",
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
};

// Katalog (asl ko'rinish): scroll'da qora shisha kapsula — ostidagi kontent matnni o'qishga xalaqit
// bermasligi uchun deyarli to'q. Tepada sahifa foni rangidagi och shisha.
const NIGHT_GLASS: CSSProperties = {
  background: "rgba(22, 24, 26, 0.92)",
  boxShadow: "0 14px 44px -14px rgba(22, 24, 26, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  backdropFilter: "saturate(180%) blur(24px)",
  WebkitBackdropFilter: "saturate(180%) blur(24px)",
};
const LIGHT_GLASS: CSSProperties = {
  background: "rgba(240, 242, 243, 0.82)",
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

  // Kapsula faqat scroll'da. Tepada (hero'da) mobil menyu ochilganda navbar
  // joyidan ham, ko'rinishidan ham o'zgarmaydi — sakrab tushmasin.
  const night = scrolled;
  const crm = isCrmPage(pathname);
  // Kapsula o'lchamlari: CRM — yangi, katalog — asl.
  const capsuleW = crm ? CAPSULE_WIDTH : 1000;
  const capsuleH = crm ? CAPSULE_HEIGHT : 54;
  const topH = crm ? TOP_HEIGHT : 62;
  const tab = open ? 0 : -1;

  // Bosh sahifada turib logotip bosilsa URL o'zgarmaydi, shuning uchun Next
  // scroll qilmaydi — o'zimiz tepaga (hero'ga) qaytaramiz.
  // Katalog sahifalarida (marketplace, kurslar, markazlar…) logotip katalog bosh sahifasiga olib boradi.
  const logoHref = isCatalogPage(pathname) ? MARKETPLACE_HOME : CRM_HOME;
  const onLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== logoHref || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(false);
    setMegaOpen(false);
    scrollToTop();
  };

  // CRM havolasi bosh sahifada bosilsa — sahifa qayta yuklanmaydi, bo'limga silliq scroll.
  // Mobil menyu avval yopiladi (body qotirig'i olinsin), keyin scroll boshlanadi.
  const onSectionClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Scroll'ning o'zi SmoothScroll'dagi umumiy ishlovchida (capture) — bu yerda faqat mobil menyu yopiladi.
    if (pathname !== CRM_HOME || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    setOpen(false);
  };

  const onLinkEnter = (e: MouseEvent<HTMLElement>) => {
    setHoverBox({ left: e.currentTarget.offsetLeft, width: e.currentTarget.offsetWidth });
    setHovering(true);
  };
  // Rang <nav> dan meros olinadi (kechiktirilgan o'tish uchun) — hover faqat opacity.
  const desktopLink = "relative inline-flex items-center gap-1 h-10 px-4 rounded-full whitespace-nowrap text-[15.5px] font-semibold tracking-[-0.01em] text-inherit opacity-90 hover:opacity-100 transition-opacity duration-300";

  // Pastga — fon burchaklar yumaloqlanishi bilan bir vaqtda, bir xil tezlikda
  // qorayadi (torayish davom etaveradi); tepaga — avval fon ochiladi, keyin shakl yoyiladi.
  // --nav-d: torayish, --nav-r: radius, --nav-p: rang kirishi, --nav-b: rang chiqishi.
  const shapeDelay = night ? "0ms" : "var(--nav-b)";
  const shape = (prop: string) => `${prop} var(--nav-d) ${EASE} ${shapeDelay}`;
  const paint = (prop: string) => (night ? `${prop} var(--nav-p) ${EASE}` : `${prop} var(--nav-b) linear`);
  const inkStyle: CSSProperties = { transition: paint("color") };
  // Katalogda qora kapsulada matn oq; CRM'da doim to'q.
  const ink = night && !crm ? "text-white" : "text-[#16181a]";

  // Mobil menyu ikki xil: CRM sahifasida — och kartalar, bitta blok bo'lib birdan ochiladi;
  // katalogda (asl) — qora shisha kartalar navbat bilan "qo'nadi", yopilganda hammasi birdan ketadi.
  const panelClass = crm
    ? `origin-top transition-[opacity,transform] motion-reduce:transition-none ${
        open ? "opacity-100 translate-y-0 scale-100 duration-[420ms]" : "opacity-0 -translate-y-2 scale-[0.97] duration-200"
      }`
    : "";
  const cardClass = crm
    ? ""
    : `transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
        open ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-4"
      }`;
  const cardStyle = (i: number): CSSProperties | undefined =>
    crm ? undefined : { transitionDelay: open ? `${60 + i * 60}ms` : "0ms", transitionTimingFunction: SPRING };
  const cardGlass = crm
    ? "rounded-[22px] border border-[#2d5a8a]/10 bg-white/85 text-[#16181a] shadow-[0_10px_30px_-18px_rgba(45,90,138,0.45)]"
    : "rounded-[22px] border border-white/10 bg-[#16181a]/80 text-white";
  const cardIcon = crm ? "text-[#2d5a8a]" : "text-[#7ea2d4]";
  const cardMuted = crm ? "text-[#16181a]/55" : "text-white/50";

  return (
    <header className="sticky top-0 z-[60] h-[62px] pointer-events-none [--nav-d:360ms] md:[--nav-d:600ms] [--nav-r:150ms] md:[--nav-r:240ms] [--nav-p:210ms] md:[--nav-p:340ms] [--nav-b:120ms] motion-reduce:[--nav-d:0ms]! motion-reduce:[--nav-r:0ms]! motion-reduce:[--nav-p:0ms]! motion-reduce:[--nav-b:0ms]!">
      {/* Mobil menyu — sahifa xiralashadi, ustida shisha kartalar. Fon ekrandan
          160px tashqariga chiqadi: mobil brauzerlarda manzil/asboblar paneli
          yig'ilganda `inset-0` pastki bo'lakni yopmay qoladi. */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-x-0 -inset-y-40 ${crm ? "bg-[#eef3f9]/70" : "bg-[#16181a]/40"} backdrop-blur-xl transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      <div
        aria-hidden={!open}
        className={`md:hidden fixed inset-x-3 ${crm ? "top-[88px] max-h-[calc(100dvh-112px)]" : "top-[76px] max-h-[calc(100dvh-100px)]"} overflow-y-auto ${panelClass} ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        style={crm ? { transitionTimingFunction: EASE } : undefined}
      >
        <div className="grid grid-cols-2 gap-2">
          {crm && crmLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => onSectionClick(e)}
              tabIndex={tab}
              // Toq son bo'lsa oxirgisi butun qatorni egallaydi (2 ustunli to'r).
              className={`${cardGlass} flex flex-col justify-between p-4 ${crmLinks.length % 2 && i === crmLinks.length - 1 ? "col-span-2 min-h-[104px]" : "aspect-[1.4]"}`}
            >
              <l.icon className="h-6 w-6 text-[#2d5a8a]" />
              <span>
                <span className="block text-[16px] font-bold leading-tight">{l.label}</span>
                <span className="mt-1 block text-[12px] text-[#16181a]/55">{l.desc}</span>
              </span>
            </Link>
          ))}

          {!crm && mobileLinks.filter((l) => l.primary).map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              tabIndex={tab}
              className={`${cardGlass} ${cardClass} flex aspect-[1.15] flex-col justify-between p-4`}
              style={cardStyle(i)}
            >
              <l.icon className={`h-7 w-7 ${cardIcon}`} />
              <span>
                <span className="block text-[17px] font-bold leading-tight">{l.label}</span>
                <span className={`mt-1 block text-[12px] ${cardMuted}`}>{l.desc}</span>
              </span>
            </Link>
          ))}

          {/* Kurslar — barcha kurslar + yo'nalish guruhlari */}
          {!crm && <div className={`${cardGlass} ${cardClass} col-span-2 p-4`} style={cardStyle(2)}>
            <Link href="/kurslar" onClick={() => setOpen(false)} tabIndex={tab} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[17px] font-bold">
                <BookOpen className={`h-5 w-5 ${cardIcon}`} />
                Kurslar
              </span>
              <span className={`flex items-center gap-1 text-[12.5px] font-semibold ${cardIcon}`}>
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
          </div>}

          {!crm && mobileLinks.filter((l) => !l.primary).map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              tabIndex={tab}
              className={`${cardGlass} ${cardClass} flex h-14 items-center justify-center gap-2 text-[15px] font-semibold`}
              style={cardStyle(3 + i)}
            >
              <l.icon className={`h-4 w-4 ${cardIcon}`} />
              {l.label}
            </Link>
          ))}

          {/* Katalogdan CRM'ga o'tish (CRM sahifasida yagona CTA — ariza, shuning uchun u yerda yo'q) */}
          {!crm && (
            <Link
              href={CRM_HOME}
              onClick={() => setOpen(false)}
              tabIndex={tab}
              className={`${cardGlass} ${cardClass} col-span-2 flex h-14 items-center justify-center gap-2 text-[15px] font-semibold`}
              style={cardStyle(5)}
            >
              <LayoutGrid className={`h-4 w-4 ${cardIcon}`} />
              Darslinker CRM
            </Link>
          )}

          {crm ? (
            // Modal ochilishidan oldin menyu yopiladi — CrmApplyButton onClick qabul qilmaydi, shuning uchun o'ram.
            <div inert={!open} onClickCapture={() => setOpen(false)} className="col-span-2">
              <CrmApplyButton
                refSource="navbar-mobile"
                className="relative flex h-14 w-full items-center justify-center rounded-[22px] bg-[#2d5a8a] text-[15px] font-semibold text-white"
              >
                Ariza qoldirish
                <span className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#2d5a8a]">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </CrmApplyButton>
            </div>
          ) : (
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              tabIndex={tab}
              className={`${cardClass} col-span-2 flex h-14 items-center justify-center gap-2 rounded-[22px] bg-[#7ea2d4] text-[15px] font-semibold text-white`}
              style={cardStyle(6)}
            >
              <MessageCircle className="h-4 w-4" />
              Yordam
            </a>
          )}
        </div>
      </div>

      {/* Kenglik padding orqali qisqaradi: 100vw → kapsula kengligi (mobilda chetdan 12px). */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          paddingInline: night ? `max(12px, calc((100vw - ${capsuleW}px) / 2))` : "0px",
          transform: night ? "translateY(10px)" : "translateY(0px)",
          transition: [shape("padding"), shape("transform")].join(", "),
        }}
      >
        <div
          className={`relative pointer-events-auto flex items-center justify-between ${
            night ? `pl-5 pr-3 md:pl-6 ${crm ? "md:pr-3" : "md:pr-2.5"}` : "px-4 md:px-20"
          }`}
          style={{
            // CRM'da tepada 78px: 1.5x brend atrofida havo bo'lsin. Header 62px qoladi — ortiqcha 16px
            // sahifa foni rangida hero ustiga tushadi va ko'rinmaydi.
            height: night ? capsuleH : topH,
            borderRadius: night ? capsuleH / 2 : 0,
            ...(crm ? (night ? ICE_GLASS : CLEAR_TOP) : night ? NIGHT_GLASS : LIGHT_GLASS),
            transition: [shape("height"), shape("padding"), `border-radius var(--nav-r) ${EASE} ${shapeDelay}`, paint("background-color"), paint("box-shadow")].join(", "),
          }}
        >
          {/* Logo */}
          {/* CRM: tepada brend kattaroq, scroll'da kapsula bilan birga asl o'lchamga kichrayadi
              (md–xl oralig'ida 1.3x — markazdagi havolalar bilan to'qnashmasin). Katalogda — asl o'lcham. */}
          <Link
            href={logoHref}
            onClick={onLogoClick}
            className="flex items-center gap-2 shrink-0 origin-left [--logo-s:1.1] md:[--logo-s:1.3] xl:[--logo-s:1.5]"
            style={{ transform: crm && !night ? "scale(var(--logo-s))" : "scale(1)", transition: shape("transform") }}
          >
            <DarslinkerLogo size={28} animated={!crm} />
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
                  background: night && !crm ? "rgba(255, 255, 255, 0.13)" : "rgba(22, 24, 26, 0.07)",
                  transitionTimingFunction: EASE,
                }}
              />
              {crm ? (
                <>
                  {crmLinks.map((l) => (
                    <Link key={l.href} href={l.href} onClick={(e) => onSectionClick(e)} className={desktopLink} onMouseEnter={onLinkEnter}>{l.label}</Link>
                  ))}
                </>
              ) : (
              <>
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
              </>
              )}
            </nav>
          </div>

          {/* Desktop CTA — o'ng burchakda: CRM sahifada ariza (yagona tugma), katalogda Yordam.
              Katalogda chapida "Darslinker CRM" (/) — faqat xl'dan: torroqda markazdagi havolalar bilan
              to'qnashadi (mobil menyuda bor). */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
          {!crm && (
            <Link
              href={CRM_HOME}
              className={`hidden xl:inline-flex items-center h-9 px-4 rounded-full text-[14px] font-semibold transition-colors ${
                night ? "bg-white/10 text-white hover:bg-white/20" : "bg-[#16181a]/[0.06] text-[#16181a] hover:bg-[#16181a]/10"
              }`}
            >
              Darslinker CRM
            </Link>
          )}
          {crm ? (
            <CrmApplyButton
              refSource="navbar"
              className="group hidden md:inline-flex items-center gap-2.5 h-9 pl-4 pr-1 rounded-full bg-[#2d5a8a] text-white text-[14px] font-semibold hover:bg-[#244c76] transition-colors shrink-0"
            >
              Ariza qoldirish
              {/* Hero CTA'dagi kabi: oq doirada diagonal strelka, hover'da buriladi */}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#2d5a8a] transition-transform group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </CrmApplyButton>
          ) : (
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:inline-flex items-center gap-2 h-9 px-4 rounded-full text-[14px] font-medium transition-colors shrink-0 ${
                night ? "bg-[#5b87c0] text-white hover:bg-[#4f79b0]" : "bg-[#7ea2d4] text-white hover:bg-[#5b87c0]"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Yordam
            </a>
          )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
            className="md:hidden flex h-10 w-10 items-center justify-center"
          >
            {/* To'rtta nuqta markazga cho'zilib X ning to'rt qanotiga aylanadi */}
            <span className={`relative block h-6 w-6 ${ink}`} style={inkStyle}>
              {[45, 135, 225, 315].map((deg, i) => (
                <span
                  key={deg}
                  className="absolute left-1/2 top-1/2 rounded-full bg-current motion-reduce:transition-none!"
                  style={{
                    width: open ? 9 : 5,
                    height: open ? 2.5 : 5,
                    transform: `translate(-50%, -50%) rotate(${deg}deg) translateX(${open ? 5.5 : 7}px)`,
                    transition: `all 420ms ${SPRING} ${i * 30}ms`,
                  }}
                />
              ))}
            </span>
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
