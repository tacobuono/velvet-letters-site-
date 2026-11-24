import { useTexture } from '@react-three/drei';
import { SRGBColorSpace } from 'three';

/**
 * The photoreal dark-studio set, rendered as a flat plane far behind the parcel
 * so it lives inside the 3D scene (the postprocessing composer paints opaque, so
 * a CSS backdrop behind the canvas would be hidden). Lit by nothing —
 * meshBasic + toneMapped off keeps the photograph's own grade — and pushed deep
 * enough that the depth-of-field pass renders it as soft bokeh behind the sharp
 * parcel.
 */
export function Backplate() {
  const tex = useTexture('/bg/studio-pine.webp');
  tex.colorSpace = SRGBColorSpace;
  return (
    <mesh position={[0, 0, -8]}>
      <planeGeometry args={[32, 18]} />
      <meshBasicMaterial map={tex} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}
