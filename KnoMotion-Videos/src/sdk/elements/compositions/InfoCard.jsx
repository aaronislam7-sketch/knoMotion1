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
 * TEXT IS PROMINENT - should scale with card size and be easily readable.
 * Icons complement the text but shouldn't overwhelm.
 * 
 * For HORIZONTAL layout (icon beside text):
 * - Icon takes up to 35% of width
 * - Text gets remaining space with prominent sizing
 * 
 * For VERTICAL layout (icon above text):
 * - Icon is balanced with text
 * - Text scales proportionally with card
 * 
 * @param {Object} params
 * @param {number} params.cardWidth - Available card width
 * @param {number} params.cardHeight - Available card height  
 * @param {boolean} params.hasIcon - Whether card has icon/image
 * @param {boolean} params.hasLabel - Whether card has label
 * @param {boolean} params.hasSublabel - Whether card has sublabel
 * @param {string} params.size - Size preset (sm, md, lg)
 * @param {string} params.layout - 'horizontal' or 'vertical'
 * @returns {Object} Calculated dimensions for icon, label, padding
 */
const calculateContentSizing = ({
  cardWidth,
  cardHeight,
  hasIcon,
  hasLabel,
  hasSublabel,
  size = 'md',
  layout = 'horizontal',
}) => {
  // Padding scales with card size
  const paddingRatio = size === 'sm' ? 0.05 : size === 'lg' ? 0.07 : 0.06;
  const accentHeightRatio = 0.012;
  const gapRatio = layout === 'horizontal' ? 0.05 : 0.04;
  
  // Calculate padding based on smaller dimension
  const minDim = Math.min(cardWidth, cardHeight);
  const padding = Math.max(10, Math.min(24, minDim * paddingRatio));
  const accentHeight = Math.max(2, Math.min(4, minDim * accentHeightRatio));
  const gap = Math.max(10, Math.min(20, minDim * gapRatio));
  
  // Available content area after padding
  const contentWidth = cardWidth - padding * 2;
  const contentHeight = cardHeight - padding * 2 - accentHeight;
  
  // Calculate label sizes - MAXIMUM PROMINENCE
  // Font scales very aggressively with card size for poppy, readable text
  // Target: 150px card → 32px font, 300px card → 60px font
  const baseFontSize = Math.max(28, Math.min(72, minDim * 0.22));
  const sublabelSize = Math.max(18, Math.min(42, minDim * 0.14));
  
  // Calculate icon size - smaller to give text prominence
  let iconSize = 0;
  if (hasIcon) {
    if (layout === 'horizontal') {
      // For horizontal: icon is compact, text is the star
      const maxIconWidth = contentWidth * 0.25; // Reduced from 0.35
      const maxIconHeight = contentHeight * 0.6; // Reduced from 0.75
      // Icon sized relative to text - approximately 1.2x the font size (reduced from 1.8)
      const textRelativeSize = baseFontSize * 1.2;
      iconSize = Math.max(32, Math.min(maxIconHeight, maxIconWidth, textRelativeSize, 64));
    } else {
      // For vertical: icon above text, compact
      const labelHeight = hasLabel ? baseFontSize * 1.3 : 0;
      const sublabelHeight = hasSublabel ? sublabelSize * 1.3 : 0;
      const totalLabelHeight = labelHeight + sublabelHeight + (hasSublabel ? 6 : 0);
      const availableForIcon = contentHeight - totalLabelHeight - (hasLabel ? gap : 0);
      // Icon can take up to 40% of available height (reduced from 55%)
      iconSize = Math.max(36, Math.min(availableForIcon * 0.4, contentWidth * 0.4, 72));
    }
  }
  
  return {
    padding,
    accentHeight,
    gap,
    iconSize,
    labelFontSize: baseFontSize,
    sublabelFontSize: sublabelSize,
    contentWidth,
    contentHeight,
    layout,
  };
};

/**
 * InfoCard - Beautiful composition element for grid/info displays
 * 
 * A visually rich card designed for grid layouts, featuring:
 * - Icon/emoji OR image with animated support (ALWAYS animated when icon present)
 * - Primary label with sublabel support
 * - Style preset integration for consistent theming
 * - Beautiful accent styling based on preset colors
 * - Constraint-aware sizing that prevents clipping
 * - HORIZONTAL layout by default for icon cards (icon side-by-side with text)
 * 
 * @param {Object} props
 * @param {string} props.icon - Icon/emoji reference (use this OR image)
 * @param {string} props.image - Image URL (use this OR icon)
 * @param {boolean} props.imageRounded - Make image circular
 * @param {string} props.label - Primary label text
 * @param {string} props.sublabel - Secondary description text
 * @param {boolean} props.animated - Whether to use animated emoji (defaults true for icons)
 * @param {string} props.accentColor - Custom accent color (defaults to preset)
 * @param {'vertical'|'horizontal'} props.layout - Card layout direction (auto-detected based on content)
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
  animated: animatedProp,
  accentColor,
  layout: layoutProp,
  variant = 'default',
  size = 'md',
  cardWidth,
  cardHeight,
  stylePreset,
  animation = null,
  style = {},
  ...props
}) => {
  // Icons should ALWAYS be animated (fallback to static if not in registry)
  const animated = animatedProp !== false ? true : false;
  
  // Auto-detect layout: horizontal for icon cards (icon beside text), vertical for image cards
  const layout = layoutProp || (icon && label ? 'horizontal' : 'vertical');
  const theme = KNODE_THEME;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Determine if we have content
  const hasIcon = !!(icon || image);
  const hasLabel = !!label;
  const hasSublabel = !!sublabel;
  
  const isHorizontal = layout === 'horizontal';
  
  // Calculate constraint-aware sizing if dimensions provided
  const sizing = (cardWidth && cardHeight) 
    ? calculateContentSizing({
        cardWidth,
        cardHeight,
        hasIcon,
        hasLabel,
        hasSublabel,
        size,
        layout,
      })
    : null;
  
  // Fallback size presets for when dimensions aren't provided
  // Text is MAXIMUM prominence - big, bold, poppy
  const sizeStyles = {
    sm: {
      iconSize: 'md',
      iconFontSize: isHorizontal ? 40 : 48,
      labelFontSize: 32,
      sublabelFontSize: 20,
      padding: theme.spacing.cardPadding * 0.5,
      gap: isHorizontal ? 12 : 8,
      accentHeight: 2,
    },
    md: {
      iconSize: 'lg',
      iconFontSize: isHorizontal ? 48 : 56,
      labelFontSize: 42,
      sublabelFontSize: 26,
      padding: theme.spacing.cardPadding * 0.6,
      gap: isHorizontal ? 14 : 10,
      accentHeight: 3,
    },
    lg: {
      iconSize: 'xl',
      iconFontSize: isHorizontal ? 56 : 64,
      labelFontSize: 54,
      sublabelFontSize: 32,
      padding: theme.spacing.cardPadding * 0.7,
      gap: isHorizontal ? 16 : 12,
      accentHeight: 4,
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
      // Let icon fill its space - no max constraints!
    };
    
    // Decorative glow behind icon - scales with icon size (no cap!)
    const glowSize = iconDisplaySize * 1.2;
    const glowStyle = {
      position: 'absolute',
      width: glowSize,
      height: glowSize,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${resolvedAccent}12 0%, transparent 70%)`,
      filter: `blur(${Math.max(6, iconDisplaySize * 0.08)}px)`,
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
  
  // Text content section with constraint-aware sizing - POPPY and prominent
  const renderTextContent = () => {
    if (!hasLabel && !hasSublabel) return null;
    
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isVertical ? 'center' : 'flex-start',
          justifyContent: 'center',
          textAlign: isVertical ? 'center' : 'left',
          gap: 4,
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
              fontWeight: 700, // Explicit bold
              lineHeight: 1.15, // Tighter for impact
              letterSpacing: '-0.02em', // Even tighter letter spacing
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              // Allow 2 lines for horizontal layout, 3 for vertical
              whiteSpace: 'normal',
              display: '-webkit-box',
              WebkitLineClamp: isHorizontal ? 2 : 3,
              WebkitBoxOrient: 'vertical',
            }}
          />
        )}
        {hasSublabel && (
          <Text
            text={sublabel}
            variant="body"
            weight="medium"
            color="textSoft"
            style={{
              fontSize: sizeConfig.sublabelFontSize,
              fontWeight: 500, // Medium weight for readability
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              maxWidth: '100%',
              opacity: 0.9, // More visible
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              // Allow 2 lines
              whiteSpace: 'normal',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
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
