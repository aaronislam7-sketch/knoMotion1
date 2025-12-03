import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SceneFromConfig, SceneTransitionWrapper } from './SceneRenderer';

const FPS = 30;
const TRANSITION_FRAMES = 18;

const createBlob = (fillA, fillB) => {
  const svg = `
  <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${fillA}" />
        <stop offset="100%" stop-color="${fillB}" />
      </linearGradient>
    </defs>
    <path d="M517,327Q485,454,363,512Q241,570,139,489Q37,408,84,295Q131,182,230,110Q329,38,421,112Q513,186,517,327Z" fill="url(#grad)" opacity="0.9"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const BLOB_SUNRISE = createBlob('#FEE2E2', '#FBBF24');
const BLOB_MINT = createBlob('#BBF7D0', '#3B82F6');
const BLOB_PLUM = createBlob('#FBCFE8', '#A855F7');

const video1Scenes = [
  {
    id: 'knodovia-cold-open',
    durationInFrames: 360,
    transition: { type: 'doodle-wipe', direction: 'right' },
    config: {
      background: { preset: 'sunriseGradient', layerNoise: true },
      layout: { type: 'full', options: { padding: 80, titleHeight: 0 } },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              {
                text: "You weren't meant to see this.",
                emphasis: 'high',
                beats: { start: 0.4, hold: 2.5, exit: 3.4, emphasis: 1.0 },
              },
              {
                text: "Welcome to Knodovia — the tab you clicked by mistake.",
                emphasis: 'normal',
                beats: { start: 1.4, hold: 3.4, exit: 4.2, emphasis: 1.9 },
              },
              {
                text: "Please don't touch anything. Seriously.",
                emphasis: 'high',
                beats: { start: 2.6, hold: 4.5, exit: 5.6, emphasis: 3.2 },
              },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.4,
            animationDuration: 0.8,
            lineSpacing: 'relaxed',
          },
        },
      },
    },
  },
  {
    id: 'knodovia-comparison',
    durationInFrames: 600,
    transition: { type: 'slide', direction: 'up' },
    config: {
      background: { preset: 'cleanCard', layerNoise: true },
      layout: {
        type: 'columnSplit',
        options: { columns: 1, padding: 60, titleHeight: 100 },
      },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              {
                text: 'Normal tab vs. Knodovia',
                emphasis: 'high',
                beats: { start: 0.4, hold: 2.0, exit: 3.8, emphasis: 1.2 },
              },
            ],
          },
        },
        col1: {
          midScene: 'sideBySide',
          stylePreset: 'playful',
          config: {
            mode: 'beforeAfter',
            before: {
              title: 'Your Tuesday Tab',
              media: {
                image: {
                  src: BLOB_SUNRISE,
                  fit: 'cover',
                  borderRadius: 28,
                },
              },
            },
            after: {
              title: 'Knodovia Window',
              media: {
                image: {
                  src: BLOB_PLUM,
                  fit: 'cover',
                  borderRadius: 28,
                },
              },
            },
            slider: {
              autoAnimate: true,
              from: 0.2,
              to: 0.82,
              beats: { start: 0.8, hold: 4.5, exit: 5.5 },
            },
            beats: { start: 0.6, hold: 4.8, exit: 5.6 },
          },
        },
      },
    },
  },
  {
    id: 'knodovia-definition-grid',
    durationInFrames: 780,
    transition: { type: 'page-turn', direction: 'right' },
    config: {
      background: { preset: 'notebookSoft', layerNoise: true },
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
              {
                text: 'So what is Knodovia anyway?',
                emphasis: 'high',
                beats: { start: 0.4, hold: 2.0, exit: 3.0, emphasis: 1.1 },
              },
            ],
          },
        },
        row1: {
          midScene: 'bubbleCallout',
          stylePreset: 'playful',
          config: {
            pattern: 'scattered',
            overlap: true,
            animation: 'float',
            callouts: [
              { text: "Guide: \"You're really not cleared.\"", icon: '🚫' },
              { text: 'Lever: *gets louder*', icon: '🤖' },
              { text: '"Fine. Quick tour then."', icon: '🗺️' },
            ],
            beats: { start: 0.9, hold: 3.4, exit: 4.0 },
          },
        },
        row2: {
          midScene: 'gridCards',
          stylePreset: 'focus',
          config: {
            cards: [
              {
                icon: '🧠',
                label: 'Idea District',
                sublabel: 'Visual metaphors queue here',
                beats: { start: 1.2, hold: 3.8, exit: 4.8 },
              },
              {
                icon: '📚',
                label: 'Reference Clouds',
                sublabel: 'Pulls context in real time',
                beats: { start: 1.4, hold: 4.0, exit: 4.9 },
              },
              {
                image: BLOB_MINT,
                label: 'Learning Rails',
                sublabel: 'Layout engine + beats',
                beats: { start: 1.6, hold: 4.2, exit: 5.0 },
              },
              {
                icon: '🪄',
                label: 'Mid-Scene Lab',
                sublabel: 'Animations ready for JSON',
                beats: { start: 1.8, hold: 4.4, exit: 5.1 },
              },
            ],
            columns: 2,
            animation: 'cascade',
            showLabels: true,
            labelPosition: 'bottom',
            beats: { start: 1.0, hold: 4.5, exit: 5.3 },
          },
        },
        row3: {
          midScene: 'gridCards',
          stylePreset: 'playful',
          config: {
            cards: [
              {
                icon: '🎛️',
                label: 'Style Presets',
                sublabel: 'Educational, playful, mentor',
              },
              {
                icon: '🎯',
                label: 'Beats',
                sublabel: 'start / hold / exit per line',
              },
              {
                icon: '✨',
                label: 'Animated Emoji',
                sublabel: 'No more static icons',
              },
            ],
            columns: 3,
            animation: 'scale',
            beats: { start: 2.4, hold: 4.5, exit: 5.4 },
          },
        },
      },
    },
  },
  {
    id: 'knodovia-tour',
    durationInFrames: 600,
    transition: { type: 'slide', direction: 'left' },
    config: {
      background: { preset: 'spotlight', spotlight: { x: 35, y: 45, intensity: 0.3 } },
      layout: {
        type: 'columnSplit',
        options: { columns: 2, ratios: [0.55, 0.45], padding: 60, titleHeight: 80 },
      },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              {
                text: 'Fine. Quick tour before culture class.',
                emphasis: 'normal',
                beats: { start: 0.4, hold: 2.2, exit: 3.5 },
              },
            ],
          },
        },
        col1: {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: 'Watch the beats choreograph every visual.',
            heroType: 'lottie',
            heroRef: 'education/lightbulb',
            beats: { entrance: 0.6, exit: 5.0 },
          },
        },
        col2: {
          midScene: 'checklist',
          stylePreset: 'educational',
          config: {
            items: [
              { text: 'Layouts resolve via JSON', checked: true },
              { text: 'Mid-scenes drop into slots', checked: true },
              { text: 'LLM-friendly config', checked: true },
              { text: 'Tone + humour controlled by presets', checked: false },
            ],
            icon: 'lottieCheck',
            beats: { start: 1.0, hold: 4.2, exit: 5.2 },
          },
        },
      },
    },
  },
  {
    id: 'knodovia-cta',
    durationInFrames: 450,
    transition: { type: 'eraser' },
    config: {
      background: { preset: 'sunriseGradient' },
      layout: { type: 'full', options: { padding: 70, titleHeight: 0 } },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              {
                text: 'Next up: The culture of Knodovia.',
                emphasis: 'high',
                beats: { start: 0.5, hold: 2.0, exit: 3.2, emphasis: 1.1 },
              },
              {
                text: 'Bring questions. Ask loudly. Think quietly.',
                emphasis: 'normal',
                beats: { start: 1.6, hold: 3.0, exit: 4.0, emphasis: 2.0 },
              },
              {
                text: 'And seriously—stop touching the lever.',
                emphasis: 'high',
                beats: { start: 2.4, hold: 4.0, exit: 5.0, emphasis: 3.0 },
              },
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

export const KNODOVIA_VIDEO1_DURATION = video1Scenes.reduce(
  (total, scene) => total + scene.durationInFrames,
  0,
);

export const KnodoviaAccidentalArrival = () => {
  return (
    <AbsoluteFill>
      <Series>
        {video1Scenes.map((scene, index) => (
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

export default KnodoviaAccidentalArrival;
