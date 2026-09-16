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
  /**
   * Exit to use when the element has none of its own. Containers pass their
   * resolved exit here so a line/item/card/callout without per-item beats
   * stays up as long as its parent, instead of vanishing ~0.8s after it
   * appears (the old behaviour: hold + exitOffset).
   */
  exit?: number;
};

export const resolveBeats = (
  beats: BeatConfig = {},
  defaults: BeatDefaults = {},
) => {
  const start = beats.start ?? defaults.start ?? 0.5;
  const holdDuration = defaults.holdDuration ?? 1.6;
  const hold = beats.hold ?? start + holdDuration;
  const exit = beats.exit ?? defaults.exit ?? hold + (defaults.exitOffset ?? 0.3);
  const emphasis = beats.emphasis ?? start + 0.3;

  return { start, hold, exit, emphasis };
};
