import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { invalidate } from '@react-three/fiber';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scroll } from './scrollStore';
import { SECTIONS } from '../data/content';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Module-level handle so any component (CTA buttons, hero) can drive the shared
// smooth scroll without prop/context plumbing. Falls back to native scroll.
let activeLenis: Lenis | null = null;

export function lenisScrollTo(target: string | HTMLElement | number, offset = 0) {
  if (activeLenis) {
    activeLenis.scrollTo(target, { offset });
    return;
  }
  const el =
    typeof target === 'string'
      ? document.querySelector(target)
      : target instanceof HTMLElement
        ? target
        : null;
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
}

/** Scroll the window/Lenis back to the top instantly (used on route change). */
export function resetScroll() {
  scroll.progress = 0;
  scroll.section = 0;
  scroll.velocity = 0;
  if (activeLenis) activeLenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
  invalidate(); // render the reset frame under frameloop="demand"
}

/**
 * Sets up Lenis smooth scrolling, bridges it to GSAP's ticker + ScrollTrigger,
 * and writes a normalized 0..1 progress value into the shared scroll store on
 * every frame. R3F reads that store inside useFrame — one source of truth.
 *
 * Returns the Lenis instance (or null) so callers can drive programmatic scroll.
 */
export function useLenis(onUpdate?: () => void): React.RefObject<Lenis | null> {
  const reducedMotion = useReducedMotion();
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    // Reduced motion: skip smooth scroll entirely, fall back to native scroll
    // and derive progress from window scroll position.
    if (reducedMotion) {
      const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scroll.progress = max > 0 ? window.scrollY / max : 0;
        scroll.section = Math.round(scroll.progress * (SECTIONS.length - 1));
        invalidate();
        onUpdate?.();
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      return () => {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      };
    }

    const lenis = new Lenis({
      // Tighter glide: the old 1.8s/0.75 "luxury" tuning lagged so far behind
      // the wheel that the journey read as swimmy, not smooth. 1.1s with a 1:1
      // wheel keeps the cinematic ease but tracks the hand.
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.1,
    });
    ref.current = lenis;
    activeLenis = lenis;
    lenis.scrollTo(0, { immediate: true });
    scroll.progress = 0;
    // Dev-only handle so E2E / manual tuning can drive scroll deterministically.
    if (import.meta.env.DEV) {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    lenis.on('scroll', (e: { scroll: number; limit: number; velocity: number }) => {
      const limit = e.limit || 1;
      scroll.progress = Math.min(Math.max(e.scroll / limit, 0), 1);
      scroll.velocity = e.velocity;
      scroll.section = Math.round(scroll.progress * (SECTIONS.length - 1));
      ScrollTrigger.update();
      invalidate(); // demand-mode: wake the R3F loop for this scroll frame
      onUpdate?.();
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ref.current = null;
      activeLenis = null;
    };
    // onUpdate is stable (defined once); intentionally excluded to avoid teardown churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return ref;
}
