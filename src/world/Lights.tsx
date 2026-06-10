import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { PointLight } from 'three';
import { COLORS } from '../lib/tokens';

type Props = { reducedMotion: boolean };

/**
 * Scene-wide lighting rig that travels with the velvet world (Philosophy → CTA).
 * The Hero scene adds its own warmer rig on top for the romantic-decay look.
 */
export function Lights({ reducedMotion }: Props) {
  const warm = useRef<PointLight>(null);

  const animT = useRef(0);
  useFrame((_, delta) => {
    if (reducedMotion) return;
    animT.current += Math.min(delta, 0.05);
    const t = animT.current;
    if (warm.current) {
      warm.current.position.x = 4 + Math.sin(t * 0.4) * 2;
      warm.current.position.y = 3 + Math.cos(t * 0.3) * 1.5;
    }
  });

  return (
    <>
      {/* Ambient nudged up (0.4→0.5) to backfill the cinematic split the removed
          cool point-light used to give — keeps the left/back from going dead-black. */}
      <ambientLight color={COLORS.velvet} intensity={0.5} />
      <directionalLight color={COLORS.goldLight} intensity={0.5} position={[0, 8, 4]} />
      <pointLight ref={warm} color={COLORS.gold} intensity={40} distance={30} decay={2} position={[4, 3, 2]} />
    </>
  );
}
