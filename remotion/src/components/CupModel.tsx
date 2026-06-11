// remotion/src/components/CupModel.tsx
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import {
  BEAT_REVEAL_END,
  BEAT_ROTATE_END,
  FLOAT_AMPLITUDE,
  TOTAL_FRAMES,
} from "../constants";

useGLTF.preload("/cup.glb");

export function CupModel() {
  const frame = useCurrentFrame();
  const { scene } = useGLTF("/cup.glb");
  // Clone so parallel Remotion render workers don't share the same Three.js object
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Beat 2: Y rotation 0 → 180°, slow ease-in-out. Stays clamped at π during beat 3.
  const rotation = interpolate(frame, [BEAT_REVEAL_END, BEAT_ROTATE_END], [0, Math.PI], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Beat 3: vertical float, one full sin cycle over frames 180–240
  const floatProgress = interpolate(frame, [BEAT_ROTATE_END, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const floatY = FLOAT_AMPLITUDE * Math.sin(floatProgress * 2 * Math.PI);

  return (
    <primitive
      object={clonedScene}
      rotation={[0, rotation, 0]}
      position={[0, floatY, 0]}
    />
  );
}
