import { useEffect, useRef } from 'react';

/** Swatches of the printer's colour bar, top to bottom. */
const BAR = ['#0a1410', '#16281e', '#3f9f72', '#8a6a38', '#b7935a', '#d8c08a', '#f2ebdf', '#6e2140'];
/** The counter reads as an edition: this many impressions for the whole page. */
const EDITION = 500;

/**
 * Printer's marks as working interface. Crop marks frame the viewport; the
 * colour bar on the edge is the scroll-progress indicator (its swatches ink in
 * as the page is read); the impression counter numbers the visitor's place in
 * the run. Decorative to assistive tech — the page's own headings carry the
 * structure.
 */
export function PressMarks() {
  const swatches = useRef<(HTMLSpanElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (p !== last) {
        last = p;
        const inked = p * BAR.length;
        swatches.current.forEach((el, i) => {
          if (el) el.style.opacity = String(Math.min(Math.max(inked - i, 0.16), 1));
        });
        if (counter.current) {
          counter.current.textContent = String(Math.round(p * EDITION)).padStart(4, '0');
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className="press-marks" aria-hidden>
        <span className="crop crop--tl" />
        <span className="crop crop--tr" />
        <span className="crop crop--bl" />
        <span className="crop crop--br" />
        <p className="impression">
          Impression <span ref={counter}>0000</span> / {String(EDITION).padStart(4, '0')}
        </p>
      </div>
      <div className="colour-bar" aria-hidden>
        {BAR.map((colour, i) => (
          <span
            key={colour}
            ref={(el) => {
              swatches.current[i] = el;
            }}
            style={{ background: colour }}
          />
        ))}
      </div>
    </>
  );
}
