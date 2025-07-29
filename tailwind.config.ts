// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  // 1. Tell Tailwind where to look for classes:
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // 2. Your custom font stacks:
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body:    ['Inter', 'sans-serif'],
      },

      // 3. Your full bay‑leaf palette:
      colors: {
        'bay-leaf': {
          50:  '#f3f7f2',
          100: '#e3ebe0',
          200: '#c6d8c2',
          300: '#8aad84',
          400: '#729a6d',
          500: '#517c4d',
          600: '#3c6239',
          700: '#2f4e2e',
          800: '#273f26',
          900: '#203420',
          950: '#111d11',
        },
      },
    },
  },

  // 4. No extra plugins right now:
  plugins: [],
};

export default config;
