import { useEffect, useRef, useState } from 'react';
import { useSeo, webPageLd, breadcrumbLd } from '../lib/seo';
import { PressBand } from '../layout/PressBand';
import { SiteFooter } from '../layout/SiteFooter';

type Stage = {
  mark: string;
  /** What the trade calls this stage of a print job. */
  trade: string;
  title: string;
  body: string;
  pulled: string;
};

// Seven stages of make-ready, each named for what happens to the sheet.
const STAGES: Stage[] = [
  {
    mark: 'I',
    trade: 'Reading the copy',
    title: 'Discovery',
    body: 'Before anything is set we read everything: your customers, your competitors, your culture, and the exact impression you want to leave.',
    pulled: 'A shared picture of who you are and who you are for.',
  },
  {
    mark: 'II',
    trade: 'Thumbnails',
    title: 'Shared vision',
    body: 'Rough sketches of the whole sheet. Together we fix the emotional and commercial direction before a single pixel is drawn.',
    pulled: 'Agreement on the feeling, and the outcome it has to produce.',
  },
  {
    mark: 'III',
    trade: 'Signed proof',
    title: 'Agreement',
    body: 'Scope, standard and schedule on one page, signed by both of us. The job does not go to the forme until it is.',
    pulled: 'A clear plan and a confident yes.',
  },
  {
    mark: 'IV',
    trade: 'Setting the forme',
    title: 'Creation',
    body: 'Structure, 3D, motion, copy. The idea is set in real material, one sort at a time, until the page holds together.',
    pulled: 'The idea in tangible, digital form.',
  },
  {
    mark: 'V',
    trade: 'Make-ready',
    title: 'Refinement',
    body: 'Colour, register, pressure. Every frame, word and transition is adjusted until the impression is even and nothing is out of register.',
    pulled: 'Rough becomes remarkable, and fast.',
  },
  {
    mark: 'VI',
    trade: 'The run',
    title: 'Launch',
    body: 'The site ships crisp, measured and conversion-ready, with the structure search and answer engines need to find it.',
    pulled: 'A site that performs and photographs.',
  },
  {
    mark: 'VII',
    trade: 'The edition circulates',
    title: 'Magnetism',
    body: 'People notice it, move toward it, share it. We keep it on press: measuring, re-inking, adding to the edition.',
    pulled: 'Attention becomes demand.',
  },
];

/** The sheet on the bench, gaining ink as the visitor reads down the stages. */
function ProofSheet({ stage }: { stage: number }) {
  return (
    <div className={`proof-sheet ${stage >= 6 ? 'proof-sheet--edition' : ''}`} aria-hidden>
      <div className="proof-sheet__paper">
        <div key={stage} className="proof-sheet__face">
          {stage === 0 && <div className="ps-guides" />}
          {stage === 1 && (
            <div className="ps-thumbs">
              <i /><i /><i /><i /><i /><i />
            </div>
          )}
          {(stage === 2 || stage === 3 || stage === 4) && (
            <div className={`ps-page ${stage >= 3 ? 'ps-page--galley' : ''} ${stage >= 4 ? 'ps-page--colour' : ''}`}>
              <div className="ps-page__head" />
              <div className="ps-page__hero" />
              <div className="ps-page__cols">
                <i /><i /><i />
              </div>
              {stage === 2 && <span className="ps-sign">approved · VL</span>}
              {stage === 4 && (
                <>
                  <span className="ps-register ps-register--tl" />
                  <span className="ps-register ps-register--br" />
                </>
              )}
            </div>
          )}
          {stage >= 5 && (
            <div className="ps-print">
              <div className="ps-print__nav">
                <b /><i /><i /><i />
              </div>
              <p className="ps-print__headline">We set your brand in type.</p>
              <div className="ps-print__body" />
              <span className="ps-print__seal">VL</span>
              <span className="ps-print__no">{stage >= 6 ? 'Edition · 0001 / 0500' : 'First pull'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProcessPage() {
  useSeo({
    title: 'Process — seven stages from blank sheet to edition | Velvet Letters',
    description:
      'How a Velvet Letters site is made: Discovery, Shared Vision, Agreement, Creation, Refinement, Launch and Magnetism, told as the make-ready of a print job.',
    path: '/process',
    jsonLd: [
      webPageLd('The Velvet Letters Process', '/process', 'From the first conversation to a site people move toward.'),
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Process', path: '/process' }]),
    ],
  });

  const [active, setActive] = useState(0);
  const stageRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.stage));
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    stageRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="pressroom">
      <header className="pressroom-hero">
        <div className="pressroom-plate" aria-hidden />
        <div className="imprint">
          <p className="imprint__rule">
            <span>Velvet Letters · Press &amp; Foundry</span>
            <span>Make-ready · seven stages</span>
          </p>
          <h1 className="imprint__title">
            Seven stages between a blank sheet and an <em>edition</em> people keep.
          </h1>
          <p className="press-lede">
            A print job is not pulled in one go. It is read, sketched, signed, set, made ready and run.
            Sit at the bench and watch the sheet take ink.
          </p>
        </div>
      </header>

      <section className="makeready" aria-label="The seven stages">
        <div className="makeready__sheet">
          <ProofSheet stage={active} />
          <p className="makeready__caption">
            Stage {STAGES[active].mark} — {STAGES[active].trade}
          </p>
        </div>

        <ol className="ps-stages">
          {STAGES.map((s, i) => (
            <li
              key={s.mark}
              data-stage={i}
              ref={(el) => {
                stageRefs.current[i] = el;
              }}
              className={`ps-stage ${active === i ? 'is-active' : ''}`}
            >
              {/* Below the two-column breakpoint the bench is not sticky, so each
                  stage carries its own small sheet. */}
              <div className="ps-stage__mini">
                <ProofSheet stage={i} />
              </div>
              <p className="ps-stage__trade">
                <b>{s.mark}</b>
                {s.trade}
              </p>
              <h2 className="ps-stage__title">{s.title}</h2>
              <p className="ps-stage__body">{s.body}</p>
              <p className="ps-stage__pulled">
                <b>Pulled</b>
                {s.pulled}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <PressBand
        stock="room"
        eyebrow="Your sheet"
        heading="Ready to pull the first proof?"
        body="Open a ticket with what you know. We read everything before anything is set."
        primary={{ label: 'Open a job ticket', to: '/contact' }}
        secondary={{ label: 'Browse the specimens', to: '/styles' }}
      />
      <SiteFooter />
    </div>
  );
}
