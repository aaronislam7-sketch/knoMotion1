/**
 * Knodovia Video 3: The Bonkers Economy
 * 
 * NARRATIVE ARC:
 * This video dives deep into Knodovia's unique economic system.
 * By the end, viewers should understand:
 * - The currency (Scribs) and how it works
 * - How Knodovians earn and spend
 * - The marketplace structure
 * - Why knowledge IS the economy
 * 
 * MASCOT: The 'error' lottie continues as our eccentric guide
 * 
 * KEY MESSAGE: In Knodovia, knowledge flow IS wealth flow.
 * The more you share, the richer everyone gets.
 */

import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SceneFromConfig, SceneTransitionWrapper } from './SceneRenderer';

const FPS = 30;
const TRANSITION_FRAMES = 18;

// Visual asset helpers for economic indicators
const createBadge = (color) => {
  const svg = `
  <svg width="600" height="340" viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="600" height="340" rx="48" fill="${color}" opacity="0.85"/>
    <circle cx="120" cy="170" r="90" fill="rgba(255,255,255,0.2)"/>
    <circle cx="480" cy="170" r="140" fill="rgba(255,255,255,0.15)"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const BADGE_GOLD = createBadge('#FBBF24');
const BADGE_TEAL = createBadge('#2DD4BF');
const BADGE_PURPLE = createBadge('#A78BFA');
const BADGE_BLUE = createBadge('#60A5FA');

/**
 * SCENE 1: Cold Open - "Forget Everything You Know About Money"
 * INTENTION: Shock & intrigue — Knodovia's economy is different
 * DURATION: 12 seconds
 */
const scene1_ColdOpen = {
  id: 'econ-cold-open',
  durationInFrames: 360,
  transition: { type: 'slide', direction: 'up' },
  config: {
    background: {
      preset: 'sunriseGradient',
      layerNoise: true,
      particles: { enabled: true, style: 'sparkle', count: 15, color: '#F59E0B', opacity: 0.25, speed: 0.5 },
    },
    layout: { type: 'rowStack', options: { rows: 2, padding: 60, titleHeight: 0 } },
    slots: {
      // Slot array: sequence mascot intro → provocative opener
      row1: [
        {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: 'Economics 101',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 0.3, exit: 5.0 },
          },
        },
        {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Forget everything you know', emphasis: 'high', beats: { start: 3.5, exit: 7.0, emphasis: 4.0 } },
              { text: 'about money.', emphasis: 'normal', beats: { start: 5.0, exit: 9.0 } },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.5,
            animationDuration: 1.0,
          },
        },
      ],
      row2: {
        midScene: 'textReveal',
        stylePreset: 'playful',
        config: {
          lines: [
            { text: 'GDP = Gross Doodle Product', emphasis: 'high', beats: { start: 7.5, exit: 11.0, emphasis: 8.0 } },
            { text: '(No really. That\'s the metric.)', emphasis: 'normal', beats: { start: 9.5, exit: 11.5 } },
          ],
          revealType: 'fade',
          staggerDelay: 0.5,
        },
      },
    },
  },
};

/**
 * SCENE 2: The Currency - "Introducing the Scrib"
 * INTENTION: Explain what currency means in Knodovia
 * LEARNING: Currency = captured knowledge, not gold
 * DURATION: 14 seconds
 */
const scene2_Currency = {
  id: 'econ-currency',
  durationInFrames: 420,
  transition: { type: 'doodle-wipe', direction: 'right', wobble: true },
  config: {
    background: { preset: 'cleanCard', layerNoise: true },
    layout: {
      type: 'rowStack',
      options: { rows: 3, padding: 50, titleHeight: 80 },
    },
    slots: {
      header: {
        midScene: 'textReveal',
        stylePreset: 'educational',
        config: {
          lines: [
            { text: 'Currency: The Scrib 📝', emphasis: 'high', beats: { start: 0.3, exit: 12.0, emphasis: 0.8 } },
          ],
        },
      },
      row1: {
        midScene: 'gridCards',
        stylePreset: 'focus',
        config: {
          cards: [
            { icon: '✏️', label: 'A Scrib', sublabel: 'A captured piece of knowledge', beats: { start: 1.2, exit: 12.0 } },
            { icon: '📓', label: 'Scrib Book', sublabel: 'Your personal knowledge wallet', beats: { start: 2.0, exit: 12.0 } },
          ],
          columns: 2,
          animation: 'bounce',
        },
      },
      row2: {
        midScene: 'bubbleCallout',
        stylePreset: 'playful',
        config: {
          callouts: [
            { text: 'More valuable if others can understand it', icon: '💡', beats: { start: 3.5, exit: 8.0 } },
            { text: 'Depreciates if you hoard it', icon: '📉', beats: { start: 5.5, exit: 10.0 } },
          ],
          jitter: { x: 8, y: 5 },
          beats: { start: 3.0, exit: 12.0 },
        },
      },
      // Mascot drops wisdom
      row3: [
        {
          midScene: 'heroText',
          stylePreset: 'mentor',
          config: {
            text: 'Use it or lose it.',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 8.5, exit: 13.0 },
          },
        },
      ],
    },
  },
};

/**
 * SCENE 3: How to Earn Scribs
 * INTENTION: Show the earning mechanics — all tied to knowledge sharing
 * LEARNING: Every economic action involves learning or teaching
 * DURATION: 16 seconds
 */
const scene3_Earning = {
  id: 'econ-earning',
  durationInFrames: 480,
  transition: { type: 'page-turn', direction: 'right' },
  config: {
    background: { preset: 'notebookSoft', layerNoise: true },
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
            { text: 'How to Get Rich in Knodovia', emphasis: 'high', beats: { start: 0.3, exit: 14.0, emphasis: 0.8 } },
          ],
        },
      },
      row1: {
        midScene: 'gridCards',
        stylePreset: 'educational',
        config: {
          cards: [
            {
              image: BADGE_GOLD,
              label: 'Teach Something',
              sublabel: '+3 Scribs per learner',
              animated: true,
              beats: { start: 1.2, exit: 14.0 },
            },
            {
              image: BADGE_TEAL,
              label: 'Complete a Knote',
              sublabel: '+5 Scribs (knowledge artifact)',
              animated: true,
              beats: { start: 2.0, exit: 14.0 },
            },
            {
              image: BADGE_PURPLE,
              label: 'Ask a Great Question',
              sublabel: '+2 Scribs (curiosity dividend)',
              animated: true,
              beats: { start: 2.8, exit: 14.0 },
            },
            {
              icon: '🤯',
              label: 'Make Someone Go "Wait What?"',
              sublabel: 'VARIABLE: Based on confusion quality',
              animated: true,
              beats: { start: 3.6, exit: 14.0 },
            },
          ],
          columns: 2,
          animation: 'cascade',
        },
      },
      row2: [
        {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: 'Notice the pattern?', emphasis: 'normal', beats: { start: 6.0, exit: 10.0 } },
            ],
            revealType: 'fade',
          },
        },
        {
          midScene: 'heroText',
          stylePreset: 'mentor',
          config: {
            text: 'Every Scrib involves someone learning.',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 9.5, exit: 15.0 },
          },
        },
      ],
    },
  },
};

/**
 * SCENE 4: How to Spend Scribs
 * INTENTION: Show what Scribs buy — more knowledge, not stuff
 * LEARNING: The economy is a knowledge circulation system
 * DURATION: 14 seconds
 */
const scene4_Spending = {
  id: 'econ-spending',
  durationInFrames: 420,
  transition: { type: 'slide', direction: 'left' },
  config: {
    background: { preset: 'spotlight', spotlight: { x: 50, y: 40, intensity: 0.25 } },
    layout: {
      type: 'rowStack',
      options: { rows: 2, padding: 50, titleHeight: 80 },
    },
    slots: {
      header: {
        midScene: 'textReveal',
        stylePreset: 'focus',
        config: {
          lines: [
            { text: 'What Can You Buy? 🛒', emphasis: 'high', beats: { start: 0.3, exit: 12.0 } },
          ],
        },
      },
      row1: {
        midScene: 'checklist',
        stylePreset: 'educational',
        config: {
          items: [
            { text: '📚 Access to Expert Knowledge — 5 Scribs', checked: true, beats: { start: 1.2 } },
            { text: '🎓 1-on-1 Mentorship Hour — 12 Scribs', checked: true, beats: { start: 2.0 } },
            { text: '🔮 Priority in the Idea Queue — 8 Scribs', checked: true, beats: { start: 2.8 } },
            { text: '🎁 Gift a Learning Path to a Friend — 15 Scribs', checked: false, beats: { start: 3.6 } },
          ],
          staggerDelay: 0.4,
          beats: { start: 1.0, exit: 12.0 },
        },
      },
      row2: [
        {
          midScene: 'bubbleCallout',
          stylePreset: 'playful',
          config: {
            callouts: [
              { text: 'You can\'t buy a car.', icon: '🚗', beats: { start: 5.0, exit: 8.5 } },
              { text: 'You CAN buy the knowledge to build one.', icon: '🔧', beats: { start: 7.0, exit: 11.0 } },
            ],
            beats: { start: 4.8, exit: 12.0 },
          },
        },
        {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Knowledge > Things', emphasis: 'high', beats: { start: 10.5, exit: 13.0, emphasis: 11.0 } },
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
 * SCENE 5: The Marketplace - "Where Knowledge Flows"
 * INTENTION: Introduce the physical/virtual spaces of exchange
 * LEARNING: Two main trading zones
 * DURATION: 14 seconds
 */
const scene5_Marketplace = {
  id: 'econ-marketplace',
  durationInFrames: 420,
  transition: { type: 'doodle-wipe', direction: 'right' },
  config: {
    background: { preset: 'cleanCard' },
    layout: {
      type: 'rowStack',
      options: { rows: 2, padding: 50, titleHeight: 80 },
    },
    slots: {
      header: {
        midScene: 'textReveal',
        stylePreset: 'educational',
        config: {
          lines: [
            { text: 'The Marketplaces 🏪', emphasis: 'high', beats: { start: 0.3, exit: 12.0 } },
          ],
        },
      },
      row1: {
        midScene: 'gridCards',
        stylePreset: 'focus',
        config: {
          cards: [
            {
              image: BADGE_BLUE,
              label: 'The Knowledge District',
              sublabel: 'Structured courses, certified paths',
              animated: true,
              beats: { start: 1.2, exit: 12.0 },
            },
            {
              image: BADGE_TEAL,
              label: 'The Idea Bazaar',
              sublabel: 'Wild concepts, experimental learning',
              animated: true,
              beats: { start: 2.2, exit: 12.0 },
            },
          ],
          columns: 2,
          animation: 'bounce',
        },
      },
      row2: [
        {
          midScene: 'heroText',
          stylePreset: 'playful',
          config: {
            text: 'Pick your chaos level.',
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
              { text: 'District = Predictable 📊', emphasis: 'normal', beats: { start: 9.5, exit: 12.0 } },
              { text: 'Bazaar = "Is this even legal?" 🤪', emphasis: 'high', beats: { start: 10.5, exit: 13.0 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.3,
          },
        },
      ],
    },
  },
};

/**
 * SCENE 6: The Big Insight - "Why This Works"
 * INTENTION: Connect the pieces — this isn't random, it's designed
 * LEARNING: Knowledge economics creates abundance, not scarcity
 * DURATION: 14 seconds
 */
const scene6_BigInsight = {
  id: 'econ-big-insight',
  durationInFrames: 420,
  transition: { type: 'page-turn', direction: 'left' },
  config: {
    background: { preset: 'spotlight', spotlight: { x: 50, y: 50, intensity: 0.35 } },
    layout: {
      type: 'rowStack',
      options: { rows: 2, padding: 60, titleHeight: 80 },
    },
    slots: {
      header: {
        midScene: 'textReveal',
        stylePreset: 'focus',
        config: {
          lines: [
            { text: 'The Secret 🤫', emphasis: 'high', beats: { start: 0.3, exit: 12.0, emphasis: 0.8 } },
          ],
        },
      },
      row1: [
        {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: 'Traditional Economy:', emphasis: 'normal', beats: { start: 1.0, exit: 5.0 } },
              { text: 'Give something → Lose something', emphasis: 'high', beats: { start: 2.0, exit: 5.5 } },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.4,
          },
        },
        {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'Knodovian Economy:', emphasis: 'normal', beats: { start: 5.0, exit: 10.0 } },
              { text: 'Share knowledge → BOTH get richer', emphasis: 'high', beats: { start: 6.0, exit: 10.5, emphasis: 6.5 } },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.4,
          },
        },
      ],
      row2: {
        midScene: 'heroText',
        stylePreset: 'mentor',
        config: {
          text: 'It\'s not zero-sum. It\'s infinite-sum.',
          heroType: 'lottie',
          heroRef: 'error',
          beats: { entrance: 8.5, exit: 13.0 },
        },
      },
    },
  },
};

/**
 * SCENE 7: Closing & CTA
 * INTENTION: Summarize, make viewer feel part of it, tease next video
 * DURATION: 12 seconds
 */
const scene7_Close = {
  id: 'econ-close',
  durationInFrames: 360,
  transition: { type: 'eraser' },
  config: {
    background: { preset: 'sunriseGradient' },
    layout: { type: 'rowStack', options: { rows: 2, padding: 60, titleHeight: 0 } },
    slots: {
      row1: [
        {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: 'Does this make sense?', emphasis: 'normal', beats: { start: 0.5, exit: 3.5 } },
              { text: 'No.', emphasis: 'high', beats: { start: 2.0, exit: 5.0, emphasis: 2.5 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.5,
          },
        },
        {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Does your economy make sense?', emphasis: 'normal', beats: { start: 4.5, exit: 8.0 } },
              { text: 'Also no.', emphasis: 'high', beats: { start: 6.0, exit: 9.0, emphasis: 6.5 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.5,
          },
        },
      ],
      row2: [
        {
          midScene: 'heroText',
          stylePreset: 'playful',
          config: {
            text: 'At least ours has doodles.',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 7.5, exit: 11.0 },
          },
        },
        {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: 'NEXT: Your Learner Profile 🧬', emphasis: 'high', beats: { start: 9.5, exit: 11.5, emphasis: 10.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
          },
        },
      ],
    },
  },
};

// Assemble all scenes
const video3Scenes = [
  scene1_ColdOpen,
  scene2_Currency,
  scene3_Earning,
  scene4_Spending,
  scene5_Marketplace,
  scene6_BigInsight,
  scene7_Close,
];

export const KNODOVIA_VIDEO3_DURATION = video3Scenes.reduce(
  (total, scene) => total + scene.durationInFrames,
  0,
);

export const KnodoviaEconomics = () => {
  return (
    <AbsoluteFill>
      <Series>
        {video3Scenes.map((scene, index) => (
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

export default KnodoviaEconomics;
