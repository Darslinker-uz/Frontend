export interface Course {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  groupName?: string;
  groupSlug?: string;
  format: "Online" | "Offline" | "Video" | "Bootcamp";
  provider: string;
  location: string;
  region?: string | null;
  district?: string | null;
  price: string;
  priceFree: boolean;
  rating: string;
  duration: string;
  description: string;
  lessons?: string[];
  gradient: string;
  iconPath: string;
  imageUrl?: string | null;
  imagePosX?: number;
  imagePosY?: number;
  imageAPosX?: number;
  imageAPosY?: number;
  imageAMPosX?: number;
  imageAMPosY?: number;
  imageCPosX?: number;
  imageCPosY?: number;
  imageCMPosX?: number;
  imageCMPosY?: number;
  imageZoom?: number;
  imageAZoom?: number;
  imageAMZoom?: number;
  imageCZoom?: number;
  imageCMZoom?: number;
  language?: string;
  level?: string;
  studentLimit?: number;
  schedule?: string;
  certificate?: boolean;
  demoLesson?: boolean;
  discount?: string;
  teacherName?: string;
  teacherExperience?: string;
  paymentType?: string;
  phone?: string;
  ratingAvg?: number;
  ratingCount?: number;
}

// Reyting kamida shu sondan boshlab umumiy ko'rinadi.
// Pastida — yashirin: spamga moyil, statistik ahamiyatsiz.
export const MIN_RATINGS_TO_SHOW = 50;

// ============ RANGLAR VA IKONLAR TANLOVI ============

export const GRADIENT_OPTIONS = [
  { id: "blue", label: "Ko'k", value: "from-[#4a7ab5] via-[#7ea2d4] to-[#a3c4e8]" },
  { id: "purple", label: "Binafsha", value: "from-[#6b5b95] via-[#8b7bb5] to-[#b0a3d4]" },
  { id: "green", label: "Yashil", value: "from-[#2d6a5a] via-[#4a9e8a] to-[#7ec4b8]" },
  { id: "orange", label: "To'q sariq", value: "from-[#a35b2d] via-[#c47e4a] to-[#d4a07e]" },
  { id: "rose", label: "Pushti", value: "from-[#7a3e6b] via-[#a05e92] to-[#c47eb5]" },
  { id: "navy", label: "To'q ko'k", value: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]" },
  { id: "crimson", label: "Qizil", value: "from-[#8b2f3a] via-[#b34a58] to-[#d4707e]" },
  { id: "gold", label: "Oltin", value: "from-[#7a6520] via-[#a08a35] to-[#c4a84e]" },
  { id: "graphite", label: "Grafit", value: "from-[#2c2c2c] via-[#424242] to-[#5a5a5a]" },
  { id: "forest", label: "Tund yashil", value: "from-[#14532d] via-[#166534] to-[#15803d]" },
];

export interface IconDef { id: string; label: string; path: string; }
export interface IconCategory { id: string; label: string; icons: IconDef[]; }

export const ICON_CATEGORIES: IconCategory[] = [
  {
    id: "education",
    label: "Ta'lim",
    icons: [
      { id: "book", label: "Kitob", path: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" },
      { id: "book-open", label: "Ochiq kitob", path: "M12 7v14 M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" },
      { id: "graduation-cap", label: "Magistr kepkasi", path: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z M22 10v6 M6 12.5V16a6 3 0 0 0 12 0v-3.5" },
      { id: "pencil", label: "Qalam", path: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z M15 5l4 4" },
      { id: "pen", label: "Pero", path: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586" },
      { id: "notebook", label: "Daftar", path: "M2 6h4 M2 10h4 M2 14h4 M2 18h4 M21.4 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h15.4a.6.6 0 0 1 .6.6v14.8a.6.6 0 0 1-.6.6Z" },
      { id: "library", label: "Kutubxona", path: "m16 6 4 14 M12 6v14 M8 8v12 M4 4v16" },
      { id: "backpack", label: "Ryukzak", path: "M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z M8 10h8 M8 18v2 M16 18v2 M9 14h6" },
      { id: "calculator", label: "Kalkulyator", path: "M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M8 6h8 M16 14v4 M8 10h.01 M12 10h.01 M16 10h.01 M8 14h.01 M12 14h.01 M8 18h.01 M12 18h.01" },
      { id: "ruler", label: "Chizg'ich", path: "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z M7.5 10.5l2 2 M10.5 7.5l2 2 M13.5 4.5l2 2 M4.5 13.5l2 2" },
      { id: "atom", label: "Atom", path: "M12 12a1 1 0 1 0 0 0 M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5z" },
      { id: "lightbulb", label: "Lampochka", path: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5 M9 18h6 M10 22h4" },
      { id: "scroll", label: "O'ram", path: "M19 17V5a2 2 0 0 0-2-2H4 M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" },
      { id: "microscope", label: "Mikroskop", path: "M6 18h8 M3 22h18 M14 22a7 7 0 1 0 0-14h-1 M9 14h2 M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" },
      { id: "bookmark", label: "Xatcho'p", path: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" },
      { id: "compass", label: "Kompas", path: "M16.24 7.76l-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" },
      { id: "award-edu", label: "Nishon", path: "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11 M12 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" },
      { id: "feather", label: "Pat", path: "M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z M16 8 2 22 M17.5 15H9" },
      { id: "brain", label: "Miya", path: "M12 18V5 M15 13a4.17 4.17 0 0 1-1.03-7.75 M10 5a3.5 3.5 0 0 0-7 0c0 1 .3 2 .8 2.8A4 4 0 0 0 5 15a3.8 3.8 0 0 0 4 4 M14 5a3.5 3.5 0 0 1 7 0c0 1-.3 2-.8 2.8A4 4 0 0 1 19 15a3.8 3.8 0 0 1-4 4" },
      { id: "quote", label: "Iqtibos", path: "M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" },
    ],
  },
  {
    id: "tech",
    label: "IT & Texnologiya",
    icons: [
      { id: "code", label: "Kod", path: "M16 18l6-6-6-6M8 6l-6 6 6 6" },
      { id: "terminal", label: "Terminal", path: "M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z m4 7 2-2-2-2 M11 13h4" },
      { id: "server", label: "Server", path: "M4 2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M4 14h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z M6 6h.01 M6 18h.01" },
      { id: "database", label: "Ma'lumotlar bazasi", path: "M12 2c5 0 9 1.34 9 3s-4 3-9 3-9-1.34-9-3 4-3 9-3z M21 5v14c0 1.66-4 3-9 3s-9-1.34-9-3V5 M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" },
      { id: "cpu", label: "Protsessor", path: "M4 4h16v16H4z M9 9h6v6H9z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M1 9h3 M1 14h3 M20 9h3 M20 14h3" },
      { id: "cloud", label: "Bulut", path: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" },
      { id: "wifi", label: "Wi-Fi", path: "M5 13a10 10 0 0 1 14 0 M8.5 16.5a5 5 0 0 1 7 0 M2 8.82a15 15 0 0 1 20 0 M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" },
      { id: "smartphone", label: "Smartfon", path: "M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z M12 18h.01" },
      { id: "laptop", label: "Noutbuk", path: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9 M4 16h16l1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45z" },
      { id: "monitor", label: "Monitor", path: "M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z M8 21h8 M12 17v4" },
      { id: "headphones", label: "Eshitish vositasi", path: "M3 14a9 9 0 1 1 18 0v6a1 1 0 0 1-1 1h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3 M4 14a1 1 0 0 1 1-1h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1z" },
      { id: "zap", label: "Yashin", path: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" },
      { id: "bluetooth", label: "Bluetooth", path: "m7 7 10 10-5 5V2l5 5-10 10" },
      { id: "network", label: "Tarmoq", path: "M16 16h6v6h-6z M2 16h6v6H2z M9 2h6v6H9z M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3 M12 12V8" },
      { id: "package", label: "Paket", path: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z m-18 .7 9 5.3 9-5.3 M12 22V12" },
      { id: "key", label: "Kalit", path: "M7.5 15.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z m13.5-13.5l-9.6 9.6 m-6.5 4 3 3L22 4l-3-3z" },
      { id: "shield", label: "Qalqon", path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
      { id: "globe", label: "Globus", path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20" },
      { id: "mouse", label: "Sichqoncha", path: "M5 9a7 7 0 0 1 14 0v6a7 7 0 1 1-14 0z M12 6v4" },
      { id: "rocket", label: "Raketa", path: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" },
    ],
  },
  {
    id: "business",
    label: "Biznes & Ish",
    icons: [
      { id: "briefcase", label: "Chemodan", path: "M20 7h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" },
      { id: "building", label: "Bino", path: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z M2 18h2 M20 18h2 M6 10h4 M10 6h4 M10 14h4 M14 6h.01 M14 10h.01 M14 14h.01" },
      { id: "trending-up", label: "O'sish", path: "m22 7-8.5 8.5-5-5L2 17 M16 7h6v6" },
      { id: "chart-bar", label: "Ustunli chart", path: "M3 3v16a2 2 0 0 0 2 2h16 M7 16l4-4 4 4 5-5" },
      { id: "chart-pie", label: "Aylana chart", path: "M21 12A9 9 0 1 1 12 3v9h9z" },
      { id: "dollar-sign", label: "Dollar", path: "M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
      { id: "banknote", label: "Pul", path: "M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z M12 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z M6 12h.01 M18 12h.01" },
      { id: "wallet", label: "Hamyon", path: "M19 7V5a2 2 0 0 0-2-2H5a2 2 0 1 0 0 4h14v2 M3 5v14a2 2 0 0 0 2 2h16v-5 M18 12a2 2 0 0 0 0 4h4v-4z" },
      { id: "calendar", label: "Kalendar", path: "M3 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M16 2v4 M8 2v4 M3 10h18" },
      { id: "clock", label: "Soat", path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2" },
      { id: "users", label: "Foydalanuvchilar", path: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" },
      { id: "user", label: "Foydalanuvchi", path: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" },
      { id: "target", label: "Nishon", path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" },
      { id: "megaphone", label: "Karnay", path: "m3 11 18-5v12L3 14v-3z M11.6 16.8a3 3 0 1 1-5.8-1.6" },
      { id: "receipt", label: "Chek", path: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8 M12 17.5v-11" },
      { id: "presentation", label: "Taqdimot", path: "M2 3h20 M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3 m7 21 5-5 5 5" },
      { id: "file-text", label: "Fayl", path: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z M14 2v4a2 2 0 0 0 2 2h4 M16 13H8 M16 17H8 M10 9H8" },
      { id: "credit-card", label: "Kreditka", path: "M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z M2 10h20" },
      { id: "award-biz", label: "Sertifikat", path: "M12 2a7 7 0 1 0 7 7 M8.21 13.89 7 23l5-3 5 3-1.21-9.12" },
      { id: "chart", label: "Grafik", path: "M22 12h-4l-3 9L9 3l-3 9H2" },
    ],
  },
  {
    id: "creative",
    label: "Dizayn & Ijod",
    icons: [
      { id: "palette", label: "Palette", path: "M12 2a10 10 0 0 0 0 20c5.52 0 10-4.48 10-10a10 10 0 0 0-10-10zm-2 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-3-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-.5-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3.5-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" },
      { id: "brush", label: "Cho'tka", path: "m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08 M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" },
      { id: "image", label: "Rasm", path: "M3 3h18v18H3z m6 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z m12 12-6-6-4 4-3-3-5 5" },
      { id: "camera", label: "Kamera", path: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z M12 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
      { id: "video", label: "Video", path: "m22 8-6 4 6 4V8z M2 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" },
      { id: "music", label: "Musiqa", path: "M9 18V5l12-2v13 M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M18 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
      { id: "mic", label: "Mikrofon", path: "M9 5a3 3 0 1 1 6 0v6a3 3 0 1 1-6 0z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v3" },
      { id: "film", label: "Film", path: "M3 3h18v18H3z M7 3v18 M17 3v18 M3 12h18 M3 7h4 M3 17h4 M17 17h4 M17 7h4" },
      { id: "edit", label: "Tahrir", path: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" },
      { id: "scissors", label: "Qaychi", path: "M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M20 4 8.12 15.88 M14.47 14.48 20 20 M8.12 8.12 12 12" },
      { id: "droplet", label: "Tomchi", path: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5-2 1.6-3 3.5-3 5.5a7 7 0 0 0 7 7z" },
      { id: "pen-tool", label: "Pen tool", path: "M15.7 21.3l5.6-5.6-3.8 3.8z M18 13L16.6 6.1a1 1 0 0 0-.7-.8L3.2 2a1 1 0 0 0-1.2 1.2l3.4 12.6a1 1 0 0 0 .8.8L13 18 M2.3 2.3l7.3 7.3 M12 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" },
      { id: "sparkles", label: "Uchquzlar", path: "M10 3L8.5 9 3 10l5.5 1L10 17l1.5-6L17 10l-5.5-1L10 3z M19 5l.5 2 2 .5-2 .5L19 10l-.5-2-2-.5 2-.5z M5 17l.5 1.5 1.5.5-1.5.5L5 21l-.5-1.5-1.5-.5 1.5-.5z" },
      { id: "layout", label: "Layout", path: "M3 3h18v18H3z M3 9h18 M9 21V9" },
      { id: "grid", label: "Set", path: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" },
      { id: "type", label: "Shrift", path: "M4 7V4h16v3 M9 20h6 M12 4v16" },
      { id: "star", label: "Yulduz", path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
      { id: "heart", label: "Yurak", path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" },
      { id: "crown", label: "Toj", path: "M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z M5 19h14" },
      { id: "eye", label: "Ko'z", path: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
    ],
  },
  {
    id: "sport",
    label: "Fan & Sport",
    icons: [
      { id: "flask", label: "Kolba", path: "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2 M9 2h6" },
      { id: "trophy", label: "Kubok", path: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" },
      { id: "dumbbell", label: "Gantel", path: "M14.4 14.4 9.6 9.6 M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.767a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.828z M21.5 21.5-1.4-1.4 M3.9 3.9 2.5 2.5 M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" },
      { id: "activity", label: "Aktivlik", path: "M22 12h-4l-3 9L9 3l-3 9H2" },
      { id: "bike", label: "Velosiped", path: "M5.5 17.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M18.5 17.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M15 6a1 1 0 1 0-2 0 1 1 0 0 0 2 0z M12 17.5V14l-3-3 4-3 2 3h2" },
      { id: "sun", label: "Quyosh", path: "M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41 M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" },
      { id: "moon", label: "Oy", path: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" },
      { id: "leaf", label: "Barg", path: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1.4 2.16 2.21 4.84 2.1 7.65A11.94 11.94 0 0 1 16 19.7 12.01 12.01 0 0 1 11 20z M2 21c0-3 1.85-5.36 5.08-6" },
      { id: "flower", label: "Gul", path: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" },
      { id: "sphere", label: "Sfera", path: "M12 2a10 10 0 1 0 10 10H12V2z" },
      { id: "globe-sci", label: "Yer", path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20" },
      { id: "tree-pine", label: "Archa", path: "m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2a1 1 0 0 1-.8-1.7L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17z M12 22v-3" },
      { id: "waves", label: "To'lqinlar", path: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" },
      { id: "mountain", label: "Tog'", path: "m8 3 4 8 5-5 5 15H2L8 3z" },
      { id: "medal", label: "Medal", path: "M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2l1.2-1.54a2 2 0 0 1 1.58-.77h12.87a2 2 0 0 1 1.58.77l1.2 1.54a2 2 0 0 1 .13 2.2L16.79 15 M12 16a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M11 12l-1 2h4l-1-2" },
      { id: "droplets", label: "Tomchilar", path: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" },
      { id: "cloud-rain", label: "Yomg'ir", path: "M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9 M8 19v1 M8 14v1 M16 19v1 M16 14v1 M12 21v1 M12 16v1" },
      { id: "snowflake", label: "Qor", path: "M2 12h20 M12 2v20 M20 16l-4-4 4-4 M4 8l4 4-4 4 M16 4l-4 4-4-4 M16 20l-4-4-4 4" },
      { id: "thermometer", label: "Termometr", path: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" },
      { id: "chat", label: "Chat", path: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
    ],
  },
];

export const ICON_OPTIONS: IconDef[] = ICON_CATEGORIES.flatMap(c => c.icons);

export const courses: Course[] = [
  {
    slug: "javascript-react-fullstack",
    title: "JavaScript & React Full-stack",
    category: "IT & Dasturlash",
    categorySlug: "dasturlash",
    format: "Offline",
    provider: "Najot Ta'lim",
    location: "Toshkent",
    price: "650 000",
    priceFree: false,
    rating: "4.9",
    duration: "6 oy",
    description: "Noldan boshlab JavaScript, React, Node.js va boshqa zamonaviy texnologiyalarni o'rganing. Amaliy loyihalar bilan mustahkamlang.",
    gradient: "from-[#4a7ab5] via-[#7ea2d4] to-[#a3c4e8]",
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    slug: "ui-ux-dizayn-figma",
    title: "UI/UX dizayn Figma masterclass",
    category: "Dizayn",
    categorySlug: "dizayn",
    format: "Online",
    provider: "Sarvar Nazarov",
    location: "Online",
    price: "Bepul",
    priceFree: true,
    rating: "4.7",
    duration: "3 oy",
    description: "Figma da professional darajada dizayn qilishni o'rganing. UI/UX asoslari, prototiplash va real loyihalar.",
    gradient: "from-[#6b5b95] via-[#8b7bb5] to-[#b0a3d4]",
    iconPath: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586",
  },
  {
    slug: "digital-marketing-smm",
    title: "Digital Marketing & SMM intensiv",
    category: "Marketing",
    categorySlug: "marketing",
    format: "Offline",
    provider: "Marketing Pro",
    location: "Samarqand",
    price: "400 000",
    priceFree: false,
    rating: "4.6",
    duration: "4 oy",
    description: "SMM, SEO, kontekst reklama va boshqa digital marketing vositalarini amaliy o'rganing.",
    gradient: "from-[#a35b2d] via-[#c47e4a] to-[#d4a07e]",
    iconPath: "M22 12h-4l-3 9L9 3l-3 9H2",
  },
  {
    slug: "ielts-intensive-7",
    title: "IELTS Intensive 7.0+",
    category: "Xorijiy tillar",
    categorySlug: "xorijiy-tillar",
    format: "Offline",
    provider: "Everest School",
    location: "Toshkent",
    price: "600 000",
    priceFree: false,
    rating: "4.9",
    duration: "2 oy",
    description: "IELTS 7.0+ ball olish uchun intensiv tayyorgarlik. Speaking, Writing, Reading va Listening bo'yicha strategiyalar.",
    gradient: "from-[#2d6a5a] via-[#4a9e8a] to-[#7ec4b8]",
    iconPath: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  },
  {
    slug: "flutter-mobil-ilova",
    title: "Flutter — mobil ilova yaratish",
    category: "IT & Dasturlash",
    categorySlug: "dasturlash",
    format: "Video",
    provider: "Botir Xolmatov",
    location: "YouTube",
    price: "Bepul",
    priceFree: true,
    rating: "4.5",
    duration: "3 oy",
    description: "Dart va Flutter yordamida iOS va Android uchun mobil ilovalar yaratishni o'rganing.",
    gradient: "from-[#7a6520] via-[#a08a35] to-[#c4a84e]",
    iconPath: "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z",
  },
  {
    slug: "data-science-ai-bootcamp",
    title: "Data Science & AI bootcamp",
    category: "IT & Dasturlash",
    categorySlug: "dasturlash",
    format: "Bootcamp",
    provider: "AI Academy",
    location: "Toshkent",
    price: "1 200 000",
    priceFree: false,
    rating: "4.9",
    duration: "4 oy",
    description: "Python, Machine Learning, Data Analysis va Sun'iy intellekt asoslarini o'rganing. Real loyihalar bilan.",
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    iconPath: "M12 2a10 10 0 1 0 10 10H12V2z",
  },
  {
    slug: "python-backend-development",
    title: "Python Backend Development",
    category: "IT & Dasturlash",
    categorySlug: "dasturlash",
    format: "Offline",
    provider: "Najot Ta'lim",
    location: "Toshkent",
    price: "750 000",
    priceFree: false,
    rating: "4.8",
    duration: "5 oy",
    description: "Python, Django, REST API va PostgreSQL bilan backend dasturlashni professional darajada o'rganing.",
    gradient: "from-[#2d6a5a] via-[#4a9e8a] to-[#7ec4b8]",
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    slug: "grafik-dizayn-pro",
    title: "Adobe Photoshop & Illustrator Pro",
    category: "Dizayn",
    categorySlug: "dizayn",
    format: "Offline",
    provider: "Astrum IT Academy",
    location: "Toshkent",
    price: "900 000",
    priceFree: false,
    rating: "4.7",
    duration: "4 oy",
    description: "Photoshop va Illustrator da professional grafik dizayn. Logotip, banner, brending loyihalar.",
    gradient: "from-[#8b2f3a] via-[#b34a58] to-[#d4707e]",
    iconPath: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586",
  },
  {
    slug: "rus-tili-noldan-b1",
    title: "Rus tili — noldan B1 gacha",
    category: "Xorijiy tillar",
    categorySlug: "xorijiy-tillar",
    format: "Offline",
    provider: "Multilang Academy",
    location: "Toshkent",
    price: "280 000",
    priceFree: false,
    rating: "4.6",
    duration: "6 oy",
    description: "Rus tilini noldan boshlang va B1 darajasigacha yetkaziling. Grammatika, so'zlashuv va tinglash.",
    gradient: "from-[#7a3e6b] via-[#a05e92] to-[#c47eb5]",
    iconPath: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
  },
  {
    slug: "startup-tadbirkorlik",
    title: "Startup va tadbirkorlik asoslari",
    category: "Biznes & Startap",
    categorySlug: "biznes",
    format: "Offline",
    provider: "Business Hub",
    location: "Toshkent",
    price: "500 000",
    priceFree: false,
    rating: "4.7",
    duration: "2 oy",
    description: "Biznes g'oyani loyihaga aylantirish, moliyalashtirish, marketing va jamoani boshqarish asoslari.",
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    iconPath: "M20 7h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z",
  },
];

export const categories = [
  { name: "IT & Dasturlash", slug: "dasturlash", count: 86, desc: "Python, JavaScript, React va boshqalar", subcategories: ["JavaScript", "Python", "React", "Flutter", "Data Science", "Backend", "Frontend", "Mobile"] },
  { name: "Dizayn", slug: "dizayn", count: 42, desc: "UI/UX, Figma, Photoshop, Illustrator", subcategories: ["UI/UX", "Figma", "Photoshop", "Illustrator", "Grafik dizayn", "Motion dizayn"] },
  { name: "Marketing", slug: "marketing", count: 35, desc: "SMM, SEO, kontekst reklama", subcategories: ["SMM", "SEO", "Kontekst reklama", "Email marketing", "Brending", "Kontent marketing"] },
  { name: "Xorijiy tillar", slug: "xorijiy-tillar", count: 64, desc: "Ingliz, rus, koreys, arab tillari", subcategories: ["Ingliz tili", "Rus tili", "Koreys tili", "Arab tili", "Nemis tili", "IELTS", "CEFR"] },
  { name: "Biznes & Startap", slug: "biznes", count: 28, desc: "Tadbirkorlik, moliya, boshqaruv", subcategories: ["Tadbirkorlik", "Moliya", "Boshqaruv", "Startup", "Investitsiya"] },
  { name: "Akademik fanlar", slug: "akademik", count: 18, desc: "Matematika, fizika, kimyo", subcategories: ["Matematika", "Fizika", "Kimyo", "Biologiya", "Olimpiada"] },
];
