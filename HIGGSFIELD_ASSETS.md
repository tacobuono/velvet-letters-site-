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

## Hôtel Verlaine — final photography for the "site within the site" homepage

Six shots, ONE grade across all: warm amber practicals, deep plum-burgundy
shadows, dusk light, cinematic 35mm, soft film grain, no people, no readable
text in frame (the site supplies its own type). Replace the Picsum placeholders
in `public/photos/verlaine/` keeping the same filenames; convert to AVIF
(quality ~60) before launch.

1. `01-facade.jpg` (21:9) — Parisian boutique hotel facade at blue-hour dusk,
   Haussmann limestone, warm glowing windows, wrought-iron balconies, wet
   cobblestones reflecting amber, oxblood entrance door slightly right of centre.
2. `02-lobby.jpg` (4:3) — lobby detail: brass lamp, velvet armchair corner,
   marble side table, intimate shallow depth of field.
3. `03-room.jpg` (3:2) — guest room at dusk: linen bed, warm bedside lamp,
   tall window with plum curtains, soft directional light.
4. `04-bar.jpg` (3:2) — hotel bar: backlit amber bottles, marble counter edge,
   one empty leather stool, moody.
5. `05-garden.jpg` (3:2) — courtyard garden at last light: ivy wall, small iron
   table, string of warm bulbs, deep green-to-plum shadow.
6. `06-corridor.jpg` (16:9) — THE DIVE SHOT: a long corridor or doorway with
   strong one-point perspective, warm light source at the far end, darkness
   wrapping the edges. The camera flies into this image to enter /about —
   it must have real depth at its centre.
