import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLenis, resetScroll } from '../lib/useScrollProgress';
import { SiteNav } from './SiteNav';

/**
 * App shell shared by every route: the route-aware nav, one app-level Lenis
 * smooth-scroll instance, scroll-reset on navigation, and a keyed page-transition
 * wrapper (CSS fade/rise on mount; honours prefers-reduced-motion via globals.css).
 */
export function Layout() {
  const location = useLocation();
  useLenis(); // single shared smooth-scroll foundation for all pages

  useEffect(() => {
    resetScroll();
  }, [location.pathname]);

  return (
    <>
      <SiteNav />
      <main key={location.pathname} className="page-enter">
        <Outlet />
      </main>
    </>
  );
}
