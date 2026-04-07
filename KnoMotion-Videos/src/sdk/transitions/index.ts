/**
 * Transition Presentations for @remotion/transitions
 *
 * Maps KnoMotion scene transition config objects to Remotion
 * TransitionPresentation + timing pairs.
 *
 * Supported types: fade, slide, page-turn, clock-wipe, iris.
 * Discontinued types (doodle-wipe, eraser, spring) fall back to slide().
 */

import type { TransitionPresentation } from '@remotion/transitions';
import { springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { flip } from '@remotion/transitions/flip';
import { clockWipe } from '@remotion/transitions/clock-wipe';
import { iris } from '@remotion/transitions/iris';

export interface SceneTransition {
  type: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  durationInFrames?: number;
  [key: string]: unknown;
}

interface Viewport {
  width: number;
  height: number;
}

const DIRECTION_MAP: Record<string, 'from-left' | 'from-right' | 'from-top' | 'from-bottom'> = {
  left: 'from-left',
  right: 'from-right',
  up: 'from-top',
  down: 'from-bottom',
};

/**
 * Resolve a KnoMotion scene transition config to a Remotion TransitionPresentation.
 *
 * @param transition  Scene-level transition object ({ type, direction, ... })
 * @param viewport    Current composition viewport dimensions
 */
export function resolvePresentation(
  transition: SceneTransition | undefined,
  viewport: Viewport,
): TransitionPresentation<Record<string, unknown>> {
  if (!transition) return fade();

  const dir = DIRECTION_MAP[transition.direction ?? 'right'] ?? 'from-right';

  switch (transition.type) {
    case 'fade':
      return fade();

    case 'slide':
    case 'doodle-wipe':
    case 'eraser':
    case 'spring':
      return slide({ direction: dir });

    case 'page-turn':
      return flip({ direction: dir });

    case 'clock-wipe':
      return clockWipe({ width: viewport.width, height: viewport.height });

    case 'iris':
      return iris({ width: viewport.width, height: viewport.height });

    default:
      return fade();
  }
}

const DEFAULT_TRANSITION_FRAMES = 20;

/**
 * Resolve transition timing.
 *
 * Uses springTiming for physics-based motion on all transition types.
 */
export function resolveTransitionTiming(
  transition: SceneTransition | undefined,
  defaultFrames: number = DEFAULT_TRANSITION_FRAMES,
) {
  const frames = transition?.durationInFrames ?? defaultFrames;

  return springTiming({
    config: { damping: 200 },
    durationInFrames: frames,
    durationRestThreshold: 0.001,
  });
}

/**
 * Compute the total rendered duration when using TransitionSeries.
 *
 * Total = sum(scene durations) - sum(transition overlaps)
 *
 * When springTiming is called with a fixed durationInFrames, the overlap
 * equals exactly that value per transition.
 */
export function calculateTransitionSeriesDuration(
  scenes: Array<{ durationInFrames: number; transition?: SceneTransition }>,
  defaultTransitionFrames: number = DEFAULT_TRANSITION_FRAMES,
): number {
  const totalSceneFrames = scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
  const transitionCount = Math.max(0, scenes.length - 1);

  return totalSceneFrames - transitionCount * defaultTransitionFrames;
}
