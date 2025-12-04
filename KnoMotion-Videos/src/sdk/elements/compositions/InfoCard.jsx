import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { ImageAtom } from '../atoms/Image';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * Calculate optimal content sizing to fit within available card space
 * Uses layout engine principles for constraint-based sizing
 * 
 * @param {Object} params
 * @param {number} params.cardWidth - Available card width
 * @param {number} params.cardHeight - Available card height  
 * @param {boolean} params.hasIcon - Whether card has icon/image
 * @param {boolean} params.hasLabel - Whether card has label
 * @param {boolean} params.hasSublabel - Whether card has sublabel
 * @param {string} params.size - Size preset (sm, md, lg)
 * @returns {Object} Calculated dimensions for icon, label, padding
 */
const calculateContentSizing = ({
  cardWidth,
  cardHeight,
  hasIcon,
  hasLabel,
  hasSublabel,
  size = 'md',
}) => {
  // Base ratios for content distribution
  const paddingRatio = size === 'sm' ? 0.08 : size === 'lg' ? 0.1 : 0.09;
  const accentHeightRatio = 0.02;
  const gapRatio = 0.04;
  
  // Calculate padding based on smaller dimension for consistent look
  const minDim = Math.min(cardWidth, cardHeight);
  const padding = Math.max(8, Math.min(24, minDim * paddingRatio));
  const accentHeight = Math.max(2, Math.min(5, minDim * accentHeightRatio));
  const gap = Math.max(6, Math.min(16, minDim * gapRatio));
  
  // Available content area after padding
  const contentWidth = cardWidth - padding * 2;
  const contentHeight = cardHeight - padding * 2 - accentHeight;
  
  // Calculate label heights (estimate based on font sizing)
  const baseFontSize = Math.max(12, Math.min(28, minDim * 0.12));
  const labelHeight = hasLabel ? baseFontSize * 1.3 : 0;
  const sublabelHeight = hasSublabel ? baseFontSize * 0.85 * 1.3 : 0;
  const totalLabelHeight = labelHeight + sublabelHeight + (hasSublabel ? 4 : 0);
  
  // Calculate icon size - fill remaining space after labels
  let iconSize = 0;
  if (hasIcon) {
    const availableForIcon = contentHeight - totalLabelHeight - (hasLabel ? gap : 0);
    // Icon should be square and fit within content width too
    iconSize = Math.max(24, Math.min(availableForIcon * 0.9, contentWidth * 0.6));
  }
  
  return {
    padding,
    accentHeight,
    gap,
    iconSize,
    labelFontSize: baseFontSize,
    sublabelFontSize: baseFontSize * 0.75,
    contentWidth,
    contentHeight,
  };
};

/**
 * InfoCard - Beautiful composition element for grid/info displays
 * 
 * A visually rich card designed for grid layouts, featuring:
 * - Icon/emoji OR image with animated support
 * - Primary label with sublabel support
 * - Style preset integration for consistent theming
 * - Beautiful accent styling based on preset colors
 * - Constraint-aware sizing that prevents clipping
 * 
 * @param {Object} props
 * @param {string} props.icon - Icon/emoji reference (use this OR image)
 * @param {string} props.image - Image URL (use this OR icon)
 * @param {boolean} props.imageRounded - Make image circular
 * @param {string} props.label - Primary label text
 * @param {string} props.sublabel - Secondary description text
 * @param {boolean} props.animated - Whether to use animated emoji
 * @param {string} props.accentColor - Custom accent color (defaults to preset)
 * @param {'vertical'|'horizontal'} props.layout - Card layout direction
 * @param {'default'|'bordered'|'glass'|'elevated'|'gradient'} props.variant - Card style variant
 * @param {'sm'|'md'|'lg'} props.size - Card size preset
 * @param {number} props.cardWidth - Explicit card width for constraint calculations
 * @param {number} props.cardHeight - Explicit card height for constraint calculations
 * @param {string} props.stylePreset - Style preset name for theming
 * @param {Object} props.animation - Animation config { type, startFrame, duration }
 * @param {Object} props.style - Additional style overrides
 */
export const InfoCard = ({
  icon,
  image,
  imageRounded = false,
  label,
  sublabel,
  animated = false,
  accentColor,
  layout = 'vertical',
  variant = 'default',
  size = 'md',
  cardWidth,
  cardHeight,
  stylePreset,
  animation = null,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Determine if we have content
  const hasIcon = !!(icon || image);
  const hasLabel = !!label;
  const hasSublabel = !!sublabel;
  
  // Calculate constraint-aware sizing if dimensions provided
  const sizing = (cardWidth && cardHeight) 
    ? calculateContentSizing({
        cardWidth,
        cardHeight,
        hasIcon,
        hasLabel,
        hasSublabel,
        size,
      })
    : null;
  
  // Fallback size presets for when dimensions aren't provided
  const sizeStyles = {
    sm: {
      iconSize: 'md',
      iconFontSize: 36,
      labelFontSize: 14,
      sublabelFontSize: 11,
      padding: theme.spacing.cardPadding * 0.8,
      gap: 10,
      accentHeight: 3,
    },
    md: {
      iconSize: 'lg',
      iconFontSize: 48,
      labelFontSize: 18,
      sublabelFontSize: 14,
      padding: theme.spacing.cardPadding,
      gap: 14,
      accentHeight: 4,
    },
    lg: {
      iconSize: 'xl',
      iconFontSize: 64,
      labelFontSize: 24,
      sublabelFontSize: 18,
      padding: theme.spacing.cardPadding * 1.3,
      gap: 18,
      accentHeight: 5,
    },
  };
  
  const fallbackConfig = sizeStyles[size] || sizeStyles.md;
  
  // Use calculated sizing if available, otherwise fallback
  const sizeConfig = {
    padding: sizing?.padding ?? fallbackConfig.padding,
    accentHeight: sizing?.accentHeight ?? fallbackConfig.accentHeight,
    gap: sizing?.gap ?? fallbackConfig.gap,
    iconFontSize: sizing?.iconSize ?? fallbackConfig.iconFontSize,
    labelFontSize: sizing?.labelFontSize ?? fallbackConfig.labelFontSize,
    sublabelFontSize: sizing?.sublabelFontSize ?? fallbackConfig.sublabelFontSize,
  };
  
  // Resolve accent color based on style preset
  const getPresetAccent = () => {
    switch (stylePreset) {
      case 'playful':
        return theme.colors.primary; // warm coral
      case 'educational':
        return theme.colors.doodle; // gold/amber
      case 'mentor':
        return theme.colors.accentGreen; // success green
      case 'focus':
        return theme.colors.secondary; // purple
      case 'minimal':
        return theme.colors.textMuted; // subtle gray
      default:
        return theme.colors.primary;
    }
  };
  
  const resolvedAccent = accentColor 
    ? (theme.colors[accentColor] || accentColor)
    : getPresetAccent();
  
  // Create soft glow color from accent
  const glowColor = `${resolvedAccent}15`; // 15% opacity
  const accentGradient = `linear-gradient(135deg, ${resolvedAccent}20, ${resolvedAccent}05)`;
  
  // Variant-specific styles with enhanced aesthetics
  const getVariantStyle = () => {
    const baseVariant = {
      default: {
        backgroundColor: theme.colors.cardBg,
        boxShadow: `0 4px 20px ${theme.colors.cardShadow}, 0 0 0 1px ${resolvedAccent}08`,
        border: 'none',
      },
      bordered: {
        backgroundColor: theme.colors.cardBg,
        boxShadow: 'none',
        border: `2px solid ${resolvedAccent}25`,
      },
      glass: {
        background: `linear-gradient(145deg, rgba(255,255,255,0.95), ${glowColor})`,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 8px 32px ${theme.colors.cardShadow}`,
        border: `1px solid ${theme.colors.cardBg}60`,
      },
      elevated: {
        backgroundColor: theme.colors.cardBg,
        boxShadow: `0 12px 40px ${theme.colors.cardShadow}, 0 2px 8px ${resolvedAccent}10`,
        border: 'none',
      },
      gradient: {
        background: accentGradient,
        boxShadow: `0 8px 24px ${resolvedAccent}15`,
        border: `1px solid ${resolvedAccent}15`,
      },
    };
    
    return baseVariant[variant] || baseVariant.default;
  };
  
  const variantStyle = getVariantStyle();
  
  // Animation support
  let animStyle = {};
  if (animation) {
    const { type = 'scaleIn', startFrame = 0 } = animation;
    const progress = spring({
      frame: Math.max(0, frame - startFrame),
      fps,
      config: { damping: 15, mass: 1, stiffness: 120 },
    });
    
    if (type === 'scaleIn') {
      animStyle = {
        opacity: progress,
        transform: `scale(${0.85 + progress * 0.15})`,
      };
    } else if (type === 'slideUp') {
      animStyle = {
        opacity: progress,
        transform: `translateY(${(1 - progress) * 20}px)`,
      };
    } else if (type === 'fadeIn') {
      animStyle = {
        opacity: progress,
      };
    }
  }
  
  const isVertical = layout === 'vertical';
  
  // Icon container with decorative background
  const renderIconContainer = () => {
    // Skip if no icon AND no image
    if (!icon && !image) return null;
    
    const iconDisplaySize = sizeConfig.iconFontSize;
    
    const containerStyle = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isVertical ? '100%' : 'auto',
      flexShrink: 0,
      // Constrain icon container to prevent overflow
      maxHeight: iconDisplaySize * 1.1,
    };
    
    // Decorative glow behind icon (subtle, scaled to icon size)
    const glowSize = Math.min(iconDisplaySize * 1.3, 100);
    const glowStyle = {
      position: 'absolute',
      width: glowSize,
      height: glowSize,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${resolvedAccent}10 0%, transparent 70%)`,
      filter: 'blur(6px)',
      zIndex: 0,
    };
    
    if (image) {
      const imageSize = iconDisplaySize;
      return (
        <div style={containerStyle}>
          <div style={glowStyle} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <ImageAtom
              src={image}
              fit="cover"
              borderRadius={imageRounded ? imageSize : Math.min(12, imageSize * 0.15)}
              style={{
                width: imageSize,
                height: imageSize,
              }}
            />
          </div>
        </div>
      );
    }
    
    return (
      <div style={containerStyle}>
        <div style={glowStyle} />
        <Icon
          iconRef={icon}
          animated={animated}
          style={{
            fontSize: iconDisplaySize,
            lineHeight: 1,
            position: 'relative',
            zIndex: 1,
          }}
        />
      </div>
    );
  };
  
  // Text content section with constraint-aware sizing
  const renderTextContent = () => {
    if (!hasLabel && !hasSublabel) return null;
    
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isVertical ? 'center' : 'flex-start',
          textAlign: isVertical ? 'center' : 'left',
          gap: 2,
          flex: isVertical ? undefined : 1,
          minWidth: 0,
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {hasLabel && (
          <Text
            text={label}
            variant="title"
            weight="bold"
            color="textMain"
            style={{
              fontSize: sizeConfig.labelFontSize,
              lineHeight: 1.2,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          />
        )}
        {hasSublabel && (
          <Text
            text={sublabel}
            variant="body"
            weight="normal"
            color="textSoft"
            style={{
              fontSize: sizeConfig.sublabelFontSize,
              lineHeight: 1.25,
              maxWidth: '100%',
              opacity: 0.8,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          />
        )}
      </div>
    );
  };
  
  // Top accent bar (subtle decorative element)
  const renderAccentBar = () => {
    if (variant === 'minimal') return null;
    
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40%',
          height: sizeConfig.accentHeight,
          background: `linear-gradient(90deg, transparent, ${resolvedAccent}, transparent)`,
          borderRadius: `0 0 ${sizeConfig.accentHeight}px ${sizeConfig.accentHeight}px`,
          opacity: 0.5,
        }}
      />
    );
  };
  
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeConfig.gap,
        padding: sizeConfig.padding,
        paddingTop: sizeConfig.padding + sizeConfig.accentHeight,
        borderRadius: theme.radii.card,
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...variantStyle,
        ...animStyle,
        ...style,
      }}
      {...props}
    >
      {renderAccentBar()}
      {renderIconContainer()}
      {renderTextContent()}
    </div>
  );
};

export default InfoCard;
