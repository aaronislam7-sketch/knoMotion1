import { describe, it, expect, afterAll } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runPipeline } from '../orchestrator';

const tmpRoot = path.join(os.tmpdir(), `km-run-${Date.now()}`);
afterAll(async () => { await fs.rm(tmpRoot, { recursive: true, force: true }); });

describe('runPipeline (mock provider, end-to-end)', () => {
  it('runs intake -> ... -> validation and produces a renderable, passing video', async () => {
    const result = await runPipeline(
      { inputType: 'markdown', text: 'Spaced repetition schedules reviews at increasing intervals.', title: 'Spaced Repetition' },
      { config: { provider: 'mock', artifactsDir: tmpRoot, logLevel: 'error' } },
    );

    expect(result.videos.length).toBeGreaterThan(0);
    const v = result.videos[0];
    expect(v.valid).toBe(true);
    expect(v.status).toBe('passed');

    // Full artifact trail exists
    for (const f of ['00-source-bundle.json', '01-content-map.json', '02-module-plan.json', 'job.json']) {
      expect(await exists(path.join(result.jobDir, f))).toBe(true);
    }
    const cfg = JSON.parse(await fs.readFile(v.configPath, 'utf8'));
    expect(Array.isArray(cfg.scenes)).toBe(true);
    expect(cfg.scenes.length).toBeGreaterThan(0);
  });

  it('stop-after halts at the named stage', async () => {
    const result = await runPipeline(
      { inputType: 'text', text: 'Photosynthesis converts light into chemical energy.' },
      { config: { provider: 'mock', artifactsDir: tmpRoot, logLevel: 'error' }, stopAfter: 'module-planning' },
    );
    expect(result.videos).toHaveLength(0);
    expect(await exists(path.join(result.jobDir, '02-module-plan.json'))).toBe(true);
  });
});

const exists = async (p: string) => fs.access(p).then(() => true).catch(() => false);
