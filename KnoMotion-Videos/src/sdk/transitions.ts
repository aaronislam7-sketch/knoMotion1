import { linearTiming, springTiming, TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { clockWipe } from '@remotion/transitions/clock-wipe';
import { iris } from '@remotion/transitions/iris';
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
  | 'iris';

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
