import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Leadlar",
};

const columns = [
  { title: "Yangi", color: "bg-blue-500" },
  { title: "Bog'lanildi", color: "bg-amber-500" },
  { title: "Konvertatsiya", color: "bg-green-500" },
  { title: "Dispute", color: "bg-red-500" },
];

export default function LeadsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <h1 className="text-3xl font-bold text-[#232324] tracking-tight mb-2">
        Leadlar
      </h1>
      <p className="text-[15px] text-[#232324]/40 mb-10">
        Murojaatlarni boshqaring
      </p>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
        {columns.map((col) => (
          <div
            key={col.title}
            className="rounded-2xl bg-[#f5f7f7] border border-[#e8ecef] p-4 min-h-[300px]"
          >
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className={`w-2 h-2 rounded-full ${col.color}`} />
              <span className="text-[14px] font-semibold text-[#232324]">
                {col.title}
              </span>
              <span className="text-[12px] text-[#232324]/30 ml-auto">0</span>
            </div>
            <div className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-6 w-6 text-[#232324]/10 mb-2" />
              <p className="text-[13px] text-[#232324]/25">Bo&apos;sh</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
