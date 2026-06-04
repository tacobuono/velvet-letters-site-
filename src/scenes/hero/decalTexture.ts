import { CanvasTexture, SRGBColorSpace } from 'three';
import { COLORS } from '../../lib/tokens';

// Deterministic PRNG so the aged panel looks identical every load (no Math.random
// churn between renders, and stable for snapshot/visual-regression).
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Aged carnival-signage panel: distressed cream base, grunge stains, distorted
 * red serif type reading down the panel, light scuffs, radial vignette.
 * Returns a CanvasTexture ready to map onto a PlaneGeometry decal.
 */
export function makeDecalTexture(letters: string, seed: number): CanvasTexture {
  const w = 256;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const rnd = mulberry32(seed);

  // 1. Aged cream gradient base
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#dccfb0');
  grad.addColorStop(1, '#bea783');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 2. Grunge stains
  for (let i = 0; i < 220; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const r = rnd() * 8 + 1;
    ctx.fillStyle = `rgba(40, 25, 15, ${rnd() * 0.06})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Bold serif red type, reading down the panel with jitter
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const chars = letters.replace(/\s+/g, '').split('');
  const slotH = h / (chars.length + 1);
  chars.forEach((ch, i) => {
    const y = slotH * (i + 1);
    const x = w / 2 + (rnd() - 0.5) * 28; // ±14px x-jitter
    const rot = (rnd() - 0.5) * 0.14; // ±0.07 rad
    const scale = 0.9 + rnd() * 0.25;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.fillStyle = 'rgba(156, 51, 34, 0.88)';
    ctx.font = "900 88px 'Playfair Display', Georgia, serif";
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });

  // 4. Light scuffs over the type
  for (let i = 0; i < 90; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const len = rnd() * 18 + 2;
    ctx.strokeStyle = `rgba(245, 239, 230, ${rnd() * 0.18})`;
    ctx.lineWidth = rnd() * 1.5 + 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rnd() - 0.5) * len, y + (rnd() - 0.5) * len);
    ctx.stroke();
  }

  // 5. Radial vignette to darken edges
  const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.6);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(20, 10, 5, 0.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  void COLORS; // tokens kept in scope for future palette tweaks
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 16; // sharp at grazing angles (clamped to GPU max by three)
  return tex;
}
