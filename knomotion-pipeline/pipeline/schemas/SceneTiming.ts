/**
 * Stage 6 — Timing (deterministic).
 *
 * Input:  NarrationScript.json + TTSManifest.json
 * Output: 04b-scene-timing.json
 *
 * The single source of truth for WHEN things happen in a video. Scene JSON
 * generation (Stage 7) receives this as a fixed input and its post-process
 * overwrites any LLM-authored `durationInFrames` / `beats` with these values,
 * so the model can no longer author impossible timing.
 *
 * All times are SECONDS relative to the scene start (the renderer's beat
 * convention). `durationInFrames` is the only frame-denominated field.
 */

import { z } from 'zod';
import { withMeta } from './common';

export const TimingSourceSchema = z.enum(['tts', 'estimate']);
export type TimingSource = z.infer<typeof TimingSourceSchema>;

/** When one on-screen line / item should be visible. */
export const LineWindowSchema = z.object({
  text: z.string().describe('The on-screen text this window was computed for'),
  start: z.number().min(0).describe('Seconds into the scene when the line enters'),
  exit: z.number().min(0).describe('Seconds into the scene when the line begins to exit'),
});
export type LineWindow = z.infer<typeof LineWindowSchema>;

export const SceneTimingSchema = z.object({
  sceneId: z.string().min(1),
  source: TimingSourceSchema.describe('"tts" = derived from measured audio; "estimate" = word-count estimate'),
  durationInFrames: z.number().int().min(1).describe('Scene duration the config MUST use'),
  durationSeconds: z.number().min(0).describe('durationInFrames / fps'),
  narrationStart: z.number().min(0).describe('Seconds into the scene the narration audio starts (lead-in)'),
  narrationEnd: z.number().min(0).describe('Seconds into the scene the narration audio ends'),
  contentExit: z.number().min(0).describe('Seconds into the scene when on-screen content should begin exiting'),
  lineWindows: z.array(LineWindowSchema).describe('One window per NarrationScript.onScreenText entry, in order'),
});
export type SceneTiming = z.infer<typeof SceneTimingSchema>;

export const SceneTimingArtifactSchema = withMeta({
  videoId: z.string().min(1),
  fps: z.number().int().min(1),
  totalDurationInFrames: z.number().int().min(1).describe('Sum of scene durations (before transition overlap)'),
  scenes: z.array(SceneTimingSchema).min(1).describe('One entry per scene, in playback order'),
});
export type SceneTimingArtifact = z.infer<typeof SceneTimingArtifactSchema>;
