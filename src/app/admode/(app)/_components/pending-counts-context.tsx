"use client";

import { createContext, useContext } from "react";

export interface PendingCounts {
  listings: number;
  categories: number;
  boosts: number;
  partners: number;
  students: number;
}

export const PendingCountsContext = createContext<PendingCounts | null>(null);

export function usePendingCounts(): PendingCounts {
  const ctx = useContext(PendingCountsContext);
  return ctx ?? { listings: 0, categories: 0, boosts: 0, partners: 0, students: 0 };
}
