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
  const scenes = props.scenes || [];
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
            {
              id: 'audio-test-tiktok',
              durationInFrames: 150,
              transition: { type: 'fade' },
              audio: {
                narration: {
                  src: 'REPLACE_WITH_NARRATION_URL',
                  volume: 1.0,
                },
                music: {
                  src: 'REPLACE_WITH_MUSIC_URL',
                  volume: 0.12,
                  fadeIn: 1.0,
                  fadeOut: 1.5,
                },
                sfx: [
                  {
                    src: 'REPLACE_WITH_SFX_URL',
                    atSecond: 0.3,
                    volume: 0.4,
                  },
                ],
              },
              captions: {
                enabled: true,
                style: 'tiktok' as const,
                data: [
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
                ],
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
                        { text: 'Your brain forgets 80% in 24 hours', emphasis: 'high', beats: { start: 0.3, exit: 4.5 } },
                      ],
                      revealType: 'typewriter',
                      animationDuration: 1.2,
                    },
                  },
                },
              },
            },
            {
              id: 'audio-test-subtitle',
              durationInFrames: 180,
              transition: { type: 'slide', direction: 'left' },
              audio: {
                narration: {
                  src: 'REPLACE_WITH_NARRATION_URL',
                  volume: 1.0,
                },
                music: {
                  src: 'REPLACE_WITH_MUSIC_URL',
                  volume: 0.1,
                  fadeIn: 0.5,
                  fadeOut: 2.0,
                },
              },
              captions: {
                enabled: true,
                style: 'subtitle' as const,
                data: [
                  { text: 'Spaced', startMs: 200, endMs: 550, timestampMs: 375, confidence: null },
                  { text: ' repetition', startMs: 550, endMs: 1050, timestampMs: 800, confidence: null },
                  { text: ' fights', startMs: 1050, endMs: 1350, timestampMs: 1200, confidence: null },
                  { text: ' the', startMs: 1350, endMs: 1480, timestampMs: 1415, confidence: null },
                  { text: ' forgetting', startMs: 1480, endMs: 1950, timestampMs: 1715, confidence: null },
                  { text: ' curve.', startMs: 1950, endMs: 2400, timestampMs: 2175, confidence: null },
                ],
              },
              config: {
                background: { preset: 'notebookSoft' },
                layout: { type: 'rowStack', options: { rows: 2, padding: 50 } },
                slots: {
                  row1: {
                    midScene: 'bigNumber',
                    config: {
                      number: '10',
                      label: 'mid-scenes with complete schemas',
                      animation: 'countUp',
                      countFrom: 0,
                      beats: { start: 0.5, exit: 5.0 },
                    },
                  },
                  row2: {
                    midScene: 'checklist',
                    stylePreset: 'educational',
                    config: {
                      items: [
                        { text: 'AudioLayer created', checked: true, beats: { start: 1.0 } },
                        { text: 'CaptionOverlay works', checked: true, beats: { start: 1.5 } },
                        { text: 'Three caption styles', checked: true, beats: { start: 2.0 } },
                      ],
                      icon: 'check',
                      revealType: 'pop',
                      beats: { start: 0.8, exit: 5.5 },
                    },
                  },
                },
              },
            },
            {
              id: 'audio-test-karaoke',
              durationInFrames: 150,
              transition: { type: 'clock-wipe' },
              audio: {
                music: {
                  src: 'REPLACE_WITH_MUSIC_URL',
                  volume: 0.2,
                  fadeIn: 0.3,
                  fadeOut: 1.0,
                },
              },
              captions: {
                enabled: true,
                style: 'karaoke' as const,
                data: [
                  { text: 'Question', startMs: 500, endMs: 950, timestampMs: 725, confidence: null },
                  { text: ' everything.', startMs: 950, endMs: 1500, timestampMs: 1225, confidence: null },
                  { text: ' Even', startMs: 1800, endMs: 2100, timestampMs: 1950, confidence: null },
                  { text: ' this', startMs: 2100, endMs: 2400, timestampMs: 2250, confidence: null },
                  { text: ' video.', startMs: 2400, endMs: 2900, timestampMs: 2650, confidence: null },
                ],
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
                        { text: 'Karaoke captions demo', emphasis: 'high', beats: { start: 0.5, exit: 3.0 } },
                      ],
                      revealType: 'fade',
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
