# Go Darslinker! — arxitektura rejasi

> Holat: **loyihalash bosqichi**. Bu hujjat kod emas — login'dan ball/reyting tizimigacha
> bo'lgan arxitektura qarorlarini qayd etadi. UI implementatsiyasi alohida (Codex)
> tomonidan olib borilmoqda; bu yerda faqat backend/data-model/flow arxitekturasi bor.

## 1. Kontekst

**Go Darslinker!** — go.darslinker.uz subdomenida ishlaydigan, bepul, interaktiv,
o'yinlashtirilgan til o'rganish platformasi. Telegram Mini App sifatida ishlaydi.
Maqsad: Darslinker Telegram kanaliga auditoriya yig'ish (kanalga obuna bo'lmasdan
darslarga kirish yo'q) va bu auditoriyani kelajakdagi onlayn video kurslar
platformasiga (darslinker.uz'ning video-kurslar tomon o'tishi) tayyor auditoriya
sifatida ishlatish.

**Infratuzilma:** mavjud darslinker.uz bilan bir xil server/hosting, lekin **alohida
Postgres baza**. Alohida yangi loyiha (repo) sifatida quriladi, monorepo ichiga
kiritilmaydi. (Amalga oshirilgan holat — 13-bo'limga qarang.)

**Bot:** `@darslinkerbot`ni repurpose qilish rejasi bekor qilindi — o'rniga **butunlay
yangi, mustaqil bot** ishlatiladi: `t.me/godarslinkerbot`. Eski bot (marketplace/kurs
maslahatchisi) o'zgarishsiz qoladi.

**MVP doirasi:** faqat Ingliz tili, faqat Boshlang'ich daraja. Referral (do'stga
yuborish) mexanikasi, boshqa tillar, audio/yozib-javob mashqlari va spaced-repetition
eslatmalari — barchasi keyingi bosqichga qoldirilgan (7-bo'limga qarang).

## 2. Autentifikatsiya

Alohida parol/ro'yxatdan o'tish shakli yo'q. Platformaga oddiy brauzer orqali
kirgan anonim foydalanuvchi har bir modulning **birinchi darsini autentifikatsiyasiz
ochib ko'rishi mumkin**. Ikkinchi va undan keyingi darslarni ochish uchun Telegram
orqali kirish talab qilinadi.

Foydalanuvchi Telegram bot orqali Mini App'ni ochganda, Telegram `initData`
(foydalanuvchi id, ism, username, photo, HMAC imzo) beradi. Frontend Telegram Mini
App muhitini avtomatik aniqlaydi va `initData` mavjud bo'lsa, alohida login tugmasini
bosdirish o'rniga autentifikatsiya jarayonini avtomatik boshlaydi.

- Backend `initData`'ni bot tokeni bilan HMAC orqali tasdiqlaydi (Telegram'ning rasmiy
  validatsiya algoritmi).
- Tasdiqlangach, `telegramId` bo'yicha `User` topiladi yoki yaratiladi.
- Sessiya uchun qisqa muddatli token (masalan JWT, mini-app frontend'ga qaytariladi va
  keyingi API so'rovlarida ishlatiladi) beriladi.

## 3. Kanalga obuna — kirish sharti

Darslarga to'liq kirish sharti: Telegram orqali autentifikatsiya va Darslinker
Telegram kanaliga obuna bo'lish (referral hozircha shart emas — 7-bo'limga qarang).

**Ochiq demo istisnosi:** har bir modulning birinchi darsi barcha foydalanuvchilar
uchun ochiq. Uni ko'rish uchun Telegram orqali kirish ham, kanalga obuna bo'lish ham
shart emas. Ikkinchi va undan keyingi darslarda foydalanuvchi avval Telegram orqali
kirishi, so'ng kanalga obuna bo'lishi majburiy.

- Bot Darslinker kanalida **admin** bo'lishi kerak (`getChatMember` chaqirish uchun).
- Birinchi kirishda backend `getChatMember(channelId, userId)` orqali tekshiradi,
  natijani `User.channelSubscribed` + `User.channelCheckedAt` sifatida saqlaydi.
- **Muhim qoida (foydalanuvchi talabi):** obuna bo'lgach, keyingi har safar qayta
  so'ralmaydi — cache'langan holatga ishoniladi.
- Holatni yangilab turish uchun bot `chat_member` update'larini qabul qiladigan qilib
  sozlanadi (webhook `allowed_updates` ichida `chat_member`). Foydalanuvchi kanaldan
  chiqsa, Telegram shu update'ni yuboradi → `channelSubscribed = false` qilinadi.
  Shu orqali doimiy qayta-tekshirish (polling) shart emas.
- Agar `channelSubscribed = false` bo'lsa — ochiq birinchi darsdan tashqari qolgan
  darslar yopiq. Ularda "Kanalga obuna bo'ling" ekrani + "Tekshirish" tugmasi
  ko'rsatiladi (bosilganda jonli tekshiruv qayta ishga tushadi).

## 4. Ma'lumotlar modeli

```
Language        { id, code, name, flagEmoji, isActive, order }
Level           { id, languageId, name, order }              // MVP: faqat "Boshlang'ich"
Module          { id, levelId, title, icon, order }
Lesson          { id, moduleId, title, type: vocabulary|quiz|sentence_practice, order }
Question        { id, lessonId, type, prompt, payload(json), order }

User            { id, telegramId, username, firstName, photoUrl,
                  channelSubscribed, channelCheckedAt,
                  totalBall, currentStreak, longestStreak, lastActiveDate, createdAt }

UserLessonProgress { id, userId, lessonId, status: locked|unlocked|completed,
                      completedAt, ballEarned }

BallEvent       { id, userId, amount, source, lessonId?, languageId?, createdAt }
```

`BallEvent` — ballning o'zgarmas jurnali (ledger). `User.totalBall` bu jurnaldan
hisoblangan/keshlangan qiymat. Sabab: faqat bitta sonni to'g'ridan-to'g'ri o'zgartirib
qo'ymaslik — kelajakda "nega ball shuncha" deb tekshirish, xato tuzatish yoki
statistikalarni (kunlik/haftalik/tilga bo'lingan) chiqarish uchun jurnal kerak bo'ladi.

## 5. Til → Daraja → Mavzu → 3 ta o'rganish yo'nalishi (2026-08-31 yangilandi)

Avvalgi "standard/review dars" farqi bekor qilindi — endi har bir mavzu doim quyidagi
**3 ta qat'iy yo'nalishdan** iborat (bu `Lesson.type` qiymatlari):

1. **So'zlar** (`vocabulary`) — so'z ro'yxati: so'z + tarjima + audio talaffuz (brauzer
   TTS — 6-bo'limga qarang). Test emas, sof reference/flashcard ko'rinishida.
   "Ko'rib chiqdim" belgisi bilan yakunlanadi, savol-javob ball tizimi qo'llanmaydi
   (faqat kichik flat bonus, aniq miqdori keyinroq).
2. **Mavzu testi** (`quiz`) — o'sha mavzudagi barcha so'zlarni qamrab oluvchi test
   (6-bo'limdagi mashq turlari: 4-variantli, moslashtirish va h.k.). Har to'g'ri
   javob uchun +10 ball (7-bo'limga qarang).
3. **Gap ichida qo'llanilishi** (`sentence_practice`) — so'zlar jumla ichida qanday
   ishlatilishini ko'rsatuvchi va mashq qildiruvchi bo'lim (jumla tuzish turidagi
   mashqlar). Har to'g'ri javob uchun +10 ball.

- **Mavzu ichida** uchala yo'nalish bir vaqtning o'zida ochiq — foydalanuvchi
  xohlagan tartibda o'tishi mumkin. Faqat birinchi mavzuning `vocabulary` yo'nalishi
  anonim demo sifatida ochiq; qolgan hammasi (shu mavzuning quiz/sentence_practice'i
  ham, keyingi mavzular ham) Telegram autentifikatsiyasi + kanal obunasidan keyin.
- **Mavzu "to'liq tugadi"** = uchala yo'nalish ham tugatilgani. Shundan keyin
  **keyingi mavzu** ochiladi (ketma-ket, mavzular darajaning o'zida tartib bilan).
- **Daraja** — bir nechta daraja rejalashtirilgan (masalan Elementary →
  Pre-Intermediate → ...), arxitektura buni hisobga oladi (`Level` jadvali
  ko'p qatorli bo'lishi mumkin), lekin **kontent bosqichma-bosqich yoziladi** —
  hozircha faqat birinchi daraja (~10 mavzu) to'ldiriladi, keyingi daraja mavzulari
  keyinroq qo'shiladi. Daraja darajasida ham ketma-ket ochilish bor (avvalgi
  modul-ketma-ketlik qoidasiga o'xshab).
- Takrorlash/eslatma tizimi (spaced repetition) — **keyingi bosqichga qoldirildi**,
  MVP'da yo'q.

## 5a. Daraja aniqlash testi (`/test/[til]`)

- **Mustaqil bo'lim**, Kurslar (`/kurslar/[til]`) progressiga hech qanday ta'sir
  qilmaydi — faqat ma'lumot beradi ("Sizning darajangiz: Elementary"). Test
  natijasi Kurslar'dagi qulflarni ochmaydi (2026-08-31'da qat'iy kelishildi).
- **URL**: `/test/ingliz-tili`, `/test/rus-tili`, `/test/arab-tili`, `/test/koreys-tili`
  — mavjud `/kurslar/[til]` slug konventsiyasiga mos (bir xil o'zbekcha nom, SEO
  uchun barqaror).
- Ikki kirish nuqtasi: (1) mustaqil SEO sahifa sifatida ("darajangizni bilib oling"
  turidagi qidiruvlar uchun), (2) `/kurslar/[til]` sahifasi ichidan ham xuddi shu
  testga havola.
- Savollar — turli darajalardan aralashtirilgan qisqa test (taxminan 10-15 ta),
  natija bo'yicha daraja nomi ko'rsatiladi. Modul savollaridan mustaqil yoki
  ulardan tanlangan namuna bo'lishi mumkin — aniq mexanizm keyingi bosqichda
  loyihalanadi.
- **Navbar**da "Kurslar" bilan bir qatorda alohida ko'rinadi (masalan "Testlar").

## 6. Mashq turlari (MVP)

To'rt turdagi savol, `Question.type` orqali farqlanadi, `payload` maydoni turga qarab
boshqa shaklda bo'ladi:

1. **4 variantli tanlov** — matn savol, 4 variant, 1 to'g'ri.
2. **So'z–tarjima moslashtirish** — juftliklarni ulash (masalan 4 juft so'z/tarjima).
3. **Jumla tuzish** — so'z bo'laklarini to'g'ri tartibda joylashtirish.
4. **Rasm–so'z moslashtirish** — rasm ko'rsatiladi, mos so'z variantlardan tanlanadi.

**Audio talaffuz (2026-08-31 qaror):** `vocabulary` yo'nalishidagi har bir so'z uchun
brauzerning o'zidagi **Web Speech API** (`speechSynthesis`) ishlatiladi — haqiqiy
ovoz yozuvlari emas. Bepul, darhol ishlaydi, ovoz yozdirish/infratuzilma kerak emas.
Til kodlari: ingliz — `en-US`, rus — `ru-RU`, arab — `ar-SA`, koreys — `ko-KR`.
Kamchiligi: sifat inson ovozidan past va qurilma/brauzerga qarab farq qiladi —
lekin yuzlab so'z uchun amaliy yagona tez yechim.

Audio (tinglab topish) va erkin matn yozish turlari keyingi bosqichga qoldirildi —
ular tayyor audio kontent va orfografik xato kechirish logikasini talab qiladi.

## 7. Ball tizimi

- **Yurak/lives yo'q** — jarima mexanikasi umuman ishlatilmaydi.
- To'g'ri javob = **+10 ball**.
- Noto'g'ri javob = **0 ball**; to'g'ri javob ko'rsatiladi va foydalanuvchi keyingi
  savolga o'tadi (qayta urinish yo'q). *(Bu band aniq tasdiqlanmagan — standart qaror
  sifatida qabul qilindi, kerak bo'lsa o'zgartiramiz.)*
- Dars to'liq tugatilganda qo'shimcha bonus ball beriladi (aniq miqdor — masalan +20 —
  keyinroq sozlanadi, hozircha o'zgaruvchan qiymat sifatida qoldiriladi).
- Review darsi tugatilgani uchun alohida (kattaroq) bonus ball beriladi.
- Har bir ball hodisasi `BallEvent`'ga yoziladi (`source`: `question_correct` |
  `lesson_complete` | `module_review_complete`).

## 8. Streak va analitika

- Har kuni kamida 1 dars tugatilsa, `currentStreak` +1; kun o'tkazib yuborilsa 0'ga
  tushadi. `longestStreak` alohida saqlanadi.
- Profilda **analitika ekrani**: kalendar-issiqlik xaritasi (faol kunlar), joriy
  streak, eng uzun streak, haftalik ball grafigi.
- Jarima/maxsus bonus yo'q — hozircha faqat motivatsion ko'rsatkich.

## 9. Reyting (Leaderboard)

Uch xil reyting bo'ladi:

1. **Har bir til bo'yicha alohida reyting** (all-time) — shu tildagi `BallEvent`larning
   yig'indisi bo'yicha.
2. **Umumiy reyting** (all-time) — barcha tillar bo'yicha jami ball (`User.totalBall`).
3. **Haftalik faollar jadvali** — har dushanba kuni nolga tushadigan, shu hafta
   ichida to'plangan ball bo'yicha reyting (BallEvent'lardan joriy hafta oralig'ida
   agregatsiya qilinadi).

Har uchala reytingda bir xil ko'rinish qoidasi:

- **Top 3** maxsus (masalan pьedestal/medal) ko'rinishda ko'rsatiladi.
- **Top 25** ro'yxat sifatida chiqadi.
- Foydalanuvchi top 25'dan tashqarida bo'lsa, ro'yxat pastida **alohida, "yopishqoq"
  qator** sifatida uning haqiqiy o'rni doim ko'rsatiladi (masalan "Siz — 297-o'rin").

MVP'da hisoblash on-the-fly agregatsion so'rov orqali qilinadi (`BallEvent` ustida
`GROUP BY user, SUM(amount)`, davr filtri bilan). Foydalanuvchi soni ko'payib,
so'rovlar sekinlashsa, haftalik/umumiy reytingni davriy job orqali alohida jadvalga
(`LeaderboardSnapshot`) oldindan hisoblab qo'yish keyingi optimallashtirish bosqichi
bo'ladi.

*(Aniqlashtirish kerak bo'lgan bitta band: haftalik jadval — global (barcha tillar
aralash) hisoblanadimi, yoki u ham til bo'yicha alohida bo'lishi kerakmi? Hozircha
**global** deb qabul qildim — "faollar jadvali" so'zi shunga ishora qilyapti.)*

## 10. API kontrakti (Mini App frontend uchun)

Mini-app UI (Codex tomonidan quriladi) ushbu endpoint'lar bilan ishlaydi:

```
POST  /api/auth/telegram          initData tasdiqlash, User yaratish/topish, sessiya;
                                  Mini App ichida frontend tomonidan avtomatik chaqiriladi
GET   /api/me                     profil + statistika (ball, streak, obuna holati)
POST  /api/channel/check          jonli obuna tekshiruvi (foydalanuvchi "Tekshirish" bosganda)
GET   /api/languages              tillar ro'yxati (faol / tez-orada)
GET   /api/languages/:code/modules   modul+dars ro'yxati, joriy foydalanuvchi progressi bilan
GET   /api/lessons/:id            dars tafsiloti + savollar; modulning birinchi darsi
                                  anonim ochiq, qolganlari auth + obuna talab qiladi
POST  /api/lessons/:id/answer     bitta savolga javob, natija + berilgan ball qaytadi
POST  /api/lessons/:id/complete   darsni yakunlash, bonus ball, unlock mantiqi ishga tushadi
GET   /api/leaderboard/:langCode  til bo'yicha reyting (top25 + o'z o'rni)
GET   /api/leaderboard/global     umumiy reyting
GET   /api/leaderboard/weekly     haftalik faollar jadvali
GET   /api/stats/me               streak/analitika ma'lumotlari (heatmap, haftalik grafik)
GET   /api/test/:langCode         daraja aniqlash testi savollari (5a-bo'lim, auth talab qilmaydi)
POST  /api/test/:langCode/submit  test javoblari, natija (aniqlangan daraja) qaytaradi — progress'ga yozilmaydi
```

Bot tomoni (Telegram webhook, alohida): `/start` komandasi mini-app tugmasini ochadi;
`chat_member` update handler kanal-tark-etish holatini kuzatadi (3-bo'limga qarang).

## 11. MVP dan tashqarida (keyingi bosqichlar)

- Referral / do'stga yuborish mexanikasi (shart yoki bonus — hali qaror qilinmagan).
- Boshqa tillar (Rus, Arab, Koreys...) va qo'shimcha darajalar kontenti (birinchi
  daraja to'ldirilgach).
- **Eslatma:** TTS orqali so'z talaffuzi endi MVP ichida (5/6-bo'limga qarang) — bu
  yerda faqat "tinglab topish" (audio prompt + variant tanlash) savol turi va erkin
  matn yozish turi hali deferred.
- Spaced-repetition takrorlash tizimi/eslatmalari.
- Reyting hisoblashni `LeaderboardSnapshot` jadvaliga ko'chirish (agar kerak bo'lsa).
- Pullik o'yin darslari (uzoq muddatli, hozircha rejalashtirilmagan).

## 12. Ochiq savollar / tasdiqlash kerak bo'lgan taxminlar

- Noto'g'ri javobda qayta urinish yo'q, degan qoida — standart qaror, tasdiqlanmagan.
- Dars/review tugatish bonus ball miqdorlari — aniq raqamlar kelishilmagan.
- Haftalik faollar jadvali global (til bo'yicha emas) — taxmin sifatida qabul
  qilindi.

## 13. Infratuzilma — amalga oshirilgan holat (2026-08-30)

Quyidagilar allaqachon jonli (kod yo'q, faqat skeleton + login):

- **Repo:** https://github.com/Darslinker-uz/GoDarslinker (public — darslinker.uz'ning
  `Frontend` repo bilan bir xil konventsiya, serverdan token'siz `git pull` uchun).
  Lokal nusxa: `go-darslinker.uz/` (darslinker.uz'ning yonida, alohida papka).
- **Stack:** Next.js 16.2.3 + Prisma 6.19.3 (`@prisma/adapter-pg`, generatsiya
  `src/generated/prisma`ga — darslinker.uz bilan bir xil pattern), Tailwind 4.
- **DNS:** Cloudflare, `go` → `46.101.220.20`, DNS-only (proxysiz).
- **Server (bitta droplet, ikkinchi mustaqil loyiha sifatida):**
  - Nginx: `/etc/nginx/sites-available/go-darslinker`, port **3001**ga proksi
    (darslinker.uz'ning 3000-portidan mustaqil).
  - SSL: Let's Encrypt, `go.darslinker.uz` uchun alohida sertifikat.
  - Postgres: `go_darslinker_db` bazasi, `go_darslinker` useri — `darslinker_db`dan
    to'liq izolyatsiya qilingan (faqat shadow-db uchun CREATEDB huquqi berilgan).
  - PM2: `go-darslinker` nomli mustaqil process (`~/GoDarslinker`, serverda).
- **Qurilgan endpoint'lar:** `POST /api/auth/telegram` (Telegram initData HMAC
  tekshiruvi + `User` upsert + JWT sessiya), `GET /api/me`, `GET /api/health`.
- **Hali qilinmagan:** `TELEGRAM_BOT_TOKEN` bo'sh — foydalanuvchi BotFather orqali
  `@godarslinkerbot`ni yaratib, tokenni bergandan keyin to'ldiriladi. Shundan keyingina
  `/api/auth/telegram` haqiqiy Telegram Mini App bilan sinaladi. Kanalga obuna gate,
  ball/reyting endpoint'lari va bot webhook handler'i — hali yozilmagan (2-D bosqichdan
  keyingi navbat).
- **UI:** `src/app/page.tsx`da faqat vaqtinchalik placeholder bor ("Backend tayyor,
  dizayn hali qurilmoqda") — Codex bu papkani to'liq real dizaynga almashtiradi.
