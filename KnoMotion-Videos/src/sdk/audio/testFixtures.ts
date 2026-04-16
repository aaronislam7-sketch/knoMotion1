/**
 * Audio Layer Test Fixtures — P4
 *
 * Sample scene payloads for testing AudioLayer, CaptionOverlay, and
 * ttsToBeatAlignment(). These fixtures are used for:
 *
 *   1. Remotion Studio preview — paste the test scenes into KnoMotionVideo props
 *   2. CLI render test — pass as --props to npx remotion render
 *   3. alignTTSToBeats() validation — sample captions + expected alignment
 *
 * IMPORTANT: Audio URLs are placeholders. For actual audio playback testing,
 * replace with real accessible URLs (e.g. from a public CDN or staticFile()).
 *
 * For a quick test without real audio, the visual components (captions) still
 * render correctly — AudioLayer gracefully handles unreachable audio sources.
 */

import type { Caption } from '@remotion/captions';

/**
 * Sample Caption[] data simulating TTS output for "Your brain forgets
 * eighty percent of what you learn within twenty-four hours."
 *
 * Timestamps are absolute (ms from video start). Text includes leading
 * spaces per @remotion/captions convention.
 */
export const sampleCaptions: Caption[] = [
  { text: 'Your', startMs: 200, endMs: 420, timestampMs: 310, confidence: null },
  { text: ' brain', startMs: 420, endMs: 680, timestampMs: 550, confidence: null },
  { text: ' forgets', startMs: 680, endMs: 1050, timestampMs: 865, confidence: null },
  { text: ' eighty', startMs: 1050, endMs: 1380, timestampMs: 1215, confidence: null },
  { text: ' percent', startMs: 1380, endMs: 1720, timestampMs: 1550, confidence: null },
  { text: ' of', startMs: 1720, endMs: 1850, timestampMs: 1785, confidence: null },
  { text: ' what', startMs: 1850, endMs: 2050, timestampMs: 1950, confidence: null },
  { text: ' you', startMs: 2050, endMs: 2200, timestampMs: 2125, confidence: null },
  { text: ' learn', startMs: 2200, endMs: 2550, timestampMs: 2375, confidence: null },
  { text: ' within', startMs: 2550, endMs: 2850, timestampMs: 2700, confidence: null },
  { text: ' twenty-four', startMs: 2850, endMs: 3300, timestampMs: 3075, confidence: null },
  { text: ' hours.', startMs: 3300, endMs: 3700, timestampMs: 3500, confidence: null },
];

/**
 * Sample Caption[] for scene 2: "Spaced repetition fights the forgetting
 * curve by reviewing at increasing intervals."
 */
export const sampleCaptionsScene2: Caption[] = [
  { text: 'Spaced', startMs: 5200, endMs: 5550, timestampMs: 5375, confidence: null },
  { text: ' repetition', startMs: 5550, endMs: 6050, timestampMs: 5800, confidence: null },
  { text: ' fights', startMs: 6050, endMs: 6350, timestampMs: 6200, confidence: null },
  { text: ' the', startMs: 6350, endMs: 6480, timestampMs: 6415, confidence: null },
  { text: ' forgetting', startMs: 6480, endMs: 6950, timestampMs: 6715, confidence: null },
  { text: ' curve', startMs: 6950, endMs: 7280, timestampMs: 7115, confidence: null },
  { text: ' by', startMs: 7280, endMs: 7400, timestampMs: 7340, confidence: null },
  { text: ' reviewing', startMs: 7400, endMs: 7800, timestampMs: 7600, confidence: null },
  { text: ' at', startMs: 7800, endMs: 7920, timestampMs: 7860, confidence: null },
  { text: ' increasing', startMs: 7920, endMs: 8350, timestampMs: 8135, confidence: null },
  { text: ' intervals.', startMs: 8350, endMs: 8800, timestampMs: 8575, confidence: null },
];

/**
 * All captions combined (for alignTTSToBeats testing).
 */
export const allSampleCaptions: Caption[] = [
  ...sampleCaptions,
  ...sampleCaptionsScene2,
];

/**
 * Placeholder audio URLs — replace these for real audio playback testing.
 *
 * For local testing, place MP3 files in KnoMotion-Videos/public/ and use
 * staticFile('narration-hook.mp3') at the component level, or use full
 * public URLs here for remote testing.
 */
export const PLACEHOLDER_AUDIO = {
  narration1: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
  narration2: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
  backgroundMusic: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
  sfxWhoosh: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
};

/**
 * Test scene payload with all audio features enabled.
 *
 * Usage (CLI render):
 *   npx remotion render KnoMotion-Videos/src/remotion/index.ts KnoMotionVideo \
 *     --props='<paste testScenesWithAudio JSON here>'
 *
 * Usage (Studio): Copy the scenes array into the KnoMotionVideo defaultProps.
 */
export const testScenesWithAudio = {
  format: 'desktop' as const,
  scenes: [
    {
      id: 'audio-test-hook',
      durationInFrames: 150,
      transition: { type: 'fade' },
      audio: {
        narration: {
          src: PLACEHOLDER_AUDIO.narration1,
          volume: 1.0,
        },
        music: {
          src: PLACEHOLDER_AUDIO.backgroundMusic,
          volume: 0.12,
          fadeIn: 1.0,
          fadeOut: 1.5,
        },
        sfx: [
          {
            src: PLACEHOLDER_AUDIO.sfxWhoosh,
            atSecond: 0.3,
            volume: 0.4,
          },
        ],
      },
      captions: {
        enabled: true,
        style: 'tiktok' as const,
        data: sampleCaptions,
      },
      config: {
        background: { preset: 'sunriseGradient', layerNoise: true },
        layout: { type: 'full', options: { padding: 80 } },
        slots: {
          full: {
            midScene: 'textReveal',
            stylePreset: 'playful',
            config: {
              lines: [
                {
                  text: 'Your brain forgets 80% in 24 hours',
                  emphasis: 'high',
                  beats: { start: 0.3, exit: 4.5 },
                },
              ],
              revealType: 'typewriter',
              animationDuration: 1.2,
            },
          },
        },
      },
    },
    {
      id: 'audio-test-explain',
      durationInFrames: 300,
      transition: { type: 'slide', direction: 'left' },
      audio: {
        narration: {
          src: PLACEHOLDER_AUDIO.narration2,
          volume: 1.0,
        },
        music: {
          src: PLACEHOLDER_AUDIO.backgroundMusic,
          volume: 0.1,
          fadeIn: 0.5,
          fadeOut: 2.0,
        },
      },
      captions: {
        enabled: true,
        style: 'subtitle' as const,
        data: sampleCaptionsScene2,
      },
      config: {
        background: { preset: 'notebookSoft' },
        layout: { type: 'rowStack', options: { rows: 2, padding: 50 } },
        slots: {
          row1: {
            midScene: 'heroText',
            stylePreset: 'educational',
            config: {
              text: 'Spaced Repetition',
              heroType: 'lottie',
              heroRef: 'brain',
              beats: { entrance: 0.5, exit: 8.0 },
            },
          },
          row2: {
            midScene: 'checklist',
            config: {
              items: [
                { text: 'Review after 1 day', checked: true, beats: { start: 2.0 } },
                { text: 'Review after 3 days', checked: true, beats: { start: 3.0 } },
                { text: 'Review after 7 days', checked: true, beats: { start: 4.0 } },
              ],
              icon: 'check',
              iconColor: 'accentGreen',
              beats: { start: 1.5, exit: 8.0 },
            },
          },
        },
      },
    },
    {
      id: 'audio-test-karaoke',
      durationInFrames: 150,
      transition: { type: 'clock-wipe' },
      captions: {
        enabled: true,
        style: 'karaoke' as const,
        data: sampleCaptions,
      },
      config: {
        background: { preset: 'chalkboardGradient' },
        layout: { type: 'full' },
        slots: {
          full: {
            midScene: 'textReveal',
            stylePreset: 'mentor',
            config: {
              lines: [
                {
                  text: 'Karaoke caption style demo',
                  emphasis: 'high',
                  beats: { start: 0.5, exit: 4.0 },
                },
              ],
              revealType: 'fade',
            },
          },
        },
      },
    },
  ],
};

/**
 * Sample input for alignTTSToBeats() testing.
 *
 * Expected: scene 1 gets captions at 0.2s–3.7s relative,
 * scene 2 gets captions at scene-relative offsets.
 */
export const alignmentTestInput = {
  captions: allSampleCaptions,
  scenes: [
    { id: 'hook', durationInFrames: 150 },
    { id: 'explain', durationInFrames: 300 },
  ],
  options: {
    emphasisWords: ['eighty percent', 'forgetting curve'],
    wordsPerLine: 6,
  },
};
