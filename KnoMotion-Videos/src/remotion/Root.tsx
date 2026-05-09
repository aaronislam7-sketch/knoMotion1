/**
 * Remotion Root Component
 * 
 * Registers all video compositions for rendering.
 */

import React from 'react';
import { Composition } from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';

// Load Google Fonts using the correct Remotion v4 API
import { loadFont as loadCabinSketch } from '@remotion/google-fonts/CabinSketch';
import { loadFont as loadPermanentMarker } from '@remotion/google-fonts/PermanentMarker';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

// Initialize fonts at module level (required for Remotion rendering)
loadCabinSketch();
loadPermanentMarker();
loadInter();

// Generic Parameterized Composition (S2) + Zod Schema (S1)
import { GenericVideoPlayer } from '../compositions/GenericVideoPlayer';
import { calculateTransitionSeriesDuration } from '../sdk/transitions';
import { VideoConfigSchema } from '../sdk/schemas/videoConfig.schema';
import type { VideoConfig } from '../sdk/schemas/videoConfig.schema';

const calculateGenericMetadata: CalculateMetadataFunction<VideoConfig> = ({
  props,
}) => {
  const scenes = (props.scenes || []) as Array<{
    durationInFrames: number;
    transition?: { type: string; direction?: string; durationInFrames?: number };
  }>;
  const isMobile = props.format === 'mobile';
  const totalFrames =
    scenes.length > 0 ? calculateTransitionSeriesDuration(scenes, 20) : 1;

  return {
    durationInFrames: Math.max(1, totalFrames),
    width: isMobile ? 1080 : 1920,
    height: isMobile ? 1920 : 1080,
  };
};

// TikTok Viral Videos
import { TikTok_BrainLies, TIKTOK_BRAINLIES_DURATION } from '../compositions/TikTok_BrainLies';
import { TikTok_ADHDOverpowered, TIKTOK_ADHDOVERPOWERED_DURATION } from '../compositions/TikTok_ADHDOverpowered';
import { TikTok_80msDelay, TIKTOK_80MSDELAY_DURATION } from '../compositions/TikTok_80msDelay';

// Knodovia Desktop Videos
import { KnodoviaAccidentalArrival, KNODOVIA_VIDEO1_DURATION } from '../compositions/KnodoviaVideo1_AccidentalArrival';
import { KnodoviaCultureAnthro, KNODOVIA_VIDEO2_DURATION } from '../compositions/KnodoviaVideo2_Culture';
import { KnodoviaEconomics, KNODOVIA_VIDEO3_DURATION } from '../compositions/KnodoviaVideo3_Economics';

// Knodovia Mobile Videos
import { KnodoviaAccidentalArrivalMobile, KNODOVIA_VIDEO1_MOBILE_DURATION } from '../compositions/KnodoviaVideo1_Mobile';
import { KnodoviaCultureMobile, KNODOVIA_VIDEO2_MOBILE_DURATION } from '../compositions/KnodoviaVideo2_Mobile';
import { KnodoviaEconomicsMobile, KNODOVIA_VIDEO3_MOBILE_DURATION } from '../compositions/KnodoviaVideo3_Mobile';

const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      {/* ================================================================= */}
      {/* TIKTOK VIRAL VIDEOS (1080x1920 Mobile) */}
      {/* ================================================================= */}
      <Composition
        id="TikTokBrainLies"
        component={TikTok_BrainLies}
        durationInFrames={TIKTOK_BRAINLIES_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="TikTokADHDOverpowered"
        component={TikTok_ADHDOverpowered}
        durationInFrames={TIKTOK_ADHDOVERPOWERED_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="TikTok80msDelay"
        component={TikTok_80msDelay}
        durationInFrames={TIKTOK_80MSDELAY_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* ================================================================= */}
      {/* KNODOVIA DESKTOP VIDEOS (1920x1080) */}
      {/* ================================================================= */}
      <Composition
        id="KnodoviaAccidentalArrival"
        component={KnodoviaAccidentalArrival}
        durationInFrames={KNODOVIA_VIDEO1_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="KnodoviaCulture"
        component={KnodoviaCultureAnthro}
        durationInFrames={KNODOVIA_VIDEO2_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="KnodoviaEconomics"
        component={KnodoviaEconomics}
        durationInFrames={KNODOVIA_VIDEO3_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* ================================================================= */}
      {/* KNODOVIA MOBILE VIDEOS (1080x1920) */}
      {/* ================================================================= */}
      <Composition
        id="KnodoviaAccidentalArrivalMobile"
        component={KnodoviaAccidentalArrivalMobile}
        durationInFrames={KNODOVIA_VIDEO1_MOBILE_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="KnodoviaCultureMobile"
        component={KnodoviaCultureMobile}
        durationInFrames={KNODOVIA_VIDEO2_MOBILE_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="KnodoviaEconomicsMobile"
        component={KnodoviaEconomicsMobile}
        durationInFrames={KNODOVIA_VIDEO3_MOBILE_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* ================================================================= */}
      {/* GENERIC PARAMETERIZED COMPOSITION (S2) */}
      {/* Accepts any scene array via input props. Duration, width, and */}
      {/* height are computed dynamically via calculateMetadata(). */}
      {/* ================================================================= */}
      <Composition
        id="KnoMotionVideo"
        component={GenericVideoPlayer}
        schema={VideoConfigSchema}
        durationInFrames={1}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: [
            // --- Scene 1: blurSlide textReveal ---
            {
              id: 'test-blurSlide',
              durationInFrames: 120,
              transition: { type: 'fade' },
              config: {
                background: { preset: 'sunriseGradient' },
                layout: { type: 'full' },
                slots: {
                  full: {
                    midScene: 'textReveal',
                    stylePreset: 'playful',
                    config: {
                      lines: [
                        { text: 'Blur Slide Reveal', emphasis: 'high', beats: { start: 0.3, exit: 3.5 } },
                        { text: 'Words unblur and slide into place', emphasis: 'normal', beats: { start: 0.8, exit: 3.5 } },
                      ],
                      revealType: 'blurSlide',
                      staggerDelay: 0.5,
                      beats: { start: 0.3, exit: 3.5 },
                    },
                  },
                },
              },
            },
            // --- Scene 2: charByChar textReveal ---
            {
              id: 'test-charByChar',
              durationInFrames: 120,
              transition: { type: 'slide', direction: 'left' },
              config: {
                background: { preset: 'chalkboardGradient' },
                layout: { type: 'full' },
                slots: {
                  full: {
                    midScene: 'textReveal',
                    stylePreset: 'mentor',
                    config: {
                      lines: [
                        { text: 'Character by Character', emphasis: 'high', beats: { start: 0.3, exit: 3.5 } },
                        { text: 'Each letter appears one at a time', emphasis: 'normal', beats: { start: 1.0, exit: 3.5 } },
                      ],
                      revealType: 'charByChar',
                      staggerDelay: 0.7,
                      beats: { start: 0.3, exit: 3.5 },
                    },
                  },
                },
              },
            },
            // --- Scene 3: glitchIn textReveal ---
            {
              id: 'test-glitchIn',
              durationInFrames: 120,
              transition: { type: 'iris' },
              config: {
                background: { preset: 'spotlight' },
                layout: { type: 'full' },
                slots: {
                  full: {
                    midScene: 'textReveal',
                    stylePreset: 'focus',
                    config: {
                      lines: [
                        { text: 'Glitch Into Reality', emphasis: 'high', beats: { start: 0.3, exit: 3.5 } },
                      ],
                      revealType: 'glitchIn',
                      beats: { start: 0.3, exit: 3.5 },
                    },
                  },
                },
              },
            },
            // --- Scene 4: variableTypewriter textReveal ---
            {
              id: 'test-variableTypewriter',
              durationInFrames: 150,
              transition: { type: 'fade' },
              config: {
                background: { preset: 'cleanCard' },
                layout: { type: 'full' },
                slots: {
                  full: {
                    midScene: 'textReveal',
                    stylePreset: 'minimal',
                    config: {
                      lines: [
                        { text: 'Variable speed typing with natural rhythm', emphasis: 'normal', beats: { start: 0.3, exit: 4.5 } },
                      ],
                      revealType: 'variableTypewriter',
                      beats: { start: 0.3, exit: 4.5 },
                    },
                  },
                },
              },
            },
            // --- Scene 5: glitchCycle textReveal ---
            {
              id: 'test-glitchCycle',
              durationInFrames: 120,
              transition: { type: 'slide', direction: 'right' },
              config: {
                background: { preset: 'chalkboardGradient' },
                layout: { type: 'full' },
                slots: {
                  full: {
                    midScene: 'textReveal',
                    stylePreset: 'mentor',
                    config: {
                      lines: [
                        { text: 'Glitch Cycle Effect', emphasis: 'high', beats: { start: 0.3, exit: 3.5 } },
                        { text: 'Words glitch in one by one', emphasis: 'normal', beats: { start: 0.8, exit: 3.5 } },
                      ],
                      revealType: 'glitchCycle',
                      staggerDelay: 0.5,
                      beats: { start: 0.3, exit: 3.5 },
                    },
                  },
                },
              },
            },
            // --- Scene 6: centerRipple gridCards ---
            {
              id: 'test-centerRipple',
              durationInFrames: 150,
              transition: { type: 'slide', direction: 'up' },
              config: {
                background: { preset: 'notebookSoft' },
                layout: { type: 'full' },
                slots: {
                  full: {
                    midScene: 'gridCards',
                    stylePreset: 'educational',
                    config: {
                      cards: [
                        { icon: '🧠', label: 'Brain' },
                        { icon: '🔬', label: 'Research' },
                        { icon: '📊', label: 'Data' },
                        { icon: '💡', label: 'Ideas' },
                        { icon: '🎯', label: 'Focus' },
                        { icon: '🚀', label: 'Launch' },
                      ],
                      columns: 3,
                      animation: 'centerRipple',
                      staggerDelay: 0.12,
                      beats: { start: 0.5 },
                    },
                  },
                },
              },
            },
            // --- Scene 7: listReveal checklist ---
            {
              id: 'test-listReveal',
              durationInFrames: 150,
              transition: { type: 'fade' },
              config: {
                background: { preset: 'cleanCard' },
                layout: { type: 'full' },
                slots: {
                  full: {
                    midScene: 'checklist',
                    stylePreset: 'educational',
                    config: {
                      items: [
                        { text: 'Install remotion-bits', checked: true },
                        { text: 'Five new text reveal types', checked: true },
                        { text: 'Center ripple grid animation', checked: true },
                        { text: 'List reveal checklist', checked: true },
                        { text: 'Code block mid-scene', checked: true },
                      ],
                      revealType: 'listReveal',
                      icon: 'check',
                      staggerDelay: 0.25,
                      beats: { start: 0.5, exit: 4.5 },
                    },
                  },
                },
              },
            },
            // --- Scene 8: codeBlock lineByLine ---
            {
              id: 'test-codeBlock-lineByLine',
              durationInFrames: 180,
              transition: { type: 'clock-wipe' },
              config: {
                background: { preset: 'chalkboardGradient' },
                layout: { type: 'full' },
                slots: {
                  full: {
                    midScene: 'codeBlock',
                    config: {
                      code: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1)\n       + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));',
                      language: 'javascript',
                      revealType: 'lineByLine',
                      highlightLines: [3, 4],
                      title: 'Recursive Fibonacci',
                      theme: 'dark',
                      beats: { start: 0.5, exit: 5.0 },
                    },
                  },
                },
              },
            },
            // --- Scene 9: codeBlock typing ---
            {
              id: 'test-codeBlock-typing',
              durationInFrames: 180,
              transition: { type: 'slide', direction: 'left' },
              config: {
                background: { preset: 'spotlight' },
                layout: { type: 'full' },
                slots: {
                  full: {
                    midScene: 'codeBlock',
                    config: {
                      code: 'git init\ngit add .\ngit commit -m "first commit"\ngit push origin main',
                      language: 'bash',
                      revealType: 'typing',
                      title: 'Git Quickstart',
                      theme: 'dark',
                      typingSpeed: 1.5,
                      beats: { start: 0.3, exit: 5.0 },
                    },
                  },
                },
              },
            },
            // --- Scene 10: codeBlock light theme + focus ---
            {
              id: 'test-codeBlock-light',
              durationInFrames: 150,
              transition: { type: 'fade' },
              config: {
                background: { preset: 'cleanCard' },
                layout: { type: 'full' },
                slots: {
                  full: {
                    midScene: 'codeBlock',
                    config: {
                      code: 'import React from "react";\n\nconst App = () => {\n  return (\n    <div className="app">\n      <h1>Hello World</h1>\n    </div>\n  );\n};\n\nexport default App;',
                      language: 'typescript',
                      revealType: 'lineByLine',
                      focusLines: [4, 5, 6, 7],
                      title: 'React Component',
                      theme: 'light',
                      beats: { start: 0.5, exit: 4.5 },
                    },
                  },
                },
              },
            },
          ],
          format: 'desktop' as const,
        }}
        calculateMetadata={calculateGenericMetadata}
      />
    </>
  );
};
