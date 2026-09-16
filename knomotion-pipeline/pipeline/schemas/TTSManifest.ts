/**
 * Stage 5 — TTS Generation (deterministic provider call).
 *
 * Input:  NarrationScript.json
 * Output: 04a-tts-manifest.json + audio files under videos/<id>/audio/
 *
 * One clip per scene narration so retries stay surgical and costs predictable.
 * Runs BEFORE scene JSON so real audio durations drive scene timing (Stage 6)
 * instead of the LLM guessing them.
 */

import { z } from 'zod';
import { withMeta } from './common';

/**
 * - generated: real audio exists at `audioPath`, timings measured by the provider
 * - estimated: no audio; `durationSeconds`/`wordTimings` synthesised from word count (mock provider)
 * - failed:    provider call failed; downstream falls back to the script estimate
 */
export const TTSClipStatusSchema = z.enum(['pending', 'generated', 'estimated', 'failed']);
export type TTSClipStatus = z.infer<typeof TTSClipStatusSchema>;

export const WordTimingSchema = z.object({
  word: z.string(),
  startMs: z.number().min(0),
  endMs: z.number().min(0),
});
export type WordTiming = z.infer<typeof WordTimingSchema>;

/** One synthesized narration clip, per scene. */
export const TTSClipSchema = z.object({
  sceneId: z.string().min(1).describe('Scene this clip narrates'),
  narrationText: z.string().min(1).describe('Exact text sent to the TTS provider'),
  status: TTSClipStatusSchema.describe('Generation status for this clip'),
  audioPath: z.string().optional().describe('Path to the audio file, relative to the job directory'),
  audioUrl: z.string().url().optional().describe('Hosted URL once uploaded (not used yet)'),
  durationSeconds: z.number().min(0).optional().describe('Measured (generated) or estimated audio duration'),
  voiceId: z.string().optional().describe('Provider voice id used'),
  cacheHit: z.boolean().optional().describe('True when the clip was served from the local TTS cache'),
  error: z.string().optional().describe('Provider error message when status = failed'),
  wordTimings: z.array(WordTimingSchema).optional().describe('Word-level timings (feeds Stage 6 timing and, later, captions)'),
});
export type TTSClip = z.infer<typeof TTSClipSchema>;

export const TTSManifestSchema = withMeta({
  videoId: z.string().min(1).describe('Video these clips belong to'),
  provider: z.string().describe('TTS provider identifier: "elevenlabs" | "mock"'),
  defaultVoiceId: z.string().optional().describe('Default voice used across clips'),
  modelId: z.string().optional().describe('Provider model id, when applicable'),
  clips: z.array(TTSClipSchema).min(1).describe('One clip per scene narration, in scene order'),
});
export type TTSManifest = z.infer<typeof TTSManifestSchema>;
