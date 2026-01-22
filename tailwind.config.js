/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lexend': ['Lexend', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      colors: {
        'glass': {
          'light': 'rgba(255, 255, 255, 0.08)',
          'medium': 'rgba(255, 255, 255, 0.12)',
          'border': 'rgba(255, 255, 255, 0.15)',
        }
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-inset': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
