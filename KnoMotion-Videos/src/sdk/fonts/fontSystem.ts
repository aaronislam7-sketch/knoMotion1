import { loadFont as loadPermanentMarker } from '@remotion/google-fonts/PermanentMarker';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadCaveat } from '@remotion/google-fonts/Caveat';
import { loadFont as loadFigtree } from '@remotion/google-fonts/Figtree';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

type FontLoader = (options?: { document?: Document }) => Promise<void>;

const createLoader =
  (
    load:
      | typeof loadPermanentMarker
      | typeof loadKalam
      | typeof loadCaveat
      | typeof loadFigtree
      | typeof loadInter,
    weights: string[],
  ): FontLoader =>
  async (options) => {
    const { waitUntilDone } = load('normal', {
      weights: weights as any,
      subsets: ['latin'],
      document: options?.document,
    });
    await waitUntilDone();
  };

const FONT_LIBRARY: Record<string, FontLoader> = {
  'Permanent Marker': createLoader(loadPermanentMarker, ['400']),
  Kalam: createLoader(loadKalam, ['300', '400', '700']),
  Caveat: createLoader(loadCaveat, ['400', '500', '600', '700']),
  Figtree: createLoader(loadFigtree, ['400', '500', '600', '700']),
  Inter: createLoader(loadInter, ['400', '500', '600', '700']),
};

export type FontVoiceId = 'notebook' | 'story' | 'utility';

type FontVoice = {
  label: string;
  description: string;
  display: string;
  body: string;
  accent: string;
  utility: string;
};

export const FONT_VOICES: Record<FontVoiceId, FontVoice> = {
  notebook: {
    label: 'Notebook Sketch',
    description: 'Primary hand-drawn voice for question bursts and reveals.',
    display: 'Permanent Marker',
    body: 'Kalam',
    accent: 'Caveat',
    utility: 'Inter',
  },
  story: {
    label: 'Narrative Script',
    description: 'Loose handwritten flow for analogy, connect, and reflect scenes.',
    display: 'Caveat',
    body: 'Kalam',
    accent: 'Permanent Marker',
    utility: 'Inter',
  },
  utility: {
    label: 'Utility Sans',
    description: 'Clean but playful sans pair for data-heavy templates and UI chrome.',
    display: 'Figtree',
    body: 'Inter',
    accent: 'Caveat',
    utility: 'Inter',
  },
};

export const DEFAULT_FONT_VOICE: FontVoiceId = 'notebook';

export const loadFontVoice = async (
  voice: FontVoiceId = DEFAULT_FONT_VOICE,
  options?: { document?: Document },
) => {
  // Validate voice and use default if invalid
  const validVoice = FONT_VOICES[voice] ? voice : DEFAULT_FONT_VOICE;
  const palette = FONT_VOICES[validVoice];
  
  if (!palette) {
    console.error(`[fontSystem] Invalid voice "${voice}", using "${DEFAULT_FONT_VOICE}"`);
    return loadFontVoice(DEFAULT_FONT_VOICE, options);
  }

  const families = new Set([
    palette.display,
    palette.body,
    palette.accent,
    palette.utility,
  ]);

  await Promise.all(
    Array.from(families)
      .map((family) => {
        const loader = FONT_LIBRARY[family];
        if (!loader) {
          console.warn(`[fontSystem] Missing loader for font "${family}"`);
          return Promise.resolve();
        }
        return loader(options);
      })
      .filter(Boolean),
  );

  return palette;
};

export const buildFontTokens = (voice: FontVoiceId = DEFAULT_FONT_VOICE) => {
  // Validate voice and use default if invalid
  const validVoice = FONT_VOICES[voice] ? voice : DEFAULT_FONT_VOICE;
  const palette = FONT_VOICES[validVoice];

  if (!palette) {
    console.error(`[fontSystem] Invalid voice "${voice}", using "${DEFAULT_FONT_VOICE}"`);
    return buildFontTokens(DEFAULT_FONT_VOICE);
  }

  return {
    title: { family: palette.display },
    body: { family: palette.body },
    accent: { family: palette.accent },
    utility: { family: palette.utility },
  };
};
