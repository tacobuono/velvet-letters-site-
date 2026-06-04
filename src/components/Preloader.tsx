import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';

// Brand moment shows for at least this long; never longer than the hard cap
// even if a loader stalls, so the visitor is never stuck on the loader.
const MIN_MS = 1200;
const MAX_MS = 5000;
const POLL_MS = 120;

/**
 * Brand-matched loader: breathing VL monogram + sliding gold bar.
 *
 * Dismissal is tied to real asset loading via drei's useProgress (fonts,
 * textures, environment) rather than a blind timer: after a minimum brand beat
 * it waits for loading to go idle, then hides — with a hard cap as a safety net.
 * Dismissal is monotonic (it never reappears if a later asset streams in).
 */
export function Preloader() {
  const { active } = useProgress();
  const activeRef = useRef(active);
  const [hidden, setHidden] = useState(false);

  // Keep the latest loading state readable from inside the timers below.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const cap = setTimeout(() => setHidden(true), MAX_MS);
    let poll: ReturnType<typeof setTimeout>;
    const check = () => {
      if (!activeRef.current) setHidden(true);
      else poll = setTimeout(check, POLL_MS);
    };
    poll = setTimeout(check, MIN_MS);
    return () => {
      clearTimeout(cap);
      clearTimeout(poll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-velvet-deep transition-[opacity,visibility] duration-700 ${
        hidden ? 'pointer-events-none invisible opacity-0' : ''
      }`}
    >
      <div className="font-display text-6xl font-black tracking-[0.3em] text-gold preloader-breathe">VL</div>
      <div className="mt-8 h-px w-52 overflow-hidden bg-gold/20">
        <div className="h-full w-full bg-gold preloader-slide" />
      </div>
    </div>
  );
}
