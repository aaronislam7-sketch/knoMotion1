import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame, interpolate, Easing } from 'remotion';
import { ShowcaseScene1_IntroValueProp } from './ShowcaseScene1_IntroValueProp';
import { ShowcaseScene2_ArchitectureDeepDive } from './ShowcaseScene2_ArchitectureDeepDive';
import { ShowcaseScene3_LayoutShowcase } from './ShowcaseScene3_LayoutShowcase';
import { ShowcaseScene4_FeatureShowcaseCTA } from './ShowcaseScene4_FeatureShowcaseCTA';

/**
 * KnoMotion Showcase - Master Composition
 * 
 * Total Duration: 210 seconds (6300 frames @ 30fps)
 * 
 * Stitches together 4 showcase scenes:
 * 1. Intro + Value Prop (45s / 1350 frames)
 * 2. Architecture Deep Dive (60s / 1800 frames)
 * 3. Layout Showcase (45s / 1350 frames)
 * 4. Feature Showcase + CTA (60s / 1800 frames)
 * 
 * Uses Remotion's <Series> for seamless scene transitions with fade overlaps.
 */

const TRANSITION_DURATION = 20; // 20 frames for smooth crossfade

/**
 * Wrapper component that adds fade-in/fade-out transitions
 */
const TransitionWrapper = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();
  
  // Fade in at start
  const fadeIn = interpolate(
    frame,
    [0, TRANSITION_DURATION],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    }
  );
  
  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - TRANSITION_DURATION, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0.0, 1, 1),
    }
  );
  
  const opacity = Math.min(fadeIn, fadeOut);
  
  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

export const ShowcaseMain = () => {
  return (
    <AbsoluteFill>
      <Series>
        {/* Scene 1: Intro + Value Prop (0-45s) */}
        <Series.Sequence durationInFrames={1350}>
          <TransitionWrapper durationInFrames={1350}>
            <ShowcaseScene1_IntroValueProp />
          </TransitionWrapper>
        </Series.Sequence>

        {/* Scene 2: Architecture Deep Dive (45-105s) */}
        {/* Overlap by TRANSITION_DURATION for crossfade */}
        <Series.Sequence durationInFrames={1800} offset={-TRANSITION_DURATION}>
          <TransitionWrapper durationInFrames={1800}>
            <ShowcaseScene2_ArchitectureDeepDive />
          </TransitionWrapper>
        </Series.Sequence>

        {/* Scene 3: Layout Showcase (105-150s) */}
        <Series.Sequence durationInFrames={1350} offset={-TRANSITION_DURATION}>
          <TransitionWrapper durationInFrames={1350}>
            <ShowcaseScene3_LayoutShowcase />
          </TransitionWrapper>
        </Series.Sequence>

        {/* Scene 4: Feature Showcase + CTA (150-210s) */}
        <Series.Sequence durationInFrames={1800} offset={-TRANSITION_DURATION}>
          <TransitionWrapper durationInFrames={1800}>
            <ShowcaseScene4_FeatureShowcaseCTA />
          </TransitionWrapper>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
