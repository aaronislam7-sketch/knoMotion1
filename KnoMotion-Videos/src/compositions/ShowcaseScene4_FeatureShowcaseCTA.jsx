import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Sequence } from 'remotion';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';
import { 
  Progress, 
  Rating, 
  RadialProgress, 
  Avatar,
  Alert,
  Loading,
} from '../sdk/elements';
import { 
  getContinuousBounce,
  getContinuousColorPulse,
  getContinuousWobble,
} from '../sdk/animations';
import { RemotionLottie } from '../sdk/lottie/lottieIntegration';

/**
 * Showcase Scene 4: Feature Showcase + CTA
 * Duration: 60 seconds (1800 frames @ 30fps)
 * 
 * Sequence:
 * - 0-15s: Element gallery showcase
 * - 15-30s: Animation delights
 * - 30-45s: Lottie + Theming
 * - 45-60s: Call-to-action finale
 */
export const ShowcaseScene4_FeatureShowcaseCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = KNODE_THEME;

  const containerStyles = {
    backgroundColor: theme.colors.pageBg,
    padding: 60,
  };

  return (
    <AbsoluteFill style={containerStyles}>
      {/* SEQUENCE 1: Element Gallery (0-450 frames = 0-15s) */}
      <Sequence from={0} durationInFrames={450}>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ElementGallery />
        </AbsoluteFill>
      </Sequence>

      {/* SEQUENCE 2: Animation Delights (450-900 frames = 15-30s) */}
      <Sequence from={450} durationInFrames={450}>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimationDelights />
        </AbsoluteFill>
      </Sequence>

      {/* SEQUENCE 3: Lottie + Theming (900-1350 frames = 30-45s) */}
      <Sequence from={900} durationInFrames={450}>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LottieAndTheming />
        </AbsoluteFill>
      </Sequence>

      {/* SEQUENCE 4: Call-to-Action (1350-1800 frames = 45-60s) */}
      <Sequence from={1350} durationInFrames={450}>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CallToAction />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Element Gallery (0-15s)
 * Shows 6 different elements in a grid
 */
const ElementGallery = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Title */}
      <div style={{
        fontSize: 48,
        fontWeight: 700,
        fontFamily: theme.fonts.marker,
        color: theme.colors.primary,
        marginBottom: 60,
        opacity: titleOpacity,
      }}>
        Element Library
      </div>

      {/* Grid of elements */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 50,
        maxWidth: 1100,
      }}>
        {/* Progress */}
        <ElementShowcase index={0} frame={frame} title="Progress">
          <Progress value={75} label="Loading..." variant="primary" size="md" />
          <Progress value={50} variant="success" size="md" style={{ marginTop: 10 }} />
        </ElementShowcase>

        {/* Rating */}
        <ElementShowcase index={1} frame={frame} title="Rating">
          <Rating value={5} size="lg" color="doodle" />
          <Rating value={4} size="md" color="primary" style={{ marginTop: 10 }} />
        </ElementShowcase>

        {/* RadialProgress */}
        <ElementShowcase index={2} frame={frame} title="RadialProgress">
          <RadialProgress value={85} label="Complete" size="md" color="accentGreen" />
        </ElementShowcase>

        {/* Avatar */}
        <ElementShowcase index={3} frame={frame} title="Avatar">
          <div style={{ display: 'flex', gap: 15 }}>
            <Avatar text="KM" size="lg" status="online" ring />
            <Avatar text="AB" size="lg" status="away" />
          </div>
        </ElementShowcase>

        {/* Alert */}
        <ElementShowcase index={4} frame={frame} title="Alert">
          <Alert 
            iconRef="✅" 
            title="Success!" 
            text="Your video is ready" 
            variant="success"
          />
        </ElementShowcase>

        {/* Loading */}
        <ElementShowcase index={5} frame={frame} title="Loading">
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Loading variant="spinner" size="md" />
            <Loading variant="dots" size="md" />
            <Loading variant="ring" size="md" />
          </div>
        </ElementShowcase>
      </div>
    </div>
  );
};

const ElementShowcase = ({ index, frame, title, children }) => {
  const theme = KNODE_THEME;
  
  const startFrame = 30 + (index * 12);
  const scale = interpolate(frame, [startFrame, startFrame + 30], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  });

  const opacity = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      transform: `scale(${scale})`,
      opacity,
      padding: theme.spacing.cardPadding * 1.5,
      backgroundColor: theme.colors.cardBg,
      borderRadius: theme.radii.card,
      boxShadow: theme.shadows.card,
      minHeight: 180,
    }}>
      <div style={{
        fontSize: 18,
        fontWeight: 700,
        fontFamily: theme.fonts.header,
        color: theme.colors.textMain,
        marginBottom: 20,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
};

/**
 * Animation Delights (15-30s)
 * Shows continuous life animations
 */
const AnimationDelights = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const bounce = getContinuousBounce(frame, { height: 15 });
  const colorPulse = getContinuousColorPulse(frame, { 
    colors: [theme.colors.primary, theme.colors.accentGreen, theme.colors.doodle] 
  });
  const wobble = getContinuousWobble(frame, { intensity: 5 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Title */}
      <div style={{
        fontSize: 48,
        fontWeight: 700,
        fontFamily: theme.fonts.marker,
        color: theme.colors.primary,
        marginBottom: 80,
        opacity: titleOpacity,
      }}>
        Animation Delights
      </div>

      {/* Animation demos */}
      <div style={{
        display: 'flex',
        gap: 60,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Bounce */}
        <AnimationDemo frame={frame} index={0} title="Bounce">
          <div style={{
            ...bounce,
            width: 120,
            height: 120,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radii.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 56,
          }}>
            ⬆️
          </div>
        </AnimationDemo>

        {/* Color Pulse */}
        <AnimationDemo frame={frame} index={1} title="Color Pulse">
          <div style={{
            ...colorPulse,
            width: 120,
            height: 120,
            borderRadius: theme.radii.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 56,
          }}>
            🎨
          </div>
        </AnimationDemo>

        {/* Wobble */}
        <AnimationDemo frame={frame} index={2} title="Wobble">
          <div style={{
            ...wobble,
            width: 120,
            height: 120,
            backgroundColor: theme.colors.accentGreen,
            borderRadius: theme.radii.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 56,
          }}>
            🎯
          </div>
        </AnimationDemo>
      </div>
    </div>
  );
};

const AnimationDemo = ({ frame, index, title, children }) => {
  const theme = KNODE_THEME;
  
  const startFrame = 30 + (index * 20);
  const opacity = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      opacity,
    }}>
      <div style={{
        fontSize: 20,
        fontWeight: 700,
        fontFamily: theme.fonts.header,
        color: theme.colors.textMain,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
};

/**
 * Lottie + Theming (30-45s)
 */
const LottieAndTheming = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Title */}
      <div style={{
        fontSize: 48,
        fontWeight: 700,
        fontFamily: theme.fonts.marker,
        color: theme.colors.primary,
        marginBottom: 60,
        opacity: titleOpacity,
      }}>
        Lottie Integration + Theming
      </div>

      <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
        {/* Lottie demo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: theme.fonts.header,
            color: theme.colors.textMain,
          }}>
            Lottie Animations
          </div>
          <div style={{ width: 200, height: 200 }}>
            <RemotionLottie lottieRef="success" playbackRate={1} />
          </div>
        </div>

        {/* Theme tokens */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
        }}>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: theme.fonts.header,
            color: theme.colors.textMain,
            marginBottom: 10,
          }}>
            Consistent Theming
          </div>
          {[
            { label: 'Primary', color: theme.colors.primary },
            { label: 'Accent', color: theme.colors.accentGreen },
            { label: 'Highlight', color: theme.colors.doodle },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <div style={{
                width: 50,
                height: 50,
                backgroundColor: item.color,
                borderRadius: 8,
                boxShadow: theme.shadows.soft,
              }} />
              <div style={{
                fontSize: 18,
                fontFamily: theme.fonts.body,
                color: theme.colors.textMain,
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Call-to-Action (45-60s)
 * Final hero section with bouncing CTA
 */
const CallToAction = () => {
  const frame = useCurrentFrame();
  const theme = KNODE_THEME;

  const heroScale = interpolate(frame, [0, 40], [0.8, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  });

  const heroOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(frame, [20, 50], [30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
  });

  const titleOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const buttonOpacity = interpolate(frame, [60, 85], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const bounce = frame > 85 ? getContinuousBounce(frame - 85, { height: 12 }) : {};

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 40,
      height: '100%',
    }}>
      {/* Hero Icon */}
      <div style={{
        fontSize: 140,
        transform: `scale(${heroScale})`,
        opacity: heroOpacity,
      }}>
        🚀
      </div>

      {/* Title */}
      <div style={{
        transform: `translateY(${titleY}px)`,
        opacity: titleOpacity,
      }}>
        <div style={{
          fontSize: 64,
          fontWeight: 700,
          fontFamily: theme.fonts.marker,
          color: theme.colors.primary,
          lineHeight: 1.2,
          marginBottom: 15,
        }}>
          Start Creating Today
        </div>
        <div style={{
          height: 3,
          width: 250,
          backgroundColor: theme.colors.primary,
          margin: '0 auto 20px',
        }} />
        <div style={{
          fontSize: 32,
          fontFamily: theme.fonts.body,
          color: theme.colors.textSoft,
        }}>
          Infinite possibilities, zero limits
        </div>
      </div>

      {/* CTA Button */}
      <div style={{
        ...bounce,
        opacity: buttonOpacity,
      }}>
        <div style={{
          padding: '20px 50px',
          backgroundColor: theme.colors.primary,
          color: theme.colors.textMain,
          fontSize: 28,
          fontWeight: 700,
          fontFamily: theme.fonts.header,
          borderRadius: theme.radii.card,
          boxShadow: theme.shadows.card,
          cursor: 'pointer',
        }}>
          Get Started →
        </div>
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: 18,
        color: theme.colors.textSoft,
        fontFamily: theme.fonts.body,
        opacity: buttonOpacity,
      }}>
        JSON-first video engine for EdTech professionals
      </div>
    </div>
  );
};
