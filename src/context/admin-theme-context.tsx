"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AdminTheme = "light" | "dark" | "slate" | "cream";

export interface ThemeConfig {
  id: AdminTheme;
  label: string;
  desc: string;
  bg: string;
  surface: string;
  surfaceBorder: string;
  sidebar: string;
  sidebarBorder: string;
  text: string;
  textMuted: string;
  textDim: string;
  accent: string;
  accentHover: string;
  accentText: string;
  ring: string;
  hover: string;
  active: string;
}

export const THEMES: Record<AdminTheme, ThemeConfig> = {
  dark: {
    id: "dark",
    label: "Qora",
    desc: "Standart dark mode",
    bg: "#0e1015",
    surface: "rgba(255,255,255,0.04)",
    surfaceBorder: "rgba(255,255,255,0.06)",
    sidebar: "#16181a",
    sidebarBorder: "rgba(255,255,255,0.06)",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.6)",
    textDim: "rgba(255,255,255,0.3)",
    accent: "#ffffff",
    accentHover: "rgba(255,255,255,0.9)",
    accentText: "#16181a",
    ring: "rgba(255,255,255,0.3)",
    hover: "rgba(255,255,255,0.06)",
    active: "rgba(255,255,255,0.1)",
  },
  light: {
    id: "light",
    label: "Oq",
    desc: "Yorug' light mode",
    bg: "#f4f5f7",
    surface: "#ffffff",
    surfaceBorder: "#e4e7ea",
    sidebar: "#ffffff",
    sidebarBorder: "#e4e7ea",
    text: "#16181a",
    textMuted: "#5b636d",
    textDim: "#8b93a0",
    accent: "#16181a",
    accentHover: "#2a2d32",
    accentText: "#ffffff",
    ring: "rgba(22,24,26,0.2)",
    hover: "rgba(0,0,0,0.04)",
    active: "rgba(0,0,0,0.06)",
  },
  slate: {
    id: "slate",
    label: "Slate",
    desc: "Sovuq kulrang",
    bg: "#1a1d23",
    surface: "rgba(255,255,255,0.035)",
    surfaceBorder: "rgba(255,255,255,0.07)",
    sidebar: "#242830",
    sidebarBorder: "rgba(255,255,255,0.06)",
    text: "#e8eaed",
    textMuted: "rgba(232,234,237,0.6)",
    textDim: "rgba(232,234,237,0.32)",
    accent: "#cbd5e1",
    accentHover: "#e2e8f0",
    accentText: "#0f172a",
    ring: "rgba(203,213,225,0.25)",
    hover: "rgba(255,255,255,0.05)",
    active: "rgba(255,255,255,0.08)",
  },
  cream: {
    id: "cream",
    label: "Cream",
    desc: "Iliq bej tuslar",
    bg: "#f5f1e8",
    surface: "#fdfaf3",
    surfaceBorder: "#e6ddc8",
    sidebar: "#fdfaf3",
    sidebarBorder: "#e6ddc8",
    text: "#3d3424",
    textMuted: "#7a6e55",
    textDim: "#a89a7d",
    accent: "#8b6f3d",
    accentHover: "#6e572d",
    accentText: "#fdfaf3",
    ring: "rgba(139,111,61,0.25)",
    hover: "rgba(61,52,36,0.04)",
    active: "rgba(61,52,36,0.08)",
  },
};

interface AdminThemeContextType {
  theme: AdminTheme;
  config: ThemeConfig;
  setTheme: (t: AdminTheme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | null>(null);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("admin-theme") as AdminTheme | null;
    if (saved && THEMES[saved]) setThemeState(saved);
  }, []);

  // Keep body / html background in sync with active theme so scroll overflow
  // and elastic bounce do not reveal a mismatched color.
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

  const setTheme = (t: AdminTheme) => {
    setThemeState(t);
    localStorage.setItem("admin-theme", t);
  };

  const config = THEMES[theme];

  return (
    <AdminThemeContext.Provider value={{ theme, config, setTheme }}>
      <div
        style={{
          backgroundColor: config.bg,
          color: config.text,
          minHeight: "100vh",
          ["--admin-bg" as string]: config.bg,
          ["--admin-surface" as string]: config.surface,
          ["--admin-surface-border" as string]: config.surfaceBorder,
          ["--admin-sidebar" as string]: config.sidebar,
          ["--admin-sidebar-border" as string]: config.sidebarBorder,
          ["--admin-text" as string]: config.text,
          ["--admin-text-muted" as string]: config.textMuted,
          ["--admin-text-dim" as string]: config.textDim,
          ["--admin-accent" as string]: config.accent,
          ["--admin-accent-hover" as string]: config.accentHover,
          ["--admin-accent-text" as string]: config.accentText,
          ["--admin-ring" as string]: config.ring,
          ["--admin-hover" as string]: config.hover,
          ["--admin-active" as string]: config.active,
        }}
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return ctx;
}
