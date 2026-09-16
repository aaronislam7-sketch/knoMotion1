/**
 * Orchestrator — executes the typed stage chain.
 *
 * One orchestrator, many typed stages. It validates each stage's input, runs
 * it, writes the validated artifact to the job directory, and records a manifest
 * entry. Stages never call each other — they only consume/produce artifacts.
 *
 * Flow:
 *   intake -> content-analysis -> module-planning
 *   then, per VideoBrief (fan-out):
 *     video-planning -> script-generation -> tts -> timing -> scene-json-generation
 *       -> validation -> render-check (stills, when validation passes)
 *       -> (repair -> re-time -> re-validate -> re-render-check)*<=maxRepairAttempts
 *       -> assembly (audio merged into the config)
 */

import path from 'node:path';
import { z } from 'zod';
import { loadConfig, type PipelineConfig } from './core/config';
import { createLogger } from './core/logger';
import { ArtifactStore } from './core/artifact-store';
import { createContext, type PipelineContext } from './core/context';
import { createLLMClient } from './core/llm';
import { runStage, type Stage } from './core/stage';
import { makeJobId } from './core/ids';
import { applySceneTiming } from './core/timing';
import type { PipelineStage } from './schemas/common';
import type { ContentMap } from './schemas/ContentMap';
import type { ModulePlan } from './schemas/ModulePlan';
import { KnoMotionVideoConfigSchema, type KnoMotionVideoConfig } from './schemas/KnoMotionVideoConfig';
import type { ValidationReport } from './schemas/ValidationReport';
import type { QualityReport, RenderCheckStatus } from './schemas/QualityReport';
import type { SceneTimingArtifact } from './schemas/SceneTiming';
import {
  intakeStage,
  contentAnalysisStage,
  modulePlanningStage,
  videoPlanningStage,
  scriptGenerationStage,
  ttsStage,
  timingStage,
  sceneJsonGenerationStage,
  validationStage,
  renderCheckStage,
  RENDER_CHECK_RULES,
  repairStage,
  assemblyStage,
} from './stages';
import type { IntakeInput } from './stages/intake/runIntake';

export interface RunOptions {
  jobId?: string;
  config?: Partial<PipelineConfig>;
  format?: 'desktop' | 'mobile';
  /** Stop after this stage (useful for testing partial runs). */
  stopAfter?: PipelineStage;
}

export interface VideoResult {
  videoId: string;
  status: ValidationReport['status'];
  valid: boolean;
  configPath: string;
  validationPath: string;
  /** Stage 9 outcome: not_run when the loop never reached it (validation still failing, or stopped before). */
  renderCheck: RenderCheckStatus | 'not_run';
  qualityPath: string;
  repairAttempts: number;
  /** Scenes with narration audio attached by assembly (0 for the mock TTS provider). */
  narrationClips: number;
  /** Total video length after transition overlap is ignored (sum of scene durations). */
  durationInFrames: number;
}

export interface RunResult {
  jobId: string;
  jobDir: string;
  moduleTitle: string;
  videos: VideoResult[];
}

const STAGE_ORDER: PipelineStage[] = [
  'intake', 'content-analysis', 'module-planning', 'video-planning',
  'script-generation', 'tts', 'timing', 'scene-json-generation', 'validation', 'render-check', 'repair', 'assembly',
];

/** The renderable deliverable for a video. Repair and assembly write back to this file. */
const CONFIG_ARTIFACT = '05-knomotion-video-config.json';
const TTS_ARTIFACT = '04a-tts-manifest.json';
const TIMING_ARTIFACT = '04b-scene-timing.json';
const VALIDATION_ARTIFACT = '06-validation-report.json';
const RENDER_MANIFEST_ARTIFACT = '08-render-manifest.json';
export const QUALITY_ARTIFACT = '09-quality-report.json';
/** Job-relative (under the video dir) folder where render-check keeps the content stills. */
export const STILLS_DIR = 'render-check';

export const runPipeline = async (input: IntakeInput, options: RunOptions = {}): Promise<RunResult> => {
  const config = loadConfig(options.config);
  const jobId = options.jobId ?? makeJobId();
  const logger = createLogger(config.logLevel, { jobId });
  const store = new ArtifactStore(config.artifactsDir, jobId);
  const llm = createLLMClient(config, logger);
  const ctx = createContext({ jobId, config, logger, store, llm });

  // Returns true once we've run far enough: stop after the stage named in options.stopAfter.
  const shouldStop = (justRan: PipelineStage): boolean =>
    options.stopAfter !== undefined && STAGE_ORDER.indexOf(justRan) >= STAGE_ORDER.indexOf(options.stopAfter);

  logger.info('Pipeline run starting', { provider: config.provider, jobDir: store.jobDir });

  // --- Module-level stages -------------------------------------------------
  const sourceBundle = await execute(ctx, intakeStage, input, '00-source-bundle.json');
  if (shouldStop('intake')) return summarize(jobId, store.jobDir, 'incomplete', []);

  const contentMap = await execute(ctx, contentAnalysisStage, sourceBundle, '01-content-map.json');
  if (shouldStop('content-analysis')) return summarize(jobId, store.jobDir, 'incomplete', []);

  const modulePlan = await execute(ctx, modulePlanningStage, contentMap, '02-module-plan.json');
  if (shouldStop('module-planning')) return summarize(jobId, store.jobDir, modulePlan.moduleTitle, []);

  // --- Per-video fan-out ---------------------------------------------------
  const videos: VideoResult[] = [];
  for (const brief of modulePlan.videos) {
    const videoLog = logger.child({ videoId: brief.id });
    videoLog.info('Planning video', { title: brief.title });
    const dir = store.videoDir(brief.id);

    const concepts = selectConcepts(contentMap, brief.conceptIds);
    const videoPlan = await execute(
      ctx, videoPlanningStage,
      { brief: { ...brief }, concepts },
      path.join(dir, '03-video-plan.json'),
    );
    if (options.format) videoPlan.format = options.format;
    if (shouldStop('video-planning')) continue;

    const narrationScript = await execute(
      ctx, scriptGenerationStage, { videoPlan }, path.join(dir, '04-narration-script.json'),
    );
    if (shouldStop('script-generation')) continue;

    // Audio first: real narration durations drive scene timing, not LLM guesses.
    const ttsManifest = await execute(ctx, ttsStage, { narrationScript }, path.join(dir, TTS_ARTIFACT));
    if (shouldStop('tts')) continue;

    const sceneTiming = await execute(
      ctx, timingStage, { narrationScript, ttsManifest }, path.join(dir, TIMING_ARTIFACT),
    );
    if (shouldStop('timing')) continue;

    const config0 = await execute(
      ctx, sceneJsonGenerationStage, { videoPlan, narrationScript, sceneTiming },
      path.join(dir, CONFIG_ARTIFACT),
    );
    if (shouldStop('scene-json-generation')) continue;

    // Validate (rules, then rendered stills), then surgically repair failing
    // scenes up to the cap. When any repair patch is applied, validateAndRepair
    // persists the repaired config back to CONFIG_ARTIFACT so configPath always
    // points at the final config. --stop-after validation skips render-check.
    const contentShapes = Object.fromEntries(videoPlan.scenes.map((s) => [s.id, s.contentShape]));
    const renderCheck = config.renderCheck !== 'off' && options.stopAfter !== 'validation';
    const { report, repairAttempts, config: validated, renderCheckStatus } = await validateAndRepair(
      ctx, brief.id, config0, dir, sceneTiming, contentShapes, { renderCheck },
    );
    if (shouldStop('validation') || shouldStop('render-check') || shouldStop('repair')) {
      videos.push(videoResult(store.jobDir, dir, brief.id, report, renderCheckStatus, repairAttempts, 0, sceneTiming.totalDurationInFrames));
      continue;
    }

    // Assembly attaches narration audio and writes the assembled config back
    // over CONFIG_ARTIFACT so preview/render see the same deliverable.
    const renderManifest = await execute(
      ctx, assemblyStage, { videoId: brief.id, config: validated, ttsManifest, sceneTiming },
      path.join(dir, RENDER_MANIFEST_ARTIFACT),
    );
    await store.writeArtifact(path.join(dir, CONFIG_ARTIFACT), KnoMotionVideoConfigSchema, renderManifest.props);
    await store.appendManifest({
      stage: 'assembly', artifact: CONFIG_ARTIFACT, path: path.join(dir, CONFIG_ARTIFACT), status: 'ok',
      producedBy: 'deterministic', at: ctx.now().toISOString(), videoId: brief.id,
    });
    const narrationClips = renderManifest.props.scenes.filter((s) => s.audio?.narration?.src).length;

    videos.push(videoResult(store.jobDir, dir, brief.id, report, renderCheckStatus, repairAttempts, narrationClips, sceneTiming.totalDurationInFrames));
  }

  logger.info('Pipeline run complete', { videos: videos.length });
  return summarize(jobId, store.jobDir, modulePlan.moduleTitle, videos);
};

// ---------------------------------------------------------------------------
// Standalone render-check (CLI: render-check <jobId>)
// ---------------------------------------------------------------------------

export interface RenderCheckJobOptions {
  jobId: string;
  videoId: string;
  config?: Partial<PipelineConfig>;
  framesPerScene?: number;
  scale?: number;
}

/**
 * Re-runs Stage 9 on an existing job's config artifact (the post-repair,
 * post-assembly deliverable) and rewrites 09-quality-report.json plus the
 * stills. Does not touch the validation report or the config.
 */
export const renderCheckJob = async (opts: RenderCheckJobOptions): Promise<{ report: QualityReport; qualityPath: string; stillsDir: string }> => {
  const config = loadConfig({ ...opts.config, renderCheck: 'on' });
  const logger = createLogger(config.logLevel, { jobId: opts.jobId });
  const store = new ArtifactStore(config.artifactsDir, opts.jobId);
  const llm = createLLMClient({ ...config, provider: 'mock' }, logger);
  const ctx = createContext({ jobId: opts.jobId, config, logger, store, llm });

  const dir = store.videoDir(opts.videoId);
  const videoConfig = await store.readArtifact(path.join(dir, CONFIG_ARTIFACT), KnoMotionVideoConfigSchema);
  const report = await execute(
    ctx, renderCheckStage,
    { videoId: opts.videoId, config: videoConfig, stillsDir: path.join(dir, STILLS_DIR), framesPerScene: opts.framesPerScene, scale: opts.scale },
    path.join(dir, QUALITY_ARTIFACT),
  );
  return { report, qualityPath: path.join(store.jobDir, dir, QUALITY_ARTIFACT), stillsDir: path.join(store.jobDir, dir, STILLS_DIR) };
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Runs a stage, writes its validated artifact, and records a manifest entry. */
async function execute<In extends z.ZodTypeAny, Out extends z.ZodTypeAny>(
  ctx: PipelineContext,
  stage: Stage<In, Out>,
  rawInput: unknown,
  relPath: string,
): Promise<z.infer<Out>> {
  const started = Date.now();
  try {
    const output = await runStage(stage, rawInput, ctx);
    const written = await ctx.store.writeArtifact(relPath, stage.outputSchema, output);
    await ctx.store.appendManifest({
      stage: stage.name, artifact: path.basename(relPath), path: relPath, status: 'ok',
      producedBy: stage.handler, at: ctx.now().toISOString(), durationMs: Date.now() - started,
    });
    ctx.logger.debug(`stage ok: ${stage.name}`, { relPath, ms: Date.now() - started });
    return written;
  } catch (err) {
    await ctx.store.appendManifest({
      stage: stage.name, artifact: path.basename(relPath), path: relPath, status: 'failed',
      producedBy: stage.handler, at: ctx.now().toISOString(), durationMs: Date.now() - started,
    });
    ctx.logger.error(`stage failed: ${stage.name}`, { relPath, error: (err as Error).message });
    throw err;
  }
}

export interface ValidateAndRepairOptions {
  /** Run Stage 9 render-check whenever the rule validation passes (default false). */
  renderCheck?: boolean;
}

/**
 * Validates `config`, repairing failing scenes up to the cap. When `timing` is
 * supplied, every repaired scene has its computed timing re-applied before
 * re-validation, so the repair LLM can never re-introduce timing drift.
 *
 * With `renderCheck` on, a config that clears the rules is rendered (Stage 9)
 * and any blank_slot / edge_bleed findings are merged into the validation
 * report as errors, so the repair loop treats "renders nothing" exactly like a
 * broken rule. The merged report is what lands in 06-validation-report.json.
 */
export async function validateAndRepair(
  ctx: PipelineContext, videoId: string, config: KnoMotionVideoConfig, dir: string, timing?: SceneTimingArtifact,
  contentShapes?: Record<string, string>, options: ValidateAndRepairOptions = {},
): Promise<{ report: ValidationReport; config: KnoMotionVideoConfig; repairAttempts: number; renderCheckStatus: VideoResult['renderCheck'] }> {
  let working = config;
  let anyScenePatched = false;
  let renderCheckStatus: VideoResult['renderCheck'] = 'not_run';
  const timingFor = (sceneId: string, index: number) =>
    timing?.scenes.find((t) => t.sceneId === sceneId) ?? timing?.scenes[index];
  const validateInput = () => ({ videoId, config: working, contentShapes });
  const validationPath = path.join(dir, VALIDATION_ARTIFACT);

  // Rules first; stills only once the rules pass (rendering a config with
  // known structural errors would just report the same problems twice).
  const assess = async (): Promise<ValidationReport> => {
    let report = await execute(ctx, validationStage, validateInput(), validationPath);
    if (!report.valid || !options.renderCheck) return report;
    const quality = await execute(
      ctx, renderCheckStage,
      { videoId, config: working, stillsDir: path.join(dir, STILLS_DIR) },
      path.join(dir, QUALITY_ARTIFACT),
    );
    renderCheckStatus = quality.renderCheck?.status ?? 'skipped';
    report = mergeRenderCheck(report, quality);
    if (!report.valid) await ctx.store.writeArtifact(validationPath, validationStage.outputSchema, report);
    return report;
  };

  let report = await assess();
  let attempts = 0;

  while (!report.valid && attempts < ctx.config.maxRepairAttempts) {
    attempts++;
    // Repair EVERY scene that has errors this round (not just the first), so a
    // video with many broken scenes can actually be cleared within the cap.
    const sceneIndexes = [...new Set(
      report.errors.map((e) => e.sceneIndex).filter((i): i is number => typeof i === 'number'),
    )].sort((a, b) => a - b);
    if (sceneIndexes.length === 0) break; // errors not tied to a scene — repair can't help

    ctx.logger.warn('Repairing scenes', { videoId, sceneIndexes, attempt: attempts });
    for (const sceneIndex of sceneIndexes) {
      const sceneErrors = report.errors.filter((e) => e.sceneIndex === sceneIndex);
      try {
        const patch = await execute(
          ctx, repairStage,
          { videoId, sceneIndex, scene: working.scenes[sceneIndex], issues: sceneErrors, attempt: attempts },
          path.join(dir, `07-repair-${sceneIndex}-${attempts}.json`),
        );
        const t = timingFor(patch.patchedScene.id, sceneIndex);
        const patched = t ? applySceneTiming(patch.patchedScene, t, { fps: timing?.fps }) : patch.patchedScene;
        working = { ...working, scenes: working.scenes.map((s, i) => (i === sceneIndex ? patched : s)) };
        anyScenePatched = true;
      } catch (err) {
        ctx.logger.warn('Repair attempt errored for scene; leaving it for review', { videoId, sceneIndex, error: (err as Error).message });
      }
    }

    report = { ...(await assess()), repairAttempts: attempts };
  }

  if (!report.valid && attempts >= ctx.config.maxRepairAttempts) {
    report = { ...report, status: 'needs_review', repairAttempts: attempts };
    await ctx.store.writeArtifact(validationPath, validationStage.outputSchema, report);
  }

  // Persist the repaired config back over the Stage-5 artifact so the file on
  // disk is always the config the final validation report describes. Without
  // this, repair patches only exist as 07-* artifacts and the deliverable
  // silently remains the broken pre-repair config. Written even on
  // needs_review: best-effort repairs belong in the deliverable too.
  if (anyScenePatched) {
    const relPath = path.join(dir, CONFIG_ARTIFACT);
    await ctx.store.writeArtifact(relPath, KnoMotionVideoConfigSchema, working);
    await ctx.store.appendManifest({
      stage: 'repair', artifact: CONFIG_ARTIFACT, path: relPath, status: 'ok',
      producedBy: 'llm', at: ctx.now().toISOString(),
    });
    ctx.logger.info('Repaired config written back', { videoId, relPath, repairAttempts: attempts });
  }

  return { report, config: working, repairAttempts: attempts, renderCheckStatus };
}

/** Folds Stage 9 findings into the validation report so repair sees one issue list. */
export const mergeRenderCheck = (report: ValidationReport, quality: QualityReport): ValidationReport => {
  const rc = quality.renderCheck;
  if (!rc || rc.status === 'skipped') return report;
  const errors = [...report.errors, ...rc.issues.filter((i) => i.severity === 'error')];
  const warnings = [...report.warnings, ...rc.issues.filter((i) => i.severity === 'warning')];
  const valid = errors.length === 0;
  return {
    ...report,
    rulesChecked: [...new Set([...report.rulesChecked, ...RENDER_CHECK_RULES])],
    errors,
    warnings,
    valid,
    status: valid ? 'passed' : 'failed',
  };
};

const videoResult = (
  jobDir: string, dir: string, videoId: string, report: ValidationReport, renderCheck: VideoResult['renderCheck'],
  repairAttempts: number, narrationClips: number, durationInFrames: number,
): VideoResult => ({
  videoId,
  status: report.status,
  valid: report.valid,
  configPath: path.join(jobDir, dir, CONFIG_ARTIFACT),
  validationPath: path.join(jobDir, dir, VALIDATION_ARTIFACT),
  renderCheck,
  qualityPath: path.join(jobDir, dir, QUALITY_ARTIFACT),
  repairAttempts,
  narrationClips,
  durationInFrames,
});

const selectConcepts = (contentMap: ContentMap, conceptIds: string[]) => {
  const wanted = new Set(conceptIds);
  const selected = contentMap.concepts.filter((c) => wanted.has(c.id));
  return selected.length ? selected : contentMap.concepts;
};

const summarize = (jobId: string, jobDir: string, moduleTitle: string, videos: VideoResult[]): RunResult => ({
  jobId, jobDir, moduleTitle, videos,
});

// Re-export for convenience
export { z };
export type { ModulePlan };
