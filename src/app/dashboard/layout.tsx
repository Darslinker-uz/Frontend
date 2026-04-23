"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, FileText, Users, Wallet, LogOut, Settings, ExternalLink, Shield, User as UserIcon, Lock } from "lucide-react";
import { LeadsProvider } from "@/context/leads-context";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";
import { DashboardThemeProvider, useDashboardTheme } from "@/context/dashboard-theme-context";

const navItems: { href: string; label: string; icon: typeof LayoutDashboard; soon?: boolean }[] = [
  { href: "/dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "E'lonlar", icon: FileText },
  { href: "/dashboard/leads", label: "Arizalar", icon: Users },
  { href: "/dashboard/managers", label: "Menejerlar", icon: Shield, soon: true },
  { href: "/dashboard/balance", label: "Balans", icon: Wallet },
  { href: "/dashboard/settings", label: "Sozlamalar", icon: Settings },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useDashboardTheme();
  const { data: session } = useSession();
  const [confirmExit, setConfirmExit] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const isLight = config.id === "light" || config.id === "cream";
  const user = session?.user as { name?: string; phone?: string; role?: string } | undefined;
  const userName = user?.name ?? "Foydalanuvchi";
  const userPhone = user?.phone ?? "";
  const initials = userName.split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.bg }}>
      {/* Mobil navbar */}
      <div
        className="md:hidden sticky top-0 z-50 px-4 h-[56px] flex items-center justify-between"
        style={{ backgroundColor: config.sidebar, borderBottom: `1px solid ${config.sidebarBorder}` }}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <DarslinkerLogo size={24} />
          <span className="text-[17px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight" style={{ color: config.text }}>
            Dars<span style={{ color: "#7ea2d4" }}>Linker</span>
          </span>
        </Link>
        <button onClick={() => setConfirmExit(true)} className="text-[12px] font-medium" style={{ color: config.textDim }}>
          Saytga qaytish
        </button>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-[240px] shrink-0">
          <div
            className="fixed top-0 left-0 w-[240px] h-screen flex flex-col"
            style={{ backgroundColor: config.sidebar, borderRight: `1px solid ${config.sidebarBorder}` }}
          >
            {/* Logo */}
            <div className="px-5 h-[62px] flex items-center gap-2" style={{ borderBottom: `1px solid ${config.sidebarBorder}` }}>
              <DarslinkerLogo size={24} />
              <span className="text-[17px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight" style={{ color: config.text }}>
                Dars<span style={{ color: "#7ea2d4" }}>Linker</span>
              </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
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
                    <span className="flex-1">{item.label}</span>
                    {item.soon && <Lock className="w-3.5 h-3.5 opacity-60" />}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom — user info + actions */}
            <div className="px-3 pb-4">
              <div className="flex items-center gap-3 px-3 py-3 rounded-[10px] mb-1" style={{ backgroundColor: config.hover }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0" style={{ backgroundColor: config.accent, color: config.accentText }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: config.text }}>{userName}</p>
                  <p className="text-[11px] truncate" style={{ color: config.textDim }}>{userPhone}</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmExit(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all"
                style={{ color: config.textDim }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = config.hover; e.currentTarget.style.color = config.textMuted; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = config.textDim; }}
              >
                <ExternalLink className="w-[18px] h-[18px]" />
                Saytga qaytish
              </button>
              <button
                onClick={() => setConfirmLogout(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all"
                style={{ color: config.textDim }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = config.hover; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = config.textDim; }}
              >
                <LogOut className="w-[18px] h-[18px]" />
                Chiqish
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 min-h-screen overflow-x-hidden" style={{ color: config.text }}>
          <LeadsProvider>{children}</LeadsProvider>
        </div>
      </div>

      {/* Saytga qaytish tasdiqlash modali */}
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
                <h3 className="text-[17px] font-bold" style={{ color: config.text }}>Saytga qaytasizmi?</h3>
                <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>Siz dashboard dan chiqasiz. Qaytish uchun qaytadan kirishingiz kerak bo&apos;ladi.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setConfirmExit(false)}
                className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium"
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

      {/* Chiqish (logout) tasdiqlash modali */}
      {confirmLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmLogout(false)} />
          <div
            className="relative rounded-[18px] p-6 max-w-[400px] w-full"
            style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-[12px] bg-red-500/15 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold" style={{ color: config.text }}>Chiqishni xohlaysizmi?</h3>
                <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>Hisobingizdan butunlay chiqasiz. Qaytish uchun bot orqali qaytadan kod olishingiz kerak.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium"
                style={{ backgroundColor: config.hover, color: config.textMuted }}
              >
                Bekor
              </button>
              <button
                onClick={() => { setConfirmLogout(false); handleLogout(); }}
                className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium text-white"
                style={{ backgroundColor: "#ef4444" }}
              >
                Ha, chiqish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobil bottom nav */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 px-2 py-1.5 flex items-center justify-around z-50"
        style={{ backgroundColor: config.sidebar, borderTop: `1px solid ${config.sidebarBorder}` }}
      >
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-[10px] transition-all"
              style={{ color: isActive ? config.text : config.textDim }}
            >
              <Icon className="w-5 h-5" />
              {item.soon && (
                <Lock className="absolute top-1 right-1 w-2.5 h-2.5 opacity-60" />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardThemeProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardThemeProvider>
  );
}
