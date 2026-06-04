# Higgsfield Assets

## Status: Higgsfield was NOT available in this environment.

A tool/MCP search for Higgsfield (image/video generation) returned no Higgsfield
provider. The only generative/visual tools present were unrelated (Blender, image
scrapers, a Designer/Webflow tool, etc.) — none appropriate for generating premium
hero/process/style art assets.

Per the brief's fallback rule, the art direction was implemented with **CSS / SVG /
R3F** instead, so the site needs no external image pipeline to look intentional:

| Intended Higgsfield asset | Implemented fallback |
|---|---|
| Home hero poster / loop | Existing R3F cinematic monogram scene (velvet, fur letterforms, wax, gold, roses) + readability scrim. |
| Process screen-state imagery (pixel→cinematic) | CSS-driven `StageScreen` states inside a styled monitor with scanlines + escalating glow per stage. |
| Styles showroom thumbnails (8) | CSS/3D mini-scenes on lit "exhibit plinths" (spinning cube, parallax layers, entity constellation, etc.). |
| OG / social card | `public/og-image.svg` — branded 1200×630 SVG. |

## When a Higgsfield (or any image/video) generator becomes available
1. Generate assets with **no critical baked-in text** (DOM remains the source of truth).
2. Save outputs + their prompts under `public/assets/higgsfield/{home,process,styles,og}/`.
3. Optimise (`.webp` stills, lightweight `.mp4/.webm` loops with poster).
4. Add `alt` / `aria-hidden` appropriately and `<picture>`/`<video>` with reduced-motion fallback.
5. Swap the OG SVG for a real `og-image.jpg`/`.png` (some scrapers don't render SVG).
6. Log each asset + prompt here.

No Higgsfield assets were generated this pass.
