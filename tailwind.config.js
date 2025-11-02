/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#fef7ed',
          100: '#fdedd3',
          200: '#fbd9a5',
          300: '#f8bf6d',
          400: '#f59e0b',
          500: '#d97706',
          600: '#92400e',
          700: '#5c1a00',
          800: '#2d0f00',
          900: '#1a0800',
          950: '#0f0400',
        },
        warm: {
          50: '#fefdf9',
          100: '#fef7ed',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
    },
  },
  plugins: [],
}

