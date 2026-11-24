import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '../lib/tokens';

type Specimen = {
  sku: string;
  name: string;
  /** The service described the way a type specimen describes a face. */
  cut: string;
  line: string;
  /** Column span in the six-column drawer (desktop). */
  span: 2 | 3 | 6;
};

// The type case: each compartment holds one thing the studio sets.
const SPECIMENS: Specimen[] = [
  {
    sku: 'VL-01',
    name: 'Cinematic Websites',
    cut: 'Display · 96 pt · heavy',
    line: 'Lighting, pacing and motion composed like film.',
    span: 3,
  },
  {
    sku: 'VL-02',
    name: 'Immersive 3D',
    cut: 'Extra bold · three dimensions',
    line: 'Real-time worlds visitors move through, not past.',
    span: 3,
  },
  {
    sku: 'VL-03',
    name: 'Story & UX',
    cut: 'Text face · reads for hours',
    line: 'Scroll that earns attention and pays it back.',
    span: 2,
  },
  {
    sku: 'VL-04',
    name: 'SEO / GEO',
    cut: 'Small caps · found everywhere',
    line: 'Structure and signals that search and answer engines can read.',
    span: 2,
  },
  {
    sku: 'VL-05',
    name: 'Conversion',
    cut: 'Italic · leans toward the sale',
    line: 'Paths that turn attention into action without feeling like a funnel.',
    span: 2,
  },
  {
    sku: 'VL-06',
    name: 'Custom Brand Worlds',
    cut: 'Cut to order · no other foundry has it',
    line: 'A design language that exists nowhere else.',
    span: 6,
  },
];

const SPAN_CLASS: Record<Specimen['span'], string> = {
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  6: 'md:col-span-6',
};

type Stage = { mark: string; name: string; body: string };

// The process, told as the stages a job goes through before it is printed.
const STAGES: Stage[] = [
  {
    mark: 'I',
    name: 'Galley proof',
    body: 'We read everything first: your customers, your competitors, your culture. Nothing is set until we know the copy.',
  },
  {
    mark: 'II',
    name: 'First pull',
    body: 'Structure before style. We map the story and where it has to land, then pull a rough to see if it holds.',
  },
  {
    mark: 'III',
    name: 'Corrections',
    body: 'Every frame, word and transition gets marked up and reset until there is nothing left to fix.',
  },
  {
    mark: 'IV',
    name: 'The run',
    body: 'Launch, measure, re-ink. A site is a living edition, and we keep it on press.',
  },
];

/**
 * Everything after the hero is the sheet that was just printed: an ordinary,
 * scrollable page on paper. The trade supplies the structure — services sit in
 * a type case, the process is a set of proofs carrying real correction marks,
 * and the page closes with a colophon.
 */
export function PressSheet() {
  return (
    <div className="press-sheet">
      {/* The type case */}
      <section aria-labelledby="case-heading" className="press-section">
        <header className="press-section__head">
          <p className="press-folio">Drawer No. 1</p>
          <h2 id="case-heading" className="press-h2">
            The type case
          </h2>
          <p className="press-lede">Six faces, kept in one drawer. This is everything we set.</p>
        </header>
        <ul className="type-case">
          {SPECIMENS.map((s) => (
            <li key={s.sku} className={`type-case__cell ${SPAN_CLASS[s.span]}`}>
              <span className="type-case__sku">{s.sku}</span>
              <h3 className="type-case__name">{s.name}</h3>
              <p className="type-case__cut">{s.cut}</p>
              <p className="type-case__line">{s.line}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* The proof */}
      <section aria-labelledby="proof-heading" className="press-section">
        <header className="press-section__head">
          <p className="press-folio">Proof No. 2</p>
          <h2 id="proof-heading" className="press-h2 proof-line">
            We build <del>websites</del> <ins>impressions</ins> people <del>visit</del>{' '}
            <ins>remember</ins>.
          </h2>
          <p className="press-lede">
            Four stages between a blank sheet and a finished edition.
            <span className="proof-note" aria-hidden>
              stet
            </span>
          </p>
        </header>
        <ol className="proof-stages">
          {STAGES.map((stage) => (
            <li key={stage.name} className="proof-stage">
              <span className="proof-stage__mark" aria-hidden>
                {stage.mark}
              </span>
              <h3 className="proof-stage__name">{stage.name}</h3>
              <p className="proof-stage__body">{stage.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* The run */}
      <section aria-labelledby="run-heading" className="press-run">
        <p className="press-folio press-folio--brass">Limited edition</p>
        <h2 id="run-heading" className="press-run__heading">
          Not for everyone. For the ones who would rather be unforgettable than safe.
        </h2>
        <p className="press-run__body">
          One flagship site a quarter. We disappear into your world, then set it so it can't be
          scrolled past.
        </p>
        <div className="press-run__actions">
          <Link to="/contact" className="sort-btn">
            Commission a printing
          </Link>
          <Link to="/styles" className="sort-btn sort-btn--lead">
            See the specimens
          </Link>
        </div>
      </section>

      {/* Colophon */}
      <section aria-labelledby="colophon-heading" className="press-colophon">
        <h2 id="colophon-heading" className="press-folio">
          Colophon
        </h2>
        <p>
          Set in Playfair Display, Cormorant Garamond and Archivo. Printed in pine, brass and one
          velvet ink. Composed in React and three.js, and proofed by hand. To commission a
          printing, write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </div>
  );
}
