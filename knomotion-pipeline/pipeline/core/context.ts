/** PipelineContext — the shared services every stage handler receives. */

import type { PipelineConfig } from './config';
import type { Logger } from './logger';
import type { ArtifactStore } from './artifact-store';
import type { LLMClient } from './llm/client';
import type { ArtifactMeta, HandlerKind, PipelineStage } from '../schemas/common';

export interface MakeMetaOptions {
  producedBy: HandlerKind;
  model?: string;
  promptVersion?: string;
  inputs?: string[];
  notes?: string;
}

export interface PipelineContext {
  readonly jobId: string;
  readonly config: PipelineConfig;
  readonly logger: Logger;
  readonly store: ArtifactStore;
  readonly llm: LLMClient;
  /** Deterministic-ish clock; override in tests. */
  now(): Date;
  /** Builds a standard ArtifactMeta envelope for an artifact this run produces. */
  makeMeta(stage: PipelineStage, artifact: string, opts: MakeMetaOptions): ArtifactMeta;
}

export const createContext = (params: {
  jobId: string;
  config: PipelineConfig;
  logger: Logger;
  store: ArtifactStore;
  llm: LLMClient;
  now?: () => Date;
}): PipelineContext => {
  const now = params.now ?? (() => new Date());
  return {
    jobId: params.jobId,
    config: params.config,
    logger: params.logger,
    store: params.store,
    llm: params.llm,
    now,
    makeMeta(stage, artifact, opts) {
      return {
        jobId: params.jobId,
        stage,
        artifact,
        schemaVersion: '1.0',
        producedBy: opts.producedBy,
        model: opts.model,
        promptVersion: opts.promptVersion,
        createdAt: now().toISOString(),
        inputs: opts.inputs,
        notes: opts.notes,
      };
    },
  };
};
