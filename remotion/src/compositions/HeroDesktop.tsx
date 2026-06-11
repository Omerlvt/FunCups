// remotion/src/compositions/HeroDesktop.tsx
import { AbsoluteFill } from "remotion";
import { CupScene } from "../components/CupScene";
import {
  CAMERA_FAR_Z,
  CAMERA_LOOK_AT_Y,
  CAMERA_NEAR_Z,
  CAMERA_Y,
} from "../constants";

export function HeroDesktop() {
  return (
    <AbsoluteFill>
      <CupScene
        width={1920}
        height={1080}
        cameraStartZ={CAMERA_NEAR_Z}
        cameraEndZ={CAMERA_FAR_Z}
        cameraY={CAMERA_Y}
        cameraLookAtY={CAMERA_LOOK_AT_Y}
      />
    </AbsoluteFill>
  );
}
