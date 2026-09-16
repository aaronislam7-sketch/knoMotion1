/**
 * Repair write-back tests.
 *
 * The repaired config must be persisted over the Stage-5 artifact
 * (05-knomotion-video-config.json) so that the file on disk always matches the
 * final validation report. Uses validateAndRepair directly with a custom mock
 * repair builder that actually fixes the broken scene (the default mock echoes
 * the scene unchanged, which cannot exercise write-back).
 */

import { describe, it, expect, afterAll } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateAndRepair } from '../orchestrator';
import { loadConfig } from '../core/config';
import { createLogger } from '../core/logger';
import { ArtifactStore } from '../core/artifact-store';
import { createContext } from '../core/context';
import { MockLLMClient, DEFAULT_BUILDERS } from '../core/llm/mock';
import { KnoMotionVideoConfigSchema } from '../schemas/KnoMotionVideoConfig';

const tmpRoot = path.join(os.tmpdir(), `km-repair-writeback-${Date.now()}`);
afterAll(async () => { await fs.rm(tmpRoot, { recursive: true, force: true }); });

const CONFIG_ARTIFACT = '05-knomotion-video-config.json';

/** One-scene config whose only defect is beats.start >= beats.exit (a repairable validation error). */
const brokenConfig = () => KnoMotionVideoConfigSchema.parse({
  scenes: [
    {
      id: 's1',
      durationInFrames: 150,
      config: {
        background: { preset: 'sunriseGradient' },
        layout: { type: 'full' },
        slots: {
          full: {
            midScene: 'textReveal',
            config: { lines: [{ text: 'Hello', emphasis: 'high', beats: { start: 5, exit: 2 } }], beats: { start: 5, exit: 2 } },
          },
        },
      },
    },
  ],
  format: 'desktop',
});

const fixedScene = () => brokenConfig().scenes[0] && {
  ...brokenConfig().scenes[0],
  config: {
    ...brokenConfig().scenes[0].config,
    slots: {
      full: {
        midScene: 'textReveal',
        config: { lines: [{ text: 'Hello', emphasis: 'high', beats: { start: 0.3, exit: 4 } }], beats: { start: 0.3, exit: 4 } },
      },
    },
  },
};

const makeCtx = (jobId: string, repairBuilder: (input: any) => unknown) => {
  const config = loadConfig({ provider: 'mock', artifactsDir: tmpRoot, logLevel: 'error' });
  const logger = createLogger(config.logLevel, { jobId });
  const store = new ArtifactStore(config.artifactsDir, jobId);
  const llm = new MockLLMClient({ ...DEFAULT_BUILDERS, RepairPatch: repairBuilder });
  return createContext({ jobId, config, logger, store, llm });
};

describe('validateAndRepair — repaired config write-back', () => {
  it('persists the repaired config over the Stage-5 artifact when repair fixes a scene', async () => {
    const ctx = makeCtx('job-writeback', () => ({ patchedScene: fixedScene(), notes: 'fixed beats' }));
    const dir = ctx.store.videoDir('video-1');

    const { report, config, repairAttempts } = await validateAndRepair(ctx, 'video-1', brokenConfig(), dir);

    expect(report.valid).toBe(true);
    expect(report.status).toBe('passed');
    expect(repairAttempts).toBe(1);

    // The file on disk must be the repaired config, not the broken input.
    const onDisk = JSON.parse(await fs.readFile(path.join(ctx.store.jobDir, dir, CONFIG_ARTIFACT), 'utf8'));
    const beats = onDisk.scenes[0].config.slots.full.config.lines[0].beats;
    expect(beats).toEqual({ start: 0.3, exit: 4 });
    expect(onDisk).toEqual(JSON.parse(JSON.stringify(config)));

    // The write-back is recorded in the job manifest.
    const manifest = JSON.parse(await fs.readFile(path.join(ctx.store.jobDir, 'job.json'), 'utf8'));
    const entry = manifest.entries.find((e: any) => e.stage === 'repair' && e.artifact === CONFIG_ARTIFACT);
    expect(entry?.status).toBe('ok');
  });

  it('persists best-effort repairs even when the video ends as needs_review', async () => {
    // Repair "fixes" nothing useful: it returns a scene that still fails beat_timing.
    const stillBroken = { ...brokenConfig().scenes[0] };
    const ctx = makeCtx('job-needs-review', () => ({ patchedScene: stillBroken, notes: 'no-op' }));
    const dir = ctx.store.videoDir('video-1');

    const { report } = await validateAndRepair(ctx, 'video-1', brokenConfig(), dir);

    expect(report.valid).toBe(false);
    expect(report.status).toBe('needs_review');
    // The artifact still reflects the last working config (patches applied, still invalid).
    const onDisk = JSON.parse(await fs.readFile(path.join(ctx.store.jobDir, dir, CONFIG_ARTIFACT), 'utf8'));
    expect(Array.isArray(onDisk.scenes)).toBe(true);
  });

  it('re-applies computed timing to every repaired scene so repair cannot re-introduce timing drift', async () => {
    // The repair "fixes" the beats but also invents its own duration and beat values.
    const driftedScene = { ...fixedScene(), durationInFrames: 4321 };
    (driftedScene.config.slots.full.config as any).lines[0].beats = { start: 1.1, exit: 3.3 };
    const ctx = makeCtx('job-retime', () => ({ patchedScene: driftedScene, notes: 'fixed but drifted' }));
    const dir = ctx.store.videoDir('video-1');
    const timing = {
      meta: ctx.makeMeta('timing', 'SceneTiming', { producedBy: 'deterministic' }),
      videoId: 'video-1', fps: 30, totalDurationInFrames: 180,
      scenes: [{ sceneId: 's1', source: 'estimate' as const, durationInFrames: 180, durationSeconds: 6, narrationStart: 0.4, narrationEnd: 5.1, contentExit: 5.5, lineWindows: [{ text: 'Hello', start: 0.4, exit: 5.5 }] }],
    };

    const { report, config } = await validateAndRepair(ctx, 'video-1', brokenConfig(), dir, timing);

    expect(report.valid).toBe(true);
    expect(config.scenes[0].durationInFrames).toBe(180);
    const slot = (config.scenes[0].config.slots as any).full.config;
    expect(slot.beats).toEqual({ start: 0.4, exit: 5.5 });
    expect(slot.lines[0].beats).toEqual({ start: 0.4, exit: 5.5 });
    const onDisk = JSON.parse(await fs.readFile(path.join(ctx.store.jobDir, dir, CONFIG_ARTIFACT), 'utf8'));
    expect(onDisk.scenes[0].durationInFrames).toBe(180);
  });

  it('does not create the Stage-5 artifact when validation passes with no repair', async () => {
    const valid = KnoMotionVideoConfigSchema.parse({
      ...brokenConfig(),
      scenes: [fixedScene()],
    });
    const ctx = makeCtx('job-no-repair', () => { throw new Error('repair must not be called'); });
    const dir = ctx.store.videoDir('video-1');

    const { report, repairAttempts } = await validateAndRepair(ctx, 'video-1', valid, dir);

    expect(report.valid).toBe(true);
    expect(repairAttempts).toBe(0);
    // validateAndRepair does not own the initial Stage-5 write (runPipeline does),
    // so with zero patches applied it must not touch that artifact.
    await expect(fs.access(path.join(ctx.store.jobDir, dir, CONFIG_ARTIFACT))).rejects.toThrow();
  });
});
