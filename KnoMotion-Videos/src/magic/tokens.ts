export type MagicTokens = {
  paper?: boolean;
  vignette?: boolean;
  breathe?: { targets?: string[]; scale?: [number, number] };
  parallaxDrift?: { targets?: string[]; ampPx?: number };
  highlightSwipe?: { targetId?: string };
  motifs?: string[]; // e.g., ['star.scribble']
  delightBudget?: number; // max animated delights active
};

export const defaultMagicTokens = (mode?: string): MagicTokens => ({
  paper: mode === 'notebook',
  vignette: true,
  motifs: [],
  delightBudget: 2,
});
