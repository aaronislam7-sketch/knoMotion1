import { KNODE_THEME } from './knodeTheme';

export type StylePresetName =
  | 'educational'
  | 'playful'
  | 'minimal'
  | 'mentor'
  | 'focus';

export type TextDecoration =
  | 'none'
  | 'underline'
  | 'highlight'
  | 'circle'
  | 'margin';

export type StylePreset = {
  textVariant: 'display' | 'title' | 'body';
  textColor: keyof typeof KNODE_THEME.colors;
  decoration?: TextDecoration;
  animationPreset?: 'subtle' | 'bouncy' | 'dramatic' | 'minimal' | 'educational';
  doodle?: {
    type: Exclude<TextDecoration, 'none'>;
    color?: keyof typeof KNODE_THEME.colors;
    thickness?: number;
  };
  background?: {
    preset: string;
    options?: Record<string, unknown>;
  };
};

const basePreset: StylePreset = {
  textVariant: 'body',
  textColor: 'textMain',
  decoration: 'none',
  animationPreset: 'subtle',
};

export const STYLE_PRESETS: Record<StylePresetName, StylePreset> = {
  educational: {
    ...basePreset,
    textVariant: 'title',
    decoration: 'underline',
    doodle: { type: 'underline', color: 'doodle', thickness: 2 },
    animationPreset: 'educational',
    background: { preset: 'notebookSoft' },
  },
  playful: {
    ...basePreset,
    textVariant: 'display',
    textColor: 'primary',
    decoration: 'highlight',
    doodle: { type: 'circle', color: 'accentBlue', thickness: 3 },
    animationPreset: 'bouncy',
    background: { preset: 'sunriseGradient' },
  },
  minimal: {
    ...basePreset,
    textVariant: 'body',
    decoration: 'none',
    animationPreset: 'minimal',
    background: { preset: 'cleanCard' },
  },
  mentor: {
    ...basePreset,
    textVariant: 'title',
    textColor: 'textMain',
    decoration: 'circle',
    doodle: { type: 'circle', color: 'accentGreen', thickness: 2 },
    animationPreset: 'dramatic',
    background: { preset: 'chalkboardGradient' },
  },
  focus: {
    ...basePreset,
    textVariant: 'title',
    textColor: 'textSoft',
    decoration: 'underline',
    doodle: { type: 'underline', color: 'secondary', thickness: 2 },
    animationPreset: 'subtle',
    background: { preset: 'spotlight' },
  },
};

export const resolveStylePreset = (preset?: string): StylePreset => {
  if (!preset) {
    return STYLE_PRESETS.educational;
  }
  return STYLE_PRESETS[preset as StylePresetName] ?? STYLE_PRESETS.educational;
};
