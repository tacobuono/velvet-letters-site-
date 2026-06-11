import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, Group, Shape, ShapeGeometry } from 'three';
import { COLORS } from '../lib/tokens';

type Props = { reducedMotion: boolean };

type EnvelopeProps = {
  position: [number, number, number];
  rotationY: number;
  scale: number;
  spin: number;
  reducedMotion: boolean;
};

/**
 * A real sealed envelope: card body + a downward flap triangle + a wax dot — so it
 * reads as the brand's letter motif instead of a box with a floating diamond. The
 * card spans x[-0.7, 0.7], y[-0.5, 0.5]; the flap fills the top half, apex at center.
 */
function Envelope({ position, rotationY, scale, spin, reducedMotion }: EnvelopeProps) {
  const ref = useRef<Group>(null);
  const animT = useRef(0);

  const flapGeo = useMemo(() => {
    const s = new Shape();
    s.moveTo(-0.7, 0.5);
    s.lineTo(0.7, 0.5);
    s.lineTo(0, 0.02);
    s.closePath();
    return new ShapeGeometry(s);
  }, []);

  // Accumulated clamped time (not clock.elapsedTime) so the sway pauses and resumes
  // cleanly under frameloop="demand" — no jump when the loop wakes from sleep.
  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    animT.current += Math.min(delta, 0.05);
    ref.current.rotation.y = rotationY + Math.sin(animT.current * 0.25 + spin) * 0.12;
  });

  return (
    <group ref={ref} position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* Card body */}
      <mesh>
        <boxGeometry args={[1.4, 1.0, 0.05]} />
        <meshStandardMaterial
          color={COLORS.cream}
          emissive={COLORS.goldLight}
          emissiveIntensity={0.08}
          roughness={0.78}
          metalness={0}
        />
      </mesh>
      {/* Flap — the sealed-envelope silhouette */}
      <mesh geometry={flapGeo} position={[0, 0, 0.028]}>
        <meshStandardMaterial
          color={COLORS.creamWarm}
          emissive={COLORS.gold}
          emissiveIntensity={0.06}
          roughness={0.82}
          side={DoubleSide}
        />
      </mesh>
      {/* Wax seal dot at the flap apex */}
      <mesh position={[0, 0.03, 0.05]}>
        <circleGeometry args={[0.075, 18]} />
        <meshStandardMaterial color={COLORS.roseDeep} roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function PhilosophyScene({ reducedMotion }: Props) {
  // Five sealed letters drifting down the right of the corridor, receding into the
  // dark — a deliberate motif, kept off the left-pinned Philosophy copy column.
  const envelopes = useMemo(() => {
    const items: {
      position: [number, number, number];
      rotationY: number;
      scale: number;
      spin: number;
    }[] = [
      { position: [2.2, 0.9, -3.2], rotationY: -0.45, scale: 1.15, spin: 0 },
      { position: [1.3, -0.7, -5.0], rotationY: -0.28, scale: 0.95, spin: 1.6 },
      { position: [2.9, 0.1, -6.6], rotationY: -0.55, scale: 1.05, spin: 3.1 },
      { position: [1.8, 1.35, -8.4], rotationY: -0.22, scale: 0.85, spin: 4.4 },
      { position: [2.0, -1.1, -9.6], rotationY: -0.4, scale: 0.95, spin: 6.0 },
    ];
    return items;
  }, []);

  return (
    <group>
      {/* Corridor walls */}
      <mesh position={[-3.4, 0, -8]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color={COLORS.velvet} roughness={0.9} metalness={0.05} side={DoubleSide} />
      </mesh>
      <mesh position={[3.4, 0, -8]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color={COLORS.velvet} roughness={0.9} metalness={0.05} side={DoubleSide} />
      </mesh>
      <mesh position={[0, -3.4, -8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 18]} />
        <meshStandardMaterial color={COLORS.velvetDeep} roughness={0.95} side={DoubleSide} />
      </mesh>

      {/* Gold ribbon strands from the ceiling */}
      {[-1.4, 0.2, 1.6].map((x, i) => (
        <mesh key={i} position={[x, 2.5, -6 - i * 1.5]} rotation={[0, 0, Math.sin(i) * 0.3]}>
          <cylinderGeometry args={[0.018, 0.018, 4, 16]} />
          <meshPhysicalMaterial
            color={COLORS.gold}
            emissive={COLORS.gold}
            emissiveIntensity={0.25}
            roughness={0.25}
            metalness={1}
            clearcoat={0.5}
            envMapIntensity={1.3}
          />
        </mesh>
      ))}

      {envelopes.map((e, i) => (
        <Envelope key={i} {...e} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}
