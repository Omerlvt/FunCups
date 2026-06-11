import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BG_COLOR } from "../constants";

type PhotoLayerProps = {
  src: string;
  startFrame: number;
  endFrame: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  startScale: number;
  endScale: number;
  objectPosition?: string;
};

function PhotoLayer({
  src,
  startFrame,
  endFrame,
  fadeInDuration,
  fadeOutDuration,
  startScale,
  endScale,
  objectPosition = "center center",
}: PhotoLayerProps) {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + fadeInDuration, endFrame - fadeOutDuration, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    frame,
    [startFrame, endFrame],
    [startScale, endScale],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < startFrame || frame > endFrame) return null;

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
    </AbsoluteFill>
  );
}

type PhotoSceneProps = {
  objectPosition?: string;
};

export function PhotoScene({ objectPosition = "center center" }: PhotoSceneProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: BG_COLOR }}>
      {/* Shot 1 (0–90): 4 cups front-facing — slow zoom-out reveal */}
      <PhotoLayer
        src={staticFile("photos/IMG_3315.JPG")}
        startFrame={0}
        endFrame={90}
        fadeInDuration={8}
        fadeOutDuration={20}
        startScale={1.35}
        endScale={1.0}
        objectPosition={objectPosition}
      />

      {/* Shot 2 (70–160): Tower stack — slow breathe in */}
      <PhotoLayer
        src={staticFile("photos/IMG_3325.JPG")}
        startFrame={70}
        endFrame={160}
        fadeInDuration={20}
        fadeOutDuration={20}
        startScale={1.05}
        endScale={1.12}
        objectPosition={objectPosition}
      />

      {/* Shot 3 (140–230): Hand + tower lifestyle — slow breathe out */}
      <PhotoLayer
        src={staticFile("photos/IMG_3322.JPG")}
        startFrame={140}
        endFrame={230}
        fadeInDuration={20}
        fadeOutDuration={20}
        startScale={1.1}
        endScale={1.04}
        objectPosition={objectPosition}
      />

      {/* Shot 4 (210–240): Back to clean — gentle settle, loops into shot 1 */}
      <PhotoLayer
        src={staticFile("photos/IMG_3315.JPG")}
        startFrame={210}
        endFrame={240}
        fadeInDuration={20}
        fadeOutDuration={0}
        startScale={1.0}
        endScale={1.02}
        objectPosition={objectPosition}
      />
    </AbsoluteFill>
  );
}
