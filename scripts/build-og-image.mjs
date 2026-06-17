// Rasterize the branded OG card (public/og-image.svg) to a real 1200x630 PNG.
// Social scrapers (Facebook, LinkedIn, iMessage, Slack, X) do not render SVG
// og:image, so we ship a PNG. Rendered with the site's actual brand fonts
// (Playfair Display + Outfit) via @resvg/resvg-js — no headless browser needed.
//
// Regenerate after editing og-image.svg:  node scripts/build-og-image.mjs
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const r = (p) => resolve(root, p);

// Brand faces the card actually uses. Normal weights are the runtime woffs in
// public/fonts; the two italic lines (eyebrow + gold tagline) pull italic faces
// from the installed @fontsource package — build-time only, nothing extra ships.
const fontFiles = [
  'public/fonts/PlayfairDisplay-900.woff',
  'public/fonts/PlayfairDisplay-700.woff',
  'public/fonts/Outfit-400.woff',
  'public/fonts/Outfit-500.woff',
  'node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff',
  'node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-italic.woff',
]
  .map(r)
  .filter((f) => {
    const ok = existsSync(f);
    if (!ok) console.warn(`[og] missing font, will fall back: ${f}`);
    return ok;
  });

const svg = readFileSync(r('public/og-image.svg'));

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    fontFiles,
    // Keep system fonts as a safety net so the SVG's Georgia/Arial fallbacks
    // still render if a brand face fails to load on some machine.
    loadSystemFonts: true,
    defaultFontFamily: 'Playfair Display',
  },
});

const png = resvg.render().asPng();
writeFileSync(r('public/og-image.png'), png);
console.log(`[og] wrote public/og-image.png (${(png.length / 1024).toFixed(1)} KB, ${fontFiles.length} brand faces)`);
