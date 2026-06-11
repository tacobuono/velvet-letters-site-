import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group, MeshStandardMaterial, Vector3 } from 'three';
import { COLORS, FONT_FILES } from '../lib/tokens';
import { SERVICES } from '../data/content';

type Props = { reducedMotion: boolean };

// Offset left of the camera's look axis (which stays at x=0) so the prism sits on
// the left/centre and the right-pinned DOM service list gets a clean column — an
// intentional editorial split instead of 3D text colliding with the copy.
const CENTER = new Vector3(-2.7, 0, -22);
const RADIUS = 1.9;
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
    if (!reducedMotion) g.rotation.y += Math.min(delta, 0.05) * 0.12;

    // Brighten the face most directly pointing at the camera.
    for (let i = 0; i < faces.length; i++) {
      const mat = mats.current[i];
      if (!mat) continue;
      const worldAngle = faces[i].angle + g.rotation.y;
      faceNormal.set(Math.sin(worldAngle), 0, Math.cos(worldAngle));
      camDir.copy(state.camera.position).sub(CENTER).normalize();
      const facing = Math.max(0, faceNormal.dot(camDir));
      mat.emissiveIntensity = 0.08 + facing * facing * 0.5;
    }
  });

  return (
    <group ref={group} position={CENTER}>
      {faces.map(({ service, angle, position }, i) => (
        <group key={service.number} position={position} rotation={[0, angle, 0]}>
          <mesh>
            <boxGeometry args={[2.1, 4.4, 0.16]} />
            <meshStandardMaterial
              ref={(m) => {
                mats.current[i] = m;
              }}
              color={COLORS.velvetMid}
              emissive={COLORS.gold}
              emissiveIntensity={0.08}
              roughness={0.45}
              metalness={0.45}
              envMapIntensity={1.1}
            />
          </mesh>
          {/* Each face carries only its numeral — a large ivory wayfinder with a fine
              dark outline so it stays crisp on the gold at any rotation. The service
              titles live in the DOM list (one source of truth, no colliding double-text). */}
          <Text
            font={FONT_FILES.displayBlack}
            position={[0, 0, 0.12]}
            fontSize={1.25}
            color={COLORS.creamWarm}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.012}
            outlineColor={COLORS.velvetDeep}
            outlineOpacity={0.55}
          >
            {service.number}
          </Text>
        </group>
      ))}
    </group>
  );
}
