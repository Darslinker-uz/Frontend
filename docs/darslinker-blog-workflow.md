# Darslinker blog yozish mezonlari

Foydalanuvchi talablari asosida saqlandi: 2026-09-17.
Blog yozish, mavzu tanlash va kontent rejalashda ushbu hujjatni o‘qing.

## Maqsad

- O‘zbekiston auditoriyasining ta’limga oid real savoliga foydali javob berish.
- Darslinker.uz ni kurslar, o‘quv markazlari va repetitorlarni topishga yordam
  beradigan ta’lim platformasi sifatida aniq tanishtirish.
- Tegishli asosiy va kategoriya sahifalarini mazmunli ichki havolalar bilan qo‘llash.
- SEO, AEO va GEO: qidiruv hamda AI javoblarida foydalanishga yaroqli, aniq,
  tekshiriladigan mazmun yaratish. Reyting yoki AI tavsiyasini kafolatlamaslik.

## Yozishdan oldin — dublikat va search intent

1. `src/data/static-blog-posts.ts`, `src/app/blog/**`, mavjud qoralamalar va
   kontent rejalarini ko‘ring. Live `/blog`, sitemap va imkon bo‘lsa ruxsat etilgan
   read-only manba orqali DB maqolalarini ham tekshiring. DB yoki qoralamalarga
   kirish bo‘lmasa tekshiruv cheklovini ayting; to‘liq tekshirdim demang.
2. Faqat sarlavha yoki slug emas, asosiy so‘rov, o‘quvchi maqsadi, javob,
   bo‘limlar va maqsadli katalog bo‘yicha solishtiring. Boshqa nomdagi bir xil
   maqola ham dublikat. Bir xil intentni qoplaydigan maqola bo‘lsa, yangilashni
   yoki aniq farqli savolni taklif qiling; so‘zlarini almashtirib qayta yozmang.
3. Brief tuzing: kim uchun, asosiy so‘rov, search intent, o‘quvchi oladigan javob,
   mavjud maqolalardan farqi, yordamchi savollar, maqsadli ichki havolalar.
4. Joriy qidiruv natijalarini ko‘rib, intentni tekshiring. Qidiruv hajmi va
   raqobat haqida vositasiz raqam yoki ishonchli reyting uydirmang.
5. Umumiy motivatsion matndan ko‘ra aniq qarorga yordam beradigan mavzuni
   afzal ko‘ring: narx, format, yo‘nalish, tayyorgarlik, taqqoslash, hudud.

## Tabiiy o‘zbekcha uslub

Foydalanuvchi matn AI tomonidan yozilgandek tuyulmasligini xohlaydi.
Matnni mahalliy muharrir yozgandek tabiiy, ravon va aniq tahrir qiling.

- Sun’iy kirishlar ("Bugungi tez rivojlanayotgan dunyoda"), keraksiz xulosalar,
  bir xil paragraf ritmi, ortiqcha sarlavha va kalit so‘z takrorlarini olib tashlang.
- Har paragraf yangi foyda bersin. Majburiy so‘z soni yoki keyword density yo‘q.
- O‘zbek lotini va o‘/g‘ imlosini tekshiring; tarjimaga o‘xshagan gaplarni qayta yozing.
- Mahalliy misollar: so‘mdagi xarajat, dars tili, filial, qatnov, ish/o‘qish jadvali.
- Uydirma shaxsiy tajriba, intervyu, sharh, muallif malakasi yoki "biz sinadik"
  kabi yolg‘on da’volar bo‘lmasin. AI detektoridan o‘tishni kafolatlamang.

## Dalil va manbalar

- Har mavzuni bugungi sharoitda tekshiring: 5 yil oldingi maslahatni avtomatik
  takrorlamang. Yangi texnologiya, AI vositalari, o‘qish usullari, bozor talabi va
  xizmatlar nimani o‘zgartirganini mavzuga mos ravishda tushuntiring. Bu barcha
  keyingi bloglarga tegishli foydalanuvchi talabi (2026-09-17).
- Yangi vosita mavjudligi natija tezlashgani isboti emas. O‘rganish muddati yoki
  samaradorlik bo‘yicha sababiy da’vo va raqamlar uchun dalil talab qiling;
  o‘zgarmagan asosiy omillarni ham ko‘rsating. Faqat sarlavhaga yil qo‘shish yetmaydi.

- Narx, statistika, qonun, imtihon talabi va platforma imkoniyatini tekshiring.
- Birlamchi manba va tekshiruv sanasini ko‘rsating; narxning oy/kurs/dars birligi,
  filial va formatini ajrating. Eskirgan maqoladagi raqamni dalilsiz ko‘chirmang.
- Shartli hisobni aniq "shartli misol" deb belgilang.
- Manbasiz "eng yaxshi", kafolatlangan natija, ish yoki sertifikat va’dasi yo‘q.
- Qarama-qarshi ma’lumotlar va noma’lum jihatlarni yashirmang.

## SEO / AEO / GEO tuzilmasi

- Sarlavha va boshlang‘ich qisqa javob asosiy intentga bevosita javob bersin.
- Zarur joylarda aniq ta’rif, mazmunli H2/H3, taqqoslash jadvali, amaliy qadamlar
  va haqiqiy qo‘shimcha savollarga qisqa javoblar bering. Har maqolaga majburan
  bir xil FAQ yoki jadval qo‘shmang.
- Darslinker ta’rifi va CTA tabiiy joyda bo‘lsin; foydani reklama bilan bosmang.
- Tegishli kurs/kategoriya, `/oquv-markazlar`, `/repetitorlar` va boshqa maqolalarga
  tavsifli anchor bilan havola bering; URL va sahifa mavjudligini tekshiring.
- Nashr bosqichida noyob title/description, canonical, serverda o‘qiladigan matn,
  mos Article/BlogPosting va breadcrumb, haqiqiy muallif/nashr/yangilanish sanalari,
  blog indeksi va sitemapni tekshiring. Structured data ko‘rinadigan matnga mos bo‘lsin.
- FAQ schema, llms.txt yoki boshqa format AI tavsiyasida chiqishni kafolatlamaydi.
- Natijani Search Console so‘rovlari, organik kirish, katalogga o‘tish va mavjud
  bo‘lsa AI referral/iqtiboslari bilan baholang. Bot tashrifi tavsiya dalili emas.

## Yakuniy tekshiruv va ish chegarasi

Intentga javob, originallik, faktlar, tabiiy til, havolalar, takrorlar va platforma
ta’rifini tekshiring. Blog yozishning o‘zi productionga nashr qilish ruxsati emas.
Kod, DB va public sahifa o‘zgarishlarida AGENTS.md talablariga amal qiling.
Muqova so‘ralsa `docs/darslinker-design-workflow.md` ni ham o‘qing.

## Suhbatdagi qoralama holati

2026-09-17: foydalanuvchi "Ingliz tilini 0 dan o‘rganish qancha vaqt oladi?"
mavzusini tanladi. Avval 4 alohida rasm konsepti, foydalanuvchi tanlagandan keyin
blog/Google Discover muqovasi va Telegram 1080x1080, Instagram 1080x1350 variantlari
tayyorlanadi. Blog muqovasi blogga joylanadi; ijtimoiy tarmoq fayllari loyiha
ildizidagi `SMM photo/` papkasiga mavzu va format nomi bilan saqlanadi.
2026-09-17 holati: maqola lokal kodga qo‘shildi:
`/blog/ingliz-tilini-noldan-organish-qancha-vaqt-oladi`.
Tanlangan metr muqovasi maqola, Open Graph va BlogPosting image maydoniga ulandi.
Telegram va Instagram rasmlari `SMM photo/` ichida. Production deploy bajarilmagan.

2026-09-17: "O‘quv markazi yoki repetitor: qaysi biri sizga mos?" suhbatda
qoralama sifatida yozildi, saytga nashr qilinmadi. Uni yangi g‘oya deb qayta
taklif qilishdan oldin holatini tekshiring. Bu qayd to‘liq maqolalar ro‘yxati emas;
har safar joriy inventarni qayta tekshirish shart.
