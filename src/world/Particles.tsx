import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points } from 'three';
import { COLORS } from '../lib/tokens';
import { scroll } from '../lib/scrollStore';
import { makeRng } from '../lib/rng';

type Props = { count: number; reducedMotion: boolean };

/**
 * Persistent gold-dust system spanning the whole velvet corridor. Rotates slowly
 * and drifts along -Z relative to scroll so motes stream past the camera.
 */
export function Particles({ count, reducedMotion }: Props) {
  const ref = useRef<Points>(null);

  const geometry = useMemo(() => {
    const rng = makeRng(count * 7 + 101);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 30; // x
      positions[i * 3 + 1] = (rng() - 0.5) * 18; // y
      positions[i * 3 + 2] = -rng() * 70 + 6; // z spread down the full corridor
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  const animT = useRef(0);
  useFrame((_, delta) => {
    const p = ref.current;
    if (!p) return;
    if (!reducedMotion) {
      animT.current += Math.min(delta, 0.05);
      p.rotation.y = animT.current * 0.02;
    }
    // Drift toward the camera as the viewer scrolls deeper, wrapping in place.
    p.position.z = (scroll.progress * 8) % 12;
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color={COLORS.gold}
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
