import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "E'lonlar boshqaruvi",
};

export default function AdminListingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <h1 className="text-3xl font-bold text-[#232324] tracking-tight mb-10">
        E&apos;lonlar
      </h1>
      <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-[#e8ecef]">
        <div className="w-14 h-14 rounded-2xl bg-[#eaefef] flex items-center justify-center mb-4">
          <BookOpen className="h-6 w-6 text-[#232324]/20" />
        </div>
        <p className="text-[15px] text-[#232324]/30">
          Hozircha e&apos;lonlar yo&apos;q
        </p>
      </div>
    </div>
  );
}
