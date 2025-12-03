import React from 'react';
import { AbsoluteFill } from 'remotion';
import { KNODE_THEME } from '../theme/knodeTheme';
import { SpotlightEffect } from './backgrounds';

type GradientVariant = 'sunriseGradient' | 'cleanCard' | 'chalkboardGradient';

export type BackgroundPresetConfig =
  | {
      preset: 'notebookSoft';
    }
  | {
      preset: 'sunriseGradient';
    }
  | {
      preset: 'cleanCard';
    }
  | {
      preset: 'chalkboardGradient';
    }
  | {
      preset: 'spotlight';
      spotlight?: { x?: number; y?: number; intensity?: number };
    }
  | {
    preset: 'custom';
    style: React.CSSProperties;
  };

export type ResolvedBackground = {
  style: React.CSSProperties;
  overlay?: React.ReactNode;
};

const gradientMap: Record<GradientVariant, string> = {
  sunriseGradient: `linear-gradient(135deg, ${KNODE_THEME.colors.pageBg}, ${KNODE_THEME.colors.primary}22)`,
  cleanCard: KNODE_THEME.colors.cardBg,
  chalkboardGradient: `linear-gradient(180deg, #2b2f3a, #1e2027)`,
};

export const resolveBackground = (
  config?: BackgroundPresetConfig,
): ResolvedBackground => {
  if (!config) {
    return { style: { backgroundColor: KNODE_THEME.colors.pageBg } };
  }

  switch (config.preset) {
    case 'notebookSoft':
      return {
        style: {
          backgroundColor: KNODE_THEME.colors.pageBg,
        },
        overlay: (
          <AbsoluteFill>
            <svg width="100%" height="100%">
              {Array.from({ length: 40 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 32}
                  x2="100%"
                  y2={i * 32}
                  stroke={KNODE_THEME.colors.ruleLine}
                  opacity={0.25}
                />
              ))}
            </svg>
          </AbsoluteFill>
        ),
      };
    case 'sunriseGradient':
      return {
        style: {
          backgroundImage: gradientMap.sunriseGradient,
        },
      };
    case 'cleanCard':
      return {
        style: {
          backgroundColor: gradientMap.cleanCard,
        },
      };
    case 'chalkboardGradient':
      return {
        style: {
          backgroundImage: gradientMap.chalkboardGradient,
          color: '#fff',
        },
      };
    case 'spotlight':
      return {
        style: {
          backgroundColor: KNODE_THEME.colors.pageBg,
        },
        overlay: (
          <SpotlightEffect
            x={config.spotlight?.x ?? 45}
            y={config.spotlight?.y ?? 45}
            opacity={config.spotlight?.intensity ?? 0.25}
          />
        ),
      };
    case 'custom':
      return { style: config.style };
    default:
      return { style: { backgroundColor: KNODE_THEME.colors.pageBg } };
  }
};
