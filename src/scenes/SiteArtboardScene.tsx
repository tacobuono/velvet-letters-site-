import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import {
  Group,
  Mesh,
  MeshBasicMaterial,
  Plane,
  SRGBColorSpace,
  Texture,
  Vector3,
} from 'three';
import { COLORS, FONT_FILES } from '../lib/tokens';
import { scroll } from '../lib/scrollStore';

type Props = { reducedMotion: boolean };

/** Smoothstep 0..1. */
const ss = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
/** Eased 0..1 progress of p across the [a, b] window. */
const win = (p: number, a: number, b: number) => ss((p - a) / (b - a));

// Artboard geometry (world units). The board is the fictional client site —
// "Hôtel Verlaine", a concept study — floating in the velvet studio.
const BOARD_W = 4.6;
const BOARD_H = 5.6;
const BOARD_Y = 0.2; // world y of board centre
// Beat 5: the finished page scrolls inside the board. Total translate distance
// chosen so the closing photograph lands dead-centre for the camera dive.
const PAGE_SCROLL = 4.3;
const SCROLL_WIN: [number, number] = [0.66, 0.92];

type PhotoBlock = {
  texIndex: number;
  w: number;
  h: number;
  x: number;
  y: number;
  enter: [number, number];
  /** Settle-in tilt (radians) for the "caught mid-landing" gallery tile. */
  tilt?: number;
};

// Page layout, local coords on the board (y+ up, board spans ±2.8).
const PHOTO_BLOCKS: PhotoBlock[] = [
  { texIndex: 0, w: 4.2, h: 1.8, x: 0, y: 1.5, enter: [0.1, 0.2] }, // hero — facade
  { texIndex: 1, w: 1.9, h: 1.35, x: -1.05, y: -0.78, enter: [0.27, 0.37] }, // editorial — lobby
  { texIndex: 2, w: 1.3, h: 0.9, x: -1.5, y: -2.2, enter: [0.42, 0.5] }, // gallery — room
  { texIndex: 3, w: 1.3, h: 0.9, x: 0, y: -2.2, enter: [0.45, 0.53], tilt: -0.06 }, // gallery — bar
  { texIndex: 4, w: 1.3, h: 0.9, x: 1.5, y: -2.2, enter: [0.48, 0.56] }, // gallery — garden
  { texIndex: 5, w: 4.2, h: 2.0, x: 0, y: -4.35, enter: [0.55, 0.63] }, // closing — corridor (the dive)
];

type Bar = { w: number; h: number; x: number; y: number; enter: [number, number]; alpha: number };

// Thin cream planes that read as the fictional site's text from camera distance.
const BARS: Bar[] = [
  { w: 1.1, h: 0.035, x: 1.2, y: 2.62, enter: [0.04, 0.1], alpha: 0.35 }, // nav links
  { w: 2.2, h: 0.05, x: -0.6, y: 0.34, enter: [0.16, 0.24], alpha: 0.4 }, // hero sub line 1
  { w: 1.5, h: 0.05, x: -0.95, y: 0.18, enter: [0.18, 0.26], alpha: 0.4 }, // hero sub line 2
  { w: 1.7, h: 0.05, x: 1.05, y: -0.38, enter: [0.3, 0.4], alpha: 0.45 }, // editorial heading
  { w: 1.9, h: 0.035, x: 1.15, y: -0.6, enter: [0.32, 0.42], alpha: 0.28 },
  { w: 1.9, h: 0.035, x: 1.15, y: -0.76, enter: [0.33, 0.43], alpha: 0.28 },
  { w: 1.3, h: 0.035, x: 0.85, y: -0.92, enter: [0.34, 0.44], alpha: 0.28 },
  { w: 2.6, h: 0.045, x: 0, y: -3.05, enter: [0.5, 0.58], alpha: 0.5 }, // pull-quote line
  { w: 1.8, h: 0.045, x: 0, y: -3.22, enter: [0.52, 0.6], alpha: 0.5 },
];

const PHOTO_URLS = [
  '/photos/verlaine/01-facade.jpg',
  '/photos/verlaine/02-lobby.jpg',
  '/photos/verlaine/03-room.jpg',
  '/photos/verlaine/04-bar.jpg',
  '/photos/verlaine/05-garden.jpg',
  '/photos/verlaine/06-corridor.jpg',
];

/**
 * The whole homepage journey in one persistent scene: a fictional client
 * website assembles itself on a floating artboard as the visitor scrolls —
 * photographs slide in, sections settle, the finished page plays through,
 * and the camera finally dives into its closing photograph (the doorway to
 * /about). Photorealism comes from real photographic textures on planes —
 * cheap on the GPU, scroll-driven, demand-mode safe.
 */
export function SiteArtboardScene({ reducedMotion }: Props) {
  const { invalidate } = useThree();
  const textures = useTexture(PHOTO_URLS) as Texture[];
  useMemo(() => {
    for (const t of textures) t.colorSpace = SRGBColorSpace;
  }, [textures]);

  const pageRef = useRef<Group>(null);
  const photoRefs = useRef<(Mesh | null)[]>([]);
  const barRefs = useRef<(Mesh | null)[]>([]);
  const cursorRef = useRef<Mesh>(null);
  const headlineRef = useRef<{ fillOpacity: number } | null>(null);
  const navRef = useRef<{ fillOpacity: number } | null>(null);
  const animT = useRef(0);

  // World-space clip planes at the board's top/bottom edges, so the page
  // scrolls "inside" the frame during beat 5 instead of spilling over it.
  const clipPlanes = useMemo(
    () => [
      new Plane(new Vector3(0, -1, 0), BOARD_Y + BOARD_H / 2), // keep y <= top
      new Plane(new Vector3(0, 1, 0), -(BOARD_Y - BOARD_H / 2)), // keep y >= bottom
    ],
    [],
  );

  useFrame((_, delta) => {
    const p = reducedMotion ? 1 : scroll.progress;
    animT.current += Math.min(delta, 0.05);

    // Beat 5 — the finished site scrolls itself inside the frame.
    if (pageRef.current) {
      pageRef.current.position.y = PAGE_SCROLL * win(p, SCROLL_WIN[0], SCROLL_WIN[1]);
    }

    // Assembly: each block drops ~0.7 units onto its slot while fading in.
    for (let i = 0; i < PHOTO_BLOCKS.length; i++) {
      const mesh = photoRefs.current[i];
      const block = PHOTO_BLOCKS[i];
      if (!mesh) continue;
      const e = win(p, block.enter[0], block.enter[1]);
      mesh.position.y = block.y + (1 - e) * 0.7;
      if (block.tilt) mesh.rotation.z = block.tilt * (1 - e);
      (mesh.material as MeshBasicMaterial).opacity = e;
      mesh.visible = e > 0.001;
    }
    for (let i = 0; i < BARS.length; i++) {
      const mesh = barRefs.current[i];
      const bar = BARS[i];
      if (!mesh) continue;
      const e = win(p, bar.enter[0], bar.enter[1]);
      mesh.position.y = bar.y + (1 - e) * 0.35;
      (mesh.material as MeshBasicMaterial).opacity = bar.alpha * e;
      mesh.visible = e > 0.001;
    }

    // Brand text: in after the hero lands, out as the page starts to scroll
    // (troika text can't reliably clip, so it exits before the clip matters).
    const textIn = win(p, 0.13, 0.22) * (1 - win(p, 0.64, 0.68));
    if (headlineRef.current) headlineRef.current.fillOpacity = textIn;
    if (navRef.current) navRef.current.fillOpacity = 0.8 * (win(p, 0.04, 0.1) * (1 - win(p, 0.64, 0.68)));

    // Blinking cursor on the blank artboard — gone once the build begins.
    if (cursorRef.current) {
      const blink = Math.sin(animT.current * 5) > 0 ? 1 : 0;
      (cursorRef.current.material as MeshBasicMaterial).opacity =
        blink * (1 - win(p, 0.08, 0.12));
      cursorRef.current.visible = p < 0.12;
    }

    // The scene runs under frameloop="demand" and otherwise sleeps at rest. While
    // the visitor is still parked on the blank artboard (before any scroll), keep
    // requesting frames so the cursor actually blinks and the gold dust keeps
    // drifting — the "waiting to be composed" beat. The instant they scroll past
    // it, this stops and the GPU sleeps between scroll-driven frames again.
    if (!reducedMotion && p < 0.12) invalidate();
  });

  return (
    <group position={[0, BOARD_Y, 0]}>
      {/* Gold hairline frame (slightly larger backing plane) */}
      <mesh position={[0, 0, -0.012]}>
        <planeGeometry args={[BOARD_W + 0.06, BOARD_H + 0.06]} />
        <meshStandardMaterial
          color={COLORS.gold}
          emissive={COLORS.gold}
          emissiveIntensity={0.18}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
      {/* The dark page itself */}
      <mesh>
        <planeGeometry args={[BOARD_W, BOARD_H]} />
        <meshStandardMaterial color="#241019" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Honest label — this is a concept study, not a client */}
      <Text
        font={FONT_FILES.ui}
        position={[0, -BOARD_H / 2 - 0.22, 0]}
        fontSize={0.09}
        letterSpacing={0.3}
        color={COLORS.gold}
        fillOpacity={0.55}
        anchorX="center"
        anchorY="middle"
      >
        CONCEPT STUDY — A FICTIONAL COMMISSION, COMPOSED LIVE
      </Text>

      {/* Blinking cursor (beat 1) */}
      <mesh ref={cursorRef} position={[-1.7, 1.9, 0.03]}>
        <planeGeometry args={[0.06, 0.34]} />
        <meshBasicMaterial color={COLORS.gold} transparent opacity={0} />
      </mesh>

      {/* The page content — translates upward inside the clip frame in beat 5 */}
      <group ref={pageRef}>
        {/* Site brand, nav hint */}
        <Text
          ref={navRef as never}
          font={FONT_FILES.displayBold}
          position={[-1.55, 2.62, 0.02]}
          fontSize={0.14}
          letterSpacing={0.18}
          color={COLORS.cream}
          fillOpacity={0}
          anchorX="left"
          anchorY="middle"
        >
          HÔTEL VERLAINE
        </Text>

        {/* Fictional site headline over the hero photo */}
        <Text
          ref={headlineRef as never}
          font={FONT_FILES.displayBold}
          position={[-2.0, 0.78, 0.04]}
          fontSize={0.4}
          color={COLORS.cream}
          fillOpacity={0}
          anchorX="left"
          anchorY="middle"
        >
          Hôtel Verlaine
        </Text>

        {PHOTO_BLOCKS.map((b, i) => (
          <mesh
            key={i}
            ref={(m) => {
              photoRefs.current[i] = m;
            }}
            position={[b.x, b.y, 0.02]}
          >
            <planeGeometry args={[b.w, b.h]} />
            <meshBasicMaterial
              map={textures[b.texIndex]}
              // Warm multiply tint pulls every placeholder toward the Verlaine
              // grade (amber light, plum shadow) until the final photography lands.
              color="#f0dcc8"
              transparent
              opacity={0}
              clippingPlanes={clipPlanes}
            />
          </mesh>
        ))}

        {BARS.map((b, i) => (
          <mesh
            key={i}
            ref={(m) => {
              barRefs.current[i] = m;
            }}
            position={[b.x, b.y, 0.02]}
          >
            <planeGeometry args={[b.w, b.h]} />
            <meshBasicMaterial
              color={COLORS.cream}
              transparent
              opacity={0}
              clippingPlanes={clipPlanes}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
