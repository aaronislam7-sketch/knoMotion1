/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // KnoMotion brand colors
      colors: {
        kno: {
          surface: '#FFF9F0',
          board: '#FFFFFF',
          ink: '#2C3E50',
          'ink-soft': '#5D6D7E',
          'ink-muted': '#95A5A6',
          primary: '#FF6B35',
          secondary: '#9B59B6',
          accent: {
            green: '#27AE60',
            blue: '#3498DB',
          },
          highlight: '#F39C12',
          rule: '#F0D9B5',
          doodle: '#F39C12',
        },
      },
      // KnoMotion font families
      fontFamily: {
        display: ['"Permanent Marker"', 'cursive'],
        header: ['"Cabin Sketch"', 'cursive'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        accent: ['"Caveat"', 'cursive'],
      },
      // Spacing
      spacing: {
        'safe': '4rem',
        'safe-x': '6rem',
        'safe-y': '5rem',
      },
      // Border radius
      borderRadius: {
        'card': '1.125rem',
        'soft': '1.5rem',
      },
      // Shadows
      boxShadow: {
        'card': '0 14px 30px rgba(0,0,0,0.08)',
        'soft': '0 8px 18px rgba(0,0,0,0.05)',
        'sketch': '6px 6px 0 rgba(0,0,0,0.12), 1px 1px 0 rgba(0,0,0,0.06)',
        'glow': '0 20px 60px rgba(255, 215, 0, 0.28)',
      },
      // Animations
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
    // Responsive breakpoints
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
};
