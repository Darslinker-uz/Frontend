"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Lead } from "@/data/leads";

// Backend → UI status mapping
const STATUS_TO_UI: Record<string, string> = {
  new_lead: "yangi",
  contacted: "jarayonda",
  callback: "qayta_aloqa",
  converted: "sotib_oldi",
  not_interested: "sotib_olmadi",
  disputed: "sifatsiz",
};
const UI_TO_STATUS: Record<string, string> = {
  yangi: "new_lead",
  jarayonda: "contacted",
  qayta_aloqa: "callback",
  sotib_oldi: "converted",
  sotib_olmadi: "not_interested",
  sifatsiz: "disputed",
};

interface ApiLead {
  id: number;
  name: string;
  phone: string;
  message: string | null;
  status: "new_lead" | "contacted" | "callback" | "converted" | "not_interested" | "disputed";
  note: string | null;
  createdAt: string;
  listing: { id: number; title: string; slug: string };
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Hozir";
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 172800) return "Kecha";
  return `${Math.floor(diff / 86400)} kun oldin`;
}

function fromApi(l: ApiLead): Lead {
  const tgMatch = l.message?.match(/Telegram:\s*(@?\w+)/i);
  return {
    id: l.id,
    name: l.name,
    phone: l.phone,
    telegram: tgMatch ? tgMatch[1] : undefined,
    course: l.listing.title,
    time: timeAgo(l.createdAt),
    status: STATUS_TO_UI[l.status] ?? "yangi",
    note: l.note ?? undefined,
  };
}

interface LeadsContextType {
  leads: Lead[];
  loading: boolean;
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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard/leads", { cache: "no-store" });
        const data: { leads: ApiLead[] } = await res.json();
        if (!cancelled) setLeads((data.leads ?? []).map(fromApi));
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const moveLead = useCallback(async (id: number, newStatus: string, note?: string) => {
    const apiStatus = UI_TO_STATUS[newStatus];
    setLeads(curr => curr.map(l => l.id === id ? { ...l, status: newStatus, note: note ?? l.note } : l));
    try {
      const body: { status?: string; note?: string } = {};
      if (apiStatus) body.status = apiStatus;
      if (note !== undefined) body.note = note;
      const res = await fetch(`/api/dashboard/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("failed");
    } catch (e) {
      console.error(e);
    }
  }, []);

  const total = leads.length;
  const yangi = leads.filter(l => l.status === "yangi").length;
  const sotibOldi = leads.filter(l => l.status === "sotib_oldi").length;
  const sifatsiz = leads.filter(l => l.status === "sifatsiz").length;
  const konversiya = total > 0 ? Math.round((sotibOldi / total) * 100) : 0;

  return (
    <LeadsContext.Provider value={{ leads, loading, moveLead, stats: { total, yangi, sotibOldi, sifatsiz, konversiya } }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx;
}
