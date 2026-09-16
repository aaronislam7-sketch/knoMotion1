/**
 * Stage 9 — Render-check (deterministic, Sept M2).
 * { videoId, KnoMotionVideoConfig } -> QualityReport (renderCheck section).
 *
 * Validation (Stage 8) proves a config is well-formed; this stage proves it
 * RENDERS. For every scene it renders three stills (settled / midpoint /
 * pre-exit) plus a background-only baseline at the same frames, then runs two
 * pixel checks against the geometry the layout engine says the scene has:
 *
 *   blank_slot  — a configured slot shows nothing where resolveSlots() put it
 *   edge_bleed  — something renders inside the outer safe band
 *
 * Findings are ValidationIssues so the orchestrator can merge them into the
 * validation report and route them through repair exactly like a rule failure.
 * A slot blank at the midpoint (or in every sampled frame) is an error; blank
 * in only one edge frame is a warning (entrance/exit choreography). Edge bleed
 * is always an error.
 *
 * When @remotion/renderer is not installed the stage reports `skipped` (mode
 * "auto") or throws (mode "on"); it never silently passes.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { PipelineError } from '../../core/errors';
import { KnoMotionVideoConfigSchema, type KnoMotionVideoConfig, type SceneItem } from '../../schemas/KnoMotionVideoConfig';
import { QualityReportSchema, type RenderCheck } from '../../schemas/QualityReport';
import type { ValidationIssue } from '../../schemas/ValidationReport';
import { loadRendererCapabilities } from '../../core/capabilities/renderer-capabilities';
import { resolveSlots, safeBandFor, viewportFor, type LayoutArea, type LayoutGeometry } from '../../core/geometry';
import { FPS } from '../../core/fps';
import { planFrames, type PlannedFrame } from '../../core/render/frame-plan';
import {
  DEFAULT_THRESHOLDS, checkEdgeBleed, checkSlots, decodePng,
  type Edge, type EdgeResult, type RenderCheckThresholds, type SlotResult,
} from '../../core/render/pixel-checks';
import {
  backgroundOnly, isRendererAvailable, openStillRenderer, singleSceneConfig, type StillRenderer,
} from '../../core/render/still-renderer';

export const RenderCheckInputSchema = z.object({
  videoId: z.string().min(1),
  config: KnoMotionVideoConfigSchema,
  /** Job-relative directory to keep the content stills in (for human review). Omit to keep nothing. */
  stillsDir: z.string().optional(),
  framesPerScene: z.number().int().min(1).max(3).optional(),
  scale: z.number().positive().max(1).optional(),
  thresholds: z
    .object({ pixelTolerance: z.number(), blankMinPixels: z.number(), edgeBleedMaxCoverage: z.number() })
    .partial()
    .optional(),
});
export type RenderCheckInput = z.infer<typeof RenderCheckInputSchema>;

export const RENDER_CHECK_RULES = ['blank_slot', 'edge_bleed'] as const;

export const renderCheckStage = defineStage({
  name: 'render-check',
  handler: 'deterministic',
  inputSchema: RenderCheckInputSchema,
  outputSchema: QualityReportSchema,
  async run(input, ctx) {
    const started = Date.now();
    const scale = input.scale ?? ctx.config.renderCheckScale;
    const framesPerScene = input.framesPerScene ?? ctx.config.renderCheckFramesPerScene;
    const thresholds: RenderCheckThresholds = { ...DEFAULT_THRESHOLDS, ...(input.thresholds ?? {}) };
    const base = { scale, framesPerScene, thresholds };

    const report = (renderCheck: RenderCheck) => ({
      meta: ctx.makeMeta('render-check', 'QualityReport', { producedBy: 'deterministic', inputs: ['KnoMotionVideoConfig'] }),
      videoId: input.videoId,
      renderCheck,
      scores: scoresFor(renderCheck),
      humanEdits: [],
      fineTuneCandidate: false,
    });

    if (ctx.config.renderCheck === 'off') {
      return report({ ...base, status: 'skipped', skippedReason: 'renderCheck=off', scenes: [], issues: [] });
    }
    if (!isRendererAvailable()) {
      const reason = '@remotion/renderer / @remotion/bundler not installed (run npm install at the monorepo root)';
      if (ctx.config.renderCheck === 'on') throw new PipelineError(`render-check required but ${reason}`, 'RENDERER_UNAVAILABLE');
      ctx.logger.warn('render-check skipped', { videoId: input.videoId, reason });
      return report({ ...base, status: 'skipped', skippedReason: reason, scenes: [], issues: [] });
    }

    const caps = await loadRendererCapabilities();
    const format = input.config.format ?? 'desktop';
    const geometry = caps.layoutGeometry;

    if (input.stillsDir) {
      const abs = path.join(ctx.store.jobDir, input.stillsDir);
      await fs.rm(abs, { recursive: true, force: true });
      await fs.mkdir(abs, { recursive: true });
    }

    const renderer = await openStillRenderer({ publicDir: ctx.config.publicDir, logger: ctx.logger });
    const scenes: RenderCheck['scenes'] = [];
    const issues: ValidationIssue[] = [];
    try {
      for (const [sceneIndex, scene] of input.config.scenes.entries()) {
        const result = await checkScene({
          renderer, config: input.config, scene, sceneIndex, format, geometry, scale, framesPerScene, thresholds,
          stillsDir: input.stillsDir, jobDir: ctx.store.jobDir,
        });
        scenes.push(result.entry);
        issues.push(...result.issues);
        ctx.logger.debug('render-check scene done', { sceneId: scene.id, frames: result.entry.frames.length, issues: result.issues.length });
      }
    } finally {
      await renderer.close();
    }

    const errors = issues.filter((i) => i.severity === 'error').length;
    const renderCheck: RenderCheck = {
      ...base, status: errors ? 'failed' : 'passed', scenes, issues, durationMs: Date.now() - started,
    };
    if (errors) {
      ctx.logger.warn('render-check found problems', { videoId: input.videoId, errors, warnings: issues.length - errors });
    } else {
      ctx.logger.info('render-check passed', { videoId: input.videoId, scenes: scenes.length, ms: renderCheck.durationMs });
    }
    return report(renderCheck);
  },
});

// ---------------------------------------------------------------------------
// Per-scene work
// ---------------------------------------------------------------------------

interface SceneCheckArgs {
  renderer: StillRenderer;
  config: KnoMotionVideoConfig;
  scene: SceneItem;
  sceneIndex: number;
  format: 'desktop' | 'mobile';
  geometry: LayoutGeometry;
  scale: number;
  framesPerScene: number;
  thresholds: RenderCheckThresholds;
  stillsDir?: string;
  jobDir: string;
}

interface FrameSample {
  plan: PlannedFrame;
  slots: SlotResult[];
  edges: EdgeResult[];
  still?: string;
}

const checkScene = async (a: SceneCheckArgs): Promise<{ entry: RenderCheck['scenes'][number]; issues: ValidationIssue[] }> => {
  const viewport = viewportFor(a.format, a.geometry);
  const band = safeBandFor(a.format, a.geometry);
  const layoutSlots = resolveSlots(a.scene.config.layout as any, a.format, a.geometry);
  // Same filter as SceneRenderer: only slots the layout actually produces render.
  const configured: Record<string, LayoutArea> = {};
  for (const name of Object.keys(a.scene.config.slots ?? {})) {
    if (layoutSlots[name]) configured[name] = layoutSlots[name];
  }

  const contentCfg = singleSceneConfig(a.config, a.scene);
  const baselineCfg = singleSceneConfig(a.config, backgroundOnly(a.scene));
  const samples: FrameSample[] = [];

  for (const plan of planFrames(a.scene, FPS, a.framesPerScene)) {
    const [contentPng, baselinePng] = await Promise.all([
      a.renderer.renderStill({ config: contentCfg, frame: plan.frame, scale: a.scale }),
      a.renderer.renderStill({ config: baselineCfg, frame: plan.frame, scale: a.scale }),
    ]);
    const content = decodePng(contentPng);
    const baseline = decodePng(baselinePng);

    let still: string | undefined;
    if (a.stillsDir) {
      still = path.join(a.stillsDir, `${String(a.sceneIndex).padStart(2, '0')}-${safeName(a.scene.id)}-${plan.label}.png`);
      await fs.writeFile(path.join(a.jobDir, still), contentPng);
    }

    samples.push({
      plan,
      still,
      slots: checkSlots(content, baseline, configured, a.scale, a.thresholds),
      edges: checkEdgeBleed(content, baseline, viewport, band, a.scale, a.thresholds),
    });
  }

  const issues = [
    ...blankSlotIssues(a.scene, a.sceneIndex, configured, samples, a.scale),
    ...edgeBleedIssues(a.scene, a.sceneIndex, configured, samples, band, viewport),
  ];

  return {
    entry: {
      sceneId: a.scene.id,
      sceneIndex: a.sceneIndex,
      frames: samples.map((s) => ({ label: s.plan.label, frame: s.plan.frame, timeSec: round(s.plan.timeSec), still: s.still, slots: s.slots.map(roundStats), edges: s.edges.map(roundStats) })),
    },
    issues,
  };
};

// ---------------------------------------------------------------------------
// Issue synthesis
// ---------------------------------------------------------------------------

const midSceneOf = (scene: SceneItem, slot: string): string => {
  const v = (scene.config.slots ?? {})[slot] as any;
  const first = Array.isArray(v) ? v[0] : v;
  return first?.midScene ?? 'unknown';
};

const secondsList = (samples: FrameSample[]) => samples.map((s) => `${s.plan.timeSec.toFixed(1)}s`).join(', ');

const blankSlotIssues = (
  scene: SceneItem, sceneIndex: number, configured: Record<string, LayoutArea>, samples: FrameSample[], scale: number,
): ValidationIssue[] => {
  const out: ValidationIssue[] = [];
  for (const slot of Object.keys(configured)) {
    const blankAt = samples.filter((s) => s.slots.find((r) => r.slot === slot)?.blank);
    if (blankAt.length === 0) continue;
    const blankAtMidpoint = blankAt.some((s) => s.plan.label === 'midpoint');
    const blankEverywhere = blankAt.length === samples.length;
    const severity: ValidationIssue['severity'] = blankAtMidpoint || blankEverywhere ? 'error' : 'warning';
    const rect = configured[slot];
    const midScene = midSceneOf(scene, slot);
    const worst = Math.min(...blankAt.map((s) => s.slots.find((r) => r.slot === slot)!.changed));
    out.push({
      rule: 'blank_slot',
      severity,
      path: `scenes[${sceneIndex}].config.slots.${slot}`,
      sceneId: scene.id,
      sceneIndex,
      message: blankEverywhere
        ? `slot "${slot}" (${midScene}) rendered nothing in any sampled frame (${secondsList(blankAt)}) — the ${Math.round(rect.width)}×${Math.round(rect.height)} slot area is indistinguishable from the background`
        : `slot "${slot}" (${midScene}) rendered nothing at ${secondsList(blankAt)} (visible in the other sampled frames) — content is missing during the scene`,
      expected: `visible content in slot "${slot}" while narration plays (beats.start … beats.exit)`,
      received: `${Math.round(worst / (scale * scale))} native px differ from the background at the emptiest sample`,
    });
  }
  return out;
};

/** Which configured slot sits closest to `edge`: the likeliest source of a bleed. */
const nearestSlot = (configured: Record<string, LayoutArea>, edge: Edge, viewport: { width: number; height: number }): string | undefined => {
  const entries = Object.entries(configured);
  if (entries.length === 0) return undefined;
  const distance = ([, r]: [string, LayoutArea]) => {
    switch (edge) {
      case 'top': return r.top;
      case 'left': return r.left;
      case 'bottom': return viewport.height - (r.top + r.height);
      case 'right': return viewport.width - (r.left + r.width);
    }
  };
  return entries.sort((x, y) => distance(x) - distance(y))[0][0];
};

const edgeBleedIssues = (
  scene: SceneItem, sceneIndex: number, configured: Record<string, LayoutArea>, samples: FrameSample[],
  band: number, viewport: { width: number; height: number },
): ValidationIssue[] => {
  const out: ValidationIssue[] = [];
  for (const edge of ['top', 'right', 'bottom', 'left'] as Edge[]) {
    const bledAt = samples.filter((s) => s.edges.find((e) => e.edge === edge)?.bleed);
    if (bledAt.length === 0) continue;
    const worst = Math.max(...bledAt.map((s) => s.edges.find((e) => e.edge === edge)!.coverage));
    const slot = nearestSlot(configured, edge, viewport);
    const midScene = slot ? midSceneOf(scene, slot) : undefined;
    out.push({
      rule: 'edge_bleed',
      severity: 'error',
      path: slot ? `scenes[${sceneIndex}].config.slots.${slot}` : `scenes[${sceneIndex}].config`,
      sceneId: scene.id,
      sceneIndex,
      message: `content renders inside the ${band}px ${edge} safe band at ${secondsList(bledAt)}${slot ? ` — nearest slot is "${slot}" (${midScene})` : ''}; shorten the text, reduce the item count, or use fewer columns/rows so it stays inside its slot`,
      expected: `no content pixels within ${band}px of the ${edge} edge`,
      received: `${(worst * 100).toFixed(2)}% of the ${edge} band differs from the background`,
    });
  }
  return out;
};

// ---------------------------------------------------------------------------
// Scores + small helpers
// ---------------------------------------------------------------------------

const scoresFor = (rc: RenderCheck) => {
  if (rc.status !== 'passed' && rc.status !== 'failed') return undefined;
  const slotSamples = rc.scenes.flatMap((s) => s.frames.flatMap((f) => f.slots));
  const frames = rc.scenes.flatMap((s) => s.frames);
  return {
    blankSlotRate: slotSamples.length ? round(slotSamples.filter((s) => s.blank).length / slotSamples.length) : 0,
    edgeBleedRate: frames.length ? round(frames.filter((f) => f.edges.some((e) => e.bleed)).length / frames.length) : 0,
  };
};

const round = (n: number) => Math.round(n * 10000) / 10000;
const roundStats = <T extends { coverage: number }>(s: T): T => ({ ...s, coverage: round(s.coverage) });
const safeName = (id: string) => id.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 40);
