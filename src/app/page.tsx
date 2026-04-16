import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowRight, MousePointerClick } from "lucide-react";
import { FeaturedSlider } from "@/components/featured-slider";
import { CoursesSlider } from "@/components/courses-slider";
import { HeroSearch } from "@/components/hero-search";
import { PhoneInput, TelegramInput } from "@/components/phone-input";
import { categories, courses } from "@/data/courses";


export default function HomePage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      {/* HERO + SLIDER — konteyner ichida */}
      <div className="max-w-[1600px] mx-auto px-5 md:px-20">
        <div className="flex flex-col gap-5 pt-6 md:pt-8 pb-6">
          {/* HEADING + SEARCH */}
          <HeroSearch />

          {/* FEATURED SLIDER */}
          <FeaturedSlider />
        </div>

        {/* KATEGORIYALAR */}
        <div className="space-y-10 md:space-y-14 py-10 md:py-14">
          <p className="text-center text-[28px] md:text-[42px] font-normal font-[family-name:var(--font-kalam)] text-[#16181a] py-4 md:py-8">Qidirish emas,<br className="md:hidden" /> tanlash vaqti keldi!</p>

          <div className="bg-[#e8eaed] rounded-[20px] p-5 md:p-8">
            <h2 className="text-[24px] md:text-[32px] font-bold text-[#16181a] tracking-[-0.03em]">Yo&apos;nalishlar</h2>
            <p className="text-[16px] md:text-[22px] text-[#7c8490] mt-2 font-light">O&apos;zingizga qiziq bo&apos;lgan yo&apos;nalishni tanlang</p>
            <div className="mt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <Link key={cat.name} href={`/kurslar/${cat.slug}`} className="relative overflow-hidden bg-[#1e2024] rounded-[16px] md:rounded-[18px] lg:rounded-[20px] md:p-5 lg:p-6 xl:p-7 md:h-[150px] lg:h-[180px] xl:h-[200px] hover:bg-[#26282c] transition-all block">
                    <span className="hidden md:block absolute top-5 left-5 lg:top-6 lg:left-6 xl:top-7 xl:left-7 text-[20px] lg:text-[24px] xl:text-[26px] font-bold text-white leading-tight max-w-[55%]">{cat.name}</span>
                    <span className="hidden md:block absolute bottom-5 left-5 lg:bottom-6 lg:left-6 xl:bottom-7 xl:left-7 text-[12px] lg:text-[13px] xl:text-[14px] text-white/80 line-clamp-1 max-w-[55%]">{cat.desc}</span>
                    <span className="hidden md:block absolute right-4 lg:right-6 xl:right-7 top-1/2 -translate-y-1/2 text-[38px] lg:text-[48px] xl:text-[52px] font-bold text-white/15 leading-none">{cat.count}</span>
                    <div className="relative md:hidden px-4 py-4 h-[85px] flex flex-col justify-between items-start text-left">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[44px] font-bold text-white/15 leading-none">{cat.count}</span>
                      <span className="relative text-[21px] font-bold text-white leading-tight">{cat.name}</span>
                      <span className="relative text-[11px] text-white/80">{cat.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-[28px] md:text-[42px] font-normal font-[family-name:var(--font-kalam)] text-[#16181a] py-4 md:py-8">Har bir kurs yangi imkoniyat</p>
        </div>
      </div>

      {/* MASHHUR KURSLAR — background bilan */}
      <div className="bg-[#e8eaed] py-8 md:py-12">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20 mb-6">
          <h2 className="text-[24px] md:text-[32px] font-bold text-[#16181a] tracking-[-0.03em]">Mashhur kurslar</h2>
          <p className="text-[16px] md:text-[22px] text-[#7c8490] mt-2 font-light">Eng ko&apos;p qidirilgan va yuqori baholangan kurslar</p>
        </div>
        <CoursesSlider courses={courses} />
      </div>

      {/* QOLGAN SECTIONLAR — konteyner ichida */}
      <div className="max-w-[1600px] mx-auto px-5 md:px-20">
        <div className="space-y-10 md:space-y-14 py-10 md:py-14">
          <p className="text-center text-[28px] md:text-[42px] font-normal font-[family-name:var(--font-kalam)] text-[#16181a] py-4 md:py-8">Kerakli kursni topa olmadingizmi?</p>

          <section id="ariza" className="bg-gradient-to-br from-[#1e2530] via-[#253550] to-[#1e2530] rounded-[20px] p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-[30px] md:text-[44px] font-bold text-white tracking-[-0.03em]">Yordam kerakmi?</h2>
              <p className="text-[15px] text-white/25 mt-3 max-w-[400px] mx-auto">Ma&apos;lumotlaringizni qoldiring — biz sizga eng mos kursni topib beramiz</p>
            </div>
            <div className="max-w-[520px] mx-auto space-y-3">
              <input placeholder="Ismingiz" className="w-full h-[52px] px-4 text-[16px] rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#7ea2d4]/40 transition-all" />
              <PhoneInput className="w-full h-[52px] px-4 text-[16px] rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#7ea2d4]/40 transition-all" />
              <TelegramInput className="w-full h-[52px] px-4 text-[16px] rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#7ea2d4]/40 transition-all" />
              <input placeholder="Qaysi sohaga qiziqasiz?" className="w-full h-[52px] px-4 text-[16px] rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#7ea2d4]/40 transition-all" />
              <button className="w-full h-[52px] rounded-[12px] bg-white text-[#16181a] text-[15px] font-semibold">Ariza yuborish</button>
            </div>
            <div className="hidden md:flex justify-center gap-6 mt-10">
              {["Sizga mos kurslarni tanlab beramiz", "Narx va sifatni solishtiramiz", "24 soat ichida javob beramiz", "Xizmat bepul"].map((t) => (
                <span key={t} className="text-[12px] text-white/20 flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-[#e8eaed] rounded-[20px] p-8 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-[family-name:var(--font-outfit)] text-[18px] md:text-[26px] font-bold text-[#16181a] leading-tight">
                Kurs egasimisiz?
              </h2>
              <Link href="/hamkorlik">
                <Button className="h-[40px] md:h-[44px] px-5 md:px-6 rounded-[12px] bg-white text-[#16181a] text-[13px] md:text-[14px] font-medium hover:bg-white/80 transition-colors shrink-0 flex items-center gap-2 border-0">
                  Hamkorlik
                  <ArrowRight className="w-[16px] h-[16px]" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
