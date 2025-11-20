import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Sequence } from 'remotion';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';
import { StepCard, Text } from '../sdk/elements';

/**
 * Showcase Scene 2: Architecture Deep Dive
 * Duration: 60 seconds (1800 frames @ 30fps)
 * 
 * Sequence:
 * - 0-5s: Title entrance
 * - 5-50s: 4 layer cards (sequential, 10s each)
 * - 50-60s: JSON example highlight
 */
export const ShowcaseScene2_ArchitectureDeepDive = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = KNODE_THEME;

  const containerStyles = {
    backgroundColor: theme.colors.bg,
    padding: 60,
  };

  return (
    <AbsoluteFill style={containerStyles}>
      {/* SEQUENCE 1: Title (0-150 frames = 0-5s) */}
      <Sequence from={0} durationInFrames={150}>
        <TitleSection />
      </Sequence>

      {/* SEQUENCE 2: Layer Cards (150-1500 frames = 5-50s) */}
      <Sequence from={150} durationInFrames={1350}>
        <LayerCardsSequence />
      </Sequence>

      {/* SEQUENCE 3: JSON Example (1500-1800 frames = 50-60s) */}
      <Sequence from={1500} durationInFrames={300}>
        <JSONExample />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Title Section (0-5s)
 */
const TitleSection = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const scale = interpolate(frame, [0, 30], [0.9, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      textAlign: 'center',
      borderBottom: `3px solid ${theme.colors.primary}`,
      paddingBottom: 30,
      transform: `scale(${scale})`,
      opacity,
    }}>
      <div style={{
        fontSize: 56,
        fontWeight: 700,
        fontFamily: theme.fonts.marker,
        color: theme.colors.primary,
        marginBottom: 10,
      }}>
        4-Layer Architecture
      </div>
      <div style={{
        fontSize: 24,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.body,
      }}>
        How KnoMotion works under the hood
      </div>
    </div>
  );
};

/**
 * Layer Cards Sequence (5-50s)
 * Each layer appears for 10 seconds
 */
const LayerCardsSequence = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const layers = [
    {
      step: 0,
      title: 'Layer 0: SDK',
      icon: '🧠',
      description: 'Intelligence & utilities',
      details: 'Animation math, easing, layout calculations, theme tokens, element library',
      color: theme.colors.primary,
    },
    {
      step: 1,
      title: 'Layer 1: Layout Engine',
      icon: '📐',
      description: 'Positioning & guardrails',
      details: 'Grid, Stack, Radial, Cascade - 7 arrangements that respect canvas boundaries',
      color: theme.colors.accentGreen,
    },
    {
      step: 2,
      title: 'Layer 2: Mid-Scenes',
      icon: '🧩',
      description: 'Reusable component logic',
      details: 'Pre-packaged combinations of animations, elements, and layouts',
      color: theme.colors.doodle,
    },
    {
      step: 3,
      title: 'Layer 3: JSON',
      icon: '📄',
      description: 'The orchestrator',
      details: 'Configure everything: layouts, timing, content, styling - zero code required',
      color: '#9B59B6',
    },
  ];

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
    marginTop: 80,
  };

  return (
    <div style={containerStyles}>
      {layers.map((layer, index) => {
        // Each layer appears at: index * 300 frames (10s each)
        const layerStartFrame = index * 300;
        const layerEndFrame = (index + 1) * 300;
        
        // Check if this layer should be visible
        const isActive = frame >= layerStartFrame && frame < layerEndFrame;
        const isPast = frame >= layerEndFrame;

        // Entrance animation
        const enterX = interpolate(frame, [layerStartFrame, layerStartFrame + 40], [-100, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });

        const enterOpacity = interpolate(frame, [layerStartFrame, layerStartFrame + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Exit animation (slide up and fade)
        const exitY = interpolate(frame, [layerEndFrame - 20, layerEndFrame], [0, -50], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.4, 0.0, 1, 1),
        });

        const exitOpacity = interpolate(frame, [layerEndFrame - 20, layerEndFrame], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Determine visibility
        if (!isActive && !isPast) return null;
        if (isPast) return null; // Completely remove past layers

        const opacity = isActive ? (frame < layerEndFrame - 20 ? enterOpacity : exitOpacity) : 0;
        const translateX = enterX;
        const translateY = frame >= layerEndFrame - 20 ? exitY : 0;

        return (
          <div
            key={index}
            style={{
              transform: `translate(${translateX}px, ${translateY}px)`,
              opacity,
            }}
          >
            <div style={{
              display: 'flex',
              gap: theme.spacing.cardPadding,
              padding: theme.spacing.cardPadding * 2,
              backgroundColor: theme.colors.cardBg,
              borderRadius: theme.radii.card,
              boxShadow: theme.shadows.card,
              borderLeft: `6px solid ${layer.color}`,
            }}>
              {/* Step Number */}
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: layer.color,
                color: theme.colors.cardBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                flexShrink: 0,
              }}>
                {layer.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 32,
                  fontWeight: 700,
                  fontFamily: theme.fonts.header,
                  color: theme.colors.textMain,
                  marginBottom: 8,
                }}>
                  {layer.title}
                </div>
                <div style={{
                  height: 2,
                  backgroundColor: layer.color,
                  width: 100,
                  marginBottom: 15,
                }} />
                <div style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: layer.color,
                  marginBottom: 10,
                  fontFamily: theme.fonts.body,
                }}>
                  {layer.description}
                </div>
                <div style={{
                  fontSize: 16,
                  color: theme.colors.textSecondary,
                  lineHeight: 1.6,
                  fontFamily: theme.fonts.body,
                }}>
                  {layer.details}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * JSON Example (50-60s)
 * Shows JSON changing layout dynamically
 */
const JSONExample = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const scale = interpolate(frame, [0, 30], [0.95, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Highlight toggle between "grid" and "radial"
  const showGrid = frame < 150;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 40,
      transform: `scale(${scale})`,
      opacity,
    }}>
      <div style={{
        fontSize: 40,
        fontWeight: 700,
        fontFamily: theme.fonts.header,
        color: theme.colors.primary,
      }}>
        JSON = The Orchestrator
      </div>

      {/* Mock JSON */}
      <div style={{
        backgroundColor: '#2C3E50',
        padding: 40,
        borderRadius: theme.radii.card,
        fontFamily: 'monospace',
        fontSize: 20,
        color: '#ECF0F1',
        maxWidth: 700,
        boxShadow: theme.shadows.card,
      }}>
        <div>{'{'}</div>
        <div style={{ paddingLeft: 20 }}>
          <span style={{ color: '#E74C3C' }}>"layout"</span>: 
          <span style={{ 
            color: showGrid ? theme.colors.accentGreen : theme.colors.doodle,
            fontWeight: 700,
            transition: 'color 0.3s',
          }}>
            {showGrid ? ' "grid"' : ' "radial"'}
          </span>,
        </div>
        <div style={{ paddingLeft: 20 }}>
          <span style={{ color: '#E74C3C' }}>"duration"</span>: 
          <span style={{ color: '#F39C12' }}> 30</span>,
        </div>
        <div style={{ paddingLeft: 20 }}>
          <span style={{ color: '#E74C3C' }}>"elements"</span>: [...]
        </div>
        <div>{'}'}</div>
      </div>

      <div style={{
        fontSize: 18,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        fontFamily: theme.fonts.body,
      }}>
        Change one value → Entire scene transforms
      </div>
    </div>
  );
};
