// remotion/src/constants.ts

export const FPS = 30;
export const TOTAL_FRAMES = 240; // 8 seconds at 30fps

// Animation beat boundaries (in frames)
export const BEAT_REVEAL_END = 60;   // 0–60:  camera pull-back
export const BEAT_ROTATE_END = 180;  // 60–180: cup rotation
                                      // 180–240: float idle

// Desktop camera
export const CAMERA_NEAR_Z = 3;
export const CAMERA_FAR_Z = 6;
export const CAMERA_Y = 0.5;
export const CAMERA_LOOK_AT_Y = 1.5;

// Mobile camera (cup fills lower 60% of portrait frame)
export const CAMERA_MOBILE_Z_NEAR = 3;
export const CAMERA_MOBILE_Z_FAR = 5;
export const CAMERA_MOBILE_Y = -0.3;
export const CAMERA_MOBILE_LOOK_AT_Y = 0.8;

// Float animation
export const FLOAT_AMPLITUDE = 0.08; // world units, vertical bob distance
// Float completes exactly 1 full Math.sin cycle between frame 180–240
// so position returns to 0 at frame 240 → seamless loop

export const BG_COLOR = "#F5F0E8";
