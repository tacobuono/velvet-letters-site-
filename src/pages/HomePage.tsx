import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useDeviceTier } from '../lib/useDeviceTier';
import { lenisScrollTo, resetScroll } from '../lib/useScrollProgress';
import { useSeo, organizationLd, webPageLd } from '../lib/seo';
import { StudioEnvironment } from '../world/StudioEnvironment';
import { Backplate } from '../scenes/Backplate';
import { BoxedParcel } from '../scenes/BoxedParcel';
import { BoxedEffects } from '../scenes/BoxedEffects';
import { BoxedOverlay } from '../components/BoxedOverlay';
import { CanvasErrorBoundary } from '../components/CanvasErrorBoundary';
import { isWebGLAvailable } from '../lib/webgl';

function World({ reducedMotion, effects }: { reducedMotion: boolean; effects: boolean }) {
  return (
    <>
      {/* Photoreal dark-studio set, deep behind the parcel (bokeh via DOF). */}
      <Backplate />

      {/* Procedural IBL for the metal + velvet reflections (no HDRI download). */}
      <StudioEnvironment />

      {/* Lighting matched to the photoreal backplate: a warm key from high
          centre (the plate's spotlight), a cool rim from behind-left, and a
          low warm fill from camera-right so the velvet face isn't dead black. */}
      <ambientLight color="#15281e" intensity={0.22} />
      <spotLight
        color="#ffdca8"
        intensity={270}
        distance={34}
        decay={2}
        angle={0.58}
        penumbra={1}
        position={[0.6, 6.6, 3.4]}
      />
      {/* Cool emerald rim on both back edges — carves the parcel out of the pine set. */}
      <pointLight color="#3f9f72" intensity={48} distance={26} decay={2} position={[-3.6, 2.8, -4]} />
      <pointLight color="#4fae84" intensity={30} distance={24} decay={2} position={[3.6, 2.4, -3.6]} />
      {/* Low brass fill from camera-right so the velvet face isn't dead black. */}
      <pointLight color="#d8b070" intensity={14} distance={20} decay={2} position={[3.2, 1.2, 3]} />
      {/* Soft warm front fill so the velvet face toward camera reads, not a silhouette. */}
      <pointLight color="#ffe8cf" intensity={12} distance={18} decay={2} position={[0, 1.4, 5.2]} />

      <BoxedParcel reducedMotion={reducedMotion} />

      {/* Grounds the parcel in the plate's light pool. Baked once (frames={1}):
          at this blur a turning box casts a near-constant soft blob, so
          re-rendering the shadow map every frame bought nothing. */}
      <ContactShadows
        position={[0, -1.12, 0]}
        opacity={0.62}
        blur={2.6}
        scale={9}
        far={4.2}
        resolution={256}
        frames={1}
        color="#000000"
      />

      {/* Cinematic grade — off for reduced-motion / low-tier devices. */}
      <BoxedEffects enabled={effects} />
    </>
  );
}

export function HomePage() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const [webgl] = useState(isWebGLAvailable);
  // The postprocessing composer does its own multisampling, so the canvas's
  // built-in MSAA is switched off whenever the composer is on (never both).
  const effects = !reducedMotion && tier.dprMax > 1;

  // Enter at the intro (progress 0): the tall scroll driver mounts with this lazy
  // chunk after Lenis init, so a restored position could otherwise drop mid-journey.
  useEffect(() => {
    resetScroll();
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      resetScroll();
      r2 = requestAnimationFrame(() => resetScroll());
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);

  useSeo({
    title: 'Velvet Letters — Cinematic Websites for Premium Brands',
    description:
      'Velvet Letters packages cinematic, immersive websites — design, motion, 3D, story, SEO and conversion — sealed and delivered. We make people stop, feel, remember, and act.',
    path: '/',
    jsonLd: [organizationLd, webPageLd('Velvet Letters', '/', 'Cinematic websites for premium brands.')],
  });

  const canvasFallback = <div className="canvas-fallback" aria-hidden />;

  return (
    <>
      {/* Photoreal dark-studio backplate — the hyperreal set the parcel sits in. */}
      <div className="boxed-plate" aria-hidden />

      <div className="fixed inset-0 z-[1]">
        <CanvasErrorBoundary fallback={canvasFallback}>
          {webgl ? (
            <Canvas
              frameloop={reducedMotion ? 'demand' : 'always'}
              dpr={[1, tier.dprMax]}
              gl={{ antialias: !effects, alpha: true, powerPreference: 'high-performance' }}
              camera={{ position: [0, 0.5, 6.2], fov: 36, near: 0.1, far: 1000 }}
              onCreated={({ gl }) => {
                gl.toneMapping = ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.05;
              }}
            >
              <Suspense fallback={null}>
                <World reducedMotion={reducedMotion} effects={effects} />
              </Suspense>
            </Canvas>
          ) : (
            canvasFallback
          )}
        </CanvasErrorBoundary>
      </div>

      <BoxedOverlay scrollTo={(id) => lenisScrollTo(`#${id}`)} />
    </>
  );
}
