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
import { videoPlanningPrompt as prompt } from '../../prompts/video-planning';

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
      system: prompt.system,
      user: prompt.buildUser(input),
      input,
    });

    return {
      meta: ctx.makeMeta('video-planning', 'VideoPlan', { producedBy: 'llm', model: usedModel, promptVersion: prompt.version, inputs: ['ModulePlan.VideoBrief', 'ContentMap.concepts'] }),
      ...data,
    };
  },
});
