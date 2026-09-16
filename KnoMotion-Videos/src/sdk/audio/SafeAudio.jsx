/**
 * SafeAudio — P4e
 *
 * Drop-in wrapper around <Html5Audio> that handles broken audio URLs
 * gracefully. When an audio source fails to load, the component unmounts
 * the audio element and logs a warning instead of crashing the composition.
 *
 * Props: all <Html5Audio> props are forwarded transparently.
 *
 * `src` may be an absolute URL or a path relative to public/ (e.g. the
 * `pipeline-audio/<job>/<video>/<scene>.mp3` files the pipeline's assembly
 * stage writes). Relative paths are resolved with staticFile().
 *
 * @see BUILD_STATUS.md Section 4 — P4e
 */

import React, { useState, useCallback } from 'react';
import { Html5Audio, staticFile } from 'remotion';

const AUDIO_TIMEOUT_MS = 5000;
const AUDIO_RETRIES = 1;

const ABSOLUTE_SRC = /^(https?:|data:|blob:|\/)/;

/** Resolve a config `src` to something the browser can fetch. Exported for tests. */
export const resolveAudioSrc = (src) => {
  if (!src) return src;
  return ABSOLUTE_SRC.test(src) ? src : staticFile(src);
};

export const SafeAudio = ({ src, onError: externalOnError, ...rest }) => {
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(
    (error) => {
      console.warn(`Audio failed to load: ${src}, continuing without audio`);
      setFailed(true);
      if (externalOnError) {
        externalOnError(error);
      }
    },
    [src, externalOnError],
  );

  if (failed || !src) {
    return null;
  }

  return (
    <Html5Audio
      src={resolveAudioSrc(src)}
      onError={handleError}
      delayRenderTimeoutInMilliseconds={AUDIO_TIMEOUT_MS}
      delayRenderRetries={AUDIO_RETRIES}
      {...rest}
    />
  );
};
