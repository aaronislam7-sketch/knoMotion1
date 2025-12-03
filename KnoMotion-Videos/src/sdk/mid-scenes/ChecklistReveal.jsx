/**
 * ChecklistReveal - Mid-Scene Component
 * 
 * Renders a checklist with bullet/tick items that reveal with staggered animations.
 * Features auto-fitting text, pop animations, and customizable icons.
 * All configurable via JSON - pre-built for LLM JSON generation.
 * 
 * @module mid-scenes/ChecklistReveal
 * @category SDK
 * @subcategory Mid-Scenes
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';
import { Text } from '../elements/atoms/Text';
import { Icon } from '../elements/atoms/Icon';
import { ARRANGEMENT_TYPES, calculateItemPositions } from '../layout/layoutEngine';
import { positionToCSS as positionToCSSWithTransform } from '../layout/positionSystem';
import { fadeIn, slideIn, scaleIn, bounceIn } from '../animations/index';
import { RemotionLottie } from '../lottie/lottieIntegration';
import { toFrames } from '../core/time';
import { KNODE_THEME } from '../theme/knodeTheme';
import { resolveStylePreset } from '../theme/stylePresets';
import { resolveBeats } from '../utils/beats';

/**
 * Icon presets for checklist items
 * Includes static icons and lottie animation references
 */
const ICON_PRESETS = {
  // Static icons
  check: '✓',
  checkmark: '✓',
  tick: '✓',
  bullet: '•',
  dot: '●',
  arrow: '→',
  star: '★',
  diamond: '◆',
  circle: '○',
  square: '■',
  plus: '+',
  minus: '−',
  // Lottie presets (these get special handling)
  lottieCheck: { type: 'lottie', ref: 'checkmark', loop: false },
  lottieTick: { type: 'lottie', ref: 'success', loop: false },
  lottieSuccess: { type: 'lottie', ref: 'success', loop: false },
  lottieStar: { type: 'lottie', ref: 'stars', loop: false },
};

/**
 * Get icon based on configuration
 * Returns either a string icon or a lottie config object
 * 
 * @param {string|Object} iconConfig - Icon preset name or custom emoji/text
 * @param {boolean} checked - Whether item is checked (for toggle states)
 * @returns {string|Object} Icon character/emoji or lottie config
 */
const getIcon = (iconConfig, checked = true) => {
  if (!iconConfig) return checked ? '✓' : '○';
  
  if (typeof iconConfig === 'string') {
    const preset = ICON_PRESETS[iconConfig];
    // Check if it's a lottie preset
    if (preset && typeof preset === 'object' && preset.type === 'lottie') {
      return preset;
    }
    return preset || iconConfig;
  }
  
  // Handle object config with checked/unchecked states
  if (iconConfig.checked || iconConfig.unchecked) {
    const icon = checked ? (iconConfig.checked || '✓') : (iconConfig.unchecked || '○');
    // Check if the selected icon is a lottie preset
    if (typeof icon === 'string' && ICON_PRESETS[icon]?.type === 'lottie') {
      return ICON_PRESETS[icon];
    }
    return icon;
  }
  
  // Handle direct lottie config
  if (iconConfig.type === 'lottie') {
    return iconConfig;
  }
  
  return checked ? '✓' : '○';
};

/**
 * Check if icon is a lottie animation
 */
const isLottieIcon = (icon) => {
  return typeof icon === 'object' && icon.type === 'lottie';
};

/**
 * Calculate auto-fit font size based on text length and available width
 * 
 * @param {string} text - Text content
 * @param {number} availableWidth - Available width in pixels
 * @param {number} baseFontSize - Base font size
 * @returns {number} Adjusted font size
 */
const calculateAutoFitFontSize = (text, availableWidth, baseFontSize = 36) => {
  if (!text) return baseFontSize;
  
  // Approximate character width (varies by font)
  const avgCharWidth = baseFontSize * 0.55;
  const textWidth = text.length * avgCharWidth;
  
  if (textWidth <= availableWidth) return baseFontSize;
  
  // Scale down proportionally, with minimum of 60%
  const scaleFactor = Math.max(0.6, availableWidth / textWidth);
  return Math.floor(baseFontSize * scaleFactor);
};

/**
 * Get animation style with pop effect for checklist items
 * 
 * @param {string} revealType - Type of reveal animation
 * @param {number} frame - Current frame
 * @param {number} startFrame - Start frame for animation
 * @param {number} durationFrames - Duration in frames
 * @param {Object} fps - Frames per second
 * @param {boolean} enablePop - Whether to enable pop effect
 * @returns {Object} Style object with opacity, transform, and scale
 */
const getRevealAnimationStyle = (revealType, frame, startFrame, durationFrames, fps, enablePop = true) => {
  const baseDelay = 0;
  
  switch (revealType) {
    case 'pop':
    case 'bounceIn':
      return bounceIn(frame, startFrame, durationFrames);
    
    case 'slide':
    case 'slideIn':
      return slideIn(frame, startFrame, durationFrames, 'left', 40);
    
    case 'scale':
    case 'scaleIn':
      return scaleIn(frame, startFrame, durationFrames, 0);
    
    case 'spring': {
      const progress = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: { damping: 12, mass: 1, stiffness: 150 },
      });
      return {
        opacity: progress,
        transform: `scale(${0.5 + progress * 0.5}) translateX(${(1 - progress) * -30}px)`,
      };
    }
    
    case 'fade':
    case 'fadeIn':
    default:
      return fadeIn(frame, startFrame, durationFrames);
  }
};

/**
 * Get icon animation style (separate from text for pop effect)
 */
const getIconAnimationStyle = (frame, startFrame, durationFrames, fps) => {
  const iconDelay = Math.round(durationFrames * 0.3);
  const iconStartFrame = startFrame + iconDelay;
  
  const progress = spring({
    frame: Math.max(0, frame - iconStartFrame),
    fps,
    config: { damping: 8, mass: 0.8, stiffness: 200 },
  });
  
  return {
    opacity: progress,
    transform: `scale(${progress})`,
  };
};

/**
 * ChecklistReveal Component
 * 
 * @param {Object} props
 * @param {Object} props.config - JSON configuration
 * @param {Array} props.config.items - Array of checklist items (required)
 * @param {string} props.config.items[].text - Item text content
 * @param {boolean} props.config.items[].checked - Whether item is checked (default: true)
 * @param {string} props.config.items[].icon - Custom icon for this item
 * @param {string} props.config.items[].color - Custom color for this item's icon
 * @param {string} props.config.revealType - Animation type: 'pop' | 'slide' | 'fade' | 'scale' | 'spring' (default: 'pop')
 * @param {number} props.config.staggerDelay - Delay between items in seconds (default: 0.2)
 * @param {number} props.config.animationDuration - Animation duration per item in seconds (default: 0.5)
 * @param {string} props.config.icon - Default icon for all items: 'check' | 'bullet' | 'star' | custom emoji (default: 'check')
 * @param {string} props.config.iconColor - Default icon color (default: 'accentGreen')
 * @param {number} props.config.iconSize - Icon size multiplier (default: 1.2)
 * @param {boolean} props.config.autoFitText - Auto-fit text to available width (default: true)
 * @param {string} props.config.alignment - Text alignment: 'left' | 'center' (default: 'left')
 * @param {number} props.config.spacing - Vertical spacing between items (default: auto-calculated)
 * @param {Object} props.config.beats - Beat timings
 * @param {number} props.config.beats.start - Start beat in seconds (required)
 * @param {Object} props.config.position - Optional position override { left, top, width, height }
 * @param {Object} props.config.style - Optional style overrides
 */
export const ChecklistReveal = ({ config, stylePreset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const {
    items = [],
    revealType = 'pop',
    staggerDelay = 0.2,
    animationDuration = 0.5,
    icon = 'check',
    iconColor = 'accentGreen',
    iconSize = 1.2,
    autoFitText = true,
    alignment = 'left',
    spacing: customSpacing,
    beats = {},
    position,
    style = {},
  } = config;
  const preset = resolveStylePreset(stylePreset);

  // Validate required fields
  if (!items || items.length === 0) {
    console.warn('ChecklistReveal: No items provided');
    return null;
  }

  const sequenceBeats = resolveBeats(beats, {
    start: 0.8,
    holdDuration: animationDuration,
  });
  const startFrame = toFrames(sequenceBeats.start, fps);
  const staggerFrames = toFrames(staggerDelay, fps);
  const durationFrames = toFrames(animationDuration, fps);
  
  // Calculate dimensions from position or viewport
  const slotWidth = position?.width || width;
  const slotHeight = position?.height || height;
  const slotLeft = position?.left || 0;
  const slotTop = position?.top || 0;

  // Calculate layout parameters
  const baseFontSize = Math.min(36, slotHeight / (items.length * 2.5));
  const lineHeight = baseFontSize * 1.8;
  const iconWidth = baseFontSize * iconSize * 1.5;
  const textWidth = slotWidth - iconWidth - 40; // Padding
  
  // Auto-calculate spacing if not provided
  const spacing = customSpacing || Math.min(lineHeight, slotHeight / (items.length + 1));

  // Calculate positions using layout engine
  const viewport = { width: slotWidth, height: slotHeight };
  const layoutConfig = {
    arrangement: ARRANGEMENT_TYPES.STACKED_VERTICAL,
    viewport,
    spacing,
    basePosition: 'center',
    centerStack: true,
    ...(position && { 
      area: { 
        left: 0, 
        top: 0, 
        width: slotWidth, 
        height: slotHeight 
      } 
    }),
  };

  const positions = calculateItemPositions(items, layoutConfig);

  // Resolve icon color from theme
  const resolveColor = (colorKey) => {
    if (!colorKey) {
      return KNODE_THEME.colors[preset.textColor] || KNODE_THEME.colors.accentGreen;
    }
    if (colorKey.startsWith('#') || colorKey.startsWith('rgb')) return colorKey;
    return KNODE_THEME.colors[colorKey] || KNODE_THEME.colors.accentGreen;
  };

  return (
    <AbsoluteFill>
      {positions.map((pos, index) => {
        const item = items[index];
        if (!item) return null;

        const itemText = typeof item === 'string' ? item : item.text;
        const itemChecked = typeof item === 'object' ? (item.checked !== false) : true;
        const itemIcon = getIcon(item.icon || icon, itemChecked);
        const itemIconColor = resolveColor(item.color || iconColor);

        // Calculate auto-fit font size
        const fontSize = autoFitText 
          ? calculateAutoFitFontSize(itemText, textWidth, baseFontSize)
          : baseFontSize;

        // Calculate animation timing for this item
        const itemBeats = resolveBeats(item.beats, {
          start: sequenceBeats.start + index * staggerDelay,
          holdDuration: animationDuration,
        });
        const itemStartFrame = toFrames(itemBeats.start, fps);
        const animStyle = getRevealAnimationStyle(
          revealType,
          frame,
          itemStartFrame,
          durationFrames,
          fps,
          true
        );
        const exitFrame = toFrames(itemBeats.exit, fps);
        const exitProgress =
          frame > exitFrame
            ? Math.min(1, (frame - exitFrame) / toFrames(0.25, fps))
            : 0;

        // Separate icon animation with pop effect
        const iconAnimStyle = getIconAnimationStyle(frame, itemStartFrame, durationFrames, fps);

        // Position the item within the slot
        // Note: Don't add slotLeft/slotTop here - parent SceneFromConfig handles slot positioning
        const itemPosition = positionToCSSWithTransform(pos, 'center');

        return (
          <div
            key={index}
            style={{
              ...itemPosition,
              display: 'flex',
              alignItems: 'center',
              justifyContent: alignment === 'center' ? 'center' : 'flex-start',
              width: slotWidth,
              paddingLeft: alignment === 'left' ? 20 : 0,
              paddingRight: 20,
              boxSizing: 'border-box',
              ...style.itemContainer,
            }}
          >
            {/* Icon container with separate animation */}
            <div
              style={{
                opacity: (iconAnimStyle.opacity ?? 1) * (1 - exitProgress),
                transform: iconAnimStyle.transform,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: iconWidth,
                height: iconWidth,
                marginRight: 16,
                fontSize: baseFontSize * iconSize,
                color: itemIconColor,
                flexShrink: 0,
                ...style.iconContainer,
              }}
            >
              {isLottieIcon(itemIcon) ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: itemChecked ? `${itemIconColor}15` : 'transparent',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    ...style.icon,
                  }}
                >
                  <RemotionLottie
                    lottieRef={itemIcon.ref}
                    loop={itemIcon.loop !== undefined ? itemIcon.loop : false}
                    startFrame={itemStartFrame}
                    style={{
                      width: iconWidth * 0.85,
                      height: iconWidth * 0.85,
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundColor: itemChecked ? `${itemIconColor}15` : 'transparent',
                    borderRadius: '50%',
                    border: itemChecked ? 'none' : `2px solid ${KNODE_THEME.colors.textMuted}`,
                    ...style.icon,
                  }}
                >
                  <Icon
                    iconRef={itemIcon}
                    size="md"
                    color={itemChecked ? 'textMain' : 'textSoft'}
                    animated={typeof item === 'object' ? item.animated : false}
                    style={{ fontSize: baseFontSize * iconSize }}
                  />
                </div>
              )}
            </div>

            {/* Text container with main animation */}
            <div
              style={{
                opacity: (animStyle.opacity ?? 1) * (1 - exitProgress),
                transform: animStyle.transform,
                flex: 1,
                maxWidth: textWidth,
                ...style.textContainer,
              }}
            >
              <Text
                text={itemText}
                variant="body"
                size="lg"
                weight={itemChecked ? 600 : 400}
                color={preset.textColor}
                style={{
                  fontSize,
                  lineHeight: `${lineHeight}px`,
                  textDecoration: itemChecked === false ? 'line-through' : 'none',
                  color: itemChecked === false ? KNODE_THEME.colors.textMuted : KNODE_THEME.colors.textMain,
                  ...style.text,
                }}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default ChecklistReveal;
