import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // App-aligned dark palette shared with the Flutter client.
        canvas: '#10171b',
        surface: '#202a2f',
        elevated: '#2c363b',
        brand: { DEFAULT: '#00e6a3', dark: '#00b982' },
        // metric accents
        recovery: '#30d158',
        sleep: '#7fa8c2',
        strain: '#009de5',
        warn: '#ffd60a',
        danger: '#ff453a',
      },
      borderRadius: { xl2: '1rem' },
    },
  },
  plugins: [],
};
export default config;
