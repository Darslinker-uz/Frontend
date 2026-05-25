/**
 * AI chat — client-safe types va konstantalar.
 * Server modullar (prisma, redis) bu faylga import qilinmasin.
 */

export type AiChatSurface = "web" | "aikurs";

export type WebAiAction =
  | { type: "init" }
  | { type: "message"; text: string }
  | { type: "menu_match" }
  | { type: "aikurs_consent"; consent: boolean }
  | { type: "quiz_answer"; key: string; value: string }
  | { type: "courses_page"; page: number }
  | { type: "course_open"; index: number }
  | { type: "course_inquiry"; listingId: number }
  | { type: "inquiry_phone"; phone: string; listingId?: number };

export type WebCourseCard = {
  id: number;
  title: string;
  price: string;
  format: string;
  centerName: string;
  categoryName: string;
  url: string;
};

export type WebCourseDetail = WebCourseCard & {
  duration: string | null;
  level: string | null;
  certificate: boolean;
  demoLesson: boolean;
  description: string | null;
};

export type WebAiUi =
  | { kind: "menu"; buttons: { id: string; label: string }[] }
  | {
      kind: "quiz";
      step: number;
      total: number;
      question: string;
      options: { id: string; label: string }[];
    }
  | {
      kind: "courses";
      title: string;
      courses: WebCourseCard[];
      resultIds: number[];
      page: number;
      totalPages: number;
      total: number;
    }
  | { kind: "course"; course: WebCourseDetail }
  | { kind: "phone"; listingId: number; courseTitle: string };

export type WebAiResponse = {
  ok: boolean;
  error?: string;
  sessionId: string;
  assistantMessages: string[];
  ui?: WebAiUi;
  limitReached?: boolean;
};

export const AI_QUESTION_KEYS = ["goal", "direction", "level", "time", "budget"] as const;
export const AIKURS_QUIZ_KEYS = ["direction", "age", "level", "time"] as const;

/** /aikurs quiz UI step → javob kaliti (2-qadam yosh matn bilan) */
export const AIKURS_QUIZ_STEP_TO_KEY: Record<number, (typeof AIKURS_QUIZ_KEYS)[number]> = {
  1: "direction",
  3: "level",
  4: "time",
};
