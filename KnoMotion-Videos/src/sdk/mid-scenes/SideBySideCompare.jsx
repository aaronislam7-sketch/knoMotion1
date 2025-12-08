/**
 * SideBySideCompare - Mid-Scene Component
 * 
 * Renders left vs right comparison blocks with optional divider.
 * Uses SDK Card and Text elements for consistent styling.
 * 
 * @module mid-scenes/SideBySideCompare
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, spring } from 'remotion';
import { Card } from '../elements/atoms/Card';
import { Text } from '../elements/atoms/Text';
import { Icon } from '../elements/atoms/Icon';
import { Badge } from '../elements/atoms/Badge';
import { Divider } from '../elements/atoms/Divider';
import { ImageAtom } from '../elements/atoms/Image';
import { RemotionLottie } from '../lottie/lottieIntegration';
import { fadeIn, slideIn, scaleIn, bounceIn } from '../animations/index';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';
import { resolveStylePreset } from '../theme/stylePresets';
import { resolveBeats } from '../utils/beats';

/**
 * Get animation style for comparison sides
 */
const getSideAnimationStyle = (animationType, frame, startFrame, durationFrames, fps, side = 'left') => {
  const direction = side === 'left' ? 'right' : 'left';
  
  switch (animationType) {
    case 'slide':
      return slideIn(frame, startFrame, durationFrames, direction, 80);
    
    case 'scale':
      return scaleIn(frame, startFrame, durationFrames, 0.7);
    
    case 'bounce':
      return bounceIn(frame, startFrame, durationFrames);
    
    case 'reveal': {
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: { damping: 15, mass: 1, stiffness: 100 },
      });
      return {
        opacity: progress,
        transform: `translateX(${(1 - progress) * (side === 'left' ? -60 : 60)}px)`,
      };
    }
    
    case 'fade':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * Get divider animation style
 */
const getDividerAnimationStyle = (frame, startFrame, durationFrames, fps) => {
  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 12, mass: 1, stiffness: 120 },
  });
  
  return {
    opacity: progress,
    transform: `scaleY(${progress})`,
  };
};

/**
 * Comparison Side Component using SDK elements
 */
const ComparisonSide = ({
  config,
  side,
  animStyle,
  baseFontSize,
  slotHeight,
  style = {},
  textColorKey = 'textMain',
}) => {
  const theme = KNODE_THEME;
  const { title, subtitle, icon, items = [], color, backgroundColor } = config;
  
  // Resolve colors
  const accentColor = color 
    ? (theme.colors[color] || color)
    : (theme.colors[textColorKey] || theme.colors.primary);
  const resolvedTextColor = theme.colors[textColorKey] || theme.colors.textMain;
  
  const bgColor = backgroundColor
    ? (theme.colors[backgroundColor] || backgroundColor)
    : 'transparent';

  const alignment = config.alignment || 'center';
  const textAlign = alignment === 'inner' 
    ? (side === 'left' ? 'right' : 'left')
    : 'center';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: alignment === 'inner' 
          ? (side === 'left' ? 'flex-end' : 'flex-start')
          : 'center',
        padding: baseFontSize * 1.5,
        opacity: animStyle.opacity,
        backgroundColor: bgColor,
        ...style.sideWrapper,
      }}
    >
      <div
        style={{
          transform: animStyle.transform,
          maxWidth: '90%',
          ...style.sideContent,
        }}
      >
        {/* Icon */}
        {icon && (
          <div style={{ marginBottom: baseFontSize * 0.8, textAlign }}>
            <Icon
              iconRef={icon}
              size="xl"
              style={{
                fontSize: baseFontSize * 2.5,
                ...style.icon,
              }}
            />
          </div>
        )}

        {/* Title */}
        {title && (
          <Text
            text={title}
            variant="title"
            size="xl"
            weight="bold"
            style={{
              fontSize: baseFontSize * 1.8,
              marginBottom: baseFontSize * 0.4,
              textAlign,
              color: accentColor,
              ...style.title,
            }}
          />
        )}

        {/* Subtitle */}
        {subtitle && (
          <Text
            text={subtitle}
            variant="body"
            size="md"
            color={textColorKey}
            style={{
              fontSize: baseFontSize * 0.9,
              marginBottom: baseFontSize * 0.8,
              textAlign,
              ...style.subtitle,
            }}
          />
        )}

        {/* Items list */}
        {items.length > 0 && (
          <div
            style={{
              marginTop: baseFontSize * 0.5,
              ...style.itemsList,
            }}
          >
            {items.map((item, index) => {
              const itemText = typeof item === 'string' ? item : item.text;
              const itemIcon = typeof item === 'object' ? item.icon : null;

              const iconElement = itemIcon ? (
                <Icon
                  iconRef={itemIcon}
                  size="md"
                  color={textColorKey}
                  style={{ fontSize: baseFontSize * 1.1, color: accentColor }}
                />
              ) : null;

              const textElement = (
                <Text
                  text={itemText}
                  variant="body"
                  size="md"
                  color={textColorKey}
                  style={{ fontSize: baseFontSize, color: resolvedTextColor, ...style.itemText }}
                />
              );

              const iconBefore = iconElement && alignment === 'inner' && side === 'left';
              const iconAfter = iconElement && !iconBefore;

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: baseFontSize * 0.5,
                    marginBottom: baseFontSize * 0.4,
                    justifyContent: alignment === 'inner'
                      ? (side === 'left' ? 'flex-end' : 'flex-start')
                      : 'center',
                    ...style.item,
                  }}
                >
                  {iconBefore && iconElement}
                  {textElement}
                  {iconAfter && iconElement}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Divider Component
 */
const VsDivider = ({
  type,
  label,
  color,
  animStyle,
  slotHeight,
  baseFontSize,
  style = {},
}) => {
  if (type === 'none') return null;

  const dividerSize = Math.min(baseFontSize * 4, slotHeight * 0.15);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: baseFontSize * 0.5,
        opacity: animStyle.opacity,
        ...style.dividerWrapper,
      }}
    >
      {/* Top line */}
      {(type === 'line' || type === 'dashed' || type === 'vs') && (
        <div
          style={{
            width: 3,
            height: slotHeight * 0.25,
            backgroundColor: type === 'dashed' ? 'transparent' : `${color}40`,
            backgroundImage: type === 'dashed' 
              ? `repeating-linear-gradient(to bottom, ${color} 0, ${color} 8px, transparent 8px, transparent 16px)`
              : 'none',
            transform: animStyle.transform,
            transformOrigin: 'top center',
            ...style.dividerLine,
          }}
        />
      )}
      
      {/* VS Badge */}
      {type === 'vs' && (
        <div
          style={{
            width: dividerSize,
            height: dividerSize,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 6px 20px ${color}50`,
            transform: `scale(${animStyle.opacity})`,
            ...style.vsBadge,
          }}
        >
          <Text
            text={label || 'VS'}
            variant="body"
            weight={700}
            style={{
              fontSize: dividerSize * 0.35,
              color: '#fff',
              letterSpacing: 2,
              ...style.vsText,
            }}
          />
        </div>
      )}

      {/* Bottom line */}
      {(type === 'line' || type === 'dashed' || type === 'vs') && (
        <div
          style={{
            width: 3,
            height: slotHeight * 0.25,
            backgroundColor: type === 'dashed' ? 'transparent' : `${color}40`,
            backgroundImage: type === 'dashed' 
              ? `repeating-linear-gradient(to bottom, ${color} 0, ${color} 8px, transparent 8px, transparent 16px)`
              : 'none',
            transform: animStyle.transform,
            transformOrigin: 'bottom center',
            ...style.dividerLine,
          }}
        />
      )}
    </div>
  );
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const MediaLayer = ({ media = {}, beats }) => {
  if (media.lottie) {
    return (
      <RemotionLottie
        lottieRef={media.lottie}
        loop={media.loop ?? true}
        playbackRate={media.playbackRate ?? 1}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }

  if (media.image) {
    const imageConfig =
      typeof media.image === 'string' ? { src: media.image } : media.image;

    if (!imageConfig.src) {
      console.warn('SideBySideCompare: image media requires src');
      return null;
    }

    return (
      <ImageAtom
        src={imageConfig.src}
        alt={imageConfig.alt || media.alt || ''}
        fit={imageConfig.fit || media.fit || 'cover'}
        beats={beats}
        borderRadius={imageConfig.borderRadius ?? media.borderRadius ?? 24}
        style={{ width: '100%', height: '100%', ...(imageConfig.style || {}) }}
      />
    );
  }

  return null;
};

const BeforeAfterCompare = ({
  before,
  after,
  slider,
  beats,
  style,
  slot,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sliderBeats = resolveBeats(slider?.beats, {
    start: beats?.start ?? 0.8,
    holdDuration: slider?.duration ?? 2,
  });
  const startFrame = toFrames(sliderBeats.start, fps);
  const exitFrame = toFrames(sliderBeats.exit, fps);
  const progress = clamp((frame - startFrame) / Math.max(1, exitFrame - startFrame), 0, 1);
  const from = slider?.from ?? 0.2;
  const to = slider?.to ?? 0.8;
  const autoAnimate = slider?.autoAnimate !== false;
  const baseValue = autoAnimate ? from + (to - from) * progress : slider?.initial ?? 0.5;
  const sliderValue = clamp(baseValue, 0.05, 0.95);
  const sliderPercent = sliderValue * 100;

  return (
    <div
      style={{
        position: 'absolute',
        left: slot.left,
        top: slot.top,
        width: slot.width,
        height: slot.height,
        overflow: 'hidden',
        borderRadius: 28,
        ...style.beforeAfterWrapper,
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <MediaLayer media={before?.media} beats={beats} />
        {before?.title && (
          <div
            style={{
              position: 'absolute',
              left: 24,
              bottom: 24,
              background: 'rgba(0,0,0,0.45)',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 28,
            }}
          >
            {before.title}
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 0 0 ${sliderPercent}%)`,
          transition: 'clip-path 0.2s linear',
        }}
      >
        <MediaLayer media={after?.media} beats={beats} />
        {after?.title && (
          <div
            style={{
              position: 'absolute',
              right: 24,
              bottom: 24,
              background: 'rgba(0,0,0,0.45)',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 28,
            }}
          >
            {after.title}
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPercent}%`,
          width: 4,
          background: '#fff',
          boxShadow: '0 0 20px rgba(0,0,0,0.2)',
          transform: 'translateX(-2px)',
        }}
      />
    </div>
  );
};

/**
 * SideBySideCompare Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Object} props.config.left - Left side configuration (required)
 * @param {string} props.config.left.title - Left side title
 * @param {string} [props.config.left.subtitle] - Left side subtitle
 * @param {string} [props.config.left.icon] - Left side icon/emoji
 * @param {Array} [props.config.left.items] - List of items/bullets
 * @param {string} [props.config.left.color] - Accent color
 * @param {string} [props.config.left.backgroundColor] - Background color
 * @param {Object} props.config.right - Right side configuration (required)
 * @param {string} [props.config.animation='slide'] - Animation: 'slide' | 'fade' | 'scale' | 'bounce' | 'reveal'
 * @param {number} [props.config.staggerDelay=0.3] - Delay between sides in seconds
 * @param {number} [props.config.animationDuration=0.6] - Animation duration in seconds
 * @param {string} [props.config.dividerType='vs'] - Divider type: 'none' | 'line' | 'dashed' | 'vs'
 * @param {string} [props.config.dividerLabel='VS'] - Label for VS badge
 * @param {string} [props.config.dividerColor='primary'] - Divider color
 * @param {string} [props.config.alignment='center'] - Content alignment: 'center' | 'inner'
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start time in seconds (required)
 * @param {Object} [props.config.position] - Slot position from layout resolver
 * @param {Object} [props.config.style] - Optional style overrides
 */
export const SideBySideCompare = ({ config, stylePreset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    left = {},
    right = {},
    before,
    after,
    mode = 'standard',
    slider = {},
    animation = 'slide',
    staggerDelay = 0.3,
    animationDuration = 0.6,
    dividerType = 'vs',
    dividerLabel = 'VS',
    dividerColor = 'primary',
    alignment = 'center',
    beats = {},
    position,
    style = {},
    // Format can be explicitly set or auto-detected from viewport
    _format,
  } = config;
  const preset = resolveStylePreset(stylePreset);
  
  // Auto-detect mobile format from viewport or explicit config
  const isMobile = _format === 'mobile' || height > width;

  // Validate required fields
  if (mode !== 'beforeAfter' && !left.title && !right.title) {
    console.warn('SideBySideCompare: No content provided');
    return null;
  }

  const sequenceBeats = resolveBeats(beats, {
    start: 0.8,
    holdDuration: animationDuration,
  });
  const startFrame = toFrames(sequenceBeats.start, fps);
  const staggerFrames = toFrames(staggerDelay, fps);
  const durationFrames = toFrames(animationDuration, fps);
  
  // Calculate slot dimensions
  const slot = {
    width: position?.width || width,
    height: position?.height || height,
    left: position?.left || 0,
    top: position?.top || 0,
  };

  if (mode === 'beforeAfter' && before && after) {
    return (
      <AbsoluteFill>
        <BeforeAfterCompare
          before={before}
          after={after}
          slider={slider}
          beats={beats}
          slot={slot}
          style={style}
        />
      </AbsoluteFill>
    );
  }

  // Resolve divider color
  const resolvedDividerColor = KNODE_THEME.colors[dividerColor] || dividerColor;

  // Calculate animation timings
  const leftStartFrame = startFrame;
  const dividerStartFrame = startFrame + staggerFrames * 0.5;
  const rightStartFrame = startFrame + staggerFrames;

  // Get animation styles
  const leftAnimStyle = getSideAnimationStyle(animation, frame, leftStartFrame, durationFrames, fps, 'left');
  const rightAnimStyle = getSideAnimationStyle(animation, frame, rightStartFrame, durationFrames, fps, 'right');
  const dividerAnimStyle = getDividerAnimationStyle(frame, dividerStartFrame, durationFrames, fps);

  // Calculate font size based on slot
  const baseFontSize = Math.min(28, Math.max(16, slot.height / 20));

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: slot.left,
          top: slot.top,
          width: slot.width,
          height: slot.height,
          display: 'flex',
          // Mobile: stack vertically (top/bottom), Desktop: side by side (left/right)
          flexDirection: isMobile ? 'column' : 'row',
          ...style.container,
        }}
      >
        {/* Left side (or Top on mobile) */}
        <ComparisonSide
          config={{ ...left, alignment: isMobile ? 'center' : alignment }}
          side={isMobile ? 'top' : 'left'}
          animStyle={leftAnimStyle}
          baseFontSize={baseFontSize}
          slotHeight={isMobile ? slot.height / 2 : slot.height}
          style={style}
          textColorKey={preset.textColor}
        />

        {/* Right side (or Bottom on mobile) */}
        <ComparisonSide
          config={{ ...right, alignment: isMobile ? 'center' : alignment }}
          side={isMobile ? 'bottom' : 'right'}
          animStyle={rightAnimStyle}
          baseFontSize={baseFontSize}
          slotHeight={isMobile ? slot.height / 2 : slot.height}
          style={style}
          textColorKey={preset.textColor}
        />
      </div>

      {/* Divider (positioned absolutely over the container) */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            left: slot.left,
            top: slot.top,
            width: slot.width,
            height: slot.height,
            pointerEvents: 'none',
          }}
        >
          <VsDivider
            type={dividerType}
            label={dividerLabel}
            color={resolvedDividerColor}
            animStyle={dividerAnimStyle}
            slotHeight={slot.height}
            baseFontSize={baseFontSize}
            style={style}
          />
        </div>
      )}
      
      {/* Horizontal divider for mobile */}
      {isMobile && dividerType !== 'none' && (
        <div
          style={{
            position: 'absolute',
            left: slot.left + slot.width * 0.1,
            top: slot.top + slot.height / 2,
            width: slot.width * 0.8,
            height: 3,
            backgroundColor: `${resolvedDividerColor}40`,
            transform: 'translateY(-50%)',
            opacity: dividerAnimStyle.opacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export default SideBySideCompare;
