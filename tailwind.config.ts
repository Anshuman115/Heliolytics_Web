import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // App-aligned dark palette (mirrors the Flutter design system)
        canvas: '#000000',
        surface: '#141414',
        elevated: '#1c1c1e',
        brand: { DEFAULT: '#0a84ff', dark: '#0060df' },
        // metric accents
        recovery: '#30d158',
        sleep: '#0a84ff',
        strain: '#64d2ff',
        warn: '#ffd60a',
        danger: '#ff453a',
      },
      borderRadius: { xl2: '1rem' },
    },
  },
  plugins: [],
};
export default config;
