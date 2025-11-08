import { linearTiming, springTiming, TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { clockWipe } from '@remotion/transitions/clock-wipe';
import { iris } from '@remotion/transitions/iris';
import { useCurrentFrame, interpolate } from 'remotion';
import type {
  TransitionPresentation,
  TransitionTiming,
} from '@remotion/transitions';

type SlideDirection = 'left' | 'right' | 'up' | 'down';
type WipeAxis = 'horizontal' | 'vertical';

export type TransitionStyle =
  | 'none'
  | 'fade'
  | 'slide'
  | 'slide-reverse'
  | 'slide-up'
  | 'slide-down'
  | 'wipe'
  | 'wipe-reverse'
  | 'clock'
  | 'iris'
  | 'morph'
  | 'radial'
  | 'zoom'
  | 'split'
  | 'glitch';

export type TransitionEasing = 'linear' | 'smooth' | 'snappy';

export type TransitionOptions = {
  style?: TransitionStyle;
  durationInFrames?: number;
  easing?: TransitionEasing;
  direction?: SlideDirection;
  axis?: WipeAxis;
};

export type StageDescriptor = {
  key?: string;
  durationInFrames: number;
  transition?: TransitionOptions;
};

export type StageTransitionPlan = Array<{
  key: string;
  durationInFrames: number;
  transition: {
    presentation?: TransitionPresentation<any>;
    timing?: TransitionTiming;
  } | null;
}>;

const DEFAULT_TRANSITION: Required<TransitionOptions> = {
  style: 'fade',
  durationInFrames: 18,
  easing: 'smooth',
  direction: 'left',
  axis: 'horizontal',
};

const getPresentation = (options: Required<TransitionOptions>) => {
  switch (options.style) {
    case 'fade':
      return fade();
    case 'slide':
      return slide({ direction: `from-${options.direction}` });
    case 'slide-reverse': {
      const reverseMap: Record<SlideDirection, SlideDirection> = {
        left: 'right',
        right: 'left',
        up: 'down',
        down: 'up',
      };
      return slide({ direction: `from-${reverseMap[options.direction]}` });
    }
    case 'slide-up':
      return slide({ direction: 'from-top' });
    case 'slide-down':
      return slide({ direction: 'from-bottom' });
    case 'wipe': {
      const direction = options.axis === 'horizontal' ? 'from-left' : 'from-top';
      return wipe({ direction });
    }
    case 'wipe-reverse': {
      const direction = options.axis === 'horizontal' ? 'from-right' : 'from-bottom';
      return wipe({ direction });
    }
    case 'clock':
      return clockWipe();
    case 'iris':
      return iris();
    case 'morph':
      // Morph uses a custom implementation via clipPath
      return undefined; // Will be handled by custom morph function
    case 'radial':
      // Radial reveal uses clockWipe as base
      return clockWipe();
    case 'zoom':
      // Zoom uses scale transform - handled separately
      return undefined;
    case 'split':
      // Split uses wipe as base
      return wipe({ direction: 'from-left' });
    case 'glitch':
      // Glitch is a custom effect - handled separately
      return undefined;
    case 'none':
    default:
      return undefined;
  }
};

const getTiming = (
  easing: TransitionEasing,
  durationInFrames: number,
): TransitionTiming | undefined => {
  if (easing === 'linear') {
    return linearTiming({ durationInFrames });
  }

  if (easing === 'snappy') {
    return springTiming({
      durationInFrames,
      config: { damping: 18, stiffness: 240, mass: 0.7 },
    });
  }

  return springTiming({
    durationInFrames,
    config: { damping: 16, stiffness: 140, mass: 1 },
  });
};

export const createTransitionProps = (
  options?: TransitionOptions,
): { presentation?: TransitionPresentation<any>; timing?: TransitionTiming } => {
  const merged: Required<TransitionOptions> = {
    ...DEFAULT_TRANSITION,
    ...options,
    durationInFrames: options?.durationInFrames ?? DEFAULT_TRANSITION.durationInFrames,
    easing: options?.easing ?? DEFAULT_TRANSITION.easing,
    direction: options?.direction ?? DEFAULT_TRANSITION.direction,
    axis: options?.axis ?? DEFAULT_TRANSITION.axis,
  };

  if (merged.style === 'none') {
    return { presentation: undefined, timing: undefined };
  }

  return {
    presentation: getPresentation(merged),
    timing: getTiming(merged.easing, merged.durationInFrames),
  };
};

export const buildStageTransitionPlan = (
  stages: StageDescriptor[],
  defaults?: TransitionOptions,
): StageTransitionPlan => {
  return stages.map((stage, index) => {
    const key = stage.key ?? `stage-${index}`;
    const transitionOptions =
      stage.transition ??
      (index === 0 ? { style: 'none' as const } : defaults ?? DEFAULT_TRANSITION);

    const transition = createTransitionProps(transitionOptions);

    return {
      key,
      durationInFrames: stage.durationInFrames,
      transition:
        transition.presentation || transition.timing ? transition : null,
    };
  });
};

export const TransitionSeriesBridge = TransitionSeries;

// ==================== MID-SCENE TRANSITION HOOKS ====================

/**
 * Hook for mid-scene transitions within templates
 * Provides smooth transitions between sections
 */
export const useMidSceneTransition = (
  frame: number,
  startFrame: number,
  duration: number,
  type: 'morph' | 'radial' | 'zoom' | 'split' | 'stagger' = 'fade',
  options: {
    direction?: 'in' | 'out' | 'both';
    easing?: (t: number) => number;
    staggerDelay?: number;
  } = {}
) => {
  const { direction = 'both', easing, staggerDelay = 10 } = options;
  
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easing || ((t) => t * (2 - t)) // Default ease-out
    }
  );

  if (type === 'morph') {
    // Morph transition - smooth shape transformation
    const scale = direction === 'in' ? progress : (direction === 'out' ? 1 - progress : Math.min(progress, 1 - progress));
    const borderRadius = interpolate(progress, [0, 1], [0, 50]);
    
    return {
      transform: `scale(${0.8 + scale * 0.2})`,
      borderRadius: `${borderRadius}%`,
      opacity: direction === 'both' ? Math.min(progress * 2, 1 - (progress - 0.5) * 2) : progress
    };
  }

  if (type === 'radial') {
    // Radial reveal from center
    const radius = progress * 2000; // Large enough to cover screen
    return {
      clipPath: `circle(${radius}px at center)`,
      opacity: progress
    };
  }

  if (type === 'zoom') {
    // Zoom transition
    const scale = direction === 'in' ? 0.5 + progress * 0.5 : 1 - progress * 0.5;
    return {
      transform: `scale(${scale})`,
      opacity: progress
    };
  }

  if (type === 'split') {
    // Split screen transition
    const leftClip = direction === 'in' ? progress * 50 : (direction === 'out' ? 50 - progress * 50 : 50);
    const rightClip = direction === 'in' ? progress * 50 : (direction === 'out' ? 50 - progress * 50 : 50);
    return {
      clipPath: `inset(0 ${leftClip}% 0 ${rightClip}%)`,
      opacity: progress
    };
  }

  if (type === 'stagger') {
    // Staggered cascade - returns progress array for multiple elements
    return {
      getStaggerProgress: (index: number) => {
        const staggerProgress = Math.max(0, progress - (index * staggerDelay / duration));
        return Math.min(1, staggerProgress * (duration / (duration - index * staggerDelay)));
      }
    };
  }

  // Default fade
  return {
    opacity: progress
  };
};

/**
 * Create transition style for mid-scene transitions
 */
export const createMidSceneTransition = (
  type: TransitionStyle,
  durationInFrames: number = 18,
  easing: TransitionEasing = 'smooth'
): TransitionOptions => {
  return {
    style: type,
    durationInFrames,
    easing
  };
};
