import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLenis, resetScroll } from '../lib/useScrollProgress';
import { SiteNav } from './SiteNav';

/**
 * App shell shared by every route: a skip-to-content link, the route-aware nav,
 * one app-level Lenis smooth-scroll instance, scroll-reset on navigation, and a
 * keyed page-transition wrapper (CSS fade/rise on mount; honours
 * prefers-reduced-motion via globals.css).
 */
export function Layout() {
  const location = useLocation();
  useLenis(); // single shared smooth-scroll foundation for all pages
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    resetScroll();
    // Move keyboard/screen-reader focus onto the freshly-loaded page (not on the
    // very first load). Without this, focus stays on the clicked nav link and SR
    // users aren't told the page changed. preventScroll so it can't fight Lenis.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteNav />
      <main id="main-content" ref={mainRef} tabIndex={-1} key={location.pathname} className="page-enter">
        <Outlet />
      </main>
    </>
  );
}
