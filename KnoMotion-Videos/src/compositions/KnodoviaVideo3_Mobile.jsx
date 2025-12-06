/**
 * Knodovia Video 3: The Bonkers Economy (MOBILE VERSION)
 * 
 * Mobile-optimized version for TikTok/Reels/Shorts (1080x1920).
 * 
 * KEY MOBILE ADAPTATIONS:
 * - Uses 'full' and 'rowStack' layouts only
 * - 2 columns max for grids
 * - No side-by-side comparisons
 * - Simplified content per scene
 * 
 * NARRATIVE: Explains Knodovia's knowledge-based economy and the Scrib currency.
 */

import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SceneFromConfig, SceneTransitionWrapper } from './SceneRenderer';

const FPS = 30;
const TRANSITION_FRAMES = 24;

// Badge assets for economy visuals
const createBadge = (color) => {
  const svg = `
  <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="200" height="120" rx="20" fill="${color}" opacity="0.85"/>
    <circle cx="40" cy="60" r="30" fill="rgba(255,255,255,0.2)"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const BADGE_GOLD = createBadge('#FBBF24');
const BADGE_TEAL = createBadge('#2DD4BF');
const BADGE_PURPLE = createBadge('#A78BFA');

const mobileScenes = [
  /**
   * SCENE 1: Cold Open
   * Shock & intrigue about the economy
   */
  {
    id: 'mobile-econ-open',
    durationInFrames: 300,
    transition: { type: 'slide', direction: 'up' },
    config: {
      format: 'mobile',
      background: {
        preset: 'sunriseGradient',
        layerNoise: true,
        particles: { enabled: true, style: 'sparkle', count: 10, color: '#F59E0B', opacity: 0.2, speed: 0.5 },
      },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 120 } },
      slots: {
        header: {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: 'Economics 101',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 0.3, exit: 9.0 },
          },
        },
        row1: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Forget everything', emphasis: 'high', beats: { start: 1.0, exit: 4.0, emphasis: 1.5 } },
              { text: 'about money.', emphasis: 'normal', beats: { start: 2.5, exit: 5.0 } },
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
              { text: 'GDP = Gross Doodle Product', emphasis: 'high', beats: { start: 5.5, exit: 9.0, emphasis: 6.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
          },
        },
      },
    },
  },

  /**
   * SCENE 2: The Scrib Currency
   */
  {
    id: 'mobile-currency',
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
              { text: 'Currency: The Scrib 📝', emphasis: 'high', beats: { start: 0.3, exit: 10.0 } },
            ],
          },
        },
        row1: {
          midScene: 'gridCards',
          stylePreset: 'focus',
          config: {
            cards: [
              { icon: '✏️', label: 'A Scrib', sublabel: 'Captured knowledge', animated: true },
              { icon: '📓', label: 'Scrib Book', sublabel: 'Your knowledge wallet', animated: true },
            ],
            columns: 2,
            animation: 'bounce',
            beats: { start: 1.0, exit: 10.0 },
          },
        },
        row2: {
          midScene: 'heroText',
          stylePreset: 'mentor',
          config: {
            text: 'Use it or lose it.',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 6.0, exit: 11.0 },
          },
        },
      },
    },
  },

  /**
   * SCENE 3: How to Earn (Part 1)
   */
  {
    id: 'mobile-earning-1',
    durationInFrames: 360,
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
              { text: 'How to Get Rich 💰', emphasis: 'high', beats: { start: 0.3, exit: 10.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: {
          midScene: 'gridCards',
          stylePreset: 'educational',
          config: {
            cards: [
              { image: BADGE_GOLD, label: 'Teach Something', sublabel: '+3 Scribs', animated: true },
              { image: BADGE_TEAL, label: 'Complete a Knote', sublabel: '+5 Scribs', animated: true },
            ],
            columns: 2,
            animation: 'cascade',
            beats: { start: 1.0, exit: 10.0 },
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: 'Notice the pattern?', emphasis: 'normal', beats: { start: 6.0, exit: 10.0 } },
              { text: 'All involve learning!', emphasis: 'high', beats: { start: 7.5, exit: 11.0, emphasis: 8.0 } },
            ],
            revealType: 'fade',
            staggerDelay: 0.5,
          },
        },
      },
    },
  },

  /**
   * SCENE 4: How to Earn (Part 2)
   */
  {
    id: 'mobile-earning-2',
    durationInFrames: 360,
    transition: { type: 'slide', direction: 'left' },
    config: {
      format: 'mobile',
      background: { preset: 'sunriseGradient', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 40, titleHeight: 80 } },
      slots: {
        header: {
          midScene: 'gridCards',
          stylePreset: 'mentor',
          config: {
            cards: [
              { image: BADGE_PURPLE, label: 'Ask Great Questions', sublabel: '+2 Scribs', animated: true },
              { icon: '🤯', label: 'Make Someone Go "Wait What?"', sublabel: 'Variable payout!', animated: true },
            ],
            columns: 2,
            animation: 'cascade',
            beats: { start: 0.5, exit: 8.0 },
          },
        },
        row1: {
          midScene: 'heroText',
          stylePreset: 'playful',
          config: {
            text: 'Confusion pays well here.',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 4.0, exit: 9.0 },
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: 'Every Scrib = someone learned', emphasis: 'high', beats: { start: 8.0, exit: 11.0, emphasis: 8.5 } },
            ],
            revealType: 'slide',
            direction: 'up',
          },
        },
      },
    },
  },

  /**
   * SCENE 5: What to Buy
   */
  {
    id: 'mobile-spending',
    durationInFrames: 360,
    transition: { type: 'doodle-wipe', direction: 'right' },
    config: {
      format: 'mobile',
      background: { preset: 'cleanCard', layerNoise: true },
      layout: { type: 'rowStack', options: { rows: 2, padding: 40, titleHeight: 90 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: 'What Can You Buy? 🛒', emphasis: 'high', beats: { start: 0.3, exit: 10.0 } },
            ],
          },
        },
        row1: {
          midScene: 'checklist',
          stylePreset: 'educational',
          config: {
            items: [
              { text: '📚 Expert Knowledge — 5 Scribs', checked: true },
              { text: '🎓 Mentorship Hour — 12 Scribs', checked: true },
              { text: '🎁 Gift Learning to Friend — 15 Scribs', checked: false },
            ],
            staggerDelay: 0.5,
            beats: { start: 1.0, exit: 10.0 },
          },
        },
        row2: {
          midScene: 'heroText',
          stylePreset: 'mentor',
          config: {
            text: "Can't buy a car. CAN buy knowledge to build one.",
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 6.0, exit: 11.0 },
          },
        },
      },
    },
  },

  /**
   * SCENE 6: The Big Insight
   */
  {
    id: 'mobile-insight',
    durationInFrames: 360,
    transition: { type: 'page-turn', direction: 'left' },
    config: {
      format: 'mobile',
      background: { preset: 'spotlight', spotlight: { x: 50, y: 50, intensity: 0.3 } },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 80 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: 'The Secret 🤫', emphasis: 'high', beats: { start: 0.3, exit: 10.0, emphasis: 0.8 } },
            ],
          },
        },
        row1: [
          {
            midScene: 'textReveal',
            stylePreset: 'educational',
            config: {
              lines: [
                { text: 'Traditional: Give → Lose', emphasis: 'normal', beats: { start: 1.0, exit: 5.0 } },
              ],
              revealType: 'fade',
            },
          },
          {
            midScene: 'textReveal',
            stylePreset: 'playful',
            config: {
              lines: [
                { text: 'Knodovia: Share → BOTH get richer', emphasis: 'high', beats: { start: 4.5, exit: 9.0, emphasis: 5.0 } },
              ],
              revealType: 'fade',
            },
          },
        ],
        row2: {
          midScene: 'heroText',
          stylePreset: 'mentor',
          config: {
            text: "It's not zero-sum. It's infinite-sum.",
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 7.0, exit: 11.0 },
          },
        },
      },
    },
  },

  /**
   * SCENE 7: Close & CTA
   */
  {
    id: 'mobile-econ-close',
    durationInFrames: 300,
    transition: { type: 'eraser' },
    config: {
      format: 'mobile',
      background: { preset: 'sunriseGradient' },
      layout: { type: 'rowStack', options: { rows: 2, padding: 50, titleHeight: 0 } },
      slots: {
        row1: [
          {
            midScene: 'textReveal',
            stylePreset: 'focus',
            config: {
              lines: [
                { text: 'Does this make sense?', emphasis: 'normal', beats: { start: 0.5, exit: 3.0 } },
                { text: 'No.', emphasis: 'high', beats: { start: 1.5, exit: 4.0, emphasis: 2.0 } },
              ],
              revealType: 'fade',
              staggerDelay: 0.3,
            },
          },
          {
            midScene: 'textReveal',
            stylePreset: 'mentor',
            config: {
              lines: [
                { text: 'Does YOUR economy?', emphasis: 'normal', beats: { start: 3.5, exit: 6.5 } },
                { text: 'Also no.', emphasis: 'high', beats: { start: 5.0, exit: 7.5, emphasis: 5.5 } },
              ],
              revealType: 'fade',
              staggerDelay: 0.3,
            },
          },
        ],
        row2: {
          midScene: 'heroText',
          stylePreset: 'playful',
          config: {
            text: 'At least ours has doodles. 🎨',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 6.5, exit: 9.5 },
          },
        },
      },
    },
  },
];

export const KNODOVIA_VIDEO3_MOBILE_DURATION = mobileScenes.reduce(
  (total, scene) => total + scene.durationInFrames,
  0,
);

export const KnodoviaEconomicsMobile = () => {
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

export default KnodoviaEconomicsMobile;
