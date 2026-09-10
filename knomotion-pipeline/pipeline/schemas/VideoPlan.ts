/**
 * Stage 3 — Video Narrative Planning (LLM, one call per video).
 *
 * Input:  one VideoBrief (from ModulePlan.json) + the concepts it references
 * Output: VideoPlan.json
 *
 * Creates the teaching flow for a single video: narrative arc, scene sequence,
 * suggested mid-scene types, and visual intent. This is a PLANNING object —
 * not final KnoMotion JSON. The `suggested*` fields are advisory; Stage 7 is
 * the only stage allowed to emit binding KnoMotion config, and it must stay
 * within the capability manifest regardless of what was suggested here.
 */

import { z } from 'zod';
import {
  DifficultySchema,
  LayoutTypeSchema,
  MidSceneKeySchema,
  ScenePurposeSchema,
  StylePresetSchema,
  VideoFormatSchema,
  withMeta,
} from './common';

/** A single planned scene in the teaching flow (not yet KnoMotion JSON). */
export const ScenePlanSchema = z.object({
  id: z.string().min(1).describe('Stable scene id (kebab-case); flows through to NarrationScript and scene JSON'),
  order: z.number().int().min(0).describe('Position of this scene within the video'),
  purpose: ScenePurposeSchema.describe('Narrative role this scene plays'),
  title: z.string().min(1).describe('Short working title for the scene'),
  beat: z
    .string()
    .min(1)
    .describe('What happens in this scene narratively — the teaching beat'),
  keyPoints: z
    .array(z.string())
    .min(1)
    .describe('Concrete points the scene must convey'),
  conceptIds: z
    .array(z.string())
    .optional()
    .describe('Concept ids (from ContentMap) this scene teaches'),
  visualIntent: z
    .string()
    .min(1)
    .describe('Plain-language description of what should appear on screen'),
  suggestedMidScenes: z
    .array(MidSceneKeySchema)
    .optional()
    .describe('Advisory mid-scene types; Stage 7 decides the binding choice'),
  suggestedLayout: LayoutTypeSchema.optional().describe('Advisory layout type'),
  suggestedStylePreset: StylePresetSchema.optional().describe('Advisory style preset'),
  estimatedDurationSeconds: z
    .number()
    .min(0.5)
    .describe('Estimated scene runtime in seconds; reconciled with TTS later'),
});
export type ScenePlan = z.infer<typeof ScenePlanSchema>;

export const VideoPlanSchema = withMeta({
  videoId: z.string().min(1).describe('Matches the originating VideoBrief.id'),
  title: z.string().min(1).describe('Video title'),
  narrativeArc: z
    .string()
    .min(1)
    .describe('The overall story/teaching arc that ties the scenes together'),
  audience: z.string().min(1).describe('Who this specific video is for'),
  difficulty: DifficultySchema.optional().describe('Overall difficulty of the video'),
  format: VideoFormatSchema.optional().describe('Intended output format'),
  targetDurationSeconds: z
    .number()
    .min(1)
    .describe('Target total runtime; sum of scene estimates should be close to this'),
  scenes: z
    .array(ScenePlanSchema)
    .min(1)
    .describe('Ordered scene plans making up the teaching flow'),
});
export type VideoPlan = z.infer<typeof VideoPlanSchema>;
