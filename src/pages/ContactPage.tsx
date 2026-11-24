import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSeo, webPageLd, breadcrumbLd, faqLd } from '../lib/seo';
import { CONTACT_EMAIL } from '../lib/tokens';
import { SiteFooter } from '../layout/SiteFooter';

const TERMS = [
  {
    q: 'What does Velvet Letters print?',
    a: 'Cinematic, custom websites: 3D, immersive, storytelling and conversion-focused experiences for brands that want to be remembered.',
  },
  {
    q: 'How does a job start?',
    a: `Fill the ticket, or write to ${CONTACT_EMAIL}. We reply with a short discovery conversation, then a signed proof of scope before anything is set.`,
  },
  {
    q: 'How many jobs do you take?',
    a: 'One flagship site a quarter, alongside a few smaller runs. If the press is full we will tell you when the next slot opens.',
  },
];

/** The ticket number is the date the ticket was opened: YYMMDD. */
function jobNumber() {
  return new Date().toISOString().slice(2, 10).replace(/-/g, '');
}

export function ContactPage() {
  useSeo({
    title: 'Contact — open a job ticket | Velvet Letters',
    description:
      'Commission a cinematic website from Velvet Letters. Tell us the job, who it is for and when it is wanted by, and we will reply with a discovery conversation.',
    path: '/contact',
    jsonLd: [
      webPageLd('Contact Velvet Letters', '/contact', 'Open a job ticket with Velvet Letters.'),
      breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]),
      faqLd(TERMS),
    ],
  });

  const [sent, setSent] = useState(false);
  const [jobNo] = useState(jobNumber);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Job ticket No. ${jobNo}`,
      `Client: ${f.get('name')}`,
      `Reply to: ${f.get('email')}`,
      `Job: ${f.get('type')}`,
      `Wanted by: ${f.get('timeline')}`,
      `Run size: ${f.get('budget')}`,
      '',
      `${f.get('message')}`,
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Job ticket ${jobNo} — ${f.get('name') || 'new job'}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div className="paper">
      <header className="imprint">
        <p className="imprint__rule">
          <span>Velvet Letters · Press &amp; Foundry</span>
          <span>Job tickets · open</span>
        </p>
        <h1 className="imprint__title proof-line">
          Tell us what you&rsquo;d like <del>built</del> <ins>printed</ins>.
        </h1>
        <p className="press-lede">
          Every job here starts on a ticket. Fill in what you know; we will read every word and come back
          with a conversation, not a quote.
        </p>
      </header>

      <section className="press-section grid gap-12 lg:grid-cols-[1.45fr_1fr] lg:gap-16" aria-label="Job ticket and terms">
        <div>
          {sent ? (
            <div className="ticket" role="status">
              <div className="ticket__head">
                <span>
                  Job ticket <b>No. {jobNo}</b>
                </span>
                <span>To press</span>
              </div>
              <div className="received">
                <span className="received__stamp">Received</span>
                <p className="received__title">Your ticket is on its way to the press.</p>
                <p className="received__body">
                  If your mail app did not open, write to us directly at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              </div>
            </div>
          ) : (
            <form className="ticket" onSubmit={onSubmit}>
              <div className="ticket__head">
                <span>
                  Job ticket <b>No. {jobNo}</b>
                </span>
                <span>Received ________</span>
              </div>

              <div className="ticket__grid ticket__grid--2">
                <label className="field" htmlFor="name">
                  <span className="field__label">Client</span>
                  <input className="field__input" id="name" name="name" required autoComplete="name" />
                </label>
                <label className="field" htmlFor="email">
                  <span className="field__label">Reply to</span>
                  <input className="field__input" id="email" name="email" type="email" required autoComplete="email" />
                </label>
              </div>

              <div className="ticket__grid ticket__grid--3">
                <label className="field" htmlFor="type">
                  <span className="field__label">Job</span>
                  <select className="field__input" id="type" name="type" defaultValue="Cinematic site">
                    <option>Cinematic site</option>
                    <option>3D / immersive</option>
                    <option>Storytelling</option>
                    <option>Conversion-focused</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <label className="field" htmlFor="timeline">
                  <span className="field__label">Wanted by</span>
                  <select className="field__input" id="timeline" name="timeline" defaultValue="1–3 months">
                    <option>As soon as the press is free</option>
                    <option>1–3 months</option>
                    <option>3–6 months</option>
                    <option>Exploring</option>
                  </select>
                </label>
                <label className="field" htmlFor="budget">
                  <span className="field__label">Run size</span>
                  <select className="field__input" id="budget" name="budget" defaultValue="$10k–$25k">
                    <option>&lt; $10k</option>
                    <option>$10k–$25k</option>
                    <option>$25k–$50k</option>
                    <option>$50k+</option>
                  </select>
                </label>
              </div>

              <div className="ticket__grid">
                <label className="field" htmlFor="message">
                  <span className="field__label">Copy — what are we setting, and for whom?</span>
                  <textarea className="field__input" id="message" name="message" required />
                </label>
              </div>

              <div className="ticket__foot">
                <button type="submit" className="sort-btn">
                  Send to press
                </button>
                <p className="ticket__alt">
                  Prefer a letter? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </p>
              </div>
            </form>
          )}
        </div>

        <aside>
          <dl className="house-terms" aria-label="Terms of the house">
            {TERMS.map((t) => (
              <div key={t.q}>
                <dt>{t.q}</dt>
                <dd>{t.a}</dd>
              </div>
            ))}
          </dl>
          <div className="specimen-note">
            <p>
              <b>Specimens on request.</b>
              Not sure which kind of site you need? The specimen book shows all eight faces we cut, set in
              their own type.
            </p>
            <Link to="/styles">Open the specimen book</Link>
          </div>
        </aside>
      </section>

      <div className="pb-24" />
      <SiteFooter variant="paper" />
    </div>
  );
}
