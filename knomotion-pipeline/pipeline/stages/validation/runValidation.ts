/**
 * Stage 6 — Deterministic Validation.
 * { videoId, KnoMotionVideoConfig } -> ValidationReport.
 *
 * NOTE (P0): ships a minimal rule set (structural schema + duration bounds).
 * The full rule engine — slot-name/layout matching, sideBySide layout rule,
 * deep per-mid-scene config validation via the renderer JSON schemas (ajv),
 * beat timing, text length, audio-url, lottie-key — lands in P2.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { KnoMotionVideoConfigSchema } from '../../schemas/KnoMotionVideoConfig';
import { ValidationReportSchema } from '../../schemas/ValidationReport';
import type { ValidationIssue, ValidationRule } from '../../schemas/ValidationReport';

export const ValidationInputSchema = z.object({
  videoId: z.string().min(1),
  config: KnoMotionVideoConfigSchema,
});

const RULES_CHECKED: ValidationRule[] = ['schema', 'duration_bounds'];

export const validationStage = defineStage({
  name: 'validation',
  handler: 'deterministic',
  inputSchema: ValidationInputSchema,
  outputSchema: ValidationReportSchema,
  async run(input, ctx) {
    const issues: ValidationIssue[] = [];

    // Rule: schema (structural). Re-validate defensively.
    const parsed = KnoMotionVideoConfigSchema.safeParse(input.config);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        issues.push({
          rule: 'schema',
          severity: 'error',
          path: `scenes${issue.path.length ? '.' + issue.path.join('.') : ''}`,
          message: issue.message,
        });
      }
    }

    // Rule: duration_bounds.
    input.config.scenes.forEach((scene, i) => {
      if (!Number.isInteger(scene.durationInFrames) || scene.durationInFrames < 1) {
        issues.push({
          rule: 'duration_bounds',
          severity: 'error',
          path: `scenes[${i}].durationInFrames`,
          sceneId: scene.id,
          sceneIndex: i,
          message: 'durationInFrames must be a positive integer',
          received: String(scene.durationInFrames),
        });
      }
    });

    const errors = issues.filter((i) => i.severity === 'error');
    const warnings = issues.filter((i) => i.severity === 'warning');
    const valid = errors.length === 0;
    const status: 'passed' | 'failed' = valid ? 'passed' : 'failed';

    return {
      meta: ctx.makeMeta('validation', 'ValidationReport', { producedBy: 'deterministic', inputs: ['KnoMotionVideoConfig'] }),
      videoId: input.videoId,
      status,
      valid,
      sceneCount: input.config.scenes.length,
      rulesChecked: RULES_CHECKED,
      errors,
      warnings,
      repairAttempts: 0,
    };
  },
});
