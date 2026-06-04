import { useMemo } from 'react';
import { MeshReflectorMaterial, Text } from '@react-three/drei';
import { COLORS, FONT_FILES } from '../lib/tokens';
import { PROCESS } from '../data/content';

type Props = { reducedMotion: boolean };

export function ProcessScene({ reducedMotion }: Props) {
  void reducedMotion; // obelisks are static; reflection handles ambiance

  const obelisks = useMemo(
    () =>
      PROCESS.map((step, i) => ({
        step,
        // Centred on the axis (x≈0), receding down -Z so the camera walks them.
        position: [i % 2 === 0 ? -1.4 : 1.4, 0, -30 - i * 3] as [number, number, number],
      })),
    [],
  );

  return (
    <group>
      {/* Reflective floor beneath the walk */}
      <mesh position={[0, -2.5, -34]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <MeshReflectorMaterial
          color={COLORS.velvetDeep}
          roughness={0.7}
          metalness={0.2}
          blur={[400, 200]}
          mixBlur={1}
          mixStrength={1.2}
          resolution={512}
          mirror={0.4}
          depthScale={0.6}
        />
      </mesh>

      {obelisks.map(({ step, position }) => (
        <group key={step.numeral} position={position}>
          {/* Obelisk */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 5, 0.8]} />
            <meshStandardMaterial color={COLORS.velvet} roughness={0.5} metalness={0.35} envMapIntensity={0.9} />
          </mesh>
          {/* Vertical gold inlay — polished metal strip */}
          <mesh position={[0, 0, 0.41]}>
            <planeGeometry args={[0.1, 4.6]} />
            <meshPhysicalMaterial
              color={COLORS.gold}
              emissive={COLORS.gold}
              emissiveIntensity={0.35}
              roughness={0.25}
              metalness={1}
              clearcoat={0.4}
              envMapIntensity={1.3}
            />
          </mesh>

          {/* Roman numeral floating above */}
          <Text
            font={FONT_FILES.displayBlack}
            position={[0, 3.4, 0]}
            fontSize={0.9}
            color={COLORS.goldBright}
            anchorX="center"
            anchorY="middle"
          >
            {step.numeral}
          </Text>

          {/* Step title */}
          <Text
            font={FONT_FILES.displayBold}
            position={[0, 2.5, 0]}
            fontSize={0.42}
            color={COLORS.cream}
            anchorX="center"
            anchorY="middle"
          >
            {step.title}
          </Text>
        </group>
      ))}
    </group>
  );
}
