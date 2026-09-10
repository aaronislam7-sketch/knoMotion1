/** Runtime configuration for a pipeline run. Validated with Zod. */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { PipelineStageSchema } from '../schemas/common';
import { DEFAULT_MODEL, STAGE_MODELS } from '../config/models';

export const LLMProviderSchema = z.enum(['openai', 'mock']);
export type LLMProvider = z.infer<typeof LLMProviderSchema>;

export const TTSProviderSchema = z.enum(['elevenlabs', 'mock']);
export type TTSProvider = z.infer<typeof TTSProviderSchema>;

/** ElevenLabs premade voice "Rachel" — a neutral narration default; override per run. */
export const DEFAULT_ELEVENLABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
export const DEFAULT_ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';

/** <repo root>/public — where Remotion's staticFile() resolves relative asset paths. */
const defaultPublicDir = (): string =>
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public');

export const PipelineConfigSchema = z.object({
  provider: LLMProviderSchema.default('mock').describe('LLM provider. "mock" runs the chain deterministically without API calls.'),
  defaultModel: z.string().default(DEFAULT_MODEL).describe('Default model for LLM stages (see pipeline/config/models.ts)'),
  /** Per-stage model overrides — see pipeline/config/models.ts for the defaults and rationale. */
  stageModels: z.record(PipelineStageSchema, z.string()).default(STAGE_MODELS),
  temperature: z.number().min(0).max(2).default(0.4),
  maxRepairAttempts: z.number().int().min(0).max(2).default(2).describe('Repair (Stage 10) cap before needs_review'),
  llmMaxRetries: z.number().int().min(0).max(3).default(2).describe('Corrective retries on invalid LLM JSON (so 3 attempts total)'),
  artifactsDir: z.string().default('pipeline/artifacts').describe('Root directory for job artifact output'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  openaiApiKey: z.string().optional().describe('OpenAI API key (from env OPENAI_API_KEY)'),

  // --- TTS (Stage 5) -------------------------------------------------------
  ttsProvider: TTSProviderSchema.default('mock').describe('TTS provider. "mock" synthesises timings from word count, no audio.'),
  elevenLabsApiKey: z.string().optional().describe('ElevenLabs API key (from env ELEVENLABS_API_KEY)'),
  elevenLabsVoiceId: z.string().default(DEFAULT_ELEVENLABS_VOICE_ID).describe('ElevenLabs voice id (env ELEVENLABS_VOICE_ID)'),
  elevenLabsModelId: z.string().default(DEFAULT_ELEVENLABS_MODEL_ID).describe('ElevenLabs model id (env ELEVENLABS_MODEL_ID)'),
  ttsCacheDir: z.string().default('pipeline/cache/tts').describe('Clips are cached by hash of provider|voice|model|text so prompt iteration does not re-bill'),

  // --- Assembly (Stage 11) -------------------------------------------------
  publicDir: z
    .string()
    .default(defaultPublicDir())
    .describe('Remotion public dir; assembly copies narration audio under <publicDir>/pipeline-audio/'),
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
    ttsProvider: (process.env.KNOMOTION_TTS_PROVIDER as TTSProvider) || undefined,
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || undefined,
    elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID || undefined,
    elevenLabsModelId: process.env.ELEVENLABS_MODEL_ID || undefined,
    ttsCacheDir: process.env.KNOMOTION_TTS_CACHE_DIR || undefined,
    publicDir: process.env.KNOMOTION_PUBLIC_DIR || undefined,
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
