/**
 * Stage 8 — TTS Generation (deterministic API call). OUT OF SCOPE — STUB.
 *
 * Input:  NarrationScript.json
 * Output: TTSManifest.json + audio files
 *
 * Called per scene narration so retries stay surgical and costs predictable.
 * The contract is defined now so downstream stages (captions, beat alignment,
 * assembly) can be wired against a stable shape; the handler is not yet built.
 */

import { z } from 'zod';
import { withMeta } from './common';

export const TTSClipStatusSchema = z.enum(['pending', 'generated', 'failed']);
export type TTSClipStatus = z.infer<typeof TTSClipStatusSchema>;

/** One synthesized narration clip, per scene. */
export const TTSClipSchema = z.object({
  sceneId: z.string().min(1).describe('Scene this clip narrates'),
  narrationText: z.string().min(1).describe('Exact text sent to the TTS provider'),
  status: TTSClipStatusSchema.describe('Generation status for this clip'),
  audioPath: z.string().optional().describe('Local path to the generated audio file in the job directory'),
  audioUrl: z.string().url().optional().describe('Hosted URL once uploaded (used by the renderer audio block)'),
  durationSeconds: z.number().min(0).optional().describe('Real measured audio duration (feeds Stage 10)'),
  voiceId: z.string().optional().describe('Provider voice id used'),
  wordTimings: z
    .array(
      z.object({
        word: z.string(),
        startMs: z.number().min(0),
        endMs: z.number().min(0),
      }),
    )
    .optional()
    .describe('Word-level timings if the provider returns them (feeds Stage 9 captions)'),
});
export type TTSClip = z.infer<typeof TTSClipSchema>;

export const TTSManifestSchema = withMeta({
  videoId: z.string().min(1).describe('Video these clips belong to'),
  provider: z.string().optional().describe('TTS provider identifier, e.g. "elevenlabs"'),
  defaultVoiceId: z.string().optional().describe('Default voice used across clips'),
  clips: z.array(TTSClipSchema).min(1).describe('One clip per scene narration'),
});
export type TTSManifest = z.infer<typeof TTSManifestSchema>;
