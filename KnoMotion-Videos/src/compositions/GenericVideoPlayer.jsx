/**
 * GenericVideoPlayer — Universal parameterized composition
 *
 * Accepts a scene array as input props and renders any KnoMotion video.
 * This is the single composition that powers the entire blue-sky pipeline:
 *   JSON → GenericVideoPlayer → Remotion Player / Lambda render → MP4
 *
 * Uses the canonical TransitionSeries pattern established in P1.
 * Audio layer (P4): renders AudioLayer + CaptionOverlay per scene when
 * scene.audio / scene.captions fields are present.
 *
 * @usage Register in Root.tsx with calculateMetadata() for dynamic duration/dimensions.
 * @see BUILD_STATUS.md Section 5 — S2, Section 4 — P4
 */

import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { TransitionSeries } from '@remotion/transitions';
import { SceneFromConfig } from './SceneRenderer';
import {
  resolvePresentation,
  resolveTransitionTiming,
} from '../sdk/transitions';
import { AudioLayer } from '../sdk/audio/AudioLayer';
import { CaptionOverlay } from '../sdk/audio/CaptionOverlay';

const TRANSITION_FRAMES = 20;

export const GenericVideoPlayer = ({ scenes = [], format }) => {
  const { width, height } = useVideoConfig();
  const viewport = { width, height };

  if (!scenes || scenes.length === 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: '#FFF9F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: 32,
          color: '#5D6D7E',
        }}
      >
        No scenes provided. Pass a scenes array via input props.
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {scenes.map((scene, index) => {
          const sceneConfig = scene.config
            ? { ...scene.config, format: format || scene.config?.format }
            : { format };

          return (
            <React.Fragment key={scene.id || `scene-${index}`}>
              {index > 0 && (
                <TransitionSeries.Transition
                  presentation={resolvePresentation(
                    scene.transition,
                    viewport,
                  )}
                  timing={resolveTransitionTiming(
                    scene.transition,
                    TRANSITION_FRAMES,
                  )}
                />
              )}
              <TransitionSeries.Sequence
                durationInFrames={scene.durationInFrames}
              >
                <SceneFromConfig config={sceneConfig} />
                {scene.audio && (
                  <AudioLayer
                    audio={scene.audio}
                    durationInFrames={scene.durationInFrames}
                  />
                )}
                {scene.captions && (
                  <CaptionOverlay captions={scene.captions} />
                )}
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
