/**
 * TikTok Video B: "Why ADHD Brains Are Actually Overpowered"
 * 
 * Topic: Reframing ADHD as interest-based nervous system
 * Duration: ~75 seconds
 * Format: Mobile (1080x1920)
 * 
 * Narrative Arc:
 * 1. Hook: "ADHD isn't a deficit. It's a different operating system."
 * 2. The old narrative: Can't focus, easily distracted, lazy
 * 3. The reframe: Interest-based motivation, hyperfocus superpower
 * 4. The hack: "Stop asking why can't I focus, ask what makes this interesting"
 * 5. Close: "Your brain isn't broken. It's playing a different game."
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
  // SCENE 1: Hook - The reframe intro
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
        particles: { enabled: true, style: 'sparkle', count: 12, color: '#A78BFA', opacity: 0.2, speed: 0.6 },
      },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 200 } },
      slots: {
        header: {
          midScene: 'heroText',
          stylePreset: 'playful',
          config: {
            text: '',
            heroType: 'lottie',
            heroRef: 'lightning-bolt',
            beats: { entrance: 0.3, exit: 9.5 },
          },
        },
        row1: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: "ADHD isn't a deficit.", emphasis: 'high', beats: { start: 1.0, exit: 5.0, emphasis: 1.5 } },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.5,
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: "It's a different", emphasis: 'normal', beats: { start: 4.0, exit: 9.0 } },
              { text: 'operating system.', emphasis: 'high', beats: { start: 5.5, exit: 9.0, emphasis: 6.0 } },
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

  // =========================================================================
  // SCENE 2: The old narrative - What they told you
  // =========================================================================
  {
    id: 'old-narrative',
    durationInFrames: 330, // 11s
    transition: { type: 'doodle-wipe', direction: 'right', wobble: true },
    config: {
      format: 'mobile',
      background: { preset: 'cleanCard', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 40, titleHeight: 100 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: 'What they told you:', emphasis: 'high', beats: { start: 0.3, exit: 10.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'checklist',
          stylePreset: 'educational',
          config: {
            items: [
              { text: '"Can\'t focus"', checked: false, beats: { start: 1.5 } },
              { text: '"Easily distracted"', checked: false, beats: { start: 3.0 } },
              { text: '"Lazy"', checked: false, beats: { start: 4.5 } },
            ],
            staggerDelay: 0.5,
            beats: { start: 1.2, exit: 10.5 },
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Sound familiar? 🙄', emphasis: 'normal', beats: { start: 7.0, exit: 10.0 } },
            ],
            revealType: 'fade',
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 3: The truth - Interest-based
  // =========================================================================
  {
    id: 'the-truth',
    durationInFrames: 390, // 13s
    transition: { type: 'page-turn', direction: 'right' },
    config: {
      format: 'mobile',
      background: { preset: 'notebookSoft', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 3, padding: 40, titleHeight: 80 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'The truth:', emphasis: 'high', beats: { start: 0.3, exit: 12.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'gridCards',
          stylePreset: 'educational',
          config: {
            cards: [
              { icon: '🎯', label: 'Interest-based', sublabel: 'Not importance-based', animated: true, beats: { start: 1.5 } },
              { icon: '🚀', label: 'Hyperfocus', sublabel: 'Superpower mode', animated: true, beats: { start: 2.5 } },
            ],
            columns: 2,
            animation: 'bounce',
            beats: { start: 1.5, exit: 12.5 },
          },
        },
        row2: {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: '',
            heroType: 'lottie',
            heroRef: 'brain-active',
            beats: { entrance: 5.0, exit: 9.0 },
          },
        },
        row3: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Your brain runs on', emphasis: 'normal', beats: { start: 8.0, exit: 12.0 } },
              { text: 'interest, not importance.', emphasis: 'high', beats: { start: 9.5, exit: 12.0, emphasis: 10.0 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.4,
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 4: The hack - The question flip
  // =========================================================================
  {
    id: 'the-hack',
    durationInFrames: 420, // 14s
    transition: { type: 'slide', direction: 'left' },
    config: {
      format: 'mobile',
      background: {
        preset: 'spotlight',
        spotlight: { x: 50, y: 45, intensity: 0.3 },
      },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 0 } },
      slots: {
        row1: [
          {
            midScene: 'textReveal',
            stylePreset: 'focus',
            config: {
              lines: [
                { text: 'Stop asking:', emphasis: 'normal', beats: { start: 0.5, exit: 6.0 } },
                { text: '"Why can\'t I focus?"', emphasis: 'low', beats: { start: 1.5, exit: 6.0 } },
              ],
              revealType: 'fade',
              staggerDelay: 0.4,
              lineSpacing: 'relaxed',
            },
          },
          {
            midScene: 'heroText',
            stylePreset: 'playful',
            config: {
              text: '',
              heroType: 'lottie',
              heroRef: 'target-focus',
              beats: { entrance: 5.5, exit: 8.5 },
            },
          },
        ],
        row2: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'Start asking:', emphasis: 'normal', beats: { start: 8.0, exit: 13.0 } },
              { text: '"What makes this', emphasis: 'high', beats: { start: 9.5, exit: 13.0, emphasis: 10.0 } },
              { text: 'interesting?"', emphasis: 'high', beats: { start: 10.5, exit: 13.0, emphasis: 11.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.35,
            lineSpacing: 'normal',
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 5: The metaphor
  // =========================================================================
  {
    id: 'metaphor',
    durationInFrames: 330, // 11s
    transition: { type: 'doodle-wipe', direction: 'right' },
    config: {
      format: 'mobile',
      background: { preset: 'cleanCard', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 0 } },
      slots: {
        row1: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: 'Neurotypical brains:', emphasis: 'normal', beats: { start: 0.5, exit: 5.0 } },
              { text: 'importance → motivation', emphasis: 'normal', beats: { start: 1.5, exit: 5.5 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.4,
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'ADHD brains:', emphasis: 'normal', beats: { start: 5.0, exit: 10.0 } },
              { text: 'interest → HYPERFOCUS', emphasis: 'high', beats: { start: 6.5, exit: 10.0, emphasis: 7.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.4,
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 6: The close
  // =========================================================================
  {
    id: 'close',
    durationInFrames: 300, // 10s
    transition: { type: 'eraser' },
    config: {
      format: 'mobile',
      background: {
        preset: 'sunriseGradient',
        particles: { enabled: true, style: 'sparkle', count: 15, color: '#A78BFA', opacity: 0.25, speed: 0.6 },
      },
      layout: { type: 'full', options: { padding: 60 } },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: "Your brain isn't broken.", emphasis: 'normal', beats: { start: 0.5, exit: 4.0 } },
              { text: "It's just playing", emphasis: 'normal', beats: { start: 2.5, exit: 6.0 } },
              { text: 'a different game. 🎮', emphasis: 'high', beats: { start: 4.5, exit: 9.0, emphasis: 5.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.5,
            lineSpacing: 'relaxed',
          },
        },
      },
    },
  },
];

// Calculate total duration
export const TIKTOK_ADHDOVERPOWERED_DURATION = scenes.reduce(
  (total, scene) => total + scene.durationInFrames,
  0
);

/**
 * TikTok_ADHDOverpowered
 * 
 * Mobile-optimized (1080x1920) TikTok video reframing ADHD.
 */
export const TikTok_ADHDOverpowered = () => {
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

export default TikTok_ADHDOverpowered;
