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
  velvet: { bg: 'bg-velvet', text: 'text-cream', em: 'text-gold', btn: 'bg-gold text-velvet-deep', ghost: 'border-gold text-gold' },
  paper: { bg: 'bg-paper-deep', text: 'text-ink', em: 'text-meadow', btn: 'bg-ink text-paper', ghost: 'border-ink text-ink' },
  sun: { bg: 'bg-sun', text: 'text-ink', em: 'text-meadow', btn: 'bg-ink text-sun', ghost: 'border-ink text-ink' },
} as const;

/** Shared conversion band used at the foot of every content page. */
export function CTASection({ eyebrow, heading, sub, primary, secondary, variant = 'velvet' }: Props) {
  const t = THEMES[variant];
  return (
    <section className={`${t.bg} ${t.text} px-6 py-24 text-center sm:px-10 sm:py-32`}>
      {eyebrow && (
        <p className="mb-5 font-ui text-[0.7rem] uppercase tracking-[0.4em] opacity-70">{eyebrow}</p>
      )}
      <h2 className="mx-auto max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05]">
        {heading}
      </h2>
      {sub && <p className="mx-auto mt-6 max-w-xl font-editorial text-xl leading-relaxed opacity-80">{sub}</p>}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {primary && (
          <Link
            to={primary.to}
            className={`${t.btn} rounded-full px-9 py-4 font-ui text-[0.8rem] uppercase tracking-[0.22em] no-underline transition-transform hover:-translate-y-0.5`}
          >
            {primary.label}
          </Link>
        )}
        {secondary && (
          <Link
            to={secondary.to}
            className={`${t.ghost} rounded-full border px-9 py-4 font-ui text-[0.8rem] uppercase tracking-[0.22em] no-underline transition-colors`}
          >
            {secondary.label}
          </Link>
        )}
      </div>
    </section>
  );
}
