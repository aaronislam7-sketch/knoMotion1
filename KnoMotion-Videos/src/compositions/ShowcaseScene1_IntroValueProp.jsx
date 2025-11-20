import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Sequence } from 'remotion';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';
import { 
  HeroWithText, 
  Text, 
  CardWithIcon, 
  CardWithBadge 
} from '../sdk/elements';

/**
 * Showcase Scene 1: Intro + Value Prop
 * Duration: 45 seconds (1350 frames @ 30fps)
 * 
 * Sequence:
 * - 0-5s: Hero entrance (🎓 + title + subtitle)
 * - 5-10s: Problem statement (typewriter)
 * - 10-15s: Solution intro (CardWithIcon)
 * - 15-45s: Value props (4x cards in grid, cascade entrance)
 */
export const ShowcaseScene1_IntroValueProp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = KNODE_THEME;

  // Container styles
  const containerStyles = {
    backgroundColor: theme.colors.pageBg,
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <AbsoluteFill style={containerStyles}>
      {/* SEQUENCE 1: Hero Entrance (0-150 frames = 0-5s) */}
      <Sequence from={0} durationInFrames={150}>
        <HeroEntrance />
      </Sequence>

      {/* SEQUENCE 2: Problem Statement (150-300 frames = 5-10s) */}
      <Sequence from={150} durationInFrames={150}>
        <ProblemStatement />
      </Sequence>

      {/* SEQUENCE 3: Solution Intro (300-450 frames = 10-15s) */}
      <Sequence from={300} durationInFrames={150}>
        <SolutionIntro />
      </Sequence>

      {/* SEQUENCE 4: Value Props (450-1350 frames = 15-45s) */}
      <Sequence from={450} durationInFrames={900}>
        <ValuePropsGrid />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Hero Entrance Component (0-5s)
 * Staggered entrance: Icon → Title → Divider → Subtitle
 */
const HeroEntrance = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  // Icon entrance (0-30 frames)
  const iconScale = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.68, -0.55, 0.265, 1.55), // Bounce
  });

  const iconOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Title entrance (20-50 frames)
  const titleY = interpolate(frame, [20, 50], [30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0.0, 0.2, 1), // Smooth
  });

  const titleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Divider entrance (40-60 frames)
  const dividerWidth = interpolate(frame, [40, 60], [0, 200], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
  });

  // Subtitle entrance (50-80 frames)
  const subtitleY = interpolate(frame, [50, 80], [20, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
  });

  const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ 
      textAlign: 'center', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 20,
    }}>
      {/* Hero Icon */}
      <div style={{ 
        fontSize: 120, 
        transform: `scale(${iconScale})`,
        opacity: iconOpacity,
      }}>
        🎓
      </div>

      {/* Title */}
      <div style={{ 
        fontSize: 56, 
        fontWeight: 700, 
        fontFamily: theme.fonts.marker, 
        color: theme.colors.primary,
        transform: `translateY(${titleY}px)`,
        opacity: titleOpacity,
        lineHeight: 1.2,
      }}>
        Imagine Creating Beautiful<br />Educational Videos...
      </div>

      {/* Divider */}
      <div style={{ 
        height: 3, 
        width: dividerWidth, 
        backgroundColor: theme.colors.primary,
        borderRadius: 2,
      }} />

      {/* Subtitle */}
      <div style={{ 
        fontSize: 32, 
        fontWeight: 400, 
        fontFamily: theme.fonts.body, 
        color: theme.colors.textSoft,
        transform: `translateY(${subtitleY}px)`,
        opacity: subtitleOpacity,
      }}>
        ...in Minutes, Not Days
      </div>
    </div>
  );
};

/**
 * Problem Statement Component (5-10s)
 * Typewriter effect text
 */
const ProblemStatement = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const text = "Traditional video creation is slow, expensive, and hard to scale.";
  
  // Typewriter effect
  const charsToShow = Math.floor(interpolate(frame, [0, 90], [0, text.length], {
    extrapolateRight: 'clamp',
  }));

  const displayText = text.substring(0, charsToShow);

  // Fade in container
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ 
      textAlign: 'center',
      opacity,
      maxWidth: 900,
    }}>
      <div style={{ 
        fontSize: 28, 
        fontFamily: theme.fonts.body, 
        color: theme.colors.textMain,
        lineHeight: 1.5,
      }}>
        {displayText}
        {charsToShow < text.length && (
          <span style={{ 
            borderRight: `2px solid ${theme.colors.primary}`,
            animation: 'blink 0.7s infinite',
          }} />
        )}
      </div>
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

/**
 * Solution Intro Component (10-15s)
 * CardWithIcon entrance
 */
const SolutionIntro = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  // Scale in from 0.8 to 1
  const scale = interpolate(frame, [0, 40], [0.8, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  });

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ 
      transform: `scale(${scale})`,
      opacity,
      maxWidth: 600,
    }}>
      <div style={{ 
        padding: theme.spacing.cardPadding * 1.5,
        backgroundColor: theme.colors.cardBg,
        borderRadius: theme.radii.card,
        boxShadow: theme.shadows.card,
        display: 'flex',
        gap: theme.spacing.cardPadding,
        alignItems: 'center',
      }}>
        <div style={{ fontSize: 80 }}>⚡</div>
        <div>
          <div style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            fontFamily: theme.fonts.header, 
            color: theme.colors.primary,
            marginBottom: 10,
          }}>
            Enter KnoMotion
          </div>
          <div style={{ 
            fontSize: 20, 
            color: theme.colors.textSoft,
            fontFamily: theme.fonts.body,
          }}>
            JSON-first video engine for EdTech
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Value Props Grid Component (15-45s)
 * 4 cards in 2x2 grid with cascade entrance
 */
const ValuePropsGrid = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const valueProps = [
    { icon: '🚀', badge: 'Fast', title: 'Create in Minutes', text: 'Build professional videos in minutes, not days' },
    { icon: '🎨', badge: 'Beautiful', title: 'Stunning Quality', text: 'Professional-quality output every time' },
    { icon: '⚙️', badge: 'Configurable', title: 'JSON-Driven', text: 'Infinite flexibility with simple JSON configs' },
    { icon: '📈', badge: 'Scalable', title: 'Zero Code', text: 'Create unlimited scenes without writing code' },
  ];

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 40,
    maxWidth: 1200,
  };

  return (
    <div style={gridStyles}>
      {valueProps.map((prop, index) => {
        // Cascade entrance: each card delayed by 15 frames
        const cardStartFrame = index * 15;
        
        const scale = interpolate(frame, [cardStartFrame, cardStartFrame + 30], [0.8, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
        });

        const opacity = interpolate(frame, [cardStartFrame, cardStartFrame + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const y = interpolate(frame, [cardStartFrame, cardStartFrame + 30], [30, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });

        return (
          <div
            key={index}
            style={{
              transform: `scale(${scale}) translateY(${y}px)`,
              opacity,
              position: 'relative',
            }}
          >
            {/* Badge */}
            <div style={{
              position: 'absolute',
              top: -10,
              right: -10,
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: theme.fonts.body,
              backgroundColor: theme.colors.primary,
              color: theme.colors.textMain,
              zIndex: 10,
            }}>
              {prop.badge}
            </div>

            {/* Card */}
            <div style={{
              padding: theme.spacing.cardPadding * 1.5,
              backgroundColor: theme.colors.cardBg,
              borderRadius: theme.radii.card,
              boxShadow: theme.shadows.card,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 15,
            }}>
              <div style={{ fontSize: 72 }}>{prop.icon}</div>
              <div style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                fontFamily: theme.fonts.header, 
                color: theme.colors.textMain,
              }}>
                {prop.title}
              </div>
              <div style={{ 
                fontSize: 16, 
                color: theme.colors.textSoft,
                fontFamily: theme.fonts.body,
                lineHeight: 1.5,
              }}>
                {prop.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
