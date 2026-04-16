"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { initialLeads, type Lead } from "@/data/leads";

interface LeadsContextType {
  leads: Lead[];
  moveLead: (id: number, newStatus: string, note?: string) => void;
  stats: {
    total: number;
    yangi: number;
    sotibOldi: number;
    sifatsiz: number;
    konversiya: number;
  };
}

const LeadsContext = createContext<LeadsContextType | null>(null);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  const moveLead = useCallback((id: number, newStatus: string, note?: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus, note: note || l.note } : l));
  }, []);

  const total = leads.length;
  const yangi = leads.filter(l => l.status === "yangi").length;
  const sotibOldi = leads.filter(l => l.status === "sotib_oldi").length;
  const sifatsiz = leads.filter(l => l.status === "sifatsiz").length;
  const konversiya = total > 0 ? Math.round((sotibOldi / total) * 100) : 0;

  return (
    <LeadsContext.Provider value={{ leads, moveLead, stats: { total, yangi, sotibOldi, sifatsiz, konversiya } }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx;
}
