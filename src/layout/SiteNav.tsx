import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ROUTES, LIGHT_ROUTES } from './routes';

export function SiteNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const light = LIGHT_ROUTES.has(location.pathname);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const text = light ? 'text-ink' : 'text-cream';
  const accent = light ? 'hover:text-meadow' : 'hover:text-gold';
  const bg = solid
    ? light
      ? 'bg-newsprint/90 backdrop-blur-md border-b border-ink/10'
      : 'bg-velvet-deep/90 backdrop-blur-md border-b border-gold/15'
    : 'border-b border-transparent';

  return (
    <header className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-500 ${bg}`}>
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 sm:px-10 ${text}`}
      >
        <Link
          to="/"
          className={`font-display text-lg font-bold uppercase tracking-[0.22em] no-underline ${light ? 'text-ink' : 'text-gold'}`}
        >
          Velvet&nbsp;Letters
        </Link>

        {/* Desktop links */}
        <ul className="hidden list-none items-center gap-8 md:flex">
          {ROUTES.slice(1).map((r) => (
            <li key={r.to}>
              <NavLink
                to={r.to}
                className={({ isActive }) =>
                  `font-ui text-[0.8rem] uppercase tracking-[0.15em] no-underline transition-colors ${accent} ${
                    isActive ? (light ? 'text-meadow' : 'text-gold') : ''
                  }`
                }
              >
                {r.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link
              to="/contact"
              className={`rounded-full px-5 py-2 font-ui text-[0.75rem] uppercase tracking-[0.18em] no-underline transition-transform hover:-translate-y-0.5 ${
                light ? 'bg-ink text-newsprint' : 'bg-gold text-velvet-deep'
              }`}
            >
              Start a project
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className={`md:hidden ${text}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="font-ui text-2xl leading-none">{open ? '×' : '≡'}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className={`md:hidden ${light ? 'bg-newsprint text-ink' : 'bg-velvet-deep text-cream'} border-t ${light ? 'border-ink/10' : 'border-gold/15'}`}
        >
          <ul className="flex list-none flex-col gap-1 px-6 py-4">
            {ROUTES.map((r) => (
              <li key={r.to}>
                <NavLink
                  to={r.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 font-ui text-sm uppercase tracking-[0.15em] no-underline ${
                      isActive ? (light ? 'text-meadow' : 'text-gold') : ''
                    }`
                  }
                >
                  {r.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
