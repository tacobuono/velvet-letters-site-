import { useSeo, webPageLd, breadcrumbLd, SITE_URL } from '../lib/seo';
import { useReveal } from '../lib/useReveal';
import { CTASection } from '../layout/CTASection';
import { SiteFooter } from '../layout/SiteFooter';

const BELIEFS = [
  { code: 'BLF-01', title: 'A website is a feeling first', body: 'Before it is a layout or a funnel, it is an impression. We design the feeling, then engineer everything to protect it.' },
  { code: 'BLF-02', title: 'Attention is earned, not demanded', body: 'We do not shout. We compose. Motion, pacing and restraint pull people in and keep them.' },
  { code: 'BLF-03', title: 'Beauty must convert', body: 'Cinematic is not decoration. Every frame is built to move someone one step closer to acting.' },
  { code: 'BLF-04', title: 'Craft is the differentiator', body: 'In a sea of templates, the hand of a maker is the rarest signal of quality a brand can send.' },
];

const PRODUCTS = [
  { sku: 'VL-3D', name: 'Three-Dimensional Worlds', note: 'Real-time WebGL brand objects & scenes.' },
  { sku: 'VL-IMM', name: 'Immersive Experiences', note: 'Camera-driven space the visitor moves through.' },
  { sku: 'VL-STORY', name: 'Storytelling Sites', note: 'Scrollytelling that unfolds like a letter.' },
  { sku: 'VL-CINE', name: 'Cinematic Builds', note: 'Lighting, lensing and motion, art-directed.' },
  { sku: 'VL-GEO', name: 'SEO / GEO Strategy', note: 'Found by search engines and answer engines.' },
  { sku: 'VL-CVR', name: 'Conversion Systems', note: 'Beautiful paths engineered to act.' },
];

const INGREDIENTS = [
  'Narrative strategy', 'Art direction', 'React Three Fiber / WebGL', 'Motion design',
  'UX & information architecture', 'Performance engineering', 'SEO & GEO', 'Conversion copywriting',
];

export function AboutPage() {
  useSeo({
    title: 'About — The Velvet Letters Catalogue of Digital Impressions',
    description:
      'Velvet Letters is a studio for cinematic websites. We combine storytelling, UX, 3D, motion, SEO/GEO and conversion strategy to build digital impressions that last.',
    path: '/about',
    jsonLd: [
      webPageLd('About Velvet Letters', '/about', 'The studio behind cinematic, custom websites.'),
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]),
    ],
  });

  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="paper-grain bg-paper text-ink">
      {/* Masthead */}
      <header className="mx-auto max-w-[1400px] px-6 pb-16 pt-32 sm:px-10 sm:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-6" data-reveal>
          <p className="font-ui text-[0.7rem] uppercase tracking-[0.4em] text-acid-deep">Atelier Archive · Edition MMXXV</p>
          <p className="font-ui text-[0.7rem] uppercase tracking-[0.3em] opacity-60">No. 001 — {SITE_URL.replace('https://', '')}</p>
        </div>
        <h1 className="mt-10 font-display text-[clamp(2.6rem,8vw,7rem)] font-black leading-[0.95]" data-reveal>
          The Velvet Letters
          <br />
          <span className="italic text-acid-deep">Catalogue</span> of Digital Impressions
        </h1>
        <p className="mt-8 max-w-2xl font-editorial text-2xl leading-relaxed opacity-80" data-reveal>
          We are Velvet Letters Studio, a maker of cinematic websites. We do not make ordinary pages.
          We design digital impressions — felt, remembered, and built to last.
        </p>
      </header>

      {/* What we believe — label cards */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10">
        <h2 className="mb-10 font-ui text-[0.8rem] uppercase tracking-[0.4em] text-acid-deep" data-reveal>
          § What we believe
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {BELIEFS.map((b) => (
            <article key={b.code} className="label-card" data-reveal>
              <div className="flex items-center justify-between border-b border-dashed border-ink/30 pb-3">
                <span className="font-ui text-[0.7rem] uppercase tracking-[0.3em] opacity-60">{b.code}</span>
                <span className="barcode" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold">{b.title}</h3>
              <p className="mt-2 font-editorial text-lg leading-relaxed opacity-80">{b.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* What we make — catalogue list */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10">
        <h2 className="mb-10 font-ui text-[0.8rem] uppercase tracking-[0.4em] text-acid-deep" data-reveal>
          § What we make
        </h2>
        <ul className="divide-y divide-ink/15 border-y-2 border-ink">
          {PRODUCTS.map((p) => (
            <li key={p.sku} className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-5 sm:grid-cols-[7rem_1fr_auto]" data-reveal>
              <span className="font-ui text-[0.75rem] uppercase tracking-[0.2em] text-acid-deep">{p.sku}</span>
              <span className="font-display text-xl font-bold sm:text-2xl">{p.name}</span>
              <span className="col-span-2 font-editorial text-lg opacity-70 sm:col-span-1 sm:text-right">{p.note}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* What makes it different — receipt */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10">
        <h2 className="mb-10 font-ui text-[0.8rem] uppercase tracking-[0.4em] text-acid-deep" data-reveal>
          § What makes it different
        </h2>
        <div className="grid gap-10 md:grid-cols-[1fr_22rem]">
          <p className="font-editorial text-2xl leading-relaxed opacity-85" data-reveal>
            Most studios assemble. We compose. We combine storytelling, UX, real-time 3D, motion, search
            strategy and conversion thinking into one coherent brand moment — so the experience does not
            just look expensive, it works like it. The result is a site people screenshot, remember, and
            come back to.
          </p>
          <aside className="receipt" data-reveal>
            <p className="text-center font-ui text-[0.7rem] uppercase tracking-[0.3em]">Velvet Letters · Receipt</p>
            <div className="my-3 border-t border-dashed border-ink/40" />
            {['Strategy', 'Art direction', '3D / motion', 'SEO / GEO', 'Conversion'].map((r) => (
              <div key={r} className="flex justify-between py-1 font-ui text-sm">
                <span>{r}</span>
                <span>✓ included</span>
              </div>
            ))}
            <div className="my-3 border-t border-dashed border-ink/40" />
            <div className="flex justify-between font-display text-lg font-bold">
              <span>Total</span>
              <span>One impression that lasts</span>
            </div>
          </aside>
        </div>
      </section>

      {/* The ingredients — barcode list */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10">
        <h2 className="mb-10 font-ui text-[0.8rem] uppercase tracking-[0.4em] text-acid-deep" data-reveal>
          § The ingredients
        </h2>
        <div className="flex flex-wrap gap-3" data-reveal>
          {INGREDIENTS.map((i) => (
            <span key={i} className="rounded-full border border-ink/40 px-5 py-2 font-ui text-sm uppercase tracking-[0.12em]">
              {i}
            </span>
          ))}
        </div>
      </section>

      {/* The promise — stamp */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <blockquote className="relative mx-auto max-w-3xl text-center" data-reveal>
          <span className="stamp" aria-hidden>Sealed</span>
          <p className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight">
            We design digital impressions that last — and we put our seal on every one.
          </p>
        </blockquote>
      </section>

      <CTASection
        variant="paper"
        eyebrow="The next step"
        heading="See how the impression gets made."
        sub="Walk the Velvet Letters process — from the first conversation to a site people move toward."
        primary={{ label: 'See the process', to: '/process' }}
        secondary={{ label: 'Start a project', to: '/contact' }}
      />
      <SiteFooter variant="paper" />
    </div>
  );
}
