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
 *       -> validation -> (repair -> re-time -> re-validate)*<=maxRepairAttempts
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
  'script-generation', 'tts', 'timing', 'scene-json-generation', 'validation', 'repair', 'assembly',
];

/** The renderable deliverable for a video. Repair and assembly write back to this file. */
const CONFIG_ARTIFACT = '05-knomotion-video-config.json';
const TTS_ARTIFACT = '04a-tts-manifest.json';
const TIMING_ARTIFACT = '04b-scene-timing.json';
const RENDER_MANIFEST_ARTIFACT = '08-render-manifest.json';

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

    // Validate, then surgically repair failing scenes up to the cap. When any
    // repair patch is applied, validateAndRepair persists the repaired config
    // back to CONFIG_ARTIFACT so configPath always points at the final config.
    const { report, repairAttempts, config: validated } = await validateAndRepair(ctx, brief.id, config0, dir, sceneTiming);
    if (shouldStop('validation') || shouldStop('repair')) {
      videos.push(videoResult(store.jobDir, dir, brief.id, report, repairAttempts, 0, sceneTiming.totalDurationInFrames));
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

    videos.push(videoResult(store.jobDir, dir, brief.id, report, repairAttempts, narrationClips, sceneTiming.totalDurationInFrames));
  }

  logger.info('Pipeline run complete', { videos: videos.length });
  return summarize(jobId, store.jobDir, modulePlan.moduleTitle, videos);
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

/**
 * Validates `config`, repairing failing scenes up to the cap. When `timing` is
 * supplied, every repaired scene has its computed timing re-applied before
 * re-validation, so the repair LLM can never re-introduce timing drift.
 */
export async function validateAndRepair(
  ctx: PipelineContext, videoId: string, config: KnoMotionVideoConfig, dir: string, timing?: SceneTimingArtifact,
): Promise<{ report: ValidationReport; config: KnoMotionVideoConfig; repairAttempts: number }> {
  let working = config;
  let anyScenePatched = false;
  const timingFor = (sceneId: string, index: number) =>
    timing?.scenes.find((t) => t.sceneId === sceneId) ?? timing?.scenes[index];
  let report = await execute(ctx, validationStage, { videoId, config: working }, path.join(dir, '06-validation-report.json'));
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

    report = await execute(ctx, validationStage, { videoId, config: working }, path.join(dir, '06-validation-report.json'));
    report = { ...report, repairAttempts: attempts };
  }

  if (!report.valid && attempts >= ctx.config.maxRepairAttempts) {
    report = { ...report, status: 'needs_review', repairAttempts: attempts };
    await ctx.store.writeArtifact(path.join(dir, '06-validation-report.json'), validationStage.outputSchema, report);
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

  return { report, config: working, repairAttempts: attempts };
}

const videoResult = (
  jobDir: string, dir: string, videoId: string, report: ValidationReport, repairAttempts: number,
  narrationClips: number, durationInFrames: number,
): VideoResult => ({
  videoId,
  status: report.status,
  valid: report.valid,
  configPath: path.join(jobDir, dir, CONFIG_ARTIFACT),
  validationPath: path.join(jobDir, dir, '06-validation-report.json'),
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
