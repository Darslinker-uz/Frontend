import { ArrowRight } from "lucide-react";

const CourseCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {[1,2,3,4,5,6].map((i) => (
      <div key={i} className="bg-[#1e2024] rounded-[16px] h-[120px]" />
    ))}
  </div>
);

const btn = "flex items-center justify-center gap-2 py-3 rounded-[14px] bg-gradient-to-r from-[#4a7ab5] to-[#7ea2d4] hover:from-[#3d6a96] hover:to-[#6b91c3] text-[14px] text-white font-medium transition-all";

export default function CheckPage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="max-w-[1060px] mx-auto px-5 py-8 space-y-10">
        <h1 className="text-[24px] font-bold text-[#16181a]">Desktop joylashuv — 5 xil</h1>
        <p className="text-[13px] text-[#7c8490]">Mobileda hammasi pastda full width. Desktopda har xil joy.</p>

        {/* 1: Desktopda sarlavha yonida o'ngda, mobileda pastda */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">1 — Desktopda sarlavha yonida o&apos;ngda</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-5 gap-3">
            <h2 className="text-[24px] font-bold text-[#16181a]">Mashhur kurslar</h2>
            <a href="#" className={`hidden md:flex w-auto px-6 ${btn}`}>
              Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <CourseCards />
          <a href="#" className={`md:hidden mt-4 w-full ${btn}`}>
            Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        {/* 2: Desktopda pastda o'ngda, mobileda pastda full */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">2 — Desktopda pastda o&apos;ngda</p>
          <h2 className="text-[24px] font-bold text-[#16181a] mb-5">Mashhur kurslar</h2>
          <CourseCards />
          <div className="mt-4 flex justify-end">
            <a href="#" className={`hidden md:flex w-auto px-6 ${btn}`}>
              Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <a href="#" className={`md:hidden mt-4 w-full ${btn}`}>
            Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        {/* 3: Desktopda pastda markazda kichik, mobileda full */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">3 — Desktopda pastda markazda kichik</p>
          <h2 className="text-[24px] font-bold text-[#16181a] mb-5">Mashhur kurslar</h2>
          <CourseCards />
          <div className="mt-4 flex justify-center">
            <a href="#" className={`hidden md:flex w-auto px-8 ${btn}`}>
              Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <a href="#" className={`md:hidden mt-4 w-full ${btn}`}>
            Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        {/* 4: Desktopda ham pastda full width */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">4 — Desktopda ham pastda full width</p>
          <h2 className="text-[24px] font-bold text-[#16181a] mb-5">Mashhur kurslar</h2>
          <CourseCards />
          <a href="#" className={`mt-4 w-full ${btn}`}>
            Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        {/* 5: Desktopda sarlavha ostida, mobileda pastda */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">5 — Desktopda sarlavha ostida</p>
          <div className="mb-5">
            <h2 className="text-[24px] font-bold text-[#16181a]">Mashhur kurslar</h2>
            <a href="#" className={`hidden md:inline-flex w-auto px-6 mt-3 ${btn}`}>
              Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <CourseCards />
          <a href="#" className={`md:hidden mt-4 w-full ${btn}`}>
            Barcha kurslarni ko&apos;rish <ArrowRight className="w-4 h-4" />
          </a>
        </section>

      </div>
    </div>
  );
}
