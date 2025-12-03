import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SceneFromConfig, SceneTransitionWrapper } from './SceneRenderer';

const TRANSITION_FRAMES = 18;

const createBadge = (color) => {
  const svg = `
  <svg width="600" height="340" viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="600" height="340" rx="48" fill="${color}" opacity="0.85"/>
    <circle cx="120" cy="170" r="90" fill="rgba(255,255,255,0.2)"/>
    <circle cx="480" cy="170" r="140" fill="rgba(255,255,255,0.15)"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const BADGE_AMBER = createBadge('#FBBF24');
const BADGE_TEAL = createBadge('#2DD4BF');
const BADGE_LILAC = createBadge('#C4B5FD');
const BADGE_NAVY = createBadge('#93C5FD');

const video3Scenes = [
  {
    id: 'economics-cold-open',
    durationInFrames: 360,
    transition: { type: 'slide', direction: 'up', animationPreset: 'bouncy' },
    config: {
      background: {
        preset: 'sunriseGradient',
        layerNoise: true,
        particles: {
          enabled: true,
          style: 'dots',
          count: 18,
          color: '#F59E0B',
          opacity: 0.2,
          speed: 0.6,
        },
      },
      layout: { type: 'full', options: { padding: 80, titleHeight: 0 } },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: 'GDP: Gross Doodle Product', emphasis: 'high', beats: { start: 0.5, hold: 2.0, exit: 3.0 } },
              { text: 'Fluctuates wildly.', emphasis: 'normal', beats: { start: 1.2, hold: 3.0, exit: 4.0 } },
              { text: 'Inflation depends on notebook size.', emphasis: 'high', beats: { start: 2.0, hold: 3.5, exit: 4.5 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.4,
          },
        },
      },
    },
  },
  {
    id: 'economics-currency',
    durationInFrames: 660,
    transition: { type: 'doodle-wipe', direction: 'right' },
    config: {
      background: { preset: 'cleanCard', layerNoise: true },
      layout: {
        type: 'columnSplit',
        options: { columns: 1, padding: 60, titleHeight: 80 },
      },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [{ text: 'Currency: The Scrib', emphasis: 'high', beats: { start: 0.4, hold: 2.0, exit: 3.0 } }],
          },
        },
        col1: {
          midScene: 'sideBySide',
          stylePreset: 'focus',
          config: {
            animation: 'slide',
            dividerType: 'vs',
            left: {
              title: 'Left Scrib',
              icon: '📝',
              items: [
                'A literal scribble determines value.',
                'Chaotic stroke = premium tier.',
              ],
              color: 'secondary',
            },
            right: {
              title: 'Meaningless Graph',
              icon: '📈',
              items: [
                'Line wiggles nicely.',
                'No one knows what it measures.',
              ],
              color: 'accentBlue',
            },
            beats: { start: 0.8, hold: 3.5, exit: 4.8 },
          },
        },
      },
    },
  },
  {
    id: 'economics-earnings',
    durationInFrames: 720,
    transition: { type: 'slide', direction: 'left' },
    config: {
      background: { preset: 'notebookSoft', layerNoise: true },
      layout: {
        type: 'rowStack',
        options: { rows: 2, padding: 60, titleHeight: 80 },
      },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [{ text: 'How to earn Scribs:', emphasis: 'high', beats: { start: 0.4, hold: 2.0, exit: 3.0 } }],
          },
        },
        row1: {
          midScene: 'gridCards',
          stylePreset: 'educational',
          config: {
            cards: [
              { image: BADGE_AMBER, label: 'Teach someone something', sublabel: '+3 scribs' },
              { image: BADGE_TEAL, label: 'Complete a Knote', sublabel: '+5 scribs' },
            ],
            columns: 2,
            animation: 'cascade',
            beats: { start: 0.9, hold: 3.6, exit: 4.4 },
          },
        },
        row2: {
          midScene: 'gridCards',
          stylePreset: 'mentor',
          config: {
            cards: [
              { image: BADGE_LILAC, label: 'Ask a great question', sublabel: '+2 scribs' },
              { icon: '🤯', label: 'Make someone say “wait what?”', sublabel: 'Variable payout', animated: true },
            ],
            columns: 2,
            animation: 'scale',
            beats: { start: 1.4, hold: 3.8, exit: 4.6 },
          },
        },
      },
    },
  },
  {
    id: 'economics-marketplaces',
    durationInFrames: 720,
    transition: { type: 'page-turn', direction: 'right' },
    config: {
      background: { preset: 'cleanCard' },
      layout: { type: 'columnSplit', options: { columns: 1, padding: 60, titleHeight: 80 } },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [{ text: 'Marketplaces', emphasis: 'normal', beats: { start: 0.4, hold: 2.0, exit: 3.0 } }],
          },
        },
        col1: {
          midScene: 'sideBySide',
          stylePreset: 'focus',
          config: {
            mode: 'beforeAfter',
            before: {
              title: 'Knowledge District',
              media: {
                image: { src: BADGE_NAVY, fit: 'cover', borderRadius: 32 },
              },
            },
            after: {
              title: 'Idea Bazaar',
              media: {
                image: { src: BADGE_TEAL, fit: 'cover', borderRadius: 32 },
              },
            },
            slider: {
              autoAnimate: true,
              from: 0.25,
              to: 0.75,
              beats: { start: 0.8, hold: 4.0, exit: 5.0 },
            },
            beats: { start: 0.6, hold: 4.2, exit: 5.2 },
          },
        },
      },
    },
  },
  {
    id: 'economics-outro',
    durationInFrames: 420,
    transition: { type: 'eraser' },
    config: {
      background: { preset: 'sunriseGradient' },
      layout: { type: 'full', options: { padding: 80, titleHeight: 0 } },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Does this make sense? No.', emphasis: 'high', beats: { start: 0.5, hold: 2.0, exit: 3.0 } },
              { text: 'Does your economy?', emphasis: 'high', beats: { start: 1.5, hold: 3.0, exit: 4.0 } },
              { text: 'Next: plug in your learner profile.', emphasis: 'normal', beats: { start: 2.2, hold: 3.2, exit: 4.4 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.4,
          },
        },
      },
    },
  },
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
