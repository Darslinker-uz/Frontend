"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";

type Props = {
  /** Ariza formasi o'ralgan elementning id'si — bosilganda shu yerga scroll qilinadi */
  targetId: string;
  label?: string;
  /** Markaz/repetitor/kurs sahifalariga mos rang (Tailwind bg/shadow class'lari) */
  colorClass?: string;
};

export function FloatingApplyButton({
  targetId,
  label = "Ariza qoldirish",
  colorClass = "bg-[#16181a] hover:bg-[#16181a]/90",
}: Props) {
  const [armed, setArmed] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setArmed(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  if (!armed || formVisible) return null;

  return (
    <div className="md:hidden fixed bottom-5 left-4 right-20 z-[65]">
      <button
        type="button"
        onClick={() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className={`floating-cta-enter w-full flex items-center justify-center gap-2 h-[52px] rounded-full text-white text-[15px] font-semibold shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-colors ${colorClass}`}
      >
        <Send className="w-4 h-4" />
        {label}
      </button>
    </div>
  );
}
