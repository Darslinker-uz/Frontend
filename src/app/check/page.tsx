export default function CheckPage() {
  const checks = [
    "Sizga mos kurslarni tanlab beramiz",
    "Narx va sifatni solishtiramiz",
    "24 soat ichida javob beramiz",
    "Xizmat bepul",
  ];

  const CheckIcon = () => (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
  );

  const bg = "bg-gradient-to-br from-[#1e2530] via-[#253550] to-[#1e2530]";
  const inp = "w-full h-[48px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#7ea2d4]/40 transition-all";
  const btn = "w-full h-[48px] rounded-[10px] bg-white text-[#16181a] text-[15px] font-semibold";

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="max-w-[1060px] mx-auto px-5 py-8 space-y-12">
        <h1 className="text-[24px] font-bold text-[#16181a]">D9 joylashuv — 10 xil</h1>

        {/* 1: Asl — markazda text, pastda glass forma */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">1 — Asl (markazda text, pastda forma)</p>
          <div className={`${bg} rounded-[20px] p-8 md:p-12`}>
            <div className="text-center mb-8">
              <p className="text-[13px] text-[#7ea2d4]/60 font-medium mb-2">BEPUL XIZMAT</p>
              <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-[-0.03em]">O&apos;zingizga mos kursni toping</h2>
            </div>
            <div className="max-w-[440px] mx-auto rounded-[18px] bg-white/[0.05] border border-white/[0.06] p-6 space-y-3">
              <input placeholder="Ismingiz" className={inp} />
              <input placeholder="Telefon raqam" className={inp} />
              <input placeholder="Qaysi sohaga qiziqasiz?" className={inp} />
              <button className={btn}>Ariza yuborish</button>
            </div>
            <div className="hidden md:flex justify-center gap-6 mt-8">
              {checks.map((t) => (<span key={t} className="text-[12px] text-white/25 flex items-center gap-1.5"><CheckIcon />{t}</span>))}
            </div>
          </div>
        </section>

        {/* 2: Chapda text + check, o'ngda forma */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">2 — Chapda text, o&apos;ngda forma</p>
          <div className={`${bg} rounded-[20px] p-6 md:p-10`}>
            <div className="md:flex md:gap-10 md:items-center">
              <div className="md:max-w-[45%] mb-6 md:mb-0">
                <p className="text-[13px] text-[#7ea2d4]/60 font-medium mb-2">BEPUL XIZMAT</p>
                <h2 className="text-[26px] md:text-[34px] font-bold text-white tracking-[-0.03em] leading-tight">O&apos;zingizga mos kursni toping</h2>
                <div className="hidden md:block space-y-3 mt-6">
                  {checks.map((t) => (<div key={t} className="flex items-center gap-2 text-[#7ea2d4]/30"><CheckIcon /><span className="text-[13px] text-white/30">{t}</span></div>))}
                </div>
              </div>
              <div className="flex-1 rounded-[18px] bg-white/[0.05] border border-white/[0.06] p-6 space-y-3">
                <input placeholder="Ismingiz" className={inp} />
                <input placeholder="Telefon raqam" className={inp} />
                <input placeholder="Qiziqish" className={inp} />
                <button className={btn}>Ariza yuborish</button>
              </div>
            </div>
          </div>
        </section>

        {/* 3: O'ngda text, chapda forma */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">3 — O&apos;ngda text, chapda forma</p>
          <div className={`${bg} rounded-[20px] p-6 md:p-10`}>
            <div className="md:flex md:flex-row-reverse md:gap-10 md:items-center">
              <div className="md:max-w-[45%] mb-6 md:mb-0">
                <p className="text-[13px] text-[#7ea2d4]/60 font-medium mb-2">BEPUL XIZMAT</p>
                <h2 className="text-[26px] md:text-[34px] font-bold text-white tracking-[-0.03em] leading-tight">Kurs izlash oson bo&apos;lsin</h2>
                <p className="text-[14px] text-white/25 mt-3">Ariza qoldiring — mutaxassislarimiz sizga mos kursni topadi</p>
                <div className="hidden md:block space-y-3 mt-6">
                  {checks.map((t) => (<div key={t} className="flex items-center gap-2 text-[#7ea2d4]/30"><CheckIcon /><span className="text-[13px] text-white/30">{t}</span></div>))}
                </div>
              </div>
              <div className="flex-1 rounded-[18px] bg-white/[0.05] border border-white/[0.06] p-6 space-y-3">
                <input placeholder="Ismingiz" className={inp} />
                <input placeholder="Telefon raqam" className={inp} />
                <input placeholder="Qiziqish" className={inp} />
                <button className={btn}>Ariza yuborish</button>
              </div>
            </div>
          </div>
        </section>

        {/* 4: Yuqorida text, pastda 3 ustunli forma */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">4 — Yuqorida text, pastda 3 ustunli forma</p>
          <div className={`${bg} rounded-[20px] p-6 md:p-10`}>
            <div className="md:flex md:items-start md:justify-between mb-8">
              <div>
                <p className="text-[13px] text-[#7ea2d4]/60 font-medium mb-2">BEPUL XIZMAT</p>
                <h2 className="text-[26px] md:text-[34px] font-bold text-white tracking-[-0.03em]">Ariza qoldiring</h2>
              </div>
              <div className="hidden md:flex gap-6 mt-2">
                {checks.map((t) => (<span key={t} className="text-[12px] text-white/25 flex items-center gap-1.5"><CheckIcon />{t}</span>))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input placeholder="Ismingiz" className={`${inp} md:rounded-[12px]`} />
              <input placeholder="Telefon raqam" className={`${inp} md:rounded-[12px]`} />
              <input placeholder="Qiziqish" className={`${inp} md:rounded-[12px]`} />
              <button className="h-[48px] rounded-[10px] md:rounded-[12px] bg-white text-[#16181a] text-[15px] font-semibold">Yuborish</button>
            </div>
          </div>
        </section>

        {/* 5: Markazda hammasi, checklar yuqorida */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">5 — Checklar yuqorida, forma pastda</p>
          <div className={`${bg} rounded-[20px] p-8 md:p-12`}>
            <div className="hidden md:flex justify-center gap-6 mb-6">
              {checks.map((t) => (<span key={t} className="text-[12px] text-white/25 flex items-center gap-1.5"><CheckIcon />{t}</span>))}
            </div>
            <div className="text-center mb-8">
              <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-[-0.03em]">Sizga mos kursni topamiz</h2>
              <p className="text-[14px] text-white/25 mt-2">Bepul va 24 soat ichida</p>
            </div>
            <div className="max-w-[440px] mx-auto space-y-3">
              <input placeholder="Ismingiz" className={inp} />
              <input placeholder="Telefon raqam" className={inp} />
              <input placeholder="Qiziqish" className={inp} />
              <button className={btn}>Ariza yuborish</button>
            </div>
          </div>
        </section>

        {/* 6: Chapda forma, o'ngda katta text */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">6 — Chapda forma, o&apos;ngda katta text</p>
          <div className={`${bg} rounded-[20px] p-6 md:p-10`}>
            <div className="md:flex md:gap-10 md:items-center">
              <div className="flex-1 mb-6 md:mb-0 space-y-3">
                <input placeholder="Ismingiz" className={inp} />
                <input placeholder="Telefon raqam" className={inp} />
                <input placeholder="Qiziqish" className={inp} />
                <button className={btn}>Ariza yuborish</button>
              </div>
              <div className="md:max-w-[45%]">
                <h2 className="text-[28px] md:text-[42px] font-bold text-white tracking-[-0.03em] leading-[1.1]">Kurs izlash oson bo&apos;lsin</h2>
                <p className="text-[14px] text-white/25 mt-3">Biz sizga eng yaxshi variantni topamiz</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7: Markazda 2 ustunli forma */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">7 — Markazda 2 ustunli forma</p>
          <div className={`${bg} rounded-[20px] p-8 md:p-12`}>
            <div className="text-center mb-8">
              <p className="text-[13px] text-[#7ea2d4]/60 font-medium mb-2">BEPUL XIZMAT</p>
              <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-[-0.03em]">Ariza qoldiring</h2>
            </div>
            <div className="max-w-[560px] mx-auto rounded-[18px] bg-white/[0.05] border border-white/[0.06] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Ismingiz" className={inp} />
                <input placeholder="Telefon raqam" className={inp} />
                <input placeholder="Qaysi sohaga qiziqasiz?" className={`${inp} md:col-span-2`} />
                <button className={`${btn} md:col-span-2`}>Ariza yuborish</button>
              </div>
            </div>
            <div className="hidden md:flex justify-center gap-6 mt-8">
              {checks.map((t) => (<span key={t} className="text-[12px] text-white/25 flex items-center gap-1.5"><CheckIcon />{t}</span>))}
            </div>
          </div>
        </section>

        {/* 8: Chapda text + check, o'ngda forma glass yo'q */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">8 — Chapda text, o&apos;ngda forma (glasssiz)</p>
          <div className={`${bg} rounded-[20px] p-6 md:p-10`}>
            <div className="md:flex md:gap-10 md:items-center">
              <div className="md:max-w-[45%] mb-6 md:mb-0">
                <p className="text-[13px] text-[#7ea2d4]/60 font-medium mb-2">24 SOAT ICHIDA JAVOB</p>
                <h2 className="text-[26px] md:text-[34px] font-bold text-white tracking-[-0.03em] leading-tight">Biz sizga yordam beramiz</h2>
                <div className="flex flex-wrap gap-2 mt-5">
                  {checks.map((t) => (<span key={t} className="text-[11px] text-white/20 bg-white/[0.04] px-3 py-1.5 rounded-full">{t}</span>))}
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <input placeholder="Ismingiz" className={inp} />
                <input placeholder="Telefon raqam" className={inp} />
                <input placeholder="Qiziqish" className={inp} />
                <button className={btn}>Ariza yuborish</button>
              </div>
            </div>
          </div>
        </section>

        {/* 9: Markazda katta, forma kengroq */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">9 — Katta sarlavha, kengroq forma</p>
          <div className={`${bg} rounded-[20px] p-8 md:p-12`}>
            <div className="text-center mb-10">
              <h2 className="text-[30px] md:text-[44px] font-bold text-white tracking-[-0.03em]">Kurs topa olmayapsizmi?</h2>
              <p className="text-[15px] text-white/25 mt-3 max-w-[400px] mx-auto">Ma&apos;lumotlaringizni qoldiring — biz sizga eng mos kursni topib beramiz</p>
            </div>
            <div className="max-w-[520px] mx-auto space-y-3">
              <input placeholder="Ismingiz" className={`${inp} h-[52px] text-[15px] rounded-[12px]`} />
              <input placeholder="Telefon raqam" className={`${inp} h-[52px] text-[15px] rounded-[12px]`} />
              <input placeholder="Qaysi sohaga qiziqasiz?" className={`${inp} h-[52px] text-[15px] rounded-[12px]`} />
              <button className="w-full h-[52px] rounded-[12px] bg-white text-[#16181a] text-[15px] font-semibold">Ariza yuborish</button>
            </div>
            <div className="hidden md:flex justify-center gap-6 mt-10">
              {checks.map((t) => (<span key={t} className="text-[12px] text-white/20 flex items-center gap-1.5"><CheckIcon />{t}</span>))}
            </div>
          </div>
        </section>

        {/* 10: 3 ustun — check | forma | check */}
        <section>
          <p className="text-[12px] font-semibold text-[#7c8490] mb-3">10 — Forma markazda, checklar ikkala yonda</p>
          <div className={`${bg} rounded-[20px] p-6 md:p-10`}>
            <div className="text-center mb-8">
              <p className="text-[13px] text-[#7ea2d4]/60 font-medium mb-2">BEPUL XIZMAT</p>
              <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-[-0.03em]">Ariza qoldiring</h2>
            </div>
            <div className="md:flex md:items-start md:gap-8 md:justify-center">
              <div className="hidden md:block w-[200px] space-y-3 pt-3">
                {checks.slice(0, 2).map((t) => (<div key={t} className="flex items-center gap-2 text-[#7ea2d4]/30"><CheckIcon /><span className="text-[13px] text-white/25">{t}</span></div>))}
              </div>
              <div className="w-full md:w-[380px] rounded-[18px] bg-white/[0.05] border border-white/[0.06] p-6 space-y-3">
                <input placeholder="Ismingiz" className={inp} />
                <input placeholder="Telefon raqam" className={inp} />
                <input placeholder="Qiziqish" className={inp} />
                <button className={btn}>Yuborish</button>
              </div>
              <div className="hidden md:block w-[200px] space-y-3 pt-3">
                {checks.slice(2).map((t) => (<div key={t} className="flex items-center gap-2 text-[#7ea2d4]/30"><CheckIcon /><span className="text-[13px] text-white/25">{t}</span></div>))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
