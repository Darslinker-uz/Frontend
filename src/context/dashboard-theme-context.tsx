"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { THEMES, type AdminTheme as PanelTheme, type ThemeConfig } from "@/context/admin-theme-context";

export type DashboardTheme = PanelTheme;

interface DashboardThemeContextType {
  theme: DashboardTheme;
  config: ThemeConfig;
  setTheme: (t: DashboardTheme) => void;
}

const DashboardThemeContext = createContext<DashboardThemeContextType | null>(null);

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DashboardTheme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("dashboard-theme") as DashboardTheme | null;
    if (saved && THEMES[saved]) setThemeState(saved);
  }, []);

  useEffect(() => {
    const bg = THEMES[theme].bg;
    const prevBody = document.body.style.backgroundColor;
    const prevHtml = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = bg;
    document.documentElement.style.backgroundColor = bg;
    return () => {
      document.body.style.backgroundColor = prevBody;
      document.documentElement.style.backgroundColor = prevHtml;
    };
  }, [theme]);

  const setTheme = (t: DashboardTheme) => {
    setThemeState(t);
    localStorage.setItem("dashboard-theme", t);
  };

  const config = THEMES[theme];

  return (
    <DashboardThemeContext.Provider value={{ theme, config, setTheme }}>
      <div
        style={{
          backgroundColor: config.bg,
          color: config.text,
          minHeight: "100vh",
          ["--dash-bg" as string]: config.bg,
          ["--dash-surface" as string]: config.surface,
          ["--dash-surface-border" as string]: config.surfaceBorder,
          ["--dash-sidebar" as string]: config.sidebar,
          ["--dash-sidebar-border" as string]: config.sidebarBorder,
          ["--dash-text" as string]: config.text,
          ["--dash-text-muted" as string]: config.textMuted,
          ["--dash-text-dim" as string]: config.textDim,
          ["--dash-accent" as string]: config.accent,
          ["--dash-accent-hover" as string]: config.accentHover,
          ["--dash-accent-text" as string]: config.accentText,
          ["--dash-ring" as string]: config.ring,
          ["--dash-hover" as string]: config.hover,
          ["--dash-active" as string]: config.active,
        }}
      >
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const ctx = useContext(DashboardThemeContext);
  if (!ctx) throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  return ctx;
}
