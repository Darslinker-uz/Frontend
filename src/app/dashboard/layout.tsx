"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, FileText, Users, Wallet, LogOut, Settings, ExternalLink, X, Shield } from "lucide-react";
import { LeadsProvider } from "@/context/leads-context";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

const navItems = [
  { href: "/dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "E'lonlar", icon: FileText },
  { href: "/dashboard/leads", label: "Arizalar", icon: Users },
  { href: "/dashboard/managers", label: "Menejerlar", icon: Shield },
  { href: "/dashboard/balance", label: "Balans", icon: Wallet },
  { href: "/dashboard/settings", label: "Sozlamalar", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [confirmExit, setConfirmExit] = useState(false);

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
        <button onClick={() => setConfirmExit(true)} className="text-[12px] text-white/30 font-medium">
          Saytga qaytish
        </button>
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
              <button onClick={() => setConfirmExit(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-all">
                <LogOut className="w-[18px] h-[18px]" />
                Saytga qaytish
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-screen">
          <LeadsProvider>{children}</LeadsProvider>
        </div>
      </div>

      {/* Saytga qaytish tasdiqlash modali */}
      {confirmExit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmExit(false)} />
          <div className="relative bg-[#16181a] rounded-[18px] border border-white/[0.08] p-6 max-w-[400px] w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-[12px] bg-white/[0.08] flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-white">Saytga qaytasizmi?</h3>
                <p className="text-[13px] text-white/50 mt-1">Siz dashboard dan chiqasiz. Qaytish uchun qaytadan kirishingiz kerak bo&apos;ladi.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setConfirmExit(false)} className="flex-1 h-[44px] rounded-[10px] bg-white/[0.06] text-white/60 text-[14px] font-medium hover:bg-white/[0.1]">
                Bekor
              </button>
              <button onClick={() => { setConfirmExit(false); router.push("/"); }} className="flex-1 h-[44px] rounded-[10px] bg-white text-[#16181a] text-[14px] font-medium hover:bg-white/90">
                Ha, chiqish
              </button>
            </div>
          </div>
        </div>
      )}

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
