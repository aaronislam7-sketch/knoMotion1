/**
 * Audio SDK — Barrel Exports
 *
 * Components and schemas for the KnoMotion audio layer (P4).
 */

export { AudioLayer } from './AudioLayer';
export { CaptionOverlay } from './CaptionOverlay';

export {
  AudioConfigSchema,
  CaptionsConfigSchema,
  NarrationSchema,
  MusicSchema,
  SfxItemSchema,
  CaptionDataSchema,
} from './audioSchema';

export type {
  AudioConfig,
  CaptionsConfig,
  NarrationConfig,
  MusicConfig,
  SfxItem,
  CaptionData,
} from './audioSchema';
