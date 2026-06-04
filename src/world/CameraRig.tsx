import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils, Vector3 } from 'three';
import { cameraCurve, getLookTarget, easeSegmented, WAYPOINTS, LOOK_TARGETS } from '../lib/cameraPath';
import { scroll } from '../lib/scrollStore';

type Props = { reducedMotion: boolean };

/**
 * Catmull-Rom (math spline) camera controller. Samples the curve by scroll
 * progress — not time — through a per-segment easing remap, then damps position
 * and look-at toward the eased target. Never snaps.
 */
export function CameraRig({ reducedMotion }: Props) {
  const { camera } = useThree();
  const targetPos = useMemo(() => new Vector3(), []);
  const lookAt = useMemo(() => new Vector3(), []);
  const currentLook = useRef(new Vector3().copy(LOOK_TARGETS[0]));
  // Snapshot of which waypoint we're parked on in reduced-motion mode.
  const frozenSection = useRef(-1);

  // Initialize at the hero waypoint so the first frame isn't a lerp from origin.
  useMemo(() => {
    camera.position.copy(WAYPOINTS[0]);
    camera.lookAt(LOOK_TARGETS[0]);
  }, [camera]);

  useFrame((_, delta) => {
    if (reducedMotion) {
      // Fade between discrete static shots: jump position to the active section's
      // waypoint, then gently damp the look-at for a soft settle.
      const section = scroll.section;
      if (frozenSection.current !== section) {
        frozenSection.current = section;
        camera.position.copy(WAYPOINTS[section]);
      }
      currentLook.current.lerp(LOOK_TARGETS[section], 0.1);
      camera.lookAt(currentLook.current);
      return;
    }

    // Clamp delta so a tab-switch / GC stall can't teleport the camera on the
    // next frame — caps any single-frame catch-up to ~50ms of motion.
    const dt = Math.min(delta, 0.05);

    // Ease the scroll param so the dolly slows into / out of each waypoint.
    const t = easeSegmented(MathUtils.clamp(scroll.progress, 0, 1));
    cameraCurve.getPointAt(t, targetPos);

    // Frame-rate-independent damping. Lower lambda = heavier, slower settle — a
    // weighted cinematic glide for the zoom-parallax (was 4). The smootherstep
    // remap above shapes the dwell; 2.5 keeps the dolly slow and buttery.
    const lambda = 2.5;
    camera.position.x = MathUtils.damp(camera.position.x, targetPos.x, lambda, dt);
    camera.position.y = MathUtils.damp(camera.position.y, targetPos.y, lambda, dt);
    camera.position.z = MathUtils.damp(camera.position.z, targetPos.z, lambda, dt);

    getLookTarget(t, lookAt);
    currentLook.current.x = MathUtils.damp(currentLook.current.x, lookAt.x, lambda, dt);
    currentLook.current.y = MathUtils.damp(currentLook.current.y, lookAt.y, lambda, dt);
    currentLook.current.z = MathUtils.damp(currentLook.current.z, lookAt.z, lambda, dt);
    camera.lookAt(currentLook.current);
  });

  return null;
}
