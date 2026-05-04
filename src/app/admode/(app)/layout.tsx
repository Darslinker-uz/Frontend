"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, FileText, MessageSquare, CreditCard, Zap, FolderTree, BarChart3, Settings,
  LogOut, ExternalLink, ShieldAlert, Star, BookOpen, MapPin, HelpCircle,
} from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";
import { AdminThemeProvider, useAdminTheme } from "@/context/admin-theme-context";
import { type Permissions, hasPermission, type PermissionKey } from "@/lib/permissions";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  // Assistant'lar uchun bu ruxsat kerak. Admin har doim hammasi.
  // null = bosh sahifa kabi har doim ko'rinadi
  perm: PermissionKey | null;
  // Sidebar'da pending counts badge'i uchun key (faqat admin ko'radi)
  badgeKey?: "listings" | "categories" | "boosts" | "partners";
}

interface PendingCounts {
  listings: number;
  categories: number;
  boosts: number;
  partners: number;
}

const navItems: NavItem[] = [
  { href: "/admode/home", label: "Bosh sahifa", icon: LayoutDashboard, perm: null },
  { href: "/admode/users", label: "Foydalanuvchilar", icon: Users, perm: "user.view" },
  { href: "/admode/listings", label: "E'lonlar", icon: FileText, perm: "listing.view", badgeKey: "listings" },
  { href: "/admode/leads", label: "Leadlar", icon: MessageSquare, perm: "lead.view" },
  { href: "/admode/payments", label: "To'lovlar", icon: CreditCard, perm: "payment.view" },
  { href: "/admode/boosts", label: "Boostlar", icon: Zap, perm: "boost.view", badgeKey: "boosts" },
  { href: "/admode/ratings", label: "Reytinglar", icon: Star, perm: null },
  { href: "/admode/categories", label: "Kategoriyalar", icon: FolderTree, perm: "taxonomy.edit", badgeKey: "categories" },
  { href: "/admode/regions", label: "Viloyatlar", icon: MapPin, perm: "region.edit" },
  { href: "/admode/kontent", label: "Kontent", icon: BookOpen, perm: "content.view" },
  { href: "/admode/faq", label: "FAQ", icon: HelpCircle, perm: "faq.edit" },
  { href: "/admode/analytics", label: "Analytics", icon: BarChart3, perm: "analytics.view" },
  { href: "/admode/settings", label: "Sozlamalar", icon: Settings, perm: null },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useAdminTheme();
  const [confirmExit, setConfirmExit] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [pendingCounts, setPendingCounts] = useState<PendingCounts | null>(null);

  // Joriy foydalanuvchining permissions'ni olish (admin → ALL, assistant → kodda)
  useEffect(() => {
    fetch("/api/me/permissions", { cache: "no-store", credentials: "same-origin" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setRole(data.role);
          setPermissions(data.permissions);
        }
      })
      .catch(() => {});
  }, []);

  // Pending counts polling — faqat admin uchun, har 30 soniyada
  useEffect(() => {
    if (role !== "admin") return;
    const fetchCounts = () => {
      fetch("/api/admin/pending-counts", { cache: "no-store", credentials: "same-origin" })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) setPendingCounts(data); })
        .catch(() => {});
    };
    fetchCounts();
    const t = setInterval(fetchCounts, 30000);
    return () => clearInterval(t);
  }, [role]);

  // Sidebar nav items'ni filterlash
  const visibleNavItems = navItems.filter((item) => {
    if (item.perm === null) return true; // har doim ko'rinadi
    if (role === "admin") return true;   // admin hammasi
    if (!permissions) return false;      // hali yuklanmagan — ko'rsatmaymiz (admin uchun ham bir lahza)
    return hasPermission(permissions, item.perm);
  });

  const isLight = config.id === "light";
  const isAssistant = role === "assistant";

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: config.bg }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block w-[240px] shrink-0">
        <div
          className="fixed top-0 left-0 w-[240px] h-screen flex flex-col"
          style={{ backgroundColor: config.sidebar, borderRight: `1px solid ${config.sidebarBorder}` }}
        >
          {/* Logo */}
          <div
            className="px-5 h-[62px] flex items-center gap-2"
            style={{ borderBottom: `1px solid ${config.sidebarBorder}` }}
          >
            <DarslinkerLogo size={24} />
            <span className="text-[17px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight" style={{ color: config.text }}>
              Dars<span style={{ color: "#7ea2d4" }}>Linker</span>
            </span>
            <span
              className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
              style={{ backgroundColor: isAssistant ? "#7ea2d4" : config.accent, color: isAssistant ? "white" : config.accentText }}
            >
              {isAssistant ? "Yordamchi" : "Admin"}
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const badgeCount = role === "admin" && item.badgeKey && pendingCounts
                ? pendingCounts[item.badgeKey]
                : 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-all"
                  style={{
                    backgroundColor: isActive ? config.active : "transparent",
                    color: isActive ? config.text : config.textMuted,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = config.hover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="flex-1">{item.label}</span>
                  {badgeCount > 0 && (
                    <span
                      className="min-w-[20px] h-[20px] px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center"
                      style={{ backgroundColor: "#ef4444", color: "white" }}
                    >
                      {badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="px-3 pb-4">
            <button
              onClick={() => setConfirmExit(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-all"
              style={{ color: config.textDim }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = config.hover;
                e.currentTarget.style.color = config.textMuted;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = config.textDim;
              }}
            >
              <LogOut className="w-[18px] h-[18px]" />
              Saytga qaytish
            </button>
          </div>
        </div>
      </div>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 h-[56px] px-4 flex items-center justify-between"
        style={{ backgroundColor: config.sidebar, borderBottom: `1px solid ${config.sidebarBorder}` }}
      >
        <Link href="/admode/home" className="flex items-center gap-2">
          <DarslinkerLogo size={22} />
          <span className="text-[15px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight" style={{ color: config.text }}>
            Dars<span style={{ color: "#7ea2d4" }}>Linker</span>
          </span>
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ backgroundColor: config.accent, color: config.accentText }}>
            Admin
          </span>
        </Link>
        <button onClick={() => setConfirmExit(true)} className="text-[12px] font-medium" style={{ color: config.textMuted }}>
          Chiqish
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-screen md:pt-0 pt-[56px] pb-[64px] md:pb-0" style={{ color: config.text }}>
        {children}
      </div>

      {/* Mobile bottom nav */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-2 py-1.5 flex items-center justify-around"
        style={{ backgroundColor: config.sidebar, borderTop: `1px solid ${config.sidebarBorder}` }}
      >
        {visibleNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const badgeCount = role === "admin" && item.badgeKey && pendingCounts
            ? pendingCounts[item.badgeKey]
            : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-[10px] transition-all"
              style={{ color: isActive ? config.text : config.textDim }}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badgeCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: "#ef4444", color: "white" }}
                  >
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Exit modal */}
      {confirmExit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmExit(false)} />
          <div
            className="relative rounded-[18px] p-6 max-w-[400px] w-full"
            style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ backgroundColor: config.hover }}>
                <ExternalLink className="w-5 h-5" style={{ color: config.textMuted }} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold" style={{ color: config.text }}>Admin paneldan chiqish</h3>
                <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>Saytga qaytasizmi? Qaytish uchun qaytadan kirishingiz kerak.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setConfirmExit(false)}
                className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium transition-colors"
                style={{ backgroundColor: config.hover, color: config.textMuted }}
              >
                Bekor
              </button>
              <button
                onClick={() => { setConfirmExit(false); router.push("/"); }}
                className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium"
                style={{ backgroundColor: config.accent, color: config.accentText }}
              >
                Ha, chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminShell>{children}</AdminShell>
    </AdminThemeProvider>
  );
}
