/**
 * Stage 5 — TTS Generation (deterministic provider call).
 * { NarrationScript } -> TTSManifest (+ audio files under videos/<id>/audio/).
 *
 * One provider call per scene. A failed clip does not fail the stage: it is
 * recorded as `failed` and Stage 6 (timing) falls back to a word-count
 * estimate for that scene, so a transient provider error costs one scene's
 * audio, not the whole video.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { createTTSProvider, TTSCache } from '../../core/tts';
import { NarrationScriptSchema } from '../../schemas/NarrationScript';
import { TTSManifestSchema, type TTSClip } from '../../schemas/TTSManifest';

export const TTSInputSchema = z.object({
  narrationScript: NarrationScriptSchema,
});

export const ttsStage = defineStage({
  name: 'tts',
  handler: 'deterministic',
  inputSchema: TTSInputSchema,
  outputSchema: TTSManifestSchema,
  async run(input, ctx) {
    const script = input.narrationScript;
    const provider = createTTSProvider(ctx.config);
    // The mock is free and instant; only real providers are worth caching.
    const cache = provider.name === 'mock' ? undefined : new TTSCache(ctx.config.ttsCacheDir);
    const audioDir = path.join(ctx.store.videoDir(script.videoId), 'audio');

    const clips: TTSClip[] = [];
    for (const scene of [...script.scenes].sort((a, b) => a.order - b.order)) {
      const text = scene.narration.trim();
      const key = cache?.key(provider.cacheScope, text);
      try {
        const cached = cache && key ? await cache.get(key) : undefined;
        const result = cached ?? (await provider.synthesize(text));
        if (!cached && cache && key) await cache.put(key, result);

        let audioPath: string | undefined;
        if (result.audio) {
          audioPath = path.join(audioDir, `${scene.sceneId}.${result.audioExt ?? 'mp3'}`);
          const abs = path.join(ctx.store.jobDir, audioPath);
          await fs.mkdir(path.dirname(abs), { recursive: true });
          await fs.writeFile(abs, result.audio);
        }

        clips.push({
          sceneId: scene.sceneId,
          narrationText: text,
          status: result.audio ? 'generated' : 'estimated',
          audioPath,
          durationSeconds: result.durationSeconds,
          voiceId: result.voiceId,
          cacheHit: Boolean(cached),
          wordTimings: result.wordTimings,
        });
        ctx.logger.debug('tts clip ready', { sceneId: scene.sceneId, cacheHit: Boolean(cached), seconds: result.durationSeconds });
      } catch (err) {
        ctx.logger.warn('tts clip failed; timing will use the script estimate', { sceneId: scene.sceneId, error: (err as Error).message });
        clips.push({ sceneId: scene.sceneId, narrationText: text, status: 'failed', error: (err as Error).message });
      }
    }

    return {
      meta: ctx.makeMeta('tts', 'TTSManifest', {
        producedBy: 'deterministic',
        inputs: ['04-narration-script.json'],
        notes: `provider=${provider.name}; ${clips.filter((c) => c.status === 'generated').length}/${clips.length} clips with audio`,
      }),
      videoId: script.videoId,
      provider: provider.name,
      defaultVoiceId: provider.name === 'elevenlabs' ? ctx.config.elevenLabsVoiceId : undefined,
      modelId: provider.name === 'elevenlabs' ? ctx.config.elevenLabsModelId : undefined,
      clips,
    };
  },
});
