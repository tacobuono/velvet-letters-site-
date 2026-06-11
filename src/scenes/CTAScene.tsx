import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPhysicalMaterial } from 'three';
import { COLORS } from '../lib/tokens';
import { MODELS, useGltfGeometry } from '../lib/models';

type Props = { reducedMotion: boolean };

const SEAL = [0, 0, -58] as const;

export function CTAScene({ reducedMotion }: Props) {
  const wax = useRef<MeshPhysicalMaterial>(null);

  // Beaded gold ring. (The "VL" emboss was removed — it crested the seal exactly
  // where the centred CTA headline sits, poking through the type.)
  const filigreeGeo = useGltfGeometry(MODELS.filigree);

  useFrame((state) => {
    if (reducedMotion || !wax.current) return;
    wax.current.emissiveIntensity = 0.25 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
  });

  return (
    <group position={SEAL}>
      {/* Dark parchment backing */}
      <mesh position={[0, 0, -0.3]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={COLORS.velvetDeep} roughness={0.95} />
      </mesh>

      {/* Beaded gold filigree ring (GLB) — polished metal with clearcoat lacquer
          so the studio environment reads as real reflected gold. Ring is modelled
          in XY (Blender), stood upright to face the camera. */}
      <mesh geometry={filigreeGeo} rotation={[Math.PI / 2, 0, 0]} scale={3.2} castShadow>
        <meshPhysicalMaterial
          color={COLORS.gold}
          emissive={COLORS.gold}
          emissiveIntensity={0.12}
          roughness={0.24}
          metalness={1}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Wax seal — flattened disc, flat face toward the camera. Sealing wax:
          dielectric, semi-glossy clearcoat, subtle sheen, no metalness. */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[1.4, 1.45, 0.35, 96]} />
        <meshPhysicalMaterial
          ref={wax}
          color={COLORS.velvetMid}
          emissive={COLORS.velvetMid}
          emissiveIntensity={0.25}
          roughness={0.4}
          metalness={0}
          clearcoat={0.5}
          clearcoatRoughness={0.4}
          sheen={0.4}
          sheenColor={COLORS.roseLight}
          envMapIntensity={0.8}
        />
      </mesh>

    </group>
  );
}
