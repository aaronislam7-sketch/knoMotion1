/**
 * Showcase Scene 6: Mid-Scene HeroTextEntranceExit Test
 * Duration: 10 seconds (300 frames @ 30fps)
 * 
 * Tests HeroTextEntranceExit mid-scene component:
 * - Hero rendering (image/lottie)
 * - Text rendering
 * - Entrance animation
 * - Exit animation
 * - JSON configuration
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HeroTextEntranceExit } from '../sdk/mid-scenes/HeroTextEntranceExit';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';

// Example configuration
const exampleConfig = {
  text: "Welcome to KnoMotion",
  heroType: "lottie",
  heroRef: "education/lightbulb",
  animationEntrance: "fadeSlide",
  animationExit: "fadeOut",
  beats: {
    entrance: 1.0,
    exit: 7.0,
  },
  style: {
    container: {
      maxWidth: 900,
    },
    heroContainer: {
      width: 400,
      height: 400,
    },
  },
};

export const ShowcaseScene6_MidSceneHeroText = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: KNODE_THEME.colors.pageBg,
      }}
    >
      <HeroTextEntranceExit config={exampleConfig} />
    </AbsoluteFill>
  );
};
