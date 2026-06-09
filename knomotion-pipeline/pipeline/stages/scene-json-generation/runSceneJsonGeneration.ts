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

    const { data } = await ctx.llm.complete({
      schemaName: 'KnoMotionVideoConfig',
      schema: KnoMotionVideoConfigSchema,
      model,
      maxRetries: ctx.config.llmMaxRetries,
      system:
        'You are a COMPILER, not a writer. Translate the approved scene plans + narration into valid ' +
        'KnoMotion scene JSON using ONLY the 11 canonical mid-scenes and documented keys. Do not invent ' +
        'components, add content, or rewrite the lesson. Output a single { scenes, format } object.',
      user: `VideoPlan:\n${JSON.stringify(input.videoPlan, null, 2)}\n\nNarrationScript:\n${JSON.stringify(input.narrationScript, null, 2)}`,
      input,
    });

    // KnoMotionVideoConfig has no meta envelope — it is the renderer's props shape.
    return data;
  },
});
