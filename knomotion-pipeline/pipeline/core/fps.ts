/**
 * The renderer's fixed frame rate.
 *
 * The renderer declares this in capability-manifest.json (constraints.fpsFixed).
 * Zod preprocessors are synchronous, so the pipeline can't read the manifest at
 * parse time; instead this constant is the single place the number lives in
 * pipeline code, and __tests__/fps.test.ts asserts it equals the manifest.
 */
export const FPS = 30;

export const secondsToFrames = (seconds: number, fps: number = FPS): number =>
  Math.max(1, Math.round(seconds * fps));

export const framesToSeconds = (frames: number, fps: number = FPS): number => frames / fps;
