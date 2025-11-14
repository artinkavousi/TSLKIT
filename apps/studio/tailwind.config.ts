import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b1220',
        accent: '#38bdf8'
      }
    }
  },
  plugins: []
};

export default config;
