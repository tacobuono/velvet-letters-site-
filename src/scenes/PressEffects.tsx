import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import type { DepthOfFieldEffect } from 'postprocessing';
import { pressFocus } from '../lib/pressStore';

type Props = { enabled: boolean };

/**
 * Cinematic grade for the press sequence: shallow depth of field that holds the
 * type sharp in the macro shot and then follows the sheet as it lifts, a
 * restrained bloom so only wet ink and brass edges glint, a soft vignette, and
 * fine grain. Off for phones and reduced motion, where the lit scene reads well
 * without it.
 */
export function PressEffects({ enabled }: Props) {
  const dof = useRef<DepthOfFieldEffect>(null);

  useFrame(() => {
    dof.current?.target?.copy(pressFocus);
  });

  if (!enabled) return null;
  return (
    <EffectComposer multisampling={4}>
      <DepthOfField ref={dof} target={[0, 0.3, 0]} worldFocusRange={2.2} bokehScale={2.4} resolutionScale={0.5} />
      <Bloom intensity={0.22} luminanceThreshold={0.82} luminanceSmoothing={0.25} mipmapBlur />
      <Vignette eskil={false} offset={0.26} darkness={0.74} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.035} />
    </EffectComposer>
  );
}
