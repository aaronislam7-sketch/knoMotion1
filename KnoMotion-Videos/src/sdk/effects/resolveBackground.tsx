import React from 'react';
import { AbsoluteFill } from 'remotion';
import { KNODE_THEME } from '../theme/knodeTheme';
import { NoiseTexture, SpotlightEffect } from './backgrounds';

type GradientVariant = 'sunriseGradient' | 'cleanCard' | 'chalkboardGradient';

type BaseBackground = {
  layerNoise?: boolean;
};

export type BackgroundPresetConfig =
  | ({ preset: 'notebookSoft' } & BaseBackground)
  | ({ preset: 'sunriseGradient' } & BaseBackground)
  | ({ preset: 'cleanCard' } & BaseBackground)
  | ({ preset: 'chalkboardGradient' } & BaseBackground)
  | ({
      preset: 'spotlight';
      spotlight?: { x?: number; y?: number; intensity?: number };
    } & BaseBackground)
  | ({
      preset: 'custom';
      style: React.CSSProperties;
    } & BaseBackground);

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

  let overlay: React.ReactNode = null;
  let style: React.CSSProperties = {
    backgroundColor: KNODE_THEME.colors.pageBg,
  };

  switch (config.preset) {
    case 'notebookSoft':
      overlay = (
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
      );
      break;
    case 'sunriseGradient':
      style = {
        backgroundImage: gradientMap.sunriseGradient,
      };
      break;
    case 'cleanCard':
      style = {
        backgroundColor: gradientMap.cleanCard,
      };
      break;
    case 'chalkboardGradient':
      style = {
        backgroundImage: gradientMap.chalkboardGradient,
        color: '#fff',
      };
      break;
    case 'spotlight':
      overlay = (
        <SpotlightEffect
          x={config.spotlight?.x ?? 45}
          y={config.spotlight?.y ?? 45}
          opacity={config.spotlight?.intensity ?? 0.25}
        />
      );
      break;
    case 'custom':
      style = config.style;
      break;
    default:
      break;
  }

  const overlays: React.ReactNode[] = [];
  if (overlay) {
    overlays.push(overlay);
  }
  if (config.layerNoise) {
    overlays.push(
      <AbsoluteFill key="noise">
        <NoiseTexture opacity={0.04} />
      </AbsoluteFill>,
    );
  }

  return {
    style,
    overlay: overlays.length > 0 ? (
      <>
        {overlays.map((node, idx) => (
          <React.Fragment key={idx}>{node}</React.Fragment>
        ))}
      </>
    ) : undefined,
  };
};
