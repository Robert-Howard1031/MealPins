/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF6B35',
          50: '#FFF2ED',
          100: '#FFE3D7',
          200: '#FFC3AF',
          300: '#FFA386',
          400: '#FF835E',
          500: '#FF6B35',
          600: '#E25E2F',
          700: '#B64B26',
          800: '#8A381C',
          900: '#5F2613',
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
