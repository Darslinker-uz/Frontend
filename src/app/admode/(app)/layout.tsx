"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Users, FileText, MessageSquare, CreditCard, Zap, FolderTree, BarChart3, Settings,
  LogOut, ExternalLink, ShieldAlert, Star, BookOpen, MapPin, HelpCircle,
} from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";
import { AdminThemeProvider, useAdminTheme } from "@/context/admin-theme-context";

const navItems = [
  { href: "/admode/home", label: "Bosh sahifa", icon: LayoutDashboard },
  { href: "/admode/users", label: "Foydalanuvchilar", icon: Users },
  { href: "/admode/listings", label: "E'lonlar", icon: FileText },
  { href: "/admode/leads", label: "Leadlar", icon: MessageSquare },
  { href: "/admode/payments", label: "To'lovlar", icon: CreditCard },
  { href: "/admode/boosts", label: "Boostlar", icon: Zap },
  { href: "/admode/ratings", label: "Reytinglar", icon: Star },
  { href: "/admode/categories", label: "Kategoriyalar", icon: FolderTree },
  { href: "/admode/regions", label: "Viloyatlar", icon: MapPin },
  { href: "/admode/kontent", label: "Kontent", icon: BookOpen },
  { href: "/admode/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admode/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admode/settings", label: "Sozlamalar", icon: Settings },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useAdminTheme();
  const [confirmExit, setConfirmExit] = useState(false);

  const isLight = config.id === "light";

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
              style={{ backgroundColor: config.accent, color: config.accentText }}
            >
              Admin
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
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
                  {item.label}
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
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-[10px] transition-all"
              style={{ color: isActive ? config.text : config.textDim }}
            >
              <Icon className="w-5 h-5" />
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
