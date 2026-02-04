/**
 * KnoSlides Shared Components
 */

// Base UI components
export { Card } from './Card';
export type { CardProps, CardVariant, CardSize } from './Card';

export { Text } from './Text';
export type { TextProps, TextVariant, TextSize, TextWeight, TextColor } from './Text';

export { LottiePlayer } from './LottiePlayer';
export type { LottiePlayerProps } from './LottiePlayer';

export { ProgressIndicator } from './ProgressIndicator';
export type { ProgressIndicatorProps, ProgressVariant, ProgressSize } from './ProgressIndicator';

export { Icon } from './Icon';
export type { IconProps, IconSize } from './Icon';

export { Accordion } from './Accordion';
export type { AccordionProps } from './Accordion';

// Slide-specific components for guided construction
export {
  StepProgress,
  HintLadder,
  ExplanationPanel,
  FeedbackIndicator,
  StepNavigation,
} from './slide';

export type {
  StepProgressProps,
  HintLadderProps,
  ExplanationPanelProps,
  FeedbackIndicatorProps,
  StepNavigationProps,
} from './slide';
