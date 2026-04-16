"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Users, Wallet, User, LogOut } from "lucide-react";
import { LeadsProvider } from "@/context/leads-context";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

const navItems = [
  { href: "/dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
  { href: "/dashboard/listings/new", label: "Yangi e'lon", icon: Plus },
  { href: "/dashboard/leads", label: "Arizalar", icon: Users },
  { href: "/dashboard/balance", label: "Balans", icon: Wallet },
  { href: "/dashboard/profile", label: "Profil", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0e1015]">
      {/* Mobil navbar */}
      <div className="md:hidden sticky top-0 z-50 bg-[#16181a] border-b border-white/[0.06] px-4 h-[56px] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <DarslinkerLogo size={24} />
          <span className="text-[17px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight text-[#16181a]">
            Dars<span className="text-[#7ea2d4]">Linker</span>
          </span>
        </Link>
        <Link href="/" className="text-[12px] text-white/30 font-medium">
          Saytga qaytish
        </Link>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-[240px] shrink-0">
          <div className="fixed top-0 left-0 w-[240px] h-screen bg-[#16181a] flex flex-col">
            {/* Logo */}
            <div className="px-5 h-[62px] flex items-center gap-2 border-b border-white/[0.06]">
              <DarslinkerLogo size={24} />
              <span className="text-[17px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight text-white">
                Dars<span className="text-[#7ea2d4]">Linker</span>
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-all ${isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"}`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="px-3 pb-4 space-y-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-all">
                <LogOut className="w-[18px] h-[18px]" />
                Saytga qaytish
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-screen">
          <LeadsProvider>{children}</LeadsProvider>
        </div>
      </div>

      {/* Mobil bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#16181a] border-t border-white/[0.06] px-2 py-1.5 flex items-center justify-around z-50">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-[10px] transition-all ${isActive ? "text-white" : "text-white/30"}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
