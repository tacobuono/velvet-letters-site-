import { Link } from 'react-router-dom';
import { useSeo, webPageLd, breadcrumbLd } from '../lib/seo';
import { useReveal } from '../lib/useReveal';
import { PressBand } from '../layout/PressBand';
import { SiteFooter } from '../layout/SiteFooter';

type Face = {
  key: string;
  title: string;
  /** How the specimen describes the cut. */
  cut: string;
  promise: string;
  feel: string;
  fit: string;
  outcome: string;
};

// Eight faces. On the plate, each title is set the way that kind of site behaves.
const FACES: Face[] = [
  { key: '3d', title: '3D Websites', cut: 'Display · extruded', promise: 'A real-time brand object visitors can almost reach out and touch.', feel: 'Wonder. Tactility. “How is this in a browser?”', fit: 'Product brands, launches, anything better seen in the round.', outcome: 'Longer dwell time and a product people remember in three dimensions.' },
  { key: 'immersive', title: 'Immersive Websites', cut: 'Grotesk · in perspective', promise: 'A space the camera moves through. Visitors travel it; they do not skim it.', feel: 'Presence. Depth. Being somewhere, not on a page.', fit: 'Studios, experiences, brands that want to feel like a place.', outcome: 'A signature experience no template can copy.' },
  { key: 'effective', title: 'Effective Websites', cut: 'Grotesk · underscored', promise: 'A clean, engineered path with every signal pointed at the action.', feel: 'Clarity. Confidence. “I know exactly what to do.”', fit: 'Lead-gen, SaaS, and offers where conversion is the whole game.', outcome: 'Measurably more conversion from the same traffic.' },
  { key: 'storytelling', title: 'Storytelling Websites', cut: 'Text italic · dropped initial', promise: 'A site that unfolds like a letter, in chapters that earn the next one.', feel: 'Intrigue. Emotion. The pull to keep reading.', fit: 'Founders, missions, and brands with something to say.', outcome: 'Visitors who finish the story and feel something at the end.' },
  { key: 'geo', title: 'SEO / GEO Websites', cut: 'Small caps · indexed', promise: 'Built to be found by search engines and quoted by answer engines alike.', feel: 'Trust. Authority. Being the recommended answer.', fit: 'Brands that need to be discovered, cited and recommended.', outcome: 'More qualified discovery from search and AI assistants.' },
  { key: 'cinematic', title: 'Cinematic Websites', cut: 'Display · letterboxed', promise: 'Lighting, lensing, pacing and motion, composed like film.', feel: 'Awe. Premium calm. The hush before a great shot.', fit: 'Premium brands that want to be felt, not skimmed.', outcome: 'A first impression that reads as expensive and intentional.' },
  { key: 'custom', title: 'Custom Websites', cut: 'Mixed case · cut to order', promise: 'A system engineered from scratch that exists nowhere else.', feel: 'Distinction. “This could only be them.”', fit: 'Brands whose identity deserves its own design language.', outcome: 'A site that becomes part of the brand, not a layer on top of it.' },
  { key: 'luxury', title: 'Luxury Websites', cut: 'Light · hairline rules', promise: 'Tactile materials, disciplined restraint, shadows that ground everything.', feel: 'Quiet confidence. Expensive without raising its voice.', fit: 'Heritage, hospitality, and high-consideration purchases.', outcome: 'Perceived value that justifies a premium price.' },
];

/** The title on the plate, set in its own face. */
function Word({ face }: { face: Face }) {
  const cls = `plate__word face-${face.key}`;
  if (face.key === 'custom') {
    // Every letter from a different case, as a one-off job would be.
    return (
      <p className={cls} aria-label={face.title}>
        {Array.from(face.title).map((ch, i) => (
          <span key={i} aria-hidden>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </p>
    );
  }
  if (face.key === 'geo') {
    return (
      <p className={cls}>
        SEO <sup aria-hidden>¹</sup> / GEO <sup aria-hidden>²</sup> Websites
      </p>
    );
  }
  return <p className={cls}>{face.title}</p>;
}

export function StylesPage() {
  useSeo({
    title: 'Styles — the specimen book of eight website faces | Velvet Letters',
    description:
      'Eight kinds of website Velvet Letters sets: 3D, immersive, effective, storytelling, SEO/GEO, cinematic, custom and luxury, each shown as a type specimen with what it feels like, who it fits and what it earns.',
    path: '/styles',
    jsonLd: [
      webPageLd('Website Styles Specimen Book', '/styles', 'The kinds of website Velvet Letters builds.'),
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Styles', path: '/styles' }]),
    ],
  });

  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="pressroom">
      <header className="pressroom-hero">
        <div className="pressroom-plate" aria-hidden />
        <div className="imprint">
          <p className="imprint__rule">
            <span>Velvet Letters · Press &amp; Foundry</span>
            <span>Specimen book · eight faces</span>
          </p>
          <h1 className="imprint__title">
            Eight faces we cut. <em>One of them is yours.</em>
          </h1>
          <p className="press-lede">
            A foundry shows its type by setting it. Every Velvet Letters site is custom, but it starts from
            one of these eight. Each plate is set in the character of the site it describes.
          </p>
        </div>
      </header>

      <div className="specimen-book">
        {FACES.map((face, i) => (
          <article key={face.key} className="specimen" aria-labelledby={`face-${face.key}`}>
            <div className="plate" data-reveal>
              <p className="plate__no">Specimen No. {String(i + 1).padStart(2, '0')}</p>
              <p className="plate__pt">{face.cut}</p>
              <Word face={face} />
              <p className="plate__line">{face.promise}</p>
            </div>

            <div className="specimen__label" data-reveal>
              <p className="press-folio">Specimen No. {String(i + 1).padStart(2, '0')}</p>
              <h2 id={`face-${face.key}`} className="specimen__title">
                {face.title}
              </h2>
              <p className="specimen__promise">{face.promise}</p>
              <dl className="specimen__facts">
                <div>
                  <dt>Feels like</dt>
                  <dd>{face.feel}</dd>
                </div>
                <div>
                  <dt>Best for</dt>
                  <dd>{face.fit}</dd>
                </div>
                <div>
                  <dt>Earns</dt>
                  <dd>{face.outcome}</dd>
                </div>
              </dl>
              <Link to="/contact" className="sort-btn">
                Set in this face
              </Link>
            </div>
          </article>
        ))}
      </div>

      <PressBand
        stock="room"
        eyebrow="Not sure which face?"
        heading="We will set a line in each and show you."
        body="Tell us who you are and who you are for. We recommend the face that converts, not the one that shows off."
        primary={{ label: 'Open a job ticket', to: '/contact' }}
        secondary={{ label: 'Read the process', to: '/process' }}
      />
      <SiteFooter />
    </div>
  );
}
