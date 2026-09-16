/**
 * MockTTS — offline, deterministic. Produces no audio; synthesises word
 * timings from word count (~2.5 wps with punctuation pauses) so the whole
 * chain, including timing, runs identically in tests and without an API key.
 */

import { estimateWordTimings } from '../timing';
import type { SynthesisResult, TTSProviderClient } from './provider';

export class MockTTS implements TTSProviderClient {
  readonly name = 'mock' as const;
  readonly cacheScope = 'mock';

  constructor(private readonly wordsPerSecond = 2.5) {}

  async synthesize(text: string): Promise<SynthesisResult> {
    const wordTimings = estimateWordTimings(text, this.wordsPerSecond);
    const durationSeconds = wordTimings.length ? wordTimings[wordTimings.length - 1].endMs / 1000 : 0;
    return { durationSeconds, wordTimings, voiceId: 'mock-voice' };
  }
}
