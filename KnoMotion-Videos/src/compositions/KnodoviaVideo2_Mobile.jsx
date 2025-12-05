/**
 * Knodovia Video 2: The Culture Engine Room (MOBILE VERSION)
 * 
 * Mobile-optimized version for TikTok/Reels/Shorts (1080x1920).
 * 
 * KEY MOBILE ADAPTATIONS:
 * - Uses 'full' and 'rowStack' layouts only
 * - 2 columns max for grids
 * - Simplified content per scene
 * - Larger text for readability
 * 
 * NARRATIVE: Teaches about Knodovian culture, values, and daily life.
 */

import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SceneFromConfig, SceneTransitionWrapper } from './SceneRenderer';

const FPS = 30;
const TRANSITION_FRAMES = 24; // Slightly longer for mobile

const mobileScenes = [
  /**
   * SCENE 1: Cold Open
   * Hook viewer, introduce culture theme
   */
  {
    id: 'mobile-culture-open',
    durationInFrames: 300,
    transition: { type: 'slide', direction: 'down' },
    config: {
      format: 'mobile',
      background: {
        preset: 'notebookSoft',
        layerNoise: true,
        particles: { enabled: true, style: 'sparkle', count: 8, color: '#F59E0B', opacity: 0.15, speed: 0.4 },
      },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 120 } },
      slots: {
        header: {
          midScene: 'heroText',
          stylePreset: 'mentor',
          config: {
            text: 'Culture Class',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 0.3, exit: 9.0 },
          },
        },
        row1: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'Knodovia has culture.', emphasis: 'normal', beats: { start: 1.0, exit: 4.0 } },
              { text: 'Questionable culture...', emphasis: 'high', beats: { start: 3.0, exit: 6.0, emphasis: 3.5 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.8,
            lineSpacing: 'relaxed',
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: "Let's dive in.", emphasis: 'high', beats: { start: 6.5, exit: 9.0, emphasis: 7.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
          },
        },
      },
    },
  },

  /**
   * SCENE 2: Core Values (Part 1)
   * First two values in grid
   */
  {
    id: 'mobile-values-1',
    durationInFrames: 360,
    transition: { type: 'doodle-wipe', direction: 'right', wobble: true },
    config: {
      format: 'mobile',
      background: { preset: 'cleanCard', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 40, titleHeight: 100 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: 'The Core Values', emphasis: 'high', beats: { start: 0.3, exit: 10.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'gridCards',
          stylePreset: 'playful',
          config: {
            cards: [
              { icon: '🧠', label: 'Curiosity First', sublabel: 'Questions > Answers', animated: true },
              { icon: '🤝', label: 'Share Freely', sublabel: 'Knowledge multiplies', animated: true },
            ],
            columns: 2,
            animation: 'cascade',
            beats: { start: 1.0, exit: 10.0 },
          },
        },
        row2: {
          midScene: 'heroText',
          stylePreset: 'mentor',
          config: {
            text: 'Two down, one to go...',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 5.0, exit: 11.0 },
          },
        },
      },
    },
  },

  /**
   * SCENE 3: Core Values (Part 2) + Daily Ritual Intro
   */
  {
    id: 'mobile-values-2',
    durationInFrames: 360,
    transition: { type: 'slide', direction: 'left' },
    config: {
      format: 'mobile',
      background: { preset: 'sunriseGradient', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 40, titleHeight: 80 } },
      slots: {
        header: {
          midScene: 'gridCards',
          stylePreset: 'focus',
          config: {
            cards: [
              { icon: '🎨', label: 'Embrace Chaos', sublabel: 'Confusion = pre-learning', animated: true },
            ],
            columns: 1,
            animation: 'bounce',
            beats: { start: 0.5, exit: 6.0 },
          },
        },
        row1: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: "That's the third value.", emphasis: 'normal', beats: { start: 1.5, exit: 5.0 } },
              { text: 'Weird? Yes.', emphasis: 'high', beats: { start: 3.0, exit: 6.0, emphasis: 3.5 } },
              { text: 'Effective? Also yes.', emphasis: 'normal', beats: { start: 4.5, exit: 7.0 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.5,
          },
        },
        row2: {
          midScene: 'heroText',
          stylePreset: 'playful',
          config: {
            text: 'Now for daily rituals...',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 7.0, exit: 11.0 },
          },
        },
      },
    },
  },

  /**
   * SCENE 4: Daily Rituals
   */
  {
    id: 'mobile-rituals',
    durationInFrames: 420,
    transition: { type: 'page-turn', direction: 'right' },
    config: {
      format: 'mobile',
      background: { preset: 'notebookSoft', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 40, titleHeight: 90 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'A Day in Knodovia', emphasis: 'high', beats: { start: 0.3, exit: 12.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'checklist',
          stylePreset: 'educational',
          config: {
            items: [
              { text: '🌅 Morning: "Idea Dump"', checked: true },
              { text: '☕ Midday: Ask something new', checked: true },
              { text: '🌀 3pm: Confusion Break', checked: false },
              { text: '🌙 Evening: Teach one thing', checked: true },
            ],
            icon: 'lottieCheck',
            staggerDelay: 0.6,
            beats: { start: 1.0, exit: 12.0 },
          },
        },
        row2: {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: 'Yes, confusion is scheduled.',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 7.5, exit: 13.0 },
          },
        },
      },
    },
  },

  /**
   * SCENE 5: Holidays
   */
  {
    id: 'mobile-holidays',
    durationInFrames: 360,
    transition: { type: 'doodle-wipe', direction: 'right' },
    config: {
      format: 'mobile',
      background: { preset: 'sunriseGradient', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 40, titleHeight: 90 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'Holidays 🎉', emphasis: 'high', beats: { start: 0.3, exit: 10.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'gridCards',
          stylePreset: 'educational',
          config: {
            cards: [
              { icon: '🔄', label: 'Sync Day', sublabel: 'Shout "ALIGNED!" at noon', animated: true },
              { icon: '🔌', label: 'Unplug Hour', sublabel: 'Analog thinking only', animated: true },
            ],
            columns: 2,
            animation: 'cascade',
            beats: { start: 1.0, exit: 10.0 },
          },
        },
        row2: {
          midScene: 'heroText',
          stylePreset: 'mentor',
          config: {
            text: 'Attendance optional. Stories mandatory.',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 5.5, exit: 11.0 },
          },
        },
      },
    },
  },

  /**
   * SCENE 6: Close & Teaser
   */
  {
    id: 'mobile-culture-close',
    durationInFrames: 300,
    transition: { type: 'eraser' },
    config: {
      format: 'mobile',
      background: { preset: 'cleanCard', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 0 } },
      slots: {
        row1: [
          {
            midScene: 'textReveal',
            stylePreset: 'mentor',
            config: {
              lines: [
                { text: 'Culture is what you tolerate.', emphasis: 'normal', beats: { start: 0.5, exit: 4.0 } },
                { text: 'In Knodovia, we tolerate a lot.', emphasis: 'high', beats: { start: 2.0, exit: 5.5, emphasis: 2.5 } },
              ],
              revealType: 'fade',
              staggerDelay: 0.5,
              lineSpacing: 'relaxed',
            },
          },
          {
            midScene: 'heroText',
            stylePreset: 'focus',
            config: {
              text: "You'll fit right in.",
              heroType: 'lottie',
              heroRef: 'error',
              beats: { entrance: 5.0, exit: 9.0 },
            },
          },
        ],
        row2: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'NEXT: Economics 💰', emphasis: 'high', beats: { start: 7.0, exit: 9.5, emphasis: 7.5 } },
            ],
            revealType: 'slide',
            direction: 'up',
          },
        },
      },
    },
  },
];

export const KNODOVIA_VIDEO2_MOBILE_DURATION = mobileScenes.reduce(
  (total, scene) => total + scene.durationInFrames,
  0,
);

export const KnodoviaCultureMobile = () => {
  return (
    <AbsoluteFill>
      <Series>
        {mobileScenes.map((scene, index) => (
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

export default KnodoviaCultureMobile;
