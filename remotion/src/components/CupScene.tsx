// remotion/src/components/CupScene.tsx
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { Suspense } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BG_COLOR, BEAT_REVEAL_END } from "../constants";
import { CupModel } from "./CupModel";

type CameraControllerProps = {
  z: number;
  y: number;
  lookAtY: number;
};

function CameraController({ z, y, lookAtY }: CameraControllerProps) {
  const { camera } = useThree();
  camera.position.set(0, y, z);
  camera.lookAt(0, lookAtY, 0);
  camera.updateProjectionMatrix();
  return null;
}

type CupSceneProps = {
  width: number;
  height: number;
  cameraStartZ: number;
  cameraEndZ: number;
  cameraY: number;
  cameraLookAtY: number;
};

export function CupScene({
  width,
  height,
  cameraStartZ,
  cameraEndZ,
  cameraY,
  cameraLookAtY,
}: CupSceneProps) {
  const frame = useCurrentFrame();

  const cameraZ = interpolate(frame, [0, BEAT_REVEAL_END], [cameraStartZ, cameraEndZ], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.easeOut,
  });

  return (
    <ThreeCanvas width={width} height={height}>
      {/* Scene background — set via Three.js so WebGL renderer respects it in headless MP4 renders */}
      <color attach="background" args={[BG_COLOR]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} color="#fff8f0" />
      <directionalLight position={[-3, 4, 3]} intensity={1.2} />
      <directionalLight position={[3, 1, 2]} intensity={0.5} />
      <pointLight position={[0, 2, -3]} intensity={0.8} />

      {/* Animated camera */}
      <CameraController z={cameraZ} y={cameraY} lookAtY={cameraLookAtY} />

      {/* The cup — Suspense required because useGLTF throws a Promise while loading */}
      <Suspense fallback={null}>
        <CupModel />
      </Suspense>
    </ThreeCanvas>
  );
}
