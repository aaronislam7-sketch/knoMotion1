/**
 * Stage contract — the uniform shape every stage implements.
 *
 * The orchestrator treats LLM and deterministic stages identically: validate
 * input against the contract, run, then the artifact-store validates output on
 * write. Stages never call each other; they only consume/produce artifacts.
 *
 * Generics are over the Zod schemas (not bare types) and use `z.infer`
 * (parsed/output types) consistently for both input and output, so fields with
 * `.default()` don't cause input/output type divergence.
 */

import { z } from 'zod';
import type { PipelineContext } from './context';
import type { HandlerKind, PipelineStage } from '../schemas/common';
import { ContractError } from './errors';

export interface Stage<In extends z.ZodTypeAny, Out extends z.ZodTypeAny> {
  readonly name: PipelineStage;
  readonly handler: HandlerKind;
  /** Schema for this stage's typed input (the compressed handoff from upstream). */
  readonly inputSchema: In;
  /** Schema for the full output artifact (including meta, where applicable). */
  readonly outputSchema: Out;
  run(input: z.infer<In>, ctx: PipelineContext): Promise<z.infer<Out>>;
}

export const defineStage = <In extends z.ZodTypeAny, Out extends z.ZodTypeAny>(
  def: Stage<In, Out>,
): Stage<In, Out> => def;

/** Validates input against the stage contract, runs it, and returns the output. */
export const runStage = async <In extends z.ZodTypeAny, Out extends z.ZodTypeAny>(
  stage: Stage<In, Out>,
  rawInput: unknown,
  ctx: PipelineContext,
): Promise<z.infer<Out>> => {
  const parsed = stage.inputSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new ContractError(`Stage "${stage.name}" received invalid input`, parsed.error.flatten());
  }
  return stage.run(parsed.data, ctx);
};
