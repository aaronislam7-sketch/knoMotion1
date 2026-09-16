/**
 * Stage 9 render-check + M2 acceptance fixtures (Sept M2).
 *
 * Two layers:
 *
 *  1. Always-on: mergeRenderCheck folds stills findings into the validation
 *     report; the validation-caught half of the M2 acceptance set (oversized
 *     line, orphaned slot, out-of-range beat, alias key) fails Stage 8.
 *
 *  2. Rendered (KNOMOTION_RENDER_TESTS=1): bundles the Remotion project, renders
 *     real stills and asserts the pixel checks catch the render-caught half of
 *     the acceptance set (blank slot from a bad heroRef, content appearing too
 *     late, items overflowing into the safe band) while a healthy scene and the
 *     TD-002 mask+up scene render visibly. Also drives validateAndRepair with
 *     render-check on so a blank slot is repaired like any rule failure.
 *
 *     Run from knomotion-pipeline/:  KNOMOTION_RENDER_TESTS=1 npx vitest run render-check
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadConfig } from '../core/config';
import { createLogger } from '../core/logger';
import { ArtifactStore } from '../core/artifact-store';
import { createContext } from '../core/context';
import { MockLLMClient, DEFAULT_BUILDERS } from '../core/llm/mock';
import { runStage } from '../core/stage';
import { isRendererAvailable } from '../core/render/still-renderer';
import { loadRendererCapabilities, type RendererCapabilities } from '../core/capabilities/renderer-capabilities';
import { validateConfig } from '../stages/validation/validate';
import { renderCheckStage } from '../stages/render-check/runRenderCheck';
import { mergeRenderCheck, validateAndRepair, QUALITY_ARTIFACT, STILLS_DIR } from '../orchestrator';
import { KnoMotionVideoConfigSchema, type KnoMotionVideoConfig } from '../schemas/KnoMotionVideoConfig';
import type { ValidationReport } from '../schemas/ValidationReport';
import type { QualityReport } from '../schemas/QualityReport';

const RENDER = process.env.KNOMOTION_RENDER_TESTS === '1' && isRendererAvailable();
const tmpRoot = path.join(os.tmpdir(), `km-render-check-${Date.now()}`);
afterAll(async () => { await fs.rm(tmpRoot, { recursive: true, force: true }); });

// ---------------------------------------------------------------------------
// Fixtures — one deliberately broken scene per guardrail
// ---------------------------------------------------------------------------

const beats = { start: 0.8, exit: 5.4 };
const scene = (id: string, slots: Record<string, unknown>, layout: Record<string, unknown> = { type: 'full' }, durationInFrames = 180) => ({
  id, durationInFrames, config: { background: { preset: 'cleanCard' }, layout, slots },
});
const textReveal = (texts: string[], b = beats) => ({
  midScene: 'textReveal',
  config: { lines: texts.map((text) => ({ text, beats: b })), revealType: 'fade', beats: b },
});

/** Renders one visible line. Passes validation and render-check. */
const healthy = () => scene('healthy', { full: textReveal(['A perfectly ordinary line']) });

/** TD-002: mask + direction up produced an empty clip-path before the engine fix. Must render visibly now. */
const maskUp = () => scene('mask-up', {
  full: { midScene: 'textReveal', config: { lines: [{ text: 'Mask reveal, upwards', beats }], revealType: 'mask', direction: 'up', beats } },
});

/** Render-caught: a lottie key that is not in the registry renders nothing (lottie_key is only a warning). */
const blankLottie = () => scene('blank-lottie', {
  full: { midScene: 'heroText', config: { heroType: 'lottie', heroRef: 'no-such-lottie', beats } },
});

/** Render-caught: a broken image URL renders only alt text. */
const blankImage = () => scene('blank-image', {
  full: { midScene: 'heroText', config: { heroType: 'image', heroRef: 'https://example.invalid/missing.png', beats } },
});

/** Render-caught: the only line appears at 5.0s of a 7s scene — valid beats, blank for most of the narration. */
const lateLines = () => scene('late-lines', {
  full: { midScene: 'textReveal', config: { lines: [{ text: 'Shows up far too late', beats: { start: 5.0, exit: 6.6 } }], revealType: 'fade', beats: { start: 0.5, exit: 6.6 } } },
}, { type: 'full' }, 210);

/** Render-caught (off-screen text): ten checklist items in a header+2-column slot run off the bottom edge. */
const overflowBottom = () => scene('overflow-bottom', {
  header: textReveal(['Ten things'], { start: 0.5, exit: 5.4 }),
  col1: { midScene: 'checklist', config: { items: ['First very long checklist item that goes on', 'Second very long checklist item that goes on', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'].map((text) => ({ text })), beats } },
  col2: { midScene: 'bigNumber', config: { number: '1,000,000,000,000', label: 'A label that is also fairly long for a column', beats } },
}, { type: 'headerRowColumns', options: { columns: 2 } });

const config = (...scenes: unknown[]): KnoMotionVideoConfig => KnoMotionVideoConfigSchema.parse({ scenes, format: 'desktop' });

// ---------------------------------------------------------------------------
// Always-on
// ---------------------------------------------------------------------------

describe('mergeRenderCheck', () => {
  const passing: ValidationReport = {
    meta: { jobId: 'j', stage: 'validation', artifact: 'ValidationReport', schemaVersion: '1.0', producedBy: 'deterministic', createdAt: new Date().toISOString() },
    videoId: 'v', status: 'passed', valid: true, sceneCount: 1, rulesChecked: ['schema'], errors: [], warnings: [], repairAttempts: 0,
  };
  const quality = (issues: QualityReport['renderCheck'] extends infer R ? (R extends { issues: infer I } ? I : never) : never, status: 'passed' | 'failed' | 'skipped'): QualityReport => ({
    meta: { ...passing.meta, stage: 'render-check', artifact: 'QualityReport' },
    videoId: 'v', humanEdits: [], fineTuneCandidate: false,
    renderCheck: { status, scale: 0.5, framesPerScene: 3, thresholds: { pixelTolerance: 28, blankMinPixels: 1500, edgeBleedMaxCoverage: 0.002 }, scenes: [], issues },
  });

  it('turns a passing report into failed when stills report an error, and declares the rules', () => {
    const merged = mergeRenderCheck(passing, quality([
      { rule: 'blank_slot', severity: 'error', path: 'scenes[0].config.slots.full', sceneIndex: 0, sceneId: 's', message: 'blank' },
      { rule: 'edge_bleed', severity: 'warning', path: 'scenes[0].config.slots.full', sceneIndex: 0, sceneId: 's', message: 'bleed' },
    ], 'failed'));
    expect(merged.valid).toBe(false);
    expect(merged.status).toBe('failed');
    expect(merged.errors.map((e) => e.rule)).toEqual(['blank_slot']);
    expect(merged.warnings.map((e) => e.rule)).toEqual(['edge_bleed']);
    expect(merged.rulesChecked).toEqual(expect.arrayContaining(['schema', 'blank_slot', 'edge_bleed']));
  });

  it('leaves the report untouched when render-check was skipped', () => {
    expect(mergeRenderCheck(passing, quality([], 'skipped'))).toEqual(passing);
  });
});

describe('M2 acceptance — validation-caught fixtures fail Stage 8', () => {
  let caps: RendererCapabilities;
  beforeAll(async () => { caps = await loadRendererCapabilities(); });
  const errorRules = (c: unknown) => new Set(validateConfig(c as any, caps).filter((i) => i.severity === 'error').map((i) => i.rule));

  it('oversized line → text_budget', () => {
    const c = config(scene('oversized', { full: textReveal(['This single line is far, far longer than any full-width slot could ever show at the text reveal font size without wrapping or shrinking']) }));
    expect(errorRules(c)).toContain('text_budget');
  });

  it('orphaned slot → slot_layout_reconcile', () => {
    const c = config(scene('orphan', { col1: textReveal(['One']), col2: textReveal(['Two']), col3: textReveal(['Three']) }, { type: 'columnSplit', options: { columns: 2 } }));
    expect(errorRules(c)).toContain('slot_layout_reconcile');
  });

  it('out-of-range beat → beat_timing', () => {
    const c = config(scene('late-beat', { full: textReveal(['Hello'], { start: 0.5, exit: 40 }) }));
    expect(errorRules(c)).toContain('beat_timing');
  });

  it('alias mid-scene key → rejected by the contract (TD-004a)', () => {
    const parsed = KnoMotionVideoConfigSchema.safeParse({ scenes: [scene('alias', { full: { ...textReveal(['Hi']), midScene: 'textRevealSequence' } })], format: 'desktop' });
    expect(parsed.success).toBe(false);
  });

  it('the render-caught fixtures pass Stage 8 (so only render-check can catch them)', () => {
    for (const s of [blankLottie(), blankImage(), lateLines()]) {
      const errors = validateConfig(config(s) as any, caps).filter((i) => i.severity === 'error');
      expect(errors, `${s.id}: ${JSON.stringify(errors)}`).toHaveLength(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Rendered (opt-in)
// ---------------------------------------------------------------------------

const makeCtx = (jobId: string, repairBuilder?: (input: any) => unknown) => {
  const cfg = loadConfig({ provider: 'mock', artifactsDir: tmpRoot, logLevel: 'error', renderCheck: 'on' });
  const logger = createLogger(cfg.logLevel, { jobId });
  const store = new ArtifactStore(cfg.artifactsDir, jobId);
  const llm = new MockLLMClient(repairBuilder ? { ...DEFAULT_BUILDERS, RepairPatch: repairBuilder } : DEFAULT_BUILDERS);
  return createContext({ jobId, config: cfg, logger, store, llm });
};

describe.skipIf(!RENDER)('render-check on real stills (KNOMOTION_RENDER_TESTS=1)', () => {
  let report: QualityReport;
  const fixtures = [healthy(), maskUp(), blankLottie(), blankImage(), lateLines(), overflowBottom()];

  beforeAll(async () => {
    const ctx = makeCtx('job-render-check');
    report = await runStage(renderCheckStage, { videoId: 'v', config: config(...fixtures), stillsDir: 'videos/v/render-check' }, ctx);
  }, 240_000);

  const issuesFor = (id: string) => report.renderCheck!.issues.filter((i) => i.sceneId === id);
  const errorsFor = (id: string) => issuesFor(id).filter((i) => i.severity === 'error');

  it('renders three stills per scene and keeps them for review', async () => {
    expect(report.renderCheck!.status).toBe('failed');
    expect(report.renderCheck!.scenes).toHaveLength(fixtures.length);
    for (const s of report.renderCheck!.scenes) {
      expect(s.frames.map((f) => f.label)).toEqual(['settled', 'midpoint', 'pre-exit']);
      for (const f of s.frames) await fs.access(path.join(tmpRoot, 'job-render-check', f.still!));
    }
  });

  it('a healthy scene and the TD-002 mask+up scene render visibly with nothing in the safe band', () => {
    for (const id of ['healthy', 'mask-up']) {
      expect(issuesFor(id), id).toHaveLength(0);
      const s = report.renderCheck!.scenes.find((x) => x.sceneId === id)!;
      for (const f of s.frames) {
        expect(f.slots[0].blank, `${id} ${f.label}`).toBe(false);
        expect(f.edges.every((e) => !e.bleed), `${id} ${f.label}`).toBe(true);
      }
    }
  });

  it('blank slot: unknown lottie key and broken image URL are errors naming the slot and mid-scene', () => {
    for (const id of ['blank-lottie', 'blank-image']) {
      const errs = errorsFor(id);
      expect(errs.map((e) => e.rule), id).toEqual(['blank_slot']);
      expect(errs[0].path).toBe(`scenes[${fixtures.findIndex((f) => f.id === id)}].config.slots.full`);
      expect(errs[0].message).toMatch(/heroText/);
    }
  });

  it('blank slot: content that only appears near the end is an error (blank at settled + midpoint)', () => {
    const errs = errorsFor('late-lines');
    expect(errs.map((e) => e.rule)).toEqual(['blank_slot']);
    expect(errs[0].message).toMatch(/visible in the other sampled frames/);
  });

  it('edge bleed: overflowing checklist is an error on the bottom edge attributed to the nearest slot', () => {
    const errs = errorsFor('overflow-bottom').filter((e) => e.rule === 'edge_bleed');
    expect(errs).toHaveLength(1);
    expect(errs[0].message).toMatch(/bottom safe band/);
    expect(errs[0].path).toMatch(/slots\.col1$/);
  });

  it('scores summarise the run', () => {
    expect(report.scores!.blankSlotRate).toBeGreaterThan(0);
    expect(report.scores!.edgeBleedRate).toBeGreaterThan(0);
  });
});

describe.skipIf(!RENDER)('validateAndRepair with render-check on (KNOMOTION_RENDER_TESTS=1)', () => {
  it('a blank slot that passes the rules is routed to repair and the repaired video passes', async () => {
    let repairSeen: any;
    const ctx = makeCtx('job-render-repair', (input) => {
      repairSeen = input;
      return { patchedScene: { ...blankLottie(), config: { ...blankLottie().config, slots: { full: textReveal(['Repaired: visible text']) } } }, notes: 'swap bad lottie for text' };
    });
    const dir = ctx.store.videoDir('v');
    const { report, config: repaired, repairAttempts, renderCheckStatus } = await validateAndRepair(ctx, 'v', config(blankLottie()), dir, undefined, undefined, { renderCheck: true });

    expect(repairAttempts).toBe(1);
    expect(report.valid).toBe(true);
    expect(report.status).toBe('passed');
    expect(renderCheckStatus).toBe('passed');
    expect(report.rulesChecked).toEqual(expect.arrayContaining(['blank_slot', 'edge_bleed']));
    expect((repaired.scenes[0].config.slots as any).full.midScene).toBe('textReveal');
    // The repair prompt received the render-check finding, not a rule failure.
    expect(JSON.stringify(repairSeen)).toMatch(/blank_slot/);

    const quality = JSON.parse(await fs.readFile(path.join(ctx.store.jobDir, dir, QUALITY_ARTIFACT), 'utf8'));
    expect(quality.renderCheck.status).toBe('passed');
    const stills = await fs.readdir(path.join(ctx.store.jobDir, dir, STILLS_DIR));
    expect(stills.length).toBe(3);
  }, 240_000);
});
