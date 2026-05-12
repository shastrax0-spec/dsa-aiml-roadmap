export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0a0a0f', card: '#13131a', border: '#22222e' },
        accent: { DEFAULT: '#7c5cff', glow: '#a78bfa' },
        success: '#22c55e',
        warn: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { glow: '0 0 30px rgba(124,92,255,0.25)' },
    },
  },
  plugins: [],
};
