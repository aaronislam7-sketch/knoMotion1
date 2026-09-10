/** TTS provider contract. One implementation per vendor plus the offline mock. */

import type { WordTiming } from '../../schemas/TTSManifest';

export interface SynthesisResult {
  /** Encoded audio bytes. Absent for the mock provider (timings only). */
  audio?: Buffer;
  /** File extension for `audio`, e.g. "mp3". */
  audioExt?: string;
  durationSeconds: number;
  wordTimings: WordTiming[];
  voiceId?: string;
  modelId?: string;
}

export interface TTSProviderClient {
  readonly name: 'elevenlabs' | 'mock';
  /** Stable identity of the voice+model; part of the cache key. */
  readonly cacheScope: string;
  synthesize(text: string): Promise<SynthesisResult>;
}
