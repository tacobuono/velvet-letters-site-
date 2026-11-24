import { Link } from 'react-router-dom';

type CTA = { label: string; to: string };

type Props = {
  eyebrow?: string;
  heading: string;
  sub?: string;
  primary?: CTA;
  secondary?: CTA;
  variant?: 'velvet' | 'paper' | 'sun';
};

const THEMES = {
  velvet: { bg: 'bg-pine-mid', text: 'text-cream', em: 'text-brass', btn: 'bg-brass text-pine-deep', ghost: 'border-brass text-brass' },
  paper: { bg: 'bg-paper-deep', text: 'text-ink', em: 'text-wax', btn: 'bg-ink text-bone', ghost: 'border-ink text-ink' },
  sun: { bg: 'bg-brass', text: 'text-ink', em: 'text-wax', btn: 'bg-ink text-brass-bright', ghost: 'border-ink text-ink' },
} as const;

/** Shared conversion band used at the foot of every content page. */
export function CTASection({ eyebrow, heading, sub, primary, secondary, variant = 'velvet' }: Props) {
  const t = THEMES[variant];
  return (
    <section className={`${t.bg} ${t.text} px-6 py-24 text-center sm:px-10 sm:py-32`}>
      {eyebrow && (
        <p className="mb-5 font-grotesk text-[0.7rem] uppercase tracking-[0.4em] opacity-70">{eyebrow}</p>
      )}
      <h2 className="mx-auto max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05]">
        {heading}
      </h2>
      {sub && <p className="mx-auto mt-6 max-w-xl font-editorial text-xl leading-relaxed opacity-80">{sub}</p>}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {primary && (
          <Link
            to={primary.to}
            className={`${t.btn} rounded-full px-9 py-4 font-grotesk text-[0.8rem] uppercase tracking-[0.22em] no-underline transition-transform hover:-translate-y-0.5`}
          >
            {primary.label}
          </Link>
        )}
        {secondary && (
          <Link
            to={secondary.to}
            className={`${t.ghost} rounded-full border px-9 py-4 font-grotesk text-[0.8rem] uppercase tracking-[0.22em] no-underline transition-colors`}
          >
            {secondary.label}
          </Link>
        )}
      </div>
    </section>
  );
}
