/**
 * Knodovia Video 2: The Culture Engine Room
 * 
 * NARRATIVE ARC:
 * This video teaches viewers about Knodovian society, values, and daily life.
 * By the end, viewers should understand:
 * - The 3 Core Values that drive Knodovian behavior
 * - Daily rituals and their (strange) purpose
 * - Social norms and communication styles
 * - Major holidays and traditions
 * 
 * MASCOT: The 'error' lottie represents our quirky guide through Knodovia
 */

import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SceneFromConfig, SceneTransitionWrapper } from './SceneRenderer';

const FPS = 30;
const TRANSITION_FRAMES = 18;

/**
 * SCENE 1: Cold Open - "Welcome to Culture Class"
 * INTENTION: Hook the viewer, set the tone (quirky but informative)
 * DURATION: 12 seconds
 */
const scene1_ColdOpen = {
  id: 'culture-cold-open',
  durationInFrames: 360,
  transition: { type: 'slide', direction: 'down' },
  config: {
    background: {
      preset: 'chalkboardGradient',
      layerNoise: true,
    },
    layout: { type: 'rowStack', options: { rows: 2, padding: 60, titleHeight: 80 } },
    slots: {
      header: {
        midScene: 'heroText',
        stylePreset: 'mentor',
        config: {
          text: 'Culture Class',
          heroType: 'lottie',
          heroRef: 'error', // Our mascot welcomes you
          beats: { entrance: 0.3, exit: 10.0 },
        },
      },
      // Using array pattern: sequence mascot intro → main message
      row1: [
        {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Knodovia has culture.', emphasis: 'normal', beats: { start: 1.0, exit: 4.5 } },
            ],
            revealType: 'typewriter',
            animationDuration: 1.2,
          },
        },
        {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'Questionable culture...', emphasis: 'high', beats: { start: 4.0, exit: 7.0, emphasis: 4.5 } },
              { text: 'but culture nonetheless.', emphasis: 'normal', beats: { start: 5.5, exit: 10.0 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.6,
          },
        },
      ],
      row2: {
        midScene: 'textReveal',
        stylePreset: 'focus',
        config: {
          lines: [
            { text: "Let's begin.", emphasis: 'high', beats: { start: 8.0, exit: 11.0, emphasis: 8.5 } },
          ],
          revealType: 'slide',
          direction: 'up',
        },
      },
    },
  },
};

/**
 * SCENE 2: The Three Core Values
 * INTENTION: Establish the foundational principles of Knodovian society
 * LEARNING: Viewers understand what Knodovians prioritize
 * DURATION: 14 seconds
 */
const scene2_CoreValues = {
  id: 'culture-core-values',
  durationInFrames: 420,
  transition: { type: 'doodle-wipe', direction: 'right', wobble: true },
  config: {
    background: { preset: 'notebookSoft', layerNoise: true },
    layout: {
      type: 'rowStack',
      options: { rows: 2, padding: 50, titleHeight: 90 },
    },
    slots: {
      header: {
        midScene: 'textReveal',
        stylePreset: 'educational',
        config: {
          lines: [
            { text: 'The 3 Core Values', emphasis: 'high', beats: { start: 0.3, exit: 12.0, emphasis: 0.8 } },
          ],
        },
      },
      row1: {
        midScene: 'gridCards',
        stylePreset: 'playful',
        config: {
          cards: [
            {
              icon: '🧠',
              label: 'Curiosity First',
              sublabel: 'Questions > Answers',
              animated: true,
              beats: { start: 1.0, exit: 12.0 },
            },
            {
              icon: '🤝',
              label: 'Share Freely',
              sublabel: 'Knowledge multiplies when given',
              animated: true,
              beats: { start: 1.8, exit: 12.0 },
            },
            {
              icon: '🎨',
              label: 'Embrace Chaos',
              sublabel: 'Confusion is just pre-learning',
              animated: true,
              beats: { start: 2.6, exit: 12.0 },
            },
          ],
          columns: 3,
          animation: 'cascade',
          showLabels: true,
        },
      },
      // Slot array: mascot appears to comment on values
      row2: [
        {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: 'Simple, right?',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 4.5, exit: 8.0 },
          },
        },
        {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Now for the weird part...', emphasis: 'high', beats: { start: 9.0, exit: 13.0, emphasis: 9.5 } },
            ],
            revealType: 'fade',
          },
        },
      ],
    },
  },
};

/**
 * SCENE 3: Daily Rituals
 * INTENTION: Show how values translate into daily practice
 * LEARNING: Understand the rhythm of Knodovian life
 * DURATION: 16 seconds
 */
const scene3_DailyRituals = {
  id: 'culture-daily-rituals',
  durationInFrames: 480,
  transition: { type: 'page-turn', direction: 'right' },
  config: {
    background: { preset: 'cleanCard', layerNoise: true },
    layout: {
      type: 'rowStack',
      options: { rows: 2, padding: 50, titleHeight: 80 },
    },
    slots: {
      header: {
        midScene: 'textReveal',
        stylePreset: 'playful',
        config: {
          lines: [
            { text: 'A Day in Knodovia', emphasis: 'high', beats: { start: 0.3, exit: 14.0, emphasis: 0.8 } },
          ],
        },
      },
      row1: {
        midScene: 'checklist',
        stylePreset: 'educational',
        config: {
          items: [
            { text: '🌅 Morning: "The Idea Dump" — write 3 random thoughts', checked: true, beats: { start: 1.2 } },
            { text: '☕ Midday: "The Great Question" — ask something you don\'t know', checked: true, beats: { start: 2.4 } },
            { text: '🌀 3pm: "Confusion Break" — intentionally get confused about something', checked: false, beats: { start: 3.6 } },
            { text: '🌙 Evening: "The Knowledge Gift" — teach someone one thing', checked: true, beats: { start: 4.8 } },
          ],
          icon: 'lottieCheck',
          staggerDelay: 0.5,
          beats: { start: 1.0, exit: 14.0 },
        },
      },
      row2: [
        {
          midScene: 'heroText',
          stylePreset: 'mentor',
          config: {
            text: 'Yes, confusion is scheduled.',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 7.0, exit: 11.0 },
          },
        },
        {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: "It's called growth.", emphasis: 'high', beats: { start: 11.5, exit: 15.0, emphasis: 12.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
          },
        },
      ],
    },
  },
};

/**
 * SCENE 4: Social Norms & Communication
 * INTENTION: Teach the unwritten rules of Knodovian interaction
 * LEARNING: How to "speak Knodovian"
 * DURATION: 14 seconds
 */
const scene4_SocialNorms = {
  id: 'culture-social-norms',
  durationInFrames: 420,
  transition: { type: 'slide', direction: 'left' },
  config: {
    background: { preset: 'spotlight', spotlight: { x: 50, y: 45, intensity: 0.3 } },
    layout: {
      type: 'rowStack',
      options: { rows: 3, padding: 50, titleHeight: 80 },
    },
    slots: {
      header: {
        midScene: 'textReveal',
        stylePreset: 'focus',
        config: {
          lines: [
            { text: 'How to Speak Knodovian', emphasis: 'high', beats: { start: 0.3, exit: 12.0 } },
          ],
        },
      },
      row1: {
        midScene: 'gridCards',
        stylePreset: 'playful',
        config: {
          cards: [
            { icon: '📣', label: 'ASK LOUDLY', sublabel: 'Questions have decibels', beats: { start: 1.0, exit: 12.0 } },
            { icon: '🤫', label: 'Think quietly', sublabel: 'Ideas need silence', beats: { start: 1.6, exit: 12.0 } },
          ],
          columns: 2,
          animation: 'bounce',
        },
      },
      row2: {
        midScene: 'bubbleCallout',
        stylePreset: 'educational',
        config: {
          callouts: [
            { text: '"Wait, can you explain that differently?"', icon: '🙋', beats: { start: 3.0, exit: 7.0 } },
            { text: '"I understood nothing and I\'m okay with that."', icon: '😌', beats: { start: 5.0, exit: 9.0 } },
            { text: '"Let me draw you a confusing diagram."', icon: '📊', beats: { start: 7.0, exit: 11.0 } },
          ],
          jitter: { x: 10, y: 6 },
          beats: { start: 2.8, exit: 12.0 },
        },
      },
      row3: {
        midScene: 'textReveal',
        stylePreset: 'mentor',
        config: {
          lines: [
            { text: 'Common phrases in Knodovia ☝️', emphasis: 'normal', beats: { start: 2.5, exit: 12.0 } },
          ],
          revealType: 'fade',
        },
      },
    },
  },
};

/**
 * SCENE 5: Holidays & Celebrations
 * INTENTION: Show the fun side of Knodovian culture
 * LEARNING: Major events that bring Knodovians together
 * DURATION: 14 seconds
 */
const scene5_Holidays = {
  id: 'culture-holidays',
  durationInFrames: 420,
  transition: { type: 'doodle-wipe', direction: 'right' },
  config: {
    background: { preset: 'sunriseGradient', layerNoise: true },
    layout: {
      type: 'rowStack',
      options: { rows: 2, padding: 50, titleHeight: 90 },
    },
    slots: {
      header: {
        midScene: 'textReveal',
        stylePreset: 'playful',
        config: {
          lines: [
            { text: 'Knodovian Holidays 🎉', emphasis: 'high', beats: { start: 0.3, exit: 12.0, emphasis: 0.8 } },
          ],
        },
      },
      row1: {
        midScene: 'gridCards',
        stylePreset: 'educational',
        config: {
          cards: [
            {
              icon: '🔄',
              label: 'Sync Day',
              sublabel: 'Everyone shouts "ALIGNED!" at noon',
              animated: true,
              beats: { start: 1.2, exit: 12.0 },
            },
            {
              icon: '🔌',
              label: 'Unplug Hour',
              sublabel: 'Draw conclusions by hand (literally)',
              animated: true,
              beats: { start: 2.0, exit: 12.0 },
            },
            {
              icon: '📉',
              label: 'Productivity Week',
              sublabel: 'Do less, learn more. Metrics hate it.',
              animated: true,
              beats: { start: 2.8, exit: 12.0 },
            },
          ],
          columns: 3,
          animation: 'cascade',
        },
      },
      row2: [
        {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: 'Attendance optional.',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 5.0, exit: 9.0 },
          },
        },
        {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Stories mandatory.', emphasis: 'high', beats: { start: 9.5, exit: 13.0, emphasis: 10.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
          },
        },
      ],
    },
  },
};

/**
 * SCENE 6: Closing & Teaser
 * INTENTION: Summarize learnings, tease next video
 * DURATION: 12 seconds
 */
const scene6_Close = {
  id: 'culture-close',
  durationInFrames: 360,
  transition: { type: 'eraser' },
  config: {
    background: { preset: 'chalkboardGradient' },
    layout: { type: 'rowStack', options: { rows: 2, padding: 60, titleHeight: 0 } },
    slots: {
      row1: [
        {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Culture is what you tolerate.', emphasis: 'normal', beats: { start: 0.5, exit: 4.5 } },
              { text: "In Knodovia, we tolerate a lot.", emphasis: 'high', beats: { start: 2.0, exit: 6.0, emphasis: 2.5 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.6,
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
            beats: { entrance: 5.5, exit: 10.0 },
          },
        },
      ],
      row2: {
        midScene: 'textReveal',
        stylePreset: 'playful',
        config: {
          lines: [
            { text: 'NEXT: The Knodovian Economy 💰', emphasis: 'high', beats: { start: 8.0, exit: 11.0, emphasis: 8.5 } },
            { text: "(It's bonkers.)", emphasis: 'normal', beats: { start: 9.5, exit: 11.5 } },
          ],
          revealType: 'slide',
          direction: 'up',
          staggerDelay: 0.4,
        },
      },
    },
  },
};

// Assemble all scenes
const video2Scenes = [
  scene1_ColdOpen,
  scene2_CoreValues,
  scene3_DailyRituals,
  scene4_SocialNorms,
  scene5_Holidays,
  scene6_Close,
];

export const KNODOVIA_VIDEO2_DURATION = video2Scenes.reduce(
  (total, scene) => total + scene.durationInFrames,
  0,
);

export const KnodoviaCultureAnthro = () => {
  return (
    <AbsoluteFill>
      <Series>
        {video2Scenes.map((scene, index) => (
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

export default KnodoviaCultureAnthro;
