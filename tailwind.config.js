import defaultTheme from 'tailwindcss/defaultTheme';

const colorVar = (name, fallback) =>
  `var(--kn-color-${name}, ${fallback})`;

const fontVar = (name, fallbackStack) =>
  `var(--kn-font-${name}, ${fallbackStack})`;

const sizeVar = (name, fallback) =>
  `var(--kn-font-size-${name}, ${fallback})`;

const spacingVar = (name, fallback) =>
  `var(--kn-space-${name}, ${fallback})`;

const radiusVar = (name, fallback) =>
  `var(--kn-radius-${name}, ${fallback})`;

const shadowVar = (name, fallback) =>
  `var(--kn-shadow-${name}, ${fallback})`;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './KnoMotion-Videos/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: colorVar('surface', '#FFF9F0'),
        board: colorVar('board', '#FFFFFF'),
        ink: colorVar('ink', '#1A1A1A'),
        accent: colorVar('accent', '#FF6B35'),
        accent2: colorVar('accent2', '#9B59B6'),
        highlight: colorVar('highlight', '#FFD700'),
        success: colorVar('success', '#2ECC71'),
        warning: colorVar('warning', '#F39C12'),
        danger: colorVar('danger', '#E74C3C'),
        muted: colorVar('muted', '#9CA3AF'),
      },
      fontFamily: {
        display: [
          fontVar('display', '"Permanent Marker", cursive'),
          ...defaultTheme.fontFamily.sans,
        ],
        body: [
          fontVar('body', '"Kalam", sans-serif'),
          ...defaultTheme.fontFamily.sans,
        ],
        accent: [
          fontVar('accent', '"Caveat", cursive'),
          ...defaultTheme.fontFamily.sans,
        ],
        utility: [
          fontVar('utility', '"Inter", sans-serif'),
          ...defaultTheme.fontFamily.sans,
        ],
      },
      fontSize: {
        hero: sizeVar('hero', '4.5rem'),
        display: sizeVar('display', '3.75rem'),
        title: sizeVar('title', '3rem'),
        headline: sizeVar('headline', '2.625rem'),
        body: sizeVar('body', '1.875rem'),
        sm: sizeVar('small', '1.5rem'),
        xs: sizeVar('tiny', '1.125rem'),
      },
      spacing: {
        safe: spacingVar('safe', '4rem'),
        'safe-x': spacingVar('safe-x', '4rem'),
        'safe-y': spacingVar('safe-y', '4rem'),
        gap: spacingVar('gap', '3rem'),
        'gap-lg': spacingVar('gap-lg', '4.5rem'),
        'gap-sm': spacingVar('gap-sm', '1.5rem'),
      },
      borderRadius: {
        card: radiusVar('card', '1rem'),
        soft: radiusVar('soft', '1.5rem'),
        pill: radiusVar('pill', '9999px'),
      },
      boxShadow: {
        soft: shadowVar('soft', '0 6px 24px rgba(0, 0, 0, 0.12)'),
        glow: shadowVar('glow', '0 10px 40px rgba(255, 215, 0, 0.25)'),
        sketch: shadowVar(
          'sketch',
          '6px 6px 0 rgba(0,0,0,0.12), 1px 1px 0 rgba(0,0,0,0.06)'
        ),
      },
      transitionTimingFunction: {
        smooth: 'var(--kn-ease-smooth, cubic-bezier(0.4, 0, 0.2, 1))',
        bounce: 'var(--kn-ease-bounce, cubic-bezier(0.68, -0.55, 0.265, 1.55))',
        elastic: 'var(--kn-ease-elastic, cubic-bezier(0.175, 0.885, 0.32, 1.275))',
      },
    },
  },
  plugins: [],
};
