/**
 * TikTok Video C: "You're Not in the Present. You Never Were."
 * 
 * Topic: The 80ms perception delay
 * Duration: ~70 seconds
 * Format: Mobile (1080x1920)
 * 
 * Narrative Arc:
 * 1. Hook: "You've never experienced 'now'. Not once."
 * 2. The science: 80ms processing delay
 * 3. The analogy: "Your brain is like watching a livestream with lag"
 * 4. The implication: Brain predicts the present to compensate
 * 5. Close: "Welcome to time travel."
 * 
 * Voice-over style: Casual TikTok creator explaining something complex
 * 
 * ANALOGY FEATURE: Uses the "buffering livestream" analogy in Scene 3
 */

import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SceneFromConfig, SceneTransitionWrapper } from './SceneRenderer';

const FPS = 30;
const TRANSITION_FRAMES = 20;

const scenes = [
  // =========================================================================
  // SCENE 1: Hook - The mind-bending opener
  // =========================================================================
  {
    id: 'hook',
    durationInFrames: 270, // 9s
    transition: { type: 'fade' },
    config: {
      format: 'mobile',
      background: {
        preset: 'spotlight',
        spotlight: { x: 50, y: 40, intensity: 0.25 },
        particles: { enabled: true, style: 'sparkle', count: 10, color: '#60A5FA', opacity: 0.2, speed: 0.4 },
      },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 200 } },
      slots: {
        header: {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: '',
            heroType: 'lottie',
            heroRef: 'clock-delay',
            beats: { entrance: 0.3, exit: 8.5 },
          },
        },
        row1: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: "You've never experienced", emphasis: 'normal', beats: { start: 1.0, exit: 4.5 } },
              { text: '"now"', emphasis: 'high', beats: { start: 2.5, exit: 5.5, emphasis: 3.0 } },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.5,
            lineSpacing: 'relaxed',
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'Not once.', emphasis: 'high', beats: { start: 5.0, exit: 8.0, emphasis: 5.5 } },
            ],
            revealType: 'fade',
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 2: The delay explained
  // =========================================================================
  {
    id: 'the-delay',
    durationInFrames: 390, // 13s
    transition: { type: 'doodle-wipe', direction: 'right', wobble: true },
    config: {
      format: 'mobile',
      background: { preset: 'notebookSoft', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 3, padding: 40, titleHeight: 80 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: 'The 80ms Delay', emphasis: 'high', beats: { start: 0.3, exit: 12.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'checklist',
          stylePreset: 'educational',
          config: {
            items: [
              { text: 'Light hits your eyes', checked: true, beats: { start: 1.5 } },
              { text: 'Signals travel to brain', checked: true, beats: { start: 3.0 } },
              { text: 'Brain processes image', checked: true, beats: { start: 4.5 } },
              { text: 'You "see"', checked: true, beats: { start: 6.0 } },
            ],
            staggerDelay: 0.5,
            beats: { start: 1.2, exit: 12.5 },
          },
        },
        row2: {
          midScene: 'bigNumber',
          stylePreset: 'playful',
          config: {
            number: '~80ms',
            label: 'later',
            emphasis: 'high',
            animation: 'pop',
            beats: { start: 8.0, exit: 12.0 },
          },
        },
        row3: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: "That's how long it takes.", emphasis: 'normal', beats: { start: 9.5, exit: 12.0 } },
            ],
            revealType: 'fade',
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 3: THE ANALOGY - Buffering livestream
  // =========================================================================
  {
    id: 'analogy',
    durationInFrames: 390, // 13s
    transition: { type: 'page-turn', direction: 'right' },
    config: {
      format: 'mobile',
      background: { preset: 'cleanCard', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 3, padding: 40, titleHeight: 80 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Think of it like this:', emphasis: 'high', beats: { start: 0.3, exit: 12.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: '',
            heroType: 'lottie',
            heroRef: 'signal-buffer',
            beats: { entrance: 1.0, exit: 7.0 },
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'Your brain is like', emphasis: 'normal', beats: { start: 3.0, exit: 8.0 } },
              { text: 'watching a livestream', emphasis: 'high', beats: { start: 4.5, exit: 9.0, emphasis: 5.0 } },
              { text: 'with lag.', emphasis: 'high', beats: { start: 6.0, exit: 10.0, emphasis: 6.5 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.4,
            lineSpacing: 'normal',
          },
        },
        row3: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: "You think it's live.", emphasis: 'normal', beats: { start: 9.0, exit: 12.0 } },
              { text: "It's not.", emphasis: 'high', beats: { start: 10.5, exit: 12.0, emphasis: 11.0 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.4,
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 4: The twist - Brain predicts
  // =========================================================================
  {
    id: 'prediction',
    durationInFrames: 360, // 12s
    transition: { type: 'slide', direction: 'up' },
    config: {
      format: 'mobile',
      background: {
        preset: 'spotlight',
        spotlight: { x: 50, y: 50, intensity: 0.3 },
      },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 100 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: 'But here\'s the wild part:', emphasis: 'high', beats: { start: 0.3, exit: 11.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'gridCards',
          stylePreset: 'playful',
          config: {
            cards: [
              { icon: '🧠', label: 'Your brain', sublabel: 'Shows you the past', animated: true, beats: { start: 1.5 } },
              { icon: '🔮', label: 'And PREDICTS', sublabel: "What's happening now", animated: true, beats: { start: 2.5 } },
            ],
            columns: 2,
            animation: 'cascade',
            beats: { start: 1.5, exit: 11.5 },
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Every reaction you have', emphasis: 'normal', beats: { start: 7.0, exit: 11.0 } },
              { text: 'is to something already gone.', emphasis: 'high', beats: { start: 8.5, exit: 11.0, emphasis: 9.0 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.4,
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 5: The close - Welcome to time travel
  // =========================================================================
  {
    id: 'close',
    durationInFrames: 300, // 10s
    transition: { type: 'eraser' },
    config: {
      format: 'mobile',
      background: {
        preset: 'sunriseGradient',
        particles: { enabled: true, style: 'sparkle', count: 15, color: '#60A5FA', opacity: 0.25, speed: 0.6 },
      },
      layout: { type: 'full', options: { padding: 60 } },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: "You're always", emphasis: 'normal', beats: { start: 0.5, exit: 4.0 } },
              { text: '80 milliseconds', emphasis: 'high', beats: { start: 2.0, exit: 5.5, emphasis: 2.5 } },
              { text: 'behind reality.', emphasis: 'normal', beats: { start: 3.5, exit: 6.5 } },
              { text: 'Welcome to time travel. ⏰', emphasis: 'high', beats: { start: 5.5, exit: 9.0, emphasis: 6.0 } },
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
export const TIKTOK_80MSDELAY_DURATION = scenes.reduce(
  (total, scene) => total + scene.durationInFrames,
  0
);

/**
 * TikTok_80msDelay
 * 
 * Mobile-optimized (1080x1920) TikTok video about the 80ms perception delay.
 * Features the "buffering livestream" analogy in Scene 3.
 */
export const TikTok_80msDelay = () => {
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

export default TikTok_80msDelay;
