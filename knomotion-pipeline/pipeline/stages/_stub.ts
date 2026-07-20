/**
 * Helper to define an out-of-scope stage stub that conforms to the Stage
 * interface but throws NotImplementedError when run. Keeps the orchestrator's
 * stage registry complete so these slots exist to grow into.
 */

import { z } from 'zod';
import { defineStage } from '../core/stage';
import { NotImplementedError } from '../core/errors';
import type { PipelineStage } from '../schemas/common';

export const defineStubStage = (name: PipelineStage) =>
  defineStage({
    name,
    handler: 'deterministic' as const,
    inputSchema: z.unknown(),
    outputSchema: z.unknown(),
    async run(): Promise<unknown> {
      throw new NotImplementedError(name);
    },
  });
