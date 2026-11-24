import { Environment, Lightformer } from '@react-three/drei';

/**
 * Procedural image-based lighting — a small studio of soft area lights baked
 * once into an environment map (no external HDRI file, so it ships static and
 * offline-clean). This is what makes the parcel's brass ribbons read as real
 * metal and gives the pine velvet its sheen: both materials sample this map.
 *
 * Tinted for the pine & brass set: warm cream/brass keys, cool emerald fill and
 * rim. background={false} so it only affects reflections/IBL — the photoreal
 * backplate owns the visible backdrop. Baked once (frames={1}); no per-frame cost.
 */
export function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      {/* Soft top key — broad cream softbox overhead, the main sheen on tops */}
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#faf3e8"
        position={[0, 8, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[14, 14, 1]}
      />
      {/* Warm brass key from camera-right — gives the ribbons their lively highlight */}
      <Lightformer
        form="rect"
        intensity={2.0}
        color="#d8c08a"
        position={[7, 3, 6]}
        rotation={[0, -Math.PI / 3, 0]}
        scale={[8, 8, 1]}
      />
      {/* Cool emerald fill from the left — separates forms, cinematic colour split */}
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#4f9f78"
        position={[-8, 2, 2]}
        rotation={[0, Math.PI / 2.6, 0]}
        scale={[8, 8, 1]}
      />
      {/* Pale green rim from behind — wraps edges in the set's own light */}
      <Lightformer
        form="rect"
        intensity={0.8}
        color="#9fd0b4"
        position={[-3, 5, -8]}
        rotation={[0, Math.PI, 0]}
        scale={[6, 6, 1]}
      />
      {/* Floor bounce — faint brass uplight so undersides aren't dead black */}
      <Lightformer
        form="rect"
        intensity={0.4}
        color="#b7935a"
        position={[0, -6, 2]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[12, 12, 1]}
      />
    </Environment>
  );
}
