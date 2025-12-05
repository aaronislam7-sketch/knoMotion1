/**
 * Knodovia Video 1: Accidental Arrival (MOBILE VERSION)
 * 
 * Mobile-optimized version of the Accidental Arrival video.
 * Demonstrates format-aware rendering for TikTok/Reels/Shorts (1080x1920).
 * 
 * KEY MOBILE ADAPTATIONS:
 * - Uses 'full' and 'rowStack' layouts only (no columnSplit)
 * - Limits grid to 2 columns max
 * - Uses larger relative text for readability
 * - Avoids side-by-side comparisons
 * - Simplified scenes for vertical viewing
 */

import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SceneFromConfig, SceneTransitionWrapper } from './SceneRenderer';

const FPS = 30;
const TRANSITION_FRAMES = 18;

/**
 * Mobile-optimized scene configurations
 * 
 * Note: The layout engine automatically adjusts for mobile viewport,
 * but we also explicitly design scenes for vertical format here.
 */
const mobileScenes = [
  // Scene 1: Cold open - simplified for mobile
  {
    id: 'mobile-cold-open',
    durationInFrames: 300,
    transition: { type: 'doodle-wipe', direction: 'right', wobble: true },
    config: {
      format: 'mobile', // Explicit format hint
      background: {
        preset: 'sunriseGradient',
        layerNoise: true,
        particles: {
          enabled: true,
          style: 'sparkle',
          count: 10, // Fewer particles for mobile
          color: '#FBBF24',
          opacity: 0.2,
          speed: 0.6,
        },
      },
      layout: {
        type: 'rowStack', // Vertical stack works great on mobile
        options: { rows: 2, padding: 40, titleHeight: 100 },
      },
      slots: {
        header: {
          midScene: 'heroText',
          stylePreset: 'playful',
          config: {
            text: '🌍',
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
              {
                text: 'Erm.. Hello?',
                emphasis: 'high',
                beats: { start: 1.0, exit: 4.0, emphasis: 1.5 },
              },
              {
                text: "Who's there?",
                emphasis: 'normal',
                beats: { start: 2.0, exit: 5.0 },
              },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.5,
            animationDuration: 1.2,
            lineSpacing: 'relaxed',
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              {
                text: 'Welcome to Knodovia.',
                emphasis: 'normal',
                beats: { start: 4.5, exit: 8.0 },
              },
              {
                text: "Don't touch anything.",
                emphasis: 'high',
                beats: { start: 6.0, exit: 9.0, emphasis: 7.0 },
              },
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

  // Scene 2: What is Knodovia - grid simplified to 2 columns
  {
    id: 'mobile-definition',
    durationInFrames: 360,
    transition: { type: 'page-turn', direction: 'right' },
    config: {
      format: 'mobile',
      background: { preset: 'notebookSoft', layerNoise: true },
      layout: {
        type: 'rowStack',
        options: { rows: 3, padding: 40, titleHeight: 90 },
      },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              {
                text: 'What is Knodovia?',
                emphasis: 'high',
                beats: { start: 0.3, emphasis: 0.8, exit: 10.0 },
              },
            ],
          },
        },
        row1: {
          midScene: 'gridCards',
          stylePreset: 'playful',
          config: {
            cards: [
              {
                icon: '💡',
                label: 'Idea District',
                animated: true,
                beats: { start: 1.0, exit: 10.0 },
              },
              {
                icon: '🔥',
                label: 'Reference Clouds',
                animated: true,
                beats: { start: 1.5, exit: 10.0 },
              },
            ],
            columns: 2, // Mobile-friendly: 2 columns max
            animation: 'cascade',
            showLabels: true,
            labelPosition: 'bottom',
            beats: { start: 0.8 },
          },
        },
        row2: {
          midScene: 'gridCards',
          stylePreset: 'focus',
          config: {
            cards: [
              {
                icon: '🤖',
                label: 'Learning Rails',
                animated: true,
                beats: { start: 2.5, exit: 10.0 },
              },
              {
                icon: '🪄',
                label: 'Mid-Scene Lab',
                animated: true,
                beats: { start: 3.0, exit: 10.0 },
              },
            ],
            columns: 2,
            animation: 'bounce',
            showLabels: true,
            beats: { start: 2.2 },
          },
        },
        row3: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              {
                text: 'A world of knowledge',
                emphasis: 'normal',
                beats: { start: 4.5, exit: 10.0 },
              },
              {
                text: 'at your fingertips ✨',
                emphasis: 'high',
                beats: { start: 5.5, exit: 10.0, emphasis: 6.0 },
              },
            ],
            revealType: 'fade',
            staggerDelay: 0.4,
            lineSpacing: 'normal',
          },
        },
      },
    },
  },

  // Scene 3: Quick tour - checklist (works great vertically)
  {
    id: 'mobile-tour',
    durationInFrames: 270,
    transition: { type: 'slide', direction: 'left' },
    config: {
      format: 'mobile',
      background: { preset: 'spotlight', spotlight: { x: 50, y: 40, intensity: 0.3 } },
      layout: {
        type: 'rowStack',
        options: { rows: 2, padding: 40, titleHeight: 100 },
      },
      slots: {
        header: {
          midScene: 'textReveal',
          stylePreset: 'mentor',
          config: {
            lines: [
              {
                text: 'Quick Tour 🚀',
                emphasis: 'high',
                beats: { start: 0.3, exit: 8.0 },
              },
            ],
          },
        },
        row1: {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: 'Watch the magic',
            heroType: 'lottie',
            heroRef: 'error',
            beats: { entrance: 0.5, exit: 6.0 },
          },
        },
        row2: {
          midScene: 'checklist',
          stylePreset: 'playful',
          config: {
            items: [
              { text: 'Layouts via JSON', checked: true, beats: { start: 1.5 } },
              { text: 'Mid-scenes in slots', checked: true, beats: { start: 2.5 } },
              { text: 'Presets for tone', checked: true, beats: { start: 3.5 } },
              { text: 'Mobile ready!', checked: true, beats: { start: 4.5 } },
            ],
            icon: 'lottieCheck',
            beats: { start: 1.2, exit: 8.0 },
          },
        },
      },
    },
  },

  // Scene 4: CTA - simple and impactful
  {
    id: 'mobile-cta',
    durationInFrames: 270,
    transition: { type: 'eraser' },
    config: {
      format: 'mobile',
      background: { preset: 'sunriseGradient' },
      layout: { type: 'full', options: { padding: 50, titleHeight: 0 } },
      slots: {
        full: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              {
                text: 'Next up:',
                emphasis: 'normal',
                beats: { start: 0.5, exit: 7.0 },
              },
              {
                text: 'The Culture',
                emphasis: 'high',
                beats: { start: 1.2, exit: 7.0, emphasis: 1.8 },
              },
              {
                text: 'of Knodovia',
                emphasis: 'high',
                beats: { start: 2.0, exit: 7.0, emphasis: 2.5 },
              },
              {
                text: '🌍',
                emphasis: 'normal',
                beats: { start: 3.0, exit: 7.0 },
              },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.35,
            lineSpacing: 'relaxed',
          },
        },
      },
    },
  },
];

export const KNODOVIA_VIDEO1_MOBILE_DURATION = mobileScenes.reduce(
  (total, scene) => total + scene.durationInFrames,
  0,
);

/**
 * KnodoviaAccidentalArrivalMobile
 * 
 * Mobile-optimized (1080x1920) version of Accidental Arrival.
 * Designed for TikTok, Instagram Reels, and YouTube Shorts.
 */
export const KnodoviaAccidentalArrivalMobile = () => {
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

export default KnodoviaAccidentalArrivalMobile;
