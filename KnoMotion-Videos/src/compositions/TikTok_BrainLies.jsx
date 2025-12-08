/**
 * TikTok Video A: "Your Brain Lies to You Every Day"
 * 
 * Topic: Baader-Meinhof Phenomenon (Frequency Illusion)
 * Duration: ~70 seconds
 * Format: Mobile (1080x1920)
 * 
 * Narrative Arc:
 * 1. Hook: "Ever notice how you learn a new word... and suddenly it's EVERYWHERE?"
 * 2. Name it: Baader-Meinhof Phenomenon / Frequency Illusion
 * 3. Why it happens: Brain's filtering system (11M → 40 bits)
 * 4. Punchline: "You're not special. Your brain is just lazy."
 * 5. Closing twist: "Now you'll notice THIS video everywhere too."
 * 
 * Voice-over style: Casual TikTok creator explaining something complex
 */

import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SceneFromConfig, SceneTransitionWrapper } from './SceneRenderer';

const FPS = 30;
const TRANSITION_FRAMES = 20;

const scenes = [
  // =========================================================================
  // SCENE 1: Hook - The relatable experience
  // =========================================================================
  {
    id: 'hook',
    durationInFrames: 300, // 10s
    transition: { type: 'fade' },
    config: {
      format: 'mobile',
      background: {
        preset: 'sunriseGradient',
        layerNoise: true,
        particles: { enabled: true, style: 'sparkle', count: 12, color: '#FBBF24', opacity: 0.2, speed: 0.5 },
      },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 200 } },
      slots: {
        header: {
          midScene: 'heroText',
          stylePreset: 'playful',
          config: {
            text: '',
            heroType: 'lottie',
            heroRef: 'brain-active',
            beats: { entrance: 0.3, exit: 9.5 },
          },
        },
        row1: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Your brain lies to you', emphasis: 'high', beats: { start: 1.0, exit: 5.0, emphasis: 1.5 } },
              { text: 'every single day.', emphasis: 'normal', beats: { start: 2.5, exit: 5.5 } },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.6,
            lineSpacing: 'relaxed',
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: "And you don't even notice.", emphasis: 'high', beats: { start: 5.5, exit: 9.0, emphasis: 6.0 } },
            ],
            revealType: 'fade',
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 2: The Experience - Setting up the phenomenon
  // =========================================================================
  {
    id: 'experience',
    durationInFrames: 330, // 11s
    transition: { type: 'doodle-wipe', direction: 'right', wobble: true },
    config: {
      format: 'mobile',
      background: { preset: 'notebookSoft', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 40, titleHeight: 100 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: 'Ever learn a new word...', emphasis: 'high', beats: { start: 0.3, exit: 10.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'gridCards',
          stylePreset: 'playful',
          config: {
            cards: [
              { icon: '📖', label: 'See it once', animated: true, beats: { start: 1.5 } },
              { icon: '👀', label: 'Then EVERYWHERE', animated: true, beats: { start: 3.0 } },
            ],
            columns: 2,
            animation: 'cascade',
            showLabels: true,
            beats: { start: 1.2, exit: 10.5 },
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Books. Ads. Conversations.', emphasis: 'normal', beats: { start: 5.0, exit: 8.0 } },
              { text: "It's following you.", emphasis: 'high', beats: { start: 6.5, exit: 10.0, emphasis: 7.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.5,
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 3: Name the phenomenon
  // =========================================================================
  {
    id: 'phenomenon-name',
    durationInFrames: 360, // 12s
    transition: { type: 'page-turn', direction: 'right' },
    config: {
      format: 'mobile',
      background: { preset: 'cleanCard', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 3, padding: 40, titleHeight: 80 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: "It's called:", emphasis: 'normal', beats: { start: 0.3, exit: 11.0 } },
            ],
          },
        },
        row1: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'The Baader-Meinhof', emphasis: 'high', beats: { start: 1.5, exit: 11.0, emphasis: 2.0 } },
              { text: 'Phenomenon', emphasis: 'high', beats: { start: 2.5, exit: 11.0, emphasis: 3.0 } },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.4,
            lineSpacing: 'normal',
          },
        },
        row2: {
          midScene: 'heroText',
          stylePreset: 'mentor',
          config: {
            text: '',
            heroType: 'lottie',
            heroRef: 'target-focus',
            beats: { entrance: 4.0, exit: 8.0 },
          },
        },
        row3: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: 'Also called:', emphasis: 'normal', beats: { start: 7.0, exit: 11.0 } },
              { text: 'Frequency Illusion', emphasis: 'high', beats: { start: 8.0, exit: 11.0, emphasis: 8.5 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.3,
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 4: The big numbers - Why it happens
  // =========================================================================
  {
    id: 'big-numbers',
    durationInFrames: 420, // 14s
    transition: { type: 'slide', direction: 'up' },
    config: {
      format: 'mobile',
      background: {
        preset: 'spotlight',
        spotlight: { x: 50, y: 40, intensity: 0.3 },
      },
      layout: { type: 'rowStack', options: { rows: 3, padding: 40, titleHeight: 80 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: "Here's why...", emphasis: 'high', beats: { start: 0.3, exit: 13.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'bigNumber',
          stylePreset: 'playful',
          config: {
            number: '11,000,000',
            label: 'bits hitting your senses every second',
            emphasis: 'high',
            animation: 'countUp',
            countFrom: 0,
            beats: { start: 1.5, exit: 7.0 },
          },
        },
        row2: {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: '',
            heroType: 'lottie',
            heroRef: 'funnel-filter',
            beats: { entrance: 6.0, exit: 9.0 },
          },
        },
        row3: {
          midScene: 'bigNumber',
          stylePreset: 'mentor',
          config: {
            number: '40',
            label: 'bits your brain actually processes',
            emphasis: 'high',
            animation: 'pop',
            beats: { start: 8.5, exit: 13.0 },
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 5: The punchline
  // =========================================================================
  {
    id: 'punchline',
    durationInFrames: 300, // 10s
    transition: { type: 'doodle-wipe', direction: 'right' },
    config: {
      format: 'mobile',
      background: { preset: 'cleanCard', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 0 } },
      slots: {
        row1: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: "You're not psychic.", emphasis: 'normal', beats: { start: 0.5, exit: 4.5 } },
              { text: "You're not special.", emphasis: 'normal', beats: { start: 2.0, exit: 5.5 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.5,
            lineSpacing: 'relaxed',
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'Your brain is just', emphasis: 'normal', beats: { start: 5.0, exit: 9.0 } },
              { text: 'lazy. 🦥', emphasis: 'high', beats: { start: 6.0, exit: 9.0, emphasis: 6.5 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.3,
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 6: The meta twist
  // =========================================================================
  {
    id: 'closing-twist',
    durationInFrames: 270, // 9s
    transition: { type: 'eraser' },
    config: {
      format: 'mobile',
      background: {
        preset: 'sunriseGradient',
        particles: { enabled: true, style: 'sparkle', count: 15, color: '#F59E0B', opacity: 0.25, speed: 0.6 },
      },
      layout: { type: 'full', options: { padding: 60 } },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'Now you know.', emphasis: 'normal', beats: { start: 0.5, exit: 3.5 } },
              { text: "And you'll notice", emphasis: 'normal', beats: { start: 2.0, exit: 6.0 } },
              { text: 'THIS video', emphasis: 'high', beats: { start: 3.5, exit: 7.0, emphasis: 4.0 } },
              { text: 'everywhere. 🎯', emphasis: 'high', beats: { start: 5.0, exit: 8.0, emphasis: 5.5 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.4,
            lineSpacing: 'relaxed',
          },
        },
      },
    },
  },
];

// Calculate total duration
export const TIKTOK_BRAINLIES_DURATION = scenes.reduce(
  (total, scene) => total + scene.durationInFrames,
  0
);

/**
 * TikTok_BrainLies
 * 
 * Mobile-optimized (1080x1920) TikTok video about the Baader-Meinhof Phenomenon.
 */
export const TikTok_BrainLies = () => {
  return (
    <AbsoluteFill>
      <Series>
        {scenes.map((scene, index) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
            offset={index === 0 ? 0 : -TRANSITION_FRAMES}
          >
            <SceneTransitionWrapper
              durationInFrames={scene.durationInFrames}
              transition={scene.transition}
            >
              <SceneFromConfig config={scene.config} />
            </SceneTransitionWrapper>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

export default TikTok_BrainLies;
