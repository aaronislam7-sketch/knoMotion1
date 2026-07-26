/**
 * PipelinePreview — one-click preview of pipeline-generated video configs.
 *
 * The pipeline CLI (`npm run run -- preview <jobId>` from knomotion-pipeline/)
 * copies a generated 05-knomotion-video-config.json to
 * public/pipeline-preview/config.json. This composition fetches that file at
 * metadata-calculation time and renders it through GenericVideoPlayer — the
 * exact same code path as production renders.
 *
 * When no config has been staged (or it fails schema validation), the
 * composition renders a placeholder scene with instructions instead of
 * crashing, so the composition is always selectable in Studio.
 */

import { staticFile } from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';
import { calculateTransitionSeriesDuration } from '../sdk/transitions';
import { VideoConfigSchema } from '../sdk/schemas/videoConfig.schema';
import type { VideoConfig } from '../sdk/schemas/videoConfig.schema';

export const PREVIEW_CONFIG_STATIC_PATH = 'pipeline-preview/config.json';

/** Single-scene fallback shown when no valid pipeline config is staged. */
const placeholderConfig = (lines: string[]): VideoConfig =>
  VideoConfigSchema.parse({
    scenes: [
      {
        id: 'pipeline-preview-placeholder',
        durationInFrames: 300,
        config: {
          background: { preset: 'notebookSoft' },
          layout: { type: 'full' },
          slots: {
            full: {
              midScene: 'textReveal',
              stylePreset: 'educational',
              config: {
                lines: lines.map((text, i) => ({
                  text,
                  emphasis: i === 0 ? 'high' : 'normal',
                  beats: { start: 0.3 + i * 0.4, exit: 9.5 },
                })),
                revealType: 'fade',
                beats: { start: 0.3, exit: 9.5 },
              },
            },
          },
        },
      },
    ],
    format: 'desktop',
  });

const NO_CONFIG_PLACEHOLDER = placeholderConfig([
  'No pipeline config staged',
  'From knomotion-pipeline/, run:',
  'npm run run -- preview <jobId>',
  'then refresh this composition.',
]);

const metadataFor = (config: VideoConfig) => {
  const isMobile = config.format === 'mobile';
  return {
    props: config,
    durationInFrames: Math.max(1, calculateTransitionSeriesDuration(config.scenes, 20)),
    width: isMobile ? 1080 : 1920,
    height: isMobile ? 1920 : 1080,
  };
};

export const calculatePipelinePreviewMetadata: CalculateMetadataFunction<VideoConfig> = async ({
  abortSignal,
}) => {
  let raw: unknown;
  try {
    // Cache-bust so re-running `preview` shows the new config without a Studio restart.
    const res = await fetch(`${staticFile(PREVIEW_CONFIG_STATIC_PATH)}?v=${Date.now()}`, {
      signal: abortSignal,
    });
    if (!res.ok) return metadataFor(NO_CONFIG_PLACEHOLDER);
    raw = await res.json();
  } catch {
    return metadataFor(NO_CONFIG_PLACEHOLDER);
  }

  const parsed = VideoConfigSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return metadataFor(
      placeholderConfig([
        'Staged config failed schema validation',
        `${firstIssue?.path.join('.') ?? '?'}: ${firstIssue?.message ?? 'unknown issue'}`,
        'Re-run the pipeline or fix public/pipeline-preview/config.json.',
      ]),
    );
  }
  return metadataFor(parsed.data);
};
