import { useEffect, useState } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useDeviceTier } from '../lib/useDeviceTier';
import { resetScroll } from '../lib/useScrollProgress';
import { useSeo, organizationLd, webPageLd } from '../lib/seo';
import { PressHero } from '../components/PressHero';
import { PressSheet } from '../components/PressSheet';
import { PressMarks } from '../components/PressMarks';
import { SiteFooter } from '../layout/SiteFooter';
import { isWebGLAvailable } from '../lib/webgl';

/**
 * Home: "The Press". A pinned 3D opening act (the forme, the impression, the
 * sheet turning over) and then the printed sheet itself as an ordinary page.
 */
export function HomePage() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const [webgl] = useState(isWebGLAvailable);
  // The postprocessing composer does its own multisampling, so the canvas's
  // built-in MSAA is switched off whenever the composer is on (never both).
  const effects = !reducedMotion && tier.dprMax > 1;

  // Always enter at the top: a restored scroll position would drop the visitor
  // mid-run, after the impression has already been pulled.
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
      'Velvet Letters sets brands in type: cinematic, immersive websites — design, motion, 3D, story, SEO and conversion. We make people stop, feel, remember, and act.',
    path: '/',
    jsonLd: [organizationLd, webPageLd('Velvet Letters', '/', 'Cinematic websites for premium brands.')],
  });

  return (
    <>
      <PressMarks />
      <PressHero reducedMotion={reducedMotion} effects={effects} dprMax={tier.dprMax} webgl={webgl} />
      <PressSheet />
      <SiteFooter />
    </>
  );
}
