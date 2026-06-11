// remotion/src/components/CupModel.tsx
import { useGLTF } from "@react-three/drei";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import {
  BEAT_REVEAL_END,
  BEAT_ROTATE_END,
  FLOAT_AMPLITUDE,
  TOTAL_FRAMES,
} from "../constants";

export function CupModel() {
  const frame = useCurrentFrame();
  const { scene } = useGLTF("/cup.glb");

  // Beat 2: Y rotation 0 → 180°, slow ease-in-out
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
      object={scene}
      rotation={[0, rotation, 0]}
      position={[0, floatY, 0]}
    />
  );
}
