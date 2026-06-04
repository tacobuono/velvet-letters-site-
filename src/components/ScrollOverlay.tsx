import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { scroll } from '../lib/scrollStore';
import { SECTIONS } from '../data/content';
import { HERO, PHILOSOPHY, SERVICES, PROCESS, MANIFESTO, CTA } from '../data/content';
import { CONTACT_EMAIL } from '../lib/tokens';
import { Footer } from './Footer';

type Props = { scrollTo: (id: string) => void };

const FADE_WINDOW = 0.62; // how many section-widths of scroll a panel stays visible

/**
 * Fixed, cross-fading DOM copy — one panel per scene, positioned per the brief.
 * A tall (600vh) spacer drives the scroll length; the canvas sits fixed behind.
 * Opacity is updated imperatively in a rAF loop to avoid per-frame React renders.
 */
export function ScrollOverlay({ scrollTo }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const panels = Array.from(overlay.querySelectorAll<HTMLElement>('[data-panel]'));
    let raf = 0;
    const tick = () => {
      const pos = scroll.progress * (SECTIONS.length - 1);
      for (const el of panels) {
        const i = Number(el.dataset.panel);
        const dist = Math.abs(pos - i);
        const opacity = Math.max(0, 1 - dist / FADE_WINDOW);
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${(pos - i) * 24}px)`;
        el.style.visibility = opacity < 0.02 ? 'hidden' : 'visible';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* Scroll driver: tall anchors, one per section. Each is 180vh so the
          camera dolly between waypoints has lots of scroll distance to breathe —
          slower, more cinematic per the luxury reveal feel. */}
      <div className="relative z-[3]">
        {SECTIONS.map((id) => (
          <section key={id} id={id} className="h-[180vh] w-full" aria-hidden />
        ))}
      </div>

      {/* Fixed, cross-fading copy panels. */}
      <div ref={overlayRef} className="pointer-events-none fixed inset-0 z-[5]">
        {/* Hero — centered. A soft radial scrim sits behind the text so the
            headline stays instantly readable over the 3D letters. */}
        <div
          data-panel={0}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="hero-scrim" aria-hidden />
          <p className="relative mb-6 font-ui text-[0.8rem] font-light uppercase tracking-[0.45em] text-gold">
            {HERO.eyebrow}
          </p>
          <h1 className="relative mx-auto max-w-[16ch] font-display text-[clamp(2.4rem,6.5vw,5.6rem)] font-black leading-[0.98] text-cream drop-shadow-[0_2px_30px_rgba(0,0,0,0.75)]">
            {HERO.h1Lead}{' '}
            <span className="italic font-normal text-gold">{HERO.h1Em}</span>
          </h1>
          <p className="relative mx-auto mt-7 max-w-[560px] font-editorial text-[clamp(1.1rem,2vw,1.5rem)] font-light leading-relaxed text-gold-light">
            {HERO.sub}
          </p>
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="pointer-events-auto rounded-full bg-gold px-10 py-4 font-ui text-[0.8rem] uppercase tracking-[0.28em] text-velvet-deep no-underline transition-transform hover:-translate-y-0.5"
            >
              Start a project
            </Link>
            <Link
              to="/styles"
              className="pointer-events-auto rounded-full border border-gold px-10 py-4 font-ui text-[0.8rem] uppercase tracking-[0.28em] text-gold no-underline transition-colors hover:bg-gold/10"
            >
              Explore website styles
            </Link>
          </div>
          <button
            onClick={() => scrollTo('cta')}
            className="pointer-events-auto relative mt-6 cursor-pointer bg-transparent font-ui text-[0.72rem] uppercase tracking-[0.3em] text-cream/70 underline-offset-4 hover:text-gold hover:underline"
          >
            See the process ↓
          </button>
        </div>

        {/* Philosophy — pinned left */}
        <div
          data-panel={1}
          className="absolute inset-y-0 left-0 flex max-w-[640px] flex-col justify-center px-8 sm:px-16"
        >
          <p className="mb-6 font-ui text-[0.7rem] uppercase tracking-[0.4em] text-gold">{PHILOSOPHY.label}</p>
          <h2 className="mb-6 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-tight text-cream">
            {PHILOSOPHY.headingLead} <em className="not-italic text-gold">{PHILOSOPHY.headingEm}</em>
          </h2>
          <p className="font-editorial text-[1.15rem] font-light leading-[1.9] text-cream/70">{PHILOSOPHY.body}</p>
        </div>

        {/* Services — pinned right */}
        <div
          data-panel={2}
          className="absolute inset-y-0 right-0 flex max-w-[560px] flex-col justify-center px-8 text-right sm:px-16"
        >
          <p className="mb-6 font-ui text-[0.7rem] uppercase tracking-[0.4em] text-gold">What We Do</p>
          <h2 className="mb-8 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold text-cream">
            Crafted <em className="italic text-gold">Services</em>
          </h2>
          <ul className="flex flex-col gap-4">
            {SERVICES.map((s) => (
              <li key={s.number} className="border-r-2 border-gold/30 pr-4">
                <span className="font-display text-sm text-gold">{s.number}</span>
                <h3 className="font-display text-lg font-bold text-cream">{s.title}</h3>
                <p className="font-editorial text-[0.95rem] leading-relaxed text-cream/60">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Process — pinned center bottom */}
        <div
          data-panel={3}
          className="absolute inset-x-0 bottom-[12vh] flex flex-col items-center px-6 text-center"
        >
          <p className="mb-3 font-ui text-[0.7rem] uppercase tracking-[0.4em] text-gold">How We Work</p>
          <h2 className="mb-8 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold text-cream">
            The <em className="italic text-gold">Velvet</em> Process
          </h2>
          <div className="grid max-w-[1000px] grid-cols-1 gap-6 sm:grid-cols-4">
            {PROCESS.map((step) => (
              <div key={step.numeral}>
                <div className="mb-1 font-display text-sm font-bold text-gold">{step.numeral}</div>
                <h3 className="mb-1 font-display text-base font-bold text-cream">{step.title}</h3>
                <p className="font-editorial text-[0.9rem] leading-relaxed text-cream/60">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial — centered */}
        <div
          data-panel={4}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="mx-auto max-w-[800px] font-editorial text-[clamp(1.5rem,3vw,2.5rem)] font-light italic leading-[1.7] text-cream">
            {MANIFESTO.quote}
          </p>
          <p className="mt-6 font-ui text-[0.8rem] uppercase tracking-[0.3em] text-gold">{MANIFESTO.attribution}</p>
        </div>

        {/* CTA — centered, with footer */}
        <div
          data-panel={5}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <h2 className="mb-6 font-display text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.1] text-cream">
            {CTA.headingLead}
            <br />
            <em className="italic text-gold">{CTA.headingEm}</em>
          </h2>
          <p className="mb-10 font-editorial text-[1.2rem] font-light text-cream/60">{CTA.sub}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="pointer-events-auto bg-gold px-16 py-5 font-ui text-[0.8rem] font-medium uppercase tracking-[0.3em] text-velvet-deep no-underline transition-transform hover:-translate-y-0.5"
          >
            {CTA.button}
          </a>
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 w-full">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
