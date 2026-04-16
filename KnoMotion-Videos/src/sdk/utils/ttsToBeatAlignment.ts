/**
 * TTS-to-Beat Alignment Utility — P4d
 *
 * Bridge function: takes word-level timestamps from TTS (in @remotion/captions
 * Caption format) and scene configs, then produces beat alignment data that
 * synchronises visual element timing with narration.
 *
 * Used by the pipeline orchestration layer (pipeline/stages/10-align/) to
 * inject aligned beats into scene JSON before rendering.
 *
 * @see BUILD_STATUS.md Section 4 — P4d
 * @see BUILD_STATUS.md Section 18 — Pipeline Architecture (Stage 10)
 */

import type { Caption } from '@remotion/captions';

export interface SceneTimingInfo {
  sceneId: string;
  durationInFrames: number;
  /** Scene start time in the overall video timeline (seconds) */
  startTimeSeconds: number;
}

export interface LineBeatAlignment {
  text: string;
  beats: {
    start: number;
    exit: number;
    emphasis?: number;
  };
}

export interface SceneBeatAlignment {
  sceneId: string;
  beats: {
    start: number;
    exit: number;
  };
  lines: LineBeatAlignment[];
  captionCount: number;
}

export interface BeatAlignment {
  scenes: SceneBeatAlignment[];
  totalDurationSeconds: number;
}

export interface AlignmentOptions {
  fps?: number;
  /** Extra seconds added after the last word's endMs within a scene */
  bufferSeconds?: number;
  /** Words that should get a beats.emphasis timestamp */
  emphasisWords?: string[];
  /** How many consecutive words to group into a "line" for beat alignment */
  wordsPerLine?: number;
}

/**
 * Compute the absolute start time (seconds) of each scene in the video
 * timeline, accounting for transition overlap.
 */
export function computeSceneTimeline(
  scenes: Array<{ id?: string; durationInFrames: number }>,
  fps: number = 30,
  transitionFrames: number = 20,
): SceneTimingInfo[] {
  const result: SceneTimingInfo[] = [];
  let cumulativeFrames = 0;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const startTimeSeconds = cumulativeFrames / fps;

    result.push({
      sceneId: scene.id || `scene-${i}`,
      durationInFrames: scene.durationInFrames,
      startTimeSeconds,
    });

    cumulativeFrames += scene.durationInFrames;
    if (i < scenes.length - 1) {
      cumulativeFrames -= transitionFrames;
    }
  }

  return result;
}

/**
 * Find captions that fall within a scene's time window.
 */
function getCaptionsForScene(
  captions: Caption[],
  sceneStartMs: number,
  sceneEndMs: number,
): Caption[] {
  return captions.filter(
    (c) => c.startMs >= sceneStartMs && c.startMs < sceneEndMs,
  );
}

/**
 * Group captions into lines of N words each.
 */
function groupCaptionsIntoLines(
  captions: Caption[],
  wordsPerLine: number,
): Caption[][] {
  const lines: Caption[][] = [];

  for (let i = 0; i < captions.length; i += wordsPerLine) {
    lines.push(captions.slice(i, i + wordsPerLine));
  }

  return lines;
}

/**
 * Check if a caption's text matches any of the emphasis words (case-insensitive).
 */
function findEmphasisMatch(
  captionText: string,
  emphasisWords: string[],
): boolean {
  const cleaned = captionText.trim().toLowerCase();
  return emphasisWords.some((ew) => {
    const ewLower = ew.toLowerCase();
    return cleaned.includes(ewLower) || ewLower.includes(cleaned);
  });
}

/**
 * Align TTS word-level timestamps to KnoMotion scene beats.
 *
 * Takes global-timeline captions and a scene array, maps each caption to
 * its owning scene, converts absolute millisecond timestamps to
 * scene-relative seconds (the beat convention), and groups words into lines.
 *
 * @param captions   Word-level timestamps in @remotion/captions Caption format.
 *                   Timestamps are absolute (ms from video start).
 * @param scenes     Scene configs with id and durationInFrames.
 * @param options    Alignment tuning options.
 * @returns          BeatAlignment with per-scene, per-line beat data.
 */
export function alignTTSToBeats(
  captions: Caption[],
  scenes: Array<{
    id?: string;
    durationInFrames: number;
    [key: string]: unknown;
  }>,
  options: AlignmentOptions = {},
): BeatAlignment {
  const fps = options.fps ?? 30;
  const buffer = options.bufferSeconds ?? 0.5;
  const emphasisWords = options.emphasisWords ?? [];
  const wordsPerLine = options.wordsPerLine ?? 6;

  const timeline = computeSceneTimeline(scenes, fps);
  const sceneBeatAlignments: SceneBeatAlignment[] = [];

  for (let i = 0; i < timeline.length; i++) {
    const sceneTiming = timeline[i];
    const sceneDurationSeconds = sceneTiming.durationInFrames / fps;
    const sceneStartMs = sceneTiming.startTimeSeconds * 1000;
    const sceneEndMs = (sceneTiming.startTimeSeconds + sceneDurationSeconds) * 1000;

    const sceneCaptions = getCaptionsForScene(captions, sceneStartMs, sceneEndMs);

    if (sceneCaptions.length === 0) {
      sceneBeatAlignments.push({
        sceneId: sceneTiming.sceneId,
        beats: { start: 0, exit: sceneDurationSeconds },
        lines: [],
        captionCount: 0,
      });
      continue;
    }

    const firstCaptionRelativeStart =
      (sceneCaptions[0].startMs - sceneStartMs) / 1000;
    const lastCaptionRelativeEnd =
      (sceneCaptions[sceneCaptions.length - 1].endMs - sceneStartMs) / 1000;

    const lineGroups = groupCaptionsIntoLines(sceneCaptions, wordsPerLine);
    const lines: LineBeatAlignment[] = lineGroups.map((group) => {
      const lineText = group.map((c) => c.text).join('');
      const lineStart = (group[0].startMs - sceneStartMs) / 1000;
      const lineEnd =
        (group[group.length - 1].endMs - sceneStartMs) / 1000 + buffer;

      let emphasis: number | undefined;
      if (emphasisWords.length > 0) {
        const emphasisCaption = group.find((c) =>
          findEmphasisMatch(c.text, emphasisWords),
        );
        if (emphasisCaption) {
          emphasis = (emphasisCaption.startMs - sceneStartMs) / 1000;
        }
      }

      return {
        text: lineText.trim(),
        beats: {
          start: Math.round(lineStart * 100) / 100,
          exit: Math.min(
            Math.round(lineEnd * 100) / 100,
            sceneDurationSeconds,
          ),
          ...(emphasis !== undefined
            ? { emphasis: Math.round(emphasis * 100) / 100 }
            : {}),
        },
      };
    });

    sceneBeatAlignments.push({
      sceneId: sceneTiming.sceneId,
      beats: {
        start: Math.round(firstCaptionRelativeStart * 100) / 100,
        exit: Math.min(
          Math.round((lastCaptionRelativeEnd + buffer) * 100) / 100,
          sceneDurationSeconds,
        ),
      },
      lines,
      captionCount: sceneCaptions.length,
    });
  }

  const lastScene = timeline[timeline.length - 1];
  const totalDurationSeconds = lastScene
    ? lastScene.startTimeSeconds + lastScene.durationInFrames / fps
    : 0;

  return {
    scenes: sceneBeatAlignments,
    totalDurationSeconds: Math.round(totalDurationSeconds * 100) / 100,
  };
}
