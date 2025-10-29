import type { LayerInput, MeasuredLayer } from './types.ts';

// Simple deterministic text measurement cache
const textMeasureCache = new Map<string, { w: number; h: number }>();

const estimateTextSize = (
  text: string,
  fontFamily: string | undefined,
  fontSize: number | undefined,
  maxW?: number
): { w: number; h: number } => {
  const size = fontSize ?? 32;
  const family = fontFamily ?? 'Inter';
  const key = `${family}|${size}|${maxW ?? ''}|${text}`;
  const cached = textMeasureCache.get(key);
  if (cached) return cached;

  // Deterministic rough estimate: width per char scales with font size
  const avgCharWidth = size * 0.6;
  const words = text.split(/\s+/);
  const spaceWidth = size * 0.33;
  const lineHeight = size * 1.3;

  let lineW = 0;
  let maxWidth = 0;
  let lines = 1;

  for (let i = 0; i < words.length; i++) {
    const w = words[i].length * avgCharWidth;
    if (maxW && lineW > 0 && lineW + spaceWidth + w > maxW) {
      // wrap
      maxWidth = Math.max(maxWidth, lineW);
      lineW = w;
      lines++;
    } else {
      lineW = lineW + (lineW > 0 ? spaceWidth : 0) + w;
    }
  }
  maxWidth = Math.max(maxWidth, lineW);
  const width = Math.ceil(maxWidth);
  const height = Math.ceil(lines * lineHeight);
  const result = { w: width, h: height };
  textMeasureCache.set(key, result);
  return result;
};

export const measureLayers = (layers: LayerInput[]): MeasuredLayer[] => {
  return layers.map((layer) => {
    switch (layer.kind) {
      case 'text': {
        const text = layer.text ?? '';
        const maxW = layer.box?.maxW ?? layer.box?.w;
        const size = estimateTextSize(text, layer.font, layer.fontSize, maxW);
        return { ...layer, measured: { w: size.w, h: size.h } };
      }
      case 'image':
      case 'lottie':
      case 'doodle':
      case 'box':
      case 'annotation': {
        const w = layer.box?.w ?? layer.box?.maxW ?? 320;
        const h = layer.box?.h ?? layer.box?.maxH ?? 180;
        return { ...layer, measured: { w, h } };
      }
      case 'connector': {
        return { ...layer, measured: { w: 0, h: 0 } };
      }
      default: {
        const w = layer.box?.w ?? 200;
        const h = layer.box?.h ?? 100;
        return { ...layer, measured: { w, h } };
      }
    }
  });
};

export const shrinkTextOnce = (layer: MeasuredLayer, step: number): MeasuredLayer => {
  const nextFontSize = Math.floor((layer.fontSize ?? 32) * step);
  const text = layer.text ?? '';
  const maxW = layer.box?.maxW ?? layer.box?.w;
  const size = estimateTextSize(text, layer.font, nextFontSize, maxW);
  return { ...layer, fontSize: nextFontSize, measured: { w: size.w, h: size.h } };
};
