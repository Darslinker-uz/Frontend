"use client";

import { useEffect, useState } from "react";
import { Building2, GraduationCap } from "lucide-react";

export type DashboardMode = "CENTER" | "TUTOR";

const STORAGE_KEY = "dashboardMode";
const COOKIE_NAME = "dashboardMode";

// Hook — boshqa komponentlar foydalanishi uchun
export function useDashboardMode(defaultMode: DashboardMode = "CENTER"): [DashboardMode, (m: DashboardMode) => void] {
  const [mode, setModeState] = useState<DashboardMode>(defaultMode);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "CENTER" || stored === "TUTOR") setModeState(stored);
    } catch {}
  }, []);

  const setMode = (m: DashboardMode) => {
    setModeState(m);
    try {
      window.localStorage.setItem(STORAGE_KEY, m);
      // Cookie ham — server-side render uchun (1 yil amal qiladi)
      document.cookie = `${COOKIE_NAME}=${m}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch {}
    // Sahifani yangilash — server-side queries yangi mode bilan ishlasin
    window.location.reload();
  };

  return [mode, setMode];
}

// Sidebar'ga joylanadigan switch UI
export function DashboardModeSwitcher({ config }: { config: { sidebar: string; sidebarBorder: string; text: string; textMuted: string; accent: string; accentText: string; hover: string } }) {
  const [mode, setMode] = useDashboardMode();

  return (
    <div className="px-3 mb-3">
      <div
        className="rounded-[12px] p-1 flex items-center gap-1"
        style={{ backgroundColor: config.hover, border: `1px solid ${config.sidebarBorder}` }}
      >
        <button
          type="button"
          onClick={() => mode !== "CENTER" && setMode("CENTER")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[8px] text-[12px] font-semibold transition-colors"
          style={{
            backgroundColor: mode === "CENTER" ? config.accent : "transparent",
            color: mode === "CENTER" ? config.accentText : config.textMuted,
          }}
          aria-pressed={mode === "CENTER"}
        >
          <Building2 className="w-3.5 h-3.5" />
          Markaz
        </button>
        <button
          type="button"
          onClick={() => mode !== "TUTOR" && setMode("TUTOR")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[8px] text-[12px] font-semibold transition-colors"
          style={{
            backgroundColor: mode === "TUTOR" ? config.accent : "transparent",
            color: mode === "TUTOR" ? config.accentText : config.textMuted,
          }}
          aria-pressed={mode === "TUTOR"}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Repetitor
        </button>
      </div>
      <p className="text-[10.5px] mt-1.5 px-2" style={{ color: config.textMuted }}>
        Rejim e&apos;lonlar va xizmatlarni ajratadi
      </p>
    </div>
  );
}
