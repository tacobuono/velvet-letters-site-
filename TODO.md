# Velvet Letters — Cinematic Rebuild · TODO / Asset Swaps

This build uses procedural primitives as stand-ins per the brief's "build with
primitives, note them here" instruction. Everything below works today; these are
upgrades to swap real assets in later.

## ✅ Asset pass — real GLBs now shipping (Blender 5.1, `blender/build_assets.py`)

Generated headless and committed to `public/models/` (regenerate any time with
`"<blender>" --background --python blender/build_assets.py`):
- **`rose.glb`** — sculptural layered-petal rose (phyllotaxis spiral, curled/cupped
  petals, organic variation, solidified, smooth-shaded). Now the **instanced rose
  geometry** in the hero (replaced the displaced-icosahedron blob). Velvet/satin
  `MeshPhysicalMaterial` with sheen, per-instance tint, oriented to face outward.
- **`vl-mark.glb`** — bevelled extruded serif "VL" (Georgia). Now the **gold
  monogram** cresting the CTA wax seal (replaced flat drei `<Text>`).
- **`filigree.glb`** — beaded double-hairline gold ring. Now the **CTA frame**
  (replaced the plain torus). CTA camera waypoint pulled back (-28 → -24) to frame it.

Remaining true-asset upgrades (need a human 3D artist / scan — see below): a real
shells-and-fins **fur shader** (hero strands are still instanced cones), **scanned
roses** for even more fidelity, hand-painted **decal textures**, and `Text3D` for
the Process numerals / Testimonial quote glyph.

## Assets to provide (drop into `public/`)

- **HDRI** (`public/hdri/`): a 1k `.hdr` env map for metal reflections (gold
  filigree, ribbons, hexagon). Then add a Drei `<Environment files="/hdri/..." />`
  to the world and the gold materials gain real reflections.
- **GLB models** (`public/models/`):
  - `envelope.glb` — Philosophy corridor (currently extruded box + flap).
  - `wax-seal.glb` — CTA seal (currently a flattened cylinder + Text emboss).
  - `rose.glb` — Hero dried roses (currently displaced icosahedra).
  - Every placeholder is isolated in its own component, so swapping to `useGLTF`
    won't touch parent layout or animation.

## Hero scene (romantic decay) — production path

- **Fur**: currently ~8,000 instanced cones per letter. Swap for a real
  shells-and-fins fur shader (Drei-compatible port of XBDev fur, or commissioned)
  — 8–16 offset shells of the letter geometry with an alpha hair texture.
- **Roses**: swap procedural blobs for scanned/commissioned GLB roses, pre-placed
  in Blender and exported as one GLB per letter.
- **Decal type**: currently a generated `CanvasTexture`. Swap for hand-painted,
  properly distressed serif PSD textures (Cinzel / DIN Engschrift for the carnival
  type). Panels currently read `V C O O A` and `L V O L T C O`.
- **Bake**: bake each finished letter (skin + fur + roses + decal) into one
  optimized GLB so runtime loads a single mesh per letter instead of 16k instances.

## 3D typography

- Drei `<Text>` (troika) is used for numerals, service titles, step titles, the
  testimonial quote glyph, and the seal "VL". troika renders flat text. For true
  extruded gold glyphs (Testimonial quote, Process numerals), convert a font to
  `typeface.json` and switch to Drei `<Text3D>` + a gold `meshStandardMaterial`.
- troika cannot parse `.woff2` (no brotli). The 3D text loads plain `.woff` files
  from `public/fonts/`. DOM text uses the full `@fontsource` woff2 (latin subset).

## Tuning / polish

- **Leva** is installed but intentionally unused to protect the bundle budget.
  To live-tune camera waypoints / fog / light intensity, add `useControls` from
  `leva` inside a component and render `<Leva />` once (dev only), then remove
  before shipping.
- Camera waypoints + look targets live in `src/lib/cameraPath.ts`.
- Services hexagon framing: at scroll ~0.42 the camera is already panning toward
  Process, so the hexagon sits left-of-centre. Nudge the waypoint dwell if you
  want it dead-centre longer.
- CTA wax seal is framed very close (final approach). Pull waypoint 6 back a touch
  (e.g. z -27) if you want the gold filigree frame fully in shot.

## Deploy to Hostinger

1. `npm run build` → `dist/`.
2. hPanel → File Manager → `public_html`. Delete the current `index.html` only.
   Keep `about.html`, `contact.html`, `process.html`, `all-styles.html`,
   `post-office.html`.
3. Upload everything from `dist/` into `public_html`. The SPA's `index.html`
   replaces the old one; the nav links point at the existing `.html` pages.

## Not a Spline / GLB project

This site is **hand-coded React Three Fiber**. There is no `.spline` scene, no
Spline runtime (`@splinetool/*`), and no exported GLB — every model is procedural
geometry built in `src/scenes/**`. So model quality is NOT locked in an external
asset; it lives entirely in code and is edited there. The checklist below maps the
usual "reopen in Spline/Blender" art-direction items to where each already lives.

| Art-direction item            | Status in code | Where |
|-------------------------------|----------------|-------|
| Increase geometry detail      | done           | torus 48×192, cylinder 96, rose icosa detail 2, ribbon 16-seg |
| Bevel hard edges              | done           | letters use `ExtrudeGeometry` bevel (`scenes/hero/letterGeometry.ts`) |
| Smooth normals                | done           | `computeVertexNormals()` on letters + rose blobs |
| Upgrade to PBR materials      | done           | `MeshPhysicalMaterial` (clearcoat/sheen) on gold + wax; `envMapIntensity` everywhere |
| Soft area lights              | done           | `world/StudioEnvironment.tsx` Lightformers + hero rig |
| Contact shadows               | done           | `<ContactShadows>` under hero letters |
| Environment / reflections     | done           | procedural IBL in `StudioEnvironment.tsx` |
| Reduce plastic colors         | done           | tone map exposure 1.0, bloom threshold 0.78, tuned roughness |
| Slow the animation timeline   | done           | Lenis 1.6, camera lambda 2.6, 160vh sections, `easeSegmented` |
| Increase easing               | done           | per-segment smoothstep in `lib/cameraPath.ts` |
| Export at higher quality      | n/a            | no export step — rendered live; DPR capped at 2, MSAA 4 |

**The only items code can't fully solve** (would need a real DCC tool — Blender,
not Spline, since there's no Spline file): a true shells-and-fins **fur shader**,
**scanned/sculpted rose** GLBs, and **extruded 3D type** (`Text3D` + typeface.json)
for the numerals / quote glyph / seal. These are the three asset swaps listed above.

## Notes

- CTA email is `hello@velvetletters.com` (from the existing site, direct mailto, no
  Cloudflare obfuscation).
- **Canonical host locked to apex `https://velvetletters.com`** (no www) across
  `src/lib/seo.ts`, `sitemap.xml`, `robots.txt`, and a `.htaccess` 301 redirect
  (`http→https`, `www→apex`). Point DNS/hosting at that exact origin before launch.
- **OG card**: `public/og-image.png` (1200×630) is generated from `og-image.svg`
  with the brand fonts — regenerate with `node scripts/build-og-image.mjs` after
  editing the SVG.
