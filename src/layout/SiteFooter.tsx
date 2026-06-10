import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '../lib/tokens';
import { ROUTES } from './routes';

type Props = {
  /** Light footer for the paper/newspaper worlds; default is velvet. */
  variant?: 'velvet' | 'paper';
};

export function SiteFooter({ variant = 'velvet' }: Props) {
  const paper = variant === 'paper';
  return (
    <footer
      className={`relative z-[5] border-t px-6 py-14 sm:px-10 ${
        paper ? 'border-ink/15 bg-newsprint text-ink' : 'border-gold/15 bg-velvet-deep text-cream'
      }`}
    >
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className={`font-display text-xl font-bold tracking-[0.2em] ${paper ? 'text-ink' : 'text-gold'}`}>
            Velvet Letters
          </div>
          <p className="mt-3 max-w-sm font-editorial text-lg leading-relaxed opacity-80">
            We build cinematic websites that make people stop, feel, remember, and act.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          <span className="mb-1 font-ui text-[0.7rem] uppercase tracking-[0.3em] opacity-60">Pages</span>
          {ROUTES.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className={`font-ui text-sm no-underline opacity-80 transition-opacity hover:opacity-100 ${paper ? 'hover:text-meadow' : 'hover:text-gold'}`}
            >
              {r.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <span className="mb-1 font-ui text-[0.7rem] uppercase tracking-[0.3em] opacity-60">Start</span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className={`font-editorial text-lg no-underline ${paper ? 'text-meadow' : 'text-gold'}`}
          >
            {CONTACT_EMAIL}
          </a>
          <Link
            to="/contact"
            className={`mt-2 inline-block w-fit rounded-full px-5 py-2 font-ui text-[0.75rem] uppercase tracking-[0.18em] no-underline ${
              paper ? 'bg-ink text-newsprint' : 'bg-gold text-velvet-deep'
            }`}
          >
            Send the first letter
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1600px] border-t border-current/10 pt-6 font-ui text-xs tracking-wider opacity-50">
        © {2025} Velvet Letters Studio. Cinematic websites for premium brands.
      </div>
    </footer>
  );
}
