import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { Layout } from './layout/Layout';
import { PageTransition, type PageTransitionHandle, type TransitionVariant } from './layout/PageTransition';

// Route-level code-splitting. HomePage pulls in three.js / R3F / drei — lazy-loading
// it keeps that heavy bundle off the content routes (About/Process/Styles/Contact).
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ProcessPage = lazy(() => import('./pages/ProcessPage').then((m) => ({ default: m.ProcessPage })));
const StylesPage = lazy(() => import('./pages/StylesPage').then((m) => ({ default: m.StylesPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const PostOfficePage = lazy(() => import('./pages/PostOfficePage').then((m) => ({ default: m.PostOfficePage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export default function App() {
  // `location` follows the URL immediately; `displayLocation` is what we actually
  // render. We hold the rendered tree on the old route until the branded curtain
  // fully covers, then swap — so the Canvas mount/unmount is never visible.
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  // Bumped when a transition finishes, to re-run the effect and reconcile any
  // navigation that landed mid-transition.
  const [tick, setTick] = useState(0);
  const transition = useRef<PageTransitionHandle>(null);

  // Always holds the freshest target route, so the curtain can swap straight to
  // the latest destination even if clicks arrive while it is still covering.
  const latest = useRef(location);
  useEffect(() => {
    latest.current = location;
  }, [location]);

  // Single-flight lock: at most one curtain timeline runs at a time, and it is
  // never killed mid-flight — so its final "hide overlay" step always runs and
  // spam-navigation can never strand the curtain covered/half-covered.
  const running = useRef(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (running.current) return;
    if (location.pathname === displayLocation.pathname) return;
    running.current = true;

    const variant: TransitionVariant = hasNavigated.current ? 'fast' : 'full';
    hasNavigated.current = true;

    const handle = transition.current;
    if (!handle) {
      setDisplayLocation(latest.current);
      running.current = false;
      return;
    }
    handle.play(
      () => setDisplayLocation(latest.current),
      variant,
      () => {
        running.current = false;
        setTick((t) => t + 1); // reconcile any navigation that landed mid-transition
      },
    );
  }, [location, displayLocation, tick]);

  return (
    <>
      <Preloader />
      <Cursor />
      <PageTransition ref={transition} />
      <Suspense fallback={null}>
        <Routes location={displayLocation}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/styles" element={<StylesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/post-office" element={<PostOfficePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
