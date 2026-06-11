import { AbsoluteFill } from "remotion";
import { PhotoScene } from "../components/PhotoScene";

export function HeroDesktop() {
  return (
    <AbsoluteFill>
      <PhotoScene objectPosition="center center" />
    </AbsoluteFill>
  );
}
