import type { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Kurslar, ta'lim va kasblar haqida foydali maqolalar",
};

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-bold text-[#232324] tracking-tight mb-2">
        Blog
      </h1>
      <p className="text-[15px] text-[#232324]/40 mb-10">
        Kurslar va ta&apos;lim haqida foydali maqolalar
      </p>

      <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-[#e8ecef]">
        <div className="w-16 h-16 rounded-2xl bg-[#eaefef] flex items-center justify-center mb-5">
          <FileText className="h-7 w-7 text-[#232324]/20" />
        </div>
        <p className="text-[16px] text-[#232324]/40 font-medium">
          Tez orada foydali maqolalar paydo bo&apos;ladi
        </p>
      </div>
    </div>
  );
}
