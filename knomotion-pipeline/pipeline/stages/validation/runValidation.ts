/**
 * Stage 6 — Deterministic Validation.
 * { videoId, KnoMotionVideoConfig } -> ValidationReport.
 *
 * Delegates to the rule engine (validate.ts), which runs the deterministic
 * business rules — including DEEP per-mid-scene config validation against the
 * renderer's JSON Schemas (ajv, via the capability bridge). Nothing reaches
 * render without clearing this stage.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { KnoMotionVideoConfigSchema } from '../../schemas/KnoMotionVideoConfig';
import { ValidationReportSchema } from '../../schemas/ValidationReport';
import { loadRendererCapabilities } from '../../core/capabilities/renderer-capabilities';
import { validateConfig, rulesChecked } from './validate';

export const ValidationInputSchema = z.object({
  videoId: z.string().min(1),
  config: KnoMotionVideoConfigSchema,
});

export const validationStage = defineStage({
  name: 'validation',
  handler: 'deterministic',
  inputSchema: ValidationInputSchema,
  outputSchema: ValidationReportSchema,
  async run(input, ctx) {
    const caps = await loadRendererCapabilities();
    const issues = validateConfig(input.config, caps);

    const errors = issues.filter((i) => i.severity === 'error');
    const warnings = issues.filter((i) => i.severity === 'warning');
    const valid = errors.length === 0;
    const status: 'passed' | 'failed' = valid ? 'passed' : 'failed';

    if (!valid) {
      ctx.logger.warn('Validation found errors', { videoId: input.videoId, errors: errors.length, warnings: warnings.length });
    }

    return {
      meta: ctx.makeMeta('validation', 'ValidationReport', { producedBy: 'deterministic', inputs: ['KnoMotionVideoConfig'] }),
      videoId: input.videoId,
      status,
      valid,
      sceneCount: input.config.scenes.length,
      rulesChecked: rulesChecked(),
      errors,
      warnings,
      repairAttempts: 0,
    };
  },
});
