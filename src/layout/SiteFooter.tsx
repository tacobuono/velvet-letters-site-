import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '../lib/tokens';
import { ROUTES } from './routes';

type Props = {
  /** Light footer for the paper/bone worlds; default is pine. */
  variant?: 'pine' | 'paper';
};

export function SiteFooter({ variant = 'pine' }: Props) {
  const paper = variant === 'paper';
  return (
    <footer
      className={`relative z-[5] border-t px-6 py-14 sm:px-10 ${
        paper ? 'border-ink/15 bg-bone text-ink' : 'border-brass/15 bg-pine-deep text-cream'
      }`}
    >
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className={`font-grotesk text-xl font-bold uppercase tracking-[0.22em] ${paper ? 'text-ink' : 'text-cream'}`}>
            Velvet Letters
          </div>
          <p className="mt-3 max-w-sm font-editorial text-lg leading-relaxed opacity-80">
            We package cinematic websites that make people stop, feel, remember, and act.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          <span className="mb-1 font-grotesk text-[0.66rem] uppercase tracking-[0.3em] opacity-60">Pages</span>
          {ROUTES.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className={`font-grotesk text-sm no-underline opacity-80 transition-opacity hover:opacity-100 ${paper ? 'hover:text-wax' : 'hover:text-brass'}`}
            >
              {r.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <span className="mb-1 font-grotesk text-[0.66rem] uppercase tracking-[0.3em] opacity-60">Start</span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className={`font-editorial text-lg no-underline ${paper ? 'text-wax' : 'text-brass'}`}
          >
            {CONTACT_EMAIL}
          </a>
          <Link
            to="/contact"
            className={`mt-2 inline-block w-fit rounded-full px-5 py-2 font-grotesk text-[0.7rem] font-semibold uppercase tracking-[0.2em] no-underline ${
              paper ? 'bg-ink text-bone' : 'bg-brass text-pine-deep'
            }`}
          >
            Send the first letter
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1600px] border-t border-current/10 pt-6 font-grotesk text-xs tracking-wider opacity-50">
        © {2025} Velvet Letters Studio. Cinematic websites for premium brands.
      </div>
    </footer>
  );
}
