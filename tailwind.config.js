/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFDFB',
          100: '#FAF9F6',
          200: '#F5F3EE',
          300: '#EBE8E0',
        },
        ink: {
          50: '#e8ecf1',
          100: '#c5cdd9',
          200: '#9fadbf',
          300: '#788da5',
          400: '#5b7491',
          500: '#3e5b7e',
          600: '#365176',
          700: '#2c446b',
          800: '#233861',
          900: '#1a365d',
        },
        gold: {
          50: '#fdf8e9',
          100: '#f9ecc8',
          200: '#f5dfa3',
          300: '#f0d27e',
          400: '#ecc862',
          500: '#e8bd46',
          600: '#d4a93f',
          700: '#b8860b',
          800: '#9a7009',
          900: '#7d5a07',
        },
        charcoal: {
          50: '#f7f7f8',
          100: '#ecedef',
          200: '#d5d8dc',
          300: '#b0b5bd',
          400: '#858c99',
          500: '#68707e',
          600: '#535968',
          700: '#454a55',
          800: '#3c4049',
          900: '#2d3748',
        },
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body': ['Lora', 'Georgia', 'serif'],
        'ui': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(45, 55, 72, 0.08)',
        'soft-md': '0 4px 16px rgba(45, 55, 72, 0.1)',
        'soft-lg': '0 8px 32px rgba(45, 55, 72, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
