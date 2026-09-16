/**
 * fitFontSize — shrink-to-fit text sizing on top of @remotion/layout-utils.
 *
 * Mid-scenes pick a base font size from the slot, then call this to make sure
 * a given string actually fits its width. `fitText` measures the real glyphs
 * (via a hidden DOM element, so it is exact for the fonts Chrome has loaded);
 * the result is clamped to [minSize, baseSize] so text can only get smaller,
 * never larger, and never unreadably small. `maxLines` > 1 lets a string wrap
 * that many lines before it starts shrinking.
 *
 * Falls back to `baseSize` when measurement is impossible (no DOM) or the
 * inputs are empty, so it is always safe to call.
 */

import { fitText } from '@remotion/layout-utils';

/**
 * @param {Object} args
 * @param {string} args.text
 * @param {number} args.maxWidth      Width available for one visual line, in px
 * @param {number} args.baseSize      The size the mid-scene would use if the text fit
 * @param {number} [args.minSize]     Floor (default: 60% of baseSize)
 * @param {string} args.fontFamily
 * @param {string|number} [args.fontWeight]
 * @param {number} [args.maxLines]    Visual lines the text may wrap to before shrinking (default 1)
 * @param {string} [args.letterSpacing]
 * @returns {number} font size in px
 */
export const fitFontSize = ({
  text,
  maxWidth,
  baseSize,
  minSize = Math.round(baseSize * 0.6),
  fontFamily,
  fontWeight = 'normal',
  maxLines = 1,
  letterSpacing,
}) => {
  if (!text || !Number.isFinite(maxWidth) || maxWidth <= 0 || !Number.isFinite(baseSize)) return baseSize;
  if (typeof document === 'undefined') return baseSize;
  try {
    const { fontSize } = fitText({
      text: String(text),
      withinWidth: maxWidth * Math.max(1, maxLines),
      fontFamily,
      fontWeight: String(fontWeight),
      letterSpacing,
      validateFontIsLoaded: false,
    });
    if (!Number.isFinite(fontSize)) return baseSize;
    return Math.max(minSize, Math.min(baseSize, Math.floor(fontSize)));
  } catch {
    return baseSize;
  }
};

/** Smallest fitted size across several strings (so a stack of lines shares one size). */
export const fitFontSizeForAll = (texts, args) =>
  (texts || []).reduce((size, text) => Math.min(size, fitFontSize({ ...args, text })), args.baseSize);
