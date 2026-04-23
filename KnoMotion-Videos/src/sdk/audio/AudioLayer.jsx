/**
 * AudioLayer — P4b
 *
 * Renders the three audio channels for a scene:
 *   1. Narration — <Html5Audio> offset by startFromSeconds
 *   2. Background music — <Html5Audio> with fade-in/out volume curves, loops by default
 *   3. Sound effects — Each SFX positioned via <Sequence from={...}>
 *
 * This component is purely auditory — it produces no visual output.
 * Rendered inside GenericVideoPlayer's TransitionSeries.Sequence alongside SceneFromConfig.
 *
 * @see BUILD_STATUS.md Section 4 — P4b
 */

import React from 'react';
import { Sequence, useVideoConfig, interpolate } from 'remotion';
import { SafeAudio } from './SafeAudio';

/**
 * Build a volume callback for background music with fade-in and fade-out.
 *
 * The `f` parameter in Remotion's volume callback starts at 0 when the
 * <Html5Audio> element begins playing — it is NOT the composition frame.
 */
const buildMusicVolumeFn = (music, durationInFrames, fps) => {
  const baseVolume = music.volume ?? 0.15;
  const fadeInFrames = (music.fadeIn || 0) * fps;
  const fadeOutFrames = (music.fadeOut || 0) * fps;

  return (f) => {
    if (fadeInFrames > 0 && f < fadeInFrames) {
      return interpolate(f, [0, fadeInFrames], [0, baseVolume], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    if (fadeOutFrames > 0 && f > durationInFrames - fadeOutFrames) {
      return interpolate(
        f,
        [durationInFrames - fadeOutFrames, durationInFrames],
        [baseVolume, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      );
    }

    return baseVolume;
  };
};

export const AudioLayer = ({ audio, durationInFrames }) => {
  const { fps } = useVideoConfig();

  if (!audio) return null;

  return (
    <>
      {/* Narration track */}
      {audio.narration?.src && (
        <Sequence
          from={Math.round((audio.narration.startFromSeconds || 0) * fps)}
          name="Narration"
        >
          <SafeAudio
            src={audio.narration.src}
            volume={audio.narration.volume ?? 1}
            pauseWhenBuffering
          />
        </Sequence>
      )}

      {/* Background music track */}
      {audio.music?.src && (
        <SafeAudio
          src={audio.music.src}
          volume={buildMusicVolumeFn(audio.music, durationInFrames, fps)}
          loop={audio.music.loop !== false}
          name="Background Music"
          pauseWhenBuffering
        />
      )}

      {/* Sound effects */}
      {audio.sfx?.map((sfx, i) => (
        <Sequence
          key={`sfx-${i}`}
          from={Math.round(sfx.atSecond * fps)}
          name={`SFX ${i + 1}`}
        >
          <SafeAudio
            src={sfx.src}
            volume={sfx.volume ?? 0.5}
            pauseWhenBuffering
          />
        </Sequence>
      ))}
    </>
  );
};
