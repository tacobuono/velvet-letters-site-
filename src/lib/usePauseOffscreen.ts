import { useEffect } from 'react';

/**
 * Pauses CSS keyframe animations that would otherwise composite forever, even
 * when scrolled out of view (browsers don't pause off-screen CSS animations).
 *
 * Mark any element whose descendants animate with `data-anim-pause`; this toggles
 * an `is-onscreen` class on it as it enters/leaves the viewport. Paired CSS in
 * globals.css sets `animation-play-state: paused` until the class is present.
 *
 * Call once from a page that owns such elements — it scans the document after
 * mount, so the elements are already in the DOM.
 */
export function usePauseOffscreen() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-anim-pause]'));
    if (!els.length) return;
    if (typeof IntersectionObserver === 'undefined') {
      // No observer support → never pause (correctness over the optimization).
      els.forEach((el) => el.classList.add('is-onscreen'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle('is-onscreen', e.isIntersecting);
      },
      // A small margin so animations are already running before they scroll in.
      { rootMargin: '100px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
