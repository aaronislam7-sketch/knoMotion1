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
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { TransitionSeries } from '@remotion/transitions';
import { SceneFromConfig } from './SceneRenderer';
import { resolvePresentation, resolveTransitionTiming } from '../sdk/transitions';

const TRANSITION_FRAMES = 20;

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

const allScenes = [
  { id: 'intro', durationInFrames: SCENE_DURATIONS.intro, transition: { type: 'fade' }, config: scene1Config },
  { id: 'myths', durationInFrames: SCENE_DURATIONS.myths, transition: { type: 'slide', direction: 'right' }, config: scene2Config },
  { id: 'mythBust', durationInFrames: SCENE_DURATIONS.mythBust, transition: { type: 'slide', direction: 'left' }, config: scene3Config },
  { id: 'science', durationInFrames: SCENE_DURATIONS.science, transition: { type: 'slide', direction: 'up' }, config: scene4Config },
  { id: 'culprits', durationInFrames: SCENE_DURATIONS.culprits, transition: { type: 'slide', direction: 'right' }, config: scene5Config },
  { id: 'fixes', durationInFrames: SCENE_DURATIONS.fixes, transition: { type: 'page-turn', direction: 'right' }, config: scene6Config },
  { id: 'funFacts', durationInFrames: SCENE_DURATIONS.funFacts, transition: { type: 'slide', direction: 'left' }, config: scene7Config },
  { id: 'outro', durationInFrames: SCENE_DURATIONS.outro, transition: { type: 'fade' }, config: scene8Config },
];

export const CanonShowerVideo = () => {
  const { width, height } = useVideoConfig();
  const viewport = { width, height };

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {allScenes.map((scene, index) => (
          <React.Fragment key={scene.id}>
            {index > 0 && (
              <TransitionSeries.Transition
                presentation={resolvePresentation(scene.transition, viewport)}
                timing={resolveTransitionTiming(scene.transition, TRANSITION_FRAMES)}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
              <SceneFromConfig config={scene.config} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export default CanonShowerVideo;
