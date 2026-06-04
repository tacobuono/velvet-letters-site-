import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { BufferGeometry, Float32BufferAttribute, Points } from 'three';
import { COLORS, FONT_FILES } from '../lib/tokens';
import { makeRng } from '../lib/rng';

type Props = { reducedMotion: boolean };

const HALL = [0, 0.8, -50] as const;
const MOTES = 120;

export function TestimonialScene({ reducedMotion }: Props) {
  const motes = useRef<Points>(null);

  const moteGeo = useMemo(() => {
    const rng = makeRng(808);
    const positions = new Float32Array(MOTES * 3);
    for (let i = 0; i < MOTES; i++) {
      positions[i * 3] = HALL[0] + (rng() - 0.5) * 2.4;
      positions[i * 3 + 1] = HALL[1] + (rng() - 0.5) * 7;
      positions[i * 3 + 2] = HALL[2] + (rng() - 0.5) * 2.4;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame(() => {
    if (reducedMotion || !motes.current) return;
    const arr = moteGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < MOTES; i++) {
      arr[i * 3 + 1] -= 0.004; // slow fall through the beam
      if (arr[i * 3 + 1] < HALL[1] - 3.5) arr[i * 3 + 1] = HALL[1] + 3.5;
    }
    moteGeo.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Column of light from above */}
      <spotLight
        color={COLORS.goldLight}
        intensity={120}
        distance={20}
        angle={0.35}
        penumbra={0.8}
        position={[HALL[0], HALL[1] + 8, HALL[2]]}
        target-position={[HALL[0], HALL[1] - 2, HALL[2]]}
        castShadow
      />
      {/* Faint volumetric beam */}
      <mesh position={[HALL[0], HALL[1] + 2, HALL[2]]}>
        <coneGeometry args={[2.2, 10, 32, 1, true]} />
        <meshBasicMaterial color={COLORS.goldLight} transparent opacity={0.04} depthWrite={false} side={2} />
      </mesh>

      {/* Dust motes caught in the beam */}
      <points ref={motes} geometry={moteGeo} frustumCulled={false}>
        <pointsMaterial color={COLORS.cream} size={0.04} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
      </points>

      {/* Oversized cursive opening quote, gold */}
      <Text
        font={FONT_FILES.displayBlack}
        position={[HALL[0], HALL[1] + 1.2, HALL[2]]}
        fontSize={5}
        color={COLORS.gold}
        anchorX="center"
        anchorY="middle"
      >
        &#8220;
      </Text>
    </group>
  );
}
