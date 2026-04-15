import type { Metadata } from "next";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Barcha kurslar",
  description:
    "O'zbekistondagi barcha online va offline kurslar. Filtr va qidiruv orqali o'zingizga mosini toping.",
};

const filters = ["Kategoriya", "Format", "Narx", "Til", "Reyting"];

export default function KurslarPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#232324] tracking-tight">
          Barcha kurslar
        </h1>
        <p className="text-[16px] text-[#232324]/50 mt-2">
          O&apos;zingizga mos kursni toping va solishtiring
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
        <Button
          variant="outline"
          className="rounded-xl h-10 px-4 text-[14px] border-[#e8ecef] text-[#232324]/60 shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtrlar
        </Button>
        {filters.map((f) => (
          <Button
            key={f}
            variant="outline"
            className="rounded-xl h-10 px-4 text-[14px] border-[#e8ecef] text-[#232324]/60 hover:border-[#7ea2d4]/40 hover:text-[#232324] shrink-0"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-[14px] text-[#232324]/40 mb-6">0 ta kurs topildi</p>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-[#e8ecef]">
        <div className="w-16 h-16 rounded-2xl bg-[#eaefef] flex items-center justify-center mb-5">
          <SlidersHorizontal className="h-7 w-7 text-[#232324]/20" />
        </div>
        <p className="text-[16px] text-[#232324]/40 font-medium">
          Hozircha kurslar mavjud emas
        </p>
        <p className="text-[14px] text-[#232324]/30 mt-1">
          Tez orada yangi kurslar qo&apos;shiladi
        </p>
      </div>
    </div>
  );
}
