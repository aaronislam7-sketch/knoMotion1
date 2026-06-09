/**
 * Stage 7 — Targeted Repair (LLM, only on validation failure).
 * { failed scene fragment + its validation issues } -> RepairPatch (patched scene).
 * Surgical: one scene, max 2 attempts (enforced by the orchestrator), then needs_review.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { modelForStage } from '../../core/config';
import { SceneItemSchema } from '../../schemas/KnoMotionVideoConfig';
import { ValidationIssueSchema } from '../../schemas/ValidationReport';
import { RepairPatchSchema } from '../../schemas/RepairPatch';

export const RepairInputSchema = z.object({
  videoId: z.string().min(1),
  sceneIndex: z.number().int().min(0),
  scene: SceneItemSchema,
  issues: z.array(ValidationIssueSchema).min(1),
  attempt: z.number().int().min(1).max(2),
});

const RepairPatchPayloadSchema = RepairPatchSchema.omit({ meta: true });

export const repairStage = defineStage({
  name: 'repair',
  handler: 'llm',
  inputSchema: RepairInputSchema,
  outputSchema: RepairPatchSchema,
  async run(input, ctx) {
    const model = modelForStage(ctx.config, 'repair');

    const { data, model: usedModel } = await ctx.llm.complete({
      schemaName: 'RepairPatch',
      schema: RepairPatchPayloadSchema,
      model,
      maxRetries: ctx.config.llmMaxRetries,
      system:
        'You are repairing invalid KnoMotion JSON. Only fix the listed validation errors. Do not change ' +
        'educational meaning. Do not change unrelated scenes. Return the patched scene only.',
      user: `Scene (index ${input.sceneIndex}):\n${JSON.stringify(input.scene, null, 2)}\n\nValidation errors:\n${JSON.stringify(input.issues, null, 2)}`,
      input,
    });

    return {
      meta: ctx.makeMeta('repair', 'RepairPatch', { producedBy: 'llm', model: usedModel, inputs: ['SceneItem', 'ValidationReport.issues'] }),
      ...data,
    };
  },
});
