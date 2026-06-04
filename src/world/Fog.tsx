import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, Fog as ThreeFog, MathUtils } from 'three';
import { COLORS } from '../lib/tokens';
import { scroll } from '../lib/scrollStore';

/**
 * Atmospheric depth. The hero opens on a sage/teal tonal world; as the camera
 * dives through the monogram into the velvet world, fog + background blend from
 * sage to velvet-deep. One scene, two moods, driven by scroll progress.
 */
export function Fog() {
  const { scene } = useThree();

  const sage = useMemo(() => new Color(COLORS.sageBg), []);
  const velvet = useMemo(() => new Color(COLORS.velvetDeep), []);
  const fog = useMemo(() => new ThreeFog(COLORS.sageBg, 13, 36), []);
  const bg = useMemo(() => new Color(COLORS.sageBg), []);

  useEffect(() => {
    scene.fog = fog;
    scene.background = bg;
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene, fog, bg]);

  useFrame(() => {
    // Blend over the hero → philosophy transition (first ~18% of scroll).
    const k = MathUtils.smoothstep(scroll.progress, 0.02, 0.18);
    fog.color.copy(sage).lerp(velvet, k);
    bg.copy(sage).lerp(velvet, k);
    fog.near = MathUtils.lerp(13, 8, k);
    fog.far = MathUtils.lerp(36, 30, k);
  });

  return null;
}
