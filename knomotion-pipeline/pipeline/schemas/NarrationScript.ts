/**
 * Stage 4 — Script Generation (LLM).
 *
 * Input:  VideoPlan.json
 * Output: NarrationScript.json
 *
 * Writes the narration per scene BEFORE any scene JSON is generated. Visuals
 * support the narration, not the other way around. Produces on-screen text and
 * emphasis phrases alongside the spoken script.
 *
 * The `voice` block is consumed by Stage 5 (TTS) — it carries no audio
 * URLs (none exist yet) and is purely a request for how narration should be
 * voiced.
 */

import { z } from 'zod';
import { renameKeys, withMeta } from './common';

/** Voicing intent for TTS. Consumed by Stage 5 (TTS). */
export const VoiceProfileSchema = z.object({
  voiceId: z.string().optional().describe('Provider voice identifier (resolved at TTS time)'),
  style: z.string().optional().describe('Delivery style, e.g. "warm", "energetic", "calm"'),
  tone: z.string().optional().describe('Emotional tone for the narration'),
  pace: z
    .enum(['slow', 'medium', 'fast'])
    .optional()
    .describe('Relative speaking pace'),
});
export type VoiceProfile = z.infer<typeof VoiceProfileSchema>;

/** Narration and on-screen language for a single scene. */
export const SceneNarrationSchema = z.preprocess(
  (v) => renameKeys(v, { id: 'sceneId', scene: 'sceneId', script: 'narration', text: 'narration' }),
  z.object({
  sceneId: z.string().min(1).describe('Matches the ScenePlan.id this narration belongs to'),
  order: z.number().int().min(0).describe('Position within the video (mirrors ScenePlan.order)'),
  narration: z
    .string()
    .min(1)
    .describe('The spoken script for this scene — written first, drives the visuals'),
  onScreenText: z
    .array(z.string())
    .default([])
    .describe('Text intended to appear on screen, in reading order'),
  emphasisPhrases: z
    .array(z.string())
    .default([])
    .describe('Phrases within the narration to emphasise (visually and/or vocally)'),
  estimatedDurationSeconds: z
    .number()
    .min(0.5)
    .describe('Estimated spoken duration; reconciled with real TTS audio by Stage 6 (timing)'),
  notes: z.string().optional().describe('Direction notes for scene JSON generation'),
  }),
);
export type SceneNarration = z.infer<typeof SceneNarrationSchema>;

export const NarrationScriptSchema = withMeta({
  videoId: z.string().min(1).describe('Matches the VideoPlan.videoId'),
  title: z.string().min(1).describe('Video title'),
  voice: VoiceProfileSchema.optional().describe('Requested voicing for TTS (consumed by Stage 5)'),
  scenes: z
    .array(SceneNarrationSchema)
    .min(1)
    .describe('Per-scene narration, aligned 1:1 with the VideoPlan scenes'),
});
export type NarrationScript = z.infer<typeof NarrationScriptSchema>;
