# Darslinker blog rejasi (CRM/LMS davri)

Sana: 2026-11-06 · Holat: qoralama, egasi tasdiqlashi kerak.
Bu reja eski blog rejalarining (online-video kalendari, katalog davridagi B2C mavzular) o'rnini bosadi.

## Nega qayta yozildi

darslinker.uz endi o'quv markazlari uchun CRM va LMS sayti. Blogning vazifasi ham o'zgardi:
markaz egasi Google yoki AI'ga o'z muammosini yozganda (qarzdorlik, o'quvchi ketishi, ota-ona bilan aloqa)
foydali javob berish va shu orqali Darslinker CRM'ga olib kelish.

## Asosiy qoidalar

- **Auditoriya:** o'quv markazlari egalari, administratorlar, repetitorlar. Yangi o'quvchilar (B2C) uchun maqola yozilmaydi.
- **Search intent (egasi, 2026-11-06):** har maqola sotuvchi intentda. Markaz egasining qaror yoki muammo so'roviga
  javob beradi va mos Darslinker imkoniyatini ko'rsatib, CTA bilan tugaydi. Asosiy so'rovi 27 ta CRM sahifasi
  (`/features/*`, `/for/*`, `/pricing`, `/crm-comparison`) bilan bir xil bo'lmaydi: blog boshqa burchakdan kiradi
  (solishtirish, xarajat, muammo sababi) va o'sha sahifaga yo'naltiradi.
- **CTA:** maqola mavzusiga mos imkoniyat sahifasi (masalan qarzdorlik → `/features/payments`) va ariza
  (`CrmApplyButton`, "14 kun bepul sinov"). `/hamkorlik` faqat marketplace haqidagi gapda.
- **Ohang:** foydali maslahat birinchi; Darslinker maqola oxiriga yaqin alohida qisqa bo'limda, tabiiy, yumshoq.
- **Faktlar:** Darslinker haqida faqat saytda e'lon qilingan imkoniyatlar (`docs/PRODUCT.md` "Hozir bor").
  Rejadagi funksiyalar (uy vazifasi, o'qituvchi oyligi, AI quiz, Click/Payme) bor deb yozilmaydi.
  Huquqiy va soliq mavzularida faqat rasmiy manba, tekshiruv sanasi bilan.
- **Jarayon:** `docs/darslinker-blog-workflow.md` (dublikat va intent tekshiruvi, tabiiy uslub, manbalar) o'z kuchida.
  Har mavzu yozishdan oldin joriy qidiruv natijalari ko'riladi; qidiruv hajmi uydirilmaydi.
- **Uslub:** uzun tire ("—") matnda yo'q, majburiy kalit so'zlar yo'q, bir xil jumlalar takrorlanmaydi.

## Yozish mezonlari (egasi tasdiqlagan, 2026-11-06)

Tartib: to'siqlar → yozish → baholash. Har bir to'siq o'tishi shart; baholash 120 balldan kamida 108,
har mezon kamida 7. O'tsa, push va deploy qilinadi (egasining doimiy ruxsati). "Kalit so'z zichligi" mezoni olib tashlangan:
matn tabiiy bo'lishi muhimroq.

### A. To'siqlar (o'tmasa, maqola chiqmaydi)

| # | Mezon | Talab |
|---|---|---|
| G1 | Yangi ma'lumot | Yozishdan oldin oxirgi 12 oy bo'yicha web qidiruv |
| G2 | Faktlar | Har raqam, nom, narx, qonun haqiqiy manba bilan tekshirilgan |
| G3 | Uydirma yo'q | Bitta to'qilgan raqam butun maqolani to'xtatadi |
| G4 | Darslinker haqida faqat haqiqat | Faqat saytda e'lon qilingan imkoniyatlar (`PRODUCT.md` "Hozir bor") |
| G5 | Dublikat yo'q | `/features/*`, `/for/*`, `/pricing`, `/crm-comparison` va mavjud maqolalar bilan bir xil savolga javob bermaydi |
| G6 | O'ziga xos yadro | O'z modeli, o'z tahlili yoki qo'lda yig'ilgan bozor ma'lumoti |
| G7 | Shablon yo'q | "Bugungi kunda", "xulosa qilib aytganda", "muhim ahamiyatga ega" kabi iboralar, bir xil uzunlikdagi ro'yxat, umumiy maslahat yo'q |
| G8 | O'zbekiston bozori | Kamida 5 ta mahalliy aniq ma'lumot (so'm, Telegram, mahalliy qonun va sharoit) |
| G9 | To'g'ri CTA | Mavzuga mos imkoniyat sahifasi va CRM arizasi |
| G10 | **Inson uslubi** | Pastdagi "AI uslubiga qarshi qoidalar", raqamli chegaralar bilan |

### AI uslubiga qarshi qoidalar (G10)

Maqola odam yozgandek o'qilishi kerak. SEO va GEO tinish belgilaridan emas, tuzilmadan keladi:
savol shaklidagi sarlavha, uning ostidagi birinchi gapda to'g'ridan-to'g'ri javob, jadval, aniq raqam.

Tinish belgilari (matn tanasida, jadval va sarlavhalardan tashqari):

| Belgi | Chegara |
|---|---|
| Uzun tire `—` va `–` | 0. Vaqt va oraliqlar ham so'z bilan: "10:00 dan 20:00 gacha", "3 oydan 6 oygacha" |
| Nuqtali vergul `;` | 0 |
| Ikki nuqta `:` | Faqat vaqt, ro'yxat yoki jadvaldan oldin. Gap ichida ikki qismni bog'lash uchun ishlatilmaydi ("Natija: ..." emas). Taxminan 200 so'zga 1 tadan oshmaydi |
| Qavs | Faqat qisqa izoh, 200 so'zga 1 tadan oshmaydi |
| Qalin yozuv | Paragraf boshida "**Muhim:**" kabi yorliq yo'q. Faqat haqiqatan muhim bir-ikki so'z |
| Emoji | Yo'q |

Gap va paragraf:

- Gaplar uzunligi aralash: qisqa va uzun gaplar navbatlashadi. Hamma paragraf bir xil uzunlikda bo'lmaydi.
- Uchtalik sanoqlar ("tez, oson va qulay") qolipga aylanmaydi.
- "Nafaqat ..., balki ...", "Keling, ko'rib chiqamiz", "Shunday qilib", "Shuni ta'kidlash joizki" kabi qoliplar yo'q.
- Oxirida yuqoridagini qayta takrorlaydigan "xulosa" bo'limi yo'q. Maqola amaliy keyingi qadam bilan tugaydi.
- Har bo'limda kamida bitta aniq misol: so'mdagi summa, markaz hayotidan vaziyat, raqam.
- "Biz sinab ko'rdik", "mijozlarimiz aytadi" kabi tasdiqlanmagan tajriba yozilmaydi.
- Ro'yxat faqat haqiqatan ro'yxat bo'lgan joyda. Fikr oddiy paragraf bilan aytiladi.

Nashrdan oldin avtomatik tekshiruv: matn tanasida `—`, `–`, `;` soni 0 bo'lishi, `:` va qavslar
chegaradan oshmasligi hisoblab ko'riladi va natija baholash hisobotida ko'rsatiladi.

### B. Baholash (12 × 10 = 120, kamida 108, har biri kamida 7)

1. Qisqa javob birinchi 100 so'zda.
2. Manbasi ko'rsatilgan kamida 3 ta aniq raqam.
3. H2'larning 60% dan ko'pi savol.
4. Kamida 2 ta ishonchli tashqi havola (lex.uz, soliq.uz, rasmiy saytlar).
5. Kamida bitta jadval, qadamlar yoki ro'yxat.
6. Kamida 3 ta ichki havola (imkoniyat sahifalari, boshqa maqolalar).
7. "Yangilangan" sanasi ko'rinib turadi.
8. Top-3 maqolaning bo'shliqlari yopilgan, tuzilma ulardan boshqacha.
9. Yangi burchak, qayta yozilgan nusxa emas.
10. Article, FAQ va Breadcrumb schema xatosiz.
11. CTA aniq imkoniyat sahifasiga.
12. CTA tabiiy, reklama bo'lagi emas.

## Mavzular

Ro'yxat bitta joyda: `src/data/blog-plan.ts` (31 ta mavzu, 6 guruh). Asosiy ikki guruh sotuvchi:
"CRM tanlash" (xaridga eng yaqin so'rovlar) va "Imkoniyat bo'yicha" (har imkoniyatga bitta maqola:
bitta aniq muammo, yechim sifatida Darslinker, CTA o'sha imkoniyat sahifasiga). Qolganlari: solishtirish,
muammo va yechim, markaz turlari, markaz ochish va o'sish. Har mavzuda slug, sarlavha, CTA sahifalari va eslatma bor.
Admin panelda ko'rinadi: `/admode/blog`. Maqola saytga qo'shilsa (`src/data/static-blog-posts.ts`),
mavzu u yerda avtomatik "Done" bo'ladi. Maqola matni egasi bilan birga, yuqoridagi mezonlar asosida yoziladi.

## Mavjud maqolalar bilan nima qilinadi

- **O'quvchilar uchun 16 ta maqola:** saytda qoladi (trafik va havolalar yo'qolmasin), yangilari yozilmaydi.
  CTA'lari katalogga (`/kurslar`, `/marketplace`) qoladi.
- **"Nega o'quv markazlar Darslinker'ni tanlaydi?"**, katalog davri da'volari bor. CRM davriga qayta yozish
  yoki birlashtirish kerak; egasi bilan hal qilinadi.
- **"Yangi o'quvchi topish"**, CRM davriga yangilanadi (CTA `/hamkorlik` o'rniga CRM, marketplace qo'shimcha sifatida).

## Ochiq savollar (egasi uchun)

- Yozish navbati: `blog-plan.ts` dagi tartib bo'yicha yoki egasi tanlaydi.
- Haftasiga nechta maqola?
- Muqova va ijtimoiy tarmoq rasmlari har maqolaga kerakmi (`docs/darslinker-design-workflow.md`)?
