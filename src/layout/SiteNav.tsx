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
  const accent = light ? 'hover:text-wax' : 'hover:text-brass';
  const bg = solid
    ? light
      ? 'bg-bone/90 backdrop-blur-md border-b border-ink/10'
      : 'bg-pine-deep/90 backdrop-blur-md border-b border-brass/15'
    : 'border-b border-transparent';

  return (
    <header className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-500 ${bg}`}>
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 sm:px-10 ${text}`}
      >
        <Link
          to="/"
          className={`font-grotesk text-lg font-bold uppercase tracking-[0.24em] no-underline ${light ? 'text-ink' : 'text-cream'}`}
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
                  `font-grotesk text-[0.74rem] font-medium uppercase tracking-[0.18em] no-underline transition-colors ${accent} ${
                    isActive ? (light ? 'text-wax' : 'text-brass') : ''
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
              className={`rounded-full px-5 py-2 font-grotesk text-[0.7rem] font-semibold uppercase tracking-[0.2em] no-underline transition-transform hover:-translate-y-0.5 ${
                light ? 'bg-ink text-bone' : 'bg-brass text-pine-deep'
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
          className={`md:hidden ${light ? 'bg-bone text-ink' : 'bg-pine-deep text-cream'} border-t ${light ? 'border-ink/10' : 'border-brass/15'}`}
        >
          <ul className="flex list-none flex-col gap-1 px-6 py-4">
            {ROUTES.map((r) => (
              <li key={r.to}>
                <NavLink
                  to={r.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 font-grotesk text-sm font-medium uppercase tracking-[0.18em] no-underline ${
                      isActive ? (light ? 'text-wax' : 'text-brass') : ''
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
