import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFShadowMap } from 'three';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useDeviceTier } from '../lib/useDeviceTier';
import type { DeviceTier } from '../lib/useDeviceTier';
import { lenisScrollTo, resetScroll } from '../lib/useScrollProgress';
import { useSeo, organizationLd, webPageLd } from '../lib/seo';
import { CameraRig } from '../world/CameraRig';
import { Lights } from '../world/Lights';
import { Fog } from '../world/Fog';
import { Particles } from '../world/Particles';
import { Postprocessing } from '../world/Postprocessing';
import { StudioEnvironment } from '../world/StudioEnvironment';
import { SiteArtboardScene } from '../scenes/SiteArtboardScene';
import { ScrollOverlay } from '../components/ScrollOverlay';

function World({ reducedMotion, tier }: { reducedMotion: boolean; tier: DeviceTier }) {
  return (
    <>
      <Fog />
      <StudioEnvironment />
      <Lights reducedMotion={reducedMotion} />
      <Particles count={tier.particleCount} reducedMotion={reducedMotion} />
      <CameraRig reducedMotion={reducedMotion} />

      {/* One persistent scene: the fictional client site assembling on its
          artboard. No SceneGate cross-fades — the camera path IS the edit. */}
      <SiteArtboardScene reducedMotion={reducedMotion} />

      {tier.enablePost && (
        <Postprocessing enableChromatic={!tier.isMobile} multisampling={tier.isMobile ? 0 : 2} />
      )}
    </>
  );
}

export function HomePage() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  // DPR is a fixed cap (dpr={[1, tier.dprMax]} on the Canvas). Under frameloop
  // "demand" there's no PerformanceMonitor ramp — the GPU sleeps at rest instead,
  // which saves far more than shaving resolution ever did.

  // The zoom-parallax only works if the visitor enters at the hero (progress 0).
  // The 600vh+ scroll driver mounts with this lazy chunk — AFTER Lenis init — so a
  // restored/native scroll position can otherwise drop you mid-journey (or at the
  // CTA). Force the start to the hero once the tall content has laid out.
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

  return (
    <>
      <div className="fixed inset-0 z-0">
        <Canvas
          frameloop="demand"
          dpr={[1, tier.dprMax]}
          shadows={{ type: PCFShadowMap }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
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
      </div>

      <ScrollOverlay scrollTo={(id) => lenisScrollTo(`#${id}`)} />
    </>
  );
}
