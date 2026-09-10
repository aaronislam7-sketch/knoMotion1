/**
 * Captions (deferred to M5, deterministic). STUB.
 *
 * Input:  TTS audio + narration text
 * Output: CaptionsManifest.json
 *
 * Produces timed caption blocks aligned to real TTS audio durations. The
 * per-word block shape matches @remotion/captions (and the renderer's
 * `captions.data` format) exactly, so the assembly stage can drop these
 * straight into scene captions.
 */

import { z } from 'zod';
import { withMeta } from './common';

/** Word-level caption block — identical shape to the renderer's CaptionData. */
export const CaptionBlockSchema = z.object({
  text: z.string().describe('Word text. Include a leading space before each word, e.g. " brain"'),
  startMs: z.number().min(0).describe('Absolute start timestamp (ms)'),
  endMs: z.number().min(0).describe('Absolute end timestamp (ms)'),
  timestampMs: z.number().nullable().describe('Singular timestamp (nullable)'),
  confidence: z.number().nullable().describe('Transcription confidence (nullable)'),
});
export type CaptionBlock = z.infer<typeof CaptionBlockSchema>;

/** Captions for a single scene, aligned to that scene's narration audio. */
export const SceneCaptionsSchema = z.object({
  sceneId: z.string().min(1).describe('Scene these captions belong to'),
  audioPath: z.string().optional().describe('Audio file the captions were aligned against'),
  style: z
    .enum(['tiktok', 'subtitle', 'karaoke'])
    .optional()
    .describe('Requested caption style for this scene'),
  blocks: z.array(CaptionBlockSchema).default([]).describe('Word-level timed caption blocks'),
});
export type SceneCaptions = z.infer<typeof SceneCaptionsSchema>;

export const CaptionsManifestSchema = withMeta({
  videoId: z.string().min(1).describe('Video these captions belong to'),
  scenes: z.array(SceneCaptionsSchema).min(1).describe('Per-scene caption tracks'),
});
export type CaptionsManifest = z.infer<typeof CaptionsManifestSchema>;
