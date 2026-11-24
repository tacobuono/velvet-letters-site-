import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Float, Text } from '@react-three/drei';
import { Group } from 'three';
import { FONT_FILES } from '../lib/tokens';
import { scroll } from '../lib/scrollStore';

type Props = { reducedMotion: boolean };

// Palette: pine-green velvet body, brushed-brass ribbons, and a velvet-plum wax
// seal — velvet is the pinch, not the dish.
const BRASS = '#b7935a';
const WAX_PLUM = '#7a2447';

// Framing. Full size at landscape aspects; scaled down (never below MIN_FIT)
// and lifted by up to NARROW_LIFT world units on portrait screens.
const BASE_SCALE = 0.9;
const BASE_Y = 0.55;
const FULL_ASPECT = 0.9;
const MIN_FIT = 0.5;
const NARROW_LIFT = 1.1;

/** Smoothstep 0..1. */
const ss = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/**
 * The hero object: "a Velvet Letters website, boxed" — a deep pine-velvet parcel,
 * slightly taller than wide like a boxed letter, bound with two slim brushed-brass
 * ribbons and closed with a velvet-plum wax seal pressed with the VL monogram.
 * Floats and slowly turns at rest; the intro beat brings the seal to face camera.
 */
export function BoxedParcel({ reducedMotion }: Props) {
  const spin = useRef<Group>(null);
  const { invalidate } = useThree();
  // The camera's FOV is vertical, so a portrait screen sees far less width.
  // Shrink the parcel to fit narrow aspects and lift it clear of the centred
  // spec label; landscape (aspect >= FULL_ASPECT) renders at full size.
  const aspect = useThree((s) => s.size.width / s.size.height);
  const fit = Math.min(1, Math.max(MIN_FIT, aspect / FULL_ASPECT));

  useFrame((state) => {
    const p = reducedMotion ? 0 : scroll.progress;
    const t = state.clock.elapsedTime;
    if (spin.current) {
      const idle = reducedMotion ? 0 : t * 0.1;
      spin.current.rotation.y = idle + ss(p / 0.14) * (Math.PI * 0.5) + p * Math.PI;
    }
    if (!reducedMotion) invalidate();
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.0}
      rotationIntensity={reducedMotion ? 0 : 0.12}
      floatIntensity={reducedMotion ? 0 : 0.42}
      floatingRange={[-0.06, 0.1]}
    >
      <group
        ref={spin}
        position={[0, BASE_Y + (1 - fit) * NARROW_LIFT, 0]}
        rotation={[0.1, 0.62, 0]}
        scale={BASE_SCALE * fit}
      >
        {/* Parcel body — deep pine velvet, high sheen, crisp edges */}
        <RoundedBox args={[1.95, 2.24, 1.95]} radius={0.085} smoothness={6}>
          <meshPhysicalMaterial
            color="#0c1712"
            roughness={0.72}
            metalness={0}
            sheen={1}
            sheenColor="#357a50"
            sheenRoughness={0.3}
            clearcoat={0.12}
            clearcoatRoughness={0.62}
            envMapIntensity={0.78}
          />
        </RoundedBox>

        {/* Two slim brushed-brass ribbons, proud of the surface */}
        <mesh>
          <boxGeometry args={[0.2, 2.3, 2.0]} />
          <meshStandardMaterial
            color={BRASS}
            metalness={0.95}
            roughness={0.3}
            envMapIntensity={1.15}
            emissive={BRASS}
            emissiveIntensity={0.04}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[2.0, 2.3, 0.2]} />
          <meshStandardMaterial
            color={BRASS}
            metalness={0.95}
            roughness={0.3}
            envMapIntensity={1.15}
            emissive={BRASS}
            emissiveIntensity={0.04}
          />
        </mesh>

        {/* Velvet-plum wax seal where the ribbons cross on top — the pinch */}
        <group position={[0, 1.14, 0]}>
          <mesh>
            <cylinderGeometry args={[0.46, 0.5, 0.12, 56]} />
            <meshPhysicalMaterial
              color={WAX_PLUM}
              metalness={0.12}
              roughness={0.5}
              clearcoat={0.55}
              clearcoatRoughness={0.3}
              sheen={0.6}
              sheenColor="#b0506f"
              envMapIntensity={0.7}
            />
          </mesh>
          {/* brass pressed rim */}
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4, 0.028, 16, 60]} />
            <meshStandardMaterial color={BRASS} metalness={1} roughness={0.32} envMapIntensity={1.2} />
          </mesh>
          {/* embossed monogram, pressed into the wax */}
          <Text
            font={FONT_FILES.displayBlack}
            position={[0, 0.075, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.42}
            letterSpacing={-0.04}
            color="#2a0c18"
            anchorX="center"
            anchorY="middle"
          >
            VL
          </Text>
        </group>
      </group>
    </Float>
  );
}
