import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { BEATS, press, seg } from '../lib/pressStore';
import { StudioEnvironment } from '../world/StudioEnvironment';
import { Backplate } from '../scenes/Backplate';
import { MIN_ASPECT, PressScene } from '../scenes/PressScene';
import { PressEffects } from '../scenes/PressEffects';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';

type Props = {
  reducedMotion: boolean;
  /** Run the depth-of-field / bloom pass (desktop tiers only). */
  effects: boolean;
  dprMax: number;
  webgl: boolean;
};

const CAPTION_SET = 'Metal type reads backwards. Scroll to pull the proof.';
const CAPTION_PULLED = 'First impression.';
/** Progress at which the sheet has slid in under the hero copy. */
const ON_PAPER_FROM = 0.41;

function World({ reducedMotion, effects }: { reducedMotion: boolean; effects: boolean }) {
  return (
    <>
      <Backplate />
      <StudioEnvironment />
      <ambientLight color="#15281e" intensity={0.3} />
      {/* Raking brass key: catches every bevel of the type and throws short shadows. */}
      <spotLight
        color="#ffdca8"
        intensity={210}
        distance={40}
        decay={2}
        angle={0.5}
        penumbra={1}
        position={[4.2, 6.5, 3.2]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <pointLight color="#3f9f72" intensity={46} distance={26} decay={2} position={[-4.2, 2.6, -4]} />
      <pointLight color="#ffe8cf" intensity={10} distance={18} decay={2} position={[-1, 3, 5]} />
      <PressScene reducedMotion={reducedMotion} />
      <PressEffects enabled={effects} />
    </>
  );
}

/**
 * The pinned opening act. A tall wrapper supplies the scroll span; the stage
 * inside it is sticky, so the 3D holds while the press run plays and then
 * scrolls away like any other section. The headline is real text: it starts
 * mirror-reversed (as type sits in the forme) and turns right-reading at the
 * same moment the printed sheet does.
 */
export function PressHero({ reducedMotion, effects, dprMax, webgl }: Props) {
  const wrap = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  // Stop rendering the canvas once the hero has scrolled away.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el || reducedMotion) return;
    let raf = 0;
    let last = -1;
    const tick = () => {
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0;
      if (p !== last) {
        last = p;
        press.progress = p;
        const turned = seg(p, BEATS.pull[0], BEATS.pull[0] + 0.14);
        if (headline.current) headline.current.style.transform = `rotateY(${180 * (1 - turned)}deg)`;
        if (caption.current) {
          const next = turned > 0.5 ? CAPTION_PULLED : CAPTION_SET;
          if (caption.current.textContent !== next) caption.current.textContent = next;
        }
        if (copy.current) {
          copy.current.style.opacity = String(1 - seg(p, 0.8, 0.9));
          // Once the sheet is under the copy, it reads as ink on paper. On
          // portrait screens the forme does not reach the headline, so it stays cream.
          const overSheet = window.innerWidth / window.innerHeight >= MIN_ASPECT;
          copy.current.classList.toggle('press-copy--on-paper', overSheet && p > ON_PAPER_FROM);
        }
        if (veil.current) veil.current.style.opacity = String(seg(p, 0.9, 1));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const fallback = <div className="press-fallback" aria-hidden />;

  return (
    <section
      ref={wrap}
      aria-label="Velvet Letters"
      className={`relative ${reducedMotion ? 'h-screen' : 'h-[380vh]'}`}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-pine-deep">
        <CanvasErrorBoundary fallback={fallback}>
          {webgl ? (
            <Canvas
              frameloop={reducedMotion ? 'demand' : onScreen ? 'always' : 'never'}
              shadows={{ type: PCFSoftShadowMap }}
              dpr={[1, dprMax]}
              gl={{ antialias: !effects, powerPreference: 'high-performance' }}
              camera={{ position: [-1.7, 0.95, 1.35], fov: 36, near: 0.1, far: 200 }}
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
            fallback
          )}
        </CanvasErrorBoundary>

        <div ref={copy} className="press-copy pointer-events-none absolute inset-0">
          <div className="press-copy__scrim" aria-hidden />
          <p className="press-eyebrow absolute left-6 top-[13vh] sm:left-10">
            Velvet Letters — cinematic web design
          </p>
          <div className="press-copy__lockup absolute inset-x-6 bottom-[11vh] flex flex-col items-center text-center sm:inset-x-10">
            <h1
              ref={headline}
              className={`press-headline ${reducedMotion ? '' : 'press-headline--set'}`}
            >
              We set your brand in type.
            </h1>
            <p ref={caption} className="press-caption">
              {reducedMotion ? CAPTION_PULLED : CAPTION_SET}
            </p>
          </div>
        </div>

        {/* The printed sheet becomes the page: fades to the paper colour below. */}
        <div ref={veil} className="pointer-events-none absolute inset-0 bg-bone opacity-0" aria-hidden />
      </div>
    </section>
  );
}
