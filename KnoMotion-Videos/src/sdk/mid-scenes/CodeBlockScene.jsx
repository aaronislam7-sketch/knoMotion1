/**
 * CodeBlockScene - Mid-Scene Component
 *
 * Renders syntax-highlighted code with line-by-line reveal, highlighting,
 * focus mode, and optional typing effect. Powered by remotion-bits CodeBlock.
 *
 * @module mid-scenes/CodeBlockScene
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { CodeBlock, TypeWriter } from 'remotion-bits';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';
import { resolveBeats } from '../utils/beats';

const DARK_THEME = {
  background: '#1E1E2E',
  text: '#CDD6F4',
  keyword: '#CBA6F7',
  string: '#A6E3A1',
  comment: '#6C7086',
  function: '#89B4FA',
  number: '#FAB387',
  operator: '#89DCEB',
  punctuation: '#BAC2DE',
  className: '#F9E2AF',
};

const LIGHT_THEME = {
  background: '#FAFAF9',
  text: '#2C3E50',
  keyword: '#8B5CF6',
  string: '#059669',
  comment: '#94A3B8',
  function: '#2563EB',
  number: '#EA580C',
  operator: '#0891B2',
  punctuation: '#64748B',
  className: '#D97706',
};

/**
 * CodeBlockScene Component
 *
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {string} props.config.code - Source code to display (required)
 * @param {string} props.config.language - Language for syntax highlighting (default: 'javascript')
 * @param {string} props.config.theme - Color theme: 'dark' | 'light' (default: 'dark')
 * @param {string} props.config.revealType - Reveal type: 'lineByLine' | 'typing' | 'highlight' | 'fade' (default: 'lineByLine')
 * @param {number[]} props.config.highlightLines - Lines to highlight (1-indexed)
 * @param {number[]} props.config.focusLines - Lines to focus (dims others)
 * @param {number} props.config.typingSpeed - Typing speed multiplier (default: 1.0)
 * @param {boolean} props.config.showLineNumbers - Show line numbers (default: true)
 * @param {number} props.config.fontSize - Font size in pixels (default: auto-calculated)
 * @param {string} props.config.title - Optional title above the code block
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds
 * @param {Object} props.config.position - Slot position from layout resolver
 * @param {Object} props.config.style - Optional style overrides
 */
export const CodeBlockScene = ({ config, stylePreset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const {
    code = '',
    language = 'javascript',
    theme = 'dark',
    revealType = 'lineByLine',
    highlightLines = [],
    focusLines = [],
    typingSpeed = 1.0,
    showLineNumbers = true,
    fontSize: customFontSize,
    title,
    beats = {},
    position,
    style = {},
  } = config;

  if (!code) {
    console.warn('CodeBlockScene: No code provided');
    return null;
  }

  const sequenceBeats = resolveBeats(beats, {
    start: 0.5,
    holdDuration: 3.0,
    exitOffset: 0.3,
  });
  const startFrame = toFrames(sequenceBeats.start, fps);
  const exitFrame = toFrames(sequenceBeats.exit, fps);

  const slotWidth = position?.width || width;
  const slotHeight = position?.height || height;
  const isMobile = height > width;

  const padding = isMobile ? 40 : 60;
  const blockWidth = slotWidth - padding * 2;
  const titleHeight = title ? 80 : 0;
  const blockHeight = slotHeight - padding * 2 - titleHeight;

  const lineCount = code.split('\n').length;
  const autoFontSize = Math.min(
    Math.max(14, Math.floor(blockHeight / (lineCount * 1.8))),
    isMobile ? 20 : 28
  );
  const codeFontSize = customFontSize || autoFontSize;

  const isDark = theme === 'dark';
  const themeColors = isDark ? DARK_THEME : LIGHT_THEME;

  const exitProgress = frame > exitFrame
    ? Math.min(1, (frame - exitFrame) / toFrames(0.4, fps))
    : 0;
  const containerOpacity = 1 - exitProgress;

  const entranceProgress = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const buildHighlight = () => {
    if (highlightLines.length === 0) return undefined;
    return highlightLines.map(line => ({
      lines: [line],
      color: isDark ? 'rgba(137, 180, 250, 0.15)' : 'rgba(37, 99, 235, 0.1)',
    }));
  };

  const buildFocus = () => {
    if (focusLines.length === 0) return undefined;
    return {
      lines: focusLines,
      blur: 2,
      dimOpacity: 0.3,
    };
  };

  const buildTransition = () => {
    switch (revealType) {
      case 'lineByLine':
        return {
          opacity: [0, 1],
          y: [8, 0],
          delay: startFrame,
          duration: Math.round(30 / typingSpeed),
          stagger: Math.round(6 / typingSpeed),
          easing: 'easeOutCubic',
        };
      case 'highlight':
        return {
          opacity: [0, 1],
          delay: startFrame,
          duration: 20,
          easing: 'easeOutCubic',
        };
      case 'fade':
        return {
          opacity: [0, 1],
          delay: startFrame,
          duration: 25,
          easing: 'easeOutCubic',
        };
      default:
        return {
          opacity: [0, 1],
          delay: startFrame,
          duration: 20,
          easing: 'easeOutCubic',
        };
    }
  };

  return (
    <AbsoluteFill
      style={{
        opacity: containerOpacity,
        ...style.container,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: padding,
          top: padding,
          width: blockWidth,
          height: slotHeight - padding * 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title && (
          <div
            style={{
              opacity: entranceProgress,
              transform: `translateY(${(1 - entranceProgress) * 10}px)`,
              fontSize: isMobile ? 28 : 36,
              fontFamily: KNODE_THEME.fonts.body,
              fontWeight: 700,
              color: isDark ? '#CDD6F4' : KNODE_THEME.colors.textMain,
              marginBottom: 24,
              textAlign: 'center',
              ...style.title,
            }}
          >
            {title}
          </div>
        )}

        <div
          style={{
            width: '100%',
            maxHeight: blockHeight,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: isDark
              ? '0 20px 60px rgba(0, 0, 0, 0.5)'
              : '0 20px 60px rgba(0, 0, 0, 0.12)',
            ...style.codeBlock,
          }}
        >
          {revealType === 'typing' ? (
            <div
              style={{
                backgroundColor: themeColors.background,
                padding: 24,
                fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
                fontSize: codeFontSize,
                lineHeight: 1.7,
                color: themeColors.text,
                whiteSpace: 'pre',
                minHeight: blockHeight - 48,
              }}
            >
              <TypeWriter
                text={code}
                typeSpeed={Math.round(3 / typingSpeed)}
                delay={startFrame}
                cursor={true}
                showCursorAfterComplete={true}
                errorRate={0}
                style={{
                  fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
                  fontSize: codeFontSize,
                  lineHeight: 1.7,
                  color: themeColors.text,
                }}
              />
            </div>
          ) : (
            <CodeBlock
              code={code}
              language={language}
              theme={isDark ? 'dark' : 'light'}
              showLineNumbers={showLineNumbers}
              fontSize={codeFontSize}
              lineHeight={1.7}
              padding={24}
              highlight={buildHighlight()}
              focus={buildFocus()}
              transition={buildTransition()}
              style={{
                minHeight: blockHeight - 48,
                ...style.code,
              }}
            />
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default CodeBlockScene;
