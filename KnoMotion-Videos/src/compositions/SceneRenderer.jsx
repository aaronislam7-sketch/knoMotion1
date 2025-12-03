import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { resolveSceneSlots } from '../sdk/scene-layout/sceneLayout';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';
import { resolveBackground } from '../sdk/effects/resolveBackground';
import { resolveAnimationPreset, SPRING_CONFIGS } from '../sdk/theme/animationPresets';

// Mid-scene imports
import { TextRevealSequence } from '../sdk/mid-scenes/TextRevealSequence';
import { IconGrid } from '../sdk/mid-scenes/IconGrid';
import { ChecklistReveal } from '../sdk/mid-scenes/ChecklistReveal';
import { BubbleCalloutSequence } from '../sdk/mid-scenes/BubbleCalloutSequence';
import { SideBySideCompare } from '../sdk/mid-scenes/SideBySideCompare';
import { GridCardReveal } from '../sdk/mid-scenes/GridCardReveal';
import { CardSequence } from '../sdk/mid-scenes/CardSequence';
import { HeroTextEntranceExit } from '../sdk/mid-scenes/HeroTextEntranceExit';

const MID_SCENE_COMPONENTS = {
  textReveal: TextRevealSequence,
  iconGrid: IconGrid,
  checklist: ChecklistReveal,
  bubbleCallout: BubbleCalloutSequence,
  sideBySide: SideBySideCompare,
  gridCards: GridCardReveal,
  cardSequence: CardSequence,
  heroText: HeroTextEntranceExit,
};

const SlotRenderer = ({ slot, slotName, midSceneConfig }) => {
  if (!slot || !midSceneConfig) return null;

  const { midScene, config, stylePreset } = midSceneConfig;
  const Component = MID_SCENE_COMPONENTS[midScene];

  if (!Component) {
    console.warn(`Unknown midScene "${midScene}" in slot "${slotName}"`);
    return null;
  }

  const enhancedConfig = {
    ...config,
    position: {
      left: 0,
      top: 0,
      width: slot.width,
      height: slot.height,
    },
  };

  const isHeader = slotName === 'header';

  return (
    <div
      style={{
        position: 'absolute',
        left: slot.left,
        top: slot.top,
        width: slot.width,
        height: slot.height,
        overflow: 'visible',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: isHeader ? 'flex-end' : 'center',
          justifyContent: 'center',
          paddingBottom: isHeader ? 10 : 0,
          boxSizing: 'border-box',
        }}
      >
        <Component config={enhancedConfig} stylePreset={stylePreset} />
      </div>
    </div>
  );
};

export const SceneFromConfig = ({ config }) => {
  const { width, height } = useVideoConfig();
  const viewport = { width, height };

  const slots = resolveSceneSlots(config.layout, viewport);
  const configuredSlots = Object.keys(config.slots).filter(
    (slotName) => slots[slotName],
  );

  const background = config.background
    ? resolveBackground(config.background)
    : null;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: KNODE_THEME.colors.pageBg,
        ...(background?.style || {}),
      }}
    >
      {background?.overlay}
      {configuredSlots.map((slotName) => (
        <SlotRenderer
          key={slotName}
          slot={slots[slotName]}
          slotName={slotName}
          midSceneConfig={config.slots[slotName]}
        />
      ))}
    </AbsoluteFill>
  );
};

const DEFAULT_TRANSITION = {
  type: 'fade',
  durationInFrames: 18,
  direction: 'up',
  animationPreset: 'subtle', // Uses SDK animation presets
};

const SLIDE_OFFSETS = {
  left: { x: -120, y: 0 },
  right: { x: 120, y: 0 },
  up: { x: 0, y: -120 },
  down: { x: 0, y: 120 },
};

const clamp01 = (value) => Math.max(0, Math.min(1, value));

/**
 * SceneTransitionWrapper - Handles scene-level transitions
 * 
 * Now uses SDK animation presets for consistent animations.
 * Supports: fade, slide, page-turn, doodle-wipe, eraser, spring
 */
export const SceneTransitionWrapper = ({
  children,
  durationInFrames,
  transition,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settings = { ...DEFAULT_TRANSITION, ...(transition || {}) };
  const transitionFrames = settings.durationInFrames ?? DEFAULT_TRANSITION.durationInFrames;

  // Get animation preset configuration if specified
  const animPreset = settings.animationPreset 
    ? resolveAnimationPreset(settings.animationPreset)
    : null;

  // Use spring physics for smoother transitions when available
  const useSpring = settings.type === 'spring' || (animPreset && settings.type !== 'doodle-wipe' && settings.type !== 'eraser');
  
  let enterProgress, exitProgress;
  
  if (useSpring) {
    const springConfig = animPreset?.entrance?.springConfig 
      ? SPRING_CONFIGS[animPreset.entrance.springConfig]
      : SPRING_CONFIGS.smooth;
    
    enterProgress = spring({
      frame,
      fps,
      config: springConfig,
      durationInFrames: transitionFrames,
    });
    
    exitProgress = spring({
      frame: durationInFrames - frame,
      fps,
      config: { ...springConfig, damping: springConfig.damping + 5 },
      durationInFrames: transitionFrames,
    });
  } else {
    enterProgress = clamp01(frame / transitionFrames);
    exitProgress = clamp01((durationInFrames - frame) / transitionFrames);
  }

  let style = {
    opacity: Math.min(enterProgress, exitProgress),
  };
  let overlay = null;

  if (settings.type === 'slide' || settings.type === 'spring') {
    const offset = SLIDE_OFFSETS[settings.direction] || SLIDE_OFFSETS.up;
    const distance = settings.distance || 1;
    const enterOffset = (1 - enterProgress) * distance;
    const exitOffset = (1 - exitProgress) * -distance;

    const translateX = offset.x * (enterOffset + exitOffset);
    const translateY = offset.y * (enterOffset + exitOffset);

    style = {
      opacity: Math.min(enterProgress, exitProgress),
      transform: `translate(${translateX}px, ${translateY}px)`,
    };
  } else if (settings.type === 'page-turn') {
    const enterAngle = (1 - enterProgress) * 45;
    const exitAngle = (1 - exitProgress) * -35;
    const angle = enterAngle + exitAngle;

    style = {
      opacity: Math.min(enterProgress + 0.2, exitProgress + 0.2),
      transformOrigin: settings.direction === 'right' ? '100% 50%' : '0% 50%',
      transform: `perspective(1600px) rotateY(${angle}deg)`,
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      backgroundColor: 'transparent',
    };
  } else if (settings.type === 'doodle-wipe') {
    const visible = Math.min(enterProgress, exitProgress);
    const clipRight = 100 - visible * 100;
    
    // Add wobble effect for hand-drawn feel (4.11)
    const wobbleEnabled = settings.wobble !== false;
    const wobbleAmount = settings.wobbleAmount || 3;
    const wobbleFrequency = settings.wobbleFrequency || 0.15;
    const wobble = wobbleEnabled 
      ? Math.sin(frame * wobbleFrequency) * wobbleAmount 
      : 0;
    
    style = {
      clipPath: `inset(0 ${clipRight}% 0 0)`,
    };
    
    overlay = (
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${visible * 100}%`,
          width: 40,
          transform: `translateX(-50%) rotate(${wobble}deg)`,
          background:
            'repeating-linear-gradient(135deg, rgba(243,156,18,0.3), rgba(243,156,18,0.3) 12px, transparent 12px, transparent 24px)',
          boxShadow: '0 0 50px rgba(0,0,0,0.1)',
          pointerEvents: 'none',
          transition: 'transform 0.05s ease-out',
        }}
      />
    );
  } else if (settings.type === 'eraser') {
    const eraseProgress = 1 - exitProgress;
    overlay = (
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: `${eraseProgress * 100}%`,
          backgroundColor: KNODE_THEME.colors.pageBg,
          boxShadow: 'inset -40px 0 40px rgba(0,0,0,0.1)',
          pointerEvents: 'none',
        }}
      />
    );
  } else {
    // Default fade transition with SDK easing
    const fadeIn = interpolate(
      frame,
      [0, transitionFrames],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      },
    );

    const fadeOut = interpolate(
      frame,
      [durationInFrames - transitionFrames, durationInFrames],
      [1, 0],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0.0, 1, 1),
      },
    );

    style = {
      opacity: Math.min(fadeIn, fadeOut),
    };
  }

  return (
    <AbsoluteFill style={style}>
      {children}
      {overlay}
    </AbsoluteFill>
  );
};
