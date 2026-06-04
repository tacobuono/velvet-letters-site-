import { useState, type FormEvent } from 'react';
import { useSeo, webPageLd, breadcrumbLd, faqLd } from '../lib/seo';
import { CONTACT_EMAIL } from '../lib/tokens';
import { SiteFooter } from '../layout/SiteFooter';

const FRAGMENTS = [
  'tell me the idea', 'what should people feel?', 'what should they remember?',
  'send the spark', "let's make it cinematic", "let's make it convert", 'what are we building?',
  'who is it for?', 'what is the impression?', 'start here',
];

const FAQS = [
  { q: 'What does Velvet Letters build?', a: 'Cinematic, custom websites — 3D, immersive, storytelling, and conversion-focused experiences for premium brands.' },
  { q: 'How do we start?', a: 'Send the first letter using the form below, or email hello@velvetletters.com. We reply with a short discovery conversation.' },
];

export function ContactPage() {
  useSeo({
    title: "Contact — Let's talk | Velvet Letters",
    description:
      "Start a cinematic website with Velvet Letters. Tell us the idea, the feeling, and who it's for — and we'll make it cinematic and make it convert.",
    path: '/contact',
    jsonLd: [
      webPageLd('Contact Velvet Letters', '/contact', "Start a project with Velvet Letters."),
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]),
      faqLd(FAQS),
    ],
  });

  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get('name')}`,
      `Email: ${f.get('email')}`,
      `Project type: ${f.get('type')}`,
      `Timeline: ${f.get('timeline')}`,
      `Budget: ${f.get('budget')}`,
      '',
      `${f.get('message')}`,
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      'A new letter — ' + (f.get('name') || 'project'),
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const field = 'w-full rounded-md border-2 border-ink/30 bg-white/60 px-4 py-3 font-ui text-ink outline-none focus:border-meadow';
  const label = 'mb-1 block font-ui text-[0.72rem] uppercase tracking-[0.18em] text-ink/70';

  return (
    <div className="halftone bg-newsprint text-ink">
      {/* Masthead */}
      <header className="mx-auto max-w-[1500px] px-6 pt-28 sm:px-10 sm:pt-36">
        <div className="flex flex-wrap items-center justify-between gap-3 border-y-2 border-ink py-2 font-ui text-[0.7rem] uppercase tracking-[0.25em]" data-reveal>
          <span>The Velvet Letters Classifieds</span>
          <span>Sunny edition · Open for projects</span>
        </div>

        <div className="py-10 text-center">
          <p className="font-ui text-[0.72rem] uppercase tracking-[0.4em] text-meadow">Wanted: brave brands</p>
          <h1 className="lets-talk mt-4" aria-label="Let's talk">
            <span>LET&rsquo;S</span>
            <span>TALK</span>
          </h1>
          {/* Big word, made of small sentences */}
          <div className="mx-auto mt-6 max-w-3xl columns-2 gap-8 text-left font-editorial text-base leading-snug text-ink/70 sm:columns-3" aria-hidden>
            {FRAGMENTS.concat(FRAGMENTS).map((t, i) => (
              <p key={i} className="mb-1 break-inside-avoid">— {t}</p>
            ))}
          </div>
        </div>
      </header>

      {/* Form + sidebar */}
      <section className="mx-auto grid max-w-[1500px] gap-12 px-6 py-12 sm:px-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="font-display text-4xl font-black">Send the first letter.</h2>
          <p className="mt-3 max-w-md font-editorial text-xl text-ink/80">
            Tell us the idea and the feeling. We read every one.
          </p>

          {sent ? (
            <div className="mt-8 rounded-lg border-2 border-meadow bg-meadow-light/20 p-8" role="status">
              <p className="font-display text-2xl font-bold text-meadow">Your letter is on its way.</p>
              <p className="mt-2 font-editorial text-lg text-ink/80">
                If your mail app didn’t open, email us directly at{' '}
                <a className="text-meadow underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            </div>
          ) : (
            <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="name">Name</label>
                  <input className={field} id="name" name="name" required autoComplete="name" />
                </div>
                <div>
                  <label className={label} htmlFor="email">Email</label>
                  <input className={field} id="email" name="email" type="email" required autoComplete="email" />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className={label} htmlFor="type">Project type</label>
                  <select className={field} id="type" name="type" defaultValue="Cinematic site">
                    <option>Cinematic site</option>
                    <option>3D / immersive</option>
                    <option>Storytelling</option>
                    <option>Conversion-focused</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="timeline">Timeline</label>
                  <select className={field} id="timeline" name="timeline" defaultValue="1–3 months">
                    <option>ASAP</option>
                    <option>1–3 months</option>
                    <option>3–6 months</option>
                    <option>Exploring</option>
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="budget">Budget range</label>
                  <select className={field} id="budget" name="budget" defaultValue="$10k–$25k">
                    <option>&lt; $10k</option>
                    <option>$10k–$25k</option>
                    <option>$25k–$50k</option>
                    <option>$50k+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={label} htmlFor="message">What are we building?</label>
                <textarea className={`${field} min-h-[8rem]`} id="message" name="message" required />
              </div>
              <button
                type="submit"
                className="w-fit rounded-full bg-ink px-9 py-4 font-ui text-[0.8rem] uppercase tracking-[0.22em] text-sun transition-transform hover:-translate-y-0.5"
              >
                Send the first letter
              </button>
              <p className="font-ui text-sm text-ink/60">
                Prefer email? <a className="text-meadow underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
            </form>
          )}
        </div>

        {/* Classified sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border-2 border-ink p-6">
            <h3 className="font-display text-2xl font-bold">Common questions</h3>
            <dl className="mt-4 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="font-ui text-sm font-semibold uppercase tracking-[0.1em]">{f.q}</dt>
                  <dd className="mt-1 font-editorial text-lg text-ink/80">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-lg bg-sun p-6">
            <p className="font-display text-2xl font-bold">No bad ideas here.</p>
            <p className="mt-2 font-editorial text-lg text-ink/80">
              Even a one-line spark is enough to start. Send it.
            </p>
          </div>
        </aside>
      </section>

      <SiteFooter variant="paper" />
    </div>
  );
}
