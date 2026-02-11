/**
 * Knodovia Video 1: Accidental Arrival
 * 
 * Scene definitions for the first Knodovia introduction video.
 * Duration: ~2 minutes 9 seconds
 * 
 * Changes from original:
 * - Fixed emphasis beats (must be after start)
 * - Fixed slot array overlaps (bubbleCallout given separate timing)
 * - Improved Lottie choices (semantically appropriate)
 * - Removed checklist exit beats (items build and stay)
 * - Added sideBySide exit beat
 * - Improved grid card labels (conceptual vs script fragments)
 * - Fixed scene 4 text timing (line 3 starts earlier)
 */

const scenes = [
  // =========================================================================
  // SCENE 1: Accidental Arrival
  // Duration: 24s (720 frames)
  // =========================================================================
  {
    id: 'knodovia-1-accidental-arrival',
    durationInFrames: 720,
    transition: { type: 'fade' },
    config: {
      background: {
        preset: 'notebookSoft',
        layerNoise: true,
        particles: { enabled: true, style: 'sparkle', count: 10, opacity: 0.18 },
      },
      layout: { type: 'rowStack', options: { rows: 3, rowRatios: [1, 1.5, 1.5], padding: 60, titleHeight: 0 } },
      slots: {
        // Row 1: Hero visual + title (layered, same timing)
        row1: [
          {
            midScene: 'heroText',
            stylePreset: 'playful',
            config: {
              text: '',
              heroType: 'lottie',
              heroRef: 'question', // Changed from signal-buffer - more appropriate for "arrival"
              animationEntrance: 'fadeSlide',
              animationExit: 'fadeOut',
              beats: { entrance: 0.25, exit: 7.2 },
            },
          },
          {
            midScene: 'textReveal',
            stylePreset: 'playful',
            config: {
              lines: [
                { text: 'UNPLANNED ARRIVAL', emphasis: 'high', beats: { start: 0.35, exit: 7.2, emphasis: 1.0 } },
              ],
              revealType: 'typewriter',
              animationDuration: 0.8,
              lineSpacing: 'normal',
            },
          },
        ],
        // Row 2: Warning text
        row2: {
          midScene: 'textReveal',
          stylePreset: 'educational',
          config: {
            lines: [
              { text: '⚠️ PLEASE DO NOT REFRESH', emphasis: 'high', beats: { start: 8.0, exit: 18.0, emphasis: 9.0 } },
              { text: 'it makes the world… worse', emphasis: 'low', beats: { start: 11.0, exit: 18.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.35,
            animationDuration: 0.7,
            lineSpacing: 'relaxed',
          },
        },
        // Row 3: Welcome bubbles (own slot - no overlap)
        row3: {
          midScene: 'bubbleCallout',
          config: {
            callouts: [
              { text: 'Welcome to… NODOVIA?', icon: '🪧' },
              { text: '…no, KNODOVIA. Sorry.', icon: '✏️' },
              { text: 'Happens more than you'd think', icon: '🙃' },
            ],
            shape: 'notebook',
            pattern: 'diagonal',
            animation: 'float',
            staggerDelay: 0.45,
            animationDuration: 0.6,
            beats: { start: 12.0, exit: 23.0 },
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 2: Context and Knodovians
  // Duration: 45s (1350 frames)
  // =========================================================================
  {
    id: 'knodovia-2-context-and-knodovians',
    durationInFrames: 1350,
    transition: { type: 'doodle-wipe', direction: 'right' },
    config: {
      background: {
        preset: 'sunriseGradient',
        layerNoise: true,
        particles: { enabled: true, style: 'dots', count: 14, opacity: 0.16 },
      },
      layout: { type: 'rowStack', options: { rows: 4, rowRatios: [1, 1.5, 2, 1.5], padding: 55, titleHeight: 0 } },
      slots: {
        // Row 1: Title
        row1: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'K N O D O V I A', emphasis: 'high', beats: { start: 4.2, exit: 18.0, emphasis: 5.0 } },
              { text: 'a land powered by questions', emphasis: 'normal', beats: { start: 6.2, exit: 22.0 } },
            ],
            revealType: 'typewriter',
            staggerDelay: 0.35,
            animationDuration: 0.9,
            lineSpacing: 'relaxed',
          },
        },
        // Row 2: Checklist - NO exit beat (items build and persist)
        row2: {
          midScene: 'checklist',
          stylePreset: 'educational',
          config: {
            items: [
              { text: 'The asking kind', checked: true, beats: { start: 13.2 } },
              { text: 'The "wait, that doesn't make sense" kind', checked: true, beats: { start: 15.7 } },
              { text: 'The "again… but differently" kind', checked: true, beats: { start: 19.2 } },
            ],
            revealType: 'spring',
            staggerDelay: 0.25,
            animationDuration: 0.55,
            icon: 'check',
            iconColor: 'accentGreen',
            alignment: 'left',
            autoFitText: true,
            beats: { start: 12.9 }, // No exit - items persist
          },
        },
        // Row 3: Grid cards with conceptual labels
        row3: {
          midScene: 'gridCards',
          stylePreset: 'playful',
          config: {
            cards: [
              { icon: '💬', label: 'Ask', animated: true, beats: { start: 25.0 } },
              { icon: '❓', label: 'Wonder', animated: true, beats: { start: 26.0 } },
              { icon: '🧠', label: 'Ponder', animated: true, beats: { start: 29.4 } },
              { icon: '🔄', label: 'Revisit', animated: true, beats: { start: 32.5 } },
              { icon: '💡', label: 'Connect', animated: true, beats: { start: 33.3 } },
              { icon: '🧩', label: 'Click', animated: true, beats: { start: 36.7 } },
            ],
            columns: 3,
            animation: 'cascade',
            staggerDelay: 0.12,
            animationDuration: 0.45,
            showLabels: true,
            labelPosition: 'bottom',
            cardVariant: 'elevated',
            beats: { start: 24.8, exit: 44.0 },
          },
        },
        // Row 4: Bubbles (own slot - no overlap with grid)
        row4: {
          midScene: 'bubbleCallout',
          config: {
            callouts: [
              { text: '"I'm completely lost."', icon: '🌀' },
              { text: 'Knodovians: "Perfect. Keep going."', icon: '✅' },
              { text: 'Lost = progress', icon: '🏁' },
            ],
            shape: 'speech',
            pattern: 'zigzag',
            animation: 'float',
            staggerDelay: 0.5,
            animationDuration: 0.65,
            beats: { start: 37.8, exit: 44.0 },
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 3: How Things Get Done
  // Duration: 20s (600 frames)
  // =========================================================================
  {
    id: 'knodovia-3-how-things-get-done',
    durationInFrames: 600,
    transition: { type: 'slide', direction: 'left' },
    config: {
      background: { preset: 'cleanCard', layerNoise: true },
      layout: { type: 'full', options: { padding: 60, titleHeight: 0 } },
      slots: {
        full: [
          {
            midScene: 'sideBySide',
            stylePreset: 'playful',
            config: {
              left: {
                title: 'Plan',
                subtitle: 'Neat. Linear. Confident.',
                icon: '📋',
                items: ['Step 1', 'Step 2', 'Step 3'],
                color: 'secondary',
              },
              right: {
                title: 'Knodovia',
                subtitle: 'Tried. Changed. Scribbled.',
                icon: '📝',
                items: ['Try it', 'Cross it out', 'Try again', '…eventually clicks'],
                color: 'primary',
              },
              animation: 'slide',
              staggerDelay: 0.25,
              dividerType: 'vs',
              dividerLabel: 'VS',
              dividerColor: 'doodle',
              alignment: 'center',
              beats: { start: 0.35, exit: 12.5 }, // Exit before follow-up text
            },
          },
          {
            midScene: 'textReveal',
            stylePreset: 'minimal',
            config: {
              lines: [
                { text: 'We don't rush the "click" bit.', emphasis: 'normal', beats: { start: 14.0, exit: 19.2 } },
              ],
              revealType: 'fade',
              animationDuration: 0.6,
              lineSpacing: 'normal',
            },
          },
        ],
      },
    },
  },

  // =========================================================================
  // SCENE 4: You're Safe Here
  // Duration: 17s (510 frames)
  // =========================================================================
  {
    id: 'knodovia-4-youre-safe-here',
    durationInFrames: 510,
    transition: { type: 'fade' },
    config: {
      background: {
        preset: 'spotlight',
        layerNoise: true,
        spotlight: { x: 50, y: 45, intensity: 0.22 },
      },
      layout: { type: 'rowStack', options: { rows: 2, rowRatios: [2, 1], padding: 70, titleHeight: 0 } },
      slots: {
        row1: {
          midScene: 'heroText',
          stylePreset: 'focus',
          config: {
            text: '',
            heroType: 'lottie',
            heroRef: 'waving',
            animationEntrance: 'fadeSlide',
            animationExit: 'fadeOut',
            beats: { entrance: 0.25, exit: 12.8 },
          },
        },
        row2: {
          midScene: 'textReveal',
          stylePreset: 'focus',
          config: {
            lines: [
              { text: 'Confused?', emphasis: 'high', beats: { start: 0.7, exit: 6.0, emphasis: 1.5 } },
              { text: 'Good. You're in the right place.', emphasis: 'normal', beats: { start: 3.1, exit: 12.6 } },
              { text: 'Just be curious… and patient.', emphasis: 'low', beats: { start: 9.0, exit: 16.0 } }, // Started earlier
            ],
            revealType: 'typewriter',
            staggerDelay: 0.35,
            animationDuration: 0.75,
            lineSpacing: 'relaxed',
          },
        },
      },
    },
  },

  // =========================================================================
  // SCENE 5: Next Stops
  // Duration: 23s (690 frames)
  // =========================================================================
  {
    id: 'knodovia-5-next-stops',
    durationInFrames: 690,
    transition: { type: 'page-turn', direction: 'right' },
    config: {
      background: {
        preset: 'notebookSoft',
        layerNoise: true,
        particles: { enabled: true, style: 'chalk', count: 10, opacity: 0.14 },
      },
      layout: { type: 'rowStack', options: { rows: 3, rowRatios: [1, 1.5, 1.5], padding: 55, titleHeight: 0 } },
      slots: {
        // Row 1: Opening text
        row1: {
          midScene: 'textReveal',
          stylePreset: 'playful',
          config: {
            lines: [
              { text: 'You know where you are now.', emphasis: 'normal', beats: { start: 1.9, exit: 7.0 } },
              { text: '…more or less.', emphasis: 'low', beats: { start: 4.7, exit: 9.0 } },
            ],
            revealType: 'slide',
            direction: 'up',
            staggerDelay: 0.35,
            animationDuration: 0.7,
            lineSpacing: 'relaxed',
          },
        },
        // Row 2: Preview cards + closing text (sequenced, not overlapping)
        row2: [
          {
            midScene: 'gridCards',
            stylePreset: 'playful',
            config: {
              cards: [
                { icon: '🎭', label: 'Culture (Part 2)', animated: true, beats: { start: 6.9 } },
                { icon: '🪙', label: 'Economy (Part 3)', animated: true, beats: { start: 12.8 } },
              ],
              columns: 2,
              animation: 'bounce',
              staggerDelay: 0.25,
              animationDuration: 0.55,
              showLabels: true,
              labelPosition: 'bottom',
              cardVariant: 'elevated',
              beats: { start: 6.6, exit: 17.5 }, // Exit before final text
            },
          },
          {
            midScene: 'textReveal',
            stylePreset: 'playful',
            config: {
              lines: [
                { text: 'Stay curious.', emphasis: 'high', beats: { start: 19.0, exit: 22.5, emphasis: 19.8 } },
              ],
              revealType: 'typewriter',
              animationDuration: 0.7,
              lineSpacing: 'normal',
            },
          },
        ],
        // Row 3: Bubbles (own slot)
        row3: {
          midScene: 'bubbleCallout',
          config: {
            callouts: [
              { text: 'Culture is… a lot.', icon: '😵' },
              { text: 'Economy? Don't ask.', icon: '🙅' },
              { text: 'Barely works. Weirdly proud of it.', icon: '🏆' },
            ],
            shape: 'rounded',
            pattern: 'scattered',
            animation: 'float',
            staggerDelay: 0.45,
            animationDuration: 0.6,
            beats: { start: 8.9, exit: 17.0 },
          },
        },
      },
    },
  },
];

// Calculate total duration
export const KNODOVIA_VIDEO1_DURATION = scenes.reduce(
  (total, scene) => total + scene.durationInFrames,
  0
);

export default scenes;
