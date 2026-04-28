"use client";

import { useState } from "react";

// Smooth FAQ accordion. Bir vaqtda faqat bitta savol ochiq turadi
// (ikkinchisi bosilganda birinchisi avtomatik yopiladi).
// grid-template-rows 0fr ↔ 1fr trick — height smooth o'zgaradi.
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[#e4e7ea]">
      {items.map((f, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="py-4">
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
              aria-expanded={open}
            >
              <h3 className="text-[15px] md:text-[17px] font-semibold text-[#16181a] leading-snug">
                {f.q}
              </h3>
              <span
                className={`shrink-0 w-7 h-7 rounded-full border border-[#e4e7ea] flex items-center justify-center text-[#7c8490] transition-transform duration-300 ease-out ${open ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="text-[14px] md:text-[15px] text-[#16181a]/70 leading-relaxed pt-3">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
