// Regenerate Android launcher icons (mipmap-*/*.webp) directly from the
// SVG sources so we don't have to run `expo prebuild`. Run from
// WonderWordsApp/:
//   node assets/src/build-android-icons.mjs
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = here;
const resDir = join(here, '..', '..', 'android', 'app', 'src', 'main', 'res');

// Standard Android densities. Legacy launcher icon dpi sizes and the modern
// adaptive icon dpi sizes are different — the adaptive one is 108dp so its
// pixel size is ~2.25× the legacy launcher size at the same density.
const DENSITIES = [
  { name: 'mdpi',    launcher: 48,  adaptive: 108 },
  { name: 'hdpi',    launcher: 72,  adaptive: 162 },
  { name: 'xhdpi',   launcher: 96,  adaptive: 216 },
  { name: 'xxhdpi',  launcher: 144, adaptive: 324 },
  { name: 'xxxhdpi', launcher: 192, adaptive: 432 }
];

async function svgToWebp(srcName, outPath, size) {
  const svg = await readFile(join(srcDir, srcName));
  const buf = await sharp(svg, { density: 1024 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 95 })
    .toBuffer();
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  return buf.length;
}

for (const d of DENSITIES) {
  const dir = join(resDir, `mipmap-${d.name}`);
  const tasks = [
    // Legacy launcher (square + circular masked) — full rounded-square icon.
    ['icon.svg',        `ic_launcher.webp`,             d.launcher],
    ['icon.svg',        `ic_launcher_round.webp`,       d.launcher],
    // Adaptive icon components — larger so Android can pan/zoom them.
    ['android-fg.svg',  `ic_launcher_foreground.webp`,  d.adaptive],
    ['android-bg.svg',  `ic_launcher_background.webp`,  d.adaptive],
    ['android-mono.svg',`ic_launcher_monochrome.webp`,  d.adaptive]
  ];
  const bytes = await Promise.all(
    tasks.map(([src, name, size]) => svgToWebp(src, join(dir, name), size))
  );
  const total = bytes.reduce((a, b) => a + b, 0);
  console.log(`✓ mipmap-${d.name.padEnd(8)} ${(total / 1024).toFixed(1)} KB total`);
}

console.log('\nDone. Rebuild the APK: cd android; ./gradlew assembleRelease');
