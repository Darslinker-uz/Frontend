import { getImageProps } from "next/image";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { CrmApplyButton } from "@/components/crm/crm-apply";

// Bosh sahifa hero'si.
// lg+: chap ustunda sarlavha + tugmalar, ostida ro'yxat; o'ngda 3D rasm (ikki qatorni egallaydi).
// Mobil/planshet: rasm yo'q — markazdagi sarlavha → ro'yxat → tugmalar (grid tartibi bilan, DOM bitta).

const HERO_IMAGE = "/images/hero/crm-hero-transparent-v1.png";
const MOBILE_MEDIA = "(max-width: 1023.98px)";
// 1x1 shaffof GIF: <picture> shu media'da uni tanlaydi, asl rasm umuman yuklanmaydi.
// `hidden` yetarli emas — brauzer display:none'dagi eager rasmni ham yuklab oladi.
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAACH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function HeroPicture({
  src,
  width,
  height,
  sizes,
  hideMedia,
  alt,
  className,
}: {
  src: string;
  width: number;
  height: number;
  sizes: string;
  hideMedia: string;
  alt: string;
  className: string;
}) {
  const { props } = getImageProps({ src, alt, width, height, sizes, loading: "eager", fetchPriority: "high" });
  return (
    <picture>
      <source media={hideMedia} srcSet={BLANK} />
      <img {...props} alt={alt} className={`block h-auto object-contain ${className}`} />
    </picture>
  );
}

const BULLETS = [
  "Davomat, to'lov va qarzdorlik",
  "Jonli quiz bilan darslar qiziqarli",
  "Ota-onaga Telegram orqali xabar",
];

export function HomeHero() {
  return (
    // Kontent navbar (62px) va pastdagi muammo kartalarining tepa qirrasi orasida markazda turadi.
    // Kartalar hero'ga -76px kirib keladi, ichki pt-3 (12px) bilan tepasi hero tubidan 64px yuqorida —
    // shuning uchun pastdan 64px zaxira. Tepadagi qo'shimcha padding kontentni navbar'dan
    // biroz pastga tushiradi — katta logo ostida tepaga taqalib qolmasin.
    // Mobil/planshet: kontent tepadan boshlanadi (markazlanmaydi) — birinchi ekranda sarlavha va
    // tugmalar darhol ko'rinsin. lg+: markazda, biroz yuqoriga surilgan.
    // Mobilda pastki zaxira 96px: kichik ekranda kontent ekrandan uzun bo'lsa ham, tugmalar bilan
    // birinchi karta orasida kamida ~40px qoladi (kartalar hero'ga -86px kirib keladi).
    // Fon — "Aurora": sekin suzuvchi yumshoq ko'k/binafsha nurlar.
    // Qatlam navbar ortiga ham (-62px) chiqadi: tepada navbar shaffof, chok ko'rinmasin.
    // overflow-x-clip — nurlar gorizontal scroll yaratmasin, lekin yuqoriga chiqishi kesilmasin.
    // Mobil/planshetda viewport birliklari (vh/svh/dvh) YO'Q: manzil paneli yashirinib-chiqqanda ekran
    // balandligi o'zgaradi va hero cho'zilib "sakraydi". Balandlik faqat kontent + qat'iy padding'dan.
    // lg+: brauzer paneli harakatlanmaydi — markazlash uchun ekran balandligi qoladi.
    <div className="relative isolate flex flex-col justify-start overflow-x-clip pt-6 pb-[136px] sm:pt-14 lg:min-h-[calc(100dvh-62px)] lg:justify-center lg:pt-12 lg:pb-[64px]">
      <style>{`
        @keyframes hb-float-a { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(-40px,30px) scale(1.08) } }
        @keyframes hb-float-b { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(50px,-30px) scale(0.94) } }
        @keyframes hb-float-c { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-30px,-40px) } }
        @media (prefers-reduced-motion: reduce) { .hb-anim { animation: none !important } }
      `}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-[62px] bottom-0 -z-10">
        <span className="hb-anim absolute right-[-8%] top-[-8%] h-[560px] w-[560px] rounded-full bg-[#7ea2d4] opacity-[0.42] blur-[100px] [animation:hb-float-a_16s_ease-in-out_infinite] max-lg:right-[-30%] max-lg:top-[42%] max-lg:h-[340px] max-lg:w-[340px]" />
        <span className="hb-anim absolute right-[22%] top-[22%] h-[380px] w-[380px] rounded-full bg-[#b9a7f0] opacity-[0.35] blur-[100px] [animation:hb-float-b_20s_ease-in-out_infinite] max-lg:left-[-25%] max-lg:right-auto max-lg:top-[14%] max-lg:h-[280px] max-lg:w-[280px]" />
        <span className="hb-anim absolute left-[-10%] top-[-14%] h-[440px] w-[440px] rounded-full bg-[#b8cdea] opacity-[0.49] blur-[100px] [animation:hb-float-c_18s_ease-in-out_infinite]" />
        {/* Navbar zonasi ham bo'yalsin: tepa bo'ylab yumshoq ko'kish nur */}
        <span className="absolute left-[25%] top-[-120px] h-[260px] w-[50%] rounded-full bg-[#a9c2e6] opacity-[0.35] blur-[90px]" />
        {/* Pastki qism sahifa rangiga so'nadi — keyingi bo'lim bilan chok ko'rinmasin */}
        <span className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#f0f2f3]" />
      </div>
      <section className="w-full max-w-[1600px] mx-auto px-5 md:px-20 py-6 md:py-8 lg:-translate-y-[16%]">
        <div className="grid lg:grid-cols-[1fr_1fr] lg:grid-rows-[auto_auto] lg:gap-x-10">
          <div className="mx-auto hidden w-full max-w-[540px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block lg:self-center">
            <HeroPicture
              src={HERO_IMAGE}
              width={1254}
              height={1254}
              sizes="540px"
              hideMedia={MOBILE_MEDIA}
              alt="Darslinker CRM bo'limlari: o'quvchilar, lidlar, guruhlar, to'lovlar, davomat, dashboard va Excel import"
              className="w-full"
            />
          </div>
          {/* Mobilda `contents`: h1 va tugmalar grid'ning o'z elementlari bo'ladi, ro'yxat ular orasiga
              tushadi (h1 → ro'yxat → tugmalar). lg'dan yana bitta blok: h1 + tugmalar, ro'yxat ostida. */}
          <div className="contents lg:col-start-1 lg:row-start-1 lg:block lg:self-end">
            {/* Har qurilmada aniq 3 qator: har qator `whitespace-nowrap`, o'lcham ustun eniga moslangan
                (mobilda vw bilan, lg'dan ikki ustunli joylashuvga qarab). */}
            <div className="order-1 lg:order-none">
              <h1 className="text-center tracking-[-0.035em] lg:text-left">
                <span className="block whitespace-nowrap text-[clamp(20px,5.4vw,26px)] font-semibold leading-tight tracking-[-0.015em] text-[#5b87c0] md:text-[30px] lg:text-[28px] xl:text-[34px] 2xl:text-[38px]">
                  O&apos;quv markazlari uchun
                </span>{" "}
                <span className="mt-2 block whitespace-nowrap text-[clamp(46px,14vw,72px)] font-bold leading-[0.98] md:text-[84px] lg:text-[72px] xl:text-[88px] 2xl:text-[100px]">
                  CRM va LMS
                </span>{" "}
                <span className="block whitespace-nowrap text-[clamp(46px,14vw,72px)] font-bold leading-[0.98] md:text-[84px] lg:text-[72px] xl:text-[88px] 2xl:text-[100px]">
                  platformasi
                </span>
              </h1>
            </div>

            <div className="order-3 mt-8 flex flex-col sm:flex-row sm:justify-center gap-3 lg:order-none lg:mt-6 lg:justify-start">
              <CrmApplyButton
                refSource="home"
                className="group relative h-[56px] px-[60px] lg:pl-7 rounded-full bg-[#2d5a8a] text-white text-[16px] font-semibold hover:bg-[#244c76] transition-colors inline-flex items-center justify-center lg:justify-start"
              >
                {/* Strelka doirasi absolute — matn tugmaning aniq o'rtasida, padding ikki tomonda teng. */}
                Bepul sinab ko&apos;rish
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#2d5a8a] flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </CrmApplyButton>
              <a
                href="#narxlar"
                className="group h-[56px] px-6 rounded-full bg-[#5b87c0] text-white text-[16px] font-semibold hover:bg-[#4f79b0] transition-colors inline-flex items-center justify-center gap-2"
              >
                Tariflar bilan tanishish
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>

          <ul className="order-2 mx-auto mt-7 w-fit space-y-2.5 lg:order-none lg:col-start-1 lg:row-start-2 lg:mx-0 lg:mt-7 lg:self-start">
            {BULLETS.map((t) => (
              <li key={t} className="flex gap-2.5 text-[15px] leading-snug md:text-[16px] text-[#3d444d]">
                <Check className="w-5 h-5 shrink-0 mt-0.5 text-[#5b87c0]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
