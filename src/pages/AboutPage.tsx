import { useSeo, webPageLd, breadcrumbLd, SITE_URL } from '../lib/seo';
import { useReveal } from '../lib/useReveal';
import { PressBand } from '../layout/PressBand';
import { SiteFooter } from '../layout/SiteFooter';

// The house style: the rules every job at this press is set to.
const HOUSE_STYLE = [
  {
    title: 'A website is an impression before it is a page.',
    body: 'It is felt before it is read. We design the feeling first, then engineer every frame, word and transition to protect it.',
  },
  {
    title: 'Attention is set, not shouted.',
    body: 'Pacing, restraint and motion pull people in and hold them. Nothing on the sheet begs.',
  },
  {
    title: 'Beauty has to pull its weight.',
    body: 'Cinematic is not decoration. Every composition is built to move someone one step closer to acting.',
  },
  {
    title: 'The hand of the maker is the rarest signal.',
    body: 'In a sea of templates, visible craft is the one thing a brand cannot buy off the shelf.',
  },
];

// What goes in the composing stick for every job. `null` is a quad: word space.
const STICK: (string | null)[] = [
  'Narrative strategy', 'Art direction', null,
  'React Three Fiber', 'WebGL', 'Motion', null,
  'UX', 'Information architecture', null,
  'Performance', 'SEO', 'GEO', null,
  'Conversion copy',
];

const INDEX = [
  { sku: 'VL-01', name: 'Cinematic websites', note: 'Lighting, lensing and motion, art-directed like film.' },
  { sku: 'VL-02', name: 'Immersive 3D', note: 'Real-time brand objects and worlds visitors move through.' },
  { sku: 'VL-03', name: 'Storytelling sites', note: 'Scroll that unfolds like a letter and earns the next line.' },
  { sku: 'VL-04', name: 'SEO / GEO strategy', note: 'Found by search engines and quoted by answer engines.' },
  { sku: 'VL-05', name: 'Conversion systems', note: 'Beautiful paths engineered to end in a decision.' },
  { sku: 'VL-06', name: 'Custom brand worlds', note: 'A design language cut to order, held by no other foundry.' },
];

export function AboutPage() {
  useSeo({
    title: 'About — Velvet Letters, a press for cinematic websites',
    description:
      'Velvet Letters is a small studio that sets brands in type: cinematic, custom websites combining storytelling, UX, real-time 3D, motion, SEO/GEO and conversion strategy.',
    path: '/about',
    jsonLd: [
      webPageLd('About Velvet Letters', '/about', 'The studio behind cinematic, custom websites.'),
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]),
    ],
  });

  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="paper">
      <header className="imprint">
        <p className="imprint__rule" data-reveal>
          <span>Velvet Letters · Press &amp; Foundry</span>
          <span>Imprint · {SITE_URL.replace('https://', '')}</span>
        </p>
        <h1 className="imprint__title" data-reveal>
          A small press for brands that would rather be <em>read</em> than skimmed.
        </h1>
        <p className="press-lede" data-reveal>
          We are Velvet Letters, a studio for cinematic websites. We do not assemble pages from parts.
          We set a brand in type: story, image, motion and structure composed as one impression, then
          pulled clean enough to be remembered.
        </p>
      </header>

      {/* House style */}
      <section aria-labelledby="style-heading" className="press-section">
        <header className="press-section__head">
          <p className="press-folio">Sheet No. 1</p>
          <h2 id="style-heading" className="press-h2">
            House style
          </h2>
          <p className="press-lede">Four rules every job at this press is set to. They are not negotiable, which is why the work is.</p>
        </header>
        <ol className="house-style">
          {HOUSE_STYLE.map((rule, i) => (
            <li key={rule.title} className="house-rule" data-reveal>
              <span className="house-rule__no" aria-hidden>
                §{i + 1}
              </span>
              <h3 className="house-rule__title">{rule.title}</h3>
              <p className="house-rule__body">{rule.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* The composing stick */}
      <section aria-labelledby="stick-heading" className="press-section">
        <header className="press-section__head">
          <p className="press-folio">Sheet No. 2</p>
          <h2 id="stick-heading" className="press-h2">
            What goes in the stick
          </h2>
          <p className="press-lede">
            A compositor sets a line one sort at a time. These are the sorts that go into every line we set,
            with the spaces that keep them readable.
          </p>
        </header>
        <div data-reveal>
          <ul className="composing-stick" aria-label="Disciplines in every project">
            {STICK.map((sort, i) =>
              sort ? (
                <li key={sort} className="sort">
                  {sort}
                </li>
              ) : (
                <li key={`quad-${i}`} className={`quad ${i % 2 ? 'quad--em' : ''}`} aria-hidden />
              ),
            )}
          </ul>
          <p className="composing-stick__caption">Set left to right. Reads right once it is pulled.</p>
        </div>
      </section>

      {/* The index */}
      <section aria-labelledby="index-heading" className="press-section">
        <header className="press-section__head">
          <p className="press-folio">Sheet No. 3</p>
          <h2 id="index-heading" className="press-h2">
            What we print
          </h2>
        </header>
        <ul className="index">
          {INDEX.map((row) => (
            <li key={row.sku} className="index__row" data-reveal>
              <span className="index__sku">{row.sku}</span>
              <h3 className="index__name">{row.name}</h3>
              <span className="index__leader" aria-hidden />
              <p className="index__note">{row.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Imprimatur */}
      <section aria-label="Our promise" className="press-section">
        <blockquote className="imprimatur" data-reveal>
          <span className="seal" aria-hidden>
            <span className="seal__word">Imprimatur</span>
            <span className="seal__sub">let it be printed</span>
          </span>
          <p className="imprimatur__text">
            Nothing leaves this press until we would put our own mark on it. Then we do.
          </p>
        </blockquote>
      </section>

      <PressBand
        eyebrow="Next sheet"
        heading="See how a proof becomes an edition."
        body="Seven stages between the first conversation and a site people keep coming back to."
        primary={{ label: 'Read the process', to: '/process' }}
        secondary={{ label: 'Open a job ticket', to: '/contact' }}
      />
      <SiteFooter variant="paper" />
    </div>
  );
}
