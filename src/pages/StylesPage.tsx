import { Link } from 'react-router-dom';
import { useSeo, webPageLd, breadcrumbLd } from '../lib/seo';
import { useReveal } from '../lib/useReveal';
import { CTASection } from '../layout/CTASection';
import { SiteFooter } from '../layout/SiteFooter';

type Style = {
  key: string;
  title: string;
  promise: string;
  feel: string;
  fit: string;
  outcome: string;
};

const STYLES: Style[] = [
  { key: '3d', title: '3D Websites', promise: 'A real-time brand object visitors can almost reach out and touch.', feel: 'Wonder. Tactility. “How is this in a browser?”', fit: 'Product brands, launches, anything better seen in the round.', outcome: 'Longer dwell time and a product people remember in 3D.' },
  { key: 'immersive', title: 'Immersive Websites', promise: 'A space the camera moves through — visitors travel it, they don’t skim it.', feel: 'Presence. Depth. Being somewhere, not on a page.', fit: 'Studios, experiences, brands that want to feel like a place.', outcome: 'A signature experience competitors can’t copy with a template.' },
  { key: 'effective', title: 'Effective / Conversion', promise: 'A clean, engineered path with every signal pointed at the action.', feel: 'Clarity. Confidence. “I know exactly what to do.”', fit: 'Lead-gen, SaaS, and offers where conversion is the whole game.', outcome: 'Measurably higher conversion from the same traffic.' },
  { key: 'storytelling', title: 'Storytelling Websites', promise: 'A site that unfolds like a letter — chapters that earn attention.', feel: 'Intrigue. Emotion. The pull to keep scrolling.', fit: 'Founders, missions, and brands with something to say.', outcome: 'Visitors who finish the story and feel something at the end.' },
  { key: 'geo', title: 'SEO / GEO Websites', promise: 'Built to be found — by search engines and answer engines alike.', feel: 'Trust. Authority. Being the recommended answer.', fit: 'Brands that need to be discovered, cited, and recommended.', outcome: 'More qualified discovery from search and AI assistants.' },
  { key: 'cinematic', title: 'Cinematic Websites', promise: 'Lighting, lensing, pacing and motion — composed like film.', feel: 'Awe. Premium calm. The hush before a great shot.', fit: 'Premium brands that want to be felt, not skimmed.', outcome: 'A first impression that reads as expensive and intentional.' },
  { key: 'custom', title: 'Custom Websites', promise: 'Modular fragments engineered into a system that exists nowhere else.', feel: 'Distinction. “This could only be them.”', fit: 'Brands whose identity deserves its own design language.', outcome: 'A site that becomes part of the brand’s identity, not a layer on top.' },
  { key: 'luxury', title: 'Luxury Websites', promise: 'Tactile materials, disciplined restraint, shadows that ground everything.', feel: 'Quiet confidence. Expensive without shouting.', fit: 'Heritage, hospitality, and high-consideration purchases.', outcome: 'Perceived value that justifies a premium price.' },
];

function StyleScene({ k }: { k: string }) {
  return (
    <div className={`style-scene scene-${k}`} aria-hidden>
      {k === '3d' && <div className="s3d-cube"><span /><span /><span /><span /><span /><span /></div>}
      {k === 'immersive' && <div className="s-imm"><i /><i /><i /><i /></div>}
      {k === 'effective' && <div className="s-eff"><i /><i /><i /><b /></div>}
      {k === 'storytelling' && <div className="s-story"><i /><i /><i /></div>}
      {k === 'geo' && <div className="s-geo"><i /><i /><i /><i /><i /></div>}
      {k === 'cinematic' && <div className="s-cine"><i /><i /><i /></div>}
      {k === 'custom' && <div className="s-custom"><i /><i /><i /><i /></div>}
      {k === 'luxury' && <div className="s-lux"><i /></div>}
    </div>
  );
}

export function StylesPage() {
  useSeo({
    title: 'Styles — The Velvet Letters Website Worlds Showroom',
    description:
      'A showroom of website worlds: 3D, immersive, conversion-focused, storytelling, SEO/GEO, cinematic, custom, and luxury — each a purchasable experience engineered to an outcome.',
    path: '/styles',
    jsonLd: [
      webPageLd('Website Styles Showroom', '/styles', 'The website worlds Velvet Letters builds.'),
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Styles', path: '/styles' }]),
    ],
  });

  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="bg-velvet-deep text-cream">
      <header className="mx-auto max-w-[1500px] px-6 pb-16 pt-32 text-center sm:px-10 sm:pt-44">
        <p className="font-ui text-[0.7rem] uppercase tracking-[0.45em] text-gold" data-reveal>The Showroom</p>
        <h1 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] font-black leading-[0.95]" data-reveal>
          Eight website <span className="italic text-gold">worlds</span> you can step into.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl font-editorial text-2xl leading-relaxed text-gold-light" data-reveal>
          Every Velvet Letters site is custom — but it usually starts from one of these. Each is a
          purchasable world, engineered to make visitors feel a specific way and act.
        </p>
      </header>

      {/* Showroom — full-width alternating exhibits */}
      <div className="border-t border-gold/12">
        {STYLES.map((s, i) => (
          <article
            key={s.key}
            data-reveal
            className={`mx-auto grid max-w-[1500px] items-center gap-10 border-b border-gold/12 px-6 py-16 sm:px-10 lg:grid-cols-2 ${
              i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            {/* Exhibit plinth */}
            <div className="flex items-center justify-center">
              <div className="exhibit-plinth">
                <StyleScene k={s.key} />
              </div>
            </div>

            {/* Wall label */}
            <div>
              <span className="font-ui text-[0.7rem] uppercase tracking-[0.35em] text-gold/60">
                World {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-tight">{s.title}</h2>
              <p className="mt-4 font-editorial text-xl leading-relaxed text-cream/85">{s.promise}</p>

              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="font-ui text-[0.62rem] uppercase tracking-[0.2em] text-gold/60">Feels like</dt>
                  <dd className="mt-1 font-editorial text-base text-cream/75">{s.feel}</dd>
                </div>
                <div>
                  <dt className="font-ui text-[0.62rem] uppercase tracking-[0.2em] text-gold/60">Best for</dt>
                  <dd className="mt-1 font-editorial text-base text-cream/75">{s.fit}</dd>
                </div>
                <div>
                  <dt className="font-ui text-[0.62rem] uppercase tracking-[0.2em] text-gold/60">Outcome</dt>
                  <dd className="mt-1 font-editorial text-base text-cream/75">{s.outcome}</dd>
                </div>
              </dl>

              <Link
                to="/contact"
                className="mt-7 inline-block rounded-full border border-gold px-7 py-3 font-ui text-[0.75rem] uppercase tracking-[0.2em] text-gold no-underline transition-colors hover:bg-gold hover:text-velvet-deep"
              >
                Build this world →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <CTASection
        eyebrow="Not sure which world?"
        heading="We'll help you choose the one that fits."
        sub="Tell us who you are and who you're for. We'll recommend the world that converts."
        primary={{ label: 'Start a project', to: '/contact' }}
        secondary={{ label: 'See the process', to: '/process' }}
      />
      <SiteFooter />
    </div>
  );
}
