/**
 * Stage 4 — Script Generation (LLM).
 * VideoPlan -> NarrationScript. Narration is written first; visuals support it.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { modelForStage } from '../../core/config';
import { VideoPlanSchema } from '../../schemas/VideoPlan';
import { NarrationScriptSchema } from '../../schemas/NarrationScript';

export const ScriptGenerationInputSchema = z.object({ videoPlan: VideoPlanSchema });

const NarrationScriptPayloadSchema = NarrationScriptSchema.omit({ meta: true });

export const scriptGenerationStage = defineStage({
  name: 'script-generation',
  handler: 'llm',
  inputSchema: ScriptGenerationInputSchema,
  outputSchema: NarrationScriptSchema,
  async run(input, ctx) {
    const model = modelForStage(ctx.config, 'script-generation');

    const { data, model: usedModel } = await ctx.llm.complete({
      schemaName: 'NarrationScript',
      schema: NarrationScriptPayloadSchema,
      model,
      maxRetries: ctx.config.llmMaxRetries,
      system:
        'You write per-scene narration BEFORE any scene JSON exists. Produce the spoken script plus the ' +
        'on-screen text and emphasis phrases. One narration block per planned scene, aligned by sceneId.',
      user: `Write narration for this VideoPlan:\n${JSON.stringify(input.videoPlan, null, 2)}`,
      input,
    });

    return {
      meta: ctx.makeMeta('script-generation', 'NarrationScript', { producedBy: 'llm', model: usedModel, inputs: ['VideoPlan'] }),
      ...data,
    };
  },
});
