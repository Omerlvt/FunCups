// remotion/src/compositions/HeroMobile.tsx
import { AbsoluteFill } from "remotion";
import { CupScene } from "../components/CupScene";
import {
  CAMERA_MOBILE_LOOK_AT_Y,
  CAMERA_MOBILE_Y,
  CAMERA_MOBILE_Z_FAR,
  CAMERA_MOBILE_Z_NEAR,
} from "../constants";

export function HeroMobile() {
  return (
    <AbsoluteFill>
      <CupScene
        width={1080}
        height={1920}
        cameraStartZ={CAMERA_MOBILE_Z_NEAR}
        cameraEndZ={CAMERA_MOBILE_Z_FAR}
        cameraY={CAMERA_MOBILE_Y}
        cameraLookAtY={CAMERA_MOBILE_LOOK_AT_Y}
      />
    </AbsoluteFill>
  );
}
