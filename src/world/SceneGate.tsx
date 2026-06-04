import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, type Material, type Mesh } from 'three';
import { scroll } from '../lib/scrollStore';
import { SECTIONS } from '../data/content';

type Props = {
  /** Section index this scene belongs to (0..SECTIONS.length-1). */
  index: number;
  /** Half-width (in normalized progress) of the fully-opaque plateau. */
  hold?: number;
  /** Extra normalized progress over which the scene fades in/out past the plateau. */
  fade?: number;
  children: ReactNode;
};

type FadeMaterial = Material & { opacity: number; transparent: boolean };

// Multiply the scene fade by each material's *own* baseline opacity (captured
// once) so materials that ship semi-transparent — hero dust 0.5, the testimonial
// light beam 0.04, dust motes 0.7 — keep their look instead of being forced to 1.
function applyOpacity(mat: FadeMaterial, sceneOpacity: number) {
  const ud = mat.userData as { baseOpacity?: number };
  if (ud.baseOpacity === undefined) ud.baseOpacity = mat.opacity ?? 1;
  const base = ud.baseOpacity;
  mat.opacity = base * sceneOpacity;
  // Only pay the transparency cost (sorting/overdraw) during the actual fade;
  // at full opacity an originally-opaque material returns to the opaque fast path.
  mat.transparent = sceneOpacity < 0.999 || base < 1;
}

/**
 * Cross-fades a scene in/out over a scroll window instead of hard-cutting its
 * visibility — so scenes dissolve into one another with no abrupt pop. Opacity is
 * a smootherstep ramp centered on the scene's section; full on its plateau, fading
 * to zero before the neighbouring scene takes over. Updated imperatively per frame.
 */
export function SceneGate({ index, hold = 0.06, fade = 0.1, children }: Props) {
  const ref = useRef<Group>(null);
  const center = index / (SECTIONS.length - 1);

  useFrame(() => {
    const group = ref.current;
    if (!group) return;

    const d = Math.abs(scroll.progress - center);
    const sceneOpacity = 1 - MathUtils.smoothstep(d, hold, hold + fade);

    const visible = sceneOpacity > 0.001;
    group.visible = visible;
    if (!visible) return; // skip the traversal entirely when fully hidden

    group.traverse((obj) => {
      const mesh = obj as Mesh;
      const material = mesh.material as Material | Material[] | undefined;
      if (!material) return;
      if (Array.isArray(material)) {
        for (const m of material) applyOpacity(m as FadeMaterial, sceneOpacity);
      } else {
        applyOpacity(material as FadeMaterial, sceneOpacity);
      }
    });
  });

  return <group ref={ref}>{children}</group>;
}
