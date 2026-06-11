// remotion/src/Root.tsx
import { Composition } from "remotion";
import { HeroDesktop } from "./compositions/HeroDesktop";
import { HeroMobile } from "./compositions/HeroMobile";
import { FPS, TOTAL_FRAMES } from "./constants";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="HeroDesktop"
        component={HeroDesktop}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="HeroMobile"
        component={HeroMobile}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
}
