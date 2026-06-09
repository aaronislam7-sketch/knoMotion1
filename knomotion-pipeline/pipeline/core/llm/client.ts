/** Provider-agnostic LLM client contract used by all LLM stages. */

import type { z } from 'zod';

export interface LLMUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface LLMRequest<T> {
  /** System prompt — role, constraints, output rules. */
  system: string;
  /** User prompt — the compressed, stage-specific input serialized for the model. */
  user: string;
  /**
   * Zod schema the response is parsed/validated against (the artifact PAYLOAD, without meta).
   * Pinned to Output = T (Input = any) so schemas with `.default()` infer T as the parsed
   * output type rather than the looser input type.
   */
  schema: z.ZodType<T, z.ZodTypeDef, any>;
  /** Human-readable schema name, used for routing mock fixtures and for logs. */
  schemaName: string;
  /** Model id; falls back to the client/config default if omitted. */
  model?: string;
  temperature?: number;
  /** Corrective retries on invalid JSON before failing. */
  maxRetries?: number;
  /**
   * Structured input object. Real providers ignore this (they use `system`/`user`);
   * the mock provider uses it to synthesize deterministic, input-aware responses.
   */
  input?: unknown;
}

export interface LLMResult<T> {
  data: T;
  raw: string;
  model: string;
  usage?: LLMUsage;
}

export interface LLMClient {
  readonly name: string;
  complete<T>(req: LLMRequest<T>): Promise<LLMResult<T>>;
}
