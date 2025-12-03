import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SceneFromConfig, SceneTransitionWrapper } from './SceneRenderer';

const TRANSITION_FRAMES = 18;

const createBlob = (fillA, fillB) => {
  const svg = `
  <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="grad" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="${fillA}" />
        <stop offset="100%" stop-color="${fillB}" />
      </radialGradient>
    </defs>
    <circle cx="300" cy="300" r="280" fill="url(#grad)" opacity="0.85"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const BLOB_GOLD = createBlob('#FDE68A', '#F59E0B');
const BLOB_VIOLET = createBlob('#DDD6FE', '#7C3AED');
const BLOB_NAVY = createBlob('#BFDBFE', '#2563EB');

const video2Scenes = [
  {
    id: 'culture-cold-open',
    durationInFrames: 360,
    transition: { type: 'slide', direction: 'down', animationPreset: 'educational' },
    config: {
      background: {
        preset: 'chalkboardGradient',
        layerNoise: true,
        particles: {
          enabled: true,
          style: 'chalk',
          count: 12,
          color: '#E8E4E0', // Soft neutral chalk color
          opacity: 0.15,
          speed: 0.5,
        },
      },
      layout: { type: 'full', options: { padding: 80, titleHeight: 0 } },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              {
                text: 'Knodovia has culture.',
                emphasis: 'normal',
                beats: { start: 0.4, hold: 2.0, exit: 3.0 },
              },
              {
                text: 'Questionable culture, but culture.',
                emphasis: 'high',
                beats: { start: 1.2, hold: 3.2, exit: 4.2, emphasis: 1.8 },
              },
            ],
            revealType: 'fade',
            lineSpacing: 'normal',
          },
        },
      },
    },
  },
  {
    id: 'culture-daily-rituals',
    durationInFrames: 660,
    transition: { type: 'doodle-wipe', direction: 'right' },
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
            lines: [
              {
                text: 'Daily rituals (do not skip)',
                emphasis: 'high',
                beats: { start: 0.4, hold: 2.2, exit: 3.0 },
              },
            ],
          },
        },
        row1: {
          midScene: 'checklist',
          stylePreset: 'educational',
          config: {
            items: [
              { text: 'Morning doodle meditation', icon: '🌀', checked: true },
              { text: 'The Great Idea Swap', icon: '💡', checked: true, animated: true },
              { text: '3pm Confusion Break', icon: '😵‍💫', checked: false },
            ],
            staggerDelay: 0.4,
            beats: { start: 0.8, hold: 3.8, exit: 4.6 },
          },
        },
        row2: {
          midScene: 'gridCards',
          stylePreset: 'focus',
          config: {
            cards: [
              { icon: '📣', label: 'Ask loudly', sublabel: 'Questions have decibels' },
              { icon: '🤫', label: 'Think quietly', sublabel: 'Echoes disturb the timeline' },
              { icon: '🌀', label: 'Pretend charts make sense', sublabel: 'They rarely do' },
            ],
            columns: 3,
            animation: 'cascade',
            beats: { start: 1.6, hold: 4.2, exit: 5.1 },
          },
        },
      },
    },
  },
  {
    id: 'culture-social-norms',
    durationInFrames: 660,
    transition: { type: 'page-turn', direction: 'left' },
    config: {
      background: { preset: 'spotlight', spotlight: { x: 60, y: 35, intensity: 0.25 } },
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
              { text: 'Social Norms (yes, plural)', emphasis: 'normal', beats: { start: 0.4, hold: 2.5, exit: 3.4 } },
            ],
          },
        },
        row1: {
          midScene: 'bubbleCallout',
          stylePreset: 'playful',
          config: {
            collisionDetection: true,
            jitter: { x: 12, y: 8 },
            callouts: [
              { text: '“Ask questions loudly!”', icon: '📢' },
              { text: '“Think quietly.”', icon: '🤐' },
              { text: '“Pretend you understand the diagram.”', icon: '📈' },
            ],
            beats: { start: 0.9, hold: 4.0, exit: 4.8 },
          },
        },
        row2: {
          midScene: 'gridCards',
          stylePreset: 'mentor',
          config: {
            cards: [
              { image: BLOB_GOLD, label: 'Annual Sync Day', sublabel: 'Everyone nods in unison' },
              { image: BLOB_VIOLET, label: 'Unplug Hour', sublabel: 'Analog doodles only' },
              { image: BLOB_NAVY, label: 'Week of Mild Productivity', sublabel: 'Metrics drop, morale soars' },
            ],
            columns: 3,
            animation: 'scale',
            beats: { start: 1.4, hold: 4.2, exit: 5.2 },
          },
        },
      },
    },
  },
  {
    id: 'culture-holidays',
    durationInFrames: 600,
    transition: { type: 'slide', direction: 'right' },
    config: {
      background: { preset: 'cleanCard' },
      layout: {
        type: 'headerRowColumns',
        options: { columns: 2, rowHeightRatio: 0.3, padding: 50, titleHeight: 80 },
      },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [{ text: 'Holidays (attendance optional, stories mandatory)', emphasis: 'high', beats: { start: 0.4, hold: 2.0, exit: 3.0 } }],
          },
        },
        row: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'Annual Sync Day • Unplug Hour • Mild Productivity Week', emphasis: 'normal', beats: { start: 0.8, hold: 3.0, exit: 4.0 } },
            ],
            revealType: 'typewriter',
          },
        },
        col1: {
          midScene: 'gridCards',
          stylePreset: 'mentor',
          config: {
            cards: [
              { icon: '📆', label: 'Annual Sync Day', sublabel: 'Entire city exclaims “aligned!”' },
              { icon: '🔌', label: 'Unplug Hour', sublabel: 'Draw conclusions by hand' },
            ],
            columns: 1,
            animation: 'cascade',
            beats: { start: 1.2, hold: 3.6, exit: 4.6 },
          },
        },
        col2: {
          midScene: 'checklist',
          stylePreset: 'focus',
          config: {
            items: [
              { text: 'Mild Productivity Week', checked: true },
              { text: 'Bring your own doodles', checked: false },
              { text: 'Complimentary animated confetti', checked: true },
            ],
            beats: { start: 1.4, hold: 3.8, exit: 4.8 },
          },
        },
      },
    },
  },
  {
    id: 'culture-close',
    durationInFrames: 420,
    transition: { type: 'eraser' },
    config: {
      background: { preset: 'chalkboardGradient' },
      layout: { type: 'full', options: { padding: 80, titleHeight: 0 } },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              { text: 'Culture is what you tolerate.', emphasis: 'normal', beats: { start: 0.5, hold: 2.0, exit: 3.0 } },
              { text: "You'll fit right in.", emphasis: 'high', beats: { start: 1.5, hold: 3.2, exit: 4.0, emphasis: 2.2 } },
              { text: 'Next episode: Knodovian Economics.', emphasis: 'normal', beats: { start: 2.2, hold: 3.5, exit: 4.5 } },
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
