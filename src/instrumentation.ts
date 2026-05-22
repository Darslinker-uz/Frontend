export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startCoursesSyncScheduler } = await import("@/lib/courses-redis");
    startCoursesSyncScheduler();
  }
}
