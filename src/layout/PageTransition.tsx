import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';

/** Which choreography to play. `full` = a sheet is laid, the VL mark is
 *  printed on it, and it is pulled away (first navigation of the session).
 *  `fast` = the sheet only, no impression, ~60% duration — so rapid repeat
 *  navigation never feels like a loading screen. */
export type TransitionVariant = 'full' | 'fast';

export type PageTransitionHandle = {
  /**
   * Runs cover → swap → reveal. `onCovered` fires at the exact moment the screen
   * is fully opaque, so the caller can swap the route + reset scroll invisibly.
   * `onDone` fires when the timeline fully completes (overlay hidden again) — the
   * caller uses it to release its single-flight lock and reconcile late clicks.
   *
   * The caller guarantees single-flight (never calls play() while one is
   * running), so the timeline is never killed mid-flight and its final
   * "hide the overlay" step always runs. That is what makes spam-navigation
   * incapable of stranding the sheet in a covered/half-covered state.
   */
  play: (onCovered: () => void, variant: TransitionVariant, onDone?: () => void) => void;
};

// Full-motif timing (seconds). The fast variant scales these by FAST_SCALE.
const COVER = 0.5;
const HOLD = 0.24;
const REVEAL = 0.6;
const FAST_SCALE = 0.6;

/**
 * Site-wide route transition, as one press impression. A fresh sheet of paper
 * is laid over the screen; on the first navigation the VL mark is printed onto
 * it; the route swaps while covered; then the sheet is pulled away — and the
 * mark leaves with it, because it is printed on the paper. Subsequent
 * navigations lay and pull a blank sheet, faster. Honors prefers-reduced-motion
 * with a plain cross-fade.
 *
 * Lives in the app shell, outside the route outlet, so it persists across
 * navigations. Animates transform + opacity only (compositor-friendly) and is a
 * sibling of <main>, so it never wraps the home's sticky press stage.
 */
export const PageTransition = forwardRef<PageTransitionHandle>(function PageTransition(_props, ref) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Safety net: stop any in-flight tween if the shell ever unmounts.
  useEffect(() => () => {
    tlRef.current?.kill();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      play(onCovered: () => void, variant: TransitionVariant, onDone?: () => void) {
        const root = rootRef.current;
        const sheet = sheetRef.current;
        const mark = markRef.current;
        if (!root || !sheet || !mark) {
          onCovered();
          onDone?.();
          return;
        }

        let swapped = false;
        const swap = () => {
          if (swapped) return;
          swapped = true;
          onCovered();
        };
        const finish = () => {
          // Release the GPU layers the moment the sheet is done compositing.
          gsap.set([sheet, mark], { willChange: 'auto' });
          tlRef.current = null;
          onDone?.();
        };

        // Promote sheet + mark to their own layers only for this run.
        gsap.set([sheet, mark], { willChange: 'transform, opacity' });

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduce) {
          // Accessible fallback: opaque cross-fade, no motion, no mark.
          const tl = gsap.timeline({ onComplete: finish });
          tlRef.current = tl;
          gsap.set(sheet, { y: 0, yPercent: 0, rotation: 0 });
          gsap.set(mark, { opacity: 0 });
          tl.set(root, { visibility: 'visible', pointerEvents: 'auto', opacity: 0 })
            .to(root, { opacity: 1, duration: 0.26, ease: 'none' })
            .call(swap)
            .to(root, { opacity: 0, duration: 0.26, ease: 'none', delay: 0.06 })
            .set(root, { visibility: 'hidden', pointerEvents: 'none' });
          return;
        }

        const withMark = variant === 'full';
        const k = withMark ? 1 : FAST_SCALE;
        const cover = COVER * k;
        const hold = HOLD * k;
        const reveal = REVEAL * k;

        const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: finish });
        tlRef.current = tl;

        tl.set(root, { visibility: 'visible', pointerEvents: 'auto', opacity: 1 })
          // y: 0 explicitly — GSAP reads any pre-existing CSS translate as pixels,
          // and a leftover pixel offset would keep the sheet off-screen while
          // yPercent animates to 0 (the route would swap in plain view).
          .set(sheet, { y: 0, yPercent: -102, rotation: -0.6, transformOrigin: '50% 0%' })
          .set(mark, { opacity: 0, scale: 1.06 })
          // The sheet is laid: slides down and settles square.
          .to(sheet, { yPercent: 0, rotation: 0, duration: cover });

        if (withMark) {
          // The impression: the mark arrives all at once, pressed, not faded in.
          tl.to(mark, { opacity: 1, scale: 1, duration: 0.16, ease: 'power4.out' });
        }

        // Fully covered: swap the route + reset scroll behind the sheet, and
        // hold so the new route commits and paints before the reveal.
        tl.call(swap).to({}, { duration: hold });

        // Pulled away, lifting from the bottom edge as a proof is lifted. The
        // mark is printed on the sheet, so it leaves with it.
        tl.set(sheet, { transformOrigin: '50% 100%' }).to(sheet, {
          yPercent: -102,
          rotation: 0.8,
          duration: reveal,
          ease: 'power3.in',
        });

        tl.set(root, { visibility: 'hidden', pointerEvents: 'none' });
      },
    }),
    [],
  );

  return (
    <div ref={rootRef} className="vt-root" aria-hidden>
      <div ref={sheetRef} className="vt-sheet">
        <span className="vt-crop vt-crop--tl" />
        <span className="vt-crop vt-crop--tr" />
        <span className="vt-crop vt-crop--bl" />
        <span className="vt-crop vt-crop--br" />
        <div ref={markRef} className="vt-mark">
          <svg viewBox="0 0 120 120" width="100%" height="100%" role="img" aria-label="Velvet Letters">
            <rect x="6" y="6" width="108" height="108" fill="none" stroke="#6e2140" strokeWidth="1.5" />
            <rect x="11" y="11" width="98" height="98" fill="none" stroke="#6e2140" strokeWidth="0.6" />
            <text
              x="60"
              y="63"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Playfair Display', serif"
              fontWeight="900"
              fontSize="52"
              fill="#6e2140"
            >
              VL
            </text>
          </svg>
        </div>
        <p className="vt-folio">Velvet Letters · proof</p>
      </div>
    </div>
  );
});
