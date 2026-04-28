// Generates centered logo PNGs for Google search, OG, and favicon use.
// Run: node scripts/generate-og-logo.mjs
import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

// Logo SVG centered in 1200x1200 canvas with safe area for circle cropping
function buildSvg(size, bg = "#232324") {
  const cx = size / 2;
  const cy = size / 2;
  const sq = size * 0.327;          // square side (~ 392 of 1200)
  const half = sq / 2;
  const radius = sq * 0.107;         // corner radius
  const offset = size * 0.07;        // horizontal cascade offset (~84 of 1200)
  const fill = "#7ea2d4";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <g transform="translate(${cx - offset}, ${cy}) rotate(45)">
    <rect x="${-half}" y="${-half}" width="${sq}" height="${sq}" rx="${radius}" fill="${fill}" fill-opacity="0.2"/>
  </g>
  <g transform="translate(${cx}, ${cy}) rotate(45)">
    <rect x="${-half}" y="${-half}" width="${sq}" height="${sq}" rx="${radius}" fill="${fill}" fill-opacity="0.5"/>
  </g>
  <g transform="translate(${cx + offset}, ${cy}) rotate(45)">
    <rect x="${-half}" y="${-half}" width="${sq}" height="${sq}" rx="${radius}" fill="${fill}"/>
  </g>
</svg>`;
}

async function pngFromSvg(svg, outPath, size) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
  console.log(`Wrote ${outPath} (${size}x${size})`);
}

async function main() {
  // Master OG image (1200x1200, dark bg) — for Google Knowledge Graph + social
  const ogSvg = buildSvg(1200, "#232324");
  await pngFromSvg(ogSvg, join(PUBLIC, "og-image.png"), 1200);

  // PWA icons (use same composition)
  await pngFromSvg(buildSvg(512, "#232324"), join(PUBLIC, "icon-512.png"), 512);
  await pngFromSvg(buildSvg(192, "#232324"), join(PUBLIC, "icon-192.png"), 192);

  // Apple touch icon (180x180, brand bg)
  await pngFromSvg(buildSvg(180, "#232324"), join(PUBLIC, "apple-touch-icon.png"), 180);

  // Favicons
  await pngFromSvg(buildSvg(32, "#232324"), join(PUBLIC, "favicon-32.png"), 32);
  await pngFromSvg(buildSvg(16, "#232324"), join(PUBLIC, "favicon-16.png"), 16);

  // Inline SVG icon — used by /icon.svg route. Transparent background so
  // browser tabs blend with theme.
  const transparentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <g transform="translate(27.52, 32) rotate(45)">
    <rect x="-10.464" y="-10.464" width="20.928" height="20.928" rx="2.24" fill="#7ea2d4" fill-opacity="0.2"/>
  </g>
  <g transform="translate(32, 32) rotate(45)">
    <rect x="-10.464" y="-10.464" width="20.928" height="20.928" rx="2.24" fill="#7ea2d4" fill-opacity="0.5"/>
  </g>
  <g transform="translate(36.48, 32) rotate(45)">
    <rect x="-10.464" y="-10.464" width="20.928" height="20.928" rx="2.24" fill="#7ea2d4"/>
  </g>
</svg>`;
  writeFileSync(join(__dirname, "..", "src", "app", "icon.svg"), transparentSvg);
  console.log("Wrote src/app/icon.svg");
}

main().catch(e => { console.error(e); process.exit(1); });
