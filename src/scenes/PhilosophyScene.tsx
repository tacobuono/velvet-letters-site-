import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { COLORS } from '../lib/tokens';

type Props = { reducedMotion: boolean };

/** A glowing envelope: thin box body + triangular flap. GLB-ready stand-in. */
function Envelope({
  position,
  rotationY,
  spin,
  reducedMotion,
}: {
  position: [number, number, number];
  rotationY: number;
  spin: number;
  reducedMotion: boolean;
}) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y = rotationY + Math.sin(state.clock.elapsedTime * 0.3 + spin) * 0.25;
  });
  return (
    <group ref={ref} position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.3, 0.9, 0.06]} />
        <meshStandardMaterial
          color={COLORS.cream}
          emissive={COLORS.goldLight}
          emissiveIntensity={0.25}
          roughness={0.6}
        />
      </mesh>
      {/* Flap */}
      <mesh position={[0, 0.12, 0.04]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.64, 0.64]} />
        <meshStandardMaterial color={COLORS.creamWarm} emissive={COLORS.gold} emissiveIntensity={0.15} side={2} />
      </mesh>
    </group>
  );
}

export function PhilosophyScene({ reducedMotion }: Props) {
  // Envelopes lining both walls of the corridor (running down -Z).
  const envelopes = useMemo(() => {
    const items: { position: [number, number, number]; rotationY: number; spin: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const z = -2 - i * 1.8;
      const y = (i % 2 === 0 ? 0.6 : -0.4) + Math.sin(i) * 0.3;
      items.push({ position: [-2.6, y, z], rotationY: 0.5, spin: i });
      items.push({ position: [2.6, y + 0.3, z], rotationY: -0.5, spin: i + 3 });
    }
    return items;
  }, []);

  return (
    <group>
      {/* Corridor walls */}
      <mesh position={[-3.4, 0, -8]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color={COLORS.velvet} roughness={0.9} metalness={0.05} side={2} />
      </mesh>
      <mesh position={[3.4, 0, -8]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color={COLORS.velvet} roughness={0.9} metalness={0.05} side={2} />
      </mesh>
      <mesh position={[0, -3.4, -8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 18]} />
        <meshStandardMaterial color={COLORS.velvetDeep} roughness={0.95} side={2} />
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
