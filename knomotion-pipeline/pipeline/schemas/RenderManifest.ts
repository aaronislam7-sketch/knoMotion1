/**
 * Stage 11 — Assembly (deterministic).
 *
 * Input:  KnoMotionVideoConfig.json + TTSManifest.json + SceneTiming.json
 * Output: 08-render-manifest.json
 *
 * Pure merge — no LLM. Combines the validated scene JSON with narration audio
 * paths into the final render props handed to Stage 12 (render). Timing was
 * already applied at Stage 7 from the same audio, so the embedded config is
 * render-ready. Captions (deferred) will merge here too.
 */

import { z } from 'zod';
import { withMeta } from './common';
import { KnoMotionVideoConfigSchema } from './KnoMotionVideoConfig';
import { VideoFormatSchema } from './common';

export const RenderManifestSchema = withMeta({
  videoId: z.string().min(1).describe('Video to be rendered'),
  compositionId: z
    .literal('KnoMotionVideo')
    .describe('The Remotion composition id — the sole renderer entry point'),
  format: VideoFormatSchema.describe('Output format (drives dimensions)'),
  /** The exact props object passed to the renderer, with narration audio merged into each scene. */
  props: KnoMotionVideoConfigSchema.describe('Final, assembled renderer input props'),
  outputPath: z.string().optional().describe('Target path for the rendered MP4'),
});
export type RenderManifest = z.infer<typeof RenderManifestSchema>;
