/**
 * Stage 10 — Targeted Repair (LLM, only on validation failure).
 * { failed scene fragment + its validation issues } -> RepairPatch (patched scene).
 * Surgical: one scene, max 2 attempts (enforced by the orchestrator), then needs_review.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { modelForStage } from '../../core/config';
import { SceneItemSchema } from '../../schemas/KnoMotionVideoConfig';
import { ValidationIssueSchema } from '../../schemas/ValidationReport';
import { RepairPatchSchema } from '../../schemas/RepairPatch';
import { repairPrompt as prompt } from '../../prompts/repair';

export const RepairInputSchema = z.object({
  videoId: z.string().min(1),
  sceneIndex: z.number().int().min(0),
  scene: SceneItemSchema,
  issues: z.array(ValidationIssueSchema).min(1),
  attempt: z.number().int().min(1).max(2),
});

// The repair model returns ONLY the patched scene (+ notes). We assemble the
// full RepairPatch envelope ourselves so the model can't mangle meta/targetIssues.
const RepairLLMOutputSchema = z.object({
  patchedScene: SceneItemSchema,
  notes: z.string().optional(),
});

export const repairStage = defineStage({
  name: 'repair',
  handler: 'llm',
  inputSchema: RepairInputSchema,
  outputSchema: RepairPatchSchema,
  async run(input, ctx) {
    const model = modelForStage(ctx.config, 'repair');

    const { data, model: usedModel } = await ctx.llm.complete({
      schemaName: 'RepairPatch',
      schema: RepairLLMOutputSchema,
      model,
      maxRetries: ctx.config.llmMaxRetries,
      system: prompt.system,
      user: prompt.buildUser({ videoId: input.videoId, sceneId: input.scene.id, sceneIndex: input.sceneIndex, attempt: input.attempt, scene: input.scene, issues: input.issues }),
      input,
    });

    return {
      meta: ctx.makeMeta('repair', 'RepairPatch', { producedBy: 'llm', model: usedModel, promptVersion: prompt.version, inputs: ['SceneItem', 'ValidationReport.issues'] }),
      videoId: input.videoId,
      sceneId: input.scene.id,
      sceneIndex: input.sceneIndex,
      attempt: input.attempt,
      targetIssues: input.issues,
      patchedScene: data.patchedScene,
      status: 'repaired' as const,
      unchangedGuarantee: true,
      notes: data.notes,
    };
  },
});
