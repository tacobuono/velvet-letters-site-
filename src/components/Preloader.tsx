import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';

// One full pass of the roller is the brand beat; never longer than the hard cap
// even if a loader stalls, so the visitor is never stuck on the loader.
const MIN_MS = 1400;
const MAX_MS = 5000;
const POLL_MS = 120;

/**
 * The loader is the press being made ready: a line of type, set reversed as it
 * sits in the forme, and an ink roller passing over it, leaving the faces
 * velvet-plum. The home opens on the same forme, so the loader hands straight
 * into the first shot.
 *
 * Dismissal is tied to real asset loading via drei's useProgress (fonts,
 * textures) after a minimum beat, with a hard cap. A CSS-only failsafe in
 * .press-loader also lifts it if this script never runs at all.
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
    <div aria-hidden className={`press-loader ${hidden ? 'press-loader--done' : ''}`}>
      <div className="press-loader__forme">
        <span className="press-loader__type">
          <span className="press-loader__mirror">Velvet Letters</span>
        </span>
        <span className="press-loader__type press-loader__type--inked">
          <span className="press-loader__mirror">Velvet Letters</span>
        </span>
        <span className="press-loader__track">
          <span className="press-loader__roller" />
        </span>
      </div>
      <p className="press-loader__caption">Inking the forme</p>
    </div>
  );
}
