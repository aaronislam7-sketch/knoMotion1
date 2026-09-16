/**
 * Stage 6 — Timing (deterministic).
 * { NarrationScript, TTSManifest } -> SceneTimingArtifact.
 *
 * Turns measured (or estimated) narration audio into the scene durations and
 * beat windows that Stage 7 must use. Pure computation lives in
 * core/timing.ts; this stage only pairs scenes with clips and writes the artifact.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { computeSceneTiming } from '../../core/timing';
import { FPS } from '../../core/fps';
import { NarrationScriptSchema } from '../../schemas/NarrationScript';
import { TTSManifestSchema } from '../../schemas/TTSManifest';
import { SceneTimingArtifactSchema } from '../../schemas/SceneTiming';

export const TimingInputSchema = z.object({
  narrationScript: NarrationScriptSchema,
  ttsManifest: TTSManifestSchema.optional(),
});

export const timingStage = defineStage({
  name: 'timing',
  handler: 'deterministic',
  inputSchema: TimingInputSchema,
  outputSchema: SceneTimingArtifactSchema,
  async run(input, ctx) {
    const clips = new Map((input.ttsManifest?.clips ?? []).map((c) => [c.sceneId, c]));
    const scenes = [...input.narrationScript.scenes]
      .sort((a, b) => a.order - b.order)
      .map((scene) => computeSceneTiming(scene, clips.get(scene.sceneId) ?? null, { fps: FPS }));

    const estimated = scenes.filter((s) => s.source === 'estimate').length;
    if (estimated > 0 && input.ttsManifest?.provider !== 'mock') {
      ctx.logger.warn('Some scenes are timed from word-count estimates, not audio', { videoId: input.narrationScript.videoId, estimated });
    }

    return {
      meta: ctx.makeMeta('timing', 'SceneTiming', {
        producedBy: 'deterministic',
        inputs: ['04-narration-script.json', '04a-tts-manifest.json'],
        notes: `${scenes.length - estimated}/${scenes.length} scenes timed from audio`,
      }),
      videoId: input.narrationScript.videoId,
      fps: FPS,
      totalDurationInFrames: scenes.reduce((sum, s) => sum + s.durationInFrames, 0),
      scenes,
    };
  },
});
