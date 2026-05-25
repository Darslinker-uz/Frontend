import type { Course } from "@/data/courses";

/** UI tugmalari — Course.format (listing-mapper) bilan mos */
export type CourseFormatFilterId = "all" | "Online" | "Offline" | "Gibrid" | "Video";

export const COURSE_FORMAT_FILTER_OPTIONS: { id: CourseFormatFilterId; label: string }[] = [
  { id: "all", label: "Barchasi" },
  { id: "Online", label: "Online" },
  { id: "Offline", label: "Offline" },
  { id: "Gibrid", label: "Gibrid" },
  { id: "Video", label: "Video" },
];

/** /kurslar filtri bilan bir xil: Gibrid onlayn va oflayn filterda ham chiqadi */
export function filterCoursesByFormat(courses: Course[], formatId: CourseFormatFilterId): Course[] {
  if (formatId === "all") return courses;
  if (formatId === "Online") {
    return courses.filter(c => c.format === "Online" || c.format === "Gibrid");
  }
  if (formatId === "Offline") {
    return courses.filter(c => c.format === "Offline" || c.format === "Gibrid");
  }
  if (formatId === "Gibrid") return courses.filter(c => c.format === "Gibrid");
  if (formatId === "Video") return courses.filter(c => c.format === "Video");
  return courses;
}
