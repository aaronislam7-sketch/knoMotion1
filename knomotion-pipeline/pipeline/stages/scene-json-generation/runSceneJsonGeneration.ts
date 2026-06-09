/**
 * Stage 5 — Scene JSON Generation (LLM, heavily constrained).
 * { VideoPlan + NarrationScript (+ capability manifest in P3) } -> KnoMotionVideoConfig.
 *
 * Output is the renderer coupling point — the ONLY artifact without a meta envelope.
 * NOTE (P0): the capability-manifest constraint and the strict compiler prompt land in P3.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { modelForStage } from '../../core/config';
import { VideoPlanSchema } from '../../schemas/VideoPlan';
import { NarrationScriptSchema } from '../../schemas/NarrationScript';
import { KnoMotionVideoConfigSchema } from '../../schemas/KnoMotionVideoConfig';
import { loadRendererCapabilities } from '../../core/capabilities/renderer-capabilities';
import { sceneJsonGenerationPrompt as prompt, summariseCapabilities } from '../../prompts/scene-json-generation';

export const SceneJsonInputSchema = z.object({
  videoPlan: VideoPlanSchema,
  narrationScript: NarrationScriptSchema,
});

export const sceneJsonGenerationStage = defineStage({
  name: 'scene-json-generation',
  handler: 'llm',
  inputSchema: SceneJsonInputSchema,
  outputSchema: KnoMotionVideoConfigSchema,
  async run(input, ctx) {
    const model = modelForStage(ctx.config, 'scene-json-generation');
    const caps = await loadRendererCapabilities();
    const system = prompt.buildSystem(summariseCapabilities(caps));

    const { data } = await ctx.llm.complete({
      schemaName: 'KnoMotionVideoConfig',
      schema: KnoMotionVideoConfigSchema,
      model,
      maxRetries: ctx.config.llmMaxRetries,
      system,
      user: prompt.buildUser(input),
      input,
    });

    // KnoMotionVideoConfig has no meta envelope — it is the renderer's props shape.
    return data;
  },
});
