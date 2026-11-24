import { Vector3 } from 'three';

// Shared state for the home's press sequence. The hero writes `progress` (0..1
// across its pinned scroll span); the 3D scene reads it inside useFrame. Plain
// mutable values, so nothing re-renders per frame.
export const press = {
  progress: 0,
};

/** World-space point the depth-of-field pass should hold in focus. */
export const pressFocus = new Vector3(0, 0.3, 0);

/** Smoothstep 0..1. */
export const ss = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** Eased 0..1 progress of p across the [a, b] window. */
export const seg = (p: number, a: number, b: number) => ss((p - a) / (b - a));

// Beats of the press run, as fractions of the hero's scroll span.
export const BEATS = {
  /** Camera rises from the raking macro shot to look down on the forme. */
  rise: [0, 0.3],
  /** The sheet slides in and is laid on the type. */
  lay: [0.3, 0.46],
  /** The sheet lifts and turns over, printed side up. */
  pull: [0.52, 0.78],
  /** The printed sheet rises to fill the frame and becomes the page. */
  fill: [0.78, 1],
} as const;
