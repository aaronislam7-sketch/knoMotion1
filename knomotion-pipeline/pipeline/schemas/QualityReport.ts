/**
 * QualityReport — machine quality signals + feedback-loop scaffold.
 *
 * Written by Stage 9 render-check (Sept M2): the `renderCheck` section records,
 * per scene and per sampled frame, how much of every configured slot actually
 * rendered and whether anything bled into the outer safe band. Its `issues`
 * are ValidationIssues (`blank_slot` / `edge_bleed`) so the orchestrator can
 * merge them into the validation report and hand them to repair.
 *
 * The rest of the contract is the creator-portal feedback loop (accept /
 * reject / edit events → fine-tuning dataset) and the PERSONALISED SCENES hook
 * (an optional audience/variant descriptor). Those parts are still scaffold.
 */

import { z } from 'zod';
import { withMeta } from './common';
import { PipelineStageSchema } from './common';
import { ValidationIssueSchema } from './ValidationReport';

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
    blankSlotRate: z.number().min(0).max(1).optional().describe('Share of (slot, frame) samples that rendered blank'),
    edgeBleedRate: z.number().min(0).max(1).optional().describe('Share of sampled frames with content in the safe band'),
    humanAcceptanceRate: z.number().min(0).max(1).optional().describe('Share of outputs accepted without edits'),
    narrationQuality: z.number().min(0).max(1).optional().describe('Rated narration quality (0–1)'),
  })
  .partial();
export type QualityScores = z.infer<typeof QualityScoresSchema>;

// ---------------------------------------------------------------------------
// Stage 9 render-check
// ---------------------------------------------------------------------------

export const RenderCheckStatusSchema = z.enum(['passed', 'failed', 'skipped']);
export type RenderCheckStatus = z.infer<typeof RenderCheckStatusSchema>;

export const SlotPixelStatsSchema = z.object({
  slot: z.string().min(1),
  area: z.number().int().min(0).describe('Pixels examined in the slot (at render scale)'),
  changed: z.number().int().min(0).describe('Pixels that differ from the background baseline'),
  coverage: z.number().min(0).max(1).describe('changed / area'),
  blank: z.boolean().describe('True when changed is below the blank threshold'),
});

export const EdgePixelStatsSchema = z.object({
  edge: z.enum(['top', 'right', 'bottom', 'left']),
  area: z.number().int().min(0),
  changed: z.number().int().min(0),
  coverage: z.number().min(0).max(1),
  bleed: z.boolean().describe('True when coverage exceeds the edge-bleed threshold'),
});

export const RenderCheckFrameSchema = z.object({
  label: z.enum(['settled', 'midpoint', 'pre-exit']),
  frame: z.number().int().min(0).describe('Scene-relative frame'),
  timeSec: z.number().min(0),
  still: z.string().optional().describe('Job-relative path of the PNG still, when kept'),
  slots: z.array(SlotPixelStatsSchema),
  edges: z.array(EdgePixelStatsSchema),
});

export const RenderCheckSceneSchema = z.object({
  sceneId: z.string().min(1),
  sceneIndex: z.number().int().min(0),
  frames: z.array(RenderCheckFrameSchema),
});

export const RenderCheckSchema = z.object({
  status: RenderCheckStatusSchema,
  skippedReason: z.string().optional().describe('Why no stills were rendered (renderer not installed, disabled, …)'),
  scale: z.number().positive().describe('Still render scale relative to native resolution'),
  framesPerScene: z.number().int().min(1),
  thresholds: z.object({
    pixelTolerance: z.number(),
    blankMinPixels: z.number(),
    edgeBleedMaxCoverage: z.number(),
  }),
  scenes: z.array(RenderCheckSceneSchema).default([]),
  issues: z.array(ValidationIssueSchema).default([]).describe('blank_slot / edge_bleed findings for the repair loop'),
  durationMs: z.number().int().min(0).optional(),
});
export type RenderCheck = z.infer<typeof RenderCheckSchema>;

export const QualityReportSchema = withMeta({
  videoId: z.string().min(1).describe('Video this report evaluates'),
  variant: AudienceVariantSchema.optional().describe('Personalisation variant, if any (scaffold)'),
  scores: QualityScoresSchema.optional().describe('Aggregate quality signals'),
  renderCheck: RenderCheckSchema.optional().describe('Stage 9 pixel checks on rendered stills'),
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
