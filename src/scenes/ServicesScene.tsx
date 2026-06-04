import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group, MeshStandardMaterial, Vector3 } from 'three';
import { COLORS, FONT_FILES } from '../lib/tokens';
import { SERVICES } from '../data/content';

type Props = { reducedMotion: boolean };

const CENTER = new Vector3(0, 0, -22);
const RADIUS = 2.4;
const FACE_COUNT = 6;

export function ServicesScene({ reducedMotion }: Props) {
  const group = useRef<Group>(null);
  const mats = useRef<(MeshStandardMaterial | null)[]>([]);

  const faces = useMemo(
    () =>
      SERVICES.map((service, i) => {
        const angle = (i / FACE_COUNT) * Math.PI * 2;
        const x = Math.sin(angle) * RADIUS;
        const z = Math.cos(angle) * RADIUS;
        return { service, angle, position: [x, 0, z] as [number, number, number] };
      }),
    [],
  );

  const camDir = useMemo(() => new Vector3(), []);
  const faceNormal = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reducedMotion) g.rotation.y += delta * 0.12;

    // Brighten the face most directly pointing at the camera.
    for (let i = 0; i < faces.length; i++) {
      const mat = mats.current[i];
      if (!mat) continue;
      const worldAngle = faces[i].angle + g.rotation.y;
      faceNormal.set(Math.sin(worldAngle), 0, Math.cos(worldAngle));
      camDir.copy(state.camera.position).sub(CENTER).normalize();
      const facing = Math.max(0, faceNormal.dot(camDir));
      mat.emissiveIntensity = 0.1 + facing * facing * 0.9;
    }
  });

  return (
    <group ref={group} position={CENTER}>
      {faces.map(({ service, angle, position }, i) => (
        <group key={service.number} position={position} rotation={[0, angle, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 5, 0.18]} />
            <meshStandardMaterial
              ref={(m) => {
                mats.current[i] = m;
              }}
              color={COLORS.velvetMid}
              emissive={COLORS.gold}
              emissiveIntensity={0.1}
              roughness={0.45}
              metalness={0.45}
              envMapIntensity={1.1}
            />
          </mesh>
          <Text
            font={FONT_FILES.displayBlack}
            position={[0, 1.4, 0.12]}
            fontSize={0.9}
            color={COLORS.gold}
            anchorX="center"
            anchorY="middle"
          >
            {service.number}
          </Text>
          <Text
            font={FONT_FILES.ui}
            position={[0, 0.2, 0.12]}
            fontSize={0.3}
            maxWidth={2.1}
            textAlign="center"
            color={COLORS.cream}
            anchorX="center"
            anchorY="middle"
          >
            {service.title}
          </Text>
        </group>
      ))}
    </group>
  );
}
