"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminTheme } from "@/context/admin-theme-context";

export interface GroupTab {
  href: string;
  label: string;
  badge?: number;
}

export function GroupTabs({ tabs }: { tabs: GroupTab[] }) {
  const pathname = usePathname();
  const { config } = useAdminTheme();

  return (
    <div className="px-5 md:px-8 pt-4 md:pt-5">
      <div
        className="inline-flex items-center gap-1 p-1 rounded-[12px] overflow-x-auto max-w-full"
        style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[13px] font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: isActive ? config.accent : "transparent",
                color: isActive ? config.accentText : config.textMuted,
              }}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{
                    backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "#ef4444",
                    color: "white",
                  }}
                >
                  {tab.badge > 99 ? "99+" : tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
