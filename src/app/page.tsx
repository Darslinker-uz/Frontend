import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Star, MapPin, ArrowRight, Sparkles, MousePointerClick } from "lucide-react";
import { FeaturedSlider } from "@/components/featured-slider";

const categories = [
  { name: "IT & Dasturlash", count: 86, desc: "Python, JavaScript, React va boshqalar" },
  { name: "Dizayn", count: 42, desc: "UI/UX, Figma, Photoshop, Illustrator" },
  { name: "Marketing", count: 35, desc: "SMM, SEO, kontekst reklama" },
  { name: "Xorijiy tillar", count: 64, desc: "Ingliz, rus, koreys, arab tillari" },
  { name: "Biznes & Startap", count: 28, desc: "Tadbirkorlik, moliya, boshqaruv" },
  { name: "Akademik fanlar", count: 18, desc: "Matematika, fizika, kimyo" },
];

const courses = [
  { title: "JavaScript & React", category: "Dasturlash", format: "Offline", provider: "Najot Ta'lim", location: "Toshkent", price: "650 000", priceFree: false, rating: "4.9", duration: "6 oy", gradient: "from-[#4a7ab5] via-[#7ea2d4] to-[#a3c4e8]", iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { title: "UI/UX dizayn Figma", category: "Dizayn", format: "Online", provider: "Sarvar Nazarov", location: "Online", price: "Bepul", priceFree: true, rating: "4.7", duration: "3 oy", gradient: "from-[#6b5b95] via-[#8b7bb5] to-[#b0a3d4]", iconPath: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586" },
  { title: "Digital Marketing & SMM", category: "Marketing", format: "Offline", provider: "Marketing Pro", location: "Samarqand", price: "400 000", priceFree: false, rating: "4.6", duration: "4 oy", gradient: "from-[#a35b2d] via-[#c47e4a] to-[#d4a07e]", iconPath: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { title: "IELTS Intensive 7.0+", category: "Ingliz tili", format: "Offline", provider: "Everest School", location: "Toshkent", price: "600 000", priceFree: false, rating: "4.9", duration: "2 oy", gradient: "from-[#2d6a5a] via-[#4a9e8a] to-[#7ec4b8]", iconPath: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { title: "Flutter mobil ilova", category: "Dasturlash", format: "Video", provider: "Botir Xolmatov", location: "YouTube", price: "Bepul", priceFree: true, rating: "4.5", duration: "3 oy", gradient: "from-[#7a6520] via-[#a08a35] to-[#c4a84e]", iconPath: "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" },
  { title: "Data Science & AI", category: "Dasturlash", format: "Bootcamp", provider: "AI Academy", location: "Toshkent", price: "1 200 000", priceFree: false, rating: "4.9", duration: "4 oy", gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]", iconPath: "M12 2a10 10 0 1 0 10 10H12V2z" },
];


export default function HomePage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-5 md:px-20">
        {/* HERO AREA — viewport markazida */}
        <div className="flex flex-col gap-5 pt-6 md:pt-8 pb-6">
        {/* HEADING + SEARCH */}
        <div className="relative rounded-[16px] md:rounded-[20px] border border-[#e4e7ea] overflow-hidden bg-[#080e18]">
          <div className="absolute w-[450px] h-[450px] rounded-full bg-[#7ea2d4]/60 blur-[120px] -top-40 -left-28 aurora-blob-1" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#4a7ab5]/50 blur-[120px] -bottom-40 -right-20 aurora-blob-2" />
        <div className="relative px-5 py-5 md:px-10 md:py-8">
          {/* Mobil — yuqorida text, pastda input */}
          <h1 className="md:hidden text-[18px] font-semibold text-white tracking-[-0.02em] mb-4">
            O&apos;zingizga mos kursni toping
          </h1>
          {/* Desktop — text va input bir qatorda */}
          <div className="flex items-center gap-2 md:gap-4">
            <h1 className="hidden md:block text-[22px] font-semibold text-white tracking-[-0.02em] whitespace-nowrap shrink-0">
              O&apos;zingizga mos kursni toping
            </h1>
            <div className="relative flex-1">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-white/25" />
              <input
                type="text"
                placeholder="Kurs izlash..."
                className="w-full h-[40px] md:h-[44px] pl-9 md:pl-10 pr-4 rounded-[10px] md:rounded-[12px] bg-white/[0.07] border border-white/[0.1] text-[16px] md:text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#7ea2d4]/40 focus:border-[#7ea2d4]/50 transition-all"
              />
            </div>
            <button className="h-[40px] w-[40px] md:h-[44px] md:w-auto md:px-4 rounded-[10px] md:rounded-[12px] border border-white/[0.1] text-white/50 font-medium hover:bg-white/[0.06] transition-colors flex items-center justify-center md:gap-2 shrink-0">
              <SlidersHorizontal className="w-[16px] h-[16px]" />
              <span className="hidden md:inline text-[14px]">Filtr</span>
            </button>
            <button className="h-[40px] w-[40px] md:h-[44px] md:w-auto md:px-4 rounded-[10px] md:rounded-[12px] border border-white/[0.1] text-white/50 font-medium hover:bg-white/[0.06] transition-colors flex items-center justify-center md:gap-2 shrink-0">
              <Search className="w-[16px] h-[16px]" />
              <span className="hidden md:inline text-[14px]">Qidirish</span>
            </button>
          </div>
        </div>
        </div>

        {/* FEATURED SLIDER */}
        <FeaturedSlider />
        </div>

        {/* QOLGAN SECTIONLAR */}
        <div className="space-y-10 md:space-y-14 py-10 md:py-14">

        {/* CTA TEXT */}
        <p className="text-center text-[28px] md:text-[42px] font-normal font-[family-name:var(--font-kalam)] text-[#16181a] py-4 md:py-8">Kasbingizni bugun tanlang</p>

        {/* CATEGORIES SECTION */}
        <div className="bg-[#e8eaed] rounded-[20px] p-5 md:p-8">
          <h2 className="text-[24px] md:text-[32px] font-bold text-[#16181a] tracking-[-0.03em]">Yo&apos;nalishlar</h2>
          <p className="text-[16px] md:text-[22px] text-[#7c8490] mt-2 font-light">O&apos;zingizga qiziq bo&apos;lgan yo&apos;nalishni tanlang</p>
          <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button key={cat.name} className="relative overflow-hidden bg-[#1e2024] rounded-[16px] md:rounded-[18px] lg:rounded-[20px] md:p-5 lg:p-6 xl:p-7 md:h-[150px] lg:h-[180px] xl:h-[200px] hover:bg-[#26282c] transition-all">
              {/* Desktop */}
              <span className="hidden md:block absolute top-5 left-5 lg:top-6 lg:left-6 xl:top-7 xl:left-7 text-[20px] lg:text-[24px] xl:text-[26px] font-bold text-white leading-tight max-w-[55%]">{cat.name}</span>
              <span className="hidden md:block absolute bottom-5 left-5 lg:bottom-6 lg:left-6 xl:bottom-7 xl:left-7 text-[12px] lg:text-[13px] xl:text-[14px] text-white/80 line-clamp-1 max-w-[55%]">{cat.desc}</span>
              <span className="hidden md:block absolute right-4 lg:right-6 xl:right-7 top-1/2 -translate-y-1/2 text-[38px] lg:text-[48px] xl:text-[52px] font-bold text-white/15 leading-none">{cat.count}</span>
              {/* Mobil */}
              <div className="relative md:hidden px-4 py-4 h-[85px] flex flex-col justify-between items-start text-left">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[44px] font-bold text-white/15 leading-none">{cat.count}</span>
                <span className="relative text-[21px] font-bold text-white leading-tight">{cat.name}</span>
                <span className="relative text-[11px] text-white/80">{cat.desc}</span>
              </div>
            </button>
          ))}
        </div>
        </div>
        </div>

        {/* COURSES GRID */}
        {/* CTA TEXT */}
        <p className="text-center text-[28px] md:text-[42px] font-normal font-[family-name:var(--font-kalam)] text-[#16181a] py-4 md:py-8">Har bir kurs yangi imkoniyat</p>

        <section>
          <h2 className="font-[family-name:var(--font-outfit)] text-[24px] md:text-[28px] font-bold text-[#16181a] leading-tight mb-5">
            Mashhur kurslar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {courses.map((course) => (
              <div
                key={course.title}
                className={`relative overflow-hidden rounded-[18px] bg-gradient-to-br ${course.gradient} flex flex-col cursor-pointer hover:scale-[1.02] transition-all`}
              >
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                <svg className="absolute right-4 top-1/3 w-[60px] h-[60px] text-white/[0.08]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d={course.iconPath} /></svg>
                <div className="relative p-5 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">{course.category}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-[11px]">{course.format}</span>
                  </div>
                  <h3 className="text-[17px] font-bold text-white leading-tight">{course.title}</h3>
                  <p className="text-[12px] text-white/35 mt-1">{course.provider} · {course.location}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-white/30">
                    <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-white/50 text-white/50" />{course.rating}</span>
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div className="relative mx-3 mb-3 rounded-[12px] bg-white/[0.1] border border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[14px] font-bold text-white">{course.priceFree ? "Bepul" : `${course.price} so'm`}</span>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </div>
              </div>
            ))}
          </div>
          <Link href="/kurslar" className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-[14px] bg-gradient-to-r from-[#4a7ab5] to-[#7ea2d4] hover:from-[#3d6a96] hover:to-[#6b91c3] text-[14px] text-white font-medium transition-all">
            Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* CTA TEXT */}
        <p className="text-center text-[28px] md:text-[42px] font-normal font-[family-name:var(--font-kalam)] text-[#16181a] py-4 md:py-8">Kerakli kursni topa olmadingizmi?</p>

        {/* ARIZA QOLDIRISH */}
        <section className="bg-gradient-to-br from-[#1e2530] via-[#253550] to-[#1e2530] rounded-[20px] p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-[30px] md:text-[44px] font-bold text-white tracking-[-0.03em]">Kurs topa olmayapsizmi?</h2>
            <p className="text-[15px] text-white/25 mt-3 max-w-[400px] mx-auto">Ma&apos;lumotlaringizni qoldiring — biz sizga eng mos kursni topib beramiz</p>
          </div>
          <div className="max-w-[520px] mx-auto space-y-3">
            <input placeholder="Ismingiz" className="w-full h-[52px] px-4 text-[16px] rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#7ea2d4]/40 transition-all" />
            <input placeholder="Telefon raqam" className="w-full h-[52px] px-4 text-[16px] rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#7ea2d4]/40 transition-all" />
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

        {/* CTA SECTION */}
        <section className="bg-[#16181a] rounded-[20px] p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-[family-name:var(--font-outfit)] text-[22px] md:text-[26px] font-bold text-white leading-tight mb-2">
                Kurs o&apos;tasizmi? O&apos;quvchilar siz bilan bog&apos;lansin.
              </h2>
              <p className="text-[14px] text-white/40 max-w-[400px]">
                Minglab o&apos;quvchilarga yeting. Bepul e&apos;lon joylab boshlang.
              </p>
            </div>
            <Link href="/dashboard/listings/new">
              <Button className="h-[44px] px-6 rounded-[12px] bg-[#7ea2d4] text-white text-[14px] font-medium hover:bg-[#6b91c3] transition-colors border-0 shrink-0 flex items-center gap-2">
                Bepul boshlash
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
