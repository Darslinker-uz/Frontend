import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Clock, Star, Send, BookOpen, Award, Calendar, Users, Globe, CreditCard } from "lucide-react";
import { courses, categories } from "@/data/courses";
import { notFound } from "next/navigation";
import { PhoneInput, TelegramInput } from "@/components/phone-input";

type Props = {
  params: Promise<{ kategoriya: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return { title: "Kurs topilmadi" };
  return {
    title: course.title,
    description: `${course.title} — ${course.provider}. ${course.description}`,
  };
}

export default async function KursDetailPage({ params }: Props) {
  const { kategoriya, slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const cat = categories.find((c) => c.slug === kategoriya);
  const catName = cat?.name ?? kategoriya.replace(/-/g, " ");

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-8 md:py-12">
        {/* Back button */}
        <Link href="/kurslar" className="inline-flex items-center gap-2 text-[13px] text-[#7c8490] hover:text-[#16181a] font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kurslarga qaytish
        </Link>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] mb-8">
          <Link href="/kurslar" className="text-[#7ea2d4] hover:text-[#5b87c0] transition-colors">Kurslar</Link>
          <span className="text-[#16181a]/20">/</span>
          <Link href={`/kurslar/${kategoriya}`} className="text-[#7ea2d4] hover:text-[#5b87c0] transition-colors">{catName}</Link>
          <span className="text-[#16181a]/20">/</span>
          <span className="text-[#7c8490]">{course.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Asosiy content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <div className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br ${course.gradient} p-6 md:p-8`}>
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <svg className="absolute right-6 bottom-6 w-[100px] h-[100px] text-white/[0.08]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"><path d={course.iconPath} /></svg>
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold">{course.category}</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-[12px]">{course.format}</span>
                </div>
                <h1 className="text-[24px] md:text-[32px] font-bold text-white leading-tight">{course.title}</h1>
                <p className="text-[14px] text-white/50 mt-2">{course.provider}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-[13px] text-white/60">
                    <Star className="w-4 h-4 fill-white/60 text-white/60" />{course.rating}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-white/60">
                    <MapPin className="w-4 h-4" />{course.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-white/60">
                    <Clock className="w-4 h-4" />{course.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Kurs haqida */}
            <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
              <h2 className="text-[18px] font-bold text-[#16181a] mb-3">Kurs haqida</h2>
              <p className="text-[15px] text-[#7c8490] leading-relaxed">{course.description}</p>
            </div>

            {/* Ma'lumotlar grid */}
            <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
              <h2 className="text-[18px] font-bold text-[#16181a] mb-5">Batafsil ma&apos;lumot</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Narx</p>
                    <p className="text-[14px] font-bold text-[#16181a]">{course.priceFree ? "Bepul" : `${course.price} so'm`}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Davomiylik</p>
                    <p className="text-[14px] font-bold text-[#16181a]">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Format</p>
                    <p className="text-[14px] font-bold text-[#16181a]">{course.format}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Reyting</p>
                    <p className="text-[14px] font-bold text-[#16181a]">{course.rating}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Til</p>
                    <p className="text-[14px] font-bold text-[#16181a]">O&apos;zbek</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Sertifikat</p>
                    <p className="text-[14px] font-bold text-[#16181a]">Beriladi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dars rejasi */}
            <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
              <h2 className="text-[18px] font-bold text-[#16181a] mb-5">Dars rejasi</h2>
              <div className="space-y-3">
                {["Asoslar va kirish", "Amaliy mashqlar", "Loyiha ishlash", "Yakuniy loyiha va sertifikat"].map((modul, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-[12px] bg-[#f0f2f3]">
                    <span className="w-7 h-7 rounded-full bg-[#7ea2d4]/15 flex items-center justify-center shrink-0 text-[12px] font-bold text-[#7ea2d4]">{i + 1}</span>
                    <span className="text-[14px] text-[#16181a]">{modul}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* O'qituvchi */}
            <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
              <h2 className="text-[18px] font-bold text-[#16181a] mb-4">O&apos;qituvchi</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#7ea2d4]/15 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#7ea2d4]" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#16181a]">{course.provider}</p>
                  <p className="text-[13px] text-[#7c8490]">{course.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — ariza form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-5">
              {/* Narx */}
              <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-bold text-[#16181a]">{course.priceFree ? "Bepul" : `${course.price}`}</span>
                  {!course.priceFree && <span className="text-[14px] text-[#7c8490]">so&apos;m</span>}
                </div>
                <span className="inline-flex px-2.5 py-1 rounded-full bg-green-50 text-[12px] font-medium text-green-600 mt-2">
                  Bo&apos;sh joy bor
                </span>
              </div>

              {/* Ariza form */}
              <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6">
                <h3 className="text-[16px] font-bold text-[#16181a] mb-2">Ariza qoldirish</h3>
                <p className="text-[13px] text-[#7c8490] mb-5">Ma&apos;lumotlaringizni qoldiring — markaz siz bilan bog&apos;lanadi</p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-[12px] text-[#7c8490] mb-1.5">Ismingiz</Label>
                    <Input id="name" placeholder="Ismingiz" className="rounded-[10px] h-11 border-[#e4e7ea] text-[16px]" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[12px] text-[#7c8490] mb-1.5">Telefon</Label>
                    <PhoneInput className="w-full h-11 px-4 text-[16px] rounded-[10px] border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/50 focus:outline-none focus:border-[#7ea2d4] transition-colors" />
                  </div>
                  <div>
                    <Label htmlFor="telegram" className="text-[12px] text-[#7c8490] mb-1.5">Telegram</Label>
                    <TelegramInput className="w-full h-11 px-4 text-[16px] rounded-[10px] border border-[#e4e7ea] text-[#16181a] placeholder:text-[#7c8490]/50 focus:outline-none focus:border-[#7ea2d4] transition-colors" />
                  </div>
                  <Button className="w-full h-12 rounded-[12px] bg-[#16181a] text-white text-[15px] font-medium hover:bg-[#16181a]/80 border-0 flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Ariza yuborish
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orqaga */}
        <div className="mt-10">
          <Link href={`/kurslar/${kategoriya}`} className="inline-flex items-center gap-2 text-[14px] text-[#7ea2d4] hover:text-[#5b87c0] font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {catName} kurslariga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
