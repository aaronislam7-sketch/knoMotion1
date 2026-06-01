/**
 * Stage 6 — Deterministic Validation.
 *
 * Input:  KnoMotionVideoConfig.json
 * Output: ValidationReport.json
 *
 * Strict Zod schema validation plus deterministic business rules. Checks
 * mid-scene names, layout types, slot names, duration bounds, beat timings,
 * text length, audio URL validity, and unsupported keys. Nothing passes to
 * render without clearing this stage — the model is never trusted to
 * self-police.
 */

import { z } from 'zod';
import { withMeta } from './common';

/** Canonical rule identifiers checked by Stage 6. Extensible over time. */
export const ValidationRuleSchema = z.enum([
  'schema', // structural Zod validation against KnoMotionVideoConfigSchema
  'unknown_keys', // no undocumented keys (strict)
  'midscene_name', // midScene is a supported component/alias
  'layout_type', // layout.type is supported
  'slot_names', // slot names match the declared layout
  'slots_filled', // all declared slots are filled
  'sidebyside_layout', // sideBySide must use layout: full
  'duration_bounds', // durationInFrames within sane bounds
  'beat_timing', // beats in seconds, start < exit, within duration
  'text_length', // text/line/item counts within manifest limits
  'audio_url', // audio src values are valid, non-placeholder URLs
  'lottie_key', // heroRef lottie keys exist in the registry
  'transition_type', // transition.type is supported
]);
export type ValidationRule = z.infer<typeof ValidationRuleSchema>;

export const ValidationSeveritySchema = z.enum(['error', 'warning']);
export type ValidationSeverity = z.infer<typeof ValidationSeveritySchema>;

/** A single validation finding, tied to a location for surgical repair. */
export const ValidationIssueSchema = z.object({
  rule: ValidationRuleSchema.describe('Which rule produced this finding'),
  severity: ValidationSeveritySchema.describe('error blocks render; warning is advisory'),
  path: z
    .string()
    .min(1)
    .describe('JSON path to the offending value, e.g. "scenes[0].config.slots.col1"'),
  sceneId: z.string().optional().describe('Scene id the issue belongs to, when applicable'),
  sceneIndex: z.number().int().min(0).optional().describe('Scene index, for fast fragment lookup'),
  message: z.string().min(1).describe('Human-readable explanation of the problem'),
  expected: z.string().optional().describe('What was expected'),
  received: z.string().optional().describe('What was actually found'),
});
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;

/** Outcome of validation, used by the orchestrator to route to repair/render. */
export const ValidationStatusSchema = z.enum(['passed', 'failed', 'needs_review']);
export type ValidationStatus = z.infer<typeof ValidationStatusSchema>;

export const ValidationReportSchema = withMeta({
  videoId: z.string().min(1).describe('Video this report applies to'),
  status: ValidationStatusSchema.describe('passed → render; failed → repair; needs_review → human'),
  valid: z.boolean().describe('True iff there are zero error-severity issues'),
  sceneCount: z.number().int().min(0).describe('Number of scenes validated'),
  rulesChecked: z.array(ValidationRuleSchema).describe('Rules that were evaluated'),
  errors: z.array(ValidationIssueSchema).default([]).describe('Error-severity findings (block render)'),
  warnings: z.array(ValidationIssueSchema).default([]).describe('Warning-severity findings (advisory)'),
  repairAttempts: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe('How many repair attempts have been made so far (max 2 before needs_review)'),
});
export type ValidationReport = z.infer<typeof ValidationReportSchema>;
