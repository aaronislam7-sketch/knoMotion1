/**
 * Knode Visual Theme
 * 
 * Aligned with the Knode Scene Vision:
 * - Hand-drawn clarity, not chaos
 * - Light canvas with purposeful color pops
 * - Flat, minimal, energetic
 * - 70% indie charm / 30% studio polish
 */

export const THEME = {
  // Typography - Marker fonts for emphasis, clean sans-serif for structure
  fonts: {
    marker: {
      primary: "'Permanent Marker', cursive",
      secondary: "'Cabin Sketch', cursive",
      handwritten: "'Patrick Hand', cursive"
    },
    structure: {
      primary: "'Inter', sans-serif",
      secondary: "'DM Sans', sans-serif",
      clean: "'Work Sans', sans-serif"
    }
  },

  // Colors - Light canvas with purposeful color pops
  colors: {
    // Canvas backgrounds
    canvas: {
      primary: '#FAFBFC',      // Light whiteboard white
      paper: '#F5F6F8',         // Subtle paper texture
      cream: '#FFF9F0'          // Warm canvas option
    },

    // Marker colors - energetic, BOLD, clear (enhanced for impact)
    markers: {
      black: '#1A1A1A',         // Main ink
      blue: '#2E7FE4',          // Primary emphasis
      red: '#E74C3C',           // Alert/hook
      green: '#27AE60',         // Success/apply
      purple: '#9B59B6',        // Reflect/thoughtful (BOLDER)
      orange: '#FF6B35',        // Warm accent (BOLDER)
      yellow: '#F39C12'         // Highlight
    },

    // Semantic colors
    text: {
      primary: '#1A1A1A',       // Main text
      secondary: '#4A5568',     // Supporting text
      muted: '#718096'          // De-emphasized
    },

    // Subtle accents
    accents: {
      lightBlue: '#E8F4FD',
      lightGreen: '#E8F8F2',
      lightRed: '#FEF0EF',
      lightPurple: '#F3EBFA',
      lightYellow: '#FEF9E6'
    }
  },

  // Hand-drawn aesthetic
  strokes: {
    thin: 2,
    medium: 3,
    thick: 5,
    bold: 8
  },

  // Minimal shadows - just enough depth
  shadows: {
    subtle: '0 1px 3px rgba(0,0,0,0.04)',
    soft: '0 2px 6px rgba(0,0,0,0.06)',
    card: '0 3px 12px rgba(0,0,0,0.08)'
  },

  // Motion feel - breathing, not jittery
  motion: {
    breathingSpeed: 0.04,     // Gentle micro-drift
    breathingAmount: 0.012,    // Subtle scale variation
    drawSpeed: 30,            // Frames for line drawing
    transitionSpeed: 20       // Smooth transitions
  },

  // Spacing - clean and airy
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 40,
    xl: 60,
    xxl: 80
  }
};