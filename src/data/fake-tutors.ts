// Demo repetitorlar — haqiqiy repetitor turi DB'ga ulanmaguncha ko'rsatish uchun.
// Slider (repetitorlar bosh bo'limi) va /repetitorlar/barcha sahifasi shu ro'yxatdan foydalanadi.

export type FakeTutor = {
  // Real DB'dan kelgan repetitor uchun slug bor — public sahifa link'i ishlaydi
  // Fake'lar uchun null/undefined — slider /repetitorlar/barcha ga olib boradi
  slug?: string;
  name: string;
  subject: string;       // ko'rsatiladigan fan nomi
  subjectKey: string;    // filtr uchun barqaror kalit
  rating: number;
  reviews: number;
  online: boolean;       // true → Onlayn, false → Oflayn (region shaharda)
  region: string;        // "Onlayn" yoki shahar nomi
  experience: number;    // yil
  price: number;         // so'm/soat
  gradient: string;      // avatar gradient
};

const G = {
  violet: "linear-gradient(135deg,#7a3d8a,#3a1e4f)",
  fuchsia: "linear-gradient(135deg,#d946ef,#7a3d8a)",
  purple: "linear-gradient(135deg,#6d28d9,#3a1e4f)",
  magenta: "linear-gradient(135deg,#a21caf,#581c87)",
  grape: "linear-gradient(135deg,#9333ea,#4a1d96)",
  orchid: "linear-gradient(135deg,#c026d3,#701a75)",
  indigo: "linear-gradient(135deg,#7c3aed,#2e1065)",
  rose: "linear-gradient(135deg,#be185d,#831843)",
  lavender: "linear-gradient(135deg,#8b5cf6,#3a1e4f)",
  pink: "linear-gradient(135deg,#db2777,#7a3d8a)",
};

export const FAKE_TUTORS: FakeTutor[] = [
  { name: "Dilshod Karimov", subject: "Matematika", subjectKey: "matematika", rating: 4.9, reviews: 124, online: true, region: "Onlayn", experience: 8, price: 50000, gradient: G.violet },
  { name: "Nigora Aliyeva", subject: "Ingliz tili · IELTS", subjectKey: "ingliz-tili", rating: 5.0, reviews: 98, online: true, region: "Onlayn", experience: 6, price: 70000, gradient: G.fuchsia },
  { name: "Sardor To'xtayev", subject: "Fizika", subjectKey: "fizika", rating: 4.8, reviews: 76, online: false, region: "Toshkent", experience: 10, price: 60000, gradient: G.purple },
  { name: "Kamola Yusupova", subject: "Kimyo", subjectKey: "kimyo", rating: 4.9, reviews: 112, online: true, region: "Onlayn", experience: 7, price: 55000, gradient: G.magenta },
  { name: "Jasur Rahimov", subject: "Biologiya", subjectKey: "biologiya", rating: 4.7, reviews: 54, online: false, region: "Samarqand", experience: 5, price: 45000, gradient: G.grape },
  { name: "Malika Sobirova", subject: "Ona tili va adabiyot", subjectKey: "ona-tili", rating: 4.9, reviews: 87, online: true, region: "Onlayn", experience: 9, price: 40000, gradient: G.orchid },
  { name: "Bekzod Ergashev", subject: "Informatika · dasturlash", subjectKey: "informatika", rating: 5.0, reviews: 143, online: true, region: "Onlayn", experience: 6, price: 80000, gradient: G.indigo },
  { name: "Sevara Qodirova", subject: "Rus tili", subjectKey: "rus-tili", rating: 4.8, reviews: 65, online: false, region: "Toshkent", experience: 8, price: 50000, gradient: G.rose },
  { name: "Otabek Nazarov", subject: "Tarix", subjectKey: "tarix", rating: 4.6, reviews: 41, online: true, region: "Onlayn", experience: 4, price: 35000, gradient: G.lavender },
  { name: "Gulnoza Hamidova", subject: "Ingliz tili · boshlang'ich", subjectKey: "ingliz-tili", rating: 4.9, reviews: 102, online: false, region: "Andijon", experience: 7, price: 45000, gradient: G.pink },
  { name: "Aziz Sultonov", subject: "Matematika · DTM", subjectKey: "matematika", rating: 4.8, reviews: 89, online: false, region: "Farg'ona", experience: 9, price: 55000, gradient: G.purple },
  { name: "Dilnoza Tursunova", subject: "Kimyo · DTM", subjectKey: "kimyo", rating: 4.7, reviews: 58, online: true, region: "Onlayn", experience: 5, price: 50000, gradient: G.fuchsia },
  { name: "Shoxrux Abdullayev", subject: "Fizika · olimpiada", subjectKey: "fizika", rating: 5.0, reviews: 134, online: true, region: "Onlayn", experience: 11, price: 90000, gradient: G.indigo },
  { name: "Madina Yo'ldosheva", subject: "Ingliz tili · CEFR", subjectKey: "ingliz-tili", rating: 4.9, reviews: 121, online: false, region: "Buxoro", experience: 7, price: 60000, gradient: G.orchid },
  { name: "Jamshid Qosimov", subject: "Informatika · Python", subjectKey: "informatika", rating: 4.8, reviews: 72, online: true, region: "Onlayn", experience: 5, price: 75000, gradient: G.lavender },
  { name: "Zarina Islomova", subject: "Biologiya · DTM", subjectKey: "biologiya", rating: 4.9, reviews: 95, online: false, region: "Namangan", experience: 8, price: 50000, gradient: G.magenta },
  { name: "Ulug'bek Mirzayev", subject: "Matematika · maktab", subjectKey: "matematika", rating: 4.6, reviews: 38, online: true, region: "Onlayn", experience: 4, price: 40000, gradient: G.grape },
  { name: "Feruza Ahmedova", subject: "Rus tili · suhbat", subjectKey: "rus-tili", rating: 4.8, reviews: 63, online: true, region: "Onlayn", experience: 6, price: 45000, gradient: G.rose },
  { name: "Doniyor Saidov", subject: "Tarix · DTM", subjectKey: "tarix", rating: 4.7, reviews: 49, online: false, region: "Toshkent", experience: 6, price: 45000, gradient: G.violet },
  { name: "Nodira Karimova", subject: "Geografiya", subjectKey: "geografiya", rating: 4.8, reviews: 57, online: true, region: "Onlayn", experience: 7, price: 40000, gradient: G.pink },
  { name: "Rustam Yoqubov", subject: "Ingliz tili · IELTS", subjectKey: "ingliz-tili", rating: 5.0, reviews: 156, online: true, region: "Onlayn", experience: 9, price: 85000, gradient: G.fuchsia },
  { name: "Sitora Bekmurodova", subject: "Ona tili · insho", subjectKey: "ona-tili", rating: 4.9, reviews: 78, online: false, region: "Samarqand", experience: 8, price: 45000, gradient: G.orchid },
  { name: "Akmal Jo'rayev", subject: "Kimyo · olimpiada", subjectKey: "kimyo", rating: 4.8, reviews: 66, online: true, region: "Onlayn", experience: 7, price: 65000, gradient: G.purple },
  { name: "Lola Mahmudova", subject: "Matematika · boshlang'ich", subjectKey: "matematika", rating: 4.9, reviews: 110, online: false, region: "Andijon", experience: 10, price: 45000, gradient: G.lavender },
];

export function tutorInitials(name: string) {
  return name.split(" ").map((p) => p.charAt(0)).slice(0, 2).join("").toUpperCase();
}
