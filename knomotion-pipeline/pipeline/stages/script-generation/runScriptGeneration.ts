/**
 * Stage 4 — Script Generation (LLM).
 * VideoPlan -> NarrationScript. Narration is written first; visuals support it.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { modelForStage } from '../../core/config';
import { VideoPlanSchema } from '../../schemas/VideoPlan';
import { NarrationScriptSchema } from '../../schemas/NarrationScript';
import { scriptGenerationPrompt as prompt } from '../../prompts/script-generation';

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
      system: prompt.system,
      user: prompt.buildUser(input),
      input,
    });

    return {
      meta: ctx.makeMeta('script-generation', 'NarrationScript', { producedBy: 'llm', model: usedModel, promptVersion: prompt.version, inputs: ['VideoPlan'] }),
      ...data,
    };
  },
});
