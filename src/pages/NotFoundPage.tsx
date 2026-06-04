import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

export function NotFoundPage() {
  useSeo({
    title: 'Page not found — Velvet Letters',
    description: 'This letter never arrived. Return to the Velvet Letters home.',
    path: '/404',
  });
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-velvet-deep px-6 text-center text-cream">
      <p className="font-ui text-[0.7rem] uppercase tracking-[0.4em] text-gold">Return to sender</p>
      <h1 className="mt-4 font-display text-[clamp(3rem,10vw,7rem)] font-black text-cream">404</h1>
      <p className="mt-2 font-editorial text-xl italic text-gold-light">This letter never arrived.</p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-gold px-8 py-4 font-ui text-[0.8rem] uppercase tracking-[0.2em] text-velvet-deep no-underline"
      >
        Back to the beginning
      </Link>
    </section>
  );
}
