// Single source of truth for normalized scroll progress (0..1).
// Lenis writes here on every scroll; R3F components read it inside useFrame.
// A plain mutable object avoids triggering React re-renders every frame.

export type ScrollState = {
  /** Normalized progress across the whole page, 0..1. */
  progress: number;
  /** Index of the section currently most in view (0..SECTIONS.length-1). */
  section: number;
  /** Raw velocity from Lenis, used for subtle motion-reactive effects. */
  velocity: number;
};

export const scroll: ScrollState = {
  progress: 0,
  section: 0,
  velocity: 0,
};
