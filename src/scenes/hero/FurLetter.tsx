import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  ConeGeometry,
  Euler,
  Group,
  InstancedMesh,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  Vector3,
  type ExtrudeGeometry,
} from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { COLORS } from '../../lib/tokens';
import { makeRng } from '../../lib/rng';
import { MODELS, useGltfGeometry } from '../../lib/models';
import { makeDecalTexture } from './decalTexture';

type DecalConfig = {
  text: string;
  seed: number;
  width: number;
  height: number;
  offset: [number, number];
};

type Props = {
  geometry: ExtrudeGeometry;
  position: [number, number, number];
  rotationY: number;
  /** Sine phase for the breathing bob; pass Math.sin or Math.cos via `bob`. */
  bob: (t: number) => number;
  decal: DecalConfig;
  furCount?: number;
  roseCount?: number;
  reducedMotion: boolean;
};

const UP = new Vector3(0, 1, 0);
const FUR_COLORS = [COLORS.furMauve, COLORS.furPink, COLORS.furDeep];
const FUR_WEIGHTS = [0.3, 0.5, 0.2]; // warm dusty trio (mauve / rose / wine) — no teal
const ROSE_COLORS = [COLORS.rose, COLORS.roseLight, COLORS.roseDeep];
const ROSE_WEIGHTS = [0.5, 0.35, 0.15];

function pickWeighted(weights: number[], r: number): number {
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (r <= acc) return i;
  }
  return weights.length - 1;
}

export function FurLetter({
  geometry,
  position,
  rotationY,
  bob,
  decal,
  furCount = 0, // fur removed — clean V/L letterforms, no spikes
  roseCount = 90,
  reducedMotion,
}: Props) {
  const group = useRef<Group>(null);
  const furRef = useRef<InstancedMesh>(null);
  const roseRef = useRef<InstancedMesh>(null);
  const baseY = position[1];

  // Cone grows outward from its base (apex +Y); translate so base sits at origin.
  // Finer + 6-sided so dense strands read as plush velvet nap, not cactus spines.
  const furGeo = useMemo(() => {
    const g = new ConeGeometry(0.028, 0.2, 6);
    g.translate(0, 0.1, 0);
    return g;
  }, []);

  // Sculpted layered-petal rose (Blender GLB) — replaces the old displaced
  // icosahedron blob. Shared geometry, instanced ~roseCount times per letter.
  const roseGeo = useGltfGeometry(MODELS.rose);

  const furMat = useMemo(
    () => new MeshStandardMaterial({ roughness: 0.95, metalness: 0, envMapIntensity: 0.35 }),
    [],
  );
  // Velvet/satin petal material: soft roughness, gentle sheen, white base so the
  // per-instance colour (instanceColor) tints each rose.
  const roseMat = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: '#ffffff',
        roughness: 0.62,
        metalness: 0,
        sheen: 0.6,
        sheenRoughness: 0.5,
        sheenColor: new Color(COLORS.roseLight),
        clearcoat: 0.15,
        clearcoatRoughness: 0.6,
        envMapIntensity: 0.5,
      }),
    [],
  );

  const decalTexture = useMemo(
    () => makeDecalTexture(decal.text, decal.seed),
    [decal.text, decal.seed],
  );

  // Front-face Z for placing the decal just proud of the surface.
  const frontZ = useMemo(() => {
    geometry.computeBoundingBox();
    return geometry.boundingBox!.max.z + 0.04;
  }, [geometry]);

  // Sample the surface once and fill both instanced meshes.
  useLayoutEffect(() => {
    const fur = furRef.current;
    const roses = roseRef.current;
    if (!fur || !roses) return;

    const sampleMesh = new Mesh(geometry);
    const sampler = new MeshSurfaceSampler(sampleMesh).build();

    // Seeded so each letter's fur/roses are stable across re-render/HMR.
    const rnd = makeRng(decal.seed * 131 + furCount);

    const dummy = new Object3D();
    const pos = new Vector3();
    const normal = new Vector3();
    const q = new Quaternion();
    const tiltE = new Euler();
    const tiltQ = new Quaternion();
    const col = new Color();
    const hsl = { h: 0, s: 0, l: 0 };

    // Fur
    for (let i = 0; i < furCount; i++) {
      sampler.sample(pos, normal);
      dummy.position.copy(pos).addScaledVector(normal, -0.02);
      q.setFromUnitVectors(UP, normal);
      tiltE.set((rnd() - 0.5) * 1.4, rnd() * Math.PI * 2, (rnd() - 0.5) * 1.4);
      tiltQ.setFromEuler(tiltE);
      dummy.quaternion.copy(q).multiply(tiltQ);
      const height = 0.4 + rnd() * 0.6; // 0.4–1.0 — shorter, plusher nap, less spike
      const width = 0.9 + rnd() * 0.7; // 0.9–1.6 — fatter strands read as velvet, not needles
      dummy.scale.set(width, height, width);
      dummy.updateMatrix();
      fur.setMatrixAt(i, dummy.matrix);

      const ci = pickWeighted(FUR_WEIGHTS, rnd());
      col.set(FUR_COLORS[ci]);
      col.getHSL(hsl);
      col.setHSL(hsl.h, hsl.s, Math.min(1, Math.max(0, hsl.l + (rnd() - 0.5) * 0.36)));
      fur.setColorAt(i, col);
    }
    fur.instanceMatrix.needsUpdate = true;
    if (fur.instanceColor) fur.instanceColor.needsUpdate = true;
    fur.computeBoundingSphere();

    // Roses — opening (+Y) faces outward along the surface normal, with a random
    // spin and slight tilt so the layout never reads as a repeated pattern.
    for (let i = 0; i < roseCount; i++) {
      sampler.sample(pos, normal);
      const s = 0.34 + rnd() * 0.26; // larger so the sculpted petals read (max-dim ≈ 1.0)
      dummy.position.copy(pos).addScaledVector(normal, s * 0.3);
      q.setFromUnitVectors(UP, normal);
      tiltE.set((rnd() - 0.5) * 0.6, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.6);
      tiltQ.setFromEuler(tiltE);
      dummy.quaternion.copy(q).multiply(tiltQ);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      roses.setMatrixAt(i, dummy.matrix);

      const ci = pickWeighted(ROSE_WEIGHTS, rnd());
      col.set(ROSE_COLORS[ci]);
      roses.setColorAt(i, col);
    }
    roses.instanceMatrix.needsUpdate = true;
    if (roses.instanceColor) roses.instanceColor.needsUpdate = true;
    roses.computeBoundingSphere();
  }, [geometry, furCount, roseCount, decal.seed]);

  // Accumulated clamped time (not clock.elapsedTime) so under frameloop="demand"
  // the bob pauses while the loop sleeps and resumes smoothly — no jump on wake.
  const animT = useRef(0);
  useFrame((_, delta) => {
    if (reducedMotion || !group.current) return;
    animT.current += Math.min(delta, 0.05);
    group.current.position.y = baseY + bob(animT.current);
  });

  return (
    <group ref={group} position={position} rotation={[0, rotationY, 0]}>
      {/* Base skin — velvet/wine, visible where the fur parts */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.letterBase} roughness={0.85} metalness={0.05} envMapIntensity={0.4} />
      </mesh>

      {/* Fur — deliberately NOT shadow-casting/receiving. Rendering 8000 instances
          per letter into the directional shadow map every frame was the single
          biggest hero cost, and fur self-shadow reads as mush. The base skin +
          roses + contact shadow carry the grounding instead. */}
      <instancedMesh
        ref={furRef}
        args={[furGeo, furMat, furCount]}
        frustumCulled={false}
      />

      {/* Dried roses — no shadow casting; 180 instanced GLB roses contribute almost
          nothing to the shadow map but cost a full extra instanced shadow pass. */}
      <instancedMesh
        ref={roseRef}
        args={[roseGeo, roseMat, roseCount]}
        frustumCulled={false}
      />

      {/* Aged carnival-signage decal on the front face */}
      <mesh position={[decal.offset[0], decal.offset[1], frontZ]}>
        <planeGeometry args={[decal.width, decal.height]} />
        <meshStandardMaterial map={decalTexture} roughness={0.9} metalness={0} transparent />
      </mesh>
    </group>
  );
}
