import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ kategoriya: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategoriya } = await params;
  const name = kategoriya.replace(/-/g, " ");
  return {
    title: `${name.charAt(0).toUpperCase() + name.slice(1)} kurslari`,
    description: `${name} bo'yicha eng yaxshi kurslar — Darslinker.uz`,
  };
}

export default async function KategoriyaPage({ params }: Props) {
  const { kategoriya } = await params;
  const name = kategoriya.replace(/-/g, " ");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      {/* Breadcrumb */}
      <Link
        href="/kurslar"
        className="inline-flex items-center gap-2 text-[14px] text-[#7ea2d4] hover:text-[#5b87c0] font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Barcha kurslar
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-[#232324] tracking-tight capitalize mb-2">
        {name} kurslari
      </h1>
      <p className="text-[14px] text-[#232324]/40 mb-8">0 ta kurs topildi</p>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-[#e8ecef]">
        <div className="w-16 h-16 rounded-2xl bg-[#eaefef] flex items-center justify-center mb-5">
          <SlidersHorizontal className="h-7 w-7 text-[#232324]/20" />
        </div>
        <p className="text-[16px] text-[#232324]/40 font-medium capitalize">
          {name} bo&apos;yicha kurslar hali qo&apos;shilmagan
        </p>
        <p className="text-[14px] text-[#232324]/30 mt-1">
          Tez orada yangi kurslar paydo bo&apos;ladi
        </p>
      </div>
    </div>
  );
}
