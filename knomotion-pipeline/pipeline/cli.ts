/**
 * KnoMotion pipeline CLI.
 *
 * Usage:
 *   tsx pipeline/cli.ts --text "..."            # inline source
 *   tsx pipeline/cli.ts --input source.md       # file source
 *   tsx pipeline/cli.ts --input s.md --provider openai
 *   tsx pipeline/cli.ts --input s.md --stop-after validation
 *   tsx pipeline/cli.ts preview [jobId]         # stage a generated config for Studio preview
 *
 * Flags:
 *   --input <file>        Read source material from a file
 *   --text <string>       Inline source material (alternative to --input)
 *   --title <string>      Optional source title
 *   --format <fmt>        desktop | mobile (default desktop)
 *   --provider <p>        mock | openai (default mock)
 *   --out <dir>           Artifacts root dir (default pipeline/artifacts)
 *   --stop-after <stage>  Halt after a stage (e.g. validation)
 *   --log-level <lvl>     debug | info | warn | error
 *   --video <videoId>     (preview) Which video of the job to stage (default: first)
 *
 * The `preview` command copies a job's 05-knomotion-video-config.json to
 * <repo root>/public/pipeline-preview/config.json, where the PipelinePreview
 * Remotion composition picks it up. With no jobId it uses the most recent job.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { runPipeline } from './orchestrator';
import type { PipelineStage } from './schemas/common';
import type { PipelineConfig } from './core/config';
import { KnoMotionVideoConfigSchema } from './schemas/KnoMotionVideoConfig';

const PIPELINE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const SOURCES_DIR = path.join(PIPELINE_DIR, 'sources');
const REPO_ROOT = path.resolve(PIPELINE_DIR, '..', '..');
const CONFIG_ARTIFACT = '05-knomotion-video-config.json';
const PREVIEW_DIR = path.join(REPO_ROOT, 'public', 'pipeline-preview');

const main = async () => {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      input: { type: 'string' },
      source: { type: 'string' },
      text: { type: 'string' },
      title: { type: 'string' },
      format: { type: 'string' },
      provider: { type: 'string' },
      out: { type: 'string' },
      video: { type: 'string' },
      'stop-after': { type: 'string' },
      'log-level': { type: 'string' },
    },
  });

  if (positionals[0] === 'preview') {
    await runPreview(positionals[1], values.out, values.video);
    return;
  }

  if (!values.input && !values.text && !values.source) {
    console.error('Provide source material with one of:\n  --source <name>   (a file in pipeline/sources/, e.g. --source worldcup)\n  --input <path>    (any file path)\n  --text "..."      (inline text)');
    process.exit(1);
  }

  // Resolve the source: --source <name> -> pipeline/sources/<name>.md
  let inputPath: string | undefined = values.input;
  if (values.source) {
    const name = values.source.endsWith('.md') ? values.source : `${values.source}.md`;
    inputPath = path.join(SOURCES_DIR, name);
  }

  let text: string;
  if (values.text) {
    text = values.text;
  } else {
    try {
      text = await fs.readFile(inputPath as string, 'utf8');
    } catch {
      console.error(`Could not read source file: ${inputPath}`);
      if (values.source) console.error(`(expected a file at ${SOURCES_DIR}/${values.source}.md)`);
      process.exit(1);
    }
  }
  const inputType = inputPath && inputPath.endsWith('.md') ? 'markdown' : 'text';

  const config: Partial<PipelineConfig> = {};
  if (values.provider) config.provider = values.provider as PipelineConfig['provider'];
  if (values.out) config.artifactsDir = values.out;
  if (values['log-level']) config.logLevel = values['log-level'] as PipelineConfig['logLevel'];

  const result = await runPipeline(
    { inputType, text, title: values.title },
    {
      config,
      format: (values.format as 'desktop' | 'mobile') || undefined,
      stopAfter: (values['stop-after'] as PipelineStage) || undefined,
    },
  );

  console.log('\n=== Pipeline result ===');
  console.log(`job:    ${result.jobId}`);
  console.log(`dir:    ${result.jobDir}`);
  console.log(`module: ${result.moduleTitle}`);
  for (const v of result.videos) {
    console.log(`  video ${v.videoId}: ${v.status} (valid=${v.valid}, repairs=${v.repairAttempts})`);
    console.log(`    config: ${v.configPath}`);
  }
  const anyFailed = result.videos.some((v) => !v.valid);
  console.log(`\nPreview the first video with:  npm run run -- preview ${result.jobId}`);
  process.exit(anyFailed ? 2 : 0);
};

// ---------------------------------------------------------------------------
// preview <jobId?> — stage a generated config for the PipelinePreview composition
// ---------------------------------------------------------------------------

const runPreview = async (jobIdArg: string | undefined, outDir?: string, videoId?: string) => {
  const artifactsDir = path.resolve(outDir ?? process.env.KNOMOTION_ARTIFACTS_DIR ?? 'pipeline/artifacts');

  const jobId = jobIdArg ?? (await latestJobId(artifactsDir));
  if (!jobId) {
    console.error(`No jobs found under ${artifactsDir}. Run the pipeline first.`);
    process.exit(1);
  }
  const jobDir = path.join(artifactsDir, jobId);

  // Collect videos of this job that produced a config artifact.
  const videosDir = path.join(jobDir, 'videos');
  const candidates: string[] = [];
  try {
    for (const entry of await fs.readdir(videosDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      try {
        await fs.access(path.join(videosDir, entry.name, CONFIG_ARTIFACT));
        candidates.push(entry.name);
      } catch { /* video without a config artifact — skip */ }
    }
  } catch {
    console.error(`Job ${jobId} has no videos/ directory (${videosDir}). Did the run reach scene-json-generation?`);
    process.exit(1);
  }
  if (candidates.length === 0) {
    console.error(`Job ${jobId} has no ${CONFIG_ARTIFACT} artifacts to preview.`);
    process.exit(1);
  }

  const chosen = videoId ?? candidates[0];
  if (!candidates.includes(chosen)) {
    console.error(`Video "${chosen}" not found in job ${jobId}. Available: ${candidates.join(', ')}`);
    process.exit(1);
  }

  // Validate before staging so a broken artifact fails here, not in Studio.
  const sourcePath = path.join(videosDir, chosen, CONFIG_ARTIFACT);
  const parsed = KnoMotionVideoConfigSchema.safeParse(JSON.parse(await fs.readFile(sourcePath, 'utf8')));
  if (!parsed.success) {
    console.error(`Config at ${sourcePath} failed its contract:\n${JSON.stringify(parsed.error.flatten(), null, 2)}`);
    process.exit(1);
  }

  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.writeFile(path.join(PREVIEW_DIR, 'config.json'), JSON.stringify(parsed.data, null, 2) + '\n', 'utf8');
  await fs.writeFile(
    path.join(PREVIEW_DIR, 'meta.json'),
    JSON.stringify({ jobId, videoId: chosen, sourcePath, stagedAt: new Date().toISOString() }, null, 2) + '\n',
    'utf8',
  );

  console.log('=== Pipeline preview staged ===');
  console.log(`job:    ${jobId}`);
  console.log(`video:  ${chosen}${candidates.length > 1 ? `   (others: ${candidates.filter((c) => c !== chosen).join(', ')} — use --video <id>)` : ''}`);
  console.log(`scenes: ${parsed.data.scenes.length}, format: ${parsed.data.format ?? 'desktop'}`);
  console.log(`staged: ${path.join(PREVIEW_DIR, 'config.json')}`);
  console.log('\nWatch it (from the repo root):');
  console.log('  npx remotion studio KnoMotion-Videos/src/remotion/index.ts');
  console.log('  → select the "PipelinePreview" composition (refresh if Studio is already open)');
};

/** Most recently modified job directory under the artifacts root, if any. */
const latestJobId = async (artifactsDir: string): Promise<string | undefined> => {
  try {
    const entries = await fs.readdir(artifactsDir, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory());
    const withTimes = await Promise.all(
      dirs.map(async (d) => ({ name: d.name, mtime: (await fs.stat(path.join(artifactsDir, d.name))).mtimeMs })),
    );
    withTimes.sort((a, b) => b.mtime - a.mtime);
    return withTimes[0]?.name;
  } catch {
    return undefined;
  }
};

main().catch((err) => {
  console.error('Pipeline run failed:', err?.message ?? err);
  process.exit(1);
});
