/**
 * TTS entry point: provider factory + content-addressed cache.
 *
 * Cache key = sha256(provider cacheScope | narration text). A hit returns the
 * stored timings and audio bytes without touching the provider, so iterating
 * on prompts or re-running a job does not re-bill narration that hasn't changed.
 */

import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { PipelineConfig } from '../config';
import type { WordTiming } from '../../schemas/TTSManifest';
import { ElevenLabsTTS } from './elevenlabs';
import { MockTTS } from './mock';
import type { SynthesisResult, TTSProviderClient } from './provider';

export type { SynthesisResult, TTSProviderClient } from './provider';
export { MockTTS } from './mock';
export { ElevenLabsTTS, alignmentToWordTimings } from './elevenlabs';

export const createTTSProvider = (config: PipelineConfig): TTSProviderClient => {
  switch (config.ttsProvider) {
    case 'elevenlabs':
      return new ElevenLabsTTS({
        apiKey: config.elevenLabsApiKey ?? '',
        voiceId: config.elevenLabsVoiceId,
        modelId: config.elevenLabsModelId,
      });
    case 'mock':
    default:
      return new MockTTS();
  }
};

interface CachedClip {
  durationSeconds: number;
  wordTimings: WordTiming[];
  voiceId?: string;
  modelId?: string;
  audioExt?: string;
}

export class TTSCache {
  constructor(private readonly dir: string) {}

  key(scope: string, text: string): string {
    return createHash('sha256').update(`${scope}\n${text}`).digest('hex').slice(0, 32);
  }

  async get(key: string): Promise<(SynthesisResult & { cacheHit: true }) | undefined> {
    try {
      const meta = JSON.parse(await fs.readFile(path.join(this.dir, `${key}.json`), 'utf8')) as CachedClip;
      let audio: Buffer | undefined;
      if (meta.audioExt) {
        audio = await fs.readFile(path.join(this.dir, `${key}.${meta.audioExt}`));
      }
      return { ...meta, audio, cacheHit: true };
    } catch {
      return undefined;
    }
  }

  async put(key: string, result: SynthesisResult): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true });
    const meta: CachedClip = {
      durationSeconds: result.durationSeconds,
      wordTimings: result.wordTimings,
      voiceId: result.voiceId,
      modelId: result.modelId,
      audioExt: result.audio ? result.audioExt ?? 'mp3' : undefined,
    };
    if (result.audio) await fs.writeFile(path.join(this.dir, `${key}.${meta.audioExt}`), result.audio);
    await fs.writeFile(path.join(this.dir, `${key}.json`), JSON.stringify(meta), 'utf8');
  }
}
