/**
 * Stage 5 — Scene JSON Generation (LLM, heavily constrained).
 *
 * Input:  VideoPlan.json, NarrationScript.json, capability manifest
 * Output: KnoMotionVideoConfig.json
 *
 * THE ONLY COUPLING POINT between the pipeline and the renderer.
 *
 * This schema is a faithful, standalone mirror of the renderer's input-props
 * schema so that any config which passes here is guaranteed to be renderable.
 * It is intentionally a *copy* (not an import) to keep the pipeline a separate,
 * independently deployable package whose sole contract with the renderer is
 * this JSON shape.
 *
 * ⚠️ KEEP IN SYNC with:
 *   KnoMotion-Videos/src/sdk/schemas/videoConfig.schema.ts
 *   KnoMotion-Videos/src/sdk/audio/audioSchema.ts
 *   KnoMotion-Videos/src/sdk/capability-manifest.json
 *
 * Note: this file defines the *structural* contract (what the renderer
 * accepts). Stage 6 (validation) layers additional deterministic business
 * rules on top — strict unknown-key rejection, slot-name/layout matching,
 * the `sideBySide` layout rule, duration/beat bounds, and audio-URL validity —
 * see ValidationReport.ts.
 */

import { z } from 'zod';
import { LayoutTypeSchema, MidSceneKeySchema, StylePresetSchema, VideoFormatSchema } from './common';

// ---------------------------------------------------------------------------
// Controlled-vocabulary coercions
// ---------------------------------------------------------------------------
// LLMs frequently confuse the engine's separate vocabularies (background presets
// vs style presets vs layout types vs mid-scenes) or invent near-miss values.
// These maps fold the common confusions back onto valid values so a near-miss
// renders rather than hard-failing. Genuinely meaningful mistakes still surface
// elsewhere (e.g. an unsupported mid-scene is caught by Stage 6).

const BACKGROUND_PRESETS = ['notebookSoft', 'sunriseGradient', 'cleanCard', 'chalkboardGradient', 'spotlight', 'custom'];
const BACKGROUND_ALIASES: Record<string, string> = {
  // style-preset names the model wrongly puts in background.preset → their default background
  focus: 'spotlight',
  minimal: 'cleanCard',
  playful: 'sunriseGradient',
  educational: 'notebookSoft',
  mentor: 'chalkboardGradient',
  // common synonyms
  clean: 'cleanCard',
  white: 'cleanCard',
  plain: 'cleanCard',
  dark: 'chalkboardGradient',
  chalkboard: 'chalkboardGradient',
  notebook: 'notebookSoft',
  paper: 'notebookSoft',
  gradient: 'sunriseGradient',
  sunrise: 'sunriseGradient',
  none: 'cleanCard',
};
const coerceBackgroundPreset = (p: string): string => {
  if (BACKGROUND_PRESETS.includes(p)) return p;
  return BACKGROUND_ALIASES[p.toLowerCase().trim()] ?? 'cleanCard';
};

const LAYOUT_TYPES = ['full', 'rowStack', 'columnSplit', 'headerRowColumns', 'gridSlots'];
const LAYOUT_ALIASES: Record<string, string> = {
  twocolumn: 'columnSplit',
  'two-column': 'columnSplit',
  twocolumns: 'columnSplit',
  columns: 'columnSplit',
  column: 'columnSplit',
  columnsplit: 'columnSplit',
  sidebyside: 'full', // sideBySide is a mid-scene used with layout:full
  'side-by-side': 'full',
  rows: 'rowStack',
  row: 'rowStack',
  rowstack: 'rowStack',
  stack: 'rowStack',
  stacked: 'rowStack',
  grid: 'gridSlots',
  gridslots: 'gridSlots',
  single: 'full',
  fullscreen: 'full',
  centered: 'full',
};
const coerceLayoutType = (t: string): string => {
  if (LAYOUT_TYPES.includes(t)) return t;
  return LAYOUT_ALIASES[t.toLowerCase().trim()] ?? 'full';
};

// ---------------------------------------------------------------------------
// Beats
// ---------------------------------------------------------------------------

export const BeatsSchema = z
  .object({
    start: z.number().min(0).optional().describe('When element enters (seconds)'),
    exit: z.number().min(0).optional().describe('When element exits (seconds)'),
    hold: z.number().min(0).optional().describe('Duration to stay visible (seconds)'),
    emphasis: z.number().min(0).optional().describe('When to trigger emphasis animation (seconds)'),
    entrance: z.number().min(0).optional().describe('Hero entrance time (seconds)'),
  })
  .passthrough()
  .describe('Timing beats in seconds');

// ---------------------------------------------------------------------------
// Transition
// ---------------------------------------------------------------------------

export const TransitionSchema = z
  .object({
    type: z
      .enum(['fade', 'slide', 'page-turn', 'clock-wipe', 'iris', 'doodle-wipe', 'eraser', 'spring'])
      .describe('Transition type. Active: fade, slide, page-turn, clock-wipe, iris.'),
    direction: z
      .enum(['up', 'down', 'left', 'right'])
      .optional()
      .describe('Direction for slide and page-turn transitions'),
    durationInFrames: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe('Override transition duration in frames (default: 20)'),
  })
  .passthrough();

// ---------------------------------------------------------------------------
// Background
// ---------------------------------------------------------------------------

const ParticlesSchema = z
  .object({
    enabled: z.boolean(),
    style: z.enum(['dots', 'chalk', 'snow', 'sparkle']).optional(),
    count: z.number().int().min(1).optional(),
    color: z.string().optional(),
    opacity: z.number().min(0).max(1).optional(),
    speed: z.number().min(0).optional(),
  })
  .optional();

const SpotlightSchema = z
  .object({
    x: z.number().optional(),
    y: z.number().optional(),
    intensity: z.number().min(0).max(1).optional(),
  })
  .optional();

export const BackgroundSchema = z
  .preprocess(
    // Tolerate `background: "sunriseGradient"` → `{ preset: "sunriseGradient" }`,
    // and fold style-preset / synonym values onto a valid background preset.
    (v) => {
      let obj: any = typeof v === 'string' ? { preset: v } : v;
      if (obj && typeof obj === 'object' && typeof obj.preset === 'string') {
        obj = { ...obj, preset: coerceBackgroundPreset(obj.preset) };
      }
      return obj;
    },
    z.object({
      preset: z.enum([
        'notebookSoft',
        'sunriseGradient',
        'cleanCard',
        'chalkboardGradient',
        'spotlight',
        'custom',
      ]),
      layerNoise: z.boolean().optional(),
      particles: ParticlesSchema,
      spotlight: SpotlightSchema,
      style: z.record(z.unknown()).optional(),
    }),
  )
  .optional();

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

const LayoutOptionsSchema = z
  .object({
    rows: z.number().int().min(1).optional(),
    columns: z.number().int().min(1).optional(),
    padding: z.number().min(0).optional(),
    gap: z.number().min(0).optional(),
    titleHeight: z.number().min(0).optional(),
    rowRatios: z.array(z.number()).optional(),
    ratios: z.array(z.number()).optional(),
  })
  .passthrough()
  .optional();

export const LayoutSchema = z
  .preprocess(
    // Tolerate `layout: "full"` → `{ type: "full" }`, and fold layout synonyms /
    // mis-used mid-scene names (e.g. "sideBySide", "twoColumn") onto a valid type.
    (v) => {
      let obj: any = typeof v === 'string' ? { type: v } : v;
      if (obj && typeof obj === 'object' && typeof obj.type === 'string') {
        obj = { ...obj, type: coerceLayoutType(obj.type) };
      }
      return obj;
    },
    z.object({
      type: LayoutTypeSchema,
      options: LayoutOptionsSchema,
    }),
  )
  .optional();

// ---------------------------------------------------------------------------
// Slots
// ---------------------------------------------------------------------------
// IMPORTANT: only the 11 canonical mid-scene keys are accepted.
//
// The renderer's own Zod schema (videoConfig.schema.ts MidSceneKeys) also lists
// registry aliases (e.g. 'textRevealSequence', 'gridCardReveal', 'codeBlockScene',
// 'code'), but SceneRenderer.jsx resolves midScene via a direct
// MID_SCENE_COMPONENTS[midScene] lookup with NO alias normalisation — so those
// aliases pass validation yet render an EMPTY slot. To guarantee renderable
// output, the pipeline restricts Stage 5 to canonical keys only.
// See capability-manifest.json -> knownIssues: "midscene-aliases-not-resolved".

export const SlotConfigSchema = z.object({
  midScene: MidSceneKeySchema.describe('Mid-scene component key (canonical keys only — aliases are not rendered)'),
  stylePreset: StylePresetSchema.optional(),
  config: z
    .record(z.unknown())
    .optional()
    .describe('Mid-scene config. Per-mid-scene validation handled by Stage 6 business rules.'),
});
export type SlotConfig = z.infer<typeof SlotConfigSchema>;

export const SlotValueSchema = z
  .union([SlotConfigSchema, z.array(SlotConfigSchema)])
  .describe('A single mid-scene config or an array for sequenced content in a slot');

export const SlotsSchema = z
  .record(SlotValueSchema)
  .describe('Named slots mapped to mid-scene configs (e.g. header, row1, full, col1)');

// ---------------------------------------------------------------------------
// Scene content config
// ---------------------------------------------------------------------------

export const SceneContentConfigSchema = z
  .object({
    background: BackgroundSchema,
    layout: LayoutSchema,
    slots: SlotsSchema.optional(),
    format: VideoFormatSchema.optional(),
  })
  .passthrough();

// ---------------------------------------------------------------------------
// Audio & captions (mirror of sdk/audio/audioSchema.ts)
// ---------------------------------------------------------------------------
// Audio URLs MUST be valid. If no real audio is available, omit the `audio`
// block entirely — never emit placeholder URLs. This is enforced both by the
// `.url()` checks below and by Stage 6 business rules.

export const NarrationSchema = z.object({
  src: z.string().url().describe('URL to the TTS audio file'),
  startFromSeconds: z.number().min(0).optional(),
  volume: z.number().min(0).max(1).optional(),
});

export const MusicSchema = z.object({
  src: z.string().url().describe('URL to background music file'),
  volume: z.number().min(0).max(1).optional(),
  fadeIn: z.number().min(0).optional(),
  fadeOut: z.number().min(0).optional(),
  loop: z.boolean().optional(),
});

export const SfxItemSchema = z.object({
  src: z.string().url().describe('URL to sound effect file'),
  atSecond: z.number().min(0),
  volume: z.number().min(0).max(1).optional(),
});

export const AudioConfigSchema = z.object({
  narration: NarrationSchema.optional(),
  music: MusicSchema.optional(),
  sfx: z.array(SfxItemSchema).optional(),
});

export const CaptionDataSchema = z.object({
  text: z.string(),
  startMs: z.number().min(0),
  endMs: z.number().min(0),
  timestampMs: z.number().nullable(),
  confidence: z.number().nullable(),
});

export const CaptionsConfigSchema = z.object({
  enabled: z.boolean().optional(),
  style: z.enum(['tiktok', 'subtitle', 'karaoke']).optional(),
  data: z.array(CaptionDataSchema).optional(),
  combineTokensWithinMilliseconds: z.number().min(0).optional(),
});

// ---------------------------------------------------------------------------
// Scene item & top-level config
// ---------------------------------------------------------------------------

export const SceneItemSchema = z.preprocess(
  (v) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return v;
    const o = { ...(v as Record<string, unknown>) };
    // Lift flat scene fields into `config` if the model forgot the wrapper.
    if (o.config == null && (o.background != null || o.layout != null || o.slots != null)) {
      o.config = { background: o.background, layout: o.layout, slots: o.slots };
      delete o.background;
      delete o.layout;
      delete o.slots;
    }
    // Coerce a seconds-based duration into frames if durationInFrames is absent.
    if (o.durationInFrames == null) {
      const secs = o.durationSeconds ?? o.durationInSeconds ?? o.duration;
      if (typeof secs === 'number') o.durationInFrames = Math.max(1, Math.round(secs * 30));
    }
    return o;
  },
  z.object({
    id: z.string().min(1).describe('Unique scene identifier (kebab-case)'),
    durationInFrames: z
      .number()
      .int()
      .min(1)
      .describe('Scene duration in frames at 30fps (e.g. 150 = 5 seconds)'),
    transition: TransitionSchema.optional().describe('Transition into this scene (ignored for first scene)'),
    config: SceneContentConfigSchema.describe('Scene visual configuration'),
    audio: AudioConfigSchema.optional().describe('Audio channels: narration, music, sfx'),
    captions: CaptionsConfigSchema.optional().describe('Word-level animated captions overlay'),
  }),
);
export type SceneItem = z.infer<typeof SceneItemSchema>;

/**
 * The renderer's input props. This is exactly what `KnoMotionVideo` consumes;
 * the produced KnoMotionVideoConfig.json must match this shape and nothing more.
 */
export const KnoMotionVideoConfigSchema = z.object({
  scenes: z
    .preprocess(
      // Drop non-object junk (bare strings/numbers) the model sometimes mixes into
      // the scenes array, so one stray element can't fail the whole video.
      (v) => (Array.isArray(v) ? v.filter((s) => s && typeof s === 'object' && !Array.isArray(s)) : v),
      z.array(SceneItemSchema).min(1),
    )
    .describe('Array of scene configurations in playback order'),
  format: VideoFormatSchema.optional().default('desktop').describe('desktop (1920×1080) or mobile (1080×1920)'),
});
export type KnoMotionVideoConfig = z.infer<typeof KnoMotionVideoConfigSchema>;
