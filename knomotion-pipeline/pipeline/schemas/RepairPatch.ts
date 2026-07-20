/**
 * Stage 7 — Targeted Repair Loop (LLM, only on validation failure).
 *
 * Input:  failed scene fragment + validation errors
 * Output: RepairPatch.json (a patched scene fragment)
 *
 * Surgical repair only. Does NOT regenerate the whole video. Maximum 2 repair
 * attempts; after that the scene is marked `needs_review`. The repair prompt is
 * explicit: only fix the listed validation errors, do not change educational
 * meaning, do not touch unrelated scenes, return patched JSON only.
 */

import { z } from 'zod';
import { withMeta } from './common';
import { SceneItemSchema } from './KnoMotionVideoConfig';
import { ValidationIssueSchema } from './ValidationReport';

export const RepairStatusSchema = z.enum(['repaired', 'needs_review']);
export type RepairStatus = z.infer<typeof RepairStatusSchema>;

export const RepairPatchSchema = withMeta({
  videoId: z.string().min(1).describe('Video this repair belongs to'),
  sceneId: z.string().min(1).describe('Id of the single scene being repaired'),
  sceneIndex: z.number().int().min(0).describe('Index of the scene within the config (for splice-back)'),
  attempt: z
    .number()
    .int()
    .min(1)
    .max(2)
    .describe('Repair attempt number (1 or 2). After attempt 2 fails → needs_review'),
  targetIssues: z
    .array(ValidationIssueSchema)
    .min(1)
    .describe('The exact validation issues this patch is meant to resolve'),
  patchedScene: SceneItemSchema.describe('The repaired scene fragment, ready to splice back into the config'),
  status: RepairStatusSchema.describe('repaired → re-validate; needs_review → stop and flag for a human'),
  unchangedGuarantee: z
    .boolean()
    .default(true)
    .describe('Asserts the repair changed only the targeted scene and preserved educational meaning'),
  notes: z.string().optional().describe('What was changed and why (for audit)'),
});
export type RepairPatch = z.infer<typeof RepairPatchSchema>;
