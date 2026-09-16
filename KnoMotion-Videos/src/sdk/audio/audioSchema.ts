/**
 * Audio & Captions Zod Schemas — P4a
 *
 * Defines the scene-level audio configuration types used by AudioLayer
 * and CaptionOverlay. These schemas will be composed into the full
 * VideoConfig Zod schema in S1a (Chunk 4).
 *
 * @see BUILD_STATUS.md Section 4 — P4a
 */

import { z } from 'zod';

/**
 * Audio sources are either absolute URLs or paths relative to public/ (resolved
 * by SafeAudio with staticFile()). Relative paths may not be rooted or traverse
 * upwards. Mirrored in knomotion-pipeline/pipeline/schemas/KnoMotionVideoConfig.ts.
 */
const RELATIVE_ASSET_PATH = /^(?!\/)(?!.*(^|\/)\.\.(\/|$))[^\s]+\.[A-Za-z0-9]+$/;

export const AudioSrcSchema = z
  .string()
  .min(1)
  .refine(
    (s) =>
      /^(https?:|data:|blob:)/.test(s)
        ? z.string().url().safeParse(s).success || /^(data|blob):/.test(s)
        : RELATIVE_ASSET_PATH.test(s),
    { message: 'audio src must be an absolute URL or a public-dir-relative asset path (no leading "/", no "..")' },
  );

export const NarrationSchema = z.object({
  src: AudioSrcSchema.describe('URL or public-dir-relative path to the TTS audio file'),
  startFromSeconds: z
    .number()
    .min(0)
    .optional()
    .describe('Offset in seconds to begin playback from'),
  volume: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('Narration volume (0–1). Defaults to 1.'),
});

export const MusicSchema = z.object({
  src: AudioSrcSchema.describe('URL or public-dir-relative path to background music file'),
  volume: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('Base volume (0–1). Typically 0.1–0.3 when under narration.'),
  fadeIn: z
    .number()
    .min(0)
    .optional()
    .describe('Fade-in duration in seconds'),
  fadeOut: z
    .number()
    .min(0)
    .optional()
    .describe('Fade-out duration in seconds'),
  loop: z
    .boolean()
    .optional()
    .describe('Whether to loop the music track. Defaults to true.'),
});

export const SfxItemSchema = z.object({
  src: AudioSrcSchema.describe('URL or public-dir-relative path to sound effect file'),
  atSecond: z
    .number()
    .min(0)
    .describe('When to trigger playback (scene-relative seconds)'),
  volume: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('SFX volume (0–1). Defaults to 0.5.'),
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
  enabled: z.boolean().optional().describe('Whether to render captions'),
  style: z
    .enum(['tiktok', 'subtitle', 'karaoke'])
    .optional()
    .describe('Caption visual style. Defaults to tiktok.'),
  data: z
    .array(CaptionDataSchema)
    .optional()
    .describe('Word-level caption data in @remotion/captions Caption format'),
  combineTokensWithinMilliseconds: z
    .number()
    .min(0)
    .optional()
    .describe(
      'How aggressively to group words into pages (ms). Lower = more word-by-word. Defaults to 800.',
    ),
});

export type AudioConfig = z.infer<typeof AudioConfigSchema>;
export type CaptionsConfig = z.infer<typeof CaptionsConfigSchema>;
export type NarrationConfig = z.infer<typeof NarrationSchema>;
export type MusicConfig = z.infer<typeof MusicSchema>;
export type SfxItem = z.infer<typeof SfxItemSchema>;
export type CaptionData = z.infer<typeof CaptionDataSchema>;
