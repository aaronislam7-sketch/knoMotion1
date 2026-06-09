/** Runtime configuration for a pipeline run. Validated with Zod. */

import { z } from 'zod';
import { PipelineStageSchema } from '../schemas/common';

export const LLMProviderSchema = z.enum(['openai', 'mock']);
export type LLMProvider = z.infer<typeof LLMProviderSchema>;

export const PipelineConfigSchema = z.object({
  provider: LLMProviderSchema.default('mock').describe('LLM provider. "mock" runs the chain deterministically without API calls.'),
  defaultModel: z.string().default('gpt-4o').describe('Default model for LLM stages'),
  /** Per-stage model overrides — lets us route stages to different models/providers later. */
  stageModels: z.record(PipelineStageSchema, z.string()).default({}),
  temperature: z.number().min(0).max(2).default(0.4),
  maxRepairAttempts: z.number().int().min(0).max(2).default(2).describe('Stage 7 cap before needs_review'),
  llmMaxRetries: z.number().int().min(0).max(3).default(1).describe('Corrective retries on invalid LLM JSON'),
  artifactsDir: z.string().default('pipeline/artifacts').describe('Root directory for job artifact output'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  openaiApiKey: z.string().optional().describe('OpenAI API key (from env OPENAI_API_KEY)'),
});

export type PipelineConfig = z.infer<typeof PipelineConfigSchema>;

/** Builds a validated config from defaults, environment, and explicit overrides. */
export const loadConfig = (overrides: Partial<PipelineConfig> = {}): PipelineConfig => {
  const fromEnv: Partial<PipelineConfig> = {
    provider: (process.env.KNOMOTION_PROVIDER as LLMProvider) || undefined,
    defaultModel: process.env.KNOMOTION_MODEL || undefined,
    logLevel: (process.env.KNOMOTION_LOG_LEVEL as PipelineConfig['logLevel']) || undefined,
    artifactsDir: process.env.KNOMOTION_ARTIFACTS_DIR || undefined,
    openaiApiKey: process.env.OPENAI_API_KEY || undefined,
  };
  const merged = {
    ...stripUndefined(fromEnv),
    ...stripUndefined(overrides),
  };
  return PipelineConfigSchema.parse(merged);
};

export const modelForStage = (config: PipelineConfig, stage: z.infer<typeof PipelineStageSchema>): string =>
  config.stageModels[stage] ?? config.defaultModel;

const stripUndefined = <T extends Record<string, unknown>>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
