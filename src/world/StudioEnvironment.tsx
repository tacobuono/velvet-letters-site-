import { Environment, Lightformer } from '@react-three/drei';
import { COLORS } from '../lib/tokens';

/**
 * Procedural image-based lighting — a small studio of soft area lights baked
 * once into an environment map (no external HDRI file, so it ships static and
 * offline-clean). This is what makes the gold, wax and filigree read as real
 * metal: MeshStandard/Physical materials sample this map for reflections.
 *
 * background={false} so it only affects reflections/IBL — the scroll-driven
 * sage→velvet Fog still owns the visible backdrop.
 */
export function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      {/* Soft top key — broad cream softbox overhead, the main sheen on tops */}
      <Lightformer
        form="rect"
        intensity={2.4}
        color={COLORS.creamWarm}
        position={[0, 8, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[14, 14, 1]}
      />
      {/* Warm gold key from camera-right — gives gold its lively highlight */}
      <Lightformer
        form="rect"
        intensity={2.0}
        color={COLORS.goldLight}
        position={[7, 3, 6]}
        rotation={[0, -Math.PI / 3, 0]}
        scale={[8, 8, 1]}
      />
      {/* Cool teal fill from the left — separates forms, cinematic colour split */}
      <Lightformer
        form="rect"
        intensity={1.1}
        color={COLORS.heroFill}
        position={[-8, 2, 2]}
        rotation={[0, Math.PI / 2.6, 0]}
        scale={[8, 8, 1]}
      />
      {/* Dim rose rim from behind — wraps edges with the brand blush */}
      <Lightformer
        form="rect"
        intensity={0.8}
        color={COLORS.heroRim}
        position={[-3, 5, -8]}
        rotation={[0, Math.PI, 0]}
        scale={[6, 6, 1]}
      />
      {/* Floor bounce — faint warm uplight so undersides aren't dead black */}
      <Lightformer
        form="rect"
        intensity={0.4}
        color={COLORS.gold}
        position={[0, -6, 2]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[12, 12, 1]}
      />
    </Environment>
  );
}
