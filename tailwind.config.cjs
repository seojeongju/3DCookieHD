/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e5edff',
          200: '#cddbff',
          300: '#b4c4ff',
          400: '#8ca2ff',
          500: '#5b75f2',
          600: '#4f69f2',
          705: '#3f54d1', // brand-700 대용
          700: '#3f54d1',
          800: '#2e3ea8',
          900: '#1b2566',
        },
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#baddfd',
          300: '#7dbcfb',
          400: '#3a9bf7',
          500: '#5b9bd5',
          600: '#4a90e2',
          700: '#2d5fa3',
          800: '#1e4278',
          900: '#132d54',
        },
        industry: {
          dark: '#0f172a',
          glass: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
  plugins: [],
};
