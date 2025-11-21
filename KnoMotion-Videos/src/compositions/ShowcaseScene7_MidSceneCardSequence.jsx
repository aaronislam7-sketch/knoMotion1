/**
 * Showcase Scene 7: Mid-Scene CardSequence Test
 * Duration: 10 seconds (300 frames @ 30fps)
 * 
 * Tests CardSequence mid-scene component:
 * - Multiple cards rendering
 * - Layout types (stacked/grid)
 * - Stagger animations
 * - JSON configuration
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CardSequence } from '../sdk/mid-scenes/CardSequence';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';

// Example configuration - Stacked layout
const stackedConfig = {
  cards: [
    {
      title: "Card 1: First Step",
      content: "This is the first card in a stacked sequence with stagger animations.",
      variant: "default",
      size: "md",
    },
    {
      title: "Card 2: Second Step",
      content: "The second card appears after a stagger delay, creating a smooth sequence.",
      variant: "bordered",
      size: "md",
    },
    {
      title: "Card 3: Third Step",
      content: "Each card uses the unified layout engine for consistent positioning.",
      variant: "glass",
      size: "md",
    },
  ],
  layout: "stacked",
  animation: "fadeSlide",
  staggerDelay: 0.2,
  animationDuration: 0.6,
  beats: {
    start: 1.0,
  },
};

// Example configuration - Grid layout
const gridConfig = {
  cards: [
    {
      title: "Feature 1",
      content: "First feature card in a grid layout",
      variant: "default",
    },
    {
      title: "Feature 2",
      content: "Second feature card with stagger animation",
      variant: "default",
    },
    {
      title: "Feature 3",
      content: "Third card completes the grid",
      variant: "default",
    },
    {
      title: "Feature 4",
      content: "Fourth card in the second row",
      variant: "bordered",
    },
    {
      title: "Feature 5",
      content: "Fifth card continues the sequence",
      variant: "bordered",
    },
    {
      title: "Feature 6",
      content: "Sixth card completes the grid",
      variant: "glass",
    },
  ],
  layout: "grid",
  columns: 3,
  animation: "scaleIn",
  staggerDelay: 0.15,
  animationDuration: 0.7,
  beats: {
    start: 0.5,
  },
};

export const ShowcaseScene7_MidSceneCardSequence = () => {
  // Use stacked layout for this showcase
  return (
    <AbsoluteFill
      style={{
        backgroundColor: KNODE_THEME.colors.pageBg,
        padding: 60,
      }}
    >
      <CardSequence config={stackedConfig} />
    </AbsoluteFill>
  );
};
