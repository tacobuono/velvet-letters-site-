import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { scroll } from '../lib/scrollStore';
import { CONTACT_EMAIL } from '../lib/tokens';
import { SiteFooter } from '../layout/SiteFooter';

type Props = { scrollTo: (id: string) => void };

// Beats, in scroll order. Local to the boxed home so beats can be added without
// touching the shared SECTIONS list. The tall scroll driver renders one section
// per id; the cross-fade maps normalized progress across (BEATS.length - 1).
const BEAT_IDS = [
  'intro',
  'product-1',
  'product-2',
  'product-3',
  'product-4',
  'manifesto',
  'ship',
] as const;

// Cross-fade shape (in beat-widths): a full-opacity plateau (HOLD) then a clean
// smoothstep falloff (FADE) so adjacent panels never double-expose — a film cut.
const HOLD = 0.34;
const FADE = 0.2;

// Every panel but the intro starts hidden, so nothing off-beat is visible or
// focusable in the frame before the rAF loop takes over the inline styles.
const INITIALLY_HIDDEN: CSSProperties = { opacity: 0, visibility: 'hidden' };

type Fact = [string, string];
type Product = {
  n: string;
  kind: string;
  tagline: string;
  net: string;
  ingredients: string;
  note: string;
  facts: Fact[];
};

const BASE_FACTS: Fact[] = [
  ['Immersion', '96%'],
  ['Recall', '93%'],
  ['Craft', '99%'],
  ['Differentiation', '94%'],
  ['Templates', '0%'],
  ['Boring projects', '0%'],
];

const PRODUCTS: Product[] = [
  {
    n: '01',
    kind: 'Cinematic Websites',
    tagline: 'Films you can click.',
    net: 'One flagship site',
    ingredients: 'Art direction, lighting, pacing, motion design, 3D, sound.',
    note: 'Best served full-screen.',
    facts: [['Load time', '< 2s'], ...BASE_FACTS],
  },
  {
    n: '02',
    kind: 'Immersive 3D',
    tagline: 'Worlds, not pages.',
    net: 'Real-time WebGL',
    ingredients: 'WebGL, shaders, real-time lighting, GLB pipeline, physics.',
    note: 'Keep your GPU warm.',
    facts: [['Depth', 'Genuine'], ...BASE_FACTS],
  },
  {
    n: '03',
    kind: 'Story & UX',
    tagline: 'Scroll that earns attention.',
    net: 'Narrative + interface',
    ingredients: 'Narrative, UX, interaction design, copy, conversion paths.',
    note: 'Contains the daily dose of clarity.',
    facts: [['Clarity', '98%'], ...BASE_FACTS],
  },
  {
    n: '04',
    kind: 'SEO / Conversion',
    tagline: 'Beautiful and found.',
    net: 'Built to be found',
    ingredients: 'Technical SEO, GEO, entities, structured data, funnels.',
    note: 'May cause sudden growth.',
    facts: [['Visibility', 'High'], ...BASE_FACTS],
  },
];

function SpecLabel({ p, side }: { p: Product; side: 'left' | 'right' }) {
  return (
    <div className={`spec-label ${side === 'left' ? 'spec-label--left' : 'spec-label--right'}`}>
      <div className="spec-card">
        <div className="spec-card__top">
          <span>Velvet Letters ®</span>
          <span>No. {p.n}</span>
        </div>
        <h2 className="spec-card__title">{p.kind}</h2>
        <p className="spec-card__tag">{p.tagline}</p>
        <p className="spec-card__net">Net contents — {p.net}</p>
        <dl className="spec-card__facts">
          {p.facts.map(([k, v]) => (
            <div key={k} className="spec-card__fact">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="spec-card__ing">
          <strong>Ingredients:</strong> {p.ingredients}
        </p>
        <p className="spec-card__note">* {p.note}</p>
        <div className="spec-card__foot">
          <span className="barcode" aria-hidden />
          <span className="spec-card__stamp">Purchased</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Fixed, cross-fading DOM over the boxed-parcel canvas. One panel per beat: the
 * justified-grotesk intro, four product spec-labels (the parcel holds centre
 * while the label changes), a manifesto, and a closing call. A tall spacer (one
 * section per beat) drives the scroll length; opacity is written imperatively in
 * a rAF loop so there's no per-frame React render.
 */
export function BoxedOverlay({ scrollTo }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const panels = Array.from(overlay.querySelectorAll<HTMLElement>('[data-panel]'));
    // Reduced motion keeps the cross-fade but drops the parallax drift.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let lastProgress = -1;
    const tick = () => {
      const progress = scroll.progress;
      if (progress !== lastProgress) {
        lastProgress = progress;
        const pos = progress * (BEAT_IDS.length - 1);
        for (const el of panels) {
          const i = Number(el.dataset.panel);
          const dist = Math.abs(pos - i);
          const t = Math.min(Math.max((dist - HOLD) / FADE, 0), 1);
          const opacity = 1 - t * t * (3 - 2 * t);
          el.style.opacity = String(opacity);
          if (!reduce) el.style.transform = `translateY(${(pos - i) * 18}px)`;
          el.style.visibility = opacity < 0.02 ? 'hidden' : 'visible';
        }
        if (counterRef.current) {
          const idx = Math.round(pos);
          let num = '00';
          let label = 'Opening the box';
          if (idx >= 1 && idx <= 4) {
            num = PRODUCTS[idx - 1].n;
            label = PRODUCTS[idx - 1].kind;
          } else if (idx === 5) {
            num = '05';
            label = 'Brave brands only';
          } else if (idx >= 6) {
            num = '06';
            label = 'Ready to ship';
          }
          counterRef.current.textContent = `#${num} · ${label}`;
          // Fade the counter out as the footer rises on the final beat.
          counterRef.current.style.opacity = pos > 5.5 ? String(Math.max(0, 1 - (pos - 5.5) / 0.5)) : '1';
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* Scroll driver: one tall section per beat. */}
      <div className="relative z-[3]">
        {BEAT_IDS.map((id) => (
          <section key={id} id={id} className="h-[185vh] w-full" aria-hidden />
        ))}
      </div>

      {/* Fixed cross-fading panels. */}
      <div ref={overlayRef} className="pointer-events-none fixed inset-0 z-[5]">
        {/* Beat 0 — the intro, Silencio-style justified grotesk. */}
        <div
          data-panel={0}
          className="absolute inset-0 flex flex-col items-center justify-end px-6 pt-[13vh] pb-[10vh] text-center sm:justify-between"
        >
          <div className="boxed-hero-scrim" aria-hidden />
          {/* Eyebrow row is desktop-only: on phones it would sit on top of the parcel. */}
          <div className="relative hidden w-full max-w-[1100px] items-center justify-between font-grotesk text-[0.62rem] uppercase tracking-[0.3em] text-cream/70 sm:flex">
            <span>® Velvet Letters — Cinematic Web Design</span>
            <span className="hidden sm:inline">Est. MMXXV · Ships worldwide</span>
          </div>

          <div className="relative flex w-full max-w-[1040px] flex-col items-center gap-7">
            <h1 className="boxed-hero font-grotesk">
              Velvet Letters packages cinematic websites for brands that refuse to
              blend in — design, motion, 3D and story, sealed and delivered.
            </h1>
            <span className="handle-pill font-grotesk">⚠ Handle with care</span>
            <button
              onClick={() => scrollTo(BEAT_IDS[1])}
              className="boxed-accent pointer-events-auto cursor-pointer bg-transparent font-grotesk text-[0.62rem] uppercase tracking-[0.3em]"
            >
              Open the box ↓
            </button>
          </div>
        </div>

        {/* Beats 1–4 — product spec labels (parcel holds centre). */}
        {PRODUCTS.map((p, i) => (
          <div
            key={p.n}
            data-panel={i + 1}
            style={INITIALLY_HIDDEN}
            className="absolute inset-0 flex items-end pb-[11vh] sm:items-center sm:pb-0"
          >
            <SpecLabel p={p} side={i % 2 === 0 ? 'left' : 'right'} />
          </div>
        ))}

        {/* Beat 5 — manifesto (no invented clients; a stance, not a logo wall). */}
        <div
          data-panel={5}
          style={INITIALLY_HIDDEN}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="boxed-hero-scrim" aria-hidden />
          <p className="boxed-accent relative mb-5 font-grotesk text-[0.62rem] uppercase tracking-[0.35em]">
            Brave brands only
          </p>
          <h2 className="boxed-manifesto font-grotesk relative">
            Not for everyone. For the ones who would rather be unforgettable than safe.
          </h2>
          <p className="relative mt-7 max-w-[46ch] font-editorial text-[1.15rem] font-light italic text-cream/75">
            One flagship site a quarter. We disappear into your world, then package it
            so it can't be scrolled past.
          </p>
        </div>

        {/* Beat 6 — ship / CTA. */}
        {/* Column layout: the call takes the space above the footer, so the two
            can never overlap however short the viewport is. */}
        <div data-panel={6} style={INITIALLY_HIDDEN} className="absolute inset-0 flex flex-col">
          <div className="cta-scrim" aria-hidden />
          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6 pt-16 text-center">
            <p className="boxed-accent mb-5 font-grotesk text-[0.62rem] uppercase tracking-[0.35em]">
              Your brand, boxed
            </p>
            <h2 className="boxed-cta font-grotesk">Ready to ship?</h2>
            <p className="mb-9 mt-4 max-w-[36ch] font-editorial text-[1.15rem] font-light text-cream/80">
              One flagship site a quarter. If yours is next, let's seal it.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="boxed-btn pointer-events-auto px-12 py-4 font-grotesk text-[0.72rem] uppercase tracking-[0.28em] no-underline hover:-translate-y-0.5"
              >
                Start a project
              </a>
              <Link
                to="/styles"
                className="boxed-btn-ghost pointer-events-auto px-12 py-4 font-grotesk text-[0.72rem] uppercase tracking-[0.28em] no-underline"
              >
                See the range
              </Link>
            </div>
          </div>
          {/* Full footer from tablet up. On phones its stacked columns would fill
              the whole fixed panel and squeeze out the call, so it collapses to
              one line; the other pages stay reachable from the nav menu. */}
          <div className="pointer-events-auto relative hidden w-full text-left sm:block">
            <SiteFooter />
          </div>
          <div className="pointer-events-auto relative border-t border-brass/15 bg-pine-deep px-6 py-5 text-center font-grotesk text-[0.66rem] uppercase tracking-[0.2em] text-cream/60 sm:hidden">
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-brass no-underline">
              {CONTACT_EMAIL}
            </a>
            <p className="mt-2">© {2025} Velvet Letters Studio</p>
          </div>
        </div>

        {/* Persistent bottom counter — the #0X / name of the current beat. */}
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <span ref={counterRef} className="boxed-counter font-grotesk">
            #00 · Opening the box
          </span>
        </div>
      </div>
    </>
  );
}
