import { describe, it, expect, afterAll } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runPipeline } from '../orchestrator';
import { DEFAULT_TIMING_OPTIONS } from '../core/timing';

const tmpRoot = path.join(os.tmpdir(), `km-run-${Date.now()}`);
const publicDir = path.join(tmpRoot, 'public');
afterAll(async () => { await fs.rm(tmpRoot, { recursive: true, force: true }); });

const baseConfig = { provider: 'mock' as const, artifactsDir: tmpRoot, logLevel: 'error' as const, publicDir, ttsCacheDir: path.join(tmpRoot, 'cache') };

describe('runPipeline (mock provider, end-to-end)', () => {
  it('runs intake -> ... -> assembly and produces a renderable, passing video timed from narration', async () => {
    const result = await runPipeline(
      { inputType: 'markdown', text: 'Spaced repetition schedules reviews at increasing intervals.', title: 'Spaced Repetition' },
      { config: baseConfig },
    );

    expect(result.videos.length).toBeGreaterThan(0);
    const v = result.videos[0];
    expect(v.valid).toBe(true);
    expect(v.status).toBe('passed');
    expect(v.narrationClips).toBe(0); // mock TTS produces no audio

    // Full artifact trail exists, including the M1 stages.
    for (const f of ['00-source-bundle.json', '01-content-map.json', '02-module-plan.json', 'job.json']) {
      expect(await exists(path.join(result.jobDir, f))).toBe(true);
    }
    const videoDir = path.dirname(v.configPath);
    for (const f of ['03-video-plan.json', '04-narration-script.json', '04a-tts-manifest.json', '04b-scene-timing.json', '05-knomotion-video-config.json', '06-validation-report.json', '08-render-manifest.json']) {
      expect(await exists(path.join(videoDir, f)), f).toBe(true);
    }

    // Every scene's duration and beats come from the timing artifact, not the LLM.
    const cfg = JSON.parse(await fs.readFile(v.configPath, 'utf8'));
    const timing = JSON.parse(await fs.readFile(path.join(videoDir, '04b-scene-timing.json'), 'utf8'));
    const tts = JSON.parse(await fs.readFile(path.join(videoDir, '04a-tts-manifest.json'), 'utf8'));
    expect(cfg.scenes.length).toBe(timing.scenes.length);
    expect(v.durationInFrames).toBe(timing.totalDurationInFrames);
    cfg.scenes.forEach((scene: any, i: number) => {
      const t = timing.scenes[i];
      const clip = tts.clips.find((c: any) => c.sceneId === scene.id);
      expect(scene.id).toBe(t.sceneId);
      expect(scene.durationInFrames).toBe(t.durationInFrames);
      expect(t.durationInFrames / 30).toBeGreaterThanOrEqual(clip.durationSeconds + DEFAULT_TIMING_OPTIONS.leadInSeconds + DEFAULT_TIMING_OPTIONS.tailSeconds - 0.04);
      expect(scene.audio).toBeUndefined();
      for (const item of Object.values(scene.config.slots) as any[]) {
        const beats = item.config.beats;
        expect(beats.start).toBeGreaterThanOrEqual(t.narrationStart);
        expect(beats.exit).toBe(t.contentExit);
        expect(beats.exit).toBeLessThan(t.durationSeconds);
        for (const line of item.config.lines ?? []) {
          expect(line.beats.start).toBeGreaterThanOrEqual(beats.start);
          expect(line.beats.start).toBeLessThan(line.beats.exit);
        }
      }
    });

    // job.json records the new stages.
    const manifest = JSON.parse(await fs.readFile(path.join(result.jobDir, 'job.json'), 'utf8'));
    const stages = manifest.entries.map((e: any) => e.stage);
    for (const s of ['tts', 'timing', 'scene-json-generation', 'validation', 'assembly']) expect(stages).toContain(s);
  });

  it('with a TTS provider that returns audio, assembly copies clips into publicDir and wires audio.narration', async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async (_url: any, init: any) => {
      const { text } = JSON.parse(init.body as string) as { text: string };
      const chars = [...text];
      const starts = chars.map((_, i) => i * 0.06);
      const ends = chars.map((_, i) => (i + 1) * 0.06);
      return new Response(JSON.stringify({
        audio_base64: Buffer.from(`AUDIO:${text}`).toString('base64'),
        alignment: { characters: chars, character_start_times_seconds: starts, character_end_times_seconds: ends },
      }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as typeof fetch;

    try {
      const result = await runPipeline(
        { inputType: 'text', text: 'Photosynthesis converts light into chemical energy.' },
        { config: { ...baseConfig, ttsProvider: 'elevenlabs', elevenLabsApiKey: 'test-key' } },
      );
      const v = result.videos[0];
      expect(v.valid).toBe(true);
      const cfg = JSON.parse(await fs.readFile(v.configPath, 'utf8'));
      expect(v.narrationClips).toBe(cfg.scenes.length);
      const timing = JSON.parse(await fs.readFile(path.join(path.dirname(v.configPath), '04b-scene-timing.json'), 'utf8'));
      expect(timing.scenes.every((s: any) => s.source === 'tts')).toBe(true);

      for (const scene of cfg.scenes) {
        const src: string = scene.audio.narration.src;
        expect(src).toBe(`pipeline-audio/${result.jobId}/${v.videoId}/${scene.id}.mp3`);
        expect(scene.audio.narration.startFromSeconds).toBe(DEFAULT_TIMING_OPTIONS.leadInSeconds);
        const bytes = await fs.readFile(path.join(publicDir, src));
        expect(bytes.toString().startsWith('AUDIO:')).toBe(true);
      }

      // The render manifest carries the same assembled props.
      const rm = JSON.parse(await fs.readFile(path.join(path.dirname(v.configPath), '08-render-manifest.json'), 'utf8'));
      expect(rm.compositionId).toBe('KnoMotionVideo');
      expect(rm.props).toEqual(cfg);
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  it('stop-after halts at the named stage', async () => {
    const result = await runPipeline(
      { inputType: 'text', text: 'Photosynthesis converts light into chemical energy.' },
      { config: baseConfig, stopAfter: 'module-planning' },
    );
    expect(result.videos).toHaveLength(0);
    expect(await exists(path.join(result.jobDir, '02-module-plan.json'))).toBe(true);
  });

  it('stop-after timing produces the timing artifact but no scene JSON', async () => {
    const result = await runPipeline(
      { inputType: 'text', text: 'Photosynthesis converts light into chemical energy.' },
      { config: baseConfig, stopAfter: 'timing' },
    );
    expect(result.videos).toHaveLength(0);
    const videos = await fs.readdir(path.join(result.jobDir, 'videos'));
    expect(videos.length).toBeGreaterThan(0);
    expect(await exists(path.join(result.jobDir, 'videos', videos[0], '04b-scene-timing.json'))).toBe(true);
    expect(await exists(path.join(result.jobDir, 'videos', videos[0], '05-knomotion-video-config.json'))).toBe(false);
  });
});

const exists = async (p: string) => fs.access(p).then(() => true).catch(() => false);
