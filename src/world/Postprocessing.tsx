import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector2 } from 'three';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { scroll } from '../lib/scrollStore';

type Props = {
  /** Mobile / low-power devices drop chromatic aberration to save fill rate. */
  enableChromatic: boolean;
  /** WebGL2 MSAA samples on the composer. 0 on mobile, 4 on desktop for crisp edges. */
  multisampling?: number;
};

export function Postprocessing({ enableChromatic, multisampling = 4 }: Props) {
  // The effect stores this Vector2 by reference in its shader uniform, so mutating
  // it in place each frame drives the aberration live — no ref needed (passing a
  // ref to the wrapped effect makes the composer choke serializing the fiber tree).
  const offset = useMemo(() => new Vector2(0, 0), []);
  const current = useRef(0);

  // Velocity-reactive chromatic aberration, deliberately a WHISPER. Razor-sharp at
  // rest (true 0); only a faint colour fringe creeps in on fast scroll, then eases
  // straight back. The old max (0.0032, maxing out on normal scroll) read as a
  // broken-monitor RGB split — never acceptable on a premium frame.
  useFrame((_, delta) => {
    const v = Math.min(Math.abs(scroll.velocity), 60);
    const target = MathUtils.mapLinear(v, 0, 60, 0.0, 0.0007);
    current.current = MathUtils.damp(current.current, target, 6, Math.min(delta, 0.05));
    offset.set(current.current, current.current);
  });

  return (
    <EffectComposer multisampling={multisampling}>
      {/* Premium bloom: only the genuine highlights (gold, beam, seal glow)
          bloom — threshold kept high so the whole frame never washes out. */}
      <Bloom intensity={0.5} luminanceThreshold={0.78} luminanceSmoothing={0.25} mipmapBlur />
      <Vignette eskil={false} offset={0.12} darkness={0.62} />
      {enableChromatic ? (
        <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
