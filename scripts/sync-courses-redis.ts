import "dotenv/config";
import { syncCoursesFromDbToRedis, getCoursesCacheMeta } from "../src/lib/courses-redis";
import { disconnectRedis } from "../src/lib/redis";

async function main() {
  const result = await syncCoursesFromDbToRedis();
  const meta = await getCoursesCacheMeta();
  console.log(`Synced ${result.count} courses. Redis meta:`, meta);
  await disconnectRedis();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
