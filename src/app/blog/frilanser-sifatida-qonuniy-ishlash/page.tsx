import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const site = "https://darslinker.uz";
const slug = "frilanser-sifatida-qonuniy-ishlash";
const url = `${site}/blog/${slug}`;
const title = "Frilanser sifatida qonuniy ishlash: 2026-yilda o‘zini o‘zi band qilish tartibi";
const description = "SMM, dizayn va dasturlash 72 talik ro‘yxatda qoldi, kopirayting chiqdi. 2026-yilda 1% soliq, “Soliq” ilovasida ro‘yxatdan o‘tish va ijtimoiy soliq tartibi.";
const cover = "/images/blog-covers/frilanser-qonuniy-ishlash-1536x1024.jpg";
const coverAlt = "Noutbuk oldida quloqchin taqib dam olayotgan yalqov va “Soliq” ilovasidagi “O‘zini o‘zi band qilish” bo‘limi";

const pf50 = "https://lex.uz/docs/-7444738";
const orq1108 = "https://lex.uz/docs/-7944527";
const pq247 = "https://lex.uz/docs/-7681520";
const nizom = "https://lex.uz/docs/-5182451";
const govGuide = "https://gov.uz/oz/advice/NaN/document/3101";
const govList = "https://gov.uz/oz/pj/sections/view/2080";
const soliqNotice = "https://gov.uz/oz/soliq/news/view/112855";
const gazetaList = "https://www.gazeta.uz/oz/2025/03/27/self-employed/";
const gazetaSocial = "https://www.gazeta.uz/oz/2026/08/03/social-tax/";
const spotDraft = "https://www.spot.uz/oz/2026/09/15/social-tax";
const spotQr = "https://www.spot.uz/oz/2026/01/19/spacial-qr";
const buxgalterPq49 = "https://buxgalter.uz/oz/publish/doc/text214444_uzini_uzi_band_qilganlarni_ishga_qabul_qilish_mumkinmi";

export const metadata: Metadata = {
  title: { absolute: "O‘zini o‘zi band qilish 2026: frilanser uchun tartib | Darslinker.uz" },
  description,
  alternates: { canonical: url },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "article", locale: "uz_UZ", siteName: "Darslinker.uz", url, title, description,
    publishedTime: "2026-10-10", modifiedTime: "2026-10-10",
    images: [{ url: `${site}${cover}`, width: 1536, height: 1024, alt: coverAlt }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${site}${cover}`] },
};

const kasblar = [
  ["Dasturchi, mobil ilova va veb-sayt ishlab chiquvchi, testlovchi", "32-band", "Ro‘yxatda bor"],
  ["Veb-dizayner, grafik dizayner", "31-band", "Ro‘yxatda bor"],
  ["Video muharrir (montaj), foto muharrir", "31-band", "Ro‘yxatda bor"],
  ["SMM mutaxassisi, targetolog, internet-marketolog, PR-menejer", "34-band", "Ro‘yxatda bor"],
  ["Onlayn-trener, onlayn-konsultant, vebinar olib boruvchi", "36-band", "Ro‘yxatda bor"],
  ["Marketpleysda tovar yoki xizmat sotish", "33-band", "2026-yildan qo‘shilgan"],
  ["Kopirayter, rerayter, transkripsiya", "—", "2026-yildan chiqarilgan"],
  ["Foto va video suratga olish xizmati", "—", "2026-yildan chiqarilgan"],
  ["Repetitorlik", "—", "2026-yildan chiqarilgan"],
];

const qadamlar = [
  "“Soliq” mobil ilovasini o‘rnating va “O‘zini o‘zi band qilish” bo‘limini oching.",
  "JShShIR (pasportdagi 14 xonali raqam) ni kiriting yoki elektron raqamli imzo (ERI) bilan kiring.",
  "Telefon raqamingizni kiriting va SMS orqali kelgan kodni tasdiqlang.",
  "Faoliyat turini tanlang. Bir nechtasini belgilash mumkin — masalan, 31 va 34-bandlarni birga.",
  "Faoliyat yuritadigan tuman yoki shaharni tanlang.",
  "Ma’lumotlarni tekshirib, “Ro‘yxatdan o‘tish” tugmasini bosing.",
  "QR-kodli ma’lumotnomani yuklab oling. U muddatsiz beriladi.",
];

const faqs = [
  { q: "O‘zini o‘zi band qilgan shaxs sifatida ro‘yxatdan o‘tish pullikmi?", a: "Yo‘q. Vazirlar Mahkamasining 806-son qarori bilan tasdiqlangan nizomga ko‘ra ro‘yxatdan o‘tish bepul, QR-kodli ma’lumotnoma esa muddatsiz beriladi. Ro‘yxatdan “Soliq” mobil ilovasi yoki soliq to‘lovchining shaxsiy kabineti orqali o‘tiladi." },
  { q: "Daromadim 100 mln so‘mdan kam bo‘lsa, soliq to‘laymanmi?", a: "Ha. 2026-yil 1-yanvardan 100 mln so‘mgacha daromadni aylanmadan olinadigan soliqdan ozod qilish tartibi bekor qilingan. Yillik daromadi 1 mlrd so‘mgacha bo‘lgan o‘zini o‘zi band qilgan shaxs birinchi so‘mdan boshlab 1% to‘laydi. Ayrim saytlarda hali eski “100 mln so‘mgacha soliq yo‘q” degan ma’lumot turibdi." },
  { q: "Ishlab turib ham o‘zini o‘zi band qilgan bo‘lish mumkinmi?", a: "Mumkin. 2026-yil 5-fevraldagi PQ-49-son qarordan keyin mehnat shartnomasi bilan ishlayotgan shaxs bir vaqtda o‘zini o‘zi band qilgan sifatida ro‘yxatdan o‘ta oladi. Davlat fuqarolik xizmatchilari bundan mustasno. O‘zini o‘zi band qilgan shaxs shu faoliyat yo‘nalishi bo‘yicha ish beruvchiga ega bo‘la olmaydi, shuning uchun asosiy ishingiz bilan bir xil xizmatni rasmiylashtirishdan oldin soliq organidan aniqlashtiring." },
  { q: "Kopirayter yoki repetitor endi qanday rasmiylashadi?", a: "Soliq qo‘mitasi ikki yo‘lni ko‘rsatgan: faoliyat turini ro‘yxatda qolgan turga o‘zgartirish yoki yakka tartibdagi tadbirkor (YaTT) sifatida ro‘yxatdan o‘tish. YaTT ham 2026-yildan yillik aylanmasi 1 mlrd so‘mgacha bo‘lsa 1% to‘laydi, lekin unda har oy kamida 1 BHM ijtimoiy soliq majburiy." },
  { q: "Ijtimoiy soliq to‘lash majburiymi?", a: "2026-yil 10-oktabr holatiga ko‘ra ixtiyoriy. Yiliga 1 BHM — 440 ming so‘m to‘lasangiz, bir yil mehnat staji hisoblanadi. 2027-yil 1-yanvardan bu to‘lovni majburiy qilish Prezident farmoni loyihasida taklif etilgan; loyiha 30-sentabrgacha muhokamada bo‘ldi, qabul qilingani haqida rasmiy xabar hali yo‘q." },
  { q: "Xorijiy mijozdan valyutada pul olsam bo‘ladimi?", a: "Ha. Nizomning 22-bandiga ko‘ra ro‘yxatdan o‘tganlik haqidagi ma’lumotnoma norezidentlardan chet el valyutasidagi to‘lovlarni tijorat bankidagi hisobvarag‘ingizga kirim qilish uchun asos hisoblanadi. Bunday tushumdan 1% soliqni kim va qanday to‘lashi bo‘yicha esa ochiq rasmiy tushuntirish topilmadi — bankingiz yoki soliq organidan yozma javob oling." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting", "@id": `${url}#article`, headline: title, description,
      mainEntityOfPage: url, inLanguage: "uz-UZ", datePublished: "2026-10-10", dateModified: "2026-10-10",
      image: { "@type": "ImageObject", url: `${site}${cover}`, width: 1536, height: 1024 },
      author: { "@type": "Organization", name: "Darslinker.uz", url: site },
      publisher: { "@type": "Organization", name: "Darslinker.uz", url: site, logo: { "@type": "ImageObject", url: `${site}/icon-512.png` } },
      citation: [pf50, orq1108, pq247, nizom, govGuide],
    },
    {
      "@type": "HowTo", name: "“Soliq” ilovasida o‘zini o‘zi band qilgan shaxs sifatida ro‘yxatdan o‘tish",
      step: qadamlar.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Asosiy", item: site },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ] },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-[#16181a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-[960px] px-5 py-10 md:px-8 md:py-14">
        <nav aria-label="Sahifa yo‘li" className="mb-6 flex flex-wrap gap-2 text-sm text-[#7c8490]">
          <Link href="/">Asosiy</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>Frilanser sifatida qonuniy ishlash</span>
        </nav>
        <header className="mx-auto mb-7 max-w-[760px]">
          <p className="mb-3 text-sm text-[#7c8490]">Darslinker.uz · <time dateTime="2026-10-10">10-oktabr, 2026</time> · Yangilangan: 2026-10 · O‘quvchilar uchun</p>
          <h1 className="text-[32px] font-bold leading-[1.15] tracking-tight md:text-[46px]">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-[#59616c]">2026-yilda ro‘yxat 72 turga qisqardi, 100 mln so‘mlik imtiyoz esa bekor bo‘ldi. SMM, dizayn va dasturlash bilan shug‘ullanadiganlar uchun nima o‘zgardi va nima o‘zgarmadi?</p>
        </header>
        <figure className="mb-10">
          <Image src={cover} alt={coverAlt} width={1536} height={1024} sizes="(max-width: 960px) 100vw, 896px" loading="eager" fetchPriority="high" className="h-auto w-full rounded-2xl" />
        </figure>
        <div className="mx-auto max-w-[760px] space-y-10 text-[17px] leading-[1.85] [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-snug [&_p+p]:mt-4 [&_a]:text-[#426a9e] [&_a]:underline [&_a]:underline-offset-4 [&_li]:mb-2">
          <section aria-labelledby="short-answer" className="rounded-xl bg-[#e8f0f9]/60 p-5 md:p-6">
            <h2 id="short-answer">Qisqa javob</h2>
            <p>O‘zbekistonda frilanser “Soliq” mobil ilovasi orqali <strong>o‘zini o‘zi band qilgan shaxs</strong> sifatida bepul ro‘yxatdan o‘tib, qonuniy ishlay oladi. 2026-yil 1-yanvardan ruxsat etilgan faoliyat turlari <strong>72 ta</strong>: dasturlash, dizayn va SMM ro‘yxatda qolgan, kopirayting va repetitorlik chiqarilgan. Soliq — yillik daromad 1 mlrd so‘mgacha bo‘lsa, aylanmaning <strong>1 foizi</strong>; 100 mln so‘mgacha soliqdan ozod qilish tartibi bekor qilingan. <a href={orq1108}>Manba: O‘RQ-1108-son Qonun.</a></p>
          </section>

          <section>
            <h2>2026-yilda frilanser uchun nima o‘zgardi?</h2>
            <p>Uch narsa bir vaqtda o‘zgardi va uchalasi ham 2026-yil 1-yanvardan kuchga kirdi. Internetdagi ko‘p qo‘llanmalar hali 2025-yilgi tartibni yozib turibdi, shuning uchun eski va yangi holatni yonma-yon qo‘ydik.</p>
            <div className="overflow-x-auto rounded-xl border border-[#e5e8eb]">
              <table className="w-full min-w-[520px] text-left text-sm leading-relaxed">
                <caption className="p-3 text-left text-[#59616c]">O‘zini o‘zi band qilgan shaxs uchun 2025 va 2026-yil qoidalari</caption>
                <thead className="bg-[#e8f0f9]"><tr>{["Nima", "2025-yilgacha", "2026-yildan"].map(h => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
                <tbody>{[
                  ["Faoliyat turlari", "100 dan ortiq", "72 ta"],
                  ["100 mln so‘mgacha daromad", "Aylanma solig‘idan ozod", "1% to‘lanadi"],
                  ["Soliq stavkasi", "100 mln so‘mdan oshganda 4%", "1 mlrd so‘mgacha 1%"],
                  ["Ishlab turib rasmiylashish", "Mumkin emas edi", "Mumkin (5-fevraldan)"],
                  ["Ijtimoiy soliq", "Ixtiyoriy", "Ixtiyoriy; 2027-yildan majburiy qilish taklif etilgan"],
                ].map(row => <tr key={row[0]} className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">{row[0]}</th>{row.slice(1).map(cell => <td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
            <p className="!mt-3 text-sm text-[#59616c]">Asos: <a href={pf50}>PF-50-son Farmon (19.03.2025)</a>, <a href={pq247}>PQ-247-son qaror (12.08.2025)</a>, <a href={orq1108}>O‘RQ-1108-son Qonun (25.12.2025)</a>, PQ-49-son qaror (05.02.2026).</p>
            <p>Ro‘yxat qisqarishining katta qismi frilanserlarga emas, sartaroshlik, avtomobil ta’mirlash va bozorda savdo qilish kabi turlarga tegdi. Soliq qo‘mitasi 2025-yil 19-dekabrdagi eslatmasida chiqarilgan faoliyat bilan shug‘ullanayotganlarga faoliyat turini o‘zgartirishni yoki YaTT sifatida ro‘yxatdan o‘tishni tavsiya qilgan. <a href={soliqNotice}>Soliq qo‘mitasi eslatmasi.</a></p>
          </section>

          <section>
            <h2>Sizning kasbingiz 72 talik ro‘yxatda bormi?</h2>
            <p>Raqamli kasblarning aksariyati ro‘yxatda qolgan. Quyidagi jadval PF-50-son Farmonning 2-ilovasi bo‘yicha tuzildi: har bir kasb yonida u kiradigan band raqami ko‘rsatilgan, ilovada faoliyat turini tanlayotganda shu band nomini qidirasiz.</p>
            <div className="overflow-x-auto rounded-xl border border-[#e5e8eb]">
              <table className="w-full min-w-[520px] text-left text-sm leading-relaxed">
                <caption className="p-3 text-left text-[#59616c]">Frilans kasblari va o‘zini o‘zi band qilish ro‘yxati (2026)</caption>
                <thead className="bg-[#e8f0f9]"><tr>{["Kasb", "Band", "Holati"].map(h => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
                <tbody>{kasblar.map(row => <tr key={row[0]} className="border-t border-[#e5e8eb]"><th scope="row" className="p-3 font-medium">{row[0]}</th><td className="p-3">{row[1]}</td><td className="p-3">{row[2]}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="!mt-3 text-sm text-[#59616c]">Manba: <a href={pf50}>PF-50-son Farmon, 2-ilova</a>; chiqarilgan turlar — <a href={gazetaList}>Gazeta.uz, 27.03.2025</a>. To‘liq ro‘yxat: <a href={govList}>gov.uz</a>.</p>
            <p>Kontent bilan ishlaydiganlar uchun eng muhim farq shu jadvalda: <strong>montaj qolgan, suratga olish chiqqan; SMM qolgan, kopirayting chiqqan</strong>. Sahifa yurituvchi SMM mutaxassisi post matnini ham yozadi, lekin uning faoliyat turi 34-band bo‘ladi. Faqat matn yozib sotadigan kopirayter esa bu ro‘yxat bo‘yicha rasmiylasha olmaydi.</p>
            <p>Ro‘yxatda alohida nomlanmagan kasblar ham bor. UI/UX dizayner, tarjimon va prompt-muhandis degan nomlar 72 ta band ichida uchramaydi; UI/UX uchun eng yaqin tur — 31-banddagi veb-dizayner. Bunday holatda bandni o‘zingizcha taxmin qilmang: ilovadagi ro‘yxatni oching va shubha qolsa, soliq organidan so‘rang.</p>
            <p>Kasbingiz chiqarilgan bo‘lsa, YaTTga o‘tishdan tashqari yana bir yo‘l bor — ro‘yxatda qolgan qo‘shni kasbga kengayish. Kopirayter uchun bu SMM (34-band): matn yozish ko‘nikmasi ustiga sahifa yuritish va targetingni qo‘shadi. Suratga oluvchi uchun esa montaj va dizayn (31-band). Darslinker’da shu yo‘nalishlardagi <Link href="/kurslar/smm">SMM kurslarini</Link> va <Link href="/kurslar/g/dizayn">dizayn kurslarini</Link> narxi va formati bo‘yicha solishtirish mumkin.</p>
          </section>

          <section>
            <h2>“Soliq” ilovasida qanday ro‘yxatdan o‘tiladi?</h2>
            <p>Ro‘yxatdan o‘tish xabardor qilish tartibida ishlaydi: ariza ko‘rib chiqilishini kutmaysiz, ma’lumotnoma shu zahoti shakllanadi. Rasmiy qo‘llanmadagi qadamlar quyidagicha. <a href={govGuide}>gov.uz qo‘llanmasi.</a></p>
            <ol className="list-decimal pl-5">
              {qadamlar.map(q => <li key={q}>{q}</li>)}
            </ol>
            <p>Ilovadan tashqari soliq to‘lovchining shaxsiy kabineti va my.gov.uz portali orqali ham ro‘yxatdan o‘tish mumkin. Faoliyatni to‘xtatmoqchi bo‘lsangiz, xuddi shu ilova yoki kabinet orqali bildirishnoma yuborasiz. <a href={nizom}>Nizom, 8 va 17-bandlar.</a></p>
            <p>Bitta cheklovni oldindan biling: o‘zini o‘zi band qilgan shaxs yollanma xodim ololmaydi. Yordamchi montajchi yoki ikkinchi dizayner yollaydigan bo‘lsangiz, bu maqom to‘g‘ri kelmaydi — YaTT yoki MChJ haqida o‘ylash kerak.</p>
          </section>

          <section>
            <h2>Qancha soliq to‘lanadi?</h2>
            <p>Soliq kodeksining 467-moddasiga ko‘ra o‘zini o‘zi band qilgan shaxs aylanmadan <strong>1%</strong> to‘laydi. Stavka yillik daromad 1 mlrd so‘mdan oshmaguncha amal qiladi — bu oyiga o‘rtacha 83 mln so‘mdan ortiq tushum degani. Chegaradan oshgan frilanser YaTT uchun belgilangan soliqlarga o‘tadi. PQ-247-son qarorga ko‘ra 1 foizli tartib 2030-yil 31-dekabrgacha belgilangan.</p>
            <p><strong>Shartli misol.</strong> SMM mutaxassisi uchta sahifa yuritib, oyiga 8 mln so‘m oladi. Yillik tushum 96 mln so‘m, undan 1% — 960 ming so‘m. Ixtiyoriy ijtimoiy soliq (440 ming so‘m) ham to‘lansa, yillik jami 1,4 mln so‘m chiqadi. 2025-yilgi tartibda shu 96 mln so‘m soliqdan ozod bo‘lar edi — imtiyoz bekor bo‘lgani aynan shunday daromaddagi frilanserga seziladi.</p>
            <p>Soliqni kim hisoblashi pulni kimdan olganingizga bog‘liq:</p>
            <ul className="list-disc pl-5">
              <li><strong>Mijoz — kompaniya (yuridik shaxs).</strong> Kompaniya soliq agenti hisoblanadi: 1 foizni to‘lov manbaida o‘zi ushlab qoladi va hisobotni ham o‘zi topshiradi (Soliq kodeksi, 465 va 470-moddalar). Siz esa xizmat uchun hisobvaraq-faktura rasmiylashtirasiz (47-modda).</li>
              <li><strong>To‘lov raqamli platforma orqali keladi.</strong> Platformani yurituvchi to‘lov tashkiloti soliq agenti bo‘ladi va soliqni o‘zi hisoblaydi.</li>
              <li><strong>Mijoz — jismoniy shaxs yoki xorijiy buyurtmachi.</strong> Kartaga o‘tkazma yoki chet eldan kelgan tushumdan 1 foiz qanday to‘lanishi bo‘yicha ochiq rasmiy tushuntirish topilmadi. Bu holatda soliq organidan yozma javob olgan ma’qul.</li>
            </ul>
            <p>Yana bir talab — elektron to‘lov qabul qilish uchun maxsus QR-kod. Spot.uz ma’lumotiga ko‘ra u YaTT va o‘zini o‘zi band qilganlar uchun 2026-yildan majburiy, yo‘qligi uchun Soliq kodeksining 221-moddasi bo‘yicha 5 mln so‘m jarima ko‘zda tutilgan; hozircha bunday kodni faqat Paynet’ning “Xolis” xizmati beradi. <a href={spotQr}>Spot.uz, 19.01.2026.</a></p>
          </section>

          <section>
            <h2>Ijtimoiy soliq to‘lash kerakmi?</h2>
            <p>Hozircha bu sizning tanlovingiz. Soliq kodeksining 408-moddasiga ko‘ra o‘zini o‘zi band qilgan shaxs yiliga 1 BHM to‘lasa, shu yil mehnat stajiga qo‘shiladi. BHM 2026-yil 1-sentabrdan 440 ming so‘m, ya’ni oyiga taxminan 36,7 ming so‘m. <a href={gazetaSocial}>Gazeta.uz, 03.08.2026.</a></p>
            <p>Solishtirish uchun: YaTT xuddi shu ijtimoiy soliqni har oy kamida 1 BHM miqdorida to‘laydi — yiliga 5,28 mln so‘m, o‘n ikki barobar ko‘p. Kopirayter yoki repetitor YaTTga o‘tayotganda hisobga oladigan asosiy xarajat shu.</p>
            <p>Bu tartib o‘zgarishi mumkin. Iqtisodiyot va moliya vazirligi e’lon qilgan Prezident farmoni loyihasida 2027-yil 1-yanvardan o‘zini o‘zi band qilganlar uchun 1 BHM ijtimoiy soliqni majburiy qilish taklif etilgan. Loyiha 2026-yil 30-sentabrgacha jamoatchilik muhokamasida turdi; 10-oktabr holatiga ko‘ra qabul qilingani haqida rasmiy xabar topilmadi. <a href={spotDraft}>Spot.uz, 15.09.2026.</a></p>
          </section>

          <section>
            <h2>Ishlab turib yoki o‘qib turib ham rasmiylashsa bo‘ladimi?</h2>
            <p>2026-yil 5-fevraldan bo‘ladi. PQ-49-son qaror bilan kiritilgan o‘zgartirishga ko‘ra mehnat shartnomasi bo‘yicha ishlayotgan shaxs bir vaqtda ruxsat etilgan faoliyat turi bo‘yicha o‘zini o‘zi band qilgan sifatida ro‘yxatdan o‘tishi mumkin. Davlat fuqarolik xizmatchilari bundan mustasno. <a href={buxgalterPq49}>Buxgalter.uz sharhi, 06.04.2026.</a></p>
            <p>Amalda bu shuni anglatadi: bankda operator bo‘lib ishlab, kechqurun logotip chizadigan dizayner yoki kursda o‘qib yurib birinchi sahifasini yurita boshlagan SMM o‘quvchisi daromadini yashirmasdan rasmiylashtira oladi.</p>
            <p>Cheklov ham bor: o‘zini o‘zi band qilgan shaxs shu faoliyat yo‘nalishi bo‘yicha ish beruvchiga ega bo‘la olmaydi. Kompaniyada frontend dasturchi bo‘lib ishlab, o‘sha kompaniyaga yoki xuddi shu xizmatni tashqariga “o‘zini o‘zi band” sifatida sotish soliq organida savol tug‘dirishi mumkin. Asosiy ishingiz va frilans xizmatingiz qanchalik o‘xshash bo‘lsa, oldindan aniqlashtirish shunchalik zarur.</p>
          </section>

          <section>
            <h2>Rasmiylashishdan oldin nimani tekshirib olish kerak?</h2>
            <ol className="list-decimal pl-5">
              <li>Xizmatingiz 72 talik ro‘yxatdagi qaysi bandga to‘g‘ri kelishini ilovada ko‘ring. Shartnomadagi xizmat nomi ma’lumotnomadagi faoliyat turiga mos bo‘lsin.</li>
              <li>Mijozlaringiz kim ekanini yozib chiqing: kompaniyalar, jismoniy shaxslar yoki xorijiy buyurtmachilar. Soliqni kim ushlashi shunga bog‘liq.</li>
              <li>Yillik tushumingizni taxminan hisoblang. 1 mlrd so‘mga yaqinlashsangiz yoki yordamchi yollamoqchi bo‘lsangiz, YaTT variantini ko‘ring.</li>
              <li>Staj kerak bo‘lsa, yiliga 1 BHM ijtimoiy soliqni rejaga kiriting va 2027-yilgi o‘zgarish qabul qilinganini kuzatib boring.</li>
              <li>Xorijdan pul olsangiz, bankingizdan valyuta tushumi uchun qaysi hujjat so‘ralishini oldindan bilib oling. Nizomning 22-bandiga ko‘ra ma’lumotnoma bunday to‘lovni hisobvaraqqa kirim qilish uchun asos bo‘ladi.</li>
            </ol>
            <p>Rasmiylashish daromadning o‘zini oshirmaydi — buyurtma baribir ko‘nikma va portfolio bilan topiladi. SMM bo‘yicha bozordagi real raqamlarni <Link href="/blog/smm-mutaxassisi-qancha-ishlaydi">SMM mutaxassisi qancha ishlashi haqidagi tahlilda</Link>, dasturlashga kirish yo‘lini esa <Link href="/blog/dasturlashni-noldan-organish-6-oylik-yol-xaritasi">6 oylik yo‘l xaritasida</Link> ko‘rishingiz mumkin.</p>
            <p><Link href="/">Darslinker</Link> — o‘quv markazlari uchun CRM va LMS platformasi. Uning <Link href="/marketplace">marketplace’ida</Link> esa O‘zbekistondagi kurslar, o‘quv markazlari va repetitorlarni topish mumkin. Ro‘yxatda qolgan uch yo‘nalish — SMM, dizayn va dasturlash bo‘yicha kurslarni shu yerda solishtirib, markazga to‘g‘ridan-to‘g‘ri so‘rov qoldirish mumkin.</p>
            <div className="!mt-5 flex flex-wrap gap-3">
              <Link href="/kurslar/smm" className="inline-flex items-center rounded-xl bg-[#16181a] px-5 py-3 text-[15px] font-semibold !text-white !no-underline">SMM kurslarini ko‘rish →</Link>
              <Link href="/kurslar/ui-ux" className="inline-flex items-center rounded-xl border-2 border-[#e5e8eb] px-5 py-3 text-[15px] font-semibold !text-[#16181a] !no-underline">UI/UX dizayn kurslari →</Link>
              <Link href="/kurslar/g/it" className="inline-flex items-center rounded-xl border-2 border-[#e5e8eb] px-5 py-3 text-[15px] font-semibold !text-[#16181a] !no-underline">IT va dasturlash kurslari →</Link>
            </div>
          </section>

          <section>
            <h2>Ko‘p so‘raladigan savollar</h2>
            <div className="space-y-6">{faqs.map(f => <div key={f.q}><h3 className="mb-2 text-lg font-semibold">{f.q}</h3><p>{f.a}</p></div>)}</div>
          </section>

          <section className="border-t border-[#e5e8eb] pt-6 text-sm text-[#59616c]">
            <h2>Manbalar va cheklovlar</h2>
            <p>Manbalar 2026-yil 10-oktabrda tekshirildi. Kasblar jadvali PF-50-son Farmonning 2-ilovasi asosida Darslinker tomonidan tuzilgan; soliq misoli — shartli hisob. Maqola umumiy ma’lumot beradi va soliq maslahati o‘rnini bosmaydi: aniq holatingiz bo‘yicha soliq organi yoki buxgalterdan javob oling.</p>
            <ul className="mt-3 list-disc pl-5">
              <li><a href={pf50}>Lex.uz — PF-50-son Farmon, 19.03.2025 (faoliyat turlari ro‘yxati)</a></li>
              <li><a href={orq1108}>Lex.uz — O‘RQ-1108-son Qonun, 25.12.2025 (Soliq kodeksiga o‘zgartirishlar)</a></li>
              <li><a href={pq247}>Lex.uz — PQ-247-son qaror, 12.08.2025</a></li>
              <li><a href={nizom}>Lex.uz — O‘zini o‘zi band qilgan shaxs sifatida faoliyatni amalga oshirish tartibi to‘g‘risidagi nizom</a></li>
              <li><a href={govGuide}>Gov.uz — ro‘yxatdan o‘tish bo‘yicha qo‘llanma</a></li>
              <li><a href={soliqNotice}>Soliq qo‘mitasi — eslatma, 19.12.2025</a></li>
              <li><a href={gazetaList}>Gazeta.uz — ro‘yxat qisqarishi, 27.03.2025</a></li>
              <li><a href={gazetaSocial}>Gazeta.uz — ijtimoiy soliq, 03.08.2026</a></li>
              <li><a href={spotDraft}>Spot.uz — majburiy ijtimoiy soliq loyihasi, 15.09.2026</a></li>
              <li><a href={spotQr}>Spot.uz — maxsus QR-kod, 19.01.2026</a></li>
              <li><a href={buxgalterPq49}>Buxgalter.uz — PQ-49-son qaror sharhi, 06.04.2026</a></li>
            </ul>
          </section>
        </div>
      </article>
    </main>
  );
}
