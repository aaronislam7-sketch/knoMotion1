/**
 * QualityReport — feedback-loop & fine-tuning scaffold. OUT OF SCOPE — STUB.
 *
 * Not tied to a single pipeline stage. This is the contract that captures
 * human edits made in the creator portal (accept / reject / edit events) and
 * turns them, over time, into a fine-tuning dataset so the pipeline improves
 * from real corrections rather than guesswork.
 *
 * It also carries the hook for PERSONALISED SCENES: an optional audience/variant
 * descriptor so quality signals can be tracked per variant of the same source.
 * The contract exists now so the architecture does not close the door on it.
 */

import { z } from 'zod';
import { withMeta } from './common';
import { PipelineStageSchema } from './common';

/** The kind of human action recorded in the creator portal. */
export const EditEventTypeSchema = z.enum(['accept', 'reject', 'edit']);
export type EditEventType = z.infer<typeof EditEventTypeSchema>;

/** A single human correction captured for the feedback loop. */
export const HumanEditEventSchema = z.object({
  id: z.string().min(1).describe('Stable event id'),
  type: EditEventTypeSchema.describe('accept / reject / edit'),
  stage: PipelineStageSchema.describe('Which stage output the edit targets'),
  artifactPath: z.string().describe('JSON path within the artifact that was edited'),
  sceneId: z.string().optional().describe('Scene the edit applies to, when applicable'),
  before: z.unknown().optional().describe('Value before the human edit'),
  after: z.unknown().optional().describe('Value after the human edit'),
  editedBy: z.string().optional().describe('User/editor identifier'),
  editedAt: z.string().datetime().optional().describe('When the edit was made (ISO-8601)'),
  comment: z.string().optional().describe('Optional reviewer comment'),
});
export type HumanEditEvent = z.infer<typeof HumanEditEventSchema>;

/** Scaffold for personalised scene variants from the same source material. */
export const AudienceVariantSchema = z.object({
  variantId: z.string().min(1).describe('Stable id for this audience/variant'),
  audience: z.string().describe('Target audience / role / learning level'),
  description: z.string().optional().describe('How this variant differs from the base'),
});
export type AudienceVariant = z.infer<typeof AudienceVariantSchema>;

export const QualityScoresSchema = z
  .object({
    schemaValidity: z.number().min(0).max(1).optional().describe('Share of scenes passing validation first try'),
    repairRate: z.number().min(0).max(1).optional().describe('Share of scenes that needed repair'),
    humanAcceptanceRate: z.number().min(0).max(1).optional().describe('Share of outputs accepted without edits'),
    narrationQuality: z.number().min(0).max(1).optional().describe('Rated narration quality (0–1)'),
  })
  .partial();
export type QualityScores = z.infer<typeof QualityScoresSchema>;

export const QualityReportSchema = withMeta({
  videoId: z.string().min(1).describe('Video this report evaluates'),
  variant: AudienceVariantSchema.optional().describe('Personalisation variant, if any (scaffold)'),
  scores: QualityScoresSchema.optional().describe('Aggregate quality signals'),
  humanEdits: z
    .array(HumanEditEventSchema)
    .default([])
    .describe('Captured creator-portal edits feeding the fine-tuning dataset'),
  fineTuneCandidate: z
    .boolean()
    .default(false)
    .describe('Whether this run is a candidate for inclusion in the fine-tune/eval set'),
});
export type QualityReport = z.infer<typeof QualityReportSchema>;
