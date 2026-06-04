# Velvet Letters — Cinematic 3D Site

A scroll-as-camera-path experience. Scroll drives a spline camera through six
scenes; copy floats as DOM overlay over a fixed WebGL canvas. Built as a static
SPA to drop into Hostinger `public_html`.

## Stack

Vite + React + TypeScript · React Three Fiber + Drei · @react-three/postprocessing
(bloom / vignette / chromatic aberration) · GSAP ScrollTrigger · Lenis smooth
scroll · Tailwind CSS (DOM overlay) · self-hosted fonts via @fontsource.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build & preview

```bash
npm run build    # → dist/  (tsc + vite build)
npx serve dist   # smoke-test the static bundle
```

## Architecture

- `src/lib/cameraPath.ts` — Catmull-Rom spline waypoints + look targets (one per scene).
- `src/lib/scrollStore.ts` — single source of truth for 0..1 scroll progress.
- `src/lib/useScrollProgress.ts` — Lenis ↔ GSAP ticker bridge; writes progress.
- `src/world/` — CameraRig, Lights, Fog (sage→velvet blend), Particles, Postprocessing, SceneGate.
- `src/scenes/` — Hero (procedural fur monogram), Philosophy, Services, Process, Testimonial, CTA.
- `src/components/` — Nav, Preloader, Cursor, Footer, ScrollOverlay (all DOM copy).
- `src/data/content.ts` — all copy, lifted verbatim from the existing site.

Reduced motion (`prefers-reduced-motion`) freezes the camera on per-section static
shots; mobile / low-power devices drop postprocessing and particle count.

See `TODO.md` for asset swaps (HDRI, GLB models, real fur shader, Text3D), tuning,
and Hostinger deploy steps.
