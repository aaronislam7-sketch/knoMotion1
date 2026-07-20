/**
 * KnoMotion pipeline CLI.
 *
 * Usage:
 *   tsx pipeline/cli.ts --text "..."            # inline source
 *   tsx pipeline/cli.ts --input source.md       # file source
 *   tsx pipeline/cli.ts --input s.md --provider openai
 *   tsx pipeline/cli.ts --input s.md --stop-after validation
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
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { runPipeline } from './orchestrator';
import type { PipelineStage } from './schemas/common';
import type { PipelineConfig } from './core/config';

const SOURCES_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'sources');

const main = async () => {
  const { values } = parseArgs({
    options: {
      input: { type: 'string' },
      source: { type: 'string' },
      text: { type: 'string' },
      title: { type: 'string' },
      format: { type: 'string' },
      provider: { type: 'string' },
      out: { type: 'string' },
      'stop-after': { type: 'string' },
      'log-level': { type: 'string' },
    },
  });

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
  process.exit(anyFailed ? 2 : 0);
};

main().catch((err) => {
  console.error('Pipeline run failed:', err?.message ?? err);
  process.exit(1);
});
