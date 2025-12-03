import type { LottieAnimationData } from '@remotion/lottie';
import { staticFile } from 'remotion';
import {
  arrowAnimation,
  celebrationAnimation,
  checkmarkAnimation,
  lightbulbAnimation,
  loadingAnimation,
  snowflakeAnimation,
  sparkleAnimation,
  thermometerAnimation,
  thinkingAnimation,
  waterDropAnimation,
} from './lottieLibrary';

export type LottieSource =
  | { kind: 'static'; src: string }
  | { kind: 'inline'; data: LottieAnimationData };

const staticEntry = (path: string): LottieSource => ({
  kind: 'static',
  src: staticFile(path),
});

const inlineEntry = (data: LottieAnimationData): LottieSource => ({
  kind: 'inline',
  data,
});

export const LOTTIE_REGISTRY = {
  success: staticEntry('lotties/success-checkmark.json'),
  celebration: staticEntry('lotties/celebration-stars.json'),
  burst: staticEntry('lotties/particle-burst.json'),
  particles: staticEntry('lotties/particle-burst.json'),
  loading: staticEntry('lotties/loading-spinner.json'),
  spinner: staticEntry('lotties/loading-spinner.json'),
  stars: staticEntry('lotties/celebration-stars.json'),
  'core/checkmark': staticEntry('lotties/success-checkmark.json'),
  'core/celebration': staticEntry('lotties/celebration-stars.json'),
  'core/particles': staticEntry('lotties/particle-burst.json'),
  'core/loading': staticEntry('lotties/loading-spinner.json'),
  'education/lightbulb': inlineEntry(lightbulbAnimation),
  'education/checkmark': inlineEntry(checkmarkAnimation),
  'education/stars-burst': inlineEntry(sparkleAnimation),
  'education/question': inlineEntry(thinkingAnimation),
  'nature/thermometer': inlineEntry(thermometerAnimation),
  'nature/snowflake': inlineEntry(snowflakeAnimation),
  'nature/water-drop': inlineEntry(waterDropAnimation),
  'ui/arrow': inlineEntry(arrowAnimation),
  'ui/loading': inlineEntry(loadingAnimation),
  'celebration/confetti': inlineEntry(celebrationAnimation),
} as const satisfies Record<string, LottieSource>;

export type LottieKey = keyof typeof LOTTIE_REGISTRY;

export const resolveLottieSource = (key: string): LottieSource | null => {
  return LOTTIE_REGISTRY[key as LottieKey] ?? null;
};
