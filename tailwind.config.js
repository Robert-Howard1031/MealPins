/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5E7D63',
          50: '#F2F6F3',
          100: '#E2EAE3',
          200: '#C5D5C7',
          300: '#A8C0AB',
          400: '#8BAB8F',
          500: '#5E7D63',
          600: '#516B55',
          700: '#425645',
          800: '#334134',
          900: '#243024',
        },
        ink: {
          DEFAULT: '#0F172A',
          600: '#475569',
          500: '#64748B',
          300: '#CBD5E1',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0B0F1A',
          muted: '#F5F7FA',
          darkMuted: '#141A2A',
        },
      },
    },
  },
};
