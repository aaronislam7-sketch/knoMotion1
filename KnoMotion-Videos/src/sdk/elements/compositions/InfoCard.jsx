import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { ImageAtom } from '../atoms/Image';
import { KNODE_THEME } from '../../theme/knodeTheme';

/**
 * InfoCard - Beautiful composition element for grid/info displays
 * 
 * A visually rich card designed for grid layouts, featuring:
 * - Icon/emoji OR image with animated support
 * - Primary label with sublabel support
 * - Style preset integration for consistent theming
 * - Beautiful accent styling based on preset colors
 * - Subtle decorative elements (accent bar, glow effects)
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
  stylePreset,
  animation = null,
  style = {},
  ...props
}) => {
  const theme = KNODE_THEME;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Size presets
  const sizeStyles = {
    sm: {
      iconSize: 'md',
      iconFontSize: 36,
      labelSize: 'sm',
      sublabelSize: 'xs',
      padding: theme.spacing.cardPadding * 0.8,
      gap: 10,
      accentHeight: 3,
    },
    md: {
      iconSize: 'lg',
      iconFontSize: 48,
      labelSize: 'md',
      sublabelSize: 'sm',
      padding: theme.spacing.cardPadding,
      gap: 14,
      accentHeight: 4,
    },
    lg: {
      iconSize: 'xl',
      iconFontSize: 64,
      labelSize: 'lg',
      sublabelSize: 'md',
      padding: theme.spacing.cardPadding * 1.3,
      gap: 18,
      accentHeight: 5,
    },
  };
  
  const sizeConfig = sizeStyles[size] || sizeStyles.md;
  
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
    const { type = 'scaleIn', startFrame = 0, duration = 0.5 } = animation;
    const durationFrames = Math.round(duration * fps);
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
  const hasIcon = icon && !image;
  const hasImage = !!image;
  
  // Icon container with decorative background
  const renderIconContainer = () => {
    if (!hasIcon && !hasImage) return null;
    
    const containerStyle = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isVertical ? '100%' : 'auto',
      flexShrink: 0,
    };
    
    // Decorative glow behind icon
    const glowStyle = {
      position: 'absolute',
      width: sizeConfig.iconFontSize * 1.4,
      height: sizeConfig.iconFontSize * 1.4,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${resolvedAccent}12 0%, transparent 70%)`,
      filter: 'blur(8px)',
      zIndex: 0,
    };
    
    if (hasImage) {
      const imageSize = sizeConfig.iconFontSize * 1.2;
      return (
        <div style={containerStyle}>
          <div style={glowStyle} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <ImageAtom
              src={image}
              fit="cover"
              borderRadius={imageRounded ? imageSize : 12}
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
          size={sizeConfig.iconSize}
          animated={animated}
          style={{
            fontSize: sizeConfig.iconFontSize,
            position: 'relative',
            zIndex: 1,
          }}
        />
      </div>
    );
  };
  
  // Text content section
  const renderTextContent = () => {
    if (!label && !sublabel) return null;
    
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isVertical ? 'center' : 'flex-start',
          textAlign: isVertical ? 'center' : 'left',
          gap: 4,
          flex: isVertical ? undefined : 1,
          minWidth: 0, // Allow text truncation
        }}
      >
        {label && (
          <Text
            text={label}
            variant="title"
            size={sizeConfig.labelSize}
            weight="bold"
            color="textMain"
            style={{
              lineHeight: 1.25,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          />
        )}
        {sublabel && (
          <Text
            text={sublabel}
            variant="body"
            size={sizeConfig.sublabelSize}
            weight="normal"
            color="textSoft"
            style={{
              lineHeight: 1.35,
              maxWidth: '100%',
              opacity: 0.85,
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
          opacity: 0.6,
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
