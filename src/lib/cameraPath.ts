import { CatmullRomCurve3, Vector3 } from 'three';

// Six waypoints — one per beat of the "site within the site" journey. The
// fictional client artboard sits at the origin (y 0.2); the camera circles and
// pushes in around it: wide open shot, over-the-shoulder push, left drift,
// square-on settle, locked while the page scrolls itself, then the dive
// straight into the closing photograph (the doorway to /about).
export const WAYPOINTS = [
  new Vector3(0, 0.9, 11), // B1: wide — blank artboard in the studio dark
  new Vector3(-2.6, 0.6, 8.2), // B2: drift left → board sits right, clear of the left copy
  new Vector3(2.6, 0.4, 8.0), // B3: cross right → board sits left, clear of the right copy
  new Vector3(0, 0.5, 7.6), // B4: settle square-on for the cascade
  new Vector3(0, 0.2, 7.8), // B5: locked, full page in frame as it scrolls itself
  new Vector3(0, 0.2, 1.15), // B6: dive into the closing photograph
];

// Look-at targets — offsetting the gaze pushes the board to the opposite side
// of the frame, keeping a clean column for that beat's DOM copy panel.
export const LOOK_TARGETS = [
  new Vector3(0, 0.3, 0),
  new Vector3(-1.1, 0.4, 0), // board right (Philosophy copy pinned left)
  new Vector3(1.15, 0.1, 0), // board left (Services copy pinned right)
  new Vector3(0, 0.55, 0), // board drops low (Process copy along the bottom)
  new Vector3(0, 0.2, 0),
  new Vector3(0, 0.2, -1.5),
];

// Tension 0.3 (was 0.5) softens direction changes at waypoints so the camera
// eases through segment joins instead of popping between them.
export const cameraCurve = new CatmullRomCurve3(WAYPOINTS, false, 'catmullrom', 0.3);

const SEGMENTS = WAYPOINTS.length - 1;

/**
 * Re-maps linear scroll progress (0..1) so the camera eases as it arrives at and
 * departs from each waypoint, rather than sliding at a constant rate. Uses
 * Ken Perlin's smootherstep (quintic, 6t^5-15t^4+10t^3) — zero first AND second
 * derivative at the endpoints, so transitions have no velocity *or* acceleration
 * snap at scene boundaries. The result: the camera dwells a beat on each scene
 * and flows between them. Monotonic, so scroll still tracks predictably.
 */
export function easeSegmented(t: number): number {
  const x = Math.min(Math.max(t, 0), 1) * SEGMENTS;
  const i = Math.min(Math.floor(x), SEGMENTS - 1);
  const f = x - i;
  const eased = f * f * f * (f * (f * 6 - 15) + 10); // smootherstep (quintic)
  return (i + eased) / SEGMENTS;
}

const _a = new Vector3();
const _b = new Vector3();

/**
 * Interpolated look-at target for a given normalized progress t (0..1).
 * Writes into `out` to avoid per-frame allocations.
 */
export function getLookTarget(t: number, out: Vector3): Vector3 {
  const segments = LOOK_TARGETS.length - 1;
  const scaled = Math.min(Math.max(t, 0), 1) * segments;
  const i = Math.min(Math.floor(scaled), segments - 1);
  const localT = scaled - i;
  _a.copy(LOOK_TARGETS[i]);
  _b.copy(LOOK_TARGETS[i + 1]);
  return out.lerpVectors(_a, _b, localT);
}
