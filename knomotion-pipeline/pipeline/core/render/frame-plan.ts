/**
 * Which frames of a scene does render-check look at? (Sept M2)
 *
 * Three per scene, chosen from the scene's own beats so the stills land where
 * content is supposed to be fully visible:
 *
 *   settled   — first content has finished entering  (earliest start + ~1s)
 *   midpoint  — half-way through the content window
 *   pre-exit  — just before the exit animation begins (latest exit − 0.4s)
 *
 * Renderer facts this leans on: entrance animations run ≤ ~0.8s; the exit
 * animation STARTS at `beats.exit` and runs ~0.3s; a slot item with no beats
 * defaults to start 0.5s and exit ≈ 2.4s (resolveBeats). Frame choice is
 * deterministic so a rerun on the same config renders the same stills.
 */

import type { SceneItem as Scene } from '../../schemas/KnoMotionVideoConfig';

export type FrameLabel = 'settled' | 'midpoint' | 'pre-exit';

export interface PlannedFrame {
  label: FrameLabel;
  /** Scene-relative frame index (0-based). */
  frame: number;
  /** Scene-relative time in seconds. */
  timeSec: number;
}

const ENTRANCE_SETTLE_SECONDS = 1.0;
const PRE_EXIT_MARGIN_SECONDS = 0.4;
const RENDERER_DEFAULT_START = 0.5;
const RENDERER_DEFAULT_WINDOW = 1.9; // hold 1.6 + exitOffset 0.3

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

/** Top-level content window of a scene: earliest item start, latest item exit. */
export const contentWindow = (scene: Scene): { start: number; exit: number } => {
  const durationSec = scene.durationInFrames / 30;
  const slots = scene.config?.slots ?? {};
  let start: number | undefined;
  let exit: number | undefined;
  for (const val of Object.values(slots)) {
    for (const item of Array.isArray(val) ? val : [val]) {
      const beats = isObj(item?.config) && isObj(item.config.beats) ? item.config.beats : {};
      const s = num(beats.start) ?? RENDERER_DEFAULT_START;
      const e = num(beats.exit) ?? Math.min(durationSec, s + RENDERER_DEFAULT_WINDOW);
      start = start === undefined ? s : Math.min(start, s);
      exit = exit === undefined ? e : Math.max(exit, e);
    }
  }
  return { start: start ?? RENDERER_DEFAULT_START, exit: exit ?? durationSec };
};

/**
 * Plans `count` frames (1–3) for a scene. Frames are clamped to the scene,
 * ordered, and de-duplicated, so a very short content window can yield fewer
 * frames than requested.
 */
export const planFrames = (scene: Scene, fps: number, count = 3): PlannedFrame[] => {
  const lastFrame = Math.max(0, scene.durationInFrames - 1);
  const durationSec = scene.durationInFrames / fps;
  const { start, exit } = contentWindow(scene);

  const windowStart = Math.min(start, durationSec);
  const windowEnd = Math.max(windowStart, Math.min(exit, durationSec));
  const span = windowEnd - windowStart;

  // With a short window, shrink the margins proportionally instead of letting
  // "settled" overtake "pre-exit".
  const settleIn = Math.min(ENTRANCE_SETTLE_SECONDS, span * 0.45);
  const exitOut = Math.min(PRE_EXIT_MARGIN_SECONDS, span * 0.2);

  const settled = windowStart + settleIn;
  const preExit = windowEnd - exitOut;
  const midpoint = (settled + preExit) / 2;

  const wanted: Array<[FrameLabel, number]> = count >= 3
    ? [['settled', settled], ['midpoint', midpoint], ['pre-exit', preExit]]
    : count === 2
      ? [['settled', settled], ['pre-exit', preExit]]
      : [['midpoint', midpoint]];

  const seen = new Set<number>();
  const out: PlannedFrame[] = [];
  for (const [label, t] of wanted) {
    const frame = Math.min(lastFrame, Math.max(0, Math.round(t * fps)));
    if (seen.has(frame)) continue;
    seen.add(frame);
    out.push({ label, frame, timeSec: frame / fps });
  }
  return out;
};
