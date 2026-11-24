import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Center, Instance, Instances, Text3D, useTexture } from '@react-three/drei';
import { CanvasTexture, Group, RepeatWrapping, SRGBColorSpace, Vector3 } from 'three';
import { BEATS, press, pressFocus, seg } from '../lib/pressStore';

type Props = { reducedMotion: boolean };

const TYPE_FONT = '/fonts/droid_serif_bold.typeface.json';
const BRASS = '#b7935a';
const INK = '#4f1530'; // velvet-plum, mixed dark: it lifts under the key light
const PAPER = '#f2ebdf';
/** Albedo multiplier for the sheet, so the key light lands it on PAPER instead of blowing out. */
const SHEET_TINT = '#c2bbaf';

// Forme geometry (world units). The sheet is cut to the inside of the chase.
const SHEET_W = 3.1;
const SHEET_H = 4.1;
const CHASE_BAR = 0.22;
const TYPE_HIGH = 0.3; // height of slugs and sorts off the bench
const FACE = 0.1; // how far the letter stands proud of its slug
const TITLE_LINES = [
  { text: 'VELVET', z: -1.25 },
  { text: 'LETTERS', z: -0.5 },
];
const TITLE_SIZE = 0.5;

/** With reduced motion the scene holds on the forme seen from above. */
const STATIC_PROGRESS = BEATS.rise[1];

// Camera: a raking macro shot along the type, then straight down on the forme.
const CAM_MACRO = new Vector3(-1.7, 0.95, 1.35);
const LOOK_MACRO = new Vector3(0.15, 0.35, -0.85);
const CAM_TOP = new Vector3(0, 7.4, 2.6);
const LOOK_TOP = new Vector3(0, 0, 0.05);
/** The forme must stay inside the frame: pull back on screens narrower than this. */
export const MIN_ASPECT = 0.83;

// Sheet path: slides in over the forme, is laid on the type, lifts, turns over.
const SHEET_START = new Vector3(0, 1.7, -7);
const SHEET_DOWN = new Vector3(0, TYPE_HIGH + FACE + 0.03, 0);
const SHEET_UP = new Vector3(0, 2.6, 0.5);
const FORME_FOCUS = new Vector3(0, TYPE_HIGH + FACE, -0.85);

type Sort = { x: number; z: number; w: number; h: number };

/** Rows of body type under the title: brass sorts of uneven width, set like
 *  lines of a paragraph. Deterministic, so the printed sheet can match them. */
const BODY_SORTS: Sort[] = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const sorts: Sort[] = [];
  const rows = 6;
  for (let r = 0; r < rows; r++) {
    const z = 0.35 + r * 0.3;
    const lineEnd = r === rows - 1 ? 0.2 : SHEET_W / 2 - 0.05; // last line runs short
    let x = -SHEET_W / 2 + 0.05;
    while (x < lineEnd) {
      const w = 0.07 + rand() * 0.15;
      const isSpace = rand() < 0.16; // word spaces sit lower and do not print
      sorts.push({ x: x + w / 2, z, w, h: isSpace ? TYPE_HIGH * 0.78 : TYPE_HIGH + FACE * 0.9 });
      x += w + 0.012;
    }
  }
  return sorts;
})();

/** The printed side of the sheet: the title and body lines, right-reading. */
function usePrintTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = Math.round((1024 * SHEET_H) / SHEET_W);
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);

  useEffect(() => {
    let alive = true;
    const draw = () => {
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { width: W, height: H } = canvas;
      const yOf = (z: number) => ((z + SHEET_H / 2) / SHEET_H) * H;
      const px = W / SHEET_W;

      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = INK;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${Math.round(TITLE_SIZE * px * 1.02)}px 'Playfair Display', Georgia, serif`;
      for (const line of TITLE_LINES) ctx.fillText(line.text, W / 2, yOf(line.z));

      // Body lines: the print of each sort, mirrored left-to-right like any impression.
      ctx.globalAlpha = 0.82;
      for (const s of BODY_SORTS) {
        if (s.h < TYPE_HIGH) continue; // spaces
        const x = (-s.x + SHEET_W / 2) * px;
        ctx.fillRect(x - (s.w * px) / 2, yOf(s.z) - 0.045 * px, s.w * px, 0.09 * px);
      }
      ctx.globalAlpha = 1;
      texture.needsUpdate = true;
    };

    draw();
    // Redraw once the display face is ready (first paint may use the fallback).
    document.fonts
      .load("900 160px 'Playfair Display'")
      .then(() => alive && draw())
      .catch(() => undefined);
    return () => {
      alive = false;
      texture.dispose();
    };
  }, [texture]);

  return texture;
}

/**
 * The home's opening act: a locked-up forme of brass type, inked in velvet-plum.
 * The title is set mirror-reversed, as real type is. Scroll lays a sheet on it,
 * pulls the impression, and turns the sheet over — printed, right-reading — until
 * it fills the frame and becomes the page the visitor goes on to read.
 */
export function PressScene({ reducedMotion }: Props) {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / s.size.height);
  const sheet = useRef<Group>(null);
  const turn = useRef<Group>(null);
  const print = usePrintTexture();

  const bench = useTexture('/bg/workbench.webp');
  useMemo(() => {
    bench.colorSpace = SRGBColorSpace;
    bench.wrapS = bench.wrapT = RepeatWrapping;
    bench.repeat.set(5, 2);
  }, [bench]);

  const scratch = useMemo(
    () => ({ pos: new Vector3(), look: new Vector3(), dir: new Vector3(), end: new Vector3() }),
    [],
  );

  useFrame(() => {
    const p = reducedMotion ? STATIC_PROGRESS : press.progress;
    const { pos, look, dir, end } = scratch;

    const rise = seg(p, BEATS.rise[0], BEATS.rise[1]);
    pos.lerpVectors(CAM_MACRO, CAM_TOP, rise);
    look.lerpVectors(LOOK_MACRO, LOOK_TOP, rise);
    // Narrow screens see less width (vertical FOV), so the top-down shot backs
    // off to keep the whole forme in frame. The macro shot stays close.
    const pullBack = 1 + (Math.max(1, MIN_ASPECT / aspect) - 1) * rise;
    pos.sub(look).multiplyScalar(pullBack).add(look);
    camera.position.copy(pos);
    camera.lookAt(look);

    if (!sheet.current || !turn.current) return;
    const lay = seg(p, BEATS.lay[0], BEATS.lay[1]);
    const pull = seg(p, BEATS.pull[0], BEATS.pull[1]);
    const fill = seg(p, BEATS.fill[0], BEATS.fill[1]);

    sheet.current.visible = p > BEATS.lay[0];
    // Where the sheet ends up: square in front of the lens, close enough to fill it.
    dir.copy(look).sub(pos).normalize();
    end.copy(pos).addScaledVector(dir, Math.min(2.4, 4.4 / aspect));

    const at = sheet.current.position;
    if (fill > 0) at.lerpVectors(SHEET_UP, end, fill);
    else if (pull > 0) at.lerpVectors(SHEET_DOWN, SHEET_UP, pull);
    else at.lerpVectors(SHEET_START, SHEET_DOWN, lay);

    turn.current.rotation.y = Math.PI * (1 - pull); // blank side up → printed side up
    pressFocus.lerpVectors(FORME_FOCUS, at, pull);
  });

  return (
    <>
      {/* Bench */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 16]} />
        <meshStandardMaterial map={bench} roughness={0.82} metalness={0.05} />
      </mesh>

      {/* Chase: the steel frame the type is locked into */}
      {[
        { pos: [-(SHEET_W / 2 + CHASE_BAR / 2 + 0.03), 0.17, 0], size: [CHASE_BAR, 0.34, SHEET_H + 0.5] },
        { pos: [SHEET_W / 2 + CHASE_BAR / 2 + 0.03, 0.17, 0], size: [CHASE_BAR, 0.34, SHEET_H + 0.5] },
        { pos: [0, 0.17, -(SHEET_H / 2 + CHASE_BAR / 2 + 0.03)], size: [SHEET_W + 0.06, 0.34, CHASE_BAR] },
        { pos: [0, 0.17, SHEET_H / 2 + CHASE_BAR / 2 + 0.03], size: [SHEET_W + 0.06, 0.34, CHASE_BAR] },
      ].map((bar, i) => (
        <mesh key={i} position={bar.pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={bar.size as [number, number, number]} />
          <meshStandardMaterial color="#2c2e2f" metalness={0.9} roughness={0.42} envMapIntensity={0.9} />
        </mesh>
      ))}

      {/* Bed of the forme (spacing material below type height) */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[SHEET_W + 0.04, 0.2, SHEET_H + 0.04]} />
        <meshStandardMaterial color="#3a3327" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Title lines: brass slugs with the letters standing proud, set in reverse */}
      {TITLE_LINES.map((line) => (
        <group key={line.text} position={[0, 0, line.z]}>
          <mesh position={[0, TYPE_HIGH / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[SHEET_W - 0.1, TYPE_HIGH, 0.66]} />
            <meshStandardMaterial color={BRASS} metalness={1} roughness={0.34} envMapIntensity={1.15} />
          </mesh>
          <group position={[0, TYPE_HIGH, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[-1, 1, 1]}>
            <Center disableZ>
              <Text3D
                font={TYPE_FONT}
                size={TITLE_SIZE}
                height={FACE}
                bevelEnabled
                bevelThickness={0.012}
                bevelSize={0.008}
                bevelSegments={3}
                curveSegments={10}
                letterSpacing={0.02}
                castShadow
              >
                {line.text}
                {/* faces carry the ink; shoulders stay bare brass */}
                <meshPhysicalMaterial
                  attach="material-0"
                  color={INK}
                  roughness={0.3}
                  metalness={0}
                  clearcoat={0.7}
                  clearcoatRoughness={0.25}
                  envMapIntensity={0.55}
                />
                <meshStandardMaterial
                  attach="material-1"
                  color={BRASS}
                  metalness={1}
                  roughness={0.3}
                  envMapIntensity={1.2}
                />
              </Text3D>
            </Center>
          </group>
        </group>
      ))}

      {/* Body type: rows of individual sorts */}
      <Instances limit={BODY_SORTS.length} castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color={BRASS} metalness={1} roughness={0.46} envMapIntensity={0.95} />
        {BODY_SORTS.map((s, i) => (
          <Instance key={i} position={[s.x, s.h / 2, s.z]} scale={[s.w, s.h, 0.22]} />
        ))}
      </Instances>

      {/* Ink on the face of every sort that prints (spaces sit low and stay clean) */}
      <Instances limit={BODY_SORTS.length}>
        <boxGeometry />
        <meshPhysicalMaterial color={INK} roughness={0.3} clearcoat={0.7} clearcoatRoughness={0.25} envMapIntensity={0.55} />
        {BODY_SORTS.filter((s) => s.h > TYPE_HIGH).map((s, i) => (
          <Instance key={i} position={[s.x, s.h + 0.004, s.z]} scale={[s.w * 0.86, 0.008, 0.1]} />
        ))}
      </Instances>

      {/* The sheet: blank on the back, printed on the face */}
      <group ref={sheet} visible={false}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <group ref={turn} rotation={[0, Math.PI, 0]}>
            <mesh castShadow>
              <planeGeometry args={[SHEET_W, SHEET_H]} />
              <meshStandardMaterial map={print} color={SHEET_TINT} roughness={0.9} metalness={0} />
            </mesh>
            <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.003]}>
              <planeGeometry args={[SHEET_W, SHEET_H]} />
              <meshStandardMaterial color={SHEET_TINT} roughness={0.92} metalness={0} />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}
