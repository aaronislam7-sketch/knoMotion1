import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { Divider } from '../atoms/Divider';
import { KNODE_THEME } from '../../theme/knodeTheme';
import { fadeSlide, scaleIn } from '../../animations';

/**
 * HeroWithText - Composition element for hero sections
 * 
 * @param {object} props
 * @param {string} props.heroRef - Hero content reference (emoji, icon, image) (STANDARDIZED)
 * @param {string} props.title - Main title (STANDARDIZED)
 * @param {string} props.subtitle - Subtitle/tagline (STANDARDIZED)
 * @param {string} props.layout - 'horizontal'|'vertical'
 * @param {object} props.animation - Animation config for entrance
 * @param {object} props.style - Style overrides
 */
export const HeroWithText = ({ 
  heroRef,
  title,
  subtitle = null,
  layout = 'vertical',
  animation = null,
  style = {},
  ...props 
}) => {
  const theme = KNODE_THEME;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const isVertical = layout === 'vertical';
  
  // Staggered animations
  const heroAnim = animation ? {
    type: 'scaleIn',
    startFrame: animation.startFrame || 0,
    duration: 0.7,
  } : null;
  
  const titleAnim = animation ? {
    type: 'fadeSlide',
    startFrame: (animation.startFrame || 0) + Math.round(0.3 * fps),
    duration: 0.6,
    direction: 'up',
  } : null;
  
  const subtitleAnim = animation ? {
    type: 'fadeSlide',
    startFrame: (animation.startFrame || 0) + Math.round(0.5 * fps),
    duration: 0.5,
    direction: 'up',
  } : null;
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        gap: theme.spacing.cardPadding * 1.5,
        textAlign: isVertical ? 'center' : 'left',
        ...style,
      }}
      {...props}
    >
      {/* Hero */}
      <Icon iconRef={heroRef} size="xl" animation={heroAnim} />
      
      {/* Text Content */}
      <div style={{ flex: 1 }}>
        <Text 
          text={title}
          variant="display" 
          size="xl" 
          weight="bold"
          animation={titleAnim}
        />
        
        {subtitle && (
          <>
            <Divider 
              orientation="horizontal"
              thickness={3}
              color="primary"
              length={isVertical ? '60%' : '100%'}
              style={{ 
                margin: `${theme.spacing.cardPadding * 0.5}px ${isVertical ? 'auto' : '0'}`,
              }}
            />
            <Text 
              text={subtitle}
              variant="body" 
              size="lg" 
              color="textSecondary"
              animation={subtitleAnim}
              style={{ marginTop: theme.spacing.cardPadding * 0.5 }}
            />
          </>
        )}
      </div>
    </div>
  );
};
