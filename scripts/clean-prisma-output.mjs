import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = resolve(root, "src", "generated", "prisma");
try {
  rmSync(out, { recursive: true, force: true });
} catch {
  // ignore
}
