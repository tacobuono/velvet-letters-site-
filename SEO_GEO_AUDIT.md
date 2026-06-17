# Velvet Letters — SEO / GEO Audit (Phase 1)

Status after the multi-page build. Canonical host assumed: **https://velvetletters.com**
(the CTA email uses `hello@velvetletters.com` — confirm the canonical host before launch).

## What was missing before this phase
- Only one route (`/`); no crawlable multi-page structure.
- No per-route `<title>` / meta description (single static title in `index.html`).
- No canonical, Open Graph, or Twitter card tags.
- No `sitemap.xml`, `robots.txt`, or AI/answer-engine summary.
- No structured data (JSON-LD).
- Most copy lived inside the WebGL canvas (not crawlable).

## What was added
- **Real routing** (React Router) with six crawlable routes, each with semantic HTML headings and real, crawlable body copy (not canvas-only).
- **Per-route metadata** via `src/lib/seo.ts` (`useSeo`): unique title, description, canonical, OG + Twitter cards, and route-scoped JSON-LD.
- **JSON-LD**: `ProfessionalService` (Organization-level, on Home), `WebPage` per route, `BreadcrumbList` on subpages, and `FAQPage` on Contact (matches the visible FAQ block — no fake markup).
- **`public/robots.txt`** (allow all + sitemap reference).
- **`public/sitemap.xml`** (all six routes with priorities).
- **`public/llms.txt`** — concise, accurate, answer-engine-readable summary of what Velvet Letters is, builds, who it's for, the process, and how to start.
- **`public/.htaccess`** — Apache SPA rewrite (deep-link refresh), correct MIME types, long-cache for fingerprinted assets.
- Internal links between every page (nav, footer, in-page CTAs).
- Visible entity/service language on About, Process, Styles, Contact (3D, immersive, cinematic, custom, SEO/GEO, luxury, conversion).

## Route-by-route (title / description / schema)
| Route | Title | Schema |
|-------|-------|--------|
| `/` | Velvet Letters — Cinematic Websites for Premium Brands | ProfessionalService + WebPage |
| `/about` | About — The Velvet Letters Catalogue of Digital Impressions | WebPage + BreadcrumbList |
| `/process` | Process — How a Velvet Letters site becomes real | WebPage + BreadcrumbList |
| `/styles` | Styles — The kinds of websites Velvet Letters builds | WebPage + BreadcrumbList |
| `/contact` | Contact — Let's talk \| Velvet Letters | WebPage + BreadcrumbList + FAQPage |
| `/post-office` | The Post Office — a hidden Velvet Letters experience | WebPage + BreadcrumbList |

## GEO / answer-engine
- `llms.txt` published with service definitions and entities (Velvet Letters, cinematic/3D/immersive/custom websites, SEO/GEO strategy, luxury digital experiences).
- Visible FAQ on Contact answers real buyer questions (what we build, how to start) and is mirrored in FAQPage JSON-LD.
- All claims map to visible content — no hidden or fabricated markup, no fake reviews/ratings.

## Remaining recommendations (next pass)
1. ✅ **OG image** — real `public/og-image.png` (1200×630) now ships, rasterized from
   `og-image.svg` with the brand fonts via `node scripts/build-og-image.mjs`. Static
   `og:image` / `twitter:image` + dimensions are baked into `index.html` (so non-JS
   scrapers see the card), and `useSeo` still injects per-route overrides.
2. **Prerender/SSG for crawlers**: this is a client-rendered SPA. Titles/meta/JSON-LD are injected client-side — modern Google executes JS, but for maximal coverage (and non-JS answer engines) add static prerendering (e.g. `vite-plugin-prerender`/`react-snap`) so each route ships static HTML with its meta + copy baked in.
3. **Per-route OG images** for richer social cards.
4. ✅ **Code-split the R3F/three bundle** — `HomePage` (and the game route) are
   `React.lazy`; content routes (About/Process/Styles/Contact) no longer pull three.js.
5. ✅ **Canonical host confirmed**: apex `https://velvetletters.com` (no www), consistent
   across `SITE_URL`, `sitemap.xml`, `robots.txt`. `.htaccess` now 301-redirects
   `http→https` and `www→apex` so only the one origin is ever served/indexed.
6. **Analytics** + Search Console + Bing Webmaster verification.
7. Expand FAQ coverage (cinematic definition, who it's for, SEO/GEO scope) as visible content, then extend FAQPage.

## Performance risks
- Single JS chunk includes three.js/R3F (loads on every route). Mitigate with route-level `React.lazy` for `HomePage` (and the game) so content pages stay light.
- Home WebGL is heavy on low-end GPUs; adaptive DPR (`PerformanceMonitor`) + reduced-motion fallback already mitigate.
- Self-hosted fonts (latin subset) are good; consider `font-display: swap` (already via fontsource) and preloading the hero weight.

## Accessibility risks / status
- Semantic headings, labelled form fields, keyboard-operable nav + mobile menu, focus-visible defaults, reduced-motion handling across page transition, reveals, and 3D.
- Skip-to-content link + programmatic focus handoff on route change (screen-reader page-change announcement).
- Post Office game is canvas-only by nature → the reward + next step (CTA) are duplicated in accessible DOM below it, and instructions are provided as text; a keyboard-playable version is a future enhancement.
- ✅ Gold-on-velvet contrast verified (live-measured). Full `gold` on `velvet-deep` is
  ~8.5:1. Reduced-opacity small labels that failed AA were bumped: Styles `gold/60`
  → `gold/80` (3.67 → 5.75:1); Process caption `gold/70` → `gold/85` (6.37:1); the
  large Process numeral `gold/40` → `gold/60` (3.67:1, clears the 3:1 large-text bar).

## Content gaps (next pass)
- Real testimonials/case studies (would unlock `CreativeWork`/`Review` schema — only with genuine, visible content).
- Pricing or engagement-model page.
- Per-style detail pages (could each become indexable WebPages).
