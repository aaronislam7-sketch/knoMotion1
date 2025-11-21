/**
 * Showcase Scene 9: Mid-Scene IconGrid Test
 * Duration: 15 seconds (450 frames @ 30fps)
 * 
 * Tests IconGrid mid-scene component:
 * - Grid layout with multiple icons
 * - Different animation types
 * - Stagger effects
 * - Labels and styling
 * - JSON configuration
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { IconGrid } from '../sdk/mid-scenes/IconGrid';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';

// Example configuration - Scale In with labels
const scaleInConfig = {
  icons: [
    { iconRef: "🎯", label: "Focus", color: "primary" },
    { iconRef: "🚀", label: "Launch", color: "accentBlue" },
    { iconRef: "💡", label: "Ideas", color: "doodle" },
    { iconRef: "⚡", label: "Speed", color: "accentGreen" },
    { iconRef: "🎨", label: "Design", color: "secondary" },
    { iconRef: "📊", label: "Analytics", color: "accentBlue" },
    { iconRef: "🔒", label: "Security", color: "primary" },
    { iconRef: "✨", label: "Magic", color: "doodle" },
  ],
  columns: 4,
  animation: "scaleIn",
  staggerDelay: 0.08,
  animationDuration: 0.5,
  iconSize: "lg",
  gap: 50,
  showLabels: true,
  beats: {
    start: 0.5,
  },
};

// Example configuration - Bounce animation, no labels
const bounceConfig = {
  icons: [
    { iconRef: "🎵", color: "primary" },
    { iconRef: "🎸", color: "secondary" },
    { iconRef: "🎹", color: "accentBlue" },
    { iconRef: "🎤", color: "doodle" },
    { iconRef: "🎧", color: "accentGreen" },
    { iconRef: "🎼", color: "primary" },
  ],
  columns: 3,
  animation: "bounceIn",
  staggerDelay: 0.1,
  animationDuration: 0.6,
  iconSize: "xl",
  gap: 60,
  showLabels: false,
  beats: {
    start: 6.0,
  },
};

// Example configuration - Cascade effect
const cascadeConfig = {
  icons: [
    { iconRef: "🌟", label: "Star", color: "doodle" },
    { iconRef: "🌈", label: "Rainbow", color: "secondary" },
    { iconRef: "🌸", label: "Flower", color: "primary" },
    { iconRef: "🌊", label: "Wave", color: "accentBlue" },
    { iconRef: "🌙", label: "Moon", color: "secondary" },
    { iconRef: "☀️", label: "Sun", color: "doodle" },
    { iconRef: "⭐", label: "Sparkle", color: "accentGreen" },
    { iconRef: "🌻", label: "Sunflower", color: "doodle" },
    { iconRef: "🍀", label: "Clover", color: "accentGreen" },
  ],
  columns: 3,
  animation: "cascade",
  staggerDelay: 0.05,
  animationDuration: 0.8,
  iconSize: "md",
  gap: 40,
  showLabels: true,
  beats: {
    start: 11.0,
  },
};

export const ShowcaseScene9_MidSceneIconGrid = () => {
  const frame = useCurrentFrame();
  
  // Show different demos at different times
  // 0-5s: Scale in with labels
  // 5-10s: Bounce animation, no labels
  // 10-15s: Cascade effect
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: KNODE_THEME.colors.pageBg,
        padding: 60,
      }}
    >
      {/* Show scale in animation 0-6s */}
      {frame < 180 && <IconGrid config={scaleInConfig} />}
      
      {/* Show bounce animation 6-11s */}
      {frame >= 180 && frame < 330 && <IconGrid config={bounceConfig} />}
      
      {/* Show cascade effect 11-15s */}
      {frame >= 330 && <IconGrid config={cascadeConfig} />}
    </AbsoluteFill>
  );
};
