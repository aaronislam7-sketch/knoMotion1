/**
 * Stage 2 — Module Planning (LLM).
 *
 * Input:  ContentMap.json
 * Output: ModulePlan.json
 *
 * Decides what the module should contain. Groups concepts into videos,
 * defines learning objectives, and sequences the learning journey.
 *
 * Each `VideoBrief` is the compressed handoff to Stage 3 — Stage 3 receives a
 * single brief plus only the concepts it references, not the whole ContentMap.
 */

import { z } from 'zod';
import { DifficultySchema, VideoFormatSchema, withMeta } from './common';

/** A measurable thing the learner should be able to do after the module. */
export const LearningObjectiveSchema = z.object({
  id: z.string().min(1).describe('Stable objective id'),
  statement: z
    .string()
    .min(1)
    .describe('Objective phrased as an outcome, e.g. "Explain why spaced practice works"'),
  conceptIds: z.array(z.string()).describe('Concept ids (from ContentMap) this objective covers'),
});
export type LearningObjective = z.infer<typeof LearningObjectiveSchema>;

/**
 * A self-contained video within the module. This is the unit handed to
 * Stage 3, one brief at a time. It carries only references (ids) plus a tight
 * summary so the next stage can be given a compressed, focused input.
 */
export const VideoBriefSchema = z.object({
  id: z.string().min(1).describe('Stable video id (kebab-case); flows through to VideoPlan/NarrationScript'),
  order: z.number().int().min(0).describe('Position of this video in the module sequence'),
  title: z.string().min(1).describe('Working title for the video'),
  summary: z.string().min(1).describe('One-paragraph description of what this video teaches'),
  objectiveIds: z.array(z.string()).describe('Learning objective ids this video addresses'),
  conceptIds: z.array(z.string()).describe('Concept ids (from ContentMap) this video covers'),
  difficulty: DifficultySchema.optional().describe('Overall difficulty of the video'),
  estimatedDurationSeconds: z
    .number()
    .min(1)
    .optional()
    .describe('Rough target runtime; refined during planning/scripting'),
  format: VideoFormatSchema.optional().describe('Suggested output format for this video'),
});
export type VideoBrief = z.infer<typeof VideoBriefSchema>;

export const ModulePlanSchema = withMeta({
  moduleTitle: z.string().min(1).describe('Title of the overall learning module'),
  moduleSummary: z.string().min(1).describe('What the module covers and why it is structured this way'),
  targetAudience: z.string().min(1).describe('Who this module is for'),
  objectives: z
    .array(LearningObjectiveSchema)
    .min(1)
    .describe('Module-level learning objectives'),
  videos: z
    .array(VideoBriefSchema)
    .min(1)
    .describe('Ordered briefs, one per planned video'),
  sequenceRationale: z
    .string()
    .optional()
    .describe('Why the videos are ordered as they are (pedagogical reasoning)'),
});
export type ModulePlan = z.infer<typeof ModulePlanSchema>;
