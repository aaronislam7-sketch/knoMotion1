/**
 * CaptionOverlay — P4c
 *
 * Renders animated word-level captions over the video.
 * Uses @remotion/captions createTikTokStyleCaptions() for page segmentation,
 * then renders the active page with per-word highlight timing.
 *
 * Supports three visual styles:
 *   - 'tiktok'   — Bold centered text, active word highlighted with brand color
 *   - 'subtitle' — Traditional subtitle bar at the bottom with semi-transparent bg
 *   - 'karaoke'  — Words change color sequentially as they are spoken
 *
 * @see BUILD_STATUS.md Section 4 — P4c
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { createTikTokStyleCaptions } from '@remotion/captions';
import { KNODE_THEME } from '../theme/knodeTheme';

const STYLE_CONFIGS = {
  tiktok: {
    fontSize: 64,
    fontWeight: 800,
    color: '#FFFFFF',
    activeColor: KNODE_THEME.colors.primary,
    textShadow: '0 4px 12px rgba(0,0,0,0.6)',
    containerStyle: {
      position: 'absolute',
      bottom: 120,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 60px',
    },
  },
  subtitle: {
    fontSize: 40,
    fontWeight: 600,
    color: '#FFFFFF',
    activeColor: '#FFFFFF',
    textShadow: 'none',
    containerStyle: {
      position: 'absolute',
      bottom: 60,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 40px',
    },
    barStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      borderRadius: 12,
      padding: '14px 32px',
    },
  },
  karaoke: {
    fontSize: 56,
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.4)',
    activeColor: '#FFFFFF',
    spokenColor: KNODE_THEME.colors.primary,
    textShadow: '0 3px 8px rgba(0,0,0,0.5)',
    containerStyle: {
      position: 'absolute',
      bottom: 100,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 60px',
    },
  },
};

const TikTokCaptionPage = ({ page, currentMs, styleConfig }) => {
  return (
    <span
      style={{
        whiteSpace: 'pre',
        textAlign: 'center',
        fontFamily: KNODE_THEME.fonts.body,
        fontSize: styleConfig.fontSize,
        fontWeight: styleConfig.fontWeight,
        textShadow: styleConfig.textShadow,
        lineHeight: 1.3,
      }}
    >
      {page.tokens.map((token, i) => {
        const isActive = currentMs >= token.fromMs && currentMs < token.toMs;
        const scale = isActive ? 1.12 : 1;

        return (
          <span
            key={i}
            style={{
              color: isActive ? styleConfig.activeColor : styleConfig.color,
              display: 'inline-block',
              transform: `scale(${scale})`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            {token.text}
          </span>
        );
      })}
    </span>
  );
};

const SubtitleCaptionPage = ({ page, styleConfig }) => {
  return (
    <div style={styleConfig.barStyle}>
      <span
        style={{
          whiteSpace: 'pre',
          textAlign: 'center',
          fontFamily: KNODE_THEME.fonts.body,
          fontSize: styleConfig.fontSize,
          fontWeight: styleConfig.fontWeight,
          color: styleConfig.color,
          lineHeight: 1.4,
        }}
      >
        {page.text}
      </span>
    </div>
  );
};

const KaraokeCaptionPage = ({ page, currentMs, styleConfig }) => {
  return (
    <span
      style={{
        whiteSpace: 'pre',
        textAlign: 'center',
        fontFamily: KNODE_THEME.fonts.body,
        fontSize: styleConfig.fontSize,
        fontWeight: styleConfig.fontWeight,
        textShadow: styleConfig.textShadow,
        lineHeight: 1.3,
      }}
    >
      {page.tokens.map((token, i) => {
        const isSpoken = currentMs >= token.toMs;
        const isActive = currentMs >= token.fromMs && currentMs < token.toMs;

        let color = styleConfig.color;
        if (isActive) color = styleConfig.activeColor;
        else if (isSpoken) color = styleConfig.spokenColor;

        return (
          <span key={i} style={{ color }}>
            {token.text}
          </span>
        );
      })}
    </span>
  );
};

export const CaptionOverlay = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!captions?.enabled || !captions?.data?.length) return null;

  const style = captions.style || 'tiktok';
  const styleConfig = STYLE_CONFIGS[style] || STYLE_CONFIGS.tiktok;
  const combineMs = captions.combineTokensWithinMilliseconds ?? 800;

  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: captions.data,
        combineTokensWithinMilliseconds: combineMs,
      }),
    [captions.data, combineMs],
  );

  const currentMs = (frame / fps) * 1000;

  const activePage = pages.find(
    (p) => currentMs >= p.startMs && currentMs < p.startMs + p.durationMs,
  );

  if (!activePage) return null;

  const pageOpacity = interpolate(
    currentMs,
    [activePage.startMs, activePage.startMs + 150],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div style={{ ...styleConfig.containerStyle, opacity: pageOpacity }}>
      {style === 'tiktok' && (
        <TikTokCaptionPage
          page={activePage}
          currentMs={currentMs}
          styleConfig={styleConfig}
        />
      )}
      {style === 'subtitle' && (
        <SubtitleCaptionPage page={activePage} styleConfig={styleConfig} />
      )}
      {style === 'karaoke' && (
        <KaraokeCaptionPage
          page={activePage}
          currentMs={currentMs}
          styleConfig={styleConfig}
        />
      )}
    </div>
  );
};
