import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { Layout } from './layout/Layout';

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
  return (
    <>
      <Preloader />
      <Cursor />
      <Suspense fallback={null}>
        <Routes>
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
