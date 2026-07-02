/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        river: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        sunset: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Segoe UI', 'Tahoma', 'system-ui', 'sans-serif'],
        heading: ['"Be Vietnam Pro"', 'Segoe UI', 'Tahoma', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
