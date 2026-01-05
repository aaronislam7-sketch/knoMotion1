/**
 * Showcase Scene 7: Mid-Scene Tests (CardSequence & TextRevealSequence)
 * Duration: 15 seconds (450 frames @ 30fps)
 * 
 * Tests mid-scene components:
 * - CardSequence: Multiple cards with stagger animations
 * - TextRevealSequence: Text lines with reveal animations
 * - JSON configuration for both
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CardSequence } from '../sdk/mid-scenes/CardSequence';
import { TextRevealSequence } from '../sdk/mid-scenes/TextRevealSequence';
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

// Text reveal configuration - Typewriter effect
const typewriterConfig = {
  lines: [
    {
      text: "This is a typewriter reveal",
      emphasis: "high"
    },
    {
      text: "Each line appears character by character",
      emphasis: "normal"
    },
    {
      text: "With smooth stagger timing",
      emphasis: "low"
    },
  ],
  revealType: "typewriter",
  direction: "up",
  staggerDelay: 0.4,
  animationDuration: 1.2,
  lineSpacing: "normal",
  beats: {
    start: 0.5,
  },
};

// Text reveal configuration - Fade with emphasis
const fadeConfig = {
  lines: [
    {
      text: "Welcome to TextRevealSequence",
      emphasis: "high"
    },
    {
      text: "Multiple reveal types available",
      emphasis: "normal"
    },
    {
      text: "Fade, slide, typewriter, and mask",
      emphasis: "normal"
    },
    {
      text: "All configurable via JSON",
      emphasis: "low"
    },
  ],
  revealType: "fade",
  direction: "up",
  staggerDelay: 0.25,
  animationDuration: 0.7,
  lineSpacing: "relaxed",
  beats: {
    start: 6.0,
  },
};

// Text reveal configuration - Slide from left
const slideConfig = {
  lines: [
    {
      text: "Slide animations work too",
      emphasis: "high"
    },
    {
      text: "From any direction you choose",
      emphasis: "normal"
    },
  ],
  revealType: "slide",
  direction: "left",
  staggerDelay: 0.3,
  animationDuration: 0.8,
  lineSpacing: "normal",
  beats: {
    start: 11.0,
  },
};

export const ShowcaseScene7_MidSceneCardSequence = () => {
  const frame = useCurrentFrame();
  
  // Show different demos at different times
  // 0-5s: Typewriter reveal
  // 5-10s: Fade reveal with emphasis
  // 10-15s: Slide reveal
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: KNODE_THEME.colors.pageBg,
        padding: 60,
      }}
    >
      {/* Show typewriter reveal 0-5s */}
      {frame < 150 && <TextRevealSequence config={typewriterConfig} />}
      
      {/* Show fade reveal 5-10s */}
      {frame >= 150 && frame < 300 && <TextRevealSequence config={fadeConfig} />}
      
      {/* Show slide reveal 10-15s */}
      {frame >= 300 && <TextRevealSequence config={slideConfig} />}
    </AbsoluteFill>
  );
};
