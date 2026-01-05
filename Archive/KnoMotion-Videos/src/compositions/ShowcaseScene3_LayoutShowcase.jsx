import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Sequence } from 'remotion';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';
import { getContinuousRotation } from '../sdk/animations';

/**
 * Showcase Scene 3: Layout Showcase
 * Duration: 45 seconds (1350 frames @ 30fps)
 * 
 * Demonstrates 4 different layout arrangements:
 * - GRID (0-11.25s)
 * - RADIAL (11.25-22.5s)
 * - CASCADE (22.5-33.75s)
 * - STACK (33.75-45s)
 */
export const ShowcaseScene3_LayoutShowcase = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = KNODE_THEME;

  const containerStyles = {
    backgroundColor: theme.colors.pageBg,
    padding: 60,
  };

  return (
    <AbsoluteFill style={containerStyles}>
      {/* Title (always visible) */}
      <TitleSection />

      {/* GRID Layout (0-337.5 frames = 0-11.25s) */}
      <Sequence from={0} durationInFrames={338}>
        <GridLayout />
      </Sequence>

      {/* RADIAL Layout (337.5-675 frames = 11.25-22.5s) */}
      <Sequence from={338} durationInFrames={338}>
        <RadialLayout />
      </Sequence>

      {/* CASCADE Layout (675-1012.5 frames = 22.5-33.75s) */}
      <Sequence from={676} durationInFrames={338}>
        <CascadeLayout />
      </Sequence>

      {/* STACK Layout (1012.5-1350 frames = 33.75-45s) */}
      <Sequence from={1014} durationInFrames={336}>
        <StackLayout />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Title Section (always visible)
 */
const TitleSection = () => {
  const theme = KNODE_THEME;

  return (
    <div style={{
      position: 'absolute',
      top: 40,
      left: 0,
      right: 0,
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 48,
        fontWeight: 700,
        fontFamily: theme.fonts.marker,
        color: theme.colors.primary,
      }}>
        Layout Engine Power
      </div>
    </div>
  );
};

/**
 * GRID Layout (0-11.25s)
 */
const GridLayout = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const items = ['🎨', '🚀', '⚡', '🎯', '💡', '🔥'];

  return (
    <div style={{
      position: 'absolute',
      top: 150,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Label */}
      <div style={{
        fontSize: 32,
        fontWeight: 700,
        fontFamily: theme.fonts.header,
        color: theme.colors.primary,
        marginBottom: 40,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        GRID Layout
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 30,
        maxWidth: 900,
      }}>
        {items.map((icon, index) => {
          const startFrame = index * 8;
          const scale = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          });

          const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={index}
              style={{
                width: 150,
                height: 150,
                backgroundColor: theme.colors.cardBg,
                borderRadius: theme.radii.card,
                boxShadow: theme.shadows.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 72,
                transform: `scale(${scale})`,
                opacity,
              }}
            >
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * RADIAL Layout (11.25-22.5s)
 */
const RadialLayout = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const items = ['🎓', '📚', '✏️', '🎯', '💻', '🌟'];
  const centerX = 0;
  const centerY = 0;
  const radius = 200;

  return (
    <div style={{
      position: 'absolute',
      top: 150,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Label */}
      <div style={{
        fontSize: 32,
        fontWeight: 700,
        fontFamily: theme.fonts.header,
        color: theme.colors.primary,
        marginBottom: 40,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        RADIAL Layout
      </div>

      {/* Center icon */}
      <div style={{
        position: 'relative',
        width: 600,
        height: 600,
      }}>
        {/* Center */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 120,
          height: 120,
          backgroundColor: theme.colors.primary,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64,
          boxShadow: theme.shadows.card,
          ...getContinuousRotation(frame, { speed: 0.3 }),
        }}>
          ⚙️
        </div>

        {/* Orbiting items */}
        {items.map((icon, index) => {
          const angle = (index / items.length) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const startFrame = index * 10;
          const scale = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          });

          const opacity = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`,
                width: 100,
                height: 100,
                backgroundColor: theme.colors.cardBg,
                borderRadius: '50%',
                boxShadow: theme.shadows.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                opacity,
              }}
            >
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * CASCADE Layout (22.5-33.75s)
 */
const CascadeLayout = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const items = [
    { icon: '🚀', title: 'Fast' },
    { icon: '🎨', title: 'Beautiful' },
    { icon: '⚙️', title: 'Configurable' },
    { icon: '📈', title: 'Scalable' },
    { icon: '🔥', title: 'Powerful' },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 150,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Label */}
      <div style={{
        fontSize: 32,
        fontWeight: 700,
        fontFamily: theme.fonts.header,
        color: theme.colors.primary,
        marginBottom: 40,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        CASCADE Layout
      </div>

      {/* Cascading cards */}
      <div style={{
        position: 'relative',
        width: 800,
        height: 500,
      }}>
        {items.map((item, index) => {
          const xOffset = index * 50;
          const yOffset = index * 40;
          const rotation = index * 3;
          
          const startFrame = index * 15;
          const y = interpolate(frame, [startFrame, startFrame + 40], [100, yOffset], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          });

          const opacity = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: xOffset,
                top: y,
                width: 300,
                height: 120,
                backgroundColor: theme.colors.cardBg,
                borderRadius: theme.radii.card,
                boxShadow: theme.shadows.card,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: 20,
                transform: `rotate(${rotation}deg)`,
                opacity,
                zIndex: items.length - index,
              }}
            >
              <div style={{ fontSize: 56 }}>{item.icon}</div>
              <div style={{
                fontSize: 24,
                fontWeight: 700,
                fontFamily: theme.fonts.header,
                color: theme.colors.textMain,
              }}>
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * STACK Layout (33.75-45s)
 */
const StackLayout = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const badges = ['New', 'Popular', 'Featured', 'Hot'];

  return (
    <div style={{
      position: 'absolute',
      top: 150,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Label */}
      <div style={{
        fontSize: 32,
        fontWeight: 700,
        fontFamily: theme.fonts.header,
        color: theme.colors.primary,
        marginBottom: 40,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        STACK Layout
      </div>

      {/* Horizontal stack */}
      <div style={{
        display: 'flex',
        gap: 20,
        alignItems: 'center',
      }}>
        {badges.map((badge, index) => {
          const startFrame = index * 12;
          const x = interpolate(frame, [startFrame, startFrame + 35], [-150, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          });

          const opacity = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const colors = [theme.colors.primary, theme.colors.accentGreen, theme.colors.doodle, '#E74C3C'];

          return (
            <div
              key={index}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                fontSize: 20,
                fontWeight: 600,
                fontFamily: theme.fonts.body,
                backgroundColor: colors[index],
                color: badge === 'Hot' ? theme.colors.textMain : theme.colors.cardBg,
                transform: `translateX(${x}px)`,
                opacity,
                boxShadow: theme.shadows.card,
              }}
            >
              {badge}
            </div>
          );
        })}
      </div>
    </div>
  );
};
