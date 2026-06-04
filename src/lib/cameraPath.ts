import { CatmullRomCurve3, Vector3 } from 'three';

// Six waypoints — one per scene. Scroll progress (0..1) maps to position on the
// curve. The path is deliberately AXIAL: x stays 0 and y barely moves, so the
// camera dollies straight down -Z through centered scenes (a calm forward reveal)
// rather than swooping in diagonal/orbital arcs. Every scene anchor sits on the
// centre axis so this works (see *Scene.tsx CENTER/HALL/SEAL constants).
export const WAYPOINTS = [
  new Vector3(0, 1.2, 16), // Hero: VL monogram at origin
  new Vector3(0, 0.6, 4), // Philosophy: entering the corridor
  new Vector3(0, 0.6, -8), // Services: hexagon dead ahead (distance ~14)
  new Vector3(0, 0.4, -24), // Process: walking the obelisks
  new Vector3(0, 1.2, -42), // Testimonial: the lit hall
  new Vector3(0, 0.4, -52), // CTA: the wax seal (distance ~6)
];

// Look-at targets — also axial (x = 0), each well ahead of its camera so the
// gaze stays forward down the corridor.
export const LOOK_TARGETS = [
  new Vector3(0, 0.3, 0),
  new Vector3(0, 0, -10),
  new Vector3(0, 0, -22),
  new Vector3(0, 0, -34),
  new Vector3(0, 0.6, -50),
  new Vector3(0, 0, -58),
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
