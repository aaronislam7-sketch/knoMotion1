import {useVideoConfig} from 'remotion';

/**
 * Convert seconds to frames
 * 
 * @param seconds - Time in seconds
 * @param fps - Frames per second
 * @returns Frame count
 * 
 * @example
 * toFrames(4, 30) // 120 frames
 * toFrames(4, 60) // 240 frames (same duration, more frames)
 */
export const toFrames = (seconds: number, fps: number): number => {
  return Math.round(seconds * fps);
};

/**
 * Convert milliseconds to frames
 * 
 * @param milliseconds - Time in milliseconds
 * @param fps - Frames per second
 * @returns Frame count
 */
export const msToFrames = (milliseconds: number, fps: number): number => {
  return Math.round((milliseconds / 1000) * fps);
};

/**
 * Hook for time utilities with current video config
 * 
 * @returns Time conversion utilities
 */
export const useTime = () => {
  const {fps} = useVideoConfig();

  const sec = (s: number) => toFrames(s, fps);
  const ms = (m: number) => msToFrames(m, fps);

  return {fps, sec, ms, toFrames: (s: number) => toFrames(s, fps)};
};
