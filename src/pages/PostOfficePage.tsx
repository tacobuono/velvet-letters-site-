import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeo, webPageLd, breadcrumbLd } from '../lib/seo';
import { SiteFooter } from '../layout/SiteFooter';

// The original Three.js game is preserved verbatim at public/post-office-game/
// (branded plural in-source) and embedded in an iframe so its functionality —
// floating envelopes, hidden stamps, score, letter popups, custom cursor — stays
// intact. The game posts VELVET_LETTERS_POST_OFFICE_COMPLETE to the parent when all
// stamps are found; this route listens and reveals the reward. Full React/R3F port
// is the documented next step (SEO_GEO_AUDIT.md).

export function PostOfficePage() {
  useSeo({
    title: 'The Post Office — a hidden Velvet Letters experience',
    description:
      'Open the floating letters and find the hidden stamps. A small interactive experience from Velvet Letters — and a glimpse of how deeply people explore a world worth exploring.',
    path: '/post-office',
    jsonLd: [
      webPageLd('The Velvet Letters Post Office', '/post-office', 'An interactive Easter-egg experience.'),
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Post Office', path: '/post-office' }]),
    ],
  });

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as { type?: string } | null;
      if (data && data.type === 'VELVET_LETTERS_POST_OFFICE_COMPLETE') setCompleted(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="bg-velvet-deep text-cream">
      <header className="mx-auto max-w-[1500px] px-6 pb-8 pt-32 text-center sm:px-10 sm:pt-40">
        <p className="font-ui text-[0.7rem] uppercase tracking-[0.45em] text-gold">A hidden experience</p>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.6rem,7vw,6rem)] font-black leading-[0.95]">
          The Post Office
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-editorial text-2xl leading-relaxed text-gold-light">
          Float through the dark and open the letters. Some hide a wax-sealed stamp. Find all seven —
          and you’ll understand exactly what Velvet Letters builds.
        </p>
        <p className="mx-auto mt-4 max-w-xl font-ui text-sm text-cream/60">
          Best on desktop with a mouse. Move to drift, click an envelope to open a letter. Prefers-reduced-motion
          and keyboard users: the reward and next step are always available below — no play required.
        </p>
      </header>

      {/* The preserved game, isolated in an iframe (lazy-loaded) */}
      <section className="mx-auto max-w-[1500px] px-4 sm:px-10">
        <div className="overflow-hidden rounded-2xl border border-gold/25 bg-black shadow-[0_40px_120px_-40px_rgba(201,168,76,0.35)]">
          <iframe
            src="/post-office-game/"
            title="Velvet Letters Post Office — open letters and find the hidden stamps"
            className="h-[78vh] w-full bg-black"
            loading="lazy"
          />
        </div>
      </section>

      {/* Reward — always visible (accessible, not locked behind the canvas); upgrades when completed */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <p className="font-ui text-[0.7rem] uppercase tracking-[0.4em] text-gold">
          {completed ? '✦ Unlocked' : 'The reward'}
        </p>
        <h2 className="mt-5 font-display text-[clamp(1.8rem,4.5vw,3.4rem)] font-bold leading-tight">
          {completed ? 'You found the hidden letters.' : 'Find the hidden letters.'}
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-editorial text-xl leading-relaxed text-cream/80">
          Want Velvet Letters to build an experience people explore this deeply? That curiosity is exactly
          what a Velvet Letters site does to your customers.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="rounded-full bg-gold px-9 py-4 font-ui text-[0.8rem] uppercase tracking-[0.22em] text-velvet-deep no-underline transition-transform hover:-translate-y-0.5"
          >
            Start a project
          </Link>
          <Link
            to="/styles"
            className="rounded-full border border-gold px-9 py-4 font-ui text-[0.8rem] uppercase tracking-[0.22em] text-gold no-underline"
          >
            Explore website styles
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
