import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useDeviceTier } from '../lib/useDeviceTier';
import type { DeviceTier } from '../lib/useDeviceTier';
import { lenisScrollTo, resetScroll } from '../lib/useScrollProgress';
import { useSeo, organizationLd, webPageLd } from '../lib/seo';
import { CameraRig } from '../world/CameraRig';
import { Lights } from '../world/Lights';
import { Fog } from '../world/Fog';
import { Particles } from '../world/Particles';
import { StudioEnvironment } from '../world/StudioEnvironment';
import { SiteArtboardScene } from '../scenes/SiteArtboardScene';
import { ScrollOverlay } from '../components/ScrollOverlay';
import { CanvasErrorBoundary } from '../components/CanvasErrorBoundary';
import { isWebGLAvailable } from '../lib/webgl';

function World({ reducedMotion, tier }: { reducedMotion: boolean; tier: DeviceTier }) {
  return (
    <>
      <Fog />
      <StudioEnvironment />
      <Lights reducedMotion={reducedMotion} />
      <Particles count={tier.particleCount} reducedMotion={reducedMotion} />
      <CameraRig reducedMotion={reducedMotion} />

      {/* One persistent scene: the fictional client site assembling on its
          artboard. No SceneGate cross-fades — the camera path IS the edit.
          No postprocessing chain either: the look comes from photography +
          lighting, and dropping the composer (render-to-texture + fullscreen
          passes every frame) is the single biggest smoothness win. */}
      <SiteArtboardScene reducedMotion={reducedMotion} />
    </>
  );
}

export function HomePage() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  // Check WebGL once. No support (or a context that later throws) → static DOM
  // fallback instead of a white-screened app. The hero copy lives in
  // ScrollOverlay (DOM), so the page stays usable without the 3D layer.
  const [webgl] = useState(isWebGLAvailable);
  // DPR is a fixed cap (dpr={[1, tier.dprMax]} on the Canvas). Under frameloop
  // "demand" there's no PerformanceMonitor ramp — the GPU sleeps at rest instead,
  // which saves far more than shaving resolution ever did.

  // The journey only works if the visitor enters at the blank artboard (progress
  // 0). The 1080vh scroll driver mounts with this lazy chunk — AFTER Lenis init —
  // so a restored/native scroll position could otherwise drop you mid-journey (or
  // at the CTA). Force the start once the tall content has laid out.
  useEffect(() => {
    resetScroll();
    const r1 = requestAnimationFrame(() => {
      resetScroll();
      const r2 = requestAnimationFrame(() => resetScroll());
      void r2;
    });
    return () => cancelAnimationFrame(r1);
  }, []);

  useSeo({
    title: 'Velvet Letters — Cinematic Websites for Premium Brands',
    description:
      'Velvet Letters builds cinematic, immersive, custom websites — 3D, storytelling, SEO/GEO and conversion strategy. We make people stop, feel, remember, and act.',
    path: '/',
    jsonLd: [organizationLd, webPageLd('Velvet Letters', '/', 'Cinematic websites for premium brands.')],
  });

  const canvasFallback = <div className="canvas-fallback" aria-hidden />;

  return (
    <>
      <div className="fixed inset-0 z-0">
        <CanvasErrorBoundary fallback={canvasFallback}>
          {webgl ? (
            <Canvas
              frameloop="demand"
              dpr={[1, tier.dprMax]}
              gl={{ antialias: true, powerPreference: 'high-performance' }}
              camera={{ position: [0, 1.2, 16], fov: 40, near: 0.1, far: 1000 }}
              onCreated={({ gl }) => {
                gl.toneMapping = ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.0;
                // Beat 5 scrolls the fictional page inside its artboard frame via
                // world-space clipping planes on the page materials.
                gl.localClippingEnabled = true;
              }}
            >
              <Suspense fallback={null}>
                <World reducedMotion={reducedMotion} tier={tier} />
              </Suspense>
            </Canvas>
          ) : (
            canvasFallback
          )}
        </CanvasErrorBoundary>
      </div>

      <ScrollOverlay scrollTo={(id) => lenisScrollTo(`#${id}`)} />
    </>
  );
}
