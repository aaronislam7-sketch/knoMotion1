export const KNODE_THEME = {
  colors: {
    // Backgrounds
    pageBg: '#FFF9F0',         // warm off-white
    pageEdge: '#F3E2C8',       // subtle edge / margin
    cardBg: '#FFFFFF',         // card surface
    cardShadow: 'rgba(0,0,0,0.06)',

    // Brand accents (Duolingo-ish energy but your palette)
    primary: '#FF6B35',        // warm coral
    secondary: '#9B59B6',      // notebook purple
    accentGreen: '#27AE60',    // success / highlight
    accentBlue: '#3498DB',

    // Text
    textMain: '#2C3E50',
    textSoft: '#5D6D7E',
    textMuted: '#95A5A6',

    // Lines / doodles
    ruleLine: '#F0D9B5',       // faint notebook lines
    doodle: '#F39C12',         // scribbles, highlights
  },

  fonts: {
    // Load these in your Remotion root (Google Fonts)
    // Cabin Sketch = headers, Permanent Marker = emphasis
    header: '"Cabin Sketch", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    marker: '"Permanent Marker", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    body: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },

  spacing: {
    pagePadding: 72,
    cardPadding: 20,
    gapSm: 12,
    gapMd: 24,
    gapLg: 40,
    // Line spacing tokens for consistent text rendering
    lineSpacingTight: 1.2,    // Dense text blocks
    lineSpacingNormal: 1.5,   // Standard readability
    lineSpacingRelaxed: 1.8,  // Spacious, friendly
    lineSpacingLoose: 2.0,    // Maximum breathing room
  },

  radii: {
    card: 18,
    pill: 999,
  },

  shadows: {
    card: '0 14px 30px rgba(0,0,0,0.08)',
    soft: '0 8px 18px rgba(0,0,0,0.05)',
  },

  // Shared “token” variants for elements
  cardVariants: {
    notebook: {
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: 'rgba(0,0,0,0.14)',
    },
    emphasis: {
      borderStyle: 'solid',
      borderWidth: 2,
      borderColor: '#FF6B35',
    },
  },
};

export type KnodeTheme = typeof KNODE_THEME;