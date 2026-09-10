/**
 * Stage 11 — Assembly (deterministic).
 * { KnoMotionVideoConfig + TTSManifest + SceneTiming } -> RenderManifest.
 *
 * Pure merge — no LLM. Copies each generated narration clip into the
 * renderer's public dir and attaches it to its scene as `audio.narration`
 * (a public-dir-relative path the renderer resolves with staticFile()).
 * Scenes whose clip has no audio (mock/estimated/failed) get no audio block.
 *
 * The orchestrator writes the assembled `props` back over
 * 05-knomotion-video-config.json so `preview` and `render` both see the audio.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { KnoMotionVideoConfigSchema, type SceneItem } from '../../schemas/KnoMotionVideoConfig';
import { TTSManifestSchema } from '../../schemas/TTSManifest';
import { SceneTimingArtifactSchema } from '../../schemas/SceneTiming';
import { RenderManifestSchema } from '../../schemas/RenderManifest';

/** Sub-directory of the renderer's public dir that assembly owns. Gitignored at the repo root. */
export const PUBLIC_AUDIO_DIR = 'pipeline-audio';

export const AssemblyInputSchema = z.object({
  videoId: z.string().min(1),
  config: KnoMotionVideoConfigSchema,
  ttsManifest: TTSManifestSchema.optional(),
  sceneTiming: SceneTimingArtifactSchema.optional(),
});

export const assemblyStage = defineStage({
  name: 'assembly',
  handler: 'deterministic',
  inputSchema: AssemblyInputSchema,
  outputSchema: RenderManifestSchema,
  async run(input, ctx) {
    const clips = new Map((input.ttsManifest?.clips ?? []).map((c) => [c.sceneId, c]));
    const timings = new Map((input.sceneTiming?.scenes ?? []).map((t) => [t.sceneId, t]));
    const relDir = path.posix.join(PUBLIC_AUDIO_DIR, ctx.jobId, input.videoId);
    const absDir = path.join(ctx.config.publicDir, relDir);

    let attached = 0;
    const scenes: SceneItem[] = [];
    for (const scene of input.config.scenes) {
      const clip = clips.get(scene.id);
      if (!clip || clip.status !== 'generated' || !clip.audioPath) {
        // Never carry a stale/foreign audio block into the deliverable.
        const { audio: _dropped, ...rest } = scene;
        scenes.push(rest as SceneItem);
        continue;
      }
      const source = path.join(ctx.store.jobDir, clip.audioPath);
      const fileName = path.basename(clip.audioPath);
      await fs.mkdir(absDir, { recursive: true });
      await fs.copyFile(source, path.join(absDir, fileName));
      attached++;

      scenes.push({
        ...scene,
        audio: {
          ...(scene.audio ?? {}),
          narration: {
            src: path.posix.join(relDir, fileName),
            startFromSeconds: timings.get(scene.id)?.narrationStart ?? 0,
            volume: 1,
          },
        },
      });
    }

    ctx.logger.info('Assembly complete', { videoId: input.videoId, narrationClips: attached, publicDir: absDir });

    return {
      meta: ctx.makeMeta('assembly', 'RenderManifest', {
        producedBy: 'deterministic',
        inputs: ['05-knomotion-video-config.json', '04a-tts-manifest.json', '04b-scene-timing.json'],
        notes: `${attached}/${scenes.length} scenes have narration audio`,
      }),
      videoId: input.videoId,
      compositionId: 'KnoMotionVideo' as const,
      format: input.config.format ?? 'desktop',
      props: { ...input.config, scenes },
    };
  },
});
