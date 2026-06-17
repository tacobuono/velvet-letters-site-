import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';

/** Which choreography to play. `full` = velvet curtain + gold wax seal at full
 *  duration (first navigation of the session). `fast` = curtain only, no seal,
 *  ~60% duration — so rapid repeat navigation never feels like a loading screen. */
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
   * incapable of stranding the curtain in a covered/half-covered state.
   */
  play: (onCovered: () => void, variant: TransitionVariant, onDone?: () => void) => void;
};

// Full-motif timing (seconds). The fast variant scales these by FAST_SCALE.
const COVER = 0.55;
const HOLD = 0.2;
const REVEAL = 0.62;
const FAST_SCALE = 0.6;

/**
 * Site-wide branded page transition. A velvet curtain falls to cover the screen;
 * on the first navigation a gold "VL" wax seal presses in at center; the route
 * swaps while covered; the curtain lifts away to reveal the new page. Subsequent
 * navigations use a faster, seal-less curtain wipe. Honors prefers-reduced-motion
 * with a plain cross-fade.
 *
 * Lives in the app shell, outside the route outlet, so it persists across
 * navigations. Animates transform + opacity only (compositor-friendly) and is a
 * sibling of <main> — it never wraps the Home page's position:fixed canvas, so it
 * introduces no containing block that could break the WebGL layer.
 */
export const PageTransition = forwardRef<PageTransitionHandle>(function PageTransition(_props, ref) {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
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
        const curtain = curtainRef.current;
        const seal = sealRef.current;
        if (!root || !curtain || !seal) {
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
          // Release the GPU layers the moment the curtain is done compositing.
          gsap.set([curtain, seal], { willChange: 'auto' });
          tlRef.current = null;
          onDone?.();
        };

        // Promote curtain + seal to their own layers only for the duration of
        // this run (the matching CSS will-change was removed so idle has none).
        gsap.set([curtain, seal], { willChange: 'transform, opacity' });

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduce) {
          // Accessible fallback: opaque cross-fade, no motion, no seal.
          const tl = gsap.timeline({ onComplete: finish });
          tlRef.current = tl;
          gsap.set(curtain, { scaleY: 1, transformOrigin: '50% 50%' });
          gsap.set(seal, { opacity: 0 });
          tl.set(root, { visibility: 'visible', pointerEvents: 'auto', opacity: 0 })
            .to(root, { opacity: 1, duration: 0.26, ease: 'none' })
            .call(swap)
            .to(root, { opacity: 0, duration: 0.26, ease: 'none', delay: 0.06 })
            .set(root, { visibility: 'hidden', pointerEvents: 'none' });
          return;
        }

        const withSeal = variant === 'full';
        const k = withSeal ? 1 : FAST_SCALE;
        const cover = COVER * k;
        const hold = HOLD * k;
        const reveal = REVEAL * k;

        const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: finish });
        tlRef.current = tl;

        tl.set(root, { visibility: 'visible', pointerEvents: 'auto', opacity: 1 })
          .set(curtain, { scaleY: 0, transformOrigin: '50% 0%' })
          .set(seal, { opacity: 0, scale: 0.55, rotate: -10 })
          // Curtain falls from the top to full cover.
          .to(curtain, { scaleY: 1, duration: cover });

        if (withSeal) {
          // Gold seal presses in as the velvet closes over (first navigation only).
          tl.to(
            seal,
            { opacity: 1, scale: 1, rotate: 0, duration: 0.46, ease: 'back.out(1.6)' },
            `-=${cover * 0.55}`,
          );
        }

        // Fully covered: swap the route + reset scroll behind the velvet.
        tl.call(swap)
          // Hold opaque so the new route commits and paints before the reveal.
          .set(curtain, { transformOrigin: '50% 100%' }, `+=${hold}`);

        if (withSeal) {
          tl.to(seal, { opacity: 0, scale: 1.08, duration: 0.32, ease: 'power2.in' });
          tl.to(curtain, { scaleY: 0, duration: reveal }, '<0.04');
        } else {
          tl.to(curtain, { scaleY: 0, duration: reveal });
        }

        tl.set(root, { visibility: 'hidden', pointerEvents: 'none' });
      },
    }),
    [],
  );

  return (
    <div ref={rootRef} className="vt-root" aria-hidden>
      <div ref={curtainRef} className="vt-curtain" />
      <div ref={sealRef} className="vt-seal">
        <svg viewBox="0 0 120 120" width="100%" height="100%" role="img" aria-label="Velvet Letters">
          <defs>
            <radialGradient id="vtGold" cx="38%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#f0c755" />
              <stop offset="55%" stopColor="#c9a84c" />
              <stop offset="100%" stopColor="#8a6f2c" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="52" fill="url(#vtGold)" />
          <circle cx="60" cy="60" r="46" fill="none" stroke="#1a0515" strokeOpacity="0.32" strokeWidth="1.5" />
          <text
            x="60"
            y="63"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Playfair Display', serif"
            fontWeight="900"
            fontSize="44"
            fill="#1a0515"
            fillOpacity="0.82"
          >
            VL
          </text>
        </svg>
      </div>
    </div>
  );
});
