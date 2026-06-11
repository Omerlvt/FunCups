import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BG_COLOR } from "../constants";

// ─── Overlay layers ───────────────────────────────────────────────────────────

function Vignette() {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 55%, transparent 30%, rgba(15,10,5,0.62) 100%)",
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}

function WarmGrade() {
  return (
    <AbsoluteFill
      style={{
        background: "rgba(196,114,74,0.06)",
        mixBlendMode: "multiply",
        pointerEvents: "none",
        zIndex: 11,
      }}
    />
  );
}

// Cream flash at transition peaks
function Flash({ peakFrame }: { peakFrame: number }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [peakFrame - 6, peakFrame, peakFrame + 6, peakFrame + 18],
    [0, 0.55, 0.55, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG_COLOR,
        opacity,
        pointerEvents: "none",
        zIndex: 9,
      }}
    />
  );
}

// ─── Individual photo layer ───────────────────────────────────────────────────

type PhotoLayerProps = {
  src: string;
  startFrame: number;
  endFrame: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  startScale: number;
  endScale: number;
  // Pan direction: translate as % of container
  startX?: number;
  endX?: number;
  startY?: number;
  endY?: number;
  blurInFrames?: number; // focus-pull: blur → sharp over N frames
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
  startX = 0,
  endX = 0,
  startY = 0,
  endY = 0,
  blurInFrames = 0,
  objectPosition = "center center",
}: PhotoLayerProps) {
  const frame = useCurrentFrame();

  if (frame < startFrame || frame > endFrame) return null;

  const safeOut = Math.max(fadeOutDuration, 1);
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + fadeInDuration, endFrame - safeOut, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(frame, [startFrame, endFrame], [startScale, endScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateX = interpolate(frame, [startFrame, endFrame], [startX, endX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [startFrame, endFrame], [startY, endY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blur =
    blurInFrames > 0
      ? interpolate(frame, [startFrame, startFrame + blurInFrames], [10, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
          transformOrigin: "center center",
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          willChange: "transform",
        }}
      />
    </AbsoluteFill>
  );
}

// ─── Rx badge — animated label tag in corner ──────────────────────────────────

function RxBadge() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 80 } });
  const opacity = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        zIndex: 20,
        pointerEvents: "none",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        padding: "0 0 42px 48px",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${(1 - progress) * 24}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: 11,
            letterSpacing: "0.35em",
            color: "rgba(245,240,232,0.7)",
            textTransform: "uppercase",
          }}
        >
          Rx #0042
        </span>
        <span
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: 13,
            letterSpacing: "0.18em",
            color: "rgba(245,240,232,0.55)",
            textTransform: "uppercase",
          }}
        >
          60 ML OF TRUE FUN
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ─── Main scene ───────────────────────────────────────────────────────────────

type PhotoSceneProps = {
  objectPosition?: string;
};

export function PhotoScene({ objectPosition = "center center" }: PhotoSceneProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: BG_COLOR, overflow: "hidden" }}>
      {/* Shot 1 (0–90): 4 cups front row — focus pull open + pan left→right */}
      <PhotoLayer
        src={staticFile("photos/IMG_3315.JPG")}
        startFrame={0}
        endFrame={95}
        fadeInDuration={8}
        fadeOutDuration={18}
        startScale={1.4}
        endScale={1.05}
        startX={-2}
        endX={1}
        blurInFrames={22}
        objectPosition={objectPosition}
      />

      {/* Shot 2 (75–165): Tower stack — pan upward slowly */}
      <PhotoLayer
        src={staticFile("photos/IMG_3325.JPG")}
        startFrame={75}
        endFrame={165}
        fadeInDuration={18}
        fadeOutDuration={18}
        startScale={1.12}
        endScale={1.18}
        startX={0}
        endX={0}
        startY={2}
        endY={-2}
        objectPosition={objectPosition}
      />

      {/* Shot 3 (145–230): Hand + tower lifestyle — pan right, zoom out */}
      <PhotoLayer
        src={staticFile("photos/IMG_3322.JPG")}
        startFrame={145}
        endFrame={230}
        fadeInDuration={18}
        fadeOutDuration={18}
        startScale={1.15}
        endScale={1.05}
        startX={1}
        endX={-1}
        objectPosition={objectPosition}
      />

      {/* Shot 4 (212–240): Back to clean — gentle breathe, loops into shot 1 */}
      <PhotoLayer
        src={staticFile("photos/IMG_3315.JPG")}
        startFrame={212}
        endFrame={240}
        fadeInDuration={18}
        fadeOutDuration={1}
        startScale={1.05}
        endScale={1.08}
        objectPosition={objectPosition}
      />

      {/* Transition flashes at cut points */}
      <Flash peakFrame={83} />
      <Flash peakFrame={158} />
      <Flash peakFrame={221} />

      {/* Overlays */}
      <Vignette />
      <WarmGrade />

      {/* Rx badge slides up from bottom-left */}
      <RxBadge />
    </AbsoluteFill>
  );
}
