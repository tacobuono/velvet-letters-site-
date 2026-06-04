import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { BufferGeometry, Mesh } from 'three';

// Blender-generated premium assets (see blender/build_assets.py).
export const MODELS = {
  rose: '/models/rose.glb',
  vlMark: '/models/vl-mark.glb',
  filigree: '/models/filigree.glb',
} as const;

// Prefetch so they're ready by the time the camera arrives (and so the
// Preloader's useProgress reflects their load).
useGLTF.preload(MODELS.rose);
useGLTF.preload(MODELS.vlMark);
useGLTF.preload(MODELS.filigree);

/**
 * Loads a GLB and returns the first mesh's BufferGeometry — handy for reusing a
 * sculpted asset as instanced geometry or assigning a scene-specific material.
 * Suspends until loaded (wrap the caller in <Suspense>).
 */
export function useGltfGeometry(url: string): BufferGeometry {
  const gltf = useGLTF(url);
  return useMemo(() => {
    let geo: BufferGeometry | undefined;
    gltf.scene.traverse((o) => {
      const mesh = o as Mesh;
      if (!geo && mesh.isMesh) geo = mesh.geometry;
    });
    if (!geo) throw new Error(`No mesh geometry found in ${url}`);
    return geo;
  }, [gltf, url]);
}
