/**
 * Stage 3 — Video Narrative Planning (LLM, one call per video).
 * { VideoBrief + relevant concepts } -> VideoPlan. A planning object, not KnoMotion JSON.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { modelForStage } from '../../core/config';
import { ConceptSchema } from '../../schemas/ContentMap';
import { VideoBriefSchema } from '../../schemas/ModulePlan';
import { VideoPlanSchema } from '../../schemas/VideoPlan';

export const VideoPlanningInputSchema = z.object({
  brief: VideoBriefSchema,
  concepts: z.array(ConceptSchema).describe('Only the concepts this video references'),
});

const VideoPlanPayloadSchema = VideoPlanSchema.omit({ meta: true });

export const videoPlanningStage = defineStage({
  name: 'video-planning',
  handler: 'llm',
  inputSchema: VideoPlanningInputSchema,
  outputSchema: VideoPlanSchema,
  async run(input, ctx) {
    const model = modelForStage(ctx.config, 'video-planning');

    const { data, model: usedModel } = await ctx.llm.complete({
      schemaName: 'VideoPlan',
      schema: VideoPlanPayloadSchema,
      model,
      maxRetries: ctx.config.llmMaxRetries,
      system:
        'You design the teaching flow for ONE video: narrative arc and an ordered scene sequence with ' +
        'visual intent and suggested mid-scene types. Suggestions are advisory; do not emit KnoMotion JSON.',
      user: `Plan video "${input.brief.title}".\nBrief:\n${JSON.stringify(input.brief, null, 2)}\nConcepts:\n${JSON.stringify(input.concepts, null, 2)}`,
      input,
    });

    return {
      meta: ctx.makeMeta('video-planning', 'VideoPlan', { producedBy: 'llm', model: usedModel, inputs: ['ModulePlan.VideoBrief', 'ContentMap.concepts'] }),
      ...data,
    };
  },
});
