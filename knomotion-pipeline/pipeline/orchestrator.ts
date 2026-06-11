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
 *     video-planning -> script-generation -> scene-json-generation
 *       -> validation -> (repair -> re-validate)*<=maxRepairAttempts
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
import type { PipelineStage } from './schemas/common';
import type { ContentMap } from './schemas/ContentMap';
import type { ModulePlan } from './schemas/ModulePlan';
import type { KnoMotionVideoConfig } from './schemas/KnoMotionVideoConfig';
import type { ValidationReport } from './schemas/ValidationReport';
import {
  intakeStage,
  contentAnalysisStage,
  modulePlanningStage,
  videoPlanningStage,
  scriptGenerationStage,
  sceneJsonGenerationStage,
  validationStage,
  repairStage,
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
}

export interface RunResult {
  jobId: string;
  jobDir: string;
  moduleTitle: string;
  videos: VideoResult[];
}

const STAGE_ORDER: PipelineStage[] = [
  'intake', 'content-analysis', 'module-planning', 'video-planning',
  'script-generation', 'scene-json-generation', 'validation', 'repair',
];

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

    let config0 = await execute(
      ctx, sceneJsonGenerationStage, { videoPlan, narrationScript },
      path.join(dir, '05-knomotion-video-config.json'),
    );
    if (shouldStop('scene-json-generation')) continue;

    // Validate, then surgically repair failing scenes up to the cap.
    const { report, config: finalConfig, repairAttempts } = await validateAndRepair(
      ctx, brief.id, config0, dir,
    );

    videos.push({
      videoId: brief.id,
      status: report.status,
      valid: report.valid,
      configPath: path.join(store.jobDir, dir, '05-knomotion-video-config.json'),
      validationPath: path.join(store.jobDir, dir, '06-validation-report.json'),
      repairAttempts,
    });
    void finalConfig;
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

async function validateAndRepair(
  ctx: PipelineContext, videoId: string, config: KnoMotionVideoConfig, dir: string,
): Promise<{ report: ValidationReport; config: KnoMotionVideoConfig; repairAttempts: number }> {
  let working = config;
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
        working = { ...working, scenes: working.scenes.map((s, i) => (i === sceneIndex ? patch.patchedScene : s)) };
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
  return { report, config: working, repairAttempts: attempts };
}

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
