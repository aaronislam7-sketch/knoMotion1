/**
 * Shared contract primitives for the KnoMotion pipeline.
 *
 * Every stage produces a typed artifact. Each artifact carries an
 * `ArtifactMeta` envelope so that any output can be reviewed, replayed,
 * repaired, or evaluated independently of the run that produced it.
 *
 * These primitives are reused across stage schemas to keep the contract
 * surface small and consistent. Stage-specific shapes live in their own
 * files (e.g. ContentMap.ts, VideoPlan.ts).
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Pipeline stage identity
// ---------------------------------------------------------------------------

/**
 * Canonical stage identifiers. Used in artifact metadata and in the
 * orchestrator to key stage handlers. Listed in execution order (see
 * Sept_DevPlan.md §2). Stages marked (stub) have a named slot but no handler.
 */
export const PipelineStageSchema = z.enum([
  'intake', // 0 — deterministic
  'content-analysis', // 1 — LLM
  'module-planning', // 2 — LLM
  'video-planning', // 3 — LLM (per video)
  'script-generation', // 4 — LLM
  'tts', // 5 — deterministic provider call (mock | elevenlabs)
  'timing', // 6 — deterministic (audio -> scene durations + beat windows)
  'scene-json-generation', // 7 — LLM (constrained; timing injected)
  'validation', // 8 — deterministic
  'render-check', // 9 — deterministic (stub; M2)
  'repair', // 10 — LLM (on failure only)
  'assembly', // 11 — deterministic (audio wired into the config)
  'render', // 12 — deterministic (stub; M4)
  'captions', // deferred — deterministic (stub; M5)
]);
export type PipelineStage = z.infer<typeof PipelineStageSchema>;

/** Who produced an artifact — used to reason about determinism and cost. */
export const HandlerKindSchema = z.enum(['deterministic', 'llm']);
export type HandlerKind = z.infer<typeof HandlerKindSchema>;

// ---------------------------------------------------------------------------
// Artifact envelope
// ---------------------------------------------------------------------------

/**
 * Metadata attached to every stage output. The artifact trail is the whole
 * point of the pipeline: every output is debuggable, auditable, and
 * improvable, so each artifact records where it came from and how.
 */
export const ArtifactMetaSchema = z.object({
  jobId: z.string().min(1).describe('Run identifier; groups all artifacts of a single pipeline execution'),
  stage: PipelineStageSchema.describe('The stage that produced this artifact'),
  artifact: z.string().min(1).describe('Logical artifact name, e.g. "ContentMap"'),
  schemaVersion: z
    .string()
    .default('1.0')
    .describe('Contract version for this artifact shape; bump on breaking schema changes'),
  producedBy: HandlerKindSchema.describe('Whether a deterministic handler or an LLM produced this artifact'),
  model: z.string().optional().describe('LLM model identifier, when producedBy = "llm"'),
  promptVersion: z.string().optional().describe('Version of the prompt template used, when applicable'),
  createdAt: z.string().datetime().describe('ISO-8601 timestamp when the artifact was written'),
  inputs: z
    .array(z.string())
    .optional()
    .describe('Upstream artifact references this output was derived from (filenames or logical names)'),
  notes: z.string().optional().describe('Free-form processing notes for debugging/audit'),
});
export type ArtifactMeta = z.infer<typeof ArtifactMetaSchema>;

/**
 * Wraps a payload shape with the standard artifact envelope. Use this for
 * every stage output schema so all artifacts share a consistent `meta` field.
 *
 * @example
 *   export const FooArtifactSchema = withMeta({ value: z.string() });
 */
export const withMeta = <T extends z.ZodRawShape>(shape: T) =>
  z.object({ meta: ArtifactMetaSchema, ...shape });

// ---------------------------------------------------------------------------
// Shared content vocabulary (reused across content/planning stages)
// ---------------------------------------------------------------------------

/**
 * Renames object keys (alias -> canonical) when the canonical key is absent.
 * Used to absorb common LLM field-name drift (e.g. `problem` -> `description`)
 * inside a z.preprocess() before validation.
 */
export const renameKeys = (v: unknown, map: Record<string, string>): unknown => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return v;
  const o = { ...(v as Record<string, unknown>) };
  for (const [from, to] of Object.entries(map)) {
    if (from in o && !(to in o)) {
      o[to] = o[from];
      delete o[from];
    }
  }
  return o;
};

/**
 * Difficulty tag applied to concepts, briefs, and scene plans.
 * Tolerant of common LLM variants (case + synonyms like easy/medium/hard).
 */
export const DifficultySchema = z.preprocess((v) => {
  if (typeof v !== 'string') return v;
  const k = v.toLowerCase().trim();
  const map: Record<string, string> = {
    easy: 'beginner',
    basic: 'beginner',
    beginner: 'beginner',
    medium: 'intermediate',
    moderate: 'intermediate',
    intermediate: 'intermediate',
    hard: 'advanced',
    difficult: 'advanced',
    expert: 'advanced',
    advanced: 'advanced',
  };
  return map[k] ?? k;
}, z.enum(['beginner', 'intermediate', 'advanced']));
export type Difficulty = z.infer<typeof DifficultySchema>;

/**
 * Narrative role a scene plays in a video. Used by Stage 3 (planning) to
 * sequence the teaching flow before any KnoMotion JSON exists.
 */
export const ScenePurposeSchema = z.enum([
  'hook',
  'context',
  'concept',
  'example',
  'comparison',
  'demonstration',
  'summary',
  'cta',
]);
export type ScenePurpose = z.infer<typeof ScenePurposeSchema>;

/** Output video format, mirrored from the renderer's `format` prop. */
export const VideoFormatSchema = z.enum(['desktop', 'mobile']);
export type VideoFormat = z.infer<typeof VideoFormatSchema>;

// ---------------------------------------------------------------------------
// Renderer-aligned vocabulary
// ---------------------------------------------------------------------------
// These enums mirror the renderer's capability surface so planning stages can
// *suggest* only things the engine actually supports. The authoritative,
// strict copy used for final validation lives in KnoMotionVideoConfig.ts.
// Keep these in sync with:
//   KnoMotion-Videos/src/sdk/capability-manifest.json
//   KnoMotion-Videos/src/sdk/schemas/videoConfig.schema.ts
// ---------------------------------------------------------------------------

/** The 11 canonical mid-scene component keys (no registry aliases). */
export const MidSceneKeySchema = z.enum([
  'textReveal',
  'heroText',
  'gridCards',
  'checklist',
  'bubbleCallout',
  'sideBySide',
  'iconGrid',
  'cardSequence',
  'bigNumber',
  'animatedCounter',
  'codeBlock',
]);
export type MidSceneKey = z.infer<typeof MidSceneKeySchema>;

/** Layout types that carve the viewport into named slots. */
export const LayoutTypeSchema = z.enum([
  'full',
  'rowStack',
  'columnSplit',
  'headerRowColumns',
  'gridSlots',
]);
export type LayoutType = z.infer<typeof LayoutTypeSchema>;

/** Style presets controlling typography, doodle type, and animation tone. */
export const StylePresetSchema = z.enum(['educational', 'playful', 'minimal', 'mentor', 'focus']);
export type StylePreset = z.infer<typeof StylePresetSchema>;
