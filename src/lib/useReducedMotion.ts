import { useEffect, useState } from 'react';

/** Honors `prefers-reduced-motion: reduce`. */
export function useReducedMotion(): boolean {
  // Lazy initializer reads the current preference once (no setState-in-effect,
  // which would trigger a cascading render on mount).
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
