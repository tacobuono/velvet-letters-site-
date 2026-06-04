import { useEffect, useRef, useState } from 'react';
import { useSeo, webPageLd, breadcrumbLd } from '../lib/seo';
import { CTASection } from '../layout/CTASection';
import { SiteFooter } from '../layout/SiteFooter';

type Stage = { n: string; title: string; lead: string; outcome: string };

const STAGES: Stage[] = [
  { n: 'I', title: 'Discovery', lead: 'We discuss your vision, goals, audience, and the exact impression you want to leave.', outcome: 'A shared understanding of who you are and who you are for.' },
  { n: 'II', title: 'Shared Vision', lead: 'Together we define the emotional and strategic direction — the feeling before the pixels.', outcome: 'Alignment on the emotional and commercial direction.' },
  { n: 'III', title: 'Agreement', lead: 'We align on exactly what we are creating, the scope, and the standard.', outcome: 'A clear plan and a confident yes.' },
  { n: 'IV', title: 'Creation', lead: 'Velvet Letters takes the idea and builds the world — structure, 3D, motion, copy.', outcome: 'The idea takes tangible, digital form.' },
  { n: 'V', title: 'Refinement', lead: 'The rough idea becomes crafted, cinematic, fast, and effective.', outcome: 'Rough becomes remarkable.' },
  { n: 'VI', title: 'Launch', lead: 'The site ships hyper-crisp, realistic, memorable, and conversion-ready.', outcome: 'A site that performs and photographs.' },
  { n: 'VII', title: 'Magnetism', lead: 'People notice it, move toward it, and remember it.', outcome: 'Attention becomes demand.' },
];

const TYPES = [
  '3D websites', 'Immersive websites', 'Cinematic websites', 'Storytelling websites',
  'SEO / GEO-optimized websites', 'Conversion-focused websites', 'Custom brand worlds', 'Luxury digital experiences',
];

/** The on-screen mock that climbs fidelity with each stage (0 → 6). */
function StageScreen({ stage }: { stage: number }) {
  return (
    <div className={`monitor-screen monitor-stage-${stage}`} aria-hidden>
      {stage <= 0 && <div className="mon-pixels" />}
      {stage === 1 && (
        <div className="mon-wire">
          <span /><span /><span /><span /><span />
        </div>
      )}
      {stage === 2 && (
        <div className="mon-layout">
          <div className="mon-bar" />
          <div className="mon-hero" />
          <div className="mon-cols"><i /><i /><i /></div>
        </div>
      )}
      {stage === 3 && (
        <div className="mon-layout mon-gray">
          <div className="mon-bar" />
          <div className="mon-hero" />
          <div className="mon-cols"><i /><i /><i /></div>
        </div>
      )}
      {stage === 4 && (
        <div className="mon-layout mon-color">
          <div className="mon-bar" />
          <div className="mon-hero" />
          <div className="mon-cols"><i /><i /><i /></div>
        </div>
      )}
      {stage >= 5 && (
        <div className={`mon-polished ${stage >= 6 ? 'mon-cine' : ''}`}>
          <div className="mon-nav"><b /><span /><span /><span /></div>
          <div className="mon-headline">Velvet Letters</div>
          <div className="mon-cta">Start a project</div>
        </div>
      )}
    </div>
  );
}

export function ProcessPage() {
  useSeo({
    title: 'Process — How a Velvet Letters site becomes real',
    description:
      'Watch the screen become real. Velvet Letters builds cinematic websites in seven stages — Discovery, Shared Vision, Agreement, Creation, Refinement, Launch, and Magnetism.',
    path: '/process',
    jsonLd: [
      webPageLd('The Velvet Letters Process', '/process', 'From the first conversation to a site people move toward.'),
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Process', path: '/process' }]),
    ],
  });

  const [active, setActive] = useState(0);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.stage);
            setActive(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    stageRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-velvet-deep text-cream">
      {/* Hero — over the shoulder */}
      <header className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="shoulder" aria-hidden />
        <div className="screen-glow" aria-hidden />
        <p className="relative z-10 font-ui text-[0.7rem] uppercase tracking-[0.45em] text-gold">The Velvet Letters Process</p>
        <h1 className="relative z-10 mt-6 font-display text-[clamp(3rem,9vw,8rem)] font-black leading-[0.92]">
          The screen
          <br />
          <span className="italic text-gold">becomes real.</span>
        </h1>
        <p className="relative z-10 mt-8 max-w-xl font-editorial text-2xl leading-relaxed text-gold-light">
          Sit beside us. From a blank, pixelated rectangle to a cinematic site people move toward — this is
          how the impression gets made.
        </p>
      </header>

      {/* Transformation — sticky monitor + stages */}
      <section className="mx-auto grid max-w-[1500px] gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_1fr]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
          <div className="monitor">
            <StageScreen stage={active} />
            <div className="monitor-stand" aria-hidden />
            <p className="mt-4 text-center font-ui text-[0.7rem] uppercase tracking-[0.3em] text-gold/70">
              Stage {STAGES[active].n} — {STAGES[active].title}
            </p>
          </div>
        </div>

        <div>
          {STAGES.map((s, i) => (
            <div
              key={s.n}
              data-stage={i}
              ref={(el) => {
                stageRefs.current[i] = el;
              }}
              className={`flex min-h-[70vh] flex-col justify-center border-l-2 py-10 pl-8 transition-colors duration-500 ${
                active === i ? 'border-gold' : 'border-gold/15'
              }`}
            >
              <span className="font-display text-5xl font-black text-gold/40">{s.n}</span>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] font-bold">{s.title}</h2>
              <p className="mt-4 max-w-md font-editorial text-xl leading-relaxed text-cream/80">{s.lead}</p>
              <p className="mt-4 max-w-md font-ui text-[0.8rem] uppercase tracking-[0.18em] text-gold">
                → {s.outcome}
              </p>
              {i === STAGES.length - 1 && (
                <div className="crowd mt-8" aria-hidden>
                  {Array.from({ length: 9 }).map((_, k) => (
                    <span key={k} style={{ animationDelay: `${k * 0.12}s` }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* What we build */}
      <section className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10">
        <h2 className="font-ui text-[0.8rem] uppercase tracking-[0.4em] text-gold">What we build</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-gold/15 bg-gold/15 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => (
            <div key={t} className="bg-velvet px-6 py-8 font-display text-xl font-bold text-cream">
              {t}
            </div>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Your impression, made real"
        heading="Let's build something people move toward."
        sub="Tell us the feeling you want to leave. We'll engineer everything to protect it."
        primary={{ label: 'Send the first letter', to: '/contact' }}
        secondary={{ label: 'Explore website styles', to: '/styles' }}
      />
      <SiteFooter />
    </div>
  );
}
