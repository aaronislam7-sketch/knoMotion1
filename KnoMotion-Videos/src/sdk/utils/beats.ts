type BeatConfig = {
  start?: number;
  hold?: number;
  exit?: number;
  emphasis?: number;
};

type BeatDefaults = {
  start?: number;
  holdDuration?: number;
  exitOffset?: number;
};

export const resolveBeats = (
  beats: BeatConfig = {},
  defaults: BeatDefaults = {},
) => {
  const start = beats.start ?? defaults.start ?? 0.5;
  const holdDuration = defaults.holdDuration ?? 1.6;
  const hold = beats.hold ?? start + holdDuration;
  const exit = beats.exit ?? hold + (defaults.exitOffset ?? 0.3);
  const emphasis = beats.emphasis ?? start + 0.3;

  return { start, hold, exit, emphasis };
};
