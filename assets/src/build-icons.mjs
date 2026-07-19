// Convert SVG icons to PNG assets. Run from WonderWordsApp/:
//   npx --yes -q -p sharp@0.34.4 node assets/src/build-icons.mjs
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const assets = join(here, '..');

const jobs = [
  { src: 'icon.svg',        out: 'icon.png',                       size: 1024 },
  { src: 'android-fg.svg',  out: 'splash-icon.png',                size: 1024 },
  { src: 'icon.svg',        out: 'favicon.png',                    size: 48   },
  { src: 'android-fg.svg',  out: 'android-icon-foreground.png',    size: 1024 },
  { src: 'android-bg.svg',  out: 'android-icon-background.png',    size: 1024 },
  { src: 'android-mono.svg',out: 'android-icon-monochrome.png',    size: 1024 }
];

for (const job of jobs) {
  const svg = await readFile(join(here, job.src));
  const png = await sharp(svg, { density: 512 })
    .resize(job.size, job.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(join(assets, job.out), png);
  console.log(`✓ ${job.out} (${job.size}×${job.size}, ${(png.length / 1024).toFixed(1)} KB)`);
}
