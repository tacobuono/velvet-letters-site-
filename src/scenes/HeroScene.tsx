import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointLight,
} from 'three';
import { COLORS } from '../lib/tokens';
import { makeRng } from '../lib/rng';
import { makeVGeometry, makeLGeometry } from './hero/letterGeometry';
import { FurLetter } from './hero/FurLetter';

type Props = { reducedMotion: boolean };

const DUST_COUNT = 260;

export function HeroScene({ reducedMotion }: Props) {
  const vGeo = useMemo(() => makeVGeometry(), []);
  const lGeo = useMemo(() => makeLGeometry(), []);
  const rim = useRef<PointLight>(null);
  const dust = useRef<Points>(null);

  const dustGeo = useMemo(() => {
    const rng = makeRng(20240531);
    const positions = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3] = (rng() - 0.5) * 32;
      positions[i * 3 + 1] = (rng() - 0.5) * 13;
      positions[i * 3 + 2] = (rng() - 0.5) * 20;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;

    // Rim light pulses on a ~10s cycle between 1.0 and 1.4 (× candela scale).
    if (rim.current) {
      rim.current.intensity = (1.2 + Math.sin(t * (Math.PI * 2) / 10) * 0.2) * 20;
    }

    // Dust drifts upward and wraps at the top of the volume.
    const arr = dustGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < DUST_COUNT; i++) {
      arr[i * 3 + 1] += 0.003;
      if (arr[i * 3 + 1] > 6.5) arr[i * 3 + 1] = -6.5;
    }
    dustGeo.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Hero lighting rig — romantic decay */}
      <ambientLight color={COLORS.furSage} intensity={0.35} />
      <directionalLight
        color={COLORS.heroKey}
        intensity={1.6}
        position={[6, 9, 8]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-bias={-0.0005}
        shadow-normalBias={0.04}
      />
      <directionalLight color={COLORS.heroFill} intensity={0.45} position={[-7, 4, -3]} />
      <pointLight ref={rim} color={COLORS.heroRim} intensity={24} distance={18} decay={1.5} position={[-4, 7, 5]} />

      {/* Wet stone floor — slightly glossier so it catches the environment */}
      <mesh position={[0, -3.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={COLORS.sageFloor} roughness={0.45} metalness={0.2} envMapIntensity={0.7} />
      </mesh>

      {/* Soft contact shadow grounding the letters to the floor */}
      <ContactShadows
        position={[0, -3.18, 0]}
        scale={24}
        far={5}
        blur={3}
        opacity={0.55}
        resolution={1024}
        color="#0d1513"
        frames={1}
      />

      {/* The letters */}
      <FurLetter
        geometry={vGeo}
        position={[-3.6, 0, 0.5]}
        rotationY={0.12}
        bob={(t) => Math.sin(t * 0.4) * 0.04}
        decal={{ text: 'VCOOA', seed: 1337, width: 1.7, height: 4.4, offset: [-0.1, 0.15] }}
        reducedMotion={reducedMotion}
      />
      <FurLetter
        geometry={lGeo}
        position={[3.5, 0, -0.3]}
        rotationY={-0.08}
        bob={(t) => Math.cos(t * 0.4) * 0.04}
        decal={{ text: 'LVOLTCO', seed: 4242, width: 1.3, height: 4.4, offset: [-0.35, 0] }}
        reducedMotion={reducedMotion}
      />

      {/* Atmospheric dust */}
      <points ref={dust} geometry={dustGeo} frustumCulled={false}>
        <pointsMaterial color={COLORS.panelBg} size={0.045} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}
