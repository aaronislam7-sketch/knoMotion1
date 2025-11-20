import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { 
  getParticleTrail,
  getContinuousShimmer,
  getContinuousWobble,
  getContinuousColorPulse,
  getContinuousBounce,
  getContinuousBreathing,
  getContinuousFloating,
  getContinuousRotation,
} from '../sdk/animations';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';
import { Card } from '../sdk/elements';

/**
 * ContinuousAnimationShowcase
 * Demonstrates all continuous life animations
 * Perfect for testing and showcasing animation capabilities
 */
export const ContinuousAnimationShowcase = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = KNODE_THEME;

  // Animation configs
  const particleTrail = getParticleTrail(frame, { 
    particleCount: 15, 
    trailLength: 40, 
    speed: 1.5,
    pathType: 'circular',
    color: theme.colors.primary,
  });

  const shimmer = getContinuousShimmer(frame, { 
    speed: 0.02, 
    width: 100, 
    angle: 45,
    intensity: 0.5,
  });

  const wobble = getContinuousWobble(frame, { 
    intensity: 5, 
    speed: 1.2, 
    direction: 'both',
  });

  const colorPulse = getContinuousColorPulse(frame, { 
    colors: [theme.colors.primary, theme.colors.accentGreen, theme.colors.doodle],
    duration: 90,
    easing: 'ease-in-out',
  });

  const bounce = getContinuousBounce(frame, { 
    height: 15, 
    speed: 1, 
    easing: 'bounce',
  });

  const breathing = getContinuousBreathing(frame, { 
    minScale: 0.95, 
    maxScale: 1.05, 
    duration: 60,
  });

  const floating = getContinuousFloating(frame, { 
    distance: 20, 
    duration: 90,
  });

  const rotation = getContinuousRotation(frame, { 
    speed: 0.5,
  });

  // Styles
  const containerStyles = {
    backgroundColor: theme.colors.bg,
    padding: 60,
  };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 40,
    marginTop: 80,
  };

  const demoBoxStyles = {
    padding: theme.spacing.cardPadding * 1.5,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radii.card,
    boxShadow: theme.shadows.card,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    minHeight: 200,
  };

  const labelStyles = {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: theme.fonts.header,
    color: theme.colors.textMain,
    textAlign: 'center',
  };

  const descStyles = {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  };

  const demoElementStyles = {
    width: 100,
    height: 100,
    borderRadius: theme.radii.card,
    backgroundColor: theme.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    position: 'relative',
  };

  return (
    <AbsoluteFill style={containerStyles}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        borderBottom: `3px solid ${theme.colors.primary}`,
        paddingBottom: 20,
      }}>
        <h1 style={{ 
          fontSize: 56, 
          fontWeight: 700, 
          fontFamily: theme.fonts.marker, 
          color: theme.colors.primary,
          margin: 0,
        }}>
          Continuous Life Animations
        </h1>
        <p style={{ 
          fontSize: 20, 
          color: theme.colors.textSecondary,
          margin: '10px 0 0 0',
        }}>
          Engagement-boosting animations that loop infinitely
        </p>
      </div>

      {/* Animation Grid */}
      <div style={gridStyles}>
        {/* Particle Trail */}
        <div style={demoBoxStyles}>
          <div style={labelStyles}>Particle Trail</div>
          <div style={descStyles}>Following path with fade</div>
          <div style={{ ...demoElementStyles, backgroundColor: 'transparent' }}>
            {particleTrail.map((particle, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: particle.size,
                  height: particle.size,
                  borderRadius: '50%',
                  backgroundColor: particle.color,
                  opacity: particle.opacity,
                  transform: `translate(${particle.x}px, ${particle.y}px)`,
                }}
              />
            ))}
            <span>✨</span>
          </div>
        </div>

        {/* Shimmer/Shine */}
        <div style={demoBoxStyles}>
          <div style={labelStyles}>Shimmer/Shine</div>
          <div style={descStyles}>Light sweep across element</div>
          <div 
            style={{ 
              ...demoElementStyles,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              ...shimmer,
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>💎</span>
          </div>
        </div>

        {/* Wobble/Jiggle */}
        <div style={demoBoxStyles}>
          <div style={labelStyles}>Wobble/Jiggle</div>
          <div style={descStyles}>Playful shake effect</div>
          <div style={{ ...demoElementStyles, ...wobble }}>
            <span>🎯</span>
          </div>
        </div>

        {/* Color Pulse */}
        <div style={demoBoxStyles}>
          <div style={labelStyles}>Color Pulse</div>
          <div style={descStyles}>Smooth color transitions</div>
          <div style={{ ...demoElementStyles, ...colorPulse }}>
            <span style={{ color: theme.colors.cardBg }}>🎨</span>
          </div>
        </div>

        {/* Bounce Loop */}
        <div style={demoBoxStyles}>
          <div style={labelStyles}>Bounce Loop</div>
          <div style={descStyles}>Continuous bouncing</div>
          <div style={{ ...demoElementStyles, ...bounce }}>
            <span>⬆️</span>
          </div>
        </div>

        {/* Breathing (existing) */}
        <div style={demoBoxStyles}>
          <div style={labelStyles}>Breathing</div>
          <div style={descStyles}>Subtle scale pulse</div>
          <div style={{ ...demoElementStyles, ...breathing }}>
            <span>🫁</span>
          </div>
        </div>

        {/* Floating (existing) */}
        <div style={demoBoxStyles}>
          <div style={labelStyles}>Floating</div>
          <div style={descStyles}>Gentle up/down motion</div>
          <div style={{ ...demoElementStyles, ...floating }}>
            <span>☁️</span>
          </div>
        </div>

        {/* Rotation (existing) */}
        <div style={demoBoxStyles}>
          <div style={labelStyles}>Rotation</div>
          <div style={descStyles}>Continuous spin</div>
          <div style={{ ...demoElementStyles, ...rotation }}>
            <span>⚙️</span>
          </div>
        </div>

        {/* Combined Effect Example */}
        <div style={{ ...demoBoxStyles, gridColumn: '1 / -1', minHeight: 250 }}>
          <div style={labelStyles}>Combined Effects</div>
          <div style={descStyles}>Multiple animations working together</div>
          <div style={{ 
            display: 'flex', 
            gap: 30, 
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
            {/* Bounce + Color Pulse */}
            <div style={{ 
              ...demoElementStyles, 
              ...bounce, 
              ...colorPulse,
            }}>
              <span style={{ color: theme.colors.cardBg }}>🚀</span>
            </div>

            {/* Wobble + Shimmer */}
            <div style={{ 
              ...demoElementStyles, 
              ...wobble,
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                ...shimmer,
              }} />
              <span style={{ position: 'relative', zIndex: 1 }}>⚡</span>
            </div>

            {/* Floating + Breathing */}
            <div style={{ 
              ...demoElementStyles, 
              ...floating,
              ...breathing,
            }}>
              <span>🎈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
      }}>
        <p style={{ 
          fontSize: 14, 
          color: theme.colors.textSecondary,
        }}>
          Frame: {frame} | FPS: {fps} | All animations deterministic & Remotion-compatible ✅
        </p>
      </div>
    </AbsoluteFill>
  );
};
