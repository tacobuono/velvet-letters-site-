/**
 * Seeded, deterministic PRNG (mulberry32). Pure — unlike Math.random it is safe
 * to call during render (React 19 `react-hooks/purity`) and produces identical
 * particle / fur / dust fields on every mount, so nothing reshuffles on re-render
 * or HMR. Build a generator with a fixed seed and call it like Math.random().
 */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
