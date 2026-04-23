/**
 * SafeAudio — P4e
 *
 * Drop-in wrapper around <Html5Audio> that handles broken audio URLs
 * gracefully. When an audio source fails to load, the component unmounts
 * the audio element and logs a warning instead of crashing the composition.
 *
 * Props: all <Html5Audio> props are forwarded transparently.
 *
 * @see BUILD_STATUS.md Section 4 — P4e
 */

import React, { useState, useCallback } from 'react';
import { Html5Audio } from 'remotion';

const AUDIO_TIMEOUT_MS = 5000;
const AUDIO_RETRIES = 1;

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
      src={src}
      onError={handleError}
      delayRenderTimeoutInMilliseconds={AUDIO_TIMEOUT_MS}
      delayRenderRetries={AUDIO_RETRIES}
      {...rest}
    />
  );
};
