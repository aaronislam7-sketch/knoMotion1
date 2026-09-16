/**
 * Stage 7 — Scene JSON Generation (LLM, heavily constrained).
 * { VideoPlan + NarrationScript + SceneTiming + capability manifest } -> KnoMotionVideoConfig.
 *
 * Output is the renderer coupling point — the ONLY artifact without a meta envelope.
 *
 * The LLM decides WHAT is on screen; timing is a fixed input. After the model
 * responds, applyTimingToConfig overwrites `durationInFrames` and every `beats`
 * block with the Stage-6 values, so the artifact on disk is deterministic in
 * time regardless of what the model wrote.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { modelForStage } from '../../core/config';
import { applyTimingToConfig } from '../../core/timing';
import { VideoPlanSchema } from '../../schemas/VideoPlan';
import { NarrationScriptSchema } from '../../schemas/NarrationScript';
import { SceneTimingArtifactSchema } from '../../schemas/SceneTiming';
import { KnoMotionVideoConfigSchema } from '../../schemas/KnoMotionVideoConfig';
import { loadRendererCapabilities } from '../../core/capabilities/renderer-capabilities';
import { sceneJsonGenerationPrompt as prompt, summariseCapabilities } from '../../prompts/scene-json-generation';

export const SceneJsonInputSchema = z.object({
  videoPlan: VideoPlanSchema,
  narrationScript: NarrationScriptSchema,
  /** Optional so the stage can still be exercised standalone; the orchestrator always supplies it. */
  sceneTiming: SceneTimingArtifactSchema.optional(),
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

    if (!input.sceneTiming) return data;

    const timed = applyTimingToConfig(data, input.sceneTiming.scenes, { fps: input.sceneTiming.fps });
    // Re-parse so the artifact is exactly what the contract accepts after the overwrite.
    return KnoMotionVideoConfigSchema.parse(timed);
  },
});
