import { EffectComposer, Bloom, Vignette, Noise, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

type Props = { enabled: boolean };

/**
 * Cinematic grade for the hero: shallow depth of field (the parcel sharp, the
 * studio falling off into bokeh), a restrained bloom so only the gold band and
 * wax seal glint, a soft vignette, and a fine film grain. Gated off for low-tier
 * devices / reduced-motion, where the plain lit scene already reads well.
 */
export function BoxedEffects({ enabled }: Props) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={4}>
      <DepthOfField focusDistance={0.0064} focalLength={0.028} bokehScale={2.8} height={480} />
      <Bloom
        intensity={0.42}
        luminanceThreshold={0.58}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.28} darkness={0.72} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.035} />
    </EffectComposer>
  );
}
