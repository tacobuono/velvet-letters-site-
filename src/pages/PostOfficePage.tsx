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
      'Open the floating letters and find the hidden stamps. A small interactive experience from Velvet Letters, and a glimpse of how deeply people explore a world worth exploring.',
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
    <div className="pressroom">
      <header className="imprint pb-10 text-center">
        <p className="imprint__rule">
          <span>Velvet Letters · Press &amp; Foundry</span>
          <span>Back of house · the sorting room</span>
        </p>
        <h1 className="imprint__title mx-auto">The Post Office</h1>
        <p className="press-lede mx-auto">
          Where the letters go once they are printed. Drift through the dark, open the envelopes, and find the
          seven that carry a wax seal. Find them all and you will know exactly what this press makes.
        </p>
        <p className="mx-auto mt-4 max-w-xl font-grotesk text-sm text-cream/60">
          Best on desktop with a mouse: move to drift, click an envelope to open it. If you prefer reduced
          motion or a keyboard, the next step is always available below. No play required.
        </p>
      </header>

      {/* The preserved game, framed like a wall of pigeonholes */}
      <section className="pigeonholes" aria-label="The Post Office game">
        <div className="pigeonholes__frame">
          <iframe
            src="/post-office-game/"
            title="Velvet Letters Post Office — open letters and find the hidden stamps"
            loading="lazy"
          />
        </div>
        <p className="pigeonholes__caption">
          <span>Seven sealed letters</span>
          <span>{completed ? 'All found' : 'Still sorting'}</span>
        </p>
      </section>

      {/* Reward — always visible, upgrades when completed */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <div className={`postmark ${completed ? 'postmark--struck' : ''}`} aria-hidden>
          <span>
            Velvet Letters
            <b>{completed ? 'Delivered' : 'In transit'}</b>
            {completed ? 'all seven found' : 'seven to find'}
          </span>
        </div>
        <h2 className="press-h2 text-center">
          {completed ? 'You found every sealed letter.' : 'Find the sealed letters.'}
        </h2>
        <p className="press-lede mx-auto">
          That curiosity, the pull to open one more, is exactly what a Velvet Letters site does to your
          customers. Want one that people explore this deeply?
        </p>
        <div className="press-run__actions">
          <Link to="/contact" className="sort-btn">
            Open a job ticket
          </Link>
          <Link to="/styles" className="sort-btn sort-btn--lead">
            Browse the specimens
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
