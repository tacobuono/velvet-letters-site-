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
  const cool = useRef<PointLight>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (warm.current) {
      warm.current.position.x = 4 + Math.sin(t * 0.4) * 2;
      warm.current.position.y = 3 + Math.cos(t * 0.3) * 1.5;
    }
    if (cool.current) {
      cool.current.position.x = -5 + Math.cos(t * 0.25) * 2;
      cool.current.position.z = -10 + Math.sin(t * 0.2) * 3;
    }
  });

  return (
    <>
      <ambientLight color={COLORS.velvet} intensity={0.4} />
      <directionalLight color={COLORS.goldLight} intensity={0.5} position={[0, 8, 4]} />
      <pointLight ref={warm} color={COLORS.gold} intensity={40} distance={30} decay={2} position={[4, 3, 2]} />
      <pointLight
        ref={cool}
        color={COLORS.velvetMid}
        intensity={30}
        distance={28}
        decay={2}
        position={[-5, -2, -10]}
      />
    </>
  );
}
