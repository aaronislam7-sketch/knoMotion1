/**
 * ============================================================================
 * CANONICAL SCENE: Why Your Shower Goes Cold Sometimes
 * ============================================================================
 * 
 * Duration: 120 seconds (3600 frames @ 30fps)
 * 
 * This is a stress test of the Knode video engine, using:
 * - All 5 scene layout types
 * - All 8 mid-scene components
 * - JSON-driven configuration
 * - Slot-based rendering
 * 
 * Purpose: Validate the architecture and identify gaps for videoGaps.md
 * 
 * @module compositions/CanonShowerVideo
 */

import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { resolveSceneSlots } from '../sdk/scene-layout/sceneLayout';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';

// Mid-Scenes
import { TextRevealSequence } from '../sdk/mid-scenes/TextRevealSequence';
import { IconGrid } from '../sdk/mid-scenes/IconGrid';
import { ChecklistReveal } from '../sdk/mid-scenes/ChecklistReveal';
import { BubbleCalloutSequence } from '../sdk/mid-scenes/BubbleCalloutSequence';
import { SideBySideCompare } from '../sdk/mid-scenes/SideBySideCompare';
import { GridCardReveal } from '../sdk/mid-scenes/GridCardReveal';
import { CardSequence } from '../sdk/mid-scenes/CardSequence';
import { HeroTextEntranceExit } from '../sdk/mid-scenes/HeroTextEntranceExit';

// ============================================================================
// CONSTANTS
// ============================================================================

const FPS = 30;
const TRANSITION_DURATION = 15; // frames for crossfade

// Scene durations in frames
const SCENE_DURATIONS = {
  intro: 300,        // 10s - Hook
  myths: 450,        // 15s - Common myths
  mythBust: 540,     // 18s - Myth vs Reality
  science: 480,      // 16s - How it works
  culprits: 540,     // 18s - The real reasons
  fixes: 450,        // 15s - What to check
  funFacts: 360,     // 12s - Fun facts
  outro: 480,        // 16s - Summary + CTA
};

// Total: 3600 frames = 120 seconds

// ============================================================================
// SCENE CONFIGURATIONS (JSON-DRIVEN)
// ============================================================================

/**
 * Scene 1: Intro Hook
 * Layout: full
 * Mid-scenes: TextRevealSequence
 */
const scene1Config = {
  id: "intro-hook",
  layout: {
    type: "full",
    options: { titleHeight: 80, padding: 60 }
  },
  slots: {
    header: {
      midScene: "textReveal",
      config: {
        lines: [{ text: "🚿 The Cold Shower Mystery", emphasis: "low" }],
        revealType: "fade",
        animationDuration: 0.5,
        beats: { start: 0.3 }
      }
    },
    full: {
      midScene: "textReveal",
      config: {
        lines: [
          { text: "Why does your shower", emphasis: "normal" },
          { text: "suddenly go COLD?", emphasis: "high" },
          { text: "Let's find out... 🔍", emphasis: "low" }
        ],
        revealType: "slide",
        direction: "up",
        staggerDelay: 0.5,
        animationDuration: 0.8,
        lineSpacing: "relaxed",
        beats: { start: 1.0 }
      }
    }
  }
};

/**
 * Scene 2: Common Myths
 * Layout: columnSplit
 * Mid-scenes: TextRevealSequence, BubbleCalloutSequence
 */
const scene2Config = {
  id: "common-myths",
  layout: {
    type: "columnSplit",
    options: { columns: 2, ratios: [0.4, 0.6], padding: 40, titleHeight: 90 }
  },
  slots: {
    header: {
      midScene: "textReveal",
      config: {
        lines: [{ text: "💭 What People Think...", emphasis: "high" }],
        revealType: "fade",
        animationDuration: 0.5,
        beats: { start: 0.3 }
      }
    },
    col1: {
      midScene: "textReveal",
      config: {
        lines: [
          { text: "Common", emphasis: "normal" },
          { text: "MYTHS", emphasis: "high" },
          { text: "about cold showers", emphasis: "low" }
        ],
        revealType: "slide",
        direction: "left",
        staggerDelay: 0.3,
        animationDuration: 0.6,
        beats: { start: 0.8 }
      }
    },
    col2: {
      midScene: "bubbleCallout",
      config: {
        callouts: [
          { text: "Someone flushed the toilet!", icon: "🚽" },
          { text: "The water heater broke!", icon: "💔" },
          { text: "We ran out of hot water!", icon: "🥶" }
        ],
        shape: "speech",
        pattern: "diagonal",
        animation: "float",
        staggerDelay: 0.8,
        animationDuration: 0.6,
        beats: { start: 1.5 }
      }
    }
  }
};

/**
 * Scene 3: Myth vs Reality
 * Layout: full (SideBySideCompare handles its own layout)
 * Mid-scenes: SideBySideCompare
 */
const scene3Config = {
  id: "myth-reality",
  layout: {
    type: "full",
    options: { titleHeight: 100, padding: 50 }
  },
  slots: {
    header: {
      midScene: "textReveal",
      config: {
        lines: [{ text: "⚡ Myth vs Reality", emphasis: "high" }],
        revealType: "fade",
        animationDuration: 0.5,
        beats: { start: 0.3 }
      }
    },
    full: {
      midScene: "sideBySide",
      config: {
        left: {
          title: "MYTH",
          icon: "❌",
          items: [
            "Toilet flushes steal your hot water",
            "Your water heater is broken",
            "You've used all the hot water"
          ],
          color: "secondary"
        },
        right: {
          title: "REALITY",
          icon: "✅",
          items: [
            "Pressure changes cause temp shifts",
            "Usually just needs maintenance",
            "Tank recovery is actually fast"
          ],
          color: "accentGreen"
        },
        animation: "slide",
        dividerType: "vs",
        staggerDelay: 0.4,
        animationDuration: 0.7,
        beats: { start: 1.0 }
      }
    }
  }
};

/**
 * Scene 4: The Science
 * Layout: headerRowColumns
 * Mid-scenes: TextRevealSequence, IconGrid
 */
const scene4Config = {
  id: "the-science",
  layout: {
    type: "headerRowColumns",
    options: { columns: 2, rowHeightRatio: 0.35, padding: 40, titleHeight: 80 }
  },
  slots: {
    header: {
      midScene: "textReveal",
      config: {
        lines: [{ text: "🔬 The Science Behind It", emphasis: "high" }],
        revealType: "fade",
        animationDuration: 0.5,
        beats: { start: 0.3 }
      }
    },
    row: {
      midScene: "textReveal",
      config: {
        lines: [
          { text: "Your water heater is a complex system", emphasis: "normal" },
          { text: "with multiple components working together", emphasis: "low" }
        ],
        revealType: "typewriter",
        staggerDelay: 0.3,
        animationDuration: 1.5,
        lineSpacing: "normal",
        beats: { start: 0.8 }
      }
    },
    col1: {
      midScene: "iconGrid",
      config: {
        icons: [
          { iconRef: "🔥", label: "Burner", color: "primary" },
          { iconRef: "🌡️", label: "Thermostat", color: "accentBlue" },
          { iconRef: "💧", label: "Tank", color: "accentGreen" }
        ],
        columns: 3,
        animation: "cascade",
        iconSize: "lg",
        showLabels: true,
        staggerDelay: 0.2,
        beats: { start: 2.5 }
      }
    },
    col2: {
      midScene: "iconGrid",
      config: {
        icons: [
          { iconRef: "🔧", label: "Valve", color: "doodle" },
          { iconRef: "📊", label: "Pressure", color: "secondary" },
          { iconRef: "⚡", label: "Element", color: "primary" }
        ],
        columns: 3,
        animation: "cascade",
        iconSize: "lg",
        showLabels: true,
        staggerDelay: 0.2,
        beats: { start: 3.0 }
      }
    }
  }
};

/**
 * Scene 5: The Real Culprits
 * Layout: gridSlots (2x2)
 * Mid-scenes: GridCardReveal
 */
const scene5Config = {
  id: "real-culprits",
  layout: {
    type: "full",
    options: { titleHeight: 100, padding: 50 }
  },
  slots: {
    header: {
      midScene: "textReveal",
      config: {
        lines: [{ text: "🎯 The REAL Culprits", emphasis: "high" }],
        revealType: "fade",
        animationDuration: 0.5,
        beats: { start: 0.3 }
      }
    },
    full: {
      midScene: "gridCards",
      config: {
        cards: [
          { icon: "🔧", label: "Mixing Valve Issue", sublabel: "Worn or stuck valve" },
          { icon: "🧹", label: "Sediment Buildup", sublabel: "Needs flushing" },
          { icon: "📉", label: "Pressure Drop", sublabel: "Someone using water" },
          { icon: "🔌", label: "Heating Element", sublabel: "Failing slowly" }
        ],
        columns: 2,
        animation: "cascade",
        direction: "topLeft",
        cardVariant: "default",
        showLabels: true,
        labelPosition: "bottom",
        staggerDelay: 0.3,
        animationDuration: 0.6,
        gap: 30,
        beats: { start: 1.0 }
      }
    }
  }
};

/**
 * Scene 6: Fixes / Checklist
 * Layout: columnSplit
 * Mid-scenes: ChecklistReveal, TextRevealSequence
 */
const scene6Config = {
  id: "fixes-checklist",
  layout: {
    type: "columnSplit",
    options: { columns: 2, ratios: [0.55, 0.45], padding: 50, titleHeight: 90 }
  },
  slots: {
    header: {
      midScene: "textReveal",
      config: {
        lines: [{ text: "✅ What To Check", emphasis: "high" }],
        revealType: "fade",
        animationDuration: 0.5,
        beats: { start: 0.3 }
      }
    },
    col1: {
      midScene: "checklist",
      config: {
        items: [
          { text: "Check the mixing valve", checked: true },
          { text: "Flush the water heater tank", checked: true },
          { text: "Test water pressure", checked: false },
          { text: "Inspect heating element", checked: false },
          { text: "Check thermostat setting", checked: false }
        ],
        revealType: "pop",
        icon: "check",
        iconColor: "accentGreen",
        staggerDelay: 0.4,
        animationDuration: 0.5,
        autoFitText: true,
        beats: { start: 0.8 }
      }
    },
    col2: {
      midScene: "textReveal",
      config: {
        lines: [
          { text: "Pro tip:", emphasis: "high" },
          { text: "Flush your tank", emphasis: "normal" },
          { text: "every 6 months!", emphasis: "low" }
        ],
        revealType: "slide",
        direction: "right",
        staggerDelay: 0.5,
        animationDuration: 0.6,
        lineSpacing: "relaxed",
        beats: { start: 3.0 }
      }
    }
  }
};

/**
 * Scene 7: Fun Facts
 * Layout: rowStack
 * Mid-scenes: BubbleCalloutSequence, CardSequence
 */
const scene7Config = {
  id: "fun-facts",
  layout: {
    type: "rowStack",
    options: { rows: 2, rowRatios: [0.35, 0.65], padding: 40, titleHeight: 80 }
  },
  slots: {
    header: {
      midScene: "textReveal",
      config: {
        lines: [{ text: "🤓 Fun Shower Facts", emphasis: "high" }],
        revealType: "fade",
        animationDuration: 0.5,
        beats: { start: 0.3 }
      }
    },
    row1: {
      midScene: "textReveal",
      config: {
        lines: [
          { text: "Did you know?", emphasis: "normal" }
        ],
        revealType: "fade",
        animationDuration: 0.5,
        beats: { start: 0.6 }
      }
    },
    row2: {
      midScene: "bubbleCallout",
      config: {
        callouts: [
          { text: "Average shower uses 17 gallons of water!", icon: "💧" },
          { text: "Hot water heaters last 8-12 years", icon: "📅" },
          { text: "The 'cold shock' lasts only 3-5 seconds", icon: "⏱️" }
        ],
        shape: "rounded",
        pattern: "zigzag",
        animation: "pop",
        staggerDelay: 0.8,
        animationDuration: 0.5,
        beats: { start: 1.2 }
      }
    }
  }
};

/**
 * Scene 8: Outro / Summary
 * Layout: full
 * Mid-scenes: TextRevealSequence
 */
const scene8Config = {
  id: "outro-summary",
  layout: {
    type: "full",
    options: { titleHeight: 100, padding: 60 }
  },
  slots: {
    header: {
      midScene: "textReveal",
      config: {
        lines: [{ text: "🎬 That's a Wrap!", emphasis: "high" }],
        revealType: "fade",
        animationDuration: 0.5,
        beats: { start: 0.3 }
      }
    },
    full: {
      midScene: "textReveal",
      config: {
        lines: [
          { text: "Now you know why", emphasis: "normal" },
          { text: "your shower goes cold!", emphasis: "high" },
          { text: "🚿 Stay warm out there! 🔥", emphasis: "low" }
        ],
        revealType: "slide",
        direction: "up",
        staggerDelay: 0.6,
        animationDuration: 0.8,
        lineSpacing: "relaxed",
        beats: { start: 1.0 }
      }
    }
  }
};

// ============================================================================
// SLOT RENDERER COMPONENT
// ============================================================================

/**
 * Renders a mid-scene inside a slot area
 */
const SlotRenderer = ({ slot, midSceneConfig, slotName }) => {
  if (!slot || !midSceneConfig) return null;

  const { midScene, config } = midSceneConfig;
  
  // Enhance config with slot position
  const enhancedConfig = {
    ...config,
    position: {
      left: 0,
      top: 0,
      width: slot.width,
      height: slot.height,
    }
  };

  const isHeader = slotName === 'header';

  // Render appropriate mid-scene
  const renderMidScene = () => {
    switch (midScene) {
      case 'textReveal':
        return <TextRevealSequence config={enhancedConfig} />;
      case 'iconGrid':
        return <IconGrid config={enhancedConfig} />;
      case 'checklist':
        return <ChecklistReveal config={enhancedConfig} />;
      case 'bubbleCallout':
        return <BubbleCalloutSequence config={enhancedConfig} />;
      case 'sideBySide':
        return <SideBySideCompare config={enhancedConfig} />;
      case 'gridCards':
        return <GridCardReveal config={enhancedConfig} />;
      case 'cardSequence':
        return <CardSequence config={enhancedConfig} />;
      case 'heroText':
        return <HeroTextEntranceExit config={enhancedConfig} />;
      default:
        console.warn(`Unknown midScene: ${midScene}`);
        return null;
    }
  };

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
        {renderMidScene()}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE COMPONENT
// ============================================================================

/**
 * Generic scene component that renders from config
 */
const Scene = ({ config }) => {
  const { width, height } = useVideoConfig();
  const viewport = { width, height };

  // Resolve slots from layout configuration
  const slots = resolveSceneSlots(config.layout, viewport);

  // Get configured slots that exist in resolved slots
  const configuredSlots = Object.keys(config.slots).filter(
    slotName => slots[slotName]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: KNODE_THEME.colors.pageBg }}>
      {configuredSlots.map((slotName) => (
        <SlotRenderer
          key={slotName}
          slot={slots[slotName]}
          midSceneConfig={config.slots[slotName]}
          slotName={slotName}
        />
      ))}
    </AbsoluteFill>
  );
};

// ============================================================================
// TRANSITION WRAPPER
// ============================================================================

const TransitionWrapper = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();
  
  const fadeIn = interpolate(
    frame,
    [0, TRANSITION_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0.0, 0.2, 1) }
  );
  
  const fadeOut = interpolate(
    frame,
    [durationInFrames - TRANSITION_DURATION, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0.0, 1, 1) }
  );
  
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================

export const CanonShowerVideo = () => {
  return (
    <AbsoluteFill>
      <Series>
        {/* Scene 1: Intro Hook (10s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.intro}>
          <TransitionWrapper durationInFrames={SCENE_DURATIONS.intro}>
            <Scene config={scene1Config} />
          </TransitionWrapper>
        </Series.Sequence>

        {/* Scene 2: Common Myths (15s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.myths} offset={-TRANSITION_DURATION}>
          <TransitionWrapper durationInFrames={SCENE_DURATIONS.myths}>
            <Scene config={scene2Config} />
          </TransitionWrapper>
        </Series.Sequence>

        {/* Scene 3: Myth vs Reality (18s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.mythBust} offset={-TRANSITION_DURATION}>
          <TransitionWrapper durationInFrames={SCENE_DURATIONS.mythBust}>
            <Scene config={scene3Config} />
          </TransitionWrapper>
        </Series.Sequence>

        {/* Scene 4: The Science (16s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.science} offset={-TRANSITION_DURATION}>
          <TransitionWrapper durationInFrames={SCENE_DURATIONS.science}>
            <Scene config={scene4Config} />
          </TransitionWrapper>
        </Series.Sequence>

        {/* Scene 5: The Real Culprits (18s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.culprits} offset={-TRANSITION_DURATION}>
          <TransitionWrapper durationInFrames={SCENE_DURATIONS.culprits}>
            <Scene config={scene5Config} />
          </TransitionWrapper>
        </Series.Sequence>

        {/* Scene 6: Fixes Checklist (15s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.fixes} offset={-TRANSITION_DURATION}>
          <TransitionWrapper durationInFrames={SCENE_DURATIONS.fixes}>
            <Scene config={scene6Config} />
          </TransitionWrapper>
        </Series.Sequence>

        {/* Scene 7: Fun Facts (12s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.funFacts} offset={-TRANSITION_DURATION}>
          <TransitionWrapper durationInFrames={SCENE_DURATIONS.funFacts}>
            <Scene config={scene7Config} />
          </TransitionWrapper>
        </Series.Sequence>

        {/* Scene 8: Outro (16s) */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.outro} offset={-TRANSITION_DURATION}>
          <TransitionWrapper durationInFrames={SCENE_DURATIONS.outro}>
            <Scene config={scene8Config} />
          </TransitionWrapper>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export default CanonShowerVideo;
