import { AbsoluteFill } from "remotion";
import { PhotoScene } from "../components/PhotoScene";

export function HeroMobile() {
  return (
    <AbsoluteFill>
      {/* objectPosition shifts focus upward so cups fill the portrait frame */}
      <PhotoScene objectPosition="center 40%" />
    </AbsoluteFill>
  );
}
