/**
 * Stage 11 — Assembly (deterministic). OUT OF SCOPE — STUB.
 *
 * Input:  KnoMotionVideoConfig.json + TTSManifest.json + CaptionsManifest.json
 * Output: RenderManifest.json
 *
 * Pure merge — no LLM. Combines validated scene JSON, audio paths, and captions
 * into the final render props handed to Stage 12 (render). Stage 10 (beat
 * alignment) has already reconciled scene beat timings against real audio
 * durations by this point, so the embedded config here is render-ready.
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
  /**
   * The exact props object passed to the renderer. Beat timings here are the
   * post-alignment values; audio/captions have been merged into each scene.
   */
  props: KnoMotionVideoConfigSchema.describe('Final, assembled renderer input props'),
  outputPath: z.string().optional().describe('Target path for the rendered MP4'),
});
export type RenderManifest = z.infer<typeof RenderManifestSchema>;
