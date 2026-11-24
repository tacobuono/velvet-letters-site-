// Rasterize public/favicon.svg to the PNG sizes browsers still ask for:
// favicon-32.png (legacy tabs, Windows pins) and apple-touch-icon.png (iOS home
// screen, which ignores SVG). Pure geometry, no fonts.
//
// Regenerate after editing favicon.svg:  node scripts/build-icons.mjs
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const r = (p) => resolve(root, p);
const svg = readFileSync(r('public/favicon.svg'));

const OUT = [
  ['public/favicon-32.png', 32],
  ['public/apple-touch-icon.png', 180],
];

for (const [file, size] of OUT) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  writeFileSync(r(file), png);
  console.log(`[icons] wrote ${file} (${size}px, ${(png.length / 1024).toFixed(1)} KB)`);
}
