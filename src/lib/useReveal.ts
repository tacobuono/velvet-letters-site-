import { useEffect, useRef } from 'react';

/**
 * Scroll-reveal: adds an `is-in` class to every `[data-reveal]` descendant when it
 * enters the viewport (one-shot). Pairs with CSS in globals.css. Honours
 * prefers-reduced-motion (CSS shows everything immediately in that case).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      // Fire as soon as the element edges into view (~80% down the viewport), not
      // after it's 18% up — so reveals finish before the reader reaches the content.
      { threshold: 0.01, rootMargin: '0px 0px -2% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
}
