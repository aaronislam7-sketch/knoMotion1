/**
 * VideoConfig Zod Schema — S1a
 *
 * Complete Zod schema for the KnoMotionVideo composition input props.
 * Enables Remotion Studio visual props editing when registered via
 * the `schema` prop on <Composition>.
 *
 * Audio/caption sub-schemas are composed from sdk/audio/audioSchema.ts (P4a).
 * Mid-scene config uses z.record() — per-mid-scene validation is handled
 * by the JSON schemas in sdk/mid-scenes/schemas/.
 *
 * @see BUILD_STATUS.md Section 5 — S1
 */

import { z } from 'zod';
import { AudioConfigSchema, CaptionsConfigSchema } from '../audio/audioSchema';

// ---------------------------------------------------------------------------
// Sub-schemas
// ---------------------------------------------------------------------------

const BeatsSchema = z
  .object({
    start: z.number().min(0).optional().describe('When element enters (seconds)'),
    exit: z.number().min(0).optional().describe('When element exits (seconds)'),
    hold: z.number().min(0).optional().describe('Duration to stay visible (seconds)'),
    emphasis: z.number().min(0).optional().describe('When to trigger emphasis animation (seconds)'),
  })
  .passthrough()
  .optional()
  .describe('Timing beats in seconds');

export const TransitionSchema = z
  .object({
    type: z
      .enum(['fade', 'slide', 'page-turn', 'clock-wipe', 'iris', 'doodle-wipe', 'eraser', 'spring'])
      .describe(
        'Transition type. Active: fade, slide, page-turn, clock-wipe, iris. Legacy (fall back to slide): doodle-wipe, eraser, spring.',
      ),
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
  .passthrough()
  .optional();

const ParticlesSchema = z
  .object({
    enabled: z.boolean().describe('Enable particle layer'),
    style: z
      .enum(['dots', 'chalk', 'snow', 'sparkle'])
      .optional()
      .describe('Particle animation style'),
    count: z.number().int().min(1).optional().describe('Particle count (default: 20)'),
    color: z.string().optional().describe('CSS color or theme key'),
    opacity: z.number().min(0).max(1).optional().describe('Particle opacity (0–1)'),
    speed: z.number().min(0).optional().describe('Animation speed multiplier'),
  })
  .optional();

const SpotlightSchema = z
  .object({
    x: z.number().optional().describe('X position (percentage)'),
    y: z.number().optional().describe('Y position (percentage)'),
    intensity: z.number().min(0).max(1).optional().describe('Spotlight intensity'),
  })
  .optional();

export const BackgroundSchema = z
  .object({
    preset: z
      .enum([
        'notebookSoft',
        'sunriseGradient',
        'cleanCard',
        'chalkboardGradient',
        'spotlight',
        'custom',
      ])
      .describe('Background preset name'),
    layerNoise: z.boolean().optional().describe('Add subtle film grain overlay'),
    particles: ParticlesSchema,
    spotlight: SpotlightSchema.describe('Spotlight config (only for spotlight preset)'),
    style: z.record(z.unknown()).optional().describe('Custom CSS style (only for custom preset)'),
  })
  .optional();

const LayoutOptionsSchema = z
  .object({
    rows: z.number().int().min(1).optional().describe('Number of rows (rowStack)'),
    columns: z.number().int().min(1).optional().describe('Number of columns (columnSplit)'),
    padding: z.number().min(0).optional().describe('Content padding in pixels'),
    gap: z.number().min(0).optional().describe('Gap between slots in pixels'),
  })
  .passthrough()
  .optional();

export const LayoutSchema = z
  .object({
    type: z
      .enum(['full', 'rowStack', 'columnSplit', 'headerRowColumns', 'gridSlots'])
      .describe('Layout type for viewport slot carving'),
    options: LayoutOptionsSchema,
  })
  .optional();

const MidSceneKeys = z.enum([
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
  // Registry aliases
  'textRevealSequence',
  'heroTextEntranceExit',
  'checklistReveal',
  'bubbleCalloutSequence',
  'callouts',
  'sideBySideCompare',
  'compare',
  'gridCardReveal',
  'cardGrid',
  'bigNumberReveal',
]);

const StylePresetSchema = z
  .enum(['educational', 'playful', 'minimal', 'mentor', 'focus'])
  .optional()
  .describe('Style preset controlling typography, doodle type, and animation tone');

const SlotConfigSchema = z.object({
  midScene: MidSceneKeys.describe('Mid-scene component key'),
  stylePreset: StylePresetSchema,
  config: z
    .record(z.unknown())
    .optional()
    .describe(
      'Mid-scene config object. Shape varies per midScene type — see sdk/mid-scenes/schemas/ for per-component validation.',
    ),
});

const SlotValueSchema = z.union([SlotConfigSchema, z.array(SlotConfigSchema)]).describe(
  'A single mid-scene config or an array for sequenced content in a slot',
);

const SlotsSchema = z
  .record(SlotValueSchema)
  .describe('Named slots mapped to mid-scene configs (e.g. header, row1, full, col1)');

// ---------------------------------------------------------------------------
// Scene config (the config field inside each scene item)
// ---------------------------------------------------------------------------

const SceneContentConfigSchema = z
  .object({
    background: BackgroundSchema,
    layout: LayoutSchema,
    slots: SlotsSchema.optional(),
    format: z.enum(['desktop', 'mobile']).optional(),
  })
  .passthrough()
  .describe('Scene visual configuration: background, layout, and slot contents');

// ---------------------------------------------------------------------------
// Scene item (one entry in the scenes array)
// ---------------------------------------------------------------------------

export const SceneItemSchema = z.object({
  id: z.string().describe('Unique scene identifier'),
  durationInFrames: z
    .number()
    .int()
    .min(1)
    .describe('Scene duration in frames at 30fps (e.g. 150 = 5 seconds)'),
  transition: TransitionSchema.describe('Transition into this scene (ignored for first scene)'),
  config: SceneContentConfigSchema.describe('Scene visual configuration'),
  audio: AudioConfigSchema.optional().describe(
    'Audio channels: narration, background music, sound effects',
  ),
  captions: CaptionsConfigSchema.optional().describe(
    'Word-level animated captions overlay',
  ),
});

// ---------------------------------------------------------------------------
// Top-level video config (input props for KnoMotionVideo)
// ---------------------------------------------------------------------------

export const VideoConfigSchema = z.object({
  scenes: z
    .array(SceneItemSchema)
    .min(1)
    .describe('Array of scene configurations in playback order'),
  format: z
    .enum(['desktop', 'mobile'])
    .optional()
    .default('desktop')
    .describe('Video format: desktop (1920×1080) or mobile (1080×1920)'),
});

export type VideoConfig = z.infer<typeof VideoConfigSchema>;
export type SceneItem = z.infer<typeof SceneItemSchema>;
export type SceneContentConfig = z.infer<typeof SceneContentConfigSchema>;
