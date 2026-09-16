/**
 * TTS stage tests (M1): mock provider determinism, ElevenLabs alignment
 * folding + request shape (fake fetch, no network), the content-addressed
 * cache, and the stage's per-clip failure isolation.
 */

import { describe, it, expect, afterAll } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { MockTTS } from '../core/tts/mock';
import { ElevenLabsTTS, alignmentToWordTimings } from '../core/tts/elevenlabs';
import { TTSCache } from '../core/tts';
import { TTSProviderError } from '../core/errors';
import { ttsStage } from '../stages/tts/generateTTS';
import { runStage } from '../core/stage';
import { loadConfig } from '../core/config';
import { createLogger } from '../core/logger';
import { ArtifactStore } from '../core/artifact-store';
import { createContext } from '../core/context';
import { MockLLMClient } from '../core/llm/mock';

const tmpRoot = path.join(os.tmpdir(), `km-tts-${Date.now()}`);
afterAll(async () => { await fs.rm(tmpRoot, { recursive: true, force: true }); });

const script = (videoId = 'video-1') => ({
  meta: { jobId: 'j', stage: 'script-generation', artifact: 'NarrationScript', schemaVersion: '1.0', producedBy: 'llm', createdAt: new Date().toISOString() },
  videoId,
  title: 'T',
  scenes: [
    { sceneId: 's1', order: 0, narration: 'First scene narration here.', onScreenText: ['First'], emphasisPhrases: [], estimatedDurationSeconds: 3 },
    { sceneId: 's2', order: 1, narration: 'Second scene, with a comma.', onScreenText: ['Second'], emphasisPhrases: [], estimatedDurationSeconds: 3 },
  ],
});

const makeCtx = (jobId: string, overrides: Record<string, unknown> = {}) => {
  const config = loadConfig({ provider: 'mock', artifactsDir: tmpRoot, logLevel: 'error', ttsCacheDir: path.join(tmpRoot, 'cache'), ...overrides } as any);
  const logger = createLogger(config.logLevel, { jobId });
  const store = new ArtifactStore(config.artifactsDir, jobId);
  return createContext({ jobId, config, logger, store, llm: new MockLLMClient() });
};

/** A fake ElevenLabs endpoint: returns 3 "words" with a deterministic alignment and a tiny payload. */
const fakeAlignmentResponse = (text: string) => {
  const chars = [...text];
  let t = 0;
  const starts: number[] = [];
  const ends: number[] = [];
  for (const ch of chars) {
    starts.push(t);
    t += ch === ' ' ? 0.05 : 0.08;
    ends.push(t);
  }
  return {
    audio_base64: Buffer.from(`AUDIO:${text}`).toString('base64'),
    alignment: { characters: chars, character_start_times_seconds: starts, character_end_times_seconds: ends },
  };
};

const fakeFetch = (calls: { url: string; init: RequestInit }[], status = 200): typeof fetch =>
  (async (url: any, init: any) => {
    calls.push({ url: String(url), init });
    const body = JSON.parse(init.body as string) as { text: string };
    return new Response(status === 200 ? JSON.stringify(fakeAlignmentResponse(body.text)) : 'nope', {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;

describe('MockTTS', () => {
  it('returns deterministic word timings and duration with no audio', async () => {
    const a = await new MockTTS().synthesize('Hello there, world.');
    const b = await new MockTTS().synthesize('Hello there, world.');
    expect(a).toEqual(b);
    expect(a.audio).toBeUndefined();
    expect(a.wordTimings.map((w) => w.word)).toEqual(['Hello', 'there,', 'world.']);
    expect(a.durationSeconds).toBeCloseTo(a.wordTimings.at(-1)!.endMs / 1000, 3);
  });
});

describe('ElevenLabsTTS', () => {
  it('folds character alignment into word timings', () => {
    const w = alignmentToWordTimings({
      characters: ['H', 'i', ' ', 'y', 'o', 'u', '!'],
      character_start_times_seconds: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
      character_end_times_seconds: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
    });
    expect(w).toEqual([
      { word: 'Hi', startMs: 0, endMs: 200 },
      { word: 'you!', startMs: 300, endMs: 700 },
    ]);
  });

  it('calls the with-timestamps endpoint with the API key and model, and decodes the audio', async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const tts = new ElevenLabsTTS({ apiKey: 'k', voiceId: 'voice-x', modelId: 'model-y', fetchImpl: fakeFetch(calls) });
    const r = await tts.synthesize('Hi you');
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('https://api.elevenlabs.io/v1/text-to-speech/voice-x/with-timestamps?output_format=mp3_44100_128');
    expect((calls[0].init.headers as any)['xi-api-key']).toBe('k');
    expect(JSON.parse(calls[0].init.body as string)).toEqual({ text: 'Hi you', model_id: 'model-y' });
    expect(r.audio?.toString()).toBe('AUDIO:Hi you');
    expect(r.audioExt).toBe('mp3');
    expect(r.wordTimings.map((w) => w.word)).toEqual(['Hi', 'you']);
    expect(r.durationSeconds).toBeGreaterThan(0.4);
    expect(r.voiceId).toBe('voice-x');
  });

  it('throws a TTSProviderError on non-2xx and when the key is missing', async () => {
    expect(() => new ElevenLabsTTS({ apiKey: '', voiceId: 'v', modelId: 'm' })).toThrow(TTSProviderError);
    const tts = new ElevenLabsTTS({ apiKey: 'k', voiceId: 'v', modelId: 'm', fetchImpl: fakeFetch([], 401) });
    await expect(tts.synthesize('x')).rejects.toBeInstanceOf(TTSProviderError);
  });
});

describe('TTSCache', () => {
  it('round-trips timings and audio bytes, keyed by scope + text', async () => {
    const cache = new TTSCache(path.join(tmpRoot, 'cache-unit'));
    const key = cache.key('elevenlabs|v|m', 'hello');
    expect(key).toBe(cache.key('elevenlabs|v|m', 'hello'));
    expect(key).not.toBe(cache.key('elevenlabs|v2|m', 'hello'));
    expect(await cache.get(key)).toBeUndefined();
    await cache.put(key, { audio: Buffer.from('bytes'), audioExt: 'mp3', durationSeconds: 1.5, wordTimings: [{ word: 'hello', startMs: 0, endMs: 1500 }], voiceId: 'v' });
    const hit = await cache.get(key);
    expect(hit?.cacheHit).toBe(true);
    expect(hit?.audio?.toString()).toBe('bytes');
    expect(hit?.durationSeconds).toBe(1.5);
    expect(hit?.wordTimings).toHaveLength(1);
  });
});

describe('ttsStage', () => {
  it('mock provider: one estimated clip per scene, in order, no audio files, no cache writes', async () => {
    const ctx = makeCtx('job-mock');
    const out = await runStage(ttsStage, { narrationScript: script() }, ctx);
    expect(out.provider).toBe('mock');
    expect(out.clips.map((c) => c.sceneId)).toEqual(['s1', 's2']);
    for (const c of out.clips) {
      expect(c.status).toBe('estimated');
      expect(c.audioPath).toBeUndefined();
      expect(c.durationSeconds).toBeGreaterThan(0);
      expect(c.wordTimings!.length).toBeGreaterThan(0);
    }
    await expect(fs.access(path.join(tmpRoot, 'cache'))).rejects.toThrow();
  });

  it('elevenlabs provider: writes audio under videos/<id>/audio, records timings, and serves the second run from cache', async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const realFetch = globalThis.fetch;
    globalThis.fetch = fakeFetch(calls);
    try {
      const ctx = makeCtx('job-el', { ttsProvider: 'elevenlabs', elevenLabsApiKey: 'k' });
      const out = await runStage(ttsStage, { narrationScript: script() }, ctx);
      expect(out.provider).toBe('elevenlabs');
      expect(calls).toHaveLength(2);
      for (const c of out.clips) {
        expect(c.status).toBe('generated');
        expect(c.cacheHit).toBe(false);
        expect(c.audioPath).toBe(path.join('videos', 'video-1', 'audio', `${c.sceneId}.mp3`));
        const bytes = await fs.readFile(path.join(ctx.store.jobDir, c.audioPath!));
        expect(bytes.toString()).toBe(`AUDIO:${c.narrationText}`);
      }

      const ctx2 = makeCtx('job-el-2', { ttsProvider: 'elevenlabs', elevenLabsApiKey: 'k' });
      const out2 = await runStage(ttsStage, { narrationScript: script() }, ctx2);
      expect(calls).toHaveLength(2); // no new provider calls
      expect(out2.clips.every((c) => c.cacheHit)).toBe(true);
      expect(out2.clips.map((c) => c.durationSeconds)).toEqual(out.clips.map((c) => c.durationSeconds));
      await fs.access(path.join(ctx2.store.jobDir, out2.clips[0].audioPath!)); // audio restored from cache
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  it('a failing provider call marks only that clip failed; the stage still succeeds', async () => {
    const realFetch = globalThis.fetch;
    let n = 0;
    globalThis.fetch = (async (url: any, init: any) => {
      n++;
      if (n === 1) return new Response('server error', { status: 500 });
      return fakeFetch([])(url, init);
    }) as typeof fetch;
    try {
      const ctx = makeCtx('job-partial', { ttsProvider: 'elevenlabs', elevenLabsApiKey: 'k', ttsCacheDir: path.join(tmpRoot, 'cache-partial') });
      const out = await runStage(ttsStage, { narrationScript: script('video-9') }, ctx);
      expect(out.clips[0].status).toBe('failed');
      expect(out.clips[0].error).toMatch(/HTTP 500/);
      expect(out.clips[1].status).toBe('generated');
    } finally {
      globalThis.fetch = realFetch;
    }
  });
});
