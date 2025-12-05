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
    transition: { type: 'doodle-wipe', direction: 'right', wobble: true },
    config: {
      background: {
        preset: 'sunriseGradient',
        layerNoise: true,
        particles: {
          enabled: true,
          style: 'sparkle',
          count: 15,
          color: '#FBBF24',
          opacity: 0.25,
          speed: 0.8,
        },
      },
      layout: {
        type: 'rowStack',
        options: { rows: 2, padding: 50, titleHeight: 80 },
      },
      slots: {
               row1: [
    { 
      midScene: 'textReveal', 
      stylePreset: 'playful',
      config: { 
        lines: [{ text: "First message" }],
        beats: { start: 0.5, exit: 3.0 } 
      } 
    },
    { 
      midScene: 'textReveal', 
      stylePreset: 'playful',
      config: { 
        lines:  [{text: "Then this appears!"}],
        beats: { start: 4.0, exit: 6.0 } 
      } 
    },
    {
    midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: "——",
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 6.0, exit: 10.0 },
          },
        }
    
  ],
        
        row2: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              {
                text: "Erm.. Hello.. Whos there?",
                emphasis: 'normal',
                beats: { start: 1.5, exit: 4.0, emphasis: 2.0 },
              },
              {
                text: "Well.. welcome to Knodovia.. I'll show you around",
                emphasis: 'normal',
                beats: { start: 4.0, exit: 6.5, emphasis: 5.0 },
              },
              {
                text: "Please don't touch anything. Seriously.",
                emphasis: 'high',
                beats: { start: 6.5, exit: 10.0, emphasis: 8.0 },
              },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.4,
            animationDuration: 1.5,
            lineSpacing: 'relaxed',
          },
        },
      },
    },
  },
  
  {
    id: 'knodovia-comparison',
    durationInFrames: 300,
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
          stylePreset: 'playful',
          config: {
            lines: [
              {
                text: 'Earth v.s. Knodovia',
                emphasis: 'low',
                beats: { start: 0.4, emphasis: 1.2, exit: 10.0 },
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
              title: 'Our world',
              media: {
                image: {
                  src: 'https://thumbs.dreamstime.com/b/world-knowledge-10286246.jpg',
                  fit: 'cover',
                  borderRadius: 28,
                },
              },
            },
            after: {
              title: 'Your world',
              media: {
                image: {
                  src: 'https://cdn.vectorstock.com/i/1000v/18/25/doodle-earth-globe-hand-drawn-vector-50411825.jpg',
                  fit: 'cover',
                  borderRadius: 28,
                },
              },
            },
            slider: {
              autoAnimate: true,
              from: 0.05,//%ofimageframe
              to: 1.0,
              beats: { start: 1.5, exit: 7.0},
            },
            beats: { start: 0.5, hold: 4.8, exit: 10.0 },
          },
        },
      },
    },
  },
  {
    id: 'knodovia-definition-grid',
    durationInFrames: 390,
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
                beats: { start: 0.4, emphasis: 1.1, exit: 10.0 },
              },
            ],
          },
        },
        row1: {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: " ",
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 0.6, exit: 10.0 },
          },
        },
        row2: {
          midScene: 'gridCards',
          stylePreset: 'playful',
          config: {
            cards: [
              {
                icon: '💡',
                label: 'Idea District',
               
                animated: true, // Showcase animated emoji!
                beats: { start: 1.2, exit: 10.0},
              },
              {
                icon: '🔥',
                label: 'Reference Clouds',
              
                animated: true, // Showcase animated emoji!
                beats: { start: 2.0, hold: 4.0, exit: 10.0 },
              },
              {
                icon: '🤖',
                label: 'Learning Rails',
            
                animated: true,
                beats: { start: 2.8, hold: 4.2, exit: 10.0 },
              },
              {
                icon: '🪄',
                label: 'Mid-Scene Lab',
            
                animated: true,
                beats: { start: 3.6, hold: 4.4, exit: 10.0 },
              },
            ],
            columns: 2,
            animation: 'cascade',
            showLabels: true,
            labelPosition: 'bottom',
            beats: { start: 1.0, },
          },
        },
        row3: {
          midScene: 'gridCards',
          stylePreset: 'focus',
          config: {
            cards: [
              {
                icon: '💅',
                label: 'Style Presets',
                sublabel: 'Educational, playful, mentor',
                animated: true,
                beats: { start: 4.0, exit: 10.0 }
              },
              {
                icon: '🥁',
                label: 'Beats',
                sublabel: 'start / hold / exit per line',
                animated: true,
                 beats: { start: 4.5, exit: 10.0 }
              },
              {
                icon: '✨',
                label: 'Animated Emoji',
                sublabel: 'No more static icons',
                animated: true, // Showcase animated emoji!
                 beats: { start: 5.0, exit: 10.0 }
              },
            ],
            columns: 3,
            animation: 'bounce',
            beats: { start: 3.6, exit: 10.0 },
          },
        },
      },
    },
  },
  {
    id: 'knodovia-tour',
    durationInFrames: 300,
    transition: { type: 'slide', direction: 'left' },
    config: {
      background: { preset: 'playful', spotlight: { x: 35, y: 45, intensity: 0.3 } },
      layout: {
        type: 'columnSplit',
        options: { columns: 2, ratios: [0.65, 0.35], padding: 60, titleHeight: 80 },
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
          stylePreset: 'mentor',
          config: {
            text: 'Watch the beats choreograph every visual.',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 0.6, exit: 5.0 },
          },
        },
        col2: {
          midScene: 'checklist',
          stylePreset: 'playful',
          config: {
            items: [
              { text: 'Layouts resolve via JSON', checked: true, beats:{start: 1.0} },
              { text: 'Mid-scenes drop into slots', checked: true, beats:{start: 2.0} },
              { text: 'Small man', checked: false, beats:{start: 3.0} },
              { text: 'Tone + humour controlled by presets', checked: false, beats:{start: 4.0} },
            ],
            icon: 'lottieCheck',
            beats: { start: 1.0,  exit: 7.0},
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
